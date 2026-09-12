import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

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

export function normalizeMarkdown(raw: string): string {
  if (!raw) return '';

  let text = raw
    .replace(/^[ \t]*[•●◦][ \t]*/gm, '- ')
    .replace(/([^\n])\s*(#{1,6}\s+[^\n]+)/g, '$1\n\n$2\n\n')
    .replace(/([.:!?])\s+([-*]\s+(?=[A-Za-z]))/g, '$1\n$2')
    .replace(/([.:!?])\s+(\d+\.\s+(?=[A-Za-z]))/g, '$1\n$2')
    .replace(/\n{3,}/g, '\n\n');

  // Convert $$...$$ display math into rectangular objective math box
  text = text.replace(/\$\$([\s\S]+?)\$\$/g, (_match, expr) => {
    const trimmed = expr.trim();
    return `\n\n<div class="math-box"><div class="math-box-label"><span>📐 DETERMINISTIC MATH</span></div><div class="math-box-expr">${escapeHtml(trimmed)}</div></div>\n\n`;
  });

  // Convert ```math or ```calc or ```equation code blocks into rectangular objective math box
  text = text.replace(/```(?:math|calc|equation)\n([\s\S]+?)```/g, (_match, expr) => {
    const trimmed = expr.trim();
    return `\n\n<div class="math-box"><div class="math-box-label"><span>📐 DETERMINISTIC MATH</span></div><div class="math-box-expr">${escapeHtml(trimmed)}</div></div>\n\n`;
  });

  return text;
}

export function renderMarkdownSafe(raw: string): string {
  const normalized = normalizeMarkdown(raw || '');
  let html = '';
  try {
    html = marked.parse(normalized, { async: false }) as string;
  } catch {
    html = normalized
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'link', 'meta', 'style', 'base', 'svg', 'math'],
    FORBID_ATTR: [
      'onerror',
      'onload',
      'onclick',
      'onmouseover',
      'onfocus',
      'oninput',
      'onmouseenter',
      'onmouseleave',
      'style'
    ],
    ALLOW_DATA_ATTR: false,
    ALLOW_UNKNOWN_PROTOCOLS: false
  });
}
