import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { prebuiltAppConfig } from '@mlc-ai/web-llm';

const createSpy = vi.fn();
vi.mock('@mlc-ai/web-llm', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@mlc-ai/web-llm')>();
  return { ...actual, CreateMLCEngine: (...args: unknown[]) => createSpy(...args) };
});

import {
  AVAILABLE_MODELS,
  ALLOWED_MODEL_IDS,
  getModelVramMB,
  nextSmallerModel,
  crashStepDownModel,
  KID_MODE_EXCLUDED_MODELS,
  takeInterruptedLoad,
  getOrInitEngine,
  unloadActiveEngine,
  LOADING_FLAG_KEY
} from '../src/engine/webllm';
import {
  detectDevice,
  isIOSDevice,
  isMobileDevice,
  fitsIOSBudget,
  IOS_RECOMMENDED_MODEL,
  IOS_FALLBACK_MODEL,
  IOS_MODEL_BUDGET_MB
} from '../src/engine/device';

const IPHONE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const MAC_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15';
const ANDROID_UA = 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0 Mobile Safari/537.36';

function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() { return map.size; },
    clear: () => map.clear(),
    getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
    key: (i: number) => Array.from(map.keys())[i] ?? null,
    removeItem: (k: string) => { map.delete(k); },
    setItem: (k: string, v: string) => { map.set(k, String(v)); }
  };
}

beforeEach(() => {
  vi.stubGlobal('localStorage', memoryStorage());
});

afterEach(() => {
  vi.unstubAllGlobals();
  createSpy.mockReset();
});

describe('iOS / mobile detection', () => {
  it('detects iPhone, iPadOS-as-Mac, and Android', () => {
    expect(isIOSDevice({ userAgent: IPHONE_UA })).toBe(true);
    expect(isIOSDevice({ userAgent: MAC_UA, platform: 'MacIntel', maxTouchPoints: 5 })).toBe(true);
    expect(isIOSDevice({ userAgent: MAC_UA, platform: 'MacIntel', maxTouchPoints: 0 })).toBe(false);
    expect(isMobileDevice({ userAgent: ANDROID_UA })).toBe(true);
    expect(isMobileDevice({ userAgent: MAC_UA, platform: 'MacIntel', maxTouchPoints: 0 })).toBe(false);
  });

  it('gives iPhone the mobile tier with Llama 3.2 1B and a 4k context', async () => {
    vi.stubGlobal('navigator', {
      userAgent: IPHONE_UA,
      platform: 'iPhone',
      maxTouchPoints: 5,
      gpu: { requestAdapter: async () => ({ info: { vendor: 'apple' }, limits: { maxBufferSize: 1024 * 1024 * 1024 } }) }
    });
    const dev = await detectDevice();
    expect(dev.isIOS).toBe(true);
    expect(dev.hardwareTier).toBe('mobile');
    expect(dev.recommendedModel).toBe(IOS_RECOMMENDED_MODEL);
    expect(dev.recommendedContextLimit).toBeLessThanOrEqual(4096);
    expect(dev.recommendedContextLimit).toBeGreaterThanOrEqual(2048);
  });

  it('treats missing WebGPU and a null adapter as normal states', async () => {
    vi.stubGlobal('navigator', { userAgent: IPHONE_UA, platform: 'iPhone', maxTouchPoints: 5 });
    const noGpu = await detectDevice();
    expect(noGpu.hasWebGPU).toBe(false);
    expect(noGpu.recommendedModel).toBe(IOS_RECOMMENDED_MODEL);

    vi.stubGlobal('navigator', { userAgent: MAC_UA, platform: 'MacIntel', maxTouchPoints: 0, gpu: { requestAdapter: async () => null } });
    const nullAdapter = await detectDevice();
    expect(nullAdapter.hasWebGPU).toBe(true);
    expect(nullAdapter.gpuVendor).toBeUndefined();
  });

  it('returns a safe fallback when probing navigator throws', async () => {
    const nav = { userAgent: IPHONE_UA, platform: 'iPhone', maxTouchPoints: 5 };
    Object.defineProperty(nav, 'gpu', { get() { throw new Error('boom'); }, enumerable: true });
    vi.stubGlobal('navigator', nav);
    const dev = await detectDevice();
    expect(dev.hasWebGPU).toBe(false);
    expect(dev.recommendedModel).toBe(IOS_RECOMMENDED_MODEL);
  });
});

describe('model sizes come from web-llm records', () => {
  it('iOS model ids exist in prebuiltAppConfig and the picker', () => {
    for (const id of [IOS_RECOMMENDED_MODEL, IOS_FALLBACK_MODEL]) {
      expect(prebuiltAppConfig.model_list.some(m => m.model_id === id)).toBe(true);
      expect(ALLOWED_MODEL_IDS.has(id)).toBe(true);
      expect(fitsIOSBudget(id)).toBe(true);
    }
    expect(fitsIOSBudget('Qwen2.5-3B-Instruct-q4f16_1-MLC')).toBe(false);
    expect(fitsIOSBudget('Qwen2.5-1.5B-Instruct-q4f16_1-MLC')).toBe(false);
  });

  it('vramEst labels match vram_required_MB', () => {
    for (const m of AVAILABLE_MODELS) {
      const mb = getModelVramMB(m.id);
      expect(mb, m.id).toBeDefined();
      expect(m.vramEst).toBe(`~${(mb! / 1000).toFixed(1)} GB VRAM`);
    }
    expect(AVAILABLE_MODELS.find(m => m.id === 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC')?.vramEst).toBe('~1.6 GB VRAM');
    expect(AVAILABLE_MODELS.find(m => m.id === 'Qwen2.5-3B-Instruct-q4f16_1-MLC')?.vramEst).toBe('~2.5 GB VRAM');
  });

  it('nextSmallerModel steps down, capped by the iOS budget', () => {
    expect(nextSmallerModel('Qwen2.5-3B-Instruct-q4f16_1-MLC', IOS_MODEL_BUDGET_MB)).toBe(IOS_RECOMMENDED_MODEL);
    expect(nextSmallerModel(IOS_RECOMMENDED_MODEL, IOS_MODEL_BUDGET_MB)).toBe(IOS_FALLBACK_MODEL);
    expect(nextSmallerModel(IOS_FALLBACK_MODEL, IOS_MODEL_BUDGET_MB)).toBeUndefined();
    expect(nextSmallerModel('Qwen2.5-3B-Instruct-q4f16_1-MLC')).toBe('Llama-3.2-3B-Instruct-q4f16_1-MLC');
  });
});

describe('crash step-down in Kid mode', () => {
  it('keeps SmolLM2 360M out of the step-down while Kid mode is on', () => {
    expect(KID_MODE_EXCLUDED_MODELS.has(IOS_FALLBACK_MODEL)).toBe(true);
    // Llama 3.2 1B crashed: Kid mode keeps the current model (auto-load turns off), adults step down to 360M.
    expect(crashStepDownModel(IOS_RECOMMENDED_MODEL, { maxMB: IOS_MODEL_BUDGET_MB, kidMode: true })).toBeUndefined();
    expect(crashStepDownModel(IOS_RECOMMENDED_MODEL, { maxMB: IOS_MODEL_BUDGET_MB, kidMode: false })).toBe(IOS_FALLBACK_MODEL);
  });

  it('picks Llama 3.2 1B for Kid mode when a larger model crashed on iOS', () => {
    expect(crashStepDownModel('Qwen2.5-1.5B-Instruct-q4f16_1-MLC', { maxMB: IOS_MODEL_BUDGET_MB, kidMode: true })).toBe(IOS_RECOMMENDED_MODEL);
    expect(crashStepDownModel('Qwen2.5-3B-Instruct-q4f16_1-MLC', { maxMB: IOS_MODEL_BUDGET_MB, kidMode: true })).toBe(IOS_RECOMMENDED_MODEL);
  });

  it('never returns an excluded model in Kid mode, for any interrupted model', () => {
    for (const m of AVAILABLE_MODELS) {
      for (const maxMB of [undefined, IOS_MODEL_BUDGET_MB]) {
        const next = crashStepDownModel(m.id, { maxMB, kidMode: true });
        if (next !== undefined) expect(KID_MODE_EXCLUDED_MODELS.has(next)).toBe(false);
      }
    }
  });
});

describe('crash-loop breaker', () => {
  it('takeInterruptedLoad returns and clears the flag', () => {
    expect(takeInterruptedLoad()).toBeNull();
    localStorage.setItem(LOADING_FLAG_KEY, 'Qwen2.5-3B-Instruct-q4f16_1-MLC');
    expect(takeInterruptedLoad()).toBe('Qwen2.5-3B-Instruct-q4f16_1-MLC');
    expect(localStorage.getItem(LOADING_FLAG_KEY)).toBeNull();
  });

  it('sets the flag during engine create and clears it on error and on success', async () => {
    vi.stubGlobal('navigator', { userAgent: MAC_UA, gpu: { requestAdapter: async () => null } });

    let flagDuringCreate: string | null = null;
    createSpy.mockImplementationOnce(async () => {
      flagDuringCreate = localStorage.getItem(LOADING_FLAG_KEY);
      throw new Error('out of memory');
    });
    await expect(getOrInitEngine(IOS_RECOMMENDED_MODEL, undefined, 4096)).rejects.toThrow();
    expect(flagDuringCreate).toBe(IOS_RECOMMENDED_MODEL);
    expect(localStorage.getItem(LOADING_FLAG_KEY)).toBeNull();

    createSpy.mockImplementationOnce(async () => {
      flagDuringCreate = localStorage.getItem(LOADING_FLAG_KEY);
      return { unload: async () => {} };
    });
    await getOrInitEngine(IOS_FALLBACK_MODEL, undefined, 4096);
    expect(flagDuringCreate).toBe(IOS_FALLBACK_MODEL);
    expect(localStorage.getItem(LOADING_FLAG_KEY)).toBeNull();
    await unloadActiveEngine();
  });
});
