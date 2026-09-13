export interface CreditedProject {
  name: string;
  repo: string;
  url: string;
  description: string;
}

export interface ContributorCredit {
  id: string;
  name: string;
  handle: string;
  role: string;
  github: string;
  website?: string;
  avatar?: string;
  summary: string;
  adoptedInnovations: string[];
  projects: CreditedProject[];
  license: string;
}

export const OPEN_SOURCE_COVENANT = {
  title: "AGPL-3.0 Open Source Covenant & Attribution",
  summary: "EasyLM and the HNAI ecosystem are free software licensed under the GNU Affero General Public License v3 (AGPL-3.0-or-later). We believe in user sovereignty, zero rent on bits, local-first computing, and giving deep credit where credit is due. All integrated concepts, algorithms, and modules respect open-source licenses and attribution requirements.",
  licenseUrl: "https://www.gnu.org/licenses/agpl-3.0.html"
};

export const CONTRIBUTORS_CREDITS: ContributorCredit[] = [
  {
    id: "vladzima",
    name: "Vlad Arbatov",
    handle: "vladzima",
    role: "Full-Stack Engineer & Agent Systems Designer",
    github: "https://github.com/vladzima",
    website: "https://arbatov.dev",
    summary: "Architect of innovative browser developer environments, process telemetry statuslines, and deterministic LLM steering libraries.",
    adoptedInnovations: [
      "Kodeck terminal sidecar & multi-pane browser PTY design",
      "Claude-statusline compute load, host metrics, and HUD telemetry",
      "Herd multi-agent report-file coordination protocol",
      "Platitude rhetorical slop detection and negation-substitution rules",
      "Prompt-comments rationale schema to prevent LLM catastrophic remembering",
      "Colormason accessible OKLCH color token architecture"
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
    license: "MIT / AGPL-3.0 Compatible"
  },
  {
    id: "aetna000",
    name: "Javad Taghia",
    handle: "aetna000",
    role: "AI Memory Researcher & Systems Architect (AtMem.ai Lab)",
    github: "https://github.com/aetna000",
    website: "https://atmem.ai",
    summary: "Pioneer in local-first auditable agent memory systems and transactional execution runtimes.",
    adoptedInnovations: [
      "Pherix two-lane transactional resource runtime (reversible file snapshots & rollback)",
      "Atmem local-first auditable agent memory and context distillation",
      "4-tier progressive memory hierarchy operating without external cloud APIs"
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
    license: "MIT / AGPL-3.0 Compatible"
  },
  {
    id: "pewdiepie-odysseus",
    name: "PewDiePie / Archdaemon",
    handle: "pewdiepie-archdaemon",
    role: "Creators of Odysseus AI Workspace",
    github: "https://github.com/pewdiepie-archdaemon",
    website: "https://github.com/pewdiepie-archdaemon/odysseus",
    summary: "Original creators of Odysseus, the self-hosted AI workspace for chat, agents, research, documents, email, and local model execution.",
    adoptedInnovations: [
      "Original Odysseus two-wire agent harness (native API calls + markdown code fence extraction fallback)",
      "Flat tool execution loop & resilient function calling for local models",
      "SearXNG privacy search integration and agent execution UI"
    ],
    projects: [
      {
        name: "odysseus",
        repo: "pewdiepie-archdaemon/odysseus",
        url: "https://github.com/pewdiepie-archdaemon/odysseus",
        description: "A self-hosted AI workspace for chat, agents, research, documents, email, notes, calendar, and local model workflows."
      }
    ],
    license: "AGPL-3.0"
  },
  {
    id: "webllm",
    name: "MLC-AI Team",
    handle: "mlc-ai",
    role: "WebGPU Machine Learning Runtime Team",
    github: "https://github.com/mlc-ai",
    website: "https://webllm.mlc.ai",
    summary: "Developers of WebLLM, bringing state-of-the-art LLM inference directly to web browsers via WebGPU.",
    adoptedInnovations: [
      "In-browser WebGPU KV-cache acceleration",
      "Wasm + WebGPU zero-install execution model",
      "Paged-cache and streaming token generation"
    ],
    projects: [
      {
        name: "web-llm",
        repo: "mlc-ai/web-llm",
        url: "https://github.com/mlc-ai/web-llm",
        description: "High-performance in-browser LLM inference runtime using WebGPU and TVM Unity."
      }
    ],
    license: "Apache-2.0 / AGPL-3.0 Compatible"
  },
  {
    id: "ollama",
    name: "Ollama Team",
    handle: "ollama",
    role: "Open Weights Model Runtime",
    github: "https://github.com/ollama",
    website: "https://ollama.com",
    summary: "Creators of the premier local model runtime, simplifying weights loading, GPU offloading, and standard API serving.",
    adoptedInnovations: [
      "Unified OpenAI-compatible local model streaming API",
      "Native function calling and GPU memory offloading"
    ],
    projects: [
      {
        name: "ollama",
        repo: "ollama/ollama",
        url: "https://github.com/ollama/ollama",
        description: "Get up and running with large language models locally."
      }
    ],
    license: "MIT / AGPL-3.0 Compatible"
  },
  {
    id: "xtermjs",
    name: "xterm.js & Node PTY",
    handle: "xtermjs",
    role: "Terminal Emulation & Pseudo-Terminal Bindings",
    github: "https://github.com/xtermjs",
    website: "https://xtermjs.org",
    summary: "Foundational libraries powering modern terminal experiences in browser and Node environments.",
    adoptedInnovations: [
      "Fast VT100/xterm browser rendering with addon-fit",
      "Pseudo-terminal process management via node-pty"
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
    license: "MIT / AGPL-3.0 Compatible"
  }
];
