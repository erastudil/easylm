export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const query = req.query?.q || (req.url ? new URL(req.url, 'http://localhost').searchParams.get('q') : '');
  const q = (query || '').trim();

  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  const commonHeaders = {
    'User-Agent': 'EasyLM/0.1.0 (https://easylm.vercel.app; info@humansandai.com)',
    'Accept': 'application/json, text/plain, */*'
  };

  const isQuoteQuery = /\b(quote|quotes|quotation|quotations|saying|sayings|said|proverb)\b/i.test(q);
  const isChapterQuery = /\b(chapter|volume|act|scene|canto|book\s+\d+)\b/i.test(q);
  const isLiteraryQuery = isQuoteQuery || isChapterQuery || /\b(dumas|monte\s*cristo|shakespeare|hamlet|macbeth|iliad|odyssey|moby\s*dick|austen|dickens|tolstoy|dostoevsky|plato|homer|virgil|poe|edgar\s*allan)\b/i.test(q);

  const results: Array<{ title: string; content: string; url: string }> = [];

  // 1. Specialized Handler: Literary Quotations via Wikiquote
  if (isQuoteQuery || isLiteraryQuery) {
    try {
      const cleanBookOrAuthor = q
        .replace(/\b(quotes?|quotations?|sayings?|famous|popular|best|by|from|in|about)\b/gi, '')
        .trim();

      const searchTarget = cleanBookOrAuthor || q;
      const wqSearchUrl = `https://en.wikiquote.org/w/api.php?action=opensearch&search=${encodeURIComponent(searchTarget)}&limit=3&format=json`;
      const wqResp = await fetch(wqSearchUrl, { headers: commonHeaders });

      if (wqResp.ok) {
        const wqData = await wqResp.json();
        const titles = wqData[1] || [];
        const urls = wqData[3] || [];

        if (titles.length > 0) {
          // Fetch extract for the top hit
          const topTitle = titles[0];
          const extractUrl = `https://en.wikiquote.org/w/api.php?action=query&titles=${encodeURIComponent(topTitle)}&prop=extracts&explaintext=1&format=json`;
          const exResp = await fetch(extractUrl, { headers: commonHeaders });
          if (exResp.ok) {
            const exData = await exResp.json();
            const pages = exData?.query?.pages || {};
            const page = Object.values(pages)[0] as any;
            if (page && page.extract) {
              const cleanExtract = page.extract.slice(0, 1500);
              results.push({
                title: `Wikiquote: ${topTitle}`,
                content: cleanExtract,
                url: urls[0] || `https://en.wikiquote.org/wiki/${encodeURIComponent(topTitle)}`
              });
            }
          }
        }
      }
    } catch {
      // ignore
    }
  }

  // 2. Specialized Handler: Specific Book Chapters via Wikisource
  if (isChapterQuery || isLiteraryQuery) {
    try {
      const chMatch = q.match(/\bchapter\s*(\d+|[ivxlcdm]+)\b/i);
      let wsQuery = q;
      if (chMatch) {
        const chNum = chMatch[1];
        const cleanBook = q
          .replace(new RegExp(`\\bchapter\\s*${chNum}\\b`, 'i'), '')
          .replace(/\b(summarize|read|tell me about|what happens in|overview of|the|book|of|in)\b/gi, ' ')
          .replace(/\s+/g, ' ')
          .trim();
        if (cleanBook) {
          wsQuery = `intitle:"Chapter ${chNum}" ${cleanBook}`;
        }
      }

      const wsSearchUrl = `https://en.wikisource.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(wsQuery)}&format=json`;
      const wsResp = await fetch(wsSearchUrl, { headers: commonHeaders });

      if (wsResp.ok) {
        const wsData = await wsResp.json();
        let searchHits = wsData?.query?.search || [];

        if (chMatch) {
          const chNum = chMatch[1];
          const exactRegex = new RegExp(`chapter\\s*${chNum}(\\b|_|/|$)`, 'i');
          searchHits.sort((a: any, b: any) => (exactRegex.test(b.title) ? 1 : 0) - (exactRegex.test(a.title) ? 1 : 0));
        }

        for (const hit of searchHits.slice(0, 2)) {
          const cleanSnippet = (hit.snippet || '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

          const pageUrl = `https://en.wikisource.org/wiki/${encodeURIComponent(hit.title.replace(/\s+/g, '_'))}`;

          // Try fetching clean parsed text for the exact chapter
          let chapterText = '';
          try {
            const parseUrl = `https://en.wikisource.org/w/api.php?action=parse&page=${encodeURIComponent(hit.title)}&prop=text&format=json`;
            const pResp = await fetch(parseUrl, { headers: commonHeaders });
            if (pResp.ok) {
              const pData = await pResp.json();
              const rawHtml = pData?.parse?.text?.['*'] || '';
              chapterText = rawHtml
                .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                .replace(/<[^>]+>/g, ' ')
                .replace(/&nbsp;/gi, ' ')
                .replace(/&#160;/gi, ' ')
                .replace(/&#8203;/gi, '')
                .replace(/\s+/g, ' ')
                .trim()
                .slice(0, 1800);
            }
          } catch {
            // fallback to snippet
          }

          results.push({
            title: `Wikisource: ${hit.title}`,
            content: chapterText || cleanSnippet || `Full text chapter on Wikisource.`,
            url: pageUrl
          });
        }
      }
    } catch {
      // ignore
    }
  }

  // 3. Attempt SearXNG query on public instances if not satisfied
  if (results.length < 2) {
    const searxInstances = [
      'https://search.sapti.me',
      'https://searx.perennialte.ch',
      'https://priv.au'
    ];

    for (const instance of searxInstances) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2500);
        const target = `${instance}/search?q=${encodeURIComponent(q)}&format=json`;
        const resp = await fetch(target, {
          headers: { 'User-Agent': 'EasyLM/0.1.0 (Web Search Tool)' },
          signal: controller.signal
        });
        clearTimeout(timeout);

        if (resp.ok) {
          const data = await resp.json();
          if (data.results && Array.isArray(data.results) && data.results.length > 0) {
            for (const r of data.results.slice(0, 3)) {
              results.push({
                title: r.title || 'Result',
                content: r.content || r.snippet || '',
                url: r.url || ''
              });
            }
            break;
          }
        }
      } catch {
        // try next instance
      }
    }
  }

  // 4. Wikipedia OpenSearch Fallback
  if (results.length === 0) {
    try {
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(q)}&limit=3&format=json`;
      const wikiResp = await fetch(wikiUrl, { headers: commonHeaders });
      if (wikiResp.ok) {
        const data = await wikiResp.json();
        const titles = data[1] || [];
        const snippets = data[2] || [];
        const urls = data[3] || [];
        for (let i = 0; i < titles.length; i++) {
          results.push({
            title: titles[i],
            content: snippets[i] || `Wikipedia overview for ${titles[i]}.`,
            url: urls[i] || `https://en.wikipedia.org/wiki/${encodeURIComponent(titles[i])}`
          });
        }
      }
    } catch {
      // fallback
    }
  }

  // 5. Final fallback
  if (results.length === 0) {
    results.push({
      title: `Search for "${q}"`,
      content: `No direct indexed results returned for "${q}". Try refining keywords, naming the author/book, or asking for the specific chapter.`,
      url: `https://duckduckgo.com/?q=${encodeURIComponent(q)}`
    });
  }

  return res.status(200).json({
    ok: true,
    source: results[0]?.title?.includes('Wikiquote') ? 'wikiquote' : results[0]?.title?.includes('Wikisource') ? 'wikisource' : 'multi-engine',
    results: results.slice(0, 4)
  });
}
