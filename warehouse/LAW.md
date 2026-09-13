---
title: "EasyLM warehouse — library law"
date: "2026-09-13"
status: living · easylm
---

# warehouse law

this tree is the **local library** inside EasyLM. it ships in the app. it is on GitHub.

it is **textbooks + official doors**. it is not a wiki dump. it is not 35 Dewey blurbs.

## every subject pack

| file | is |
|---|---|
| `TEXTBOOK.md` | the undergrad book. chapters that teach. definitions, laws, methods, checks |
| `LINK_INDEX.md` | official doors + search queries. .gov / .edu / standards bodies / vendor docs we name |

lookup: **textbook chapter** → **official door**. wiki is a seed you fetch, not the book.

## what a textbook is

a chapter names the object, states the law, shows the check, and says when to stop and fetch.

| pass | fail |
|---|---|
| teaches a structure another person can use | table of contents with no body |
| constants cited to a named door, or DONT_KNOW | invented numbers |
| worked method (definition → claim → check) | one-paragraph Dewey blurb |
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

if the textbook and a wiki page disagree on a number → DONT_KNOW, fetch.

## who this is for

EasyLM is public GPLv3. packs here are **general education**. no house internals, no personal life, no unpublished product law.

Hands: `calc` and `units` do arithmetic. warehouse returns the chapter. the model does not invent the constant.
