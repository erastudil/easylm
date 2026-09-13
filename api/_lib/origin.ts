/**
 * CORS allowlist for EasyLM serverless routes.
 * Keep in sync with src/engine/origin.ts
 */

const STATIC_ALLOWED = new Set([
  'https://easylm.vercel.app',
  'http://localhost:5175',
  'http://127.0.0.1:5175',
  'http://localhost:4173',
  'http://127.0.0.1:4173'
]);

export const QUERY_MAX_CHARS = 200;
export const URL_MAX_CHARS = 2048;

export function allowedOrigin(origin: string | undefined | null): string | null {
  if (!origin) return null;
  const o = String(origin).trim();
  if (STATIC_ALLOWED.has(o)) return o;

  try {
    const u = new URL(o);
    if (u.protocol !== 'https:') return null;
    if (u.hostname.toLowerCase() === 'easylm.vercel.app' && !u.port) return `${u.protocol}//${u.hostname}`;
    return null;
  } catch {
    return null;
  }
}

function originFromReferer(referer: string | undefined | null): string | null {
  if (!referer) return null;
  try {
    const u = new URL(String(referer).trim());
    return allowedOrigin(`${u.protocol}//${u.host}`);
  } catch {
    return null;
  }
}

function requestOrigin(req: any): string {
  return String(req?.headers?.origin || req?.headers?.Origin || '');
}

function requestReferer(req: any): string {
  return String(req?.headers?.referer || req?.headers?.Referer || '');
}

export function applyCors(req: any, res: any): boolean {
  const origin = requestOrigin(req);
  const allow = allowedOrigin(origin);
  if (allow) {
    res.setHeader('Access-Control-Allow-Origin', allow);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '600');

  if (req?.method === 'OPTIONS') {
    res.status(allow ? 204 : 403).end();
    return true;
  }
  return false;
}

export function requireBrowserOrigin(req: any, res: any): boolean {
  const origin = requestOrigin(req);
  if (allowedOrigin(origin)) return true;
  if (originFromReferer(requestReferer(req))) return true;
  res.status(403).json({ ok: false, error: 'Forbidden origin' });
  return false;
}

export function clipQuery(raw: unknown, max = QUERY_MAX_CHARS): string {
  return String(raw || '')
    .trim()
    .slice(0, max);
}
