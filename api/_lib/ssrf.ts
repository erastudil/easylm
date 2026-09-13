/**
 * SSRF guards. Keep in sync with src/engine/ssrf.ts
 */

const BLOCKED_HOSTS = new Set([
  'localhost',
  'localhost.localdomain',
  'metadata.google.internal',
  'metadata.google.internal.',
  'kubernetes.default',
  'kubernetes.default.svc',
  'kubernetes.default.svc.cluster.local'
]);

const BLOCKED_SUFFIXES = [
  '.localhost',
  '.local',
  '.internal',
  '.lan',
  '.home',
  '.corp',
  '.localdomain'
];

export function normalizeHostname(hostname: string): string {
  return String(hostname || '')
    .trim()
    .toLowerCase()
    .replace(/\.+$/, '');
}

export function hostnameIsBlocked(hostname: string): boolean {
  const h = normalizeHostname(hostname);
  if (!h) return true;
  if (BLOCKED_HOSTS.has(h)) return true;
  if (h === '0' || h === '0.0.0.0') return true;
  return BLOCKED_SUFFIXES.some(sfx => h.endsWith(sfx));
}

export function isWikiHost(hostname: string): boolean {
  const h = normalizeHostname(hostname);
  const roots = ['wikipedia.org', 'wikisource.org', 'wikiquote.org', 'wikimedia.org', 'mediawiki.org'];
  return roots.some(root => h === root || h.endsWith('.' + root));
}

export function isPrivateIP(ip: string): boolean {
  const s = String(ip || '')
    .trim()
    .toLowerCase()
    .replace(/^\[/, '')
    .replace(/\]$/, '');

  if (!s) return true;

  if (s.startsWith('::ffff:')) {
    return isPrivateIP(s.slice(7));
  }

  if (s === '::1' || s === '::' || s === '0:0:0:0:0:0:0:1') return true;

  if (s.includes(':')) {
    if (s.startsWith('fc') || s.startsWith('fd')) return true;
    if (s.startsWith('fe80') || s.startsWith('fec0') || /^fe[89ab]/.test(s)) return true;
    if (s.startsWith('2001:db8:')) return true;
    if (s.startsWith('ff')) return true;
    return false;
  }

  const parts = s.split('.');
  if (parts.length === 4 && parts.every(p => /^\d+$/.test(p))) {
    const n = parts.map(p => parseInt(p, 10));
    if (n.some(x => x > 255)) return true;
    const [a, b, c] = n;
    if (a === 0) return true;
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
    if (a === 192 && b === 0 && (c === 0 || c === 2)) return true;
    if (a === 198 && b === 51 && c === 100) return true;
    if (a === 203 && b === 0 && c === 113) return true;
    if (a >= 224) return true;
    return false;
  }

  return false;
}

export function ipv4FromWeirdLiteral(host: string): string | null {
  const h = normalizeHostname(host);
  if (/^\d+$/.test(h)) {
    const n = Number(h);
    if (!Number.isSafeInteger(n) || n < 0 || n > 0xffffffff) return null;
    return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
  }
  if (/^0x[0-9a-f]+$/.test(h)) {
    const n = parseInt(h, 16);
    if (n < 0 || n > 0xffffffff) return null;
    return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
  }
  return null;
}

export function hostLooksPrivate(hostname: string): boolean {
  const h = normalizeHostname(hostname);
  if (hostnameIsBlocked(h)) return true;
  const weird = ipv4FromWeirdLiteral(h);
  if (weird && isPrivateIP(weird)) return true;
  if (h.includes(':') || /^\d{1,3}(\.\d{1,3}){3}$/.test(h)) {
    if (isPrivateIP(h)) return true;
  }
  return false;
}

export type PublicUrlResult =
  | { ok: true; url: URL }
  | { ok: false; error: string };

export function parsePublicHttpsUrl(raw: string): PublicUrlResult {
  let s = String(raw || '').trim();
  if (!s) return { ok: false, error: 'URL is required' };

  const lower = s.toLowerCase();
  if (
    lower.startsWith('file:') ||
    lower.startsWith('data:') ||
    lower.startsWith('blob:') ||
    lower.startsWith('javascript:') ||
    lower.startsWith('ftp:')
  ) {
    return { ok: false, error: 'Blocked URL scheme' };
  }

  if (!s.startsWith('http://') && !s.startsWith('https://')) {
    s = 'https://' + s;
  }

  let u: URL;
  try {
    u = new URL(s);
  } catch {
    return { ok: false, error: 'Invalid URL' };
  }

  if (u.username || u.password) {
    return { ok: false, error: 'Credentials in URL are blocked' };
  }

  if (u.protocol === 'http:') {
    u.protocol = 'https:';
  }

  if (u.protocol !== 'https:') {
    return { ok: false, error: 'Only https URLs are allowed' };
  }

  if (u.port && u.port !== '443') {
    return { ok: false, error: 'Nonstandard port blocked' };
  }

  if (hostLooksPrivate(u.hostname)) {
    return { ok: false, error: 'Private or local host blocked' };
  }

  return { ok: true, url: u };
}

export const FETCH_MAX_CHARS = 14000;
export const FETCH_MAX_BYTES = 400000;
