import { STACKS_PACKS, StackPack } from '../data/stacks_compiled';

export type { StackPack };
export type WarehousePack = StackPack;
export const WAREHOUSE_PACKS = STACKS_PACKS;

export interface StackChapter {
  heading: string;
  body: string;
}

const STOP = new Set([
  'a', 'an', 'the', 'of', 'and', 'or', 'to', 'in', 'on', 'for', 'is', 'it',
  'what', 'does', 'how', 'why', 'with', 'from', 'this', 'that', 'are', 'be',
  'about', 'which', 'explain', 'show', 'tell', 'me', 'find', 'search', 'stacks',
  'library', 'textbook', 'chapter', 'dewey'
]);

const CHAPTER_MAX = 3500;
const HIT_MAX = 2;
const DOOR_MAX = 8;

const SUBJECT_ALIASES: Record<string, string[]> = {
  ai: ['ai_ml', 'computing'],
  ml: ['ai_ml'],
  neural: ['ai_ml'],
  deeplearning: ['ai_ml'],
  transformer: ['ai_ml'],
  code: ['software', 'computing'],
  coding: ['software'],
  programming: ['software'],
  algorithm: ['computing', 'software'],
  data: ['computing', 'methods'],
  stats: ['methods', 'math'],
  statistics: ['methods', 'math'],
  probability: ['math', 'methods'],
  bayes: ['methods', 'math'],
  econ: ['finance', 'business'],
  economics: ['finance'],
  money: ['finance'],
  stocks: ['finance', 'business'],
  markets: ['finance', 'business'],
  constitution: ['civics', 'law'],
  court: ['law'],
  rights: ['civics', 'law'],
  democracy: ['civics'],
  government: ['civics'],
  politics: ['civics'],
  stars: ['astronomy'],
  cosmos: ['astronomy'],
  space: ['astronomy'],
  planets: ['astronomy'],
  mind: ['psychology', 'philosophy'],
  cognition: ['psychology'],
  behavior: ['psychology', 'sociology'],
  mental: ['psychology', 'health'],
  society: ['sociology'],
  culture: ['sociology', 'history'],
  god: ['religion', 'philosophy'],
  theology: ['religion'],
  faith: ['religion'],
  verse: ['poetry'],
  sonnet: ['poetry'],
  poem: ['poetry'],
  novel: ['literature'],
  author: ['literature'],
  fiction: ['literature'],
  drama: ['literature'],
  climate: ['weather', 'geography'],
  meteorology: ['weather'],
  atmosphere: ['weather'],
  biology: ['biology'],
  genetics: ['biology'],
  dna: ['biology'],
  evolution: ['biology'],
  cells: ['biology'],
  medicine: ['health'],
  disease: ['health'],
  anatomy: ['health'],
  nutrition: ['health'],
  circuits: ['engineering'],
  robotics: ['engineering', 'computing'],
  structures: ['engineering'],
  farming: ['agriculture'],
  crops: ['agriculture'],
  soil: ['agriculture'],
  marketing: ['business'],
  management: ['business'],
  accounting: ['business', 'finance'],
  painting: ['art'],
  sculpture: ['art'],
  design: ['art'],
  aesthetic: ['art', 'philosophy'],
  harmony: ['music'],
  tempo: ['music'],
  melody: ['music'],
  counterpoint: ['music'],
  empire: ['history'],
  war: ['history'],
  revolution: ['history'],
  ancient: ['history'],
  cartography: ['geography'],
  gis: ['geography'],
  maps: ['geography'],
  oceans: ['geography']
};

export function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^a-z0-9.]+/i)
    .map(t => t.trim())
    .filter(t => t.length > 1 && !STOP.has(t));
}

export function splitChapters(md: string): StackChapter[] {
  const lines = md.split(/\r?\n/);
  const chapters: StackChapter[] = [];
  let heading = 'General Introduction';
  let buf: string[] = [];
  const flush = () => {
    const body = buf.join('\n').trim();
    if (body.length > 0) chapters.push({ heading, body });
    buf = [];
  };
  for (const line of lines) {
    if (line.startsWith('## ')) {
      flush();
      heading = line.replace(/^##\s+/, '').trim();
      continue;
    }
    buf.push(line);
  }
  flush();
  return chapters;
}

export function extractDoors(links: string): string[] {
  const doors: string[] = [];
  const seen = new Set<string>();
  const re = /https:\/\/[^\s)|>\]]+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(links)) !== null) {
    const url = m[0].replace(/[.,;]+$/, '');
    if (seen.has(url)) continue;
    seen.add(url);
    doors.push(url);
  }
  return doors;
}

function scoreHay(hay: string, terms: string[]): number {
  let s = 0;
  for (const t of terms) {
    if (hay === t) s += 8;
    else if (hay.includes(t)) s += 2;
  }
  return s;
}

function packBonus(pack: StackPack, terms: string[]): number {
  let s = 0;
  const title = pack.title.toLowerCase();
  const cat = pack.category.toLowerCase();
  const slug = pack.slug.toLowerCase();
  const keys = pack.keywords.join(' ').toLowerCase();
  for (const t of terms) {
    if (pack.dewey === t) s += 50;
    if (slug === t) s += 30;
    if (title.includes(t)) s += 15;
    if (cat.includes(t)) s += 10;
    if (keys.includes(t)) s += 12;

    const targetSlugs = SUBJECT_ALIASES[t];
    if (targetSlugs && targetSlugs.includes(slug)) {
      s += 25;
    }
  }
  return s;
}

function scoreChapter(ch: StackChapter, terms: string[], rawPhrase?: string): number {
  const h = ch.heading.toLowerCase();
  const b = ch.body.toLowerCase();
  let s = scoreHay(h, terms) * 4;
  s += Math.min(scoreHay(b, terms), 45);

  if (rawPhrase && rawPhrase.length > 3) {
    if (b.includes(rawPhrase)) s += 35;
    if (h.includes(rawPhrase)) s += 50;
  }

  if (/^0[\.\s]|how to use|syllabus|table of contents/i.test(ch.heading)) {
    s = Math.floor(s / 4);
  }
  return s;
}

function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '\n…';
}

function excerptChapter(body: string, terms: string[], rawPhrase: string, max = CHAPTER_MAX): string {
  if (body.length <= max) return body;

  const paragraphs = body.split(/\n\s*\n/);
  let bestIdx = 0;
  let bestScore = -1;

  paragraphs.forEach((p, idx) => {
    const pLow = p.toLowerCase();
    let score = 0;
    if (rawPhrase && rawPhrase.length > 3 && pLow.includes(rawPhrase)) {
      score += 20;
    }
    for (const t of terms) {
      if (pLow.includes(t)) score += 4;
    }
    if (score > bestScore) {
      bestScore = score;
      bestIdx = idx;
    }
  });

  if (bestIdx <= 1) {
    return clip(body, max);
  }

  const selected: string[] = [];
  let charCount = 0;
  const start = Math.max(0, bestIdx - 1);
  for (let i = start; i < paragraphs.length; i++) {
    if (charCount + paragraphs[i].length > max && selected.length > 0) break;
    selected.push(paragraphs[i]);
    charCount += paragraphs[i].length;
  }

  return `[… context preceding …]\n\n${clip(selected.join('\n\n'), max)}`;
}

function listCatalog(): string {
  const rows = WAREHOUSE_PACKS.map(
    p => `• Dewey ${p.dewey} · ${p.slug} · ${p.title} (${p.category})`
  );
  return [
    '🏛️ THE STACKS — Sovereign University Library Catalog',
    'Curated undergraduate textbooks and primary bibliographic portals across the Dewey Decimal Classification (000–900).',
    'Zero-network, browser-resident academic references.',
    '',
    ...rows,
    '',
    'Usage: query a subject or discipline (e.g. `stacks("astronomy")`, `stacks("psychology")`, `stacks("Bayes theorem")`), or browse via `stacks("list")`.'
  ].join('\n');
}

export function execStacks(query: string): string {
  const q = query.trim();
  if (!q) return 'No search terms provided for The Stacks lookup.';
  const lower = q.toLowerCase();
  if (
    lower === 'list' ||
    lower === 'index' ||
    lower === 'catalog' ||
    lower === 'packs' ||
    lower === 'stacks' ||
    lower === 'what is in the stacks' ||
    lower === 'what is in the warehouse'
  ) {
    return listCatalog();
  }

  const terms = tokenize(q);
  if (terms.length === 0) return listCatalog();

  const ranked: { pack: StackPack; ch: StackChapter; score: number }[] = [];
  for (const pack of STACKS_PACKS) {
    const bonus = packBonus(pack, terms);
    for (const ch of splitChapters(pack.textbook)) {
      const score = bonus + scoreChapter(ch, terms, lower);
      if (score > 0) ranked.push({ pack, ch, score });
    }
  }
  ranked.sort((a, b) => b.score - a.score);

  if (ranked.length === 0) {
    return `No warehouse hits or Stacks matches for "${query}". The Library covers all major undergraduate fields (Dewey 000–900). Try a subject title (e.g. math, psychology, astronomy, physics, civics) or call \`stacks("list")\` for the full catalog.`;
  }

  const chosen = ranked.slice(0, HIT_MAX);
  const blocks: string[] = [];
  const doorsFor = new Set<string>();

  for (const { pack, ch } of chosen) {
    const excerpt = excerptChapter(ch.body, terms, lower, CHAPTER_MAX);
    blocks.push(
      `[Dewey ${pack.dewey} · ${pack.title} — ${ch.heading}]\n${excerpt}`
    );
    if (!doorsFor.has(pack.slug)) {
      doorsFor.add(pack.slug);
      const doors = extractDoors(pack.links).slice(0, DOOR_MAX);
      if (doors.length > 0) {
        blocks.push(
          `Official doors & primary portals (${pack.slug}):\n` + doors.map(d => `- ${d}`).join('\n')
        );
      }
    }
  }

  return blocks.join('\n\n');
}

export function stacksStats(): { packs: number; textbooks: number; doors: number } {
  return {
    packs: STACKS_PACKS.length,
    textbooks: STACKS_PACKS.filter(p => p.textbook.includes('\n## ')).length,
    doors: STACKS_PACKS.reduce((n, p) => n + extractDoors(p.links).length, 0)
  };
}
