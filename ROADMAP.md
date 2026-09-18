# EasyLM Development Roadmap

**The North Star: A complete, sovereign educational tool suite and curated library for learning about anything, for anyone.**  
Licensed under the **GNU AGPL-3.0 or later**. Zero telemetry, zero cloud subscription, zero paywalls, zero accounts. Runs entirely inside the user's browser via WebGPU and local client-side engines.

---

## 1. The Dual Mandate

EasyLM serves two distinct user profiles without compromising either:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                    EASYLM DUAL MANDATE                                 │
├───────────────────────────────────────────┬────────────────────────────────────────────┤
│ 1. THE EVERYDAY APPLIANCE (NON-POWER USER)│ 2. THE MODULAR FOUNDATION (POWER USER)     │
│ • Zero configuration, zero install        │ • Headless, decoupled AGPL-3.0 components  │
│ • Instant browser launch on consumer GPUs │ • Reusable WebGPU runner (@easylm/engine)  │
│ • Patient Socratic tutor (Greene/Feynman) │ • Standalone Stacks reader (@easylm/stacks)│
│ • Self-contained offline utility suite    │ • In-browser Wasm sandbox (@easylm/wasm)   │
│ • Zero deadline shame, zero test leak     │ • Open JSON course schemas and quiz banks  │
└───────────────────────────────────────────┴────────────────────────────────────────────┘
```

1. **For the Non-Power User (The Universal Learning Appliance):**  
   The only AI application a student, teacher, or self-directed learner needs. Open the browser tab and it works immediately. Delivers patient, intuitive tutoring, offline textbooks, units conversion, exact math, document reading, and writing assistance without ever asking for an API key, an account, or a monthly fee.

2. **For the Power User & Developer (The Free Composable Foundation):**  
   A transparent, cleanly architected open-source baseline. Power users can borrow standalone components // WebGPU inference engine, The Stacks reference viewer, in-browser Wasm execution sandboxes, curriculum validation scripts // or fork and build custom private training/study environments on top of open schemas.

---

## 2. Core Strategic Pillars

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               EASYLM STRATEGIC PILLARS                                 │
├───────────────────────┬────────────────────────┬───────────────────────────────────────┤
│ I. THE STACKS & MAPS  │ II. UNIVERSAL COURSES  │ III. SOVEREIGN STUDIO                 │
│ Curated Primary Doors │ K-12 to Collegiate     │ In-Browser Wasm Code Sandbox          │
│ Offline Cartography   │ Feynman Pedagogy       │ KaTeX & 2D/3D Interactive Visualizer  │
│ Zero-Hallucination    │ 15-Minute Sprints      │ Local Client-Side Document Ingest     │
├───────────────────────┴────────────────────────┴───────────────────────────────────────┤
│ IV. IN-BROWSER AGENCY & LOCAL INFERENCE        │ V. GLOBAL LOCALIZATION                │
│ Dedicated LoRA Adapters · WebGPU Optimizations │ Multi-Lingual Curriculum & Stacks     │
│ Tri-Lake Sovereign Memory (IndexedDB)          │ Low-Spec Mobile & Offline Deployment  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### Pillar I: The Stacks & Knowledge Cartography

The Stacks is the offline, curated collegiate library shipping inside EasyLM. It rejects raw web crawler dumps in favor of primary authoritative sources.

- **Primary Source Expansion:**  
  Anchor every domain to verified institutional doors // NIST, BIPM, MIT OpenCourseWare, OpenStax, IETF RFCs, W3C, MDN, and primary statutory legal databases.  
  *Rule:* Zero invented constants. Numeric facts must resolve directly to an official door.
- **Offline Deterministic Cartography (System One / Jev Indexing):**  
  Deploy TypeSafe AI's Jev model offline to pre-compute semantic routing maps connecting hundreds of thousands of student query variations to exact sections of `TEXTBOOK.md` and `LINK_INDEX.md`.  
  - Questions evaluated via `Choice` and `Score` primitives with confidence thresholds (`>= 0.90` automatically committed).  
  - Compile high-confidence query-to-door edges into an indexed local lookup table // trie or binary index.  
  - *Result:* Runtime models follow verified cartography rather than guessing search queries, eliminating generative hallucination in fact-seeking turns.
- **English-Map Grounding:**  
  Align vocabulary definitions and concept hierarchies with the English-Map Natural Semantic Metalanguage DAG, enforcing acyclic, child-order dependency across definitions.

---

### Pillar II: Universal Curriculum & Socratic Learning

Learning must scale from basic literacy and numeracy to advanced collegiate inquiry.

- **Foundational On-Ramps (Tier 0):**  
  Bridge the entry gap identified in `drafts/agy-review/`:
  - `study-skills-0`: How to learn, retain, and interrogate evidence.
  - `numeracy-0`: Elementary arithmetic, ratios, fractions, and spatial sense.
  - `algebra-0`: Symbolic variables, equations, and balance.
  - `computers-0`: Bits, files, logic gates, and the architecture of computation.
  - `data-0`: Measurements, uncertainty, variance, and tables.
- **Undergraduate Surveys (Tier 1):**  
  Complete and polish the 32 living collegiate packs, plus Wave 2 technical syllabi:
  - `ai-systems-1`: Artificial Intelligence, Neural Systems & Local Transformers (Dewey 006).
  - `crypto-systems-1`: Applied Modern Cryptography & Privacy Engineering (Dewey 005.8).
  - `systems-prog-1`: Systems Programming, Memory Safety & WebAssembly (Dewey 004).
  - `finance-micro-1`: Financial Engineering & Automated Market Microstructure (Dewey 330).
  - `biomed-physio-1`: Cellular Systems & Human Physiology (Dewey 612).
- **Mastery Sprints:**  
  Self-contained 15-minute concept units:
  1. Plain-English intuitive walk // Greene / Feynman principle: explain intuition before naming the technical jargon.
  2. One interactive simulation or diagram.
  3. Three check questions with deterministic grading // answer keys compiled in code, never leaked into model context.
- **Socratic Tutoring Mode:**  
  System envelopes and adapters that refuse to provide rote homework solutions; tutors guide through diagnostic questions, progressive hints, and worked checks.

---

### Pillar III: Sovereign Studio Tools & Runtime

The browser must serve as an active analytical workbench, not merely a text box.

- **Client-Side Code Execution (Wasm Sandboxing):**  
  Integrate Tier 1 WASI micro-shell and Tier 2 v86 Alpine Linux container directly into Studio, allowing students to execute Python, JavaScript, and C code safely in-browser with zero server roundtrips.
- **Interactive Mathematical Engine:**  
  KaTeX formula rendering paired with interactive algebraic manipulation, step-by-step calculus expansion, and units verification via deterministic arithmetic engines.
- **2D/3D Interactive Visualizations:**  
  Canvas-based interactive graphing, physics phase space visualizers, chemistry molecular orbital viewers, and circuit logic simulators embedded directly within course chapters and tutor responses.
- **Local Document Ingestion:**  
  Drag-and-drop ingestion for PDF, CSV, JSON, Markdown, and TXT files parsed locally via client-side Web Workers. Provide in-browser semantic passage retrieval without uploading private user data to third-party servers.
- **Standalone Sovereign Artifacts:**  
  One-click export of complete interactive study sessions, laboratory notebooks, and course progress into single-file self-contained HTML documents that run anywhere offline.

---

### Pillar IV: In-Browser Agency & Local Models

Running local 1.5B–3B models in the browser requires specialized engineering to match paid cloud platform reliability.

- **Dedicated LoRA Task Adapters:**  
  Overcome base model drift by training and hot-swapping lightweight WebLLM LoRA deltas:
  - `adapter-tool`: Strict `<tool_call>` generation adhering to JSON schemas with 99%+ compliance.
  - `adapter-tutor`: Socratic guidance posture preventing direct answer dumps.
  - `adapter-synthesis`: Dense document summary and citation formatting.
- **Multi-Step Autonomous Loops:**  
  Deterministic client-side agent loops:  
  `Inspect State` → `Formulate Plan` → `Dispatch Tool (Calc / Stacks / Wasm)` → `Verify Output` → `Synthesize Answer`.
- **Tri-Lake Sovereign Memory System:**  
  On-device memory stored entirely in browser IndexedDB:
  - *Heaven:* User-approved high-water-mark responses for few-shot prompt adaptation.
  - *Purgatory:* Scratch reasoning, unverified session artifacts, and pending drafts.
  - *Hell:* Thumbs-downed hallucinations, banned phrases, and negative reinforcement boundaries.
- **WebGPU Memory Tiers & Shader Tuning:**  
  Intelligent hardware profiling (4k, 8k, and 16k context tiers), dynamic KV-cache compression, and fallback handling for low-VRAM integrated GPUs.

---

### Pillar V: Future Horizon — Global Localization & Universal Access

Education is a universal human right; access must not be limited by language or hardware wealth.

- **Curriculum Localization:**  
  Translate foundational on-ramps and undergraduate surveys into major world languages (Spanish, French, Mandarin, Arabic, Hindi, Portuguese, Japanese).
- **Localized Fact Indexing:**  
  Anchor international editions of The Stacks to verified national standardization and legal bodies.
- **Ultralight Device Profiles:**  
  Optimized CPU-only and lightweight WebGPU execution paths tailored for low-cost educational hardware // Chromebooks, Raspberry Pi 5, budget mobile devices.
- **Air-Gapped PWA Packaging:**  
  Progressive Web App package installable as a native desktop or tablet application, retaining all course texts, calculators, and offline models for deployment in remote schools and disconnected environments.

---

## 3. Implementation Phases

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              DEVELOPMENT PHASES & TIMELINE                             │
├───────────────────┬───────────────────┬────────────────────┬───────────────────────────┤
│ PHASE 1: Q4 2026  │ PHASE 2: Q1 2027  │ PHASE 3: Q2 2027   │ PHASE 4: Q3-Q4 2027       │
│ Foundations & Map │ Sovereign Studio  │ Wave 2 Stacks      │ Localization & Global     │
│ • LoRA Adapters   │ • Wasm Execution  │ • Advanced Syllabi │ • Multi-Lingual Packs     │
│ • Stacks Mapping  │ • KaTeX Graphing  │ • Mastery Sprints  │ • Standalone PWA Bundles  │
│ • Tier 0 On-Ramps │ • Document Ingest │ • Tri-Lake Memory  │ • Mobile Memory Profiles  │
└───────────────────┴───────────────────┴────────────────────┴───────────────────────────┘
```

### Phase 1: Foundations, Adapters & Knowledge Cartography (Current)
- [x] WebGPU browser engine running 1.5B–3B models (Qwen 2.5, DeepSeek-R1 Distill).
- [x] Initial 30-course undergraduate Stacks library and Dewey classification index.
- [ ] Train first WebLLM LoRA adapter for deterministic tool dispatching.
- [ ] Execute offline Jev cartography pipeline to index high-frequency search queries to Stacks chapters.
- [ ] Author Tier 0 foundational on-ramps (`study-skills-0`, `numeracy-0`, `algebra-0`, `computers-0`).
- [ ] Ship strict UI canon audit: verify zero horizontal scrollbars, responsive flex wrapping, and clean noun labels.

### Phase 2: The Sovereign Studio & Wasm Runtime
- [ ] Connect client-side WASI / v86 Wasm sandbox for safe on-device Python/JS code execution.
- [ ] Implement KaTeX interactive formula workbench and 2D canvas curve graphing.
- [ ] Add zero-network client-side document ingestion (PDF, CSV, TXT) with local embedding search.
- [ ] Implement single-file sovereign HTML export for study sessions and notebooks.

### Phase 3: Wave 2 Coursework, Mastery Sprints & Multi-LoRA
- [ ] Author Wave 2 technical syllabi (`ai-systems-1`, `crypto-systems-1`, `systems-prog-1`, `finance-micro-1`).
- [ ] Build 15-minute Mastery Sprint modules with interactive checkpoints.
- [ ] Implement dynamic WebLLM multi-LoRA switching for on-the-fly tutor vs tool persona swapping.
- [ ] Full integration of Tri-Lake memory management UI in IndexedDB.

### Phase 4: Localization, Universal Access & Decoupled Packages
- [ ] Publish decoupled npm packages (`@easylm/engine`, `@easylm/stacks`, `@easylm/studio`).
- [ ] First localized curriculum packs (Spanish and French core on-ramps).
- [ ] Low-VRAM memory-capped mobile profile for Android and iOS browsers.
- [ ] Fully air-gapped, zero-download desktop PWA distribution for schools and humanitarian clinics.

---

## 4. UI & Pedagogical Canon (The Non-Negotiables)

1. **Greene / Feynman Pedagogical Order:**  
   Plain-English physical intuition first; introduce formal technical terms only after conceptual comprehension is achieved.
2. **Zero Horizontal Scrollbars:**  
   Horizontal scroll bars on desktop or mobile are strictly prohibited. All layouts must flex-wrap cleanly (`flex-wrap: wrap; overflow-x: hidden`).
3. **Crisp Human Interface Labels:**  
   Single, purposeful nouns (Studio, Learn, History, Stacks). Zero parentheticals on buttons or controls.
4. **HNAI Color Palette & Density:**  
   Black, white, ina violet, Cascadia typography. High information density with crisp tooltips, never bloated grey helper prose.
5. **No Deadline Shame & Zero Answer Leakage:**  
   Self-paced mastery. Keys live compiled into client code and never enter model generation prompts.
