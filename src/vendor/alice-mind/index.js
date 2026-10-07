/**
 * topic : alice mind knowledge index.
 *
 * comment : bm25 inverted index over provenance-tagged units, topic and alias resolution, entity spotting by longest n-gram, and a typed relation graph with shortest-path search.
 *
 * invariant : deterministic ranking; ties broken by unit order.
 */

import { tokens, words, normalizeTopic, STOPWORDS } from './text.js';

const K1 = 1.2;
const B = 0.75;
const TOPIC_WEIGHT = 3;
const MAX_NGRAM = 7;

export const TIER_WEIGHT = { primary: 1.0, curated: 0.85, learned: 0.7, synthesized: 0.55, speculative: 0.25 };
export const TIER_RANK = { primary: 4, curated: 3, learned: 2, synthesized: 2, speculative: 1 };

const INVERSE = {
  practiced_by: 'practices', precipitated_by: 'precipitates', subsumes: 'subsumed_by', subsumed_by: 'subsumes',
  parses: 'parsed_by', core_concept: 'core_concept_of', alias_of: 'alias', requires: 'required_by', part_of: 'has_part',
  has_part: 'part_of', causes: 'caused_by', caused_by: 'causes', opposes: 'opposed_by', contrasts_with: 'contrasts_with',
  related_to: 'related_to', is_a: 'has_instance', instance_of: 'has_instance', generalizes: 'specializes', specializes: 'generalizes'
};

function stemKey(s) {
  return tokens(s).join(' ');
}

const CANONICAL_PREFIXES = /^(kant|descartes|aristotle|socrates|plato|hume|spinoza|locke|leibniz|hegel|nietzsche|wittgenstein|frege|russell|quine|popper|newton|einstein|maxwell|darwin|bohr|turing|shannon|chomsky|euclid|godel|tarski)\s+(.+)$/i;

function topicAliases(topic) {
  const out = new Set();
  const paren = topic.match(/^(.*?)\s*\(([^)]{2,40})\)\s*$/);
  if (paren) {
    out.add(normalizeTopic(paren[1]));
    if (/^[A-Za-z][\w.\- ]{1,20}$/.test(paren[2]) && paren[2].length <= 12) out.add(normalizeTopic(paren[2]));
  }
  const dot = topic.split(/\s+\u00B7\s+/);
  if (dot.length > 1) out.add(normalizeTopic(dot[0]));
  const poss = topic.match(/^[A-Za-z0-9'\-]+\s*['’]s\s+(.+)$/i);
  if (poss && poss[1]) {
    out.add(normalizeTopic(poss[1]));
    const trimmed = poss[1].replace(/\s+(Formulations|Principles|Types|Variants|Laws)$/i, '');
    if (trimmed !== poss[1]) out.add(normalizeTopic(trimmed));
  }
  const auth = topic.match(CANONICAL_PREFIXES);
  if (auth && auth[2] && auth[2].length >= 4) {
    out.add(normalizeTopic(auth[2]));
  }
  return [...out].filter(Boolean);
}

export class KnowledgeIndex {
  constructor(bundle) {
    this.bundle = bundle;
    this.units = bundle.units || [];
    this.stacks = bundle.stacks || {};
    this.byId = new Map();
    this.topicMap = new Map();
    this.aliasMap = new Map();
    this.stemTopicMap = new Map();
    this.postings = new Map();
    this.docLen = new Float32Array(this.units.length);
    this.unitTokenSets = new Array(this.units.length);
    this.graph = new Map();
    this._build();
  }

  _addTopicKey(map, key, idx) {
    if (!key) return;
    let arr = map.get(key);
    if (!arr) map.set(key, (arr = []));
    arr.push(idx);
  }

  _build() {
    let total = 0;
    this.units.forEach((u, idx) => {
      this.byId.set(u.id, u);
      const key = normalizeTopic(u.topic);
      u._key = key;
      this._addTopicKey(this.topicMap, key, idx);
      for (const a of topicAliases(u.topic)) if (a !== key) this._addTopicKey(this.aliasMap, a, idx);
      const sk = stemKey(u.topic);
      if (sk) {
        let set = this.stemTopicMap.get(sk);
        if (!set) this.stemTopicMap.set(sk, (set = new Set()));
        set.add(key);
      }
      const tt = tokens(u.topic);
      const bt = tokens(u.text + (u.section ? ' ' + u.section : ''));
      const tf = new Map();
      for (const t of tt) tf.set(t, (tf.get(t) || 0) + TOPIC_WEIGHT);
      for (const t of bt) tf.set(t, (tf.get(t) || 0) + 1);
      const len = tt.length * TOPIC_WEIGHT + bt.length;
      this.docLen[idx] = len;
      total += len;
      this.unitTokenSets[idx] = new Set([...tt, ...bt]);
      for (const [t, f] of tf) {
        let p = this.postings.get(t);
        if (!p) this.postings.set(t, (p = []));
        p.push(idx, f);
      }
    });
    this.avgdl = this.units.length ? total / this.units.length : 1;
    for (const r of this.bundle.relations || []) {
      const [s, rel, t, unitId] = r;
      if (!s || !t || s === t) continue;
      if (rel === 'alias_of') {
        for (const idx of this.topicMap.get(t) || []) this._addTopicKey(this.aliasMap, s, idx);
      }
      this._edge(s, rel, t, unitId, 'out');
      this._edge(t, INVERSE[rel] || ('inverse of ' + rel), s, unitId, 'in');
    }
  }

  _edge(a, rel, b, unitId, dir) {
    let list = this.graph.get(a);
    if (!list) this.graph.set(a, (list = []));
    if (!list.some(e => e.target === b && e.rel === rel)) list.push({ rel, target: b, unitId: unitId || null, dir });
  }

  get size() {
    return this.units.length;
  }

  unit(id) {
    return this.byId.get(id) || null;
  }

  idf(t) {
    const p = this.postings.get(t);
    const df = p ? p.length / 2 : 0;
    return Math.log(1 + (this.units.length - df + 0.5) / (df + 0.5));
  }

  /** search : bm25 ranking; query accepts text or token array; filter receives unit. */
  search(query, opts = {}) {
    const k = opts.k || 20;
    const qt = Array.isArray(query) ? query : tokens(query);
    const uniq = [...new Set(qt)];
    if (!uniq.length) return [];
    const scores = new Map();
    for (const t of uniq) {
      const p = this.postings.get(t);
      if (!p) continue;
      const idf = this.idf(t);
      for (let i = 0; i < p.length; i += 2) {
        const idx = p[i], f = p[i + 1];
        const s = idf * (f * (K1 + 1)) / (f + K1 * (1 - B + B * this.docLen[idx] / this.avgdl));
        scores.set(idx, (scores.get(idx) || 0) + s);
      }
    }
    let out = [];
    for (const [idx, score] of scores) {
      const u = this.units[idx];
      if (opts.filter && !opts.filter(u)) continue;
      out.push({ idx, unit: u, score, coverage: this.coverage(idx, uniq) });
    }
    for (const u of opts.overlay || []) {
      if (opts.filter && !opts.filter(u)) continue;
      const set = u._tokens || (u._tokens = new Set([...tokens(u.topic), ...tokens(u.text)]));
      let hit = 0;
      for (const t of uniq) if (set.has(t)) hit++;
      if (hit) out.push({ idx: -1, unit: u, score: hit * 2.5, coverage: hit / uniq.length });
    }
    out.sort((a, b) => b.score - a.score || a.idx - b.idx);
    if (out.length > k) out = out.slice(0, k);
    return out;
  }

  /** coverage : fraction of query tokens present in the unit, idf-weighted. */
  coverage(idx, qt) {
    const set = this.unitTokenSets[idx];
    if (!set || !qt.length) return 0;
    let hit = 0, tot = 0;
    for (const t of qt) {
      const w = this.idf(t);
      tot += w;
      if (set.has(t)) hit += w;
    }
    return tot ? hit / tot : 0;
  }

  /** resolveTopic : phrase to topic key via exact, alias, then stem match. */
  resolveTopic(phrase, overlay = []) {
    const key = normalizeTopic(phrase);
    if (!key) return null;
    if (this.topicMap.has(key)) return { key, match: 'exact', idxs: this.topicMap.get(key) };
    if (this.aliasMap.has(key)) {
      const idxs = this.aliasMap.get(key);
      return { key: this.units[idxs[0]]._key, alias: key, match: 'alias', idxs };
    }
    const sk = stemKey(phrase);
    if (sk && this.stemTopicMap.has(sk)) {
      const keys = [...this.stemTopicMap.get(sk)];
      const idxs = keys.flatMap(k2 => this.topicMap.get(k2) || []);
      return { key: keys[0], keys, match: 'stem', idxs };
    }
    const learned = overlay.filter(u => u._key === key);
    if (learned.length) return { key, match: 'learned', idxs: [], learned };
    return null;
  }

  /** findEntities : greedy longest n-gram topic spotting over the raw prompt. */
  findEntities(text, overlay = []) {
    const ws = words(text).map(w => w.replace(/[.']+$/, ''));
    const found = [];
    let i = 0;
    while (i < ws.length) {
      let hit = null;
      for (let n = Math.min(MAX_NGRAM, ws.length - i); n >= 1; n--) {
        const first = ws[i], last = ws[i + n - 1];
        if (STOPWORDS.has(first) || STOPWORDS.has(last)) continue;
        if (n === 1 && first.length < 3) continue;
        const phrase = ws.slice(i, i + n).join(' ');
        const r = this.resolveTopic(phrase, overlay);
        if (r) { hit = { phrase, start: i, end: i + n, ...r }; break; }
      }
      if (hit) { found.push(hit); i = hit.end; } else i++;
    }
    return found;
  }

  topicUnits(key, overlay = []) {
    const r = typeof key === 'string' ? this.resolveTopic(key, overlay) : key;
    if (!r) return [];
    const list = (r.idxs || []).map(i => this.units[i]);
    return list.concat(r.learned || overlay.filter(u => u._key === r.key));
  }

  neighbors(key, limit = 12) {
    return (this.graph.get(key) || []).slice(0, limit);
  }

  /** path : breadth-first shortest relation path between two topic keys. */
  path(a, b, maxDepth = 4) {
    if (!this.graph.has(a) || !this.graph.has(b)) return null;
    if (a === b) return [];
    const prev = new Map([[a, null]]);
    let frontier = [a];
    for (let d = 0; d < maxDepth && frontier.length; d++) {
      const next = [];
      for (const n of frontier) {
        for (const e of this.graph.get(n) || []) {
          if (prev.has(e.target)) continue;
          prev.set(e.target, { from: n, edge: e });
          if (e.target === b) {
            const out = [];
            let cur = b;
            while (prev.get(cur)) { const p = prev.get(cur); out.unshift({ source: p.from, rel: p.edge.rel, target: cur, unitId: p.edge.unitId }); cur = p.from; }
            return out;
          }
          next.push(e.target);
        }
      }
      frontier = next;
      if (prev.size > 50000) break;
    }
    return null;
  }

}
