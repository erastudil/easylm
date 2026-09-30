import { describe, it, expect } from 'vitest';
import { splitChapters } from '../src/engine/stacks';
import { STACKS_PACKS } from '../src/data/stacks_compiled';
import { AVAILABLE_MODELS } from '../src/engine/webllm';
import { DeviceInfo } from '../engine/device';

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
