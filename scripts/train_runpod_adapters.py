#!/usr/bin/env python3
# SPDX-License-Identifier: AGPL-3.0-or-later
"""EasyLM Serverless & On-Demand LoRA Adapter Trainer on RunPod.

Provisions low-cost GPU pods (RTX 4090, RTX A4000, NVIDIA L4) on RunPod,
bootstraps container environments, stages datasets, executes LoRA fine-tuning,
and exports SafeTensors weights to the Hugging Face Hub.
"""

from __future__ import annotations

import argparse
import base64
import json
import logging
import os
from pathlib import Path
import sys
import time
from typing import Any, Dict, List, Optional

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("train_runpod_adapters")

# Supported models across EasyLM tiers
SUPPORTED_MODELS: Dict[str, str] = {
    "qwen-0.5b": "Qwen/Qwen2.5-0.5B-Instruct",
    "qwen-1.5b": "Qwen/Qwen2.5-1.5B-Instruct",
    "qwen-3b": "Qwen/Qwen2.5-3B-Instruct",
    "qwen-7b": "Qwen/Qwen2.5-7B-Instruct",
    "qwen-coder-7b": "Qwen/Qwen2.5-Coder-7B-Instruct",
}

# RunPod GPU mappings
RUNPOD_GPU_MAPPINGS: Dict[str, str] = {
    "rtx4090": "NVIDIA GeForce RTX 4090",
    "a4000": "NVIDIA RTX A4000",
    "l4": "NVIDIA L4",
    "a100": "NVIDIA A100-SXM4-40GB",
}

# Adapter dataset filenames
ADAPTER_DATA_FILES: Dict[str, str] = {
    "hands": "adapter_hands_chatml.jsonl",
    "personalities": "adapter_personalities_chatml.jsonl",
    "security": "adapter_security_chatml.jsonl",
    "kidsafety": "adapter_kidsafety_chatml.jsonl",
}

DEFAULT_CONTAINER_IMAGE = "runpod/pytorch:2.2.0-py3.10-cuda12.1.1-devel-ubuntu22.04"
GCS_VAULT_URL = "gs://bastion-510306-vault/easylm"
LOCAL_DATA_DIR: Path = Path(__file__).resolve().parents[1] / "data"


def build_container_bootstrap_script(
    model_alias: str,
    adapter_name: str,
    epochs: int,
    batch_size: int,
    grad_accum: int,
    learning_rate: float,
    lora_r: int,
    lora_alpha: int,
    push_to_hub: bool,
    hf_org: str,
) -> str:
    """Builds the shell command pipeline to bootstrap dependencies, data, and training."""
    data_filename = ADAPTER_DATA_FILES.get(adapter_name, f"adapter_{adapter_name}_chatml.jsonl")
    push_flag = "--push-to-hub" if push_to_hub else ""

    commands = [
        "mkdir -p /workspace/easylm/data /workspace/easylm/output /workspace/easylm/scripts",
        "cd /workspace/easylm",
        "pip install --upgrade pip",
        "pip install python-json-logger 'transformers<5.0.0' peft 'trl<0.13.0' datasets accelerate bitsandbytes huggingface_hub safetensors",
        f"gcloud storage cp {GCS_VAULT_URL}/data/{data_filename} ./data/ || "
        f"curl -sL https://storage.googleapis.com/bastion-510306-vault/easylm/data/{data_filename} -o ./data/{data_filename}",
        f"gcloud storage cp {GCS_VAULT_URL}/scripts/train_adapters_gcloud.py ./scripts/ || "
        f"curl -sL https://storage.googleapis.com/bastion-510306-vault/easylm/scripts/train_adapters_gcloud.py -o ./scripts/train_adapters_gcloud.py",
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
        f"--lora-alpha {lora_alpha} "
        f"--hf-org {hf_org} "
        f"{push_flag}",
        "echo '[SUCCESS] EasyLM RunPod Training Pipeline Completed' > /workspace/training_complete.flag",
    ]
    return " && ".join(commands)


def run_dry_run_validation(args: argparse.Namespace) -> int:
    """Validates configuration, checks local datasets, and prints pod deployment manifest."""
    print("=" * 70)
    print("       EasyLM RunPod GPU Pod Trainer - Dry Run Validation         ")
    print("=" * 70)

    # 1. Base Model Check
    if args.model not in SUPPORTED_MODELS:
        logger.error(f"Unsupported model '{args.model}'. Choose from: {list(SUPPORTED_MODELS.keys())}")
        return 1
    base_model_id = SUPPORTED_MODELS[args.model]
    print(f"  * Base Model Alias:     {args.model}")
    print(f"  * Hugging Face Base ID: {base_model_id}")

    # 2. GPU Check
    gpu_id = RUNPOD_GPU_MAPPINGS.get(args.gpu, args.gpu)
    print(f"  * Target GPU Profile:   {args.gpu} -> '{gpu_id}'")
    print(f"  * Cloud Type:           {args.cloud_type}")
    print(f"  * Container Image:      {DEFAULT_CONTAINER_IMAGE}")

    # 3. Adapter and Dataset Check
    adapters = [args.adapter] if args.adapter != "all" else list(ADAPTER_DATA_FILES.keys())
    for ad in adapters:
        if ad not in ADAPTER_DATA_FILES:
            logger.error(f"Unknown adapter '{ad}'. Choose from: {list(ADAPTER_DATA_FILES.keys())}")
            return 1
        data_fname = ADAPTER_DATA_FILES[ad]
        local_path = LOCAL_DATA_DIR / data_fname
        if not local_path.is_file():
            logger.error(f"Missing local dataset file: {local_path}")
            return 1
        size_kb = local_path.stat().st_size / 1024
        print(f"  * Adapter Target:       {ad:<14} -> Dataset: {data_fname:<32} ({size_kb:.1f} KB)")

    # 4. Bootstrap Script Inspection
    sample_bootstrap = build_container_bootstrap_script(
        model_alias=args.model,
        adapter_name=adapters[0],
        epochs=args.epochs,
        batch_size=args.batch_size,
        grad_accum=args.grad_accum,
        learning_rate=args.lr,
        lora_r=args.lora_r,
        lora_alpha=args.lora_alpha,
        push_to_hub=args.push_to_hub,
        hf_org=args.hf_org,
    )
    print(f"\n  * Container Bootstrap Pipeline Preview (first adapter: '{adapters[0]}'):")
    for cmd in sample_bootstrap.split(" && "):
        print(f"      $ {cmd}")

    print("\n" + "-" * 70)
    print(f"  * Volume Storage:       20 GB Container Disk, 20 GB Volume")
    print(f"  * Auto-Teardown:        {args.terminate_on_finish}")
    print(f"  * Hugging Face Push:    {args.push_to_hub}")
    print("[SUCCESS] RunPod GPU pod deployment spec verified and dry-run validated.")
    print("=" * 70)
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="EasyLM Serverless & Pod LoRA Adapter Trainer on RunPod")
    parser.add_argument(
        "--model",
        type=str,
        default="qwen-0.5b",
        choices=list(SUPPORTED_MODELS.keys()),
        help="Base model tier (default: 'qwen-0.5b')",
    )
    parser.add_argument(
        "--adapter",
        type=str,
        default="hands",
        choices=["hands", "personalities", "security", "kidsafety", "all"],
        help="Target adapter to fine-tune (default: 'hands')",
    )
    parser.add_argument(
        "--gpu",
        type=str,
        default="rtx4090",
        choices=list(RUNPOD_GPU_MAPPINGS.keys()),
        help="RunPod target GPU accelerator (default: 'rtx4090')",
    )
    parser.add_argument(
        "--cloud-type",
        type=str,
        default="COMMUNITY",
        choices=["COMMUNITY", "SECURE", "ALL"],
        help="RunPod cloud tier (default: 'COMMUNITY')",
    )
    parser.add_argument("--epochs", type=int, default=3, help="Training epochs (default: 3)")
    parser.add_argument("--batch-size", type=int, default=4, help="Per-device batch size (default: 4)")
    parser.add_argument("--grad-accum", type=int, default=4, help="Gradient accumulation steps (default: 4)")
    parser.add_argument("--lr", type=float, default=2e-4, help="Peak learning rate (default: 2e-4)")
    parser.add_argument("--lora-r", type=int, default=16, help="LoRA rank (default: 16)")
    parser.add_argument("--lora-alpha", type=int, default=32, help="LoRA alpha scaling (default: 32)")
    parser.add_argument("--push-to-hub", action="store_true", default=False, help="Push weights to Hugging Face Hub")
    parser.add_argument("--hf-org", type=str, default="hnai", help="Hugging Face namespace (default: 'hnai')")
    parser.add_argument("--api-key", type=str, default=None, help="RunPod API Key (defaults to RUNPOD_API_KEY env)")
    parser.add_argument("--terminate-on-finish", action="store_true", default=True, help="Terminate pod after training")
    parser.add_argument("--dry-run", action="store_true", default=False, help="Validate config without provisioning pod")

    args = parser.parse_args()

    if args.dry_run:
        return run_dry_run_validation(args)

    import runpod

    api_key = args.api_key or os.environ.get("RUNPOD_API_KEY")
    if not api_key:
        logger.error("[FAIL] No RunPod API key detected. Set RUNPOD_API_KEY or pass --api-key.")
        return 1

    runpod.api_key = api_key

    # Verify credentials
    try:
        gpus = runpod.get_gpus()
        logger.info(f"[+] RunPod API authenticated successfully ({len(gpus)} GPU types discovered).")
    except Exception as err:
        logger.error(f"[FAIL] RunPod authentication failed: {err}")
        return 1

    gpu_type_id = RUNPOD_GPU_MAPPINGS.get(args.gpu, args.gpu)
    adapters = [args.adapter] if args.adapter != "all" else list(ADAPTER_DATA_FILES.keys())

    for ad in adapters:
        pod_name = f"easylm-lora-{ad}-{args.model}"
        bootstrap_cmd = build_container_bootstrap_script(
            model_alias=args.model,
            adapter_name=ad,
            epochs=args.epochs,
            batch_size=args.batch_size,
            grad_accum=args.grad_accum,
            learning_rate=args.lr,
            lora_r=args.lora_r,
            lora_alpha=args.lora_alpha,
            push_to_hub=args.push_to_hub,
            hf_org=args.hf_org,
        )

        env_vars = {
            "HF_TOKEN": os.environ.get("HF_TOKEN", ""),
            "RUNPOD_POD_NAME": pod_name,
        }

        logger.info(f"Provisioning RunPod GPU Pod: '{pod_name}' on {gpu_type_id}...")
        try:
            pod = runpod.create_pod(
                name=pod_name,
                image_name=DEFAULT_CONTAINER_IMAGE,
                gpu_type_id=gpu_type_id,
                cloud_type=args.cloud_type,
                gpu_count=1,
                volume_in_gb=20,
                container_disk_in_gb=20,
                min_vcpu_count=4,
                min_memory_in_gb=16,
                docker_args=f"/bin/bash -c '{bootstrap_cmd}'",
                env=env_vars,
            )
            pod_id = pod.get("id")
            logger.info(f"[SUCCESS] RunPod Pod created successfully!")
            logger.info(f"  * Pod ID:      {pod_id}")
            logger.info(f"  * Pod Name:    {pod_name}")
            logger.info(f"  * GPU Type:    {gpu_type_id}")
            logger.info(f"  * Console URI: https://runpod.io/console/pods")

        except Exception as err:
            logger.error(f"Failed to create RunPod pod for '{pod_name}': {err}")
            return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
