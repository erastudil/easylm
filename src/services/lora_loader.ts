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
const GEMMA_TARGET_MODULES = ['q_proj', 'k_proj', 'v_proj', 'o_proj', 'gate_proj', 'up_proj', 'down_proj'];

export function makeBonsaiAdapter(
  id: string,
  name: string,
  baseModel: string,
  description: string,
  rank: number = 16,
  alpha: number = 32
): AdapterMetadata {
  const repoId = `Bluebarrels/${id}`;
  return {
    id,
    name,
    repoId,
    baseModel,
    targetArchitecture: 'bonsai2',
    description,
    rank,
    alpha,
    targetModules: BONSAI_TARGET_MODULES,
    hfUrl: `https://huggingface.co/${repoId}`,
    weightsUrl: `https://huggingface.co/${repoId}/resolve/main/adapter_model.safetensors`,
    configUrl: `https://huggingface.co/${repoId}/raw/main/adapter_config.json`
  };
}

export function makeGemmaAdapter(
  id: string,
  name: string,
  baseModel: string,
  description: string,
  rank: number = 16,
  alpha: number = 32
): AdapterMetadata {
  const repoId = `Bluebarrels/${id}`;
  return {
    id,
    name,
    repoId,
    baseModel,
    targetArchitecture: 'gemma4',
    description,
    rank,
    alpha,
    targetModules: GEMMA_TARGET_MODULES,
    hfUrl: `https://huggingface.co/${repoId}`,
    weightsUrl: `https://huggingface.co/${repoId}/resolve/main/adapter_model.safetensors`,
    configUrl: `https://huggingface.co/${repoId}/raw/main/adapter_config.json`
  };
}

export const OFFICIAL_ADAPTERS: Record<string, AdapterMetadata> = {
  // Truth gate (2026-10-20): all prior counterfeit Bluebarrels/* repositories
  // (smoke runs and surrogate base weights) were deleted from Hugging Face.
  // The live web app serves base Bonsai 2 and Gemma 4 weights directly.
  // No adapter may be added to OFFICIAL_ADAPTERS until trained across the full
  // EasyLM corpus distribution to held-out convergence, externally inspected,
  // and verified by scripts/adapter_publish_gate.py.
};

export function registerAdapter(meta: AdapterMetadata): void {
  OFFICIAL_ADAPTERS[meta.id] = meta;
}

export function unregisterAdapter(id: string): void {
  delete OFFICIAL_ADAPTERS[id];
  verifiedAdapterCache.delete(id);
  for (const [modelId, activeId] of activeSkillAdapterByModel.entries()) {
    if (activeId === id) {
      activeSkillAdapterByModel.delete(modelId);
    }
  }
}

export interface VerifiedAdapterState {
  adapterId: string;
  repoId: string;
  verifiedAt: number;
  headerVerified: boolean;
  tensorCount: number;
  rank: number;
  alpha: number;
  baseModel: string;
  trainLoss?: number;
  recordsTrained?: number;
}

const verifiedAdapterCache = new Map<string, VerifiedAdapterState>();
const activeSkillAdapterByModel = new Map<string, string>();
const ACTIVE_SKILL_STORAGE_KEY = 'easylm_active_skill_adapters';

function loadPersistedSkillAdapters(): void {
  try {
    if (typeof localStorage === 'undefined') return;
    const raw = localStorage.getItem(ACTIVE_SKILL_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      for (const [k, v] of Object.entries(parsed)) {
        if (typeof v === 'string') activeSkillAdapterByModel.set(k, v);
      }
    }
  } catch {
    // ignore storage errors
  }
}
loadPersistedSkillAdapters();

export function getAdapterConfig(idOrRepo: string): AdapterMetadata | undefined {
  const clean = idOrRepo.replace(/^Bluebarrels\//i, '');
  if (OFFICIAL_ADAPTERS[clean]) {
    return OFFICIAL_ADAPTERS[clean];
  }
  if (OFFICIAL_ADAPTERS[idOrRepo]) {
    return OFFICIAL_ADAPTERS[idOrRepo];
  }
  return Object.values(OFFICIAL_ADAPTERS).find(
    a => a.repoId.toLowerCase() === idOrRepo.toLowerCase() || a.id.toLowerCase() === idOrRepo.toLowerCase()
  );
}

export function getAdaptersForModel(baseModelOrId: string): AdapterMetadata[] {
  const norm = baseModelOrId.toLowerCase();
  // Match tier suffix for easylm-bonsai-2-{2b,4b,9b,27b}
  const bonsaiMatch = norm.match(/bonsai-2-(2b|4b|9b|27b)/);
  if (bonsaiMatch) {
    const tier = bonsaiMatch[1];
    return Object.values(OFFICIAL_ADAPTERS).filter(
      a => a.id.toLowerCase().includes(`bonsai-2-${tier}`) || a.baseModel.toLowerCase().includes(`bonsai-2-${tier}`)
    );
  }
  // Match tier suffix for gemma-4-{e2b,e4b,12b}
  const gemmaMatch = norm.match(/gemma-4-(e2b|e4b|12b)/);
  if (gemmaMatch) {
    const tier = gemmaMatch[1];
    return Object.values(OFFICIAL_ADAPTERS).filter(
      a => a.id.toLowerCase().includes(`gemma-4-${tier}`) || a.baseModel.toLowerCase().includes(`gemma-4-${tier}`)
    );
  }
  return Object.values(OFFICIAL_ADAPTERS).filter(
    a => a.baseModel.toLowerCase() === norm ||
         norm.includes(a.baseModel.toLowerCase().replace(/.*\//, '')) ||
         a.baseModel.toLowerCase().includes(norm)
  );
}

export function getActiveSkillAdapter(modelId: string): AdapterMetadata | undefined {
  const overrideId = activeSkillAdapterByModel.get(modelId);
  if (overrideId && OFFICIAL_ADAPTERS[overrideId]) {
    return OFFICIAL_ADAPTERS[overrideId];
  }
  return getAdapterConfig(modelId);
}

export function setActiveSkillAdapter(modelId: string, adapterId: string | null): void {
  if (!adapterId || adapterId === modelId) {
    activeSkillAdapterByModel.delete(modelId);
  } else if (OFFICIAL_ADAPTERS[adapterId]) {
    activeSkillAdapterByModel.set(modelId, adapterId);
  }
  try {
    if (typeof localStorage !== 'undefined') {
      const obj: Record<string, string> = {};
      for (const [k, v] of activeSkillAdapterByModel.entries()) {
        obj[k] = v;
      }
      localStorage.setItem(ACTIVE_SKILL_STORAGE_KEY, JSON.stringify(obj));
    }
  } catch {
    // ignore
  }
}

export function getVerifiedAdapterState(idOrRepo: string): VerifiedAdapterState | undefined {
  const meta = getAdapterConfig(idOrRepo);
  return meta ? verifiedAdapterCache.get(meta.id) : undefined;
}

/**
 * Fetches and verifies a live PEFT LoRA adapter from Hugging Face (`Bluebarrels/*`),
 * validating both `adapter_config.json` and the binary `adapter_model.safetensors` header.
 */
export async function fetchAndVerifyAdapter(idOrRepo: string): Promise<VerifiedAdapterState | null> {
  const meta = getAdapterConfig(idOrRepo);
  if (!meta || typeof fetch === 'undefined') return null;

  const cached = verifiedAdapterCache.get(meta.id);
  if (cached && cached.headerVerified) {
    return cached;
  }

  try {
    const cfgResp = await fetch(meta.configUrl);
    if (!cfgResp.ok) return null;
    const cfgJson = await cfgResp.json();

    let trainLoss: number | undefined;
    let recordsTrained: number | undefined;
    try {
      const metaUrl = `https://huggingface.co/${meta.repoId}/raw/main/training_metadata.json`;
      const metaResp = await fetch(metaUrl);
      if (metaResp.ok) {
        const tm = await metaResp.json();
        if (typeof tm?.training_metrics?.final_train_loss === 'number') {
          trainLoss = tm.training_metrics.final_train_loss;
        } else if (typeof tm?.train_loss === 'number') {
          trainLoss = tm.train_loss;
        }
        if (typeof tm?.dataset?.conversations === 'number') {
          recordsTrained = tm.dataset.conversations;
        }
      }
    } catch {
      // optional metadata
    }

    // Fetch first 64KB of adapter_model.safetensors to verify binary SafeTensors header without blocking on full tensor download
    let tensorCount = 0;
    let headerVerified = false;
    try {
      const stResp = await fetch(meta.weightsUrl, {
        headers: { Range: 'bytes=0-65535' }
      });
      if (stResp.ok || stResp.status === 206) {
        const buf = await stResp.arrayBuffer();
        if (buf.byteLength >= 8) {
          const view = new DataView(buf);
          const headerLen = Number(view.getBigUint64(0, true));
          if (headerLen > 2 && buf.byteLength >= 8 + headerLen) {
            const { header } = parseSafeTensorsHeader(buf);
            tensorCount = Object.keys(header).filter(k => k !== '__metadata__').length;
            headerVerified = tensorCount > 0;
          } else if (headerLen > 2) {
            // Header exceeds 64KB (e.g., 32-64 layer model with 400+ LoRA tensors): fetch exact header slice
            const fullHeaderResp = await fetch(meta.weightsUrl, {
              headers: { Range: `bytes=0-${8 + headerLen + 16}` }
            });
            if (fullHeaderResp.ok || fullHeaderResp.status === 206) {
              const fullBuf = await fullHeaderResp.arrayBuffer();
              const { header } = parseSafeTensorsHeader(fullBuf);
              tensorCount = Object.keys(header).filter(k => k !== '__metadata__').length;
              headerVerified = tensorCount > 0;
            }
          }
        }
      }
    } catch {
      // network/CORS fallback
    }

    const state: VerifiedAdapterState = {
      adapterId: meta.id,
      repoId: meta.repoId,
      verifiedAt: Date.now(),
      headerVerified,
      tensorCount,
      rank: Number(cfgJson?.r || meta.rank || 16),
      alpha: Number(cfgJson?.lora_alpha || meta.alpha || 32),
      baseModel: String(cfgJson?.base_model_name_or_path || meta.baseModel),
      trainLoss,
      recordsTrained
    };
    verifiedAdapterCache.set(meta.id, state);
    return state;
  } catch {
    return null;
  }
}

export function listOfficialAdapters(): AdapterMetadata[] {
  return Object.values(OFFICIAL_ADAPTERS);
}

export function buildAdapterFetchUrl(repoId: string, filename: string): string {
  return `https://huggingface.co/${repoId}/resolve/main/${filename}`;
}
