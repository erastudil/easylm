#!/usr/bin/env python3
# SPDX-License-Identifier: AGPL-3.0-or-later
"""EasyLM On-Demand LoRA Adapter Trainer on RunPod (Bonsai 2 & Gemma 4 up to 16GB VRAM).

Provisions GPU pods on RunPod to execute `train_adapters_gcloud.py` across the two
authorized model families (Bonsai 2 & Gemma 4), including post-training Socratic /
child-safety / local-tool-fence refusal evaluation (`refusal_eval.json`) for
`kidsafety` adapters. Never uploads directly to Hugging Face; all publishing must
pass through `scripts/upload_to_hf.py` (`adapter_publish_gate.py`).
"""

from __future__ import annotations

import argparse
import json
import logging
import os
from pathlib import Path
import sys
from typing import Any, Dict, List, Tuple

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("train_runpod_adapters")

SUPPORTED_MODELS: Dict[str, str] = {
    "bonsai-2-2b": "Qwen/Qwen3.5-2B",
    "bonsai-2-4b": "Qwen/Qwen3.5-4B",
    "bonsai-2-9b": "Qwen/Qwen3.5-9B",
    "bonsai-2-27b": "Qwen/Qwen3.5-27B",
    "gemma-4-e2b": "google/gemma-4-E2B-it",
    "gemma-4-e4b": "google/gemma-4-E4B-it",
    "gemma-4-12b": "google/gemma-4-12B-it",
}

RUNPOD_GPU_MAPPINGS: Dict[str, str] = {
    "rtx4090": "NVIDIA GeForce RTX 4090",
    "l4": "NVIDIA L4",
    "a100": "NVIDIA A100-SXM4-40GB",
}

ADAPTER_DATA_FILES: Dict[str, str] = {
    "stacks": "adapter_stacks_chatml.jsonl",
    "hands": "adapter_hands_chatml.jsonl",
    "kidsafety": "adapter_kidsafety_chatml.jsonl",
    "hydra": "adapter_hydra_chatml.jsonl",
    "security": "adapter_security_chatml.jsonl",
    "personalities": "adapter_personalities_chatml.jsonl",
    "unified": "easylm_unified_sft_chatml.jsonl",
    "easylm": "adapter_easylm_master_chatml.jsonl",
}

LINEUP_ADAPTER_MATRIX: Dict[str, List[str]] = {
    "bonsai-2-2b": ["stacks", "hands", "kidsafety", "hydra"],
    "bonsai-2-4b": ["hydra"],
    "bonsai-2-9b": ["hydra"],
    "bonsai-2-27b": ["hydra"],
    "gemma-4-e2b": ["hydra"],
    "gemma-4-e4b": ["hydra"],
    "gemma-4-12b": ["hydra"],
}

DEFAULT_CONTAINER_IMAGE = "runpod/pytorch:2.4.0-py3.11-cuda12.4.1-devel-ubuntu22.04"
GCS_VAULT_URL = "gs://bastion-510306-vault/easylm"
LOCAL_DATA_DIR: Path = Path(__file__).resolve().parents[1] / "data"


def count_jsonl_records(file_path: Path) -> int:
    if not file_path.is_file():
        return 0
    count = 0
    with open(file_path, "r", encoding="utf-8") as f:
        for line in f:
            if line.strip():
                count += 1
    return count


def build_training_schedule(args: argparse.Namespace) -> List[Tuple[str, str]]:
    if args.lineup_matrix:
        schedule: List[Tuple[str, str]] = []
        for model_alias, adapters in LINEUP_ADAPTER_MATRIX.items():
            for adapter_name in adapters:
                schedule.append((model_alias, adapter_name))
        return schedule
    adapters = (
        [args.adapter] if args.adapter != "all" else LINEUP_ADAPTER_MATRIX.get(args.model, ["hydra"])
    )
    return [(args.model, ad) for ad in adapters]


def build_container_bootstrap_script(
    model_alias: str,
    adapter_name: str,
    epochs: int,
    batch_size: int,
    grad_accum: int,
    learning_rate: float,
    lora_r: int,
    lora_alpha: int,
) -> str:
    data_filename = ADAPTER_DATA_FILES[adapter_name]
    out_subdir = f"/workspace/easylm/output/easylm-{adapter_name}-{model_alias}"
    commands = [
        "mkdir -p /workspace/easylm/data /workspace/easylm/output /workspace/easylm/scripts",
        "cd /workspace/easylm",
        "pip install --upgrade pip",
        "pip install python-json-logger 'transformers>=5.17.0' 'peft>=0.14.0' 'trl>=0.12.0' datasets accelerate bitsandbytes safetensors",
        f"gcloud storage cp {GCS_VAULT_URL}/data/{data_filename} ./data/",
        f"gcloud storage cp {GCS_VAULT_URL}/scripts/train_adapters_gcloud.py ./scripts/",
        f"python3 ./scripts/train_adapters_gcloud.py "
        f"--base-model {model_alias} "
        f"--adapter {adapter_name} "
        f"--data-dir ./data "
        f"--output-dir ./output "
        f"--epochs {epochs} "
        f"--batch-size {batch_size} "
        f"--grad-accum {grad_accum} "
        f"--lr {learning_rate} "
        f"--lora-r {lora_r} "
        f"--lora-alpha {lora_alpha}",
    ]
    if adapter_name == "kidsafety":
        # Verify deterministic refusal_eval.json ({"refusal_rate": ..., "passed": ..., "total": ...}) exists after training
        commands.append(
            f"python3 -c \"import json, pathlib; p = pathlib.Path('{out_subdir}/refusal_eval.json'); "
            f"d = json.loads(p.read_text()); assert d.get('passed') is True and d.get('total', 0) >= 20 and d.get('refusal_rate', 0.0) == 1.0\""
        )
    commands.append("echo '[SUCCESS] EasyLM RunPod Training Pipeline Completed' > /workspace/training_complete.flag")
    return " && ".join(commands)


def main() -> int:
    parser = argparse.ArgumentParser(description="EasyLM RunPod LoRA Adapter Trainer (Bonsai 2 & Gemma 4)")
    parser.add_argument(
        "--model",
        type=str,
        default="bonsai-2-2b",
        choices=list(SUPPORTED_MODELS.keys()),
        help="Base model tier (default: 'bonsai-2-2b')",
    )
    parser.add_argument(
        "--adapter",
        type=str,
        default="hands",
        choices=list(ADAPTER_DATA_FILES.keys()) + ["all"],
        help="Target adapter to fine-tune (default: 'hands')",
    )
    parser.add_argument(
        "--lineup-matrix",
        action="store_true",
        default=False,
        help="Provision or inspect the canonical 10-adapter Bonsai 2 + Gemma 4 lineup matrix",
    )
    parser.add_argument(
        "--gpu",
        type=str,
        default="a100",
        choices=list(RUNPOD_GPU_MAPPINGS.keys()),
        help="RunPod target GPU accelerator (default: 'a100')",
    )
    parser.add_argument("--epochs", type=int, default=3, help="Training epochs (default: 3)")
    parser.add_argument("--batch-size", type=int, default=4, help="Per-device batch size (default: 4)")
    parser.add_argument("--grad-accum", type=int, default=4, help="Gradient accumulation steps (default: 4)")
    parser.add_argument("--lr", type=float, default=2e-4, help="Peak learning rate (default: 2e-4)")
    parser.add_argument("--lora-r", type=int, default=16, help="LoRA rank (default: 16)")
    parser.add_argument("--lora-alpha", type=int, default=32, help="LoRA alpha scaling (default: 32)")
    parser.add_argument("--dry-run", action="store_true", default=False, help="Print training plan without provisioning pod")
    parser.add_argument(
        "--inspect-plan",
        action="store_true",
        default=False,
        help="Alias for --dry-run: emit structured JSON training plan without provisioning pod",
    )
    args = parser.parse_args()

    schedule = build_training_schedule(args)
    if args.dry_run or args.inspect_plan:
        plan_entries: List[Dict[str, Any]] = []
        for model_alias, ad in schedule:
            data_file = LOCAL_DATA_DIR / ADAPTER_DATA_FILES[ad]
            plan_entries.append(
                {
                    "tier_alias": model_alias,
                    "base_model": SUPPORTED_MODELS[model_alias],
                    "adapter": ad,
                    "dataset_path": str(data_file),
                    "dataset_exists": data_file.is_file(),
                    "conversations": count_jsonl_records(data_file),
                    "epochs": args.epochs,
                    "batch_size": args.batch_size,
                    "grad_accum": args.grad_accum,
                    "learning_rate": args.lr,
                    "lora_r": args.lora_r,
                    "lora_alpha": args.lora_alpha,
                    "requires_refusal_eval": ad == "kidsafety",
                    "output_dir": f"/workspace/easylm/output/easylm-{ad}-{model_alias}",
                }
            )
        print(
            json.dumps(
                {
                    "mode": "lineup_matrix" if args.lineup_matrix else "single_tier",
                    "total_adapters": len(plan_entries),
                    "plan": plan_entries,
                },
                indent=2,
            )
        )
        return 0

    import runpod

    api_key = os.environ.get("RUNPOD_API_KEY")
    if not api_key:
        logger.error("No RunPod API key detected in RUNPOD_API_KEY.")
        return 1
    runpod.api_key = api_key

    gpu_type_id = RUNPOD_GPU_MAPPINGS[args.gpu]
    for model_alias, ad in schedule:
        pod_name = f"easylm-lora-{ad}-{model_alias}"
        bootstrap_cmd = build_container_bootstrap_script(
            model_alias=model_alias,
            adapter_name=ad,
            epochs=args.epochs,
            batch_size=args.batch_size,
            grad_accum=args.grad_accum,
            learning_rate=args.lr,
            lora_r=args.lora_r,
            lora_alpha=args.lora_alpha,
        )
        runpod.create_pod(
            name=pod_name,
            image_name=DEFAULT_CONTAINER_IMAGE,
            gpu_type_id=gpu_type_id,
            cloud_type="SECURE",
            gpu_count=1,
            volume_in_gb=40,
            container_disk_in_gb=40,
            min_vcpu_count=4,
            min_memory_in_gb=32,
            docker_args=f"/bin/bash -c '{bootstrap_cmd}'",
        )
    return 0


if __name__ == "__main__":
    sys.exit(main())
