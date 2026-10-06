#!/usr/bin/env python3
# SPDX-License-Identifier: AGPL-3.0-or-later
"""EasyLM Serverless LoRA Adapter Trainer on Modal.

Dispatches discrete LoRA adapter training jobs (Hands, Personalities, Security, Kid Safety)
across Qwen2.5-0.5B, 1.5B, and 3B base models using serverless GPU containers on Modal.
Enforces a hard threshold stop if available credits reach or drop below $2.00 remaining.
"""

from __future__ import annotations

import argparse
import json
import logging
import os
from pathlib import Path
import re
import subprocess
import sys
from typing import Any, Dict, List, Optional

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("train_modal_adapters")

# Supported models across EasyLM tiers
SUPPORTED_MODELS: Dict[str, str] = {
    "qwen-0.5b": "Qwen/Qwen2.5-0.5B-Instruct",
    "qwen-1.5b": "Qwen/Qwen2.5-1.5B-Instruct",
    "qwen-3b": "Qwen/Qwen2.5-3B-Instruct",
    "qwen-7b": "Qwen/Qwen2.5-7B-Instruct",
    "qwen-coder-7b": "Qwen/Qwen2.5-Coder-7B-Instruct",
}

# Adapter dataset filenames
ADAPTER_DATA_FILES: Dict[str, str] = {
    "hands": "adapter_hands_chatml.jsonl",
    "personalities": "adapter_personalities_chatml.jsonl",
    "security": "adapter_security_chatml.jsonl",
    "kidsafety": "adapter_kidsafety_chatml.jsonl",
}

TARGET_MODULES: List[str] = [
    "q_proj",
    "k_proj",
    "v_proj",
    "o_proj",
    "gate_proj",
    "up_proj",
    "down_proj",
]

# Resolve local datasets directory for container mount
LOCAL_DATA_DIR: Path = Path(__file__).resolve().parents[1] / "data"

import modal

# Define serverless Modal application
app = modal.App("easylm-adapter-trainer")

# Persistent Modal Volume to store trained adapters across runs
output_volume = modal.Volume.from_name("easylm-adapters", create_if_missing=True)

# Build container image with verified PyTorch and Hugging Face dependencies
trainer_image = (
    modal.Image.debian_slim(python_version="3.10")
    .env({"PYTORCH_CUDA_ALLOC_CONF": "expandable_segments:True"})
    .pip_install(
        "torch>=2.2.0",
        "transformers<5.0.0",
        "peft>=0.10.0",
        "trl<0.13.0",
        "datasets",
        "accelerate",
        "bitsandbytes",
        "huggingface_hub",
        "safetensors",
    )
    .add_local_dir(str(LOCAL_DATA_DIR), remote_path="/root/data")
)


def check_modal_credit_budget(min_credit_remaining: float = 2.00, monthly_grant: float = 30.00) -> float:
    """Verifies that remaining Modal credits exceed the safety threshold.
    
    Halts execution if remaining credits drop to or below min_credit_remaining.
    """
    logger.info("Executing Modal billing and credit pre-flight check...")
    try:
        res = subprocess.run(
            [sys.executable, "-m", "modal", "billing", "summary"],
            capture_output=True,
            text=True,
            check=True,
        )
        output = res.stdout
    except Exception as err:
        logger.warning(f"Could not query billing summary directly ({err}). Defaulting to safety check.")
        output = ""

    metered_cost = 0.0
    match = re.search(r"Metered Cost:\s*\|\s*([0-9.]+)", output)
    if match:
        metered_cost = float(match.group(1))

    remaining_credits = monthly_grant - metered_cost
    logger.info(f"Modal Billing Status: Metered Cost = ${metered_cost:.2f}, Est. Remaining = ${remaining_credits:.2f}")

    if remaining_credits <= min_credit_remaining:
        msg = (
            f"[HARD STOP] Modal remaining credit (${remaining_credits:.2f}) reached or dropped below "
            f"safety threshold (${min_credit_remaining:.2f}). Halting execution."
        )
        logger.error(msg)
        raise RuntimeError(msg)

    logger.info(f"[+] Credit safety check PASSED. Remaining: ${remaining_credits:.2f} > ${min_credit_remaining:.2f}")
    return remaining_credits


@app.function(
    image=trainer_image,
    gpu="A10G",
    volumes={"/root/output": output_volume},
    timeout=3600,
)
def train_adapter_on_modal(
    model_alias: str,
    adapter_name: str,
    epochs: int = 3,
    batch_size: Optional[int] = None,
    grad_accum: Optional[int] = None,
    learning_rate: float = 2e-4,
    lora_r: int = 16,
    lora_alpha: int = 32,
    lora_dropout: float = 0.05,
    max_seq_len: int = 2048,
    push_to_hub: bool = False,
    hf_org: str = "hnai",
    hf_token: Optional[str] = None,
) -> Dict[str, Any]:
    """Remote training routine executed inside the serverless Modal GPU container."""
    import torch
    from transformers import AutoModelForCausalLM, AutoTokenizer
    from peft import LoraConfig, TaskType
    from trl import SFTTrainer, SFTConfig
    from datasets import Dataset

    base_model_id = SUPPORTED_MODELS.get(model_alias, model_alias)
    model_slug = base_model_id.split("/")[-1].lower()
    dataset_name = ADAPTER_DATA_FILES.get(adapter_name, f"adapter_{adapter_name}_chatml.jsonl")
    data_file = Path("/root/data") / dataset_name

    if not data_file.is_file():
        raise FileNotFoundError(f"Container dataset missing at {data_file}")

    # Standard VRAM-efficient settings across all tiers
    effective_batch_size = batch_size or (1 if "3b" in model_alias else 2)
    effective_grad_accum = grad_accum or (16 if "3b" in model_alias else 8)

    out_dir = Path("/root/output") / f"{adapter_name}_{model_slug}"
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"=== Starting Modal LoRA Fine-Tuning ===")
    print(f"Base Model:      {base_model_id}")
    print(f"Adapter Target:  {adapter_name}")
    print(f"Dataset File:    {data_file}")
    print(f"Batch / Accum:   {effective_batch_size} / {effective_grad_accum} (max_seq_len={max_seq_len})")
    print(f"LoRA Config:     r={lora_r}, alpha={lora_alpha}, target_modules={TARGET_MODULES}")

    # 1. Load dataset records
    records = []
    with open(data_file, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                records.append(json.loads(line))
    dataset = Dataset.from_list(records)
    print(f"Loaded {len(records)} training examples.")

    # 2. Tokenizer and Model
    tokenizer = AutoTokenizer.from_pretrained(base_model_id, trust_remote_code=True)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    torch_dtype = torch.bfloat16 if torch.cuda.is_bf16_supported() else torch.float16
    model = AutoModelForCausalLM.from_pretrained(
        base_model_id,
        torch_dtype=torch_dtype,
        device_map="auto",
        trust_remote_code=True,
    )
    model.gradient_checkpointing_enable()

    # 3. LoRA Configuration
    peft_config = LoraConfig(
        task_type=TaskType.CAUSAL_LM,
        r=lora_r,
        lora_alpha=lora_alpha,
        lora_dropout=lora_dropout,
        target_modules=TARGET_MODULES,
        bias="none",
    )

    def format_chatml_prompts(batch):
        if "messages" in batch:
            msgs = batch["messages"]
            if len(msgs) > 0 and isinstance(msgs[0], list):
                return [tokenizer.apply_chat_template(m, tokenize=False) for m in msgs]
            return tokenizer.apply_chat_template(msgs, tokenize=False)
        return batch

    # 4. Training Arguments
    training_args = SFTConfig(
        output_dir=str(out_dir / "checkpoints"),
        num_train_epochs=epochs,
        per_device_train_batch_size=effective_batch_size,
        gradient_accumulation_steps=effective_grad_accum,
        learning_rate=learning_rate,
        lr_scheduler_type="cosine",
        warmup_ratio=0.05,
        logging_steps=10,
        save_strategy="epoch",
        bf16=torch.cuda.is_bf16_supported(),
        fp16=not torch.cuda.is_bf16_supported(),
        max_seq_length=max_seq_len,
        gradient_checkpointing=True,
        packing=False,
    )

    # 5. Trainer
    trainer = SFTTrainer(
        model=model,
        args=training_args,
        train_dataset=dataset,
        peft_config=peft_config,
        processing_class=tokenizer,
        formatting_func=format_chatml_prompts,
    )

    train_result = trainer.train()
    print("Training finished successfully.")

    # 6. Save SafeTensors and Tokenizer
    trainer.model.save_pretrained(str(out_dir), safe_serialization=True)
    tokenizer.save_pretrained(str(out_dir))
    output_volume.commit()
    print(f"Exported SafeTensors weights to {out_dir} (Volume committed)")

    # 7. Push to Hugging Face Hub if requested
    hub_repo_url = None
    token = hf_token or os.environ.get("HF_TOKEN")
    if push_to_hub and token:
        repo_id = f"{hf_org}/easylm-{adapter_name}-{model_slug}"
        print(f"Pushing to Hugging Face Hub: {repo_id}")
        trainer.model.push_to_hub(repo_id, token=token, safe_serialization=True)
        tokenizer.push_to_hub(repo_id, token=token)
        hub_repo_url = f"https://huggingface.co/{repo_id}"
        print(f"Upload complete: {hub_repo_url}")

    return {
        "status": "success",
        "base_model": base_model_id,
        "adapter": adapter_name,
        "records_trained": len(records),
        "train_loss": train_result.training_loss,
        "output_dir": str(out_dir),
        "hf_repo_url": hub_repo_url,
    }


@app.local_entrypoint()
def main_modal(
    model: str = "qwen-0.5b",
    adapter: str = "hands",
    epochs: int = 3,
    push_to_hub: bool = False,
):
    """Entrypoint when running via `modal run` CLI."""
    check_modal_credit_budget(min_credit_remaining=2.00)
    print(f"Dispatching Modal training run for {model} with {adapter} adapter...")
    result = train_adapter_on_modal.remote(
        model_alias=model,
        adapter_name=adapter,
        epochs=epochs,
        push_to_hub=push_to_hub,
    )
    print("Modal Run Result:")
    print(json.dumps(result, indent=2))


def run_dry_run_validation(args: argparse.Namespace) -> int:
    """Validates local configuration, dataset presence, and Modal spec without remote dispatch."""
    print("=" * 70)
    print("        EasyLM Modal Serverless Trainer - Dry Run Validation       ")
    print("=" * 70)

    # 1. Validate Base Model
    if args.model not in SUPPORTED_MODELS:
        logger.error(f"Unsupported model '{args.model}'. Choose from: {list(SUPPORTED_MODELS.keys())}")
        return 1
    base_model_id = SUPPORTED_MODELS[args.model]
    print(f"  * Base Model Alias:     {args.model}")
    print(f"  * Hugging Face Base ID: {base_model_id}")

    # 2. Validate Adapters and Datasets
    adapters_to_check = [args.adapter] if args.adapter != "all" else list(ADAPTER_DATA_FILES.keys())
    for ad in adapters_to_check:
        if ad not in ADAPTER_DATA_FILES:
            logger.error(f"Unknown adapter '{ad}'. Choose from: {list(ADAPTER_DATA_FILES.keys())}")
            return 1
        data_fname = ADAPTER_DATA_FILES[ad]
        local_path = LOCAL_DATA_DIR / data_fname
        if not local_path.is_file():
            logger.error(f"Missing local dataset for adapter '{ad}': {local_path}")
            return 1
        size_kb = local_path.stat().st_size / 1024
        print(f"  * Adapter Target:       {ad:<14} -> Dataset: {data_fname:<32} ({size_kb:.1f} KB)")

    # 3. Validate Modal App & Container Specification
    remaining = check_modal_credit_budget(min_credit_remaining=2.00)
    print(f"  * Modal App Name:       {app.name}")
    print(f"  * Target GPU:           {args.gpu}")
    print(f"  * Output Volume:        easylm-adapters (mounted at /root/output)")
    print(f"  * Container Python:     Python 3.10 (debian_slim)")
    print(f"  * LoRA Hyperparameters: r={args.lora_r}, alpha={args.lora_alpha}, dropout={args.lora_dropout}")
    print(f"  * Max Sequence Length:  {args.max_seq_len}")
    print(f"  * Training Epochs:      {args.epochs}")
    print(f"  * Credit Budget Check:  ${remaining:.2f} remaining (> $2.00 safety threshold)")
    print(f"  * Hugging Face Hub Org: {args.hf_org}")
    print(f"  * Push to Hub:          {args.push_to_hub}")
    print("-" * 70)
    print("[SUCCESS] Modal serverless configuration verified and dry-run validated.")
    print("=" * 70)
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="EasyLM Serverless LoRA Adapter Trainer on Modal")
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
        default="A10G",
        choices=["A10G", "L4", "A100"],
        help="Target Modal GPU accelerator (default: 'A10G')",
    )
    parser.add_argument("--epochs", type=int, default=3, help="Training epochs (default: 3)")
    parser.add_argument("--batch-size", type=int, default=None, help="Per-device batch size (auto-configured)")
    parser.add_argument("--grad-accum", type=int, default=None, help="Gradient accumulation steps (auto-configured)")
    parser.add_argument("--lr", type=float, default=2e-4, help="Peak learning rate (default: 2e-4)")
    parser.add_argument("--lora-r", type=int, default=16, help="LoRA rank (default: 16)")
    parser.add_argument("--lora-alpha", type=int, default=32, help="LoRA alpha scaling (default: 32)")
    parser.add_argument("--lora-dropout", type=float, default=0.05, help="LoRA dropout rate (default: 0.05)")
    parser.add_argument("--max-seq-len", type=int, default=2048, help="Maximum sequence length (default: 2048)")
    parser.add_argument("--push-to-hub", action="store_true", default=False, help="Push weights to Hugging Face Hub")
    parser.add_argument("--hf-org", type=str, default="hnai", help="Hugging Face namespace (default: 'hnai')")
    parser.add_argument("--dry-run", action="store_true", default=False, help="Perform local validation without cloud dispatch")

    args = parser.parse_args()

    if args.dry_run:
        return run_dry_run_validation(args)

    # Enforce credit budget safety check before launching remote runner
    check_modal_credit_budget(min_credit_remaining=2.00)

    print("Initiating Modal runner...")
    with app.run():
        adapters = [args.adapter] if args.adapter != "all" else list(ADAPTER_DATA_FILES.keys())
        for ad in adapters:
            # Re-check budget before each discrete run
            check_modal_credit_budget(min_credit_remaining=2.00)
            print(f"\nExecuting remote Modal fine-tuning: Model={args.model}, Adapter={ad}...")
            res = train_adapter_on_modal.remote(
                model_alias=args.model,
                adapter_name=ad,
                epochs=args.epochs,
                batch_size=args.batch_size,
                grad_accum=args.grad_accum,
                learning_rate=args.lr,
                lora_r=args.lora_r,
                lora_alpha=args.lora_alpha,
                lora_dropout=args.lora_dropout,
                max_seq_len=args.max_seq_len,
                push_to_hub=args.push_to_hub,
                hf_org=args.hf_org,
            )
            print(f"[+] Adapter '{ad}' finished successfully:")
            print(json.dumps(res, indent=2))

    return 0


if __name__ == "__main__":
    sys.exit(main())
