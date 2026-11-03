#!/usr/bin/env python3
# SPDX-License-Identifier: AGPL-3.0-or-later
"""EasyLM Hugging Face Hub Artifact Uploader and Staging Verifier.

The single CLI script that uploads a trained adapter folder to Hugging Face Hub through
`adapter_publish_gate.publish_adapter_folder`. Requires all gate evidence files
(`adapter_model.safetensors`, `adapter_config.json`, `training_metadata.json`,
`trainer_state.json`, `eval_results.json`, plus `refusal_eval.json` for `kidsafety`)
and an explicit `--confirm-publish` flag for non-dry-run uploads.
"""

from __future__ import annotations

import argparse
import hashlib
import logging
import os
from pathlib import Path
import sys
from typing import List

from adapter_publish_gate import (
    REQUIRED_FILES,
    PublishGateError,
    check_publish_gate,
    publish_adapter_folder,
    required_files_for,
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("upload_to_hf")


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()


def verify_staged_artifacts(folder: Path, repo_id: str) -> List[Path]:
    if not folder.is_dir():
        raise FileNotFoundError(f"Target adapter directory not found: {folder}")

    staged_files: List[Path] = []
    for req in required_files_for(repo_id):
        fp = folder / req
        if not fp.is_file():
            raise FileNotFoundError(f"Missing required artifact: {req} in {folder}")
        staged_files.append(fp)

    total_bytes = 0
    for p in staged_files:
        size = p.stat().st_size
        total_bytes += size
        digest = sha256_file(p)[:16]
        logger.info(f"Staged {p.name:<28} {size:>12,d} bytes [sha256: {digest}...]")
    logger.info(f"Total staged evidence files: {len(staged_files)} ({total_bytes / (1024 * 1024):.2f} MiB)")
    return staged_files


def main() -> int:
    parser = argparse.ArgumentParser(description="Upload verified EasyLM adapter artifacts to Hugging Face Hub")
    parser.add_argument(
        "--folder",
        type=str,
        required=True,
        help="Local directory containing trained adapter weights and gate evidence files",
    )
    parser.add_argument(
        "--repo-id",
        type=str,
        required=True,
        help="Hugging Face target repository (e.g. 'Bluebarrels/easylm-hands-bonsai-2-2b')",
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
        default="Upload verified EasyLM LoRA adapter",
        help="Commit message for upload",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        default=False,
        help="Verify staged artifacts through the publish gate without network upload",
    )
    parser.add_argument(
        "--confirm-publish",
        action="store_true",
        default=False,
        help="Explicit confirmation required to execute live Hugging Face upload",
    )

    args = parser.parse_args()
    folder_path = Path(args.folder).resolve()

    try:
        verify_staged_artifacts(folder_path, args.repo_id)
        check_publish_gate(folder_path, args.repo_id)
    except (OSError, PublishGateError) as err:
        logger.error(f"Publish gate verification failed: {err}")
        return 1

    if args.dry_run:
        logger.info(f"Dry-run passed: {folder_path} satisfies all publish gate invariants for {args.repo_id}.")
        return 0

    if not args.confirm_publish:
        logger.error("Refusing to upload without explicit --confirm-publish flag.")
        return 1

    import huggingface_hub
    from huggingface_hub import HfApi

    token = args.token or os.environ.get("HF_TOKEN") or os.environ.get("HUGGING_FACE_HUB_TOKEN") or huggingface_hub.get_token()
    if not token:
        logger.error("No Hugging Face authentication token found.")
        return 1

    api = HfApi(token=token)
    publish_adapter_folder(
        api,
        folder_path,
        args.repo_id,
        commit_message=args.commit_message,
        private=args.private,
    )
    logger.info(f"Upload complete: https://huggingface.co/{args.repo_id}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
