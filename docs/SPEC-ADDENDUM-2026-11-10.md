# Spec addendum — 2026-11-10 (spec pass)

This file is additive. It records what the fleet records settle about EasyLM as of 2026-11-10; it does not replace README.md, ROADMAP.md, or any existing document, and it authorizes no push.

## What it is

EasyLM is the student product of the Snowgate product triad (owner framing, Nov 9, 2026): EasyLM for students, Alfred for parents, Hydra for devs. It is a free, local-AI learning app: the Stacks and Hands development environment and low-stakes proving ground, its education side a free public good.

## Doctrine constraints

- Sovereign software: software the buyer owns, external dependency minimized, everything needed in the package (owner product doctrine, Nov 10, 2026).
- Language exit (owner, Nov 9, 2026): the fleet is exiting Python and JavaScript; existing surfaces are legacy with an exit path. No new ruling about EasyLM's stack is recorded in this addendum.
- Browser law (owner, Nov 10, 2026): the browser is Brave, always, until further notice. Microsoft Edge is never used for anything, ever.
- Model capability claims are verified against the vendor's artifact list and model card, never inferred from what is staged locally (owner, Nov 8, 2026).
- Sampling and context for summoned models follow vendor spec at full capacity; undersized or off-spec runs are one defect class and their verdicts are provisional (owner, Nov 9, 2026).

## Settled decisions, with dates

1. **The laptop checkout is the only live line** (owner ruling, Oct 20, 2026): `C:\Users\jpm05\Documents\easylm`. Muse's VM clones (easylm / easylm-fix2 / easylm-truthfix) are retired, and their held pushes must NEVER be made.
2. **Pushes are the owner's call.** At this pass the local main carries commit a736809 ("Wire the bolt as favicon") ahead of origin/main, unpushed by design. This addendum's own commit is likewise local only: push held per the EasyLM guardrail.
3. **WebGPU verdict — in-tab Bonsai is FEASIBLE** (settled Nov 10, 2026). Spike evidence (playground repo webgpu/, commit bec4364): Bonsai 2B Q2_0 runs fully in a browser tab via wllama v3 (llama.cpp b12211) on the laptop RTX 4060: 32.0 tok/s, ~690 MiB GPU, 7.9s warm load, first token in about half a second, all layers on GPU.
4. **The earlier in-tab hang is diagnosed, not mysterious** (Nov 10, 2026): Bonsai thinks 500–600 tokens invisibly (reasoning content not rendered, a ~19.3s blank wait), and no-WebGPU environments silently fall back to CPU WASM at ~3.3 tok/s. A thinking-visible UI is therefore a requirement of the in-tab shape, not a polish item.
5. **HTTPS is mandatory** for the in-tab route (secure context is a WebGPU precondition). Students without WebGPU are routed to the tab-face + endpoint fallback; the endpoint/face version is a fallback only, to be re-commissioned with evidence if the tab route fails (owner devaluation ruling, Nov 10, 2026).
6. **Stacks retrieval stays server-side** in the in-tab shape (spike record, Nov 10, 2026); the tab carries inference, not the corpus.
7. **The stabilization pass is CLOSED with no result** (Nov 10, 2026): the long-running stabilization agent was cancelled on the owner's ruling that the pass did not mean much if Bonsai would not run in the tab. Its UI scope folds into whatever follows the WebGPU verdict; it is not a standing separate workstream.
8. **Staged datasets on Hugging Face (457.2 MB) are HELD.** That disposition is a parked owner decision. It is recorded here so no later pass re-files it as an open question.

## Factual interfaces and paths

- Live checkout: `C:\Users\jpm05\Documents\easylm` (remote: erastudil/easylm).
- Goal record: ~/workspace/goals/easylm-tight-release/ (GOAL.md, files/, briefs/).
- Topic record: ~/memory/topics/easylm.md (truth-pass history, Oct 20, 2026 teardown, Nov 3, 2026 unify gate).
- Gate record: ~/workspace/easylm-gate-2026-11-03/ (Run 2a: fail-closed verify.mjs hardening committed as 7196493; rollback anchor c138eaa).
- WebGPU spike: playground repo webgpu/, commit bec4364 (Nov 10, 2026).

## Resolved — provenance

| # | Item | Source | Date |
|---|---|---|---|
| 1 | Laptop checkout sole live line; VM clone pushes never | ~/memory/topics/easylm.md, owner ruling | Oct 20, 2026 |
| 2 | Favicon commit a736809 unpushed by design; pushes owner's call | Task record / laptop git state verified this pass | Nov 10, 2026 |
| 3 | WebGPU feasibility: wllama v3, 32.0 tok/s, ~690 MiB GPU | Daily record ~/memory/2026-11-10.md; spike bec4364 | Nov 10, 2026 |
| 4 | Hang diagnosis: invisible reasoning tokens; CPU WASM fallback 3.3 tok/s | Daily record ~/memory/2026-11-10.md | Nov 10, 2026 |
| 5 | HTTPS mandatory; no-WebGPU route = tab-face + endpoint fallback | Spec-pass commission facts; spike record | Nov 10, 2026 |
| 6 | Stabilization pass closed, no result; UI scope folds forward | Daily record ~/memory/2026-11-10.md | Nov 10, 2026 |
| 7 | HF staged datasets 457.2 MB HELD (parked, do not re-file) | Spec-pass commission facts (parked decision) | Nov 10, 2026 |
| 8 | Product triad position: EasyLM = students | ~/MEMORY.md (owner, Nov 9, 2026) | Nov 9, 2026 |

Resolved count: 8.
