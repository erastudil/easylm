export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const queryRaw = req.query?.q || req.query?.title || (req.url ? new URL(req.url, 'http://localhost').searchParams.get('q') : '');
  const topic = (queryRaw || '').trim();

  if (!topic) {
    return res.status(400).json({ ok: false, error: 'Query parameter "q" or "title" is required' });
  }

  try {
    const fetchSummary = async (term: string) => {
      const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(term.replace(/\s+/g, '_'))}`;
      const resp = await fetch(url, {
        headers: { 'User-Agent': 'EasyLM/0.1.0 (https://easylm.vercel.app; info@humansandai.com)' }
      });
      if (resp.ok) {
        return await resp.json();
      }
      return null;
    };

    let data = await fetchSummary(topic);

    // If direct summary was not found, perform quick search to find exact title match
    if (!data || data.type === 'disambiguation') {
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&utf8=1&format=json`;
      const searchResp = await fetch(searchUrl, {
        headers: { 'User-Agent': 'EasyLM/0.1.0 (https://easylm.vercel.app; info@humansandai.com)' }
      });
      if (searchResp.ok) {
        const searchJson = await searchResp.json();
        const topHit = searchJson?.query?.search?.[0]?.title;
        if (topHit) {
          data = await fetchSummary(topHit);
        }
      }
    }

    if (!data || (!data.extract && !data.description)) {
      return res.status(404).json({ ok: false, error: `No encyclopedic summary found for "${topic}".` });
    }

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
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err.message || 'Error fetching fact summary' });
  }
}
