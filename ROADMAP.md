# EasyLM Roadmap, Known Issues & Development Priorities

**Open, honest assessment of current progress, known limitations, and active development tracks.**  
EasyLM is free software licensed under the **GNU AGPL-3.0 or later**. We believe in radical transparency: no marketing spin, no hidden telemetry, and no overstated capabilities.

---

## 1. Where We Are: An Honest Assessment

EasyLM provides zero-install, in-browser local AI running entirely on your GPU via WebGPU. Today, you can run models like Qwen 2.5 (1.5B/3B) and DeepSeek-R1 Distill (1.5B) locally, navigate 30 collegiate textbooks in **The Stacks**, complete structured undergraduate courses in **Learn**, and use local drafting, graphing, and code sandboxes in **Studio**—all with zero tracking and zero cloud lock-in.

### The Model Adapter Reality
While base open-weight models in the 1.5B–3B parameter class are an incredible triumph of open research, **base models in this weight class need fine-tuned task adapters badly to be reliable.**

- **The Problem:** Without fine-tuned adapters, 1.5B–3B parameter models frequently drift during multi-turn chats, hallucinate unsupported tool calls, output irregular XML/JSON syntax, or struggle to maintain a patient Socratic tutoring posture without leaking direct answers.
- **Current Scaffolding:** EasyLM currently bridges this gap using strict system envelopes, regex pre-flight routing, deterministic fallback tools, and the [ZCABS](src/engine/zcabs.ts) honesty canary.
- **The Active Fix:** Prompt scaffolding has inherent ceilings. We are **actively working in earnest on training lightweight, task-specific LoRA adapters** tailored specifically for WebLLM deployment. These adapters focus on deterministic tool dispatch, Socratic academic guidance, and structured document synthesis.
- **Sovereign Tri-Lake Data:** Through EasyLM's built-in Tri-Lake memory system (thumbs up for Heaven, thumbs down for Hell), users can curate private, high-water-mark training datasets directly from their own chats in IndexedDB, providing sovereign data for local fine-tuning.

---

## 2. Known Issues

We track technical limitations and browser constraints openly:

| Category | Known Limitation | Current Workaround / Mitigation | Long-Term Fix |
|---|---|---|---|
| **Cold-Start Latency** | Initial model load downloads 1.0 GB – 1.9 GB of quantized weights from Hugging Face into browser CacheStorage. On slow connections, this takes 1–2 minutes. | CacheStorage retains weights offline after first download. All non-LLM tools (Stacks, Math, Units, Graphing) work at 0 MB without downloading weights. | Exploring lighter sub-1B specialized utility models; progressive weight streaming with interactive onboarding. |
| **Browser Compatibility** | Firefox requires manual configuration (`dom.webgpu.enabled = true`). Safari 18 has occasional WebGPU buffer allocation quirks. Mobile browsers (iOS/Android) frequently hit memory limits. | Hardware detection modal alerts users if WebGPU is unavailable and suggests compatible browsers. | Upstream WebGPU standardization; memory-capped ultralight mobile profiles. |
| **Tool Calling Drift** | Base models sometimes fabricate tool parameters, emit incomplete JSON tags, or attempt to call network tools when disabled. | Pre-flight regex dispatch catches common math, unit, time, and stack queries deterministically before hitting the LLM; ZCABS flags unverified calls. | Fine-tuned LoRA function-calling adapters trained on structured tool datasets. |
| **VRAM Pressure & Context Ceilings** | Dynamic KV-cache allocation (8k to 256k) can exhaust system memory on machines with integrated GPUs and < 8 GB unified RAM, causing tab crashes. | Safe 4k/8k defaults for lower memory tiers; user-selectable context tiers in Settings. | Adaptive KV-cache compression and quantization; proactive memory monitoring. |
| **Stacks Keyword Search** | Stacks and curriculum searches use BM25 keyword matching and regex pre-flight rather than deep semantic embeddings. | Strict Dewey indexing and curated chapter link trees. | In-browser Wasm vector embeddings (e.g. all-MiniLM-L6-v2 via ONNX/Wasm) running locally for semantic search. |

---

## 3. Current Development Priorities

Our active roadmap is organized into four core pillars designed to provide a robust, sovereign, and free alternative to paid AI subscription platforms:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        EASYLM DEVELOPMENT PILLARS                      │
├───────────────────┬────────────────────┬───────────────────────────────┤
│ 1. MODEL ADAPTERS │ 2. LOCAL TOOLING   │ 3. EXPANDED STACKS & COURSES  │
│ LoRA Tool-Calling │ In-Browser Wasm VM │ Wave 2 Technical Syllabi      │
│ Socratic Guidance │ Local File Ingest  │ 15-Minute Mastery Sprints     │
│ Tri-Lake Dataset  │ KaTeX Math Engine  │ Interactive Code Exercises    │
├───────────────────┴────────────────────┴───────────────────────────────┤
│                   4. AGENTIC SOVEREIGN WORKSPACES                      │
│ Multi-step Reasoning Loops · Zero-Cloud Artifacts · Free vs Paid Parity │
└────────────────────────────────────────────────────────────────────────┘
```

### Priority 1: Dedicated Model Adapters (LoRAs)
- **Tool-Call Alignment:** Fine-tune 1.5B and 3B models to emit clean, deterministic tool calls (`<tool_call>{"name": "...", "arguments": {...}}</tool_call>`) with 99%+ schema reliability.
- **Socratic Pedagogical Alignment:** Train adapters that prioritize inquiry, guided hints, and conceptual understanding over instant solution hand-offs.
- **WebLLM Multi-LoRA Pipeline:** Implement dynamic in-browser LoRA delta loading so users can switch model specializations without redownloading multi-gigabyte base weights.

### Priority 2: Improved Local Tooling & Sandboxes
- **Wasm Virtual Machine Sandboxing:** Connect the Tier 1 WASI micro-shell and Tier 2 v86 Alpine Linux container (`src/engine/zcabs.ts`) to the chat interface, enabling safe on-device Python and JavaScript code execution.
- **Local File & Document Ingestion:** Drag-and-drop ingestion for PDF, CSV, JSON, Markdown, and TXT files, parsed entirely client-side using Web Workers without sending a byte over the network.
- **Enhanced Studio Analytical Tools:** Native 2D/3D equation graphing, KaTeX formula authoring, and tabular data inspection tools.

### Priority 3: Expanded Stacks & Learn Coursework
- **Wave 2 Undergraduate Courses:**
  - `ai-systems-1`: Artificial Intelligence, Neural Systems & Local Transformers (Dewey 006)
  - `crypto-systems-1`: Applied Modern Cryptography & Privacy Engineering (Dewey 005.8)
  - `systems-prog-1`: Systems Programming, Memory Safety & WebAssembly (Dewey 004)
  - `finance-micro-1`: Financial Engineering & Automated Market Microstructure (Dewey 330)
- **Mastery Sprints:** 15-minute self-contained modules designed for rapid concept acquisition: 1 intuition walk, 1 interactive diagram, 3 check questions.
- **Interactive Code Checks:** Hands-on programming assignments evaluated directly inside the browser's local Wasm container.

### Priority 4: Free Sovereign Alternative to Paid Services
- **Autonomous Reasoning Loops:** Multi-step agentic execution (Inspect -> Formulate Plan -> Call Tool -> Evaluate Output -> Synthesize) running locally on consumer laptops.
- **Sovereign Artifact Generation:** Export complete conversations, interactive charts, and study progress into self-contained, standalone single-file HTML documents.
- **Zero Account, Zero Meter:** Maintain the permanent guarantee that core tools, memory banks, textbooks, and inference remain 100% free and client-side under the AGPL-3.0 covenant.

---

## 4. Contributing & Collaboration Guide

EasyLM is built as a public good. We welcome contributors who share our commitment to open science, sovereign computing, and accessible education.

### Immediate Areas Where Contributors Can Help:
1. **Curriculum & Stacks Authors:**
   - Author new chapters and reading guides following the **Greene / Feynman method**: intuition first, formal terminology second.
   - Expand practice quizzes, project rubrics, and exam items in `scripts/wave1_courses.mjs`.
2. **WebGPU & Engine Hackers:**
   - Optimize WebLLM shader performance and KV-cache management for low-memory devices.
   - Refine browser detection and graceful fallbacks in `src/engine/device.ts` and `src/engine/webllm.ts`.
3. **Adapter & Evaluation Engineers:**
   - Help build synthetic tool-use datasets for LoRA fine-tuning.
   - Implement benchmark harnesses to measure local token throughput, accuracy, and tool adherence.
4. **UI/UX & Accessibility Polishers:**
   - Ensure strict compliance with UI Canon: **zero horizontal scrollbars**, clean flex wrapping, responsive mobile layouts, and crisp noun labels (Studio, Learn, History).

### Ready to Contribute?
- Review [CONTRIBUTING.md](CONTRIBUTING.md) for environment setup and patch instructions.
- Ensure all tests pass with `npm test` before submitting pull requests.
- Verify our ethical principles in [COVENANT.md](COVENANT.md) and security protocols in [SECURITY.md](SECURITY.md).
