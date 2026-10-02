/**
 * AtMem (Atomic & Attentive Memory) Engine for EasyLM
 *
 * Architecture & Governance Principles:
 * 1. Greene / Feynman intuition: Memories are discrete, typed atoms (rules, goals, preferences, facts, insights)
 *    rather than monolithic unstructured text dumps.
 * 2. Attentive Retrieval: Only standing rules and top-k query-relevant atoms are injected into the LLM
 *    prompt envelope, respecting a strict token budget (default 256 tokens) to preserve WebGPU context.
 * 3. Strict Profile Isolation: Zero cross-profile context leakage. Student profiles cannot read or access
 *    parent memory atoms.
 * 4. Parental Governance: Parents can pin Governed Mandates that cannot be deleted or modified without
 *    the parental PIN. PII Sentinel prevents accidental retention of sensitive data.
 * 5. 100% In-Browser: Deterministic WebCrypto & pure JS ranking. Compatible with AES-256 Vault Encryption.
 */

import { isVaultEncrypted, isVaultUnlocked, encryptPayload, decryptPayload } from './crypto_vault';
import { detectPII } from './family';

export type AtMemCategory =
  | 'rule'
  | 'goal'
  | 'preference'
  | 'fact'
  | 'insight'
  | 'session_note'
  | 'clinical_history'
  | 'treatment_goal'
  | 'risk_factor'
  | 'medication';

export type AtMemSource = 'user' | 'parent' | 'assistant' | 'tri_lake' | 'clinical_practitioner';

export interface AtMemAtom {
  id: string;
  profileId: string;
  clientId?: string;        // Dedicated client partition for clinical/therapy isolation
  category: AtMemCategory;
  source: AtMemSource;
  text: string;
  governed: boolean;        // true = locked by parental PIN or compliance lock
  confidence: number;      // 0.0 to 1.0
  createdAt: number;
  lastUsedAt?: number;
  expiresAt?: number;      // optional expiration timestamp
  metadata?: Record<string, unknown>; // e.g. sessionDate, severity, practitioner
}

export const CLINICAL_CATEGORIES: AtMemCategory[] = [
  'session_note',
  'clinical_history',
  'treatment_goal',
  'risk_factor',
  'medication'
];

export function isClinicalCategory(cat: AtMemCategory): boolean {
  return CLINICAL_CATEGORIES.includes(cat);
}

export interface AtMemAuditEvent {
  id: string;
  timestamp: number;
  action: 'create' | 'read' | 'retrieve_prep' | 'update' | 'delete' | 'clear' | 'export';
  clientId?: string;
  profileId: string;
  atomId?: string;
  category?: AtMemCategory;
  details?: string;
}

const MEMORY_STORAGE_KEY = 'easylm_sovereign_memory';
const AUDIT_STORAGE_KEY = 'easylm_atmem_audit_log';

let inMemoryCache: AtMemAtom[] | null = null;
let inMemoryAuditLog: AtMemAuditEvent[] | null = null;

export function resetAtMemCache(): void {
  inMemoryCache = null;
  inMemoryAuditLog = null;
}

export function resetAtMemAuditLogCache(): void {
  inMemoryAuditLog = null;
}

export function loadAllAuditEvents(): AtMemAuditEvent[] {
  if (inMemoryAuditLog !== null) return inMemoryAuditLog;
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return [];
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) return [];
    inMemoryAuditLog = JSON.parse(raw);
    return inMemoryAuditLog || [];
  } catch {
    return [];
  }
}

export function recordAtMemAudit(
  event: Omit<AtMemAuditEvent, 'id' | 'timestamp'>
): AtMemAuditEvent {
  const fullEvent: AtMemAuditEvent = {
    ...event,
    id: 'aud-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    timestamp: Date.now()
  };
  const current = loadAllAuditEvents();
  const updated = [...current, fullEvent].slice(-1000);
  inMemoryAuditLog = updated;
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('AtMem: failed to record audit event:', e);
    }
  }
  return fullEvent;
}

export function getAtMemAuditLog(clientId?: string): AtMemAuditEvent[] {
  const all = loadAllAuditEvents();
  if (!clientId) return all;
  return all.filter(e => e.clientId === clientId);
}

export function clearAtMemAuditLog(): void {
  inMemoryAuditLog = [];
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    try {
      localStorage.removeItem(AUDIT_STORAGE_KEY);
    } catch {
      // ignore
    }
  }
}

/**
 * Common English stop words stripped during relevance tokenization
 */
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as',
  'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'could',
  'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had',
  'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how',
  'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself',
  'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours',
  'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than', 'that',
  'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those',
  'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when', 'where',
  'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves'
]);

/**
 * Tokenize text into normalized lowercase alphanumeric tokens without stop words
 */
export function tokenizeText(text: string): string[] {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1 && !STOP_WORDS.has(t));
}

/**
 * Infer category from raw legacy memory string
 */
export function inferCategoryFromText(text: string): AtMemCategory {
  const t = text.toLowerCase().trim();
  if (/^(?:risk|suicid|self-harm|allergy|crisis|danger|alert|warning)\b/i.test(t) || t.includes('risk factor') || t.includes('safety plan')) {
    return 'risk_factor';
  }
  if (/^(?:med|medication|rx|prescription|dose|dosage|mg)\b/i.test(t) || t.includes('prescribed') || t.includes('daily dose')) {
    return 'medication';
  }
  if (/^(?:session|session note|intake|soap|follow-up|appointment)\b/i.test(t) || t.includes('client reported') || t.includes('patient stated')) {
    return 'session_note';
  }
  if (/^(?:treatment goal|clinical goal|intervention target)\b/i.test(t)) {
    return 'treatment_goal';
  }
  if (/^(?:clinical history|diagnosis|past psychiatric|family history)\b/i.test(t) || t.includes('diagnosed with')) {
    return 'clinical_history';
  }
  if (/^(?:rule|never|always|must|mandatory|mandate|tutor mode)\b/i.test(t) || t.includes('never give') || t.includes('never hand over') || t.includes('socratic')) {
    return 'rule';
  }
  if (/^(?:goal|studying|preparing|target|objective)\b/i.test(t) || t.includes('preparing for') || t.includes('exam on') || t.includes('test on')) {
    return 'goal';
  }
  if (/^(?:prefers|values|likes|wants|dislikes|avoids)\b/i.test(t) || t.includes('concise') || t.includes('code snippets') || t.includes('bullet points')) {
    return 'preference';
  }
  if (t.includes('insight') || t.includes('pattern') || t.includes('derived from')) {
    return 'insight';
  }
  return 'fact';
}

/**
 * Migrate legacy MemoryEntry objects to typed AtMemAtom format
 */
export function migrateLegacyEntries(rawList: any[]): AtMemAtom[] {
  if (!Array.isArray(rawList)) return [];
  return rawList.map((entry: any) => {
    if (entry && entry.category && entry.source !== undefined) {
      return entry as AtMemAtom;
    }
    const text = String(entry.text || '').trim();
    const category = inferCategoryFromText(text);
    return {
      id: entry.id || ('atm-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7)),
      profileId: entry.profileId || 'parent',
      clientId: entry.clientId,
      category,
      source: (entry.source as AtMemSource) || 'user',
      text,
      governed: (category === 'rule' && entry.profileId === 'kid') || Boolean(entry.governed),
      confidence: typeof entry.confidence === 'number' ? entry.confidence : 1.0,
      createdAt: typeof entry.createdAt === 'number' ? entry.createdAt : Date.now(),
      metadata: entry.metadata
    };
  });
}

/**
 * Synchronously load all atoms from storage or cache
 */
export function loadAllAtoms(): AtMemAtom[] {
  if (inMemoryCache !== null) return inMemoryCache;
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(MEMORY_STORAGE_KEY);
    if (!raw) return [];
    if (raw.startsWith('{"v":1,"iv":')) {
      // Encrypted payload awaiting vault unlock
      return [];
    }
    const parsed = JSON.parse(raw);
    inMemoryCache = migrateLegacyEntries(parsed);
    return inMemoryCache;
  } catch {
    return [];
  }
}

/**
 * Asynchronously load all atoms with AES-256 Vault decryption
 */
export async function loadAllAtomsAsync(): Promise<AtMemAtom[]> {
  if (typeof window === 'undefined') return [];
  try {
    let raw = localStorage.getItem(MEMORY_STORAGE_KEY);
    if (!raw) return [];
    if (raw.startsWith('{"v":1,"iv":')) {
      if (!isVaultUnlocked()) return [];
      const decrypted = await decryptPayload(raw);
      if (!decrypted) return [];
      raw = decrypted;
    }
    const parsed = JSON.parse(raw);
    inMemoryCache = migrateLegacyEntries(parsed);
    return inMemoryCache;
  } catch {
    return [];
  }
}

/**
 * Persist atoms to storage with vault encryption support
 */
export function saveAllAtoms(atoms: AtMemAtom[]): void {
  inMemoryCache = atoms;
  if (typeof window === 'undefined') return;
  const json = JSON.stringify(atoms);
  if (isVaultEncrypted() && isVaultUnlocked()) {
    void encryptPayload(json).then(encrypted => {
      try {
        localStorage.setItem(MEMORY_STORAGE_KEY, encrypted);
      } catch (e) {
        console.warn('AtMem: failed to save encrypted atoms:', e);
      }
    });
    return;
  }
  try {
    localStorage.setItem(MEMORY_STORAGE_KEY, json);
  } catch (e) {
    console.warn('AtMem: failed to save atoms:', e);
  }
}

/**
 * Get all atoms belonging strictly to a specific profile
 * Enforces airtight profile context isolation.
 */
export function getProfileAtoms(profileId: string): AtMemAtom[] {
  return loadAllAtoms().filter(a => a.profileId === profileId);
}

/**
 * Add a new atomic memory for a profile with PII Sentinel interception
 */
export function addProfileAtom(
  profileId: string,
  text: string,
  category?: AtMemCategory,
  governed: boolean = false,
  source: AtMemSource = 'user',
  options?: {
    clientId?: string;
    skipPiiSentinel?: boolean;
    contextType?: 'family' | 'clinical';
    metadata?: Record<string, unknown>;
  }
): { ok: boolean; atom?: AtMemAtom; error?: string } {
  const trimmed = text.trim();
  if (!trimmed) {
    return { ok: false, error: 'Memory text cannot be empty.' };
  }

  const effectiveCategory = category || inferCategoryFromText(trimmed);
  const isClinical = options?.contextType === 'clinical' ||
    Boolean(options?.skipPiiSentinel) ||
    Boolean(options?.clientId) ||
    isClinicalCategory(effectiveCategory);

  // In standard family/student mode, PII Sentinel prevents personal data leak.
  // In clinical practitioner mode, session notes contain clinical observations
  // which are stored in the sovereign encrypted vault on-device.
  if (!isClinical) {
    const piiCheck = detectPII(trimmed);
    if (piiCheck.hasPII) {
      return {
        ok: false,
        error: `Blocked by Internet Safety Sentinel: Memory contains sensitive personal information (${piiCheck.detectedTypes.join(', ')}).`
      };
    }
  }

  const newAtom: AtMemAtom = {
    id: 'atm-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    profileId,
    clientId: options?.clientId,
    category: effectiveCategory,
    source,
    text: trimmed,
    governed: Boolean(governed),
    confidence: 1.0,
    createdAt: Date.now(),
    metadata: options?.metadata
  };

  const current = loadAllAtoms();
  saveAllAtoms([...current, newAtom]);

  recordAtMemAudit({
    action: 'create',
    clientId: options?.clientId,
    profileId,
    atomId: newAtom.id,
    category: effectiveCategory,
    details: `Added ${effectiveCategory} atom (${newAtom.id})`
  });

  return { ok: true, atom: newAtom };
}

/**
 * Update an existing atom's text or category
 */
export function updateProfileAtom(
  id: string,
  updates: { text?: string; category?: AtMemCategory; governed?: boolean; metadata?: Record<string, unknown> },
  isParentAuthorized: boolean = false
): { ok: boolean; error?: string } {
  const current = loadAllAtoms();
  const target = current.find(a => a.id === id);
  if (!target) return { ok: false, error: 'Atom not found.' };

  // Governance check: Governed mandates require parental authorization to modify
  if (target.governed && !isParentAuthorized) {
    return { ok: false, error: 'Cannot modify a Governed Mandate without parental PIN verification.' };
  }

  if (updates.text !== undefined) {
    const isClinical = Boolean(target.clientId) || isClinicalCategory(target.category);
    if (!isClinical) {
      const pii = detectPII(updates.text);
      if (pii.hasPII) {
        return { ok: false, error: `Blocked by Sentinel: Contains ${pii.detectedTypes.join(', ')}.` };
      }
    }
  }

  const updated = current.map(a => {
    if (a.id !== id) return a;
    return {
      ...a,
      text: updates.text !== undefined ? updates.text.trim() : a.text,
      category: updates.category !== undefined ? updates.category : a.category,
      governed: updates.governed !== undefined ? updates.governed : a.governed,
      metadata: updates.metadata !== undefined ? updates.metadata : a.metadata
    };
  });

  saveAllAtoms(updated);

  recordAtMemAudit({
    action: 'update',
    clientId: target.clientId,
    profileId: target.profileId,
    atomId: target.id,
    category: target.category,
    details: `Updated atom ${target.id}`
  });

  return { ok: true };
}

/**
 * Delete an atom with parental governance protection
 */
export function deleteProfileAtom(id: string, isParentAuthorized: boolean = false): { ok: boolean; error?: string } {
  const current = loadAllAtoms();
  const target = current.find(a => a.id === id);
  if (!target) return { ok: false, error: 'Atom not found.' };

  // Governance check: Governed mandates require parental authorization to delete
  if (target.governed && !isParentAuthorized) {
    return { ok: false, error: 'Cannot delete a Governed Mandate without parental PIN verification.' };
  }

  saveAllAtoms(current.filter(a => a.id !== id));

  recordAtMemAudit({
    action: 'delete',
    clientId: target.clientId,
    profileId: target.profileId,
    atomId: target.id,
    category: target.category,
    details: `Deleted atom ${target.id}`
  });

  return { ok: true };
}

/**
 * Clear all atoms for a profile. Governed mandates are preserved unless parent authorized.
 */
export function clearProfileAtoms(profileId: string, isParentAuthorized: boolean = false): { clearedCount: number; preservedCount: number } {
  const current = loadAllAtoms();
  let clearedCount = 0;
  let preservedCount = 0;

  const next = current.filter(a => {
    if (a.profileId !== profileId) return true;
    if (a.governed && !isParentAuthorized) {
      preservedCount++;
      return true;
    }
    clearedCount++;
    return false;
  });

  saveAllAtoms(next);

  recordAtMemAudit({
    action: 'clear',
    profileId,
    details: `Cleared ${clearedCount} atoms (preserved ${preservedCount} governed atoms)`
  });

  return { clearedCount, preservedCount };
}

/**
 * Strict Client Isolation Partition Retrieval
 * Enforces zero cross-client context leakage.
 * Unpartitioned or legacy atoms without an explicit clientId are NEVER returned in a client partition.
 */
export function getClientAtoms(clientId: string): AtMemAtom[] {
  if (!clientId || typeof clientId !== 'string' || !clientId.trim()) return [];
  const normalizedId = clientId.trim();
  const all = loadAllAtoms();

  // Atom must belong strictly and explicitly to this client partition
  const clientAtoms = all.filter(a => Boolean(a.clientId) && a.clientId === normalizedId);

  // Invariant verification check: guarantee zero contamination
  for (const atom of clientAtoms) {
    if (atom.clientId !== normalizedId) {
      throw new Error(`CRITICAL PRIVACY VIOLATION: Cross-client contamination detected for partition ${normalizedId}`);
    }
  }

  recordAtMemAudit({
    action: 'read',
    clientId: normalizedId,
    profileId: 'clinical_practitioner',
    details: `Retrieved ${clientAtoms.length} atoms for client partition ${normalizedId}`
  });

  return clientAtoms;
}

/**
 * Clear all atoms belonging strictly to a specific client partition
 */
export function clearClientAtoms(clientId: string): { clearedCount: number } {
  if (!clientId || typeof clientId !== 'string' || !clientId.trim()) return { clearedCount: 0 };
  const normalizedId = clientId.trim();
  const current = loadAllAtoms();
  let clearedCount = 0;

  const next = current.filter(a => {
    const isTarget = Boolean(a.clientId) && a.clientId === normalizedId;
    if (isTarget) {
      clearedCount++;
      return false;
    }
    return true;
  });

  saveAllAtoms(next);

  recordAtMemAudit({
    action: 'clear',
    clientId: normalizedId,
    profileId: 'clinical_practitioner',
    details: `Cleared ${clearedCount} atoms for client partition ${normalizedId}`
  });

  return { clearedCount };
}

/**
 * Export client atoms as formatted JSON (for confidential clinical backup)
 */
export function exportClientAtoms(clientId: string): { ok: boolean; data?: string; error?: string } {
  try {
    const atoms = getClientAtoms(clientId);
    recordAtMemAudit({
      action: 'export',
      clientId,
      profileId: 'clinical_practitioner',
      details: `Exported ${atoms.length} client atoms`
    });
    return { ok: true, data: JSON.stringify(atoms, null, 2) };
  } catch (err: any) {
    return { ok: false, error: err?.message || 'Export failed' };
  }
}

/**
 * Pre-Appointment Briefing Envelope Builder for Clinicians / Therapists
 * Prioritizes:
 * 1. Critical risk factors (suicide, self-harm, medical crises, safety alerts)
 * 2. Active medications & dosages
 * 3. Active treatment goals
 * 4. Recent session notes and clinical formulations relevant to upcoming topic
 *
 * Enforces zero cross-client leakage.
 */
export function getAppointmentPrepEnvelope(
  clientId: string,
  upcomingTopic: string = '',
  tokenBudget: number = 512
): string {
  const atoms = getClientAtoms(clientId);
  if (atoms.length === 0) return '';

  recordAtMemAudit({
    action: 'retrieve_prep',
    clientId,
    profileId: 'clinical_practitioner',
    details: `Generated appointment prep envelope for client ${clientId} (topic: "${upcomingTopic}")`
  });

  const maxChars = tokenBudget * 4;
  const queryTokens = tokenizeText(upcomingTopic);

  // 1. Critical Risk Factors (ALWAYS FIRST - non-negotiable patient safety)
  const riskFactors = atoms.filter(a => a.category === 'risk_factor');

  // 2. Active Medications
  const medications = atoms.filter(a => a.category === 'medication');

  // 3. Treatment Goals
  const goals = atoms.filter(a => a.category === 'treatment_goal' || (a.category === 'goal' && (a.clientId === clientId || a.profileId === clientId)));

  // 4. Session Notes & Clinical History & other atoms, scored by recency & query tokens
  const others = atoms.filter(a =>
    a.category !== 'risk_factor' &&
    a.category !== 'medication' &&
    a.category !== 'treatment_goal'
  );

  const scoredOthers = others.map(atom => ({
    atom,
    score: calculateAtomRelevance(atom, queryTokens)
  })).sort((a, b) => b.score - a.score);

  const selected: AtMemAtom[] = [];
  let accumulatedChars = 0;

  // Append Risk Factors first (mandatory)
  for (const a of riskFactors) {
    selected.push(a);
    accumulatedChars += a.text.length + 30;
  }

  // Append Medications
  for (const a of medications) {
    if (accumulatedChars + a.text.length + 30 <= maxChars) {
      selected.push(a);
      accumulatedChars += a.text.length + 30;
    }
  }

  // Append Treatment Goals
  for (const a of goals) {
    if (accumulatedChars + a.text.length + 30 <= maxChars) {
      selected.push(a);
      accumulatedChars += a.text.length + 30;
    }
  }

  // Append Scored Session Notes / History until budget
  for (const s of scoredOthers) {
    if (accumulatedChars + s.atom.text.length + 30 <= maxChars) {
      selected.push(s.atom);
      accumulatedChars += s.atom.text.length + 30;
    }
  }

  // Invariant assertion check: zero leakage
  for (const atom of selected) {
    if (atom.clientId && atom.clientId !== clientId) {
      throw new Error(`CRITICAL PRIVACY VIOLATION: Leaked atom ${atom.id} belonging to ${atom.clientId} into client ${clientId}`);
    }
  }

  const sections: string[] = [];
  const risks = selected.filter(a => a.category === 'risk_factor');
  if (risks.length > 0) {
    sections.push(`⚠️ CLINICAL SAFETY & RISK ALERTS:\n${risks.map(r => `  - [ALERT]: ${r.text}`).join('\n')}`);
  }

  const meds = selected.filter(a => a.category === 'medication');
  if (meds.length > 0) {
    sections.push(`💊 CURRENT MEDICATIONS & REGIMEN:\n${meds.map(m => `  - ${m.text}`).join('\n')}`);
  }

  const treatmentGoals = selected.filter(a => a.category === 'treatment_goal' || a.category === 'goal');
  if (treatmentGoals.length > 0) {
    sections.push(`🎯 ACTIVE TREATMENT GOALS:\n${treatmentGoals.map(g => `  - ${g.text}`).join('\n')}`);
  }

  const notesAndHist = selected.filter(a =>
    a.category === 'session_note' ||
    a.category === 'clinical_history' ||
    a.category === 'fact' ||
    a.category === 'insight' ||
    a.category === 'preference' ||
    a.category === 'rule'
  );
  if (notesAndHist.length > 0) {
    sections.push(`📋 SESSION NOTES & CLINICAL FORMULATION:\n${notesAndHist.map(n => {
      const tag = n.category === 'session_note' ? 'Session Note' : (n.category.charAt(0).toUpperCase() + n.category.slice(1));
      return `  - [${tag}]: ${n.text}`;
    }).join('\n')}`);
  }

  return `[SOVEREIGN CLINICAL PARTITION — CONFIDENTIAL CLIENT RECORD (${clientId})]:\n${sections.join('\n\n')}`;
}

/**
 * Calculate match relevance score between an atom and user prompt query tokens
 */
export function calculateAtomRelevance(atom: AtMemAtom, queryTokens: string[]): number {
  // Standing governed rules and high risk factors ALWAYS get top priority
  if (atom.category === 'rule' && atom.governed) {
    return 100.0;
  }
  if (atom.category === 'risk_factor') {
    return 95.0;
  }

  if (queryTokens.length === 0) {
    // If no query, score based on baseline category hierarchy
    if (atom.category === 'rule') return 10.0;
    if (atom.category === 'treatment_goal' || atom.category === 'goal') return 8.0;
    if (atom.category === 'medication') return 7.0;
    if (atom.category === 'session_note') return 6.5;
    if (atom.category === 'clinical_history') return 6.0;
    if (atom.category === 'preference') return 5.0;
    return 4.0;
  }

  const atomTokens = tokenizeText(atom.text);
  if (atomTokens.length === 0) return 0.0;

  let matches = 0;
  for (const qt of queryTokens) {
    for (const at of atomTokens) {
      if (at === qt) {
        matches += 2.0;
      } else if (at.startsWith(qt) || qt.startsWith(at)) {
        matches += 1.0;
      }
    }
  }

  // Baseline category weights
  let categoryMultiplier = 1.0;
  if (atom.category === 'rule') categoryMultiplier = 2.5;
  else if (atom.category === 'treatment_goal' || atom.category === 'goal') categoryMultiplier = 2.0;
  else if (atom.category === 'medication') categoryMultiplier = 1.8;
  else if (atom.category === 'session_note') categoryMultiplier = 1.5;
  else if (atom.category === 'clinical_history') categoryMultiplier = 1.4;
  else if (atom.category === 'preference') categoryMultiplier = 1.2;
  else if (atom.category === 'insight') categoryMultiplier = 1.1;

  // Boost for recency (last 7 days gets up to +15% boost)
  const ageMs = Date.now() - atom.createdAt;
  const daysOld = ageMs / (1000 * 60 * 60 * 24);
  const recencyBoost = daysOld < 7 ? (1 + (7 - daysOld) * 0.02) : 1.0;

  return (matches * categoryMultiplier * recencyBoost);
}

/**
 * Attentive Prompt Context Envelope Builder
 * Selects only standing rules and top-k query-relevant atoms, strictly within a token budget.
 *
 * @param profileId Profile owning the memory
 * @param query Current user prompt
 * @param tokenBudget Approximate token ceiling for memory injection (default 256 tokens ~ 1000 chars)
 * @returns Formatted prompt section, or empty string if no relevant memories exist
 */
export function getAttentivePromptEnvelope(
  profileId: string,
  query: string = '',
  tokenBudget: number = 256
): string {
  const profileAtoms = getProfileAtoms(profileId);
  if (profileAtoms.length === 0) return '';

  const maxChars = tokenBudget * 4; // Standard heuristic: 1 token ≈ 4 characters
  const queryTokens = tokenizeText(query);

  // Score all candidate atoms
  const scored = profileAtoms.map(atom => ({
    atom,
    score: calculateAtomRelevance(atom, queryTokens)
  }));

  // Separate standing governed rules (always included) from elective atoms
  const standingRules = scored
    .filter(s => s.atom.category === 'rule' && s.atom.governed)
    .sort((a, b) => b.score - a.score);

  const electiveAtoms = scored
    .filter(s => !(s.atom.category === 'rule' && s.atom.governed))
    .sort((a, b) => b.score - a.score);

  const selected: AtMemAtom[] = [];
  let accumulatedChars = 0;

  // 1. First append standing governed rules
  for (const s of standingRules) {
    const lineLen = s.atom.text.length + 30;
    if (accumulatedChars + lineLen <= maxChars || selected.length === 0) {
      selected.push(s.atom);
      accumulatedChars += lineLen;
    }
  }

  // 2. Then append top-scoring elective atoms until token budget is met
  for (const s of electiveAtoms) {
    if (queryTokens.length > 0 && s.score <= 0) {
      // Skip completely irrelevant atoms if a specific query was provided
      continue;
    }
    const lineLen = s.atom.text.length + 25;
    if (accumulatedChars + lineLen <= maxChars) {
      selected.push(s.atom);
      accumulatedChars += lineLen;
    }
  }

  if (selected.length === 0) return '';

  const formattedLines = selected.map(atom => {
    const categoryTag = atom.governed ? 'Standing Rule' : (atom.category.charAt(0).toUpperCase() + atom.category.slice(1));
    return `- [${categoryTag}]: ${atom.text}`;
  });

  return `[PROFILE SOVEREIGN MEMORY & GOVERNANCE (ATMEM)]:\n${formattedLines.join('\n')}`;
}
