---
title: "The Stacks — library law"
date: "2026-09-18"
status: living · easylm · the-stacks
---

# The Stacks law

this tree is the **local library** inside EasyLM. it ships in the app. it is on GitHub.

it is **textbooks + official doors**. it is not a wiki dump. it is not 35 Dewey blurbs.

## every subject pack

| file | is |
|---|---|
| `TEXTBOOK.md` | the undergrad book. chapters that teach. first principles, Feynman analogies, definitions, laws, methods, checks |
| `LINK_INDEX.md` | official doors + search queries. .gov / .edu / standards bodies / primary documentation doors |

lookup: **textbook chapter** → **official door**. wiki is a seed you fetch, not the book.

## what a textbook is

a chapter names the object, explains from first principles with intuitive physical analogies, states the formal law, shows the worked check, and maps down to trusted doors.

| pass | fail |
|---|---|
| teaches a structure another person can use from first principles | table of contents with no body |
| Feynman/Greene clarity with memorable intuitive analogies | terse telegraphic roleplaying or dry jargon |
| constants cited to a named door, or acknowledged unverified | invented numbers |
| worked method (first principles → definition → claim → check) | one-paragraph Dewey blurb |
| empty hit → say so | fluent filler |

a file that claims the pack is done and only outlines the field is a **stub**. finish it or mark it blocked. do not sign off a stub.

## what a link index is

rows a stranger can walk:

| topic | search query | official door |
|---|---|---|

doors are live URLs on the host that owns the fact (NIST, BIPM, MIT OCW, OpenStax, IETF, W3C, MDN, language docs, court/legislature sites).

not doors: random blogs, homework mills, scraped formula dumps, “I remember π”.

## cite

load-bearing number, date, quote, statute, identity → fetch the door. do not finish the sentence from memory.

if two official pages disagree, say so. do not average them.

if the textbook and a wiki page disagree on a number → state unverified and fetch the primary source.

## who this is for

EasyLM is public AGPL-3.0-or-later. packs here are **general education**. no house internals, no personal life, no unpublished product law.

Hands: `calc` and `units` do arithmetic. The Stacks tool returns the chapter. the model does not invent the constant.

Studio: pass / fail. as many tries as it takes. no due dates. keys never enter the model prompt.

## levels (adopted from drafts/agy-review/LEVELS.md, 2026-09-18)

every pack names a **level** — the last skill the reader must already have. a level is not an age or a school name, except where law draws a hard floor.

| level | the reader can already |
|---|---|
| read | decode English sentences on a page |
| count | add, subtract, multiply, divide, name place |
| algebra | use a letter for an unknown and undo a step |
| hs | read a secondary-school page; no algebra assumed |
| undergrad | walk a secondary-school science or proof course |
| grad | read a research paper in the field |

chapters inside one pack may carry `[level: …]` tags and rise through the bands. **grad content is welcome where it is feasible** — a named model, a formal statement, a door to the primary literature — but it never displaces the plain-English intuition that opens the chapter. Greene/Feynman order holds at every level.

**the age floor is 13.** nothing in The Stacks targets a reader under 13; younger profiles stay on Studio family mode (Socratic, local Hands). social media and platform-health material carries `floor_age: 13` — high-school-level treatment is correct and responsible for this subject; it is a legal line (COPPA), not a developmental judgement.

a pack's front matter carries `level:` and, where a hard floor applies, `floor_age:`. living packs adopt tags incrementally; the nightly audit reports packs without a level tag.
