export interface CreditedProject {
  name: string;
  repo: string;
  url: string;
  description: string;
}

export interface HumanContributor {
  name: string;
  handle?: string;
  role: string;
}

export interface ContributorCredit {
  id: string;
  name: string;
  handle: string;
  role: string;
  github: string;
  website?: string;
  avatar?: string;
  approxLinesOfCode?: string;
  locRank?: number;
  summary: string;
  adoptedInnovations: string[];
  humanContributors?: HumanContributor[];
  projects: CreditedProject[];
  license: string;
}

export interface OpenWeightsCredit {
  id: string;
  provider: string;
  organization: string;
  leadHumans: string;
  models: string[];
  description: string;
  license: string;
  url: string;
}

export const OPEN_SOURCE_COVENANT = {
  title: "AGPL-3.0 Open Source Covenant & Attribution",
  summary: "EasyLM and the HNAI ecosystem are free software licensed under the GNU Affero General Public License v3 (AGPL-3.0-or-later). We believe in user sovereignty, zero rent on bits, local-first computing, and giving deep gratitude where credit is due. All integrated concepts, algorithms, and modules respect open-source licenses and attribution requirements.",
  licenseUrl: "https://www.gnu.org/licenses/agpl-3.0.html"
};

export const OPEN_WEIGHTS_PROVIDERS: OpenWeightsCredit[] = [
  {
    id: "deepseek",
    provider: "DeepSeek AI",
    organization: "DeepSeek / High-Flyer",
    leadHumans: "Liang Wenfeng & DeepSeek Research Team",
    models: ["DeepSeek-R1 (Distill 7B, 8B, 14B)", "DeepSeek-V3", "DeepSeek-Coder"],
    description: "Pioneered pure reinforcement learning reasoning without supervised warm-up, Multi-head Latent Attention (MLA), and ultra-efficient open mixture-of-experts architectures.",
    license: "MIT License (Fully Open)",
    url: "https://deepseek.com"
  },
  {
    id: "meta",
    provider: "Meta AI",
    organization: "Fundamental AI Research (FAIR) / Meta",
    leadHumans: "Mark Zuckerberg, Joelle Pineau, Ahmad Al-Dahle & Llama Research Team",
    models: ["Llama 3.1 (8B, 70B)", "Llama 3.2 (1B, 3B, 11B Vision)"],
    description: "Pioneered open-weights foundation models, igniting the global open-source AI renaissance and enabling sovereign local execution for millions.",
    license: "Llama 3.1 / 3.2 Community License (Permissive Open Weights)",
    url: "https://llama.meta.com"
  },
  {
    id: "qwen",
    provider: "Alibaba Cloud / Qwen Team",
    organization: "Alibaba Group",
    leadHumans: "Junyang Lin, Binyuan Hui, Jianxin Yang & Qwen Research Group",
    models: ["Qwen2.5 (0.5B, 1.5B, 3B, 7B)", "Qwen2.5-Coder (1.5B, 7B)", "Qwen2.5-Math"],
    description: "Created world-leading open-weights multilingual, coding, and mathematical reasoning models with up to 128k context windows and outstanding instruction following.",
    license: "Apache-2.0 / Qwen Open License",
    url: "https://github.com/QwenLM/Qwen2.5"
  },
  {
    id: "google-deepmind",
    provider: "Google DeepMind",
    organization: "Google",
    leadHumans: "Demis Hassabis, Oriol Vinyals, Clement Farabet & Gemma Open Models Team",
    models: ["Gemma 2 (2B, 9B, 27B)", "RecurrentGemma", "CodeGemma"],
    description: "Built lightweight, highly capable open weights leveraging Google's Gemini architecture, knowledge distillation, and interleaved attention mechanics.",
    license: "Gemma Terms of Use (Open Weights for Research & Commercial Use)",
    url: "https://ai.google.dev/gemma"
  },
  {
    id: "mistral",
    provider: "Mistral AI",
    organization: "Mistral AI Paris",
    leadHumans: "Arthur Mensch, Guillaume Lample, Timothée Lacroix & Mistral Team",
    models: ["Mistral 7B", "Mixtral 8x7B", "Ministral 8B", "Codestral"],
    description: "Pioneered sliding window attention, sparse mixture of experts (SMoE), and lean, high-throughput European open weights.",
    license: "Apache-2.0 / Mistral Open License",
    url: "https://mistral.ai"
  },
  {
    id: "microsoft",
    provider: "Microsoft Research",
    organization: "Microsoft",
    leadHumans: "Sébastien Bubeck, Ronen Eldan, Yin Tat Lee & SLM Research Team",
    models: ["Phi-3.5 (Mini, MoE, Vision)", "Phi-4 (14B)"],
    description: "Demonstrated that high-quality synthetic textbook data ('Textbooks Are All You Need') allows compact small language models (SLMs) to punch far above their parameter class.",
    license: "MIT License",
    url: "https://azure.microsoft.com/en-us/products/phi"
  },
  {
    id: "huggingface",
    provider: "Hugging Face",
    organization: "Hugging Face",
    leadHumans: "Clément Delangue, Julien Chaumond, Thomas Wolf & Open Science Collaborators",
    models: ["SmolLM2 (135M, 360M, 1.7B)", "Transformers", "Safetensors"],
    description: "The universal commons and distribution backbone for open machine learning, weights hosting, and lightweight on-device models.",
    license: "Apache-2.0",
    url: "https://huggingface.co"
  }
];

export const CONTRIBUTORS_CREDITS: ContributorCredit[] = [
  {
    id: "typescript",
    name: "TypeScript Compiler & Language Services",
    handle: "microsoft",
    role: "Static Analysis & Compilation Infrastructure",
    github: "https://github.com/microsoft/TypeScript",
    website: "https://www.typescriptlang.org",
    approxLinesOfCode: "~850,000 LOC",
    locRank: 1,
    summary: "Architectural foundation providing static typing, AST verification, and compile-time correctness guarantees across all EasyLM engines and curriculum suites.",
    adoptedInnovations: [
      "Strict type assertions ensuring local data privacy invariants",
      "Compile-time boundary verification between isolated profile stores"
    ],
    humanContributors: [
      { name: "Anders Hejlsberg", handle: "ahejlsberg", role: "Lead Architect" },
      { name: "Daniel Rosenwasser", handle: "DanielRosenwasser", role: "Program Manager" },
      { name: "Ryan Cavanaugh", handle: "RyanCavanaugh", role: "Engineering Lead" }
    ],
    projects: [
      {
        name: "TypeScript",
        repo: "microsoft/TypeScript",
        url: "https://github.com/microsoft/TypeScript",
        description: "TypeScript is a superset of JavaScript that compiles to clean JavaScript output."
      }
    ],
    license: "Apache-2.0"
  },
  {
    id: "webllm",
    name: "MLC-AI & Apache TVM Unity",
    handle: "mlc-ai",
    role: "WebGPU Machine Learning Runtime & Shader Compiler",
    github: "https://github.com/mlc-ai",
    website: "https://webllm.mlc.ai",
    approxLinesOfCode: "~550,000 LOC",
    locRank: 2,
    summary: "The foundational engine powering EasyLM's zero-cloud in-browser inference, compiling quantized neural network weights directly to WebGPU compute shaders.",
    adoptedInnovations: [
      "In-browser WebGPU KV-cache acceleration and paged-cache attention",
      "Wasm + WebGPU zero-install execution model with streaming token dispatch",
      "Dynamic hardware tier auto-detection (4GB / 8GB / 16GB / 32GB VRAM)"
    ],
    humanContributors: [
      { name: "Tianqi Chen", handle: "tqchen", role: "Co-founder & Apache TVM Architect" },
      { name: "Charlie Ruan", handle: "Charlie-X-Ruan", role: "WebLLM Lead Engineer" },
      { name: "Ruihang Lai", handle: "MasterJH5574", role: "TVM Unity Runtime Engineer" },
      { name: "Hongyi Jin", handle: "Hzfengsy", role: "Shader & Kernel Optimization" }
    ],
    projects: [
      {
        name: "web-llm",
        repo: "mlc-ai/web-llm",
        url: "https://github.com/mlc-ai/web-llm",
        description: "High-performance in-browser LLM inference runtime using WebGPU and TVM Unity."
      }
    ],
    license: "Apache-2.0"
  },
  {
    id: "xtermjs",
    name: "xterm.js & Node PTY",
    handle: "xtermjs",
    role: "Terminal Emulation & Pseudo-Terminal Bindings",
    github: "https://github.com/xtermjs",
    website: "https://xtermjs.org",
    approxLinesOfCode: "~280,000 LOC",
    locRank: 3,
    summary: "Foundational libraries powering modern terminal experiences in browser and Node environments.",
    adoptedInnovations: [
      "Fast VT100/xterm browser rendering with addon-fit",
      "Pseudo-terminal process management via node-pty"
    ],
    humanContributors: [
      { name: "Daniel Imms", handle: "Tyriar", role: "Lead Maintainer" },
      { name: "Megan Rogge", handle: "meganrogge", role: "Core Contributor" }
    ],
    projects: [
      {
        name: "xterm.js",
        repo: "xtermjs/xterm.js",
        url: "https://github.com/xtermjs/xterm.js",
        description: "A terminal for the web."
      },
      {
        name: "node-pty",
        repo: "microsoft/node-pty",
        url: "https://github.com/microsoft/node-pty",
        description: "Fork pseudo-terminals in Node.JS."
      }
    ],
    license: "MIT"
  },
  {
    id: "react",
    name: "React & React DOM",
    handle: "facebook",
    role: "Declarative User Interface Architecture",
    github: "https://github.com/facebook/react",
    website: "https://react.dev",
    approxLinesOfCode: "~160,000 LOC",
    locRank: 4,
    summary: "The UI reconciliation engine and state architecture orchestrating EasyLM's real-time streaming, interactive canvas modals, and responsive layout.",
    adoptedInnovations: [
      "Fine-grained reactive state scheduling for token stream rendering",
      "Declarative component reconciliation with zero layout jank"
    ],
    humanContributors: [
      { name: "Jordan Walke", handle: "jordwalke", role: "Creator of React" },
      { name: "Sebastian Markbåge", handle: "sebmarkbage", role: "Fiber Architecture Lead" },
      { name: "Dan Abramov", handle: "gaearon", role: "Developer Experience & Hooks" },
      { name: "Sophie Alpert", handle: "sophiebits", role: "Core Maintainer" }
    ],
    projects: [
      {
        name: "react",
        repo: "facebook/react",
        url: "https://github.com/facebook/react",
        description: "The library for web and native user interfaces."
      }
    ],
    license: "MIT"
  },
  {
    id: "vite",
    name: "Vite & Rollup",
    handle: "vitejs",
    role: "Next-Generation Frontend Tooling & ESM Bundler",
    github: "https://github.com/vitejs/vite",
    website: "https://vite.dev",
    approxLinesOfCode: "~130,000 LOC",
    locRank: 5,
    summary: "High-speed modern ESM dev server and optimized Rollup production compiler enabling zero-bundle hot reloading and deterministic standalone web distribution.",
    adoptedInnovations: [
      "Native ES modules dev server with instantaneous startup",
      "Optimized tree-shaking for compact single-page deployments"
    ],
    humanContributors: [
      { name: "Evan You", handle: "yyx990803", role: "Creator of Vite & Vue" },
      { name: "Rich Harris", handle: "Rich-Harris", role: "Creator of Rollup" },
      { name: "Lukas Taegert-Atkinson", handle: "lukastaegert", role: "Rollup Core Maintainer" },
      { name: "Patak", handle: "patak-dev", role: "Vite Core Team" }
    ],
    projects: [
      {
        name: "vite",
        repo: "vitejs/vite",
        url: "https://github.com/vitejs/vite",
        description: "Next generation frontend tooling. It's fast!"
      }
    ],
    license: "MIT"
  },
  {
    id: "pewdiepie-odysseus",
    name: "Felix Kjellberg (PewDiePie) & Odysseus Community",
    handle: "pewdiepie-archdaemon",
    role: "Originator & Community Contributors of Odysseus AI Workspace",
    github: "https://github.com/pewdiepie-archdaemon/odysseus",
    website: "https://github.com/odysseus-dev/odysseus",
    approxLinesOfCode: "~88,000 LOC",
    locRank: 6,
    summary: "Created by Felix Kjellberg (PewDiePie, using GitHub handle @pewdiepie-archdaemon, confirming that 'Archdaemon' was his account handle rather than a separate person). Odysseus is a sovereign self-hosted workspace for chat, multi-agent workflows, documents, and local AI execution, built with active support from dedicated open-source community contributors.",
    adoptedInnovations: [
      "Original Odysseus two-wire agent harness (native API structured calls + fallback markdown fence extraction)",
      "Flat tool execution loop & resilient function calling for local models",
      "SearXNG privacy search integration and agent execution UI"
    ],
    humanContributors: [
      { name: "Felix Kjellberg (PewDiePie)", handle: "pewdiepie-archdaemon", role: "Project Originator & Creator" },
      { name: "Afonso Campos", handle: "afonsopc", role: "Core Architecture & Full-Stack Execution" },
      { name: "Rareș", handle: "RaresKeY", role: "Core Features & Client Stability" },
      { name: "redpersongpt", handle: "redpersongpt", role: "Agent Prompts & Tool Execution Logic" },
      { name: "Alexandre Teixeira", handle: "alteixeira20", role: "File Systems & Integrations" },
      { name: "Kenny", handle: "vdmkenny", role: "Deployment & Environment Containerization" }
    ],
    projects: [
      {
        name: "odysseus",
        repo: "odysseus-dev/odysseus",
        url: "https://github.com/odysseus-dev/odysseus",
        description: "A self-hosted AI workspace for chat, agents, research, documents, email, notes, calendar, and local model workflows."
      }
    ],
    license: "AGPL-3.0"
  },
  {
    id: "ollama",
    name: "Ollama Local Model Runtime",
    handle: "ollama",
    role: "Local Open Weights Execution Runtime",
    github: "https://github.com/ollama",
    website: "https://ollama.com",
    approxLinesOfCode: "~75,000 LOC",
    locRank: 7,
    summary: "The gold standard local model runner, simplifying GPU memory offloading, weight quantization, and OpenAI-compatible local serving.",
    adoptedInnovations: [
      "Unified OpenAI-compatible local model streaming API",
      "Native function calling and GPU memory offloading"
    ],
    humanContributors: [
      { name: "Jeffrey Morgan", handle: "jmorganca", role: "Co-founder & Core Engineer" },
      { name: "Michael Chi", handle: "mchi", role: "Co-founder & Core Engineer" }
    ],
    projects: [
      {
        name: "ollama",
        repo: "ollama/ollama",
        url: "https://github.com/ollama/ollama",
        description: "Get up and running with large language models locally."
      }
    ],
    license: "MIT"
  },
  {
    id: "vitest",
    name: "Vitest & JSDOM",
    handle: "vitest-dev",
    role: "Vite-Native Unit Testing Framework",
    github: "https://github.com/vitest-dev/vitest",
    website: "https://vitest.dev",
    approxLinesOfCode: "~75,000 LOC",
    locRank: 8,
    summary: "Ultra-fast ESM-native test harness validating curriculum answer keys, Leitner spaced-repetition schedules, SSRF defenses, and Tri-Lake rating integrity.",
    adoptedInnovations: [
      "Vite-native test runner with instant HMR and worker thread isolation",
      "Mock DOM environment enabling deterministic headless component testing"
    ],
    humanContributors: [
      { name: "Anthony Fu", handle: "antfu", role: "Creator & Lead Maintainer" },
      { name: "Vladimir Kharlampidi", handle: "nolimits4web", role: "Core Contributor" },
      { name: "Elijah Hamovitz", handle: "AriPerkkio", role: "Core Contributor" }
    ],
    projects: [
      {
        name: "vitest",
        repo: "vitest-dev/vitest",
        url: "https://github.com/vitest-dev/vitest",
        description: "Next generation testing framework powered by Vite."
      }
    ],
    license: "MIT"
  },
  {
    id: "vladzima",
    name: "Vlad Arbatov",
    handle: "vladzima",
    role: "Full-Stack Engineer & Agent Systems Designer",
    github: "https://github.com/vladzima",
    website: "https://arbatov.dev",
    approxLinesOfCode: "~42,000 LOC",
    locRank: 9,
    summary: "Architect of innovative browser developer environments, process telemetry statuslines, and deterministic LLM steering libraries.",
    adoptedInnovations: [
      "Kodeck terminal sidecar & multi-pane browser PTY design",
      "Claude-statusline compute load, host metrics, and HUD telemetry",
      "Herd multi-agent report-file coordination protocol",
      "Platitude rhetorical slop detection and negation-substitution rules",
      "Prompt-comments rationale schema to prevent LLM catastrophic remembering",
      "Colormason accessible OKLCH color token architecture"
    ],
    humanContributors: [
      { name: "Vlad Arbatov", handle: "vladzima", role: "Creator & Systems Architect" }
    ],
    projects: [
      {
        name: "kodeck",
        repo: "vladzima/kodeck",
        url: "https://github.com/vladzima/kodeck",
        description: "Zero-bundle browser agent IDE with multi-pane PTY sidecar multiplexing and fast terminal tabs."
      },
      {
        name: "claude-statusline",
        repo: "vladzima/claude-statusline",
        url: "https://github.com/vladzima/claude-statusline",
        description: "Process compute tracking, token usage statusline, and resource-aware agent telemetry."
      },
      {
        name: "herd",
        repo: "vladzima/herd",
        url: "https://github.com/vladzima/herd",
        description: "Multi-agent coordination protocol using structured report files and state broadcasts."
      },
      {
        name: "platitude",
        repo: "vladzima/platitude",
        url: "https://github.com/vladzima/platitude",
        description: "Deterministic detection of LLM rhetorical slop and strict negation-substitution enforcement."
      },
      {
        name: "prompt-comments",
        repo: "vladzima/prompt-comments",
        url: "https://github.com/vladzima/prompt-comments",
        description: "Instruction rationale schema that clarifies rule intent to prevent catastrophic forgetting."
      },
      {
        name: "colormason",
        repo: "vladzima/colormason",
        url: "https://github.com/vladzima/colormason",
        description: "OKLCH accessible color token generation for ultra-clean, high-contrast dark UIs."
      }
    ],
    license: "MIT"
  },
  {
    id: "marked",
    name: "Marked Markdown Parser",
    handle: "markedjs",
    role: "High-Performance Zero-Dependency Markdown Compiler",
    github: "https://github.com/markedjs/marked",
    website: "https://marked.js.org",
    approxLinesOfCode: "~26,000 LOC",
    locRank: 10,
    summary: "The bedrock Markdown engine converting curriculum textbooks, math notation, code blocks, and model outputs into clean semantic HTML without heavy external runtimes.",
    adoptedInnovations: [
      "Synchronous deterministic Markdown compilation",
      "Zero-dependency lightweight client footprint"
    ],
    humanContributors: [
      { name: "Christopher Jeffrey", handle: "chjj", role: "Original Creator" },
      { name: "John Schlinkert", handle: "jonschlinkert", role: "Lead Maintainer" }
    ],
    projects: [
      {
        name: "marked",
        repo: "markedjs/marked",
        url: "https://github.com/markedjs/marked",
        description: "A markdown parser and compiler. Built for speed."
      }
    ],
    license: "MIT"
  },
  {
    id: "aetna000",
    name: "Javad Taghia",
    handle: "aetna000",
    role: "AI Memory Researcher & Systems Architect (AtMem.ai Lab)",
    github: "https://github.com/aetna000",
    website: "https://atmem.ai",
    approxLinesOfCode: "~24,000 LOC",
    locRank: 11,
    summary: "Pioneer in local-first auditable agent memory systems and transactional execution runtimes.",
    adoptedInnovations: [
      "Pherix two-lane transactional resource runtime (reversible file snapshots & rollback)",
      "Atmem local-first auditable agent memory and context distillation",
      "4-tier progressive memory hierarchy operating without external cloud APIs"
    ],
    humanContributors: [
      { name: "Javad Taghia", handle: "aetna000", role: "Lead Researcher & Architect" }
    ],
    projects: [
      {
        name: "Pherix",
        repo: "aetna000/Pherix",
        url: "https://github.com/aetna000/Pherix",
        description: "Transactional agent resource manager with reversible execution lanes, state snapshotting, and automatic rollback."
      },
      {
        name: "atmem",
        repo: "aetna000/atmem",
        url: "https://github.com/aetna000/atmem",
        description: "Local-first auditable memory system providing deterministic memory stores for autonomous agents."
      },
      {
        name: "TencentDB-Agent-Memory_TWO",
        repo: "aetna000/TencentDB-Agent-Memory_TWO",
        url: "https://github.com/aetna000/TencentDB-Agent-Memory_TWO",
        description: "4-tier progressive memory architecture enabling infinite-context reasoning without proprietary cloud APIs."
      }
    ],
    license: "MIT"
  },
  {
    id: "dompurify",
    name: "DOMPurify",
    handle: "cure53",
    role: "DOM-Only Safe XSS Sanitizer",
    github: "https://github.com/cure53/DOMPurify",
    approxLinesOfCode: "~18,000 LOC",
    locRank: 12,
    summary: "Security foundation preventing DOM-based cross-site scripting vulnerabilities when rendering rich model outputs and student project documents.",
    adoptedInnovations: [
      "Strict sanitization preserving SVG math diagrams and code syntax while neutralising malicious HTML injection"
    ],
    humanContributors: [
      { name: "Mario Heiderich", handle: "cure53", role: "Lead Security Researcher" }
    ],
    projects: [
      {
        name: "DOMPurify",
        repo: "cure53/DOMPurify",
        url: "https://github.com/cure53/DOMPurify",
        description: "DOMPurify is a DOM-only, super-fast, uber-tolerant XSS sanitizer for HTML, MathML and SVG."
      }
    ],
    license: "Apache-2.0 / MPL-2.0"
  },
  {
    id: "cascadia-inter",
    name: "Cascadia Code & Inter Fonts",
    handle: "microsoft",
    role: "Open Typography & Reader Ergonomics",
    github: "https://github.com/microsoft/cascadia-code",
    website: "https://rsms.me/inter/",
    approxLinesOfCode: "~12,000 LOC / Glyph Defs",
    locRank: 13,
    summary: "Ergonomic open-source typography engineered specifically for reading code, mathematical proofs, and extended collegiate textbooks with optimal density.",
    adoptedInnovations: [
      "Cascadia Code monospace font with programming ligatures for crystal-clear code rendering",
      "Inter proportional typeface crafted for computer screen readability"
    ],
    humanContributors: [
      { name: "Aaron Bell", handle: "aaronbell", role: "Cascadia Code Type Designer" },
      { name: "Rasmus Andersson", handle: "rsms", role: "Inter Type Designer" }
    ],
    projects: [
      {
        name: "cascadia-code",
        repo: "microsoft/cascadia-code",
        url: "https://github.com/microsoft/cascadia-code",
        description: "This is a fun, new monospaced font that includes programming ligatures and is designed to enhance the modern look and feel of the Windows Terminal."
      },
      {
        name: "inter",
        repo: "rsms/inter",
        url: "https://github.com/rsms/inter",
        description: "Inter is a typeface specially designed for user interfaces."
      }
    ],
    license: "SIL Open Font License 1.1"
  }
];

