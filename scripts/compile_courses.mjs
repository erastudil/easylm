import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { WAVE1 } from './wave1_courses.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const stacksDir = join(root, 'stacks');
const outDir = join(root, 'src', 'data');

function extractDoors(md) {
  const doors = [];
  const seen = new Set();
  const re = /https:\/\/[^\s)|>\]]+/g;
  let m;
  while ((m = re.exec(md)) !== null) {
    const url = m[0].replace(/[.,;]+$/, '');
    if (seen.has(url)) continue;
    seen.add(url);
    doors.push(url);
  }
  return doors;
}

function headings(md) {
  return md
    .split(/\r?\n/)
    .filter(l => l.startsWith('## '))
    .map(l => l.replace(/^##\s+/, '').trim());
}

const trusted = readFileSync(join(stacksDir, 'TRUSTED_SOURCES.md'), 'utf8');
const trustedDoors = new Set(extractDoors(trusted));
const stackDoors = new Map();
const stackHeads = new Map();
const packs = JSON.parse(readFileSync(join(stacksDir, 'PACKS.json'), 'utf8'));
for (const p of packs) {
  const links = readFileSync(join(stacksDir, p.slug, 'LINK_INDEX.md'), 'utf8');
  const book = readFileSync(join(stacksDir, p.slug, 'TEXTBOOK.md'), 'utf8');
  stackDoors.set(p.slug, new Set([...extractDoors(links), ...trustedDoors]));
  stackHeads.set(p.slug, headings(book));
}

function doorOk(stack, url) {
  const set = stackDoors.get(stack);
  if (!set) return false;
  if (set.has(url)) return true;
  for (const d of set) {
    if (url.startsWith(d) || d.startsWith(url)) return true;
  }
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    for (const d of set) {
      const h = new URL(d).hostname.replace(/^www\./, '');
      if (h === host || host.endsWith('.' + h) || h.endsWith('.' + host)) return true;
    }
  } catch {
    return false;
  }
  return false;
}

function chapterOk(stack, chapter) {
  const heads = stackHeads.get(stack) || [];
  const n = chapter.trim().toLowerCase();
  return heads.some(h => h.toLowerCase() === n || h.toLowerCase().includes(n) || n.includes(h.toLowerCase()));
}

const errors = [];
const courses = [];
const publicItems = {};
const answerKeys = {};

for (const pack of WAVE1) {
  const course = pack.course;
  const items = pack.items;
  if (!course?.id || !course.stack || !Array.isArray(course.units)) {
    errors.push('pack missing course shell');
    continue;
  }
  if (course.units.length < 8) errors.push(`${course.id}: need ≥8 units, got ${course.units.length}`);

  let quizzes = 0;
  let exams = 0;
  let essays = 0;
  let projects = 0;
  const byId = new Map(items.map(it => [it.id, it]));

  for (const unit of course.units) {
    const unitItems = unit.lessons.flatMap(l => l.items);
    if (unitItems.length === 0) errors.push(`${course.id}/${unit.id}: empty unit`);
    const hasQuiz = unitItems.some(id => byId.get(id)?.kind === 'quiz');
    if (!hasQuiz) errors.push(`${course.id}/${unit.id}: missing quiz`);
    for (const lesson of unit.lessons) {
      if (!chapterOk(course.stack, lesson.reading.chapter)) {
        errors.push(`${course.id}/${lesson.id}: chapter not in ${course.stack} textbook: ${lesson.reading.chapter}`);
      }
      for (const url of lesson.doors || []) {
        if (!doorOk(course.stack, url)) {
          errors.push(`${course.id}/${lesson.id}: door not in LINK_INDEX/TRUSTED_SOURCES: ${url}`);
        }
      }
    }
  }

  for (const it of items) {
    if (it.kind === 'quiz') quizzes++;
    if (it.kind === 'exam') exams++;
    if (it.kind === 'essay') essays++;
    if (it.kind === 'project') projects++;
    if ((it.kind === 'quiz' || it.kind === 'exam') && (!it.questions || it.questions.length < 5)) {
      errors.push(`${it.id}: need ≥5 questions`);
    }
    for (const q of it.questions || []) {
      if (q.answer === undefined || q.answer === null || q.answer === '') {
        errors.push(`${it.id}/${q.id}: missing answer`);
      }
      answerKeys[q.id] = { qtype: q.qtype, answer: q.answer, tolerance: q.tolerance };
      const pubQ = { id: q.id, prompt: q.prompt, qtype: q.qtype, choices: q.choices, hint: q.hint };
      q._pub = pubQ;
    }
    publicItems[it.id] = {
      id: it.id,
      kind: it.kind,
      lessonId: it.lessonId,
      prompt: it.prompt,
      source: it.source,
      questions: (it.questions || []).map(q => q._pub),
      rubric: it.rubric,
      steps: it.steps,
      suggestedMinutes: it.suggestedMinutes
    };
  }

  if (quizzes < 8) errors.push(`${course.id}: need a quiz per unit (≥8), got ${quizzes}`);
  if (exams < 2) errors.push(`${course.id}: need midterm + final, got ${exams}`);
  if (essays < 2) errors.push(`${course.id}: need 2 essays, got ${essays}`);
  if (projects < 1) errors.push(`${course.id}: need a project, got ${projects}`);

  courses.push({
    id: course.id,
    stack: course.stack,
    dewey: course.dewey,
    title: course.title,
    level: course.level,
    hours: course.hours,
    license: course.license,
    units: course.units
  });
}

const publicDump = JSON.stringify({ courses, items: publicItems });
if (/"answer"\s*:/.test(publicDump)) {
  errors.push('public compile still contains "answer" keys');
}

if (errors.length) {
  console.error('compile_courses failed:\n' + errors.map(e => ' - ' + e).join('\n'));
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });

const courseTs =
  '/* generated by scripts/compile_courses.mjs — do not hand-edit */\n' +
  'export interface CourseLicense {\n' +
  '  spdx: string;\n' +
  '  attribution: string;\n' +
  '  sourceUrl: string;\n' +
  '}\n' +
  'export interface LessonReading { stack: string; chapter: string }\n' +
  'export interface Lesson {\n' +
  '  id: string;\n' +
  '  title: string;\n' +
  '  reading: LessonReading;\n' +
  '  doors: string[];\n' +
  '  items: string[];\n' +
  '}\n' +
  'export interface Unit { id: string; title: string; lessons: Lesson[] }\n' +
  'export interface CoursePack {\n' +
  '  id: string;\n' +
  '  stack: string;\n' +
  '  dewey: string;\n' +
  '  title: string;\n' +
  '  level: "high" | "undergrad";\n' +
  '  hours: number;\n' +
  '  license: CourseLicense;\n' +
  '  units: Unit[];\n' +
  '}\n' +
  'export interface PublicQuestion {\n' +
  '  id: string;\n' +
  '  prompt: string;\n' +
  '  qtype: "mc" | "multi" | "numeric" | "short";\n' +
  '  choices?: string[];\n' +
  '  hint?: string;\n' +
  '}\n' +
  'export interface PublicItem {\n' +
  '  id: string;\n' +
  '  kind: "reading" | "assignment" | "quiz" | "project" | "essay" | "exam";\n' +
  '  lessonId: string;\n' +
  '  prompt: string;\n' +
  '  source: { work: string; loc: string };\n' +
  '  questions?: PublicQuestion[];\n' +
  '  rubric?: { id: string; criterion: string; max: number }[];\n' +
  '  steps?: string[];\n' +
  '  suggestedMinutes?: number;\n' +
  '}\n\n' +
  'export const COURSE_PACKS: CoursePack[] = ' +
  JSON.stringify(courses, null, 2) +
  ';\n\n' +
  'export const PUBLIC_ITEMS: Record<string, PublicItem> = ' +
  JSON.stringify(publicItems, null, 2) +
  ';\n';

const ansTs =
  '/* generated by scripts/compile_courses.mjs — do not hand-edit */\n' +
  'export interface AnswerKey {\n' +
  '  qtype: "mc" | "multi" | "numeric" | "short";\n' +
  '  answer: string | number | string[];\n' +
  '  tolerance?: number;\n' +
  '}\n\n' +
  'export const ANSWER_KEYS: Record<string, AnswerKey> = ' +
  JSON.stringify(answerKeys, null, 2) +
  ';\n';

writeFileSync(join(outDir, 'courses_compiled.ts'), courseTs, 'utf8');
writeFileSync(join(outDir, 'answers_compiled.ts'), ansTs, 'utf8');

const jsonDir = join(root, 'courses');
mkdirSync(jsonDir, { recursive: true });
for (const pack of WAVE1) {
  const publicCourse = courses.find(c => c.id === pack.course.id);
  writeFileSync(
    join(jsonDir, `${pack.course.id}.json`),
    JSON.stringify({ course: publicCourse, itemCount: pack.items.length }, null, 2),
    'utf8'
  );
}

console.log(`compiled ${courses.length} courses, ${Object.keys(publicItems).length} items, ${Object.keys(answerKeys).length} keys`);
