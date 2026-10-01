import { describe, it, expect, beforeEach } from 'vitest';
import {
  addProfileAtom,
  getClientAtoms,
  clearClientAtoms,
  exportClientAtoms,
  getAppointmentPrepEnvelope,
  recordAtMemAudit,
  getAtMemAuditLog,
  clearAtMemAuditLog,
  resetAtMemCache,
  resetAtMemAuditLogCache,
  saveAllAtoms,
  inferCategoryFromText,
  isClinicalCategory
} from '../src/engine/atmem';
import {
  PERSONALITIES,
  saveCustomPersonality,
  loadCustomPersonalities,
  deleteCustomPersonality,
  exportPersonalitiesToJson,
  importPersonalitiesFromJson,
  getAllPersonalities,
  resetCustomPersonalitiesCache,
  ExtendedPersonality
} from '../src/data/personalities';

describe('AtMem Sovereign Privacy Fences & Clinical Workspaces', () => {
  beforeEach(() => {
    resetAtMemCache();
    resetAtMemAuditLogCache();
    saveAllAtoms([]);
    clearAtMemAuditLog();
    resetCustomPersonalitiesCache();
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
  });

  describe('Hard Client Partition Isolation', () => {
    it('strictly isolates clinical atoms between different client workspaces', () => {
      // Practitioner notes for Client A (Alice)
      addProfileAtom('practitioner', 'Client Alice: Reports severe insomnia and panic attacks after job transition', 'session_note', false, 'clinical_practitioner', {
        clientId: 'client_alice',
        contextType: 'clinical'
      });
      addProfileAtom('practitioner', 'Sertraline 50mg daily in the morning', 'medication', false, 'clinical_practitioner', {
        clientId: 'client_alice',
        contextType: 'clinical'
      });

      // Practitioner notes for Client B (Bob)
      addProfileAtom('practitioner', 'Client Bob: Struggles with chronic alcohol relapse triggers at evening social events', 'session_note', false, 'clinical_practitioner', {
        clientId: 'client_bob',
        contextType: 'clinical'
      });
      addProfileAtom('practitioner', 'Naltrexone 50mg prior to high-risk events', 'medication', false, 'clinical_practitioner', {
        clientId: 'client_bob',
        contextType: 'clinical'
      });

      const aliceAtoms = getClientAtoms('client_alice');
      const bobAtoms = getClientAtoms('client_bob');

      expect(aliceAtoms).toHaveLength(2);
      expect(bobAtoms).toHaveLength(2);

      // Verify zero cross-client leakage in raw memory lists
      const aliceTexts = aliceAtoms.map(a => a.text).join(' ');
      const bobTexts = bobAtoms.map(a => a.text).join(' ');

      expect(aliceTexts).toContain('Alice');
      expect(aliceTexts).toContain('insomnia');
      expect(aliceTexts).toContain('Sertraline');
      expect(aliceTexts).not.toContain('Bob');
      expect(aliceTexts).not.toContain('alcohol');
      expect(aliceTexts).not.toContain('Naltrexone');

      expect(bobTexts).toContain('Bob');
      expect(bobTexts).toContain('alcohol');
      expect(bobTexts).toContain('Naltrexone');
      expect(bobTexts).not.toContain('Alice');
      expect(bobTexts).not.toContain('insomnia');
      expect(bobTexts).not.toContain('Sertraline');
    });

    it('generates appointment prep envelope with zero cross-client contamination', () => {
      addProfileAtom('practitioner', 'Patient Alice: History of panic disorder without agoraphobia', 'clinical_history', false, 'clinical_practitioner', {
        clientId: 'client_alice',
        contextType: 'clinical'
      });
      addProfileAtom('practitioner', 'Establish regular sleep schedule and 4-7-8 breathing exercises', 'treatment_goal', false, 'clinical_practitioner', {
        clientId: 'client_alice',
        contextType: 'clinical'
      });

      addProfileAtom('practitioner', 'Patient Bob: Past bipolar I manic episode with hospitalization', 'clinical_history', false, 'clinical_practitioner', {
        clientId: 'client_bob',
        contextType: 'clinical'
      });

      const alicePrep = getAppointmentPrepEnvelope('client_alice', 'sleep routine and breathing');
      expect(alicePrep).toContain('CONFIDENTIAL CLIENT RECORD (client_alice)');
      expect(alicePrep).toContain('panic disorder');
      expect(alicePrep).toContain('sleep schedule');
      expect(alicePrep).not.toContain('Bob');
      expect(alicePrep).not.toContain('bipolar');
      expect(alicePrep).not.toContain('hospitalization');
    });

    it('strictly excludes legacy and unscoped atoms from client partitions', () => {
      // Add general unpartitioned atoms for the profile
      addProfileAtom('practitioner', 'Generic clinical practice rule: always check vitals', 'rule');
      addProfileAtom('practitioner', 'General clinical note: office closed on holidays', 'fact');

      // Add a client-scoped atom
      addProfileAtom('practitioner', 'Specific note for client charlie', 'session_note', false, 'clinical_practitioner', {
        clientId: 'client_charlie',
        contextType: 'clinical'
      });

      const charlieAtoms = getClientAtoms('client_charlie');
      expect(charlieAtoms).toHaveLength(1);
      expect(charlieAtoms[0].text).toContain('Specific note for client charlie');
      expect(charlieAtoms.some(a => a.text.includes('Generic'))).toBe(false);
      expect(charlieAtoms.some(a => a.text.includes('holidays'))).toBe(false);

      // Asking for an empty or invalid clientId must yield 0 atoms
      expect(getClientAtoms('')).toHaveLength(0);
      expect(getClientAtoms('   ')).toHaveLength(0);
      expect(getClientAtoms(undefined as any)).toHaveLength(0);
    });
  });

  describe('Clinical Category Hierarchy & Risk Prioritization', () => {
    it('correctly identifies and classifies clinical categories', () => {
      expect(isClinicalCategory('risk_factor')).toBe(true);
      expect(isClinicalCategory('medication')).toBe(true);
      expect(isClinicalCategory('session_note')).toBe(true);
      expect(isClinicalCategory('treatment_goal')).toBe(true);
      expect(isClinicalCategory('clinical_history')).toBe(true);
      expect(isClinicalCategory('fact')).toBe(false);
      expect(isClinicalCategory('rule')).toBe(false);

      expect(inferCategoryFromText('Risk factor: Passive suicidal ideation without intent or plan')).toBe('risk_factor');
      expect(inferCategoryFromText('Medication prescribed: Escitalopram 10mg daily')).toBe('medication');
      expect(inferCategoryFromText('Session note from 2026-09-15: Discussed boundary setting')).toBe('session_note');
      expect(inferCategoryFromText('Treatment goal: Reduce generalized anxiety inventory score')).toBe('treatment_goal');
      expect(inferCategoryFromText('Clinical history: Diagnosed with major depressive disorder')).toBe('clinical_history');
    });

    it('always prioritizes safety risk factors at the very top of appointment briefings', () => {
      const clientId = 'client_emergency';

      // Add ordinary session notes and trivia
      addProfileAtom('practitioner', 'Client enjoys watercolor painting as a relaxation hobby', 'preference', false, 'user', { clientId });
      addProfileAtom('practitioner', 'Client attended 6 sessions so far with consistent homework compliance', 'fact', false, 'user', { clientId });
      addProfileAtom('practitioner', 'Active safety alert: client reported acute distress and urges to self-harm when isolated', 'risk_factor', false, 'clinical_practitioner', { clientId });
      addProfileAtom('practitioner', 'Escitalopram 20mg PO QAM', 'medication', false, 'clinical_practitioner', { clientId });

      const prep = getAppointmentPrepEnvelope(clientId, 'painting and relaxation', 256);

      // Verify that Risk Alert section appears before medications, goals, and session notes
      const alertIdx = prep.indexOf('⚠️ CLINICAL SAFETY & RISK ALERTS');
      const medIdx = prep.indexOf('💊 CURRENT MEDICATIONS');
      const notesIdx = prep.indexOf('📋 SESSION NOTES');

      expect(alertIdx).toBeGreaterThanOrEqual(0);
      expect(medIdx).toBeGreaterThan(alertIdx);
      expect(notesIdx).toBeGreaterThan(medIdx);
      expect(prep).toContain('urges to self-harm');
    });
  });

  describe('HIPAA Audit Log Controls', () => {
    it('records and retrieves append-only audit events for clinical access', () => {
      addProfileAtom('practitioner', 'Initial intake session completed', 'session_note', false, 'clinical_practitioner', {
        clientId: 'client_hipaa_test',
        contextType: 'clinical'
      });

      getClientAtoms('client_hipaa_test');
      getAppointmentPrepEnvelope('client_hipaa_test');

      const logs = getAtMemAuditLog('client_hipaa_test');
      expect(logs.length).toBeGreaterThanOrEqual(3);

      const actions = logs.map(l => l.action);
      expect(actions).toContain('create');
      expect(actions).toContain('read');
      expect(actions).toContain('retrieve_prep');

      for (const log of logs) {
        expect(log.clientId).toBe('client_hipaa_test');
        expect(typeof log.timestamp).toBe('number');
      }
    });

    it('clears client partition atoms and records clear event in audit trail', () => {
      addProfileAtom('practitioner', 'Session note to be deleted', 'session_note', false, 'clinical_practitioner', {
        clientId: 'client_to_clear',
        contextType: 'clinical'
      });

      expect(getClientAtoms('client_to_clear')).toHaveLength(1);

      const res = clearClientAtoms('client_to_clear');
      expect(res.clearedCount).toBe(1);
      expect(getClientAtoms('client_to_clear')).toHaveLength(0);

      const logs = getAtMemAuditLog('client_to_clear');
      const clearEvent = logs.find(l => l.action === 'clear');
      expect(clearEvent).toBeDefined();
    });

    it('exports client atoms securely as JSON', () => {
      addProfileAtom('practitioner', 'Exportable clinical assessment', 'clinical_history', false, 'clinical_practitioner', {
        clientId: 'client_export_test',
        contextType: 'clinical'
      });

      const exported = exportClientAtoms('client_export_test');
      expect(exported.ok).toBe(true);
      expect(exported.data).toBeDefined();

      const parsed = JSON.parse(exported.data!);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed[0].text).toContain('Exportable clinical assessment');
    });
  });

  describe('Personality Cards: Clinical & Custom Import/Export', () => {
    it('includes built-in clinical companion cards in the gallery', () => {
      const clinicalCards = PERSONALITIES.filter(p => p.category === 'clinical');
      expect(clinicalCards.length).toBe(3);

      const ids = clinicalCards.map(c => c.id);
      expect(ids).toContain('clinical_assistant');
      expect(ids).toContain('reflective_counselor');
      expect(ids).toContain('cbt_guide');
    });

    it('saves, loads, and deletes custom personality cards', () => {
      const customCard: ExtendedPersonality = {
        id: 'custom-dr-beck',
        name: 'Dr. Beck Specialist',
        category: 'clinical',
        avatar: '🧠',
        badge: 'Custom',
        description: 'Specialized clinical supervisor card.',
        systemPrompt: 'You are a clinical supervisor specializing in cognitive schemas.',
        isCustom: true
      };

      saveCustomPersonality(customCard);
      const loaded = loadCustomPersonalities();
      expect(loaded.some(c => c.id === 'custom-dr-beck')).toBe(true);

      const all = getAllPersonalities('parent');
      expect(all.some(c => c.id === 'custom-dr-beck')).toBe(true);

      deleteCustomPersonality('custom-dr-beck');
      expect(loadCustomPersonalities().some(c => c.id === 'custom-dr-beck')).toBe(false);
    });

    it('imports Character Card V2 JSON standard into custom cards', () => {
      const charaCardV2Json = JSON.stringify({
        spec: 'chara_card_v2',
        spec_version: '2.0',
        data: {
          name: 'Mindfulness Coach',
          description: 'A gentle mindfulness and somatic awareness guide.',
          personality: 'Calm, grounding, pauses frequently to invite deep breathing.',
          scenario: 'Quiet meditation room',
          first_mes: 'Welcome. Take a comfortable seat and allow your shoulders to drop.'
        }
      });

      const res = importPersonalitiesFromJson(charaCardV2Json);
      expect(res.imported).toBe(1);
      expect(res.errors).toHaveLength(0);

      const loaded = loadCustomPersonalities();
      const importedCard = loaded.find(c => c.name === 'Mindfulness Coach');
      expect(importedCard).toBeDefined();
      expect(importedCard?.description).toContain('mindfulness');
    });
  });
});
