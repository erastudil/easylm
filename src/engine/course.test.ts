import { describe, expect, it } from 'vitest';
import { COURSE_PACKS, PUBLIC_ITEMS } from '../data/courses_compiled';
import { ANSWER_KEYS } from '../data/answers_compiled';
import { chapterExists, listCourses, studioStatusLine } from './course';

describe('wave 1 courses', () => {
  it('ships seven complete walks', () => {
    const ids = COURSE_PACKS.map(c => c.id).sort();
    expect(ids).toEqual([
      'biology-2e-1',
      'chemistry-2e-1',
      'civics-us-1',
      'health-physio-1',
      'math-calc-1',
      'methods-inquiry-1',
      'physics-college-1'
    ].sort());
    expect(listCourses().length).toBe(7);
  });

  it('each course has ≥8 units, a quiz per unit, midterm, final, 2 essays, 1 project', () => {
    for (const c of COURSE_PACKS) {
      expect(c.units.length, c.id).toBeGreaterThanOrEqual(8);
      const items = c.units.flatMap(u => u.lessons.flatMap(l => l.items)).map(id => PUBLIC_ITEMS[id]);
      const kinds = items.map(i => i.kind);
      expect(kinds.filter(k => k === 'quiz').length, c.id).toBeGreaterThanOrEqual(8);
      expect(kinds.filter(k => k === 'exam').length, c.id).toBeGreaterThanOrEqual(2);
      expect(kinds.filter(k => k === 'essay').length, c.id).toBeGreaterThanOrEqual(2);
      expect(kinds.filter(k => k === 'project').length, c.id).toBeGreaterThanOrEqual(1);
      for (const u of c.units) {
        const uItems = u.lessons.flatMap(l => l.items).map(id => PUBLIC_ITEMS[id]);
        expect(uItems.some(i => i.kind === 'quiz'), `${c.id}/${u.id}`).toBe(true);
      }
    }
  });

  it('readings point at real stack chapters', () => {
    for (const c of COURSE_PACKS) {
      for (const u of c.units) {
        for (const l of u.lessons) {
          expect(chapterExists(l.reading.stack, l.reading.chapter), `${c.id} ${l.reading.chapter}`).toBe(true);
        }
      }
    }
  });

  it('public items do not carry answer keys', () => {
    const dump = JSON.stringify(PUBLIC_ITEMS);
    expect(dump).not.toMatch(/"answer"\s*:/);
    expect(Object.keys(ANSWER_KEYS).length).toBeGreaterThan(200);
  });

  it('studio status never includes keys', () => {
    const line = studioStatusLine({
      enrolled: ['math-calc-1'],
      activeCourseId: 'math-calc-1',
      activeLessonId: 'math-calc-1-u5-l'
    });
    expect(line).toMatch(/Calculus/);
    expect(line.toLowerCase()).not.toMatch(/answer key/);
    expect(line).not.toMatch(/\b12\b.*d\/dx/);
  });
});
