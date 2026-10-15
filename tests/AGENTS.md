---
title: "easylm tests — dir law"
summary: "single-grip deterministic verification home for easyLM per wuwei."
last_updated: "2026-10-15"
status: canon · easylm tests
---

# tests

dedicated living home for EasyLM verification per 5S law and wuwei.  
tests never live inside `src/`. `src/` stays pure shipping application code.

## rules

1. **single grip verification** : consolidated deterministic verification executed via `node scripts/verify.mjs` and `verify.ps1`.
2. **zero fake tests** : synthetic mocks asserting mocked return values denote zero truth value; banned universally; verification requires real runnable execution gates.
3. **wuwei** : consolidate verification into single-grip deterministic runner; eliminate sprawling mock catalogs and multi-file test suites.
4. **kid allowlist gate** : `tests/kid_models.test.ts` runs inside `scripts/verify.mjs` and checks the kid model list, the kid load guard, the kid picker, and adult crash step-down against real code.
5. **stacks chapter gate** : `tests/stacks_chapters.test.ts` checks `splitChapters` against the shipped textbooks. YAML front matter stays out of the opening chapter. Textbook strings stay text: a C null is the characters `\x00`, never a NUL byte.
6. **truth gate** : software either executes successfully with exit code 0 against real interfaces or software rejected from main branch.
