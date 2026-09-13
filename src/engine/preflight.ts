/**
 * Deterministic preflight: when a prompt is a hand, run the hand.
 * Demo chips must hit this path, not the 3B.
 */

const MATH_VERB = /^(?:what is|calculate|compute|eval)\s+(.+)$/i;
const MATH_BODY = /^(?:sqrt|sin|cos|tan|abs|log|ln|pow|pi|e|[0-9+\-*/().,\s^])+$/i;

export function mathExpressionOf(text: string): string | null {
  const t = String(text || '').trim();
  if (!t) return null;
  const verb = t.match(MATH_VERB);
  const expr = (verb ? verb[1] : t).trim();
  if (!/\d/.test(expr)) return null;
  if (!MATH_BODY.test(expr)) return null;
  return expr;
}

const UNIT_LINE = /^([\d.]+)\s*([a-zA-Z/°]+)\s*(?:to|in)\s*([a-zA-Z/°]+)$/i;

export function unitConversionOf(text: string): string | null {
  const t = String(text || '')
    .trim()
    .replace(/^(?:convert|how many)\s+/i, '');
  if (!UNIT_LINE.test(t)) return null;
  return t;
}

export function clockQueryOf(text: string): string | null {
  const t = String(text || '').trim().replace(/[?.!]+$/, '');
  if (/^(?:what time is it|what is the time|current time|time now|utc time)$/i.test(t)) {
    return '';
  }
  const m =
    t.match(/^what time is it in\s+(.+)$/i) ||
    t.match(/^time in\s+(.+)$/i) ||
    t.match(/^current time in\s+(.+)$/i);
  if (m) return m[1].replace(/\s+(?:right now|now|currently)$/i, '').trim();
  return null;
}

export function warehouseQueryOf(text: string): string | null {
  const t = String(text || '').trim();
  const dewey = t.match(/\bdewey\s+(\d{3})\b/i);
  if (dewey) return dewey[1];
  return null;
}
