import * as dns from 'node:dns/promises';

const STATIC_ALLOWED = new Set([
  'https://easylm.vercel.app',
  'http://localhost:5175',
  'http://127.0.0.1:5175',
  'http://localhost:4173',
  'http://127.0.0.1:4173'
]);

function allowedOrigin(origin: string | undefined | null): string | null {
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

function applyCors(req: any, res: any): boolean {
  const origin = String(req?.headers?.origin || req?.headers?.Origin || '');
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

function requireBrowserOrigin(req: any, res: any): boolean {
  const origin = String(req?.headers?.origin || req?.headers?.Origin || '');
  if (allowedOrigin(origin)) return true;
  try {
    const ref = String(req?.headers?.referer || req?.headers?.Referer || '');
    if (ref) {
      const u = new URL(ref);
      if (allowedOrigin(`${u.protocol}//${u.host}`)) return true;
    }
  } catch {
    // ignore
  }
  res.status(403).json({ ok: false, error: 'Forbidden origin' });
  return false;
}

const URL_MAX_CHARS = 2048;
const FETCH_MAX_CHARS = 14000;
const FETCH_MAX_BYTES = 400000;

function normalizeHostname(hostname: string): string {
  return String(hostname || '').trim().toLowerCase().replace(/\.+$/, '');
}

function isWikiHost(hostname: string): boolean {
  const h = normalizeHostname(hostname);
  const roots = ['wikipedia.org', 'wikisource.org', 'wikiquote.org', 'wikimedia.org', 'mediawiki.org'];
  return roots.some(root => h === root || h.endsWith('.' + root));
}

const VETTED_WHITELIST_ROOTS = [
  // Encyclopedic & Wiki
  'wikipedia.org',
  'wikisource.org',
  'wikiquote.org',
  'wikimedia.org',
  'mediawiki.org',
  'wikidata.org',

  // Real-Time News & Wire Feeds
  'news.google.com',
  'bbci.co.uk',
  'bbc.com',
  'bbc.co.uk',
  'npr.org',
  'nytimes.com',
  'reuters.com',

  // Real-Time Financial & Market Data
  'finance.yahoo.com',
  'stooq.com',
  'sec.gov',

  // Real-Time Sports Scores
  'espn.com',

  // Open Data & Scientific Reference (Qwen Survey Integration)
  'nist.gov',
  'ncbi.nlm.nih.gov',
  'nih.gov',
  'census.gov',
  'govinfo.gov',
  'uscode.house.gov',
  'data.gov',
  'usgs.gov',
  'weather.gov',
  'open-meteo.com',
  'nasa.gov',
  'arxiv.org',
  'worldbank.org',
  'imf.org',
  'openstreetmap.org',
  'conceptnet.io',
  'dbpedia.org',
  'bnl.gov',
  'iupac.org',
  'ciaaw.org',
  'rfc-editor.org',
  'w3.org',
  'whatwg.org',
  'tc39.es',
  'unicode.org'
];

function isWhitelistedHost(hostname: string): boolean {
  const h = normalizeHostname(hostname);
  if (!h || hostnameIsBlocked(h)) return false;
  return VETTED_WHITELIST_ROOTS.some(root => h === root || h.endsWith('.' + root));
}

function isPrivateIP(ip: string): boolean {
  const s = String(ip || '').trim().toLowerCase().replace(/^\[/, '').replace(/\]$/, '');
  if (!s) return true;
  if (s.startsWith('::ffff:')) return isPrivateIP(s.slice(7));
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
    if (a === 0 || a === 10 || a === 127) return true;
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

function hostnameIsBlocked(hostname: string): boolean {
  const h = normalizeHostname(hostname);
  if (!h) return true;
  if (h === 'localhost' || h === 'localhost.localdomain' || h === 'metadata.google.internal') return true;
  if (h === '0' || h === '0.0.0.0') return true;
  return ['.localhost', '.local', '.internal', '.lan', '.home', '.corp', '.localdomain'].some(sfx => h.endsWith(sfx));
}

function ipv4FromWeirdLiteral(host: string): string | null {
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

function hostLooksPrivate(hostname: string): boolean {
  const h = normalizeHostname(hostname);
  if (hostnameIsBlocked(h)) return true;
  const weird = ipv4FromWeirdLiteral(h);
  if (weird && isPrivateIP(weird)) return true;
  if (h.includes(':') || /^\d{1,3}(\.\d{1,3}){3}$/.test(h)) {
    if (isPrivateIP(h)) return true;
  }
  return false;
}

function parsePublicHttpsUrl(raw: string): { ok: true; url: URL } | { ok: false; error: string } {
  let s = String(raw || '').trim();
  if (!s) return { ok: false, error: 'URL is required' };
  const lower = s.toLowerCase();
  if (lower.startsWith('file:') || lower.startsWith('data:') || lower.startsWith('blob:') || lower.startsWith('javascript:') || lower.startsWith('ftp:')) {
    return { ok: false, error: 'Blocked URL scheme' };
  }
  if (!s.startsWith('http://') && !s.startsWith('https://')) s = 'https://' + s;
  let u: URL;
  try {
    u = new URL(s);
  } catch {
    return { ok: false, error: 'Invalid URL' };
  }
  if (u.username || u.password) return { ok: false, error: 'Credentials in URL are blocked' };
  if (u.protocol === 'http:') u.protocol = 'https:';
  if (u.protocol !== 'https:') return { ok: false, error: 'Only https URLs are allowed' };
  if (u.port && u.port !== '443') return { ok: false, error: 'Nonstandard port blocked' };
  if (hostLooksPrivate(u.hostname)) return { ok: false, error: 'Private or local host blocked' };
  return { ok: true, url: u };
}

const COMMON_HEADERS = {
  'User-Agent': 'EasyLM/0.1.0 (https://easylm.vercel.app; info@humansandai.com)',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.7'
};

async function assertPublicResolved(hostname: string): Promise<{ ok: true } | { ok: false; error: string }> {
  if (hostLooksPrivate(hostname)) {
    return { ok: false, error: 'Private or local host blocked' };
  }
  try {
    const records = await dns.lookup(hostname, { all: true, verbatim: true });
    if (!records || records.length === 0) {
      return { ok: false, error: 'Host did not resolve' };
    }
    for (const rec of records) {
      if (isPrivateIP(rec.address)) {
        return { ok: false, error: 'Host resolves to a private address' };
      }
    }
    return { ok: true };
  } catch {
    return { ok: false, error: 'DNS lookup failed' };
  }
}

function stripHtml(raw: string): string {
  return raw
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, ' ')
    .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#160;/gi, ' ')
    .replace(/&#8203;/gi, '')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

async function readCappedText(resp: Response): Promise<string> {
  const reader = resp.body?.getReader();
  if (!reader) {
    const t = await resp.text();
    return t.slice(0, FETCH_MAX_BYTES);
  }
  const chunks: Uint8Array[] = [];
  let received = 0;
  const dec = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      received += value.byteLength;
      if (received > FETCH_MAX_BYTES) {
        chunks.push(value.slice(0, Math.max(0, FETCH_MAX_BYTES - (received - value.byteLength))));
        try {
          await reader.cancel();
        } catch {
          // ignore
        }
        break;
      }
      chunks.push(value);
    }
  }
  const total = received > FETCH_MAX_BYTES ? FETCH_MAX_BYTES : received;
  const buf = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    const n = Math.min(c.byteLength, total - offset);
    buf.set(c.subarray(0, n), offset);
    offset += n;
    if (offset >= total) break;
  }
  return dec.decode(buf);
}

async function pinnedFetch(target: URL, hops = 0): Promise<Response> {
  if (hops > 2) {
    throw new Error('Too many redirects');
  }
  const resolved = await assertPublicResolved(target.hostname);
  if (resolved.ok === false) {
    throw new Error(resolved.error);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8500);
  try {
    const resp = await fetch(target.toString(), {
      headers: COMMON_HEADERS,
      signal: controller.signal,
      redirect: 'manual'
    });

    if (resp.status >= 300 && resp.status < 400) {
      const loc = resp.headers.get('location');
      if (!loc) {
        throw new Error('Redirect without Location');
      }
      const nextRaw = new URL(loc, target).toString();
      const parsed = parsePublicHttpsUrl(nextRaw);
      if (parsed.ok === false) {
        throw new Error(parsed.error);
      }
      return pinnedFetch(parsed.url, hops + 1);
    }

    return resp;
  } finally {
    clearTimeout(timeout);
  }
}

export default async function handler(req: any, res: any) {
  if (applyCors(req, res)) return;
  if (!requireBrowserOrigin(req, res)) return;

  const queryUrl = req.query?.url || (req.url ? new URL(req.url, 'http://localhost').searchParams.get('url') : '');
  if (String(queryUrl || '').length > URL_MAX_CHARS) {
    return res.status(400).json({ ok: false, error: 'URL too long' });
  }
  const parsed = parsePublicHttpsUrl(String(queryUrl || ''));
  if (parsed.ok === false) {
    return res.status(400).json({ ok: false, error: parsed.error });
  }
  const targetUrl = parsed.url;

  if (!isWhitelistedHost(targetUrl.hostname)) {
    return res.status(400).json({
      ok: false,
      error: 'This origin only fetches vetted whitelist hosts (Wikipedia, Google News RSS, Yahoo Finance, ESPN, NIST, PubChem, Census, ArXiv, World Bank, etc.). Arbitrary URLs are blocked.'
    });
  }

  const maxCharsRaw = parseInt(String(req.query?.max_chars || FETCH_MAX_CHARS), 10);
  const maxChars = Number.isFinite(maxCharsRaw)
    ? Math.min(Math.max(maxCharsRaw, 1), FETCH_MAX_CHARS)
    : FETCH_MAX_CHARS;

  try {
    const host = targetUrl.hostname;

    if (isWikiHost(host) && host.includes('wikisource.org')) {
      const match = targetUrl.pathname.match(/\/wiki\/(.+)/i);
      if (match) {
        const pageTitle = decodeURIComponent(match[1]).split('#')[0];
        const wsApi = `https://${host}/w/api.php?action=parse&page=${encodeURIComponent(pageTitle)}&prop=text&format=json`;
        const wsParsed = parsePublicHttpsUrl(wsApi);
        if (wsParsed.ok) {
          const wsResp = await pinnedFetch(wsParsed.url);
          if (wsResp.ok) {
            const wsJson = await wsResp.json();
            const rawHtml = wsJson?.parse?.text?.['*'];
            if (rawHtml) {
              const cleanText = stripHtml(rawHtml);
              return res.status(200).json({
                ok: true,
                source: 'wikisource',
                url: targetUrl.toString(),
                title: wsJson.parse.title || pageTitle.replace(/_/g, ' '),
                text: cleanText.slice(0, maxChars),
                truncated: cleanText.length > maxChars
              });
            }
          }
        }
      }
    }

    if (isWikiHost(host) && host.includes('wikiquote.org')) {
      const match = targetUrl.pathname.match(/\/wiki\/(.+)/i);
      if (match) {
        const pageTitle = decodeURIComponent(match[1]).replace(/_/g, ' ').split('#')[0];
        const wqApi = `https://${host}/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=extracts|info&explaintext=1&inprop=url&redirects=1&format=json`;
        const wqParsed = parsePublicHttpsUrl(wqApi);
        if (wqParsed.ok) {
          const wqResp = await pinnedFetch(wqParsed.url);
          if (wqResp.ok) {
            const wqJson = await wqResp.json();
            const pages = wqJson?.query?.pages || {};
            const page = Object.values(pages)[0] as any;
            if (page && page.extract) {
              return res.status(200).json({
                ok: true,
                source: 'wikiquote',
                url: page.fullurl || targetUrl.toString(),
                title: page.title || pageTitle,
                text: page.extract.slice(0, maxChars),
                truncated: page.extract.length > maxChars
              });
            }
          }
        }
      }
    }

    if (isWikiHost(host) && host.includes('wikipedia.org')) {
      const titleMatch = targetUrl.pathname.match(/\/wiki\/(.+)/i);
      if (titleMatch) {
        const title = decodeURIComponent(titleMatch[1]).replace(/_/g, ' ').split('#')[0];
        const wikiApi = `https://${host}/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=extracts|info&explaintext=1&inprop=url&redirects=1&format=json`;
        const wikiParsed = parsePublicHttpsUrl(wikiApi);
        if (wikiParsed.ok) {
          const wikiResp = await pinnedFetch(wikiParsed.url);
          if (wikiResp.ok) {
            const data = await wikiResp.json();
            const pages = data?.query?.pages || {};
            const page = Object.values(pages)[0] as any;
            if (page && page.extract) {
              return res.status(200).json({
                ok: true,
                source: 'wikipedia',
                url: page.fullurl || targetUrl.toString(),
                title: page.title || title,
                text: page.extract.slice(0, maxChars),
                truncated: page.extract.length > maxChars
              });
            }
          }
        }
      }
    }
  } catch {
    // fall through to generic fetch
  }

  try {
    const resp = await pinnedFetch(targetUrl);

    if (!resp.ok) {
      return res.status(resp.status).json({
        ok: false,
        url: targetUrl.toString(),
        error: `HTTP ${resp.status} ${resp.statusText}`
      });
    }

    const raw = await readCappedText(resp);
    const titleMatch = raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : targetUrl.toString();
    const text = stripHtml(raw);

    return res.status(200).json({
      ok: true,
      url: targetUrl.toString(),
      title,
      text: text.slice(0, maxChars),
      truncated: text.length > maxChars
    });
  } catch (err: any) {
    return res.status(400).json({
      ok: false,
      url: targetUrl.toString(),
      error: err?.message || 'Failed to fetch webpage'
    });
  }
}
