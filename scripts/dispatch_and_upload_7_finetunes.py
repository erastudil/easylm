#!/usr/bin/env python3
# SPDX-License-Identifier: AGPL-3.0-or-later
"""Publish the 7 EasyLM fine-tune adapters to Hugging Face under `Bluebarrels/`.

Each folder under `output/finetunes/<slug>` publishes through
`adapter_publish_gate.publish_adapter_folder`: weights, adapter config, training log, loss
curve and eval result must sit next to each other, and the model card is generated from them.
"""

from __future__ import annotations

from pathlib import Path
import sys

from adapter_publish_gate import PublishGateError, check_publish_gate, publish_adapter_folder
from huggingface_hub import HfApi, get_token

EASYLM_ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = EASYLM_ROOT / "output" / "finetunes"

# 7 target repos across EasyLM memory tiers
FINETUNE_REPOS = [
    ("Bluebarrels/easylm-gemma-4-e2b-it", "easylm-gemma-4-e2b-it"),
    ("Bluebarrels/easylm-gemma-4-e4b-it", "easylm-gemma-4-e4b-it"),
    ("Bluebarrels/easylm-qwen3-4b-instruct", "easylm-qwen3-4b-instruct"),
    ("Bluebarrels/easylm-deepseek-v4-distill-9b", "easylm-deepseek-v4-distill-9b"),
    ("Bluebarrels/easylm-gemma-4-12b-it", "easylm-gemma-4-12b-it"),
    ("Bluebarrels/easylm-gemma-4-26b-a4b-it", "easylm-gemma-4-26b-a4b-it"),
    ("Bluebarrels/easylm-bonsai-2-27b", "easylm-bonsai-2-27b"),
]


def main() -> int:
    gate_failures: list[str] = []
    for repo_id, slug in FINETUNE_REPOS:
        try:
            check_publish_gate(OUTPUT_DIR / slug, repo_id)
        except PublishGateError as err:
            gate_failures.append(f"{repo_id}: {err}")
    if gate_failures:
        print(f"[PUBLISH GATE] {len(gate_failures)} of {len(FINETUNE_REPOS)} repos fail; nothing was uploaded:")
        for failure in gate_failures:
            print(f"  - {failure}")
        return 1

    token = get_token()
    if not token:
        print("[ERROR] Hugging Face token not found in cache.")
        return 1

    api = HfApi(token=token)
    print(f"=== Hugging Face Authenticated as: {api.whoami().get('name')} ===")

    for repo_id, slug in FINETUNE_REPOS:
        publish_adapter_folder(api, OUTPUT_DIR / slug, repo_id, commit_message=f"Release {slug}")
        print(f"  [SUCCESS] Live on Hugging Face: https://huggingface.co/{repo_id}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
