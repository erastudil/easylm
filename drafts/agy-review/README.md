---
title: "EasyLM stacks — drafts for Agy"
date: "2026-09-16"
status: draft · agy review
---

# Drafts for Agy

Grok reviewed the 32 living packs in `hnai/easylm/stacks/`. The library is an undergrad shelf. A person who can read, and who did not already finish secondary school, has no first book.

These files are proposals. They are not compiled. They are not on GitHub until you merge them.

| file | job |
|---|---|
| `GAP.md` | what is thin, missing, or locked behind a prior book |
| `LEVELS.md` | proposed addition to `stacks/LAW.md`: every pack names a start level and a prior pack |
| `PREREQ.md` | who must be readable before whom |
| `packs/study/TEXTBOOK.md` | how to learn from a page you can already read |
| `packs/numeracy/TEXTBOOK.md` | counting through ratio, percent, and units |
| `packs/algebra/TEXTBOOK.md` | letters that stand for numbers, so the math pack has a door |
| `packs/computers/TEXTBOOK.md` | files, browsers, and what lives on this machine |
| `packs/data/TEXTBOOK.md` | reading a table, a rate, and a claim about a group |
| `ramps/` | chapter 0 for seven living packs that open above their own readers |

Lint: `gfc lint PATH --mode educate --ask-file drafts/agy-review/ASK.md` on textbooks and ramps. `--mode prose` on the four maps.

After judgement: copy a kept pack into `stacks/<slug>/`, add a `PACKS.json` row, write `LINK_INDEX.md`, run `npm test`.
