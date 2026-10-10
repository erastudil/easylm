import {
  CreateMLCEngine,
  MLCEngine,
  InitProgressReport,
  prebuiltAppConfig,
  AppConfig,
  ModelRecord,
  deleteModelAllInfoInCache,
  hasModelInCache
} from '@mlc-ai/web-llm';
import { ModelOption } from '../types';
import { AntiLoopDetector } from './anti_loop';
import {
  budgetTurn,
  capMaxTokens,
  classifyWebGpuFailure,
  estimateMessagesTokens,
  GpuFence,
  MIN_COMPLETION,
  shouldRetryEngineInit
} from './context_budget';

export const CUSTOM_MODEL_RECORDS: ModelRecord[] = [
  // 1. EasyLM Gemma 4 E2B Instruct (2GB / Mobile)
  {
    model: 'https://huggingface.co/welcoma/gemma-4-E2B-it-q4f16_1-MLC',
    model_id: 'easylm-gemma-4-e2b-it',
    model_lib: 'https://huggingface.co/welcoma/gemma-4-E2B-it-q4f16_1-MLC/resolve/main/libs/gemma-4-E2B-it-q4f16_1-MLC-webgpu.wasm',
    low_resource_required: true,
    vram_required_MB: 1650,
    overrides: {
      context_window_size: 4096
    }
  },
  {
    model: 'https://huggingface.co/welcoma/gemma-4-E2B-it-q4f16_1-MLC',
    model_id: 'gemma-4-E2B-it-q4f16_1-MLC',
    model_lib: 'https://huggingface.co/welcoma/gemma-4-E2B-it-q4f16_1-MLC/resolve/main/libs/gemma-4-E2B-it-q4f16_1-MLC-webgpu.wasm',
    low_resource_required: true,
    vram_required_MB: 1650,
    overrides: {
      context_window_size: 4096
    }
  },

  // 2. EasyLM Gemma 4 E4B Thinking (4GB Early Thinking / Reasoning — Default 4B Workhorse)
  {
    model: 'https://huggingface.co/welcoma/gemma-4-E4B-it-q4f16_1-MLC',
    model_id: 'easylm-gemma-4-e4b-it',
    model_lib: 'https://huggingface.co/welcoma/gemma-4-E4B-it-q4f16_1-MLC/resolve/main/libs/gemma-4-E4B-it-q4f16_1-MLC-webgpu.wasm',
    low_resource_required: true,
    vram_required_MB: 3200,
    overrides: {
      context_window_size: 8192
    }
  },
  {
    model: 'https://huggingface.co/welcoma/gemma-4-E4B-it-q4f16_1-MLC',
    model_id: 'gemma-4-E4B-it-q4f16_1-MLC',
    model_lib: 'https://huggingface.co/welcoma/gemma-4-E4B-it-q4f16_1-MLC/resolve/main/libs/gemma-4-E4B-it-q4f16_1-MLC-webgpu.wasm',
    low_resource_required: true,
    vram_required_MB: 3200,
    overrides: {
      context_window_size: 8192
    }
  },

  // 3. EasyLM Qwen 3 4B Instruct (6GB Balanced Workhorse)
  {
    model: 'https://huggingface.co/mlc-ai/Qwen3-4B-q4f16_1-MLC',
    model_id: 'easylm-qwen3-4b-instruct',
    model_lib: 'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0_2_84/base/Qwen3-4B-q4f16_1_cs1k-webgpu.wasm',
    low_resource_required: true,
    vram_required_MB: 3431.59,
    overrides: {
      context_window_size: 16384
    }
  },
  {
    model: 'https://huggingface.co/mlc-ai/Qwen3-4B-q4f16_1-MLC',
    model_id: 'Qwen3-4B-q4f16_1-MLC',
    model_lib: 'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0_2_84/base/Qwen3-4B-q4f16_1_cs1k-webgpu.wasm',
    low_resource_required: true,
    vram_required_MB: 3431.59,
    overrides: {
      context_window_size: 16384
    }
  },

  // 4. EasyLM DeepSeek V4 Distill 9B (8GB Heavyweight Reasoning)
  {
    model: 'https://huggingface.co/mlc-ai/DeepSeek-R1-Distill-Qwen-7B-q4f16_1-MLC',
    model_id: 'easylm-deepseek-v4-distill-9b',
    model_lib: 'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0_2_84/base/Qwen2-7B-Instruct-q4f16_1_cs1k-webgpu.wasm',
    low_resource_required: false,
    vram_required_MB: 5106.67,
    overrides: {
      context_window_size: 16384
    }
  },

  // 5. EasyLM Gemma 4 12B Thinking (12GB Deep Architecture)
  {
    model: 'https://huggingface.co/mlc-ai/gemma-3-12b-it-q4f16_1-MLC',
    model_id: 'easylm-gemma-4-12b-it',
    model_lib: 'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0_2_84/base/gemma-2-9b-it-q4f16_1_cs1k-webgpu.wasm',
    low_resource_required: false,
    vram_required_MB: 8200,
    overrides: {
      context_window_size: 16384
    }
  },
  {
    model: 'https://huggingface.co/mlc-ai/gemma-3-12b-it-q4f16_1-MLC',
    model_id: 'gemma-4-12b-it-q4f16_1-MLC',
    model_lib: 'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0_2_84/base/gemma-2-9b-it-q4f16_1_cs1k-webgpu.wasm',
    low_resource_required: false,
    vram_required_MB: 8200,
    overrides: {
      context_window_size: 16384
    }
  },

  // 6. EasyLM Gemma 4 26B A4B MoE (14GB Mixture-of-Experts)
  {
    model: 'https://huggingface.co/welcoma/Ternary-Bonsai-8B-bonsai_tq_f32-MLC',
    model_id: 'easylm-gemma-4-26b-a4b-it',
    model_lib: 'https://huggingface.co/welcoma/Bonsai-8B-bonsai_q1_f32-MLC/resolve/main/libs/bonsai-8b-bonsai_q1_f32-webgpu.wasm',
    low_resource_required: false,
    vram_required_MB: 8800,
    overrides: {
      context_window_size: 16384
    }
  },

  // 7. EasyLM Bonsai 2 27B (16GB Sovereign Top-End)
  {
    model: 'https://huggingface.co/welcoma/Bonsai-8B-bonsai_q1_f32-MLC',
    model_id: 'easylm-bonsai-2-27b',
    model_lib: 'https://huggingface.co/welcoma/Bonsai-8B-bonsai_q1_f32-MLC/resolve/main/libs/bonsai-8b-bonsai_q1_f32-webgpu.wasm',
    low_resource_required: false,
    vram_required_MB: 6800,
    overrides: {
      context_window_size: 32768
    }
  },
  {
    model: 'https://huggingface.co/welcoma/Bonsai-8B-bonsai_q1_f32-MLC',
    model_id: 'Bonsai-2-27B-MLC',
    model_lib: 'https://huggingface.co/welcoma/Bonsai-8B-bonsai_q1_f32-MLC/resolve/main/libs/bonsai-8b-bonsai_q1_f32-webgpu.wasm',
    low_resource_required: false,
    vram_required_MB: 6800,
    overrides: {
      context_window_size: 32768
    }
  },

  // Backward compatibility alias records
  {
    model: 'https://huggingface.co/mlc-ai/DeepSeek-R1-Distill-Qwen-1.5B-q4f16_1-MLC',
    model_id: 'DeepSeek-R1-Distill-Qwen-1.5B-q4f16_1-MLC',
    model_lib: 'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0_2_84/base/Qwen2-1.5B-Instruct-q4f16_1_cs1k-webgpu.wasm',
    low_resource_required: true,
    vram_required_MB: 1629.75,
    overrides: {
      context_window_size: 4096
    }
  },
  {
    model: 'https://huggingface.co/mlc-ai/gemma-3-12b-it-q4f16_1-MLC',
    model_id: 'gemma-3-12b-it-q4f16_1-MLC',
    model_lib: 'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0_2_84/base/gemma-2-9b-it-q4f16_1_cs1k-webgpu.wasm',
    low_resource_required: false,
    vram_required_MB: 8500,
    overrides: {
      context_window_size: 8192
    }
  }
];

/** VRAM figure from web-llm's model record (prebuiltAppConfig or CUSTOM_MODEL_RECORDS), in MB. */
export function getModelVramMB(modelId: string): number | undefined {
  if (modelId === 'alice' || modelId === 'alice-mind') return 0;
  const rec =
    CUSTOM_MODEL_RECORDS.find(m => m.model_id === modelId) ||
    prebuiltAppConfig.model_list.find(m => m.model_id === modelId);
  return typeof rec?.vram_required_MB === 'number' ? rec.vram_required_MB : undefined;
}

function vramLabel(modelId: string): string {
  const mb = getModelVramMB(modelId);
  return mb === undefined ? 'VRAM unknown' : `~${(mb / 1000).toFixed(1)} GB VRAM`;
}

export const AVAILABLE_MODELS: ModelOption[] = [
  // 4GB Tier (Ultralight / Mobile / Laptops with iGPU)
  {
    id: 'easylm-gemma-4-e2b-it',
    label: 'Gemma 4 E2B Instruct',
    sizeMB: 1200,
    vramEst: vramLabel('easylm-gemma-4-e2b-it'),
    vramTier: '4gb',
    isReasoning: true,
    isFineTuned: true,
    baseModelId: 'google/gemma-4-E2B-it',
    adapterRepo: 'Bluebarrels/easylm-gemma-4-e2b-it',
    adapterUrl: 'https://huggingface.co/Bluebarrels/easylm-gemma-4-e2b-it',
    description: 'EasyLM ultralight foundation fine-tuned on the 32 sovereign academic stacks, AtMem atomic memory, and Progen syntax for mobile and low-spec runtimes.'
  },
  {
    id: 'easylm-gemma-4-e4b-it',
    label: 'Gemma 4 E4B Thinking',
    sizeMB: 2400,
    vramEst: vramLabel('easylm-gemma-4-e4b-it'),
    vramTier: '4gb',
    isDefault: true,
    isRecommended: true,
    isReasoning: true,
    isFineTuned: true,
    baseModelId: 'google/gemma-4-E4B-it',
    adapterRepo: 'Bluebarrels/easylm-gemma-4-e4b-it',
    adapterUrl: 'https://huggingface.co/Bluebarrels/easylm-gemma-4-e4b-it',
    description: 'EasyLM dense reasoning foundation with native Thinking Mode fine-tuned on academic stacks, mathematical derivations, and Hands tool execution.'
  },

  // 8GB Tier (Standard / Laptops / Balanced Workhorse & Heavyweight Reasoning)
  {
    id: 'easylm-qwen3-4b-instruct',
    label: 'Qwen 3 4B Instruct',
    sizeMB: 2500,
    vramEst: vramLabel('easylm-qwen3-4b-instruct'),
    vramTier: '8gb',
    isFineTuned: true,
    baseModelId: 'Qwen/Qwen3-4B-Instruct-2507',
    adapterRepo: 'Bluebarrels/easylm-qwen3-4b-instruct',
    adapterUrl: 'https://huggingface.co/Bluebarrels/easylm-qwen3-4b-instruct',
    description: 'EasyLM everyday workhorse fine-tuned for high-speed WebGPU execution, structured JSON schema generation, and Hands tool dispatch.'
  },
  {
    id: 'easylm-deepseek-v4-distill-9b',
    label: 'DeepSeek V4 Distill 9B',
    sizeMB: 4800,
    vramEst: vramLabel('easylm-deepseek-v4-distill-9b'),
    vramTier: '8gb',
    isReasoning: true,
    isFineTuned: true,
    baseModelId: 'deepseek-ai/DeepSeek-V4-Distill-Qwen3.5-9B',
    adapterRepo: 'Bluebarrels/easylm-deepseek-v4-distill-9b',
    adapterUrl: 'https://huggingface.co/Bluebarrels/easylm-deepseek-v4-distill-9b',
    description: 'EasyLM reasoning flagship fine-tuned on formal stack proofs, ZCABS stability invariants, and DeepSeek V4.1 chain-of-thought distillations.'
  },

  // 16GB Tier (High Performance / Power Workstations)
  {
    id: 'easylm-gemma-4-12b-it',
    label: 'Gemma 4 12B Thinking',
    sizeMB: 7100,
    vramEst: vramLabel('easylm-gemma-4-12b-it'),
    vramTier: '16gb',
    isReasoning: true,
    isFineTuned: true,
    baseModelId: 'google/gemma-4-12B-it',
    adapterRepo: 'Bluebarrels/easylm-gemma-4-12b-it',
    adapterUrl: 'https://huggingface.co/Bluebarrels/easylm-gemma-4-12b-it',
    description: 'EasyLM deep architecture foundation fine-tuned on systems engineering, long-context multi-document reasoning, and epistemic resolution.'
  },
  {
    id: 'easylm-gemma-4-26b-a4b-it',
    label: 'Gemma 4 26B A4B MoE',
    sizeMB: 8800,
    vramEst: vramLabel('easylm-gemma-4-26b-a4b-it'),
    vramTier: '16gb',
    isCoding: true,
    isFineTuned: true,
    baseModelId: 'google/diffusiongemma-26B-A4B-it',
    adapterRepo: 'Bluebarrels/easylm-gemma-4-26b-a4b-it',
    adapterUrl: 'https://huggingface.co/Bluebarrels/easylm-gemma-4-26b-a4b-it',
    description: 'EasyLM MoE foundation featuring discrete text diffusion fine-tuned on rapid program synthesis, abstract syntax tree manipulation, and AST transforms.'
  },
  {
    id: 'easylm-bonsai-2-27b',
    label: 'Bonsai 2 27B',
    sizeMB: 5950,
    vramEst: vramLabel('easylm-bonsai-2-27b'),
    vramTier: '16gb',
    isReasoning: true,
    isFineTuned: true,
    baseModelId: 'prism-ml/Ternary-Bonsai-2-27B',
    adapterRepo: 'Bluebarrels/easylm-bonsai-2-27b',
    adapterUrl: 'https://huggingface.co/Bluebarrels/easylm-bonsai-2-27b',
    description: 'EasyLM top-end sovereign synthesis model fine-tuned on the full academic corpus, Alice cognitive mind integration, and autonomous agent loops.'
  }
];

export const ALLOWED_MODEL_IDS = new Set(AVAILABLE_MODELS.map(m => m.id));

/** Curated picker ids, fixed at build time. Custom Hugging Face registrations never join this set. */
export const CURATED_MODEL_IDS: ReadonlySet<string> = new Set(AVAILABLE_MODELS.map(m => m.id));

/**
 * Largest general model that is smaller than `modelId` (by vram_required_MB),
 * optionally capped at `maxMB`. Reasoning and coding specialists are skipped.
 */
export function nextSmallerModel(
  modelId: string,
  maxMB?: number,
  exclude?: ReadonlySet<string>,
  candidates: readonly ModelOption[] = AVAILABLE_MODELS
): string | undefined {
  const current = getModelVramMB(modelId) ?? Infinity;
  let best: { id: string; mb: number } | undefined;
  for (const m of candidates) {
    if (m.id === modelId || m.id === 'alice') continue;
    if (exclude?.has(m.id)) continue;
    const mb = getModelVramMB(m.id);
    if (mb === undefined || mb >= current) continue;
    if (maxMB !== undefined && mb > maxMB) continue;
    if (!best || mb > best.mb) best = { id: m.id, mb };
  }
  return best?.id;
}

/**
 * Models a kid profile never runs (picker, saved selection, recommendation, load, step-down).
 * SmolLM2 360M failed the Kid Safe A and C checks on 2026-10-02 (PR #4).
 */
export const KID_MODE_EXCLUDED_MODELS: ReadonlySet<string> = new Set(['SmolLM2-360M-Instruct-q4f16_1-MLC']);

/** Model a kid profile uses in place of any model outside the kid allowlist. */
export const KID_MODE_MODEL_ID = 'Llama-3.2-1B-Instruct-q4f16_1-MLC';

/**
 * Kid-only picker records. Llama 3.2 1B Instruct runs from web-llm's prebuilt record and
 * appears on kid profiles; adult profiles use AVAILABLE_MODELS.
 */
export const KID_MODEL_OPTIONS: ModelOption[] = [
  {
    id: 'Llama-3.2-1B-Instruct-q4f16_1-MLC',
    label: 'Llama 3.2 1B Instruct',
    sizeMB: 663,
    vramEst: vramLabel('Llama-3.2-1B-Instruct-q4f16_1-MLC'),
    vramTier: '4gb',
    description: 'Meta compact 1B. The kid profile model, checked with Kid Safe A/B/C.'
  }
];

/** Every model a kid profile can be offered: the curated catalog plus the kid-only records. */
const KID_CATALOG: readonly ModelOption[] = [
  ...AVAILABLE_MODELS,
  ...KID_MODEL_OPTIONS.filter(k => !CURATED_MODEL_IDS.has(k.id))
];

/**
 * Kid allowlist, by explicit model id. A kid profile runs these models and only these.
 * Llama 3.2 1B Instruct is the one model with Kid Safe A/B/C evidence on file (PR #4).
 * The remaining ids are grandfathered from PR #4 and queued for Kid Safe A/B/C runs,
 * 7-8B models first; each one counts while it is in the catalog.
 * A new model joins this list after it passes Kid Safe A/B/C. Fine-tuned models,
 * adapters and custom Hugging Face ids stay on adult profiles.
 */
export const KID_ALLOWED_MODEL_ID_LIST = [
  'Llama-3.2-1B-Instruct-q4f16_1-MLC',
  'Qwen2.5-3B-Instruct-q4f16_1-MLC',
  'Llama-3.2-3B-Instruct-q4f16_1-MLC',
  'DeepSeek-R1-Distill-Qwen-7B-q4f16_1-MLC',
  'Phi-3.5-mini-instruct-q4f16_1-MLC',
  'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',
  'DeepSeek-R1-Distill-Qwen-1.5B-q4f16_1-MLC',
  'SmolLM2-1.7B-Instruct-q4f16_1-MLC',
  'gemma-2-2b-it-q4f16_1-MLC',
  'gemma-2-9b-it-q4f16_1-MLC',
  'Qwen2.5-7B-Instruct-q4f16_1-MLC',
  'Llama-3.1-8B-Instruct-q4f16_1-MLC',
  'Mistral-7B-Instruct-v0.3-q4f16_1-MLC',
  'Qwen2.5-Coder-7B-Instruct-q4f16_1-MLC'
] as const;

function isKidEligibleRecord(m: ModelOption): boolean {
  return !m.isFineTuned && !m.adapterRepo && !m.baseModelId;
}

export const KID_ALLOWED_MODEL_IDS: ReadonlySet<string> = new Set(
  KID_ALLOWED_MODEL_ID_LIST.filter(id => {
    const option = KID_CATALOG.find(m => m.id === id);
    return !!option && isKidEligibleRecord(option) && !KID_MODE_EXCLUDED_MODELS.has(id);
  })
);

export function isModelAllowedForKid(modelId: string): boolean {
  return KID_ALLOWED_MODEL_IDS.has(modelId);
}

/** Picker record for any id in the curated catalog or the kid-only records. */
export function findModelOption(modelId: string): ModelOption | undefined {
  return KID_CATALOG.find(m => m.id === modelId);
}

// Load-path guard: set by the app whenever the active profile changes.
let engineKidMode = false;
export function setEngineKidMode(on: boolean): void {
  engineKidMode = on;
}
export function isEngineKidMode(): boolean {
  return engineKidMode;
}

/** Returns the model to run for the active profile: ids outside the kid allowlist map to KID_MODE_MODEL_ID in Kid mode. */
export function modelForProfile(modelId: string, kidMode: boolean): string {
  return kidMode && !isModelAllowedForKid(modelId) ? KID_MODE_MODEL_ID : modelId;
}

/** Picker list for the active profile. */
export function modelsForProfile(kidMode: boolean): ModelOption[] {
  return kidMode ? KID_CATALOG.filter(m => isModelAllowedForKid(m.id)) : AVAILABLE_MODELS;
}

/**
 * Model to select after a load was interrupted (tab killed mid-load).
 * In Kid mode the step-down stays on the kid allowlist; when nothing else fits,
 * it returns undefined so the app keeps the current model with auto-load off.
 */
export function crashStepDownModel(
  interruptedId: string,
  opts: { maxMB?: number; kidMode?: boolean } = {}
): string | undefined {
  return opts.kidMode
    ? nextSmallerModel(interruptedId, opts.maxMB, undefined, modelsForProfile(true))
    : nextSmallerModel(interruptedId, opts.maxMB);
}

/** iOS model swap after OOM stays under 1 GB. The 2 GB device budget is a separate gate. */
export const OOM_IOS_SWAP_MAX_MB = 1000;

const ADULT_DESKTOP_OOM_FALLBACK_ID = 'easylm-gemma-4-e2b-it';

/**
 * Model to try after an out-of-memory failure.
 * Undefined means keep the current model and only shrink the context window.
 * Engine init does not call this. A swap has to go through here.
 * A kid profile gets Llama 3.2 1B when that id is on the kid allowlist.
 * iOS gets a model under 1 GB, or no swap.
 */
export function getOomFallbackModel(input: {
  kidMode: boolean;
  isIOS: boolean;
  currentModelId?: string;
}): string | undefined {
  const current = input.currentModelId;

  if (input.kidMode) {
    const id = KID_MODE_MODEL_ID;
    if (!isModelAllowedForKid(id) || current === id) return undefined;
    if (input.isIOS) {
      const mb = getModelVramMB(id);
      if (mb === undefined || mb >= OOM_IOS_SWAP_MAX_MB) return undefined;
    }
    return id;
  }

  if (input.isIOS) {
    let best: { id: string; mb: number } | undefined;
    for (const m of AVAILABLE_MODELS) {
      if (m.id === current) continue;
      const mb = getModelVramMB(m.id);
      if (mb === undefined || mb >= OOM_IOS_SWAP_MAX_MB) continue;
      if (!best || mb < best.mb) best = { id: m.id, mb };
    }
    return best?.id;
  }

  if (!current || current === ADULT_DESKTOP_OOM_FALLBACK_ID) {
    return current ? undefined : ADULT_DESKTOP_OOM_FALLBACK_ID;
  }
  const nextMb = getModelVramMB(ADULT_DESKTOP_OOM_FALLBACK_ID);
  const curMb = getModelVramMB(current);
  if (nextMb === undefined || curMb === undefined || nextMb >= curMb) return undefined;
  return ADULT_DESKTOP_OOM_FALLBACK_ID;
}

// Crash-loop breaker: a tab killed mid-load (iOS memory limit) leaves this key behind.
export const LOADING_FLAG_KEY = 'easylm_loading_model';

function setLoadingFlag(modelId: string | null): void {
  try {
    if (typeof localStorage === 'undefined') return;
    if (modelId) localStorage.setItem(LOADING_FLAG_KEY, modelId);
    else localStorage.removeItem(LOADING_FLAG_KEY);
  } catch {
    // storage unavailable
  }
}

/** Returns the model id whose load never finished on a previous visit, and clears the flag. */
export function takeInterruptedLoad(): string | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const id = localStorage.getItem(LOADING_FLAG_KEY);
    if (id) localStorage.removeItem(LOADING_FLAG_KEY);
    return id;
  } catch {
    return null;
  }
}

export const EASYLM_APP_CONFIG: AppConfig = {
  ...prebuiltAppConfig,
  model_list: [
    ...prebuiltAppConfig.model_list.filter(m => ALLOWED_MODEL_IDS.has(m.model_id) || KID_ALLOWED_MODEL_IDS.has(m.model_id)),
    ...CUSTOM_MODEL_RECORDS
  ]
};

/** Registers a custom Hugging Face model for adult profiles. Returns false (and registers nothing) in Kid mode. */
export function registerCustomHFModel(record: ModelRecord, kidMode: boolean = engineKidMode): boolean {
  if (kidMode) return false;
  CUSTOM_MODEL_RECORDS.push(record);
  ALLOWED_MODEL_IDS.add(record.model_id);
  if (!EASYLM_APP_CONFIG.model_list.some(m => m.model_id === record.model_id)) {
    EASYLM_APP_CONFIG.model_list.push(record);
  }
  return true;
}

/**
 * Safely inspect if an MLCEngine is instantiated, loaded, and not disposed by WebGPU device loss.
 */
export function isEngineAlive(engine: MLCEngine | null, modelId?: string): boolean {
  if (!engine) return false;
  try {
    const pipelines = (engine as any).loadedModelIdToPipeline;
    if (!pipelines || !(pipelines instanceof Map) || pipelines.size === 0) {
      return false;
    }
    const targetModel = modelId || currentLoadedModel || pipelines.keys().next().value;
    if (targetModel && !pipelines.has(targetModel)) {
      return false;
    }
    const pipeline = pipelines.get(targetModel);
    if (!pipeline) return false;

    // Disposed TVM handles equal 0
    if (pipeline.decoding && ((pipeline.decoding as any).handle === 0 || (pipeline.decoding as any)._tvmPackedCell?.handle === 0)) {
      return false;
    }
    if (pipeline.tvm && ((pipeline.tvm as any).handle === 0 || (pipeline.tvm as any).webGPUContext?.device === null)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function isEngineReady(): boolean {
  return isEngineAlive(activeEngine, currentLoadedModel);
}

export function getLoadedModelId(): string {
  return currentLoadedModel;
}

export async function unloadActiveEngine(): Promise<void> {
  if (activeEngine) {
    try {
      await activeEngine.unload();
    } catch {
      // ignore
    }
    activeEngine = null;
    currentLoadedModel = '';
  }
  clearGpuFence();
}

export const DEFAULT_MODEL_ID = 'easylm-gemma-4-e4b-it';

export interface ProgressStatus {
  text: string;
  progress: number;
}

let activeEngine: MLCEngine | null = null;
let currentLoadedModel: string = '';
let currentContextLimit: number = 4096;
let isInitializing: boolean = false;
let initPromise: Promise<MLCEngine> | null = null;
let gpuFence: GpuFence = null;

export function getGpuFence(): GpuFence {
  return gpuFence;
}

export function markGpuFence(kind: GpuFence): void {
  if (kind) gpuFence = kind;
}

export function clearGpuFence(): void {
  gpuFence = null;
}

function applyFailureFence(err: unknown): ReturnType<typeof classifyWebGpuFailure> {
  const kind = classifyWebGpuFailure(err);
  if (kind === 'gpu_process_dead') {
    gpuFence = 'process_dead';
  } else if (kind === 'device_lost') {
    if (gpuFence !== 'process_dead') gpuFence = 'lost';
  }
  return kind;
}

function armDeviceLostFence(engine: MLCEngine): void {
  try {
    const pipelines = (engine as unknown as { loadedModelIdToPipeline?: Map<string, unknown> }).loadedModelIdToPipeline;
    if (!pipelines) return;
    for (const pipeline of pipelines.values()) {
      const device = (pipeline as {
        tvm?: { webGPUContext?: { device?: { lost?: Promise<{ reason?: string }>; __easylm_lost_armed?: boolean } } }
      })?.tvm?.webGPUContext?.device;
      if (device && typeof device.lost?.then === 'function' && !device.__easylm_lost_armed) {
        device.__easylm_lost_armed = true;
        device.lost.then((info) => {
          const reason = String(info?.reason || 'unknown').toLowerCase();
          if (reason !== 'destroyed') {
            gpuFence = 'lost';
          }
          activeEngine = null;
          currentLoadedModel = '';
          isInitializing = false;
          initPromise = null;
        }).catch(() => {
          gpuFence = 'lost';
          activeEngine = null;
          currentLoadedModel = '';
        });
      }
    }
  } catch {
    // ignore
  }
}

let highPerformanceFailed = false;

function adjustDescriptorForAdapter(descriptor: any, targetAdapter: any): any {
  if (!descriptor) return descriptor;
  const copy = { ...descriptor };
  if (copy.requiredLimits && targetAdapter.limits) {
    const limits: Record<string, number> = {};
    for (const [k, v] of Object.entries(copy.requiredLimits)) {
      if (typeof v === 'number' && typeof targetAdapter.limits[k] === 'number') {
        limits[k] = Math.min(v, targetAdapter.limits[k]);
      } else {
        limits[k] = v as number;
      }
    }
    copy.requiredLimits = limits;
  }
  if (Array.isArray(copy.requiredFeatures) && targetAdapter.features) {
    copy.requiredFeatures = copy.requiredFeatures.filter((f: string) => targetAdapter.features.has(f));
  }
  return copy;
}

function wrapAdapterWithDeviceFallback(
  adapter: any,
  originalRequestAdapter: (opts?: any) => Promise<any>
): any {
  if (!adapter || typeof adapter.requestDevice !== 'function' || adapter.__easylm_wrapped) {
    return adapter;
  }
  adapter.__easylm_wrapped = true;
  const originalRequestDevice = adapter.requestDevice.bind(adapter);

  adapter.requestDevice = async function (descriptor?: any) {
    try {
      return await originalRequestDevice(descriptor);
    } catch (err: any) {
      const msg = String(err?.message || err || '');
      const isDeviceRemoved =
        msg.includes('DEVICE_REMOVED') ||
        msg.includes('0x887A0005') ||
        msg.includes('create command queue failed') ||
        msg.includes('DeviceRemoved') ||
        msg.includes('device was lost') ||
        msg.includes('Device is lost') ||
        msg.includes('device_removed');

      if (isDeviceRemoved) {
        console.warn('[WebGPU] adapter.requestDevice failed with DXGI_ERROR_DEVICE_REMOVED. Bypassing broken discrete GPU and attempting fallback adapter...', err);
        highPerformanceFailed = true;

        // Try fallback adapters: low-power (integrated GPU) or default
        const fallbackOptions = [{ powerPreference: 'low-power' }, undefined];
        for (const fbOpts of fallbackOptions) {
          try {
            const fallbackAdapter = await originalRequestAdapter(fbOpts);
            if (fallbackAdapter && fallbackAdapter !== adapter) {
              console.warn('[WebGPU] Found alternative adapter, requesting device on fallback...');
              const adjustedDesc = adjustDescriptorForAdapter(descriptor, fallbackAdapter);
              const device = await fallbackAdapter.requestDevice(adjustedDesc);
              if (device) {
                console.warn('[WebGPU] Successfully recovered using fallback adapter device!');
                return device;
              }
            }
          } catch (fbErr) {
            console.warn('[WebGPU] Fallback adapter requestDevice notice:', fbErr);
          }
        }
      }
      throw err;
    }
  };

  return adapter;
}

/**
 * Resilient WebGPU adapter request wrapper.
 * If high-performance powerPreference fails (e.g. discrete GPU is sleeping, crashed,
 * or blocked by browser process), falls back gracefully through default, low-power, or retries.
 * Wraps adapter.requestDevice to handle DXGI_ERROR_DEVICE_REMOVED on Windows Direct3D 12.
 */
export function patchWebGPUAdapterFallback(): void {
  if (typeof navigator !== 'undefined' && 'gpu' in navigator && (navigator as any).gpu) {
    const gpu = (navigator as any).gpu;
    if (gpu.__easylm_fallback_patched) return;
    const originalRequestAdapter = gpu.__easylm_orig_requestAdapter || gpu.requestAdapter.bind(gpu);
    gpu.__easylm_orig_requestAdapter = originalRequestAdapter;
    gpu.requestAdapter = async function (options?: any) {
      if (gpuFence === 'process_dead') return null;

      let effectiveOptions = options;
      if (highPerformanceFailed && options?.powerPreference === 'high-performance') {
        effectiveOptions = undefined;
      }

      // 1. Try requested/effective options
      try {
        const adapter = await originalRequestAdapter(effectiveOptions);
        if (adapter) return wrapAdapterWithDeviceFallback(adapter, originalRequestAdapter);
      } catch (e) {
        console.warn('[WebGPU] Primary adapter request failed:', e);
      }

      // 2. Fallback: try default adapter (no power preference)
      if (effectiveOptions?.powerPreference) {
        try {
          console.warn('[WebGPU] Retrying with default power preference...');
          const fallbackAdapter = await originalRequestAdapter();
          if (fallbackAdapter) return wrapAdapterWithDeviceFallback(fallbackAdapter, originalRequestAdapter);
        } catch {
          // ignore
        }
      }

      // 3. Fallback: try low-power adapter (integrated GPU)
      if (effectiveOptions?.powerPreference !== 'low-power') {
        try {
          console.warn('[WebGPU] Retrying with low-power adapter...');
          const lowPowerAdapter = await originalRequestAdapter({ powerPreference: 'low-power' });
          if (lowPowerAdapter) return wrapAdapterWithDeviceFallback(lowPowerAdapter, originalRequestAdapter);
        } catch {
          // ignore
        }
      }

      // 4. Fallback: try high-performance adapter if options was empty/undefined and high-performance hasn't failed
      if (!effectiveOptions?.powerPreference && !highPerformanceFailed) {
        try {
          console.warn('[WebGPU] Retrying with high-performance adapter...');
          const hpAdapter = await originalRequestAdapter({ powerPreference: 'high-performance' });
          if (hpAdapter) return wrapAdapterWithDeviceFallback(hpAdapter, originalRequestAdapter);
        } catch {
          // ignore
        }
      }

      // 5. Brief backoff retry (60ms) if GPU process was transitioning
      try {
        await new Promise(resolve => setTimeout(resolve, 60));
        const retryAdapter = await originalRequestAdapter();
        if (retryAdapter) return wrapAdapterWithDeviceFallback(retryAdapter, originalRequestAdapter);
      } catch {
        // ignore
      }

      return null;
    };
    (navigator.gpu as any).__easylm_fallback_patched = true;
  }
}

// Automatically apply adapter fallback wrapper in browser environment
patchWebGPUAdapterFallback();

/**
 * Resilient WebGPU adapter lookup with automatic cascading fallback:
 * 1. Requested power preference (e.g. 'high-performance' for discrete GPU)
 * 2. System default (no preference)
 * 3. Low-power (integrated GPU / battery)
 * 4. Microtask retry in case GPU process was briefly locked
 */
export async function getWebGPUAdapter(preferredPower: 'low-power' | 'high-performance' = 'high-performance'): Promise<any | null> {
  if (typeof navigator === 'undefined' || !('gpu' in navigator) || !(navigator as any).gpu) {
    return null;
  }
  const gpu = (navigator as any).gpu;

  const tryRequest = async (opts?: any) => {
    try {
      const adapter = await gpu.requestAdapter(opts);
      if (adapter) return adapter;
    } catch (e) {
      console.warn('[WebGPU] Adapter request notice:', e);
    }
    return null;
  };

  // Preference 1: Preferred
  let adapter = await tryRequest({ powerPreference: preferredPower });
  if (adapter) return adapter;

  // Preference 2: System Default (no powerPreference)
  adapter = await tryRequest();
  if (adapter) return adapter;

  // Preference 3: Low-power (integrated GPU)
  if (preferredPower !== 'low-power') {
    adapter = await tryRequest({ powerPreference: 'low-power' });
    if (adapter) return adapter;
  }

  // Preference 4: Brief backoff retry (helps if browser GPU process was re-initializing)
  await new Promise(resolve => setTimeout(resolve, 60));
  adapter = await tryRequest();
  if (adapter) return adapter;

  return null;
}

export interface CacheClearResult {
  success: boolean;
  modelId?: string;
  clearedCaches: string[];
  message: string;
  error?: string;
}

/**
 * Check if a model is currently cached in the browser's CacheStorage.
 */
export async function hasCachedModel(modelId: string): Promise<boolean> {
  try {
    if (typeof caches === 'undefined') return false;
    return await hasModelInCache(modelId, EASYLM_APP_CONFIG);
  } catch {
    return false;
  }
}

/**
 * Clear cached model weights, WASM binaries, and configs from browser CacheStorage and IndexedDB.
 * If modelId is provided, attempts targeted eviction for that model first, then cleans related entries.
 * If modelId is omitted, performs a comprehensive purge of all WebLLM / MLC / TVM caches.
 */
export async function clearModelCache(modelId?: string): Promise<CacheClearResult> {
  const clearedCaches: string[] = [];
  let errorMsg: string | undefined = undefined;

  try {
    // 1. If modelId provided, use WebLLM's targeted deletion first
    if (modelId && typeof caches !== 'undefined') {
      try {
        await deleteModelAllInfoInCache(modelId, EASYLM_APP_CONFIG);
        clearedCaches.push(`webllm-model:${modelId}`);
      } catch (err: any) {
        console.warn(`[Cache] Targeted deletion for ${modelId} encountered notice:`, err);
      }
    }

    // 2. Direct browser CacheStorage cleanup
    if (typeof caches !== 'undefined') {
      try {
        const cacheKeys = await caches.keys();
        for (const key of cacheKeys) {
          const lowerKey = key.toLowerCase();
          const isWebLLMCache = lowerKey.includes('webllm') || lowerKey.includes('mlc') || lowerKey.includes('tvm');

          if (!modelId && isWebLLMCache) {
            // Full purge: delete all webllm caches
            const ok = await caches.delete(key);
            if (ok) clearedCaches.push(key);
          } else if (modelId && isWebLLMCache) {
            // Targeted purge inside the cache
            try {
              const cache = await caches.open(key);
              const requests = await cache.keys();
              for (const req of requests) {
                if (req.url.includes(modelId) || req.url.toLowerCase().includes(modelId.toLowerCase())) {
                  await cache.delete(req);
                  clearedCaches.push(`${key}:${req.url.split('/').pop()}`);
                }
              }
            } catch {
              // ignore
            }
          }
        }
      } catch (err: any) {
        console.warn('[Cache] CacheStorage inspection notice:', err);
      }
    }

    // 3. IndexedDB cleanup for WebLLM tensor databases if full purge
    if (!modelId && typeof indexedDB !== 'undefined') {
      const knownDbs = ['webllm/model', 'webllm/wasm', 'webllm/config', 'webllm', 'tvmjs'];
      for (const dbName of knownDbs) {
        try {
          indexedDB.deleteDatabase(dbName);
          clearedCaches.push(`idb:${dbName}`);
        } catch {
          // ignore
        }
      }
      if ('databases' in indexedDB && typeof (indexedDB as any).databases === 'function') {
        try {
          const dbs = await (indexedDB as any).databases();
          if (Array.isArray(dbs)) {
            for (const db of dbs) {
              if (db.name && (db.name.includes('webllm') || db.name.includes('tvm') || db.name.includes('mlc'))) {
                indexedDB.deleteDatabase(db.name);
                clearedCaches.push(`idb:${db.name}`);
              }
            }
          }
        } catch {
          // ignore
        }
      }
    }

    return {
      success: true,
      modelId,
      clearedCaches,
      message: modelId
        ? `Model cache for ${modelId} cleared successfully.`
        : `All WebLLM weight caches purged successfully (${clearedCaches.length} targets cleaned).`
    };
  } catch (err: any) {
    errorMsg = err?.message || String(err);
    return {
      success: false,
      modelId,
      clearedCaches,
      message: `Failed to clear cache: ${errorMsg}`,
      error: errorMsg
    };
  }
}

/**
 * Fully reset WebGPU runtime state, unload engine, clear cache, and re-arm adapter fallback.
 */
export async function resetWebGPUAndCaches(modelId?: string): Promise<{ success: boolean; message: string }> {
  // 1. Unload active engine
  await unloadActiveEngine();
  activeEngine = null;
  currentLoadedModel = '';
  isInitializing = false;
  initPromise = null;
  clearGpuFence();
  highPerformanceFailed = false;

  // 2. Clear model cache or all caches
  const cacheResult = await clearModelCache(modelId);

  // 3. Ensure WebGPU fallback patch is fresh
  if (typeof navigator !== 'undefined' && (navigator as any).gpu) {
    delete (navigator as any).gpu.__easylm_fallback_patched;
    patchWebGPUAdapterFallback();
  }

  return {
    success: cacheResult.success,
    message: `WebGPU state reset. ${cacheResult.message}`
  };
}

export function isWebGPUSupported(): boolean {
  return typeof navigator !== 'undefined' && 'gpu' in navigator && !!(navigator as any).gpu;
}

/**
 * Initialize WebLLM engine with real-time progress callbacks and custom context window
 */
export async function getOrInitEngine(
  modelId: string = DEFAULT_MODEL_ID,
  onProgress?: (p: ProgressStatus) => void,
  contextWindowSize?: number
): Promise<MLCEngine> {
  if (!isWebGPUSupported()) {
    throw new Error('WebGPU is not supported or not enabled in this browser. Please use Chrome, Edge, or enable WebGPU.');
  }
  if (engineKidMode ? !isModelAllowedForKid(modelId) : !ALLOWED_MODEL_IDS.has(modelId)) {
    throw new Error('That model is not offered in this EasyLM build.');
  }
  if (gpuFence === 'process_dead') {
    throw new Error('Unable to find a compatible GPU. Browser GPU worker is down.');
  }

  const targetContext = contextWindowSize || currentContextLimit;

  // Verify whether active engine is truly alive and matches target model
  if (activeEngine && currentLoadedModel === modelId) {
    if (isEngineAlive(activeEngine, modelId)) {
      if (contextWindowSize && contextWindowSize !== currentContextLimit) {
        currentContextLimit = targetContext;
        try {
          await activeEngine.reload(modelId, { context_window_size: targetContext });
          if (!isEngineAlive(activeEngine, modelId)) {
            throw new Error('Engine reload left pipeline uninitialized');
          }
        } catch (e) {
          console.warn('Could not dynamically reload context window size, re-initializing fresh engine:', e);
          activeEngine = null;
          currentLoadedModel = '';
        }
      }
      if (activeEngine) {
        if (onProgress) {
          onProgress({ text: `Engine resident: ${modelId} active in WebGPU VRAM (${targetContext.toLocaleString()} ctx).`, progress: 1.0 });
        }
        return activeEngine;
      }
    } else {
      console.warn('[WebLLM] Resident engine was disposed or lost. Purging dead instance.');
      activeEngine = null;
      currentLoadedModel = '';
    }
  }

  if (isInitializing && initPromise) {
    return initPromise;
  }

  isInitializing = true;
  initPromise = (async () => {
    try {
      if (activeEngine) {
        try {
          await activeEngine.unload();
        } catch {
          // ignore
        }
        activeEngine = null;
      }

      currentContextLimit = targetContext;
      setLoadingFlag(modelId);
      let engine: MLCEngine;
      try {
        engine = await CreateMLCEngine(
          modelId,
          {
            appConfig: EASYLM_APP_CONFIG,
            initProgressCallback: (report: InitProgressReport) => {
              if (onProgress) {
                onProgress({
                  text: report.text || `Warming weights: ${(report.progress * 100).toFixed(0)}%`,
                  progress: report.progress || 0
                });
              }
            }
          },
          {
            context_window_size: targetContext
          }
        );
      } catch (firstErr: any) {
        const firstMsg = String(firstErr?.message || firstErr || '');
        const isCacheOrNetworkError =
          firstMsg.includes('Cache') ||
          firstMsg.includes('network error') ||
          firstMsg.includes('Failed to execute \'add\' on \'Cache\'') ||
          firstMsg.includes('fetch');

        if (isCacheOrNetworkError) {
          console.warn('[WebLLM] Cache or network failure detected during model load. Purging model cache and retrying with IndexedDB backend...', firstErr);
          if (onProgress) {
            onProgress({ text: 'Repairing model cache and retrying via IndexedDB...', progress: 0.05 });
          }
          await clearModelCache(modelId);

          const fallbackConfig: AppConfig = {
            ...EASYLM_APP_CONFIG,
            cacheBackend: 'indexeddb'
          };
          engine = await CreateMLCEngine(
            modelId,
            {
              appConfig: fallbackConfig,
              initProgressCallback: (report: InitProgressReport) => {
                if (onProgress) {
                  onProgress({
                    text: report.text || `Warming weights (indexeddb): ${(report.progress * 100).toFixed(0)}%`,
                    progress: report.progress || 0
                  });
                }
              }
            },
            {
              context_window_size: targetContext
            }
          );
        } else {
          throw firstErr;
        }
      }

      setLoadingFlag(null);
      activeEngine = engine;
      currentLoadedModel = modelId;
      isInitializing = false;
      gpuFence = null;
      armDeviceLostFence(engine);
      return engine;
    } catch (err: any) {
      setLoadingFlag(null);
      activeEngine = null;
      currentLoadedModel = '';
      isInitializing = false;
      initPromise = null;
      const rawMsg = err?.message || String(err);
      applyFailureFence(rawMsg);
      let hint = '';
      if (
        rawMsg.includes('Unable to find a compatible GPU') ||
        rawMsg.includes('DXGI_ERROR_DEVICE_REMOVED') ||
        rawMsg.includes('0x887A0005') ||
        rawMsg.includes('create command queue failed') ||
        gpuFence === 'process_dead'
      ) {
        hint = ' [Diagnostic: Windows GPU device removed (D3D12 0x887A0005). Use "Restart GPU worker" or hard restart browser.]';
      } else if (rawMsg.includes('maxBufferSize') || rawMsg.includes('allocation')) {
        hint = ' [Diagnostic: Model memory exceeded GPU limits. Try selecting an ultralight model like Gemma 4 E2B.]';
      } else if (
        rawMsg.includes('Cache') ||
        rawMsg.includes('network error') ||
        rawMsg.includes('Integrity') ||
        rawMsg.includes('fetch') ||
        rawMsg.includes('corrupt') ||
        rawMsg.includes('unexpected end') ||
        rawMsg.includes('syntaxerror')
      ) {
        hint = ' [Diagnostic: Model weights or WASM encountered a network or cache error. Click "Clear Cache & Reset WebGPU" or reload.]';
      }
      throw new Error(`WebLLM Model Init Error: ${rawMsg}${hint}`);
    }
  })();

  return initPromise;
}

let abortCurrentGeneration = false;

/**
 * Abort active inference immediately via WebLLM interruptGenerate
 */
export async function stopGeneration(): Promise<void> {
  abortCurrentGeneration = true;
  if (activeEngine) {
    try {
      await activeEngine.interruptGenerate();
    } catch (e) {
      console.warn('Error interrupting generation:', e);
    }
  }
}

/**
 * Stream inference with token chunk callbacks, abort support, anti-loop sentinel.
 * Device-lost / GPU-process-dead fail closed: no auto-reinit.
 */
export async function streamChatCompletion(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  modelId: string = DEFAULT_MODEL_ID,
  temperature: number = 0.4,
  maxTokens: number = 4096,
  onChunk: (chunkText: string) => void,
  onProgress?: (p: ProgressStatus) => void,
  contextWindowSize?: number
): Promise<{ fullText: string; thinking?: string; loopDetected?: boolean; loopReason?: string }> {
  const isReasoning = modelId.includes('DeepSeek-R1') || modelId.includes('Reasoning');
  const effectiveTemperature = isReasoning ? Math.max(0.6, temperature) : temperature;
  const ctx = contextWindowSize || currentContextLimit || 4096;

  if (gpuFence === 'process_dead') {
    throw new Error('Unable to find a compatible GPU. Browser GPU worker is down.');
  }

  const budget = budgetTurn(messages, ctx, { isReasoning });
  if (budget.maxTokens < MIN_COMPLETION) {
    throw new Error('CONTEXT_BUDGET: this turn does not fit the context window. Raise context in Settings or shorten the prompt.');
  }
  const effectiveMaxTokens = Math.min(maxTokens > 0 ? maxTokens : budget.maxTokens, budget.maxTokens);

  let attempt = 0;
  while (attempt < 2) {
    attempt++;
    let engine: MLCEngine;
    try {
      engine = await getOrInitEngine(modelId, onProgress, contextWindowSize);
    } catch (initErr: any) {
      activeEngine = null;
      currentLoadedModel = '';
      applyFailureFence(initErr);
      throw initErr;
    }

    abortCurrentGeneration = false;

    let completion: any;
    try {
      completion = await engine.chat.completions.create({
        messages: budget.messages,
        temperature: effectiveTemperature,
        max_tokens: effectiveMaxTokens,
        stream: true,
        top_p: 0.95,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
      });
    } catch (createErr: any) {
      const kind = applyFailureFence(createErr);
      activeEngine = null;
      currentLoadedModel = '';
      isInitializing = false;
      initPromise = null;

      if (shouldRetryEngineInit(kind, attempt, gpuFence)) {
        console.warn(`[WebLLM] Engine disposed before generation (${createErr?.message}). Retrying once.`);
        if (onProgress) {
          onProgress({ text: 'Engine was unloaded. Re-warming weights...', progress: 0.05 });
        }
        continue;
      }
      throw createErr;
    }

    const antiLoop = new AntiLoopDetector(16000);
    let fullRaw = '';
    let loopDetected = false;
    let loopReason: string | undefined = undefined;

    try {
      for await (const chunk of completion) {
        if (abortCurrentGeneration) {
          break;
        }
        const delta = chunk.choices[0]?.delta?.content || '';
        if (delta) {
          fullRaw += delta;

          // Active Anti-Loop Sentinel Check
          const loopCheck = antiLoop.check(fullRaw);
          if (loopCheck.isLoop) {
            console.warn(`[AntiLoop] Intercepted reasoning/token loop (${loopCheck.reason}). Pruning.`);
            loopDetected = true;
            loopReason = loopCheck.reason;
            await stopGeneration();
            fullRaw = antiLoop.prune(fullRaw, loopCheck);
            break;
          }

          onChunk(delta);
        }
      }
    } catch (err: any) {
      if (abortCurrentGeneration || loopDetected) {
        // Ignored if manually stopped or anti-loop terminated
      } else {
        const kind = applyFailureFence(err);
        activeEngine = null;
        currentLoadedModel = '';
        isInitializing = false;
        initPromise = null;

        if (shouldRetryEngineInit(kind, attempt, gpuFence) && (!fullRaw || fullRaw.length < 20)) {
          console.warn(`[WebLLM] Stream interrupted by disposal (${err?.message}). Retrying once.`);
          if (onProgress) {
            onProgress({ text: 'Engine was unloaded mid-stream. Re-warming weights...', progress: 0.05 });
          }
          continue;
        }
        throw err;
      }
    }

    // Parse <think>...</think> tags if present, including unclosed tags when interrupted mid-thought
    let thinking: string | undefined = undefined;
    let finalContent = fullRaw;

    if (fullRaw.includes('<think>')) {
      const match = fullRaw.match(/<think>([\s\S]*?)<\/think>/i);
      if (match) {
        thinking = match[1].trim();
        finalContent = fullRaw.replace(/<think>[\s\S]*?<\/think>/i, '').trim();
      } else {
        const openMatch = fullRaw.match(/<think>([\s\S]*)$/i);
        if (openMatch) {
          thinking = openMatch[1].trim();
          finalContent = fullRaw.replace(/<think>[\s\S]*$/i, '').trim();
        }
      }
    }

    // If a loop was interrupted inside <think> and no final answer was emitted, synthesize answer
    if (loopDetected && (!finalContent || finalContent.length < 5) && !abortCurrentGeneration) {
      try {
        if (onProgress) {
          onProgress({ text: 'Anti-loop sentinel active: Synthesizing final answer...', progress: 0.95 });
        }
        abortCurrentGeneration = false;
        const synthMessages = [
          ...budget.messages,
          { role: 'assistant' as const, content: `<think>\n${thinking || 'Key considerations reviewed.'}\n</think>\n` },
          { role: 'user' as const, content: 'Synthesize and state your final direct, complete answer clearly now based on your reasoning above.' }
        ];
        const synthMax = capMaxTokens(estimateMessagesTokens(synthMessages), ctx, Math.min(1500, effectiveMaxTokens));
        const synthCompletion = await engine.chat.completions.create({
          messages: synthMessages,
          temperature: 0.5,
          max_tokens: Math.max(64, synthMax),
          stream: true
        });

        let synthText = '';
        for await (const sChunk of synthCompletion) {
          if (abortCurrentGeneration) break;
          const delta = sChunk.choices[0]?.delta?.content || '';
          if (delta) {
            synthText += delta;
            onChunk(delta);
          }
        }
        if (synthText.trim()) {
          finalContent = synthText.trim();
        }
      } catch (e) {
        console.warn('[AntiLoop] Error in post-loop synthesis:', e);
      }
    }

    return {
      fullText: finalContent,
      thinking,
      loopDetected,
      loopReason
    };
  }

  throw new Error('WebGPU inference failed after a single recovery attempt.');
}

