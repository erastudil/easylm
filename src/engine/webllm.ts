import {
  CreateMLCEngine,
  MLCEngine,
  InitProgressReport,
  prebuiltAppConfig,
  AppConfig,
  ModelRecord
} from '@mlc-ai/web-llm';
import { ModelOption } from '../types';
import { AntiLoopDetector } from './anti_loop';

export const CUSTOM_MODEL_RECORDS: ModelRecord[] = [
  {
    model: 'https://huggingface.co/mlc-ai/DeepSeek-R1-Distill-Qwen-1.5B-q4f16_1-MLC',
    model_id: 'DeepSeek-R1-Distill-Qwen-1.5B-q4f16_1-MLC',
    model_lib: 'https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0_2_84/base/Qwen2-1.5B-Instruct-q4f16_1_cs1k-webgpu.wasm',
    low_resource_required: true,
    vram_required_MB: 1629.75,
    overrides: {
      context_window_size: 4096
    }
  }
];

export const AVAILABLE_MODELS: ModelOption[] = [
  // 6GB - 8GB Tier (Standard / Laptops / 8GB GPU — The Workhorses)
  {
    id: 'Qwen2.5-3B-Instruct-q4f16_1-MLC',
    label: 'Qwen 2.5 3B Instruct',
    sizeMB: 1950,
    vramEst: '~2.2 GB VRAM',
    vramTier: '8gb',
    isDefault: true,
    description: 'The everyday workhorse. Lightning fast, high IQ, light work on 8GB cards.'
  },
  {
    id: 'Llama-3.2-3B-Instruct-q4f16_1-MLC',
    label: 'Llama 3.2 3B Instruct',
    sizeMB: 2000,
    vramEst: '~2.3 GB VRAM',
    vramTier: '8gb',
    description: "Meta's sharp 3B model. Balanced reasoning and concise conversational flow."
  },
  {
    id: 'DeepSeek-R1-Distill-Qwen-7B-q4f16_1-MLC',
    label: 'DeepSeek-R1 Distill Qwen 7B',
    sizeMB: 4500,
    vramEst: '~5.1 GB VRAM',
    vramTier: '8gb',
    isReasoning: true,
    description: 'Heavyweight reasoning. Deep chain-of-thought analysis for 8GB+ GPUs.'
  },
  {
    id: 'Phi-3.5-mini-instruct-q4f16_1-MLC',
    label: 'Phi-3.5 Mini 3.8B Instruct',
    sizeMB: 2400,
    vramEst: '~3.7 GB VRAM',
    vramTier: '8gb',
    description: "Microsoft's high-efficiency 3.8B model. Superb logic and factual recall."
  },

  // 4GB Tier (Ultralight / Mobile / Laptops with iGPU)
  {
    id: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',
    label: 'Qwen 2.5 1.5B Instruct',
    sizeMB: 1100,
    vramEst: '~1.4 GB VRAM',
    vramTier: '4gb',
    description: 'Instant startup, ultra-low memory. Runs comfortably on any laptop or phone.'
  },
  {
    id: 'DeepSeek-R1-Distill-Qwen-1.5B-q4f16_1-MLC',
    label: 'DeepSeek-R1 Distill Qwen 1.5B',
    sizeMB: 1020,
    vramEst: '~1.6 GB VRAM',
    vramTier: '4gb',
    isReasoning: true,
    description: 'Extended reasoning and step-by-step thinking built for 4GB VRAM systems.'
  },
  {
    id: 'Llama-3.2-1B-Instruct-q4f16_1-MLC',
    label: 'Llama 3.2 1B Instruct',
    sizeMB: 880,
    vramEst: '~0.9 GB VRAM',
    vramTier: '4gb',
    description: 'Meta compact 1B. Minimal footprint, instant response for rapid notes.'
  },
  {
    id: 'SmolLM2-1.7B-Instruct-q4f16_1-MLC',
    label: 'SmolLM2 1.7B Instruct',
    sizeMB: 1200,
    vramEst: '~1.8 GB VRAM',
    vramTier: '4gb',
    description: 'Hugging Face compact distilled intelligence. Clean, articulate writing.'
  },
  {
    id: 'gemma-2-2b-it-q4f16_1-MLC',
    label: 'Gemma 2 2B Instruct',
    sizeMB: 1600,
    vramEst: '~1.9 GB VRAM',
    vramTier: '4gb',
    description: "Google's architectural marvel. Exceptional instruction following at 2B."
  },

  // 8GB - 16GB Tier (High Performance / Power Workstations)
  {
    id: 'gemma-2-9b-it-q4f16_1-MLC',
    label: 'Gemma 2 9B Instruct',
    sizeMB: 5800,
    vramEst: '~6.4 GB VRAM',
    vramTier: '16gb',
    description: 'High caliber intelligence. 9B runs comfortably on 8GB-16GB GPUs without overload.'
  },
  {
    id: 'Qwen2.5-7B-Instruct-q4f16_1-MLC',
    label: 'Qwen 2.5 7B Instruct',
    sizeMB: 4500,
    vramEst: '~5.1 GB VRAM',
    vramTier: '16gb',
    description: 'Full-sized 7B flagship. Comprehensive world knowledge and complex synthesis.'
  },
  {
    id: 'Llama-3.1-8B-Instruct-q4f16_1-MLC',
    label: 'Llama 3.1 8B Instruct',
    sizeMB: 4900,
    vramEst: '~5.0 GB VRAM',
    vramTier: '16gb',
    description: "Meta's flagship open weight model. Nuanced dialogue and robust reasoning."
  },
  {
    id: 'Mistral-7B-Instruct-v0.3-q4f16_1-MLC',
    label: 'Mistral 7B Instruct v0.3',
    sizeMB: 4400,
    vramEst: '~4.6 GB VRAM',
    vramTier: '16gb',
    description: 'European open source champion. Exceptional comprehension and natural dialogue.'
  },
  {
    id: 'Qwen2.5-Coder-7B-Instruct-q4f16_1-MLC',
    label: 'Qwen 2.5 Coder 7B Instruct',
    sizeMB: 4500,
    vramEst: '~5.1 GB VRAM',
    vramTier: '16gb',
    isCoding: true,
    description: 'Specialized coding powerhouse. Program synthesis, debugging, and systems architecture.'
  }
];

export const ALLOWED_MODEL_IDS = new Set(AVAILABLE_MODELS.map(m => m.id));

export const EASYLM_APP_CONFIG: AppConfig = {
  ...prebuiltAppConfig,
  model_list: [
    ...prebuiltAppConfig.model_list.filter(m => ALLOWED_MODEL_IDS.has(m.model_id)),
    ...CUSTOM_MODEL_RECORDS
  ]
};

export function registerCustomHFModel(record: ModelRecord): void {
  CUSTOM_MODEL_RECORDS.push(record);
  ALLOWED_MODEL_IDS.add(record.model_id);
  if (!EASYLM_APP_CONFIG.model_list.some(m => m.model_id === record.model_id)) {
    EASYLM_APP_CONFIG.model_list.push(record);
  }
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
}

export const DEFAULT_MODEL_ID = 'Qwen2.5-3B-Instruct-q4f16_1-MLC';

export interface ProgressStatus {
  text: string;
  progress: number;
}

let activeEngine: MLCEngine | null = null;
let currentLoadedModel: string = '';
let currentContextLimit: number = 4096;
let isInitializing: boolean = false;
let initPromise: Promise<MLCEngine> | null = null;
/**
 * Resilient WebGPU adapter request wrapper.
 * If high-performance powerPreference fails (e.g. discrete GPU is sleeping, crashed,
 * or blocked by browser process), falls back gracefully to default or low-power adapter.
 */
export function patchWebGPUAdapterFallback(): void {
  if (typeof navigator !== 'undefined' && 'gpu' in navigator && (navigator as any).gpu && !(navigator as any).gpu.__easylm_fallback_patched) {
    const gpu = (navigator as any).gpu;
    const originalRequestAdapter = gpu.requestAdapter.bind(gpu);
    gpu.requestAdapter = async function (options?: any) {
      // 1. Try requested options
      try {
        const adapter = await originalRequestAdapter(options);
        if (adapter) return adapter;
      } catch (e) {
        console.warn('[WebGPU] Primary adapter request failed:', e);
      }

      // 2. Fallback: try default adapter (no power preference)
      if (options?.powerPreference) {
        try {
          console.warn('[WebGPU] Retrying with default power preference...');
          const fallbackAdapter = await originalRequestAdapter();
          if (fallbackAdapter) return fallbackAdapter;
        } catch {
          // ignore
        }
      }

      // 3. Fallback: try low-power adapter (integrated GPU)
      if (options?.powerPreference !== 'low-power') {
        try {
          console.warn('[WebGPU] Retrying with low-power adapter...');
          const lowPowerAdapter = await originalRequestAdapter({ powerPreference: 'low-power' });
          if (lowPowerAdapter) return lowPowerAdapter;
        } catch {
          // ignore
        }
      }

      return null;
    };
    (navigator.gpu as any).__easylm_fallback_patched = true;
  }
}

// Automatically apply adapter fallback wrapper in browser environment
patchWebGPUAdapterFallback();

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
  if (!ALLOWED_MODEL_IDS.has(modelId)) {
    throw new Error('That model is not offered in this EasyLM build.');
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
      const engine = await CreateMLCEngine(
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

      activeEngine = engine;
      currentLoadedModel = modelId;
      isInitializing = false;
      return engine;
    } catch (err: any) {
      activeEngine = null;
      currentLoadedModel = '';
      isInitializing = false;
      initPromise = null;
      throw new Error(`WebLLM Model Init Error: ${err?.message || String(err)}`);
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
 * Stream inference with token chunk callbacks, abort support, anti-loop sentinel,
 * and auto-recovery for sleep/device loss/disposed instances.
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

  let attempt = 0;
  while (attempt < 2) {
    attempt++;
    let engine: MLCEngine;
    try {
      engine = await getOrInitEngine(modelId, onProgress, contextWindowSize);
    } catch (initErr: any) {
      activeEngine = null;
      currentLoadedModel = '';
      throw initErr;
    }

    abortCurrentGeneration = false;

    let completion: any;
    try {
      completion = await engine.chat.completions.create({
        messages,
        temperature: effectiveTemperature,
        max_tokens: maxTokens,
        stream: true,
        top_p: 0.95,
        frequency_penalty: 0.0,
        presence_penalty: 0.0
      });
    } catch (createErr: any) {
      const errStr = String(createErr?.message || createErr).toLowerCase();
      const isDisposedOrLost = errStr.includes('disposed') ||
        errStr.includes('not loaded') ||
        errStr.includes('device lost') ||
        errStr.includes('devicelost');

      if (isDisposedOrLost && attempt === 1) {
        console.warn(`[WebLLM] Engine was disposed or lost before generation (${createErr?.message}). Re-initializing WebGPU weights and retrying turn...`);
        activeEngine = null;
        currentLoadedModel = '';
        isInitializing = false;
        initPromise = null;
        if (onProgress) {
          onProgress({ text: 'WebGPU session awakened from sleep. Re-warming weights...', progress: 0.05 });
        }
        continue;
      }
      activeEngine = null;
      currentLoadedModel = '';
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
        const errStr = String(err?.message || err).toLowerCase();
        const isDisposedOrLost = errStr.includes('disposed') ||
          errStr.includes('not loaded') ||
          errStr.includes('device lost') ||
          errStr.includes('devicelost');

        if (isDisposedOrLost) {
          console.warn(`[WebLLM] Stream interrupted by device loss or disposal (${err?.message}). Resetting engine state.`);
          activeEngine = null;
          currentLoadedModel = '';
          isInitializing = false;
          initPromise = null;

          if (attempt === 1 && (!fullRaw || fullRaw.length < 20)) {
            if (onProgress) {
              onProgress({ text: 'WebGPU session lost mid-stream. Re-warming model weights...', progress: 0.05 });
            }
            continue;
          }
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
        const synthCompletion = await engine.chat.completions.create({
          messages: [
            ...messages,
            { role: 'assistant', content: `<think>\n${thinking || 'Key considerations reviewed.'}\n</think>\n` },
            { role: 'user', content: 'Synthesize and state your final direct, complete answer clearly now based on your reasoning above.' }
          ],
          temperature: 0.5,
          max_tokens: 1500,
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

  throw new Error('WebGPU inference failed after re-initialization attempt.');
}

