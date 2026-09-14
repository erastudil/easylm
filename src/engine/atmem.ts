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

export type AtMemCategory = 'rule' | 'goal' | 'preference' | 'fact' | 'insight';
export type AtMemSource = 'user' | 'parent' | 'assistant' | 'tri_lake';

export interface AtMemAtom {
  id: string;
  profileId: string;
  category: AtMemCategory;
  source: AtMemSource;
  text: string;
  governed: boolean;        // true = locked by parental PIN
  confidence: number;      // 0.0 to 1.0
  createdAt: number;
  lastUsedAt?: number;
  expiresAt?: number;      // optional expiration timestamp
}

const MEMORY_STORAGE_KEY = 'easylm_sovereign_memory';
let inMemoryCache: AtMemAtom[] | null = null;

export function resetAtMemCache(): void {
  inMemoryCache = null;
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
      category,
      source: (entry.source as AtMemSource) || 'user',
      text,
      governed: category === 'rule' && entry.profileId === 'kid',
      confidence: typeof entry.confidence === 'number' ? entry.confidence : 1.0,
      createdAt: typeof entry.createdAt === 'number' ? entry.createdAt : Date.now()
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
  source: AtMemSource = 'user'
): { ok: boolean; atom?: AtMemAtom; error?: string } {
  const trimmed = text.trim();
  if (!trimmed) {
    return { ok: false, error: 'Memory text cannot be empty.' };
  }

  // PII Sentinel Gate: Prevent sensitive private data in sovereign memory
  const piiCheck = detectPII(trimmed);
  if (piiCheck.hasPII) {
    return {
      ok: false,
      error: `Blocked by Internet Safety Sentinel: Memory contains sensitive personal information (${piiCheck.detectedTypes.join(', ')}).`
    };
  }

  const effectiveCategory = category || inferCategoryFromText(trimmed);
  const newAtom: AtMemAtom = {
    id: 'atm-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    profileId,
    category: effectiveCategory,
    source,
    text: trimmed,
    governed: Boolean(governed),
    confidence: 1.0,
    createdAt: Date.now()
  };

  const current = loadAllAtoms();
  saveAllAtoms([...current, newAtom]);
  return { ok: true, atom: newAtom };
}

/**
 * Update an existing atom's text or category
 */
export function updateProfileAtom(
  id: string,
  updates: { text?: string; category?: AtMemCategory; governed?: boolean },
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
    const pii = detectPII(updates.text);
    if (pii.hasPII) {
      return { ok: false, error: `Blocked by Sentinel: Contains ${pii.detectedTypes.join(', ')}.` };
    }
  }

  const updated = current.map(a => {
    if (a.id !== id) return a;
    return {
      ...a,
      text: updates.text !== undefined ? updates.text.trim() : a.text,
      category: updates.category !== undefined ? updates.category : a.category,
      governed: updates.governed !== undefined ? updates.governed : a.governed
    };
  });

  saveAllAtoms(updated);
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
  return { clearedCount, preservedCount };
}

/**
 * Calculate match relevance score between an atom and user prompt query tokens
 */
export function calculateAtomRelevance(atom: AtMemAtom, queryTokens: string[]): number {
  // Standing governed rules ALWAYS get top priority regardless of query terms
  if (atom.category === 'rule' && atom.governed) {
    return 100.0;
  }

  if (queryTokens.length === 0) {
    // If no query, score based on baseline category hierarchy
    if (atom.category === 'rule') return 10.0;
    if (atom.category === 'goal') return 8.0;
    if (atom.category === 'preference') return 6.0;
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
  if (atom.category === 'rule') categoryMultiplier = 2.0;
  else if (atom.category === 'goal') categoryMultiplier = 1.6;
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
