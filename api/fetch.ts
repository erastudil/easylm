export default async function handler(req: any, res: any) {
  const queryUrl = req.query?.url || (req.url ? new URL(req.url, 'http://localhost').searchParams.get('url') : '');
  let targetUrl = (queryUrl || '').trim();

  if (!targetUrl) {
    return res.status(400).json({ ok: false, error: 'Query parameter "url" is required' });
  }

  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = 'https://' + targetUrl;
  }

  const maxChars = parseInt(req.query?.max_chars || '12000', 10);

  // 1. Wikipedia direct clean API extract if Wikipedia URL
  try {
    const parsed = new URL(targetUrl);
    if (parsed.hostname.includes('wikipedia.org')) {
      const titleMatch = parsed.pathname.match(/\/wiki\/(.+)/i);
      if (titleMatch) {
        const title = decodeURIComponent(titleMatch[1]).replace(/_/g, ' ').split('#')[0];
        const wikiApi = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=extracts|info&explaintext=1&inprop=url&redirects=1&format=json`;
        const wikiResp = await fetch(wikiApi);
        if (wikiResp.ok) {
          const data = await wikiResp.json();
          const pages = data?.query?.pages || {};
          const page = Object.values(pages)[0] as any;
          if (page && page.extract) {
            return res.status(200).json({
              ok: true,
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
    // fall through to generic fetch
  }

  // 2. Generic Web Fetch with HTML stripping
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const resp = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 EasyLM/0.1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.7'
      },
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
      error: err?.message || 'Failed to fetch webpage'
    });
  }
}
