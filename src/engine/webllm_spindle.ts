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
  {
    id: 'Qwen2.5-3B-Instruct-q4f16_1-MLC',
    label: 'Qwen 2.5 3B Instruct (Default Local Model)',
    sizeMB: 1950,
    vramEst: '~2.2 GB'
  },
  {
    id: 'DeepSeek-R1-Distill-Qwen-1.5B-q4f16_1-MLC',
    label: 'DeepSeek-R1 1.5B (Extended Thinking / Reasoning)',
    sizeMB: 1020,
    vramEst: '~1.6 GB',
    isReasoning: true
  },
  {
    id: 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC',
    label: 'Qwen 2.5 1.5B Instruct (Ultralight / Mobile)',
    sizeMB: 1100,
    vramEst: '~1.4 GB'
  }
];

const ALLOWED_MODEL_IDS = new Set(AVAILABLE_MODELS.map(m => m.id));

export const EASYLM_APP_CONFIG: AppConfig = {
  ...prebuiltAppConfig,
  model_list: [
    ...prebuiltAppConfig.model_list.filter(m => ALLOWED_MODEL_IDS.has(m.model_id)),
    ...CUSTOM_MODEL_RECORDS.filter(m => ALLOWED_MODEL_IDS.has(m.model_id))
  ]
};

export const DEFAULT_MODEL_ID = 'Qwen2.5-3B-Instruct-q4f16_1-MLC';

export interface ProgressStatus {
  text: string;
  progress: number;
}

let activeEngine: MLCEngine | null = null;
let currentLoadedModel: string = '';
let isInitializing: boolean = false;
let initPromise: Promise<MLCEngine> | null = null;

export function isWebGPUSupported(): boolean {
  return typeof navigator !== 'undefined' && 'gpu' in navigator && !!(navigator as any).gpu;
}

/**
 * Initialize WebLLM engine with real-time progress callbacks
 */
export async function getOrInitEngine(
  modelId: string = DEFAULT_MODEL_ID,
  onProgress?: (p: ProgressStatus) => void
): Promise<MLCEngine> {
  if (!isWebGPUSupported()) {
    throw new Error('WebGPU is not supported or not enabled in this browser. Please use Chrome, Edge, or enable WebGPU.');
  }
  if (!ALLOWED_MODEL_IDS.has(modelId)) {
    throw new Error('That model is not offered in this EasyLM build.');
  }

  if (activeEngine && currentLoadedModel === modelId) {
    if (onProgress) {
      onProgress({ text: `Engine resident: ${modelId} active in WebGPU VRAM.`, progress: 1.0 });
    }
    return activeEngine;
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

      const engine = await CreateMLCEngine(modelId, {
        appConfig: EASYLM_APP_CONFIG,
        initProgressCallback: (report: InitProgressReport) => {
          if (onProgress) {
            onProgress({
              text: report.text || `Warming weights: ${(report.progress * 100).toFixed(0)}%`,
              progress: report.progress || 0
            });
          }
        }
      });

      activeEngine = engine;
      currentLoadedModel = modelId;
      isInitializing = false;
      return engine;
    } catch (err: any) {
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
 * Stream inference with token chunk callbacks, abort support, and Anti-Loop Sentinel
 */
export async function streamChatCompletion(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  modelId: string = DEFAULT_MODEL_ID,
  temperature: number = 0.4,
  maxTokens: number = 4096,
  onChunk: (chunkText: string) => void,
  onProgress?: (p: ProgressStatus) => void
): Promise<{ fullText: string; thinking?: string; loopDetected?: boolean; loopReason?: string }> {
  const engine = await getOrInitEngine(modelId, onProgress);
  abortCurrentGeneration = false;

  const isReasoning = modelId.includes('DeepSeek-R1') || modelId.includes('Reasoning');

  // DeepSeek-R1 / Reasoning models require min 0.6 temp to avoid greedy mode collapse,
  // and zero frequency/presence penalties to avoid corrupting structural reasoning tokens.
  const effectiveTemperature = isReasoning ? Math.max(0.6, temperature) : temperature;

  const completion = await engine.chat.completions.create({
    messages,
    temperature: effectiveTemperature,
    max_tokens: maxTokens,
    stream: true,
    top_p: 0.95,
    frequency_penalty: 0.0,
    presence_penalty: 0.0
  });

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
    if (!abortCurrentGeneration && !loopDetected) {
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
