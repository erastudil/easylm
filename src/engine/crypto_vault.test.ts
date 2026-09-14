import { describe, expect, it, beforeEach } from 'vitest';
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
} from './crypto_vault';

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
