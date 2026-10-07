/**
 * Read a prompt before EasyLM samples a weight.
 * Paid Hydra commands are cited. A drawing is an SVG. A knowledge hit is a stored sentence.
 */

import { KNOWLEDGE, KnowledgeCard } from './alice_knowledge';

export interface AliceReading {
  frame: string;
  command: string;
  subject: string;
}

const STOP = new Set([
  'a', 'an', 'the', 'of', 'and', 'or', 'to', 'in', 'on', 'for', 'is', 'it',
  'what', 'whats', 'does', 'how', 'why', 'with', 'from', 'this', 'that',
  'are', 'be', 'about', 'which', 'do', 'i', 'me', 'my', 'you', 'can', 'please'
]);

const COLORS: Record<string, string> = {
  red: '#c0392b',
  blue: '#2471a3',
  green: '#1e8449',
  black: '#1c1c1c',
  white: '#f7f7f7',
  gold: '#b7950b',
  gray: '#7f8c8d',
  grey: '#7f8c8d',
  orange: '#d35400',
  purple: '#6c3483'
};

export function readPrompt(text: string, personality = 'chat'): AliceReading {
  const raw = text.replace(/\s+/g, ' ').trim();
  const lower = raw.toLowerCase();
  const url = raw.match(/https?:\/\/[^\s<>"]+/)?.[0]?.replace(/[.,)]+$/, '') ?? '';
  const voice = ['coder', 'researcher', 'chat', 'writer'].includes(personality) ? personality : 'coder';

  if (/\b(draw|sketch|illustrate)\b/.test(lower) || lower.startsWith('svg')) {
    return { frame: 'draw', command: '', subject: raw };
  }
  if (url && /\b(browse|open|playwright|visit|screenshot|read the page|look at)\b/.test(lower)) {
    return { frame: 'browse', command: `playwright open ${url}`, subject: url };
  }
  if (/\bswarm\b|\bsummon (the )?heads\b|\bmulti-agent\b/.test(lower)) {
    const task = raw.replace(/^.*?\b(?:swarm|heads)\b(?:\s+to|\s+for)?/i, '').trim() || raw;
    const quoted = `'${task.replace(/'/g, `'\\''`)}'`;
    return {
      frame: 'swarm',
      command: `hydra swarm ${quoted} --heads architect,coder,auditor`,
      subject: task
    };
  }
  if (/\bhydra agent\b|\breact loop\b|\btool loop\b|\b(use|run|start) the agent\b/.test(lower)) {
    const task = raw.replace(/^.*?\bagent\b(?:\s+to|\s+for)?/i, '').trim() || raw;
    const quoted = `'${task.replace(/'/g, `'\\''`)}'`;
    return {
      frame: 'agent',
      command: `hydra agent --personality ${voice} ${quoted}`,
      subject: task
    };
  }
  if (/\bhydra serve\b|\bopenai gateway\b|\bport 7777\b/.test(lower)) {
    return { frame: 'serve', command: 'hydra serve --port 7777', subject: '127.0.0.1:7777' };
  }
  if (/\bhydra mcp\b|\bmcp init\b/.test(lower)) {
    return { frame: 'mcp', command: 'hydra mcp init', subject: 'mcp' };
  }
  return { frame: 'ask', command: '', subject: raw };
}

export function searchKnowledge(query: string): KnowledgeCard | null {
  const terms = new Set(
    query.toLowerCase().split(/[^a-z0-9]+/).filter(term => term.length > 1 && !STOP.has(term))
  );
  if (terms.size === 0) return null;
  let best: KnowledgeCard | null = null;
  let bestScore = 0;
  for (const card of KNOWLEDGE) {
    const keyHits = card.keys.filter(key => terms.has(key)).length;
    if (keyHits <= 0) continue;
    const cueHits = card.cues.filter(cue => terms.has(cue)).length;
    const score = keyHits * 10 + cueHits;
    if (score > bestScore) {
      best = card;
      bestScore = score;
    }
  }
  return best;
}

export function drawSvg(prompt: string): string {
  const lower = prompt.toLowerCase();
  let color = '#1c2833';
  for (const [name, hex] of Object.entries(COLORS)) {
    if (new RegExp(`\\b${name}\\b`).test(lower)) {
      color = hex;
      break;
    }
  }
  const quoted = prompt.match(/["']([^"']{1,80})["']/)?.[1] ?? '';
  const labeled = prompt.match(/\blabel\s+([a-z0-9][a-z0-9 -]{0,40})/i)?.[1]?.trim() ?? '';
  const label = quoted || labeled;
  let shape = `<circle cx="160" cy="128" r="72" fill="${color}"/>`;
  if (/\b(square|rectangle|box)\b/.test(lower)) {
    shape = `<rect x="48" y="48" width="160" height="160" rx="8" fill="${color}"/>`;
  } else if (/\b(line|stroke)\b/.test(lower)) {
    shape = `<line x1="32" y1="200" x2="288" y2="56" stroke="${color}" stroke-width="8"/>`;
  }
  const safe = label.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const text = label
    ? `<text x="160" y="250" text-anchor="middle" font-family="sans-serif" font-size="20" fill="#1c1c1c">${safe}</text>`
    : '';
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" width="320" height="280" viewBox="0 0 320 280">',
    '<rect width="320" height="280" fill="#fbfbfb"/>',
    shape,
    text,
    '</svg>'
  ].filter(Boolean).join('\n');
}
