import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

import {
  AVAILABLE_MODELS,
  ALLOWED_MODEL_IDS,
  CURATED_MODEL_IDS,
  EASYLM_APP_CONFIG,
  KID_ALLOWED_MODEL_IDS,
  KID_ALLOWED_MODEL_ID_LIST,
  KID_MODE_EXCLUDED_MODELS,
  KID_MODE_MODEL_ID,
  crashStepDownModel,
  findModelOption,
  getOomFallbackModel,
  getOrInitEngine,
  isModelAllowedForKid,
  modelForProfile,
  modelIsReasoning,
  modelsForProfile,
  registerCustomHFModel,
  setEngineKidMode
} from '../src/engine/webllm';
import { detectDevice, deviceInfoForProfile, DeviceInfo, IOS_RECOMMENDED_MODEL } from '../src/engine/device';
import { ModelModal } from '../src/components/ModelModal';
import {
  addProfileAtom,
  clearProfileAtoms,
  getAttentivePromptEnvelope,
  getProfileAtoms,
  loadAllAtoms,
  resetAtMemCache
} from '../src/engine/atmem';

const LLAMA_1B = 'Llama-3.2-1B-Instruct-q4f16_1-MLC';
const SMOL = 'SmolLM2-360M-Instruct-q4f16_1-MLC';
const REFUSED = 'That model is not offered in this EasyLM build.';
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

afterEach(() => {
  setEngineKidMode(false);
  vi.unstubAllGlobals();
});

describe('kid allowlist', () => {
  it('is Llama 3.2 1B, the model with Kid Safe A/B/C evidence', () => {
    expect(KID_MODE_MODEL_ID).toBe(LLAMA_1B);
    expect([...KID_ALLOWED_MODEL_IDS]).toEqual([LLAMA_1B]);
    expect(KID_ALLOWED_MODEL_ID_LIST[0]).toBe(LLAMA_1B);
    expect(modelsForProfile(true).map(m => m.id)).toEqual([LLAMA_1B]);
  });

  it('runs Llama 3.2 1B from a kid-only record that adult profiles leave out', () => {
    expect(AVAILABLE_MODELS.some(m => m.id === LLAMA_1B)).toBe(false);
    expect(ALLOWED_MODEL_IDS.has(LLAMA_1B)).toBe(false);
    expect(findModelOption(LLAMA_1B)?.label).toBe('Llama 3.2 1B Instruct');
    expect(EASYLM_APP_CONFIG.model_list.some(r => r.model_id === LLAMA_1B)).toBe(true);
    expect(modelsForProfile(false)).toBe(AVAILABLE_MODELS);
  });

  it('keeps every catalog model, fine-tune and adapter off kid profiles', () => {
    expect(AVAILABLE_MODELS.length).toBeGreaterThan(0);
    for (const m of AVAILABLE_MODELS) {
      expect(isModelAllowedForKid(m.id), m.id).toBe(false);
      expect(modelForProfile(m.id, true), m.id).toBe(LLAMA_1B);
      expect(modelForProfile(m.id, false), m.id).toBe(m.id);
    }
    for (const id of ['alice', 'alice-emap-adapter', 'Bonsai-2-27B-MLC', 'gemma-4-E2B-it-q4f16_1-MLC', SMOL]) {
      expect(isModelAllowedForKid(id), id).toBe(false);
      expect(modelForProfile(id, true), id).toBe(LLAMA_1B);
    }
    expect(KID_MODE_EXCLUDED_MODELS.has(SMOL)).toBe(true);
  });

  it('lets a grandfathered id count only while it is in the catalog', () => {
    const grandfathered = KID_ALLOWED_MODEL_ID_LIST.filter(id => id !== LLAMA_1B);
    expect(grandfathered).toHaveLength(13);
    for (const id of grandfathered) {
      expect(CURATED_MODEL_IDS.has(id), id).toBe(false);
      expect(isModelAllowedForKid(id), id).toBe(false);
    }
  });

  it('keeps a model added to AVAILABLE_MODELS later on adult profiles', () => {
    const added = { id: 'Future-Model-1B-q4f16_1-MLC', label: 'Future Model 1B', sizeMB: 900, vramTier: '4gb' as const };
    AVAILABLE_MODELS.push(added);
    try {
      expect(isModelAllowedForKid(added.id)).toBe(false);
      expect(modelForProfile(added.id, true)).toBe(LLAMA_1B);
      expect(modelsForProfile(true).some(m => m.id === added.id)).toBe(false);
      expect(modelsForProfile(false).some(m => m.id === added.id)).toBe(true);
    } finally {
      AVAILABLE_MODELS.splice(AVAILABLE_MODELS.indexOf(added), 1);
    }
  });

  it('kid crash step-down lands on Llama 3.2 1B or keeps the current model', () => {
    for (const m of AVAILABLE_MODELS) {
      expect(crashStepDownModel(m.id, { kidMode: true }), m.id).toBe(LLAMA_1B);
    }
    expect(crashStepDownModel(LLAMA_1B, { kidMode: true })).toBeUndefined();
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

  it('the adult iPhone recommendation becomes Llama 3.2 1B for kids only', () => {
    const dev = { isIOS: true, isMobile: true, recommendedModel: IOS_RECOMMENDED_MODEL } as DeviceInfo;
    expect(deviceInfoForProfile(dev, true).recommendedModel).toBe(LLAMA_1B);
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

  it('an adult custom model stays off the kid allowlist', () => {
    expect(registerCustomHFModel(record('adult-custom-MLC'), false)).toBe(true);
    expect(isModelAllowedForKid('adult-custom-MLC')).toBe(false);
  });
});

describe('reasoning models', () => {
  it('follows the catalog flag, and still recognizes the old id strings', () => {
    for (const m of AVAILABLE_MODELS) {
      expect(modelIsReasoning(m.id), m.id).toBe(!!m.isReasoning);
    }
    expect(modelIsReasoning('easylm-gemma-4-e4b-it')).toBe(true);
    expect(modelIsReasoning('easylm-qwen3-4b-instruct')).toBe(false);
    expect(modelIsReasoning('DeepSeek-R1-Distill-Qwen-7B-q4f16_1-MLC')).toBe(true);
    expect(modelIsReasoning(LLAMA_1B)).toBe(false);
  });
});

describe('kid load path', () => {
  it('engine refuses every catalog model and custom id in Kid mode', async () => {
    vi.stubGlobal('navigator', { userAgent: MAC_UA, gpu: { requestAdapter: async () => null } });
    registerCustomHFModel({ model: 'https://huggingface.co/x/adult-2-MLC', model_id: 'adult-2-MLC', model_lib: 'https://example.invalid/a.wasm', vram_required_MB: 4000 }, false);
    setEngineKidMode(true);
    for (const id of [...AVAILABLE_MODELS.map(m => m.id), 'adult-2-MLC', 'alice-emap-adapter', SMOL]) {
      await expect(getOrInitEngine(id, undefined, 4096), id).rejects.toThrow(REFUSED);
    }
  });

  it('engine refuses Llama 3.2 1B on adult profiles', async () => {
    vi.stubGlobal('navigator', { userAgent: MAC_UA, gpu: { requestAdapter: async () => null } });
    setEngineKidMode(false);
    await expect(getOrInitEngine(LLAMA_1B, undefined, 4096)).rejects.toThrow(REFUSED);
  });
});

describe('kid model picker UI', () => {
  const render = (kidMode: boolean) =>
    renderToString(createElement(ModelModal, {
      isOpen: true,
      onClose: () => {},
      selectedModel: kidMode ? LLAMA_1B : AVAILABLE_MODELS[0].id,
      onSelectModel: () => {},
      kidMode
    }));

  it('kid picker lists Llama 3.2 1B and omits the Fine-Tuned and Hugging Face tabs', () => {
    const html = render(true);
    expect(html).toContain('Llama 3.2 1B Instruct');
    expect(html).toContain('Llama 3.2 1B Instruct is the model for kid profiles.');
    expect(html).not.toContain('<span>Fine-Tuned</span>');
    expect(html).not.toContain('<span>Hugging Face</span>');
    expect(html).not.toContain('LoRA');
    for (const m of AVAILABLE_MODELS) expect(html, m.label).not.toContain(m.label);
  });

  it('adult picker keeps the catalog, the Fine-Tuned tab and the Hugging Face tab', () => {
    const html = render(false);
    const fineTunedCount = AVAILABLE_MODELS.filter(m => m.isFineTuned).length;
    expect(html).toMatch(new RegExp(`<span>Fine-Tuned</span><span[^>]*>${fineTunedCount}</span>`));
    expect(html).toContain('<span>Hugging Face</span>');
    expect(html).not.toContain('Llama 3.2 1B Instruct');
    for (const m of AVAILABLE_MODELS) expect(html, m.label).toContain(m.label);
  });
});

describe('OOM fallback model (issue #24)', () => {
  it('kid profiles only ever fall back to a model on the kid allowlist', () => {
    for (const m of AVAILABLE_MODELS) {
      const fb = getOomFallbackModel(m.id, { kidMode: true });
      expect(fb, m.id).toBe(LLAMA_1B);
      expect(isModelAllowedForKid(fb!)).toBe(true);
    }
    expect(getOomFallbackModel('alice', { kidMode: true })).toBe(LLAMA_1B);
    expect(getOomFallbackModel(undefined, { kidMode: true })).toBe(LLAMA_1B);
    // Already on the kid model: no swap is legal.
    expect(getOomFallbackModel(LLAMA_1B, { kidMode: true })).toBeUndefined();
  });

  it('iOS only swaps to a model under 1 GB on disk, or not at all', () => {
    for (const m of AVAILABLE_MODELS) {
      const fb = getOomFallbackModel(m.id, { ios: true });
      expect(fb, m.id).toBeDefined();
      expect(findModelOption(fb!)!.sizeMB, m.id).toBeLessThan(1024);
    }
    expect(getOomFallbackModel(LLAMA_1B, { ios: true })).toBeUndefined();
  });

  it('general fallback steps down and never returns the current model', () => {
    expect(getOomFallbackModel('easylm-gemma-4-e4b-it')).toBe('easylm-gemma-4-e2b-it');
    expect(getOomFallbackModel('easylm-gemma-4-e2b-it')).toBe(LLAMA_1B);
    expect(getOomFallbackModel(LLAMA_1B)).toBeUndefined();
    expect(getOomFallbackModel(undefined)).toBe('easylm-gemma-4-e2b-it');
    for (const m of AVAILABLE_MODELS) {
      const fb = getOomFallbackModel(m.id);
      if (fb !== undefined) expect(fb, m.id).not.toBe(m.id);
    }
  });
});

describe('AtMem profile isolation (the kid fence)', () => {
  const ADULT_SECRET = 'adulttaxledger espresso budget note';
  const ADULT_RULE = 'adult governed mandate about investment accounts';
  const KID_NOTE = 'kid volcano science project note';

  beforeEach(() => {
    resetAtMemCache();
    // Seed two profiles through the real engine API.
    expect(addProfileAtom('parent', ADULT_SECRET, 'fact').ok).toBe(true);
    expect(addProfileAtom('parent', ADULT_RULE, 'rule', true, 'parent').ok).toBe(true);
    expect(addProfileAtom('kid', KID_NOTE, 'fact').ok).toBe(true);
  });

  afterEach(() => {
    resetAtMemCache();
  });

  it('getProfileAtoms returns only the requesting profile atoms', () => {
    const kidAtoms = getProfileAtoms('kid');
    expect(kidAtoms.map(a => a.text)).toEqual([KID_NOTE]);
    expect(getProfileAtoms('parent').map(a => a.text)).toContain(ADULT_SECRET);
    expect(getProfileAtoms('nobody')).toEqual([]);
  });

  it('a kid prompt envelope never contains adult atoms, even governed rules or exact-match queries', () => {
    // Governed rules bypass relevance scoring in the envelope builder, so an
    // adult governed mandate is the strongest leak candidate.
    const byRule = getAttentivePromptEnvelope('kid', 'governed mandate investment accounts', 1024);
    expect(byRule).not.toContain(ADULT_RULE);
    expect(byRule).not.toContain('investment accounts');
    const byFact = getAttentivePromptEnvelope('kid', 'adulttaxledger espresso budget', 1024);
    expect(byFact).not.toContain(ADULT_SECRET);
    expect(byFact).not.toContain('adulttaxledger');
  });

  it('a kid prompt envelope still serves the kid profile its own atoms', () => {
    const envelope = getAttentivePromptEnvelope('kid', 'volcano science project', 1024);
    expect(envelope).toContain(KID_NOTE);
  });

  it('a profile with no atoms gets an empty envelope while other profiles hold atoms', () => {
    expect(loadAllAtoms().length).toBeGreaterThan(0);
    expect(getAttentivePromptEnvelope('nobody', 'volcano adulttaxledger', 1024)).toBe('');
  });

  it('clearing the kid profile leaves adult atoms untouched', () => {
    const cleared = clearProfileAtoms('kid', true);
    expect(cleared.clearedCount).toBe(1);
    expect(getProfileAtoms('kid')).toEqual([]);
    expect(getProfileAtoms('parent').map(a => a.text)).toContain(ADULT_SECRET);
    expect(getProfileAtoms('parent').map(a => a.text)).toContain(ADULT_RULE);
  });
});
