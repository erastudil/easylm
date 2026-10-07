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

  it('cites a swarm command and does not launch it', () => {
    const hit = aliceDrive('summon a swarm to review the lattice');
    expect(hit?.route).toBe('ORCHESTRATE');
    expect(hit?.text).toContain('hydra swarm');
    expect(hit?.text).toContain('architect,coder,auditor');
    expect(hit?.text).toContain('review the lattice');
  });

  it('draws a red circle as svg', () => {
    const hit = aliceDrive('draw a red circle');
    expect(hit?.route).toBe('SENSE');
    expect(hit?.text).toContain('<circle');
    expect(hit?.text).toContain('#c0392b');
  });

  it('cites whisper for a speech library question', () => {
    const hit = aliceDrive('what library transcribes speech');
    expect(hit?.source).toBe('oss:whisper');
    expect(hit?.text).toContain('ffprobe');
  });

  it('cites playwright for a public page and does not fetch it', () => {
    const hit = aliceDrive('look at https://example.com/docs');
    expect(hit?.source).toBe('oss:playwright');
    expect(hit?.text).toContain('playwright open https://example.com/docs');
  });

  it('ships the generic voices', () => {
    for (const id of ['coder', 'researcher', 'chat', 'writer']) {
      expect(PERSONALITIES.some(voice => voice.id === id)).toBe(true);
    }
  });
});
