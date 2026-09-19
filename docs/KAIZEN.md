---
title: "easylm — stacks kaizen loop"
date: "2026-09-18"
status: living · easylm
---

# stacks kaizen — the daily overnight loop

kaizen is policy: small, continuous, measured improvement. this file is the loop design and the record of the first (test) run.

## test run — 2026-09-18 (this session)

```
FROM: latchloop-builder
TASK: review dewey stacks; widen levels; formalize policies; design nightly loop
CTX: stacks/ · drafts/agy-review/ · src/engine/stacks.ts · scripts/
DID:
- stacks/media/ +4 files — new pack 302.23, 10 chapters, hs→grad tags, floor 13
- stacks/PACKS.json +media row · stacks/INDEX.md +row
- stacks/LAW.md +levels law (read→grad, floor 13, grad-welcome clause)
- src/engine/stacks.ts +10 search aliases (social, misinformation, tiktok, …)
- docs/POLICIES.md — 5S/ponytail · GFC · token economy · progen
- scripts/nightly_stacks.mjs — audit: sync, stubs, level tags, dangling refs, doors
- .github/workflows/stacks-nightly.yml — cron 07:17 UTC daily + manual dispatch
- 5S: removed dangling ops_5s_kaizen refs in stacks/business (TEXTBOOK + LINK_INDEX)
NEXT: run node scripts/compile_stacks.mjs && npm test, then merge to main
OPEN: level tags on the 32 living packs — incremental, nightly audit tracks it
```

## the loop, nightly

| stage | what runs | law it enforces |
|---|---|---|
| 1. sweep | `node scripts/nightly_stacks.mjs -v` | deterministic. sync, stub shape, level tags, dangling refs, door counts. exits nonzero on fail. |
| 2. compile + test | `compile_stacks.mjs` → `npm test` | hands stay deterministic; keys never enter a prompt. |
| 3. write pass | agent (GLM or same builder agent) picks **two packs max** per night | scope: GFC prose fixes, one gap row, one thin chapter. reads `stacks/LAW.md`, `docs/POLICIES.md`, pack `ASK.md`. outputs a PR with a progen report in the body. |
| 4. gate | CI runs the sweep again + `gfc lint` | no stub sign-off. no load-bearing number without a door. no floor_age below 13. |
| 5. human | you merge, or mark blocked | one merge per night is enough. kaizen, not a flood. |

**guardrails for the writing pass:** never rewrite a chapter's meaning without saying so in the PR; never delete a door; never add a subject without a PACKS.json row + LINK_INDEX.md the same night; always finish a thin chapter or mark it blocked in the report — no silent stubs.

## schedule

workflow: `.github/workflows/stacks-nightly.yml` — cron `17 7 * * *` (overnight US timezones), `workflow_dispatch` for manual runs. failure opens a `stacks-kaizen` issue with a progen body.

the model-writing pass (stage 3) runs wherever you host the agent — LatchLoop scheduled task on this repo is the default proposal; CI alone only sweeps and gates.