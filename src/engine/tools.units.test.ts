import { describe, expect, it } from 'vitest';
import { execUnits, execWarehouse } from './tools';

describe('execUnits', () => {
  it('converts known pairs both ways', () => {
    expect(execUnits('3.75 gallons to oz').ok).toBe(true);
    expect(execUnits('100 km to miles').ok).toBe(true);
    expect(execUnits('32 F to C').ok).toBe(true);
    expect(execUnits('10 lbs to kg').ok).toBe(true);
    expect(execUnits('10 kg to lbs').ok).toBe(true);
    const speed = execUnits('100 km/h to mph');
    expect(speed.ok).toBe(true);
    expect(speed.result || '').toMatch(/mph/);
  });

  it('refuses unknown pairs instead of inventing 1:1', () => {
    const res = execUnits('100 furlongs to cubits');
    expect(res.ok).toBe(false);
    expect(res.error || '').toMatch(/No conversion table/);
  });
});

describe('execWarehouse', () => {
  it('finds Dewey reference documents by keyword', () => {
    const popper = execWarehouse('falsificationism');
    expect(popper).toContain('Dewey 001');
    expect(popper).toContain('Karl Popper');

    const shannon = execWarehouse('information entropy');
    expect(shannon).toContain('Dewey 003');
    expect(shannon).toContain('Claude Shannon');

    const physics = execWarehouse('thermodynamics entropy');
    expect(physics).toContain('Dewey 532');
  });

  it('handles misses with clean fallback notice', () => {
    const res = execWarehouse('xyznonexistentterm123');
    expect(res).toContain('No exact warehouse hits');
  });
});
