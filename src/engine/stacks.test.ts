import { describe, expect, it } from 'vitest';
import { STACKS_PACKS } from '../data/stacks_compiled';
import {
  execStacks,
  extractDoors,
  splitChapters,
  stacksStats
} from './stacks';

const REQUIRED = [
  'methods', 'computing', 'software', 'ai_ml', 'philosophy', 'psychology',
  'religion', 'sociology', 'civics', 'finance', 'law', 'language', 'math',
  'astronomy', 'physics', 'chemistry', 'weather', 'biology', 'health',
  'engineering', 'agriculture', 'business', 'art', 'music', 'literature',
  'poetry', 'history', 'geography'
];

describe('The Stacks library', () => {
  it('ships every advertised pack with a textbook and a link index', () => {
    const slugs = STACKS_PACKS.map(p => p.slug);
    expect(slugs.sort()).toEqual([...REQUIRED].sort());
    const stats = stacksStats();
    expect(stats.packs).toBe(28);
    expect(stats.textbooks).toBe(28);
    expect(stats.doors).toBeGreaterThan(200);
  });

  it('textbooks teach in chapters, not Dewey blurbs', () => {
    for (const pack of STACKS_PACKS) {
      const chapters = splitChapters(pack.textbook).filter(c => c.heading !== 'front');
      expect(chapters.length, pack.slug).toBeGreaterThanOrEqual(8);
      expect(pack.textbook.length, pack.slug).toBeGreaterThan(8000);
      expect(pack.textbook, pack.slug).not.toMatch(/\bTODO\b|\bTBD\b|\bFIXME\b|lorem ipsum/i);
      expect(pack.textbook, pack.slug).not.toMatch(/Patrick|aodi\/|pylon|house-mcp|hnai-dev/);
    }
  });

  it('link indexes are official https doors', () => {
    for (const pack of STACKS_PACKS) {
      const doors = extractDoors(pack.links);
      expect(doors.length, pack.slug).toBeGreaterThanOrEqual(8);
      for (const d of doors) {
        expect(d.startsWith('https://'), d).toBe(true);
      }
    }
  });
});

describe('execStacks', () => {
  it('lists packs', () => {
    const list = execStacks('list');
    expect(list).toContain('Dewey 510');
    expect(list).toContain('math');
  });

  it('returns textbook chapters with depth and rigor', () => {
    const popper = execStacks('falsificationism Popper hypothesis');
    expect(popper).toMatch(/Dewey 001/);
    expect(popper.toLowerCase()).toMatch(/falsif/);
    expect(popper.length).toBeGreaterThan(400);

    const turing = execStacks('Turing machine halting');
    expect(turing).toMatch(/Dewey 004/);
    expect(turing).toMatch(/Turing/);

    const thermo = execStacks('thermodynamics entropy');
    expect(thermo).toMatch(/Dewey 530/);
    expect(thermo.toLowerCase()).toMatch(/thermodynamic|entropy/);

    const bayes = execStacks('Bayes theorem probability');
    expect(bayes).toMatch(/Dewey 510/);
    expect(bayes.toLowerCase()).toMatch(/bayes/);

    const attn = execStacks('scaled dot-product attention transformer');
    expect(attn).toMatch(/Dewey 006/);
    expect(attn).toMatch(/Attention/);
  });

  it('attaches official doors to hits', () => {
    const math = execStacks('calculus');
    expect(math).toContain('Official doors');
    expect(math).toContain('https://');
  });

  it('misses cleanly', () => {
    const res = execStacks('xyznonexistentterm123');
    expect(res).toContain('Stacks matches');
  });
});
