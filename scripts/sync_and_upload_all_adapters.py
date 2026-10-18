import os
import sys
import time
from pathlib import Path
import modal
from adapter_publish_gate import publish_adapter_folder
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
    },
    {
        "remote_slug": "kidsafety_qwen2.5-3b-instruct",
        "local_dir": ROOT / "kidsafety_qwen2.5-3b-instruct",
        "repo_id": "Bluebarrels/easylm-kidsafety-qwen2.5-3b",
        "base_model": "Qwen/Qwen2.5-3B-Instruct",
        "target": "kidsafety",
    },
    {
        "remote_slug": "personalities_qwen2.5-0.5b-instruct",
        "local_dir": ROOT / "personalities_qwen2.5-0.5b-instruct",
        "repo_id": "Bluebarrels/easylm-personalities-qwen2.5-0.5b",
        "base_model": "Qwen/Qwen2.5-0.5B-Instruct",
        "target": "personalities",
    },
    {
        "remote_slug": "personalities_qwen2.5-3b-instruct",
        "local_dir": ROOT / "personalities_qwen2.5-3b-instruct",
        "repo_id": "Bluebarrels/easylm-personalities-qwen2.5-3b",
        "base_model": "Qwen/Qwen2.5-3B-Instruct",
        "target": "personalities",
    },
    {
        "remote_slug": "security_qwen2.5-0.5b-instruct",
        "local_dir": ROOT / "security_qwen2.5-0.5b-instruct",
        "repo_id": "Bluebarrels/easylm-security-qwen2.5-0.5b",
        "base_model": "Qwen/Qwen2.5-0.5B-Instruct",
        "target": "security",
    },
    {
        "remote_slug": "security_qwen2.5-3b-instruct",
        "local_dir": ROOT / "security_qwen2.5-3b-instruct",
        "repo_id": "Bluebarrels/easylm-security-qwen2.5-3b",
        "base_model": "Qwen/Qwen2.5-3B-Instruct",
        "target": "security",
    },
]

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

        # Gate the folder, write the generated model card, create the repo and upload
        print(f"  [hf-hub] Publishing {local_dir} to {repo_id} through the publish gate...")
        publish_adapter_folder(
            api,
            local_dir,
            repo_id,
            commit_message=f"Upload EasyLM {spec['target']} LoRA adapter for {spec['base_model']}",
        )
        print(f"  [+] Upload complete: https://huggingface.co/{repo_id}")

        # Verify remote files
        repo_files = api.list_repo_files(repo_id=repo_id, repo_type="model")
        print(f"  [verified] Remote repo files ({len(repo_files)}): {repo_files}")

    print("\nALL ADAPTERS DOWNLOADED AND UPLOADED SUCCESSFULLY.")

if __name__ == "__main__":
    main()
