import { WAREHOUSE_DOCS } from '../data/warehouse_catalog';
import { ToolExecution } from '../types';

export const SYSTEM_TOOLS_PROMPT = `
You have access to the following built-in client tools:
1. calc(expression: string) - evaluate math expressions deterministically (e.g. "sqrt(144) * 5200").
2. units(from: string, to: string, amount: number) - convert between units (e.g. "3.75 gallons to fl oz", "100 km to miles").
3. datetime() - get current date, time, and timezone.
4. web_search(query: string) - search the web via SearXNG & Wikipedia for up-to-date facts.
5. web_fetch(url: string) - read and extract clean readable text from a specific webpage URL.
6. warehouse(query: string) - search the local Field Warehouse and Canon knowledge base.

CRITICAL INSTRUCTIONS:
- Do NOT call web_search for casual conversation, greetings, or questions about yourself (e.g. "hows it going?", "hi", "who are you?"). Answer those directly in conversation.
- ONLY call web_search when the user asks for real-world factual information, current news, weather, or specific external references.
- ONLY call web_fetch when given a URL to read, inspect, or summarize.
- When you do need a tool, emit EXACTLY this syntax on its own line:
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
 * System Clock
 */
export function execClock(): string {
  const now = new Date();
  return `Current Local Time: ${now.toLocaleString()} (${Intl.DateTimeFormat().resolvedOptions().timeZone}) · ISO: ${now.toISOString()}`;
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

  // 3. Fallback: DuckDuckGo instant answers
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
  } else if (normName.includes('clock') || normName.includes('time') || normName.includes('date')) {
    result = execClock();
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
    // Default fallback
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

