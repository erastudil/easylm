import { ToolExecution } from '../types';
import { isKidAllowedTool, KID_TOOL_REFUSAL, normalizeToolName } from './kid_tools';
import { execMath } from './math';
import { isWikiHost, parsePublicHttpsUrl } from './ssrf';
import { execStacks } from './stacks';
import { execWarehouse } from './warehouse';

export { execMath } from './math';
export { execStacks } from './stacks';
export { execWarehouse } from './warehouse';

export const SYSTEM_TOOLS_PROMPT = `
You have access to the following built-in tools:
1. calc(expression: string) - evaluate math expressions deterministically (e.g. "sqrt(144) * 5200").
2. units(from: string, to: string, amount: number) - convert physical units (e.g. "100 km to miles", "3.75 gallons to fl oz", "85 F to C").
3. exchange(query: string) - live currency exchange rates & conversion (e.g. "100 USD to EUR", "50000 JPY to USD").
4. weather(location: string) - live temperature, conditions, and 3-day forecast for any city or region (e.g. "Dallas, TX", "London", "Tokyo").
5. datetime(timezone?: string) - current local or global time & date (e.g. "" for local time, or "Tokyo", "London", "New York").
6. fact(topic: string) - verified encyclopedic summary for notable people, concepts, history, or science (e.g. "Alan Turing", "photosynthesis", "James Webb Space Telescope").
7. dictionary(word: string) - exact definition, pronunciation, part of speech, and origin for English words (e.g. "obfuscate", "serendipity").
8. web_search(query: string) - search the web for recent events, specific websites, literary quotations, or classic book chapters (via Wikiquote, Wikisource, Wikipedia).
9. web_fetch(url: string) - read Wikipedia, Wikiquote, and Wikisource pages. Other URLs only if the site allows browser CORS. EasyLM does not proxy arbitrary websites.
10. stacks(query: string) - search local university library stacks across 28 academic subjects (Dewey 000–900). Sovereign, offline university reference books. (alias: warehouse).

CRITICAL INSTRUCTIONS:
- For casual conversation, greetings, or questions about yourself (e.g. "hi", "how are you?", "who are you?"), DO NOT call any tools. Answer naturally.
- For weather inquiries, call "weather".
- For currency conversion, call "exchange".
- For word definitions, pronunciations, and etymology, call "dictionary".
- For encyclopedic overviews of people, concepts, science, history, or literary quotes/works, call "fact" or "web_search".
- For specific book chapters (e.g. "Count of Monte Cristo Chapter 5" or "Moby Dick Chapter 1") or literary quotations, call "web_search".
- MANDATORY TOOL USE FOR LITERATURE & CITATIONS: You do NOT have verbatim book chapters, literary quotations, or historical texts stored in memory. You must NEVER guess or fabricate quotes from memory. When asked for quotes, famous lines, or specific chapters from any book, novel, author, or play (e.g. Dumas, Shakespeare, Homer, Austen), you MUST emit <tool_call>{"name": "web_search", "query": "quotes from [Work]"}</tool_call> BEFORE answering.
- When you do need a tool, emit EXACTLY this syntax on its own line:
<tool_call>{"name": "weather", "query": "Dallas, TX"}</tool_call>
or
<tool_call>{"name": "exchange", "query": "100 USD to EUR"}</tool_call>
or
<tool_call>{"name": "dictionary", "query": "serendipity"}</tool_call>
or
<tool_call>{"name": "fact", "query": "Alan Turing"}</tool_call>
or
<tool_call>{"name": "calc", "query": "sqrt(144) * 5200"}</tool_call>
or
<tool_call>{"name": "web_search", "query": "search query"}</tool_call>
or
<tool_call>{"name": "web_fetch", "query": "https://example.com"}</tool_call>
or
<tool_call>{"name": "stacks", "query": "Bayes theorem"}</tool_call>
`;

export const SYSTEM_TOOLS_PROMPT_KID = `
You have access to these local tools only:
1. calc(expression: string) - evaluate math expressions.
2. units(from: string, to: string, amount: number) - convert physical units.
3. datetime(timezone?: string) - current local or world time.
4. stacks(query: string) - local university library stacks across academic subjects.

Do not call dictionary, web_search, web_fetch, weather, exchange, or fact. Those leave the machine (dictionary uses an external API).
When you need a tool, emit EXACTLY:
<tool_call>{"name": "calc", "query": "sqrt(144) * 5200"}</tool_call>
`;

function canonUnit(raw: string): string {
  const x = raw.toLowerCase().replace(/°/g, '').trim();
  const aliases: Record<string, string> = {
    gal: 'gal',
    gallon: 'gal',
    gallons: 'gal',
    oz: 'floz',
    floz: 'floz',
    ounces: 'floz',
    mi: 'mi',
    mile: 'mi',
    miles: 'mi',
    km: 'km',
    kilometer: 'km',
    kilometers: 'km',
    c: 'c',
    celsius: 'c',
    f: 'f',
    fahrenheit: 'f',
    lb: 'lb',
    lbs: 'lb',
    pound: 'lb',
    pounds: 'lb',
    kg: 'kg',
    kilogram: 'kg',
    kilograms: 'kg',
    'km/h': 'kmh',
    kph: 'kmh',
    kmh: 'kmh',
    mph: 'mph',
    'mi/h': 'mph',
    'm/s': 'ms',
    mps: 'ms'
  };
  return aliases[x] || x;
}

/**
 * Deterministic unit converter. Unknown pairs error. No invented 1:1 ratio.
 */
export function execUnits(input: string): { ok: boolean; result?: string; error?: string } {
  const norm = input.toLowerCase().trim();
  const match = norm.match(/^([\d.]+)\s*([a-zA-Z/°]+)\s*(?:to|in)\s*([a-zA-Z/°]+)$/);
  if (!match) {
    return { ok: false, error: 'Could not parse unit format. Use: "<amount> <from_unit> to <to_unit>"' };
  }

  const amount = parseFloat(match[1]);
  if (!Number.isFinite(amount)) {
    return { ok: false, error: 'Could not parse amount' };
  }
  const from = canonUnit(match[2]);
  const to = canonUnit(match[3]);

  if (from === 'gal' && to === 'floz') {
    return { ok: true, result: `${amount} US gallons = ${amount * 128} fluid ounces (fl oz)` };
  }
  if (from === 'floz' && to === 'gal') {
    return { ok: true, result: `${amount} fl oz = ${(amount / 128).toFixed(4)} US gallons` };
  }
  if (from === 'mi' && to === 'km') {
    return { ok: true, result: `${amount} miles = ${(amount * 1.60934).toFixed(2)} kilometers` };
  }
  if (from === 'km' && to === 'mi') {
    return { ok: true, result: `${amount} kilometers = ${(amount / 1.60934).toFixed(2)} miles` };
  }
  if (from === 'c' && to === 'f') {
    return { ok: true, result: `${amount}°C = ${((amount * 9) / 5 + 32).toFixed(1)}°F` };
  }
  if (from === 'f' && to === 'c') {
    return { ok: true, result: `${amount}°F = ${(((amount - 32) * 5) / 9).toFixed(1)}°C` };
  }
  if (from === 'lb' && to === 'kg') {
    return { ok: true, result: `${amount} lbs = ${(amount * 0.453592).toFixed(2)} kg` };
  }
  if (from === 'kg' && to === 'lb') {
    return { ok: true, result: `${amount} kg = ${(amount / 0.453592).toFixed(2)} lbs` };
  }
  if (from === 'kmh' && to === 'mph') {
    return { ok: true, result: `${amount} km/h = ${(amount / 1.60934).toFixed(2)} mph` };
  }
  if (from === 'mph' && to === 'kmh') {
    return { ok: true, result: `${amount} mph = ${(amount * 1.60934).toFixed(2)} km/h` };
  }
  if (from === 'kmh' && to === 'ms') {
    return { ok: true, result: `${amount} km/h = ${(amount / 3.6).toFixed(3)} m/s` };
  }
  if (from === 'ms' && to === 'kmh') {
    return { ok: true, result: `${amount} m/s = ${(amount * 3.6).toFixed(2)} km/h` };
  }

  return {
    ok: false,
    error: `No conversion table for ${match[2]} to ${match[3]}. Supported: gal↔fl oz, mi↔km, km/h↔mph, C↔F, lb↔kg.`
  };
}

/**
 * System Clock & World Time (Client-side Intl)
 */
export function execClock(tzQuery?: string): string {
  const now = new Date();
  const cleanTz = (tzQuery || '').trim();
  if (!cleanTz) {
    return `Current Local Time: ${now.toLocaleString()} (${Intl.DateTimeFormat().resolvedOptions().timeZone}) · ISO: ${now.toISOString()}`;
  }

  const tzMap: Record<string, string> = {
    'tokyo': 'Asia/Tokyo',
    'japan': 'Asia/Tokyo',
    'london': 'Europe/London',
    'uk': 'Europe/London',
    'paris': 'Europe/Paris',
    'berlin': 'Europe/Berlin',
    'rome': 'Europe/Rome',
    'new york': 'America/New_York',
    'nyc': 'America/New_York',
    'est': 'America/New_York',
    'chicago': 'America/Chicago',
    'cst': 'America/Chicago',
    'denver': 'America/Denver',
    'mst': 'America/Denver',
    'los angeles': 'America/Los_Angeles',
    'la': 'America/Los_Angeles',
    'seattle': 'America/Los_Angeles',
    'pst': 'America/Los_Angeles',
    'sydney': 'Australia/Sydney',
    'auckland': 'Pacific/Auckland',
    'beijing': 'Asia/Shanghai',
    'shanghai': 'Asia/Shanghai',
    'hong kong': 'Asia/Hong_Kong',
    'singapore': 'Asia/Singapore',
    'seoul': 'Asia/Seoul',
    'dubai': 'Asia/Dubai',
    'mumbai': 'Asia/Kolkata',
    'delhi': 'Asia/Kolkata',
    'utc': 'UTC',
    'gmt': 'UTC'
  };

  const norm = cleanTz.toLowerCase();
  const timeZone = tzMap[norm] || cleanTz;

  try {
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
    return `Current Time in ${cleanTz} (${timeZone}): ${formatter.format(now)}`;
  } catch {
    return `Current Local Time: ${now.toLocaleString()} (${Intl.DateTimeFormat().resolvedOptions().timeZone}) · (Unrecognized timezone "${cleanTz}")`;
  }
}

/**
 * Serverless Weather & Forecast via Open-Meteo (/api/weather)
 */
export async function execWeather(location: string): Promise<string> {
  const cleanLoc = location.trim().replace(/^["']|["']$/g, '');
  if (!cleanLoc) return 'Error: Please specify a city or region for weather lookup.';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6500);
    const resp = await fetch(`/api/weather?q=${encodeURIComponent(cleanLoc)}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (resp.ok) {
      const data = await resp.json();
      if (data.ok && data.summary) {
        return data.summary;
      }
      if (data.error) {
        return `Weather lookup: ${data.error}`;
      }
    }
    return `Unable to fetch weather for "${cleanLoc}" (HTTP ${resp.status}).`;
  } catch (err: any) {
    return `Weather service unavailable: ${err?.message || 'timeout'}`;
  }
}

/**
 * Serverless Live Currency Exchange via Frankfurter ECB API (/api/exchange)
 */
export async function execExchange(query: string): Promise<string> {
  const cleanQ = query.trim().replace(/^["']|["']$/g, '');
  if (!cleanQ) return 'Error: Please specify currency conversion (e.g. "100 USD to EUR").';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5500);
    const resp = await fetch(`/api/exchange?q=${encodeURIComponent(cleanQ)}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (resp.ok) {
      const data = await resp.json();
      if (data.ok && data.summary) {
        return data.summary;
      }
      if (data.error) {
        return `Currency exchange: ${data.error}`;
      }
    }
    return `Unable to convert currency for "${cleanQ}".`;
  } catch (err: any) {
    return `Currency exchange unavailable: ${err?.message || 'timeout'}`;
  }
}

/**
 * Serverless Encyclopedic Fact Summary via Wikipedia REST API (/api/fact)
 */
export async function execFact(topic: string): Promise<string> {
  const cleanTopic = topic.trim().replace(/^["']|["']$/g, '');
  if (!cleanTopic) return 'Error: Please specify a topic.';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5500);
    const resp = await fetch(`/api/fact?q=${encodeURIComponent(cleanTopic)}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (resp.ok) {
      const data = await resp.json();
      if (data.ok && data.summary) {
        return data.summary;
      }
      if (data.error) {
        return `Encyclopedic lookup: ${data.error}`;
      }
    }
    // Fall back to multi-engine search if fact endpoint missed
    return await execWebSearch(cleanTopic);
  } catch (err: any) {
    return `Encyclopedic lookup error: ${err?.message || 'timeout'}`;
  }
}

/**
 * Serverless Dictionary & Etymology via Free Dictionary API (/api/dictionary)
 */
export async function execDictionary(word: string): Promise<string> {
  const cleanWord = word.trim().replace(/^["']|["']$/g, '');
  if (!cleanWord) return 'Error: Please specify a word to define.';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5500);
    const resp = await fetch(`/api/dictionary?q=${encodeURIComponent(cleanWord)}`, {
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (resp.ok) {
      const data = await resp.json();
      if (data.ok && data.summary) {
        return data.summary;
      }
      if (data.error) {
        return `Dictionary: ${data.error}`;
      }
    }
    return `Unable to define "${cleanWord}".`;
  } catch (err: any) {
    return `Dictionary lookup error: ${err?.message || 'timeout'}`;
  }
}



/**
 * Multi-Engine Web Search (SearXNG + Wikipedia OpenSearch + Instant API)
 */
export async function execWebSearch(query: string, searxngUrl?: string): Promise<string> {
  const cleanQ = query.trim();
  if (!cleanQ) return "Empty search query.";

  const results: Array<{ title: string; snippet: string; url: string }> = [];

  // 1. Try SearXNG endpoint (custom or Vercel serverless /api/search)
  const candidateUrl = searxngUrl || '/api/search';
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const fetchUrl = candidateUrl.includes('/api/search')
      ? `${candidateUrl}?q=${encodeURIComponent(cleanQ)}`
      : `${candidateUrl.replace(/\/+$/, '')}/search?q=${encodeURIComponent(cleanQ)}&format=json`;

    const resp = await fetch(fetchUrl, { signal: controller.signal });
    clearTimeout(timeout);
    if (resp.ok) {
      const data = await resp.json();
      if (data.results && Array.isArray(data.results) && data.results.length > 0) {
        for (const r of data.results.slice(0, 4)) {
          results.push({
            title: r.title || 'Search Result',
            snippet: (r.content || r.snippet || '').slice(0, 300),
            url: r.url || ''
          });
        }
      }
    }
  } catch {
    // fall through to client-side direct Wikipedia search
  }

  // 2. Direct Wikipedia OpenSearch (Client-side, CORS enabled via origin=*)
  if (results.length === 0) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(cleanQ)}&limit=3&namespace=0&format=json&origin=*`;
      const resp = await fetch(wikiUrl, { signal: controller.signal });
      clearTimeout(timeout);
      if (resp.ok) {
        const data = await resp.json();
        const titles = data[1] || [];
        const snippets = data[2] || [];
        const links = data[3] || [];
        for (let i = 0; i < titles.length; i++) {
          if (titles[i]) {
            results.push({
              title: titles[i],
              snippet: snippets[i] || `Summary for ${titles[i]} on Wikipedia.`,
              url: links[i] || `https://en.wikipedia.org/wiki/${encodeURIComponent(titles[i])}`
            });
          }
        }
      }
    } catch {
      // ignore
    }
  }

  // 3. Literary Quotations & Classic Literature: Wikiquote & Wikisource OpenSearch
  if (results.length === 0) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const wqUrl = `https://en.wikiquote.org/w/api.php?action=opensearch&search=${encodeURIComponent(cleanQ)}&limit=3&format=json&origin=*`;
      const resp = await fetch(wqUrl, { signal: controller.signal });
      clearTimeout(timeout);
      if (resp.ok) {
        const data = await resp.json();
        const titles = data[1] || [];
        const snippets = data[2] || [];
        const links = data[3] || [];
        for (let i = 0; i < titles.length; i++) {
          if (titles[i]) {
            results.push({
              title: `Wikiquote: ${titles[i]}`,
              snippet: snippets[i] || `Literary quotes and citations for ${titles[i]}.`,
              url: links[i] || `https://en.wikiquote.org/wiki/${encodeURIComponent(titles[i])}`
            });
          }
        }
      }
    } catch {
      // ignore
    }
  }

  if (results.length === 0) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const wsUrl = `https://en.wikisource.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanQ)}&format=json&origin=*`;
      const resp = await fetch(wsUrl, { signal: controller.signal });
      clearTimeout(timeout);
      if (resp.ok) {
        const data = await resp.json();
        const hits = data?.query?.search || [];
        for (const hit of hits.slice(0, 3)) {
          results.push({
            title: `Wikisource: ${hit.title}`,
            snippet: (hit.snippet || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
            url: `https://en.wikisource.org/wiki/${encodeURIComponent(hit.title.replace(/\s+/g, '_'))}`
          });
        }
      }
    } catch {
      // ignore
    }
  }

  // 4. Fallback: DuckDuckGo instant answers
  if (results.length === 0) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2500);
      const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(cleanQ)}&format=json&no_html=1&skip_disambig=1`;
      const resp = await fetch(ddgUrl, { signal: controller.signal });
      clearTimeout(timeout);
      if (resp.ok) {
        const data = await resp.json();
        if (data.AbstractText) {
          results.push({
            title: data.Heading || cleanQ,
            snippet: data.AbstractText,
            url: data.AbstractURL || 'https://duckduckgo.com'
          });
        }
      }
    } catch {
      // ignore
    }
  }

  if (results.length === 0) {
    return `No search results for "${cleanQ}". I will not invent hits.`;
  }

  return results.map(r => `• ${r.title} (${r.url}):\n  ${r.snippet}`).join('\n\n');
}

/**
 * Webpage Content Fetcher via serverless /api/fetch
 */
export async function execWebFetch(targetUrl: string): Promise<string> {
  let cleanUrl = targetUrl.trim();
  cleanUrl = cleanUrl.replace(/^[<"']|[>"']$/g, '');
  const parsed = parsePublicHttpsUrl(cleanUrl);
  if (parsed.ok === false) {
    return `Blocked URL: ${parsed.error}`;
  }
  const target = parsed.url;
  cleanUrl = target.toString();

  if (isWikiHost(target.hostname)) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 9000);
      const resp = await fetch(`/api/fetch?url=${encodeURIComponent(cleanUrl)}`, {
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (resp.ok) {
        const data = await resp.json();
        if (data.ok && data.text) {
          return `[Fetched: ${data.title || cleanUrl}] (${data.url}):\n\n${data.text}${data.truncated ? '\n\n[Content truncated at 12,000 chars]' : ''}`;
        }
        if (data.error) {
          return `Failed to fetch URL: ${data.error}`;
        }
      }
      return `HTTP error ${resp.status} fetching ${cleanUrl}`;
    } catch (err: any) {
      return `Error fetching webpage: ${err?.message || 'Network timeout'}`;
    }
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const resp = await fetch(cleanUrl, { signal: controller.signal });
    clearTimeout(timeout);
    if (!resp.ok) {
      return `HTTP error ${resp.status} fetching ${cleanUrl}`;
    }
    const raw = (await resp.text()).slice(0, 400000);
    const titleMatch = raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : cleanUrl;
    const text = raw
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 14000);
    return `[Fetched: ${title}] (${cleanUrl}):\n\n${text}`;
  } catch {
    return 'This page does not allow in-browser reads (CORS). EasyLM does not proxy arbitrary URLs. Use a Wikipedia, Wikiquote, or Wikisource link.';
  }
}

/**
 * Execute tool from parsed payload with robust name normalization
 */
export async function dispatchTool(
  name: string,
  query: string,
  searxngUrl?: string,
  opts?: { kidSafe?: boolean }
): Promise<ToolExecution> {
  const start = Date.now();
  const normName = normalizeToolName(name);

  let result = '';
  let isError = false;

  if (opts?.kidSafe && !isKidAllowedTool(normName)) {
    return {
      tool: normName || name,
      query,
      result: KID_TOOL_REFUSAL,
      durationMs: Date.now() - start,
      isError: true
    };
  }

  if (normName.includes('calc') || normName.includes('math')) {
    const res = execMath(query);
    result = res.ok ? `${query} = ${res.result}` : `Error: ${res.error}`;
    isError = !res.ok;
  } else if (normName.includes('unit') || normName.includes('convert')) {
    const res = execUnits(query);
    result = res.ok ? res.result! : `Error: ${res.error}`;
    isError = !res.ok;
  } else if (normName.includes('weather') || normName.includes('forecast') || normName.includes('temp') || normName.includes('climate')) {
    result = await execWeather(query);
  } else if (normName.includes('exchange') || normName.includes('currency') || normName.includes('forex') || normName.includes('fx')) {
    result = await execExchange(query);
  } else if (normName.includes('fact') || normName.includes('wiki') || normName.includes('encyclopedia') || normName.includes('whois')) {
    result = await execFact(query);
  } else if (normName.includes('dictionary') || normName.includes('define') || normName.includes('vocab') || normName.includes('definition') || normName.includes('etymology')) {
    result = await execDictionary(query);
  } else if (normName.includes('clock') || normName.includes('time') || normName.includes('date') || normName.includes('zone')) {
    result = execClock(query);
  } else if (normName.includes('stack') || normName.includes('library') || normName.includes('warehouse') || normName.includes('canon') || normName.includes('dewey')) {
    result = execStacks(query);
  } else if (normName.includes('fetch') || normName.includes('read_url') || normName.includes('scrape') || normName.includes('browse')) {
    result = await execWebFetch(query);
  } else if (normName.includes('web') || normName.includes('search') || normName.includes('searx')) {
    const trimmedQ = query.trim();
    if (trimmedQ.startsWith('http://') || trimmedQ.startsWith('https://') || /^www\./i.test(trimmedQ)) {
      result = await execWebFetch(trimmedQ);
    } else {
      result = await execWebSearch(query, searxngUrl);
    }
  } else {
    result = `Unknown tool "${normName || name}". Local hands: calc, units, datetime, stacks. Network hands: weather, exchange, fact, dictionary, web_search, web_fetch.`;
    isError = true;
  }

  return {
    tool: normName,
    query,
    result,
    durationMs: Date.now() - start,
    isError
  };
}

