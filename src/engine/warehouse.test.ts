import { describe, expect, it } from 'vitest';
import { WAREHOUSE_PACKS } from '../data/warehouse_compiled';
import {
  execWarehouse,
  extractDoors,
  splitChapters,
  warehouseStats
} from './warehouse';

const REQUIRED = [
  'methods', 'computing', 'software', 'ai_ml', 'philosophy', 'civics',
  'finance', 'law', 'language', 'math', 'physics', 'chemistry', 'weather',
  'biology', 'health', 'engineering', 'agriculture', 'art', 'music',
  'literature', 'history', 'geography'
];

describe('warehouse library', () => {
  it('ships every advertised pack with a textbook and a link index', () => {
    const slugs = WAREHOUSE_PACKS.map(p => p.slug);
    expect(slugs.sort()).toEqual([...REQUIRED].sort());
    const stats = warehouseStats();
    expect(stats.packs).toBe(22);
    expect(stats.textbooks).toBe(22);
    expect(stats.doors).toBeGreaterThan(200);
  });

  it('textbooks teach in chapters, not Dewey blurbs', () => {
    for (const pack of WAREHOUSE_PACKS) {
      const chapters = splitChapters(pack.textbook).filter(c => c.heading !== 'front');
      expect(chapters.length, pack.slug).toBeGreaterThanOrEqual(8);
      expect(pack.textbook.length, pack.slug).toBeGreaterThan(8000);
      expect(pack.textbook, pack.slug).not.toMatch(/\bTODO\b|\bTBD\b|\bFIXME\b|lorem ipsum/i);
      expect(pack.textbook, pack.slug).not.toMatch(/Patrick|aodi\/|pylon|house-mcp|hnai-dev/);
    }
  });

  it('link indexes are official https doors', () => {
    for (const pack of WAREHOUSE_PACKS) {
      const doors = extractDoors(pack.links);
      expect(doors.length, pack.slug).toBeGreaterThanOrEqual(8);
      for (const d of doors) {
        expect(d.startsWith('https://'), d).toBe(true);
      }
    }
  });
});

describe('execWarehouse', () => {
  it('lists packs', () => {
    const list = execWarehouse('list');
    expect(list).toContain('Dewey 510');
    expect(list).toContain('math');
  });

  it('returns textbook chapters, not 35-word blurbs', () => {
    const popper = execWarehouse('falsificationism Popper hypothesis');
    expect(popper).toMatch(/Dewey 001/);
    expect(popper.toLowerCase()).toMatch(/falsif/);
    expect(popper.length).toBeGreaterThan(400);

    const turing = execWarehouse('Turing machine halting');
    expect(turing).toMatch(/Dewey 004/);
    expect(turing).toMatch(/Turing/);

    const thermo = execWarehouse('thermodynamics entropy');
    expect(thermo).toMatch(/Dewey 530/);
    expect(thermo.toLowerCase()).toMatch(/thermodynamic|entropy/);

    const bayes = execWarehouse('Bayes theorem probability');
    expect(bayes).toMatch(/Dewey 510/);
    expect(bayes.toLowerCase()).toMatch(/bayes/);

    const attn = execWarehouse('scaled dot-product attention transformer');
    expect(attn).toMatch(/Dewey 006/);
    expect(attn).toMatch(/Attention/);
  });

  it('attaches official doors to hits', () => {
    const math = execWarehouse('calculus');
    expect(math).toContain('Official doors');
    expect(math).toContain('https://');
  });

  it('misses cleanly', () => {
    const res = execWarehouse('xyznonexistentterm123');
    expect(res).toContain('No warehouse hits');
  });
});
