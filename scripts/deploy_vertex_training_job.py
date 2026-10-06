#!/usr/bin/env python3
# SPDX-License-Identifier: AGPL-3.0-or-later
"""EasyLM Vertex AI & GCE Training Job Dispatcher.

Orchestrates serverless Vertex AI Custom Jobs or GCE spot instances to train
discrete EasyLM LoRA adapters (Hands, Personalities, Security, Kid Safety).

Verified GCP Infrastructure:
- Project: bastion-510306
- Region: us-central1
- Staging Bucket: gs://cloud-ai-platform-a75ae046-b3be-4949-bb56-de35a075764f
- Data Bucket: gs://bastion-510306-vault/easylm/data/
- Pre-built Training Container: us-docker.pkg.dev/vertex-ai/training/pytorch-gpu.2-4.py310:latest
- Accelerators:
  • 0.5B - 7B models: g2-standard-8 (1x NVIDIA L4 24GB VRAM, Spot ~$0.25/hr)
  • 12B thinking model: a2-highgpu-1g (1x NVIDIA A100 40GB VRAM, Spot ~$0.95/hr)
"""

from __future__ import annotations

import argparse
import json
import logging
import os
from pathlib import Path
import re
import subprocess
import time
import sys
from typing import Any, Dict, List, Optional

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("deploy_vertex_job")

GCP_PROJECT = "bastion-510306"
GCP_REGION = "us-central1"
GCS_STAGING_BUCKET = "gs://cloud-ai-platform-a75ae046-b3be-4949-bb56-de35a075764f"
GCS_DATA_BUCKET = "gs://bastion-510306-vault/easylm/data"
TRAINING_IMAGE_URI = "us-docker.pkg.dev/vertex-ai/training/pytorch-gpu.2-4.py310:latest"

TIER_MACHINE_SPECS = {
    "qwen-0.5b": {"machine_type": "a2-highgpu-1g", "accelerator_type": "NVIDIA_TESLA_A100", "accelerator_count": 1},
    "qwen-1.5b": {"machine_type": "a2-highgpu-1g", "accelerator_type": "NVIDIA_TESLA_A100", "accelerator_count": 1},
    "qwen-3b":   {"machine_type": "a2-highgpu-1g", "accelerator_type": "NVIDIA_TESLA_A100", "accelerator_count": 1},
    "qwen-7b":   {"machine_type": "a2-highgpu-1g", "accelerator_type": "NVIDIA_TESLA_A100", "accelerator_count": 1},
    "qwen-coder-7b": {"machine_type": "a2-highgpu-1g", "accelerator_type": "NVIDIA_TESLA_A100", "accelerator_count": 1},
    "gemma-12b": {"machine_type": "a2-highgpu-1g", "accelerator_type": "NVIDIA_TESLA_A100", "accelerator_count": 1}
}


def run_cmd(cmd: List[str], check: bool = True) -> subprocess.CompletedProcess:
    logger.info(f"Running command: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True, shell=(sys.platform == 'win32'))
    if check and result.returncode != 0:
        logger.error(f"Command failed (exit {result.returncode}):\n{result.stderr}")
        raise RuntimeError(f"Command failed: {result.stderr.strip()}")
    return result


def verify_gcp_preflight() -> bool:
    """Verifies gcloud auth, active project, and storage bucket access."""
    logger.info("Executing GCP Step 0 Pre-Flight Verification...")
    
    # 1. Check gcloud CLI
    auth_check = run_cmd(["gcloud", "config", "get-value", "account"], check=False)
    account = auth_check.stdout.strip()
    if not account or auth_check.returncode != 0:
        logger.error("No active gcloud authentication detected.")
        return False
    logger.info(f"[+] Active GCP Account: {account}")

    # 2. Check Project
    proj_check = run_cmd(["gcloud", "config", "get-value", "project"], check=False)
    project = proj_check.stdout.strip()
    if project != GCP_PROJECT:
        logger.warning(f"Active project is '{project}', configuring to target '{GCP_PROJECT}'...")
        run_cmd(["gcloud", "config", "set", "project", GCP_PROJECT])
    logger.info(f"[+] Verified Project: {GCP_PROJECT}")

    # 3. Check Staging Bucket
    bucket_check = run_cmd(["gcloud", "storage", "buckets", "describe", GCS_STAGING_BUCKET], check=False)
    if bucket_check.returncode != 0:
        logger.error(f"Cannot access staging bucket: {GCS_STAGING_BUCKET}")
        return False
    logger.info(f"[+] Verified Staging Bucket: {GCS_STAGING_BUCKET}")

    return True


def stage_datasets_to_gcs(local_data_dir: Path) -> bool:
    """Uploads compiled adapter datasets to GCS data bucket."""
    logger.info(f"Staging adapter datasets from {local_data_dir} to {GCS_DATA_BUCKET}...")
    adapter_files = list(local_data_dir.glob("adapter_*_chatml.jsonl"))
    if not adapter_files:
        logger.error(f"No adapter dataset files found in {local_data_dir}")
        return False

    for af in adapter_files:
        dest_url = f"{GCS_DATA_BUCKET}/{af.name}"
        logger.info(f"Uploading {af.name} -> {dest_url}...")
        run_cmd(["gcloud", "storage", "cp", str(af), dest_url])
        
    logger.info("[+] All adapter datasets staged to GCS successfully.")
    return True


def build_vertex_custom_job_spec(
    model_alias: str,
    adapter_name: str,
    output_dir: str,
    push_to_hub: bool = False
) -> Dict[str, Any]:
    """Constructs the JSON payload for a Vertex AI Custom Job."""
    spec = TIER_MACHINE_SPECS.get(model_alias, TIER_MACHINE_SPECS["qwen-3b"])
    
    # Configure hyperparams by model tier
    batch_size = "2" if any(k in model_alias for k in ["1.5b", "3b", "7b", "12b"]) else "4"
    grad_accum = "8" if any(k in model_alias for k in ["1.5b", "3b", "7b", "12b"]) else "4"
    lr = "1.5e-4" if any(k in model_alias for k in ["1.5b", "3b"]) else ("1e-4" if any(k in model_alias for k in ["7b", "12b"]) else "2e-4")

    # Arguments passed into train_adapters_gcloud.py inside the container
    container_args = [
        "python3", "train_adapters_gcloud.py",
        "--base-model", model_alias,
        "--adapter", adapter_name,
        "--data-dir", "./data",
        "--output-dir", "./output",
        "--epochs", "3",
        "--batch-size", batch_size,
        "--grad-accum", grad_accum,
        "--lr", lr,
        "--max-seq-len", "2048",
        "--lora-r", "16",
        "--lora-alpha", "32"
    ]
    if any(k in model_alias for k in ["1.5b", "3b", "7b", "12b"]):
        container_args.append("--gradient-checkpointing")
    if push_to_hub:
        container_args.append("--push-to-hub")

    bash_pipeline = (
        "pip install --upgrade pip && "
        "pip install python-json-logger 'transformers<5.0.0' peft 'trl<0.13.0' datasets accelerate bitsandbytes && "
        "mkdir -p ./data ./output && "
        f"gcloud storage cp {GCS_DATA_BUCKET}/*.jsonl ./data/ && "
        "gcloud storage cp gs://bastion-510306-vault/easylm/scripts/train_adapters_gcloud.py . && "
        f"{' '.join(container_args)} && "
        f"gcloud storage cp -r ./output/* {output_dir}/"
    )

    job_spec = {
        "workerPoolSpecs": [
            {
                "machineSpec": {
                    "machineType": spec["machine_type"],
                    "acceleratorType": spec["accelerator_type"],
                    "acceleratorCount": spec["accelerator_count"]
                },
                "replicaCount": 1,
                "containerSpec": {
                    "imageUri": TRAINING_IMAGE_URI,
                    "command": ["/bin/bash", "-c"],
                    "args": [bash_pipeline]
                }
            }
        ],
        "scheduling": {"strategy": "SPOT"},
        "baseOutputDirectory": {
            "outputUriPrefix": f"{GCS_STAGING_BUCKET}/jobs/{adapter_name}-{model_alias}"
        }
    }
    return job_spec


def main() -> int:
    parser = argparse.ArgumentParser(description="EasyLM Vertex AI Adapter Training Job Dispatcher")
    parser.add_argument("--model", type=str, choices=list(TIER_MACHINE_SPECS.keys()), default="qwen-3b",
                        help="Target model tier (default: 'qwen-3b')")
    parser.add_argument("--adapter", type=str, choices=["hands", "personalities", "security", "kidsafety", "all"],
                        default="hands", help="Target adapter (default: 'hands')")
    parser.add_argument("--stage-data", action="store_true", default=False,
                        help="Upload local adapter datasets to GCS before submitting")
    parser.add_argument("--dry-run", action="store_true", default=False,
                        help="Generate job config and verify pre-flight without submitting API request")
    parser.add_argument("--push-to-hub", action="store_true", default=False,
                        help="Push adapter weights to Hugging Face Hub from cloud runner")
    args = parser.parse_args()

    print("=================================================================")
    print("      EasyLM Vertex AI Adapter Training Job Dispatcher           ")
    print("=================================================================")

    # 1. Pre-flight verification
    if not verify_gcp_preflight():
        logger.error("[FAIL] Pre-flight verification failed. Aborting.")
        return 1

    # 2. Stage datasets if requested
    local_data_dir = Path(__file__).resolve().parents[1] / "data"
    if args.stage_data:
        if not stage_datasets_to_gcs(local_data_dir):
            return 1

    # 3. Generate Job Specs
    adapters = [args.adapter] if args.adapter != "all" else ["hands", "personalities", "security", "kidsafety"]
    submitted_jobs = {}
    
    for adapter in adapters:
        out_gcs = f"{GCS_STAGING_BUCKET}/models/{args.model}/adapters/{adapter}"
        job_spec = build_vertex_custom_job_spec(args.model, adapter, out_gcs, args.push_to_hub)
        spec_file = local_data_dir / f"vertex_job_{args.model}_{adapter}.json"
        
        with open(spec_file, "w", encoding="utf-8") as f:
            json.dump(job_spec, f, indent=2)
            
        logger.info(f"[+] Wrote Vertex AI Job Spec: {spec_file.name}")
        logger.info(f"    Machine Type: {job_spec['workerPoolSpecs'][0]['machineSpec']['machineType']}")
        logger.info(f"    Accelerator:  {job_spec['workerPoolSpecs'][0]['machineSpec']['acceleratorType']}")
        logger.info(f"    Output GCS:   {out_gcs}")

        display_name = f"easylm-lora-{adapter}-{args.model}"
        if args.dry_run:
            logger.info(f"[*] Dry-run mode: Job '{display_name}' configured and validated.")
            logger.info("    To submit manually via gcloud CLI:")
            logger.info(f"    gcloud ai custom-jobs create --region={GCP_REGION} --display-name={display_name} --config={spec_file}\n")
        else:
            logger.info(f"Submitting Custom Job to Vertex AI ({GCP_REGION})...")
            submit_cmd = [
                "gcloud", "ai", "custom-jobs", "create",
                f"--region={GCP_REGION}",
                f"--display-name={display_name}",
                f"--config={str(spec_file)}"
            ]
            res = run_cmd(submit_cmd)
            if res.stdout:
                print(res.stdout)
            if res.stderr:
                print(res.stderr)
            logger.info(f"[+] Vertex AI Job '{display_name}' submitted successfully.")
            combined_out = (res.stdout or "") + "\n" + (res.stderr or "")
            job_match = re.search(r"customJobs/(\d+)", combined_out)
            job_id = job_match.group(1) if job_match else "unknown"
            console_url = f"https://console.cloud.google.com/vertex-ai/locations/{GCP_REGION}/training/{job_id}?project={GCP_PROJECT}"
            logger.info(f"    Job ID: {job_id}")
            logger.info(f"    Console URL: {console_url}")
            submitted_jobs[adapter] = {"id": job_id, "display_name": display_name, "url": console_url, "output_gcs": out_gcs}

    if submitted_jobs:
        print("\n=================================================================")
        print("                SUBMITTED VERTEX AI CUSTOM JOBS                 ")
        print("=================================================================")
        for adapter_k, info in submitted_jobs.items():
            print(f"Adapter: {adapter_k.upper()}")
            print(f"  Job ID:       {info['id']}")
            print(f"  Display Name: {info['display_name']}")
            print(f"  Console URL:  {info['url']}")
            print(f"  Output GCS:   {info['output_gcs']}\n")
    print("\n[SUCCESS] GCloud adapter training pipeline configured and ready.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
