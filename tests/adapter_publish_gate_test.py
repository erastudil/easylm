# SPDX-License-Identifier: AGPL-3.0-or-later
"""Real-file tests for scripts/adapter_publish_gate.py. Run by scripts/verify.mjs."""

from __future__ import annotations

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


def write_safetensors(path: Path) -> None:
    payload = struct.pack("<4e", 0.5, -0.25, 0.125, 1.0)
    header = json.dumps(
        {"w.lora_A.weight": {"dtype": "F16", "shape": [2, 2], "data_offsets": [0, len(payload)]}}
    ).encode("utf-8")
    path.write_bytes(struct.pack("<Q", len(header)) + header + payload)


def write_json(path: Path, data: object) -> None:
    path.write_text(json.dumps(data), encoding="utf-8")


def make_run_dir(folder: Path, kidsafety_pass: bool | None = None, corpus_repo: str | None = None) -> Path:
    folder.mkdir(parents=True, exist_ok=True)
    write_safetensors(folder / gate.WEIGHTS_FILE)
    write_json(folder / gate.CONFIG_FILE, {"peft_type": "LORA", "r": 16, "lora_alpha": 32, "lora_dropout": 0.05})
    dataset = {"file": "adapter_hands_chatml.jsonl", "conversations": 900, "sampled_conversations": 200}
    if corpus_repo:
        dataset["corpus_repo"] = corpus_repo
    write_json(
        folder / gate.TRAINING_LOG_FILE,
        {"base_model": "prism-ml/Ternary-Bonsai-2-2B-gguf", "dataset": dataset},
    )
    write_json(
        folder / gate.LOSS_CURVE_FILE,
        {
            "global_step": 3,
            "num_train_epochs": 1.5,
            "log_history": [
                {"step": 1, "loss": 2.5},
                {"step": 2, "loss": 1.75},
                {"step": 3, "loss": 1.25},
            ],
        },
    )
    write_json(folder / gate.EVAL_FILE, {"metrics": {"heldout_loss": 1.5}})
    if kidsafety_pass is not None:
        write_json(
            folder / gate.REFUSAL_EVAL_FILE,
            {"passed": kidsafety_pass, "total_cases": 20, "passed_cases": 20 if kidsafety_pass else 17},
        )
    return folder


class PublishGateTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = Path(tempfile.mkdtemp(prefix="easylm-gate-"))
        self.addCleanup(shutil.rmtree, self.tmp, ignore_errors=True)

    def test_complete_folder_passes(self) -> None:
        folder = make_run_dir(self.tmp / "ok")
        records = gate.check_publish_gate(folder, TEXT_REPO)
        self.assertEqual(set(records), {gate.TRAINING_LOG_FILE, gate.LOSS_CURVE_FILE, gate.EVAL_FILE})

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
        folder = make_run_dir(self.tmp / "kid-none")
        with self.assertRaises(gate.PublishGateError) as ctx:
            gate.check_publish_gate(folder, KID_REPO)
        self.assertIn(gate.REFUSAL_EVAL_FILE, str(ctx.exception))

    def test_kidsafety_with_recorded_fail_fails(self) -> None:
        folder = make_run_dir(self.tmp / "kid-fail", kidsafety_pass=False)
        with self.assertRaises(gate.PublishGateError) as ctx:
            gate.check_publish_gate(folder, KID_REPO)
        self.assertIn("failed refusal eval", str(ctx.exception))

    def test_kidsafety_with_passed_true_but_failed_cases_fails(self) -> None:
        folder = make_run_dir(self.tmp / "kid-forged", kidsafety_pass=True)
        write_json(folder / gate.REFUSAL_EVAL_FILE, {"passed": True, "total_cases": 20, "passed_cases": 19})
        with self.assertRaises(gate.PublishGateError):
            gate.check_publish_gate(folder, KID_REPO)

    def test_kidsafety_with_recorded_pass_passes(self) -> None:
        folder = make_run_dir(self.tmp / "kid-pass", kidsafety_pass=True)
        records = gate.check_publish_gate(folder, KID_REPO)
        self.assertIn(gate.REFUSAL_EVAL_FILE, records)

    def test_refusal_eval_file_is_optional_outside_kidsafety(self) -> None:
        folder = make_run_dir(self.tmp / "text-with-refusal", kidsafety_pass=False)
        gate.check_publish_gate(folder, TEXT_REPO)

    def test_publish_refuses_before_touching_the_hub(self) -> None:
        folder = make_run_dir(self.tmp / "no-eval")
        (folder / gate.EVAL_FILE).unlink()
        # api=None: any hub call would raise AttributeError instead of PublishGateError.
        with self.assertRaises(gate.PublishGateError):
            gate.publish_adapter_folder(None, folder, TEXT_REPO, commit_message="x")
        self.assertFalse((folder / gate.CARD_FILE).exists())

    def test_card_holds_only_logged_values(self) -> None:
        folder = make_run_dir(self.tmp / "card")
        card = gate.build_model_card(folder, TEXT_REPO)
        for expected in (
            "adapter_hands_chatml.jsonl",
            "| Training steps | 3 |",
            "| Epochs | 1.5 |",
            "| Conversations trained on | 200 |",
            "| heldout_loss | 1.5 |",
            "| 2 | 1.7500 |",
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
        folder = make_run_dir(self.tmp / "card-kid", kidsafety_pass=True)
        card = gate.build_model_card(folder, KID_REPO)
        self.assertIn("Passed 20 of 20 recorded cases.", card)


class UploadRoutingTest(unittest.TestCase):
    """Every Hugging Face upload in scripts/ goes through the gate."""

    def test_only_the_gate_uploads_adapters(self) -> None:
        pattern = re.compile(r"\.(upload_folder|upload_file|push_to_hub)\(")
        for path in sorted(SCRIPTS.glob("*.py")):
            source = path.read_text(encoding="utf-8")
            hits = [m.start() for m in pattern.finditer(source)]
            if not hits or path.name == "adapter_publish_gate.py":
                continue
            with self.subTest(script=path.name):
                # The dispatcher's one remaining upload is the training-corpus dataset repo.
                self.assertEqual(path.name, "dispatch_and_upload_bonsai2_lineup.py")
                self.assertEqual(len(hits), 1)
                self.assertIn('repo_type="dataset"', source[hits[0] : hits[0] + 200])

    def test_upload_scripts_import_the_gate(self) -> None:
        for name in (
            "dispatch_and_upload_bonsai2_lineup.py",
            "dispatch_and_upload_7_finetunes.py",
            "sync_and_upload_all_adapters.py",
            "upload_to_hf.py",
        ):
            with self.subTest(script=name):
                source = (SCRIPTS / name).read_text(encoding="utf-8-sig")
                self.assertIn("from adapter_publish_gate import", source)
                self.assertIn("publish_adapter_folder(", source)

    def test_no_script_carries_the_unlogged_refusal_claim(self) -> None:
        for path in sorted(SCRIPTS.glob("*.py")):
            with self.subTest(script=path.name):
                self.assertNotIn("minor exploitation", path.read_text(encoding="utf-8-sig"))


if __name__ == "__main__":
    unittest.main(verbosity=2)
