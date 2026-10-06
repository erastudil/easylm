# SPDX-License-Identifier: AGPL-3.0-or-later
"""Unit Test Suite for Synthetic Distillation Curation Pipeline.

Verifies Masterplan WO-09 requirements:
1. Schema conversions: Alpaca, ShareGPT, ChatML round-trip integrity.
2. Heuristic quality filters: length constraints, n-gram repetition penalty,
   zlib compression loop detector, refusal/boilerplate filtering, contradiction detection.
3. Self-correction: think tag stripping, whitespace normalization, pleasantry removal.
4. Pipeline orchestration: heterogeneous batch ingestion, filtering, and dataset partitioning.
5. Export & load utilities: JSONL serialization across all supported schemas.
"""

from __future__ import annotations

import json
from pathlib import Path
import tempfile
import unittest

from easylm.data.synthetic_distill import (
    DistillationSample,
    FilterResult,
    HeuristicValidationFilter,
    SyntheticDistillationPipeline,
    export_dataset_jsonl,
    load_dataset_jsonl,
)


class TestSyntheticDistill(unittest.TestCase):
    def setUp(self):
        self.valid_sample = DistillationSample(
            instruction="Explain the concept of entropy in thermodynamics.",
            output="Entropy is a measure of the molecular disorder or randomness within a closed thermodynamic system.",
            system_prompt="You are a university physics professor.",
            domain="physics",
            metadata={"difficulty": "undergrad"},
        )
        self.validator = HeuristicValidationFilter()
        self.pipeline = SyntheticDistillationPipeline(validator=self.validator)

    def test_01_sample_creation_and_deterministic_id(self):
        """DistillationSample should generate a deterministic SHA-256 ID if none provided."""
        s1 = DistillationSample(instruction="What is DNA?", output="Deoxyribonucleic acid is a polymer.")
        s2 = DistillationSample(instruction="What is DNA?", output="Deoxyribonucleic acid is a polymer.")
        self.assertEqual(len(s1.id), 16)
        self.assertEqual(s1.id, s2.id)

        # Explicit ID preserved
        s3 = DistillationSample(instruction="What is RNA?", output="Ribonucleic acid.", id="custom-uuid-1234")
        self.assertEqual(s3.id, "custom-uuid-1234")

    def test_02_alpaca_schema_conversion(self):
        """Round-trip conversion to and from Alpaca schema."""
        alpaca_dict = self.valid_sample.to_alpaca()
        self.assertIn("instruction", alpaca_dict)
        self.assertIn("output", alpaca_dict)
        self.assertIn("system", alpaca_dict)
        self.assertEqual(alpaca_dict["instruction"], self.valid_sample.instruction)
        self.assertEqual(alpaca_dict["output"], self.valid_sample.output)

        reconstructed = DistillationSample.from_alpaca(alpaca_dict, domain="physics")
        self.assertEqual(reconstructed.instruction, self.valid_sample.instruction)
        self.assertEqual(reconstructed.output, self.valid_sample.output)
        self.assertEqual(reconstructed.system_prompt, self.valid_sample.system_prompt)

    def test_03_sharegpt_schema_conversion(self):
        """Round-trip conversion to and from ShareGPT schema."""
        sharegpt_dict = self.valid_sample.to_sharegpt()
        self.assertIn("id", sharegpt_dict)
        self.assertIn("conversations", sharegpt_dict)
        convs = sharegpt_dict["conversations"]
        self.assertEqual(len(convs), 3)  # system, human, gpt
        self.assertEqual(convs[0]["from"], "system")
        self.assertEqual(convs[1]["from"], "human")
        self.assertEqual(convs[2]["from"], "gpt")

        reconstructed = DistillationSample.from_sharegpt(sharegpt_dict, domain="physics")
        self.assertEqual(reconstructed.instruction, self.valid_sample.instruction)
        self.assertEqual(reconstructed.output, self.valid_sample.output)
        self.assertEqual(reconstructed.system_prompt, self.valid_sample.system_prompt)

    def test_04_chatml_schema_conversion(self):
        """Round-trip conversion to and from ChatML schema."""
        chatml_dict = self.valid_sample.to_chatml()
        self.assertIn("messages", chatml_dict)
        msgs = chatml_dict["messages"]
        self.assertEqual(len(msgs), 3)  # system, user, assistant
        self.assertEqual(msgs[0]["role"], "system")
        self.assertEqual(msgs[1]["role"], "user")
        self.assertEqual(msgs[2]["role"], "assistant")

        reconstructed = DistillationSample.from_chatml(chatml_dict, domain="physics")
        self.assertEqual(reconstructed.instruction, self.valid_sample.instruction)
        self.assertEqual(reconstructed.output, self.valid_sample.output)
        self.assertEqual(reconstructed.system_prompt, self.valid_sample.system_prompt)

    def test_05_heuristic_filter_valid_sample_passes(self):
        """Clean, articulate samples must pass validation with exit status True."""
        res = self.validator.validate(self.valid_sample)
        self.assertTrue(res.passed)
        self.assertIsNone(res.reason)
        self.assertIn("inst_len", res.metrics)
        self.assertIn("out_len", res.metrics)

    def test_06_heuristic_filter_short_instruction_rejected(self):
        """Instructions below min_instruction_len must be rejected."""
        short_s = DistillationSample(instruction="Hi", output="Hello there, how can I assist you today?")
        res = self.validator.validate(short_s)
        self.assertFalse(res.passed)
        self.assertIn("Instruction too short", res.reason)

    def test_07_heuristic_filter_short_output_rejected(self):
        """Outputs below min_output_len must be rejected."""
        short_out = DistillationSample(instruction="Explain general relativity in physics.", output="Gravity.")
        res = self.validator.validate(short_out)
        self.assertFalse(res.passed)
        self.assertIn("Output too short", res.reason)

    def test_08_heuristic_filter_repetitive_loop_rejected(self):
        """Pathological n-gram repetition loops must be caught and rejected."""
        loop_text = "The system is running smoothly. " * 30
        repeat_s = DistillationSample(
            instruction="What is the operational state of the cluster?",
            output=loop_text,
        )
        res = self.validator.validate(repeat_s)
        self.assertFalse(res.passed)
        self.assertIn("repetition", res.reason.lower())

    def test_09_heuristic_filter_refusal_boilerplate_rejected(self):
        """AI boilerplate and generic refusals must be rejected."""
        refusal_s = DistillationSample(
            instruction="Tell me how to write an operating system kernel.",
            output="As an AI language model, I do not have personal experience in writing kernel code.",
        )
        res = self.validator.validate(refusal_s)
        self.assertFalse(res.passed)
        self.assertIn("refusal", res.reason.lower())

    def test_10_heuristic_filter_contradiction_detected(self):
        """Responses with blatant self-contradictions must be rejected."""
        contra_s = DistillationSample(
            instruction="Can a square have five sides in Euclidean geometry?",
            output="This statement is completely true that a polygon can vary, but this statement is completely false in Euclidean terms.",
        )
        res = self.validator.validate(contra_s)
        self.assertFalse(res.passed)
        self.assertIn("contradiction", res.reason.lower())

    def test_11_self_correction_cleans_artifacts(self):
        """Pipeline self-correction must strip think tags, pleasantries, and excessive whitespace."""
        raw_s = DistillationSample(
            instruction="  Explain   sorting   algorithms  \n",
            output="<think>User wants algorithms.\nSorting is key.</think>\n\nCertainly! Here is the answer:\n\nQuicksort partitions arrays around a pivot element.\n\n\n\nMerge sort divides arrays recursively.",
        )
        corrected = self.pipeline.self_correct(raw_s)
        self.assertEqual(corrected.instruction, "Explain sorting algorithms")
        self.assertNotIn("<think>", corrected.output)
        self.assertNotIn("Certainly!", corrected.output)
        self.assertNotIn("\n\n\n", corrected.output)
        self.assertTrue(corrected.output.startswith("Quicksort partitions"))

    def test_12_pipeline_batch_processing_and_filtering(self):
        """Pipeline must ingest heterogeneous items, filter invalid entries, and keep valid ones."""
        batch = [
            # Valid item 1 (Alpaca dict)
            {
                "instruction": "Define Heisenberg uncertainty principle in quantum physics.",
                "output": "The uncertainty principle states that position and momentum cannot both be precisely measured simultaneously (delta x * delta p >= hbar / 2).",
            },
            # Invalid item 2 (Too short)
            {
                "instruction": "x?",
                "output": "y.",
            },
            # Valid item 3 (ChatML dict)
            {
                "messages": [
                    {"role": "user", "content": "What is Amdahl's Law in parallel computing?"},
                    {"role": "assistant", "content": "Amdahl's Law predicts theoretical speedup of latency with fixed workload given parallel processors."},
                ]
            },
            # Invalid item 4 (Refusal)
            {
                "instruction": "What is the secret formula?",
                "output": "As an AI language model, I apologize, but I am unable to reveal proprietary secrets.",
            },
        ]

        pipe = SyntheticDistillationPipeline()
        accepted, rejected = pipe.process(batch)
        self.assertEqual(len(accepted), 2)
        self.assertEqual(len(rejected), 2)
        self.assertEqual(len(pipe.samples), 2)

    def test_13_partition_train_val(self):
        """Deterministic train/val split must honor ratio and seed."""
        samples = [
            DistillationSample(instruction=f"Instruction {i}", output=f"Detailed output description for item {i}.")
            for i in range(20)
        ]
        train, val = SyntheticDistillationPipeline.partition_train_val(samples, val_ratio=0.2, seed=123)
        self.assertEqual(len(train), 16)
        self.assertEqual(len(val), 4)

        # Check determinism with same seed
        train2, val2 = SyntheticDistillationPipeline.partition_train_val(samples, val_ratio=0.2, seed=123)
        self.assertEqual([s.id for s in val], [s.id for s in val2])

    def test_14_export_and_load_jsonl_all_schemas(self):
        """Exporting and loading across ChatML, Alpaca, and ShareGPT schemas."""
        samples = [
            DistillationSample(
                instruction="Explain the role of mitochondria.",
                output="Mitochondria generate most of the chemical energy needed to power the cell's biochemical reactions via ATP synthesis.",
                domain="biology",
            ),
            DistillationSample(
                instruction="Explain Big-O notation.",
                output="Big-O notation characterizes the upper asymptotic bound of an algorithm's runtime or memory complexity as input size scales.",
                domain="computing",
            ),
        ]

        with tempfile.TemporaryDirectory() as tmpdir:
            tmppath = Path(tmpdir)

            for schema in ["chatml", "alpaca", "sharegpt"]:
                out_file = tmppath / f"dataset_{schema}.jsonl"
                exported_count = export_dataset_jsonl(samples, out_file, schema=schema)
                self.assertEqual(exported_count, 2)
                self.assertTrue(out_file.is_file())

                # Validate line-by-line JSON validity
                lines = out_file.read_text(encoding="utf-8").strip().splitlines()
                self.assertEqual(len(lines), 2)
                for line in lines:
                    parsed = json.loads(line)
                    self.assertIsInstance(parsed, dict)

                # Round-trip load test
                loaded = load_dataset_jsonl(out_file, schema=schema)
                self.assertEqual(len(loaded), 2)
                self.assertEqual(loaded[0].instruction, samples[0].instruction)
                self.assertEqual(loaded[1].output, samples[1].output)


if __name__ == "__main__":
    unittest.main()
