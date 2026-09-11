export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const queryRaw = req.query?.q || (req.url ? new URL(req.url, 'http://localhost').searchParams.get('q') : '');
  let amountStr = req.query?.amount || '';
  let from = (req.query?.from || '').toUpperCase().trim();
  let to = (req.query?.to || '').toUpperCase().trim();

  // Normalize common symbols
  const symbolMap: Record<string, string> = {
    '$': 'USD',
    '€': 'EUR',
    '£': 'GBP',
    '¥': 'JPY',
    '₹': 'INR',
    'C$': 'CAD',
    'A$': 'AUD',
    '₩': 'KRW',
    'CHF': 'CHF'
  };

  // If a string query is passed, e.g. "100 USD to EUR" or "$50 in EUR" or "5000 JPY to USD"
  if (queryRaw) {
    const raw = String(queryRaw).trim();
    // match pattern: optional symbol/amount, from_cur, "to" or "in", to_cur
    const match = raw.match(/([$€£¥₹]?\s*[\d,.]+)\s*([a-zA-Z]{3}|[$€£¥₹])?\s*(?:to|in|into)\s*([a-zA-Z]{3}|[$€£¥₹])/i);
    if (match) {
      let rawAmt = match[1].trim();
      for (const [sym, code] of Object.entries(symbolMap)) {
        if (rawAmt.includes(sym)) {
          rawAmt = rawAmt.replace(sym, '').trim();
          if (!from) from = code;
        }
      }
      amountStr = rawAmt.replace(/,/g, '');
      if (match[2]) {
        const rawFrom = match[2].toUpperCase().trim();
        from = symbolMap[rawFrom] || rawFrom;
      }
      if (match[3]) {
        const rawTo = match[3].toUpperCase().trim();
        to = symbolMap[rawTo] || rawTo;
      }
    }
  }

  let amount = parseFloat(amountStr || '1');
  if (isNaN(amount) || amount <= 0) amount = 1;
  if (!from) from = 'USD';
  if (!to) to = 'EUR';

  if (from === to) {
    return res.status(200).json({
      ok: true,
      amount,
      from,
      to,
      result: amount,
      rate: 1.0,
      date: new Date().toISOString().split('T')[0],
      summary: `${amount} ${from} = ${amount} ${to} (identical currency)`
    });
  }

  try {
    const apiUrl = `https://api.frankfurter.dev/v1/latest?amount=${amount}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
    const resp = await fetch(apiUrl);

    if (!resp.ok) {
      // Fallback if direct pair fails
      return res.status(502).json({
        ok: false,
        error: `Could not retrieve exchange rate for ${from} to ${to} (Status ${resp.status})`
      });
    }

    const data = await resp.json();
    const rateVal = data.rates?.[to];
    if (typeof rateVal !== 'number') {
      return res.status(404).json({ ok: false, error: `Rate unavailable for ${from} to ${to}` });
    }

    const unitRate = rateVal / amount;
    const summary = `${amount.toLocaleString()} ${from} = ${rateVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ${to} (Rate: 1 ${from} = ${unitRate.toFixed(4)} ${to}, ECB date ${data.date})`;

    return res.status(200).json({
      ok: true,
      amount,
      from,
      to,
      result: rateVal,
      rate: unitRate,
      date: data.date,
      summary
    });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err.message || 'Currency conversion network error' });
  }
}
