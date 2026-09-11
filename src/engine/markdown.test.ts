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
});
