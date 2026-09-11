import { Session } from '../types';
import { loadAllSessions, saveAllSessions } from './storage';
import { loadMemories, saveMemories } from './family';

declare global {
  interface Window {
    google?: any;
  }
}

const GOOGLE_CLIENT_ID_STORAGE_KEY = 'easylm_google_client_id';
// Default community/demo client ID or placeholder
export const DEFAULT_GOOGLE_CLIENT_ID = '1035678483921-easylm-placeholder.apps.googleusercontent.com';

export function getStoredGoogleClientId(): string {
  if (typeof localStorage === 'undefined') return DEFAULT_GOOGLE_CLIENT_ID;
  return localStorage.getItem(GOOGLE_CLIENT_ID_STORAGE_KEY) || DEFAULT_GOOGLE_CLIENT_ID;
}

export function setStoredGoogleClientId(id: string): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(GOOGLE_CLIENT_ID_STORAGE_KEY, id.trim());
  }
}

/**
 * Dynamically injects Google Identity Services script ONLY when requested.
 * Preserves zero-tracking privacy for offline or local-only users.
 */
export function loadGoogleAuthScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('Window not available'));
    if (window.google?.accounts?.oauth2) return resolve();

    const existing = document.getElementById('gsi-client-script');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', (e) => reject(new Error('Failed to load Google Auth SDK')));
      return;
    }

    const script = document.createElement('script');
    script.id = 'gsi-client-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Unable to connect to Google Identity Services. Check your adblocker or internet connection.'));
    document.head.appendChild(script);
  });
}

/**
 * Requests client-side OAuth access token via Google Identity Services Token Client
 */
export async function requestGoogleAccessToken(clientId: string): Promise<string> {
  await loadGoogleAuthScript();

  return new Promise((resolve, reject) => {
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/drive.appdata https://www.googleapis.com/auth/drive.file',
        callback: (resp: any) => {
          if (resp.error) {
            reject(new Error(resp.error_description || resp.error || 'Google authorization cancelled'));
            return;
          }
          if (!resp.access_token) {
            reject(new Error('No access token returned from Google'));
            return;
          }
          resolve(resp.access_token);
        }
      });
      client.requestAccessToken();
    } catch (err: any) {
      reject(new Error(`Google Auth initialization failed: ${err?.message || String(err)}`));
    }
  });
}

/**
 * Encrypt payload using WebCrypto AES-GCM-256 with PBKDF2 key derivation
 */
async function encryptPayload(text: string, passphrase: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(text)
  );

  const combined = {
    salt: Array.from(salt),
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encrypted)),
    encrypted: true
  };

  return JSON.stringify(combined);
}

/**
 * Decrypt payload using WebCrypto AES-GCM-256
 */
async function decryptPayload(payloadStr: string, passphrase: string): Promise<string> {
  const payload = JSON.parse(payloadStr);
  if (!payload.encrypted || !payload.salt || !payload.iv || !payload.data) {
    return payloadStr; // not encrypted
  }

  const enc = new TextEncoder();
  const dec = new TextDecoder();
  const salt = new Uint8Array(payload.salt);
  const iv = new Uint8Array(payload.iv);
  const data = new Uint8Array(payload.data);

  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const key = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['decrypt']
  );

  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    data
  );

  return dec.decode(decrypted);
}

const BACKUP_FILENAME = 'easylm-backup.json';

/**
 * Backup sessions & sovereign memory to Google Drive AppData folder
 */
export async function backupToGoogleDrive(
  sessions: Session[],
  clientId: string = getStoredGoogleClientId(),
  passphrase?: string
): Promise<{ ok: boolean; modifiedTime?: string; error?: string }> {
  try {
    const token = await requestGoogleAccessToken(clientId);

    const backupData = {
      app: 'EasyLM',
      version: '0.1.0',
      exportedAt: new Date().toISOString(),
      sessionsCount: sessions.length,
      sessions,
      memories: loadMemories()
    };

    let payloadStr = JSON.stringify(backupData, null, 2);
    if (passphrase && passphrase.trim()) {
      payloadStr = await encryptPayload(payloadStr, passphrase.trim());
    }

    // 1. Check if backup file already exists in user's AppData folder
    const searchUrl = `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name%3D%27${encodeURIComponent(BACKUP_FILENAME)}%27&fields=files(id%2Cname%2CmodifiedTime)`;
    const searchResp = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!searchResp.ok) {
      throw new Error(`Google Drive API search error: ${searchResp.statusText}`);
    }

    const searchData = await searchResp.json();
    const existingFile = searchData.files && searchData.files.length > 0 ? searchData.files[0] : null;

    let modifiedTime = new Date().toISOString();

    if (existingFile) {
      // 2. Overwrite / update existing file media
      const updateUrl = `https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=media`;
      const updateResp = await fetch(updateUrl, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: payloadStr
      });

      if (!updateResp.ok) {
        throw new Error(`Google Drive update error: ${updateResp.statusText}`);
      }
      const updateData = await updateResp.json();
      modifiedTime = updateData.modifiedTime || modifiedTime;
    } else {
      // 3. Create new multipart file in AppData folder
      const metadata = {
        name: BACKUP_FILENAME,
        parents: ['appDataFolder']
      };

      const boundary = 'easylm_boundary_drive_sync';
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelim = `\r\n--${boundary}--`;

      const multipartBody =
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        payloadStr +
        closeDelim;

      const createUrl = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
      const createResp = await fetch(createUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': `multipart/related; boundary=${boundary}`
        },
        body: multipartBody
      });

      if (!createResp.ok) {
        throw new Error(`Google Drive create error: ${createResp.statusText}`);
      }
      const createData = await createResp.json();
      modifiedTime = createData.modifiedTime || modifiedTime;
    }

    return { ok: true, modifiedTime };
  } catch (err: any) {
    console.error('Error backing up to Google Drive:', err);
    return { ok: false, error: err?.message || String(err) };
  }
}

/**
 * Restore sessions & sovereign memory from Google Drive AppData folder
 */
export async function restoreFromGoogleDrive(
  clientId: string = getStoredGoogleClientId(),
  passphrase?: string
): Promise<{ ok: boolean; count?: number; modifiedTime?: string; error?: string }> {
  try {
    const token = await requestGoogleAccessToken(clientId);

    const searchUrl = `https://www.googleapis.com/drive/v3/files?spaces=appDataFolder&q=name%3D%27${encodeURIComponent(BACKUP_FILENAME)}%27&fields=files(id%2Cname%2CmodifiedTime)`;
    const searchResp = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!searchResp.ok) {
      throw new Error(`Google Drive search failed: ${searchResp.statusText}`);
    }

    const searchData = await searchResp.json();
    const existingFile = searchData.files && searchData.files.length > 0 ? searchData.files[0] : null;

    if (!existingFile) {
      return { ok: false, error: 'No EasyLM backup found in your Google Drive AppData folder.' };
    }

    const downloadUrl = `https://www.googleapis.com/drive/v3/files/${existingFile.id}?alt=media`;
    const downloadResp = await fetch(downloadUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!downloadResp.ok) {
      throw new Error(`Google Drive download failed: ${downloadResp.statusText}`);
    }

    let rawText = await downloadResp.text();

    // Decrypt if encrypted
    if (rawText.includes('"encrypted":true') || (passphrase && passphrase.trim())) {
      if (!passphrase || !passphrase.trim()) {
        return { ok: false, error: 'This cloud backup is encrypted. Please enter the passphrase used during backup.' };
      }
      try {
        rawText = await decryptPayload(rawText, passphrase.trim());
      } catch {
        return { ok: false, error: 'Incorrect decryption passphrase. Cannot restore cloud backup.' };
      }
    }

    const parsed = JSON.parse(rawText);
    const sessionsToRestore: Session[] = Array.isArray(parsed) ? parsed : (parsed.sessions || []);

    if (!Array.isArray(sessionsToRestore)) {
      return { ok: false, error: 'Invalid backup structure received from Google Drive.' };
    }

    // Merge sessions
    const existing = loadAllSessions();
    const existingIds = new Set(existing.map(s => s.id));
    const merged = [...existing];
    let newCount = 0;

    for (const sess of sessionsToRestore) {
      if (!existingIds.has(sess.id)) {
        merged.push(sess);
        newCount++;
      }
    }

    saveAllSessions(merged);

    // Restore memories if present
    if (parsed.memories && Array.isArray(parsed.memories)) {
      saveMemories(parsed.memories);
    }

    return {
      ok: true,
      count: newCount,
      modifiedTime: existingFile.modifiedTime
    };
  } catch (err: any) {
    console.error('Error restoring from Google Drive:', err);
    return { ok: false, error: err?.message || String(err) };
  }
}
