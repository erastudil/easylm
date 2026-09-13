---
title: "psychology — undergrad textbook"
date: "2026-09-13"
status: living · undergrad · the-stacks
home: "stacks/psychology/"
related:
  - "../philosophy/"
  - "../biology/"
  - "../health/"
  - "../methods/"
---

# Psychology & Cognitive Science — Neural Architecture, Perception, Memory & Behavior

A comprehensive undergraduate textbook investigating the empirical science of mind, brain, and behavior: neurobiological substrates, sensory transduction and perception, learning theory, memory architecture, cognitive heuristics and decision science, developmental trajectories, personality psychometrics, and evidence-based clinical paradigms.

---

## 0. Syllabus & Structural Map

Psychology is the empirical and experimental study of mental processes and behavioral manifestations. It bridges physiological neuroscience with higher-order cognition, social dynamics, and developmental maturation.

```
+---------------------------------------------------------------------------------------------------+
|                                     THE COGNITIVE SPECTRUM                                        |
+---------------------------------------------------------------------------------------------------+
|  NEURAL SUBSTRATES (Hardware) | Action Potentials · Synaptic Transmitters · Cortical Localization |
+-------------------------------+-------------------------------------------------------------------+
|  SENSATION & PERCEPTION (Input)| Transduction · Psychophysics · Retinotopic & Tonotopic Mapping    |
+-------------------------------+-------------------------------------------------------------------+
|  LEARNING & BEHAVIOR (Updates)| Classical Conditioning · Operant Schedules · Reinforcement Theory |
+-------------------------------+-------------------------------------------------------------------+
|  MEMORY & COGNITION (Storage) | Working Memory (Baddeley) · Long-Term Consolidation · Spreading   |
+-------------------------------+-------------------------------------------------------------------+
|  DECISION SCIENCE (Judgments) | System 1 / System 2 · Heuristics & Biases · Prospect Theory       |
+-------------------------------+-------------------------------------------------------------------+
|  DEVELOPMENT (Lifespan)       | Piagetian Stages · Vygotsky ZPD · Attachment Theory (Ainsworth)   |
+-------------------------------+-------------------------------------------------------------------+
|  CLINICAL & HEALTH (Remedies) | DSM Diagnostic Criteria · CBT Paradigms · Empirical Interventions |
+---------------------------------------------------------------------------------------------------+
```

### Table of Contents

1. [Chapter 1: Epistemological Foundations & Psychological Research Methods](#1-epistemological-foundations--psychological-research-methods)
2. [Chapter 2: Biological Bases of Behavior & Neuroanatomy](#2-biological-bases-of-behavior--neuroanatomy)
3. [Chapter 3: Psychophysics, Sensation & Sensory Perception](#3-psychophysics-sensation--sensory-perception)
4. [Chapter 4: Conditioning & Behavior Modification Principles](#4-conditioning--behavior-modification-principles)
5. [Chapter 5: Memory Architecture, Consolidation & Retrieval](#5-memory-architecture-consolidation--retrieval)
6. [Chapter 6: Cognition, Attention & Executive Function](#6-cognition-attention--executive-function)
7. [Chapter 7: Judgment, Decision-Making & Behavioral Economics](#7-judgment-decision-making--behavioral-economics)
8. [Chapter 8: Developmental Psychology Across the Lifespan](#8-developmental-psychology-across-the-lifespan)
9. [Chapter 9: Personality Theory & Psychometric Measurement](#9-personality-theory--psychometric-measurement)
10. [Chapter 10: Psychopathology & Evidence-Based Interventions](#10-psychopathology--evidence-based-interventions)

---

## 1. Epistemological Foundations & Psychological Research Methods

### 1.1 The Scientific Paradigm in Psychology

Psychological inquiry demands operationalization: translating unobservable theoretical constructs (e.g. "anxiety", "working memory capacity", "intelligence") into measurable, falsifiable, and repeatable empirical variables.
- **Independent Variable ($X$):** The factor experimentally manipulated by the investigator.
- **Dependent Variable ($Y$):** The behavioral or physiological outcome measured.
- **Extraneous & Confounding Variables ($Z$):** Uncontrolled variables that covary systematically with $X$, threatening internal validity.

### 1.2 Methodological Designs

1. **Experimental Design (The Gold Standard for Causality):** Employs random assignment of participants to experimental and control conditions, isolating the causal effect $\Delta Y = f(\Delta X)$. Double-blind designs prevent experimenter expectancy effects and participant demand characteristics.
2. **Quasi-Experimental & Natural Experiments:** Manipulations occurring via nature or policy where random assignment is unethical or impossible (e.g. assessing outcomes following traumatic brain injury).
3. **Correlational & Longitudinal Studies:** Measuring co-variance without active manipulation. Quantified via Pearson's product-moment correlation coefficient $r \in [-1, 1]$. Crucial axiom: correlation does not establish direction of causality, susceptible to third-variable confounds.

---

## 2. Biological Bases of Behavior & Neuroanatomy

### 2.1 The Neuron & Action Potential Dynamics

The fundamental unit of neural processing is the neuron, maintaining a resting membrane potential of approximately $-70\text{ mV}$ via sodium-potassium adenosine triphosphatase ($\text{Na}^+/\text{K}^+$ ATPase pumps, expelling $3\text{ Na}^+$ for every $2\text{ K}^+$ imported).

1. **Depolarization:** Excitatory postsynaptic potentials (EPSPs) summate at the axon hillock. When the threshold potential ($\approx -55\text{ mV}$) is reached, voltage-gated $\text{Na}^+$ channels open explosively.
2. **Repolarization:** Inactivation of $\text{Na}^+$ channels and opening of voltage-gated $\text{K}^+$ channels restores negative internal charge.
3. **Refractory Period:** Absolute refractory period ensures unidirectional action potential propagation along myelinated axons via saltatory conduction across nodes of Ranvier.

### 2.2 Neurochemical Signaling Systems

- **Glutamate:** Primary excitatory neurotransmitter in the central nervous system; critical for long-term potentiation (LTP) via NMDA and AMPA receptors.
- **GABA ($\gamma$-aminobutyric acid):** Primary inhibitory neurotransmitter; dampens neural excitability via chloride channel influx ($\text{GABA}_A$).
- **Dopamine:** Catecholamine modulating reward prediction errors, motivational salience, and motor coordination (mesolimbic and nigrostriatal pathways).
- **Serotonin (5-HT):** Modulates mood, emotional regulation, appetite, and circadian cycles; targeted by selective serotonin reuptake inhibitors (SSRIs).
- **Acetylcholine (ACh):** Mediates neuromuscular junctions and central cholinergic projections critical for attention and episodic memory encoding.

### 2.3 Macroscopic Brain Systems

- **Frontal Lobe:** Prefrontal cortex mediates executive control, impulse regulation, prospective planning, and abstract reasoning. Broca's area coordinates expressive language.
- **Temporal Lobe:** Auditory processing (primary auditory cortex), semantic memory, and receptive language comprehension (Wernicke's area).
- **Parietal Lobe:** Primary somatosensory cortex and spatial representation (integrating visual dorsal stream coordinates).
- **Occipital Lobe:** Primary visual cortex (V1/striate cortex) organized into retinotopic feature-detection columns (Hubel & Wiesel).
- **Limbic Complex:** Hippocampus mediates consolidation of declarative memories; amygdala coordinates emotional arousal and conditioned threat responses.

---

## 3. Psychophysics, Sensation & Sensory Perception

### 3.1 Mathematical Laws of Psychophysics

Psychophysics quantifies the functional mapping between physical stimulus intensity ($I$) and subjective sensory experience ($S$).

1. **Weber's Law:** The just noticeable difference ($\Delta I$, difference threshold) is a constant fraction of the initial stimulus intensity:
   $$\frac{\Delta I}{I} = k \quad (\text{Weber fraction})$$
2. **Fechner's Law:** Sensation magnitude scales logarithmically with physical stimulus intensity:
   $$S = k \ln\left( \frac{I}{I_0} \right)$$
3. **Stevens' Power Law:** Generalizes sensory scaling across diverse sensory modalities:
   $$S = k I^\beta$$
   where $\beta < 1$ for compressive senses (brightness, loudness) and $\beta > 1$ for expansive senses (electric shock).

### 3.2 Signal Detection Theory (SDT)

SDT separates an observer's sensory sensitivity ($d'$, d-prime) from their decision criterion ($c$ or $\beta$):
- **Sensitivity ($d'$):** Distance between noise and signal-plus-noise distributions in standard deviation units:
  $$d' = Z(\text{Hit Rate}) - Z(\text{False Alarm Rate})$$
- Independent of an observer's conservative or liberal reporting bias.

---

## 4. Conditioning & Behavior Modification Principles

### 4.1 Classical (Pavlovian) Conditioning

Associative learning pairing a neutral stimulus with an unconditioned stimulus:
- **Acquisition:** Contiguous and contingent temporal pairing of Conditioned Stimulus (CS, e.g. metronome) with Unconditioned Stimulus (US, e.g. meat powder).
- **Extinction:** Repeated presentation of CS in the absence of US leads to progressive attenuation of the Conditioned Response (CR).
- **Spontaneous Recovery:** Re-emergence of an extinguished CR following a temporal delay, proving extinction represents new inhibitory learning rather than memory erasure.

### 4.2 Operant (Skinnerian) Conditioning

Learning governed by behavioral consequences:
- **Reinforcement:** Increases response probability (Positive: presenting an appetitive stimulus; Negative: removing an aversive stimulus).
- **Punishment:** Decreases response probability (Positive: presenting an aversive stimulus; Negative: removing an appetitive stimulus).
- **Reinforcement Schedules:**
  - *Fixed Ratio (FR):* High response rates with post-reinforcement pauses.
  - *Variable Ratio (VR):* Highest, most persistent response rates, highly resistant to extinction (the gambling/slot machine mechanic).
  - *Fixed Interval (FI):* Scalloped response pattern preceding scheduled delivery.
  - *Variable Interval (VI):* Steady, moderate response rates.

---

## 5. Memory Architecture, Consolidation & Retrieval

### 5.1 The Multistore Model (Atkinson & Shiffrin)

1. **Sensory Register:** High capacity, ultra-short decay ($\sim 250\text{ ms}$ for iconic visual store; $\sim 3 - 4\text{ s}$ for echoic auditory store).
2. **Short-Term Store:** Limited capacity classically formulated as $7 \pm 2$ chunks (Miller) or $\sim 4$ items under attentional focus (Cowan), persisting $\sim 15 - 30\text{ s}$ without rehearsal.
3. **Long-Term Store:** Unlimited capacity and long-term durability.

### 5.2 Working Memory Model (Baddeley & Hitch)

Reconceptualized short-term storage as an active computational workspace:
- **Central Executive:** Modulates attentional allocation, task switching, and inhibitory control.
- **Phonological Loop:** Subvocal articulatory rehearsal component preserving acoustic and verbal information.
- **Visuospatial Sketchpad:** Manipulates visual imagery, spatial orientation, and mental rotation.
- **Episodic Buffer:** Multimodal integration interface binding perceptual inputs with long-term semantic structures into coherent temporal episodes.

### 5.3 Long-Term Memory Taxonomy

- **Declarative (Explicit) Memory:** Consciously accessible knowledge.
  - *Episodic:* Autobiographical events situated in specific spatial-temporal contexts.
  - *Semantic:* Decontextualized conceptual facts, linguistic vocabulary, and worldly rules.
- **Nondeclarative (Implicit) Memory:** Expressed through performance without conscious awareness.
  - *Procedural:* Motor and cognitive skills (e.g. bicycle riding, typing).
  - *Priming & Perceptual Learning:* Enhanced processing speed following prior exposure.
  - *Conditioned Reflexes:* Classical Pavlovian associations.

---

## 6. Cognition, Attention & Executive Function

### 6.1 Selective & Divided Attention

- **Broadbent Filter Model:** Early selection model positing an all-or-none bottleneck prior to semantic analysis.
- **Treisman Attenuation Model:** Intermediate model where unattended sensory channels are attenuated rather than completely blocked, explaining the "cocktail party phenomenon" (hearing one's own name in a crowded room).
- **Kahneman's Attentional Capacity Theory:** Attention as a finite, allocatable computational resource modulated by arousal and task complexity.

---

## 7. Judgment, Decision-Making & Behavioral Economics

### 7.1 Dual-Process Theory (Kahneman & Tversky)

- **System 1 (Fast & Intuitive):** Automatic, involuntary, fast, emotionally charged, high capacity, rule-heuristic-driven, unconscious of its own operation.
- **System 2 (Slow & Deliberative):** Effortful, voluntary, slow, logically constrained, low capacity, serial, requiring working memory allocation.

### 7.2 Core Heuristics and Cognitive Biases

1. **Availability Heuristic:** Estimating frequency or probability based on the cognitive ease with which instances come to mind (distorted by media vividness).
2. **Representativeness Heuristic:** Categorizing probability by the degree of similarity to a prototype, often neglecting base-rate probabilities (the base-rate fallacy).
3. **Anchoring & Adjustment:** Relying disproportionately on an initial reference number, adjusting insufficiently from that anchor.
4. **Framing Effects:** Decision shifts driven by presenting identical objective outcomes as potential gains versus potential losses.
5. **Prospect Theory:** Asymmetric value function: the subjective disutility of a loss is psychologically more painful than the utility of an equivalent gain (**loss aversion**, $V(-\$100) \approx 2 \times |V(+\$100)|$).

---

## 8. Developmental Psychology Across the Lifespan

### 8.1 Piagetian Cognitive Stage Theory

Children construct cognitive schemas through **assimilation** (fitting new information into existing mental frameworks) and **accommodation** (revising frameworks in response to novel disconfirming feedback):
1. **Sensorimotor ($0 - 2\text{ yrs}$):** Coordination of sensory motor actions; mastery of **object permanence** ($\sim 8\text{ months}$).
2. **Preoperational ($2 - 7\text{ yrs}$):** Symbolic representation, emergence of language; constrained by egocentrism and lack of **conservation**.
3. **Concrete Operational ($7 - 11\text{ yrs}$):** Logical operations applied to concrete physical objects; mastery of reversibility, transitivity, and conservation of mass and volume.
4. **Formal Operational ($12+\text{ yrs}$):** Abstract propositional logic, systematic deductive hypothesis testing, and counterfactual reasoning.

### 8.2 Attachment Theory (Bowlby & Ainsworth)

Assessed via the Strange Situation paradigm:
- **Secure Attachment:** Demonstrates distress upon caregiver separation, actively seeks comfort upon reunion, returns readily to exploratory play.
- **Insecure-Avoidant:** Suppresses overt distress upon separation, actively avoids proximity upon reunion.
- **Insecure-Resistant/Ambivalent:** Heightened distress upon separation, ambivalence and anger upon reunion, inability to soothe.
- **Disorganized/Disoriented:** Contradictory behaviors signaling fear of the attachment figure.

---

## 9. Personality Theory & Psychometric Measurement

### 9.1 The Five-Factor Model (The Big Five / OCEAN)

Derived via lexical analysis and factor analysis of trait descriptors across human languages:
1. **Openness to Experience:** Intellectual curiosity, artistic appreciation, unconventionality.
2. **Conscientiousness:** Dutifulness, self-regulation, goal-directed planning, organization.
3. **Extraversion:** Sociability, positive affectivity, assertiveness, reward sensitivity.
4. **Agreeableness:** Altruism, empathy, trust, pro-social cooperativeness.
5. **Neuroticism:** Emotional volatility, vulnerability to stress, chronic threat sensitivity.

---

## 10. Psychopathology & Evidence-Based Interventions

### 10.1 Diagnostic Paradigms

Classification via the Diagnostic and Statistical Manual of Mental Disorders (DSM-5-TR) and International Classification of Diseases (ICD-11). Diagnostic criteria mandate clinical distress or impairment across social, occupational, or personal domains.

### 10.2 Evidence-Based Psychotherapy

- **Cognitive Behavioral Therapy (CBT - Beck):** Identifies and restructures dysfunctional cognitive schemas and automatic negative thoughts, paired with behavioral activation and systematic desensitization.
- **Exposure Therapies:** Extinguishes conditioned fear responses via controlled, gradual, and repeated exposure to feared stimuli without avoidance or safety behaviors.
