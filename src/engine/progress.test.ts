import { describe, expect, it } from 'vitest';
import {
  adjustSchedule,
  bumpStreak,
  completeItem,
  emptyProgress,
  enroll,
  recordAttempt,
  recordExamSitting,
  suggestedToday
} from './progress';

describe('progress', () => {
  it('streak: same day no double, next day +1, gap resets count', () => {
    let p = emptyProgress('t');
    p = bumpStreak(p, '2026-09-13');
    expect(p.streak.count).toBe(1);
    p = bumpStreak(p, '2026-09-13');
    expect(p.streak.count).toBe(1);
    p = bumpStreak(p, '2026-09-14');
    expect(p.streak.count).toBe(2);
    p = bumpStreak(p, '2026-09-16');
    expect(p.streak.count).toBe(1);
    expect(p.streak.longest).toBe(2);
  });

  it('XP is the same on first pass; bonus only after failure', () => {
    let a = emptyProgress('t');
    a = completeItem(a, 'r1', 'reading', '2026-09-13');
    expect(a.xp).toBe(1);
    a = completeItem(a, 'r1', 'reading', '2026-09-13');
    expect(a.xp).toBe(1);

    let b = emptyProgress('t');
    b = recordAttempt(b, 'q1');
    b = completeItem(b, 'q1', 'quiz', '2026-09-13');
    expect(b.xp).toBe(5 + 3);
  });

  it('exam persistence and overcome badges', () => {
    let p = emptyProgress('t');
    p = recordExamSitting(p, 'ex1', false);
    p = recordExamSitting(p, 'ex1', false);
    expect(p.badges.includes('exam-persistence')).toBe(false);
    p = recordExamSitting(p, 'ex1', false);
    expect(p.badges.includes('exam-persistence')).toBe(true);
    p = recordAttempt(p, 'ex1');
    p = recordAttempt(p, 'ex1');
    p = recordAttempt(p, 'ex1');
    p = recordAttempt(p, 'ex1');
    p = completeItem(p, 'ex1', 'exam', '2026-09-13', new Date('2026-09-13T10:00:00'));
    expect(p.badges.includes('exam-overcome')).toBe(true);
  });

  it('early riser vs night scholar from clock hour', () => {
    let p = emptyProgress('t');
    p = recordAttempt(p, 'r');
    p = completeItem(p, 'r', 'reading', '2026-09-13', new Date('2026-09-13T06:30:00'));
    expect(p.badges.includes('early-riser')).toBe(true);

    let n = emptyProgress('t');
    n = recordAttempt(n, 'r');
    n = completeItem(n, 'r', 'reading', '2026-09-13', new Date('2026-09-13T21:00:00'));
    expect(n.badges.includes('night-scholar')).toBe(true);
  });

  it('schedule shifts remaining lessons to today — no overdue mark', () => {
    let p = emptyProgress('t');
    p = enroll(p, 'math-calc-1', '2026-09-01');
    p = adjustSchedule(p, '2026-09-13');
    const today = suggestedToday(p, '2026-09-13');
    expect(today.length).toBeGreaterThan(0);
    expect(p.schedule[today[0]]).toBe('2026-09-13');
  });
});
