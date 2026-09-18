# EasyLM

**Free, zero-install local intelligence in your browser.**  
WebGPU inference running directly on your machine's GPU. The official application stays free forever.

[![Deploy with Vercel](https://vercel.com/button)](https://easylm.vercel.app)

Copyright (C) 2026 Humans and AI. GNU AGPL-3.0 or later. This program comes with ABSOLUTELY NO WARRANTY.

---

## What is EasyLM?

EasyLM is an open-source, consumer alternative to hosted AI platforms that **executes entirely on your local GPU** using standard WebGPU APIs.

- **Zero Install, Zero Account:** Open the URL in any modern browser. No account registration, API keys, or cloud subscriptions required.
- **Privacy by Construction:** Prompts, system envelopes, chat generation, and session histories execute and persist in your browser. Tokens never leave your machine.
- **Direct Weight Caching:** Model weights download directly from Hugging Face into browser CacheStorage on first run, remaining cached offline for instant future loads.
- **AtMem (Atomic & Attentive Memory):** Discrete, typed memory atoms with dynamic BM25 relevance scoring, strict token budgeting, profile isolation, and parental governance.
- **Client-Side Vault Encryption:** Optional AES-GCM-256 encryption with 600,000-round PBKDF2 key derivation protects conversations, profiles, and memory banks at rest in IndexedDB.
- **LaTeX Math Support:** High-performance KaTeX math rendering for LaTeX expressions in both interactive chat and Studio reading modes.
- **Studio & Learn Integration:** An integrated suite featuring 30 undergraduate textbooks, interactive learning courses, math graphing, code sandboxes, and drawing canvases.
- **Strict UI Canon:** Zero horizontal scrollbars on desktop or mobile devices, responsive layout wrapping, and clean interface naming.

---

## Supported Models

EasyLM dynamically detects your hardware tier and recommends the optimal model for your GPU's Video RAM:

| Model | Download | VRAM Footprint | Tier & Sweet Spot | Upstream License |
|---|---|---|---|---|
| **Bonsai 2 27B (PrismML)** | ~5.9 GB | ~6.8 GB | **Recommended for ~12GB VRAM & under.** Extreme ternary quantization brings 27B reasoning to consumer GPUs. | Apache-2.0 |
| **Qwen 2.5 3B Instruct** | ~1.9 GB | ~2.2 GB | **Default for 8GB cards.** Everyday workhorse. Balanced reasoning, coding, and fast throughput. | Apache-2.0 |
| **Llama 3.2 3B Instruct** | ~2.0 GB | ~2.3 GB | **8GB tier.** Meta's compact 3B model. Sharp reasoning and concise conversational flow. | Llama 3.2 |
| **DeepSeek-R1 Distill Qwen 7B** | ~4.5 GB | ~5.1 GB | **8GB–16GB tier.** Heavyweight chain-of-thought reasoning for deeper analytical tasks. | MIT |
| **Gemma 2 9B Instruct** | ~5.8 GB | ~6.4 GB | **16GB tier.** High-caliber intelligence running comfortably without overloading host memory. | Gemma |
| **DeepSeek-R1 Distill Qwen 1.5B** | ~1.0 GB | ~1.6 GB | **4GB tier.** Extended reasoning and step-by-step thinking for low-memory systems. | MIT |
| **Qwen 2.5 1.5B Instruct** | ~1.1 GB | ~1.4 GB | **Ultralight (4GB tier).** Instant startup, low memory. Runs smoothly on phones, tablets, and iGPUs. | Apache-2.0 |

*Note: Model weights retain their upstream licenses. The EasyLM application code is licensed under GNU AGPL-3.0 or later.*

---

## Core Systems & Architecture

### 1. AtMem (Atomic & Attentive Memory)

EasyLM replaces monolithic memory dumps with an atomic, attentive memory architecture:

- **Typed Memory Atoms:** Memories are stored as discrete units classified into specific categories: `rule`, `goal`, `preference`, `fact`, and `insight`.
- **Attentive Relevance Budgeting:** On every user prompt, AtMem calculates token-overlap and BM25 relevance across elective memories, retrieving only the most salient atoms within a strict 256-token envelope (~1,000 characters). This preserves WebGPU context windows for generation and reasoning.
- **Profile Context Separation:** Memory banks are partitioned strictly by profile ID. Student profiles cannot inspect or inherit parent memory atoms.
- **Governed Mandates:** Parents can designate critical behavioral rules as `🛡️ Governed Mandates`. Governed rules are always injected into the model envelope regardless of query relevance and require a parental PIN to alter or delete.
- **PII Sentinel Gate:** On creation, memory atoms pass through a local privacy filter that blocks sensitive personally identifiable information (phone numbers, physical addresses, school names) from entering persistent browser memory.

### 2. Learn: Integrated Academic Curriculum

The Learn system provides structured, self-paced academic courses with comprehensive lesson objectives, reading assignments, and interactive checks:

- **Scientific Inquiry I:** Evidence, Logic & Empirical Proof
- **Calculus I:** Limits, Derivatives & Rates of Change
- **Physics I:** Mechanics, Motion & Energy
- **Chemistry I:** Atoms, Bonding & Chemical Reactions
- **Biology I:** Cellular Life & Molecular Biology
- **Civics I:** Constitutional Democracy, Civil Rights & Governance
- **Health Sciences I:** Human Physiology, Wellness & Disease

Each course links directly into Studio, allowing learners to open textbooks, inspect link trees, and navigate between lessons and primary sources without leaving the application.

### 3. The Stacks: 30 Academic Disciplines

The Stacks provide comprehensive undergraduate textbooks and curated link trees across 30 sovereign academic fields, including mathematics, physics, computing, information security & cryptography, skilled trades & machining, earth sciences, philosophy, agriculture, language, and poetry.

Textbooks follow the **Greene / Feynman pedagogical method**:
- Physical, sensory intuition first: concepts are introduced through everyday observations and first principles.
- Formal terminology second: technical vocabulary and mathematical notation are introduced only once the physical reality is grasped.
- Subject-authentic pedagogy: avoids formulaic copy-paste structures, meeting the learner in the native voice and conceptual landscape of each discipline.

### 4. Studio: Local Creative & Analytical Suite

Studio unites creative and technical tools in a single interface:
- **Read:** Markdown viewer with full KaTeX LaTeX typesetting, internal cross-links, and external authoritative doors.
- **Write:** Markdown drafting notebook with real-time word counting, outline view, and clean formatting.
- **Code:** Syntax-highlighted code editor supporting JavaScript, TypeScript, Python, HTML, and CSS.
- **Graph:** Function plotting and 2D coordinate graphing.
- **Draw & Paint:** Freeform vector sketching and raster painting canvases.

### 5. Hands: Local & Network Tool Dispatch

- **Local Hands (Never leave the device):**
  - KaTeX math evaluator and equation solver.
  - Strict dimensional unit converter (fails closed on unknown or invalid conversions).
  - System clock and local calendar.
  - Offline Stacks and curriculum search.
- **Network Hands (Optional, user-toggled):**
  - Trusted academic web search.
  - CORS-compliant page reader for Wikipedia, Wikiquote, Wikisource, and open documentation.
  - Live weather, ECB foreign exchange rates, dictionary lookups, and encyclopedia summaries.

---

## Security & Vault Encryption

- **Local Storage Encryption:** Users can encrypt their entire local workspace with an optional master password or PIN. The vault uses AES-GCM-256 with PBKDF2 key derivation (600,000 iterations and cryptographic salts).
- **Kid Safe Mode:** Locks tool execution to local tools only, requiring a parental PIN to disable.
- **Zero Cloud Telemetry:** EasyLM contains no third-party tracking scripts, analytics beacons, or remote logging.

---

## Current Development Status & Known Issues

EasyLM is in active open public beta. We are radically transparent about what works today and what remains under heavy development:

- **Where We Are:** Instant WebGPU inference in modern browsers, 30 undergraduate textbooks in The Stacks, 7 comprehensive university courses in Learn, and full local Studio tools with zero cloud tracking and zero accounts.
- **The Adapter Reality:** Base open-weight models in the 1.5B–3B range (Qwen 2.5, DeepSeek-R1 Distill) **need task-specific fine-tuned adapters badly to be reliable**. Currently, EasyLM uses regex pre-flight routing, strict system envelopes, and ZCABS canary checks to mitigate tool-calling drift and maintain Socratic guidance. We are actively training lightweight LoRA adapters in earnest to achieve deterministic tool dispatch and rock-solid reasoning.
- **Known Limitations:**
  - *Cold-Start Weight Download:* First load requires downloading 1.0 GB – 1.9 GB of model weights from Hugging Face into browser cache. (Mitigation: non-LLM tools like Stacks, Math, and Graphing work instantly with 0 MB downloaded).
  - *WebGPU Ecosystem Gaps:* Firefox requires `dom.webgpu.enabled = true` in `about:config`; mobile browsers frequently hit memory limits; integrated GPUs with < 3 GB shared VRAM can hit OOM on 3B models.
  - *Context Window VRAM Ceilings:* High context allocations (32k–256k) require substantial system memory.
  - *Stacks Retrieval:* Currently powered by deterministic BM25 keyword matching rather than semantic vector embeddings.

For our full breakdown, mitigation strategies, and architecture details, see [ROADMAP.md](ROADMAP.md).

---

## Development Priorities & Collaboration Roadmap

We are building EasyLM as a permanent, free sovereign alternative to subscription AI platforms:

1. **Dedicated Model Adapters (LoRAs):** Training fine-tuned adapters for 1.5B/3B models to guarantee 99%+ schema reliability on in-browser tool calls and patient Socratic inquiry.
2. **Improved Local Tooling & Sandboxes:** Connecting our Tier 1 WASI micro-shell and Tier 2 v86 Wasm container for safe on-device Python and JavaScript code execution, paired with client-side drag-and-drop file ingestion (PDF, CSV, MD).
3. **Expanded Stacks & Learn Coursework:** Developing Wave 2 undergraduate courses (AI/ML 006, Cryptography 005.8, Systems/Wasm 004, Economics 330) alongside 15-minute "Mastery Sprints" for rapid concept acquisition.
4. **Agentic Sovereign Workspaces:** Multi-step autonomous reasoning loops (Inspect -> Plan -> Tool -> Synthesize) and single-file self-contained HTML artifact exports that rival paid Copilot and ChatGPT Plus workspaces without sending tokens to the cloud.

---

## Development

Patches: [CONTRIBUTING.md](CONTRIBUTING.md) · Detailed Roadmap: [ROADMAP.md](ROADMAP.md). `npm test` is the gate.

### Prerequisites

- Node.js 18+
- npm 9+

### Setup & Verification

```bash
# Clone the repository
git clone https://github.com/erastudil/easylm.git
cd easylm

# Install dependencies
npm install

# Compile academic stacks and wave courses
node scripts/compile_stacks.mjs
node scripts/compile_courses.mjs

# Run full test harness (vitest)
npm test

# Verify TypeScript types
npx tsc --noEmit

# Start local development server
npm run dev

# Build production bundle
npm run build
```

---

## System Requirements

EasyLM requires a browser with native WebGPU support:

- **Google Chrome / Chromium:** Version 113 or newer
- **Microsoft Edge:** Version 113 or newer
- **Apple Safari:** Version 18 or newer (macOS Sequoia, iOS 18, iPadOS 18)
- **Mozilla Firefox:** Nightly builds with `dom.webgpu.enabled` set to `true`

---

## Acknowledgments & Name Lineage

- **Ecosystem Lineage:** Our zero-install, in-browser WebGPU application is distinct from [young-geng/EasyLM](https://github.com/young-geng/EasyLM), the 2023 JAX/Flax distributed pre-training framework (Apache-2.0) by Xinyang (Young) Geng and Hao Liu at UC Berkeley that trained OpenLLaMA. We respect and salute their foundational contributions to open-weights training.
- **Full Attributions:** Full credits for our WebGPU inference stack, open-weights providers (DeepSeek, Meta, Qwen, Google DeepMind, Mistral, Microsoft, Hugging Face), and upstream open-source engines are documented in our interactive Credits modal and [src/data/credits.ts](src/data/credits.ts).

---

## License & Covenant

EasyLM is free software licensed under the **GNU Affero General Public License v3.0 or later** (AGPL-3.0-or-later). See [LICENSE](LICENSE) for full details.

- **No Rent on Shared Bits:** The official EasyLM app is hosted free forever without paywalls or ads.
- **Copyleft Assurance:** If you host or run a modified version for others over a network, you must make the complete source code available to your users under the AGPL.

Security inquiries and vulnerability reports: see [SECURITY.md](SECURITY.md).
