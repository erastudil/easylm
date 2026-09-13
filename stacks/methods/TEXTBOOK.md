---
title: "methods — undergrad textbook"
date: "2026-09-13"
status: living · undergrad · the-stacks
home: "stacks/methods/"
related:
  - "../math/"
  - "../philosophy/"
  - "../biology/"
  - "../physics/"
---

# Scientific Method & Inquiry — Epistemology, Experimental Design, Causal Inference & Research Integrity

A comprehensive undergraduate textbook exploring the logic of empirical discovery: the philosophy of science, formal hypothesis testing, randomized experimental designs, measurement and error analysis, statistical inference, Bayesian updating, causal DAGs, and replication standards.

---

## 0. Syllabus & Structural Map

In 1974, Richard Feynman delivered a legendary address on what he termed **Cargo Cult Science**. During World War II, islanders in the South Pacific observed airplanes landing with supplies of food, clothing, and medicine. After the war ended, they built bamboo airfields, carved wooden headphones, lit bonfires along faux runways, and waited for the planes to return. Everything looked structurally identical on the surface, but no planes ever landed.

Feynman noted that vast quantities of human research resemble cargo cult science: people perform tests, run statistical regressions, and publish papers with graphs and $p$-values, yet their airplanes never land because they are missing the core requirement of science: **utter, uncompromising scientific integrity**. Science is not a mechanical checklist of laboratory rituals; it is a systematic, self-correcting epistemological discipline designed to prevent humans from fooling themselves—and as Feynman famously warned, *the easiest person to fool is yourself.*

```
+---------------------------------------------------------------------------------------------------+
|                                 THE ARCHITECTURE OF DISCOVERY                                     |
+---------------------------------------------------------------------------------------------------+
|  EPISTEMOLOGY (Logic)         | Induction · Popperian Falsification · Kuhnian Paradigm Shifts     |
+-------------------------------+-------------------------------------------------------------------+
|  HYPOTHESIS DESIGN (Claims)   | Null & Alternative · Operationalization · Alpha & Beta Error      |
+-------------------------------+-------------------------------------------------------------------+
|  EXPERIMENTAL CONTROL (Setup) | RCTs · Double-Blind · Placebos · Factorial & Quasi-Experiments     |
+-------------------------------+-------------------------------------------------------------------+
|  MEASUREMENT & ERROR (GUM)    | Systematic vs Random Error · Uncertainty Propagation · Validity   |
+-------------------------------+-------------------------------------------------------------------+
|  STATISTICAL INFERENCE (Test) | P-Values & Confidence Intervals · Effect Sizes · Power Analysis   |
+-------------------------------+-------------------------------------------------------------------+
|  BAYESIAN REVISION (Priors)   | Prior Likelihood · Posterior Belief · Conjugate Updating          |
+-------------------------------+-------------------------------------------------------------------+
|  CAUSAL INFERENCE (Causes)    | DAGs (Pearl) · Back-Door Criterion · Confounders · Colliders      |
+-------------------------------+-------------------------------------------------------------------+
|  SAMPLING & BIAS (Data)       | Stratified Sampling · Selection Bias · Survivorship · Non-Response|
+-------------------------------+-------------------------------------------------------------------+
|  REPLICATION INTEGRITY (Truth)| Pre-Registration · Registered Reports · P-Hacking · HARKing       |
+-------------------------------+-------------------------------------------------------------------+
|  EVIDENCE SYNTHESIS (Meta)    | Systematic Reviews · Forest Plots · Funnel Plots · Publication    |
+---------------------------------------------------------------------------------------------------+
```

### Table of Contents

1. [Chapter 1: The Philosophy of Science & Epistemological Demarcation](#1-the-philosophy-of-science--epistemological-demarcation)
2. [Chapter 2: Hypothesis Formulation, Operationalization & Decision Errors](#2-hypothesis-formulation-operationalization--decision-errors)
3. [Chapter 3: Experimental Design, Controls & Randomization](#3-experimental-design-controls--randomization)
4. [Chapter 4: Measurement Theory & Uncertainty Propagation (GUM)](#4-measurement-theory--uncertainty-propagation-gum)
5. [Chapter 5: Statistical Inference, Effect Sizes & Power Analysis](#5-statistical-inference-effect-sizes--power-analysis)
6. [Chapter 6: Bayesian Inquiry & Belief Revision](#6-bayesian-inquiry--belief-revision)
7. [Chapter 7: Causal Inference & Directed Acyclic Graphs (DAGs)](#7-causal-inference--directed-acyclic-graphs-dags)
8. [Chapter 8: Survey Methodology, Sampling & Observational Biases](#8-survey-methodology-sampling--observational-biases)
9. [Chapter 9: The Replication Crisis, Pre-Registration & Open Science](#9-the-replication-crisis-pre-registration--open-science)
10. [Chapter 10: Evidence Synthesis, Systematic Reviews & Meta-Analysis](#10-evidence-synthesis-systematic-reviews--meta-analysis)
11. [Chapter 11: Feynman's Cargo Cult Warning & Core Methodological Fallacies](#11-feynmans-cargo-cult-warning--core-methodological-fallacies)

---

## 1. The Philosophy of Science & Epistemological Demarcation

### 1.1 The Demarcation Problem & Falsificationism (Karl Popper)

What distinguishes genuine empirical science from pseudoscience, astrology, or dogma?
- **The Problem of Induction (David Hume):** No matter how many thousands of white swans you observe, you can never prove the universal claim that "all swans are white," because observing a single black swan in Australia shatters the generalization instantly. Induction cannot logically establish universal empirical laws.
- **Popper's Falsification Criterion:** A theory is scientific if and only if it makes precise, risky empirical predictions that could be demonstrated false by an observable experiment.
  $$\text{Theory } T \implies \text{Prediction } E$$
  $$\neg E \implies \neg T \quad (\text{Modus Tollens})$$
  If a theory is constructed so flexibly that every possible outcome can be rationalized after the fact, it explains nothing and has zero scientific value.

### 1.2 Paradigm Shifts & Scientific Revolutions (Thomas Kuhn)

In *The Structure of Scientific Revolutions* (1962), Thomas Kuhn showed that science does not move in a smooth, continuous line of incremental additions:
1. **Normal Science:** Researchers work comfortably within an accepted **paradigm** (a shared constellation of theories, instruments, and problem-solving habits), solving puzzles that fit the paradigm's boundaries.
2. **Anomalies and Crisis:** Over time, stubborn empirical anomalies emerge that cannot be shoehorned into the reigning framework. When anomalies multiply, the discipline enters an institutional crisis.
3. **Paradigm Shift:** A new paradigm emerges (e.g. from Ptolemaic epicycles to Copernican heliocentrism; from Newtonian absolute space to Einsteinian relativistic spacetime) that reinterprets existing evidence and opens a new era of inquiry.

---

## 2. Hypothesis Formulation, Operationalization & Decision Errors

### 2.1 Operationalization: From Fuzzy Concepts to Concrete Meters

Before testing an idea, abstract theoretical concepts must be **operationalized** into clear, measurable variables. If you wish to study "academic stress," you cannot simply look at a student and judge their feeling. You must define an operational metric: salivary cortisol concentration in nmol/L, heart-rate variability measured during exams, or scores on a validated clinical questionnaire.

### 2.2 Null and Alternative Hypotheses

- **Null Hypothesis ($H_0$):** The baseline assumption that no real effect, difference, or relationship exists ($\mu_1 - \mu_2 = 0$).
- **Alternative Hypothesis ($H_1$):** The substantive claim that an effect exists ($\mu_1 - \mu_2 \ne 0$).

### 2.3 The Decision Matrix & Statistical Errors

| Reality \ Decision | Fail to Reject $H_0$ (No Effect Claimed) | Reject $H_0$ (Claim Effect) |
|---|---|---|
| **$H_0$ is True (No Effect)** | Correct Baseline ($1 - \alpha$) | **Type I Error ($\alpha$)** (False Positive) |
| **$H_0$ is False (True Effect)**| **Type II Error ($\beta$)** (False Negative) | **Statistical Power ($1 - \beta$)** (True Positive) |

- **Type I Error ($\alpha$):** The false-alarm rate (conventionally capped at $0.05$ or $0.005$).
- **Statistical Power ($1 - \beta$):** The probability of detecting a real effect when one truly exists (benchmarked at $\ge 0.80$). Low statistical power is the silent engine of the replication crisis: studies with tiny samples produce noisy estimates that wildly inflate effect sizes.

---

## 3. Experimental Design, Controls & Randomization

### 3.1 The Randomized Controlled Trial (RCT)

The RCT is the gold standard of experimental causal isolation:
1. **Random Assignment:** Participants are allocated to treatment and control groups by a random mechanism (such as a pseudo-random number generator). Randomization ensures that all confounding variables—both observed (age, sex) and unobserved (genetics, childhood diet, motivation)—are distributed evenly between cohorts.
2. **Placebo Controls:** Ensures that improvements caused by psychological expectations, patient optimism, or the rituals of care are accounted for.
3. **Double-Blinding:** Neither the subject receiving the treatment nor the clinical staff administering and recording measurements know who received the active drug versus the placebo, eliminating observer expectancy and confirmation bias.

### 3.2 Factorial & Quasi-Experimental Designs

- **Factorial Designs ($2 \times 2$):** Simultaneously manipulates two independent variables, enabling researchers to detect **interaction effects** where the effect of one factor depends on the presence of another.
- **Natural & Quasi-Experiments:** When randomized intervention is unethical or physically impossible (e.g. evaluating the health impact of cigarette smoking or an earthquake), researchers use quasi-experimental techniques: difference-in-differences, regression discontinuity, and instrumental variables.

---

## 4. Measurement Theory & Uncertainty Propagation (GUM)

### 4.1 Precision, Accuracy, and Validity

- **Accuracy:** How close the mean of measurements is to the true underlying physical value.
- **Precision (Repeatability):** The tightness of clustering among repeated measurements under identical conditions.
- **Construct Validity:** Whether the test measures the actual theoretical entity it claims to measure.

### 4.2 The ISO Guide to the Expression of Uncertainty in Measurement (GUM)

No physical measurement is complete without a quantified statement of uncertainty: $X = x_{\text{best}} \pm u_c$.
For a derived quantity $Y = f(X_1, X_2, \dots, X_n)$ where input variables $X_i$ are uncorrelated:
$$u_c^2(y) = \sum_{i=1}^n \left( \frac{\partial f}{\partial x_i} \right)^2 u^2(x_i)$$

When variables are correlated, the covariance must be included:
$$u_c^2(y) = \sum_{i=1}^n \left( \frac{\partial f}{\partial x_i} \right)^2 u^2(x_i) + 2 \sum_{i=1}^{n-1}\sum_{j=i+1}^n \frac{\partial f}{\partial x_i}\frac{\partial f}{\partial x_j} u(x_i, x_j)$$

---

## 5. Statistical Inference, Effect Sizes & Power Analysis

### 5.1 What a P-Value Is (and Is Not)

The $p$-value is the conditional probability of obtaining a test statistic at least as extreme as the one observed, **assuming the null hypothesis is strictly true**:
$$p = P(\text{Data} \ge \text{Observed} \mid H_0)$$

**What a $p$-value is NOT:**
- It is **not** the probability that the hypothesis is true: $P(\text{Data} \mid H_0) \ne P(H_0 \mid \text{Data})$.
- A small $p$-value ($p < 0.05$) does **not** mean the effect is large or practically meaningful. In a sample of $1,000,000$ people, a trivial blood pressure difference of $0.01\text{ mmHg}$ can produce $p < 0.0001$.

### 5.2 Effect Size Metrics

Science measures the **magnitude** of effects, not just their statistical significance:
- **Cohen's $d$:** The difference between two group means divided by their pooled standard deviation:
  $$d = \frac{\bar{X}_1 - \bar{X}_2}{s_{\text{pooled}}}$$
  Benchmarked as small ($d \approx 0.2$), medium ($d \approx 0.5$), and large ($d \ge 0.8$).
- **Pearson's $r$ and $R^2$:** Quantifies the proportion of variance shared between variables ($R^2 = 0.25$ means 25% of the variance is explained).

---

## 6. Bayesian Inquiry & Belief Revision

In classical frequentist statistics, probability is defined as the long-run limiting frequency of an event across infinite hypothetical repetitions. In Bayesian statistics, probability represents an agent's rational degree of belief in a hypothesis given available evidence.

### 6.1 The Bayesian Update Formula

$$P(H \mid E) = \frac{P(E \mid H) P(H)}{P(E)}$$
- $P(H)$: **Prior Probability** (the initial plausibility of the claim before the experiment).
- $P(E \mid H)$: **Likelihood** (the probability of observing the data if the claim is true).
- $P(H \mid E)$: **Posterior Probability** (the revised belief after observing evidence $E$).

**The Rare Disease Screen Analogy:** Suppose a medical condition affects 1 in 1,000 people ($P(H) = 0.001$). A diagnostic test is 99% accurate (true positive rate = 0.99, false positive rate = 0.05). If an individual tests positive, what is the probability they actually have the disease? Frequentist intuition mistakenly assumes 99%. But applying Bayes' theorem:
$$P(H \mid +) = \frac{0.99 \times 0.001}{(0.99 \times 0.001) + (0.05 \times 0.999)} \approx \frac{0.00099}{0.00099 + 0.04995} \approx 1.94\%$$
Because the condition is rare, false positives vastly outnumber true positives!

---

## 7. Causal Inference & Directed Acyclic Graphs (DAGs)

For decades, scientists repeated the mantra: "Correlation does not imply causation," yet lacked a formal mathematical language to express what *does* imply causation. Judea Pearl developed causal calculus using **Directed Acyclic Graphs (DAGs)**.

```
Confounder (Common Cause)       Collider (Common Effect)         Mediator (Chain)
         Z                                C                              M
       ↙   ↘                            ↗   ↖                          ↗   ↘
      X ⋯⋯⋯ Y                          X     Y                        X     Y
 (Spurious Correlation)         (Conditioning Creates Spurious)    (Transmits Effect)
```

1. **Confounder ($X \leftarrow Z \rightarrow Y$):** $Z$ causes both $X$ and $Y$ (e.g. hot summer weather causes both ice cream sales and drowning accidents). To isolate the true causal effect of $X$ on $Y$, you must condition on (control for) $Z$, closing the backdoor path.
2. **Collider ($X \rightarrow C \leftarrow Y$):** $X$ and $Y$ both independently cause $C$. If you mistakenly condition on a collider $C$, you introduce a fake, spurious correlation between $X$ and $Y$ (**Berkson's Fallacy**). Example: If both acting talent ($X$) and physical beauty ($Y$) help you get hired as a Hollywood actor ($C$), then within the population of successful actors, beauty and talent will appear negatively correlated!
3. **Mediator ($X \rightarrow M \rightarrow Y$):** $M$ sits on the causal chain transmitting the effect. If you condition on $M$, you extinguish the very mechanism you seek to measure.

---

## 8. Survey Methodology, Sampling & Observational Biases

### 8.1 Sampling Techniques

- **Simple Random Sampling:** Every member of the target population has an equal probability of selection.
- **Stratified Random Sampling:** The population is divided into mutually exclusive strata (e.g. age, geography, income), and samples are drawn proportionally from each stratum to ensure accurate subgroup representation.

### 8.2 Systematic Sampling Biases

- **Selection Bias:** When the sample systematically differs from the target population (e.g. polling political attitudes via landline telephones systematically misses younger demographics).
- **Survivorship Bias:** Analyzing only the entities that passed an endurance filter (e.g. Abraham Wald's famous World War II aircraft armor analysis: bombers returning with bullet holes in the wings needed armor on the *engines*, where the shot-down bombers had taken fatal hits).
- **Non-Response Bias:** When individuals who decline to participate hold systematically different attitudes from those who respond.

---

## 9. The Replication Crisis, Pre-Registration & Open Science

Beginning in the 2010s, massive replication initiatives (such as the Many Labs projects and the Reproducibility Project: Psychology) revealed that more than half of published findings in top psychology and biomedical journals failed to replicate.

### 9.1 Questionable Research Practices (QRPs)

- **$p$-Hacking:** Testing multiple dependent variables, slicing subgroups, dropping outliers, or running multiple statistical models until one achieves $p < 0.05$, and reporting only that single model.
- **HARKing (Hypothesizing After the Results are Known):** Presenting post-hoc data explorations as if they had been confirmatory hypotheses planned in advance.
- **The File-Drawer Problem:** Academic journals historically preferred novel, positive findings, consigning negative replication failures to researchers' filing cabinets.

### 9.2 The Open Science Revolution

1. **Study Pre-Registration:** Publicly time-stamping hypotheses, sampling plans, and exact statistical code on platforms like OSF before data collection begins.
2. **Registered Reports:** Journals grant in-principle acceptance *prior* to data collection based purely on methodological rigor and theoretical importance, guaranteeing publication regardless of whether results are positive or negative.
3. **Open Data & Open Code:** Making raw data tables and execution scripts publicly verifiable and reproducible by independent auditors.

---

## 10. Evidence Synthesis, Systematic Reviews & Meta-Analysis

A single study never settles a scientific question. Reliable knowledge requires systematic synthesis of all available evidence.

### 10.1 Systematic Reviews vs. Narrative Reviews

- **Narrative Review:** An author hand-picks favorite studies to support a predetermined thesis (high susceptibility to confirmation bias).
- **Systematic Review:** Uses explicit, comprehensive search criteria across all major bibliographic databases (PubMed, Cochrane, Embase) with documented inclusion and exclusion rules.

### 10.2 Meta-Analytic Tools

- **Forest Plots:** Graphically displays effect sizes and 95% confidence intervals from every included study, alongside a summary diamond representing the weighted pooled effect.
- **Funnel Plots:** Plots effect size against sample size / standard error. In the absence of publication bias, the plot resembles a symmetric inverted funnel. Asymmetry (missing studies in the bottom-left region of small, non-significant findings) reveals the telltale signature of publication bias.

---

## 11. Feynman's Cargo Cult Warning & Core Methodological Fallacies

### 11.1 The Core Scientific Virtues

1. **Leaning Over Backwards:** Feynman's mandate: you must actively seek out and document every fact, alternative explanation, or possible experimental glitch that could prove your favorite hypothesis wrong.
2. **Double-Checking the Negative Control:** If your assay or instrument yields a positive signal when exposed to plain distilled water, your experimental readings on actual samples are worthless.
3. **Distinguishing Prediction from Post-Hoc Storytelling:** Fitting a polynomial curve to 100 historical data points is easy; predicting the 101st point in advance is the real test of a scientific model.
4. **Transparent Failure Reporting:** Reporting when an experiment failed to produce an effect is just as valuable to humanity as reporting when it succeeded. It saves other researchers millions of dollars and years of wasted effort.
