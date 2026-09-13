/**
 * Kid Safe tool allowlist.
 * Network tools leave the machine. Kid profiles do not get them.
 * Dictionary calls /api/dictionary → dictionaryapi.dev and is NOT local — excluded here.
 */

const ALLOWED_SUBSTRINGS = [
  'calc',
  'math',
  'unit',
  'convert',
  'clock',
  'time',
  'date',
  'zone',
  'stacks',
  'stack',
  'library',
  'warehouse',
  'canon',
  'dewey'
];

const BLOCKED_SUBSTRINGS = [
  'fetch',
  'search',
  'web',
  'weather',
  'forecast',
  'climate',
  'exchange',
  'currency',
  'forex',
  'wiki',
  'encyclopedia',
  'whois',
  'scrape',
  'browse',
  'read_url',
  'dictionary',
  'define',
  'vocab',
  'definition',
  'etymology'
];

export function normalizeToolName(name: string): string {
  return String(name || '')
    .toLowerCase()
    .trim()
    .replace(/^tool[_\-]/, '')
    .replace(/[_\-]tool$/, '');
}

export function isKidAllowedTool(name: string): boolean {
  const n = normalizeToolName(name);
  if (!n) return false;
  if (BLOCKED_SUBSTRINGS.some(b => n.includes(b))) return false;
  return ALLOWED_SUBSTRINGS.some(a => n.includes(a));
}

export const KID_TOOL_REFUSAL =
  'Kid Safe mode: network tools are off. Local calculator, units, clock, and university library stacks only.';
