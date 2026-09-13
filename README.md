# EasyLM

**Free, zero-install local intelligence in your browser.**
WebGPU inference on your machine. Official app stays free forever.

[![Deploy with Vercel](https://vercel.com/button)](https://easylm.vercel.app)

Copyright (C) 2026 Humans and AI. GNU AGPL-3.0 or later. This program comes with ABSOLUTELY NO WARRANTY.

---

## What is EasyLM?

EasyLM is a consumer alternative to hosted chat that **runs on your GPU** via WebGPU.

- **Zero install / zero account.** Open the URL.
- **Chat tokens stay here.** Prompts and generation run in this browser. History is stored in this browser unless you export it.
- **Weights come from Hugging Face** into browser cache on first load.
- **Hands.** Local math, units, and clock. Optional search, weather, FX, dictionary, and facts send that lookup when you use them. Page reader covers Wikipedia / Wikiquote / Wikisource through this origin; other pages only if the site allows CORS. Turn Hands off to skip those lookups.
- **Kid Safe.** Local tools only. A household PIN, hashed in this browser, is a speed-bump, not a school filter.
- **Backup to disk.** JSON file on your machine.

---

## Supported Models

| Model | Download | VRAM Footprint | Best For |
|---|---|---|---|
| **Qwen 2.5 3B Instruct** | ~1.9 GB | ~2.2 GB | Default. Apache-2.0 weights. |
| **DeepSeek-R1 Distill Qwen 1.5B** | ~1.0 GB | ~1.3 GB | Reasoning. MIT weights. |
| **Qwen 2.5 1.5B Instruct** | ~1.1 GB | ~1.4 GB | Ultralight / iGPU. Apache-2.0 weights. |

Model weights are not AGPL. They keep their upstream licenses. The EasyLM application is AGPL-3.0-or-later.

---

## Built-In Hands

Local:

- Math evaluator
- Unit converter (unknown pairs error, they do not invent a 1:1 ratio)
- System clock
- The Stacks: undergraduate textbooks across 28 academic subjects plus official source doors (`stacks/`)
- Studio: local class walks — lessons, quizzes, projects, essays, exams. Pass/fail. No due dates. Streaks and badges on this device. Not a diploma.

Optional network (leave the machine):

- Web search and page reader
- Weather, ECB FX, dictionary, encyclopedia summaries

---

## Development

```bash
git clone https://github.com/erastudil/easylm.git
cd easylm
npm install
npm run dev
npm test
npm run build
```

---

## Requirements

A browser with WebGPU:

- Chrome / Chromium 113+
- Edge 113+
- Safari 18+ (macOS Sequoia / iOS 18)
- Firefox Nightly (`dom.webgpu.enabled = true`)

---

## License

GNU Affero General Public License v3.0 or later. See [LICENSE](LICENSE).

EasyLM is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

If you run a modified copy for others over a network, you owe them the source. That is AGPL §13.

The official EasyLM app is free forever. Donations only. No company owns this line. That is a project covenant. AGPL is how forks and hosted wraps stay free software.

Security reports: see [SECURITY.md](SECURITY.md).
