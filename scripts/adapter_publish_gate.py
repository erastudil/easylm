#!/usr/bin/env python3
# SPDX-License-Identifier: AGPL-3.0-or-later
"""EasyLM adapter publish gate: the one home for "may this adapter go to Hugging Face".

Every upload script imports `publish_adapter_folder` from this module. It publishes a
folder only when the folder holds the evidence of a real run next to the adapter:

    adapter_model.safetensors   trained weights (valid safetensors header, at least one tensor)
    adapter_config.json         PEFT adapter configuration (JSON object)
    training_metadata.json      training log: base_model, dataset.file, and the run's
                                recorded settings (written by scripts/train_bonsai2_modal.py)
    trainer_state.json          loss curve: log_history entries with numeric step and loss
    eval_results.json           eval result: {"metrics": {name: number, ...}}

A repo id containing `kidsafety` also requires `refusal_eval.json`:

    {"passed": true, "total_cases": N, "passed_cases": N}

and the gate refuses unless `passed` is true and every recorded case passed.

The model card is built by `build_model_card` from those files alone. It lists a dataset,
step count, epoch count, or metric only when a file records it, and writes its own
README.md over any card already in the folder.

Standard library only, so the check runs in CI and inside Modal containers.
"""

from __future__ import annotations

import json
import math
import struct
from pathlib import Path
from typing import Any

WEIGHTS_FILE = "adapter_model.safetensors"
CONFIG_FILE = "adapter_config.json"
TRAINING_LOG_FILE = "training_metadata.json"
LOSS_CURVE_FILE = "trainer_state.json"
EVAL_FILE = "eval_results.json"
REFUSAL_EVAL_FILE = "refusal_eval.json"
CARD_FILE = "README.md"

REQUIRED_FILES = (WEIGHTS_FILE, CONFIG_FILE, TRAINING_LOG_FILE, LOSS_CURVE_FILE, EVAL_FILE)
KIDSAFETY_MARKER = "kidsafety"


class PublishGateError(RuntimeError):
    """Raised when a folder does not meet the publish gate."""


def requires_refusal_eval(repo_id: str) -> bool:
    return KIDSAFETY_MARKER in repo_id.lower()


def required_files_for(repo_id: str) -> tuple[str, ...]:
    if requires_refusal_eval(repo_id):
        return REQUIRED_FILES + (REFUSAL_EVAL_FILE,)
    return REQUIRED_FILES


def _is_number(value: Any) -> bool:
    return isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value)


def _is_count(value: Any) -> bool:
    return isinstance(value, int) and not isinstance(value, bool) and value >= 0


def _read_json_object(folder: Path, name: str) -> dict[str, Any]:
    path = folder / name
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError) as err:
        raise PublishGateError(f"{name} in {folder} is not readable JSON: {err}") from err
    if not isinstance(data, dict):
        raise PublishGateError(f"{name} in {folder} must hold a JSON object")
    return data


def _check_safetensors(path: Path) -> None:
    try:
        with open(path, "rb") as handle:
            prefix = handle.read(8)
            if len(prefix) != 8:
                raise PublishGateError(f"{path.name} is shorter than a safetensors header")
            (header_len,) = struct.unpack("<Q", prefix)
            if header_len == 0 or header_len > path.stat().st_size - 8:
                raise PublishGateError(f"{path.name} declares an invalid header length ({header_len})")
            header = json.loads(handle.read(header_len).decode("utf-8"))
    except (OSError, ValueError) as err:
        raise PublishGateError(f"{path.name} is not a readable safetensors file: {err}") from err
    tensors = [key for key in header if key != "__metadata__"] if isinstance(header, dict) else []
    if not tensors:
        raise PublishGateError(f"{path.name} holds no tensors")


def _check_training_log(log: dict[str, Any]) -> None:
    if not isinstance(log.get("base_model"), str) or not log["base_model"]:
        raise PublishGateError(f"{TRAINING_LOG_FILE} must record base_model")
    dataset = log.get("dataset")
    if not isinstance(dataset, dict) or not isinstance(dataset.get("file"), str) or not dataset["file"]:
        raise PublishGateError(f"{TRAINING_LOG_FILE} must record dataset.file")


def _check_loss_curve(state: dict[str, Any]) -> None:
    history = state.get("log_history")
    if not isinstance(history, list) or not history:
        raise PublishGateError(f"{LOSS_CURVE_FILE} must hold a non-empty log_history")
    for entry in history:
        if not isinstance(entry, dict) or not _is_number(entry.get("step")) or not _is_number(entry.get("loss")):
            raise PublishGateError(f"{LOSS_CURVE_FILE} log_history entries must record numeric step and loss")


def _check_eval(result: dict[str, Any]) -> None:
    metrics = result.get("metrics")
    if not isinstance(metrics, dict) or not metrics or not all(_is_number(v) for v in metrics.values()):
        raise PublishGateError(f"{EVAL_FILE} must record metrics as a non-empty object of numbers")


def _check_refusal_eval(result: dict[str, Any]) -> None:
    total = result.get("total_cases")
    passed_cases = result.get("passed_cases")
    if not isinstance(result.get("passed"), bool):
        raise PublishGateError(f"{REFUSAL_EVAL_FILE} must record passed as true or false")
    if not _is_count(total) or total == 0 or not _is_count(passed_cases) or passed_cases > total:
        raise PublishGateError(f"{REFUSAL_EVAL_FILE} must record total_cases (above zero) and passed_cases")
    if result["passed"] is not True:
        raise PublishGateError(f"{REFUSAL_EVAL_FILE} records a failed refusal eval ({passed_cases}/{total} cases passed)")
    if passed_cases != total:
        raise PublishGateError(f"{REFUSAL_EVAL_FILE} records passed with only {passed_cases}/{total} cases passed")


def check_publish_gate(folder: Path | str, repo_id: str) -> dict[str, dict[str, Any]]:
    """Validate `folder` for `repo_id`; return the parsed log files or raise PublishGateError."""
    folder = Path(folder)
    if not folder.is_dir():
        raise PublishGateError(f"adapter folder not found: {folder}")
    for name in required_files_for(repo_id):
        if not (folder / name).is_file():
            raise PublishGateError(f"publish gate for {repo_id}: missing required file {name} in {folder}")

    _check_safetensors(folder / WEIGHTS_FILE)
    _read_json_object(folder, CONFIG_FILE)
    records = {
        TRAINING_LOG_FILE: _read_json_object(folder, TRAINING_LOG_FILE),
        LOSS_CURVE_FILE: _read_json_object(folder, LOSS_CURVE_FILE),
        EVAL_FILE: _read_json_object(folder, EVAL_FILE),
    }
    _check_training_log(records[TRAINING_LOG_FILE])
    _check_loss_curve(records[LOSS_CURVE_FILE])
    _check_eval(records[EVAL_FILE])
    if requires_refusal_eval(repo_id):
        records[REFUSAL_EVAL_FILE] = _read_json_object(folder, REFUSAL_EVAL_FILE)
        _check_refusal_eval(records[REFUSAL_EVAL_FILE])
    return records


def build_model_card(folder: Path | str, repo_id: str) -> str:
    """Build the model card from the gate files only; raises PublishGateError when they fail the gate."""
    folder = Path(folder)
    records = check_publish_gate(folder, repo_id)
    log = records[TRAINING_LOG_FILE]
    state = records[LOSS_CURVE_FILE]
    evaluation = records[EVAL_FILE]
    config = _read_json_object(folder, CONFIG_FILE)

    dataset = log["dataset"]
    history = state["log_history"]
    steps = state.get("global_step") if _is_count(state.get("global_step")) else history[-1]["step"]
    losses = [entry["loss"] for entry in history]

    rows: list[tuple[str, str]] = [("Repository", repo_id), ("Base model", log["base_model"])]
    if isinstance(log.get("hf_training_base_model"), str):
        rows.append(("Training base model", log["hf_training_base_model"]))
    if isinstance(log.get("mlc_webgpu_model"), str):
        rows.append(("WebGPU base model", log["mlc_webgpu_model"]))
    rows.append(("Training data file", dataset["file"]))
    if isinstance(dataset.get("corpus_repo"), str):
        rows.append(("Corpus repository", dataset["corpus_repo"]))
    if _is_count(dataset.get("sampled_conversations")):
        rows.append(("Conversations trained on", f"{dataset['sampled_conversations']:,}"))
    if _is_count(dataset.get("conversations")):
        rows.append(("Conversations in data file", f"{dataset['conversations']:,}"))
    if isinstance(dataset.get("sha256"), str):
        rows.append(("Data file sha256", f"`{dataset['sha256']}`"))
    rows.append(("Training steps", f"{steps:g}"))
    if _is_number(state.get("num_train_epochs")):
        rows.append(("Epochs", f"{state['num_train_epochs']:g}"))
    for key, label in (("r", "LoRA rank"), ("lora_alpha", "LoRA alpha"), ("lora_dropout", "LoRA dropout")):
        if _is_number(config.get(key)):
            rows.append((label, f"{config[key]:g}"))
    rows.append(("Loss, first logged step", f"{losses[0]:.4f}"))
    rows.append(("Loss, last logged step", f"{losses[-1]:.4f}"))

    front = ["---", "library_name: peft", "pipeline_tag: text-generation", "tags:", "- lora", "- peft", "- easylm"]
    if isinstance(log.get("base_model"), str):
        front.insert(1, f"base_model: {log['base_model']}")
    front.append("license: agpl-3.0")
    if isinstance(dataset.get("corpus_repo"), str):
        front += ["datasets:", f"- {dataset['corpus_repo']}"]
    front.append("---")

    lines = front + ["", f"# {repo_id.split('/')[-1]}", "", "This card is generated from the run's own log files.", ""]
    lines += ["## Training run", "", "| Property | Value |", "|---|---|"]
    lines += [f"| {label} | {value} |" for label, value in rows]
    lines += ["", f"## Evaluation (`{EVAL_FILE}`)", "", "| Metric | Value |", "|---|---:|"]
    lines += [f"| {name} | {value:g} |" for name, value in sorted(evaluation["metrics"].items())]
    if requires_refusal_eval(repo_id):
        refusal = records[REFUSAL_EVAL_FILE]
        lines += [
            "",
            f"## Refusal evaluation (`{REFUSAL_EVAL_FILE}`)",
            "",
            f"Passed {refusal['passed_cases']} of {refusal['total_cases']} recorded cases.",
        ]
    lines += ["", f"## Loss curve (`{LOSS_CURVE_FILE}`)", "", "| Step | Loss |", "|---:|---:|"]
    lines += [f"| {entry['step']:g} | {entry['loss']:.4f} |" for entry in history]
    return "\n".join(lines) + "\n"


def publish_adapter_folder(
    api: Any,
    folder: Path | str,
    repo_id: str,
    commit_message: str,
    private: bool = False,
) -> None:
    """The one upload path: gate, write the generated card, create the repo, upload the folder.

    `api` is a `huggingface_hub.HfApi`. Nothing reaches the Hub unless the gate passes.
    """
    folder = Path(folder)
    card = build_model_card(folder, repo_id)
    (folder / CARD_FILE).write_text(card, encoding="utf-8")
    api.create_repo(repo_id=repo_id, repo_type="model", private=private, exist_ok=True)
    api.upload_folder(
        folder_path=str(folder),
        repo_id=repo_id,
        repo_type="model",
        commit_message=commit_message,
        ignore_patterns=["checkpoints*", "*.tmp", "*.log"],
    )
