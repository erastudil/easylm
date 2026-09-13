---
title: "ai_ml — undergrad textbook"
date: "2026-09-13"
status: living · undergrad · the-stacks
home: "stacks/ai_ml/"
related:
  - "../computing/"
  - "../software/"
  - "../math/"
  - "../methods/"
---

# Artificial Intelligence & Machine Learning — From Perceptrons to Transformers and Sovereign Inference

A comprehensive undergraduate textbook exploring the mathematical, algorithmic, and systemic foundations of modern artificial intelligence: continuous function approximation, statistical optimization, representation learning, transformer architectures, quantization mechanics, and client-side neural execution.

---

## 0. Syllabus & Structural Map

Machine learning is not magical cognition. It is the science of turning data into geometry, and geometry into predictable function approximation. Just as Isaac Newton discovered that planetary orbits could be calculated by simple differential equations rather than divine whim, modern machine learning demonstrates that complex linguistic and perceptual tasks can be framed as navigating high-dimensional mathematical landscapes.

```
+---------------------------------------------------------------------------------------------------+
|                                 THE MACHINE LEARNING SPECTRUM                                     |
+---------------------------------------------------------------------------------------------------+
|  REPRESENTATION (Data -> Vector) | Tokenization (BPE) · Vector Embeddings · Latent Manifolds       |
+----------------------------------+----------------------------------------------------------------+
|  OPTIMIZATION (Loss -> Weight)   | Cost Landscapes · Gradient Descent · Backpropagation · Adam    |
+----------------------------------+----------------------------------------------------------------+
|  ARCHITECTURE (Layers -> Flow)   | Multi-Layer Perceptrons · Residual Streams · Attention Blocks  |
+----------------------------------+----------------------------------------------------------------+
|  THE TRANSFORMER (Routing)       | Scaled Dot-Product Attention (Q, K, V) · Multi-Head Mechanics   |
+----------------------------------+----------------------------------------------------------------+
|  SYSTEMS & INFERENCE (Compute)   | Autoregressive Decoding · KV-Cache · Quantization (INT4/FP16)  |
+----------------------------------+----------------------------------------------------------------+
|  VERIFICATION & TRUTH (Limits)   | Hallucination Geometry · Retrieval-Augmented Generation · Evals |
+---------------------------------------------------------------------------------------------------+
```

### Table of Contents

1. [Chapter 1: The First Principles of Learning — Functions and Landscapes](#1-the-first-principles-of-learning--functions-and-landscapes)
2. [Chapter 2: The Three Regimes: Supervised, Self-Supervised, and Reinforcement](#2-the-three-regimes-supervised-self-supervised-and-reinforcement)
3. [Chapter 3: Turning Words into Space: Tokenization and High-Dimensional Embeddings](#3-turning-words-into-space-tokenization-and-high-dimensional-embeddings)
4. [Chapter 4: Neural Networks and Backpropagation: The Sound-Mixer Analogy](#4-neural-networks-and-backpropagation-the-sound-mixer-analogy)
5. [Chapter 5: Transformers and Scaled Dot-Product Attention: The Spotlight Mechanism](#5-transformers-and-scaled-dot-product-attention-the-spotlight-mechanism)
6. [Chapter 6: The Two Clocks: Pre-Training vs. Autoregressive Inference](#6-the-two-clocks-pre-training-vs-autoregressive-inference)
7. [Chapter 7: Quantization Mechanics: Compressing High-Precision Precision into Silicon](#7-quantization-mechanics-compressing-high-precision-precision-into-silicon)
8. [Chapter 8: Sovereign Client Execution: The WebGPU Revolution](#8-sovereign-client-execution-the-webgpu-revolution)
9. [Chapter 9: The Nature of Hallucination: Probability Valleys Without Anchor Ropes](#9-the-nature-of-hallucination-probability-valleys-without-anchor-ropes)
10. [Chapter 10: Parametric Memory vs. Retrieval-Augmented Generation (RAG)](#10-parametric-memory-vs-retrieval-augmented-generation-rag)
11. [Chapter 11: Empirical Measurement and Rigorous Evaluation](#11-empirical-measurement-and-rigorous-evaluation)
12. [Chapter 12: Cognitive Alignment and the Limits of Predictive Models](#12-cognitive-alignment-and-the-limits-of-predictive-models)
13. [Chapter 13: Epistemic Grounding and Trusted Academic Doors](#13-epistemic-grounding-and-trusted-academic-doors)

---

## 1. The First Principles of Learning — Functions and Landscapes

### 1.1 The Simplest Analogy: The Hill in the Fog

Imagine you are dropped by helicopter onto a rugged mountain range enveloped in dense fog. You cannot see the landscape. You cannot see the lowest valley. All you can feel with the soles of your boots is the slope of the ground immediately beneath your feet. Your mission is to find the lowest valley where a warm cabin sits.

What do you do? You feel the slope with your feet. If the ground dips downward toward the southeast, you take a step southeast. You pause, feel the new slope, and take another step downward. If you take small, deliberate steps, you will reliably descend until the ground flattens out.

In machine learning:
- The **foggy landscape** is the **Loss Function** (or Error Surface). It measures how bad your model's predictions currently are.
- The **altitude** is the total error across your data. High altitude means catastrophic mistakes; sea level means near-perfect predictions.
- The **compass coordinates** of your position are the **Parameters** (weights and biases, denoted $\theta$).
- Feeling the slope with your boots is calculating the **Gradient** ($\nabla_\theta L$).
- Taking a step downhill is **Gradient Descent**.

### 1.2 The Mathematical Formulation

Formally, an artificial intelligence model is a parameterized mathematical function $f$ that maps an input vector $x \in \mathcal{X}$ to a predicted output $\hat{y} \in \mathcal{Y}$:

$$\hat{y} = f(x; \theta)$$

The parameters $\theta$ are not biological memories, thoughts, or intentions; they are arrays of real numbers (floating-point tensors). To assess the quality of $f$, we define an explicit scalar loss function $\mathcal{L}(\hat{y}, y)$ that quantifies the divergence between the prediction $\hat{y}$ and the ground truth $y$:

$$\mathcal{L}(\theta) = \frac{1}{N} \sum_{i=1}^N \ell(f(x_i; \theta), y_i)$$

Learning is simply the optimization problem of finding the parameter set $\theta^*$ that minimizes this cumulative loss:

$$\theta^* = \arg\min_\theta \mathcal{L}(\theta)$$

---

## 2. The Three Regimes: Supervised, Self-Supervised, and Reinforcement

### 2.1 The Classroom, the Library, and the Bicycle

To understand how models learn, consider three human scenarios:
1. **The Flashcard Classroom (Supervised Learning):** A teacher holds up a picture of a bird and says "Bird." She holds up a picture of a cat and says "Cat." The learner sees both the question and the explicit answer.
2. **The Late-Night Library (Self-Supervised Learning):** A curious student is alone in an ancient library with millions of books. No teacher is present. To learn, the student plays a game: she takes a piece of paper, covers the last word of a sentence, tries to guess it, and then lifts the paper to see if she was right. Through billions of repetitions across millions of books, she learns grammar, history, science, and reasoning without ever being handed a single label.
3. **Riding a Bicycle (Reinforcement Learning):** A child gets on a bicycle. No one explains angular momentum or gyroscopic precession. If she leans too far left, she falls and scrapes her knee (negative reward). If she balances and pedals forward, the wind cools her face and she moves ahead (positive reward). Through trial, error, and feedback signals, her motor policy adapts.

### 2.2 Formal Mechanics of Self-Supervised Pre-Training

Modern Large Language Models (LLMs) acquire the vast majority of their general capability via **self-supervised learning** on vast corpora of unstructured text. Given a sequence of tokens $x = (t_1, t_2, \dots, t_T)$, the training objective is to maximize the log-likelihood of predicting each token conditioned on its preceding context:

$$\mathcal{L}_{\text{autoregressive}}(\theta) = -\sum_{i=1}^T \log P_\theta(t_i \mid t_1, t_2, \dots, t_{i-1})$$

The "supervision" is manufactured entirely from the structure of the data itself.

---

## 3. Turning Words into Space: Tokenization and High-Dimensional Embeddings

### 3.1 The Geometry of Meaning

How can a computer calculate with words like "galaxy," "justice," or "photosynthesis"? Computers cannot process symbols directly; they only perform linear algebra on numbers.

The breakthrough insight of modern representation learning is that **semantic meaning can be represented as geometric position in high-dimensional space**.

Imagine a 3-dimensional space where:
- The X-axis represents "Size" (from flea to blue whale).
- The Y-axis represents "Domesticity" (from wild wolf to pet golden retriever).
- The Z-axis represents "Cuteness".

In this 3D space, "kitten" and "puppy" sit right next to each other. "Grizzly bear" sits far away on the wild axis. If you subtract the vector for "dog" and add "cat", you move through space in a meaningful semantic direction.

Modern language models do not use 3 dimensions; they use 4,096 or 8,192 dimensions. In such an immense space, words, concepts, relationships, grammatical tenses, and logical analogies form intricate geometric constellations.

### 3.2 Tokenization: Byte-Pair Encoding (BPE)

Before text enters geometric space, it must be chopped into discrete integers called **tokens**. A token is not necessarily a full word. Frequent words (e.g., "the", "apple") receive their own single token id. Rare or complex words are split into subword fragments:
- `"unbelievable"` $\rightarrow$ `["un", "believ", "able"]`

Each unique token id $t \in \{1, \dots, V\}$ corresponds to a row in an **Embedding Matrix** $E \in \mathbb{R}^{V \times d_{\text{model}}}$. When token $t$ is fed to the network, the model looks up row $E[t]$ to obtain its initial $d_{\text{model}}$-dimensional vector representation:

$$\mathbf{x}_i = E[t_i] + P_i$$

where $P_i$ is a **positional encoding** vector that informs the model where the token sits in the sequence (first, fifth, hundredth).

---

## 4. Neural Networks and Backpropagation: The Sound-Mixer Analogy

### 4.1 The Giant Mixing Console

Imagine an enormous sound-mixing console in an arena. It has 100 billion sliders and rotary knobs. At the front of the stage is an orchestra playing music, but the sound coming out of the speakers is discordant noise.

You have an automated microphone that records the master output and compares it to a pristine recording of Beethoven's Ninth Symphony. For every note, the system notes the discrepancy.

Now comes the core question: which of the 100 billion knobs should you turn, and in which direction, to make the output sound closer to Beethoven?

If you had to test each knob individually, it would take longer than the age of the universe. Instead, calculus provides **The Chain Rule**. By propagating the error backward through the circuitry—from the output speakers back through each amplifier, equalizer, and potentiometer—we can calculate the exact sensitivity of the total error with respect to every single knob simultaneously.

This backward flow of error derivatives is **Backpropagation**.

### 4.2 The Mathematical Engine

A feedforward layer computes an affine linear transformation followed by an elementwise non-linear activation function $\sigma$ (such as ReLU, GELU, or Swish):

$$\mathbf{h}^{(l)} = \sigma\left(W^{(l)} \mathbf{h}^{(l-1)} + \mathbf{b}^{(l)}\right)$$

Without the non-linear function $\sigma$, stacking a hundred layers would collapse into a single trivial matrix multiplication ($W_2 W_1 \mathbf{x} = W_{\text{combined}} \mathbf{x}$). The non-linearity is what bends and folds high-dimensional space, allowing the network to approximate any continuous function (the Universal Approximation Theorem).

Using the multivariate chain rule, the gradient of the loss $\mathcal{L}$ with respect to weight matrix $W^{(l)}$ is:

$$\frac{\partial \mathcal{L}}{\partial W^{(l)}} = \boldsymbol{\delta}^{(l)} \left(\mathbf{h}^{(l-1)}\right)^T, \quad \text{where } \boldsymbol{\delta}^{(l)} = \left( (W^{(l+1)})^T \boldsymbol{\delta}^{(l+1)} \right) \odot \sigma'(\mathbf{z}^{(l)})$$

Weights are then updated via gradient descent algorithms like AdamW:

$$\theta_{t+1} = \theta_t - \eta \frac{\hat{\mathbf{m}}_t}{\sqrt{\hat{\mathbf{v}}_t} + \epsilon} - \eta \lambda \theta_t$$

---

## 5. Transformers and Scaled Dot-Product Attention: The Spotlight Mechanism

### 5.1 The Fundamental Flaw of Sequential Recurrence

Before 2017, natural language processing relied on Recurrent Neural Networks (RNNs) and LSTMs. An RNN processes text like a person reading a book one letter at a time while whispering to themselves to remember what came before. By the time an RNN reaches word 500, the memory of word 1 has degraded into static. Furthermore, because word 10 cannot be computed until word 9 finishes, RNNs could not be parallelized efficiently across thousands of GPU cores.

In 2017, the seminal paper *Attention Is All You Need* (Vaswani et al.) eliminated recurrence entirely and introduced **The Transformer**.

### 5.2 The Filing Cabinet Analogy (Query, Key, Value)

To understand attention, think of a researcher standing in a vast archive of filing cabinets:
1. **The Query ($Q$):** The researcher holds a question in mind: *"What caused the sinking of the Titanic?"*
2. **The Key ($K$):** Every filing cabinet drawer has a label pasted on the outside: *"Glaciers and Icebergs"*, *"Elizabethan Poetry"*, *"North Atlantic Ship Navigation 1912"*.
3. **The Compatibility Check ($Q \cdot K^T$):** The researcher compares her Query with all drawer Keys. The key *"North Atlantic Ship Navigation 1912"* matches with a high score (0.95); *"Elizabethan Poetry"* scores 0.00.
4. **The Softmax Weighting:** The scores are normalized into probabilities that sum to 1.
5. **The Value ($V$):** The researcher opens the drawers, pulls out the actual documents (Values), and blends their contents in proportion to their matching scores.

### 5.3 The Scaled Dot-Product Attention Formula

In a transformer, every token in a sequence generates its own Query vector, Key vector, and Value vector by multiplying its hidden state by learned projection matrices:

$$Q = X W_Q, \quad K = X W_K, \quad V = X W_V$$

The **Scaled Dot-Product Attention** equation coordinates this interaction across all tokens simultaneously:

$$\text{Attention}(Q, K, V) = \text{softmax}\left( \frac{Q K^T}{\sqrt{d_k}} \right) V$$

Why divide by $\sqrt{d_k}$? In high-dimensional spaces (e.g., $d_k = 128$), the dot products $Q K^T$ can grow extremely large in magnitude. Large values push the softmax function into regions with near-zero gradients (saturation), freezing learning. Scaling by $\sqrt{d_k}$ preserves unit variance and ensures healthy gradient flow.

### 5.4 Multi-Head Attention

A single attention calculation only allows a word to look at one thing at a time. But when you read the word *"bank"*, you need to attend to syntax (*is it a noun or verb?*), semantics (*river bank or financial bank?*), and reference (*which bank was mentioned in chapter 2?*).

**Multi-Head Attention** splits queries, keys, and values into $h$ distinct subspaces (e.g., $h = 32$ heads), runs scaled dot-product attention in each head in parallel, concatenates the results, and projects them back:

$$\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \dots, \text{head}_h) W_O$$

---

## 6. The Two Clocks: Pre-Training vs. Autoregressive Inference

One of the most widespread confusions in computing is failing to separate the two clocks of artificial intelligence:

| Dimension | Clock 1: Pre-Training | Clock 2: Autoregressive Inference |
|---|---|---|
| **What is happening?** | Weights $\theta$ are being altered by gradients | Weights $\theta$ are completely frozen (read-only) |
| **Compute requirements** | Thousands of high-end GPUs running for months | A single laptop GPU or mobile chip running in milliseconds |
| **Math performed** | Forward pass + Loss + Backward pass + Adam step | Forward pass only (evaluating next-token probabilities) |
| **User interaction** | None (ingesting trillions of text tokens) | Prompt in $\rightarrow$ stream of generated tokens out |

When you chat with a model, **the model is not learning anything new in its weights**. It is traversing the static geometric landscape that was frozen during pre-training.

### 6.1 The Autoregressive Generation Loop

During generation, the model predicts one token at a time:
1. User provides prompt: `["The", "capital", "of", "France", "is"]`
2. Forward pass outputs probability distribution over all $V$ vocabulary tokens.
3. The token with highest probability (or sampled via temperature) is chosen: `"Paris"`.
4. `"Paris"` is appended to the context.
5. The loop repeats: `["The", "capital", "of", "France", "is", "Paris"]` $\rightarrow$ `"."`.

---

## 7. Quantization Mechanics: Compressing High-Precision Precision into Silicon

### 7.1 The Cargo Ship Analogy

Imagine a cargo ship designed to transport iron weights across the ocean. Each weight is stamped with a precise measurement down to sixteen decimal places (e.g., $3.141592653589793$ kg). This level of precision requires a massive, heavy lead container (a 32-bit floating point number, FP32).

Because the weights are so heavy, your ship can only carry 1 billion of them before sinking (exceeding GPU VRAM).

However, you notice something fascinating: if you round each weight to the nearest integer between $-8$ and $+7$ (a 4-bit integer, INT4), the orchestra still sounds almost indistinguishable! You store one small scaling factor per block of 32 weights, and suddenly your cargo ship can carry **eight times as many weights** in the exact same hull!

### 7.2 The Mathematics of Affine Quantization

A floating-point weight $w \in [\alpha, \beta]$ is mapped to an unsigned $b$-bit integer $q \in [0, 2^b - 1]$ via scale $S$ and zero-point $Z$:

$$q = \text{round}\left( \frac{w}{S} \right) + Z, \quad \text{where } S = \frac{\beta - \alpha}{2^b - 1}, \quad Z = \text{round}\left(-\frac{\alpha}{S}\right)$$

Dequantization reconstructs an approximation $\hat{w} \approx w$ during matrix multiplication:

$$\hat{w} = S \cdot (q - Z)$$

Through modern quantization schemes (such as AWQ, GPTQ, and GGUF), a 7-billion parameter model that originally required 28 gigabytes of VRAM in FP32 can run with pristine conversational fidelity in under 4 gigabytes on consumer hardware.

---

## 8. Sovereign Client Execution: The WebGPU Revolution

### 8.1 Breaking the Cloud Monopoly

For the first decade of modern deep learning, running state-of-the-art models required sending private user data over HTTP to centralized corporate server clusters.

The advent of **WebGPU** transformed the web browser into a high-performance linear algebra execution environment. WebGPU provides a low-overhead, vendor-agnostic interface directly to the local GPU hardware (Apple Metal, Microsoft Direct3D 12, Linux Vulkan) from inside standard web sandboxes.

### 8.2 How EasyLM Runs in the Browser

Through WebAssembly and WebGPU compute shaders, the entire transformer pipeline—matrix multiplications, softmax normalization, RMSNorm, rotary position embeddings (RoPE), and INT4 dequantization—runs directly on your machine's physical silicon.
- Zero server token costs.
- Zero tracking or data leakage.
- Completely offline capability.

---

## 9. The Nature of Hallucination: Probability Valleys Without Anchor Ropes

### 9.1 Why Models Lie So Convincingly

A language model is an autoregressive probability estimator. It does not possess a relational database of factual reality. When a model generates text, it is not "recalling" a memory; it is rolling a ball down the steepest probability contour of human prose.

If you ask: *"When did Thomas Jefferson sign the United Nations Charter?"*
1. The model's weights contain strong associations between "Thomas Jefferson" and "signing historic declarations".
2. The weights contain strong associations between "United Nations Charter" and "diplomatic signatures".
3. The model synthesizes these vectors into a beautifully worded, historically absurd paragraph describing Thomas Jefferson signing the document in San Francisco in 1945.

The prose is fluent because fluency is a local statistical property of language. Factual truth is a global correspondence with external reality. **Fluency is not evidence of truth.**

---

## 10. Parametric Memory vs. Retrieval-Augmented Generation (RAG)

To solve the hallucination problem, modern engineering separates cognitive reasoning from factual storage:

```
+------------------------------------+------------------------------------+
| PARAMETRIC MEMORY (Inside Weights) | EXTERNAL MEMORY (The Stacks / RAG) |
+------------------------------------+------------------------------------+
| • Stored in billions of matrices   | • Stored in verified text & docs   |
| • Lossy, fuzzy compression         | • Exact, verbatim, human-auditable |
| • Expensive to update (retraining) | • Instant update (edit a file)     |
| • Good for syntax, logic, nuance   | • Good for numbers, dates, quotes  |
+------------------------------------+------------------------------------+
```

In **Retrieval-Augmented Generation (RAG)**:
1. The user asks a question: *"What is the half-life of Carbon-14?"*
2. A deterministic search engine queries a verified database (The Stacks, Wikipedia, primary textbooks).
3. The exact authoritative text is injected into the context window:
   `Context: [According to NIST, the half-life of Carbon-14 is 5,730 ± 40 years.]`
4. The frozen model reads the context and summarizes the verified truth without guessing.

---

## 11. Empirical Measurement and Rigorous Evaluation

In scientific engineering, an evaluation must be repeatable, deterministic, and isolated:
- **Perplexity ($PPL$):** The exponentiated cross-entropy loss over a held-out test text. It measures how "surprised" the model is by human writing. Lower is better:
  $$PPL = \exp\left( -\frac{1}{N} \sum_{i=1}^N \log P(t_i \mid t_{<i}) \right)$$
- **MMLU (Massive Multitask Language Understanding):** Multiple-choice academic exams across 57 subjects.
- **GSM8k (Grade School Math):** Multi-step arithmetic and reasoning benchmarks evaluating causal logic chains.
- **Held-Out Generalization:** If a model achieves 99% accuracy on its training data but 40% on unseen test data, it has not learned; it has memorized (overfitting).

---

## 12. Cognitive Alignment and the Limits of Predictive Models

Predicting the next token on the public internet produces a model that mimics internet chaos—including toxic arguments, propaganda, and malware scripts.

To transform a raw base model into a helpful, honest, and harmless assistant, engineers apply:
1. **Instruction Supervised Fine-Tuning (SFT):** Training on curated dialogues of expert demonstrations.
2. **Preference Optimization (RLHF / DPO):** Direct Preference Optimization (Rafailov et al., 2023) mathematically aligns the policy directly to prefer helpful responses without requiring complex reinforcement learning reward models:

$$\mathcal{L}_{\text{DPO}}(\pi_\theta; \pi_{\text{ref}}) = -\mathbb{E}_{(x, y_w, y_l)}\left[ \log \sigma \left( \beta \log \frac{\pi_\theta(y_w \mid x)}{\pi_{\text{ref}}(y_w \mid x)} - \beta \log \frac{\pi_\theta(y_l \mid x)}{\pi_{\text{ref}}(y_l \mid x)} \right) \right]$$

---

## 13. Epistemic Grounding and Trusted Academic Doors

Every scientific fact in this textbook links directly to peer-reviewed foundational literature and authoritative standards:

- **The Transformer Architecture:** Vaswani et al., *Attention Is All You Need* (2017) — [arXiv:1706.03762](https://arxiv.org/abs/1706.03762).
- **Direct Preference Optimization:** Rafailov et al., *Direct Preference Optimization: Your Language Model is Secretly a Reward Model* (2023) — [arXiv:2305.18290](https://arxiv.org/abs/2305.18290).
- **Scaling Laws for Neural Language Models:** Kaplan et al. (2020) — [arXiv:2001.08361](https://arxiv.org/abs/2001.08361).
- **Deep Learning Standard Curriculum:** Goodfellow, Bengio, and Courville, *Deep Learning* (MIT Press, 2016) — [deeplearningbook.org](https://www.deeplearningbook.org/).
- **WebGPU Standard Specification:** World Wide Web Consortium (W3C) — [w3.org/TR/webgpu](https://www.w3.org/TR/webgpu/).
- **PyTorch Mathematical Documentation:** Linux Foundation — [pytorch.org/docs](https://pytorch.org/docs/stable/index.html).
- **MLC-LLM WebLLM Engine Documentation:** MLC AI Consortium — [webllm.mlc.ai](https://webllm.mlc.ai/).
