import { describe, expect, it } from 'vitest';
import { execMath } from './math';

describe('execMath', () => {
  it('evaluates the empty-canvas chip', () => {
    const res = execMath('sqrt(144) * (50 + 2)');
    expect(res.ok).toBe(true);
    expect(res.result).toBe('624');
  });

  it('accepts scientific notation', () => {
    const res = execMath('1e10');
    expect(res.ok).toBe(true);
    expect(Number(res.result)).toBe(1e10);
  });

  it('nests sqrt', () => {
    const res = execMath('sqrt(sqrt(16))');
    expect(res.ok).toBe(true);
    expect(Number(res.result)).toBe(2);
  });

  it('rejects constructor / proto / eval', () => {
    expect(execMath('constructor').ok).toBe(false);
    expect(execMath('__proto__').ok).toBe(false);
    expect(execMath('eval(1)').ok).toBe(false);
  });
});
