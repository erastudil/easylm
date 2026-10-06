#!/usr/bin/env python3
# SPDX-License-Identifier: AGPL-3.0-or-later
"""EasyLM Sovereign Adapter Training Pipeline for Google Cloud / Vertex AI.

Fine-tunes low-rank adapters (r=16, alpha=32) on compiled EasyLM datasets across target tiers:
- Baby: Qwen/Qwen2.5-0.5B-Instruct
- 1.5B: Qwen/Qwen2.5-1.5B-Instruct
- 3B:   Qwen/Qwen2.5-3B-Instruct
- 7B:   Qwen/Qwen2.5-7B-Instruct / Qwen/Qwen2.5-Coder-7B-Instruct
- 12B:  google/gemma-3-12b-it

Discrete Adapter Targets:
1. hands:        Tool calling syntax, JSON-RPC, schema compliance, tool discrimination.
2. personalities: Socratic, Greene Feynman, Socrates, Sherlock Holmes, Feynman, Marcus Aurelius.
3. security:      Fence compliance, prompt injection defense, sandbox isolation, credential boundaries.
4. kidsafety:     Non-bypassable minor protection, homework coaching hints, local-only tool gating.
"""

from __future__ import annotations

import argparse
import json
import logging
import os
from pathlib import Path
import sys
from typing import Any, Dict, List, Optional

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("train_adapters_gcloud")

SUPPORTED_MODELS = {
    "qwen-0.5b": "Qwen/Qwen2.5-0.5B-Instruct",
    "qwen-1.5b": "Qwen/Qwen2.5-1.5B-Instruct",
    "qwen-3b":   "Qwen/Qwen2.5-3B-Instruct",
    "qwen-7b":   "Qwen/Qwen2.5-7B-Instruct",
    "qwen-coder-7b": "Qwen/Qwen2.5-Coder-7B-Instruct",
    "gemma-12b": "google/gemma-3-12b-it"
}

ADAPTER_DATA_FILES = {
    "hands": "adapter_hands_chatml.jsonl",
    "personalities": "adapter_personalities_chatml.jsonl",
    "security": "adapter_security_chatml.jsonl",
    "kidsafety": "adapter_kidsafety_chatml.jsonl"
}

TARGET_MODULES = ["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="EasyLM GCloud Adapter Training Pipeline")
    parser.add_argument("--base-model", type=str, default="Qwen/Qwen2.5-3B-Instruct",
                        help="Hugging Face base model ID or alias (default: 'Qwen/Qwen2.5-3B-Instruct')")
    parser.add_argument("--adapter", type=str, choices=["hands", "personalities", "security", "kidsafety", "all"],
                        default="hands", help="Target adapter to train")
    parser.add_argument("--data-dir", type=str, default="data",
                        help="Directory containing compiled JSONL datasets (local or GCS)")
    parser.add_argument("--output-dir", type=str, default="output/adapters",
                        help="Directory to save fine-tuned adapter weights")
    parser.add_argument("--hf-org", type=str, default="hnai",
                        help="Hugging Face organization or user namespace (default: 'hnai')")
    parser.add_argument("--push-to-hub", action="store_true", default=False,
                        help="Push adapter weights to Hugging Face Hub")
    parser.add_argument("--hf-token", type=str, default=None,
                        help="Hugging Face API token (defaults to HF_TOKEN env var)")
    
    # Hyperparameters
    parser.add_argument("--lora-r", type=int, default=16, help="LoRA rank (default: 16)")
    parser.add_argument("--lora-alpha", type=int, default=32, help="LoRA alpha scaling (default: 32)")
    parser.add_argument("--lora-dropout", type=float, default=0.05, help="LoRA dropout")
    parser.add_argument("--epochs", type=int, default=3, help="Training epochs")
    parser.add_argument("--batch-size", type=int, default=4, help="Per device batch size")
    parser.add_argument("--grad-accum", type=int, default=4, help="Gradient accumulation steps")
    parser.add_argument("--lr", type=float, default=2e-4, help="Peak learning rate")
    parser.add_argument("--max-seq-len", type=int, default=4096, help="Maximum sequence length")
    parser.add_argument("--bf16", action="store_true", default=True, help="Use bfloat16 mixed precision")
    parser.add_argument("--gradient-checkpointing", action="store_true", default=False, help="Enable gradient checkpointing to reduce activation memory")

    return parser.parse_args()


def load_dataset_records(file_path: Path) -> List[Dict[str, Any]]:
    """Loads and validates ChatML JSONL dataset."""
    if not file_path.is_file():
        raise FileNotFoundError(f"Dataset file missing at {file_path}")
    records = []
    with open(file_path, "r", encoding="utf-8") as f:
        for idx, line in enumerate(f):
            line = line.strip()
            if not line:
                continue
            try:
                data = json.loads(line)
                records.append(data)
            except json.JSONDecodeError as err:
                logger.error(f"Malformed JSON on line {idx + 1}: {err}")
    logger.info(f"Loaded {len(records)} verified examples from {file_path.name}")
    return records


def train_single_adapter(
    base_model_id: str,
    adapter_name: str,
    data_file: Path,
    args: argparse.Namespace
) -> Path:
    """Trains a discrete low-rank adapter using Hugging Face PEFT and TRL."""
    import torch
    from transformers import AutoModelForCausalLM, AutoTokenizer
    from peft import LoraConfig, get_peft_model, TaskType
    from trl import SFTTrainer, SFTConfig
    from datasets import Dataset

    model_slug = base_model_id.split("/")[-1].lower()
    adapter_out_dir = Path(args.output_dir) / f"{adapter_name}_{model_slug}"
    adapter_out_dir.mkdir(parents=True, exist_ok=True)

    logger.info("=" * 70)
    logger.info(f"Initiating LoRA Fine-Tuning: Adapter='{adapter_name}', Base='{base_model_id}'")
    logger.info(f"Parameters: r={args.lora_r}, alpha={args.lora_alpha}, target_modules={TARGET_MODULES}")
    logger.info("=" * 70)

    # 1. Load Dataset
    records = load_dataset_records(data_file)
    dataset = Dataset.from_list(records)

    # 2. Load Tokenizer & Base Model
    logger.info(f"Loading base tokenizer for {base_model_id}...")
    tokenizer = AutoTokenizer.from_pretrained(base_model_id, trust_remote_code=True)
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token

    logger.info(f"Loading base model weights for {base_model_id}...")
    torch_dtype = torch.bfloat16 if (args.bf16 and torch.cuda.is_available() and torch.cuda.is_bf16_supported()) else torch.float16
    
    device_map = "auto" if torch.cuda.is_available() else None
    model = AutoModelForCausalLM.from_pretrained(
        base_model_id,
        torch_dtype=torch_dtype,
        device_map=device_map,
        trust_remote_code=True
    )
    model.config.use_cache = False
    if args.gradient_checkpointing:
        model.enable_input_require_grads()

    # 3. Configure LoRA
    peft_config = LoraConfig(
        task_type=TaskType.CAUSAL_LM,
        r=args.lora_r,
        lora_alpha=args.lora_alpha,
        lora_dropout=args.lora_dropout,
        target_modules=TARGET_MODULES,
        bias="none"
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
        output_dir=str(adapter_out_dir / "checkpoints"),
        num_train_epochs=args.epochs,
        per_device_train_batch_size=args.batch_size,
        gradient_accumulation_steps=args.grad_accum,
        gradient_checkpointing=args.gradient_checkpointing,
        gradient_checkpointing_kwargs={"use_reentrant": False} if args.gradient_checkpointing else None,
        learning_rate=args.lr,
        lr_scheduler_type="cosine",
        warmup_ratio=0.05,
        logging_steps=10,
        save_strategy="epoch",
        bf16=args.bf16 and torch.cuda.is_available() and torch.cuda.is_bf16_supported(),
        fp16=(not (args.bf16 and torch.cuda.is_bf16_supported())) and torch.cuda.is_available(),
        max_seq_length=args.max_seq_len,
        packing=False
    )

    # 5. Execute Trainer
    try:
        trainer = SFTTrainer(
            model=model,
            args=training_args,
            train_dataset=dataset,
            peft_config=peft_config,
            processing_class=tokenizer,
            formatting_func=format_chatml_prompts,
        )
    except TypeError:
        trainer = SFTTrainer(
            model=model,
            args=training_args,
            train_dataset=dataset,
            peft_config=peft_config,
            tokenizer=tokenizer,
            formatting_func=format_chatml_prompts,
        )

    logger.info("Executing training loop...")
    trainer.train()

    # 6. Save Adapter Weights
    logger.info(f"Saving fine-tuned adapter weights to {adapter_out_dir}...")
    trainer.model.save_pretrained(str(adapter_out_dir), safe_serialization=True)
    tokenizer.save_pretrained(str(adapter_out_dir))

    # 7. Push to Hugging Face Hub (Optional)
    if args.push_to_hub:
        repo_id = f"{args.hf_org}/easylm-{adapter_name}-{model_slug}"
        logger.info(f"Pushing adapter to Hugging Face Hub: {repo_id}...")
        hf_token = args.hf_token or os.environ.get("HF_TOKEN")
        trainer.model.push_to_hub(repo_id, token=hf_token, safe_serialization=True)
        tokenizer.push_to_hub(repo_id, token=hf_token)
        logger.info(f"[+] Successfully pushed adapter to https://huggingface.co/{repo_id}")

    return adapter_out_dir


def main() -> int:
    args = parse_args()
    base_model_id = SUPPORTED_MODELS.get(args.base_model, args.base_model)
    data_dir = Path(args.data_dir)

    adapters_to_train = [args.adapter] if args.adapter != "all" else ["hands", "personalities", "security", "kidsafety"]

    logger.info(f"Base Model: {base_model_id}")
    logger.info(f"Target Adapters: {adapters_to_train}")
    logger.info(f"Data Directory: {data_dir.resolve()}")

    results = {}
    for adapter in adapters_to_train:
        data_file_name = ADAPTER_DATA_FILES[adapter]
        data_file = data_dir / data_file_name
        if not data_file.is_file():
            # Check fallback in easylm data directory
            data_file = Path(__file__).resolve().parents[1] / "data" / data_file_name

        if not data_file.is_file():
            logger.error(f"Cannot find dataset for adapter '{adapter}' at {data_file}")
            return 1

        out_path = train_single_adapter(base_model_id, adapter, data_file, args)
        results[adapter] = out_path

    logger.info("=" * 70)
    logger.info("TRAINING PIPELINE COMPLETE")
    for name, path in results.items():
        logger.info(f"  • {name.upper()}: {path}")
    logger.info("=" * 70)

    return 0


if __name__ == "__main__":
    sys.exit(main())
