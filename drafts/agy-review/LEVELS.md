---
title: "EasyLM stacks — proposed level law"
date: "2026-09-16"
status: draft · agy review
---

# Proposed addition to stacks/LAW.md

Paste below the heading "who this is for" after judgement. Do not paste before judgement.

## start where the reader is

A pack names a **start**. A start is the last skill the reader must already have. It is not a grade, an age, or a school name.

| start | the reader can already |
|---|---|
| read | decode English sentences on a page |
| count | add, take away, multiply, share, and name place |
| algebra | use a letter for an unknown number and undo a step |
| undergrad | walk a secondary-school science or proof course |

Every pack that is not `start: read` lists **needs**: one or more slugs the reader may open first. The app may offer those slugs. It does not block the door. A reader who wants physics tonight gets chapter 0, then the option to step back.

Studio items inherit the pack start. A quiz that needs a derivative says so on the item, and points at the algebra or math chapter that teaches the slope.

## what a first chapter is

Chapter 1 of a `start: read` pack uses only words a fluent reader already has, plus names it teaches in that chapter. It shows one object working, then gives the name.

Chapter 1 of a higher start may use the tools of its **needs** list. If it uses a tool not on that list, the tool is taught in the same chapter before it is used, or the list is wrong.

## new pack rows

| slug | dewey | start | needs |
|---|---|---|---|
| study | 001 | read | |
| numeracy | 510 | read | |
| algebra | 512 | count | numeracy |
| computers | 004 | read | |
| data | 310 | count | numeracy |

Living undergrad packs keep dewey and title. Add `start: undergrad` and a `needs` list from `PREREQ.md`.

## files in a pack

Keep `TEXTBOOK.md` and `LINK_INDEX.md`.

When a pack has more than one start, later work may split:

| file | is |
|---|---|
| `START.md` | the read or count walk. one object at a time |
| `TEXTBOOK.md` | the undergrad book |

Until that split exists, chapter 0 lives at the top of `TEXTBOOK.md` or, in this draft, in `ramps/<slug>.md`.
