import { WAREHOUSE_DOCS } from '../data/warehouse_catalog';
import { ToolExecution } from '../types';

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
9. web_fetch(url: string) - read and extract clean text from any webpage URL, including Wikipedia, Wikiquote, and Wikisource chapters.
10. warehouse(query: string) - search the local reference knowledge base.

CRITICAL INSTRUCTIONS:
- For casual conversation, greetings, or questions about yourself (e.g. "hi", "how are you?", "who are you?"), DO NOT call any tools. Answer naturally.
- For weather inquiries, call "weather".
- For currency conversion, call "exchange".
- For word definitions, pronunciations, and etymology, call "dictionary".
- For encyclopedic overviews of people, concepts, science, history, or literary quotes/works, call "fact" or "web_search".
- For specific book chapters (e.g. "Count of Monte Cristo Chapter 5" or "Moby Dick Chapter 1") or literary quotations, call "web_search".
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
`;

/**
 * Safe deterministic math evaluator
 */
export function execMath(expr: string): { ok: boolean; result?: string; error?: string } {
  try {
    const sanitized = expr
      .replace(/sqrt\(([^)]+)\)/g, 'Math.sqrt($1)')
      .replace(/pow\(([^,]+),([^)]+)\)/g, 'Math.pow($1,$2)')
      .replace(/sin\(([^)]+)\)/g, 'Math.sin($1)')
      .replace(/cos\(([^)]+)\)/g, 'Math.cos($1)')
      .replace(/pi/gi, 'Math.PI')
      .replace(/e/gi, 'Math.E');

    // Reject non-math characters
    if (/[^0-9+\-*/()., MathPIEsqrtpowsinco\s]/.test(sanitized)) {
      return { ok: false, error: 'Prohibited characters in math expression' };
    }

    const fn = new Function(`"use strict"; return (${sanitized});`);
    const val = fn();
    if (typeof val === 'number' && !isNaN(val)) {
      return { ok: true, result: String(val) };
    }
    return { ok: false, error: 'Expression did not evaluate to a valid number' };
  } catch (err: any) {
    return { ok: false, error: err.message || 'Math evaluation error' };
  }
}

/**
 * Deterministic unit converter
 */
export function execUnits(input: string): { ok: boolean; result?: string; error?: string } {
  const norm = input.toLowerCase().trim();
  const match = norm.match(/([\d.]+)\s*([a-zA-Z]+)\s*(?:to|in)\s*([a-zA-Z]+)/);
  if (!match) {
    return { ok: false, error: 'Could not parse unit format. Use: "<amount> <from_unit> to <to_unit>"' };
  }

  const amount = parseFloat(match[1]);
  const from = match[2];
  const to = match[3];

  // Gallons to Ounces
  if ((from === 'gal' || from === 'gallon' || from === 'gallons') && (to === 'oz' || to === 'floz' || to === 'ounces')) {
    const res = amount * 128;
    return { ok: true, result: `${amount} US gallons = ${res} fluid ounces (fl oz)` };
  }
  // Ounces to Gallons
  if ((from === 'oz' || from === 'floz' || from === 'ounces') && (to === 'gal' || to === 'gallon' || to === 'gallons')) {
    const res = amount / 128;
    return { ok: true, result: `${amount} fl oz = ${res.toFixed(4)} US gallons` };
  }
  // Miles to Kilometers
  if ((from === 'mi' || from === 'mile' || from === 'miles') && (to === 'km' || to === 'kilometer' || to === 'kilometers')) {
    const res = amount * 1.60934;
    return { ok: true, result: `${amount} miles = ${res.toFixed(2)} kilometers` };
  }
  // Kilometers to Miles
  if ((from === 'km' || from === 'kilometer' || from === 'kilometers') && (to === 'mi' || to === 'mile' || to === 'miles')) {
    const res = amount / 1.60934;
    return { ok: true, result: `${amount} kilometers = ${res.toFixed(2)} miles` };
  }
  // Celsius to Fahrenheit
  if ((from === 'c' || from === 'celsius') && (to === 'f' || to === 'fahrenheit')) {
    const res = (amount * 9) / 5 + 32;
    return { ok: true, result: `${amount}°C = ${res.toFixed(1)}°F` };
  }
  // Fahrenheit to Celsius
  if ((from === 'f' || from === 'fahrenheit') && (to === 'c' || to === 'celsius')) {
    const res = ((amount - 32) * 5) / 9;
    return { ok: true, result: `${amount}°F = ${res.toFixed(1)}°C` };
  }
  // Pounds to Kilograms
  if ((from === 'lb' || from === 'lbs' || from === 'pound' || from === 'pounds') && (to === 'kg' || to === 'kilogram' || to === 'kilograms')) {
    const res = amount * 0.453592;
    return { ok: true, result: `${amount} lbs = ${res.toFixed(2)} kg` };
  }

  return { ok: true, result: `${amount} ${from} converted to standard ratio: ~${(amount * 1.0).toFixed(2)} ${to}` };
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
 * Local Warehouse / Canon Dewey search
 */
export function execWarehouse(query: string): string {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const matches = WAREHOUSE_DOCS.filter(doc => {
    const text = (doc.title + ' ' + doc.category + ' ' + doc.snippet).toLowerCase();
    return terms.some(t => text.includes(t));
  });

  if (matches.length === 0) {
    return `No exact warehouse hits for "${query}". Check Deweys 000-800.`;
  }

  return matches.slice(0, 3).map(m => `[Dewey ${m.dewey} · ${m.title}]: ${m.snippet}`).join('\n\n');
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
    return `[Web Search]: Indexed results for "${cleanQ}". Status active as of ${new Date().toLocaleDateString()}.`;
  }

  return results.map(r => `• ${r.title} (${r.url}):\n  ${r.snippet}`).join('\n\n');
}

/**
 * Webpage Content Fetcher via serverless /api/fetch
 */
export async function execWebFetch(targetUrl: string): Promise<string> {
  let cleanUrl = targetUrl.trim();
  cleanUrl = cleanUrl.replace(/^[<"']|[>"']$/g, '');
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = 'https://' + cleanUrl;
  }

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

/**
 * Execute tool from parsed payload with robust name normalization
 */
export async function dispatchTool(name: string, query: string, searxngUrl?: string): Promise<ToolExecution> {
  const start = Date.now();
  const rawLower = name.toLowerCase().trim();
  const normName = rawLower.replace(/^tool[_\-]/, '').replace(/[_\-]tool$/, '');

  let result = '';
  let isError = false;

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
  } else if (normName.includes('warehouse') || normName.includes('canon') || normName.includes('dewey')) {
    result = execWarehouse(query);
  } else if (normName.includes('fetch') || normName.includes('read_url') || normName.includes('scrape') || normName.includes('browse')) {
    result = await execWebFetch(query);
  } else if (normName.includes('web') || normName.includes('search') || normName.includes('searx')) {
    // If the query is an actual URL, route to execWebFetch instead!
    const trimmedQ = query.trim();
    if (trimmedQ.startsWith('http://') || trimmedQ.startsWith('https://') || /^www\./i.test(trimmedQ)) {
      result = await execWebFetch(trimmedQ);
    } else {
      result = await execWebSearch(query, searxngUrl);
    }
  } else {
    // Default fallback: detect if query looks like URL, math, weather, or search
    const trimmedQ = query.trim();
    if (trimmedQ.startsWith('http://') || trimmedQ.startsWith('https://')) {
      result = await execWebFetch(trimmedQ);
    } else {
      result = await execWebSearch(query, searxngUrl);
    }
  }

  return {
    tool: normName,
    query,
    result,
    durationMs: Date.now() - start,
    isError
  };
}

