---
title: "ai_ml — undergrad textbook"
date: "2026-09-13"
home: "warehouse/ai_ml/"
related:
  - "../computing/"
  - "../software/"
  - "../math/"
  - "../methods/"
  - "EasyLM calc and units hands"
  - "warehouse/LAW.md"
---

# ai_ml — undergrad textbook

a working book for people who must **say what a model is doing, what it is not, and how to check it**.  
this file teaches. paper numbers, BLEU, bit-widths, API scores → fetch the named door / call **calc**. the model does not invent the constant. the model does not invent a parameter count.

**law this book applies:** a model is a function that approximates data. fluent text is not a lookup. training is not inference. weights are not a document store. eval is a named test, not a vibe. Hands: **calc** and **units** do arithmetic. warehouse returns the chapter.

EasyLM runs a local language model in the browser (WebGPU). that is a **pattern** this book names. it is not a reason to worship a vendor.

---

## 0. how to use this book

read chapter 1, then the chapter the job needs.

| you need | chapter |
|---|---|
| what a model is | 1 |
| supervised vs self-supervised | 2 |
| tokens and embeddings | 3 |
| neural nets and backprop | 4 |
| transformers and attention | 5 |
| training vs inference | 6 |
| quantization / GGUF | 7 |
| local vs API inference | 8 |
| hallucination | 9 |
| RAG vs weights | 10 |
| eval | 11 |
| WebGPU / browser inference | 12 |
| stuck on a claim | 13 |

work order: **why → what → how**. name the function and the data before you name the product.

computing pack owns machines and languages. software pack owns spec, git, HTTP, tests. this pack owns **learned functions and their limits**.

---

## 1. what a model is

**definition.** in this book a **model** is a function `f` with parameters `θ` that maps an input `x` to an output `ŷ`, chosen so that `ŷ` is close to some target on a data distribution. closeness is a **loss**. the parameters are numbers. they are not thoughts.

```
ŷ = f(x; θ)
```

examples of `f`:

| name | x | ŷ |
|---|---|---|
| linear regression | vector of features | a real number |
| classifier | image or vector | a label, or a distribution over labels |
| language model | a sequence of tokens | a distribution over the **next** token |

**approximation, not identity.** the function fits the data it was trained on, in the sense of the loss. it does not contain a table of the world. if the data never showed a fact, the weights do not “store” that fact as a row you can SELECT. they may still emit a fluent sentence that looks like the fact. that sentence is chapter 9.

**two clocks.** `θ` is found once (training, chapter 6) and then used many times (inference). confusing the two clocks is how people ask a chat model to “learn this PDF” by pasting it into the prompt and then think the weights changed.

**law.** say the type of `x` and `ŷ` before you say the brand. if you cannot write `f: X → Y`, you are talking about a product, not a model.

**check.** pick a system in front of you. write one line: “input is ___, output is ___, parameters were fit by ___.” if the output is “answers,” tighten it: next-token distribution, class label, scalar, action. if you cannot name the loss, you cannot name the job.

---

## 2. supervised vs self-supervised

**definition.** **supervised** learning fits `θ` on pairs `(x, y)` where `y` was provided by a human or an external process (label, translation, rating). **self-supervised** learning builds the pair from the input itself: hide part of `x`, predict the hidden part. **unsupervised** (in the old clustering sense) has no `y`; this book will say clustering or density when it means that, and not use “unsupervised” as a synonym for language-model pretraining.

| regime | where `y` comes from | typical loss |
|---|---|---|
| supervised | labels | cross-entropy vs the label, squared error vs a number |
| self-supervised | a held-out piece of `x` | cross-entropy vs the missing token / patch / frame |
| reinforcement from feedback | a score or preference after acting | a policy gradient or preference loss; fetch the paper if you will cite an algorithm |

modern language models are usually **self-supervised** on raw text (predict the next token, or a masked token), then optionally **supervised** on instruction pairs, then optionally adjusted with preference data. those are three different datasets and three different losses. collapsing them into “the AI learned” hides which clock you are on.

**law.** the name of the regime is the name of the **source of y**. if nobody wrote `y`, and you built `y` by masking, it is self-supervised. if a rater wrote `y`, it is supervised. do not call next-token prediction “supervised” just because a loss exists.

**worked check.**

corpus: `the cat sat on the mat`

self-supervised next-token example:

- x = `the cat sat on the`
- y = `mat`

supervised translation example:

- x = `the cat sat on the mat`
- y = `le chat était assis sur le tapis`

same string can appear in both regimes. the regime is the pairing, not the string.

**check.** for a training run, name the file that contains `y`. if there is no such file and the code just shifts tokens by one, you are in self-supervised next-token land.

---

## 3. tokens and embeddings

**definition.** a **token** is an atomic symbol in the model’s alphabet: a word, a subword, a byte, a character, depending on the tokenizer. a language model does not read “letters” or “ideas.” it reads a sequence of token ids `t1, t2, …, tn` from a finite vocabulary of size `V`.

an **embedding** is a vector associated with a token (or with a position, or with a patch of an image). the embedding table is a matrix `E` of shape `V × d`. token id `t` becomes row `E[t]`, a vector in `R^d`. from then on the network only sees vectors.

**tokenisation is a choice.** Byte Pair Encoding and similar merges build a vocabulary from data. different models, different vocabularies, different token counts for the same sentence. **do not quote a token count you did not run a tokenizer on.** if you need a count, run the tokenizer from the model card, or DONT_KNOW.

**context length** is the maximum `n` the trained architecture will accept in one forward pass (plus any cache tricks). it is not “memory of the user.” tokens that fall off the left of the window are gone from that pass.

**law.**

- count **tokens**, not words, when you talk about context or price. word/token ratio is not a constant; do not invent 0.75.
- embeddings are **coordinates**, not meanings you can read. cosine similarity of two embedding vectors is a geometric fact; “these words mean the same” is an interpretation you still have to check on a task.
- the same word can be many tokens (`un`, `##happy`) or one. do not debug a model by staring at English.

**worked check.**

sentence: `JSON`

depending on the tokenizer this might be one token or `J` `SON` or something else. the check is: run the tokenizer, print the ids. warehouse does not guess the ids of a named model.

**check.** if a prompt “doesn’t fit,” measure token length with the **same** tokenizer the model uses. comparing GPT-tokenizer length to a different local tokenizer is a unit error — **units** would refuse to add metres to seconds; you should refuse this too.

---

## 4. neural nets and backprop

**definition.** a **neural net** is a composition of simple maps, each with parameters, stacked so the whole thing is still a map `f(x; θ)`. the common brick is an affine map plus a non-linearity:

```
h = σ(W x + b)
```

`W` is a matrix, `b` a vector, `σ` a function applied elementwise (ReLU, GELU, tanh, …). a **layer** is one such brick, or a named bundle of them (attention + feed-forward in chapter 5).

a **deep** net is many layers. depth is not magic; it is composition. without non-linearities, stacked affine maps collapse to one affine map. the non-linearity is why stacking does anything.

**loss.** you need a scalar `L(ŷ, y)` that is small when the prediction is good. classification and language models often use **cross-entropy** between the predicted discrete distribution and the target token or class. regression often uses squared error. pick one; write it; do not mix.

**backpropagation** is the chain rule on that scalar. if `L` depends on `θ` through a graph of differentiable ops, you compute `∂L/∂θ` from the output backward to each parameter. gradient descent (or Adam, etc.) then steps `θ` in the direction that reduces `L` on the current batch.

```
θ ← θ − η ∇_θ L
```

`η` is the learning rate. it is a hyperparameter, not a law of nature. a number you did not read from the run config is DONT_KNOW.

**undergrad facts you actually need:**

1. the forward pass computes `ŷ` and `L`.
2. the backward pass computes gradients for every `θ` that has `requires_grad`.
3. a **batch** is a stack of examples so the gradient is an average (or sum — know which).
4. **overfitting** is a small `L` on train and a large `L` on held-out data. the held-out set is the check. there is no other check.
5. vanishing and exploding gradients are what happen when the product of many Jacobians shrinks to 0 or blows up. residual connections (chapter 5) are one engineering answer.

**law.** if you cannot write the loss, you cannot train. if you cannot hold out data, you cannot claim generalisation. training accuracy alone is not a result.

**worked check.** linear model `ŷ = w x`, loss `L = (ŷ − y)²`, one example `x=2, y=1, w=0`.

forward: `ŷ = 0`, `L = 1`.  
`∂L/∂w = 2(ŷ − y) x = 2(0 − 1)(2) = −4`.  
one step `η = 0.1`: `w ← 0 − 0.1(−4) = 0.4`.  
new `ŷ = 0.8`, `L = 0.04`. loss fell. **calc** does the arithmetic; do not do it in your head in production.

**check.** name `L`, name one parameter, say whether you have a held-out set. if the answer is “we looked at the chat and it seemed smart,” you are in chapter 11’s failure mode.

PyTorch’s autodiff is documented at https://pytorch.org/docs/stable/index.html — fetch that API if you will cite a function name. this book will not invent an API.

---

## 5. transformers and scaled dot-product attention

door for this chapter’s formulas and the original numbers: Vaswani et al., *Attention Is All You Need*, arXiv:1706.03762, https://arxiv.org/abs/1706.03762 (v7, 2 Aug 2023 HTML: https://arxiv.org/html/1706.03762). fetch the paper when a constant from it is load-bearing. do not quote later models’ sizes from memory.

### 5.1 the job

sequence models before this paper often used recurrence (RNNs) or convolution. recurrence walks the sequence in time; that limits parallelisation inside one example. the Transformer **dispenses with recurrence and convolution** for the core computation and uses **attention** instead (abstract of 1706.03762).

encoder–decoder shape in the paper: the encoder maps `(x1, …, xn)` to continuous `z`; the decoder emits `(y1, …, ym)` one token at a time, **autoregressive** — each step consumes previously generated symbols.

### 5.2 attention, in words then formula

**definition (paper §3.2).** an attention function maps a **query** and a set of **key–value** pairs to an output. query, keys, values, and output are vectors. the output is a **weighted sum of the values**. the weight on each value comes from a compatibility of the query with the matching key.

**scaled dot-product attention** (paper eq. 1). queries and keys have dimension `d_k`, values `d_v`. pack queries into matrix `Q`, keys `K`, values `V`:

```
Attention(Q, K, V) = softmax( Q K^T / √d_k ) V
```

why divide by `√d_k`? the paper’s note: if components of `q` and `k` are independent, mean 0, variance 1, then `q·k` has variance `d_k`. large `d_k` → large dots → softmax saturates → tiny gradients. scaling is an engineering fix with a stated reason, not a mystic constant.

**self-attention** means Q, K, V all come from the same sequence (linear projections of it). **cross-attention** (decoder) means Q from the decoder sequence, K and V from the encoder.

**masking.** the decoder self-attention is masked so position `i` cannot attend to positions `> i`. combined with shifting outputs by one, this keeps the model causal: it does not peek at the future token it is supposed to predict.

### 5.3 multi-head, stacks (the 2017 model as an example)

**multi-head** (paper §3.2.2): project Q, K, V `h` times with learned matrices, run attention in parallel, concatenate, project again:

```
head_i = Attention(Q W_i^Q, K W_i^K, V W_i^V)
MultiHead(Q, K, V) = Concat(head_1, …, head_h) W^O
```

the paper’s **particular** encoder/decoder used `N = 6` layers, `d_model = 512`. those numbers describe **that** experiment, not every transformer. later language models change depth, width, head count, positional encoding, and whether they keep a decoder. **do not invent a parameter count for a named model.** read the model card or the paper.

each sub-layer in the paper is wrapped as `LayerNorm(x + Sublayer(x))` (residual + layer norm). the residual is why gradients have a path that does not multiply through every non-linearity.

**positional encoding.** attention has no built-in sense of order. the paper adds position information to embeddings. later work uses other schemes (rotary, relative). if you need which scheme a **specific** local model uses, fetch its card. DONT_KNOW is legal.

### 5.4 what the abstract actually measured

the 2017 paper reports **28.4 BLEU** on WMT 2014 English-to-German and **41.8 BLEU** on WMT 2014 English-to-French for **their** model, trained 3.5 days on eight GPUs for the French figure. those are **that paper’s** numbers on **those** tasks. they are not a quality score for a chat model you are running locally. if you need a current score, run an eval (chapter 11) or fetch a named leaderboard’s method. do not recycle 28.4 as a personality trait.

**law.** write the formula before the brand. if you cannot expand `Q K^T`, you are not yet talking about attention; you are talking about a product screenshot.

**check.** for a single head, with toy `d_k = 2`, compute `Q K^T`, divide by `√2`, softmax a row, multiply by `V`. **calc** does the arithmetic. if softmax rows do not sum to 1, you did not softmax. fetch eq. 1 of 1706.03762 if your notes disagree with this page.

---

## 6. training vs inference

**definition.**

| clock | is | what moves |
|---|---|---|
| **training** | fit `θ` to data by reducing loss | weights, optimiser state, maybe a schedule |
| **inference** | compute `ŷ = f(x; θ)` with `θ` frozen | activations, KV cache, sampler state — not the file of weights, unless you are finetuning |

**training** needs: data, a loss, gradients, a lot of memory (activations + gradients + optimiser). **inference** needs: weights (or a quantized copy), a forward pass, and for autoregressive text a **loop**: sample or argmax a token, append it, run again.

**sampling** is not training. temperature, top-k, top-p change the **draw** from the next-token distribution. they do not change `θ`. temperature 0 (greedy) is still inference.

**KV cache.** in causal self-attention, keys and values for past tokens can be stored so you do not recompute them every step. that is an inference optimisation. it is not extra knowledge.

**law.** pasting text into a prompt does not train. saving a chat log does not train. **finetuning** is training: it writes new weights. **LoRA** and friends write a small extra tensor; still training. if the weight file’s bytes did not change, you did not train.

**worked check.**

you load a GGUF, you chat, you close the tab. the GGUF on disk is the same size and hash. inference happened. training did not.

you run a trainer, loss falls on the train set, you write a new file. training happened. whether it **generalised** is a held-out question (chapter 4, chapter 11).

**check.** ask: “which file of numbers changed?” if none, it was inference (or you only changed the prompt).

---

## 7. quantization and GGUF (idea level)

**definition.** **quantization** stores weights (and sometimes activations) in **fewer bits** than the training format (often 16- or 32-bit floats). the function `f` is the same shape; the numbers are coarser. the point is smaller files and faster inference on hardware that likes integers, at some quality cost you **must measure**, not assume.

**GGUF** is a **binary file format** for weights plus metadata, designed for fast load and for executors in the GGML family (llama.cpp and relatives). Hugging Face Hub documents it: https://huggingface.co/docs/hub/en/gguf — GGUF encodes **tensors and a standardized set of metadata**, unlike tensor-only formats such as safetensors. the format was developed with llama.cpp (https://github.com/ggerganov/llama.cpp). models trained in PyTorch can be **converted** to GGUF; conversion is not training.

Hugging Face’s GGUF page lists type names (F32, F16, BF16, Q8_K, Q4_K, …) and, for the K-quants, **block** structure and bits-per-weight formulas. if you need a bits-per-weight number, **fetch that table**. this book will not invent a compression ratio.

idea-level picture:

| you have | you get |
|---|---|
| full-precision (or fp16) weights | larger file, closer to the training numbers |
| 8-bit / 4-bit quantized | smaller file, faster load, some error in each matmul |
| GGUF | one file: tensors + metadata, meant for local executors |

**law.**

- quantization is a **lossy codec for numbers**, not a new architecture.
- a `Q4` file is not “the same model” in bits; it is a related function. eval it (chapter 11) if the claim is “quality is unchanged.”
- do not quote a parameter count from a filename. `7B` in a name is marketing unless the card shows the config. if the card is missing, DONT_KNOW.

**check.** after converting, run the **same** prompts and a **named** eval as the source, or refuse the quality claim. file size going down is not a quality metric. **calc** can divide bytes by bytes; it cannot tell you the model got smarter.

---

## 8. local vs API inference

**definition.**

| mode | where `f` runs | what leaves the machine |
|---|---|---|
| **local** | your process, your GPU/CPU/NPU, or your browser WebGPU | nothing, unless you also call a tool/network |
| **API** | someone else’s process | the prompt, and usually the completion, under their policy |

both modes can be the **same kind of model** (transformer, next-token). the difference is **custody** of weights, data, and clock.

**local.** you load weights (GGUF, safetensors, ONNX, …). you pay in disk, RAM/VRAM, and watts. you can run offline. you see the file. you are responsible for the licence of those weights.

**API.** you send HTTP (software pack, RFC 9110) with a JSON body (RFC 8259). you pay in tokens and trust. you do not have `θ`. you cannot inspect the layer count. you **must not invent** it.

**law.**

- do not mix the two in a sentence as if they were one computer. “the model said” is ambiguous. “the local GGUF on this GPU said” / “the remote API said” is a fact.
- a local model does not become an API by having a REST wrapper. the wrapper is software. the weights are still local if they never left.
- an API does not become local because the SDK is `pip install`ed. the bytes of `θ` are still on their side.

EasyLM’s pattern is **local inference in the browser** (chapter 12) plus optional **hands** (calc, units, warehouse, fetch) that you can refuse. the chat tokens stay on the device unless a hand sends a lookup. that is a custody fact, not a slogan.

**check.** unplug the network. if chat still produces tokens, inference is local (or cached). if it dies, you were on an API (or a local app that still phones home — then read the traffic; do not guess).

---

## 9. hallucination = fluent next-token, not lookup

**definition.** a language model samples from `P(t_{n+1} | t_1, …, t_n; θ)`. a **hallucination** in this book is a completion that is **fluent and locally coherent** and **does not correspond to a checked fact**. it is not a database miss. it is not a moral failing of a person. it is the generator doing the only job it was trained to do: continue the token sequence.

the model does not look up a row and then lie about it. there is no row. there is a distribution. high probability under `θ` means “looks like the training text,” not “is true.”

**why it sounds sure.** training text contains confident sentences. the continuation of a confident prefix is often more confident tokens. calibration is a separate eval. fluency is not calibration.

**law.**

- do not treat a citation the model **typed** as a fetch. if the job needs a door, **fetch the door** (warehouse law).
- if the warehouse miss is empty, say so. do not fill with a fluent paragraph.
- numbers: **calc**. units: **units**. statutes, RFCs, papers: fetch. the model’s memory of `√d_k` is not the paper.
- “I don’t know” is a legal output. inventing a DOI is not.

**worked check.**

ask a model for the BLEU score of a paper you have not fetched. a fluent “27.3 BLEU” is a hallucination **until** you open https://arxiv.org/abs/1706.03762 and read 28.4 / 41.8 for the tasks **that paper** names. the digit 27.3 being plausible is the trap.

**check.** every load-bearing number, name, and URL in an answer either (a) came from a fetched door this session, (b) came from this textbook as already-cited, or (c) is marked DONT_KNOW. fluent is not (a).

---

## 10. RAG vs weights

**definition.** **weights** are `θ`. they change when you train. **RAG** (retrieval-augmented generation) means: at inference time, **retrieve** documents from a store you control, put (parts of) them into the prompt, then generate. the generator still only predicts tokens. the store is ordinary software (files, SQLite, an index).

| | weights | RAG store |
|---|---|---|
| what it is | parameters of `f` | documents / rows / chunks |
| how it updates | training / finetune | insert, delete, reindex |
| how you cite | you generally cannot point at a row | you can point at the retrieved chunk |
| failure | fluent invention | miss, stale chunk, wrong chunk, then fluent invention on top |

**law.** RAG does not “put the PDF into the model.” it puts **bytes into the context window**. if the retriever missed, the model never saw the paragraph. if the window truncated, the model never saw the end. if the chunk is wrong, the model will fluently use the wrong chunk.

**when weights, when RAG.**

- stable skill (syntax, style, a language): weights.
- facts that change, or that must be cited: a store + retrieve + generate, and **show the chunk**.
- secrets: neither. secrets are chapter 10 of the software pack. do not embed an API token in a vector index.

**hybrid errors.** a system can retrieve the right paragraph and still emit a wrong number because the generator paraphrased. the check is: quote the span, or compute with **calc** from the span, or fail closed.

**worked check.**

warehouse lookup for “RFC 8259 encoding”:

1. retrieve `warehouse/software/TEXTBOOK.md` chapter 6 (or the RFC).
2. generate **from that text**.
3. if retrieve returns empty → say empty. do not invent UTF-16.

that is RAG with a local library. EasyLM’s warehouse hand is this pattern. it is not a second brain.

**check.** turn retrieval off. if the answer stays the same and the fact was supposed to come from your files, you were not using the files. you were sampling weights.

---

## 11. eval (do not invent scores)

**definition.** an **eval** is a named procedure that maps a system to a **number or a pass/fail**, with a fixed dataset, a scorer, and a report of what was held out. “it seemed good” is not an eval. a leaderboard screenshot without the method is not an eval.

methods pack owns experimental design. this chapter owns the ML-specific traps.

**traps.**

| trap | what it is | what to do |
|---|---|---|
| train/test leak | the eval set was in training | hold out by **document**, not by random line |
| prompt overfitting | you tuned the prompt on the test items | freeze the prompt, new items |
| n = 3 anecdotes | three chats | not a score; call it a demo |
| citing 28.4 BLEU for a chat model | wrong task, wrong system | fetch the paper that matches **this** system |
| inventing MMLU | a number from memory | DONT_KNOW; run or fetch the official report |
| human preference without a protocol | “we liked B” | say so; do not write 72.4% |

**what you can say without a number.**

- the model is local / API (chapter 8)
- the file format is GGUF / other (chapter 7)
- it produced this token sequence on this prompt (log it)
- the warehouse hit / miss
- a unit test of a **hand** (calc: `2+2` is 4) — that evals the hand, not the LM

**what you cannot say without an eval.** “better than GPT-x,” “95% accurate,” “no hallucinations,” “human-level.” those are claims. claims need a method.

**law.** if you did not run the eval and you did not fetch a report that ran it on **this** system, you do not have a score. DONT_KNOW. do not round a memory of a blog into a digit.

**check.** before you type a percentage, name the dataset, the split, the scorer, and the URL or the command you ran. missing any one → delete the percentage.

---

## 12. WebGPU and browser inference

doors: https://www.w3.org/TR/webgpu/ (W3C Candidate Recommendation Draft; this book fetched the 1 September 2026 TR) · MDN WebGPU as a programmer’s door when you need API shapes.

**definition.** **WebGPU** is a web API that exposes GPU **rendering and computation** to a page. the spec’s own abstract: it exposes an API for operations such as rendering and computation on a GPU. it is not WebGL and does not target OpenGL ES.

objects the spec names in its introduction:

| object | job |
|---|---|
| `GPUAdapter` | a view of physical GPU hardware |
| `GPUDevice` | connection that manages resources |
| `GPUQueue` | executes commands |
| `GPUBuffer` / `GPUTexture` | GPU memory |
| `GPUComputePipeline` / `GPURenderPipeline` | the programmable pipeline |
| `GPUShaderModule` | shader code |

**browser inference** means: the **forward pass of `f`** runs in this page, on this device’s GPU (or a software fallback if the implementation provides one), with weights the page loaded. the next-token loop is JavaScript (or WASM) plus compute shaders. the prompt does not have to go to a server for that loop to run.

EasyLM uses this pattern: a local language model in the browser, WebGPU when available, chat tokens on the user device, optional hands for lookup. that is **local inference** (chapter 8) with the browser as the host. it is the same mathematical `f` as a desktop executor; the runtime is the page.

**why it matters.**

- **custody:** weights and tokens can stay on the device.
- **limits:** VRAM/RAM, download size of weights, browser support, thermal throttling. these are engineering constraints (software pack), not model theory.
- **quantization** (chapter 7) is how large `θ` becomes small enough to fetch and fit.
- **hands** (calc, units, warehouse, HTTP fetch) are ordinary functions. they are not “the model thinking.” they are tools with specs and tests.

**law.** WebGPU does not make the generator truthful. it only moves the matmuls. hallucination, RAG, and eval chapters still apply. a page that infers locally and then silently POSTs the chat to a server is an API in local clothing — read the network panel.

**security note from the spec (non-normative section, but the rule is the point):** the web’s security requirements are non-negotiable; implementations validate commands before they reach the GPU. do not treat a compute shader as a place to hide a secret. secrets still do not go in git (software chapter 10) and do not go in a public bundle.

**check.** in the browser debugger: if you see GPU memory and a weight download from a blob/cache, and no completion POST to a model host, inference is in-page. if completions appear only after a request to a remote `/v1/chat/completions`, you are on an API. look; do not assume.

---

## 13. stuck on a claim

work this list. do not start at “try another model.”

1. **name `f`.** input, output, where `θ` lives (file vs API).
2. **name the clock.** training or inference.
3. **name the data.** what would a retrieved chunk say? did you retrieve?
4. **numbers** → **calc**. **units** → **units**. papers → arXiv abs page then PDF. protocols → RFC.
5. **scores** → chapter 11. no method, no digit.
6. **parameter counts, BLEU, bits-per-weight** → fetch the card, the paper, or the GGUF table. else DONT_KNOW.
7. if this textbook and an official page disagree → DONT_KNOW, fetch, then fix the book.

**done** means: the function is named, the clock is named, load-bearing numbers have doors, and a miss is a miss.

---

## 14. what this book will not do

it will not invent a parameter count. it will not recycle 2017 BLEU as a chat score. it will not treat a vendor blog as arXiv:1706.03762. it will not call next-token fluency a database. it will not hide an API behind the word “local.”

when the job is a formula from a paper, fetch the paper. when the job is an API, fetch the framework docs. when the job is a file format, fetch GGUF / llama.cpp. when the job is in-browser GPU, fetch WebGPU. when the job is a number, **calc**.

doors for this pack: `LINK_INDEX.md` in this directory.
)
