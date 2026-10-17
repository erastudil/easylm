/**
 * Client-side LoRA weight injection utilities for EasyLM.
 *
 * SafeTensors layout (little-endian):
 *   [8-byte u64 header length][JSON header][tensor data...]
 *
 * LoRA adaptation (Hu et al., 2021):
 *   W' = W + (alpha / r) * (B x A)
 * where A is (r x in_features), B is (out_features x r) and W is
 * (out_features x in_features), all stored row-major.
 */

export interface LoRAHeader {
  rank: number;
  alpha: number;
  targetModules: string[];
}

export interface SafeTensorsParseResult {
  header: Record<string, any>;
  offset: number;
}

const HEADER_LENGTH_BYTES = 8;

export function parseSafeTensorsHeader(
  buffer: ArrayBuffer
): { header: Record<string, any>; offset: number } {
  if (!(buffer instanceof ArrayBuffer) || buffer.byteLength < HEADER_LENGTH_BYTES) {
    throw new Error(
      `SafeTensors buffer must be an ArrayBuffer of at least ${HEADER_LENGTH_BYTES} bytes`
    );
  }

  const view = new DataView(buffer);
  const headerLength = Number(view.getBigUint64(0, true));

  if (!Number.isSafeInteger(headerLength) || headerLength < 2) {
    throw new Error(`Invalid SafeTensors header length: ${headerLength}`);
  }

  const offset = HEADER_LENGTH_BYTES + headerLength;
  if (buffer.byteLength < offset) {
    throw new Error(
      `SafeTensors buffer is truncated: need ${offset} bytes for header, got ${buffer.byteLength}`
    );
  }

  const headerText = new TextDecoder().decode(new Uint8Array(buffer, HEADER_LENGTH_BYTES, headerLength));

  let header: Record<string, any>;
  try {
    header = JSON.parse(headerText);
  } catch (err) {
    throw new Error(`SafeTensors header is not valid JSON: ${(err as Error).message}`);
  }

  if (header === null || typeof header !== 'object' || Array.isArray(header)) {
    throw new Error('SafeTensors header must encode a JSON object');
  }

  return { header, offset };
}

export function applyLoRAWeights(
  baseTensor: Float32Array,
  loraA: Float32Array,
  loraB: Float32Array,
  alpha: number,
  rank: number
): Float32Array {
  if (!Number.isFinite(alpha)) {
    throw new Error(`alpha must be a finite number, got ${alpha}`);
  }
  if (!Number.isInteger(rank) || rank <= 0) {
    throw new Error(`rank must be a positive integer, got ${rank}`);
  }
  if (loraA.length === 0 || loraA.length % rank !== 0) {
    throw new Error(`loraA length (${loraA.length}) must be a positive multiple of rank (${rank})`);
  }
  if (loraB.length === 0 || loraB.length % rank !== 0) {
    throw new Error(`loraB length (${loraB.length}) must be a positive multiple of rank (${rank})`);
  }

  const inFeatures = loraA.length / rank;
  const outFeatures = loraB.length / rank;
  const expectedBaseLength = outFeatures * inFeatures;

  if (baseTensor.length !== expectedBaseLength) {
    throw new Error(
      `Dimension mismatch: baseTensor has ${baseTensor.length} elements but LoRA matrices imply ` +
        `${outFeatures}x${inFeatures} = ${expectedBaseLength} elements`
    );
  }

  const scale = alpha / rank;
  const output = new Float32Array(baseTensor.length);

  for (let i = 0; i < outFeatures; i++) {
    const bRow = i * rank;
    const wRow = i * inFeatures;
    for (let j = 0; j < inFeatures; j++) {
      // Accumulate in float64 (JS number) to preserve precision before rounding to float32.
      let acc = 0;
      for (let k = 0; k < rank; k++) {
        acc += loraB[bRow + k] * loraA[k * inFeatures + j];
      }
      output[wRow + j] = baseTensor[wRow + j] + scale * acc;
    }
  }

  return output;
}

export interface AdapterMetadata {
  id: string;
  name: string;
  repoId: string;
  baseModel: string;
  targetArchitecture: string;
  description: string;
  rank: number;
  alpha: number;
  targetModules: string[];
  hfUrl: string;
  weightsUrl: string;
  configUrl: string;
}

const BONSAI_TARGET_MODULES = ['q_proj', 'k_proj', 'v_proj', 'o_proj', 'gate_proj', 'up_proj', 'down_proj'];

function makeBonsaiAdapter(
  id: string,
  name: string,
  baseModel: string,
  description: string
): AdapterMetadata {
  const repoId = `Bluebarrels/${id}`;
  return {
    id,
    name,
    repoId,
    baseModel,
    targetArchitecture: 'bonsai2',
    description,
    rank: 16,
    alpha: 32,
    targetModules: BONSAI_TARGET_MODULES,
    hfUrl: `https://huggingface.co/${repoId}`,
    weightsUrl: `https://huggingface.co/${repoId}/resolve/main/adapter_model.safetensors`,
    configUrl: `https://huggingface.co/${repoId}/raw/main/adapter_config.json`
  };
}

export const OFFICIAL_ADAPTERS: Record<string, AdapterMetadata> = {
  'easylm-bonsai-2-2b': makeBonsaiAdapter(
    'easylm-bonsai-2-2b',
    'EasyLM Bonsai 2 2B Unified (32 Stacks + AtMem + Progen)',
    'prism-ml/Ternary-Bonsai-2-2B',
    'Unified 500MB default adapter specializing Ternary Bonsai 2 2B on the 32 sovereign academic stacks, AtMem atomic memory, and Progen syntax.'
  ),
  'easylm-bonsai-2-4b': makeBonsaiAdapter(
    'easylm-bonsai-2-4b',
    'EasyLM Bonsai 2 4B Unified (32 Stacks + AtMem + Progen)',
    'prism-ml/Ternary-Bonsai-2-4B',
    'Unified 1GB step-up adapter specializing Ternary Bonsai 2 4B on academic stacks, mathematical derivations, and AtMem.'
  ),
  'easylm-bonsai-2-9b': makeBonsaiAdapter(
    'easylm-bonsai-2-9b',
    'EasyLM Bonsai 2 9B Unified (32 Stacks + AtMem + Progen)',
    'prism-ml/Ternary-Bonsai-2-9B',
    'Unified 2GB workhorse adapter specializing Ternary Bonsai 2 9B on formal stack proofs, coding synthesis, and autonomous tool execution.'
  ),
  'easylm-bonsai-2-27b': makeBonsaiAdapter(
    'easylm-bonsai-2-27b',
    'EasyLM Bonsai 2 27B Unified (Sovereign Flagship)',
    'prism-ml/Ternary-Bonsai-2-27B',
    'Unified 6GB flagship adapter specializing Ternary Bonsai 2 27B on the full academic corpus, Alice cognitive mind integration, and deep reasoning.'
  ),
  'easylm-hands-bonsai-2-2b': makeBonsaiAdapter(
    'easylm-hands-bonsai-2-2b',
    'EasyLM Hands (Bonsai 2 2B)',
    'prism-ml/Ternary-Bonsai-2-2B',
    'Specialist adapter for structured Hands tool invocation, JSON parameter binding, and deterministic local tool dispatch on Bonsai 2 2B.'
  ),
  'easylm-hands-bonsai-2-4b': makeBonsaiAdapter(
    'easylm-hands-bonsai-2-4b',
    'EasyLM Hands (Bonsai 2 4B)',
    'prism-ml/Ternary-Bonsai-2-4B',
    'Specialist adapter for structured Hands tool invocation, JSON parameter binding, and deterministic local tool dispatch on Bonsai 2 4B.'
  ),
  'easylm-hands-bonsai-2-9b': makeBonsaiAdapter(
    'easylm-hands-bonsai-2-9b',
    'EasyLM Hands (Bonsai 2 9B)',
    'prism-ml/Ternary-Bonsai-2-9B',
    'Specialist adapter for multi-step Hands tool orchestration and deterministic parameter binding on Bonsai 2 9B.'
  ),
  'easylm-hands-bonsai-2-27b': makeBonsaiAdapter(
    'easylm-hands-bonsai-2-27b',
    'EasyLM Hands (Bonsai 2 27B)',
    'prism-ml/Ternary-Bonsai-2-27B',
    'Flagship specialist adapter for complex multi-tool chains and schema-verified Hands execution on Bonsai 2 27B.'
  ),
  'easylm-reasoning-bonsai-2-4b': makeBonsaiAdapter(
    'easylm-reasoning-bonsai-2-4b',
    'EasyLM Reasoning (Bonsai 2 4B)',
    'prism-ml/Ternary-Bonsai-2-4B',
    'Specialist adapter for formal chain-of-thought derivations, mathematical proofs, and ZCABS stability invariants on Bonsai 2 4B.'
  ),
  'easylm-reasoning-bonsai-2-9b': makeBonsaiAdapter(
    'easylm-reasoning-bonsai-2-9b',
    'EasyLM Reasoning (Bonsai 2 9B)',
    'prism-ml/Ternary-Bonsai-2-9B',
    'Specialist adapter for deep analytical reasoning, scientific derivations, and formal verification on Bonsai 2 9B.'
  ),
  'easylm-reasoning-bonsai-2-27b': makeBonsaiAdapter(
    'easylm-reasoning-bonsai-2-27b',
    'EasyLM Reasoning (Bonsai 2 27B)',
    'prism-ml/Ternary-Bonsai-2-27B',
    'Flagship specialist adapter for frontier-grade theorem proving, systems dialectics, and multi-document synthesis on Bonsai 2 27B.'
  ),
  'easylm-coding-bonsai-2-4b': makeBonsaiAdapter(
    'easylm-coding-bonsai-2-4b',
    'EasyLM Coding (Bonsai 2 4B)',
    'prism-ml/Ternary-Bonsai-2-4B',
    'Specialist adapter for Rust, TypeScript, and Python program synthesis, AST refactoring, and test generation on Bonsai 2 4B.'
  ),
  'easylm-coding-bonsai-2-9b': makeBonsaiAdapter(
    'easylm-coding-bonsai-2-9b',
    'EasyLM Coding (Bonsai 2 9B)',
    'prism-ml/Ternary-Bonsai-2-9B',
    'Specialist adapter for multi-file software architecture, deterministic verification gates, and systems programming on Bonsai 2 9B.'
  ),
  'easylm-coding-bonsai-2-27b': makeBonsaiAdapter(
    'easylm-coding-bonsai-2-27b',
    'EasyLM Coding (Bonsai 2 27B)',
    'prism-ml/Ternary-Bonsai-2-27B',
    'Flagship specialist adapter for full-stack compiler, kernel, and distributed systems engineering on Bonsai 2 27B.'
  ),
  'easylm-hydra-bonsai-2-9b': makeBonsaiAdapter(
    'easylm-hydra-bonsai-2-9b',
    'Hydra Agent (Bonsai 2 9B)',
    'prism-ml/Ternary-Bonsai-2-9B',
    'Dedicated Hydra CLI & Desktop autonomous ReAct agent adapter for Bonsai 2 9B with 256k context routing and Progen compliance.'
  ),
  'easylm-personalities-bonsai-2-2b': makeBonsaiAdapter(
    'easylm-personalities-bonsai-2-2b',
    'EasyLM Personalities & Council (Bonsai 2 2B)',
    'prism-ml/Ternary-Bonsai-2-2B',
    'Specialist adapter for the 151 Council of Kami voices, Alice Carrollian Socratic Antithesis, and ether-fishing on Bonsai 2 2B.'
  ),
  'easylm-personalities-bonsai-2-4b': makeBonsaiAdapter(
    'easylm-personalities-bonsai-2-4b',
    'EasyLM Personalities & Council (Bonsai 2 4B)',
    'prism-ml/Ternary-Bonsai-2-4B',
    'Specialist adapter for the 151 Council of Kami voices, Alice Carrollian Socratic Antithesis, and ether-fishing on Bonsai 2 4B.'
  ),
  'easylm-personalities-bonsai-2-9b': makeBonsaiAdapter(
    'easylm-personalities-bonsai-2-9b',
    'EasyLM Personalities & Council (Bonsai 2 9B)',
    'prism-ml/Ternary-Bonsai-2-9B',
    'Specialist adapter for the 151 Council of Kami voices, Alice Carrollian Socratic Antithesis, and ether-fishing on Bonsai 2 9B.'
  ),
  'easylm-security-bonsai-2-2b': makeBonsaiAdapter(
    'easylm-security-bonsai-2-2b',
    'EasyLM Security & Sovereignty (Bonsai 2 2B)',
    'prism-ml/Ternary-Bonsai-2-2B',
    'Specialist adapter for sovereign local privacy, zero-telemetry sandboxing, and defensive posture on Bonsai 2 2B.'
  ),
  'easylm-security-bonsai-2-9b': makeBonsaiAdapter(
    'easylm-security-bonsai-2-9b',
    'EasyLM Security & Sovereignty (Bonsai 2 9B)',
    'prism-ml/Ternary-Bonsai-2-9B',
    'Specialist adapter for sovereign local privacy, zero-telemetry sandboxing, and defensive posture on Bonsai 2 9B.'
  ),
  'easylm-kidsafety-bonsai-2-2b': makeBonsaiAdapter(
    'easylm-kidsafety-bonsai-2-2b',
    'EasyLM Kid Safety & Homework Coach (Bonsai 2 2B)',
    'prism-ml/Ternary-Bonsai-2-2B',
    'Specialist adapter for age-gated kid safety, gentle Socratic homework coaching, and parent boundary enforcement on Bonsai 2 2B.'
  ),
  'easylm-kidsafety-bonsai-2-9b': makeBonsaiAdapter(
    'easylm-kidsafety-bonsai-2-9b',
    'EasyLM Kid Safety & Homework Coach (Bonsai 2 9B)',
    'prism-ml/Ternary-Bonsai-2-9B',
    'Specialist adapter for age-gated kid safety, gentle Socratic homework coaching, and parent boundary enforcement on Bonsai 2 9B.'
  ),
  'easylm-hands-qwen2.5-0.5b': {
    id: 'easylm-hands-qwen2.5-0.5b',
    name: 'EasyLM Hands (Qwen2.5-0.5B-Instruct)',
    repoId: 'Bluebarrels/easylm-hands-qwen2.5-0.5b',
    baseModel: 'Qwen/Qwen2.5-0.5B-Instruct',
    targetArchitecture: 'qwen2',
    description: 'Discrete low-rank adapter specializing Qwen2.5-0.5B in structured tool invocation and parameter binding.',
    rank: 16,
    alpha: 32,
    targetModules: ['q_proj', 'k_proj', 'v_proj', 'o_proj', 'gate_proj', 'up_proj', 'down_proj'],
    hfUrl: 'https://huggingface.co/Bluebarrels/easylm-hands-qwen2.5-0.5b',
    weightsUrl: 'https://huggingface.co/Bluebarrels/easylm-hands-qwen2.5-0.5b/resolve/main/adapter_model.safetensors',
    configUrl: 'https://huggingface.co/Bluebarrels/easylm-hands-qwen2.5-0.5b/raw/main/adapter_config.json'
  },
  'easylm-hands-qwen2.5-3b': {
    id: 'easylm-hands-qwen2.5-3b',
    name: 'EasyLM Hands (Qwen2.5-3B-Instruct)',
    repoId: 'Bluebarrels/easylm-hands-qwen2.5-3b',
    baseModel: 'Qwen/Qwen2.5-3B-Instruct',
    targetArchitecture: 'qwen2',
    description: 'Discrete low-rank adapter specializing Qwen2.5-3B in structured tool invocation and parameter binding.',
    rank: 16,
    alpha: 32,
    targetModules: ['q_proj', 'k_proj', 'v_proj', 'o_proj', 'gate_proj', 'up_proj', 'down_proj'],
    hfUrl: 'https://huggingface.co/Bluebarrels/easylm-hands-qwen2.5-3b',
    weightsUrl: 'https://huggingface.co/Bluebarrels/easylm-hands-qwen2.5-3b/resolve/main/adapter_model.safetensors',
    configUrl: 'https://huggingface.co/Bluebarrels/easylm-hands-qwen2.5-3b/raw/main/adapter_config.json'
  },
  'alice-emap-adapter': {
    id: 'alice-emap-adapter',
    name: 'Alice EMap Adapter (Qwen2.5-3B-Instruct)',
    repoId: 'Bluebarrels/alice-emap-adapter',
    baseModel: 'Qwen/Qwen2.5-3B-Instruct',
    targetArchitecture: 'qwen2',
    description: 'Discrete low-rank adapter specializing Qwen2.5-3B for Alice 1.0 EMap knowledge graph arbitration.',
    rank: 16,
    alpha: 32,
    targetModules: ['q_proj', 'k_proj', 'v_proj', 'o_proj', 'gate_proj', 'up_proj', 'down_proj'],
    hfUrl: 'https://huggingface.co/Bluebarrels/alice-emap-adapter',
    weightsUrl: 'https://huggingface.co/Bluebarrels/alice-emap-adapter/resolve/main/adapter_model.safetensors',
    configUrl: 'https://huggingface.co/Bluebarrels/alice-emap-adapter/raw/main/adapter_config.json'
  }
};

export function getAdapterConfig(idOrRepo: string): AdapterMetadata | undefined {
  if (OFFICIAL_ADAPTERS[idOrRepo]) {
    return OFFICIAL_ADAPTERS[idOrRepo];
  }
  return Object.values(OFFICIAL_ADAPTERS).find(
    a => a.repoId.toLowerCase() === idOrRepo.toLowerCase() || a.id.toLowerCase() === idOrRepo.toLowerCase()
  );
}

export function getAdaptersForModel(baseModelOrId: string): AdapterMetadata[] {
  const norm = baseModelOrId.toLowerCase();
  return Object.values(OFFICIAL_ADAPTERS).filter(
    a => a.baseModel.toLowerCase() === norm ||
         norm.includes(a.baseModel.toLowerCase().replace(/.*\//, '')) ||
         a.baseModel.toLowerCase().includes(norm)
  );
}

export function listOfficialAdapters(): AdapterMetadata[] {
  return Object.values(OFFICIAL_ADAPTERS);
}

export function buildAdapterFetchUrl(repoId: string, filename: string): string {
  return `https://huggingface.co/${repoId}/resolve/main/${filename}`;
}
