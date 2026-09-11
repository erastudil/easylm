export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const queryRaw = req.query?.word || req.query?.q || (req.url ? new URL(req.url, 'http://localhost').searchParams.get('word') : '');
  const word = (queryRaw || '').trim().toLowerCase().replace(/[^a-z\-]/g, '');

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
