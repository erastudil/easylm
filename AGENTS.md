---
title: "easylm — dir law"
summary: "browser WebGPU gift. AGPL. $0. local. The Stacks + Studio."
last_updated: "2026-10-06"
status: living · easylm
---

# easylm

GitHub `erastudil/easylm` is SoT. this tree is the working copy.

**covenant:** official app stays $0. donations only. no company seat. AGPL-3.0-or-later.

## read

1. `README.md` · `CONTRIBUTING.md` · `COVENANT.md` · `LICENSE`
2. stacks law: `stacks/LAW.md` · `stacks/TRUSTED_SOURCES.md`
3. Studio: `docs/CURRICULUM.md`
4. proposed on-ramps: `drafts/agy-review/` until judgement. not compiled.
5. house policy: `docs/POLICIES.md` (5S/ponytail, GFC, tokens, progen) · `docs/KAIZEN.md` (nightly loop)

## write

- Hands stay deterministic. keys for quizzes live in `answers_compiled.ts`. they never enter a model prompt.
- Kid Safe: local tools only. Studio is local. network doors are parent + Hands.
- new pane: hnai colors. tooltips, not essays. no GPA letters.
- UI canon: NEVER horizontal scroll bars. wrap into multiple rows. zero parentheticals on buttons (crisp human labels: Studio, Learn, History). no prompt regurgitation.
- pedagogy: Greene / Feynman concept order — plain English intuition first, formal technical term only after the concept is understood.
- directory you touch keeps this file.

## refuse

homework farms as sources. vendoring NC bodies (MIT OCW) into git. cloud gradebooks. deadline shame. horizontal scroll bars. button parentheticals.

## Cursor Cloud specific instructions

- Dev server: `npm run dev` compiles stacks and courses, then Vite. The port is **5175** (`vite.config.ts`). Pass `--host 0.0.0.0` so a browser outside the VM can open the tab.
- Gate: `npm test`. CI uses Node 20 (`.github/workflows/test.yml`). Node 22 on the default image passes that suite.
- `npx tsc --noEmit` and `npm run build` fail on current main. `StackPack` has no `level` (`src/data/stacks_compiled.ts`). `src/services/atmem_scorer.ts` imports `MemoryAtom` and `ScoredAtom`, which `src/types` does not export. CI runs `npm test`.
- Compiling stacks turns `\r\n` inside `src/data/stacks_compiled.ts` string literals into `\n`. After `npm test` or `npm run dev`, that file shows up in `git status`. `git restore src/data/stacks_compiled.ts` when the only change is the compile.
