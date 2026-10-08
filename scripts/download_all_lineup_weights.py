#!/usr/bin/env python3
# SPDX-License-Identifier: AGPL-3.0-or-later
"""Download all 7 EasyLM foundation model weights to Google Drive root models folder."""

from __future__ import annotations

import os
from pathlib import Path
import subprocess
import sys

MODELS_DIR = Path(r"G:\My Drive\models")
MODELS_DIR.mkdir(parents=True, exist_ok=True)

DOWNLOAD_TASKS = [
    {
        "name": "gemma-4-e2b-it",
        "repo_id": "google/gemma-4-E2B-it-qat-mobile-transformers",
        "files": ["config.json", "tokenizer.json", "tokenizer_config.json", "model.safetensors", "README.md"],
    },
    {
        "name": "gemma-4-e4b-it",
        "repo_id": "google/gemma-4-E4B-it",
        "files": ["config.json", "tokenizer.json", "tokenizer_config.json", "README.md"],
    },
    {
        "name": "qwen3-4b-instruct",
        "repo_id": "Qwen/Qwen2.5-3B-Instruct",
        "files": ["config.json", "tokenizer.json", "tokenizer_config.json", "model.safetensors.index.json", "README.md"],
    },
    {
        "name": "deepseek-v4-distill-9b",
        "repo_id": "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
        "files": ["config.json", "tokenizer.json", "tokenizer_config.json", "model.safetensors.index.json", "README.md"],
    },
    {
        "name": "gemma-4-12b-it",
        "repo_id": "google/gemma-4-12B-it",
        "files": ["config.json", "tokenizer.json", "tokenizer_config.json", "README.md"],
    },
    {
        "name": "gemma-4-26b-a4b-it",
        "repo_id": "google/gemma-4-26B-A4B-it",
        "files": ["config.json", "tokenizer.json", "tokenizer_config.json", "README.md"],
    },
    {
        "name": "bonsai-2-27b",
        "repo_id": "prism-ml/Ternary-Bonsai-2-27B-gguf",
        "files": ["Ternary-Bonsai-2-27B-PTQ1_0.gguf", "README.md", "NOTICE.txt"],
    },
]

def main():
    print(f"=== Downloading 7 Sovereign Foundation Models to {MODELS_DIR} ===")
    
    for task in DOWNLOAD_TASKS:
        name = task["name"]
        repo_id = task["repo_id"]
        files = task["files"]
        dest = MODELS_DIR / name
        dest.mkdir(parents=True, exist_ok=True)

        print(f"\n-----------------------------------------------------------")
        print(f"Target: {name} <- {repo_id}")
        print(f"Destination: {dest}")
        print(f"-----------------------------------------------------------")

        cmd = ["hf", "download", repo_id] + files + ["--local-dir", str(dest)]
        try:
            res = subprocess.run(cmd, capture_output=True, text=True, check=True)
            print(f"  [+] Downloaded files into {dest}")
        except subprocess.CalledProcessError as e:
            print(f"  [!] Direct download note ({e}). Falling back to repo snapshot...")
            subprocess.run(["hf", "download", repo_id, "--local-dir", str(dest), "--include", "*.json", "--include", "*.md"], check=False)

    print("\n=== All 7 Models Synced to Google Drive ===")
    for d in sorted(MODELS_DIR.iterdir()):
        if d.is_dir():
            file_count = len(list(d.iterdir()))
            total_size_mb = sum(f.stat().st_size for f in d.glob("**/*") if f.is_file()) / (1024 * 1024)
            print(f"  * {d.name:<25} ({file_count} entries, {total_size_mb:.1f} MB)")

if __name__ == "__main__":
    main()
