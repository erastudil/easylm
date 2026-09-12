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
    const h = u.hostname.toLowerCase();
    if (h === 'easylm.vercel.app') return o;
    if (/^easylm[-a-z0-9]*\.vercel\.app$/.test(h)) return o;
    return null;
  } catch {
    return null;
  }
}

function applyCors(req: any, res: any): boolean {
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

export default async function handler(req: any, res: any) {
  if (applyCors(req, res)) return;

  const queryRaw = req.query?.q || req.query?.title || (req.url ? new URL(req.url, 'http://localhost').searchParams.get('q') : '');
  const topic = (queryRaw || '').trim();

  if (!topic) {
    return res.status(400).json({ ok: false, error: 'Query parameter "q" or "title" is required' });
  }

  const commonHeaders = {
    'User-Agent': 'EasyLM/0.1.0 (https://easylm.vercel.app; info@humansandai.com)'
  };

  const isQuoteOrLit = /\b(quote|quotes|quotation|chapter|volume|scene|act|poem|proverb)\b/i.test(topic);

  // 1. If explicitly asking for quotes or literary text, check Wikiquote first
  if (isQuoteOrLit) {
    try {
      const cleanTarget = topic.replace(/\b(quotes?|quotations?|sayings?|famous|from|in|by|about)\b/gi, '').trim() || topic;
      const wqUrl = `https://en.wikiquote.org/w/api.php?action=opensearch&search=${encodeURIComponent(cleanTarget)}&limit=1&format=json`;
      const wqResp = await fetch(wqUrl, { headers: commonHeaders });
      if (wqResp.ok) {
        const wqData = await wqResp.json();
        const hitTitle = wqData[1]?.[0];
        const hitUrl = wqData[3]?.[0];
        if (hitTitle) {
          const exUrl = `https://en.wikiquote.org/w/api.php?action=query&titles=${encodeURIComponent(hitTitle)}&prop=extracts&explaintext=1&format=json`;
          const exResp = await fetch(exUrl, { headers: commonHeaders });
          if (exResp.ok) {
            const exData = await exResp.json();
            const page = Object.values(exData?.query?.pages || {})[0] as any;
            if (page && page.extract) {
              const summary = `**Literary Quotations: ${hitTitle}** (Wikiquote):\n${page.extract.slice(0, 1600)}\n\n*Reference: ${hitUrl || `https://en.wikiquote.org/wiki/${encodeURIComponent(hitTitle)}`}*`;
              return res.status(200).json({
                ok: true,
                title: hitTitle,
                source: 'wikiquote',
                extract: page.extract.slice(0, 1600),
                url: hitUrl,
                summary
              });
            }
          }
        }
      }
    } catch {
      // fallback to wikipedia
    }
  }

  // 2. Wikipedia Summary
  try {
    const fetchSummary = async (term: string) => {
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term.replace(/\s+/g, '_'))}`;
      const resp = await fetch(url, { headers: commonHeaders });
      if (resp.ok) {
        return await resp.json();
      }
      return null;
    };

    let data = await fetchSummary(topic);

    // If direct summary was not found, perform search
    if (!data || data.type === 'disambiguation') {
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&utf8=1&format=json`;
      const searchResp = await fetch(searchUrl, { headers: commonHeaders });
      if (searchResp.ok) {
        const searchJson = await searchResp.json();
        const topHit = searchJson?.query?.search?.[0]?.title;
        if (topHit) {
          data = await fetchSummary(topHit);
        }
      }
    }

    if (data && (data.extract || data.description)) {
      const title = data.title || topic;
      const description = data.description || '';
      const extract = data.extract || '';
      const pageUrl = data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(title)}`;
      const summary = `**${title}**${description ? ` (${description})` : ''}:\n${extract}\n\n*Reference: ${pageUrl}*`;

      return res.status(200).json({
        ok: true,
        title,
        description,
        extract,
        url: pageUrl,
        summary
      });
    }

    // 3. Wikisource fallback for classic texts or chapter topics
    try {
      const wsSearchUrl = `https://en.wikisource.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&format=json`;
      const wsResp = await fetch(wsSearchUrl, { headers: commonHeaders });
      if (wsResp.ok) {
        const wsJson = await wsResp.json();
        const topWs = wsJson?.query?.search?.[0];
        if (topWs) {
          const parseUrl = `https://en.wikisource.org/w/api.php?action=parse&page=${encodeURIComponent(topWs.title)}&prop=text&format=json`;
          const pResp = await fetch(parseUrl, { headers: commonHeaders });
          if (pResp.ok) {
            const pData = await pResp.json();
            const rawHtml = pData?.parse?.text?.['*'] || '';
            const cleanText = rawHtml
              .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
              .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
              .replace(/<[^>]+>/g, ' ')
              .replace(/&nbsp;/gi, ' ')
              .replace(/&#160;/gi, ' ')
              .replace(/&#8203;/gi, '')
              .replace(/\s+/g, ' ')
              .trim()
              .slice(0, 1600);

            const wsUrl = `https://en.wikisource.org/wiki/${encodeURIComponent(topWs.title.replace(/\s+/g, '_'))}`;
            const summary = `**${topWs.title}** (Wikisource):\n${cleanText}\n\n*Reference: ${wsUrl}*`;

            return res.status(200).json({
              ok: true,
              title: topWs.title,
              source: 'wikisource',
              extract: cleanText,
              url: wsUrl,
              summary
            });
          }
        }
      }
    } catch {
      // fallback
    }

    return res.status(404).json({ ok: false, error: `No encyclopedic summary found for "${topic}".` });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err.message || 'Error fetching fact summary' });
  }
}
