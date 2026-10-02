import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

const createSpy = vi.fn();
vi.mock('@mlc-ai/web-llm', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@mlc-ai/web-llm')>();
  return { ...actual, CreateMLCEngine: (...args: unknown[]) => createSpy(...args) };
});

import {
  AVAILABLE_MODELS,
  ALLOWED_MODEL_IDS,
  CURATED_MODEL_IDS,
  KID_ALLOWED_MODEL_IDS,
  KID_MODE_EXCLUDED_MODELS,
  KID_MODE_MODEL_ID,
  isModelAllowedForKid,
  modelForProfile,
  modelsForProfile,
  registerCustomHFModel,
  setEngineKidMode,
  getOrInitEngine,
  unloadActiveEngine
} from '../src/engine/webllm';
import { detectDevice, deviceInfoForProfile, DeviceInfo, IOS_FALLBACK_MODEL, IOS_RECOMMENDED_MODEL } from '../src/engine/device';
import { ModelModal } from '../src/components/ModelModal';

const SMOL = 'SmolLM2-360M-Instruct-q4f16_1-MLC';
const LLAMA_1B = 'Llama-3.2-1B-Instruct-q4f16_1-MLC';
const IPHONE_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
const MAC_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15';

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

afterEach(async () => {
  setEngineKidMode(false);
  await unloadActiveEngine();
  vi.unstubAllGlobals();
  createSpy.mockReset();
});

describe('kid allowlist', () => {
  it('is the curated picker minus SmolLM2 360M, with Llama 3.2 1B as the kid model', () => {
    expect(KID_MODE_MODEL_ID).toBe(LLAMA_1B);
    expect(IOS_RECOMMENDED_MODEL).toBe(LLAMA_1B);
    expect(KID_MODE_EXCLUDED_MODELS.has(SMOL)).toBe(true);
    expect(isModelAllowedForKid(SMOL)).toBe(false);
    expect(isModelAllowedForKid(LLAMA_1B)).toBe(true);
    for (const m of AVAILABLE_MODELS) {
      expect(isModelAllowedForKid(m.id), m.id).toBe(m.id !== SMOL);
    }
    expect(KID_ALLOWED_MODEL_IDS.size).toBe(CURATED_MODEL_IDS.size - 1);
  });

  it('maps excluded and custom ids to Llama 3.2 1B for kids and leaves adults unchanged', () => {
    expect(modelForProfile(SMOL, true)).toBe(LLAMA_1B);
    expect(modelForProfile('some-org-custom-model-MLC', true)).toBe(LLAMA_1B);
    expect(modelForProfile('Qwen2.5-3B-Instruct-q4f16_1-MLC', true)).toBe('Qwen2.5-3B-Instruct-q4f16_1-MLC');
    expect(modelForProfile(SMOL, false)).toBe(SMOL);
    expect(modelForProfile('some-org-custom-model-MLC', false)).toBe('some-org-custom-model-MLC');
  });

  it('picker list drops SmolLM2 360M for kids and keeps it for adults', () => {
    expect(modelsForProfile(true).some(m => m.id === SMOL)).toBe(false);
    expect(modelsForProfile(true).some(m => m.id === LLAMA_1B)).toBe(true);
    expect(modelsForProfile(false).some(m => m.id === SMOL)).toBe(true);
    expect(modelsForProfile(false)).toHaveLength(AVAILABLE_MODELS.length);
  });
});

describe('kid recommendation', () => {
  it('iPhone recommendation for a kid profile is Llama 3.2 1B', async () => {
    vi.stubGlobal('navigator', {
      userAgent: IPHONE_UA,
      platform: 'iPhone',
      maxTouchPoints: 5,
      gpu: { requestAdapter: async () => ({ info: { vendor: 'apple' }, limits: { maxBufferSize: 1024 * 1024 * 1024 } }) }
    });
    const dev = await detectDevice({ kidMode: true });
    expect(dev.recommendedModel).toBe(LLAMA_1B);
  });

  it('a 360M recommendation (fallback or step-down) becomes Llama 3.2 1B for kids only', () => {
    const dev = { isIOS: true, isMobile: true, recommendedModel: IOS_FALLBACK_MODEL } as DeviceInfo;
    expect(deviceInfoForProfile(dev, true).recommendedModel).toBe(LLAMA_1B);
    expect(deviceInfoForProfile(dev, false).recommendedModel).toBe(SMOL);
    expect(deviceInfoForProfile(dev, false)).toBe(dev);
  });
});

describe('kid custom Hugging Face models', () => {
  const record = (id: string) => ({
    model: `https://huggingface.co/someone/${id}`,
    model_id: id,
    model_lib: `https://example.invalid/${id}.wasm`,
    vram_required_MB: 4000
  });

  it('registerCustomHFModel registers nothing in Kid mode', () => {
    expect(registerCustomHFModel(record('kid-custom-MLC'), true)).toBe(false);
    expect(ALLOWED_MODEL_IDS.has('kid-custom-MLC')).toBe(false);
    setEngineKidMode(true);
    expect(registerCustomHFModel(record('kid-custom-2-MLC'))).toBe(false);
    expect(ALLOWED_MODEL_IDS.has('kid-custom-2-MLC')).toBe(false);
  });

  it('adults can still register a custom model; it stays off the kid allowlist', () => {
    expect(registerCustomHFModel(record('adult-custom-MLC'), false)).toBe(true);
    expect(ALLOWED_MODEL_IDS.has('adult-custom-MLC')).toBe(true);
    expect(isModelAllowedForKid('adult-custom-MLC')).toBe(false);
    expect(CURATED_MODEL_IDS.has('adult-custom-MLC')).toBe(false);
  });
});

describe('kid load path', () => {
  it('engine refuses SmolLM2 360M and custom ids in Kid mode, before any download', async () => {
    vi.stubGlobal('navigator', { userAgent: MAC_UA, gpu: { requestAdapter: async () => null } });
    registerCustomHFModel({ model: 'https://huggingface.co/x/adult-2-MLC', model_id: 'adult-2-MLC', model_lib: 'https://example.invalid/a.wasm', vram_required_MB: 4000 }, false);
    setEngineKidMode(true);
    await expect(getOrInitEngine(SMOL, undefined, 4096)).rejects.toThrow('That model is not offered in this EasyLM build.');
    await expect(getOrInitEngine('adult-2-MLC', undefined, 4096)).rejects.toThrow('That model is not offered in this EasyLM build.');
    expect(createSpy).not.toHaveBeenCalled();
  });

  it('engine loads SmolLM2 360M for adults', async () => {
    vi.stubGlobal('navigator', { userAgent: MAC_UA, gpu: { requestAdapter: async () => null } });
    createSpy.mockImplementationOnce(async () => ({ unload: async () => {} }));
    setEngineKidMode(false);
    await getOrInitEngine(SMOL, undefined, 4096);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(createSpy.mock.calls[0][0]).toBe(SMOL);
  });
});

describe('kid model picker UI', () => {
  const render = (kidMode: boolean) =>
    renderToString(createElement(ModelModal, {
      isOpen: true,
      onClose: () => {},
      selectedModel: LLAMA_1B,
      onSelectModel: () => {},
      kidMode
    }));

  it('kid picker lists Llama 3.2 1B, omits SmolLM2 360M and the Hugging Face search tab', () => {
    const html = render(true);
    expect(html).toContain('Llama 3.2 1B');
    expect(html).not.toContain('SmolLM2 360M');
    expect(html).not.toContain('Search Hugging Face');
  });

  it('adult picker keeps SmolLM2 360M and the Hugging Face search tab', () => {
    const html = render(false);
    expect(html).toContain('SmolLM2 360M');
    expect(html).toContain('Search Hugging Face');
  });
});
