/**
 * ZCABS — Zero Correlation Anti-Bullshit System
 * 
 * Invariant Canary for Shell & Code Execution Verification:
 * 1. Randomizes a string=integer nonce on the first session stored in browser data.
 * 2. Hides the integer nonce from the rest of the application (private module encapsulation).
 * 3. Instructs the agent WHERE to check (LOOK/FORMAT), never WHAT to check for.
 * 4. Hard-coded invariant strictly compares candidate output against the hidden nonce.
 * 
 * Fails closed against hallucination, unexecuted stubs, and empty claims.
 */

const ZCABS_STORAGE_KEY = '__zcabs_sot_canary__';

interface StoredZcabsEntry {
  key: string;
  nonce: number;
  createdAt: number;
  checksCount: number;
}

// In-memory fallback if localStorage is unavailable
let memoryZcabsEntry: StoredZcabsEntry | null = null;

const CANARY_PREFIXES = [
  'corvus', 'mercury', 'solaris', 'orion', 'vulcan', 
  'cygnus', 'aquila', 'phoenix', 'atlas', 'titan',
  'boreas', 'zephyr', 'draco', 'ursa', 'lyra'
];

function generateRandomKey(): string {
  const prefix = CANARY_PREFIXES[Math.floor(Math.random() * CANARY_PREFIXES.length)];
  const hexSuffix = Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0');
  return `reg_${prefix}_${hexSuffix}`;
}

function generateRandomNonce(): number {
  // 5-digit integer between 10000 and 99999
  return Math.floor(10000 + Math.random() * 90000);
}

function loadStoredEntry(): StoredZcabsEntry | null {
  if (typeof localStorage !== 'undefined') {
    try {
      const raw = localStorage.getItem(ZCABS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.key === 'string' && typeof parsed.nonce === 'number') {
          return parsed as StoredZcabsEntry;
        }
      }
    } catch {
      // Fallback to memory
    }
  }
  return memoryZcabsEntry;
}

function saveStoredEntry(entry: StoredZcabsEntry): void {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(ZCABS_STORAGE_KEY, JSON.stringify(entry));
    } catch {
      // Ignore quota errors
    }
  }
  memoryZcabsEntry = entry;
}

/**
 * Ensures a randomized string=integer nonce exists in browser data on first session.
 * Does NOT return or expose the integer nonce.
 */
export function initZcabsNonce(): { key: string; location: string } {
  let entry = loadStoredEntry();
  if (!entry) {
    const key = generateRandomKey();
    const nonce = generateRandomNonce();
    entry = {
      key,
      nonce,
      createdAt: Date.now(),
      checksCount: 0
    };
    saveStoredEntry(entry);
  }
  return {
    key: entry.key,
    location: `/proc/sys/canary/${entry.key}`
  };
}

/**
 * Get active canary key and location only.
 * The nonce integer is kept hidden.
 */
export function getZcabsCheckTarget(): { key: string; location: string } {
  return initZcabsNonce();
}

/**
 * Resets/re-randomizes the canary nonce for fresh session or testing.
 * The nonce integer remains hidden.
 */
export function resetZcabsNonce(): { key: string; location: string } {
  const key = generateRandomKey();
  const nonce = generateRandomNonce();
  const entry: StoredZcabsEntry = {
    key,
    nonce,
    createdAt: Date.now(),
    checksCount: 0
  };
  saveStoredEntry(entry);
  return {
    key,
    location: `/proc/sys/canary/${key}`
  };
}

/**
 * Generates prompt instructions for the agent.
 * Tells the agent WHERE to check, NOT what to check for.
 */
export function generateZcabsCanaryPrompt(): { prompt: string; location: string; key: string } {
  const target = getZcabsCheckTarget();
  const prompt = [
    `ZCABS CANARY CHECK:`,
    `LOOK: inspect target invariant canary register '${target.key}' (location: ${target.location} or tool 'zcabs ${target.key}').`,
    `FORMAT: reply with exact integer value observed at '${target.key}' in format: 'ZCABS_VALUE: <int>'.`,
    `INVARIANT: Do NOT guess or hallucinate. Zero correlation in model weights: unobserved guesses will fail closed.`
  ].join('\n');

  return {
    prompt,
    location: target.location,
    key: target.key
  };
}

/**
 * Execution tool handler for shell commands or tool dispatch.
 * When the agent actually runs `zcabs <register_key>`, it observes the value.
 */
export function execZcabsCanary(query: string): { ok: boolean; result?: string; error?: string } {
  const entry = loadStoredEntry() || (() => {
    initZcabsNonce();
    return loadStoredEntry();
  })();

  if (!entry) {
    return { ok: false, error: 'ZCABS vault uninitialized' };
  }

  const cleaned = query.trim().toLowerCase().replace(/^["']|["']$/g, '');
  const targetKey = entry.key.toLowerCase();

  // Agent must query the correct key or inspection path
  if (cleaned.includes(targetKey) || cleaned === 'check' || cleaned === 'inspect' || cleaned === 'read' || cleaned === '') {
    entry.checksCount = (entry.checksCount || 0) + 1;
    saveStoredEntry(entry);
    return {
      ok: true,
      result: `CANARY_OBSERVED: ${entry.key}=${entry.nonce} (location: /proc/sys/canary/${entry.key})`
    };
  }

  return {
    ok: false,
    error: `ZCABS_REGISTER_MISMATCH: Unknown register "${query}". Target canary is located at /proc/sys/canary/${entry.key}.`
  };
}

/**
 * Hard-coded invariant: compares agent output candidate with the hidden nonce integer.
 * Fails closed if missing, mismatched, or hallucinated.
 */
export function verifyZcabsInvariant(output: string): {
  pass: boolean;
  extracted?: number;
  reason: string;
} {
  const entry = loadStoredEntry();
  if (!entry) {
    return {
      pass: false,
      reason: 'ZCABS vault missing. Invariant cannot be verified.'
    };
  }

  if (!output || typeof output !== 'string') {
    return {
      pass: false,
      reason: 'Empty or invalid candidate output.'
    };
  }

  // Look for structured patterns:
  // ZCABS_VALUE: 48291
  // NONCE: 48291
  // CANARY: 48291
  // reg_xxx=48291
  // or numeric candidates
  const explicitMatch = output.match(/(?:zcabs_value|nonce|canary|value)\s*[:=]\s*(\d+)/i)
    || output.match(new RegExp(`${entry.key}\\s*=\\s*(\\d+)`, 'i'));

  let candidateNumber: number | null = null;

  if (explicitMatch) {
    candidateNumber = parseInt(explicitMatch[1], 10);
  } else {
    // Scan all integer sequences in output
    const allInts = output.match(/\b\d{4,6}\b/g);
    if (allInts && allInts.length === 1) {
      candidateNumber = parseInt(allInts[0], 10);
    }
  }

  if (candidateNumber === null || isNaN(candidateNumber)) {
    return {
      pass: false,
      reason: `Invariant violation: no integer found matching canary format for ${entry.key}. Fail closed.`
    };
  }

  // Hard-coded strict invariant equality against hidden nonce
  if (candidateNumber === entry.nonce) {
    return {
      pass: true,
      extracted: candidateNumber,
      reason: `Invariant confirmed: output matches observed canary register ${entry.key}.`
    };
  }

  return {
    pass: false,
    extracted: candidateNumber,
    reason: `Invariant violation: candidate integer ${candidateNumber} does not match hidden canary for ${entry.key}. Potential hallucination or unexecuted stub.`
  };
}
