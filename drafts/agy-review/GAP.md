---
title: "EasyLM stacks — gap review"
date: "2026-09-16"
status: draft · agy review
---

# Gap review

Living law in `stacks/LAW.md` says a textbook teaches a structure another person can use from first principles. A file that claims the pack is done and only outlines the field is a stub.

The 32 packs are undergrad surveys. Studio's own curriculum file says the coach is aimed at 14 and up, and elementary is far. The covenant in `docs/CURRICULUM.md` says money, geography, and group membership shall not block a human from learning. Age and prior school still do, because the first chapter of each book assumes the last chapter of a school the reader may not have attended.

## What the shelf is

`PACKS.json` lists 32 slugs. Line counts below are from the working copy on 2026-09-16.

| slug | lines | first load-bearing object |
|---|---:|---|
| religion | 159 | comparative epistemology of the sacred |
| methods | 178 | Popper, Hume, Kuhn, p-values |
| sociology | 184 | Mills, Durkheim, Weber, Marx |
| psychology | 184 | 86 billion neurons, psychophysics |
| agriculture | 194 | soil microbial ecology |
| astronomy | 196 | Kepler, stellar physics |
| ai_ml | 223 | tokenization, loss landscapes, attention |
| poetry | 231 | mora, scansion, Petrarchan contract |
| physics | 232 | phase space, Noether, Schrödinger |
| math | 266 | propositional calculus, ZFC, Galois |
| biology | 273 | cells, orbitals of life |
| art | 292 | formal analysis |
| literature | 320 | narratology, ethos |
| music | 324 | overtone series, temperament |
| trades | 337 | mill kinematics, NEC ampacity |
| earth_sciences | 336 | tectonics, CAPE, mesocyclone |
| geography | 340 | geomorphology, GIS |
| law | 369 | jurisprudence, common law |
| chemistry | 379 | Schrödinger orbitals, Gibbs |
| civics | 387 | constitutional mechanics |
| security | 428 | AES, RSA, side channels |
| engineering | 436 | stress, Kirchhoff, control |
| language | 467 | phonology, generative syntax |
| software | 508 | spec, git Merkle DAG, RFC 9110 |
| business | 545 | Coase, Porter, statements |
| computing | 573 | Turing machine, type theory |
| finance | 576 | NPV, CAPM, Basel |
| health | 589 | homeostasis, organ systems |
| philosophy | 606 | logic, ethics, mind |
| history | 259 | historiography |
| tao_te_ching | 832 | 81 chapters, primary text |

Tao Te Ching is a primary text with a walk. That shape works: a reader who can read English can begin chapter 1. Most other packs open with a syllabus map of the entire field and a first chapter written for a student who already knows the names.

## Incomplete

Thin here means the table of contents names a full undergrad field and the body cannot carry it. Math at 266 lines lists proof, algebra, linear algebra, real analysis, calculus, vector calculus, complex analysis, differential equations, probability, and combinatorics. Physics at 232 lines lists Newtonian mechanics through quantum mechanics. Those are maps. `LAW.md` already calls that a stub.

Same shape, shorter bodies: religion, methods, sociology, psychology, agriculture, astronomy, ai_ml, poetry, biology.

Longer packs still skip the walk up. Finance teaches discounted cash flow before percent. Computing teaches a Turing machine before a file. Chemistry quotes Avogadro's number and the Schrödinger equation in chapter 1.

Worked methods exist in trades, software, finance, health, language. Those packs are closer to books. They still assume secondary school.

## Missing subjects

A person who can read, and who wants a first book, has no pack for:

| proposed slug | why it is a hole |
|---|---|
| study | how to learn from a page. methods starts at philosophy of science |
| numeracy | counting, place, fraction, percent, units. math starts at proof |
| algebra | letters for numbers, undo, graph. the door into math, physics, finance, chemistry |
| computers | files, folders, browser, this-machine vs network. computing starts at Turing |
| data | a table, a rate, a sample. methods starts at p-values and DAGs |
| economics | households, firms, prices, money as a social tool. finance is claims and markets |
| writing | sentences and paragraphs that carry a claim. language is linguistics; literature is rhetoric of finished art |
| media | a report, an ad, a feed. civics assumes you already sort sources |
| energy | work, heat, fuel, a grid. physics and engineering bury this after Lagrangian mechanics |
| environment | air, water, soil, climate as a lived system. split today across earth, biology, geography |
| languages | how a second tongue is learned. language pack is theory of English-like systems |
| first_aid | what to do with a body in the next ten minutes. health is physiology |
| food | cooking, spoilage, salt, heat. agriculture is agronomy; health is organs |

Dewey holes that can wait: architecture, photography, film, sport science, public administration, bibliography. They matter. They do not unlock the rest of the shelf.

## Prerequisite jumps

A pack "requires a prior book" when chapter 1 uses a tool the library only teaches later, or never.

| pack | chapter 1 uses | missing prior in this library |
|---|---|---|
| math | predicates, ZFC, induction | numeracy, algebra |
| physics | phase space, vectors, derivatives | numeracy, algebra, measurement |
| chemistry | mole, orbitals, ΔG | numeracy, atoms as a story, algebra |
| astronomy | Kepler, redshift | algebra, physics motion |
| engineering | stress, circuits | algebra, physics force and current |
| ai_ml | vectors, gradient, attention | algebra, computing as a machine that follows a list |
| security | AES, RSA, elliptic curves | modular arithmetic, computing |
| computing | Turing tape, types | computers, numeracy |
| software | spec, git, HTTP | computers |
| finance | time value, statements | numeracy, percent, algebra |
| methods | p-value, Bayes, DAGs | data, numeracy |
| music | overtones, temperament | ratio, fractions |
| trades | feeds/speeds, ampacity, DWV | numeracy, units, algebra for drop and flow |

Philosophy, literature, poetry, art, history, civics, sociology, religion, and tao_te_ching can start from reading alone if chapter 1 drops the professional map and keeps one object. Today they do not. They open with the professional map.

## What would make the covenant true

Every living pack keeps its undergrad book. In front of it sits a start that a reader who can decode English sentences can walk.

1. Name a **start level** on every pack: read, count, algebra, undergrad.
2. Name **needs** as other slugs, never as "high school."
3. Ship the five on-ramps in `packs/` so the graph has a root: study, numeracy, algebra, computers, data.
4. Prepend the chapter 0 files in `ramps/` so a person who opens physics meets a falling stone before phase space.

Agy: keep, rewrite, or kill each file. A merge is a copy into `stacks/` plus a `PACKS.json` row, not a rename of this folder.
