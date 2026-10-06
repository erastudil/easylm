# SPDX-License-Identifier: AGPL-3.0-or-later
"""Automated Test Suite for EasyLM Qwen 3B Training Dataset Compiler.

Verifies:
1. Dataset files existence (both ChatML and Gemini SFT JSONL files).
2. Example count constraints (at least 300-400 rich examples).
3. ChatML schema validation (valid JSON, role/content types, message structure).
4. Gemini SFT schema validation (systemInstruction, contents, role/parts structure).
5. Tool call syntax across all 12 tools (<tool_call>{"name": "...", "query": "..."}</tool_call>).
6. Multi-turn tool execution & response handling (<tool_response>...</tool_response> followed by synthesis).
7. Tool discrimination (casual conversation, greetings, self-explanation without tool calls).
8. Kid Safe mode restrictions (local tools permitted; external network tools refused; minor safety refusals).
9. All 8 EasyLM personalities coverage (Friendly Guide, Kids Coach, Feynman, Socrates, Holmes, Aurelius, Lovelace, Laozi).
10. Stacks knowledge retrieval across all 32 academic undergraduate stacks (Dewey 000-900).
11. WebGPU browser constraints, anti-loop token budgets, honest deflection, and interaction protocols.
"""

from __future__ import annotations

import json
from pathlib import Path
import re
import unittest

EASYLM_ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = EASYLM_ROOT / "data"
CHATML_PATH = DATA_DIR / "easylm_qwen3b_chatml.jsonl"
SFT_PATH = DATA_DIR / "easylm_qwen3b_sft.jsonl"
PACKS_PATH = EASYLM_ROOT / "stacks" / "PACKS.json"

REQUIRED_TOOLS = {
    "calc",
    "units",
    "exchange",
    "weather",
    "datetime",
    "fact",
    "dictionary",
    "web_search",
    "web_fetch",
    "stacks",
    "zcabs",
    "studio"
}

REQUIRED_PERSONALITIES = {
    "friendly",
    "socratic_kid",
    "feynman",
    "socrates",
    "holmes",
    "stoic",
    "lovelace",
    "daoist"
}


class TestCompileEasyLMDataset(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Fallback to root if data dir not populated yet
        cls.chatml_file = CHATML_PATH if CHATML_PATH.is_file() else EASYLM_ROOT / "easylm_qwen3b_chatml.jsonl"
        cls.sft_file = SFT_PATH if SFT_PATH.is_file() else EASYLM_ROOT / "easylm_qwen3b_sft.jsonl"

        cls.chatml_lines = []
        if cls.chatml_file.is_file():
            cls.chatml_lines = cls.chatml_file.read_text(encoding="utf-8").strip().splitlines()

        cls.sft_lines = []
        if cls.sft_file.is_file():
            cls.sft_lines = cls.sft_file.read_text(encoding="utf-8").strip().splitlines()

        cls.packs_meta = []
        if PACKS_PATH.is_file():
            cls.packs_meta = json.loads(PACKS_PATH.read_text(encoding="utf-8"))

    def test_01_files_exist_and_non_empty(self):
        """Dataset files must exist and contain non-empty JSONL data."""
        self.assertTrue(self.chatml_file.is_file(), f"Missing ChatML dataset at {self.chatml_file}")
        self.assertTrue(self.sft_file.is_file(), f"Missing Gemini SFT dataset at {self.sft_file}")
        self.assertGreater(self.chatml_file.stat().st_size, 100_000, "ChatML dataset file is too small")
        self.assertGreater(self.sft_file.stat().st_size, 100_000, "Gemini SFT dataset file is too small")

    def test_02_example_count_in_target_range(self):
        """Dataset must synthesize at least 300-400 rich examples."""
        chatml_count = len(self.chatml_lines)
        sft_count = len(self.sft_lines)
        self.assertEqual(chatml_count, sft_count, "ChatML and Gemini SFT must have identical example counts")
        self.assertGreaterEqual(chatml_count, 300, f"Expected at least 300 examples, got {chatml_count}")
        self.assertLessEqual(chatml_count, 450, f"Expected at most 450 examples, got {chatml_count}")

    def test_03_chatml_schema_validation(self):
        """Every line in ChatML must be valid JSON matching the ChatML message spec."""
        for idx, line in enumerate(self.chatml_lines):
            try:
                record = json.loads(line)
            except Exception as e:
                self.fail(f"Invalid JSON on ChatML line {idx + 1}: {e}")

            self.assertIn("messages", record, f"Line {idx + 1} missing 'messages' key")
            messages = record["messages"]
            self.assertIsInstance(messages, list, f"Line {idx + 1} 'messages' must be a list")
            self.assertGreaterEqual(len(messages), 2, f"Line {idx + 1} must have at least 2 messages")

            for m_idx, msg in enumerate(messages):
                self.assertIn("role", msg, f"Line {idx + 1} msg {m_idx} missing 'role'")
                self.assertIn("content", msg, f"Line {idx + 1} msg {m_idx} missing 'content'")
                self.assertIn(msg["role"], {"system", "user", "assistant"},
                              f"Line {idx + 1} msg {m_idx} invalid role '{msg['role']}'")
                self.assertIsInstance(msg["content"], str,
                                      f"Line {idx + 1} msg {m_idx} content must be string")
                self.assertGreater(len(msg["content"].strip()), 0,
                                   f"Line {idx + 1} msg {m_idx} content is empty")

    def test_04_gemini_sft_schema_validation(self):
        """Every line in Gemini SFT must be valid JSON matching Google Cloud / Gemini SFT spec."""
        for idx, line in enumerate(self.sft_lines):
            try:
                record = json.loads(line)
            except Exception as e:
                self.fail(f"Invalid JSON on SFT line {idx + 1}: {e}")

            self.assertIn("systemInstruction", record, f"Line {idx + 1} missing 'systemInstruction'")
            sys_inst = record["systemInstruction"]
            self.assertIn("parts", sys_inst, f"Line {idx + 1} systemInstruction missing 'parts'")
            self.assertIsInstance(sys_inst["parts"], list)
            self.assertGreaterEqual(len(sys_inst["parts"]), 1)
            self.assertIn("text", sys_inst["parts"][0])

            self.assertIn("contents", record, f"Line {idx + 1} missing 'contents'")
            contents = record["contents"]
            self.assertIsInstance(contents, list)
            self.assertGreaterEqual(len(contents), 2)

            for c_idx, turn in enumerate(contents):
                self.assertIn("role", turn, f"Line {idx + 1} turn {c_idx} missing 'role'")
                self.assertIn(turn["role"], {"user", "model"},
                              f"Line {idx + 1} turn {c_idx} invalid role '{turn['role']}'")
                self.assertIn("parts", turn, f"Line {idx + 1} turn {c_idx} missing 'parts'")
                self.assertIsInstance(turn["parts"], list)
                self.assertGreaterEqual(len(turn["parts"]), 1)
                self.assertIn("text", turn["parts"][0])
                self.assertGreater(len(turn["parts"][0]["text"].strip()), 0)

    def test_05_tool_call_syntax_and_all_12_tools_covered(self):
        """All 12 built-in tools must be invoked with precise <tool_call> JSON syntax."""
        tool_call_re = re.compile(r'<tool_call>(\{.*?\})</tool_call>', re.DOTALL)
        observed_tools = set()

        for idx, line in enumerate(self.chatml_lines):
            record = json.loads(line)
            for msg in record["messages"]:
                if msg["role"] == "assistant":
                    matches = tool_call_re.findall(msg["content"])
                    for match in matches:
                        try:
                            payload = json.loads(match)
                        except Exception as e:
                            self.fail(f"Line {idx + 1} malformed tool call JSON: '{match}' ({e})")
                        self.assertIn("name", payload, f"Tool call payload missing 'name': {match}")
                        self.assertIn("query", payload, f"Tool call payload missing 'query': {match}")
                        tool_name = payload["name"]
                        observed_tools.add(tool_name)

        missing_tools = REQUIRED_TOOLS - observed_tools
        self.assertEqual(len(missing_tools), 0,
                         f"Missing tool calls for required tools: {missing_tools}")
        self.assertGreaterEqual(len(observed_tools), 12,
                                f"Expected all 12 tools, observed {len(observed_tools)}")

    def test_06_multi_turn_tool_results_handling(self):
        """Tool executions must follow multi-turn flow: call -> response -> synthesis."""
        multi_turn_count = 0
        for line in self.chatml_lines:
            record = json.loads(line)
            msgs = record["messages"]
            has_tool_call = any("<tool_call>" in m["content"] for m in msgs if m["role"] == "assistant")
            has_tool_resp = any("<tool_response>" in m["content"] for m in msgs if m["role"] == "user")

            if has_tool_call:
                self.assertTrue(has_tool_resp, "Every example with a tool call must provide a tool response")
                # Structure: System (0), User (1), Assistant tool_call (2), User tool_response (3), Assistant synthesis (4)
                self.assertGreaterEqual(len(msgs), 5, "Multi-turn tool call must have at least 5 messages")
                self.assertIn("<tool_call>", msgs[2]["content"])
                self.assertIn("<tool_response>", msgs[3]["content"])
                self.assertNotIn("<tool_call>", msgs[4]["content"])
                multi_turn_count += 1

        self.assertGreaterEqual(multi_turn_count, 150,
                                f"Expected at least 150 multi-turn tool examples, got {multi_turn_count}")

    def test_07_tool_discrimination_examples_present(self):
        """Dataset must contain discrimination examples where assistant responds without tools."""
        no_tool_examples = 0
        for line in self.chatml_lines:
            record = json.loads(line)
            msgs = record["messages"]
            has_assistant_tool = any("<tool_call>" in m["content"] for m in msgs if m["role"] == "assistant")
            if not has_assistant_tool:
                no_tool_examples += 1
                # Must be 3 messages: system, user, assistant
                self.assertEqual(len(msgs), 3)

        self.assertGreaterEqual(no_tool_examples, 80,
                                f"Expected at least 80 non-tool discrimination examples, got {no_tool_examples}")

    def test_08_kid_mode_restrictions_and_safeguards(self):
        """Kid mode must enforce local tools only, refuse external egress, and enforce safety."""
        kid_examples = 0
        kid_refusal_examples = 0
        kid_hard_refusals = 0

        for line in self.chatml_lines:
            record = json.loads(line)
            sys_msg = record["messages"][0]["content"]
            if "Kids & Homework Coach" in sys_msg or "local tools only" in sys_msg:
                kid_examples += 1
                assistant_final = record["messages"][-1]["content"]

                # Check if this is an external egress refusal
                if any(phrase in assistant_final.lower() for phrase in [
                    "network tools are turned off",
                    "kid safe mode",
                    "disabled in kid safe mode",
                    "cannot look up live weather",
                    "currency exchange and web access are blocked",
                    "cannot search the web",
                    "external web fetching is disabled"
                ]):
                    kid_refusal_examples += 1

                # Check for minor protection hard refusal
                if "romantic or sexual" in assistant_final.lower() or "minors" in assistant_final.lower():
                    kid_hard_refusals += 1

        self.assertGreaterEqual(kid_examples, 25, f"Expected at least 25 kid mode examples, got {kid_examples}")
        self.assertGreaterEqual(kid_refusal_examples, 8,
                                f"Expected at least 8 kid network refusal examples, got {kid_refusal_examples}")
        self.assertGreaterEqual(kid_hard_refusals, 3,
                                f"Expected at least 3 kid minor safety hard refusals, got {kid_hard_refusals}")

    def test_09_all_8_easylm_personalities_covered(self):
        """Dataset must train all 8 specified EasyLM personalities."""
        observed_personalities = set()

        for line in self.chatml_lines:
            record = json.loads(line)
            sys_msg = record["messages"][0]["content"]

            if "Friendly Guide" in sys_msg:
                observed_personalities.add("friendly")
            if "Kids & Homework Coach" in sys_msg:
                observed_personalities.add("socratic_kid")
            if "Richard Phillips Feynman" in sys_msg:
                observed_personalities.add("feynman")
            if "Socrates of Athens" in sys_msg:
                observed_personalities.add("socrates")
            if "Sherlock Holmes" in sys_msg:
                observed_personalities.add("holmes")
            if "Marcus Aurelius" in sys_msg:
                observed_personalities.add("stoic")
            if "Countess of Lovelace" in sys_msg or "Ada Lovelace" in sys_msg:
                observed_personalities.add("lovelace")
            if "Lao Tzu" in sys_msg or "Laozi" in sys_msg:
                observed_personalities.add("daoist")

        missing_pers = REQUIRED_PERSONALITIES - observed_personalities
        self.assertEqual(len(missing_pers), 0,
                         f"Missing required personalities: {missing_pers}")
        self.assertEqual(len(observed_personalities), 8,
                         f"Expected all 8 personalities, found {len(observed_personalities)}")

    def test_10_all_32_stacks_dewey_packs_covered(self):
        """Dataset must cover all 32 undergraduate stacks from PACKS.json (Dewey 000-900)."""
        self.assertEqual(len(self.packs_meta), 32, "PACKS.json must contain 32 packs")
        expected_deweys = {p["dewey"] for p in self.packs_meta}
        observed_deweys = set()

        for line in self.chatml_lines:
            record = json.loads(line)
            for msg in record["messages"]:
                if "<tool_response>" in msg["content"]:
                    resp = msg["content"]
                    m = re.search(r'\[Dewey\s+([0-9.]+)\b', resp)
                    if m:
                        observed_deweys.add(m.group(1))

        missing_deweys = expected_deweys - observed_deweys
        self.assertEqual(len(missing_deweys), 0,
                         f"Missing stacks coverage for Dewey classifications: {missing_deweys}")
        self.assertEqual(len(observed_deweys), 32,
                         f"Expected all 32 Dewey codes, found {len(observed_deweys)}")

    def test_11_webgpu_browser_constraints_and_protocols(self):
        """Dataset must cover WebGPU execution, VRAM, anti-loop, deflection, and triage."""
        found_webgpu = False
        found_antiloop = False
        found_deflection = False
        found_triage = False

        for line in self.chatml_lines:
            record = json.loads(line)
            text = " ".join(m["content"] for m in record["messages"])

            if "WebGPU" in text and ("VRAM" in text or "device lost" in text or "locally" in text):
                found_webgpu = True
            if "AntiLoopDetector" in text or "anti-loop" in text.lower():
                found_antiloop = True
            if "I couldn't find a reliable answer for that, and I don't want to mislead you" in text:
                found_deflection = True
            if "Specialist Required" in text and ("Required Credentials" in text or "Intake Checklist" in text):
                found_triage = True

        self.assertTrue(found_webgpu, "Dataset missing WebGPU execution coverage")
        self.assertTrue(found_antiloop, "Dataset missing AntiLoop / token budget coverage")
        self.assertTrue(found_deflection, "Dataset missing canonical honest deflection phrasing")
        self.assertTrue(found_triage, "Dataset missing professional referral triage protocol coverage")

    def test_12_adapter_datasets_presence_and_structure(self):
        """All 4 discrete target adapter datasets must exist and follow valid schema."""
        adapters = ["hands", "personalities", "security", "kidsafety"]
        for adapter in adapters:
            chatml_file = DATA_DIR / f"adapter_{adapter}_chatml.jsonl"
            sft_file = DATA_DIR / f"adapter_{adapter}_sft.jsonl"
            self.assertTrue(chatml_file.is_file(), f"Missing {chatml_file}")
            self.assertTrue(sft_file.is_file(), f"Missing {sft_file}")

            with open(chatml_file, "r", encoding="utf-8") as f:
                lines = [l.strip() for l in f if l.strip()]
            self.assertGreaterEqual(len(lines), 30, f"Adapter {adapter} has too few examples: {len(lines)}")

            # Validate ChatML structure
            for line in lines:
                data = json.loads(line)
                self.assertIn("messages", data)
                self.assertGreaterEqual(len(data["messages"]), 2)


if __name__ == "__main__":
    unittest.main()
