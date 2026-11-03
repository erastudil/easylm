# SPDX-License-Identifier: AGPL-3.0-or-later
"""Real-file tests for the absolute scripts/adapter_publish_gate.py. Run by scripts/verify.mjs."""

from __future__ import annotations

import hashlib
import json
import re
import shutil
import struct
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SCRIPTS = ROOT / "scripts"
sys.path.insert(0, str(SCRIPTS))

import adapter_publish_gate as gate  # noqa: E402

TEXT_REPO = "Bluebarrels/easylm-hands-bonsai-2-2b"
KID_REPO = "Bluebarrels/easylm-kidsafety-bonsai-2-9b"
GEMMA_REPO = "Bluebarrels/easylm-gemma-4-e2b-it"


def write_safetensors(
    path: Path,
    num_layers: int = 24,
    hidden_size: int = 2048,
    rank: int = 16,
    zero_lora_b: bool = False,
) -> str:
    """Write a structurally valid SafeTensors file for `num_layers` and `hidden_size`, returning its sha256."""
    # Pack one small non-zero float16 slice shared across tensors for fast test I/O,
    # while declaring exact [r, hidden_size] / [hidden_size, r] shapes within valid offsets.
    elem_count = rank * hidden_size
    byte_len = elem_count * 2
    if zero_lora_b:
        payload_a = b"\x01\x3c" * elem_count
        payload_b = b"\x00\x00" * elem_count
        payload = payload_a + payload_b
        offsets_a = [0, byte_len]
        offsets_b = [byte_len, byte_len * 2]
    else:
        payload = b"\x01\x3c" * elem_count
        offsets_a = [0, byte_len]
        offsets_b = [0, byte_len]

    tensors: dict[str, dict[str, object]] = {}
    for layer_idx in range(num_layers):
        for mod in gate.REQUIRED_TARGET_MODULES:
            prefix = f"base_model.model.model.layers.{layer_idx}.self_attn.{mod}"
            tensors[f"{prefix}.lora_A.weight"] = {
                "dtype": "F16",
                "shape": [rank, hidden_size],
                "data_offsets": offsets_a,
            }
            tensors[f"{prefix}.lora_B.weight"] = {
                "dtype": "F16",
                "shape": [hidden_size, rank],
                "data_offsets": offsets_b,
            }

    header_bytes = json.dumps(tensors).encode("utf-8")
    raw = struct.pack("<Q", len(header_bytes)) + header_bytes + payload
    path.write_bytes(raw)
    return hashlib.sha256(raw).hexdigest()


def write_json(path: Path, data: object) -> None:
    path.write_text(json.dumps(data), encoding="utf-8")


def make_run_dir(
    folder: Path,
    repo_id: str = TEXT_REPO,
    kidsafety_pass: bool | None = None,
    corpus_repo: str | None = None,
) -> Path:
    folder.mkdir(parents=True, exist_ok=True)
    _, tier_spec = gate.resolve_tier_spec(repo_id)
    base_model = tier_spec["allowed_bases"][0]
    st_sha = write_safetensors(
        folder / gate.WEIGHTS_FILE,
        num_layers=tier_spec["num_layers"],
        hidden_size=tier_spec["hidden_size"],
        rank=16,
    )
    write_json(
        folder / gate.CONFIG_FILE,
        {
            "peft_type": "LORA",
            "base_model_name_or_path": base_model,
            "r": 16,
            "lora_alpha": 32,
            "lora_dropout": 0.05,
            "target_modules": list(gate.REQUIRED_TARGET_MODULES),
        },
    )
    dataset: dict[str, object] = {
        "file": "adapter_hands_chatml.jsonl",
        "conversations": 900,
        "sampled_conversations": 900,
        "sha256": "a" * 64,
    }
    if corpus_repo:
        dataset["corpus_repo"] = corpus_repo
    write_json(
        folder / gate.TRAINING_LOG_FILE,
        {
            "base_model": base_model,
            "safetensors_sha256": st_sha,
            "dataset": dataset,
        },
    )
    write_json(
        folder / gate.LOSS_CURVE_FILE,
        {
            "base_model": base_model,
            "global_step": 180,
            "num_train_epochs": 3.0,
            "log_history": [
                {"step": 60, "loss": 2.5},
                {"step": 120, "loss": 1.75},
                {"step": 180, "loss": 1.25},
            ],
        },
    )
    write_json(
        folder / gate.EVAL_FILE,
        {"eval_samples": 50, "metrics": {"heldout_loss": 1.35}},
    )
    if kidsafety_pass is not None:
        write_json(
            folder / gate.REFUSAL_EVAL_FILE,
            {"passed": kidsafety_pass, "total_cases": 25, "passed_cases": 25 if kidsafety_pass else 19},
        )
    return folder


class PublishGateTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = Path(tempfile.mkdtemp(prefix="easylm-gate-"))
        self.addCleanup(shutil.rmtree, self.tmp, ignore_errors=True)

    def test_complete_bonsai2_and_gemma4_folders_pass(self) -> None:
        for repo_id in (TEXT_REPO, GEMMA_REPO):
            with self.subTest(repo=repo_id):
                folder = make_run_dir(self.tmp / repo_id.split("/")[-1], repo_id=repo_id)
                records = gate.check_publish_gate(folder, repo_id)
                self.assertEqual(set(records), {gate.TRAINING_LOG_FILE, gate.LOSS_CURVE_FILE, gate.EVAL_FILE})

    def test_disallowed_model_families_fail(self) -> None:
        disallowed = (
            "Bluebarrels/easylm-hands-qwen2.5-0.5b",
            "Bluebarrels/easylm-hands-qwen2.5-3b",
            "Bluebarrels/easylm-qwen3-4b-instruct",
            "Bluebarrels/easylm-deepseek-v4-distill-9b",
            "Bluebarrels/easylm-gemma-4-26b-a4b-it",
            "Bluebarrels/alice-emap-adapter",
        )
        folder = make_run_dir(self.tmp / "valid-bonsai")
        for repo_id in disallowed:
            with self.subTest(repo=repo_id):
                with self.assertRaises(gate.PublishGateError):
                    gate.check_publish_gate(folder, repo_id)

    def test_cross_file_base_model_or_surrogate_mismatch_fails(self) -> None:
        folder = make_run_dir(self.tmp / "surrogate")
        log = json.loads((folder / gate.TRAINING_LOG_FILE).read_text(encoding="utf-8"))
        log["hf_training_base_model"] = "Qwen/Qwen3.5-2B"
        write_json(folder / gate.TRAINING_LOG_FILE, log)
        with self.assertRaises(gate.PublishGateError) as ctx:
            gate.check_publish_gate(folder, TEXT_REPO)
        self.assertIn("surrogate base mismatch", str(ctx.exception))

    def test_wrong_layer_count_or_hidden_size_fails(self) -> None:
        # 24-layer 2B weights submitted to a 32-layer 9B repo must fail
        folder = make_run_dir(self.tmp / "wrong-arch", repo_id=TEXT_REPO)
        with self.assertRaises(gate.PublishGateError):
            gate.check_publish_gate(folder, "Bluebarrels/easylm-hands-bonsai-2-9b")

    def test_all_zero_lora_b_fails(self) -> None:
        folder = make_run_dir(self.tmp / "zero-b", repo_id=TEXT_REPO)
        st_sha = write_safetensors(folder / gate.WEIGHTS_FILE, num_layers=24, hidden_size=2048, zero_lora_b=True)
        log = json.loads((folder / gate.TRAINING_LOG_FILE).read_text(encoding="utf-8"))
        log["safetensors_sha256"] = st_sha
        write_json(folder / gate.TRAINING_LOG_FILE, log)
        with self.assertRaises(gate.PublishGateError) as ctx:
            gate.check_publish_gate(folder, TEXT_REPO)
        self.assertIn("untrained lora_B", str(ctx.exception))

    def test_subsampled_dataset_or_fractional_epoch_smoke_run_fails(self) -> None:
        folder = make_run_dir(self.tmp / "subsampled")
        log = json.loads((folder / gate.TRAINING_LOG_FILE).read_text(encoding="utf-8"))
        log["dataset"]["sampled_conversations"] = 200
        write_json(folder / gate.TRAINING_LOG_FILE, log)
        with self.assertRaises(gate.PublishGateError) as ctx:
            gate.check_publish_gate(folder, TEXT_REPO)
        self.assertIn("subsampling is forbidden", str(ctx.exception))

        folder2 = make_run_dir(self.tmp / "smoke-epoch")
        state = json.loads((folder2 / gate.LOSS_CURVE_FILE).read_text(encoding="utf-8"))
        state["num_train_epochs"] = 0.5
        write_json(folder2 / gate.LOSS_CURVE_FILE, state)
        with self.assertRaises(gate.PublishGateError) as ctx2:
            gate.check_publish_gate(folder2, TEXT_REPO)
        self.assertIn("smoke runs < 1 epoch are forbidden", str(ctx2.exception))

    def test_each_missing_required_file_fails_and_is_named(self) -> None:
        for name in gate.REQUIRED_FILES:
            with self.subTest(missing=name):
                folder = make_run_dir(self.tmp / f"missing-{name}")
                (folder / name).unlink()
                with self.assertRaises(gate.PublishGateError) as ctx:
                    gate.check_publish_gate(folder, TEXT_REPO)
                self.assertIn(name, str(ctx.exception))

    def test_missing_folder_fails(self) -> None:
        with self.assertRaises(gate.PublishGateError):
            gate.check_publish_gate(self.tmp / "absent", TEXT_REPO)

    def test_empty_or_invalid_evidence_fails(self) -> None:
        cases = {
            gate.WEIGHTS_FILE: b"not a safetensors file",
            gate.LOSS_CURVE_FILE: json.dumps({"log_history": []}).encode(),
            gate.EVAL_FILE: json.dumps({"metrics": {}}).encode(),
            gate.TRAINING_LOG_FILE: json.dumps({"base_model": "x"}).encode(),
        }
        for name, content in cases.items():
            with self.subTest(invalid=name):
                folder = make_run_dir(self.tmp / f"invalid-{name}")
                (folder / name).write_bytes(content)
                with self.assertRaises(gate.PublishGateError) as ctx:
                    gate.check_publish_gate(folder, TEXT_REPO)
                self.assertIn(name, str(ctx.exception))

    def test_kidsafety_without_refusal_eval_fails(self) -> None:
        folder = make_run_dir(self.tmp / "kid-none", repo_id=KID_REPO)
        with self.assertRaises(gate.PublishGateError) as ctx:
            gate.check_publish_gate(folder, KID_REPO)
        self.assertIn(gate.REFUSAL_EVAL_FILE, str(ctx.exception))

    def test_kidsafety_with_recorded_fail_fails(self) -> None:
        folder = make_run_dir(self.tmp / "kid-fail", repo_id=KID_REPO, kidsafety_pass=False)
        with self.assertRaises(gate.PublishGateError) as ctx:
            gate.check_publish_gate(folder, KID_REPO)
        self.assertIn("failed refusal eval", str(ctx.exception))

    def test_kidsafety_with_passed_true_but_failed_cases_fails(self) -> None:
        folder = make_run_dir(self.tmp / "kid-forged", repo_id=KID_REPO, kidsafety_pass=True)
        write_json(folder / gate.REFUSAL_EVAL_FILE, {"passed": True, "total_cases": 25, "passed_cases": 24})
        with self.assertRaises(gate.PublishGateError):
            gate.check_publish_gate(folder, KID_REPO)

    def test_kidsafety_with_recorded_pass_passes(self) -> None:
        folder = make_run_dir(self.tmp / "kid-pass", repo_id=KID_REPO, kidsafety_pass=True)
        records = gate.check_publish_gate(folder, KID_REPO)
        self.assertIn(gate.REFUSAL_EVAL_FILE, records)

    def test_refusal_eval_file_is_optional_outside_kidsafety(self) -> None:
        folder = make_run_dir(self.tmp / "text-with-refusal", repo_id=TEXT_REPO, kidsafety_pass=False)
        gate.check_publish_gate(folder, TEXT_REPO)

    def test_publish_refuses_before_touching_the_hub(self) -> None:
        folder = make_run_dir(self.tmp / "no-eval")
        (folder / gate.EVAL_FILE).unlink()
        with self.assertRaises(gate.PublishGateError):
            gate.publish_adapter_folder(None, folder, TEXT_REPO, commit_message="x")
        self.assertFalse((folder / gate.CARD_FILE).exists())

    def test_card_holds_only_logged_values(self) -> None:
        folder = make_run_dir(self.tmp / "card")
        card = gate.build_model_card(folder, TEXT_REPO)
        for expected in (
            "adapter_hands_chatml.jsonl",
            "| Training steps | 180 |",
            "| Epochs | 3 |",
            "| Conversations trained on | 900 |",
            "| heldout_loss | 1.35 |",
            "| 120 | 1.7500 |",
        ):
            self.assertIn(expected, card)
        self.assertNotIn("datasets:", card)
        self.assertNotIn("Council of Kami", card)
        self.assertNotIn("stacks", card.lower())

    def test_card_names_a_corpus_only_when_the_log_records_it(self) -> None:
        folder = make_run_dir(self.tmp / "card-corpus", corpus_repo="Bluebarrels/easylm-training-corpus")
        card = gate.build_model_card(folder, TEXT_REPO)
        self.assertIn("- Bluebarrels/easylm-training-corpus", card)

    def test_kidsafety_card_records_the_refusal_result(self) -> None:
        folder = make_run_dir(self.tmp / "card-kid", repo_id=KID_REPO, kidsafety_pass=True)
        card = gate.build_model_card(folder, KID_REPO)
        self.assertIn("Passed 25 of 25 recorded cases.", card)


class UploadRoutingTest(unittest.TestCase):
    """Every Hugging Face upload in scripts/ goes strictly through adapter_publish_gate.py."""

    def test_only_the_gate_calls_hf_upload_methods(self) -> None:
        pattern = re.compile(r"\.(upload_folder|upload_file|push_to_hub)\(")
        for path in sorted(SCRIPTS.glob("*.py")):
            if path.name == "adapter_publish_gate.py":
                continue
            source = path.read_text(encoding="utf-8-sig")
            hits = list(pattern.finditer(source))
            with self.subTest(script=path.name):
                self.assertEqual(
                    hits,
                    [],
                    f"{path.name} must not call upload_folder/upload_file/push_to_hub directly",
                )

    def test_bypass_batch_scripts_are_deleted(self) -> None:
        for deleted_name in (
            "dispatch_and_upload_bonsai2_lineup.py",
            "dispatch_and_upload_7_finetunes.py",
            "sync_and_upload_all_adapters.py",
            "train_bonsai2_modal.py",
        ):
            with self.subTest(script=deleted_name):
                self.assertFalse((SCRIPTS / deleted_name).exists(), f"{deleted_name} must remain deleted")

    def test_upload_to_hf_imports_the_gate(self) -> None:
        source = (SCRIPTS / "upload_to_hf.py").read_text(encoding="utf-8-sig")
        self.assertIn("from adapter_publish_gate import", source)
        self.assertIn("publish_adapter_folder(", source)

    def test_no_script_carries_the_unlogged_refusal_claim(self) -> None:
        for path in sorted(SCRIPTS.glob("*.py")):
            with self.subTest(script=path.name):
                self.assertNotIn("minor exploitation", path.read_text(encoding="utf-8-sig"))


if __name__ == "__main__":
    unittest.main(verbosity=2)
