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

# Scientific Method & Inquiry — Epistemology, Experimental Design & Causal Inference

A comprehensive undergraduate textbook exploring the logic of empirical discovery: the philosophy of science, formal hypothesis testing, randomized experimental designs, measurement and error analysis, statistical inference, causal DAGs, and replication standards.

---

## 0. Syllabus & Structural Map

The scientific method is a self-correcting epistemological discipline for translating theoretical conjectures into checkable, repeatable, and falsifiable empirical tests.

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
|  STATISTICAL INFERENCE (Test) | P-Values & Confidence Intervals · Bayesian Priors · Effect Sizes  |
+-------------------------------+-------------------------------------------------------------------+
|  CAUSAL INFERENCE (Causes)    | DAGs (Pearl) · Back-Door Criterion · Confounders · Instruments    |
+-------------------------------+-------------------------------------------------------------------+
|  REPLICATION INTEGRITY (Truth)| Pre-Registration · P-Hacking & HARKing · Meta-Analytic Synthesis  |
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
9. [Chapter 9: The Replication Crisis, Pre-Registration & Scientific Reform](#9-the-replication-crisis-pre-registration--scientific-reform)
10. [Chapter 10: Peer Review, Evidence Synthesis & Meta-Analysis](#10-peer-review-evidence-synthesis--meta-analysis)

---

## 1. The Philosophy of Science & Epistemological Demarcation

### 1.1 The Demarcation Problem & Falsificationism (Karl Popper)

The demarcation problem asks: what distinguishes empirical science from pseudoscience, metaphysics, or dogmatic belief?
- **The Problem of Induction (Hume):** No finite number of confirming observations of white swans can logically prove the universal generalization that all swans are white, because future disconfirming observations remain possible.
- **Popper's Criterion of Falsifiability:** A theory is scientific if and only if it makes precise, risky predictions that are capable of being empirically refuted:
  $$\text{Scientific Claim } T \implies \text{Empirical Prediction } E$$
  $$\neg E \implies \neg T \quad (\text{Modus Tollens})$$
  Theories that are compatible with every conceivable empirical outcome possess zero empirical content.

### 1.2 Paradigm Shifts & Normal Science (Thomas Kuhn)

In *The Structure of Scientific Revolutions* (1962), Kuhn showed that scientific history does not progress solely by cumulative linear aggregation:
1. **Normal Science:** Guided by an agreed **paradigm** (shared conceptual frameworks, instruments, and exemplary problem-solutions). Researchers engage in puzzle-solving within paradigm bounds.
2. **Anomalies & Crisis:** Recurrent empirical discrepancies that resist resolution accumulate over time, precipitating an institutional crisis.
3. **Scientific Revolution (Paradigm Shift):** The community transitions to a fundamentally new, incommensurable paradigm (e.g. Ptolemaic geocentrism to Copernican heliocentrism; Newtonian mechanics to Einsteinian general relativity).

---

## 2. Hypothesis Formulation, Operationalization & Decision Errors

### 2.1 Null and Alternative Hypotheses

Empirical testing contrasts two mutually exclusive claims:
- **Null Hypothesis ($H_0$):** The default baseline claim of no effect, no difference, or no association ($\mu_1 - \mu_2 = 0$).
- **Alternative Hypothesis ($H_1$):** The substantive research conjecture predicting an effect or divergence ($\mu_1 - \mu_2 \ne 0$).

### 2.2 Decision Matrix & Statistical Errors

| Reality \ Decision | Fail to Reject $H_0$ | Reject $H_0$ (Claim Effect) |
|---|---|---|
| **$H_0$ is True (No Effect)** | Correct Decision ($1 - \alpha$) | **Type I Error ($\alpha$)** (False Positive) |
| **$H_0$ is False (True Effect)**| **Type II Error ($\beta$)** (False Negative) | **Statistical Power ($1 - \beta$)** (True Positive) |

- **Type I Error Rate ($\alpha$):** The significance threshold (conventionally $\alpha = 0.05$ or $\alpha = 0.005$).
- **Statistical Power ($1 - \beta$):** The probability of correctly detecting a real effect when it exists (standard benchmark $\ge 0.80$). Power increases with larger sample sizes ($N$), larger true effect sizes ($\delta$), and reduced measurement noise ($\sigma$).

---

## 3. Experimental Design, Controls & Randomization

### 3.1 The Randomized Controlled Trial (RCT)

The RCT is the gold standard for isolating causal relations:
- **Random Assignment:** Guarantees that observed and unobserved confounding variables are distributed symmetrically across treatment and control cohorts prior to intervention.
- **Placebo Controls:** Controls for psychological expectancy effects and spontaneous remission.
- **Double-Blind Protocols:** Neither the experimental subjects nor the assessing researchers know treatment allocations, eliminating observer bias and demand characteristics.

---

## 4. Measurement Theory & Uncertainty Propagation (GUM)

### 4.1 Precision vs. Accuracy

- **Accuracy:** The degree of closeness between a measured quantity and its true physical value (threatened by systematic errors / bias).
- **Precision (Repeatability):** The degree of mutual agreement among independent measurements obtained under identical conditions (threatened by random noise).

### 4.2 Uncertainty Propagation (ISO GUM Standard)

For an indirect measurement $Y = f(X_1, X_2, \dots, X_n)$ of independent input variables $X_i$ with standard uncertainties $u(x_i)$:
$$u_c^2(y) = \sum_{i=1}^n \left( \frac{\partial f}{\partial x_i} \right)^2 u^2(x_i)$$
When variables co-vary, covariance terms $2 \sum_{i < j} \left(\frac{\partial f}{\partial x_i}\right) \left(\frac{\partial f}{\partial x_j}\right) u(x_i, x_j)$ must be included.

---

## 5. Statistical Inference, Effect Sizes & Power Analysis

### 5.1 The Logic of the P-Value

The $p$-value is the conditional probability of obtaining a test statistic at least as extreme as the observed value, assuming the null hypothesis $H_0$ is strictly true:
$$p = P(\text{Data} \ge \text{Observed} \mid H_0)$$
**Common Fallacies:**
- The $p$-value is **not** the probability that the null hypothesis is true: $P(\text{Data} \mid H_0) \ne P(H_0 \mid \text{Data})$.
- A statistically significant result ($p < 0.05$) does not imply a large, meaningful, or load-bearing physical effect.

### 5.2 Effect Size Metrics

- **Cohen's $d$ (Standardized Mean Difference):**
  $$d = \frac{\bar{X}_1 - \bar{X}_2}{s_{\text{pooled}}}$$
  Benchmarked as small ($d \approx 0.2$), medium ($d \approx 0.5$), and large ($d \ge 0.8$).
- **Correlation Coefficient ($r$) & Coefficient of Determination ($R^2$):** Quantifies variance shared between continuous variables.

---

## 6. Causal Inference & Directed Acyclic Graphs (DAGs)

### 6.1 Judea Pearl's Causal Revolution

Correlation does not imply causation, but causal relationships generate predictable patterns of statistical dependence and independence. Causal structures are represented as **Directed Acyclic Graphs (DAGs)**:
- **Confounder (Common Cause):** $X \leftarrow Z \rightarrow Y$. Conditioning on $Z$ blocks the spurious backdoor path between $X$ and $Y$.
- **Collider:** $X \rightarrow C \leftarrow Y$. Conditioning on a collider $C$ creates an artificial, spurious statistical association between $X$ and $Y$ (**Berkson's Paradox**).
- **Mediator:** $X \rightarrow M \rightarrow Y$. Transmits the causal effect of $X$ onto $Y$. Conditioning on $M$ blocks the indirect causal effect.

---

## 7. The Replication Crisis, Pre-Registration & Scientific Reform

### 7.1 Questionable Research Practices (QRPs)

- **P-Hacking (Data Dredging):** Selectively analyzing data, trying alternative covariate adjustments, or peeking at data until $p < 0.05$.
- **HARKing (Hypothesizing After the Results are Known):** Presenting post-hoc exploratory findings as if they were a priori confirmatory predictions.
- **Publication Bias (The File-Drawer Effect):** The tendency of journals to publish statistically significant findings while non-significant replications remain unpublished in filing cabinets.

### 7.2 Open Science Institutional Standards

1. **Study Pre-Registration:** Publicly registering hypotheses, sampling plans, and exact statistical analysis scripts on platforms like OSF before observing data.
2. **Registered Reports:** Peer review and in-principle acceptance granted prior to data collection, ensuring publication regardless of outcome.
3. **Open Data & Open Materials:** Public archiving of raw datasets and reproducible code scripts to facilitate independent verification and meta-analysis.
