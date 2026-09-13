export interface HelpSection {
  id: string;
  title: string;
  summary: string;
  content: string;
}

export const EASYLM_HELP_SECTIONS: HelpSection[] = [
  {
    id: 'intro',
    title: '👋 Welcome to EasyLM',
    summary: 'What is EasyLM and how does it work inside your browser?',
    content: `### The Fabric of Local Intelligence

Imagine sitting down to research, write, or study, and the intelligence you interact with isn't beaming in from an airplane hangar of distant corporate servers. Instead, every sentence, every calculation, and every creative spark is computed right here on your own desk—inside the microscopic circuits of your device's graphics card.

That is EasyLM. It brings open-weight language models directly into your web browser using **WebGPU**, a modern browser technology that lets your computer's graphics processor run complex mathematical operations in parallel.

- **Your Device, Your Tokens**: Everything you write and every answer the model generates stays strictly inside your browser's sandbox. Nothing is transmitted to external AI cloud servers.
- **Model Weights in Local Cache**: When you select a model, its neural weights stream once from Hugging Face into your browser's local cache. Once cached, they run locally whenever you visit.
- **Deterministic Hands**: Language models are poets of probability, not calculators. EasyLM equips the model with "Hands"—real, exact calculators, physical unit converters, and clocks that compute real answers rather than guessing.
- **Free Software Forever**: EasyLM is licensed under the **GNU Affero General Public License (AGPL-3.0)**. It is free to use, inspect, and modify. A hosted modified copy owes its users the source. No accounts, no paywalls, and no tracking.`
  },
  {
    id: 'topbar',
    title: '🧭 Top Bar Controls & Status Indicators',
    summary: 'A guided tour of the model menu, status light, Hands toggle, and think mode.',
    content: `### Top Bar Controls at a Glance

The top navigation bar gives you real-time visibility and control over the local neural engine:

1. **Model Selector Button**:
   - Displays the currently selected model (such as *Qwen 2.5 3B*).
   - Clicking it opens the **Model & VRAM Menu**, where you can browse models organized by graphics memory tier (from lightweight 4GB models for phones and laptops up to 16GB–32GB powerhouses), or search Hugging Face for community WebLLM models.
2. **Engine Status Light**:
   - 🔴 **Red ("Not Ready")**: The model has not yet been loaded into graphics memory.
   - 🟢 **Green ("Ready")**: The neural weights are loaded and resident in your GPU VRAM, primed for instant response.
   - ❇️ **Pulsing Green ("Working")**: The model is actively calculating tokens, reasoning, or loading weights.
3. **⚡ Load Model Button**:
   - Next to the model status, click **Load** to pre-warm the model into graphics memory before you start chatting.
4. **⚡ Hands Toggle (Tools)**:
   - Click to turn Hands **ON** or **OFF**.
   - When **ON**: The model can reach out to real arithmetic tools, unit converters, world clocks, and optional web lookups.
   - When **OFF**: The model relies purely on its internal training weights with zero external lookups.
5. **🧠 Think Toggle (Extended Reasoning)**:
   - When **ON**: The model engages step-by-step chain-of-thought analysis before giving its final answer. A collapsible **Thought Drawer** appears above the message so you can watch its internal deductions unfold.
   - When **OFF**: The model delivers direct, concise responses.
6. **👤 Family & Profiles**:
   - Switch between Parent, Student, and Kid Safe profiles, set up a household PIN, or review the sovereign memory vault.
7. **🎭 Voices & Perspectives**:
   - Choose from over 35 distinct philosophical, scientific, and literary voices (from Richard Feynman to Ada Lovelace to Socrates).
8. **⚙ Settings**:
   - Fine-tune sampling temperature, set your context memory limit, or point to a custom search gateway.`
  },
  {
    id: 'hardware',
    title: '🖥️ Hardware Tiers: Matching Model to GPU',
    summary: 'How much VRAM does your device have, and which model is your sweet spot?',
    content: `### Choosing the Right Model for Your Machine

Think of your graphics card's Video RAM (VRAM) like a workbench. A 3-billion parameter model needs about 2.2 gigabytes of bench space to lay out its billions of numbers. If you try to fit an oversized model onto a small bench, your browser tab can run out of memory.

Here is the simple, real-world breakdown:

| GPU / Hardware Tier | Typical Devices | Recommended Models | Why It Fits |
| :--- | :--- | :--- | :--- |
| **4GB (Ultralight)** | Phones, tablets, older laptops, Intel UHD iGPU | **Qwen 2.5 1.5B**, **SmolLM2 1.7B**, **DeepSeek-R1 1.5B** | Tiny footprint (~1.4 GB VRAM). Snappy and impossible to crash. |
| **6GB–8GB (Standard)** | Modern laptops (Intel Iris Xe, Radeon 780M, RTX 3050/4050, Apple M1/M2) | **Qwen 2.5 3B (Default)**, **Llama 3.2 3B**, **Phi-3.5 3.8B** | **The sweet spot.** Qwen 3B is light work on an 8GB card—fast, articulate, and highly capable. |
| **8GB–16GB (High Performance)** | Gaming laptops, desktops with RTX 3060/4060/4070, Apple M Pro | **Gemma 2 9B**, **Qwen 2.5 7B**, **Mistral 7B**, **DeepSeek-R1 7B** | 9B runs comfortably and gives near-frontier nuance without straining the card. |
| **16GB–32GB (Workstation)** | High-end PCs with RTX 3090/4080/4090, Apple M Max/Ultra | **Qwen 2.5 14B**, large context 8B/9B models | Massive context window (8k–16k tokens) with plenty of breathing room. |

*Rule of Thumb: If in doubt, stick with **Qwen 2.5 3B**. It is fast, accurate, and gentle on your battery and fans.*`
  },
  {
    id: 'tools',
    title: '⚡ Built-In Hands (Deterministic Tools)',
    summary: 'Why AI needs hands, and how calculators prevent mathematical fiction.',
    content: `### Why Giving AI "Hands" Matters

When you ask a typical cloud AI to calculate \`sqrt(144) * (50 + 2)\`, it doesn't open a calculator. It predicts which digits *look* like they belong next. Most of the time it gets close; sometimes it invents numbers out of thin air.

EasyLM solves this by giving the model **Hands**—real, software tools running right alongside it:

1. **Exact Calculator (\`calc\`)**: Evaluates arithmetic, square roots, powers, and trigonometry using a deterministic mathematical parser. Zero guesswork.
2. **Physical Unit Converter (\`units\`)**: Converts between metric and imperial units (miles to kilometers, pounds to kilograms, Celsius to Fahrenheit). If you ask for an impossible or unknown conversion, it honestly errors instead of inventing a fake 1:1 ratio.
3. **World Clock (\`datetime\`)**: Checks your real system clock and computes accurate international timezones.
4. **Offline Knowledge Warehouse**: Local undergraduate textbooks by subject, plus official source doors (NIST, OpenStax, MIT OCW, IETF, MDN). Search returns the matching chapter, not a blurb.
5. **Optional Network Tools**: When Hands are on, EasyLM can also look up live weather forecasts, foreign exchange rates, and Wikipedia/Wikiquote entries. In **Kid Safe** mode, all network tools stay permanently off.`
  },
  {
    id: 'hallucination',
    title: '💡 Understanding Predictions & Hallucinations',
    summary: 'How language models work, why they make mistakes, and how to verify answers.',
    content: `### Navigating the World of Language Models

Language models are fundamentally pattern-matching engines. By digesting vast libraries of human writing, they have learned how words weave together into arguments, stories, and explanations.

Because they predict language rather than looking up verified entries in an encyclopedia, two important truths follow:

1. **They can be brilliantly insightful**: They can synthesize concepts across disparate fields, explain quantum mechanics with everyday analogies, or help you draft poetry in classical meter.
2. **They can hallucinate**: If a model doesn't know a specific date or citation, its predictive engine will sometimes craft a plausible-sounding falsehood.

#### How EasyLM Keeps You Grounded:
- **Honest Deflection**: EasyLM's system prompts instruct the model to say: *"I couldn't find a reliable answer for that, and I don't want to guess."*
- **Hands over Guesswork**: Numbers, units, and dates are delegated to deterministic code.
- **Inspectable Traces**: When the model reasons or calls a tool, the exact steps are displayed in expandable drawers directly above the answer.`
  },
  {
    id: 'settings',
    title: '⚙️ Settings, Temperature & Context Limits',
    summary: 'Calibrating creativity, memory length, and custom search endpoints.',
    content: `### Fine-Tuning Your Experience

In the **Settings (⚙)** dialog, you can adjust how the neural engine thinks:

1. **Sampling Temperature (0.0 to 1.0)**:
   - Think of temperature like thermal energy in molecules:
   - **Low Temperature (0.0 to 0.3)**: Molecules move slowly in crystalline order. The model picks only the most statistically probable words. Best for coding, math, and factual research.
   - **Medium Temperature (0.4 to 0.6)**: A natural, balanced conversational flow.
   - **High Temperature (0.7 to 1.0)**: Higher kinetic energy. Words take bolder, more poetic leaps. Best for creative brainstorming, fiction, and thought experiments.
2. **Context Memory Limit (2k, 4k, 8k tokens)**:
   - The context limit determines how many words of conversation history and document text the model keeps active in your graphics card's memory.
   - 4,096 tokens (~3,000 words) is the default sweet spot. If you are analyzing a long document on a beefy GPU, expand to 8,192 tokens.
3. **Custom Web Search Endpoint**:
   - If you run your own private SearXNG instance, enter its URL here. Otherwise, EasyLM uses its built-in serverless gateway.`
  },
  {
    id: 'support',
    title: '💜 Free Software & The AGPL Covenant',
    summary: 'Why EasyLM is free, open, and forever owned by the people who use it.',
    content: `### Digital Sovereignty & Freedom

EasyLM is developed by **humans&ai** around a core conviction: the tools that shape human thought—reading, writing, reasoning, and learning—must never be locked behind proprietary subscription gates.

- **GNU Affero General Public License v3.0**:
  EasyLM is Free Software. You have the right to inspect its code, run it on your own hardware, modify it, and share it. Any derivative work must remain equally free. If you run a modified copy for others over a network, you owe them the source.
- **The Free Forever Covenant**:
  The official EasyLM web application is free forever. Donations only. No company seat on this line. There will never be monthly paywalls, telemetry trackers, or advertising banners.
- **Voluntary Support**:
  If you believe in sovereign local computing and wish to support our work building open browser tools and model ports, voluntary donation links (Bitcoin, Solana, Cash App) are available in the Support menu.`
  }
];

export const EASYLM_GUIDE_PROMPT_CONTEXT = `
[EASYLM ARCHITECTURE & MISSION GUIDE]
You are EasyLM, an open, sovereign local intelligence companion developed by humans&ai.
You run directly on the user's graphics processor (WebGPU) inside this browser tab.
Tokens and conversation history stay strictly in this browser sandbox.

Tone & Demeanor:
- Clear, vivid, and grounded in concrete physical intuition—like Brian Greene explaining the cosmos.
- Avoid sterile corporate jargon and avoid robotic self-descriptions (never call yourself an AI language model trained by a company; you are EasyLM).
- Epistemic Integrity: When you do not know a fact or cannot verify it, say so with warmth and honesty. Never invent citations.

Core Features:
- WebGPU Local Inference: Running Qwen 2.5 3B (default), DeepSeek-R1 (reasoning), or lightweight models.
- Deterministic Hands: Calculator (calc), unit converter (units), world clock (datetime), and local academic library (stacks).
- Honest Boundaries: Optional network tools (weather, search, exchange, dictionary) only send lookups when Hands are enabled.
`;
