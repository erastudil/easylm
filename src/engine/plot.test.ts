import { describe, it, expect } from 'vitest';
import { evalFx, sampleFunction, generatePlotSvg } from './plot';

describe('plot engine tests', () => {
  it('evaluates single variable functions accurately', () => {
    expect(evalFx('x^2', 3)).toBe(9);
    expect(evalFx('2*x + 1', 4)).toBe(9);
    expect(evalFx('sqrt(x)', 16)).toBe(4);
    expect(evalFx('abs(x)', -5)).toBe(5);
  });

  it('samples functions across domain with bounds', () => {
    const samples = sampleFunction('x^2 - 4', -5, 5, 21);
    expect(samples.length).toBe(21);
    expect(samples[0].x).toBe(-5);
    expect(samples[0].y).toBe(21);
    expect(samples[10].x).toBe(0);
    expect(samples[10].y).toBe(-4);
  });

  it('generates SVG vector graphic containing path and axis elements', () => {
    const svg = generatePlotSvg({
      fn: 'sin(x)',
      xMin: -3.14,
      xMax: 3.14,
      title: 'Sine Wave Test'
    });

    expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('Sine Wave Test');
    expect(svg).toContain('<path d="M');
    expect(svg).toContain('stroke="#8b5cf6"');
  });

  it('renders discrete data points when provided', () => {
    const svg = generatePlotSvg({
      points: [
        { x: 1, y: 2, label: 'P1' },
        { x: 3, y: 8, label: 'P2' }
      ],
      title: 'Scatter Test'
    });

    expect(svg).toContain('<circle cx="');
    expect(svg).toContain('P1');
    expect(svg).toContain('P2');
  });
});
