/**
 * topic : alice mind prompt interpreter.
 *
 * comment : maps a raw prompt plus session state to an intent frame : intent class, focus phrase, entity spans, comparison pair, pronoun resolution, and formal-route candidacy.
 *
 * invariant : pure function of (prompt, index, session); zero side effects.
 */

import { normalizeTopic, words, tokens, STOPWORDS } from './text.js';

const ANSWER_TYPES = [
  { type: 'author', re: /^who\s+(wrote|authored|composed|penned)\s+/i, rewrite: 'what is ', cues: 'author authorship wrote written attributed' },
  { type: 'originator', re: /^who\s+(invented|discovered|founded|created|developed|proposed|coined|formulated|introduced|built)\s+/i, rewrite: 'what is ', cues: 'invented discovered founder founded created developed proposed coined formulated introduced attributed originator' },
  { type: 'time', re: /^when\s+(was|were|did|is|does)\s+/i, rewrite: 'what is ', cues: 'year century date born died period era founded published' },
  { type: 'place', re: /^where\s+(is|are|was|were|did|does|do)\s+/i, rewrite: 'what is ', cues: 'located location region country city place found occurs' }
];

const PRONOUNS = /^(it|its|this|that|these|those|they|them|he|him|his|she|her|hers|the same|this one|that one|the former|the latter)$/i;
const PRONOUN_IN = /\b(it|this|that|they|them|he|him|she|her)\b/i;

const PATTERNS = [
  { intent: 'greeting', re: /^(hi|hello|hey|greetings|good (morning|afternoon|evening)|howdy|yo)\b[\s!.,]*$/i },
  { intent: 'thanks', re: /^(thanks|thank you|thx|cheers|much appreciated)\b/i },
  { intent: 'self', re: /^(who|what) are you\b|^what can you do\b|^help\b|^how do you work\b|^what is alice\b|^who is alice\b/i },
  { intent: 'inventory', re: /\b(what|which) (stacks|sources|packs|corpora|knowledge)\b.*\b(have|know|use|cite|load|trust)\b|^(list|show) (the )?(stacks|sources|packs)\b/i },
  { intent: 'teach', re: /^(?:remember|note|learn|record)(?: that)?\s+(.+?)\s*(?:\s:\s|\s=\s|\s+(?:is|are|means)\s+)(.+)$/i },
  { intent: 'followup', re: /^(tell me more|more|go on|continue|elaborate|expand( on that)?|say more|keep going|and\??|more please)[\s.!?]*$/i },
  { intent: 'source', re: /\b(sources?|citations?|cite|references?|primary (text|source)|where can i (read|find|learn|look up)|reading list|doors?)\b/i },
  { intent: 'compare', re: /\b(differences?|distinguish|distinction|compare|comparison|contrast)\b.*\b(between|and|from|with|to)\b|\b(?:vs\.?|versus)\b/i },
  { intent: 'relation', re: /\b(how|what)\b.*\b(relates?|related|relationship|connect(ed|ion|s)?|link(ed|s)?)\b.*\b(to|with|and|between)\b|\brelationship between\b/i },
  { intent: 'list', re: /^(list|name|enumerate|give me)\b|\b(types|kinds|examples|forms|branches|varieties|categories) of\b/i },
  { intent: 'define', re: /^(what|who)\s*(?:'s|\s+(is|are|was|were))\b|^define\b|^definition of\b|^meaning of\b|^what does .+ mean\b|^explain\b|^describe\b|^tell me about\b|^what do you know about\b|^summari[sz]e\b/i },
  { intent: 'why', re: /^why\b/i },
  { intent: 'how', re: /^how\b/i },
  { intent: 'verify', re: /^(is|are|was|were|does|do|did|can|could|has|have)\b.+\?\s*$/i }
];

const FORMAL_PATTERNS = [
  /^(deduce|syllogism|deduction|abduce|abduction|hypothesize|modal|epistemic logic|counterfactual|dialectic|prove|refute|evaluate|calculate|compute|math)\s*:/i,
  /^[\d\s+\-*/%^().,]+[+\-*/%^][\d\s+\-*/%^().,]+\??$/,
  /^(what is|calculate|compute|evaluate)\s+[\d(][\d\s+\-*/%^().]*[+\-*/%^][\d\s+\-*/%^().]*\??$/i,
  /^(sqrt|cbrt|sin|cos|tan|abs|round|floor|ceil)\s*\(/i,
  /\b(true|false)\b.*\b(and|or|xor|implies|iff)\b.*\b(true|false)\b/i,
  /^\s*(all|no|some)\s+\w+.*\b(are|is)\b.*[.;]\s*(all|no|some)\s+\w+.*\b(are|is)\b/i,
  /^is it (necessarily|possible that|impossible that)\b/i,
  /^if .+ had .+ would\b/i
];

const STRIP_LEAD = [
  /^(please\s+)?(can|could|would) you\s+/i,
  /^(i want to know|i'd like to know|i wonder|do you know)\s+/i,
  /^(what|who)\s*(?:'s|\s+(is|are|was|were))\s+/i,
  /^what does\s+(.+?)\s+mean\b.*$/i,
  /^(define|definition of|meaning of|explain|describe|tell me about|what do you know about|summari[sz]e)\s+/i,
  /^(list|name|enumerate|give me)\s+(the\s+)?(main\s+|major\s+|key\s+)?/i,
  /^(why|how)\s+(does|do|did|is|are|was|were|can|could|should|would)\s+/i,
  /^(why|how)\s+/i,
  /^(is|are|was|were|does|do|did|can|could|has|have)\s+/i
];

function stripQuestion(text) {
  let t = text.trim().replace(/[?!.\s]+$/, '');
  const dm = t.match(/^what does\s+(.+?)\s+mean\b/i);
  if (dm) return dm[1];
  for (const re of STRIP_LEAD) t = t.replace(re, '');
  t = t.replace(/^(the|a|an)\s+/i, '');
  t = t.replace(/\s+(in (simple|plain) (terms|english|words)|briefly|in detail|for me|please)$/i, '');
  t = t.replace(/\s+(work|works|operate|operates|function|functions|happen|happens|occur|occurs)$/i, '');
  return t.trim();
}

function splitPair(text) {
  const t = text.replace(/[?!.]+$/, '');
  const pats = [
    /\b(?:difference|differences|distinction|relationship|relation|connection|link|contrast|comparison)\s+between\s+(.+?)\s+and\s+(.+)$/i,
    /\b(?:compare|contrast|distinguish)\s+(.+?)\s+(?:and|with|to|from|vs\.?|versus)\s+(.+)$/i,
    /^(?:how\s+(?:does|do|is|are)\s+)?(.+?)\s+(?:relate|related|connect|connected|linked)\s+(?:to|with)\s+(.+)$/i,
    /^(.+?)\s+(?:vs\.?|versus)\s+(.+)$/i,
    /\bhow\s+(?:does|do|is|are)\s+(.+?)\s+differ\s+from\s+(.+)$/i,
    /^(?:what is the )?difference\s+(?:of|in)\s+(.+?)\s+and\s+(.+)$/i
  ];
  for (const re of pats) {
    const m = t.match(re);
    if (m) return [cleanPhrase(m[1]), cleanPhrase(m[2])];
  }
  return null;
}

function cleanPhrase(p) {
  return String(p || '').replace(/^(what is |what are |the |a |an )/i, '').replace(/^(how|what)\s+(does|do|is|are)\s+/i, '').replace(/[?!.,;:]+$/, '').trim();
}

function splitVerify(text) {
  const t = text.replace(/[?!.]+$/, '').trim();
  const m = t.match(/^(?:is|are|was|were)\s+(.+?)\s+(?:a|an|the|one of the|kind of|type of|form of|part of)?\s*(?:a |an |the )?(.+)$/i);
  if (!m) return null;
  const parts = t.replace(/^(is|are|was|were)\s+/i, '').split(/\s+(?:a|an|the|one of the|a kind of|a type of|a form of|part of)\s+/i);
  if (parts.length === 2) return [cleanPhrase(parts[0]), cleanPhrase(parts[1])];
  return null;
}

/** interpret : produce the intent frame. */
export function interpret(prompt, index, session = null) {
  const raw = String(prompt || '').trim();
  const frame = { raw, intent: 'search', focus: '', entities: [], pair: null, formalCandidate: false, pronounResolved: null, notes: [] };
  if (!raw) { frame.intent = 'empty'; return frame; }

  frame.formalCandidate = FORMAL_PATTERNS.some(re => re.test(raw));
  for (const p of PATTERNS) {
    const m = raw.match(p.re);
    if (m) {
      frame.intent = p.intent;
      if (p.intent === 'teach') frame.teach = { topic: m[1].trim(), comment: m[2].trim().replace(/[.]+$/, '') };
      break;
    }
  }

  const overlay = session ? session.learned : [];
  let working = raw;
  const last = session && session.lastFocus;

  for (const at of ANSWER_TYPES) {
    const m = raw.match(at.re);
    if (m) {
      frame.answerType = at.type;
      frame.expansion = tokens(at.cues);
      working = raw.replace(at.re, at.rewrite);
      if (frame.intent === 'search' || frame.intent === 'define') frame.intent = 'define';
      break;
    }
  }

  if (frame.intent === 'followup') {
    frame.focus = last || '';
    frame.pronounResolved = last || null;
    return frame;
  }

  if (last && PRONOUN_IN.test(working)) {
    const stripped = stripQuestion(working);
    if (PRONOUNS.test(stripped)) {
      working = working.replace(new RegExp('\\b' + stripped.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i'), last);
      frame.pronounResolved = last;
    } else {
      const replaced = working.replace(/\b(it|this|that)\b(?=\s*(\?|$|'s|\s+(mean|work|relate|differ|come|matter|imply)))/i, last);
      if (replaced !== working) { working = replaced; frame.pronounResolved = last; }
    }
  }
  frame.resolved = working;

  if (frame.intent === 'compare' || frame.intent === 'relation') {
    const pair = splitPair(working);
    if (pair && pair[0] && pair[1]) frame.pair = pair;
    else frame.intent = frame.intent === 'compare' ? 'define' : 'search';
  }
  if (frame.intent === 'verify') {
    const vp = splitVerify(working);
    if (vp && vp[0] && vp[1]) frame.pair = vp;
  }

  frame.focus = frame.pair ? frame.pair[0] : cleanPhrase(stripQuestion(working));
  if (frame.intent === 'source') {
    frame.focus = cleanPhrase(frame.focus.replace(/\b(give me |show me |what are |list )?(the )?(primary |best |official |good )?(sources?|citations?|references?|doors?|reading list|primary texts?)\b\s*(for|on|about|of|regarding)?\s*/ig, '').replace(/^(where can i (read|find|learn|look up)( more)?( about)?)\s*/i, ''));
  }
  if (frame.intent === 'list') {
    const lm = frame.focus.match(/^(?:types|kinds|examples|forms|branches|varieties|categories) of\s+(.+)$/i);
    if (lm) frame.focus = lm[1];
  }
  frame.entities = index.findEntities(working, overlay);
  frame.focusTopic = frame.focus ? index.resolveTopic(frame.focus, overlay) : null;
  if (!frame.focusTopic && frame.entities.length) {
    const best = frame.entities.slice().sort((a, b) => (b.end - b.start) - (a.end - a.start) || matchRank(b) - matchRank(a))[0];
    const focusWords = words(frame.focus).filter(w => !STOPWORDS.has(w)).length || 1;
    frame.focusTopic = Object.assign({}, best, { partial: Math.min(1, (best.end - best.start) / focusWords) });
    frame.notes.push('focus resolved via entity span : ' + best.phrase);
  }
  if (frame.pair) {
    frame.pairTopics = frame.pair.map(p => index.resolveTopic(p, overlay) || bestEntityWithin(index, p, overlay));
  }
  const contentWords = words(working).filter(w => !STOPWORDS.has(w));
  frame.contentWords = contentWords;
  frame.focusKey = frame.focusTopic ? frame.focusTopic.key : normalizeTopic(frame.focus);
  return frame;
}

function matchRank(e) {
  return { exact: 3, alias: 2, learned: 2, stem: 1 }[e.match] || 0;
}

function bestEntityWithin(index, phrase, overlay) {
  const ents = index.findEntities(phrase, overlay);
  if (!ents.length) return null;
  return ents.sort((a, b) => (b.end - b.start) - (a.end - a.start))[0];
}
