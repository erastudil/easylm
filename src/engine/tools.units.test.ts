import { describe, expect, it } from 'vitest';
import { execUnits } from './tools';

describe('execUnits', () => {
  it('converts known pairs both ways', () => {
    expect(execUnits('3.75 gallons to oz').ok).toBe(true);
    expect(execUnits('100 km to miles').ok).toBe(true);
    expect(execUnits('32 F to C').ok).toBe(true);
    expect(execUnits('10 lbs to kg').ok).toBe(true);
    expect(execUnits('10 kg to lbs').ok).toBe(true);
  });

  it('refuses unknown pairs instead of inventing 1:1', () => {
    const res = execUnits('100 furlongs to cubits');
    expect(res.ok).toBe(false);
    expect(res.error || '').toMatch(/No conversion table/);
  });
});
