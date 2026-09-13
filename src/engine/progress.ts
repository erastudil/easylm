import { BADGE_CATALOG } from '../data/badges';
import { allItemIds, allLessonIds, getCourse, getItem, localDay, addDays, ItemKind } from './course';
import { LeitnerCard } from './leitner';

export interface Completion {
  at: number;
  kind: ItemKind;
  attempts: number;
}

export interface Task {
  id: string;
  title: string;
  done: boolean;
  itemId?: string;
  courseId?: string;
}

export interface Progress {
  profileId: string;
  enrolled: string[];
  enrolledAt: Record<string, number>;
  activeCourseId: string | null;
  activeLessonId: string | null;
  completed: Record<string, Completion>;
  attempts: Record<string, number>;
  failedExamSittings: Record<string, number>;
  questionPass: Record<string, boolean>;
  numericPasses: number;
  streak: { lastLocalDay: string; count: number; longest: number };
  xp: number;
  badges: string[];
  leitner: LeitnerCard[];
  tasks: Task[];
  schedule: Record<string, string>;
}

const LS_PREFIX = 'easylm_progress_';
const IDB_NAME = 'easylm';
const IDB_STORE = 'kv';

export function emptyProgress(profileId: string): Progress {
  return {
    profileId,
    enrolled: [],
    enrolledAt: {},
    activeCourseId: null,
    activeLessonId: null,
    completed: {},
    attempts: {},
    failedExamSittings: {},
    questionPass: {},
    numericPasses: 0,
    streak: { lastLocalDay: '', count: 0, longest: 0 },
    xp: 0,
    badges: [],
    leitner: [],
    tasks: [],
    schedule: {}
  };
}

export function sanitizeProgress(raw: unknown, profileId: string): Progress {
  const base = emptyProgress(profileId);
  if (!raw || typeof raw !== 'object') return base;
  const s = raw as Partial<Progress>;
  const enrolled = Array.isArray(s.enrolled) ? s.enrolled.filter(x => typeof x === 'string').slice(0, 40) : [];
  const badges = Array.isArray(s.badges) ? s.badges.filter(x => typeof x === 'string').slice(0, 80) : [];
  return {
    ...base,
    profileId,
    enrolled,
    enrolledAt: isRecord(s.enrolledAt) ? (s.enrolledAt as Record<string, number>) : {},
    activeCourseId: typeof s.activeCourseId === 'string' ? s.activeCourseId : enrolled[0] || null,
    activeLessonId: typeof s.activeLessonId === 'string' ? s.activeLessonId : null,
    completed: isRecord(s.completed) ? (s.completed as Record<string, Completion>) : {},
    attempts: isRecord(s.attempts) ? (s.attempts as Record<string, number>) : {},
    failedExamSittings: isRecord(s.failedExamSittings) ? (s.failedExamSittings as Record<string, number>) : {},
    questionPass: isRecord(s.questionPass) ? (s.questionPass as Record<string, boolean>) : {},
    numericPasses: typeof s.numericPasses === 'number' ? s.numericPasses : 0,
    streak: s.streak && typeof s.streak === 'object'
      ? {
          lastLocalDay: String((s.streak as Progress['streak']).lastLocalDay || ''),
          count: Number((s.streak as Progress['streak']).count) || 0,
          longest: Number((s.streak as Progress['streak']).longest) || 0
        }
      : base.streak,
    xp: typeof s.xp === 'number' && s.xp >= 0 ? Math.floor(s.xp) : 0,
    badges,
    leitner: Array.isArray(s.leitner) ? (s.leitner as LeitnerCard[]).slice(0, 400) : [],
    tasks: Array.isArray(s.tasks) ? (s.tasks as Task[]).slice(0, 200) : [],
    schedule: isRecord(s.schedule) ? (s.schedule as Record<string, string>) : {}
  };
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

export function loadProgress(profileId: string): Progress {
  if (typeof localStorage === 'undefined') return emptyProgress(profileId);
  try {
    const raw = localStorage.getItem(LS_PREFIX + profileId);
    if (!raw) return emptyProgress(profileId);
    return sanitizeProgress(JSON.parse(raw), profileId);
  } catch {
    return emptyProgress(profileId);
  }
}

export function saveProgress(p: Progress): void {
  if (typeof localStorage === 'undefined') return;
  const json = JSON.stringify(p);
  try {
    localStorage.setItem(LS_PREFIX + p.profileId, json);
  } catch {
    /* quota */
  }
  void idbSet(LS_PREFIX + p.profileId, json);
}

export function loadAllProgress(): Record<string, Progress> {
  if (typeof localStorage === 'undefined') return {};
  const out: Record<string, Progress> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k || !k.startsWith(LS_PREFIX)) continue;
    const profileId = k.slice(LS_PREFIX.length);
    out[profileId] = loadProgress(profileId);
  }
  return out;
}

export function restoreAllProgress(blob: Record<string, unknown>): number {
  let n = 0;
  for (const [profileId, raw] of Object.entries(blob || {})) {
    if (!profileId || profileId.length > 80) continue;
    const p = sanitizeProgress(raw, profileId);
    const existing = loadProgress(profileId);
    const merged = mergeProgress(existing, p);
    saveProgress(merged);
    n++;
  }
  return n;
}

function mergeProgress(a: Progress, b: Progress): Progress {
  return {
    ...a,
    enrolled: Array.from(new Set([...a.enrolled, ...b.enrolled])),
    enrolledAt: { ...b.enrolledAt, ...a.enrolledAt },
    completed: { ...b.completed, ...a.completed },
    attempts: { ...a.attempts, ...b.attempts },
    failedExamSittings: { ...a.failedExamSittings, ...b.failedExamSittings },
    questionPass: { ...b.questionPass, ...a.questionPass },
    numericPasses: Math.max(a.numericPasses, b.numericPasses),
    xp: Math.max(a.xp, b.xp),
    badges: Array.from(new Set([...a.badges, ...b.badges])),
    leitner: a.leitner.length >= b.leitner.length ? a.leitner : b.leitner,
    tasks: a.tasks.length >= b.tasks.length ? a.tasks : b.tasks,
    streak: a.streak.count >= b.streak.count ? a.streak : b.streak,
    schedule: { ...b.schedule, ...a.schedule }
  };
}

function openIdb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  return new Promise(resolve => {
    try {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function idbSet(key: string, value: string): Promise<void> {
  const db = await openIdb();
  if (!db) return;
  try {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).put(value, key);
  } catch {
    /* ignore */
  }
}

export function bumpStreak(p: Progress, today: string): Progress {
  const streak = { ...p.streak };
  if (streak.lastLocalDay === today) return { ...p, streak };
  const yesterday = addDays(today, -1);
  if (streak.lastLocalDay === yesterday) streak.count += 1;
  else streak.count = 1;
  if (streak.count > streak.longest) streak.longest = streak.count;
  streak.lastLocalDay = today;
  return { ...p, streak };
}

function xpForKind(kind: ItemKind): number {
  switch (kind) {
    case 'reading':
      return 1;
    case 'assignment':
      return 2;
    case 'quiz':
      return 5;
    case 'project':
    case 'essay':
      return 8;
    case 'exam':
      return 15;
    default:
      return 1;
  }
}

function award(p: Progress, id: string): Progress {
  if (p.badges.includes(id)) return p;
  if (!BADGE_CATALOG.some(b => b.id === id)) return p;
  return { ...p, badges: [...p.badges, id] };
}

export function enroll(p: Progress, courseId: string, today: string): Progress {
  if (p.enrolled.includes(courseId)) {
    return { ...p, activeCourseId: courseId };
  }
  const next: Progress = {
    ...p,
    enrolled: [...p.enrolled, courseId],
    enrolledAt: { ...p.enrolledAt, [courseId]: Date.now() },
    activeCourseId: courseId
  };
  return adjustSchedule(next, today);
}

export function itemComplete(p: Progress, itemId: string): boolean {
  return Boolean(p.completed[itemId]);
}

export function completeItem(
  p: Progress,
  itemId: string,
  kind: ItemKind,
  today: string,
  at: Date = new Date()
): Progress {
  if (p.completed[itemId]) return p;
  const fails = p.attempts[itemId] || 0;
  let xp = p.xp + xpForKind(kind);
  if (fails >= 1) xp += 3;
  if (kind === 'exam' && (p.failedExamSittings[itemId] || 0) >= 3) xp += 10;

  let next: Progress = bumpStreak(
    {
      ...p,
      completed: {
        ...p.completed,
        [itemId]: { at: at.getTime(), kind, attempts: fails + 1 }
      },
      xp
    },
    today
  );

  if (kind === 'reading') next = award(next, 'first-lesson');
  if (kind === 'quiz') next = award(next, 'first-quiz');
  if (kind === 'essay') next = award(next, 'essay-desk');
  if (kind === 'exam' && (p.failedExamSittings[itemId] || 0) >= 3) next = award(next, 'exam-overcome');

  const hour = at.getHours();
  if (hour < 8) next = award(next, 'early-riser');
  if (hour >= 20) next = award(next, 'night-scholar');

  if (next.streak.count >= 7) next = award(next, 'streak-7');
  if (next.streak.count >= 30) next = award(next, 'streak-30');
  if (next.numericPasses >= 10) next = award(next, 'calc-hand');

  next = maybeUnitAndCourse(next, itemId);
  return next;
}

function maybeUnitAndCourse(p: Progress, itemId: string): Progress {
  const item = getItem(itemId);
  if (!item) return p;
  let next = p;
  for (const courseId of p.enrolled) {
    const course = getCourse(courseId);
    if (!course) continue;
    for (const unit of course.units) {
      const unitItems = unit.lessons.flatMap(l => l.items);
      if (!unitItems.includes(itemId)) continue;
      if (unitItems.every(id => next.completed[id])) next = award(next, 'first-unit');
    }
    const ids = allItemIds(course);
    if (ids.length && ids.every(id => next.completed[id])) next = award(next, 'first-course');
  }
  return next;
}

export function recordAttempt(p: Progress, itemId: string): Progress {
  const n = (p.attempts[itemId] || 0) + 1;
  return { ...p, attempts: { ...p.attempts, [itemId]: n } };
}

export function recordExamSitting(p: Progress, itemId: string, passed: boolean): Progress {
  if (passed) return p;
  const n = (p.failedExamSittings[itemId] || 0) + 1;
  let next: Progress = { ...p, failedExamSittings: { ...p.failedExamSittings, [itemId]: n } };
  if (n >= 3) next = award(next, 'exam-persistence');
  return next;
}

export function markQuestion(p: Progress, questionId: string, pass: boolean, numeric: boolean): Progress {
  if (p.questionPass[questionId]) return p;
  if (!pass) return p;
  return {
    ...p,
    questionPass: { ...p.questionPass, [questionId]: true },
    numericPasses: p.numericPasses + (numeric ? 1 : 0)
  };
}

export function adjustSchedule(p: Progress, today: string): Progress {
  const schedule: Record<string, string> = { ...p.schedule };
  for (const courseId of p.enrolled) {
    const course = getCourse(courseId);
    if (!course) continue;
    const lessons = allLessonIds(course);
    const remaining = lessons.filter(lid => {
      const loc = course.units.flatMap(u => u.lessons).find(l => l.id === lid);
      if (!loc) return false;
      return loc.items.some(id => !p.completed[id]);
    });
    remaining.forEach((lid, i) => {
      schedule[lid] = addDays(today, i);
    });
  }
  return { ...p, schedule };
}

export function suggestedToday(p: Progress, today: string): string[] {
  const out: string[] = [];
  for (const [lessonId, day] of Object.entries(p.schedule)) {
    if (day <= today) out.push(lessonId);
  }
  return out.filter(lid => {
    for (const courseId of p.enrolled) {
      const course = getCourse(courseId);
      if (!course) continue;
      for (const u of course.units) {
        const l = u.lessons.find(x => x.id === lid);
        if (l && l.items.some(id => !p.completed[id])) return true;
      }
    }
    return false;
  });
}

export function unitProgress(courseId: string, unitId: string, p: Progress): { done: number; total: number } {
  const course = getCourse(courseId);
  const unit = course?.units.find(u => u.id === unitId);
  const items = unit ? unit.lessons.flatMap(l => l.items) : [];
  const done = items.filter(id => p.completed[id]).length;
  return { done, total: items.length };
}
