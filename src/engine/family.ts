/**
 * Family Mode, User Profiles, Sovereign Memory & Parental Controls (EasyLM)
 *
 * 1. User Profiles (Parent, Student/Kid, custom child profiles)
 * 2. Local Parental Controls (4-digit PIN lock to prevent switching out of Kid Safe mode)
 * 3. Sovereign Memory Vault (localStorage explicit key-value notebook per profile)
 * 4. Internet Safety Sentinel (detects personal identifiable information: phone, address, school)
 */

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  role: 'parent' | 'kid';
  personalityId: string;
  parentalLockEnabled: boolean;
  socraticTutorEnabled: boolean;
  readingLevel: 'elementary' | 'middle' | 'high' | 'general';
}

export interface MemoryEntry {
  id: string;
  profileId: string;
  text: string;
  createdAt: number;
}

export interface AttachedDoc {
  name: string;
  size: number;
  content: string;
  type: string;
}

export interface PIICheckResult {
  hasPII: boolean;
  detectedTypes: string[];
}

const DEFAULT_PROFILES: UserProfile[] = [
  {
    id: 'parent',
    name: 'Parent / General',
    avatar: '👨‍👩‍👧',
    role: 'parent',
    personalityId: 'friendly',
    parentalLockEnabled: false,
    socraticTutorEnabled: false,
    readingLevel: 'general'
  },
  {
    id: 'kid',
    name: 'Student / Kid Safe',
    avatar: '🎒',
    role: 'kid',
    personalityId: 'socratic_kid',
    parentalLockEnabled: true,
    socraticTutorEnabled: true,
    readingLevel: 'middle'
  }
];

const PROFILES_KEY = 'easylm_user_profiles';
const ACTIVE_PROFILE_KEY = 'easylm_active_profile_id';
const PARENTAL_PIN_KEY = 'easylm_parental_pin';
const MEMORY_KEY = 'easylm_sovereign_memory';

/**
 * Load all user profiles
 */
export function loadProfiles(): UserProfile[] {
  if (typeof window === 'undefined') return DEFAULT_PROFILES;
  try {
    const raw = localStorage.getItem(PROFILES_KEY);
    if (!raw) {
      saveProfiles(DEFAULT_PROFILES);
      return DEFAULT_PROFILES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_PROFILES;
    return parsed.map((p: UserProfile) =>
      p.role === 'kid' ? { ...p, parentalLockEnabled: true } : p
    );
  } catch {
    return DEFAULT_PROFILES;
  }
}

/**
 * Save user profiles
 */
export function saveProfiles(profiles: UserProfile[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
  } catch (e) {
    console.warn('Failed to save profiles:', e);
  }
}

/**
 * Get active profile ID
 */
export function getActiveProfileId(): string {
  if (typeof window === 'undefined') return 'parent';
  return localStorage.getItem(ACTIVE_PROFILE_KEY) || 'parent';
}

/**
 * Set active profile ID
 */
export function setActiveProfileId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_PROFILE_KEY, id);
}

/**
 * Get active profile object
 */
export function getActiveProfile(): UserProfile {
  const profiles = loadProfiles();
  const activeId = getActiveProfileId();
  return profiles.find(p => p.id === activeId) || profiles[0];
}

const PIN_ITERATIONS = 100000;

type PinRecord = {
  v: 1;
  alg: 'PBKDF2-SHA-256';
  iter: number;
  salt: string;
  hash: string;
};

function bytesToB64(bytes: Uint8Array): string {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s);
}

function b64ToBytes(s: string): Uint8Array {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let x = 0;
  for (let i = 0; i < a.length; i++) x |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return x === 0;
}

export async function hashParentalPin(pin: string, salt?: Uint8Array, iterations = PIN_ITERATIONS): Promise<PinRecord> {
  const enc = new TextEncoder();
  const saltBytes = salt
    ? new Uint8Array(salt)
    : crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(pin.trim()), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: saltBytes as BufferSource, iterations, hash: 'SHA-256' },
    keyMaterial,
    256
  );
  return {
    v: 1,
    alg: 'PBKDF2-SHA-256',
    iter: iterations,
    salt: bytesToB64(saltBytes),
    hash: bytesToB64(new Uint8Array(bits))
  };
}

function parsePinRecord(stored: string): PinRecord | null {
  try {
    const parsed = JSON.parse(stored);
    if (parsed && parsed.v === 1 && parsed.salt && parsed.hash && parsed.iter) {
      return parsed as PinRecord;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Check if parental PIN is set
 */
export function hasParentalPin(): boolean {
  if (typeof localStorage === 'undefined') return false;
  return !!localStorage.getItem(PARENTAL_PIN_KEY);
}

/**
 * Verify parental PIN. Migrates legacy plaintext PINs to PBKDF2 on success.
 */
export async function verifyParentalPin(pin: string): Promise<boolean> {
  if (typeof localStorage === 'undefined') return true;
  const stored = localStorage.getItem(PARENTAL_PIN_KEY);
  if (!stored) return true;
  const trimmed = pin.trim();
  const record = parsePinRecord(stored);
  if (record) {
    const next = await hashParentalPin(trimmed, b64ToBytes(record.salt), record.iter);
    return timingSafeEqual(next.hash, record.hash);
  }
  // Legacy plaintext 4–8 digit PIN
  if (/^\d{4,8}$/.test(stored) && stored === trimmed) {
    await setParentalPin(trimmed);
    return true;
  }
  return false;
}

/**
 * Set or update parental PIN as a salted hash. Enables lock on kid profiles.
 */
export async function setParentalPin(pin: string): Promise<void> {
  if (typeof localStorage === 'undefined') return;
  const record = await hashParentalPin(pin.trim());
  localStorage.setItem(PARENTAL_PIN_KEY, JSON.stringify(record));
  const profiles = loadProfiles().map(p =>
    p.role === 'kid' ? { ...p, parentalLockEnabled: true } : p
  );
  saveProfiles(profiles);
}

/**
 * Remove parental PIN
 */
export function clearParentalPin(): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(PARENTAL_PIN_KEY);
}

/**
 * Check if active profile requires PIN to switch or change settings
 */
export function isParentalLocked(): boolean {
  const active = getActiveProfile();
  return active.role === 'kid' && active.parentalLockEnabled && hasParentalPin();
}

/**
 * Sovereign Memory Vault operations (stored locally per profile)
 */
export function loadMemories(): MemoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveMemories(entries: MemoryEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(entries));
  } catch (e) {
    console.warn('Failed to save memories:', e);
  }
}

export function getProfileMemories(profileId: string): MemoryEntry[] {
  return loadMemories().filter(m => m.profileId === profileId);
}

export function addProfileMemory(profileId: string, text: string): MemoryEntry {
  const entry: MemoryEntry = {
    id: 'mem-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    profileId,
    text: text.trim(),
    createdAt: Date.now()
  };
  const current = loadMemories();
  saveMemories([...current, entry]);
  return entry;
}

export function deleteProfileMemory(id: string): void {
  const current = loadMemories();
  saveMemories(current.filter(m => m.id !== id));
}

export function clearProfileMemories(profileId: string): void {
  const current = loadMemories();
  saveMemories(current.filter(m => m.profileId !== profileId));
}

/**
 * Internet Safety Sentinel: Detects PII in user prompts before generation
 */
export function detectPII(text: string): PIICheckResult {
  const detectedTypes: string[] = [];

  // Phone numbers (US/International standard formats)
  if (/\b(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b/.test(text)) {
    detectedTypes.push('phone number');
  }

  // Physical home address (number + street name + suffix)
  const addrRegex = /\b\d{1,5}\s+[a-zA-Z0-9\s.,]{2,30}\s+(?:street|st|avenue|ave|road|rd|boulevard|blvd|lane|ln|drive|dr|court|ct|way|circle|cir|terrace|ter|place|pl|highway|hwy|parkway|pkwy)\b/i;
  if (addrRegex.test(text)) {
    detectedTypes.push('home address');
  }

  // School declarations ("I go to ... elementary/middle/high school")
  const schoolRegex = /\b(?:i go to|my school is|student at|in class at)\s+([a-zA-Z0-9\s]{2,40}(?:elementary|middle|high|academy|school|prep))\b/i;
  if (schoolRegex.test(text)) {
    detectedTypes.push('school name');
  }

  // Email address
  if (/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/.test(text)) {
    detectedTypes.push('email address');
  }

  // Password sharing ("my password is ...")
  if (/\b(?:my password is|my pass is|password:)\s*([^\s]+)/i.test(text)) {
    detectedTypes.push('password');
  }

  return {
    hasPII: detectedTypes.length > 0,
    detectedTypes
  };
}
