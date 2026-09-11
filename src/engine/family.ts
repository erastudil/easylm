/**
 * Family Mode, User Profiles, Sovereign Memory & Parental Controls (EasyLM)
 *
 * 1. User Profiles (Parent, Student/Kid, custom child profiles)
 * 2. Local Parental Controls (4-digit PIN lock to prevent switching out of Kid Safe mode)
 * 3. Sovereign Memory Vault (IndexedDB/localStorage explicit key-value notebook per profile)
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
    parentalLockEnabled: false,
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
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PROFILES;
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

/**
 * Check if parental PIN is set
 */
export function hasParentalPin(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(PARENTAL_PIN_KEY);
}

/**
 * Verify parental PIN
 */
export function verifyParentalPin(pin: string): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem(PARENTAL_PIN_KEY);
  if (!stored) return true; // No PIN configured
  return stored === pin.trim();
}

/**
 * Set or update parental PIN
 */
export function setParentalPin(pin: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PARENTAL_PIN_KEY, pin.trim());
}

/**
 * Remove parental PIN
 */
export function clearParentalPin(): void {
  if (typeof window === 'undefined') return;
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
