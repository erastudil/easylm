import { describe, expect, it } from 'vitest';
import { clockQueryOf, mathExpressionOf, unitConversionOf, warehouseQueryOf } from './preflight';

describe('preflight chips', () => {
  it('hits math chip without a verb', () => {
    expect(mathExpressionOf('sqrt(144) * (50 + 2)')).toBe('sqrt(144) * (50 + 2)');
  });

  it('hits unit chip including km/h', () => {
    expect(unitConversionOf('100 km/h to mph')).toBe('100 km/h to mph');
    expect(unitConversionOf('100 km to miles')).toBe('100 km to miles');
  });

  it('hits Tokyo clock chip', () => {
    expect(clockQueryOf('What time is it in Tokyo right now?')).toBe('Tokyo');
  });

  it('hits Dewey 510 chip', () => {
    expect(warehouseQueryOf('What does Dewey 510 cover in mathematics?')).toBe('510');
  });
});
