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

export default async function handler(req: any, res: any) {
  if (applyCors(req, res)) return;
  if (!requireBrowserOrigin(req, res)) return;

  const queryRaw = req.query?.word || req.query?.q || (req.url ? new URL(req.url, 'http://localhost').searchParams.get('word') : '');
  const word = clipQuery(queryRaw).toLowerCase().replace(/[^a-z\-]/g, '');

  if (!word) {
    return res.status(400).json({ ok: false, error: 'Query parameter "word" or "q" is required' });
  }

  try {
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
    const resp = await fetch(apiUrl);

    if (resp.status === 404) {
      return res.status(404).json({ ok: false, error: `No dictionary entry found for "${word}".` });
    }

    if (!resp.ok) {
      return res.status(502).json({ ok: false, error: `Dictionary lookup failed with status ${resp.status}` });
    }

    const data = await resp.json();
    if (!Array.isArray(data) || data.length === 0) {
      return res.status(404).json({ ok: false, error: `No definitions found for "${word}".` });
    }

    const entry = data[0];
    const phonetic = entry.phonetic || entry.phonetics?.find((p: any) => p.text)?.text || '';
    const origin = entry.origin || '';

    const lines: string[] = [];
    lines.push(`**${entry.word}**${phonetic ? ` \`${phonetic}\`` : ''}`);

    if (entry.meanings && Array.isArray(entry.meanings)) {
      for (const m of entry.meanings.slice(0, 3)) {
        lines.push(`*(${m.partOfSpeech})*`);
        if (m.definitions && Array.isArray(m.definitions)) {
          for (let i = 0; i < Math.min(m.definitions.length, 2); i++) {
            const d = m.definitions[i];
            lines.push(`  ${i + 1}. ${d.definition}${d.example ? ` — *"${d.example}"*` : ''}`);
          }
        }
        if (m.synonyms && m.synonyms.length > 0) {
          lines.push(`  *Synonyms*: ${m.synonyms.slice(0, 5).join(', ')}`);
        }
      }
    }

    if (origin) {
      lines.push(`*Origin*: ${origin}`);
    }

    const summary = lines.join('\n');

    return res.status(200).json({
      ok: true,
      word: entry.word,
      phonetic,
      meanings: entry.meanings,
      summary
    });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err.message || 'Dictionary lookup network error' });
  }
}
