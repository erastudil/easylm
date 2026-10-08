---
title: "easylm tests — dir law"
summary: "single-grip deterministic verification home for easyLM per ponytail wu wei."
last_updated: "2026-10-08"
status: canon · easylm tests
---

# tests

dedicated living home for EasyLM verification per 5S law and ponytail wu wei.  
tests never live inside `src/`. `src/` stays pure shipping application code.

## rules

1. **single grip verification** : consolidated deterministic verification executed via `node scripts/verify.mjs` and `verify.ps1`.
2. **zero fake tests** : synthetic mocks asserting mocked return values denote zero truth value; banned universally; verification requires real runnable execution gates.
3. **ponytail wu wei** : consolidate verification into single-grip deterministic runner; eliminate sprawling mock catalogs and multi-file test suites.
4. **kid allowlist gate** : `tests/kid_models.test.ts` runs inside `scripts/verify.mjs` and checks the kid model list, the kid load guard and the kid picker against real code.
5. **truth gate** : software either executes successfully with exit code 0 against real interfaces or software rejected from main branch.
