import { describe, it, expect, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { isMindModel, streamMindCompletion } from '../src/engine/mind';
import { AVAILABLE_MODELS } from '../src/engine/webllm';

describe('Alice Mind Engine in EasyLM', () => {
  it('identifies alice model IDs', () => {
    expect(isMindModel('alice')).toBe(true);
    expect(isMindModel('ALICE')).toBe(true);
    expect(isMindModel('alice-mind')).toBe(true);
    expect(isMindModel('Qwen2.5-3B-Instruct-q4f16_1-MLC')).toBe(false);
  });

  it('includes Alice in AVAILABLE_MODELS with 0 GB VRAM requirement', () => {
    const alice = AVAILABLE_MODELS.find(m => m.id === 'alice');
    expect(alice).toBeDefined();
    expect(alice?.vramEst).toBe('~0.0 GB VRAM');
    expect(alice?.sizeMB).toBeLessThan(10);
    expect(alice?.isRecommended).toBe(true);
  });

  it('streams cited completions from bundle', async () => {
    // Mock global fetch to return the local public bundle
    const bundlePath = path.resolve(__dirname, '..', 'public', 'alice', 'alice_mind_bundle.json');
    const bundleData = JSON.parse(fs.readFileSync(bundlePath, 'utf8'));

    vi.stubGlobal('fetch', async (url: string) => {
      if (url.includes('alice_mind_bundle.json')) {
        return {
          ok: true,
          status: 200,
          json: async () => bundleData
        };
      }
      return { ok: false, status: 404 };
    });

    const chunks: string[] = [];
    const res = await streamMindCompletion(
      [{ role: 'user', content: 'what is aporia?' }],
      'alice',
      0.4,
      4096,
      (delta) => chunks.push(delta)
    );

    expect(res.fullText).toContain('Aporia');
    expect(res.fullText).toContain('[1]');
    expect(res.route).toBe('CITED_DEFINITION');
    expect(res.confidence).toBeGreaterThan(0.8);
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunks.join('')).toBe(res.fullText);
  });
});
