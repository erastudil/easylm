import { describe, it, expect } from 'vitest';
import { STACKS_PACKS } from '../src/data/stacks_compiled';
import { splitChapters, execStacks } from '../src/engine/stacks';

describe('stack chapter split', () => {
  it('leaves YAML front matter out of the opening chapter', () => {
    for (const slug of ['methods', 'software', 'media', 'poetry']) {
      const pack = STACKS_PACKS.find(p => p.slug === slug);
      expect(pack, slug).toBeTruthy();
      const open = splitChapters(pack!.textbook)[0];
      expect(open.heading, slug).toBe('General Introduction');
      expect(open.body, slug).not.toMatch(/^(---|title:|Title:|status:|Status:|floor_age:)/);
      expect(open.body.split('\n').some(line => /^(title|Title|status|Status|date|Date|floor_age|level):/.test(line)), slug).toBe(false);
    }
  });

  it('keeps the prose that follows the header, and books with no header', () => {
    const methods = STACKS_PACKS.find(p => p.slug === 'methods')!;
    const chapters = splitChapters(methods.textbook);
    expect(chapters[0].body).toContain('Scientific Method');
    expect(chapters.some(c => c.heading.startsWith('1. '))).toBe(true);

    const plain = splitChapters('# Hello\n\nplain\n\n## One\n\nbody');
    expect(plain[0].body).toContain('plain');
    expect(plain[1]).toEqual({ heading: 'One', body: 'body' });
  });

  it('ships textbooks as text, with the C null escape written out', () => {
    for (const pack of STACKS_PACKS) {
      expect(pack.textbook.includes('\u0000'), pack.slug).toBe(false);
      expect(pack.links.includes('\u0000'), pack.slug).toBe(false);
    }
    const security = STACKS_PACKS.find(p => p.slug === 'security')!;
    expect(security.textbook).toContain('null terminator (`\\x00`)');
  });

  it('enforces LAW.md level and floor_age tags across all 32 living packs', () => {
    const validLevels = new Set(['read', 'count', 'algebra', 'hs', 'undergrad', 'grad']);
    expect(STACKS_PACKS.length).toBe(32);
    for (const pack of STACKS_PACKS) {
      expect(pack.level, `${pack.slug} level`).toBeTruthy();
      expect(validLevels.has(pack.level!), `${pack.slug} valid level`).toBe(true);
      expect(pack.floor_age, `${pack.slug} floor_age`).toBeGreaterThanOrEqual(13);
    }
    expect(STACKS_PACKS.find(p => p.slug === 'tao_te_ching')?.level).toBe('read');
    expect(STACKS_PACKS.find(p => p.slug === 'media')?.level).toBe('hs');
    expect(STACKS_PACKS.find(p => p.slug === 'physics')?.level).toBe('undergrad');
  });

  it('resolves subject aliases for tao_te_ching, physics, chemistry, and language', () => {
    expect(execStacks('daodejing laozi')).toContain('Dewey 181');
    expect(execStacks('quantum mechanics')).toContain('Dewey 530');
    expect(execStacks('periodic table molecules')).toContain('Dewey 540');
    expect(execStacks('linguistics grammar')).toContain('Dewey 400');
    expect(execStacks('list')).toContain('[level: read]');
  });
});
