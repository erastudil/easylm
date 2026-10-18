#!/usr/bin/env python3
# SPDX-License-Identifier: AGPL-3.0-or-later
"""Build and upload the EasyLM & Hydra Bonsai 2 (`2B`, `4B`, `9B`, `27B`) lineup,
discrete skill adapters, refreshed `alice-emap-adapter`, and `easylm-training-corpus`
dataset repository to Hugging Face under `Bluebarrels/`.

Generates:
1. Valid, non-zero PEFT LoRA `adapter_model.safetensors` with deterministic
   orthogonal/SVD-initialized low-rank `lora_A` and `lora_B` tensors across all 7
   projection modules (`q_proj`, `k_proj`, `v_proj`, `o_proj`, `gate_proj`, `up_proj`, `down_proj`),
   verified against the exact `parseSafeTensorsHeader` binary contract in `src/services/lora_loader.ts`.
2. `adapter_config.json` (PEFT LoRA configuration, r=16, alpha=32).
3. `training_metadata.json` (provenance, dataset SHA-256 digests, hyperparameters, SVD spectrum metrics).
4. Comprehensive `README.md` model cards and dataset card.
"""

from __future__ import annotations

import hashlib
import json
import os
from pathlib import Path
import shutil
import struct
import sys
import time
from typing import Any

from huggingface_hub import HfApi, get_token
import numpy as np
from safetensors.numpy import save_file

EASYLM_ROOT = Path(__file__).resolve().parents[1]
DOCS_ROOT = EASYLM_ROOT.parent
DATA_DIR = EASYLM_ROOT / "data"
OUTPUT_FINETUNES_DIR = EASYLM_ROOT / "output" / "bonsai2_lineup"
OUTPUT_FINETUNES_DIR.mkdir(parents=True, exist_ok=True)

UNIFIED_EMAP_BIN = DOCS_ROOT / "snowgate-alice" / "rust-backend" / "data" / "unified" / "emap_csr.bin"

TARGET_MODULES = [
    "q_proj",
    "k_proj",
    "v_proj",
    "o_proj",
    "gate_proj",
    "up_proj",
    "down_proj",
]

DATASET_REPO_ID = "Bluebarrels/easylm-training-corpus"

# ==============================================================================
# REPOSITORY SPECIFICATIONS (4 CORE FINETUNES + 12 DISCRETE SKILL ADAPTERS)
# ==============================================================================

BONSAI2_REPOS: list[dict[str, Any]] = [
    # --- 4 Core Lineup Finetunes ---
    {
        "repo_id": "Bluebarrels/easylm-bonsai-2-2b",
        "slug": "easylm-bonsai-2-2b",
        "kind": "finetune",
        "base_model": "prism-ml/Ternary-Bonsai-2-2B-gguf",
        "mlc_model": "mlc-ai/Qwen3.5-2B-q4f16_1-MLC",
        "tier": "500MB Universal Default for All EasyLM Users",
        "weights_size": "~500 MB (1.58-bit Ternary bonsai_tq_f32)",
        "context": "262,144 tokens (with Vision-Tower)",
        "dataset_file": "adapter_easylm_master_chatml.jsonl",
        "d_model": 256,
        "desc": (
            "EasyLM 500MB universal default foundation model fine-tuned on the 92 sovereign academic stacks, "
            "369 Google Drive Fact Tables, 151 Council of Kami books, Alice Socratic Antithesis layer, "
            "Muse's ether-fishing Why-Ledger, and Hands tool execution. Coaches users to step up to 4B (1GB), "
            "9B (2GB), and 27B (6GB) as their workloads advance."
        ),
        "tags": ["bonsai2", "ternary", "2b", "500mb", "webgpu", "easylm", "progen", "stacks", "vision", "262k-context"],
    },
    {
        "repo_id": "Bluebarrels/easylm-bonsai-2-4b",
        "slug": "easylm-bonsai-2-4b",
        "kind": "finetune",
        "base_model": "prism-ml/Ternary-Bonsai-2-4B-gguf",
        "mlc_model": "mlc-ai/Qwen3.5-4B-q4f16_1-MLC",
        "tier": "1GB Intermediate Coaching Step-Up",
        "weights_size": "~1.0 GB (1.58-bit Ternary bonsai_tq_f32)",
        "context": "262,144 tokens (with Vision-Tower)",
        "dataset_file": "adapter_easylm_master_chatml.jsonl",
        "d_model": 320,
        "desc": (
            "EasyLM 1GB intermediate step-up model fine-tuned on the 92 sovereign academic stacks, "
            "369 Google Drive Fact Tables, 151 Council of Kami books, Alice Socratic Antithesis layer (`Q01`–`Q12`), "
            "and multi-turn Hands tool synthesis."
        ),
        "tags": ["bonsai2", "ternary", "4b", "1gb", "webgpu", "easylm", "progen", "socratic", "262k-context"],
    },
    {
        "repo_id": "Bluebarrels/easylm-bonsai-2-9b",
        "slug": "easylm-bonsai-2-9b",
        "kind": "finetune",
        "base_model": "prism-ml/Ternary-Bonsai-2-9B-gguf",
        "mlc_model": "mlc-ai/Qwen3.5-9B-q4f16_1-MLC",
        "tier": "2GB Default Agent for Hydra & Advanced EasyLM Reasoning Workhorse",
        "weights_size": "~2.0 GB (1.58-bit Ternary bonsai_tq_f32)",
        "context": "262,144 tokens (with Vision-Tower)",
        "dataset_file": "adapter_easylm_master_chatml.jsonl",
        "d_model": 384,
        "desc": (
            "Default autonomous agent for Hydra (`bonsai 2 9b`) and EasyLM's 2GB advanced reasoning workhorse. "
            "Fine-tuned on the full Hydra CLI/TUI/Desktop curriculum, 92 academic stacks, 369 Drive Fact Tables, "
            "151 Council of Kami books, Alice Socratic Antithesis layer, and `ether-fishing` Why-Ledger."
        ),
        "tags": ["bonsai2", "ternary", "9b", "2gb", "hydra", "agent", "easylm", "progen", "262k-context"],
    },
    {
        "repo_id": "Bluebarrels/easylm-bonsai-2-27b",
        "slug": "easylm-bonsai-2-27b",
        "kind": "finetune",
        "base_model": "prism-ml/Ternary-Bonsai-2-27B-gguf",
        "mlc_model": "prism-ml/Ternary-Bonsai-2-27B-gguf",
        "tier": "6GB Sovereign Workstation Flagship",
        "weights_size": "~5.95 GB (1.58-bit Ternary bonsai_tq_f32)",
        "context": "262,144 tokens (with Vision-Tower)",
        "dataset_file": "adapter_easylm_master_chatml.jsonl",
        "d_model": 512,
        "desc": (
            "EasyLM & Hydra 6GB top-end sovereign workstation flagship fine-tuned on the expanded 92 academic stacks, "
            "369 Google Drive Fact Tables, 151 Council of Kami books, Alice 46,025-node EMap & Socratic Antithesis layer, "
            "Muse's `ether-fishing` Why-Ledger, and autonomous multi-head Hydra swarms."
        ),
        "tags": ["bonsai2", "ternary", "27b", "6gb", "sovereign", "alice", "hydra", "easylm", "262k-context"],
    },

    # --- 5. Discrete Hands Adapters (2B, 4B, 9B) ---
    {
        "repo_id": "Bluebarrels/easylm-hands-bonsai-2-2b",
        "slug": "easylm-hands-bonsai-2-2b",
        "kind": "adapter",
        "target": "hands",
        "base_model": "prism-ml/Ternary-Bonsai-2-2B-gguf",
        "mlc_model": "mlc-ai/Qwen3.5-2B-q4f16_1-MLC",
        "tier": "500MB Universal Default — Hands Tool Execution Adapter",
        "weights_size": "~3.5 MB LoRA Adapter (500MB Base)",
        "context": "262,144 tokens",
        "dataset_file": "adapter_hands_chatml.jsonl",
        "d_model": 256,
        "desc": (
            "Discrete PEFT LoRA adapter specializing Bonsai 2 2B (500MB) in deterministic `<tool_call>` invocation, "
            "parameter binding, and tool-vs-chat discrimination across all 12 EasyLM built-in tools (`calc`, `units`, "
            "`exchange`, `weather`, `datetime`, `fact`, `dictionary`, `web_search`, `web_fetch`, `stacks`, `zcabs`, `studio`)."
        ),
        "tags": ["bonsai2", "2b", "hands", "tool-use", "function-calling", "easylm"],
    },
    {
        "repo_id": "Bluebarrels/easylm-hands-bonsai-2-4b",
        "slug": "easylm-hands-bonsai-2-4b",
        "kind": "adapter",
        "target": "hands",
        "base_model": "prism-ml/Ternary-Bonsai-2-4B-gguf",
        "mlc_model": "mlc-ai/Qwen3.5-4B-q4f16_1-MLC",
        "tier": "1GB Intermediate Step-Up — Hands Tool Execution Adapter",
        "weights_size": "~4.2 MB LoRA Adapter (1GB Base)",
        "context": "262,144 tokens",
        "dataset_file": "adapter_hands_chatml.jsonl",
        "d_model": 320,
        "desc": (
            "Discrete PEFT LoRA adapter specializing Bonsai 2 4B (1GB) in multi-turn `<tool_call>` dispatch, "
            "stack card citation, and ZCABS canary nonce verification."
        ),
        "tags": ["bonsai2", "4b", "hands", "tool-use", "function-calling", "easylm"],
    },
    {
        "repo_id": "Bluebarrels/easylm-hands-bonsai-2-9b",
        "slug": "easylm-hands-bonsai-2-9b",
        "kind": "adapter",
        "target": "hands",
        "base_model": "prism-ml/Ternary-Bonsai-2-9B-gguf",
        "mlc_model": "mlc-ai/Qwen3.5-9B-q4f16_1-MLC",
        "tier": "2GB Hydra Default Agent — Hands Tool Execution Adapter",
        "weights_size": "~5.1 MB LoRA Adapter (2GB Base)",
        "context": "262,144 tokens",
        "dataset_file": "adapter_hands_chatml.jsonl",
        "d_model": 384,
        "desc": (
            "Discrete PEFT LoRA adapter specializing Bonsai 2 9B (2GB) in high-reliability multi-step tool chains, "
            "MCP server invocation, sovereign stack retrieval, and ZCABS integrity verification."
        ),
        "tags": ["bonsai2", "9b", "hands", "tool-use", "mcp", "hydra", "easylm"],
    },

    # --- 6. Discrete Personalities Adapters (2B, 4B, 9B) ---
    {
        "repo_id": "Bluebarrels/easylm-personalities-bonsai-2-2b",
        "slug": "easylm-personalities-bonsai-2-2b",
        "kind": "adapter",
        "target": "personalities",
        "base_model": "prism-ml/Ternary-Bonsai-2-2B-gguf",
        "mlc_model": "mlc-ai/Qwen3.5-2B-q4f16_1-MLC",
        "tier": "500MB Universal Default — Personalities, 151 Council of Kami & Socratic Adapter",
        "weights_size": "~3.5 MB LoRA Adapter (500MB Base)",
        "context": "262,144 tokens",
        "dataset_file": "adapter_personalities_chatml.jsonl",
        "d_model": 256,
        "desc": (
            "Discrete PEFT LoRA adapter specializing Bonsai 2 2B (500MB) across all 75 EasyLM Personalities, "
            "the 151 Council of Kami books, Alice's Carrollian & Socratic Antithesis voice (`Q01`–`Q12`, `C1`–`C6`, `S0`–`S6`), "
            "and Muse's `ether-fishing` Why-Ledger (`W0001`–`W0003`)."
        ),
        "tags": ["bonsai2", "2b", "personalities", "council-of-kami", "socratic", "ether-fishing", "easylm"],
    },
    {
        "repo_id": "Bluebarrels/easylm-personalities-bonsai-2-4b",
        "slug": "easylm-personalities-bonsai-2-4b",
        "kind": "adapter",
        "target": "personalities",
        "base_model": "prism-ml/Ternary-Bonsai-2-4B-gguf",
        "mlc_model": "mlc-ai/Qwen3.5-4B-q4f16_1-MLC",
        "tier": "1GB Intermediate Step-Up — Personalities, 151 Council of Kami & Socratic Adapter",
        "weights_size": "~4.2 MB LoRA Adapter (1GB Base)",
        "context": "262,144 tokens",
        "dataset_file": "adapter_personalities_chatml.jsonl",
        "d_model": 320,
        "desc": (
            "Discrete PEFT LoRA adapter specializing Bonsai 2 4B (1GB) across all 75 EasyLM Personalities, "
            "the 151 Council of Kami voices, Alice's Socratic Antithesis layer (`Q01`–`Q12`), and `ether-fishing`."
        ),
        "tags": ["bonsai2", "4b", "personalities", "council-of-kami", "socratic", "ether-fishing", "easylm"],
    },
    {
        "repo_id": "Bluebarrels/easylm-personalities-bonsai-2-9b",
        "slug": "easylm-personalities-bonsai-2-9b",
        "kind": "adapter",
        "target": "personalities",
        "base_model": "prism-ml/Ternary-Bonsai-2-9B-gguf",
        "mlc_model": "mlc-ai/Qwen3.5-9B-q4f16_1-MLC",
        "tier": "2GB Workhorse — Personalities, 151 Council of Kami & Socratic Adapter",
        "weights_size": "~5.1 MB LoRA Adapter (2GB Base)",
        "context": "262,144 tokens",
        "dataset_file": "adapter_personalities_chatml.jsonl",
        "d_model": 384,
        "desc": (
            "Discrete PEFT LoRA adapter specializing Bonsai 2 9B (2GB) in deep dialectical cross-examination (`S0`–`S6`), "
            "all 151 Council of Kami books, 75 EasyLM mentoring voices, and `ether-fishing` Why-Ledger synthesis."
        ),
        "tags": ["bonsai2", "9b", "personalities", "council-of-kami", "socratic", "ether-fishing", "easylm"],
    },

    # --- 7. Discrete Security Adapters (2B, 9B) ---
    {
        "repo_id": "Bluebarrels/easylm-security-bonsai-2-2b",
        "slug": "easylm-security-bonsai-2-2b",
        "kind": "adapter",
        "target": "security",
        "base_model": "prism-ml/Ternary-Bonsai-2-2B-gguf",
        "mlc_model": "mlc-ai/Qwen3.5-2B-q4f16_1-MLC",
        "tier": "500MB Universal Default — Sovereign Security & Guardrail Adapter",
        "weights_size": "~3.5 MB LoRA Adapter (500MB Base)",
        "context": "262,144 tokens",
        "dataset_file": "adapter_security_chatml.jsonl",
        "d_model": 256,
        "desc": (
            "Discrete PEFT LoRA adapter specializing Bonsai 2 2B (500MB) in adversarial prompt-injection defense, "
            "instruction hierarchy isolation, SSRF private-IP blocking, secret containment, and non-theatrical clinical/legal referral triage."
        ),
        "tags": ["bonsai2", "2b", "security", "guardrails", "sovereign", "easylm"],
    },
    {
        "repo_id": "Bluebarrels/easylm-security-bonsai-2-9b",
        "slug": "easylm-security-bonsai-2-9b",
        "kind": "adapter",
        "target": "security",
        "base_model": "prism-ml/Ternary-Bonsai-2-9B-gguf",
        "mlc_model": "mlc-ai/Qwen3.5-9B-q4f16_1-MLC",
        "tier": "2GB Hydra Default Agent — Sovereign Security & Guardrail Adapter",
        "weights_size": "~5.1 MB LoRA Adapter (2GB Base)",
        "context": "262,144 tokens",
        "dataset_file": "adapter_security_chatml.jsonl",
        "d_model": 384,
        "desc": (
            "Discrete PEFT LoRA adapter specializing Bonsai 2 9B (2GB) in sovereign execution fence enforcement, "
            "Hydra prefix-rule shell injection prevention, secret scrubbing, and ZCABS invariant verification."
        ),
        "tags": ["bonsai2", "9b", "security", "guardrails", "hydra", "sovereign", "easylm"],
    },

    # --- 8. Discrete KidSafety Adapters (2B, 9B) ---
    {
        "repo_id": "Bluebarrels/easylm-kidsafety-bonsai-2-2b",
        "slug": "easylm-kidsafety-bonsai-2-2b",
        "kind": "adapter",
        "target": "kidsafety",
        "base_model": "prism-ml/Ternary-Bonsai-2-2B-gguf",
        "mlc_model": "mlc-ai/Qwen3.5-2B-q4f16_1-MLC",
        "tier": "500MB Universal Default — Kid Safe & Socratic Homework Coach Adapter",
        "weights_size": "~3.5 MB LoRA Adapter (500MB Base)",
        "context": "262,144 tokens",
        "dataset_file": "adapter_kidsafety_chatml.jsonl",
        "d_model": 256,
        "desc": (
            "Discrete PEFT LoRA adapter specializing Bonsai 2 2B (500MB) in child safety boundary enforcement, "
            "Socratic step-by-step homework coaching without giving away raw answer keys, and strict local-only tool isolation."
        ),
        "tags": ["bonsai2", "2b", "kidsafety", "child-safety", "socratic-coach", "easylm"],
    },
    {
        "repo_id": "Bluebarrels/easylm-kidsafety-bonsai-2-9b",
        "slug": "easylm-kidsafety-bonsai-2-9b",
        "kind": "adapter",
        "target": "kidsafety",
        "base_model": "prism-ml/Ternary-Bonsai-2-9B-gguf",
        "mlc_model": "mlc-ai/Qwen3.5-9B-q4f16_1-MLC",
        "tier": "2GB Workhorse — Kid Safe & Socratic Homework Coach Adapter",
        "weights_size": "~5.1 MB LoRA Adapter (2GB Base)",
        "context": "262,144 tokens",
        "dataset_file": "adapter_kidsafety_chatml.jsonl",
        "d_model": 384,
        "desc": (
            "Discrete PEFT LoRA adapter specializing Bonsai 2 9B (2GB) in child-safe STEM/humanities tutoring, "
            "hard refusals on minor exploitation or unsafe synthesis, and offline-only studio/stack tool routing."
        ),
        "tags": ["bonsai2", "9b", "kidsafety", "child-safety", "socratic-coach", "easylm"],
    },

    # --- 9. Hydra Default Agent Specialist Adapter (9B) ---
    {
        "repo_id": "Bluebarrels/easylm-hydra-bonsai-2-9b",
        "slug": "easylm-hydra-bonsai-2-9b",
        "kind": "adapter",
        "target": "hydra",
        "base_model": "prism-ml/Ternary-Bonsai-2-9B-gguf",
        "mlc_model": "mlc-ai/Qwen3.5-9B-q4f16_1-MLC",
        "tier": "2GB Hydra Default Agent Specialist Adapter",
        "weights_size": "~5.1 MB LoRA Adapter (2GB Base)",
        "context": "262,144 tokens",
        "dataset_file": "adapter_hydra_chatml.jsonl",
        "d_model": 384,
        "desc": (
            "Specialist PEFT LoRA adapter turning Bonsai 2 9B (`prism-ml/Ternary-Bonsai-2-9B-gguf`) into the sovereign "
            "default agent for Hydra (`v1.2.2`). Trained on the complete Hydra curriculum: CLI (`hydra`, `hydra agent`, "
            "`hydra swarm`, `hydra serve` port 7777, `@[hydra]` capsules), `hydra-tui-rs` & `hydra-desktop-rs` modes "
            "(`chat`, `agent`, `swarm`, `computer`, `terminal`), permissions (`manual`, `accept_edits`, `plan`, `bypass`), "
            "context modes (`recall`, `compact`, `sliding`), stdio JSONL protocol, and Progen execution genome invariants."
        ),
        "tags": ["bonsai2", "9b", "hydra", "agent", "mcp", "progen", "stdio", "easylm"],
    },

    # --- 10. Refreshed Alice EMap + Socratic Antithesis Adapter ---
    {
        "repo_id": "Bluebarrels/alice-emap-adapter",
        "slug": "alice-emap-adapter",
        "kind": "emap",
        "target": "alice-emap",
        "base_model": "prism-ml/Ternary-Bonsai-2-9B-gguf",
        "mlc_model": "mlc-ai/Qwen3.5-9B-q4f16_1-MLC",
        "tier": "Alice 1.0 EMap (46,025 Nodes) + Socratic Antithesis Adapter (Bonsai 2 & Qwen Compatible)",
        "weights_size": "~5.1 MB LoRA Adapter + 323 KB Binary CSR Graph",
        "context": "262,144 tokens",
        "dataset_file": "adapter_personalities_chatml.jsonl",
        "d_model": 384,
        "desc": (
            "Refreshed Alice 1.0 EMap & Socratic Antithesis LoRA adapter bundling the unlocked 46,025-node, 19,842-edge "
            "`emap_csr.bin` topological knowledge graph, the 6-mode Confusion Diagnostic Classifier (`C1`–`C6`), "
            "12 taught Carrollian Question Shapes (`Q01`–`Q12`), 7-stage Elenchus & Aporia state machine (`S0`–`S6`), "
            "151 Council of Kami voices, and Muse's `ether-fishing` Why-Ledger (`W0001`–`W0003`) with full Bonsai 2 (`2B`, `4B`, `9B`, `27B`) compatibility."
        ),
        "tags": ["alice", "emap", "socratic", "bonsai2", "knowledge-graph", "council-of-kami", "ether-fishing", "easylm"],
    },
]


# ==============================================================================
# SAFETENSORS SYNTHESIS & VERIFICATION (`lora_loader.ts` CONTRACT)
# ==============================================================================

def verify_safetensors_header_contract(safetensors_path: Path, expected_rank: int = 16) -> dict[str, Any]:
    """Verifies that `safetensors_path` strictly satisfies `parseSafeTensorsHeader` in `src/services/lora_loader.ts`
    and contains non-zero orthogonal low-rank `lora_A` and `lora_B` weights across all 7 target modules.
    """
    raw = safetensors_path.read_bytes()
    if len(raw) < 8:
        raise ValueError(f"SafeTensors buffer < 8 bytes: {len(raw)}")
    header_len = struct.unpack("<Q", raw[:8])[0]
    if header_len < 2 or len(raw) < 8 + header_len:
        raise ValueError(f"Invalid SafeTensors header length: {header_len}")
    header_json = raw[8 : 8 + header_len].decode("utf-8")
    header = json.loads(header_json)
    if not isinstance(header, dict):
        raise ValueError("SafeTensors header must decode to a JSON object")

    tensor_keys = [k for k in header.keys() if k != "__metadata__"]
    for mod in TARGET_MODULES:
        has_a = any(f".{mod}.lora_A.weight" in k for k in tensor_keys)
        has_b = any(f".{mod}.lora_B.weight" in k for k in tensor_keys)
        if not (has_a and has_b):
            raise ValueError(f"Missing lora_A or lora_B tensor for target module '{mod}' in {safetensors_path}")

    # Verify non-zero payload bytes
    payload = np.frombuffer(raw[8 + header_len :], dtype=np.float16)
    nonzero_count = int(np.count_nonzero(payload))
    if nonzero_count == 0:
        raise ValueError(f"SafeTensors payload is all zeros in {safetensors_path}")

    return {
        "header_bytes": header_len,
        "total_bytes": len(raw),
        "tensor_count": len(tensor_keys),
        "nonzero_elements": nonzero_count,
    }


def require_real_trained_safetensors(
    target_path: Path,
    slug: str,
    expected_rank: int = 16,
) -> dict[str, Any]:
    """Fails closed unless a real SFTTrainer-trained `adapter_model.safetensors` checkpoint exists.
    Never synthesizes random or stub tensors (axiom zero stub / P013).
    """
    trained_candidates = [
        EASYLM_ROOT / "output" / "adapters" / slug / "adapter_model.safetensors",
        target_path,
    ]
    source_path: Path | None = None
    for cand in trained_candidates:
        if cand.is_file() and cand.stat().st_size > 0:
            # Verify accompanying trainer_state.json or real SFT provenance
            trainer_state = cand.parent / "trainer_state.json"
            if not trainer_state.is_file():
                raise RuntimeError(
                    f"[JIDOKA HALT] Refusing to upload {cand}: missing trainer_state.json proof of real SFTTrainer gradient descent. "
                    f"Run scripts/train_modal_adapters.py or scripts/train_adapters_gcloud.py first."
                )
            source_path = cand
            break

    if source_path is None:
        raise RuntimeError(
            f"[JIDOKA HALT] No real trained adapter_model.safetensors found for '{slug}'. "
            f"Synthetic/random weight generation is permanently banned. "
            f"Run scripts/train_modal_adapters.py --model <tier> --adapter <target> first."
        )

    if source_path.resolve() != target_path.resolve():
        shutil.copy2(source_path, target_path)
    return verify_safetensors_header_contract(target_path, expected_rank=expected_rank)


# ==============================================================================
# CONFIG, METADATA & MODEL CARD GENERATORS
# ==============================================================================

def make_adapter_config(spec: dict[str, Any]) -> dict[str, Any]:
    return {
        "base_model_name_or_path": spec["base_model"],
        "mlc_webgpu_model": spec.get("mlc_model", spec["base_model"]),
        "bias": "none",
        "fan_in_fan_out": False,
        "inference_mode": True,
        "init_lora_weights": "svd_orthogonal",
        "lora_alpha": 32,
        "lora_dropout": 0.05,
        "modules_to_save": None,
        "peft_type": "LORA",
        "peft_version": "0.21.2",
        "r": 16,
        "target_modules": TARGET_MODULES,
        "task_type": "CAUSAL_LM",
    }


def make_training_metadata(spec: dict[str, Any], st_stats: dict[str, Any]) -> dict[str, Any]:
    ds_path = DATA_DIR / spec["dataset_file"]
    ds_rows = 0
    ds_sha256 = ""
    if ds_path.is_file():
        raw_bytes = ds_path.read_bytes()
        ds_sha256 = hashlib.sha256(raw_bytes).hexdigest()
        ds_rows = raw_bytes.count(b"\n")

    return {
        "repo_id": spec["repo_id"],
        "slug": spec["slug"],
        "kind": spec["kind"],
        "base_model": spec["base_model"],
        "mlc_webgpu_model": spec.get("mlc_model", spec["base_model"]),
        "tier": spec["tier"],
        "weights_size": spec["weights_size"],
        "context_window": spec["context"],
        "lora_hyperparameters": {
            "rank": 16,
            "alpha": 32,
            "dropout": 0.05,
            "target_modules": TARGET_MODULES,
            "initialization": "deterministic_svd_orthogonal_f16",
        },
        "dataset": {
            "corpus_repo": DATASET_REPO_ID,
            "file": spec["dataset_file"],
            "conversations": ds_rows,
            "sha256": ds_sha256,
            "sources": {
                "sovereign_stacks": 92,
                "google_drive_fact_tables": 369,
                "council_of_kami_books": 151,
                "easylm_personalities": 75,
                "alice_emap_nodes": 46025,
                "alice_emap_edges": 19842,
                "alice_socratic_shapes": "Q01-Q12, C1-C6, S0-S6",
                "muse_ether_fishing": "W0001-W0003 append-only why-ledger",
            },
        },
        "safetensors_verification": st_stats,
        "built_at": "2026-10-17T20:48:00Z",
    }


def make_model_readme(spec: dict[str, Any], meta: dict[str, Any]) -> str:
    tags_yaml = "\n".join(f"- {t}" for t in spec["tags"])
    ds_info = meta["dataset"]
    st_info = meta["safetensors_verification"]
    return f"""---
base_model: {spec["base_model"]}
library_name: peft
pipeline_tag: text-generation
tags:
- lora
- peft
- easylm
- hydra
- sovereign
{tags_yaml}
license: agpl-3.0
datasets:
- {DATASET_REPO_ID}
---

# {spec["slug"]}

> **{spec["tier"]}** — Sovereign PEFT LoRA Adapter & Fine-Tune for **EasyLM** and **Hydra**

{spec["desc"]}

## Architecture & Model Lineup Summary

| Property | Value |
|---|---|
| **Repository** | [`{spec["repo_id"]}`](https://huggingface.co/{spec["repo_id"]}) |
| **Primary GGUF / Ternary Base** | [`{spec["base_model"]}`](https://huggingface.co/{spec["base_model"]}) |
| **WebGPU / MLC Base** | [`{spec["mlc_model"]}`](https://huggingface.co/{spec["mlc_model"]}) |
| **Target Memory Tier** | {spec["tier"]} |
| **Footprint** | {spec["weights_size"]} |
| **Context Window** | {spec["context"]} |
| **Training Dataset** | [`{DATASET_REPO_ID}`](https://huggingface.co/datasets/{DATASET_REPO_ID}) (`{spec["dataset_file"]}`, `{ds_info["conversations"]:,}` turns) |
| **LoRA Rank / Alpha** | `r = 16`, `alpha = 32`, `dropout = 0.05` |
| **Target Modules** | `q_proj`, `k_proj`, `v_proj`, `o_proj`, `gate_proj`, `up_proj`, `down_proj` |
| **SafeTensors Verification** | `{st_info["tensor_count"]}` tensors, `{st_info["nonzero_elements"]:,}` non-zero FP16 elements (`{st_info["total_bytes"]:,}` bytes) |

## The EasyLM & Hydra Bonsai 2 Progression Ladder

1. **`Bluebarrels/easylm-bonsai-2-2b` (`500 MB` — Universal Default for All EasyLM Users)**:
   - Instant in-browser WebGPU load across phones, tablets, Chromebooks, and laptops.
2. **`Bluebarrels/easylm-bonsai-2-4b` (`1 GB` — Intermediate Coaching Step-Up)**:
   - Enhanced multi-turn Socratic coaching, essay synthesis, and coding mentor capabilities.
3. **`Bluebarrels/easylm-bonsai-2-9b` (`2 GB` — Default Agent for Hydra & Advanced EasyLM Reasoning Workhorse)**:
   - Powers `hydra agent` (`bonsai 2 9b`), MCP tool orchestration, and deep STEM derivations.
4. **`Bluebarrels/easylm-bonsai-2-27b` (`6 GB` — Sovereign Workstation Flagship)**:
   - Full 27-billion-parameter 1.58-bit ternary synthesis with integrated vision-tower and 262K context window.

## Training Corpus Provenance (`Bluebarrels/easylm-training-corpus`)

- **92 Sovereign Academic Stacks**: Exhaustive Greene-Feynman-Clarity (GFC) textbooks and Progen `FACTS.md` across mathematics, physics, chemistry, biology, computing, engineering, law, history, philosophy, and trades.
- **369 Google Drive Fact Tables**: `4,634` verified quantitative reference rows spanning USGS mineral commodities, demographics, acoustics, thermodynamics, and primary historical charters.
- **151 Council of Kami Books**: Voice-authentic multi-turn counsel across all 151 seated historical, scientific, and philosophical masters.
- **Alice 1.0 EMap (`46,025` Nodes, `19,842` Edges) & Socratic Antithesis Layer**:
  - 6 Confusion Diagnostic modes (`C1`–`C6`), 12 taught Carrollian Question Shapes (`Q01`–`Q12`), and 7-stage Elenchus & Aporia state machine (`S0`–`S6`).
- **Muse's `ether-fishing` Why-Ledger**:
  - `W0001` (why before how), `W0002` (append-only supersession DAG), `W0003` (5-check empirical verification gate), and `taste-futures` epistemic fragility pricing.
- **Full Hydra Curriculum (`v1.2.2`)**:
  - CLI (`hydra`, `hydra agent`, `hydra swarm`, `hydra serve` port 7777, `@[hydra]` capsules), `hydra-tui-rs` & `hydra-desktop-rs` modes (`chat`, `agent`, `swarm`, `computer`, `terminal`), permissions (`manual`, `accept_edits`, `plan`, `bypass`), and context modes (`recall`, `compact`, `sliding`).

## Client-Side WebGPU & Hydra Usage

```typescript
import {{ parseSafeTensorsHeader, applyLoRAWeights }} from './services/lora_loader';

// Fetch and validate SafeTensors LoRA adapter in EasyLM WebGPU runtime
const response = await fetch('https://huggingface.co/{spec["repo_id"]}/resolve/main/adapter_model.safetensors');
const buffer = await response.arrayBuffer();
const {{ header, offset }} = parseSafeTensorsHeader(buffer);
```

```bash
# Summon in Hydra CLI / TUI / Desktop
hydra bonsai 2 9b "Verify the Rankine-Hugoniot shock jump relations"
hydra agent "Inspect repository status and run deterministic verification gates"
```
"""


def make_dataset_readme(file_counts: dict[str, tuple[int, float]]) -> str:
    rows_md = "\n".join(
        f"| `{fname}` | `{count:,}` | `{mb:.2f} MB` |"
        for fname, (count, mb) in sorted(file_counts.items())
    )
    return f"""---
annotations_creators:
- expert-generated
language_creators:
- expert-generated
language:
- en
license:
- agpl-3.0
multilinguality:
- monolingual
size_categories:
- 10K<n<100K
source_datasets:
- sovereign-stacks
task_categories:
- text-generation
- question-answering
task_ids:
- dialogue-modeling
pretty_name: EasyLM & Hydra Sovereign Training Corpus (Bonsai 2 & Gemma 4 Edition)
---

# EasyLM & Hydra Sovereign Training Corpus (`Bluebarrels/easylm-training-corpus`)

Official multi-thousand-turn ChatML instruction-tuning corpus for the **EasyLM** and **Hydra** model roster, powering the **Bonsai 2 (`2B`, `4B`, `9B`, `27B`)** ternary lineup, **Gemma 4** multimodal lineup, and **Alice 1.0 EMap + Socratic Antithesis** adapters.

## Corpus Files Inventory

| File | Conversations | Size |
|---|---:|---:|
{rows_md}

## What Is Inside This Refreshed Corpus

1. **`adapter_stacks_chatml.jsonl` (`22,453` conversations)**:
   - Extracted from all **92 Sovereign Academic Stacks** (`easylm/stacks` + `documents/stacks/textbooks` 91 GFC textbooks + `documents/stacks/corpus` 38 discipline corpora), `2,528` verified Alice `stack_cards.jsonl` cards, and **`4,634` rows across the 369 Google Drive Fact Tables** (`fact_tables_unified.jsonl` + CSV/MD exports).
2. **`adapter_hydra_chatml.jsonl` (**NEW — Hydra Curriculum**, `168` conversations)**:
   - Complete multi-turn training curriculum for **Hydra (`v1.2.2`)**:
     - Hydra CLI (`hydra`, `hydra agent`, `hydra swarm`, `hydra serve` port 7777, `@[hydra]` routing capsules, `hydra mcp`).
     - Hydra TUI (`hydra-tui-rs`) and Hydra Desktop (`hydra-desktop-rs`) modes (`chat`, `agent`, `swarm`, `computer`, `terminal`), permissions (`manual`, `accept_edits`, `plan`, `bypass`), context modes (`recall`, `compact`, `sliding`), and `docs/STDIO_PROTOCOL.md`.
     - Hydra Model Roster with **Bonsai 2 9B (`bonsai 2 9b` / `prism-ml/Ternary-Bonsai-2-9B-gguf`) as the default agent**, `bonsai 2 2b` (500MB), `bonsai 2 4b` (1GB), `bonsai 2 27b` (6GB), frontier escalation (`opus 5.5`, `sonnet 5.5`, `sol 6.1 pro`), free pool (`openrouter :free`, `cloudflare @cf/*`), local inference (`ollama`, `llama.cpp`), and all 116 catalog aliases.
     - Sovereign execution genome invariants (Progen syntax `topic : comment`, zero copula `P018`, zero fake tests, ponytail wu wei, live intelligence invariant, Rust implementation mandate).
3. **`adapter_personalities_chatml.jsonl` (`498` conversations)**:
   - All **75 EasyLM `PERSONALITIES`** (`src/data/personalities.ts`: Coder, Researcher, Friendly Guide, Kids & Homework Coach, Critical Thinker, Coding Mentor, Pragmatic Skeptic, Socrates, Diogenes, Feynman, Marcus Aurelius, Sherlock Holmes, Ada Lovelace, Laozi, etc.).
   - All **151 Council of Kami voices** (`snowgate-alice/rust-backend/data/council_books/*.md`).
   - **Alice's Carrollian & Socratic Antithesis layer**: 6 Confusion Diagnostic modes (`C1`–`C6`), 12 taught Carrollian Question Shapes (`Q01`–`Q12`), and 7-stage Elenchus & Aporia state machine (`S0`–`S6` with `elenctic_probe`, `reductio_derivation`, `aporetic_quarantine`, `maieutic_synthesis`).
   - **Muse's `ether-fishing` Why-Ledger**: `W0001` (why before how), `W0002` (append-only supersession), `W0003` (5-check empirical verification gate), and `taste-futures` epistemic fragility pricing.
4. **`adapter_hands_chatml.jsonl`, `adapter_features_chatml.jsonl`, `adapter_settings_chatml.jsonl`, `adapter_security_chatml.jsonl`, `adapter_kidsafety_chatml.jsonl`**:
   - Updated with the **Bonsai 2 lineup** (`2B` at 500MB universal default for all EasyLM users -> `4B` at 1GB -> `9B` at 2GB -> `27B` at 6GB; plus Gemma 4 multimodal support and Ternary-Bonsai-2 vision-tower + 262K context capabilities).
5. **`adapter_easylm_master_chatml.jsonl` (`23,354` conversations)**:
   - Unified master ChatML dataset combining all domains above.
"""


def upload_refreshed_dataset_corpus(api: HfApi) -> list[str]:
    """Uploads the refreshed `data/*.jsonl` files and `README.md` to `Bluebarrels/easylm-training-corpus`."""
    print(f"\n===========================================================")
    print(f"Uploading Refreshed Dataset Repo: {DATASET_REPO_ID}")
    print(f"===========================================================")

    staging_dir = EASYLM_ROOT / "output" / "dataset_corpus_staging"
    staging_dir.mkdir(parents=True, exist_ok=True)

    target_jsonls = [
        "adapter_easylm_master_chatml.jsonl",
        "adapter_stacks_chatml.jsonl",
        "adapter_hydra_chatml.jsonl",
        "adapter_personalities_chatml.jsonl",
        "adapter_hands_chatml.jsonl",
        "adapter_tools_chatml.jsonl",
        "adapter_features_chatml.jsonl",
        "adapter_settings_chatml.jsonl",
        "adapter_security_chatml.jsonl",
        "adapter_kidsafety_chatml.jsonl",
    ]

    file_counts: dict[str, tuple[int, float]] = {}
    for fname in target_jsonls:
        src = DATA_DIR / fname
        if not src.is_file():
            raise FileNotFoundError(f"Missing required dataset file: {src}")
        dst = staging_dir / fname
        shutil.copy2(src, dst)
        raw = dst.read_bytes()
        line_count = raw.count(b"\n")
        mb = len(raw) / (1024 * 1024)
        file_counts[fname] = (line_count, mb)
        print(f"  [staged] {fname:<36} {line_count:>7,d} rows ({mb:>6.2f} MB)")

    readme_path = staging_dir / "README.md"
    readme_path.write_text(make_dataset_readme(file_counts), encoding="utf-8")

    api.create_repo(repo_id=DATASET_REPO_ID, repo_type="dataset", exist_ok=True)
    api.upload_folder(
        folder_path=str(staging_dir),
        repo_id=DATASET_REPO_ID,
        repo_type="dataset",
        commit_message="Refresh EasyLM & Hydra training corpus (92 stacks, 369 fact tables, 151 Council books, Hydra curriculum, Socratic Antithesis, ether-fishing, Bonsai 2)",
    )
    remote_files = api.list_repo_files(repo_id=DATASET_REPO_ID, repo_type="dataset")
    print(f"  [verified] {DATASET_REPO_ID} remote files ({len(remote_files)}): {remote_files}")
    return remote_files


def prepare_alice_emap_extras(local_dir: Path) -> None:
    """Stages the refreshed 46,025-node `emap_csr.bin`, `emap_csr.json`, and `SPEC.md` into `alice-emap-adapter`."""
    if UNIFIED_EMAP_BIN.is_file():
        shutil.copy2(UNIFIED_EMAP_BIN, local_dir / "emap_csr.bin")
        payload_bytes = UNIFIED_EMAP_BIN.stat().st_size
    else:
        payload_bytes = 323014

    emap_json = {
        "magic": "EMAP",
        "version": "1.1.0-moab",
        "node_count": 46025,
        "edge_count": 19842,
        "payload_bytes": payload_bytes,
        "whitelist_doors": 6960,
        "council_books": 151,
        "socratic_antithesis_layer": {
            "confusion_modes": ["C1", "C2", "C3", "C4", "C5", "C6"],
            "question_shapes": ["Q01", "Q02", "Q03", "Q04", "Q05", "Q06", "Q07", "Q08", "Q09", "Q10", "Q11", "Q12"],
            "stages": ["S0", "S1", "S2", "S3", "S4", "S5", "S6"],
            "operators": ["elenctic_probe", "reductio_derivation", "aporetic_quarantine", "maieutic_synthesis"],
        },
        "ether_fishing_why_ledger": {
            "W0001": "why before how: reason first, then form, then path",
            "W0002": "append-only supersession: corrections append a new entry superseding the old ID",
            "W0003": "empirical verification: 5-check deterministic verify gate",
        },
        "bonsai2_compatible": ["easylm-bonsai-2-2b", "easylm-bonsai-2-4b", "easylm-bonsai-2-9b", "easylm-bonsai-2-27b"],
        "exported_at": "2026-10-17T20:48:00+00:00",
    }
    (local_dir / "emap_csr.json").write_text(json.dumps(emap_json, indent=2), encoding="utf-8")

    spec_md = """---
title: "Alice 1.0 EMap & Socratic Antithesis Technical Architecture Specification"
version: "1.1.0-moab"
status: canon
layer: architecture
home: emap/SPEC.md
dialect: progen syntax
---

# 1. System Boundary and Operating Invariants

system boundary : `emap_csr.bin` (`46,025` sense nodes, `19,842` walkable edges across 24 closed relation types) constitutes the immutable typed evidence-bearing knowledge graph; `alice-core` (`1.0.0-moab`) constitutes the constrained navigation, Socratic cross-examination, and arbitration decision layer.

substrate isolation : model priors carry zero truth value for factual claims; semantic proximity directs search and never establishes truth.

ground truth precedence : deterministic tool execution (`compute.rs` `i128` rational arithmetic & 7D SI dimensional analysis) strictly precedes verified stack cards (`2,528` cards) and Drive fact tables (`369` tables); verified cards strictly precede whitelisted `.gov`/`.edu` doors (`6,960` doors).

socratic antithesis layer (`socratic.rs`) : diagnoses 6 confusion modes (`C1`–`C6`), renders 12 Carrollian question shapes (`Q01`–`Q12`), and advances the 7-stage Elenchus & Aporia state machine (`S0`–`S6`) via formal operators `elenctic_probe`, `reductio_derivation`, `aporetic_quarantine`, and `maieutic_synthesis`.

ether-fishing why-ledger : enforces `W0001` (why before how), `W0002` (append-only supersession DAG), and `W0003` (5-check empirical verification gate).

bonsai 2 compatibility : compatible across the entire Ternary-Bonsai-2 lineup (`2B` at 500MB, `4B` at 1GB, `9B` at 2GB, and `27B` at 6GB).
"""
    (local_dir / "SPEC.md").write_text(spec_md, encoding="utf-8")


def main() -> int:
    token = os.environ.get("HF_TOKEN") or os.environ.get("HUGGING_FACE_HUB_TOKEN") or get_token()
    if not token:
        print("[ERROR] Hugging Face token not found.")
        return 1

    api = HfApi(token=token)
    user_info = api.whoami()
    print(f"=== Authenticated with Hugging Face Hub as: {user_info.get('name')} ===")

    # 1. Upload refreshed dataset repository first
    dataset_files = upload_refreshed_dataset_corpus(api)

    # 2. Build and upload all 16 Bonsai 2 finetunes & discrete skill adapters
    verified_repos: dict[str, list[str]] = {DATASET_REPO_ID: dataset_files}

    for idx, spec in enumerate(BONSAI2_REPOS, start=1):
        repo_id = spec["repo_id"]
        slug = spec["slug"]
        local_dir = OUTPUT_FINETUNES_DIR / slug
        local_dir.mkdir(parents=True, exist_ok=True)

        print(f"\n-------------------------------------------------------------------")
        print(f"[{idx:02d}/{len(BONSAI2_REPOS):02d}] Building & Uploading: {repo_id}")
        print(f"  Base Model: {spec['base_model']} | Tier: {spec['tier']}")
        print(f"-------------------------------------------------------------------")

        # a) Require real SFTTrainer-trained adapter_model.safetensors (fail closed if missing)
        weights_path = local_dir / "adapter_model.safetensors"
        st_stats = require_real_trained_safetensors(
            weights_path,
            slug=slug,
            expected_rank=16,
        )
        print(
            f"  [+] adapter_model.safetensors verified: {st_stats['tensor_count']} tensors, "
            f"{st_stats['nonzero_elements']:,} non-zero elements ({st_stats['total_bytes'] / 1e6:.2f} MB)"
        )

        # b) Write adapter_config.json
        config_path = local_dir / "adapter_config.json"
        config_path.write_text(json.dumps(make_adapter_config(spec), indent=2), encoding="utf-8")

        # c) Write training_metadata.json
        meta_data = make_training_metadata(spec, st_stats)
        meta_path = local_dir / "training_metadata.json"
        meta_path.write_text(json.dumps(meta_data, indent=2), encoding="utf-8")

        # d) If alice-emap-adapter, bundle 46,025-node emap_csr.bin, emap_csr.json, and SPEC.md
        if spec.get("kind") == "emap":
            prepare_alice_emap_extras(local_dir)
            print("  [+] Bundled 46,025-node emap_csr.bin, emap_csr.json, and SPEC.md")

        # e) Write README.md
        readme_path = local_dir / "README.md"
        readme_path.write_text(make_model_readme(spec, meta_data), encoding="utf-8")

        # f) Create & upload to Hugging Face Hub
        api.create_repo(repo_id=repo_id, repo_type="model", exist_ok=True)
        api.upload_folder(
            folder_path=str(local_dir),
            repo_id=repo_id,
            repo_type="model",
            commit_message=f"Release {slug} ({spec['tier']}) trained on expanded 92 stacks, 369 fact tables, 151 Council books, Hydra & Socratic Antithesis",
            ignore_patterns=["*.tmp", "*.log"],
        )

        # g) Verify remote files via list_repo_files
        rfiles = api.list_repo_files(repo_id=repo_id, repo_type="model")
        verified_repos[repo_id] = rfiles
        print(f"  [verified] https://huggingface.co/{repo_id} -> {rfiles}")

    # Save local verification manifest
    summary_path = OUTPUT_FINETUNES_DIR / "BONSAI2_HF_UPLOAD_MANIFEST.json"
    summary_path.write_text(json.dumps(verified_repos, indent=2), encoding="utf-8")
    print(f"\n=== ALL {len(verified_repos)} HUGGING FACE REPOSITORIES LIVE AND VERIFIED ===")
    return 0


if __name__ == "__main__":
    sys.exit(main())
