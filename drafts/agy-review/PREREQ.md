---
title: "EasyLM stacks — prerequisite map"
date: "2026-09-16"
status: draft · agy review
---

# Prerequisite map

Roots have no prior pack. A reader who can read English can open them.

```
study
numeracy
computers
writing   (proposed, no draft this round)
```

Count-level packs need numeracy:

```
algebra  ← numeracy
data     ← numeracy
```

Undergrad packs, proposed `needs` only. The app offers, it does not lock.

| slug | needs |
|---|---|
| methods | study, data |
| math | algebra |
| physics | algebra, numeracy |
| chemistry | algebra, numeracy |
| biology | numeracy |
| astronomy | algebra, physics |
| earth_sciences | numeracy |
| health | numeracy, biology |
| engineering | algebra, physics |
| agriculture | numeracy, biology |
| computing | computers, algebra |
| software | computers, computing |
| security | computing, algebra |
| ai_ml | computing, algebra, data |
| finance | algebra, numeracy |
| business | numeracy, finance |
| trades | numeracy, algebra |
| music | numeracy |
| geography | numeracy |
| civics | study |
| law | civics, study |
| language | study |
| literature | study |
| poetry | literature |
| philosophy | study |
| psychology | biology, methods |
| sociology | study |
| religion | study |
| history | study |
| art | study |
| tao_te_ching | read only |
| economics | numeracy, data |
| media | study, data |
| energy | numeracy, physics |
| environment | earth_sciences, biology |
| first_aid | health |
| food | numeracy, chemistry |
| languages | study |

## hard jumps inside a living book

These are the places chapter 0 is for.

| pack | jump | ramp file |
|---|---|---|
| math | proof and ZFC before counting is taught | `ramps/math.md` |
| physics | Noether and phase space before a falling stone | `ramps/physics.md` |
| chemistry | Schrödinger and Gibbs before "stuff is bits" | `ramps/chemistry.md` |
| computing | Turing machine before a file | `ramps/computing.md` |
| methods | p-value before "try it twice" | `ramps/methods.md` |
| finance | NPV before percent | `ramps/finance.md` |
| ai_ml | attention before "a guess from examples" | `ramps/ai_ml.md` |

## cycles to refuse

Do not make biology need chemistry and chemistry need biology in the same breath. Biology may point at chemistry for bonds. Chemistry may point at biology for enzymes. Each book teaches the slice it uses.

Do not make computing need software. Software is how groups keep a program. Computing is how a machine follows a list.
