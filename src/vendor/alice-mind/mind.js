/**
 * topic : alice mind facade.
 *
 * comment : isomorphic cognitive engine entry point. interpret prompt, route to formal engine or cited knowledge reasoning, compose answer with numbered citations, maintain session discourse state.
 *
 * invariant : zero io in this module; node and browser hosts inject the bundle and optional formal bridge.
 */

import { KnowledgeIndex, TIER_WEIGHT } from './index.js';
import { interpret } from './interpret.js';
import { trustFromBundle } from './whitelist.js';
import { normalizeTopic, tokens, displayTopic, hash32, jaccard } from './text.js';
import {
  CitationLedger, formatReference, gather, selectEvidence, confidence, renderClaim,
  relatedLines, tierNotes, THRESHOLD_ANSWER, THRESHOLD_TENTATIVE
} from './reason.js';

export const ENGINE = 'alice-mind';
export const VERSION = '0.1.0';

const FORMAL_STRICT = new Set(['DETERMINISTIC_EVAL', 'DETERMINISTIC_LOGIC', 'SYLLOGISTIC_DEDUCTION', 'MODAL_EVALUATION']);
const FORMAL_EXPLICIT = new Set([
  ...FORMAL_STRICT, 'ABDUCTIVE_REASONING', 'COUNTERFACTUAL_REASONING', 'DIALECTICAL_DISPUTATION', 'DECISION_TREE_CLASSIFIER',
  'PROGRAMMATIC_CONDITION_ENGINE', 'RULE_EVALUATION', 'DILEMMATIC_LOGIC', 'DEONTIC_EVALUATOR', 'SOCRATIC_ELENCHUS',
  'HEGELIAN_DIALECTIC', 'OCCAMS_RAZOR', 'SCIENTIFIC_METHOD', 'PARADOX_NAVIGATED', 'HERMENEUTIC_INTERPRETATION'
]);

/** Session : discourse state; learned units stay inside the session. */
export class Session {
  constructor(id) {
    this.id = id || 's_' + hash32(String(Date.now()) + Math.random());
    this.history = [];
    this.lastFocus = null;
    this.learned = [];
    this.cited = new Set();
    this.lastEvidence = [];
    this.updated = Date.now();
  }
  toJSON() {
    return { id: this.id, turns: this.history.length, lastFocus: this.lastFocus, learned: this.learned.map(u => ({ topic: u.topic, text: u.text })) };
  }
}

export class AliceMind {
  /**
   * @param {object} bundle compiled alice_mind_bundle.json
   * @param {object} [opts] { formal?: (prompt) => object|null, maxSessions?: number }
   */
  constructor(bundle, opts = {}) {
    if (!bundle || !Array.isArray(bundle.units)) throw new Error('alice mind requires a compiled bundle');
    const t0 = now();
    this.bundle = bundle;
    this.index = new KnowledgeIndex(bundle);
    this.trust = trustFromBundle(bundle.whitelist);
    this.formal = typeof opts.formal === 'function' ? opts.formal : null;
    this.sessions = new Map();
    this.maxSessions = opts.maxSessions || 500;
    this.loadMs = now() - t0;
  }

  stats() {
    const tiers = {};
    for (const u of this.index.units) tiers[u.tier] = (tiers[u.tier] || 0) + 1;
    return {
      engine: ENGINE, version: VERSION, bundleVersion: this.bundle.version, builtAt: this.bundle.builtAt,
      units: this.index.size, relations: (this.bundle.relations || []).length, topics: this.index.topicMap.size,
      stacks: Object.keys(this.index.stacks).length, tiers, formal: !!this.formal, loadMs: Math.round(this.loadMs),
      sessions: this.sessions.size
    };
  }

  session(id) {
    if (id && this.sessions.has(id)) return this.sessions.get(id);
    const s = new Session(id);
    this.sessions.set(s.id, s);
    if (this.sessions.size > this.maxSessions) {
      const oldest = [...this.sessions.values()].sort((a, b) => a.updated - b.updated)[0];
      this.sessions.delete(oldest.id);
    }
    return s;
  }

  /**
   * ask : full cognitive cycle for one prompt.
   * @param {string} prompt
   * @param {object} [opts] { session?: string|Session, history?: Array<{role,content}>, format?: 'markdown'|'text', maxEvidence?: number }
   */
  ask(prompt, opts = {}) {
    const t0 = now();
    const session = opts.session instanceof Session ? opts.session : this.session(opts.session);
    if (Array.isArray(opts.history) && !session.history.length) this._absorbHistory(session, opts.history);
    const frame = interpret(prompt, this.index, session);
    const ledger = new CitationLedger(this.index, this.trust);
    let result;
    try {
      result = this._route(frame, session, ledger, opts);
    } catch (err) {
      result = { route: 'ENGINE_ERROR', modality: '[ERROR]', confidence: 0, lines: ['ERROR: ' + err.message], escalate: true };
    }
    const out = this._finish(frame, session, ledger, result, opts);
    out.timings = { totalMs: Math.round((now() - t0) * 100) / 100 };
    return out;
  }

  /** ground : evidence pack plus system block for an external language model voice. */
  ground(prompt, opts = {}) {
    const session = opts.session instanceof Session ? opts.session : this.session(opts.session);
    const frame = interpret(prompt, this.index, session);
    const ledger = new CitationLedger(this.index, this.trust);
    const focus = { phrase: frame.focus || frame.raw, topic: frame.focusTopic };
    const ranked = gather(this.index, focus, frame, { overlay: session.learned, queryTokens: tokens(frame.resolved || frame.raw) });
    const chosen = selectEvidence(ranked, { max: opts.maxEvidence || 6, ratio: 0.3 });
    const evidence = chosen.map(r => ({ n: ledger.cite(r.unit), topic: r.unit.topic, text: r.unit.text, tier: r.unit.tier }));
    const conf = confidence(chosen, focus);
    const block = [
      'You are the voice of Alice, a cognitive engine. Answer only from the numbered evidence below.',
      'Cite every factual sentence with its evidence number in square brackets, e.g. [2].',
      'If the evidence does not answer the question, say plainly that the stacks hold no reliable answer. Never invent facts, numbers, quotes, or sources.',
      'Evidence marked synthesized is unverified; say so when you rely on it.',
      '',
      ...evidence.map(e => '[' + e.n + '] (' + e.tier + ') ' + e.topic + ': ' + e.text)
    ].join('\n');
    return { prompt, focus: frame.focus, intent: frame.intent, confidence: round(conf), evidence, citations: ledger.list, references: ledger.list.map(formatReference), systemPrompt: block };
  }

  _absorbHistory(session, history) {
    for (const m of history.slice(-12)) {
      if (m && m.role === 'user' && typeof m.content === 'string') {
        const f = interpret(m.content, this.index, session);
        if (f.focusTopic) session.lastFocus = f.focusTopic.key;
      }
    }
  }

  _route(frame, session, ledger, opts) {
    switch (frame.intent) {
      case 'empty': return { route: 'IDLE', modality: '[IDLE]', confidence: 1, lines: ['Ask a question and I will answer from the stacks with sources.'] };
      case 'greeting': return { route: 'SOCIAL', modality: '[SOCIAL]', confidence: 1, lines: ['Hello. I am Alice. Ask me about anything in the stacks and I will answer with sources, or tell you plainly when I do not know.'] };
      case 'thanks': return { route: 'SOCIAL', modality: '[SOCIAL]', confidence: 1, lines: ['You are welcome.'] };
      case 'self': return this._self();
      case 'inventory': return this._inventory();
      case 'teach': return this._teach(frame, session);
      default: break;
    }
    if (frame.formalCandidate && this.formal) {
      const f = this._formal(frame, ledger, FORMAL_EXPLICIT);
      if (f) return f;
    }
    let r = null;
    if (frame.intent === 'compare' && frame.pair) r = this._compare(frame, session, ledger, opts);
    else if (frame.intent === 'relation' && frame.pair) r = this._relation(frame, session, ledger, opts);
    else if (frame.intent === 'verify' && frame.pair) r = this._verify(frame, session, ledger, opts);
    else if (frame.intent === 'list') r = this._list(frame, session, ledger, opts);
    else if (frame.intent === 'source') r = this._sources(frame, session, ledger, opts);
    else if (frame.intent === 'followup') r = this._followup(frame, session, ledger, opts);
    if (!r || r.route === 'EPISTEMIC_GAP') {
      const d = this._define(frame, session, ledger, opts);
      if (!r || d.route !== 'EPISTEMIC_GAP') r = d;
    }
    if (r.route === 'EPISTEMIC_GAP' && this.formal && !frame.formalCandidate) {
      const f = this._formal(frame, ledger, FORMAL_STRICT);
      if (f) return f;
    }
    return r;
  }

  _formal(frame, ledger, allowed) {
    let res = null;
    try { res = this.formal(frame.raw); } catch (err) { res = null; }
    if (!res || !allowed.has(res.route)) return null;
    const n = ledger.citeFormal(res.route, 'alice_core.js AliceCore.process');
    const answer = String(res.answer || '').trim();
    return {
      route: 'FORMAL_' + res.route, modality: res.epistemicModality || '[VERIFIED_PROOF]', confidence: FORMAL_STRICT.has(res.route) ? 0.99 : 0.75,
      lines: [answer + ' [' + n + ']'], formal: { route: res.route, progenStream: res.progenStream || null }, focus: frame.focus
    };
  }

  _define(frame, session, ledger, opts) {
    const focus = { phrase: frame.focus || frame.raw, topic: frame.focusTopic };
    const queryTokens = tokens(frame.resolved || frame.raw);
    const ranked = gather(this.index, focus, frame, { overlay: session.learned, queryTokens, exclude: opts.exclude });
    const chosen = selectEvidence(ranked, { max: opts.maxEvidence || 4 });
    const conf = confidence(chosen, focus);
    if (!chosen.length || conf < THRESHOLD_TENTATIVE) return this._gap(frame, ranked, ledger);
    const lines = [];
    const lead = chosen[0];
    lines.push(renderClaim(lead.unit, ledger.cite(lead.unit), { lead: true, bold: true }));
    for (const r of chosen.slice(1)) lines.push(renderClaim(r.unit, ledger.cite(r.unit)));
    const key = lead.match >= 0.45 ? lead.unit._key : (frame.focusTopic ? frame.focusTopic.key : lead.unit._key);
    const related = relatedLines(this.index, key, ledger);
    const units = chosen.map(c => c.unit);
    const tentative = conf < THRESHOLD_ANSWER;
    return {
      route: frame.intent === 'why' || frame.intent === 'how' || frame.intent === 'search' ? 'CITED_SYNTHESIS' : 'CITED_DEFINITION',
      modality: tentative ? '[TENTATIVE]' : '[CITED]', confidence: conf, lines, related, notes: tierNotes(units, this.trust).concat(tentative ? ['Match is partial; confirm this addresses your question.'] : []),
      focus: key, evidence: units, escalate: tentative
    };
  }

  _compare(frame, session, ledger, opts) {
    const [a, b] = frame.pair;
    const ta = frame.pairTopics && frame.pairTopics[0];
    const tb = frame.pairTopics && frame.pairTopics[1];
    const ra = selectEvidence(gather(this.index, { phrase: a, topic: ta }, frame, { overlay: session.learned }), { max: 2 });
    const rb = selectEvidence(gather(this.index, { phrase: b, topic: tb }, frame, { overlay: session.learned }), { max: 2 });
    const ca = confidence(ra, { topic: ta }), cb = confidence(rb, { topic: tb });
    if (!ra.length || !rb.length || Math.min(ca, cb) < THRESHOLD_TENTATIVE) {
      return { route: 'EPISTEMIC_GAP', modality: '[UNKNOWN]', confidence: Math.min(ca, cb), lines: [], focus: frame.focus };
    }
    const lines = [];
    lines.push(renderClaim(ra[0].unit, ledger.cite(ra[0].unit), { lead: true, bold: true }));
    lines.push(renderClaim(rb[0].unit, ledger.cite(rb[0].unit), { lead: true, bold: true }));
    const ka = ta ? ta.key : normalizeTopic(a), kb = tb ? tb.key : normalizeTopic(b);
    const both = this.index.search(tokens(a + ' ' + b), { k: 60, overlay: session.learned })
      .filter(h => { const t = h.unit.text.toLowerCase(); return t.includes(ka) && t.includes(kb) && h.unit.tier !== 'speculative'; })
      .slice(0, 2);
    for (const h of both) lines.push('Contrast: ' + renderClaim(h.unit, ledger.cite(h.unit)));
    const path = this.index.path(ka, kb, 3);
    if (path && path.length) lines.push('Link: ' + this._renderPath(path, ledger));
    const units = [ra[0].unit, rb[0].unit, ...both.map(h => h.unit)];
    const conf = Math.min(ca, cb) * (both.length || (path && path.length) ? 1 : 0.92);
    return { route: 'CITED_COMPARISON', modality: conf < THRESHOLD_ANSWER ? '[TENTATIVE]' : '[CITED]', confidence: conf, lines, notes: tierNotes(units, this.trust), focus: ka, evidence: units };
  }

  _relation(frame, session, ledger, opts) {
    const [a, b] = frame.pair;
    const ta = frame.pairTopics && frame.pairTopics[0];
    const tb = frame.pairTopics && frame.pairTopics[1];
    const ka = ta ? ta.key : normalizeTopic(a), kb = tb ? tb.key : normalizeTopic(b);
    const lines = [];
    const units = [];
    const path = this.index.path(ka, kb, 4);
    if (path && path.length) {
      lines.push('**' + displayTopic(ka) + '** relates to **' + kb + '** through the knowledge graph: ' + this._renderPath(path, ledger));
      for (const p of path) { const u = p.unitId && this.index.unit(p.unitId); if (u) units.push(u); }
    }
    const both = this.index.search(tokens(a + ' ' + b), { k: 80, overlay: session.learned })
      .filter(h => { const t = (h.unit.topic + ' ' + h.unit.text).toLowerCase(); return t.includes(ka) && t.includes(kb) && h.unit.tier !== 'speculative'; })
      .slice(0, 3);
    for (const h of both) { lines.push(renderClaim(h.unit, ledger.cite(h.unit))); units.push(h.unit); }
    if (!lines.length) return this._compare(frame, session, ledger, opts);
    const conf = Math.min(0.95, (path && path.length ? 0.6 : 0.35) + 0.15 * both.length + 0.1 * (units.some(u => TIER_WEIGHT[u.tier] >= 0.85) ? 1 : 0));
    return { route: 'CITED_RELATION', modality: conf < THRESHOLD_ANSWER ? '[TENTATIVE]' : '[CITED]', confidence: conf, lines, notes: tierNotes(units, this.trust), focus: ka, evidence: units };
  }

  _verify(frame, session, ledger, opts) {
    const [a, b] = frame.pair;
    const ta = frame.pairTopics && frame.pairTopics[0];
    const ka = ta ? ta.key : normalizeTopic(a);
    const kb = normalizeTopic(b);
    const kbTokens = new Set(tokens(b));
    const edge = this.index.neighbors(ka, 80).find(e => e.target === kb || jaccard(new Set(tokens(e.target)), kbTokens) >= 0.6);
    const ranked = gather(this.index, { phrase: a, topic: ta }, frame, { overlay: session.learned });
    const support = ranked.slice(0, 25).filter(r => r.match >= 0.18 && r.unit.tier !== 'speculative' && [...kbTokens].every(t => tokens(r.unit.text).includes(t))).slice(0, 2);
    if (!edge && !support.length) {
      const d = this._define(Object.assign({}, frame, { focus: a, focusTopic: ta }), session, ledger, opts);
      if (d.route === 'EPISTEMIC_GAP') return d;
      d.lines.unshift('I cannot confirm that ' + a + ' is ' + b + ' from the stacks. Here is what they do say about ' + a + ':');
      d.route = 'CITED_VERIFICATION_UNSUPPORTED';
      d.modality = '[UNSUPPORTED]';
      d.confidence = Math.min(d.confidence, 0.45);
      return d;
    }
    const lines = [];
    const units = [];
    const negated = support.some(r => /\b(not|never|no longer|cannot|isn't|aren't)\b/i.test(r.unit.text));
    lines.push(negated ? 'The stacks bear on this, but the wording includes a negation; read the evidence directly:' : 'Yes, the stacks support this.');
    if (edge) {
      const u = edge.unitId && this.index.unit(edge.unitId);
      lines.push(displayTopic(ka) + ' \u2014' + edge.rel.replace(/_/g, ' ') + '\u2192 ' + edge.target + (u ? ' [' + ledger.cite(u) + ']' : ''));
      if (u) units.push(u);
    }
    for (const r of support) { lines.push(renderClaim(r.unit, ledger.cite(r.unit))); units.push(r.unit); }
    const conf = negated ? 0.5 : Math.min(0.95, 0.55 + (edge ? 0.2 : 0) + 0.12 * support.length);
    return { route: 'CITED_VERIFICATION', modality: negated ? '[TENTATIVE]' : '[CITED]', confidence: conf, lines, notes: tierNotes(units, this.trust), focus: ka, evidence: units };
  }

  _list(frame, session, ledger, opts) {
    const focus = { phrase: frame.focus, topic: frame.focusTopic };
    const key = frame.focusTopic ? frame.focusTopic.key : normalizeTopic(frame.focus);
    if (!key) return null;
    const items = [];
    const units = [];
    const seen = new Set();
    for (const e of this.index.neighbors(key, 60)) {
      if (items.length >= 10) break;
      if (seen.has(e.target)) continue;
      const u = e.unitId && this.index.unit(e.unitId);
      if (u && u.tier === 'speculative') continue;
      seen.add(e.target);
      items.push('- ' + e.target + ' (' + e.rel.replace(/_/g, ' ') + ')' + (u ? ' [' + ledger.cite(u) + ']' : ''));
      if (u) units.push(u);
    }
    const kt = tokens(key);
    const hits = this.index.search(kt, { k: 120, overlay: session.learned, filter: u => u.kind !== 'door' && u.tier !== 'speculative' && u._key !== key && kt.every(t => tokens(u.topic).includes(t)) });
    for (const h of hits) {
      if (items.length >= 12) break;
      if (seen.has(h.unit._key)) continue;
      seen.add(h.unit._key);
      items.push('- ' + renderClaim(h.unit, ledger.cite(h.unit), { bold: true }));
      units.push(h.unit);
    }
    if (items.length < 2) return null;
    const conf = Math.min(0.9, 0.45 + 0.04 * items.length + (units.some(u => TIER_WEIGHT[u.tier] >= 0.85) ? 0.1 : 0));
    return { route: 'CITED_LIST', modality: '[CITED]', confidence: conf, lines: ['Here is what the stacks list under ' + key + ':', ...items], notes: tierNotes(units, this.trust), focus: key, evidence: units };
  }

  _sources(frame, session, ledger, opts) {
    const phrase = frame.focus || frame.raw;
    const focus = { phrase, topic: frame.focusTopic || this.index.resolveTopic(phrase, session.learned) };
    const doors = gather(this.index, focus, frame, { overlay: session.learned, filter: u => !!u.door, k: 60 })
      .filter(r => r.coverage >= 0.5 || r.match > 0);
    const seenDoor = new Set();
    const items = [];
    const units = [];
    for (const r of doors) {
      if (items.length >= 8) break;
      const d = r.unit.door;
      if (seenDoor.has(d)) continue;
      seenDoor.add(d);
      const trustClass = this.trust.classOf(d);
      items.push('- ' + displayTopic(r.unit.topic) + ' \u2014 <' + d + '>' + (trustClass ? ' (' + trustClass + ')' : ' (unlisted host)') + ' [' + ledger.cite(r.unit) + ']');
      units.push(r.unit);
    }
    if (!items.length) return null;
    return { route: 'CITED_SOURCES', modality: '[CITED]', confidence: Math.min(0.9, 0.5 + 0.05 * items.length), lines: ['Primary doors for ' + (focus.topic ? focus.topic.key : phrase) + ':', ...items], notes: [], focus: focus.topic ? focus.topic.key : phrase, evidence: units };
  }

  _followup(frame, session, ledger, opts) {
    if (!session.lastFocus) return { route: 'EPISTEMIC_GAP', modality: '[UNKNOWN]', confidence: 0, lines: ['There is no previous topic in this conversation to expand on.'], escalate: false };
    const topic = this.index.resolveTopic(session.lastFocus, session.learned);
    const f = Object.assign({}, frame, { intent: 'define', focus: session.lastFocus, focusTopic: topic });
    return this._define(f, session, ledger, Object.assign({}, opts, { exclude: session.cited, maxEvidence: 5 }));
  }

  _teach(frame, session) {
    const { topic, comment } = frame.teach;
    const unit = {
      id: 'learned:' + session.id + ':' + hash32(topic + comment),
      stack: 'session.learned', kind: 'fact', topic, text: comment.replace(/^(is|are|was|were)\s+/i, ''),
      locator: 'session ' + session.id + ' turn ' + (session.history.length + 1), tier: 'learned'
    };
    unit._key = normalizeTopic(topic);
    session.learned.push(unit);
    if (!this.index.stacks['session.learned']) this.index.stacks['session.learned'] = { title: 'Taught in this session', tier: 'learned' };
    return { route: 'LEARNING_INGESTION', modality: '[LEARNED]', confidence: 1, lines: ['Recorded for this session: ' + topic + ' \u2014 ' + unit.text + '. It stays local to this conversation and does not enter the shared stacks.'], focus: unit._key };
  }

  _self() {
    const s = this.stats();
    return {
      route: 'SELF_DESCRIPTION', modality: '[SELF]', confidence: 1,
      lines: [
        'I am Alice, a cognitive engine. I interpret your question, find the matching concepts and relations in the stacks, and answer only from what they say, with numbered sources.',
        'I hold ' + s.units.toLocaleString('en-US') + ' cited units across ' + s.stacks + ' stacks and ' + s.relations.toLocaleString('en-US') + ' typed relations. Formal questions such as arithmetic, propositional logic, syllogisms, and modal claims go to my proof engines.',
        'When the stacks do not answer, I say so instead of guessing. Ask "what stacks do you use" for the inventory.'
      ]
    };
  }

  _inventory() {
    const rows = Object.entries(this.index.stacks).filter(([, v]) => v.count).sort((a, b) => b[1].count - a[1].count);
    return {
      route: 'INVENTORY', modality: '[SELF]', confidence: 1,
      lines: ['Stacks loaded (' + rows.length + '):', ...rows.map(([id, v]) => '- ' + v.title + ' \u2014 ' + v.count + ' units \u00B7 ' + v.tier)]
    };
  }

  _gap(frame, ranked, ledger) {
    const near = [];
    const seen = new Set();
    for (const r of ranked) {
      if (near.length >= 5) break;
      if (r.unit.tier === 'speculative' || seen.has(r.unit._key)) continue;
      seen.add(r.unit._key);
      near.push(r.unit.topic);
    }
    const subject = frame.focus || frame.raw;
    const lines = ['I don\u2019t know. The stacks hold nothing reliable on \u201C' + subject + '\u201D.'];
    if (near.length) lines.push('Nearest topics I do hold: ' + near.join('; ') + '.');
    lines.push('You can rephrase, name a specific concept, or teach me with \u201Cremember that X is Y\u201D.');
    return { route: 'EPISTEMIC_GAP', modality: '[UNKNOWN]', confidence: 0, lines, near, focus: null, escalate: true };
  }

  _renderPath(path, ledger) {
    return path.map((p, i) => {
      const u = p.unitId && this.index.unit(p.unitId);
      const n = u ? ' [' + ledger.cite(u) + ']' : '';
      return (i === 0 ? p.source : '') + ' \u2014' + p.rel.replace(/_/g, ' ') + '\u2192 ' + p.target + n;
    }).join('');
  }

  _finish(frame, session, ledger, r, opts) {
    const conf = round(r.confidence || 0);
    const body = [...(r.lines || [])];
    if (r.related && r.related.length) body.push('Related: ' + r.related.join(' \u00B7 '));
    if (r.notes && r.notes.length) body.push(...r.notes.map(n => 'Note: ' + n));
    const refs = ledger.list.map(formatReference);
    const markdown = body.join('\n\n') + (refs.length ? '\n\nSources:\n' + refs.join('\n') : '');
    const text = markdown.replace(/\*\*([^*]+)\*\*/g, '$1');
    if (r.focus) session.lastFocus = r.focus;
    for (const c of ledger.list) session.cited.add(c.unitId);
    session.history.push({ prompt: frame.raw, intent: frame.intent, route: r.route, focus: r.focus || null, confidence: conf });
    if (session.history.length > 50) session.history.shift();
    session.updated = Date.now();
    const progen = [
      'intention : answer inquiry from the stacks.',
      'intent : ' + frame.intent + '.',
      'focus : ' + (r.focus || frame.focus || 'none') + '.',
      'route : ' + r.route + '.',
      'modality : ' + r.modality + '.',
      'confidence : ' + conf + '.',
      ...ledger.list.map(c => 'evidence ' + c.n + ' : ' + c.stack + ' \u00B7 ' + c.locator + ' \u00B7 ' + c.tier + '.'),
      r.route === 'EPISTEMIC_GAP' ? 'end result : DONT_KNOW.' : 'end result : cited answer emitted.'
    ].join('\n\n');
    return {
      ok: r.route !== 'ENGINE_ERROR',
      engine: ENGINE,
      version: VERSION,
      answer: opts.format === 'text' ? text : markdown,
      text,
      route: r.route,
      intent: frame.intent,
      modality: r.modality,
      confidence: conf,
      focus: r.focus || null,
      citations: ledger.list,
      references: refs,
      related: r.related || [],
      near: r.near || [],
      escalate: !!r.escalate,
      formal: r.formal || null,
      session: session.id,
      frame: { focus: frame.focus, resolved: frame.resolved, pair: frame.pair, pronounResolved: frame.pronounResolved, entities: frame.entities.map(e => ({ phrase: e.phrase, key: e.key, match: e.match })), notes: frame.notes },
      progenStream: progen
    };
  }
}

function now() {
  return typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
}

function round(x) {
  return Math.round(x * 1000) / 1000;
}

/** toAliceCoreShape : adapter for hosts expecting the legacy AliceCore.process payload. */
export function toAliceCoreShape(res) {
  return {
    route: res.route,
    epistemicModality: res.modality,
    answer: res.answer,
    progenStream: res.progenStream,
    confidence: res.confidence,
    citations: res.citations,
    references: res.references,
    escalate: res.escalate,
    engine: res.engine
  };
}
