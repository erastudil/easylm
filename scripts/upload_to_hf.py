#!/usr/bin/env python3
# SPDX-License-Identifier: AGPL-3.0-or-later
"""EasyLM Hugging Face Hub Artifact Uploader and Staging Verifier.

Uploads fine-tuned discrete LoRA adapters to the Hugging Face Model Hub,
verifying weights, tokenizer assets, and model cards before transmission.
"""

from __future__ import annotations

import argparse
import hashlib
import logging
import os
from pathlib import Path
import sys
from typing import List, Optional

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("upload_to_hf")

REQUIRED_FILES = [
    "adapter_model.safetensors",
    "adapter_config.json",
    "README.md",
]

OPTIONAL_FILES = [
    "tokenizer.json",
    "tokenizer_config.json",
    "vocab.json",
    "merges.txt",
    "special_tokens_map.json",
    "added_tokens.json",
]


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()


def verify_staged_artifacts(folder: Path) -> List[Path]:
    if not folder.is_dir():
        raise FileNotFoundError(f"Target adapter directory not found: {folder}")

    staged_files: List[Path] = []
    logger.info(f"Inspecting staged adapter artifacts at: {folder.resolve()}")

    for req in REQUIRED_FILES:
        fp = folder / req
        if not fp.is_file():
            raise FileNotFoundError(f"Missing required artifact: {req} in {folder}")
        staged_files.append(fp)

    for opt in OPTIONAL_FILES:
        fp = folder / opt
        if fp.is_file():
            staged_files.append(fp)

    total_bytes = 0
    print("\n" + "=" * 70)
    print("                STAGED ARTIFACTS INVENTORY                ")
    print("=" * 70)
    for p in staged_files:
        size = p.stat().st_size
        total_bytes += size
        digest = sha256_file(p)[:16]
        print(f"  * {p.name:<28} {size:>12,d} bytes  [sha256: {digest}...]")
    print("-" * 70)
    print(f"  TOTAL: {len(staged_files)} files, {total_bytes:,d} bytes ({total_bytes / (1024 * 1024):.2f} MiB)")
    print("=" * 70 + "\n")

    return staged_files


def main() -> int:
    parser = argparse.ArgumentParser(description="Upload EasyLM adapter artifacts to Hugging Face Hub")
    parser.add_argument(
        "--folder",
        type=str,
        default="hnai/easylm/output/adapters/hands_qwen2.5-0.5b-instruct",
        help="Local directory containing adapter weights and metadata",
    )
    parser.add_argument(
        "--repo-id",
        type=str,
        default="hnai/easylm-qwen-0.5b-hands",
        help="Hugging Face target repository (e.g. 'hnai/easylm-qwen-0.5b-hands')",
    )
    parser.add_argument(
        "--token",
        type=str,
        default=None,
        help="Hugging Face API write token (defaults to HF_TOKEN or HUGGING_FACE_HUB_TOKEN)",
    )
    parser.add_argument(
        "--private",
        action="store_true",
        default=False,
        help="Create repository as private",
    )
    parser.add_argument(
        "--commit-message",
        type=str,
        default="Upload EasyLM Hands LoRA adapter for Qwen2.5-0.5B-Instruct",
        help="Commit message for upload",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        default=False,
        help="Verify staged artifacts without initiating network upload",
    )

    args = parser.parse_args()
    folder_path = Path(args.folder).resolve()

    try:
        staged_files = verify_staged_artifacts(folder_path)
    except Exception as err:
        logger.error(f"Artifact verification failed: {err}")
        return 1

    import huggingface_hub
    from huggingface_hub import HfApi

    token = args.token or os.environ.get("HF_TOKEN") or os.environ.get("HUGGING_FACE_HUB_TOKEN")
    if not token:
        hydra_env = Path.home() / ".hydra" / ".env"
        if hydra_env.is_file():
            try:
                from dotenv import load_dotenv
                load_dotenv(hydra_env)
                token = os.environ.get("HF_TOKEN") or os.environ.get("HUGGING_FACE_HUB_TOKEN")
            except Exception:
                pass
    if not token:
        token = huggingface_hub.get_token()

    if args.dry_run or not token:
        if not token:
            logger.warning("[!] No Hugging Face authentication token detected.")
            logger.info("    To upload staged artifacts to Hugging Face Hub:")
            logger.info(f"    1. Set HF_TOKEN environment variable: $env:HF_TOKEN=\"hf_...\"")
            logger.info(f"    2. Or run: python hnai/easylm/scripts/upload_to_hf.py --token <hf_token> --repo-id {args.repo_id}")
        else:
            logger.info(f"[*] Dry-run mode enabled: Staging verified. Repository destination: https://huggingface.co/{args.repo_id}")
        return 0

    logger.info(f"Authenticating with Hugging Face Hub API...")
    api = HfApi(token=token)

    try:
        user_info = api.whoami()
        logger.info(f"[+] Authenticated as: {user_info.get('name', 'Unknown')}")
    except Exception as err:
        logger.error(f"Authentication verification failed: {err}")
        return 1

    logger.info(f"Ensuring repository '{args.repo_id}' exists (private={args.private})...")
    try:
        api.create_repo(repo_id=args.repo_id, private=args.private, exist_ok=True)
    except Exception as err:
        logger.error(f"Failed to create or access repository '{args.repo_id}': {err}")
        return 1

    logger.info(f"Uploading staged directory {folder_path} to {args.repo_id}...")
    try:
        api.upload_folder(
            folder_path=str(folder_path),
            repo_id=args.repo_id,
            commit_message=args.commit_message,
            ignore_patterns=["checkpoints*", "*.tmp", "*.log"],
        )
        logger.info(f"[SUCCESS] Upload complete: https://huggingface.co/{args.repo_id}")
    except Exception as err:
        logger.error(f"Upload failed: {err}")
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
