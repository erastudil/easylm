import { describe, expect, it } from 'vitest';
import { renderMarkdownSafe } from './markdown';

describe('renderMarkdownSafe', () => {
  it('strips script and onerror', () => {
    const html = renderMarkdownSafe('<img src=x onerror="alert(1)"><script>alert(1)</script>Hello');
    expect(html.toLowerCase()).not.toContain('onerror');
    expect(html.toLowerCase()).not.toContain('<script');
    expect(html.toLowerCase()).not.toContain('javascript:');
  });

  it('keeps normal markdown', () => {
    const html = renderMarkdownSafe('**bold** and a [link](https://example.com)');
    expect(html).toContain('<strong>');
    expect(html).toContain('example.com');
  });

  it('preserves mathematical subtraction and multiplication without converting to lists', () => {
    const raw = 'The formula is 10 - 2 = 8 and 5 * 4 = 20 or sqrt(144) * 5200.';
    const html = renderMarkdownSafe(raw);
    expect(html).not.toContain('<li>2 = 8');
    expect(html).not.toContain('<li>4 = 20');
    expect(html).toContain('10 - 2 = 8');
    expect(html).toContain('5 * 4 = 20');
  });

  it('renders display math expressions in rectangular objective math boxes', () => {
    const raw = 'Here is the formula:\n\n$$E = mc^2$$\n\nEnd of calculation.';
    const html = renderMarkdownSafe(raw);
    expect(html).toContain('class="math-box"');
    expect(html).toContain('DETERMINISTIC MATH');
    expect(html).toContain('E = mc^2');
  });

  it('renders fenced math code blocks in rectangular objective math boxes', () => {
    const raw = 'Calculation:\n\n```calc\nsqrt(144) * 5200 = 62400\n```';
    const html = renderMarkdownSafe(raw);
    expect(html).toContain('class="math-box"');
    expect(html).toContain('DETERMINISTIC MATH');
    expect(html).toContain('sqrt(144) * 5200 = 62400');
  });

  it('renders LaTeX display formulas and fractions with KaTeX', () => {
    const raw = 'Bayes Rule:\n\n$$P(H \\mid E) = \\frac{P(E \\mid H) P(H)}{P(E)}$$';
    const html = renderMarkdownSafe(raw);
    expect(html).toContain('class="math-box"');
    expect(html).toContain('class="katex"');
    expect(html).toContain('mfrac');
  });

  it('renders inline math and preserves currency dollar signs', () => {
    const raw = 'The threshold is $p < 0.05$ and the fee was $100 for $200 items.';
    const html = renderMarkdownSafe(raw);
    expect(html).toContain('class="katex"');
    expect(html).toContain('$100');
    expect(html).toContain('$200');
  });
});
