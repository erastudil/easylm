import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  parseSafeTensorsHeader,
  applyLoRAWeights,
  getAdapterConfig,
  getAdaptersForModel,
  getActiveSkillAdapter,
  setActiveSkillAdapter,
  fetchAndVerifyAdapter
} from '../src/services/lora_loader';

function buildSafeTensorsBuffer(headerObj: Record<string, any>, payloadBytes: number = 64): ArrayBuffer {
  const jsonBytes = new TextEncoder().encode(JSON.stringify(headerObj));
  const buf = new ArrayBuffer(8 + jsonBytes.byteLength + payloadBytes);
  const view = new DataView(buf);
  view.setBigUint64(0, BigInt(jsonBytes.byteLength), true);
  new Uint8Array(buf, 8, jsonBytes.byteLength).set(jsonBytes);
  return buf;
}

describe('EasyLM LoRA Loader & Runtime Adapter Integration', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    setActiveSkillAdapter('easylm-bonsai-2-2b', null);
    setActiveSkillAdapter('easylm-bonsai-2-9b', null);
  });

  it('parses binary SafeTensors headers and applies low-rank W + (alpha/r)*(B x A) adaptation', () => {
    const sampleHeader = {
      'base_model.model.language_model.layers.0.mlp.gate_proj.lora_A.weight': {
        dtype: 'F16',
        shape: [16, 2048],
        data_offsets: [0, 65536]
      },
      'base_model.model.language_model.layers.0.mlp.gate_proj.lora_B.weight': {
        dtype: 'F16',
        shape: [6144, 16],
        data_offsets: [65536, 262144]
      }
    };
    const buf = buildSafeTensorsBuffer(sampleHeader, 32);
    const parsed = parseSafeTensorsHeader(buf);
    expect(Object.keys(parsed.header)).toHaveLength(2);
    expect(parsed.offset).toBeGreaterThan(8);

    const base = new Float32Array([1, 2, 3, 4]); // 2x2
    const loraA = new Float32Array([0.5, 1.0]);  // r=1, in=2
    const loraB = new Float32Array([2.0, -1.0]); // out=2, r=1
    const adapted = applyLoRAWeights(base, loraA, loraB, 2, 1);
    // scale = 2/1 = 2; B*A = [[1.0, 2.0], [-0.5, -1.0]]
    expect(Array.from(adapted)).toEqual([3, 6, 2, 2]);
  });

  it('resolves all Bonsai 2 discrete skill adapters for 2B, 4B, 9B, and 27B', () => {
    const adapters2b = getAdaptersForModel('easylm-bonsai-2-2b');
    expect(adapters2b.map(a => a.id)).toEqual(
      expect.arrayContaining([
        'easylm-bonsai-2-2b',
        'easylm-hands-bonsai-2-2b',
        'easylm-personalities-bonsai-2-2b',
        'easylm-security-bonsai-2-2b',
        'easylm-kidsafety-bonsai-2-2b'
      ])
    );

    const adapters9b = getAdaptersForModel('easylm-bonsai-2-9b');
    expect(adapters9b.map(a => a.id)).toEqual(
      expect.arrayContaining([
        'easylm-bonsai-2-9b',
        'easylm-hands-bonsai-2-9b',
        'easylm-personalities-bonsai-2-9b',
        'easylm-security-bonsai-2-9b',
        'easylm-kidsafety-bonsai-2-9b',
        'easylm-hydra-bonsai-2-9b'
      ])
    );
    expect(adapters9b.map(a => a.id)).not.toContain('alice-emap-adapter');
  });

  it('switches active skill adapters per model and verifies SafeTensors headers via fetchAndVerifyAdapter', async () => {
    expect(getActiveSkillAdapter('easylm-bonsai-2-9b')?.id).toBe('easylm-bonsai-2-9b');
    setActiveSkillAdapter('easylm-bonsai-2-9b', 'easylm-hydra-bonsai-2-9b');
    expect(getActiveSkillAdapter('easylm-bonsai-2-9b')?.id).toBe('easylm-hydra-bonsai-2-9b');

    const stBuf = buildSafeTensorsBuffer({
      'base_model.model.language_model.layers.0.mlp.gate_proj.lora_A.weight': {
        dtype: 'F16',
        shape: [16, 4096],
        data_offsets: [0, 131072]
      },
      'base_model.model.language_model.layers.0.mlp.gate_proj.lora_B.weight': {
        dtype: 'F16',
        shape: [12288, 16],
        data_offsets: [131072, 524288]
      }
    });

    vi.stubGlobal(
      'fetch',
      vi.fn(async (url: string) => {
        if (String(url).endsWith('adapter_config.json')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({ r: 16, lora_alpha: 32, base_model_name_or_path: 'prism-ml/Ternary-Bonsai-2-9B-gguf' })
          };
        }
        if (String(url).endsWith('training_metadata.json')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({ training_metrics: { final_train_loss: 0.412 }, dataset: { conversations: 168 } })
          };
        }
        return {
          ok: true,
          status: 206,
          arrayBuffer: async () => stBuf
        };
      })
    );

    const state = await fetchAndVerifyAdapter('easylm-hydra-bonsai-2-9b');
    expect(state).not.toBeNull();
    expect(state?.headerVerified).toBe(true);
    expect(state?.tensorCount).toBe(2);
    expect(state?.rank).toBe(16);
    expect(state?.alpha).toBe(32);
    expect(state?.trainLoss).toBeCloseTo(0.412, 3);
    expect(getAdapterConfig('Bluebarrels/easylm-bonsai-2-2b')?.id).toBe('easylm-bonsai-2-2b');
    expect(getAdapterConfig('Bluebarrels/alice-emap-adapter')).toBeUndefined();
  });
});
