import { describe, expect, it } from 'vitest';
import { isKidAllowedTool } from './kid_tools';

describe('isKidAllowedTool', () => {
  it('allows local hands', () => {
    expect(isKidAllowedTool('calc')).toBe(true);
    expect(isKidAllowedTool('units')).toBe(true);
    expect(isKidAllowedTool('clock')).toBe(true);
    expect(isKidAllowedTool('warehouse')).toBe(true);
  });

  it('blocks network hands including dictionary (external API)', () => {
    expect(isKidAllowedTool('dictionary')).toBe(false);
    expect(isKidAllowedTool('define')).toBe(false);
    expect(isKidAllowedTool('web_fetch')).toBe(false);
    expect(isKidAllowedTool('web_search')).toBe(false);
    expect(isKidAllowedTool('weather')).toBe(false);
    expect(isKidAllowedTool('exchange')).toBe(false);
    expect(isKidAllowedTool('fact')).toBe(false);
    expect(isKidAllowedTool('browse')).toBe(false);
  });
});
