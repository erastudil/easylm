import { execMath } from './math';
import { ANSWER_KEYS, AnswerKey } from '../data/answers_compiled';

export type QuestionType = 'mc' | 'multi' | 'numeric' | 'short';

export interface GradeResult {
  pass: boolean;
  expected?: string;
}

function keyOf(questionId: string): AnswerKey | undefined {
  return ANSWER_KEYS[questionId];
}

function normText(s: string): string {
  return String(s || '')
    .trim()
    .toLowerCase()
    .replace(/['']/g, "'")
    .replace(/\s+/g, ' ');
}

function asList(v: string | number | string[]): string[] {
  if (Array.isArray(v)) return v.map(x => normText(String(x))).filter(Boolean);
  return [normText(String(v))].filter(Boolean);
}

function numericValue(raw: string | number): number | null {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  const s = String(raw).trim();
  if (!s) return null;
  const direct = Number(s);
  if (Number.isFinite(direct) && !/[a-z()^]/.test(s.toLowerCase())) return direct;
  const math = execMath(s);
  if (math.ok && math.result !== undefined) {
    const val = Number(math.result);
    if (Number.isFinite(val)) return val;
  }
  return null;
}

export function gradeQuestion(questionId: string, userAnswer: string | number | string[]): GradeResult {
  const key = keyOf(questionId);
  if (!key) return { pass: false };

  if (key.qtype === 'numeric') {
    const got = numericValue(Array.isArray(userAnswer) ? userAnswer[0] : userAnswer);
    const want = numericValue(key.answer as string | number);
    if (got === null || want === null) return { pass: false };
    const tol = typeof key.tolerance === 'number' ? key.tolerance : 1e-6;
    const scale = Math.max(1, Math.abs(want));
    const pass = Math.abs(got - want) <= tol * scale || Math.abs(got - want) <= tol;
    return { pass };
  }

  if (key.qtype === 'multi') {
    const got = asList(userAnswer).sort();
    const want = asList(key.answer).sort();
    const pass = got.length === want.length && got.every((g, i) => g === want[i]);
    return { pass };
  }

  const got = normText(Array.isArray(userAnswer) ? userAnswer.join(' ') : String(userAnswer));
  const want = normText(String(key.answer));
  return { pass: got === want && got.length > 0 };
}

export function allQuestionsPass(questionIds: string[], answers: Record<string, string | number | string[]>): boolean {
  if (questionIds.length === 0) return false;
  return questionIds.every(id => gradeQuestion(id, answers[id] ?? '').pass);
}
