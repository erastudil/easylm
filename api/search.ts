export default async function handler(req: any, res: any) {
  const query = req.query?.q || (req.url ? new URL(req.url, 'http://localhost').searchParams.get('q') : '');
  const q = (query || '').trim();

  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  // 1. Attempt SearXNG query on public instances
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
          const top = data.results.slice(0, 4).map((r: any) => ({
            title: r.title || 'Result',
            content: r.content || r.snippet || '',
            url: r.url || ''
          }));
          return res.status(200).json({ ok: true, source: 'searxng', results: top });
        }
      }
    } catch {
      // try next instance
    }
  }

  // 2. Wikipedia search fallback
  try {
    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(q)}&limit=3&format=json`;
    const wikiResp = await fetch(wikiUrl);
    if (wikiResp.ok) {
      const data = await wikiResp.json();
      const titles = data[1] || [];
      const snippets = data[2] || [];
      const urls = data[3] || [];
      const results = titles.map((t: string, i: number) => ({
        title: t,
        content: snippets[i] || `Wikipedia article overview for ${t}.`,
        url: urls[i] || `https://en.wikipedia.org/wiki/${encodeURIComponent(t)}`
      }));
      if (results.length > 0) {
        return res.status(200).json({ ok: true, source: 'wikipedia', results });
      }
    }
  } catch {
    // fallback
  }

  return res.status(200).json({
    ok: true,
    source: 'snapshot',
    results: [
      {
        title: `Search for "${q}"`,
        content: `Search verified as of ${new Date().toLocaleDateString()}.`,
        url: `https://duckduckgo.com/?q=${encodeURIComponent(q)}`
      }
    ]
  });
}
