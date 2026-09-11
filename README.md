# EasyLM (⚡)

**Free, private, zero-install local intelligence for your browser.**  
*Powered by WebGPU · Streaming weights from Hugging Face · 100% Client-Side Compute*

[![Deploy with Vercel](https://vercel.com/button)](https://easylm.vercel.app)

---

## What is EasyLM?

`EasyLM` is a direct consumer alternative to ChatGPT and Claude that runs **100% locally on your own machine** via WebGPU.

- **Zero Install / Zero Account:** No accounts, no subscriptions, no API keys, and no software installation. Just visit the URL.
- **100% Private:** Model weights stream from Hugging Face directly into your browser's `IndexedDB`. All prompt processing and token generation run entirely inside your GPU/VRAM. No server ever sees your messages.
- **In-App Hands (Tools):** Built-in deterministic math calculator, unit converter, real-time clock, public web search, and knowledge base search.
- **Extended Thinking:** Support for deep chain-of-thought reasoning with collapsible thought trace drawers.
- **Local Disk Backup:** Your chat sessions stay in browser storage by default, with a one-click `[Backup to Disk]` button to download your chat history as a JSON file.
- **HNAI Design Standards:** Deep dark mode (`#000000` ground, Ina violet `#8b5cf6` accents, Cascadia Mono typography) with clean rounded panels.

---

## Supported Models

| Model | Download | VRAM Footprint | Best For |
|---|---|---|---|
| **Qwen 2.5 3B Instruct** | ~1.9 GB | ~2.2 GB | **Default Spindle:** Fast, high-accuracy conversational AI and instruction following. |
| **DeepSeek-R1 Distill Qwen 1.5B** | ~1.0 GB | ~1.3 GB | **Reasoning Engine:** Dedicated native `<think>` chains, logic verification, and self-correction. |
| **Qwen 2.5 1.5B Instruct** | ~1.1 GB | ~1.4 GB | **Ultralight:** For integrated GPUs, older laptops, or mobile WebGPU. |

---

## Built-In Client Hands (Tools)

EasyLM intercepts tool queries deterministically before neural generation:
- **Math AST Evaluator:** Arithmetic, roots, powers, trigonometry (e.g. `sqrt(144) * 5200`).
- **Unit Converter:** Gallons to ounces, miles to km, Celsius to Fahrenheit, lbs to kg.
- **System Clock:** Local time, UTC ISO stamps, timezone offsets.
- **Web Search:** Live fact extraction via public search endpoints.
- **Field Warehouse:** In-memory Dewey stacks ($000$–$800$) and core canon laws.

---

## Development

```bash
# Clone repository
git clone https://github.com/erastudil/easylm.git
cd easylm

# Install dependencies
npm install

# Run local dev server
npm run dev

# Build production bundle
npm run build
```

---

## Requirements

- A modern browser with WebGPU enabled:
  - Google Chrome / Chromium 113+
  - Microsoft Edge 113+
  - Safari 18+ (macOS Sequoia / iOS 18)
  - Firefox Nightly (with `dom.webgpu.enabled = true`)

---

## License

GNU General Public License v3.0 (GPLv3).

EasyLM is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. All derivative works and forks must also remain free and open source under GPLv3.
