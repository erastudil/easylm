/**
 * EasyLM Sovereign Crypto Vault
 *
 * 1. WebCrypto AES-GCM-256 encryption for local chats and memories.
 * 2. PBKDF2 key derivation (SHA-256, 100,000 iterations, 16-byte random salt).
 * 3. Supports both 4-digit PIN (fast convenience) and full custom passwords/passphrases (high entropy).
 * 4. In-memory session key caching — cryptographic key is never written to disk or storage.
 * 5. Zero-leakage verification via encrypted canary token.
 */

export interface VaultMeta {
  salt: string;
  iter: number;
  authTag: string;
  type: 'pin' | 'password';
  enabledAt: number;
}

export interface EncryptedPayload {
  v: number;
  iv: string;
  data: string;
}

const VAULT_ENCRYPTED_KEY = 'easylm_vault_encrypted';
const VAULT_META_KEY = 'easylm_vault_meta';
const CANARY_STRING = 'CANARY:EASYLM_SOVEREIGN_VAULT_V1';

let activeVaultKey: CryptoKey | null = null;

function getSubtle(): SubtleCrypto | null {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    return window.crypto.subtle;
  }
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.subtle) {
    return globalThis.crypto.subtle;
  }
  return null;
}

function bytesToB64(bytes: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function b64ToBytes(b64: string): Uint8Array {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(b64, 'base64'));
  }
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

async function deriveKey(passphrase: string, salt: Uint8Array, iter: number = 100000): Promise<CryptoKey> {
  const subtle = getSubtle();
  if (!subtle) throw new Error('WebCrypto not supported in this environment');

  const enc = new TextEncoder();
  const passKey = await subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as any,
      iterations: iter,
      hash: 'SHA-256'
    },
    passKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export function isVaultEncrypted(): boolean {
  if (typeof localStorage === 'undefined') return false;
  return localStorage.getItem(VAULT_ENCRYPTED_KEY) === 'true';
}

export function getVaultMeta(): VaultMeta | null {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(VAULT_META_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isVaultUnlocked(): boolean {
  if (!isVaultEncrypted()) return true;
  return activeVaultKey !== null;
}

export function getActiveVaultKey(): CryptoKey | null {
  return activeVaultKey;
}

export function lockVault(): void {
  activeVaultKey = null;
}

export async function unlockVault(passphraseOrPin: string): Promise<boolean> {
  const meta = getVaultMeta();
  if (!meta) return false;

  try {
    const saltBytes = b64ToBytes(meta.salt);
    const key = await deriveKey(passphraseOrPin.trim(), saltBytes, meta.iter);

    // Verify key by decrypting authTag canary
    const canaryPayload: EncryptedPayload = JSON.parse(meta.authTag);
    const iv = b64ToBytes(canaryPayload.iv);
    const data = b64ToBytes(canaryPayload.data);

    const subtle = getSubtle();
    if (!subtle) return false;

    const decrypted = await subtle.decrypt(
      { name: 'AES-GCM', iv: iv as any },
      key,
      data as any
    );

    const decText = new TextDecoder().decode(decrypted);
    if (decText === CANARY_STRING) {
      activeVaultKey = key;
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function enableVaultEncryption(
  passphraseOrPin: string,
  type: 'pin' | 'password' = 'pin'
): Promise<void> {
  const subtle = getSubtle();
  if (!subtle) throw new Error('WebCrypto subtle not available');

  const trimmed = passphraseOrPin.trim();
  if (!trimmed) throw new Error('PIN or password cannot be empty');

  // Generate 16-byte random salt
  const salt = new Uint8Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(salt);
  } else {
    for (let i = 0; i < 16; i++) salt[i] = Math.floor(Math.random() * 256);
  }

  const iter = 100000;
  const key = await deriveKey(trimmed, salt, iter);

  // Encrypt canary auth tag
  const iv = new Uint8Array(12);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(iv);
  } else {
    for (let i = 0; i < 12; i++) iv[i] = Math.floor(Math.random() * 256);
  }

  const canaryBytes = new TextEncoder().encode(CANARY_STRING);
  const encryptedCanary = await subtle.encrypt(
    { name: 'AES-GCM', iv: iv as any },
    key,
    canaryBytes
  );

  const authTag: EncryptedPayload = {
    v: 1,
    iv: bytesToB64(iv),
    data: bytesToB64(new Uint8Array(encryptedCanary))
  };

  const meta: VaultMeta = {
    salt: bytesToB64(salt),
    iter,
    authTag: JSON.stringify(authTag),
    type,
    enabledAt: Date.now()
  };

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(VAULT_ENCRYPTED_KEY, 'true');
    localStorage.setItem(VAULT_META_KEY, JSON.stringify(meta));
  }

  activeVaultKey = key;
}

export async function disableVaultEncryption(passphraseOrPin: string): Promise<boolean> {
  const unlocked = await unlockVault(passphraseOrPin);
  if (!unlocked) return false;

  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(VAULT_ENCRYPTED_KEY);
    localStorage.removeItem(VAULT_META_KEY);
  }
  activeVaultKey = null;
  return true;
}

export async function encryptPayload(plaintext: string): Promise<string> {
  if (!isVaultEncrypted() || !activeVaultKey) {
    return plaintext;
  }

  const subtle = getSubtle();
  if (!subtle) return plaintext;

  const iv = new Uint8Array(12);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(iv);
  } else {
    for (let i = 0; i < 12; i++) iv[i] = Math.floor(Math.random() * 256);
  }

  const dataBytes = new TextEncoder().encode(plaintext);
  const cipherBuffer = await subtle.encrypt(
    { name: 'AES-GCM', iv: iv as any },
    activeVaultKey,
    dataBytes
  );

  const payload: EncryptedPayload = {
    v: 1,
    iv: bytesToB64(iv),
    data: bytesToB64(new Uint8Array(cipherBuffer))
  };

  return JSON.stringify(payload);
}

export async function decryptPayload(raw: string): Promise<string | null> {
  if (!raw) return null;
  if (!isVaultEncrypted()) return raw;

  // Check if payload is in encrypted envelope format
  if (!raw.startsWith('{"v":1,"iv":')) {
    return raw; // Already plaintext (e.g. created before encryption was turned on)
  }

  if (!activeVaultKey) {
    return null; // Locked
  }

  try {
    const payload: EncryptedPayload = JSON.parse(raw);
    const subtle = getSubtle();
    if (!subtle) return null;

    const iv = b64ToBytes(payload.iv);
    const cipherBytes = b64ToBytes(payload.data);

    const plainBuffer = await subtle.decrypt(
      { name: 'AES-GCM', iv: iv as any },
      activeVaultKey,
      cipherBytes as any
    );

    return new TextDecoder().decode(plainBuffer);
  } catch {
    return null;
  }
}

export async function enableVaultWithDataMigration(
  passphraseOrPin: string,
  type: 'pin' | 'password' = 'pin'
): Promise<void> {
  await enableVaultEncryption(passphraseOrPin, type);

  if (typeof localStorage !== 'undefined') {
    const rawSessions = localStorage.getItem('easylm_sessions');
    if (rawSessions && !rawSessions.startsWith('{"v":1,"iv":')) {
      const encrypted = await encryptPayload(rawSessions);
      localStorage.setItem('easylm_sessions', encrypted);
    }
    const rawMemories = localStorage.getItem('easylm_sovereign_memory');
    if (rawMemories && !rawMemories.startsWith('{"v":1,"iv":')) {
      const encrypted = await encryptPayload(rawMemories);
      localStorage.setItem('easylm_sovereign_memory', encrypted);
    }
  }
}

export async function disableVaultWithDataMigration(passphraseOrPin: string): Promise<boolean> {
  if (typeof localStorage === 'undefined') return false;

  const rawSessions = localStorage.getItem('easylm_sessions');
  let decryptedSessions: string | null = null;
  if (rawSessions && rawSessions.startsWith('{"v":1,"iv":')) {
    decryptedSessions = await decryptPayload(rawSessions);
  }

  const rawMemories = localStorage.getItem('easylm_sovereign_memory');
  let decryptedMemories: string | null = null;
  if (rawMemories && rawMemories.startsWith('{"v":1,"iv":')) {
    decryptedMemories = await decryptPayload(rawMemories);
  }

  const ok = await disableVaultEncryption(passphraseOrPin);
  if (!ok) return false;

  if (decryptedSessions) {
    localStorage.setItem('easylm_sessions', decryptedSessions);
  }
  if (decryptedMemories) {
    localStorage.setItem('easylm_sovereign_memory', decryptedMemories);
  }
  return true;
}

