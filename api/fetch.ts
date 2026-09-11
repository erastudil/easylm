export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const queryUrl = req.query?.url || (req.url ? new URL(req.url, 'http://localhost').searchParams.get('url') : '');
  let targetUrl = (queryUrl || '').trim();

  if (!targetUrl) {
    return res.status(400).json({ ok: false, error: 'Query parameter "url" is required' });
  }

  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = 'https://' + targetUrl;
  }

  const maxChars = parseInt(req.query?.max_chars || '14000', 10);
  const commonHeaders = {
    'User-Agent': 'EasyLM/0.1.0 (https://easylm.vercel.app; info@humansandai.com)',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.7'
  };

  try {
    const parsed = new URL(targetUrl);

    // 1. Wikisource Direct Clean Text Parser (for full literary chapters, classic books)
    if (parsed.hostname.includes('wikisource.org')) {
      const match = parsed.pathname.match(/\/wiki\/(.+)/i);
      if (match) {
        const pageTitle = decodeURIComponent(match[1]).split('#')[0];
        const wsApi = `https://${parsed.hostname}/w/api.php?action=parse&page=${encodeURIComponent(pageTitle)}&prop=text&format=json`;
        const wsResp = await fetch(wsApi, { headers: commonHeaders });
        if (wsResp.ok) {
          const wsJson = await wsResp.json();
          const rawHtml = wsJson?.parse?.text?.['*'];
          if (rawHtml) {
            const cleanText = rawHtml
              .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
              .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
              .replace(/<[^>]+>/g, ' ')
              .replace(/&nbsp;/gi, ' ')
              .replace(/&#160;/gi, ' ')
              .replace(/&#8203;/gi, '')
              .replace(/&amp;/gi, '&')
              .replace(/&quot;/gi, '"')
              .replace(/&#39;/gi, "'")
              .replace(/\s+/g, ' ')
              .trim();

            return res.status(200).json({
              ok: true,
              source: 'wikisource',
              url: targetUrl,
              title: wsJson.parse.title || pageTitle.replace(/_/g, ' '),
              text: cleanText.slice(0, maxChars),
              truncated: cleanText.length > maxChars
            });
          }
        }
      }
    }

    // 2. Wikiquote Clean Plaintext Extract (for literary quotations by chapter/act)
    if (parsed.hostname.includes('wikiquote.org')) {
      const match = parsed.pathname.match(/\/wiki\/(.+)/i);
      if (match) {
        const pageTitle = decodeURIComponent(match[1]).replace(/_/g, ' ').split('#')[0];
        const wqApi = `https://${parsed.hostname}/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=extracts|info&explaintext=1&inprop=url&redirects=1&format=json`;
        const wqResp = await fetch(wqApi, { headers: commonHeaders });
        if (wqResp.ok) {
          const wqJson = await wqResp.json();
          const pages = wqJson?.query?.pages || {};
          const page = Object.values(pages)[0] as any;
          if (page && page.extract) {
            return res.status(200).json({
              ok: true,
              source: 'wikiquote',
              url: page.fullurl || targetUrl,
              title: page.title || pageTitle,
              text: page.extract.slice(0, maxChars),
              truncated: page.extract.length > maxChars
            });
          }
        }
      }
    }

    // 3. Wikipedia Direct Clean Extract
    if (parsed.hostname.includes('wikipedia.org')) {
      const titleMatch = parsed.pathname.match(/\/wiki\/(.+)/i);
      if (titleMatch) {
        const title = decodeURIComponent(titleMatch[1]).replace(/_/g, ' ').split('#')[0];
        const wikiApi = `https://${parsed.hostname}/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=extracts|info&explaintext=1&inprop=url&redirects=1&format=json`;
        const wikiResp = await fetch(wikiApi, { headers: commonHeaders });
        if (wikiResp.ok) {
          const data = await wikiResp.json();
          const pages = data?.query?.pages || {};
          const page = Object.values(pages)[0] as any;
          if (page && page.extract) {
            return res.status(200).json({
              ok: true,
              source: 'wikipedia',
              url: page.fullurl || targetUrl,
              title: page.title || title,
              text: page.extract.slice(0, maxChars),
              truncated: page.extract.length > maxChars
            });
          }
        }
      }
    }
  } catch {
    // fall through to generic web fetch
  }

  // 4. Generic Web Fetch with HTML stripping
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8500);

    const resp = await fetch(targetUrl, {
      headers: commonHeaders,
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!resp.ok) {
      return res.status(resp.status).json({
        ok: false,
        url: targetUrl,
        error: `HTTP ${resp.status} ${resp.statusText}`
      });
    }

    const raw = await resp.text();

    // Extract Title
    const titleMatch = raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : targetUrl;

    // Strip Scripts, Styles, SVG, Nav, Header, Footer
    let text = raw
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, ' ')
      .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, ' ')
      .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, ' ')
      .replace(/<svg[^>]*>[\s\S]*?<\/svg>/gi, ' ')
      .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&amp;/gi, '&')
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>')
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/\s+/g, ' ')
      .trim();

    return res.status(200).json({
      ok: true,
      url: targetUrl,
      title,
      text: text.slice(0, maxChars),
      truncated: text.length > maxChars
    });
  } catch (err: any) {
    return res.status(500).json({
      ok: false,
      url: targetUrl,
      error: `Failed to fetch webpage: ${err?.message || 'Network error'}`
    });
  }
}
