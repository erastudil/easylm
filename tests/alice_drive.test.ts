import { describe, expect, it } from 'vitest';

import { aliceDrive } from '../src/engine/alice_drive';
import { PERSONALITIES } from '../src/data/personalities';

describe('alice drive', () => {
  it('cites a stack fact before a model sample', () => {
    const hit = aliceDrive('what is the speed of light in vacuum');
    expect(hit).not.toBeNull();
    expect(hit?.act).toBe('cite');
    expect(hit?.text).toContain('299792458');
    expect(hit?.text).toContain('Dewey 530');
  });

  it('cites a feature card for a how-to', () => {
    const hit = aliceDrive('how do I use the stacks');
    expect(hit?.source).toBe('feature:stacks');
  });

  it('leaves ordinary chat for the model', () => {
    expect(aliceDrive('hello there')).toBeNull();
    expect(aliceDrive('who won the 1998 world series')).toBeNull();
  });

  it('ships the generic voices', () => {
    for (const id of ['coder', 'researcher', 'chat', 'writer']) {
      expect(PERSONALITIES.some(voice => voice.id === id)).toBe(true);
    }
  });
});
