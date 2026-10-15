import { describe, it, expect } from 'vitest';
import { STACKS_PACKS } from '../src/data/stacks_compiled';
import { splitChapters } from '../src/engine/stacks';

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
});
