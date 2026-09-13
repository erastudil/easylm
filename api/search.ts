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

function clipQuery(raw: unknown, max = 200): string {
  return String(raw || '').trim().slice(0, max);
}

function parseRssItems(xml: string, limit = 4): Array<{ title: string; content: string; url: string }> {
  const items: Array<{ title: string; content: string; url: string }> = [];
  const itemMatches = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)];
  for (const match of itemMatches.slice(0, limit)) {
    const rawItem = match[1];
    const titleMatch = rawItem.match(/<title>([\s\S]*?)<\/title>/i);
    const linkMatch = rawItem.match(/<link>([\s\S]*?)<\/link>/i);
    const pubDateMatch = rawItem.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);
    const sourceMatch = rawItem.match(/<source[^>]*>([\s\S]*?)<\/source>/i);

    let title = (titleMatch ? titleMatch[1] : '').replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim();
    let link = (linkMatch ? linkMatch[1] : '').trim();
    let pubDate = (pubDateMatch ? pubDateMatch[1] : '').trim();
    let source = (sourceMatch ? sourceMatch[1] : '').trim();

    title = title
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ');

    if (title && link) {
      const displayTitle = source ? `[${source}] ${title}` : title;
      const snippet = pubDate ? `Published: ${pubDate} via ${source || 'Google News'}` : `Google News headline via ${source || 'verified news wire'}.`;
      items.push({
        title: displayTitle,
        content: snippet,
        url: link
      });
    }
  }
  return items;
}

export default async function handler(req: any, res: any) {
  if (applyCors(req, res)) return;
  if (!requireBrowserOrigin(req, res)) return;

  const query = req.query?.q || (req.url ? new URL(req.url, 'http://localhost').searchParams.get('q') : '');
  const q = clipQuery(query);

  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }

  const commonHeaders = {
    'User-Agent': 'EasyLM/0.1.0 (https://easylm.vercel.app; info@humansandai.com)',
    'Accept': 'application/json, text/plain, application/xml, text/xml, */*'
  };

  const results: Array<{ title: string; content: string; url: string }> = [];

  // 1. Real-Time Sports Scores & Schedules via ESPN Public Scoreboard
  const isSportsQuery = /\b(score|scores|game|games|match|matches|vs|versus|nfl|nba|mlb|nhl|epl|premier\s*league|champions\s*league|mls|super\s*bowl|playoffs|standings)\b/i.test(q)
    || /\b(chiefs|ravens|eagles|cowboys|packers|49ers|patriots|bills|lions|lakers|celtics|warriors|bulls|knicks|yankees|dodgers|red\s*sox|arsenal|liverpool|chelsea|manchester|real\s*madrid|barcelona)\b/i.test(q);

  if (isSportsQuery) {
    try {
      let sportPath = 'football/nfl';
      if (/\b(nba|basketball|lakers|celtics|warriors|bulls|knicks)\b/i.test(q)) {
        sportPath = 'basketball/nba';
      } else if (/\b(mlb|baseball|yankees|dodgers|red\s*sox)\b/i.test(q)) {
        sportPath = 'baseball/mlb';
      } else if (/\b(nhl|hockey|stanley\s*cup)\b/i.test(q)) {
        sportPath = 'hockey/nhl';
      } else if (/\b(epl|premier\s*league|arsenal|liverpool|chelsea|manchester|soccer)\b/i.test(q)) {
        sportPath = 'soccer/eng.1';
      } else if (/\b(champions\s*league|uefa|real\s*madrid|barcelona)\b/i.test(q)) {
        sportPath = 'soccer/uefa.champions';
      } else if (/\b(college\s*football|cfb|ncaa\s*football)\b/i.test(q)) {
        sportPath = 'football/college-football';
      }

      const espnUrl = `https://site.api.espn.com/apis/site/v2/sports/${sportPath}/scoreboard`;
      const espnResp = await fetch(espnUrl, { headers: commonHeaders });

      if (espnResp.ok) {
        const espnData = await espnResp.json();
        let events = espnData?.events || [];

        // Check for specific team filter in query
        const teamMatch = q.match(/\b(chiefs|ravens|eagles|cowboys|packers|49ers|patriots|bills|lions|lakers|celtics|warriors|bulls|knicks|yankees|dodgers|arsenal|liverpool|chelsea|manchester|real\s*madrid|barcelona)\b/i);
        if (teamMatch && events.length > 0) {
          const tName = teamMatch[1].toLowerCase();
          const filtered = events.filter((e: any) => (e.name || '').toLowerCase().includes(tName));
          if (filtered.length > 0) events = filtered;
        }

        for (const ev of events.slice(0, 3)) {
          const comp = ev.competitions?.[0];
          const competitors = comp?.competitors || [];
          const away = competitors.find((c: any) => c.homeAway === 'away') || competitors[1];
          const home = competitors.find((c: any) => c.homeAway === 'home') || competitors[0];
          const statusDetail = ev.status?.type?.detail || ev.status?.type?.description || 'Scheduled';
          const awayScore = away?.score ?? '-';
          const homeScore = home?.score ?? '-';
          const dateStr = ev.date ? new Date(ev.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '';

          results.push({
            title: `[ESPN Sports] ${away?.team?.displayName || 'Away'} @ ${home?.team?.displayName || 'Home'}: ${statusDetail}`,
            content: `Score: ${away?.team?.displayName || 'Away'} ${awayScore} — ${homeScore} ${home?.team?.displayName || 'Home'}\nStatus: ${statusDetail} · Date: ${dateStr}\nVenue: ${comp?.venue?.fullName || 'Stadium'}`,
            url: `https://www.espn.com/${sportPath}/game/_/gameId/${ev.id}`
          });
        }
      }
    } catch {
      // ignore
    }
  }

  // 2. Real-Time Stocks & Market Quotes via Yahoo Finance Public Endpoints
  const isFinanceQuery = /\b(stock|stocks|shares?|ticker|equity|market\s*price|quote|quotes|nasdaq|nyse|s&p\s*500|sp500|dow\s*jones|crypto|bitcoin|btc|ethereum|eth|solana|market\s*cap)\b/i.test(q)
    || /^[A-Z]{1,5}$/.test(q.trim())
    || /\b(AAPL|MSFT|GOOGL|AMZN|NVDA|TSLA|META|SPY|QQQ)\b/i.test(q);

  if (isFinanceQuery) {
    try {
      let symbol = '';
      const directTicker = q.match(/\b([A-Z]{1,5})\b/);
      const symbolMap: Record<string, string> = {
        apple: 'AAPL',
        microsoft: 'MSFT',
        nvidia: 'NVDA',
        tesla: 'TSLA',
        google: 'GOOGL',
        amazon: 'AMZN',
        meta: 'META',
        facebook: 'META',
        bitcoin: 'BTC-USD',
        btc: 'BTC-USD',
        ethereum: 'ETH-USD',
        eth: 'ETH-USD',
        solana: 'SOL-USD'
      };

      const qLower = q.toLowerCase();
      for (const [name, sym] of Object.entries(symbolMap)) {
        if (qLower.includes(name)) {
          symbol = sym;
          break;
        }
      }

      if (!symbol && directTicker && !['THE', 'FOR', 'AND', 'WHAT', 'HOW'].includes(directTicker[1])) {
        symbol = directTicker[1];
      }

      // If still undetermined, query Yahoo Finance search endpoint
      if (!symbol) {
        const cleanQuery = q.replace(/\b(stock|stocks|shares?|price|quote|ticker|market|what|is|the)\b/gi, '').trim();
        if (cleanQuery) {
          const searchUrl = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(cleanQuery)}&quotesCount=1`;
          const sResp = await fetch(searchUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
          if (sResp.ok) {
            const sData = await sResp.json();
            symbol = sData?.quotes?.[0]?.symbol || '';
          }
        }
      }

      if (symbol) {
        const chartUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`;
        const chartResp = await fetch(chartUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (chartResp.ok) {
          const chartData = await chartResp.json();
          const meta = chartData?.chart?.result?.[0]?.meta;
          if (meta && meta.regularMarketPrice !== undefined) {
            const price = Number(meta.regularMarketPrice).toFixed(2);
            const prevClose = Number(meta.previousClose || meta.chartPreviousClose || price);
            const diff = (Number(price) - prevClose).toFixed(2);
            const diffPct = (((Number(price) - prevClose) / prevClose) * 100).toFixed(2);
            const sign = Number(diff) >= 0 ? '+' : '';
            const currency = meta.currency || 'USD';
            const high = meta.regularMarketDayHigh ? Number(meta.regularMarketDayHigh).toFixed(2) : '-';
            const low = meta.regularMarketDayLow ? Number(meta.regularMarketDayLow).toFixed(2) : '-';
            const vol = meta.regularMarketVolume ? meta.regularMarketVolume.toLocaleString() : '-';

            results.push({
              title: `[Yahoo Finance] ${meta.symbol} Quote: $${price} ${currency} (${sign}${diff} / ${sign}${diffPct}%)`,
              content: `Symbol: ${meta.symbol} (${meta.exchangeName || 'Market'})\nCurrent Price: $${price} ${currency} (${sign}${diff} / ${sign}${diffPct}%)\nDay Range: $${low} - $${high} · Previous Close: $${prevClose.toFixed(2)} · Volume: ${vol}`,
              url: `https://finance.yahoo.com/quote/${encodeURIComponent(meta.symbol)}`
            });
          }
        }
      }
    } catch {
      // ignore
    }
  }

  // 3. Real-Time News & Pulse of the World via Google News RSS Feed
  const isNewsQuery = /\b(news|latest|breaking|today|headline|headlines|update|updates|current\s*events|recent|developments)\b/i.test(q);

  if (isNewsQuery || results.length === 0) {
    try {
      const cleanNewsQ = q.replace(/\b(what is the|tell me about|summarize|news about|latest news on|breaking news on)\b/gi, '').trim();
      const newsUrl = cleanNewsQ
        ? `https://news.google.com/rss/search?q=${encodeURIComponent(cleanNewsQ)}&hl=en-US&gl=US&ceid=US:en`
        : `https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en`;

      const newsResp = await fetch(newsUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (newsResp.ok) {
        const xml = await newsResp.text();
        const newsItems = parseRssItems(xml, 3);
        for (const item of newsItems) {
          results.push(item);
        }
      }
    } catch {
      // ignore
    }
  }

  // 4. Specialized Handler: Literary Quotations via Wikiquote
  const isQuoteQuery = /\b(quote|quotes|quotation|quotations|saying|sayings|said|proverb)\b/i.test(q);
  const isChapterQuery = /\b(chapter|volume|act|scene|canto|book\s+\d+)\b/i.test(q);
  const isLiteraryQuery = isQuoteQuery || isChapterQuery || /\b(dumas|monte\s*cristo|shakespeare|hamlet|macbeth|iliad|odyssey|moby\s*dick|austen|dickens|tolstoy|dostoevsky|plato|homer|virgil|poe|edgar\s*allan)\b/i.test(q);

  if (isQuoteQuery || isLiteraryQuery) {
    try {
      const cleanBookOrAuthor = q
        .replace(/\b(quotes?|quotations?|sayings?|famous|popular|best|by|from|in|about)\b/gi, '')
        .trim();

      const searchTarget = cleanBookOrAuthor || q;
      const wqSearchUrl = `https://en.wikiquote.org/w/api.php?action=opensearch&search=${encodeURIComponent(searchTarget)}&limit=2&format=json`;
      const wqResp = await fetch(wqSearchUrl, { headers: commonHeaders });

      if (wqResp.ok) {
        const wqData = await wqResp.json();
        const titles = wqData[1] || [];
        const urls = wqData[3] || [];

        if (titles.length > 0) {
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

  // 5. Specialized Handler: Specific Book Chapters via Wikisource
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
        const searchHits = wsData?.query?.search || [];

        for (const hit of searchHits.slice(0, 2)) {
          const cleanSnippet = (hit.snippet || '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

          const pageUrl = `https://en.wikisource.org/wiki/${encodeURIComponent(hit.title.replace(/\s+/g, '_'))}`;
          results.push({
            title: `Wikisource: ${hit.title}`,
            content: cleanSnippet || `Full text chapter on Wikisource.`,
            url: pageUrl
          });
        }
      }
    } catch {
      // ignore
    }
  }

  // 6. Wikipedia OpenSearch Fallback for encyclopedic & open data topics
  if (results.length < 2) {
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
      // ignore
    }
  }

  // 7. Final fallback if nothing returned
  if (results.length === 0) {
    results.push({
      title: `Search for "${q}"`,
      content: `No direct indexed results returned for "${q}". Try refining keywords, naming the stock ticker, sports team, or author.`,
      url: `https://duckduckgo.com/?q=${encodeURIComponent(q)}`
    });
  }

  const primarySource = results[0]?.title?.includes('Yahoo Finance')
    ? 'yahoo-finance'
    : results[0]?.title?.includes('ESPN')
    ? 'espn'
    : results[0]?.title?.includes('Google News')
    ? 'google-news-rss'
    : results[0]?.title?.includes('Wikiquote')
    ? 'wikiquote'
    : results[0]?.title?.includes('Wikisource')
    ? 'wikisource'
    : 'open-web';

  return res.status(200).json({
    ok: true,
    source: primarySource,
    results: results.slice(0, 4)
  });
}
