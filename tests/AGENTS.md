---
title: "easylm tests — dir law"
summary: "test suite home for easyLM. unit, integration, invariant, and security fence verification."
last_updated: "2026-09-14"
status: canon · easylm tests
---

# tests

dedicated living home for all EasyLM tests per 5S law.  
tests never live inside `src/`. `src/` stays pure shipping application code.

## rules

1. **one test home** : all unit, regression, invariant, and preflight tests live here under `tests/`.
2. **test command** : `npm test` runs `vitest run` targeting `tests/**/*.test.ts`.
3. **import paths** : imports point explicitly to `../src/engine/...`, `../src/data/...`, and `../src/types`.
4. **fences** : tests verify SSRF whitelists, PIN hashing, kidsafe filters, CSP headers, and math sandbox isolation.
