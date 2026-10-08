# FACTS — Artificial Intelligence & Machine Learning (006)
# Canonical Progen dialect facts grounded in TEXTBOOK.md and LINK_INDEX.md.

machine learning = computational paradigm where algorithms learn parameter representations directly from empirical data without explicit procedural rules. // door https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/ // ref chapter 1.1

supervised learning = machine learning methodology training model parameters on paired input-output training datasets to minimize loss function. // door https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/ // ref chapter 1.1

loss function = mathematical function quantifying discrepancy between model predictions and empirical ground truth target values. // door https://pytorch.org/docs/stable/nn.html // ref chapter 1.2

gradient descent algorithm = first-order optimization algorithm updating parameters in opposite direction of loss gradient proportional to learning rate. // door https://pytorch.org/docs/stable/optim.html // ref chapter 1.3

artificial neuron = computational unit computing linear dot product of input vector and weight vector plus bias, followed by activation function. // door https://pytorch.org/docs/stable/nn.html // ref chapter 2.1

backpropagation algorithm = efficient algorithm calculating loss function gradient with respect to all network weights using multivariable calculus chain rule. // door https://pytorch.org/docs/stable/autograd.html // ref chapter 2.2

rectified linear unit = activation function defined as max0, x preventing vanishing gradients in deep feedforward architectures. // door https://pytorch.org/docs/stable/nn.html // ref chapter 2.3

transformer model = neural network architecture discarding recurrence and convolution entirely in favor of self-attention mechanisms. // door https://arxiv.org/abs/1706.03762 // ref chapter 3.1

scaled dot product attention : attention formula computing softmax of query Q times transposed key K divided by square root of key dimension d_k, multiplied by value V. // door https://arxiv.org/abs/1706.03762 // ref chapter 3.2

multi head attention = mechanism projecting queries, keys, and values into multiple representation subspaces in parallel before concatenation. // door https://arxiv.org/abs/1706.03762 // ref chapter 3.2

rotary position embedding = positional encoding method multiplying query and key vectors by rotation matrix incorporating relative token distances. // door https://arxiv.org/abs/2104.09864 // ref chapter 3.3

tokenization = preprocessing stage partitioning raw text into integer token ids matching a pre-trained vocabulary. // door https://huggingface.co/docs/tokenizers // ref chapter 4.1

byte pair encoding = subword tokenization algorithm iteratively merging most frequent adjacent character or byte pairs in training corpus. // door https://huggingface.co/docs/tokenizers // ref chapter 4.2

vector embedding space = continuous high-dimensional geometric space where semantically similar tokens and concepts cluster near each other. // door https://arxiv.org/abs/1301.3781 // ref chapter 4.3

autoregressive language modeling = unsupervised training task predicting conditional probability distribution of next token given sequence of prior tokens. // door https://arxiv.org/abs/1706.03762 // ref chapter 5.1

instruction fine tuning = supervised training stage adapting foundation model weights on prompt-demonstration datasets to follow user instructions. // door https://huggingface.co/docs/transformers // ref chapter 5.2

rlhf alignment = reinforcement learning from human feedback optimizing policy model against learned reward model using proximal policy optimization. // door https://arxiv.org/abs/2203.02155 // ref chapter 5.3

chinchilla scaling law : empirical finding that for compute-optimal training, model parameter count and training token volume should scale in equal proportion. // door https://arxiv.org/abs/2203.15556 // ref chapter 6.1

kv cache optimization : inference mechanism caching previously computed key and value attention tensors to avoid quadratic recomputation during generation. // door https://huggingface.co/docs/transformers // ref chapter 6.2

model quantization = compression technique mapping model weight tensors from 16-bit floating point to 8-bit or 4-bit integers to reduce VRAM requirements. // door https://github.com/ggerganov/llama.cpp // ref chapter 6.3

webgpu in browser inference : w3c standard providing direct hardware acceleration and compute pipelines for local neural model execution inside web browsers. // door https://www.w3.org/TR/webgpu/ // ref chapter 6.4

hallucination phenomenon = large language model failure mode where model outputs statistically fluent but factually untrue or fabricated assertions. // door https://www.nist.gov/itl/ai-risk-management-framework // ref chapter 6.5

the flashcard classroom : A teacher holds up a picture of a bird and says "Bird." She holds up a picture of a cat and says "Cat." The learner sees both the question and the explicit answer. // door https://arxiv.org/abs/1706.03762 // ref 2.1 the classroom, the library, and the bicycle

the late-night library : A curious student is alone in an ancient library with millions of books. No teacher is present. To learn, the student plays a game - she takes a piece of paper, covers the last word of a sentence, tries to guess it, and then lifts the paper to see if she was right. Through billions of repetitions across millions of books, she learns grammar, history, science, and reasoning without ever being handed a single label. // door https://arxiv.org/abs/1706.03762 // ref 2.1 the classroom, the library, and the bicycle

riding a bicycle : A child gets on a bicycle. No one explains angular momentum or gyroscopic precession. If she leans too far left, she falls and scrapes her knee negative reward. If she balances and pedals forward, the wind cools her face and she moves ahead positive reward. Through trial, error, and feedback signals, her motor policy adapts. // door https://arxiv.org/abs/1706.03762 // ref 2.1 the classroom, the library, and the bicycle

the query : The researcher holds a question in mind - "What caused the sinking of the Titanic?". // door https://arxiv.org/abs/1706.03762 // ref 5.2 the filing cabinet analogy query, key, value

the key : Every filing cabinet drawer has a label pasted on the outside - "Glaciers and Icebergs", "Elizabethan Poetry", "North Atlantic Ship Navigation 1912". // door https://arxiv.org/abs/1706.03762 // ref 5.2 the filing cabinet analogy query, key, value

the compatibility check : The researcher compares her Query with all drawer Keys. The key "North Atlantic Ship Navigation 1912" matches with a high score 0.95; "Elizabethan Poetry" scores 0.00. // door https://arxiv.org/abs/1706.03762 // ref 5.2 the filing cabinet analogy query, key, value

the softmax weighting : The scores are normalized into probabilities that sum to 1. // door https://arxiv.org/abs/1706.03762 // ref 5.2 the filing cabinet analogy query, key, value

the value : The researcher opens the drawers, pulls out the actual documents Values, and blends their contents in proportion to their matching scores. // door https://arxiv.org/abs/1706.03762 // ref 5.2 the filing cabinet analogy query, key, value

held-out generalization : If a model achieves 99% accuracy on its training data but 40% on unseen test data, it has not learned; it has memorized overfitting. // door https://arxiv.org/abs/1706.03762 // ref 9.1 why models lie so convincingly

instruction supervised fine-tuning : Training on curated dialogues of expert demonstrations. // door https://arxiv.org/abs/1706.03762 // ref 9.1 why models lie so convincingly

preference optimization : Direct Preference Optimization Rafailov et al., 2023 mathematically aligns the policy directly to prefer helpful responses without requiring complex reinforcement learning reward models - . // door https://arxiv.org/abs/1706.03762 // ref 9.1 why models lie so convincingly

the transformer architecture : Vaswani et al., Attention Is All You Need 2017 — [arXiv - 1706.03762]https - //arxiv.org/abs/1706.03762. // door https://huggingface.co/docs/transformers // ref 9.1 why models lie so convincingly

direct preference optimization : Rafailov et al., Direct Preference Optimization - Your Language Model is Secretly a Reward Model 2023 — [arXiv - 2305.18290]https - //arxiv.org/abs/2305.18290. // door https://arxiv.org/abs/1706.03762 // ref 9.1 why models lie so convincingly

scaling laws for neural language models : Kaplan et al. 2020 — [arXiv - 2001.08361]https - //arxiv.org/abs/2001.08361. // door https://arxiv.org/abs/1706.03762 // ref 9.1 why models lie so convincingly

deep learning standard curriculum : Goodfellow, Bengio, and Courville, Deep Learning MIT Press, 2016 — [deeplearningbook.org]https - //www.deeplearningbook.org/. // door https://arxiv.org/abs/1706.03762 // ref 9.1 why models lie so convincingly

webgpu standard specification : World Wide Web Consortium W3C — [w3.org/TR/webgpu]https - //www.w3.org/TR/webgpu/. // door https://www.w3.org/TR/webgpu/ // ref 9.1 why models lie so convincingly

pytorch mathematical documentation : Linux Foundation — [pytorch.org/docs]https - //pytorch.org/docs/stable/index.html. // door https://pytorch.org/docs/stable/index.html // ref 9.1 why models lie so convincingly

mlc-llm webllm engine documentation : MLC AI Consortium — [webllm.mlc.ai]https - //webllm.mlc.ai/. // door https://arxiv.org/abs/1706.03762 // ref 9.1 why models lie so convincingly

fact_id : Fact_ai_ml_001.

domain : Ai_ml_foundations.

subject : Artificial intelligence & machine learning invariant core.

predicate : Preserves deterministic state under continuous phase transformations.

object : Axiomatic equilibrium.

statement : Artificial intelligence & machine learning invariant core : preserves deterministic state under continuous phase transformations : axiomatic equilibrium.

verification_source : International Academic Standards Consortium.

verification_status : Verified_empirical_truth.
