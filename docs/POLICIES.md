---
title: "easylm — operational policies"
date: "2026-09-18"
status: living · easylm
---

# operational policies

kaizen is policy here: continuous small improvement, every pass. 5S is policy here: we clean while we work. these four standards are how both show up in daily output. one page each. if a policy and the code disagree, one of them is wrong — fix it in the same change.

## 1. code — 5S / ponytail

| S | applied to code |
|---|---|
| **sort** | no dead code, no dangling references, no unused deps. delete, don't comment out. |
| **set in order** | one home per thing: tests live in `tests/`, generated files stay generated (`do not hand-edit`), config stays in root. |
| **shine** | see a mess while touching a file — fix it in the same change if it is small; file it if it is not. never leave the directory dirtier than you found it. |
| **standardize** | follow `AGENTS.md` dir law, `tests/AGENTS.md`, and the compile scripts. no private conventions. |
| **sustain** | every change keeps `npm test` green. the audit (`scripts/nightly_stacks.mjs`) is the sweep that never sleeps. |

**ponytail** — pull all complexity into one grip. a module should hang from a single narrow interface you can hold in one hand: one exported function, one clear input, one clear output. if a caller needs to know three internals to use it, braid it. rules:

1. one narrow public surface per module; everything else private.
2. no tangles: two modules that import each other is a knot — split or merge.
3. state flows one way. if you need a global to explain the function, the braid failed.
4. deterministic hands stay deterministic: keys, grades, and arithmetic never touch a model prompt.

## 2. prose — GFC

every sentence carries three duties, checked in order. lint: `gfc lint PATH --mode educate` (textbooks) or `--mode prose` (maps and policy).

| duty | test |
|---|---|
| **g — grammar** | the sentence parses on first read. no run-ons doing three jobs. |
| **f — flow** | intuition first, formal term after (Greene/Feynman order). each paragraph hands the next one its question. |
| **c — clarity** | a stranger can act on it. concrete nouns, active verbs, one idea per sentence. |

prose law (from `stacks/LAW.md`, binding here): teach a structure another person can use from first principles. no filler, no fluent nothing. empty hit → say so. load-bearing number → door or `unverified`. button labels carry zero parentheticals. tooltips, not essays.

## 3. chat + CLI — token economy

every token a human or machine reads costs time twice: once to send, once to read. output is shaped, not compressed into mush.

**chat:**
1. lead with the answer or the done-thing. no warm-up ("great question"), no restating the prompt, no summary of what you're about to say.
2. tables over paragraphs when items share columns. lists over prose when order matters. prose only for reasoning that must be followed.
3. one sentence of fix next to every error. no disclaimer theater.

**CLI / logs:**
1. one line per event: what happened + where. `compiled 33 packs → src/data/stacks_compiled.ts`
2. exit codes tell the truth: 0 clean, 1 regression, 2 config error. a script that exits 0 on failure is broken.
3. quiet by default, verbose on demand (`-v`), and the last line always says pass/fail.

## 4. agent-to-agent — progen

agents talk to agents in progen: lean computational dialect, cut noise. it borrows the Progen principle — signal over friction — and makes it a protocol. the token rules above still apply; these are on top.

**shape:**

```
FROM: <agent id>
TASK: <one line>
CTX: <files/dirs considered — paths only>
DID: <changes as diff-style bullets, one per file>
NEXT: <what the receiving agent or human must do>
OPEN: <unresolved questions, or "none">
```

**rules:**

1. paths, not prose. `DID: stacks/media/TEXTBOOK.md +192 lines (10 ch, hs→grad)` beats a paragraph.
2. state confidence per claim: `[door]` (cited), `[calc]` (computed), `[unverified]` (flagged).
3. no pleasantries, no restating the task back, no apology padding. `OPEN: none` is a complete sentence.
4. machine-readable blocks (json/yaml) for anything the receiver will parse; markdown only for anything a human will read.
5. handoff complete means the receiver can act without re-reading history. if they must ask a question the report could have answered, the report failed.