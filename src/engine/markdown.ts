import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

marked.setOptions({
  gfm: true,
  breaks: true
});

export function normalizeMarkdown(raw: string): string {
  if (!raw) return '';

  return raw
    .replace(/^[ \t]*[•●◦][ \t]*/gm, '- ')
    .replace(/([^\n])\s*(#{1,6}\s+[^\n]+)/g, '$1\n\n$2\n\n')
    .replace(/([.:!?])\s+([-*]\s+(?=[A-Za-z]))/g, '$1\n$2')
    .replace(/([.:!?])\s+(\d+\.\s+(?=[A-Za-z]))/g, '$1\n$2')
    .replace(/\n{3,}/g, '\n\n');
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
