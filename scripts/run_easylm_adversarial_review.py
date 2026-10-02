#!/usr/bin/env python3
"""
scripts/run_easylm_adversarial_review.py
Executes parallel adversarial reviews across Claude Opus 5.5 and DeepSeek V3
for EasyLM AtMem Privacy Fences, WebGPU OOM Recovery, and Multi-Agent Orchestration.
"""

import os
import sys
import json
import urllib.request
import urllib.error

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REVIEWS_DIR = os.path.join(ROOT, "docs", "reviews")
os.makedirs(REVIEWS_DIR, exist_ok=True)

OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY", "")
if not OPENROUTER_API_KEY:
    print("[ERROR] OPENROUTER_API_KEY is not set.", file=sys.stderr)
    sys.exit(1)

SYSTEM_PROMPT = (
    "You are a principal systems security architect, WebGPU performance engineer, "
    "and clinical HIPAA compliance auditor. Conduct an uncompromising, rigorous, "
    "adversarial engineering review. Speak concisely and technically without fluff."
)

AUDIT_PROMPT = """
# ADVERSARIAL ENGINEERING REVIEW: EASYLM SOVEREIGN ARCHITECTURE

Review the following recent implementations in the EasyLM repository (100% in-browser, AGPL-3.0, WebGPU LLM):

### 1. AtMem Client Partitioning & HIPAA Alignment
- Problem: Therapists need sovereign, local-only LLM assistance to prepare for client sessions, take SOAP notes, and review treatment plans without risking cloud data egress or cross-client leakage.
- Implementation:
  * Strict client partitioning (`clientId`) with hard cryptographic/namespace invariant checks.
  * Invariant assertion: `getClientAtoms(clientId)` and `getAppointmentPrepEnvelope(clientId)` throw immediate fatal exceptions if any atom from another client partition is detected.
  * Clinical category hierarchy: `risk_factor` (suicide/self-harm/crisis) strictly prioritized at the top of prompt envelopes, followed by `medication`, `treatment_goal`, and `session_note`.
  * Child-safety PII Sentinel bypassed in clinical practitioner mode to allow recording client names and observations, while enforcing AES-GCM-256 local encrypted vault at rest.
  * HIPAA § 164.312(b) audit trail: append-only local audit log with action, timestamp, clientId, atomId. Zero network transmission.

### 2. WebGPU OOM Recovery & Stability
- Problem: Browser WebGPU engines crash or drop context when large models exceed VRAM buffers, causing catastrophic UI locks.
- Implementation:
  * Progressive context window step-down: Halving context allocation (32k -> 16k -> 8k -> 4k -> 2k -> 1k -> 512).
  * Separation of pure buffer OOM from device death (`gpu_process_dead` vs `oom`), allowing single-attempt recovery before device is lost.
  * Sovereign 1-click fallback to ultralight 1.5B model (`Qwen2.5-1.5B-Instruct-q4f16_1-MLC`).
  * Purged all Microsoft Edge commands; standardized restart command to Brave (`brave://restart`), Zen/Firefox (`about:restart`), and Chromium (`chrome://restart`).

### 3. Personality Cards & Character Card V2 Interchange
- Implementation: Added clinical companion cards (`clinical_assistant` SOAP formatter, `reflective_counselor` Rogerian active listener, `cbt_guide` Beckian cognitive restructuring).
- Implemented export and import supporting both native EasyLM format and the open Character Card V2 JSON standard.

### 4. Multi-Agent Orchestration Codification
- Workflow: AGY parent conductor orchestrating builder/verifier worktrees, summoning frontier models (Opus 5.5, Sol 6.1 Pro, DeepSeek V3) via sovereign CLI for adversarial review.

### AUDIT INSTRUCTIONS:
Evaluate:
1. Are there edge cases where `clientId` partitioning could leak cross-client data (e.g. legacy atoms without `clientId`, race conditions in `saveAllAtoms`)?
2. What additional technical safeguards are needed to achieve true enterprise HIPAA compliance readiness?
3. In WebGPU, does progressive context step-down actually free VRAM if the underlying TVM/MLC engine pipeline cached buffer allocations?
4. Are the clinical prompt cards ethically sound (safeguards against diagnosing, crisis referral boundaries)?
5. What are the top 3 high-priority recommendations for our next development wave?
"""

def call_openrouter(model_id: str, label: str) -> str:
    print(f"\n[START] Summoning {label} ({model_id})...")
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://snowgate.dev",
        "X-Title": "EasyLM Adversarial Review"
    }
    payload = {
        "model": model_id,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": AUDIT_PROMPT}
        ],
        "temperature": 0.2
    }
    req = urllib.request.Request(url, headers=headers, data=json.dumps(payload).encode("utf-8"))
    try:
        with urllib.request.urlopen(req, timeout=180) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            content = data["choices"][0]["message"]["content"]
            print(f"[SUCCESS] Received response from {label} ({len(content)} chars)")
            return content
    except Exception as e:
        print(f"[ERROR] Failed calling {label}: {e}", file=sys.stderr)
        return f"ERROR: {e}"

def main():
    # Model 1: DeepSeek V3 (fast, thorough, low credit cost)
    deepseek_review = call_openrouter("deepseek/deepseek-chat", "DeepSeek V3")

    # Model 2: Claude Opus 5.5 (deep frontier adversarial reasoning)
    opus_review = call_openrouter("anthropic/claude-opus-5.5", "Claude Opus 5.5")

    # Combine into markdown document
    out_file = os.path.join(REVIEWS_DIR, "ADVERSARIAL_REVIEW_OPUS_DEEPSEEK.md")
    with open(out_file, "w", encoding="utf-8") as f:
        f.write("# EasyLM Adversarial Review: AtMem Privacy, WebGPU Stability & Orchestration\n\n")
        f.write(f"**Date**: 2026-10-01\n")
        f.write(f"**Models**: DeepSeek V3 (`deepseek/deepseek-chat`) · Claude Opus 5.5 (`anthropic/claude-opus-5.5`)\n\n")
        f.write("## 1. DeepSeek V3 Adversarial Assessment\n\n")
        f.write(deepseek_review + "\n\n")
        f.write("---\n\n")
        f.write("## 2. Claude Opus 5.5 Adversarial Assessment\n\n")
        f.write(opus_review + "\n")

    print(f"\n[DONE] Saved adversarial reviews to: {out_file}")

if __name__ == "__main__":
    main()
