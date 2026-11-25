---
title: "easylm engine — dir law"
summary: "sovereign browser engine modules: webllm, context budget, memory, crypto vault, math, stacks, export, storage."
last_updated: "2026-11-24"
status: canon · easylm engine
---

# engine

runtime computational kernel for EasyLM (`C:\Users\jpm05\Documents\backburner\easylm\src\engine`).
pure production modules only; zero test files in this directory.

## rules

1. **testing law (`Documents\AGENTS.md` §12)** : never add `*.test.ts` unit-test spam here or in `tests/`; verify end to end via `node scripts/verify.mjs` (Tombstones only for isolated regression checks naming bug, introducing commit, and fixing commit).
2. **deterministic hands** : tools, math, SSRF fences, vault, and `context_budget` stay deterministic; envelope + `max_tokens` must fit the loaded window; device-lost / GPU-process-dead fail closed without auto-reinit.
3. **model independence & local first** : engine utilities operate independently of loaded WebLLM weight blobs with zero telemetry or tracking.
