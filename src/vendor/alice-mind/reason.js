/**
 * topic : alice mind reasoner and composer.
 *
 * comment : evidence selection, calibrated confidence, extractive answer composition with numbered citations, and the epistemic gap protocol.
 *
 * invariant : every asserted sentence carries a citation to a unit in the bundle or a formal engine trace; below threshold the reasoner emits DONT_KNOW and never fabricates.
 */

import { TIER_WEIGHT } from './index.js';
import { jaccard, tokens, normalizeTopic, displayTopic, hostOf } from './text.js';

export const THRESHOLD_ANSWER = 0.5;
export const THRESHOLD_TENTATIVE = 0.33;

const KIND_BONUS = { fact: 0.1, definition: 0.1, principle: 0.04, heuristic: 0.02, proposition: 0.03, passage: 0.05, door: -0.25 };
const LEAD_KINDS = new Set(['fact', 'definition', 'proposition', 'passage', 'principle', 'heuristic']);

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** CitationLedger : numbered reference list with dedup by unit id. */
export class CitationLedger {
  constructor(index, trust) {
    this.index = index;
    this.trust = trust;
    this.list = [];
    this.byId = new Map();
  }
  cite(u) {
    if (this.byId.has(u.id)) return this.byId.get(u.id);
    const n = this.list.length + 1;
    const stack = this.index.stacks[u.stack] || { title: u.stack };
    const trustClass = u.door && this.trust ? this.trust.classOf(u.door) : null;
    this.list.push({
      n,
      unitId: u.id,
      stack: u.stack,
      stackTitle: stack.title || u.stack,
      topic: u.topic,
      section: u.section || null,
      locator: u.locator,
      door: u.door || null,
      doorTrust: u.door ? (trustClass || 'unlisted') : null,
      tier: u.tier,
      kind: u.kind,
      sourceModel: u.meta && u.meta.sourceModel ? u.meta.sourceModel : null,
      quote: u.text.length > 320 ? u.text.slice(0, 317) + '...' : u.text
    });
    this.byId.set(u.id, n);
    return n;
  }
  citeFormal(route, engine) {
    const id = 'formal:' + route;
    if (this.byId.has(id)) return this.byId.get(id);
    const n = this.list.length + 1;
    this.list.push({ n, unitId: id, stack: 'alice.formal', stackTitle: 'Alice formal engine', topic: route, section: null, locator: engine || 'alice_core.js', door: null, doorTrust: null, tier: 'proof', kind: 'proof', sourceModel: null, quote: '' });
    this.byId.set(id, n);
    return n;
  }
}

/** formatReference : one-line human citation. */
export function formatReference(c) {
  const parts = [c.stackTitle];
  if (c.section) parts.push('\u00A7 ' + c.section);
  parts.push(c.locator);
  if (c.door) parts.push(c.door + (c.doorTrust && c.doorTrust !== 'unlisted' ? ' (trusted: ' + c.doorTrust + ')' : ' (door unlisted)'));
  const tierNote = c.tier === 'synthesized' ? 'synthesized' + (c.sourceModel ? ' by ' + c.sourceModel : '') + ', unverified'
    : c.tier === 'speculative' ? 'speculative' : c.tier;
  return '[' + c.n + '] ' + parts.join(' \u00B7 ') + ' \u00B7 ' + tierNote;
}

/** scoreUnits : rank candidate units against a focus key and query tokens. */
export function scoreUnits(cands, ctx) {
  const maxBm = Math.max(1e-9, ...cands.map(c => c.score || 0));
  const fk = ctx.focusKey || '';
  const fre = fk ? new RegExp('^(the\\s+)?' + escapeRe(fk) + "('s)?\\s+(is|are|was|were|=|:|refers to|denotes|designates|means|names|describes)\\b", 'i') : null;
  const abbr = fk && /^[a-z0-9]{2,8}$/.test(fk) ? new RegExp('^[^.;]{0,80}\\(\\s*' + escapeRe(fk) + '\\b', 'i') : null;
  const fle = fk ? new RegExp('^(the\\s+|an?\\s+)?' + escapeRe(fk) + "('s)?\\s+[a-z]", 'i') : null;
  const out = [];
  for (const c of cands) {
    const u = c.unit;
    if (ctx.exclude && ctx.exclude.has(u.id)) continue;
    let s = 0.35 * ((c.score || 0) / maxBm) + 0.15 * (c.coverage || 0);
    let match = 0;
    if (fk) {
      if (u._key === fk || (ctx.focusKeys && ctx.focusKeys.has(u._key))) match = 0.45;
      else if (u._key.startsWith(fk + ' ') || u._key.endsWith(' ' + fk)) match = 0.12;
      else if (u._key.includes(fk)) match = 0.08;
      if (fre && fre.test(u.text)) match = Math.max(match, 0.35);
      else if (fle && fle.test(u.text) && u.kind !== 'door') match = Math.max(match, 0.3);
      else if (abbr && abbr.test(u.topic + ' ' + u.text.slice(0, 120))) match = Math.max(match, 0.35);
    }
    s += match;
    s += KIND_BONUS[u.kind] || 0;
    if (ctx.intent === 'define' && /^misconception/i.test(u.topic)) s -= 0.12;
    if (ctx.expansion && ctx.expansion.length) {
      const ut = new Set(tokens(u.topic + ' ' + u.text));
      if (ctx.expansion.some(t => ut.has(t))) s += 0.3;
    }
    if (u.door && u.tier === 'primary') s += 0.05;
    if (u.text.length < 25) s -= 0.15;
    s *= 0.55 + 0.45 * (TIER_WEIGHT[u.tier] || 0.5);
    out.push({ unit: u, score: s, match, coverage: c.coverage || 0, bm: c.score || 0 });
  }
  out.sort((a, b) => b.score - a.score);
  return out;
}

/** gather : candidate pool for a focus = topic units, alias units, and bm25 hits. */
export function gather(index, focus, frame, opts = {}) {
  const overlay = opts.overlay || [];
  const pool = new Map();
  const add = (u, score, coverage) => {
    const prev = pool.get(u.id);
    if (!prev || prev.score < score) pool.set(u.id, { unit: u, score, coverage });
  };
  const resolved = focus.topic;
  const focusKeys = new Set();
  if (resolved) {
    for (const k of resolved.keys || [resolved.key]) focusKeys.add(k);
    for (const u of index.topicUnits(resolved, overlay)) add(u, 8, 1);
  }
  const q = tokens(focus.phrase || '');
  const qAll = (opts.queryTokens && opts.queryTokens.length ? opts.queryTokens : q).concat(frame && frame.expansion ? frame.expansion : []);
  for (const h of index.search(q.length ? q : qAll, { k: opts.k || 40, overlay, filter: opts.filter })) add(h.unit, h.score, h.coverage);
  if (qAll !== q) for (const h of index.search(qAll, { k: 20, overlay, filter: opts.filter })) add(h.unit, h.score * 0.8, h.coverage);
  const cands = [...pool.values()].filter(c => !opts.filter || opts.filter(c.unit));
  const phraseKey = normalizeTopic(focus.phrase || '');
  const fk = resolved && (resolved.match === 'exact' || !phraseKey) ? resolved.key : (phraseKey || (resolved && resolved.key) || '');
  return scoreUnits(cands, { focusKey: fk, focusKeys, exclude: opts.exclude, intent: frame && frame.intent, expansion: frame && frame.expansion });
}

/** selectEvidence : lead plus non-redundant support, preferring stack diversity. */
export function selectEvidence(ranked, opts = {}) {
  const max = opts.max || 4;
  const chosen = [];
  const sets = [];
  const stacksUsed = new Map();
  for (const r of ranked) {
    if (chosen.length >= max) break;
    const u = r.unit;
    if (!chosen.length && (!LEAD_KINDS.has(u.kind) || u.tier === 'speculative')) continue;
    if (u.kind === 'door' && !opts.allowDoors) continue;
    if (u.tier === 'speculative' && !opts.allowSpeculative) continue;
    if (chosen.length && !(r.match > 0 || r.coverage >= (opts.minSupportCoverage || 0.6))) continue;
    const ts = new Set(tokens(u.text));
    if (chosen.length && !(r.match >= 0.3) && jaccard(sets[0], ts) < (opts.minCoherence || 0.06)) continue;
    if (sets.some(s => jaccard(s, ts) > 0.55)) continue;
    const used = stacksUsed.get(u.stack) || 0;
    if (used >= 2 && chosen.length) continue;
    if (chosen.length && u.tier === 'synthesized' && chosen[0].unit.tier !== 'synthesized') {
      const verified = chosen.filter(c => c.unit.tier !== 'synthesized').length;
      const synth = chosen.length - verified;
      if (verified >= 2 || synth >= 1) continue;
    }
    if (chosen.length && r.score < chosen[0].score * (opts.ratio || 0.45)) break;
    chosen.push(r);
    sets.push(ts);
    stacksUsed.set(u.stack, used + 1);
  }
  return chosen;
}

/** matchStrength : how directly the lead unit addresses the focus, in [0,1]. */
export function matchStrength(lead, focus) {
  const m = focus && focus.topic && focus.topic.match;
  const partial = focus && focus.topic && typeof focus.topic.partial === 'number' ? Math.pow(focus.topic.partial, 0.8) : 1;
  let s;
  if (lead.match >= 0.45) s = (m === 'stem' ? 0.85 : m === 'alias' ? 0.95 : 1.0) * partial;
  else if (lead.match >= 0.35) s = 0.85;
  else if (lead.match > 0) s = 0.4 + 0.35 * lead.coverage;
  else s = Math.min(0.62, 0.8 * Math.pow(lead.coverage, 1.5));
  return s;
}

/** confidence : calibrated scalar in [0,1]; match strength gates multiplicatively, tier and corroboration modulate. */
export function confidence(chosen, focus) {
  if (!chosen.length) return 0;
  const lead = chosen[0];
  const ms = matchStrength(lead, focus);
  const stacks = new Set(chosen.map(c => c.unit.stack));
  const corroboration = Math.min(1, (stacks.size - 1) / 2 + (chosen.length > 1 ? 0.25 : 0));
  const tier = TIER_WEIGHT[lead.unit.tier] || 0.5;
  return Math.max(0, Math.min(1, ms * (0.62 + 0.23 * tier + 0.15 * corroboration)));
}

const VERB_START = /^(designates?|denotes?|refers?|describes?|names?|models?|measures?|represents?|holds?|states?|asserts?|defines?|captures?|establish(es)?|governs?|maps?|calculates?|computes?|encodes?|treats?|claims?|argues?|provides?|requires?|ensures?|enables?|guarantees?|prevents?|transforms?|converts?|evaluates?|identif(y|ies)|specif(y|ies)|formali[sz]es?|consists?|comprises?|occurs?|arises?|applies?|functions?|operates?|serves?|tracks?|links?|connects?|explains?|predicts?|quantif(y|ies)|clips?|authenticates?|separates?|distinguishes?|combines?)\b/i;

/** renderClaim : one cited sentence for a unit. */
export function renderClaim(u, n, opts = {}) {
  let text = u.text.trim();
  const topic = displayTopic(u.topic);
  if (u.stack === 'tractatus') return '\u201C' + text + '\u201D \u2014 Wittgenstein, ' + u.topic.replace('Tractatus', 'Tractatus \u00A7') + ' [' + n + ']';
  if (u.kind === 'door') return topic + ' \u2014 ' + text + (u.door ? ' <' + u.door + '>' : '') + ' [' + n + ']';
  const startsLower = /^[a-z]/.test(text);
  const mentionsTopic = text.toLowerCase().startsWith(u._key || normalizeTopic(u.topic));
  if (!/[.!?\u201D"]$/.test(text)) text += '.';
  if (u.kind === 'passage' && !opts.lead) return text + ' [' + n + ']';
  if (mentionsTopic) return (startsLower ? text.charAt(0).toUpperCase() + text.slice(1) : text) + ' [' + n + ']';
  if (VERB_START.test(text)) return (opts.bold ? '**' + topic + '** ' : topic + ' ') + text + ' [' + n + ']';
  if (u.kind === 'passage') {
    const head = new Set(tokens(text.split(/\s+/).slice(0, 18).join(' ')));
    const redundant = /^misconception/i.test(u.topic) || jaccard(new Set(tokens(u.topic)), head) >= 0.5;
    return (opts.bold && !redundant ? '**' + topic + '.** ' : '') + text + ' [' + n + ']';
  }
  return (opts.bold ? '**' + topic + '** \u2014 ' : topic + ': ') + text + ' [' + n + ']';
}

/** relatedLines : graph neighbors rendered with edge citations. */
export function relatedLines(index, key, ledger, limit = 6) {
  const out = [];
  for (const e of index.neighbors(key, 40)) {
    if (out.length >= limit) break;
    if (/^inverse of /.test(e.rel) && out.length > 2) continue;
    const u = e.unitId ? index.unit(e.unitId) : null;
    if (u && u.tier === 'speculative') continue;
    const n = u ? ledger.cite(u) : null;
    out.push(e.target + ' (' + e.rel.replace(/_/g, ' ') + ')' + (n ? ' [' + n + ']' : ''));
  }
  return out;
}

/** hasUnverifiedNumber : stacks LAW cite rule; load-bearing numbers require a trusted door. */
export function hasUnverifiedNumber(units, trust) {
  return units.some(u => /\b\d{2,}(?:[.,]\d+)?\b/.test(u.text) && !(u.door && trust && trust.isTrusted(u.door)) && u.stack !== 'alice.syllogisms' && u.stack !== 'tractatus');
}

export function tierNotes(units, trust) {
  const notes = [];
  if (units.length && units.every(u => u.tier === 'synthesized' || u.tier === 'speculative')) {
    notes.push('Drawn only from Alice\u2019s synthesized ledger; no primary door verifies it yet.');
  }
  if (hasUnverifiedNumber(units, trust)) notes.push('Contains numbers without a trusted door; treat them as unverified until checked at the primary source.');
  if (units.some(u => u.tier === 'learned')) notes.push('Includes facts taught in this session; they stay local to the session.');
  return notes;
}

export { hostOf };
