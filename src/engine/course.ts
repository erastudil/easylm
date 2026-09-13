import { COURSE_PACKS, PUBLIC_ITEMS, CoursePack, PublicItem, PublicQuestion } from '../data/courses_compiled';
import { splitChapters } from './stacks';
import { STACKS_PACKS } from '../data/stacks_compiled';

export type { CoursePack, PublicItem, PublicQuestion };
export type ItemKind = PublicItem['kind'];

export function listCourses(): CoursePack[] {
  return COURSE_PACKS;
}

export function getCourse(id: string): CoursePack | undefined {
  return COURSE_PACKS.find(c => c.id === id);
}

export function getItem(id: string): PublicItem | undefined {
  return PUBLIC_ITEMS[id];
}

export function itemsForLesson(lessonItemIds: string[]): PublicItem[] {
  return lessonItemIds.map(id => PUBLIC_ITEMS[id]).filter((x): x is PublicItem => !!x);
}

export function allLessonIds(course: CoursePack): string[] {
  const ids: string[] = [];
  for (const u of course.units) {
    for (const l of u.lessons) ids.push(l.id);
  }
  return ids;
}

export function allItemIds(course: CoursePack): string[] {
  const ids: string[] = [];
  for (const u of course.units) {
    for (const l of u.lessons) ids.push(...l.items);
  }
  return ids;
}

export function lessonById(courseId: string, lessonId: string) {
  const course = getCourse(courseId);
  if (!course) return null;
  for (const unit of course.units) {
    const lesson = unit.lessons.find(l => l.id === lessonId);
    if (lesson) return { course, unit, lesson };
  }
  return null;
}

export function chapterExists(stackSlug: string, chapter: string): boolean {
  const pack = STACKS_PACKS.find(p => p.slug === stackSlug);
  if (!pack) return false;
  const chapters = splitChapters(pack.textbook);
  const needle = chapter.trim().toLowerCase();
  return chapters.some(c => c.heading.trim().toLowerCase() === needle || c.heading.toLowerCase().includes(needle));
}

export function localDay(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function addDays(day: string, n: number): string {
  const [y, m, d] = day.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + n);
  return localDay(dt);
}

export function studioStatusLine(opts: {
  enrolled: string[];
  activeCourseId: string | null;
  activeLessonId: string | null;
}): string {
  if (!opts.enrolled.length) {
    return 'Studio: no course enrolled. Open Studio and pick a walk. Keys are not here.';
  }
  const course = opts.activeCourseId ? getCourse(opts.activeCourseId) : getCourse(opts.enrolled[0]);
  if (!course) return 'Studio: enrolled course missing from this build.';
  const loc = opts.activeLessonId ? lessonById(course.id, opts.activeLessonId) : null;
  const lesson = loc?.lesson;
  const reading = lesson?.reading;
  const lines = [
    `Studio: ${course.title}`,
    lesson ? `Lesson: ${lesson.title}` : 'Lesson: pick one in Studio.',
    reading ? `Read: The Stacks · ${reading.stack} · ${reading.chapter}` : '',
    'Coach the method. Do not recite solutions. Tries are not a mark.'
  ];
  return lines.filter(Boolean).join('\n');
}
