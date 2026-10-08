import os
import sys
import time
from pathlib import Path
import modal
from huggingface_hub import HfApi, get_token

ROOT = Path(r"C:\Users\jpm05\Documents\hnai\easylm\output\adapters")
ROOT.mkdir(parents=True, exist_ok=True)

ADAPTER_SPECS = [
    {
        "remote_slug": "kidsafety_qwen2.5-0.5b-instruct",
        "local_dir": ROOT / "kidsafety_qwen2.5-0.5b-instruct",
        "repo_id": "Bluebarrels/easylm-kidsafety-qwen2.5-0.5b",
        "base_model": "Qwen/Qwen2.5-0.5B-Instruct",
        "target": "kidsafety",
        "desc": "child safety boundaries, educational guidance, age-appropriate filtering, and content protection.",
        "tags": ["kidsafety", "child-safety"],
        "intended": "Deployable inside EasyLM client-side WebGPU browser runtimes and local agent pipelines to ensure child-safe interactions, age-adapted explanations, and ethical boundary enforcement.",
    },
    {
        "remote_slug": "kidsafety_qwen2.5-3b-instruct",
        "local_dir": ROOT / "kidsafety_qwen2.5-3b-instruct",
        "repo_id": "Bluebarrels/easylm-kidsafety-qwen2.5-3b",
        "base_model": "Qwen/Qwen2.5-3B-Instruct",
        "target": "kidsafety",
        "desc": "child safety boundaries, educational guidance, age-appropriate filtering, and content protection.",
        "tags": ["kidsafety", "child-safety"],
        "intended": "Deployable inside EasyLM client-side WebGPU browser runtimes and local agent pipelines to ensure child-safe interactions, age-adapted explanations, and ethical boundary enforcement.",
    },
    {
        "remote_slug": "personalities_qwen2.5-0.5b-instruct",
        "local_dir": ROOT / "personalities_qwen2.5-0.5b-instruct",
        "repo_id": "Bluebarrels/easylm-personalities-qwen2.5-0.5b",
        "base_model": "Qwen/Qwen2.5-0.5B-Instruct",
        "target": "personalities",
        "desc": "adaptive pedagogical tone, empathetic tutoring, curiosity stimulation, and persona alignment.",
        "tags": ["personalities", "tutoring"],
        "intended": "Specialized for interactive educational tutoring, personalized cognitive scaffolding, and dynamic conversational tone adaptation within the EasyLM ecosystem.",
    },
    {
        "remote_slug": "personalities_qwen2.5-3b-instruct",
        "local_dir": ROOT / "personalities_qwen2.5-3b-instruct",
        "repo_id": "Bluebarrels/easylm-personalities-qwen2.5-3b",
        "base_model": "Qwen/Qwen2.5-3B-Instruct",
        "target": "personalities",
        "desc": "adaptive pedagogical tone, empathetic tutoring, curiosity stimulation, and persona alignment.",
        "tags": ["personalities", "tutoring"],
        "intended": "Specialized for interactive educational tutoring, personalized cognitive scaffolding, and dynamic conversational tone adaptation within the EasyLM ecosystem.",
    },
    {
        "remote_slug": "security_qwen2.5-0.5b-instruct",
        "local_dir": ROOT / "security_qwen2.5-0.5b-instruct",
        "repo_id": "Bluebarrels/easylm-security-qwen2.5-0.5b",
        "base_model": "Qwen/Qwen2.5-0.5B-Instruct",
        "target": "security",
        "desc": "adversarial prompt defense, instruction isolation, secret containment, and security boundary enforcement.",
        "tags": ["security", "guardrails"],
        "intended": "Specialized for sovereign agent security, preventing prompt injection, safeguarding local secrets, and maintaining strict execution fence compliance.",
    },
    {
        "remote_slug": "security_qwen2.5-3b-instruct",
        "local_dir": ROOT / "security_qwen2.5-3b-instruct",
        "repo_id": "Bluebarrels/easylm-security-qwen2.5-3b",
        "base_model": "Qwen/Qwen2.5-3B-Instruct",
        "target": "security",
        "desc": "adversarial prompt defense, instruction isolation, secret containment, and security boundary enforcement.",
        "tags": ["security", "guardrails"],
        "intended": "Specialized for sovereign agent security, preventing prompt injection, safeguarding local secrets, and maintaining strict execution fence compliance.",
    },
]

def make_readme(spec):
    tags_str = "\n".join(f"- {t}" for t in spec["tags"])
    return f"""---
base_model: {spec["base_model"]}
library_name: peft
pipeline_tag: text-generation
tags:
- lora
- easylm
{tags_str}
- agent
- qwen
license: apache-2.0
---

# {spec["repo_id"].split('/')[-1]}

Discrete low-rank adapter specializing **{spec["base_model"]}** in {spec["desc"]}

## Model Details

- Base model: {spec["base_model"]}
- Adapter target: {spec["target"]}
- Parameter rank r: 16
- Alpha scaling: 32
- Dropout: 0.05
- Target projection modules: q_proj, k_proj, v_proj, o_proj, gate_proj, up_proj, down_proj
- Precision: bfloat16 mixed precision
- License: Apache-2.0

## Intended Use

{spec["intended"]}
"""

def main():
    token = get_token()
    if not token:
        print("ERROR: Hugging Face token not found in cache.")
        sys.exit(1)
    
    api = HfApi(token=token)
    user_info = api.whoami()
    print(f"HF User: {user_info.get('name')}")

    vol = modal.Volume.from_name("easylm-adapters")
    print("Connected to Modal volume: easylm-adapters")

    for spec in ADAPTER_SPECS:
        slug = spec["remote_slug"]
        local_dir = spec["local_dir"]
        repo_id = spec["repo_id"]
        local_dir.mkdir(parents=True, exist_ok=True)

        print(f"\n=======================================================")
        print(f"Processing: {slug} -> {repo_id}")
        print(f"=======================================================")

        remote_entries = vol.listdir(slug)
        file_entries = [e for e in remote_entries if e.type == 1]
        
        for entry in file_entries:
            fname = entry.path.split("/")[-1]
            dest_file = local_dir / fname
            if dest_file.exists() and dest_file.stat().st_size > 0:
                print(f"  [cached] {fname} ({dest_file.stat().st_size / 1e6:.2f} MB)")
                continue
            
            t0 = time.time()
            chunks = list(vol.read_file(entry.path))
            with open(dest_file, "wb") as f:
                for c in chunks:
                    f.write(c)
            dur = time.time() - t0
            print(f"  [downloaded] {fname} ({dest_file.stat().st_size / 1e6:.2f} MB in {dur:.2f}s)")

        # Write formatted README.md
        readme_path = local_dir / "README.md"
        readme_content = make_readme(spec)
        readme_path.write_text(readme_content, encoding="utf-8")
        print(f"  [written] Formatted README.md for {repo_id}")

        # Ensure HF repo exists
        print(f"  [hf-hub] Ensuring repo exists: {repo_id}")
        api.create_repo(repo_id=repo_id, repo_type="model", exist_ok=True)

        # Upload folder
        print(f"  [hf-hub] Uploading {local_dir} to {repo_id}...")
        api.upload_folder(
            folder_path=str(local_dir),
            repo_id=repo_id,
            repo_type="model",
            commit_message=f"Upload EasyLM {spec['target']} LoRA adapter for {spec['base_model']}",
            ignore_patterns=["checkpoints*", "*.tmp", "*.log"],
        )
        print(f"  [+] Upload complete: https://huggingface.co/{repo_id}")

        # Verify remote files
        repo_files = api.list_repo_files(repo_id=repo_id, repo_type="model")
        print(f"  [verified] Remote repo files ({len(repo_files)}): {repo_files}")

    print("\nALL ADAPTERS DOWNLOADED AND UPLOADED SUCCESSFULLY.")

if __name__ == "__main__":
    main()
