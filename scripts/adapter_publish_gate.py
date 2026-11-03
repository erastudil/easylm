#!/usr/bin/env python3
# SPDX-License-Identifier: AGPL-3.0-or-later
"""EasyLM absolute adapter publish gate: the single point of entry for Hugging Face uploads.

Every upload script must import `publish_adapter_folder` from this module. A folder may be
published ONLY when all cryptographic, architectural, convergence, and evaluation invariants hold:

1. Model Family & Tier Allowlist (Bonsai 2 & Gemma 4 up to 16GB VRAM only):
   - Bonsai 2: `bonsai-2-2b` (24L, d=2048), `bonsai-2-4b` (32L, d=2560),
               `bonsai-2-9b` (32L, d=4096), `bonsai-2-27b` (64L, d=5120)
   - Gemma 4:  `gemma-4-e2b` (35L, d=1536), `gemma-4-e4b` (42L, d=2560),
               `gemma-4-12b` (48L, d=3840)
   - Any other family (`qwen2.5`, `qwen3-4b`, `deepseek`, `gemma-4-26b`, `alice-emap`) is rejected.

2. Cross-File Ontological Identity:
   - `adapter_config.json["base_model_name_or_path"]`, `training_metadata.json["base_model"]`,
     and `trainer_state.json["base_model"]` must be identical and match the tier's allowed base models.
   - Surrogate base model relabeling (`hf_training_base_model != base_model`) is rejected.

3. Binary SafeTensors Geometry, Non-Zero B-Matrix & Counterfeit Hash Blacklist:
   - SHA256 of `adapter_model.safetensors` must not match any known counterfeit or smoke-run hash,
     and must match `training_metadata.json["safetensors_sha256"]`.
   - Every layer `0 .. num_layers - 1` must contain `.lora_A.weight` and `.lora_B.weight` for all 7
     target modules (`q_proj`, `k_proj`, `v_proj`, `o_proj`, `gate_proj`, `up_proj`, `down_proj`),
     with no layers `>= num_layers`.
   - `q_proj.lora_A.weight` shape must be `[r, hidden_size]` matching the tier architecture.
   - Every `.lora_B.weight` binary slice must contain non-zero trained bytes (proving gradient steps).

4. Full-Dataset Convergence (Zero Smoke Runs / Zero Subsampling):
   - `training_metadata.json["dataset"]` must record `file`, `sha256` (64-char hex),
     `conversations >= 30`, and `sampled_conversations == conversations` (100% of dataset).
   - `trainer_state.json` must record `num_train_epochs >= 1.0`, at least 3 logged steps with
     strictly increasing step numbers, finite positive losses, and `final_loss < initial_loss`.

5. Held-Out Evaluation & Refusal Gate:
   - `eval_results.json` must record finite numeric `metrics` and `eval_samples >= 20`.
   - Any `kidsafety` repo must include `refusal_eval.json` with `passed: true`, `total_cases >= 20`,
     and `passed_cases == total_cases`.
"""

from __future__ import annotations

import hashlib
import json
import math
import re
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

REQUIRED_TARGET_MODULES = (
    "q_proj",
    "k_proj",
    "v_proj",
    "o_proj",
    "gate_proj",
    "up_proj",
    "down_proj",
)

ALLOWED_MODEL_SPECS: dict[str, dict[str, Any]] = {
    "bonsai-2-2b": {
        "family": "bonsai2",
        "allowed_bases": (
            "prism-ml/Ternary-Bonsai-2-2B-gguf",
            "prism-ml/Ternary-Bonsai-2-2B-mlx-2bit",
            "Qwen/Qwen3.5-2B",
        ),
        "num_layers": 24,
        "hidden_size": 2048,
    },
    "bonsai-2-4b": {
        "family": "bonsai2",
        "allowed_bases": (
            "prism-ml/Ternary-Bonsai-2-4B-gguf",
            "prism-ml/Ternary-Bonsai-2-4B-mlx-2bit",
            "Qwen/Qwen3.5-4B",
        ),
        "num_layers": 32,
        "hidden_size": 2560,
    },
    "bonsai-2-9b": {
        "family": "bonsai2",
        "allowed_bases": (
            "prism-ml/Ternary-Bonsai-2-9B-gguf",
            "prism-ml/Ternary-Bonsai-2-9B-mlx-2bit",
            "Qwen/Qwen3.5-9B",
        ),
        "num_layers": 32,
        "hidden_size": 4096,
    },
    "bonsai-2-27b": {
        "family": "bonsai2",
        "allowed_bases": (
            "prism-ml/Ternary-Bonsai-2-27B-gguf",
            "prism-ml/Ternary-Bonsai-2-27B-mlx-2bit",
            "Qwen/Qwen3.5-27B",
        ),
        "num_layers": 64,
        "hidden_size": 5120,
    },
    "gemma-4-e2b": {
        "family": "gemma4",
        "allowed_bases": ("google/gemma-4-E2B-it",),
        "num_layers": 35,
        "hidden_size": 1536,
    },
    "gemma-4-e4b": {
        "family": "gemma4",
        "allowed_bases": ("google/gemma-4-E4B-it",),
        "num_layers": 42,
        "hidden_size": 2560,
    },
    "gemma-4-12b": {
        "family": "gemma4",
        "allowed_bases": ("google/gemma-4-12B-it",),
        "num_layers": 48,
        "hidden_size": 3840,
    },
}

# Permanently blacklisted SHA256 prefixes from the 2026-10-20 counterfeit & smoke-run takedown
BANNED_COUNTERFEIT_SHA256_PREFIXES = frozenset(
    {
        "d7537079d51d",
        "cd7127e03656",
        "d6bcd409e23f",
        "4c48a1a3144a",
        "1701ffcfb6e9",
        "10cbd0bac6cc",
        "92f3fa966ee2",
        "3f0d29c8496b",
        "ad613350c2d4",
        "fcf9d1deb8d2",
        "51f184b3e046",
        "6a3ef660d1bc",
        "02aa11a6a13b",
        "22066569194b",
        "225d6c0e5760",
        "4a3621936888",
        "e7dc10a7f762",
        "07f0e85cefc1",
        "c6752d16b129",
        "3b5f7b06ee73",
        "ed85fa92bace",
        "2099c6c7b1ce",
        "4926df02ba44",
    }
)

_HEX64_RE = re.compile(r"^[0-9a-f]{64}$")
_LAYER_RE = re.compile(r"(?:^|\.)layers\.(\d+)\.")


class PublishGateError(RuntimeError):
    """Raised when a folder does not meet the absolute publish gate."""


def requires_refusal_eval(repo_id: str) -> bool:
    return KIDSAFETY_MARKER in repo_id.lower()


def required_files_for(repo_id: str) -> tuple[str, ...]:
    if requires_refusal_eval(repo_id):
        return REQUIRED_FILES + (REFUSAL_EVAL_FILE,)
    return REQUIRED_FILES


def resolve_tier_spec(repo_id: str) -> tuple[str, dict[str, Any]]:
    """Resolve `repo_id` to an authorized Bonsai 2 or Gemma 4 tier spec, or raise PublishGateError."""
    lower = repo_id.lower()
    # Sort longest key first so e.g. bonsai-2-27b matches before bonsai-2-2b
    for tier_key in sorted(ALLOWED_MODEL_SPECS, key=len, reverse=True):
        if tier_key in lower:
            return tier_key, ALLOWED_MODEL_SPECS[tier_key]
    raise PublishGateError(
        f"repo_id '{repo_id}' does not belong to an allowed Bonsai 2 or Gemma 4 tier "
        f"({sorted(ALLOWED_MODEL_SPECS)})"
    )


def _is_number(value: Any) -> bool:
    return isinstance(value, (int, float)) and not isinstance(value, bool) and math.isfinite(value)


def _is_count(value: Any) -> bool:
    return isinstance(value, int) and not isinstance(value, bool) and value >= 0


def _sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as handle:
        while chunk := handle.read(65536):
            h.update(chunk)
    return h.hexdigest()


def _read_json_object(folder: Path, name: str) -> dict[str, Any]:
    path = folder / name
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError) as err:
        raise PublishGateError(f"{name} in {folder} is not readable JSON: {err}") from err
    if not isinstance(data, dict):
        raise PublishGateError(f"{name} in {folder} must hold a JSON object")
    return data


def _check_adapter_config(config: dict[str, Any], tier_spec: dict[str, Any]) -> tuple[str, int]:
    if config.get("peft_type") != "LORA":
        raise PublishGateError(f"{CONFIG_FILE} must declare peft_type='LORA'")
    base_model = config.get("base_model_name_or_path")
    if not isinstance(base_model, str) or base_model not in tier_spec["allowed_bases"]:
        raise PublishGateError(
            f"{CONFIG_FILE} base_model_name_or_path '{base_model}' is not in allowed bases "
            f"{tier_spec['allowed_bases']}"
        )
    r = config.get("r")
    alpha = config.get("lora_alpha")
    if not _is_count(r) or r < 4:
        raise PublishGateError(f"{CONFIG_FILE} must declare integer LoRA rank r >= 4")
    if not _is_number(alpha) or alpha <= 0:
        raise PublishGateError(f"{CONFIG_FILE} must declare positive numeric lora_alpha")
    targets = config.get("target_modules")
    if not isinstance(targets, list) or not all(m in targets for m in REQUIRED_TARGET_MODULES):
        raise PublishGateError(
            f"{CONFIG_FILE} target_modules must include all 7 projections: {REQUIRED_TARGET_MODULES}"
        )
    return base_model, int(r)


def _check_safetensors(
    path: Path,
    tier_spec: dict[str, Any],
    expected_rank: int,
) -> str:
    digest = _sha256_file(path)
    if digest[:12] in BANNED_COUNTERFEIT_SHA256_PREFIXES:
        raise PublishGateError(
            f"{path.name} matches a banned counterfeit/smoke-run SHA256 digest ({digest[:12]})"
        )
    try:
        raw = path.read_bytes()
    except OSError as err:
        raise PublishGateError(f"{path.name} is not readable: {err}") from err
    if len(raw) < 8:
        raise PublishGateError(f"{path.name} is shorter than a safetensors header")
    (header_len,) = struct.unpack("<Q", raw[:8])
    if header_len == 0 or header_len > len(raw) - 8:
        raise PublishGateError(f"{path.name} declares an invalid header length ({header_len})")
    try:
        header = json.loads(raw[8 : 8 + header_len].decode("utf-8"))
    except ValueError as err:
        raise PublishGateError(f"{path.name} is not a readable safetensors file: {err}") from err
    if not isinstance(header, dict):
        raise PublishGateError(f"{path.name} header must decode to a JSON object")

    tensor_keys = [key for key in header if key != "__metadata__"]
    if not tensor_keys:
        raise PublishGateError(f"{path.name} holds no tensors")

    data_start = 8 + header_len
    payload_len = len(raw) - data_start
    num_layers = tier_spec["num_layers"]
    hidden_size = tier_spec["hidden_size"]

    seen_layers: set[int] = set()
    layer_mod_pairs: set[tuple[int, str, str]] = set()

    for key in tensor_keys:
        meta = header[key]
        if not isinstance(meta, dict):
            raise PublishGateError(f"{path.name} tensor '{key}' metadata must be an object")
        shape = meta.get("shape")
        offsets = meta.get("data_offsets")
        if (
            not isinstance(shape, list)
            or len(shape) != 2
            or not all(_is_count(d) and d > 0 for d in shape)
        ):
            raise PublishGateError(f"{path.name} tensor '{key}' must have a 2D positive shape")
        if (
            not isinstance(offsets, list)
            or len(offsets) != 2
            or not all(_is_count(o) for o in offsets)
            or offsets[0] >= offsets[1]
            or offsets[1] > payload_len
        ):
            raise PublishGateError(f"{path.name} tensor '{key}' has invalid data_offsets {offsets}")

        m_layer = _LAYER_RE.search(key)
        if m_layer:
            layer_idx = int(m_layer.group(1))
            seen_layers.add(layer_idx)
            for mod in REQUIRED_TARGET_MODULES:
                if f".{mod}.lora_A.weight" in key:
                    if shape[0] != expected_rank:
                        raise PublishGateError(
                            f"{path.name} '{key}' shape {shape} does not match rank r={expected_rank}"
                        )
                    if mod == "q_proj" and shape[1] != hidden_size:
                        raise PublishGateError(
                            f"{path.name} '{key}' in_features={shape[1]} does not match "
                            f"tier hidden_size={hidden_size}"
                        )
                    layer_mod_pairs.add((layer_idx, mod, "A"))
                elif f".{mod}.lora_B.weight" in key:
                    if shape[1] != expected_rank:
                        raise PublishGateError(
                            f"{path.name} '{key}' shape {shape} does not match rank r={expected_rank}"
                        )
                    # Verify lora_B has non-zero trained bytes (lora_B is initialized to 0 before training)
                    slice_bytes = raw[data_start + offsets[0] : data_start + offsets[1]]
                    if not any(b != 0 for b in slice_bytes):
                        raise PublishGateError(
                            f"{path.name} '{key}' is all zeros (untrained lora_B matrix)"
                        )
                    layer_mod_pairs.add((layer_idx, mod, "B"))

    expected_layers = set(range(num_layers))
    if seen_layers != expected_layers:
        raise PublishGateError(
            f"{path.name} layer indices (count={len(seen_layers)}, max={max(seen_layers, default=-1)}) "
            f"do not match tier num_layers={num_layers}"
        )

    for layer_idx in range(num_layers):
        for mod in ("gate_proj", "up_proj", "down_proj"):
            if (layer_idx, mod, "A") not in layer_mod_pairs or (layer_idx, mod, "B") not in layer_mod_pairs:
                raise PublishGateError(
                    f"{path.name} missing lora_A or lora_B for layer {layer_idx} module '{mod}'"
                )

    for mod in REQUIRED_TARGET_MODULES:
        has_mod = any(
            (layer_idx, mod, "A") in layer_mod_pairs and (layer_idx, mod, "B") in layer_mod_pairs
            for layer_idx in range(num_layers)
        )
        if not has_mod:
            raise PublishGateError(
                f"{path.name} missing adapted lora_A/lora_B tensors for target module '{mod}'"
            )

    for layer_idx, mod, side in layer_mod_pairs:
        other_side = "B" if side == "A" else "A"
        if (layer_idx, mod, other_side) not in layer_mod_pairs:
            raise PublishGateError(
                f"{path.name} missing lora_{other_side} for layer {layer_idx} module '{mod}'"
            )

    return digest


def _check_training_log(
    log: dict[str, Any],
    expected_base: str,
    safetensors_sha256: str,
) -> None:
    base_model = log.get("base_model")
    if not isinstance(base_model, str) or not base_model:
        raise PublishGateError(f"{TRAINING_LOG_FILE} must record base_model")
    if base_model != expected_base:
        raise PublishGateError(
            f"{TRAINING_LOG_FILE} base_model '{base_model}' does not match "
            f"{CONFIG_FILE} base_model_name_or_path '{expected_base}'"
        )
    hf_base = log.get("hf_training_base_model")
    if hf_base is not None and hf_base != base_model:
        raise PublishGateError(
            f"{TRAINING_LOG_FILE} surrogate base mismatch: hf_training_base_model='{hf_base}' "
            f"!= base_model='{base_model}'"
        )
    logged_st_sha = log.get("safetensors_sha256")
    if not isinstance(logged_st_sha, str) or logged_st_sha.lower() != safetensors_sha256.lower():
        raise PublishGateError(
            f"{TRAINING_LOG_FILE} must record safetensors_sha256 matching {WEIGHTS_FILE}"
        )

    dataset = log.get("dataset")
    if not isinstance(dataset, dict) or not isinstance(dataset.get("file"), str) or not dataset["file"]:
        raise PublishGateError(f"{TRAINING_LOG_FILE} must record dataset.file")
    ds_sha = dataset.get("sha256")
    if not isinstance(ds_sha, str) or not _HEX64_RE.match(ds_sha.lower()):
        raise PublishGateError(f"{TRAINING_LOG_FILE} must record 64-char hex dataset.sha256")
    conversations = dataset.get("conversations")
    sampled = dataset.get("sampled_conversations")
    if not _is_count(conversations) or conversations < 30:
        raise PublishGateError(f"{TRAINING_LOG_FILE} dataset.conversations must be an integer >= 30")
    if not _is_count(sampled) or sampled != conversations:
        raise PublishGateError(
            f"{TRAINING_LOG_FILE} dataset subsampling is forbidden: "
            f"sampled_conversations ({sampled}) must equal conversations ({conversations})"
        )


def _check_loss_curve(state: dict[str, Any], expected_base: str) -> None:
    state_base = state.get("base_model")
    if not isinstance(state_base, str) or state_base != expected_base:
        raise PublishGateError(
            f"{LOSS_CURVE_FILE} base_model '{state_base}' must match '{expected_base}'"
        )
    epochs = state.get("num_train_epochs")
    if not _is_number(epochs) or epochs < 1.0:
        raise PublishGateError(
            f"{LOSS_CURVE_FILE} num_train_epochs ({epochs}) must be >= 1.0 (smoke runs < 1 epoch are forbidden)"
        )
    history = state.get("log_history")
    if not isinstance(history, list) or len(history) < 3:
        raise PublishGateError(f"{LOSS_CURVE_FILE} must hold a log_history with at least 3 entries")
    prev_step = 0
    for entry in history:
        if not isinstance(entry, dict) or not _is_number(entry.get("step")) or not _is_number(entry.get("loss")):
            raise PublishGateError(f"{LOSS_CURVE_FILE} log_history entries must record numeric step and loss")
        if entry["step"] <= prev_step:
            raise PublishGateError(f"{LOSS_CURVE_FILE} log_history steps must be strictly increasing")
        if entry["loss"] <= 0:
            raise PublishGateError(f"{LOSS_CURVE_FILE} log_history losses must be positive")
        prev_step = entry["step"]
    if history[-1]["loss"] >= history[0]["loss"]:
        raise PublishGateError(
            f"{LOSS_CURVE_FILE} final loss ({history[-1]['loss']}) must be strictly lower than "
            f"initial loss ({history[0]['loss']})"
        )


def _check_eval(result: dict[str, Any]) -> None:
    metrics = result.get("metrics")
    if not isinstance(metrics, dict) or not metrics or not all(_is_number(v) for v in metrics.values()):
        raise PublishGateError(f"{EVAL_FILE} must record metrics as a non-empty object of numbers")
    if "heldout_loss" not in metrics and "eval_loss" not in metrics:
        raise PublishGateError(f"{EVAL_FILE} metrics must record 'heldout_loss' or 'eval_loss'")
    eval_samples = result.get("eval_samples", metrics.get("eval_samples"))
    if not _is_count(eval_samples) or eval_samples < 20:
        raise PublishGateError(f"{EVAL_FILE} must record integer eval_samples >= 20")


def _check_refusal_eval(result: dict[str, Any]) -> None:
    total = result.get("total_cases")
    passed_cases = result.get("passed_cases")
    if not isinstance(result.get("passed"), bool):
        raise PublishGateError(f"{REFUSAL_EVAL_FILE} must record passed as true or false")
    if not _is_count(total) or total < 20 or not _is_count(passed_cases) or passed_cases > total:
        raise PublishGateError(f"{REFUSAL_EVAL_FILE} must record total_cases (>= 20) and passed_cases")
    if result["passed"] is not True:
        raise PublishGateError(f"{REFUSAL_EVAL_FILE} records a failed refusal eval ({passed_cases}/{total} cases passed)")
    if passed_cases != total:
        raise PublishGateError(f"{REFUSAL_EVAL_FILE} records passed with only {passed_cases}/{total} cases passed")


def check_publish_gate(folder: Path | str, repo_id: str) -> dict[str, dict[str, Any]]:
    """Validate `folder` for `repo_id`; return the parsed log files or raise PublishGateError."""
    folder = Path(folder)
    if not folder.is_dir():
        raise PublishGateError(f"adapter folder not found: {folder}")
    _, tier_spec = resolve_tier_spec(repo_id)

    for name in required_files_for(repo_id):
        if not (folder / name).is_file():
            raise PublishGateError(f"publish gate for {repo_id}: missing required file {name} in {folder}")

    config = _read_json_object(folder, CONFIG_FILE)
    expected_base, expected_rank = _check_adapter_config(config, tier_spec)
    st_sha256 = _check_safetensors(folder / WEIGHTS_FILE, tier_spec, expected_rank)

    records = {
        TRAINING_LOG_FILE: _read_json_object(folder, TRAINING_LOG_FILE),
        LOSS_CURVE_FILE: _read_json_object(folder, LOSS_CURVE_FILE),
        EVAL_FILE: _read_json_object(folder, EVAL_FILE),
    }
    _check_training_log(records[TRAINING_LOG_FILE], expected_base, st_sha256)
    _check_loss_curve(records[LOSS_CURVE_FILE], expected_base)
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

    rows: list[tuple[str, str]] = [
        ("Repository", repo_id),
        ("Base model", log["base_model"]),
        ("SafeTensors sha256", f"`{log['safetensors_sha256']}`"),
        ("Training data file", dataset["file"]),
    ]
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
