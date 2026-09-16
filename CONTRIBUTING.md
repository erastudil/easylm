# Contributing to EasyLM

EasyLM is a free, zero-install local intelligence workspace in the browser. Chat, memory, textbooks, and Studio tools stay on the device that opened the tab. The official copy stays $0 forever. Donations only. Licensed under **GNU AGPL-3.0-or-later**.

See [ROADMAP.md](ROADMAP.md) for our honest development status, known issues, and active priority tracks.

---

## 1. License & Sovereign Covenant

- **GNU AGPL-3.0-or-later:** Patches are AGPL-3.0-or-later. You retain your copyright. We do not ask you to sign it over to a corporate CLA.
- **Developer Certificate of Origin (DCO):** Sign every commit with standard DCO format:
  ```
  Signed-off-by: Name <email@example.com>
  ```
- **The $0 Line:** Read [COVENANT.md](COVENANT.md). Any pull request that attempts to introduce a paywall, company seats, telemetry beacons, cloud lock-in, dual-licensing, or proprietary tiers will be closed immediately.

---

## 2. Development Setup & Verification

Requirements: **Node.js 18+**, **npm 9+**.

```bash
# Clone the repository
git clone https://github.com/erastudil/easylm.git
cd easylm

# Install dependencies
npm install

# Compile academic stacks, wave courses, and run full test suite
npm test

# Verify TypeScript types
npx tsc --noEmit

# Start local development server
npm run dev

# Verify production bundle build
npm run build
```

`npm test` is the mandatory quality gate. It compiles Stacks and courses via `scripts/compile_stacks.mjs` and `scripts/compile_courses.mjs`, then executes the Vitest engine test suite. Any new functionality must include unit tests or an explicit documented rationale.

---

## 3. Contribution Tracks

We actively invite collaboration across four primary tracks:

### Track A: Stacks & Curriculum Authoring
- **The Stacks (Textbooks):** Write and refine collegiate chapters in `stacks/<discipline>/TEXTBOOK.md`.
  - Follow the **Greene / Feynman method**: physical, sensory intuition first; formal terminology and mathematical rigor second.
  - Rely exclusively on verified primary sources in `stacks/<discipline>/LINK_INDEX.md` and `stacks/TRUSTED_SOURCES.md`.
- **Learn (Course Packs):** Author units, quizzes, essays, and exams in `scripts/wave1_courses.mjs`.
  - Question keys live strictly in authored source and compile to `src/data/answers_compiled.ts`. **Answer keys must never enter model prompts.**
  - All questions require clear, pedagogical hints. Exams feature soft suggested sittings, not punitive cutoffs.

### Track B: Local Tooling & Sandboxes
- **Wasm Virtual Machine:** Expand our Tier 1 WASI micro-shell and Tier 2 v86 Alpine container (`src/engine/zcabs.ts`) to enable real Python/JavaScript code execution inside the browser.
- **Client-Side File Ingestion:** Build fast, zero-network drag-and-drop parsers (CSV, PDF, JSON, TXT) that execute in Web Workers.
- **Studio Analytical Tools:** Enhance 2D/3D math plotting, equation solvers, and KaTeX rendering.

### Track C: Model Adapters & Dataset Curation
- **LoRA Task Adapters:** We know base 1.5B–3B models need fine-tuned adapters badly for reliable tool calling and Socratic inquiry. We welcome synthetic tool-calling datasets, evaluation scripts, and LoRA training pipelines.
- **Tri-Lake Memory & Evaluation:** Assist with Tri-Lake dataset export tooling (`src/engine/storage.ts`) so users can generate offline fine-tuning datasets from approved (Heaven) and rejected (Hell) responses.

### Track D: UI Canon & Accessibility
- **Strict UI Canon:**
  - **Zero horizontal scrollbars.** Mice have no horizontal wheel, phones scroll vertically. All layouts wrap cleanly (`flex-wrap: wrap`, `overflow-x: hidden`).
  - **No button parentheticals.** Controls use crisp, human noun labels: `Studio`, `Learn`, `History`.
  - **HNAI Color Palette:** Grounded in pure black `#000000`, white `#ffffff`, and ina violet accents (`#8b5cf6`).
  - **Fast Time-to-First-Token:** Reduce initial visual friction so users can leverage non-LLM tools immediately while weights stream in the background.

---

## 4. What a Good Patch Looks Like

1. **Focused Scope:** One bug, feature, or curriculum unit per pull request.
2. **Deterministic Offline Tools:** Hands that can run locally must stay offline. Only network tools explicitly enabled by the user may initiate outbound fetches.
3. **Tests Pass:** `npm test` passes 100% without warnings.
4. **Clean DCO:** Commits signed off with `git commit -s`.
5. **No Regressions:** Does not break WebGPU device detection or violate memory limits.

---

## 5. Security & Responsible Disclosure

If you discover a security vulnerability (XSS, SSRF, local PIN bypass, or unintended network transmission):
- Email **humansandai@atomicmail.io** with details and reproduction steps.
- Do not file public GitHub issues for unresolved security vulnerabilities.
- Review [SECURITY.md](SECURITY.md) for our full vulnerability disclosure protocol.
