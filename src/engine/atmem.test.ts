import { describe, it, expect, beforeEach } from 'vitest';
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
} from './atmem';

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
