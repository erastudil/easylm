/**
 * Alice drives an EasyLM turn when a shelf can answer it.
 * A hit is a stored sentence. A miss returns null and the chat path may sample a model.
 */

import { STACK_FACTS, StackFact } from '../data/stack_facts';
import { drawSvg, readPrompt, searchKnowledge } from './alice_read';

export interface AliceDriveResult {
  act: 'say' | 'cite';
  route: 'RETRIEVE' | 'ORCHESTRATE' | 'SENSE';
  source: string;
  text: string;
}

const STOP = new Set([
  'a', 'an', 'the', 'of', 'and', 'or', 'to', 'in', 'on', 'for', 'is', 'it',
  'what', 'whats', 'does', 'how', 'why', 'with', 'from', 'this', 'that',
  'are', 'be', 'about', 'which', 'explain', 'show', 'tell', 'me', 'find',
  'please', 'define', 'who', 'describe'
]);

const ASK = /^(?:please\s+)?(?:what(?:'s| is)|define|explain|tell me about|who is|describe)\s+/i;

const FEATURES: { id: string; cues: string[]; text: string }[] = [
  {
    id: 'feature:stacks',
    cues: ['stacks', 'library', 'shelf', 'shelves', 'textbook'],
    text: 'The stacks are the offline undergraduate shelves. Ask for a subject or a named fact. A hit returns the stored sentence, its Dewey code, and the door.'
  },
  {
    id: 'feature:hands',
    cues: ['hands', 'hand', 'calc', 'units', 'datetime'],
    text: 'Local hands are calc, units, datetime, and stacks. They run on this device before any model sample. A pinned card does not open a socket.'
  },
  {
    id: 'feature:memory',
    cues: ['memory', 'remember', 'atmem'],
    text: 'Memory keeps notes you asked to store and brings back the ones that overlap the question, inside a small budget. A note is not a source for a new fact.'
  },
  {
    id: 'feature:studio',
    cues: ['studio', 'canvas', 'graph'],
    text: 'Studio reads markdown, writes notes, edits code, graphs a function, and draws. It stays on the device.'
  },
  {
    id: 'feature:alice',
    cues: ['alice', 'emap'],
    text: 'Alice answers from a stack card or a feature card. If those miss, the chat can still ask a model. That sample is not the ground.'
  }
];

function tokens(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(term => term.length > 1 && !STOP.has(term));
}

function featureHit(query: string): AliceDriveResult | null {
  if (!/\b(how|help|what can you|how do i|how to)\b/i.test(query)) return null;
  const terms = new Set(tokens(query));
  let best: (typeof FEATURES)[number] | null = null;
  let bestScore = 0;
  for (const feature of FEATURES) {
    const score = feature.cues.filter(cue => terms.has(cue)).length;
    if (score > bestScore) {
      best = feature;
      bestScore = score;
    }
  }
  if (!best) return null;
  return {
    act: 'cite',
    route: 'RETRIEVE',
    source: best.id,
    text: best.text
  };
}

function citeFact(query: string): StackFact | null {
  const raw = query.trim().replace(/[?.!]+$/, '').replace(ASK, '').trim().toLowerCase();
  const terms = tokens(raw);
  if (terms.length < 2) return null;
  let best: { card: StackFact; score: number } | null = null;
  for (const card of STACK_FACTS) {
    const topic = card.topic.toLowerCase();
    const topicTerms = tokens(card.topic);
    const phraseHit = raw.length > 3 && topic.includes(raw);
    const termsHit = terms.every(term => topicTerms.includes(term) || topic.includes(term));
    if (!phraseHit && !termsHit) continue;
    const score = (phraseHit ? 100 : 40) + terms.length;
    if (!best || score > best.score || (score === best.score && card.topic < best.card.topic)) {
      best = { card, score };
    }
  }
  return best ? best.card : null;
}

export function aliceDrive(query: string, personality = 'chat'): AliceDriveResult | null {
  const reading = readPrompt(query, personality);
  if (reading.frame === 'swarm' || reading.frame === 'agent' || reading.frame === 'serve' || reading.frame === 'mcp') {
    return {
      act: 'cite',
      route: 'ORCHESTRATE',
      source: `hydra:${reading.frame}`,
      text: `${reading.command}\nRun that command yourself. This page does not launch a paid swarm or a frontier agent.`
    };
  }
  if (reading.frame === 'browse') {
    return {
      act: 'cite',
      route: 'ORCHESTRATE',
      source: 'oss:playwright',
      text: `${reading.command}\nPlaywright opens that public page from Hydra or the Alice session. This page does not fetch it.`
    };
  }
  if (reading.frame === 'draw') {
    return {
      act: 'say',
      route: 'SENSE',
      source: 'tool:draw',
      text: drawSvg(query)
    };
  }

  const feature = featureHit(query);
  if (feature) return feature;

  const card = citeFact(query);
  if (card) {
    const door = card.door ? ` Door: ${card.door}` : '';
    return {
      act: 'cite',
      route: 'RETRIEVE',
      source: `stack:${card.slug}:${card.topic}`,
      text: `${card.topic}: ${card.comment} [Dewey ${card.dewey} · ${card.title}]${door}`
    };
  }

  return aliceKnowledge(query);
}

export function aliceKnowledge(query: string): AliceDriveResult | null {
  const card = searchKnowledge(query);
  if (!card) return null;
  return {
    act: 'cite',
    route: 'RETRIEVE',
    source: card.card_id,
    text: `${card.topic}: ${card.comment}`
  };
}
