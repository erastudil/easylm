import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const stacksDir = join(root, 'stacks');
const verbose = process.argv.includes('-v');

const LEVELS = new Set(['read', 'count', 'algebra', 'hs', 'undergrad', 'grad']);

const KNOWN_GAPS = [
  'education (370)', 'economics (household/micro)', 'writing', 'energy (grid, fuel)',
  'environment (lived system)', 'first_aid', 'food (cooking, spoilage)'
];

const packs = JSON.parse(readFileSync(join(stacksDir, 'PACKS.json'), 'utf8'));
const slugs = new Set(packs.map(p => p.slug));
const onDisk = readdirSync(stacksDir, { withFileTypes: true })
  .filter(d => d.isDirectory()).map(d => d.name);

const rows = [];
const fails = [];
const warns = [];

function frontMatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-z_]+):\s*(.+)$/);
    if (kv) fm[kv[1]] = kv[2].trim();
  }
  return fm;
}

function doorHosts(urls) {
  return new Set(urls.map(u => (u.match(/https:\/\/([^/]+)/) || [])[1]).filter(Boolean));
}

for (const p of packs) {
  const dir = join(stacksDir, p.slug);
  const tbPath = join(dir, 'TEXTBOOK.md');
  const liPath = join(dir, 'LINK_INDEX.md');
  if (!existsSync(tbPath)) { fails.push(`PACKS.json slug "${p.slug}" has no TEXTBOOK.md`); continue; }
  if (!existsSync(liPath)) { fails.push(`PACKS.json slug "${p.slug}" has no LINK_INDEX.md`); continue; }

  const tb = readFileSync(tbPath, 'utf8');
  const li = readFileSync(liPath, 'utf8');
  const lines = tb.split('\n').length;
  const chapters = (tb.match(/^## /gm) || []).length;
  const urls = li.match(/https:\/\/[^\s)|>\]]+/g) || [];
  const hosts = doorHosts(urls).size;
  const fm = frontMatter(tb);
  const level = fm.level || p.level || null;
  const floorAge = fm.floor_age || p.floor_age || null;

  if (chapters > 0 && lines / chapters < 12) {
    warns.push(`${p.slug}: ${lines} lines / ${chapters} chapters — outline shape, likely stub (LAW.md)`);
  }
  if (!level) warns.push(`${p.slug}: no level tag in front matter or PACKS.json (LAW.md levels)`);
  else if (!LEVELS.has(level)) fails.push(`${p.slug}: level "${level}" is not a legal level (${[...LEVELS].join('/')})`);
  if (floorAge !== null && Number(floorAge) < 13) {
    fails.push(`${p.slug}: floor_age ${floorAge} is below the Stacks floor of 13`);
  }

  for (const m of tb.matchAll(/stacks\/([a-z_]+)\//g)) {
    if (!slugs.has(m[1]) && !['tools'].includes(m[1])) {
      fails.push(`${p.slug}/TEXTBOOK.md: dangling cross-ref to stacks/${m[1]}/`);
    }
  }
  for (const m of li.matchAll(/stacks\/([a-z_]+)\//g)) {
    if (!slugs.has(m[1]) && !['tools'].includes(m[1])) {
      fails.push(`${p.slug}/LINK_INDEX.md: dangling cross-ref to stacks/${m[1]}/`);
    }
  }
  for (const m of tb.matchAll(/\.\.\/([a-z_]+)\//g)) {
    if (!slugs.has(m[1]) && !['tools'].includes(m[1])) {
      fails.push(`${p.slug}/TEXTBOOK.md: front-matter related "../${m[1]}/" does not exist`);
    }
  }

  rows.push({ dewey: p.dewey, slug: p.slug, lines, chapters, doors: urls.length, hosts, level, floor: floorAge });
}

for (const d of onDisk) {
  if (!slugs.has(d)) fails.push(`stacks/${d}/ exists on disk but has no PACKS.json row`);
}

const date = new Date().toISOString().slice(0, 10);
const linesOut = [];
linesOut.push('---');
linesOut.push(`title: "The Stacks — nightly audit"`);
linesOut.push(`date: "${date}"`);
linesOut.push('status: generated · do not hand-edit · scripts/nightly_stacks.mjs');
linesOut.push('---');
linesOut.push('');
linesOut.push(`packs: ${rows.length} · fails: ${fails.length} · warns: ${warns.length}`);
linesOut.push('');
linesOut.push('| dewey | slug | lines | chapters | doors | door hosts | level | floor |');
linesOut.push('|---|---|---:|---:|---:|---:|---|---|');
for (const r of rows) {
  linesOut.push(`| ${r.dewey} | ${r.slug} | ${r.lines} | ${r.chapters} | ${r.doors} | ${r.hosts} | ${r.level || '—'} | ${r.floor || '—'} |`);
}
if (fails.length) {
  linesOut.push('', '## fail');
  for (const f of fails) linesOut.push(`- ${f}`);
}
if (warns.length) {
  linesOut.push('', '## warn');
  for (const w of warns) linesOut.push(`- ${w}`);
}
linesOut.push('', '## known gaps (candidates, not failures)');
for (const g of KNOWN_GAPS) linesOut.push(`- ${g}`);
linesOut.push('');

writeFileSync(join(stacksDir, 'NIGHTLY_REPORT.md'), linesOut.join('\n'), 'utf8');

if (verbose) for (const r of rows) console.log(`${r.dewey.padStart(7)} ${r.slug.padEnd(14)} ${String(r.lines).padStart(4)} lines ${String(r.chapters).padStart(3)} ch ${String(r.doors).padStart(3)} doors ${r.level || '—'}`);
for (const f of fails) console.error(`FAIL ${f}`);
for (const w of warns) console.error(`WARN ${w}`);
console.log(`stacks audit: ${rows.length} packs, ${fails.length} fail, ${warns.length} warn -> stacks/NIGHTLY_REPORT.md`);
console.log(fails.length === 0 ? 'pass' : 'fail');
process.exit(fails.length === 0 ? 0 : 1);