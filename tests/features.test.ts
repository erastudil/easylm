import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { splitChapters } from '../src/engine/stacks';
import { STACKS_PACKS } from '../src/data/stacks_compiled';
import { AVAILABLE_MODELS } from '../src/engine/webllm';

describe('Studio Read Mode continuous scroll', () => {
  it('parses multi-chapter textbooks into continuous sequence', () => {
    const pack = STACKS_PACKS[0];
    const chapters = splitChapters(pack.textbook);
    expect(chapters.length).toBeGreaterThan(0);
    for (const ch of chapters) {
      expect(ch.heading).toBeTruthy();
      expect(typeof ch.body).toBe('string');
    }
  });

  it('preserves all chapter headings and content without truncation', () => {
    const sampleBook = `Front introduction text\n\n## Chapter 1: Foundations\nFoundational body text.\n\n## Chapter 2: Core Mechanics\nMechanics body text.`;
    const chapters = splitChapters(sampleBook);
    expect(chapters.length).toBe(3);
    expect(chapters[0].heading).toBe('General Introduction');
    expect(chapters[1].heading).toBe('Chapter 1: Foundations');
    expect(chapters[2].heading).toBe('Chapter 2: Core Mechanics');
    expect(chapters[1].body).toContain('Foundational body text.');
    expect(chapters[2].body).toContain('Mechanics body text.');
  });
});

describe('Hardware Recommendation & Prompt Preferences', () => {
  it('identifies recommended models in AVAILABLE_MODELS', () => {
    const defaultModel = AVAILABLE_MODELS.find(m => m.isDefault);
    expect(defaultModel).toBeDefined();
    expect(defaultModel?.id).toBe('Qwen2.5-3B-Instruct-q4f16_1-MLC');

    const recModel = AVAILABLE_MODELS.find(m => m.id === 'Qwen2.5-3B-Instruct-q4f16_1-MLC');
    expect(recModel?.label).toContain('Qwen 2.5 3B');
  });

  it('keeps the README model table inside the catalog', () => {
    const readme = fs.readFileSync(path.resolve(__dirname, '../README.md'), 'utf8');
    const section = readme.split('## Supported Models')[1]?.split('\n## ')[0] ?? '';
    const rows = section
      .split('\n')
      .filter(line => line.startsWith('| **'))
      .map(line => {
        const cells = line.split('|').slice(1, -1).map(cell => cell.trim());
        const name = cells[0].replace(/\*\*/g, '').replace(/\s*\([^)]*\)$/, '').trim();
        return { name, tier: cells[3] ?? '' };
      });

    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      const match = AVAILABLE_MODELS.find(m => m.label === row.name);
      expect(match, row.name).toBeDefined();
    }

    const defaultRow = rows.find(row => /Default for 8GB/i.test(row.tier));
    const catalogDefault = AVAILABLE_MODELS.find(m => m.isDefault);
    expect(defaultRow?.name).toBe('Qwen 2.5 3B Instruct');
    expect(catalogDefault?.id).toBe('Qwen2.5-3B-Instruct-q4f16_1-MLC');
    expect(catalogDefault?.label).toBe(defaultRow?.name);

    const bonsai = rows.find(row => row.name === 'Bonsai 2 27B');
    expect(bonsai?.tier).toMatch(/16GB/);
    expect(bonsai?.tier).not.toMatch(/Recommended/i);
    expect(AVAILABLE_MODELS.find(m => m.label === 'Bonsai 2 27B')?.vramTier).toBe('16gb');
    expect(AVAILABLE_MODELS.find(m => m.label === 'Bonsai 2 27B')?.isDefault).toBeUndefined();
  });

  it('manages hardware prompt preferences and remember selection state', () => {
    const mockStorage: Record<string, string> = {};
    const setPref = (showPrompt: boolean, autoLoad: boolean) => {
      mockStorage['easylm_show_hardware_prompt'] = String(showPrompt);
      mockStorage['easylm_auto_load_model'] = String(autoLoad);
    };

    // User selects Yes + remember selection
    setPref(false, true);
    expect(mockStorage['easylm_show_hardware_prompt']).toBe('false');
    expect(mockStorage['easylm_auto_load_model']).toBe('true');

    // User selects No + remember selection
    setPref(false, false);
    expect(mockStorage['easylm_show_hardware_prompt']).toBe('false');
    expect(mockStorage['easylm_auto_load_model']).toBe('false');

    // User re-enables in settings menu
    delete mockStorage['easylm_show_hardware_prompt'];
    delete mockStorage['easylm_auto_load_model'];
    expect(mockStorage['easylm_show_hardware_prompt']).toBeUndefined();
  });
});
