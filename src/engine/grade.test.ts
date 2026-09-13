import { describe, expect, it } from 'vitest';
import { gradeQuestion } from './grade';

describe('gradeQuestion', () => {
  it('numeric: exact int and expression', () => {
    expect(gradeQuestion('x-u5-q1', 12).pass).toBe(true);
    expect(gradeQuestion('x-u5-q1', '12').pass).toBe(true);
    expect(gradeQuestion('x-u5-q1', '3*4').pass).toBe(true);
    expect(gradeQuestion('x-u5-q1', 11).pass).toBe(false);
  });

  it('numeric: tolerance on 2/3', () => {
    expect(gradeQuestion('v-u3-q4', 0.666667).pass).toBe(true);
    expect(gradeQuestion('v-u3-q4', 0.67).pass).toBe(true);
    expect(gradeQuestion('v-u3-q4', 0.5).pass).toBe(false);
  });

  it('mc is exact text, case-insensitive', () => {
    expect(gradeQuestion('m-u1-q1', 'falsifiable').pass).toBe(true);
    expect(gradeQuestion('m-u1-q1', 'Falsifiable').pass).toBe(true);
    expect(gradeQuestion('m-u1-q1', 'popular').pass).toBe(false);
  });

  it('short answers normalize whitespace', () => {
    expect(gradeQuestion('m-u1-q3', 'paradigm').pass).toBe(true);
    expect(gradeQuestion('m-u1-q3', '  Paradigm  ').pass).toBe(true);
  });

  it('unknown id fails closed', () => {
    expect(gradeQuestion('no-such-q', '1').pass).toBe(false);
  });
});
