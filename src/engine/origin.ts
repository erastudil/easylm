/**
 * CORS allowlist for EasyLM serverless routes.
 * Same-origin requests without an Origin header are not CORS and still work.
 */

const STATIC_ALLOWED = new Set([
  'https://easylm.vercel.app',
  'http://localhost:5175',
  'http://127.0.0.1:5175',
  'http://localhost:4173',
  'http://127.0.0.1:4173'
]);

export function allowedOrigin(origin: string | undefined | null): string | null {
  if (!origin) return null;
  const o = String(origin).trim();
  if (STATIC_ALLOWED.has(o)) return o;

  try {
    const u = new URL(o);
    if (u.protocol !== 'https:') return null;
    const h = u.hostname.toLowerCase();
    if (h === 'easylm.vercel.app') return o;
    // Vercel preview: easylm-<hash>-<team>.vercel.app or easylm-git-<branch>-<team>.vercel.app
    if (/^easylm[-a-z0-9]*\.vercel\.app$/.test(h)) return o;
    return null;
  } catch {
    return null;
  }
}

/** Apply CORS. Returns true if the handler should return immediately (OPTIONS). */
export function applyCors(req: any, res: any): boolean {
  const origin = req?.headers?.origin || req?.headers?.Origin || '';
  const allow = allowedOrigin(String(origin));
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
