# SPDX-License-Identifier: AGPL-3.0-or-later
"""Synthetic Data Generation & Fine-Tuning Distillation Pipeline.

Implements Masterplan WO-09 (High-Density Synthetic Data Generation & Student Model Distillation):
- Ingestion of frontier model teacher outputs (DeepSeek R1, Claude 3.7, GPT-4o, etc.).
- Schema conversion between ChatML, ShareGPT, and Alpaca formats.
- Self-correction and heuristic quality validation (length, repetition penalty, contradiction detection).
- Dataset partitioning and JSONL export ready for LoRA fine-tuning (Unsloth, PEFT, Vertex, RunPod).
"""

from __future__ import annotations

from dataclasses import dataclass, field
import hashlib
import json
from pathlib import Path
import random
import re
from typing import Any, Dict, List, Optional, Set, Tuple
import zlib


# ==============================================================================
# 1. CORE DATA STRUCTURES & SCHEMA CONVERTERS
# ==============================================================================

@dataclass
class DistillationSample:
    """A single instruction-response training sample for distillation."""
    instruction: str
    output: str
    input: str = ""
    system_prompt: str = ""
    id: str = ""
    domain: str = "general"
    metadata: Dict[str, Any] = field(default_factory=dict)
    conversations: List[Dict[str, str]] = field(default_factory=list)

    def __post_init__(self):
        if not self.id:
            raw_key = f"{self.system_prompt}:{self.instruction}:{self.input}:{self.output}"
            self.id = hashlib.sha256(raw_key.encode("utf-8")).hexdigest()[:16]

        # If conversations not populated, build from instruction/output
        if not self.conversations:
            turns = []
            if self.system_prompt:
                turns.append({"from": "system", "value": self.system_prompt})
            user_val = f"{self.instruction}\n\n{self.input}".strip() if self.input else self.instruction
            turns.append({"from": "human", "value": user_val})
            turns.append({"from": "gpt", "value": self.output})
            self.conversations = turns

    def to_alpaca(self) -> Dict[str, Any]:
        """Convert to standard Stanford Alpaca schema."""
        record: Dict[str, Any] = {
            "instruction": self.instruction,
            "input": self.input,
            "output": self.output,
        }
        if self.system_prompt:
            record["system"] = self.system_prompt
        if self.metadata:
            record["metadata"] = self.metadata
        return record

    def to_sharegpt(self) -> Dict[str, Any]:
        """Convert to standard ShareGPT schema."""
        return {
            "id": self.id,
            "conversations": list(self.conversations),
            "domain": self.domain,
            "metadata": self.metadata,
        }

    def to_chatml(self) -> Dict[str, Any]:
        """Convert to standard ChatML multi-turn message schema."""
        messages: List[Dict[str, str]] = []
        if self.system_prompt:
            messages.append({"role": "system", "content": self.system_prompt})

        user_content = f"{self.instruction}\n\n{self.input}".strip() if self.input else self.instruction
        messages.append({"role": "user", "content": user_content})
        messages.append({"role": "assistant", "content": self.output})

        return {
            "id": self.id,
            "messages": messages,
            "domain": self.domain,
        }

    @classmethod
    def from_alpaca(cls, data: Dict[str, Any], domain: str = "general") -> DistillationSample:
        """Construct from Alpaca schema."""
        return cls(
            instruction=str(data.get("instruction", "")),
            input=str(data.get("input", "")),
            output=str(data.get("output", "")),
            system_prompt=str(data.get("system", "")),
            id=str(data.get("id", "")),
            domain=domain,
            metadata=dict(data.get("metadata", {})),
        )

    @classmethod
    def from_sharegpt(cls, data: Dict[str, Any], domain: str = "general") -> DistillationSample:
        """Construct from ShareGPT schema."""
        convs = data.get("conversations", [])
        system_prompt = ""
        instruction = ""
        output = ""

        for turn in convs:
            sender = turn.get("from", "")
            val = turn.get("value", "")
            if sender == "system":
                system_prompt = val
            elif sender in ("human", "user"):
                instruction = val
            elif sender in ("gpt", "assistant", "model"):
                output = val

        sample = cls(
            instruction=instruction,
            output=output,
            system_prompt=system_prompt,
            id=str(data.get("id", "")),
            domain=str(data.get("domain", domain)),
            metadata=dict(data.get("metadata", {})),
            conversations=convs,
        )
        return sample

    @classmethod
    def from_chatml(cls, data: Dict[str, Any], domain: str = "general") -> DistillationSample:
        """Construct from ChatML schema."""
        messages = data.get("messages", [])
        system_prompt = ""
        instruction = ""
        output = ""

        for msg in messages:
            role = msg.get("role", "")
            content = msg.get("content", "")
            if role == "system":
                system_prompt = content
            elif role == "user":
                instruction = content
            elif role == "assistant":
                output = content

        sample = cls(
            instruction=instruction,
            output=output,
            system_prompt=system_prompt,
            id=str(data.get("id", "")),
            domain=str(data.get("domain", domain)),
        )
        return sample


# ==============================================================================
# 2. VALIDATION & HEURISTIC QUALITY FILTERS
# ==============================================================================

@dataclass
class FilterResult:
    """Evaluation result from validation filter."""
    passed: bool
    reason: Optional[str] = None
    metrics: Dict[str, float] = field(default_factory=dict)


class HeuristicValidationFilter:
    """Multi-stage heuristic filter for distillation training data.

    Eliminates:
    - Degenerate token loops / repetitive degeneration via n-gram penalty & zlib compression.
    - Pathological length anomalies (too brief, truncated, excessive length).
    - Unhelpful refusals & AI identity theater ("As an AI model...", "I apologize...").
    - Explicit self-contradictions in responses.
    - Format violations and empty turns.
    """

    DEFAULT_REFUSAL_PATTERNS = [
        r"\bas an ai language model\b",
        r"\bas an artificial intelligence\b",
        r"\bi do not have personal opinions\b",
        r"\bi cannot browse the internet\b",
        r"\bmy knowledge cutoff\b",
        r"\bi apologize, but i am unable to\b",
        r"\bi cannot fulfill this request\b",
    ]

    DEFAULT_CONTRADICTION_PATTERNS = [
        r"\bthis statement is completely true\b.*\bthis statement is completely false\b",
        r"\bis definitely impossible\b.*\bis undeniably possible\b",
        r"\bcompletely correct\b.*\bentirely incorrect\b",
        r"\byes, absolutely\b.*\bno, absolutely not\b",
    ]

    def __init__(
        self,
        min_instruction_len: int = 5,
        max_instruction_len: int = 4096,
        min_output_len: int = 15,
        max_output_len: int = 16384,
        max_repetition_ratio: float = 0.35,
        min_compression_ratio: float = 0.15,
        detect_refusal: bool = True,
        detect_contradiction: bool = True,
    ):
        self.min_instruction_len = min_instruction_len
        self.max_instruction_len = max_instruction_len
        self.min_output_len = min_output_len
        self.max_output_len = max_output_len
        self.max_repetition_ratio = max_repetition_ratio
        self.min_compression_ratio = min_compression_ratio
        self.detect_refusal = detect_refusal
        self.detect_contradiction = detect_contradiction

        self._refusal_res = [re.compile(p, re.IGNORECASE) for p in self.DEFAULT_REFUSAL_PATTERNS]
        self._contradiction_res = [re.compile(p, re.IGNORECASE | re.DOTALL) for p in self.DEFAULT_CONTRADICTION_PATTERNS]

    @staticmethod
    def compute_ngram_repetition_ratio(text: str, n: int = 4) -> float:
        """Calculates ratio of duplicate n-grams in tokenized word stream."""
        words = re.findall(r"\b\w+\b", text.lower())
        if len(words) < n * 2:
            return 0.0
        ngrams = [tuple(words[i : i + n]) for i in range(len(words) - n + 1)]
        if not ngrams:
            return 0.0
        unique_ngrams = set(ngrams)
        return 1.0 - (len(unique_ngrams) / len(ngrams))

    @staticmethod
    def compute_compression_ratio(text: str) -> float:
        """Calculates zlib compression ratio. Extreme repetitive loops compress heavily (< 0.15)."""
        data = text.encode("utf-8")
        if not data:
            return 1.0
        compressed = zlib.compress(data)
        return len(compressed) / len(data)

    def validate(self, sample: DistillationSample) -> FilterResult:
        """Validate sample against all quality filters."""
        # 1. Instruction length constraints
        inst_len = len(sample.instruction.strip())
        if inst_len < self.min_instruction_len:
            return FilterResult(
                passed=False,
                reason=f"Instruction too short: {inst_len} < {self.min_instruction_len}",
                metrics={"inst_len": inst_len},
            )
        if inst_len > self.max_instruction_len:
            return FilterResult(
                passed=False,
                reason=f"Instruction too long: {inst_len} > {self.max_instruction_len}",
                metrics={"inst_len": inst_len},
            )

        # 2. Output length constraints
        out_len = len(sample.output.strip())
        if out_len < self.min_output_len:
            return FilterResult(
                passed=False,
                reason=f"Output too short: {out_len} < {self.min_output_len}",
                metrics={"out_len": out_len},
            )
        if out_len > self.max_output_len:
            return FilterResult(
                passed=False,
                reason=f"Output too long: {out_len} > {self.max_output_len}",
                metrics={"out_len": out_len},
            )

        # 3. Repetition penalty check
        rep_ratio = self.compute_ngram_repetition_ratio(sample.output, n=4)
        if rep_ratio > self.max_repetition_ratio:
            return FilterResult(
                passed=False,
                reason=f"Degenerate repetition detected: ratio {rep_ratio:.2f} > {self.max_repetition_ratio}",
                metrics={"repetition_ratio": rep_ratio},
            )

        # 4. Compression ratio check (detects pathological repetitive token cycling)
        if out_len > 200:
            comp_ratio = self.compute_compression_ratio(sample.output)
            if comp_ratio < self.min_compression_ratio:
                return FilterResult(
                    passed=False,
                    reason=f"Pathological compression ratio (cyclical loop): {comp_ratio:.2f} < {self.min_compression_ratio}",
                    metrics={"compression_ratio": comp_ratio},
                )

        # 5. Refusal detection
        if self.detect_refusal:
            out_lower = sample.output.lower()
            for pattern in self._refusal_res:
                if pattern.search(out_lower):
                    return FilterResult(
                        passed=False,
                        reason=f"Disallowed refusal / boilerplate detected: pattern '{pattern.pattern}'",
                        metrics={"refusal": 1.0},
                    )

        # 6. Contradiction detection
        if self.detect_contradiction:
            for pattern in self._contradiction_res:
                if pattern.search(sample.output):
                    return FilterResult(
                        passed=False,
                        reason=f"Self-contradiction detected in output: pattern '{pattern.pattern}'",
                        metrics={"contradiction": 1.0},
                    )

        return FilterResult(
            passed=True,
            metrics={
                "inst_len": inst_len,
                "out_len": out_len,
                "repetition_ratio": rep_ratio,
            },
        )

    def filter_batch(
        self, samples: List[DistillationSample]
    ) -> Tuple[List[DistillationSample], List[Tuple[DistillationSample, FilterResult]]]:
        """Filters a list of samples, returning accepted and rejected lists."""
        accepted: List[DistillationSample] = []
        rejected: List[Tuple[DistillationSample, FilterResult]] = []

        for s in samples:
            res = self.validate(s)
            if res.passed:
                accepted.append(s)
            else:
                rejected.append((s, res))

        return accepted, rejected


# ==============================================================================
# 3. DISTILLATION PIPELINE & SELF-CORRECTION
# ==============================================================================

class SyntheticDistillationPipeline:
    """Orchestrates generation, self-correction, validation, and dataset preparation."""

    def __init__(self, validator: Optional[HeuristicValidationFilter] = None):
        self.validator = validator or HeuristicValidationFilter()
        self.samples: List[DistillationSample] = []

    def self_correct(self, sample: DistillationSample) -> DistillationSample:
        """Self-corrects raw teacher outputs by cleaning artifacts and normalizing formatting."""
        cleaned_out = sample.output

        # 1. Strip raw think tags or scratchpads if present in output
        cleaned_out = re.sub(r"<think>.*?</think>", "", cleaned_out, flags=re.DOTALL).strip()

        # 2. Normalize whitespace and excessive newlines
        cleaned_out = re.sub(r"\r\n", "\n", cleaned_out)
        cleaned_out = re.sub(r"\n{3,}", "\n\n", cleaned_out).strip()

        # 3. Strip leading conversational pleasantries / mush
        pleasantry_pattern = r"^(?:Sure thing!?|Certainly!?|Here is (?:the|your) answer:?|I would be happy to help!?|Of course!?)\s*"
        while re.match(pleasantry_pattern, cleaned_out, flags=re.IGNORECASE):
            cleaned_out = re.sub(pleasantry_pattern, "", cleaned_out, count=1, flags=re.IGNORECASE).strip()

        # 4. Clean instruction
        cleaned_inst = re.sub(r"\r\n", "\n", sample.instruction).strip()
        cleaned_inst = re.sub(r"\s+", " ", cleaned_inst)

        return DistillationSample(
            instruction=cleaned_inst,
            output=cleaned_out,
            input=sample.input.strip(),
            system_prompt=sample.system_prompt.strip(),
            id=sample.id,
            domain=sample.domain,
            metadata=sample.metadata,
        )

    def process(
        self, raw_samples: List[Dict[str, Any] | DistillationSample], auto_correct: bool = True
    ) -> Tuple[List[DistillationSample], List[Tuple[DistillationSample, FilterResult]]]:
        """Ingests raw teacher samples, applies self-correction, and filters against quality gates."""
        converted: List[DistillationSample] = []

        for item in raw_samples:
            if isinstance(item, DistillationSample):
                s = item
            elif "conversations" in item:
                s = DistillationSample.from_sharegpt(item)
            elif "messages" in item:
                s = DistillationSample.from_chatml(item)
            else:
                s = DistillationSample.from_alpaca(item)

            if auto_correct:
                s = self.self_correct(s)

            converted.append(s)

        accepted, rejected = self.validator.filter_batch(converted)
        self.samples.extend(accepted)
        return accepted, rejected

    def export_jsonl(
        self,
        filepath: Path | str,
        samples: Optional[List[DistillationSample]] = None,
        schema: str = "chatml",
    ) -> int:
        """Exports dataset to JSONL in the desired schema."""
        target_samples = samples if samples is not None else self.samples
        return export_dataset_jsonl(target_samples, filepath, schema=schema)

    @staticmethod
    def partition_train_val(
        samples: List[DistillationSample],
        val_ratio: float = 0.1,
        seed: int = 42,
    ) -> Tuple[List[DistillationSample], List[DistillationSample]]:
        """Deterministically partitions samples into train and validation splits."""
        if not samples:
            return [], []

        shuffled = list(samples)
        rng = random.Random(seed)
        rng.shuffle(shuffled)

        val_size = max(1, int(len(shuffled) * val_ratio)) if val_ratio > 0 else 0
        val_set = shuffled[:val_size]
        train_set = shuffled[val_size:]
        return train_set, val_set


# ==============================================================================
# 4. EXPORT & LOAD UTILITIES
# ==============================================================================

def export_dataset_jsonl(
    samples: List[DistillationSample],
    filepath: Path | str,
    schema: str = "chatml",
) -> int:
    """Exports samples to JSONL in the specified fine-tuning schema ('chatml', 'alpaca', 'sharegpt')."""
    path = Path(filepath)
    path.parent.mkdir(parents=True, exist_ok=True)

    count = 0
    with open(path, "w", encoding="utf-8") as f:
        for s in samples:
            if schema == "alpaca":
                rec = s.to_alpaca()
            elif schema == "sharegpt":
                rec = s.to_sharegpt()
            else:
                rec = s.to_chatml()

            line = json.dumps(rec, ensure_ascii=False)
            f.write(line + "\n")
            count += 1

    return count


def load_dataset_jsonl(
    filepath: Path | str,
    schema: str = "chatml",
    domain: str = "general",
) -> List[DistillationSample]:
    """Loads distillation dataset from JSONL in the specified schema."""
    path = Path(filepath)
    if not path.is_file():
        raise FileNotFoundError(f"Dataset file not found: {path}")

    samples: List[DistillationSample] = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line_str = line.strip()
            if not line_str:
                continue
            data = json.loads(line_str)
            if schema == "alpaca":
                samples.append(DistillationSample.from_alpaca(data, domain=domain))
            elif schema == "sharegpt":
                samples.append(DistillationSample.from_sharegpt(data, domain=domain))
            else:
                samples.append(DistillationSample.from_chatml(data, domain=domain))

    return samples
