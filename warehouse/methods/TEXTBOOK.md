---
title: "methods — undergrad textbook"
date: "2026-09-13"
status: living · undergrad
home: "warehouse/methods/"
related:
  - "../math/"
  - "../biology/"
  - "../engineering/"
  - "../health/"
  - "EasyLM calc hand"
  - "warehouse/LAW.md"
---

# methods — undergrad textbook

a working book for people who must **turn a question into a checkable result**.
this file teaches. critical values, sample-size formulas, Cochrane numbers → DONT_KNOW / fetch the named door. arithmetic on stated numbers only with **EasyLM calc**.

**law this book applies:** question → test → update. name what would falsify. unit of observation first. p is not P(true). effect + uncertainty beats a star. association is cheap; cause needs a design. outliers: investigate, do not auto-delete. provenance on every number.

---

## 0. how to use this book

read chapter 1, then the chapter the job needs. LINK_INDEX.md is official doors, not the lesson.

| you need | chapter |
|---|---|
| what a method is | 1 |
| hypothesis, prediction, falsify | 2 |
| accuracy, error bars, GUM, error types | 3 |
| RCT, controls, blinding | 4 |
| mean, sd, plots | 5 |
| p-value, CI | 6 |
| prior → posterior | 7 |
| confound, instruments | 8 |
| surveys, sampling | 9 |
| p-hack, prereg, peek | 10 |
| peer review, citation, meta, replicate | 11 |
| EasyLM calc / NIST | 12 |
| stuck on a paper | 13 |

work order: **why → what → how**. name the claim and the unit of observation before you pick a test.

math pack owns probability as structure. this pack owns **design + measurement + inference as a craft**.

---

## 1. what methods is

methods is how claims get tested. the product is a **result with uncertainty and a trail**, not a vibe.

four questions, every time:

1. what would **falsify** the claim?
2. what is the **unit of observation** (person, plot, day, mouse, school…)?
3. what is **noise** vs **signal**?
4. did someone **p-hack** / peek / drop outliers without a rule?

**scientific method** (working): question → hypothesis → prediction → test → update. models are tools, not idols. you do not “prove forever.” you survive the next check.

**kinds of claim**

| kind | job |
|---|---|
| **description** | what is out there (count, mean, map) |
| **prediction** | what will happen under a model |
| **cause** | what happens if we intervene |
| **mechanism** | how the parts do it (other packs) |

a description is not a cause. a significant p is not a mechanism.

**unit of observation vs unit of analysis.** you may observe students and analyze classrooms. clustering, repeated measures, and pseudoreplication start here. if n is “the number of rows in the spreadsheet,” ask whether those rows are independent.

**check:** if you cannot name the unit of observation and the falsifier, you are not ready to compute.

---

## 2. claims, hypotheses, predictions, falsification

a **hypothesis** is a statement that could be wrong in a way you can see. “maybe vibes” is not one.

**prediction** is what the hypothesis implies for a measurement. if the prediction cannot fail, the test is theater.

**falsification** (working Popper cut, used as craft not as a religion): a claim earns its keep by **forbidding** something. you name the observation that would force you to drop or revise the claim, then you look. a hypothesis that accommodates every outcome has no content. surviving a severe test raises confidence; it does not grant eternity. auxiliary hypotheses (the instrument worked, the sample was the population you named) can take the hit instead of the main claim — Duhem–Quine is the reminder to say which piece you are blaming.

worked method (write these four lines before a test):

1. **claim:** one sentence.
2. **prediction:** a measurable quantity, a direction or a range, a clock.
3. **falsifier:** the result that would count against the claim.
4. **not a falsifier:** outcomes you have already decided to explain away. if that list is long, the test is weak.

**null and alternative** (frequentist working pair): the null is the model you compute tail probability under (often “no difference,” not always). the alternative is the family you care about. name both. a two-sided vs one-sided choice is a design decision, not a result. switching to one-sided after seeing the sign is a peek (ch 10).

**models vs hypotheses.** a statistical model includes the sampling story (iid, clusters, time series). if the data are clustered and you treat them as iid, the p-value is a number about the wrong world.

**theories** (science) are larger nets of models. methods tests a piece. do not claim a paradigm died because one p crossed a line.

**operationalization.** “learning,” “health,” “quality” are not measurements until you name the instrument. two labs should be able to follow the procedure. if they cannot, you do not yet have a test.

---

## 3. measurement, uncertainty, error types

**accuracy** is closeness to the thing you meant. **precision** is tightness of repeats. a tight wrong number is precise and inaccurate.

**error** is systematic (bias you could have named) plus random (scatter under repeat). **significant figures** communicate uncertainty; they are not magic.

**error types** you must keep separate:

| name | is |
|---|---|
| **systematic error / bias** | a shift that repeats if you repeat the procedure (wrong zero, selection, confounding) |
| **random error** | scatter under repeat of the same procedure |
| **Type I (α)** | reject a true null — false positive of the *test procedure* |
| **Type II (β)** | fail to reject a false null — miss |
| **Type S / Type M** (names) | wrong sign / exaggerated magnitude when you condition on significance |
| **measurement error** | the instrument is noisy or biased |
| **sampling error** | this sample is not the population |
| **model error** | the likelihood or the design story is wrong |
| **clerical / coding error** | the spreadsheet is not the world |

Type I and Type II are properties of a **decision rule** under a model, not moral labels on a paper. power = 1 − β. you cannot drive both error rates to zero at fixed n; you trade. **do not invent n.** fetch a sample-size door or compute from *stated* inputs with EasyLM calc.

**measurement uncertainty** as a metrology craft: **GUM** (JCGM, BIPM). type A from repeats; type B from other information. combine in quadrature when the GUM model says so; do not average two agencies’ digits. a number with no unit and no uncertainty is a decoration. physics/engineering packs use this at the bench.

**variables.** independent = what you set or what you treat as the input. dependent = what you read. if both just happen, you have an observational pair, not an experiment.

**operational definition.** “aggression,” “poverty,” “quality” need a procedure. if two labs cannot follow it, you do not have a measurement yet.

**check:** which error type. bias vs scatter. α vs a p-value (ch 6).

---

## 4. experimental design and controls

an **experiment** is a design where you **assign** the treatment (or a close cousin). the goal is to make other causes *exchangeable* across arms.

**control** is what you hold still, or the arm that does not get the intervention. “we controlled for X in a regression” is not the same as a control group — say which.

kinds of control (name the one you have):

| control | job |
|---|---|
| **negative control** | should give no effect if the procedure is clean (vehicle, sham, no-treatment) |
| **positive control** | should give a known effect if the assay works |
| **vehicle / sham** | everything but the active ingredient / everything but the incision |
| **historical control** | a past series; weaker; time is a confounder |
| **baseline (within-subject)** | the same unit before treatment; still needs a time story |
| **blinding** | who does not know the arm (participant, rater, analyst) |

a missing positive control is how a dead assay reports “no effect.” a missing negative control is how contamination reports “an effect.”

**randomize** when assignment bias is the threat. random assignment ≠ random sampling. the first is for **cause**; the second is for **target population**. blocking (pair, stratify) reduces noise you already know; randomization handles the rest you do not.

**replication.** one run is a story. biological vs technical replicates: name which. a triplicate pipette is not three mice. nested designs: say which level is the n for the claim.

**RCT** (randomized controlled trial) is the undergrad gold-standard *picture* for a treatment effect in a defined population, under protocol. reporting: **CONSORT** (EQUATOR). eligibility, allocation, follow-up, ITT vs per-protocol — fetch the checklist when you read a trial. **do not name a dose** (biology/health packs). this pack reads the *design*.

**factorial and blocked designs** (engineering DOE cousin): two factors at once can show interaction. fetch NIST e-handbook / a DOE door for the array; do not invent a run list.

**power and sample size** are functions of effect, variance, α, design. underpowered “null” is inconclusive, not proof of zero.

quasi-experiments (diff-in-diff, regression discontinuity, instruments): ch 8.

---

## 5. describing the sample

before inferring, **look**.

**location:** mean, median, mode. mean follows the tail; median is a middle. say which and why.

**spread:** variance / sd. range is fragile. IQR is a robust sketch.

**shape:** skew, multimodality. a mean of a bimodal mess is a decoy.

**outliers:** investigate. do not auto-delete. a point can be a lab error, a real tail, or the whole story. a rule for exclusion must exist *before* you see the star.

**plots.** histogram / density, box, scatter, time. a table of stars without a picture is how you miss the mixture.

**EasyLM calc** has named exprs for mean, sd, and undergrad stats. new data → live call. do not invent a mean in weights.

worked look (stated list): for a short list of numbers, compute mean and sd with EasyLM calc, then *look* whether one point owns the mean. if it does, report median/IQR too, and say why the point is in the data.

---

## 6. frequentist inference: p and CI

**sample → population** needs a model of how the sample was drawn. convenience samples do not become populations by wishing.

**p-value:** under a specified model (including the null), the probability of data at least as extreme as observed. **it is not P(hypothesis true).** it is not the effect size. it is not “due to chance alone” as a metaphysical claim. **ASA 2016** is the door. fetch it if a star fight is the job.

**α** is a chosen false-positive *rate for the procedure* if the model is true (Type I of ch 3). a common journal convention is 0.05. it is a convention, not a law of nature. multiple tests eat α; say how you paid (Bonferroni, FDR, pre-specified primary). a garden of forking paths is ch 10.

**confidence interval** is about the **procedure**: in repeated application under the model, the interval covers the parameter at the stated rate. it is not “95% probability this one parameter sits here” without a Bayesian model. still: a CI with a magnitude is more honest than a star.

**tests** (t, χ², ANOVA, nonparametric): pick from the **design and the type of outcome**, not from a stranger’s muscle memory. fetch OpenStax / NIST handbook / MIT 18.05 for the named test’s assumptions. **EasyLM calc** has `normal_cdf`, `t_ppf`, `chi2_cdf`, `binom_pmf` — use them for the number; the *choice of test* is this chapter.

worked choice (not a number): two independent groups, continuous outcome, question is a mean difference → t-interval / t-test is the usual undergrad tool *if* the sampling model is plausible. paired before/after on the same unit is not two-sample t. counts in a table are not a t. time-to-event is not a t. if the design is clustered, the ordinary t pretends you have more n than you have.

**effect size** (difference, ratio, r) plus uncertainty **beats star theater**. a tiny effect with n huge is a p, not a decision.

**regression** as description: a fitted map. residuals, leverage, omitted variables. causal reading of a coefficient is ch 8, not automatic.

---

## 7. Bayesian update

**Bayes:** prior × likelihood → posterior (then normalize). name the **prior** if you go there. a hidden prior is a hidden assumption.

for events: \(P(H\mid D) = P(D\mid H)\,P(H) / P(D)\), with \(P(D) = \sum_i P(D\mid H_i)P(H_i)\) over a partition (math pack states the same identity). for parameters: posterior ∝ likelihood × prior.

posterior is P(parameter | data, model). that *is* a probability of the parameter under those inputs — unlike a p-value.

**likelihood** is the sampling model evaluated at the data. if the model is wrong, the posterior is a neat number about the wrong world.

**credible interval** is not a CI. do not mix the names.

worked discrete update (method): two hypotheses H and not-H, stated prior P(H), stated false-positive and true-positive rates for a test. compute P(D|H) and P(D|not-H) from those rates, then P(H|D) with EasyLM calc. do not skip the base rate. a rare H plus a noisy test is how a “99% accurate” screen still yields a modest posterior.

when to go Bayesian: sequential update, hierarchical models, when you have a real prior (physical bound, previous posterior). when not: you wanted a p for a journal that demanded one — then do not launder a posterior into a star.

compute: math pack + **EasyLM calc** for simple updates; a named library for MCMC. do not sample in weights.

---

## 8. causal inference

**association is cheap. cause needs a design.** a scatterplot is not “causes.”

**confounding:** a common cause of treatment and outcome. “control for X” only helps if X is the right kind of variable (not a collider, not a mediator you wanted in the effect). draw the story (DAG as a sketch). fetch the named method; do not say “causes” from a correlation.

working designs (names; details on doors):

| design | picture |
|---|---|
| RCT | assignment randomized |
| instrument | a shove that affects Y only through treatment (exclusion) |
| difference-in-differences | parallel trends as the identifying story |
| regression discontinuity | cutoff as-if random locally |
| matching / weighting | balance on observed; unobserved still lurks |

**potential outcomes** (what would have happened): the fundamental problem is you do not see both worlds for one unit. identification is a claim about how the missing world is filled.

biology pack: correlation ≠ cause. health: dose/diagnosis still clinician. this pack only the *design* of the evidence.

---

## 9. surveys and sampling

**target population** first. then the **frame**. then the **sample**. if the frame misses people, no weighting theater fully saves you.

**probability samples** (simple random, stratified, cluster, systematic) have a known chance of inclusion. **convenience / volunteer / snowball** do not; you may still describe the sample — you may not pretend it is the nation.

**nonresponse** is a bias mechanism. response rate is not quality by itself; *who* is missing is.

**questionnaire.** wording, order, mode (phone, web, face). social desirability. a Likert number is an operational definition, not a latent soul.

**census / official stats:** US **census bureau** methodology is a door. weights, imputation, disclosure — fetch. do not invent a margin of error; compute from the design or cite the table’s footnote.

---

## 10. data hygiene and researcher degrees of freedom

**provenance:** where the number came from. file, query, date, code. a spreadsheet with no trail is not a result.

**p-hacking / peek / optional stopping / dropping outliers without a rule:** the p-value assumes the analysis was specified. if you tried twenty outcomes and reported one, the tail probability is a lie about the search.

**forking paths:** even without a malicious peek, flexible coding of “the” analysis inflates false stars. **pre-register** when stakes are high (COS / OSF is a door). exploration is allowed — **label it** as exploration. confirmatory vs exploratory is a sentence in the paper, not a vibe.

**missing data.** why missing (MCAR/MAR/MNAR as names). listwise deletion is a model. imputation is a model. say which.

**multiple testing.** a family of hypotheses needs a family rule. fishing in subgroups is how RCTs fake miracles.

**open data / code** is hygiene that makes replication possible (ch 11). it is not a substitute for design.

---

## 11. evidence synthesis, citation, review, reproducibility

**citation** is how a number or a claim keeps a trail. a load-bearing fact (dose, rate, statute, constant, quote, identity) needs a **door you could fetch again**: DOI, official URL, standard number, accession. “a study shows” without a citation is not evidence. secondary sources (textbooks, reviews, news) can *point*; primary sources (the paper, the table, the statute, the protocol) carry the load.

working citation method:

1. name the **claim** you are hanging on the source.
2. name the **kind** of source (trial, review, agency table, standard, statute, preprint).
3. fetch it. if you cannot open it, you cannot cite it as checked.
4. record enough to retrieve: authors, year, title, venue, DOI / URL, date accessed for a living page.
5. quote numbers with their **unit, time window, and population**. do not round a table into a slogan.
6. if two official pages disagree, **say so**. do not average them.

style manuals (APA, MLA, Chicago, Vancouver, IEEE) are formatting doors — fetch the one the venue named. this book cares that the trail exists, not which comma the venue wants.

**peer review** is a social filter, not a proof. it catches some errors. it does not make p = P(true). unpublished nulls still exist (**publication bias**).

**reproducibility / replicability.** same code + same data → same number (computational). new sample → similar claim (scientific). a failure to replicate is a fact that needs a design (power, population, protocol drift), not a morality play.

**meta-analysis** pools estimates with a model (fixed vs random effects — name which). garbage in, garbage out. **PRISMA** / EQUATOR for reporting. forest plots without a search protocol are a collage.

**GRADE** and similar: confidence in a body of evidence, not a single paper’s star. **Cochrane** / **WWC** as synthesis doors for named questions. fetch the review; do not average two abstracts in your head.

**primary vs secondary vs tertiary.** a trial paper is primary for *that* trial’s measurements. a systematic review is secondary (and can be the best door for a body of evidence). an encyclopedia or a news piece is orientation. warehouse textbooks in this tree are tertiary teaching; they send you to doors for load-bearing numbers. do not cite this chapter as the source of a p-value.

**check:** can a stranger find the source from what you wrote? if no, it is not a citation.

---

## 12. compute

| job | do |
|---|---|
| mean, sd, cdf, ppf, corr, linreg | **EasyLM calc** |
| which test / assumptions | this book → OpenStax / NIST handbook / 18.05 |
| measurement uncertainty | **GUM** (BIPM JCGM) |
| RCT reporting | **CONSORT** via EQUATOR |
| p-value meaning | **ASA** statement |
| prereg | **COS** / OSF |
| official survey method | census / named agency |
| a number from a paper | fetch the paper; cite |
| citation format | venue manual (APA / ICMJE / …) |

never compute the test in model weights. format expr. pass `result`. `ok` false → DONT_KNOW.

adjacent: `../math/` (probability) · `../biology/` (experiment on organisms) · `../engineering/` (SPC, DOE) · `../health/` (clinical evidence, no dose). this pack owns the **claim-check**.

---

## 13. how to attack a problem

1. write the **claim** in one sentence.
2. name the **unit of observation** and the **population**.
3. name what would **falsify**.
4. name the **design** (experiment, survey, observational, synthesis).
5. name **noise** vs **signal**, and the **threats** (confound, selection, measurement, peek).
6. **compute** only from stated numbers, with EasyLM calc. critical values from calc or a table door.
7. report **effect + uncertainty**, not a star alone.
8. named method missing → fetch LINK_INDEX, cite. do not pick ANOVA from memory for a stranger’s table.

stuck patterns:

| symptom | try |
|---|---|
| “significant so true” | p is not P(true). fetch ASA |
| scatterplot “causes” | you needed a design (ch 8) |
| n = 3, huge claim | underpowered story. replicate |
| dropped the ugly point | show it; rule first |
| CI as P(parameter in here) | that is a credible interval, or a common misread of CI |
| twenty outcomes, one star | peek. family, or exploration label |
| mean of a mess | plot first |
| “a study shows” no DOI | not a citation (ch 11) |
| Type I called “the study is wrong” | Type I is a procedure rate under the null |

---

## close

methods is a checkable result with uncertainty and a trail. question → test → update. fetch the guideline. compute with EasyLM calc. LINK_INDEX.md is doors.

home: `warehouse/methods/TEXTBOOK.md`
