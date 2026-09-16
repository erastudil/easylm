---
title: "easylm engine — dir law"
summary: "sovereign browser engine modules: webllm, context budget, memory, crypto vault, math, stacks, export, storage."
last_updated: "2026-09-14"
status: canon · easylm engine
---

# engine

runtime computational kernel for EasyLM.  
pure production modules only. zero test files in this directory.

## rules

1. **no test files here** : tests live in top-level `tests/`. do not add `*.test.ts` to `src/engine/`.
2. **deterministic hands** : tools, math, SSRF fences, vault, and context_budget stay deterministic. Envelope + max_tokens must fit the loaded window. Device-lost / GPU-process-dead fail closed — no auto-reinit.
3. **model independence** : engine utilities function independently of whether WebLLM has loaded a model weights blob.
4. **local first** : no telemetry, no tracking, local storage and encrypted vault only.
