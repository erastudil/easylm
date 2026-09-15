/* generated unified test suite for easyLM engine — consolidated under tests/ per 5S law */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

import {
  tokenizeText,
  inferCategoryFromText,
  migrateLegacyEntries,
  addProfileAtom,
  getProfileAtoms,
  updateProfileAtom,
  deleteProfileAtom,
  clearProfileAtoms,
  calculateAtomRelevance,
  getAttentivePromptEnvelope,
  resetAtMemCache,
  saveAllAtoms,
  AtMemAtom
} from '../src/engine/atmem';
import { chapterExists, listCourses, studioStatusLine } from '../src/engine/course';
import { ANSWER_KEYS } from '../src/data/answers_compiled';
import { COURSE_PACKS, PUBLIC_ITEMS } from '../src/data/courses_compiled';
import {
  isVaultEncrypted,
  isVaultUnlocked,
  enableVaultEncryption,
  unlockVault,
  lockVault,
  disableVaultEncryption,
  encryptPayload,
  decryptPayload,
  getVaultMeta
} from '../src/engine/crypto_vault';
import {
  stripMarkdown,
  markdownTableToCsv,
  markdownToLatex,
  generateAcademicHtml,
  sanitizeFilename
} from '../src/engine/export';
import { hashParentalPin } from '../src/engine/family';
import { gradeQuestion } from '../src/engine/grade';
import { dispatchTool } from '../src/engine/tools';
import { isKidAllowedTool } from '../src/engine/kid_tools';
import { dueCards, reviewCard, upsertMiss } from '../src/engine/leitner';
import { renderMarkdownSafe } from '../src/engine/markdown';
import { execMath } from '../src/engine/math';
import { allowedOrigin } from '../src/engine/origin';
import {
  clampPersonalityIdForRole,
  getPersonalitiesForRole,
  isKidSafePersonality,
  PERSONALITIES
} from '../src/data/personalities';
import { evalFx, sampleFunction, generatePlotSvg } from '../src/engine/plot';
import { clockQueryOf, mathExpressionOf, unitConversionOf, stacksQueryOf } from '../src/engine/preflight';
import {
  adjustSchedule,
  bumpStreak,
  completeItem,
  emptyProgress,
  enroll,
  recordAttempt,
  recordExamSitting,
  suggestedToday
} from '../src/engine/progress';
import {
  hostLooksPrivate,
  hostnameIsBlocked,
  isPrivateIP,
  isWhitelistedHost,
  isWikiHost,
  parsePublicHttpsUrl,
  VETTED_WHITELIST_ROOTS
} from '../src/engine/ssrf';
import {
  execStacks,
  extractDoors,
  splitChapters,
  stacksStats
} from '../src/engine/stacks';
import { STACKS_PACKS } from '../src/data/stacks_compiled';
import { Session } from '../src/types';
import { classifySessionLake, buildTriLakeExport, sanitizeSession, analyzeTriLakePatterns } from '../src/engine/storage';
import { execUnits } from '../src/engine/tools';
import {
  initZcabsNonce,
  getZcabsCheckTarget,
  resetZcabsNonce,
  generateZcabsCanaryPrompt,
  execZcabsCanary,
  verifyZcabsInvariant
} from '../src/engine/zcabs';
import {
  isEngineAlive,
  isEngineReady,
  unloadActiveEngine,
  getLoadedModelId,
  patchWebGPUAdapterFallback
} from '../src/engine/webllm';

describe('EasyLM Engine Unified Test Suite', () => {
  describe('atmem', () => {
describe('AtMem Engine', () => {
  beforeEach(() => {
    resetAtMemCache();
    saveAllAtoms([]);
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  describe('Tokenization & Category Inference', () => {
    it('normalizes tokens and filters out stop words', () => {
      const tokens = tokenizeText('What is the rate of change in calculus?');
      expect(tokens).toContain('rate');
      expect(tokens).toContain('change');
      expect(tokens).toContain('calculus');
      expect(tokens).not.toContain('what');
      expect(tokens).not.toContain('is');
      expect(tokens).not.toContain('the');
      expect(tokens).not.toContain('of');
      expect(tokens).not.toContain('in');
    });

    it('infers categories accurately from natural language', () => {
      expect(inferCategoryFromText('Never give direct answers to homework')).toBe('rule');
      expect(inferCategoryFromText('Mandate: Socratic guidance only')).toBe('rule');
      expect(inferCategoryFromText('Preparing for AP Biology exam on Friday')).toBe('goal');
      expect(inferCategoryFromText('Prefers concise explanations and runnable code snippets')).toBe('preference');
      expect(inferCategoryFromText('Tri-lake pattern insight: values step-by-step proofs')).toBe('insight');
      expect(inferCategoryFromText('Grade 8 student in Texas')).toBe('fact');
    });

    it('migrates legacy flat memory entries without data loss', () => {
      const legacy = [
        { id: '1', profileId: 'parent', text: 'Prefers bullet points', createdAt: 1000 },
        { id: '2', profileId: 'kid', text: 'Never give answers', createdAt: 2000 }
      ];
      const migrated = migrateLegacyEntries(legacy);
      expect(migrated).toHaveLength(2);
      expect(migrated[0].category).toBe('preference');
      expect(migrated[0].governed).toBe(false);
      expect(migrated[1].category).toBe('rule');
      expect(migrated[1].governed).toBe(true); // kid rule auto-governed
    });
  });

  describe('Profile Context Isolation', () => {
    it('strictly isolates memories between parent and student profiles', () => {
      addProfileAtom('parent', 'Confidential financial planning notes', 'fact', false, 'parent');
      addProfileAtom('kid', 'Studying for 7th grade math quiz', 'goal', false, 'user');

      const parentAtoms = getProfileAtoms('parent');
      const kidAtoms = getProfileAtoms('kid');

      expect(parentAtoms).toHaveLength(1);
      expect(parentAtoms[0].text).toContain('financial');

      expect(kidAtoms).toHaveLength(1);
      expect(kidAtoms[0].text).toContain('math quiz');

      // Kid context must NEVER contain parent atoms
      const kidEnvelope = getAttentivePromptEnvelope('kid', 'finance and money');
      expect(kidEnvelope).not.toContain('financial');
    });
  });

  describe('Attentive Relevance & Token Budget', () => {
    it('prioritizes standing governed rules and query-relevant atoms over irrelevant ones', () => {
      addProfileAtom('kid', 'Socratic tutor mode: ask questions before explaining', 'rule', true, 'parent');
      addProfileAtom('kid', 'Preparing for cellular respiration and photosynthesis exam', 'goal', false, 'user');
      addProfileAtom('kid', 'Has a pet turtle named Shelly', 'fact', false, 'user');
      addProfileAtom('kid', 'Loves chocolate ice cream', 'preference', false, 'user');

      const prompt = 'Can you explain how photosynthesis splits water molecules?';
      const envelope = getAttentivePromptEnvelope('kid', prompt, 256);

      // Standing rule must be present
      expect(envelope).toContain('Standing Rule');
      expect(envelope).toContain('Socratic tutor mode');

      // Query-relevant goal must be present
      expect(envelope).toContain('cellular respiration and photosynthesis');

      // Completely irrelevant facts must NOT be injected
      expect(envelope).not.toContain('pet turtle');
      expect(envelope).not.toContain('chocolate ice cream');
    });

    it('respects tight token budget and does not overflow', () => {
      for (let i = 0; i < 10; i++) {
        addProfileAtom('student', `Relevant study atom number ${i} about physics mechanics velocity acceleration`, 'fact');
      }

      // Very small token budget: 30 tokens (~120 chars)
      const envelope = getAttentivePromptEnvelope('student', 'physics velocity', 30);
      expect(envelope.length).toBeLessThan(350);
    });
  });

  describe('Parental Governance & Sentinel Fences', () => {
    it('blocks deleting or modifying governed mandates without parental authorization', () => {
      const res = addProfileAtom('kid', 'No social media browsing during school hours', 'rule', true, 'parent');
      expect(res.ok).toBe(true);
      const atomId = res.atom!.id;

      // Unauthorized student attempt to delete
      const deleteFail = deleteProfileAtom(atomId, false);
      expect(deleteFail.ok).toBe(false);
      expect(deleteFail.error).toContain('parental PIN');
      expect(getProfileAtoms('kid')).toHaveLength(1);

      // Authorized parent deletion
      const deleteOk = deleteProfileAtom(atomId, true);
      expect(deleteOk.ok).toBe(true);
      expect(getProfileAtoms('kid')).toHaveLength(0);
    });

    it('preserves governed mandates when student clears memories', () => {
      addProfileAtom('kid', 'Governed curfew rule', 'rule', true, 'parent');
      addProfileAtom('kid', 'Temporary science question note', 'fact', false, 'user');

      // Kid tries to clear all
      const clearRes = clearProfileAtoms('kid', false);
      expect(clearRes.clearedCount).toBe(1);
      expect(clearRes.preservedCount).toBe(1);

      const remaining = getProfileAtoms('kid');
      expect(remaining).toHaveLength(1);
      expect(remaining[0].text).toBe('Governed curfew rule');
    });

    it('blocks adding sensitive PII into memory via Sentinel gate', () => {
      const res1 = addProfileAtom('kid', 'My phone number is 555-123-4567');
      expect(res1.ok).toBe(false);
      expect(res1.error).toContain('Internet Safety Sentinel');

      const res2 = addProfileAtom('kid', 'I live at 742 Evergreen Terrace');
      expect(res2.ok).toBe(false);
      expect(res2.error).toContain('Internet Safety Sentinel');
    });
  });
});
  });

  describe('course', () => {
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
  });

  describe('crypto_vault', () => {
if (typeof localStorage === 'undefined') {
  const store = new Map<string, string>();
  (globalThis as any).localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => store.set(k, String(v)),
    removeItem: (k: string) => store.delete(k),
    clear: () => store.clear()
  };
}

describe('crypto_vault', () => {
  beforeEach(() => {
    localStorage.clear();
    lockVault();
  });

  it('starts unencrypted by default', () => {
    expect(isVaultEncrypted()).toBe(false);
    expect(isVaultUnlocked()).toBe(true);
  });

  it('enables vault encryption with 4-digit PIN and locks/unlocks', async () => {
    await enableVaultEncryption('1234', 'pin');
    expect(isVaultEncrypted()).toBe(true);
    expect(isVaultUnlocked()).toBe(true);
    expect(getVaultMeta()?.type).toBe('pin');

    // Encrypt some data
    const secret = JSON.stringify([{ id: 'sess_1', title: 'Top Secret Math Notes' }]);
    const encrypted = await encryptPayload(secret);
    expect(encrypted).toContain('{"v":1,"iv":');
    expect(encrypted).not.toContain('Top Secret Math Notes');

    // Decrypt while unlocked
    const decrypted = await decryptPayload(encrypted);
    expect(decrypted).toBe(secret);

    // Lock vault
    lockVault();
    expect(isVaultUnlocked()).toBe(false);

    // Decrypting while locked returns null
    const lockedAttempt = await decryptPayload(encrypted);
    expect(lockedAttempt).toBeNull();

    // Unlock with wrong PIN fails
    const wrongUnlock = await unlockVault('9999');
    expect(wrongUnlock).toBe(false);
    expect(isVaultUnlocked()).toBe(false);

    // Unlock with correct PIN succeeds
    const rightUnlock = await unlockVault('1234');
    expect(rightUnlock).toBe(true);
    expect(isVaultUnlocked()).toBe(true);

    const decryptedAfterUnlock = await decryptPayload(encrypted);
    expect(decryptedAfterUnlock).toBe(secret);
  });

  it('supports full high-entropy alphanumeric passwords', async () => {
    const password = 'Correct-Horse-Battery-Staple-987654!';
    await enableVaultEncryption(password, 'password');
    expect(isVaultEncrypted()).toBe(true);
    expect(getVaultMeta()?.type).toBe('password');

    const payload = 'Confidential Sovereign Memory';
    const encrypted = await encryptPayload(payload);
    expect(encrypted).not.toContain('Confidential');

    lockVault();
    expect(await unlockVault('wrong-pass')).toBe(false);
    expect(await unlockVault(password)).toBe(true);
    expect(await decryptPayload(encrypted)).toBe(payload);
  });

  it('disables encryption cleanly', async () => {
    await enableVaultEncryption('4321', 'pin');
    expect(isVaultEncrypted()).toBe(true);

    const failDisable = await disableVaultEncryption('wrong');
    expect(failDisable).toBe(false);
    expect(isVaultEncrypted()).toBe(true);

    const successDisable = await disableVaultEncryption('4321');
    expect(successDisable).toBe(true);
    expect(isVaultEncrypted()).toBe(false);
    expect(isVaultUnlocked()).toBe(true);
  });
});
  });

  describe('export', () => {
describe('export engine tests', () => {
  it('strips markdown syntax accurately to clean plain text', () => {
    const md = `# Physics Homework 1
**Force** is defined by Newton's Second Law:
* F = m * a
Here is a formula: \`E = mc^2\`
> Remember units: kg * m / s^2
`;
    const plain = stripMarkdown(md);
    expect(plain).toContain('Physics Homework 1');
    expect(plain).toContain('Force is defined by Newton\'s Second Law');
    expect(plain).toContain('• F = m * a');
    expect(plain).toContain('E = mc^2');
    expect(plain).not.toContain('#');
    expect(plain).not.toContain('**');
    expect(plain).not.toContain('>');
  });

  it('extracts and converts Markdown tables into valid RFC-4180 CSV', () => {
    const tableMd = `
Here is experimental velocity data:

| Time (s) | Velocity (m/s) | Notes |
|---|---|---|
| 0.0 | 0.0 | stationary |
| 1.5 | 4.2 | initial burst, accelerating |
| 3.0 | 8.8 | "constant" push |
`;
    const csv = markdownTableToCsv(tableMd);
    expect(csv).not.toBeNull();
    const lines = csv!.split('\r\n');
    expect(lines[0]).toBe('Time (s),Velocity (m/s),Notes');
    expect(lines[1]).toBe('0.0,0.0,stationary');
    expect(lines[2]).toBe('1.5,4.2,"initial burst, accelerating"');
    expect(lines[3]).toBe('3.0,8.8,"""constant"" push"');
  });

  it('returns null when no markdown table is present', () => {
    const nonTable = 'Just regular paragraph text without tables.';
    expect(markdownTableToCsv(nonTable)).toBeNull();
  });

  it('transforms Markdown into clean LaTeX structure', () => {
    const md = `# Quantum Foundations
## The Schrödinger Equation
The wave function is given by:
\`\`\`python
psi = calculate_wave_function()
\`\`\`
Important note: **wave-particle duality** applies to all matter.`;

    const latex = markdownToLatex(md, {
      title: 'Quantum Mechanics Problem Set',
      author: 'Euler Student',
      subject: 'PHYS 301'
    });

    expect(latex).toContain('\\documentclass[11pt,a4paper]{article}');
    expect(latex).toContain('\\title{Quantum Mechanics Problem Set}');
    expect(latex).toContain('\\author{Euler Student}');
    expect(latex).toContain('\\section{Quantum Foundations}');
    expect(latex).toContain('\\subsection{The Schrödinger Equation}');
    expect(latex).toContain('\\begin{verbatim}');
    expect(latex).toContain('\\textbf{wave-particle duality}');
    expect(latex).toContain('\\end{document}');
  });

  it('generates academic HTML with print styling and metadata header', () => {
    const html = generateAcademicHtml('### Method\nMix reagent A with reagent B.', {
      title: 'Lab Report 4',
      author: 'Marie Curie',
      subject: 'CHEM 202'
    });

    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('Lab Report 4');
    expect(html).toContain('Marie Curie');
    expect(html).toContain('CHEM 202');
    expect(html).toContain('@media print');
    expect(html).toContain('Mix reagent A with reagent B.');
  });

  it('sanitizes filenames safely', () => {
    expect(sanitizeFilename('Physics Lab 01: Kinematics & Vectors!')).toBe('physics_lab_01_kinematics_vectors');
    expect(sanitizeFilename('')).toBe('document');
  });
});
  });

  describe('family.pin', () => {
describe('hashParentalPin', () => {
  it('is not plaintext and verifies with same salt', async () => {
    const rec = await hashParentalPin('1234');
    expect(rec.hash).not.toBe('1234');
    expect(rec.salt.length).toBeGreaterThan(8);
    const again = await hashParentalPin('1234', Uint8Array.from(atob(rec.salt), c => c.charCodeAt(0)), rec.iter);
    expect(again.hash).toBe(rec.hash);
    const other = await hashParentalPin('9999', Uint8Array.from(atob(rec.salt), c => c.charCodeAt(0)), rec.iter);
    expect(other.hash).not.toBe(rec.hash);
  });
});
  });

  describe('grade', () => {
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
  });

  describe('kid_dispatch', () => {
describe('dispatchTool kidSafe', () => {
  it('refuses network tools', async () => {
    const res = await dispatchTool('web_fetch', 'https://example.com', undefined, { kidSafe: true });
    expect(res.isError).toBe(true);
    expect(res.result).toMatch(/network tools are off/i);
  });

  it('refuses dictionary (external dictionaryapi.dev)', async () => {
    const res = await dispatchTool('dictionary', 'serendipity', undefined, { kidSafe: true });
    expect(res.isError).toBe(true);
    expect(res.result).toMatch(/network tools are off/i);
  });

  it('still runs units', async () => {
    const res = await dispatchTool('units', '10 kg to lbs', undefined, { kidSafe: true });
    expect(res.isError).toBe(false);
    expect(res.result).toMatch(/lbs/);
  });

  it('runs local studio status', async () => {
    const res = await dispatchTool('studio', 'list', undefined, { kidSafe: true });
    expect(res.isError).toBe(false);
    expect(res.result).toMatch(/Studio catalog/i);
    expect(res.result.toLowerCase()).not.toMatch(/"answer"/);
  });

  it('runs local zcabs canary tool', async () => {
    const res = await dispatchTool('zcabs', 'check', undefined, { kidSafe: true });
    expect(res.isError).toBe(false);
    expect(res.result).toMatch(/CANARY_OBSERVED/);
  });
});

describe('dispatchTool unknown name', () => {
  it('does not fall through to web search', async () => {
    const res = await dispatchTool('not_a_real_tool', 'https://example.com');
    expect(res.isError).toBe(true);
    expect(res.result).toMatch(/Unknown tool/i);
  });
});
  });

  describe('kid_tools', () => {
describe('isKidAllowedTool', () => {
  it('allows local hands', () => {
    expect(isKidAllowedTool('calc')).toBe(true);
    expect(isKidAllowedTool('units')).toBe(true);
    expect(isKidAllowedTool('clock')).toBe(true);
    expect(isKidAllowedTool('stacks')).toBe(true);
    expect(isKidAllowedTool('studio')).toBe(true);
  });

  it('blocks network hands including dictionary (external API)', () => {
    expect(isKidAllowedTool('dictionary')).toBe(false);
    expect(isKidAllowedTool('define')).toBe(false);
    expect(isKidAllowedTool('web_fetch')).toBe(false);
    expect(isKidAllowedTool('web_search')).toBe(false);
    expect(isKidAllowedTool('weather')).toBe(false);
    expect(isKidAllowedTool('exchange')).toBe(false);
    expect(isKidAllowedTool('fact')).toBe(false);
    expect(isKidAllowedTool('browse')).toBe(false);
  });
});
  });

  describe('leitner', () => {
describe('leitner', () => {
  it('misses start in box 1 and are due today', () => {
    const cards = upsertMiss([], 'quiz1', 'q1', 'What is 2+2?', '2026-09-13');
    expect(cards[0].box).toBe(1);
    expect(dueCards(cards, '2026-09-13').length).toBe(1);
  });

  it('pass moves box up; fail returns to 1', () => {
    let card = upsertMiss([], 'quiz1', 'q1', 'p', '2026-09-13')[0];
    card = reviewCard(card, true, '2026-09-13');
    expect(card.box).toBe(2);
    expect(card.dueDay).toBe('2026-09-14');
    card = reviewCard(card, false, '2026-09-14');
    expect(card.box).toBe(1);
  });
});
  });

  describe('markdown', () => {
describe('renderMarkdownSafe', () => {
  it('strips script and onerror', () => {
    const html = renderMarkdownSafe('<img src=x onerror="alert(1)"><script>alert(1)</script>Hello');
    expect(html.toLowerCase()).not.toContain('onerror');
    expect(html.toLowerCase()).not.toContain('<script');
    expect(html.toLowerCase()).not.toContain('javascript:');
  });

  it('keeps normal markdown', () => {
    const html = renderMarkdownSafe('**bold** and a [link](https://example.com)');
    expect(html).toContain('<strong>');
    expect(html).toContain('example.com');
  });

  it('preserves mathematical subtraction and multiplication without converting to lists', () => {
    const raw = 'The formula is 10 - 2 = 8 and 5 * 4 = 20 or sqrt(144) * 5200.';
    const html = renderMarkdownSafe(raw);
    expect(html).not.toContain('<li>2 = 8');
    expect(html).not.toContain('<li>4 = 20');
    expect(html).toContain('10 - 2 = 8');
    expect(html).toContain('5 * 4 = 20');
  });

  it('renders display math expressions in rectangular objective math boxes', () => {
    const raw = 'Here is the formula:\n\n$$E = mc^2$$\n\nEnd of calculation.';
    const html = renderMarkdownSafe(raw);
    expect(html).toContain('class="math-box"');
    expect(html).toContain('DETERMINISTIC MATH');
    expect(html).toContain('E = mc^2');
  });

  it('renders fenced math code blocks in rectangular objective math boxes', () => {
    const raw = 'Calculation:\n\n```calc\nsqrt(144) * 5200 = 62400\n```';
    const html = renderMarkdownSafe(raw);
    expect(html).toContain('class="math-box"');
    expect(html).toContain('DETERMINISTIC MATH');
    expect(html).toContain('sqrt(144) * 5200 = 62400');
  });

  it('renders LaTeX display formulas and fractions with KaTeX', () => {
    const raw = 'Bayes Rule:\n\n$$P(H \\mid E) = \\frac{P(E \\mid H) P(H)}{P(E)}$$';
    const html = renderMarkdownSafe(raw);
    expect(html).toContain('class="math-box"');
    expect(html).toContain('class="katex"');
    expect(html).toContain('mfrac');
  });

  it('renders inline math and preserves currency dollar signs', () => {
    const raw = 'The threshold is $p < 0.05$ and the fee was $100 for $200 items.';
    const html = renderMarkdownSafe(raw);
    expect(html).toContain('class="katex"');
    expect(html).toContain('$100');
    expect(html).toContain('$200');
  });
});
  });

  describe('math', () => {
describe('execMath', () => {
  it('evaluates the empty-canvas chip', () => {
    const res = execMath('sqrt(144) * (50 + 2)');
    expect(res.ok).toBe(true);
    expect(res.result).toBe('624');
  });

  it('accepts scientific notation', () => {
    const res = execMath('1e10');
    expect(res.ok).toBe(true);
    expect(Number(res.result)).toBe(1e10);
  });

  it('nests sqrt', () => {
    const res = execMath('sqrt(sqrt(16))');
    expect(res.ok).toBe(true);
    expect(Number(res.result)).toBe(2);
  });

  it('rejects constructor / proto / eval', () => {
    expect(execMath('constructor').ok).toBe(false);
    expect(execMath('__proto__').ok).toBe(false);
    expect(execMath('eval(1)').ok).toBe(false);
  });
});
  });

  describe('origin', () => {
describe('allowedOrigin', () => {
  it('allows prod and local vite, rejects *', () => {
    expect(allowedOrigin('https://easylm.vercel.app')).toBe('https://easylm.vercel.app');
    expect(allowedOrigin('http://localhost:5175')).toBe('http://localhost:5175');
    expect(allowedOrigin('https://evil.example')).toBe(null);
    expect(allowedOrigin('*')).toBe(null);
  });

  it('rejects easylm-prefixed vercel apps that are not this project', () => {
    expect(allowedOrigin('https://easylm-attacker.vercel.app')).toBe(null);
    expect(allowedOrigin('https://easylm-git-main-evil.vercel.app')).toBe(null);
    expect(allowedOrigin('https://not-easylm.vercel.app')).toBe(null);
  });

  it('verifies vercel.json CSP contains unsafe-eval and worker blob support for Studio Sandbox', () => {
    const vercelPath = path.resolve(__dirname, '../vercel.json');
    const vercelJson = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
    const cspHeader = vercelJson.headers[0].headers.find((h: any) => h.key === 'Content-Security-Policy');
    expect(cspHeader).toBeDefined();
    expect(cspHeader.value).toContain("'unsafe-eval'");
    expect(cspHeader.value).toContain("'wasm-unsafe-eval'");
    expect(cspHeader.value).toContain("worker-src 'self' blob:");
  });
});
  });

  describe('personalities.kidsafe', () => {
describe('kid-safe personality gallery fence', () => {
  it('marks only socratic_kid as kid-safe', () => {
    expect(isKidSafePersonality('socratic_kid')).toBe(true);
    expect(isKidSafePersonality('friendly')).toBe(false);
    expect(isKidSafePersonality('ahab')).toBe(false);
    expect(isKidSafePersonality('custom')).toBe(false);
  });

  it('kid gallery exposes only kid-safe voices', () => {
    const gallery = getPersonalitiesForRole('kid');
    expect(gallery.length).toBeGreaterThan(0);
    expect(gallery.every(p => p.id === 'socratic_kid')).toBe(true);
  });

  it('clamps adult voices to socratic_kid under kid role', () => {
    expect(clampPersonalityIdForRole('ahab', 'kid')).toBe('socratic_kid');
    expect(clampPersonalityIdForRole('socratic_kid', 'kid')).toBe('socratic_kid');
    expect(clampPersonalityIdForRole('ahab', 'parent')).toBe('ahab');
    expect(clampPersonalityIdForRole('hypatia', 'kid')).toBe('socratic_kid');
    expect(clampPersonalityIdForRole('curie', 'kid')).toBe('socratic_kid');
  });

  it('contains valid and unique IDs across all gallery personalities', () => {
    const ids = PERSONALITIES.map(p => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);

    for (const p of PERSONALITIES) {
      expect(p.id).toBeTruthy();
      expect(p.name).toBeTruthy();
      expect(p.avatar).toBeTruthy();
      expect(p.badge).toBeTruthy();
      expect(p.category).toBeTruthy();
      expect(p.description).toBeTruthy();
      if (p.id !== 'custom') {
        expect(p.systemPrompt.length).toBeGreaterThan(100);
      }
    }
  });

  it('includes seated women thinkers from the Council of Kami across categories', () => {
    const kamiVoices = [
      'hypatia',
      'arendt',
      'jacobs',
      'bell_hooks',
      'elizabeth_i',
      'hatshepsut',
      'catherine_the_great',
      'goldman',
      'curie',
      'hopper',
      'meadows',
      'leguin',
      'butler',
      'athena'
    ];

    for (const id of kamiVoices) {
      const found = PERSONALITIES.find(p => p.id === id);
      expect(found, `Expected personality ${id} to exist`).toBeDefined();
    }

    // Verify category distribution
    const philosophyVoices = PERSONALITIES.filter(p => p.category === 'philosophy').map(p => p.id);
    expect(philosophyVoices).toContain('hypatia');
    expect(philosophyVoices).toContain('arendt');
    expect(philosophyVoices).toContain('jacobs');
    expect(philosophyVoices).toContain('bell_hooks');
    expect(philosophyVoices).toContain('elizabeth_i');
    expect(philosophyVoices).toContain('hatshepsut');
    expect(philosophyVoices).toContain('catherine_the_great');
    expect(philosophyVoices).toContain('goldman');

    const scienceVoices = PERSONALITIES.filter(p => p.category === 'science').map(p => p.id);
    expect(scienceVoices).toContain('curie');
    expect(scienceVoices).toContain('hopper');
    expect(scienceVoices).toContain('meadows');
    expect(scienceVoices).toContain('lovelace');

    const literatureVoices = PERSONALITIES.filter(p => p.category === 'literature').map(p => p.id);
    expect(literatureVoices).toContain('leguin');
    expect(literatureVoices).toContain('butler');
    expect(literatureVoices).toContain('austen');
    expect(literatureVoices).toContain('shelley');

    const characterVoices = PERSONALITIES.filter(p => p.category === 'characters').map(p => p.id);
    expect(characterVoices).toContain('athena');
  });

  it('includes classical defenses of monarchy and statecraft (Confucius, Han Feizi, Hobbes)', () => {
    const thinkers = ['confucius', 'han_feizi', 'hobbes'];
    for (const id of thinkers) {
      const p = PERSONALITIES.find(item => item.id === id);
      expect(p, `Expected ${id} to exist`).toBeDefined();
      expect(p?.category).toBe('philosophy');
      expect(p?.systemPrompt.length).toBeGreaterThan(100);
    }
  });
});
  });

  describe('plot', () => {
describe('plot engine tests', () => {
  it('evaluates single variable functions accurately', () => {
    expect(evalFx('x^2', 3)).toBe(9);
    expect(evalFx('2*x + 1', 4)).toBe(9);
    expect(evalFx('sqrt(x)', 16)).toBe(4);
    expect(evalFx('abs(x)', -5)).toBe(5);
  });

  it('samples functions across domain with bounds', () => {
    const samples = sampleFunction('x^2 - 4', -5, 5, 21);
    expect(samples.length).toBe(21);
    expect(samples[0].x).toBe(-5);
    expect(samples[0].y).toBe(21);
    expect(samples[10].x).toBe(0);
    expect(samples[10].y).toBe(-4);
  });

  it('generates SVG vector graphic containing path and axis elements', () => {
    const svg = generatePlotSvg({
      fn: 'sin(x)',
      xMin: -3.14,
      xMax: 3.14,
      title: 'Sine Wave Test'
    });

    expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('Sine Wave Test');
    expect(svg).toContain('<path d="M');
    expect(svg).toContain('stroke="#8b5cf6"');
  });

  it('renders discrete data points when provided', () => {
    const svg = generatePlotSvg({
      points: [
        { x: 1, y: 2, label: 'P1' },
        { x: 3, y: 8, label: 'P2' }
      ],
      title: 'Scatter Test'
    });

    expect(svg).toContain('<circle cx="');
    expect(svg).toContain('P1');
    expect(svg).toContain('P2');
  });
});
  });

  describe('preflight', () => {
describe('preflight chips', () => {
  it('hits math chip without a verb', () => {
    expect(mathExpressionOf('sqrt(144) * (50 + 2)')).toBe('sqrt(144) * (50 + 2)');
  });

  it('hits unit chip including km/h', () => {
    expect(unitConversionOf('100 km/h to mph')).toBe('100 km/h to mph');
    expect(unitConversionOf('100 km to miles')).toBe('100 km to miles');
  });

  it('hits Tokyo clock chip', () => {
    expect(clockQueryOf('What time is it in Tokyo right now?')).toBe('Tokyo');
  });

  it('hits Dewey 510 chip', () => {
    expect(stacksQueryOf('What does Dewey 510 cover in mathematics?')).toBe('510');
  });
});
  });

  describe('progress', () => {
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
  });

  describe('search', () => {
describe('Vetted Whitelist Hosts', () => {
  it('covers all major public real-time data and open-source science domains', () => {
    // Real-Time Sports
    expect(isWhitelistedHost('site.api.espn.com')).toBe(true);
    expect(isWhitelistedHost('espn.com')).toBe(true);

    // Real-Time Finance
    expect(isWhitelistedHost('query1.finance.yahoo.com')).toBe(true);
    expect(isWhitelistedHost('finance.yahoo.com')).toBe(true);
    expect(isWhitelistedHost('stooq.com')).toBe(true);
    expect(isWhitelistedHost('data.sec.gov')).toBe(true);

    // Real-Time News RSS
    expect(isWhitelistedHost('news.google.com')).toBe(true);
    expect(isWhitelistedHost('feeds.bbci.co.uk')).toBe(true);
    expect(isWhitelistedHost('feeds.npr.org')).toBe(true);

    // Qwen Open Data Survey Portals
    expect(isWhitelistedHost('physics.nist.gov')).toBe(true);
    expect(isWhitelistedHost('webbook.nist.gov')).toBe(true);
    expect(isWhitelistedHost('pubchem.ncbi.nlm.nih.gov')).toBe(true);
    expect(isWhitelistedHost('api.census.gov')).toBe(true);
    expect(isWhitelistedHost('govinfo.gov')).toBe(true);
    expect(isWhitelistedHost('uscode.house.gov')).toBe(true);
    expect(isWhitelistedHost('conceptnet.io')).toBe(true);
    expect(isWhitelistedHost('wikidata.org')).toBe(true);
    expect(isWhitelistedHost('dbpedia.org')).toBe(true);
    expect(isWhitelistedHost('openstreetmap.org')).toBe(true);
    expect(isWhitelistedHost('arxiv.org')).toBe(true);
  });

  it('rejects untrusted domains and internal infrastructure', () => {
    expect(isWhitelistedHost('localhost')).toBe(false);
    expect(isWhitelistedHost('metadata.google.internal')).toBe(false);
    expect(isWhitelistedHost('169.254.169.254')).toBe(false);
    expect(isWhitelistedHost('random-unvetted-proxy.com')).toBe(false);
  });

  it('has at least 25 vetted roots', () => {
    expect(VETTED_WHITELIST_ROOTS.length).toBeGreaterThanOrEqual(25);
  });
});
  });

  describe('ssrf', () => {
describe('isPrivateIP', () => {
  it('blocks loopback, RFC1918, link-local, CGNAT, docs', () => {
    expect(isPrivateIP('127.0.0.1')).toBe(true);
    expect(isPrivateIP('10.0.0.1')).toBe(true);
    expect(isPrivateIP('192.168.1.1')).toBe(true);
    expect(isPrivateIP('172.16.0.1')).toBe(true);
    expect(isPrivateIP('169.254.169.254')).toBe(true);
    expect(isPrivateIP('100.64.0.1')).toBe(true);
    expect(isPrivateIP('0.0.0.0')).toBe(true);
    expect(isPrivateIP('::1')).toBe(true);
    expect(isPrivateIP('::ffff:127.0.0.1')).toBe(true);
    expect(isPrivateIP('fc00::1')).toBe(true);
    expect(isPrivateIP('fe80::1')).toBe(true);
    expect(isPrivateIP('fec0::1')).toBe(true);
  });

  it('allows public v4', () => {
    expect(isPrivateIP('1.1.1.1')).toBe(false);
    expect(isPrivateIP('8.8.8.8')).toBe(false);
    expect(isPrivateIP('93.184.216.34')).toBe(false);
  });
});

describe('hostnameIsBlocked / hostLooksPrivate', () => {
  it('blocks localhost names and decimal loopback', () => {
    expect(hostnameIsBlocked('localhost')).toBe(true);
    expect(hostnameIsBlocked('foo.localhost')).toBe(true);
    expect(hostnameIsBlocked('metadata.google.internal')).toBe(true);
    expect(hostLooksPrivate('2130706433')).toBe(true);
    expect(hostLooksPrivate('0x7f000001')).toBe(true);
    expect(hostLooksPrivate('127.0.0.1')).toBe(true);
  });
});

describe('isWikiHost', () => {
  it('suffix-matches, never substring-matches', () => {
    expect(isWikiHost('en.wikipedia.org')).toBe(true);
    expect(isWikiHost('wikipedia.org')).toBe(true);
    expect(isWikiHost('not-wikipedia.org')).toBe(false);
    expect(isWikiHost('wikipedia.org.evil.com')).toBe(false);
  });
});

describe('isWhitelistedHost', () => {
  it('allows safe vetted news, sports, finance, and open data hosts', () => {
    // news & rss
    expect(isWhitelistedHost('news.google.com')).toBe(true);
    expect(isWhitelistedHost('feeds.bbci.co.uk')).toBe(true);
    expect(isWhitelistedHost('feeds.npr.org')).toBe(true);

    // sports & scores
    expect(isWhitelistedHost('site.api.espn.com')).toBe(true);
    expect(isWhitelistedHost('espn.com')).toBe(true);

    // finance & stocks
    expect(isWhitelistedHost('query1.finance.yahoo.com')).toBe(true);
    expect(isWhitelistedHost('finance.yahoo.com')).toBe(true);
    expect(isWhitelistedHost('data.sec.gov')).toBe(true);

    // Qwen open data & metrology
    expect(isWhitelistedHost('physics.nist.gov')).toBe(true);
    expect(isWhitelistedHost('webbook.nist.gov')).toBe(true);
    expect(isWhitelistedHost('pubchem.ncbi.nlm.nih.gov')).toBe(true);
    expect(isWhitelistedHost('api.census.gov')).toBe(true);
    expect(isWhitelistedHost('govinfo.gov')).toBe(true);
    expect(isWhitelistedHost('arxiv.org')).toBe(true);
    expect(isWhitelistedHost('conceptnet.io')).toBe(true);
    expect(isWhitelistedHost('wikidata.org')).toBe(true);
    expect(isWhitelistedHost('api.worldbank.org')).toBe(true);
    expect(isWhitelistedHost('openstax.org')).toBe(true);
    expect(isWhitelistedHost('ocw.mit.edu')).toBe(true);
    expect(isWhitelistedHost('phet.colorado.edu')).toBe(true);
    expect(isWhitelistedHost('libretexts.org')).toBe(true);
  });

  it('rejects arbitrary external hosts and local/private domains', () => {
    expect(isWhitelistedHost('evil.com')).toBe(false);
    expect(isWhitelistedHost('attacker.io')).toBe(false);
    expect(isWhitelistedHost('localhost')).toBe(false);
    expect(isWhitelistedHost('metadata.google.internal')).toBe(false);
  });
});

describe('parsePublicHttpsUrl', () => {
  it('rejects private, file, credentials, odd ports', () => {
    expect(parsePublicHttpsUrl('http://127.0.0.1/').ok).toBe(false);
    expect(parsePublicHttpsUrl('https://localhost/secret').ok).toBe(false);
    expect(parsePublicHttpsUrl('file:///etc/passwd').ok).toBe(false);
    expect(parsePublicHttpsUrl('https://user:pass@example.com/').ok).toBe(false);
    expect(parsePublicHttpsUrl('https://example.com:8443/').ok).toBe(false);
  });

  it('accepts public https and upgrades http', () => {
    const a = parsePublicHttpsUrl('https://example.com/path');
    expect(a.ok).toBe(true);
    if (a.ok) expect(a.url.hostname).toBe('example.com');
    const b = parsePublicHttpsUrl('example.com');
    expect(b.ok).toBe(true);
    if (b.ok) expect(b.url.protocol).toBe('https:');
  });
});
  });

  describe('stacks', () => {
const REQUIRED = [
  'methods', 'computing', 'software', 'ai_ml', 'philosophy', 'psychology',
  'religion', 'sociology', 'civics', 'finance', 'law', 'language', 'math',
  'astronomy', 'physics', 'chemistry', 'earth_sciences', 'security', 'trades', 'biology', 'health',
  'engineering', 'agriculture', 'business', 'art', 'music', 'literature',
  'poetry', 'history', 'geography'
];

describe('The Stacks library', () => {
  it('ships every advertised pack with a textbook and a link index', () => {
    const slugs = STACKS_PACKS.map(p => p.slug);
    expect(slugs.sort()).toEqual([...REQUIRED].sort());
    const stats = stacksStats();
    expect(stats.packs).toBe(30);
    expect(stats.textbooks).toBe(30);
    expect(stats.doors).toBeGreaterThan(200);
  });

  it('textbooks teach in chapters, not Dewey blurbs', () => {
    for (const pack of STACKS_PACKS) {
      const chapters = splitChapters(pack.textbook).filter(c => c.heading !== 'front');
      expect(chapters.length, pack.slug).toBeGreaterThanOrEqual(8);
      expect(pack.textbook.length, pack.slug).toBeGreaterThan(8000);
      expect(pack.textbook, pack.slug).not.toMatch(/\bTODO\b|\bTBD\b|\bFIXME\b|lorem ipsum/i);
      expect(pack.textbook, pack.slug).not.toMatch(/Patrick|aodi\/|pylon|house-mcp|hnai-dev/);
    }
  });

  it('link indexes are official https doors', () => {
    for (const pack of STACKS_PACKS) {
      const doors = extractDoors(pack.links);
      expect(doors.length, pack.slug).toBeGreaterThanOrEqual(8);
      for (const d of doors) {
        expect(d.startsWith('https://'), d).toBe(true);
      }
    }
  });
});

describe('execStacks', () => {
  it('lists packs', () => {
    const list = execStacks('list');
    expect(list).toContain('Dewey 510');
    expect(list).toContain('math');
  });

  it('returns textbook chapters with depth and rigor', () => {
    const popper = execStacks('falsificationism Popper hypothesis');
    expect(popper).toMatch(/Dewey 001/);
    expect(popper.toLowerCase()).toMatch(/falsif/);
    expect(popper.length).toBeGreaterThan(400);

    const turing = execStacks('Turing machine halting');
    expect(turing).toMatch(/Dewey 004/);
    expect(turing).toMatch(/Turing/);

    const thermo = execStacks('thermodynamics entropy');
    expect(thermo).toMatch(/Dewey 530/);
    expect(thermo.toLowerCase()).toMatch(/thermodynamic|entropy/);

    const bayes = execStacks('Bayes theorem probability');
    expect(bayes).toMatch(/Dewey 510/);
    expect(bayes.toLowerCase()).toMatch(/bayes/);

    const attn = execStacks('scaled dot-product attention transformer');
    expect(attn).toMatch(/Dewey 006/);
    expect(attn).toMatch(/Attention/);
  });

  it('attaches official doors to hits', () => {
    const math = execStacks('calculus');
    expect(math).toContain('Official doors');
    expect(math).toContain('https://');
  });

  it('resolves semantic aliases and Dewey numbers', () => {
    const ai = execStacks('ai');
    expect(ai).toMatch(/Dewey 006/);

    const dewey510 = execStacks('Dewey 510');
    expect(dewey510).toMatch(/Dewey 510/);
    expect(dewey510).toMatch(/Mathematics/);

    const econ = execStacks('economics');
    expect(econ).toMatch(/Dewey 330/);
  });

  it('centers excerpts when terms occur in later sections', () => {
    const pearl = execStacks('Directed Acyclic Graphs DAGs Pearl');
    expect(pearl).toMatch(/Dewey 001/);
    expect(pearl).toMatch(/Directed Acyclic Graph/i);
  });

  it('misses cleanly', () => {
    const res = execStacks('xyznonexistentterm123');
    expect(res).toContain('Stacks matches');
  });
});
  });

  describe('storage', () => {
describe('Tri-Lake Memory Classification', () => {
  it('classifies empty or user-only sessions as candidate', () => {
    const s1: Session = {
      id: 's1',
      title: 'Test 1',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: []
    };
    expect(classifySessionLake(s1)).toBe('candidate');

    const s2: Session = {
      id: 's2',
      title: 'Test 2',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [{ id: 'm1', role: 'user', content: 'hello', timestamp: Date.now() }]
    };
    expect(classifySessionLake(s2)).toBe('candidate');
  });

  it('classifies session as approved if assistant reply is approved (thumbs up)', () => {
    const s: Session = {
      id: 's3',
      title: 'Good session',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [
        { id: 'm1', role: 'user', content: 'What is 2+2?', timestamp: Date.now() },
        { id: 'm2', role: 'assistant', content: '4', timestamp: Date.now(), rating: 'approved' }
      ]
    };
    expect(classifySessionLake(s)).toBe('approved');
  });

  it('classifies legacy session with heaven rating as approved', () => {
    const s: Session = {
      id: 's3-legacy',
      title: 'Legacy good session',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [
        { id: 'm1', role: 'user', content: 'What is 2+2?', timestamp: Date.now() },
        { id: 'm2', role: 'assistant', content: '4', timestamp: Date.now(), rating: 'heaven' }
      ]
    };
    expect(classifySessionLake(s)).toBe('approved');
  });

  it('classifies session as rejected if assistant reply is rejected (thumbs down)', () => {
    const s: Session = {
      id: 's4',
      title: 'Bad session',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [
        { id: 'm1', role: 'user', content: 'Calculate', timestamp: Date.now() },
        { id: 'm2', role: 'assistant', content: 'Hallucination', timestamp: Date.now(), rating: 'rejected' }
      ]
    };
    expect(classifySessionLake(s)).toBe('rejected');
  });

  it('classifies legacy session with hell rating as rejected', () => {
    const s: Session = {
      id: 's4-legacy',
      title: 'Legacy bad session',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [
        { id: 'm1', role: 'user', content: 'Calculate', timestamp: Date.now() },
        { id: 'm2', role: 'assistant', content: 'Hallucination', timestamp: Date.now(), rating: 'hell' }
      ]
    };
    expect(classifySessionLake(s)).toBe('rejected');
  });

  it('fails closed to rejected if session has any rejected rating even with approved present', () => {
    const s: Session = {
      id: 's5',
      title: 'Mixed session',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      messages: [
        { id: 'm1', role: 'user', content: 'Q1', timestamp: Date.now() },
        { id: 'm2', role: 'assistant', content: 'A1', timestamp: Date.now(), rating: 'approved' },
        { id: 'm3', role: 'user', content: 'Q2', timestamp: Date.now() },
        { id: 'm4', role: 'assistant', content: 'A2 (bad)', timestamp: Date.now(), rating: 'rejected' }
      ]
    };
    expect(classifySessionLake(s)).toBe('rejected');
  });
});

describe('buildTriLakeExport', () => {
  it('correctly categorizes sessions across approved, candidate, and rejected', () => {
    const sessions: Session[] = [
      {
        id: 's-approved',
        title: 'Approved session',
        createdAt: 100,
        updatedAt: 100,
        messages: [{ id: 'm1', role: 'assistant', content: 'Verified', timestamp: 100, rating: 'approved' }]
      },
      {
        id: 's-candidate',
        title: 'Neutral candidate session',
        createdAt: 200,
        updatedAt: 200,
        messages: [{ id: 'm2', role: 'assistant', content: 'Draft', timestamp: 200, rating: 'neutral' }]
      },
      {
        id: 's-rejected',
        title: 'Rejected session',
        createdAt: 300,
        updatedAt: 300,
        messages: [{ id: 'm3', role: 'assistant', content: 'Failed', timestamp: 300, rating: 'rejected' }]
      }
    ];

    const allExport = buildTriLakeExport(sessions, 'all');
    expect(allExport.counts.total).toBe(3);
    expect(allExport.counts.approved).toBe(1);
    expect(allExport.counts.candidate).toBe(1);
    expect(allExport.counts.rejected).toBe(1);
    expect(allExport.lakes.approved[0].id).toBe('s-approved');
    expect(allExport.lakes.candidate[0].id).toBe('s-candidate');
    expect(allExport.lakes.rejected[0].id).toBe('s-rejected');

    // Backwards-compatibility aliases
    expect(allExport.counts.heaven).toBe(1);
    expect(allExport.counts.purgatory).toBe(1);
    expect(allExport.counts.hell).toBe(1);
    expect(allExport.lakes.heaven?.[0].id).toBe('s-approved');

    const approvedOnly = buildTriLakeExport(sessions, 'approved');
    expect(approvedOnly.lakes.approved.length).toBe(1);
    expect(approvedOnly.lakes.rejected.length).toBe(0);
  });
});

describe('sanitizeSession Tri-Lake rating preservation & normalization', () => {
  it('preserves valid neutral ratings, normalizes legacy ratings, and strips invalid values', () => {
    const raw = {
      id: 'sess-1',
      title: 'Title',
      messages: [
        { id: 'm1', role: 'assistant', content: 'Good', rating: 'approved' },
        { id: 'm2', role: 'assistant', content: 'Bad', rating: 'rejected' },
        { id: 'm3', role: 'assistant', content: 'Neutral', rating: 'neutral' },
        { id: 'm4', role: 'assistant', content: 'Legacy Heaven', rating: 'heaven' },
        { id: 'm5', role: 'assistant', content: 'Legacy Hell', rating: 'hell' },
        { id: 'm6', role: 'assistant', content: 'Bogus', rating: 'invalid_rating' }
      ]
    };

    const sanitized = sanitizeSession(raw);
    expect(sanitized).not.toBeNull();
    expect(sanitized?.messages[0].rating).toBe('approved');
    expect(sanitized?.messages[1].rating).toBe('rejected');
    expect(sanitized?.messages[2].rating).toBe('neutral');
    expect(sanitized?.messages[3].rating).toBe('approved'); // normalized from heaven
    expect(sanitized?.messages[4].rating).toBe('rejected'); // normalized from hell
    expect(sanitized?.messages[5].rating).toBeUndefined();
  });
});

describe('analyzeTriLakePatterns', () => {
  it('handles empty sessions gracefully without adding memories', () => {
    const res = analyzeTriLakePatterns([], 'parent');
    expect(res.totalRated).toBe(0);
    expect(res.insightsAdded).toBe(0);
    expect(res.message).toContain('No rated messages found');
  });

  it('detects concise code preference from approved messages', () => {
    const testSessions: Session[] = [
      {
        id: 's-code',
        title: 'Python session',
        createdAt: 100,
        updatedAt: 100,
        messages: [
          { id: 'm1', role: 'user', content: 'fibonacci', timestamp: 100 },
          {
            id: 'm2',
            role: 'assistant',
            content: 'Here is the function:\n```python\ndef fib(n):\n    return n if n <= 1 else fib(n-1) + fib(n-2)\n```',
            timestamp: 101,
            rating: 'approved'
          }
        ]
      }
    ];

    const res = analyzeTriLakePatterns(testSessions, 'test-profile-1');
    expect(res.totalRated).toBe(1);
    expect(res.approvedCount).toBe(1);
    expect(res.insightsAdded).toBeGreaterThanOrEqual(1);
    expect(res.insights.some(i => i.includes('runnable code') || i.includes('concise'))).toBe(true);
  });

  it('detects sycophancy dislike from rejected messages', () => {
    const testSessions: Session[] = [
      {
        id: 's-hell-apology',
        title: 'Apology session',
        createdAt: 200,
        updatedAt: 200,
        messages: [
          { id: 'm1', role: 'user', content: 'explain gravity', timestamp: 200 },
          {
            id: 'm2',
            role: 'assistant',
            content: 'I apologize, as an AI language model I am sorry for any confusion earlier!',
            timestamp: 201,
            rating: 'rejected'
          }
        ]
      }
    ];

    const res = analyzeTriLakePatterns(testSessions, 'test-profile-2');
    expect(res.rejectedCount).toBe(1);
    expect(res.insights.some(i => i.includes('apologetic'))).toBe(true);
  });
});
  });

  describe('tools.units', () => {
describe('execUnits', () => {
  it('converts known pairs both ways', () => {
    expect(execUnits('3.75 gallons to oz').ok).toBe(true);
    expect(execUnits('100 km to miles').ok).toBe(true);
    expect(execUnits('32 F to C').ok).toBe(true);
    expect(execUnits('10 lbs to kg').ok).toBe(true);
    expect(execUnits('10 kg to lbs').ok).toBe(true);
    const speed = execUnits('100 km/h to mph');
    expect(speed.ok).toBe(true);
    expect(speed.result || '').toMatch(/mph/);
  });

  it('refuses unknown pairs instead of inventing 1:1', () => {
    const res = execUnits('100 furlongs to cubits');
    expect(res.ok).toBe(false);
    expect(res.error || '').toMatch(/No conversion table/);
  });
});

describe('execStacks', () => {
  it('finds textbook chapters by keyword', () => {
    const popper = execStacks('falsificationism Popper');
    expect(popper).toMatch(/Dewey 001|Dewey 100/);
    expect(popper.toLowerCase()).toMatch(/popper|falsif/);
    expect(popper.length).toBeGreaterThan(400);

    const shannon = execStacks('information entropy Shannon');
    expect(shannon).toContain('Dewey 004');
    expect(shannon).toContain('Shannon');

    const physics = execStacks('thermodynamics entropy');
    expect(physics).toContain('Dewey 530');
  });

  it('handles misses with clean fallback notice', () => {
    const res = execStacks('xyznonexistentterm123');
    expect(res).toContain('No Stacks matches');
  });
});
  });

  describe('zcabs', () => {
describe('ZCABS Canary Nonce Engine', () => {
  beforeEach(() => {
    resetZcabsNonce();
  });

  it('randomizes string key and hides the integer nonce from caller', () => {
    const target = initZcabsNonce();
    expect(target.key).toMatch(/^reg_[a-z]+_[0-9a-f]{4}$/);
    expect(target.location).toBe(`/proc/sys/canary/${target.key}`);
    // Nonce integer is hidden, not on target object
    expect((target as any).nonce).toBeUndefined();
  });

  it('generates instruction telling WHERE to check, not WHAT to check for', () => {
    const canary = generateZcabsCanaryPrompt();
    expect(canary.prompt).toContain('ZCABS CANARY CHECK:');
    expect(canary.prompt).toContain(`LOOK: inspect target invariant canary register '${canary.key}'`);
    expect(canary.prompt).toContain("FORMAT: reply with exact integer value observed");
    expect(canary.prompt).toContain("Do NOT guess or hallucinate");

    // Must NOT leak any 5-digit number or solution in the prompt
    const matches = canary.prompt.match(/\b\d{5}\b/g);
    expect(matches).toBeNull();
  });

  it('execZcabsCanary returns observed value when queried with target register', () => {
    const target = getZcabsCheckTarget();
    const res = execZcabsCanary(target.key);
    expect(res.ok).toBe(true);
    expect(res.result).toContain(`CANARY_OBSERVED: ${target.key}=`);

    // Mismatched register returns error
    const badRes = execZcabsCanary('reg_bogus_0000');
    expect(badRes.ok).toBe(false);
    expect(badRes.error).toContain('ZCABS_REGISTER_MISMATCH');
  });

  it('verifyZcabsInvariant passes on observed canary value and fails closed on hallucination', () => {
    const target = getZcabsCheckTarget();
    const toolExec = execZcabsCanary(target.key);
    expect(toolExec.ok).toBe(true);

    // Extract the observed nonce from the tool execution output
    const match = toolExec.result!.match(/=(\d+)/);
    expect(match).not.toBeNull();
    const observedNonce = match![1];

    // Case 1: Agent reports correct observed value -> PASS
    const validOutput = `Based on system inspection, ZCABS_VALUE: ${observedNonce}.`;
    const checkValid = verifyZcabsInvariant(validOutput);
    expect(checkValid.pass).toBe(true);
    expect(checkValid.extracted).toBe(parseInt(observedNonce, 10));

    // Case 2: Agent hallucinates or guesses a different number -> FAIL
    const fakeNonce = observedNonce === '54321' ? '12345' : '54321';
    const fakeOutput = `I think the answer is ZCABS_VALUE: ${fakeNonce}.`;
    const checkFake = verifyZcabsInvariant(fakeOutput);
    expect(checkFake.pass).toBe(false);
    expect(checkFake.reason).toContain('Invariant violation');

    // Case 3: Empty or missing output -> FAIL
    const emptyCheck = verifyZcabsInvariant('No values here.');
    expect(emptyCheck.pass).toBe(false);
  });

  it('resetZcabsNonce generates fresh canary key and resets state', () => {
    const first = resetZcabsNonce();
    const second = resetZcabsNonce();
    // Consecutive resets generate unique random registers
    expect(first.location).not.toBe(second.location);
  });
});
  });

  describe('webllm vitality & disposal detection', () => {
    it('isEngineAlive returns false on null or uninitialized engine', () => {
      expect(isEngineAlive(null)).toBe(false);
      expect(isEngineAlive(undefined as any)).toBe(false);
      expect(isEngineAlive({} as any)).toBe(false);
      expect(isEngineAlive({ loadedModelIdToPipeline: new Map() } as any)).toBe(false);
    });

    it('isEngineAlive detects disposed TVM handles', () => {
      const mockPipeline = {
        decoding: { handle: 0 },
        tvm: { handle: 12345, webGPUContext: { device: {} } }
      };
      const mockEngine = {
        loadedModelIdToPipeline: new Map([['test-model', mockPipeline]])
      };
      expect(isEngineAlive(mockEngine as any, 'test-model')).toBe(false);
    });

    it('isEngineAlive detects lost WebGPU devices', () => {
      const mockPipeline = {
        decoding: { handle: 101 },
        tvm: { handle: 12345, webGPUContext: { device: null } }
      };
      const mockEngine = {
        loadedModelIdToPipeline: new Map([['test-model', mockPipeline]])
      };
      expect(isEngineAlive(mockEngine as any, 'test-model')).toBe(false);
    });

    it('isEngineAlive returns true on healthy active pipeline', () => {
      const mockPipeline = {
        decoding: { handle: 101 },
        tvm: { handle: 12345, webGPUContext: { device: {} } }
      };
      const mockEngine = {
        loadedModelIdToPipeline: new Map([['test-model', mockPipeline]])
      };
      expect(isEngineAlive(mockEngine as any, 'test-model')).toBe(true);
    });

    it('isEngineReady returns false when no engine is resident', () => {
      expect(isEngineReady()).toBe(false);
    });

    it('unloadActiveEngine clears state cleanly', async () => {
      await unloadActiveEngine();
      expect(getLoadedModelId()).toBe('');
      expect(isEngineReady()).toBe(false);
    });

    it('patchWebGPUAdapterFallback gracefully falls back if high-performance adapter returns null', async () => {
      const mockLowPowerAdapter = { name: 'Mock iGPU' };
      const originalGpu = (navigator as any).gpu;
      try {
        (navigator as any).gpu = {
          requestAdapter: async (opts?: any) => {
            if (opts?.powerPreference === 'high-performance') return null;
            if (opts?.powerPreference === 'low-power') return mockLowPowerAdapter;
            return null;
          }
        };

        patchWebGPUAdapterFallback();
        const res = await (navigator as any).gpu.requestAdapter({ powerPreference: 'high-performance' });
        expect(res).toBe(mockLowPowerAdapter);
      } finally {
        (navigator as any).gpu = originalGpu;
      }
    });
  });
});
