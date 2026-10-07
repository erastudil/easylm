/**
 * topic : alice mind text primitives.
 *
 * comment : deterministic normalization, mojibake repair, tokenization, light stemming, and similarity measures shared by index, interpreter, and composer.
 *
 * invariant : pure functions; zero io; identical output in node and browser.
 */

export const STOPWORDS = new Set((
  'a an the and or but if then else of to in on at by for with from into onto over under about as is are was were be been being ' +
  'do does did done doing have has had having can could shall should will would may might must it its this that these those there here ' +
  'what which who whom whose when where why how i me my we our you your he him his she her they them their us ' +
  'not no nor so than too very just also only own same such both each few more most other some any all ' +
  'tell explain describe define give show list name please kindly know mean means meaning say says said ' +
  'between versus vs among within without through during before after above below up down out off again further once ' +
  'like via per etc eg ie one ones thing things something anything way ways s t'
).split(/\s+/));

const MOJIBAKE_TABLE = [
  [/\uFFFD\?"/g, '\u2014'],
  [/\uFFFD\?\u201C/g, '\u2014'],
  [/\uFFFD\?T/g, '\u2019'],
  [/\uFFFD\?o/g, '\u201C'],
  [/\uFFFD\?\?/g, '\u201D'],
  [/\uFFFD\+'/g, '\u2192'],
  [/A\uFFFD/g, '\u00B7'],
  [/\u00E2\u20AC\u201D/g, '\u2014'],
  [/\u00E2\u20AC\u201C/g, '\u2013'],
  [/\u00E2\u20AC\u2122/g, '\u2019'],
  [/\u00E2\u20AC\u0153/g, '\u201C'],
  [/\u00E2\u20AC\u009D/g, '\u201D'],
  [/\u00C2\u00B7/g, '\u00B7'],
  [/GA\u0014del/g, 'G\u00F6del'],
  [/\uFFFD/g, '']
];

/** repair : best-effort reversal of double-encoded utf-8 artifacts present in swarm-written corpora. */
export function repairText(s) {
  if (s == null) return '';
  let out = String(s);
  if (/[\uFFFD\u00E2\u00C2\u0014]/.test(out)) {
    for (const [re, rep] of MOJIBAKE_TABLE) out = out.replace(re, rep);
  }
  return out.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').replace(/[ \t]+/g, ' ').trim();
}

/** normalizeTopic : canonical lookup key for a topic string. */
export function normalizeTopic(s) {
  return repairText(s)
    .toLowerCase()
    .replace(/[_\-]+/g, ' ')
    .replace(/[^\p{L}\p{N}\s'.&]/gu, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^(the|a|an)\s+/, '')
    .replace(/[.\s]+$/, '')
    .trim();
}

/** stem : conservative suffix stripping; stable under repetition for common english inflections. */
export function stem(w) {
  let t = w;
  if (t.length <= 3) return t;
  if (t.endsWith('ies') && t.length > 4) t = t.slice(0, -3) + 'y';
  else if (t.endsWith('sses')) t = t.slice(0, -2);
  else if (/(xes|zes|ches|shes)$/.test(t)) t = t.slice(0, -2);
  else if (t.endsWith('s') && !/(ss|us|is|ys)$/.test(t)) t = t.slice(0, -1);
  if (t.length > 5 && t.endsWith('ing')) {
    t = t.slice(0, -3);
    if (/([b-df-hj-np-tv-z])\1$/.test(t) && !/(ll|ss|zz)$/.test(t)) t = t.slice(0, -1);
  } else if (t.length > 4 && t.endsWith('ed') && !t.endsWith('eed')) {
    t = t.slice(0, -2);
    if (/([b-df-hj-np-tv-z])\1$/.test(t) && !/(ll|ss|zz)$/.test(t)) t = t.slice(0, -1);
  }
  if (t.length > 6) {
    if (t.endsWith('ational')) t = t.slice(0, -7) + 'ate';
    else if (t.endsWith('ization')) t = t.slice(0, -7) + 'ize';
    else if (t.endsWith('ness')) t = t.slice(0, -4);
    else if (t.endsWith('fulness')) t = t.slice(0, -7);
  }
  if (t.length > 4 && t.endsWith('ly') && !t.endsWith('ply')) t = t.slice(0, -2);
  return t;
}

/** words : lowercase alphanumeric word sequence preserving order and stopwords. */
export function words(s) {
  return repairText(s).toLowerCase().replace(/[_]+/g, ' ').match(/[\p{L}\p{N}][\p{L}\p{N}'\-.]*[\p{L}\p{N}]|[\p{L}\p{N}]/gu) || [];
}

/** tokens : stemmed content tokens; stopwords removed. */
export function tokens(s) {
  const out = [];
  for (let w of words(s)) {
    w = w.replace(/'s$/, '').replace(/[.'\-]+$/g, '');
    if (!w || w.length < 2 || STOPWORDS.has(w)) continue;
    if (w.includes('-')) {
      for (const part of w.split('-')) if (part && !STOPWORDS.has(part)) out.push(stem(part));
      continue;
    }
    out.push(stem(w));
  }
  return out;
}

/** jaccard : token-set overlap ratio in [0,1]. */
export function jaccard(a, b) {
  const A = a instanceof Set ? a : new Set(a);
  const B = b instanceof Set ? b : new Set(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter);
}

/** sentences : split prose into sentences without breaking decimals or common abbreviations. */
export function sentences(s) {
  const text = repairText(s).replace(/\s+/g, ' ');
  if (!text) return [];
  const parts = text.split(/(?<=[.!?])\s+(?=[A-Z0-9"\u201C(])/);
  return parts.map(p => p.trim()).filter(p => p.length > 0);
}

/** stripMarkdown : remove inline markdown emphasis, links, and code ticks for plain-text evidence. */
export function stripMarkdown(s) {
  return repairText(s)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/^#+\s*/gm, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** hostOf : lowercase hostname of a url or empty string. */
export function hostOf(url) {
  const m = String(url || '').match(/^https?:\/\/([^/:?#]+)/i);
  return m ? m[1].toLowerCase().replace(/^www\./, '') : '';
}

/** hash32 : fnv-1a 32-bit digest as base36 for stable unit identifiers. */
export function hash32(s) {
  let h = 0x811c9dc5;
  const str = String(s);
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(36);
}

/** titleCase : first letter uppercase for display of normalized topics. */
export function displayTopic(s) {
  const t = String(s || '').trim();
  return t ? t.charAt(0).toUpperCase() + t.slice(1) : t;
}
