import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import katex from 'katex';

marked.setOptions({
  gfm: true,
  breaks: true
});

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderLatexToHtml(expr: string, displayMode: boolean): string {
  const trimmed = expr.trim();
  if (!trimmed) return '';
  try {
    return katex.renderToString(trimmed, {
      displayMode,
      throwOnError: false,
      output: 'htmlAndMathml'
    });
  } catch {
    return escapeHtml(trimmed);
  }
}

export function normalizeMarkdown(raw: string): string {
  if (!raw) return '';

  let text = raw
    .replace(/^[ \t]*[•●◦][ \t]*/gm, '- ')
    .replace(/([^\n])\s*(#{1,6}\s+[^\n]+)/g, '$1\n\n$2\n\n')
    .replace(/([.:!?])\s+([-*]\s+(?=[A-Za-z]))/g, '$1\n$2')
    .replace(/([.:!?])\s+(\d+\.\s+(?=[A-Za-z]))/g, '$1\n$2')
    .replace(/\n{3,}/g, '\n\n');

  return text;
}

export function renderMarkdownSafe(raw: string): string {
  const normalized = normalizeMarkdown(raw || '');
  const mathPlaceholders: string[] = [];

  // 1. Extract Display Math $$...$$
  let text = normalized.replace(/\$\$([\s\S]+?)\$\$/g, (_match, expr) => {
    const idx = mathPlaceholders.length;
    const rendered = renderLatexToHtml(expr, true);
    mathPlaceholders.push(
      `<div class="math-box"><div class="math-box-label"><span>📐 DETERMINISTIC MATH</span></div><div class="math-box-expr">${rendered}</div></div>`
    );
    return `\n\n%%%MATH_TOKEN_${idx}%%%\n\n`;
  });

  // 2. Extract Code Blocks ```math or ```calc or ```equation
  text = text.replace(/```(?:math|calc|equation)\n([\s\S]+?)```/g, (_match, expr) => {
    const idx = mathPlaceholders.length;
    const rendered = renderLatexToHtml(expr, true);
    mathPlaceholders.push(
      `<div class="math-box"><div class="math-box-label"><span>📐 DETERMINISTIC MATH</span></div><div class="math-box-expr">${rendered}</div></div>`
    );
    return `\n\n%%%MATH_TOKEN_${idx}%%%\n\n`;
  });

  // 3. Extract Inline Math $...$ (ignore currency like $100 or $5.50 or $1,000)
  text = text.replace(/(?<!\\|\$)\$(?!\s|\d)([^\$\n]+?)(?<!\s|\$)\$(?!\$)/g, (_match, expr) => {
    const idx = mathPlaceholders.length;
    const rendered = renderLatexToHtml(expr, false);
    mathPlaceholders.push(rendered);
    return `%%%MATH_TOKEN_${idx}%%%`;
  });

  let html = '';
  try {
    html = marked.parse(text, { async: false }) as string;
  } catch {
    html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // 4. Restore math placeholders
  html = html.replace(/%%%MATH_TOKEN_(\d+)%%%/g, (_match, id) => {
    return mathPlaceholders[Number(id)] || '';
  });

  // 5. Sanitize HTML allowing MathML and KaTeX markup & styles
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true, mathMl: true },
    ADD_TAGS: ['annotation', 'semantics'],
    ADD_ATTR: ['aria-hidden'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'link', 'meta', 'base'],
    FORBID_ATTR: [
      'onerror',
      'onload',
      'onclick',
      'onmouseover',
      'onfocus',
      'oninput',
      'onmouseenter',
      'onmouseleave'
    ],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false
  });
}
