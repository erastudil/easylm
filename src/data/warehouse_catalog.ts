export interface WarehouseDoc {
  dewey: string;
  title: string;
  category: string;
  snippet: string;
}

export const WAREHOUSE_DOCS: WarehouseDoc[] = [
  {
    dewey: "000",
    title: "AGENTS Core Law & Repo Structure",
    category: "Generalities & Canon",
    snippet: "Genome, warehouse, canon. 5S (cut, place, see, hold, become), kaizen, computational taoism, ponytail architecture, diamond rule. Field github erastudil/hnai-dev is SoT."
  },
  {
    dewey: "010",
    title: "Progen Dialect & Syntax Marks",
    category: "Communication Standards",
    snippet: "Topic : comment outputs; parses comma from human input. Asides in //. Agents iron, human slack. Think traces short. Ban recap and polite filler."
  },
  {
    dewey: "020",
    title: "HNAI UI Design Standards",
    category: "Design Standards",
    snippet: "Ground: black #000000. Accent: ina violet #8b5cf6 borders. Font: Cascadia Mono. Dense panels, zero instruction essays in chrome. Controls speak for themselves; tooltips are the manual."
  },
  {
    dewey: "100",
    title: "Philosophy OS: Computational Taoism",
    category: "Philosophy",
    snippet: "Wu wei (effortless action, aligning with natural flow). Problem is treasure. Status quo is not sacred. Less code, less compute, zero parasitic rent."
  },
  {
    dewey: "200",
    title: "WebGPU Spindle Compute Architecture",
    category: "Compute & Hardware",
    snippet: "Client-side WebGPU acceleration via WebLLM/MLC. Zero server inference, resident weights cached in browser IndexedDB, privacy guaranteed by sandbox."
  },
  {
    dewey: "300",
    title: "CeLLM: Standalone Spindle Machine Workstation",
    category: "Systems & Architecture",
    snippet: "Fadal CNC88-inspired deterministic model spindle. Manual Language Input (MLI), tool carousel T1-T24, fixture offsets E1-E48, canned cycles G81, G82, G83."
  },
  {
    dewey: "400",
    title: "Language & Protocol Standards",
    category: "Languages & Frameworks",
    snippet: "TypeScript, React, Python 3.12, Rust, Vite, Tailwind CSS. One contract, many hosts. Rebuild only the process that copied the code."
  },
  {
    dewey: "500",
    title: "Network & Mesh Protocol",
    category: "Mesh Protocols",
    snippet: "Decentralized state synchronization, zero-telemetry client architecture, offline-first local computation."
  },
  {
    dewey: "600",
    title: "Autonomous Tool Orchestration & CNLC",
    category: "Agentic Systems",
    snippet: "Deterministic tool interception before neural token generation. Synchronous in-browser execution prevents neural hallucinations."
  },
  {
    dewey: "700",
    title: "Tri-Lake Memory (TLM) Architecture",
    category: "Memory & Judgement",
    snippet: "Heaven (E13) verified exemplars; Purgatory (E31) draft scraps and outlines; Hell (E35) quarantined failure modes. Append to living lakes."
  },
  {
    dewey: "800",
    title: "Beaufort Force Weather & Telemetry Notes",
    category: "Telemetry & Undergrad",
    snippet: "Observation scales, calibration notes, deterministic metric verification standards."
  }
];
