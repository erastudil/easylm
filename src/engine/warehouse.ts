import { WAREHOUSE_PACKS, WarehousePack } from '../data/warehouse_compiled';

const STOP = new Set([
  'a', 'an', 'the', 'of', 'and', 'or', 'to', 'in', 'on', 'for', 'is', 'it',
  'what', 'does', 'how', 'why', 'with', 'from', 'this', 'that', 'are', 'be'
]);

const CHAPTER_MAX = 2200;
const HIT_MAX = 2;
const DOOR_MAX = 8;

export interface WarehouseChapter {
  heading: string;
  body: string;
}

export function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^a-z0-9.]+/i)
    .map(t => t.trim())
    .filter(t => t.length > 1 && !STOP.has(t));
}

export function splitChapters(md: string): WarehouseChapter[] {
  const lines = md.split(/\r?\n/);
  const chapters: WarehouseChapter[] = [];
  let heading = 'front';
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

function packBonus(pack: WarehousePack, terms: string[]): number {
  let s = 0;
  const title = pack.title.toLowerCase();
  const cat = pack.category.toLowerCase();
  const slug = pack.slug.toLowerCase();
  const keys = pack.keywords.join(' ').toLowerCase();
  for (const t of terms) {
    if (pack.dewey === t) s += 40;
    if (slug === t) s += 20;
    if (title.includes(t)) s += 10;
    if (cat.includes(t)) s += 6;
    if (keys.includes(t)) s += 8;
  }
  return s;
}

function scoreChapter(ch: WarehouseChapter, terms: string[]): number {
  const h = ch.heading.toLowerCase();
  const b = ch.body.toLowerCase();
  let s = scoreHay(h, terms) * 4;
  // cap body so a long thermo chapter cannot drown a named heading
  s += Math.min(scoreHay(b, terms), 24);
  if (/^0[\.\s]|how to use|syllabus|table of contents/i.test(ch.heading)) {
    s = Math.floor(s / 4);
  }
  return s;
}

function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).trimEnd() + '\n…';
}

function listCatalog(): string {
  const rows = WAREHOUSE_PACKS.map(
    p => `Dewey ${p.dewey} · ${p.slug} · ${p.title} (${p.category})`
  );
  return [
    'EasyLM warehouse packs. Each pack is TEXTBOOK.md + LINK_INDEX.md of official doors.',
    '',
    ...rows,
    '',
    'Query a subject, a Dewey number, or a term. Wiki is not the book. Fetch the named door for a load-bearing number.'
  ].join('\n');
}

export function execWarehouse(query: string): string {
  const q = query.trim();
  if (!q) return 'No search terms provided for Warehouse lookup.';
  const lower = q.toLowerCase();
  if (
    lower === 'list' ||
    lower === 'index' ||
    lower === 'catalog' ||
    lower === 'packs' ||
    lower === 'what is in the warehouse'
  ) {
    return listCatalog();
  }

  const terms = tokenize(q);
  if (terms.length === 0) return listCatalog();

  const ranked: { pack: WarehousePack; ch: WarehouseChapter; score: number }[] = [];
  for (const pack of WAREHOUSE_PACKS) {
    const bonus = packBonus(pack, terms);
    for (const ch of splitChapters(pack.textbook)) {
      const score = bonus + scoreChapter(ch, terms);
      if (score > 0) ranked.push({ pack, ch, score });
    }
  }
  ranked.sort((a, b) => b.score - a.score);

  if (ranked.length === 0) {
    return `No warehouse hits for "${query}". Packs span Dewey 000–900. Try a subject name (math, physics, civics) or \`warehouse("list")\`.`;
  }

  const chosen = ranked.slice(0, HIT_MAX);
  const blocks: string[] = [];
  const doorsFor = new Set<string>();

  for (const { pack, ch } of chosen) {
    blocks.push(
      `[Dewey ${pack.dewey} · ${pack.title} · ${ch.heading}]\n${clip(ch.body, CHAPTER_MAX)}`
    );
    if (!doorsFor.has(pack.slug)) {
      doorsFor.add(pack.slug);
      const doors = extractDoors(pack.links).slice(0, DOOR_MAX);
      if (doors.length > 0) {
        blocks.push(
          `Official doors (${pack.slug}):\n` + doors.map(d => `- ${d}`).join('\n')
        );
      }
    }
  }

  return blocks.join('\n\n');
}

export function warehouseStats(): { packs: number; textbooks: number; doors: number } {
  return {
    packs: WAREHOUSE_PACKS.length,
    textbooks: WAREHOUSE_PACKS.filter(p => p.textbook.includes('\n## ')).length,
    doors: WAREHOUSE_PACKS.reduce((n, p) => n + extractDoors(p.links).length, 0)
  };
}
