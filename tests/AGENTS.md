---
title: "easylm tests — dir law"
summary: "single-grip deterministic verification home for easyLM per wuwei."
last_updated: "2026-11-17"
status: canon · easylm tests
---

# tests

dedicated living home for EasyLM verification per 5S law and wuwei.  
tests never live inside `src/`. `src/` stays pure shipping application code.

## rules

1. **single grip verification** : consolidated deterministic verification executed via `node scripts/verify.mjs` and `verify.ps1`.
2. **zero fake tests** : synthetic mocks asserting mocked return values denote zero truth value; banned universally; verification requires real runnable execution gates.
3. **wuwei** : consolidate verification into single-grip deterministic runner; eliminate sprawling mock catalogs and multi-file test suites.
4. **the harness** : `scripts/verify.mjs` is the verification harness; `npm test` and CI run it. Its five steps compile the Stacks and Courses, verify model selection and cache invariants, verify device recommendations, verify the README model table against the catalog, and build the TypeScript and Vite production bundle. Each step executes real code against real content.
5. **truth gate** : software either executes successfully with exit code 0 against real interfaces or software rejected from main branch.
