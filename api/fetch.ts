import * as dns from 'node:dns/promises';
import { applyCors, requireBrowserOrigin, URL_MAX_CHARS } from './_lib/origin';
import {
  FETCH_MAX_BYTES,
  FETCH_MAX_CHARS,
  hostLooksPrivate,
  isPrivateIP,
  isWikiHost,
  parsePublicHttpsUrl
} from './_lib/ssrf';

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

  if (!isWikiHost(targetUrl.hostname)) {
    return res.status(400).json({
      ok: false,
      error: 'This origin only fetches Wikipedia, Wikiquote, and Wikisource. EasyLM does not proxy arbitrary URLs.'
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
