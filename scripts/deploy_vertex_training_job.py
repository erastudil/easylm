#!/usr/bin/env python3
# SPDX-License-Identifier: AGPL-3.0-or-later
"""EasyLM Vertex AI Custom Job Dispatcher for Bonsai 2 and Gemma 4 (up to 16GB VRAM).

Orchestrates Vertex AI Custom Jobs on `bastion-510306` (`us-central1`) to train
EasyLM LoRA adapters across the two authorized model families:
- Bonsai 2: `bonsai-2-2b` (default), `bonsai-2-4b`, `bonsai-2-9b`, `bonsai-2-27b`
- Gemma 4:  `gemma-4-e2b`, `gemma-4-e4b`, `gemma-4-12b`

Never pushes directly to Hugging Face from the training container; trained artifacts
are written to GCS (`gs://cloud-ai-platform-a75ae046-b3be-4949-bb56-de35a075764f/models/`)
and must be verified locally and published via `scripts/upload_to_hf.py` (`adapter_publish_gate.py`).
"""

from __future__ import annotations

import argparse
import json
import logging
from pathlib import Path
import re
import subprocess
import sys
from typing import Any, Dict, List, Tuple

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("deploy_vertex_job")

GCP_PROJECT = "bastion-510306"
GCP_REGION = "us-central1"
GCS_STAGING_BUCKET = "gs://cloud-ai-platform-a75ae046-b3be-4949-bb56-de35a075764f"
GCS_DATA_BUCKET = "gs://bastion-510306-vault/easylm/data"
TRAINING_IMAGE_URI = "us-docker.pkg.dev/vertex-ai/training/pytorch-gpu.2-4.py310:latest"

SUPPORTED_MODELS: Dict[str, str] = {
    "bonsai-2-2b": "Qwen/Qwen3.5-2B",
    "bonsai-2-4b": "Qwen/Qwen3.5-4B",
    "bonsai-2-9b": "Qwen/Qwen3.5-9B",
    "bonsai-2-27b": "Qwen/Qwen3.5-27B",
    "gemma-4-e2b": "google/gemma-4-E2B-it",
    "gemma-4-e4b": "google/gemma-4-E4B-it",
    "gemma-4-12b": "google/gemma-4-12B-it",
}

BASE_MODEL_PINS: Dict[str, str] = {
    "Qwen/Qwen3.5-2B": "15852e8c16360a2fea060d615a32b45270f8a8fc",
    "Qwen/Qwen3.5-4B": "851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a",
    "Qwen/Qwen3.5-9B": "c202236235762e1c871ad0ccb60c8ee5ba337b9a",
    "Qwen/Qwen3.5-27B": "fc05daec18b0a78c049392ed2e771dde82bdf654",
    "google/gemma-4-E2B-it": "3e22461f65e89153144f8adb70e3b8c2cc9845a7",
    "google/gemma-4-E4B-it": "ee0ef6023621cff504d758262d4e04895a5af4a2",
    "google/gemma-4-12B-it": "707f0a3b8a3c7ad586ed01e27eafbad8a27dd0f7",
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
    "bonsai-2-4b": ["stacks", "hands", "hydra"],
    "bonsai-2-9b": ["stacks", "hands", "hydra"],
    "bonsai-2-27b": ["stacks", "hands", "hydra"],
    "gemma-4-e2b": ["stacks", "hands", "kidsafety", "hydra"],
    "gemma-4-e4b": ["stacks", "hands", "hydra"],
    "gemma-4-12b": ["stacks", "hands", "hydra"],
}

TIER_MACHINE_SPECS: Dict[str, Dict[str, Any]] = {
    "bonsai-2-2b":  {"machine_type": "a2-highgpu-1g", "accelerator_type": "NVIDIA_TESLA_A100", "accelerator_count": 1},
    "bonsai-2-4b":  {"machine_type": "a2-highgpu-1g", "accelerator_type": "NVIDIA_TESLA_A100", "accelerator_count": 1},
    "bonsai-2-9b":  {"machine_type": "a2-highgpu-1g", "accelerator_type": "NVIDIA_TESLA_A100", "accelerator_count": 1},
    "bonsai-2-27b": {"machine_type": "a2-highgpu-1g", "accelerator_type": "NVIDIA_TESLA_A100", "accelerator_count": 1},
    "gemma-4-e2b":  {"machine_type": "a2-highgpu-1g", "accelerator_type": "NVIDIA_TESLA_A100", "accelerator_count": 1},
    "gemma-4-e4b":  {"machine_type": "a2-highgpu-1g", "accelerator_type": "NVIDIA_TESLA_A100", "accelerator_count": 1},
    "gemma-4-12b":  {"machine_type": "a2-highgpu-1g", "accelerator_type": "NVIDIA_TESLA_A100", "accelerator_count": 1},
}


def run_cmd(cmd: List[str], check: bool = True) -> subprocess.CompletedProcess:
    logger.info(f"Running command: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True, shell=(sys.platform == "win32"))
    if check and result.returncode != 0:
        logger.error(f"Command failed (exit {result.returncode}):\n{result.stderr}")
        raise RuntimeError(f"Command failed: {result.stderr.strip()}")
    return result


def verify_gcp_preflight() -> bool:
    auth_check = run_cmd(["gcloud", "config", "get-value", "account"], check=False)
    account = auth_check.stdout.strip()
    if not account or auth_check.returncode != 0:
        logger.error("No active gcloud authentication detected.")
        return False

    proj_check = run_cmd(["gcloud", "config", "get-value", "project"], check=False)
    project = proj_check.stdout.strip()
    if project != GCP_PROJECT:
        run_cmd(["gcloud", "config", "set", "project", GCP_PROJECT])

    bucket_check = run_cmd(["gcloud", "storage", "buckets", "describe", GCS_STAGING_BUCKET], check=False)
    if bucket_check.returncode != 0:
        logger.error(f"Cannot access staging bucket: {GCS_STAGING_BUCKET}")
        return False
    return True


def stage_datasets_to_gcs(local_data_dir: Path) -> bool:
    adapter_files = sorted(set(local_data_dir.glob("*_chatml.jsonl")))
    if not adapter_files:
        logger.error(f"No adapter dataset files found in {local_data_dir}")
        return False
    for af in adapter_files:
        dest_url = f"{GCS_DATA_BUCKET}/{af.name}"
        run_cmd(["gcloud", "storage", "cp", str(af), dest_url])
    return True


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


def build_vertex_custom_job_spec(
    model_alias: str,
    adapter_name: str,
    output_dir: str,
) -> Dict[str, Any]:
    spec = TIER_MACHINE_SPECS[model_alias]
    is_large = any(k in model_alias for k in ("9b", "12b", "27b"))
    batch_size = "2" if is_large else "4"
    grad_accum = "8" if is_large else "4"
    lr = "1e-4" if is_large else "2e-4"

    container_args = [
        "python3",
        "train_adapters_gcloud.py",
        "--base-model",
        model_alias,
        "--adapter",
        adapter_name,
        "--data-dir",
        "./data",
        "--output-dir",
        "./output",
        "--epochs",
        "3",
        "--batch-size",
        batch_size,
        "--grad-accum",
        grad_accum,
        "--lr",
        lr,
        "--max-seq-len",
        "2048",
        "--lora-r",
        "16",
        "--lora-alpha",
        "32",
        "--gradient-checkpointing",
    ]

    bash_pipeline = (
        "pip install --upgrade pip && "
        "pip install 'torch==2.6.0' 'torchvision==0.21.0' 'torchaudio==2.6.0' "
        "python-json-logger 'transformers>=5.17.0' 'peft>=0.14.0' 'trl>=0.12.0' "
        "datasets accelerate bitsandbytes safetensors && "
        "mkdir -p ./data ./output && "
        f"gcloud storage cp {GCS_DATA_BUCKET}/*.jsonl ./data/ && "
        "gcloud storage cp gs://bastion-510306-vault/easylm/scripts/train_adapters_gcloud.py . && "
        f"{' '.join(container_args)} && "
        f"gcloud storage cp -r ./output/* {output_dir}/"
    )

    return {
        "workerPoolSpecs": [
            {
                "machineSpec": {
                    "machineType": spec["machine_type"],
                    "acceleratorType": spec["accelerator_type"],
                    "acceleratorCount": spec["accelerator_count"],
                },
                "replicaCount": 1,
                "containerSpec": {
                    "imageUri": TRAINING_IMAGE_URI,
                    "command": ["/bin/bash", "-c"],
                    "args": [bash_pipeline],
                },
            }
        ],
        "scheduling": {"strategy": "SPOT"},
        "baseOutputDirectory": {
            "outputUriPrefix": f"{GCS_STAGING_BUCKET}/jobs/{adapter_name}-{model_alias}"
        },
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="EasyLM Vertex AI Adapter Training Job Dispatcher")
    parser.add_argument(
        "--model",
        type=str,
        choices=list(TIER_MACHINE_SPECS.keys()),
        default="bonsai-2-2b",
        help="Target model tier (default: 'bonsai-2-2b')",
    )
    parser.add_argument(
        "--adapter",
        type=str,
        choices=list(ADAPTER_DATA_FILES.keys()) + ["all"],
        default="hands",
        help="Target adapter (default: 'hands')",
    )
    parser.add_argument(
        "--lineup-matrix",
        action="store_true",
        default=False,
        help="Dispatch or inspect the canonical 23-adapter Bonsai 2 + Gemma 4 lineup matrix",
    )
    parser.add_argument(
        "--stage-data",
        action="store_true",
        default=False,
        help="Upload local adapter datasets to GCS before submitting",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        default=False,
        help="Print training plan and job specs without submitting Vertex AI jobs",
    )
    parser.add_argument(
        "--inspect-plan",
        action="store_true",
        default=False,
        help="Alias for --dry-run: emit structured JSON training plan without cloud calls",
    )
    args = parser.parse_args()

    local_data_dir = Path(__file__).resolve().parents[1] / "data"
    schedule = build_training_schedule(args)

    if args.dry_run or args.inspect_plan:
        plan_entries: List[Dict[str, Any]] = []
        for model_alias, adapter in schedule:
            is_large = any(k in model_alias for k in ("9b", "12b", "27b"))
            base_model_id = SUPPORTED_MODELS[model_alias]
            data_file = local_data_dir / ADAPTER_DATA_FILES[adapter]
            out_gcs = f"{GCS_STAGING_BUCKET}/models/{model_alias}/adapters/{adapter}"
            plan_entries.append(
                {
                    "tier_alias": model_alias,
                    "base_model": base_model_id,
                    "base_model_revision": BASE_MODEL_PINS[base_model_id],
                    "adapter": adapter,
                    "dataset_path": str(data_file),
                    "dataset_exists": data_file.is_file(),
                    "conversations": count_jsonl_records(data_file),
                    "epochs": 3,
                    "batch_size": 2 if is_large else 4,
                    "grad_accum": 8 if is_large else 4,
                    "learning_rate": 1e-4 if is_large else 2e-4,
                    "requires_refusal_eval": adapter == "kidsafety",
                    "output_dir": out_gcs,
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

    if not verify_gcp_preflight():
        return 1

    if args.stage_data and not stage_datasets_to_gcs(local_data_dir):
        return 1

    for model_alias, adapter in schedule:
        out_gcs = f"{GCS_STAGING_BUCKET}/models/{model_alias}/adapters/{adapter}"
        job_spec = build_vertex_custom_job_spec(model_alias, adapter, out_gcs)
        spec_file = local_data_dir / f"vertex_job_{model_alias}_{adapter}.json"
        spec_file.write_text(json.dumps(job_spec, indent=2), encoding="utf-8")

        display_name = f"easylm-lora-{adapter}-{model_alias}"
        submit_cmd = [
            "gcloud",
            "ai",
            "custom-jobs",
            "create",
            f"--region={GCP_REGION}",
            f"--display-name={display_name}",
            f"--config={spec_file}",
        ]
        res = run_cmd(submit_cmd)
        combined_out = (res.stdout or "") + "\n" + (res.stderr or "")
        job_match = re.search(r"customJobs/(\d+)", combined_out)
        job_id = job_match.group(1) if job_match else "unknown"
        logger.info(f"Submitted Vertex AI Job '{display_name}' (id={job_id}) -> {out_gcs}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
