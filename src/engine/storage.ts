import { Session, Message } from '../types';

const SESSIONS_STORAGE_KEY = 'easylm_sessions';
const ACTIVE_SESSION_ID_KEY = 'easylm_active_session_id';
const IDB_NAME = 'easylm';
const IDB_STORE = 'kv';
const MAX_MESSAGE_CHARS = 100000;

export type SaveResult = { ok: boolean; quota?: boolean; error?: string };

export function createNewSession(title: string = 'New Conversation'): Session {
  const id = 'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  return {
    id,
    title,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    messages: []
  };
}

function isQuotaError(err: unknown): boolean {
  const e = err as { name?: string; code?: number };
  return e?.name === 'QuotaExceededError' || e?.code === 22;
}

function openIdb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  return new Promise(resolve => {
    try {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) db.createObjectStore(IDB_STORE);
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function idbGet(key: string): Promise<string | null> {
  const db = await openIdb();
  if (!db) return null;
  return new Promise(resolve => {
    try {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(key);
      req.onsuccess = () => resolve(typeof req.result === 'string' ? req.result : null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function idbSet(key: string, value: string): Promise<boolean> {
  const db = await openIdb();
  if (!db) return false;
  return new Promise(resolve => {
    try {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(value, key);
      tx.oncomplete = () => resolve(true);
      tx.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

export function sanitizeSession(raw: unknown): Session | null {
  if (!raw || typeof raw !== 'object') return null;
  const s = raw as Partial<Session>;
  if (typeof s.id !== 'string' || !s.id || s.id.length > 120) return null;
  if (!Array.isArray(s.messages)) return null;
  const messages: Message[] = [];
  for (const m of s.messages.slice(0, 400)) {
    if (!m || typeof m !== 'object') continue;
    const role = (m as Message).role;
    if (role !== 'user' && role !== 'assistant' && role !== 'system') continue;
    const content = String((m as Message).content || '').slice(0, MAX_MESSAGE_CHARS);
    messages.push({
      id: String((m as Message).id || 'msg-' + messages.length).slice(0, 120),
      role,
      content,
      timestamp: typeof (m as Message).timestamp === 'number' ? (m as Message).timestamp : Date.now(),
      thinking: typeof (m as Message).thinking === 'string' ? (m as Message).thinking.slice(0, MAX_MESSAGE_CHARS) : undefined,
      toolsUsed: Array.isArray((m as Message).toolsUsed) ? (m as Message).toolsUsed : undefined,
      thoughtDurationMs: typeof (m as Message).thoughtDurationMs === 'number' ? (m as Message).thoughtDurationMs : undefined,
      loopProtected: Boolean((m as Message).loopProtected)
    });
  }
  return {
    id: s.id,
    title: String(s.title || 'Conversation').slice(0, 200),
    createdAt: typeof s.createdAt === 'number' ? s.createdAt : Date.now(),
    updatedAt: typeof s.updatedAt === 'number' ? s.updatedAt : Date.now(),
    messages,
    systemPreset: typeof s.systemPreset === 'string' ? s.systemPreset : undefined,
    customSystemPrompt: typeof s.customSystemPrompt === 'string' ? s.customSystemPrompt.slice(0, 8000) : undefined
  };
}

export function loadAllSessions(): Session[] {
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(sanitizeSession).filter((s): s is Session => !!s);
  } catch (err) {
    console.error('Error loading sessions from storage:', err);
    return [];
  }
}

export async function loadAllSessionsAsync(): Promise<Session[]> {
  const fromLs = loadAllSessions();
  if (fromLs.length > 0) return fromLs;
  try {
    const raw = await idbGet(SESSIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(sanitizeSession).filter((s): s is Session => !!s);
  } catch {
    return [];
  }
}

export function saveAllSessions(sessions: Session[]): SaveResult {
  const json = JSON.stringify(sessions);
  try {
    localStorage.setItem(SESSIONS_STORAGE_KEY, json);
    void idbSet(SESSIONS_STORAGE_KEY, json);
    return { ok: true };
  } catch (err) {
    console.error('Error saving sessions to storage:', err);
    if (isQuotaError(err)) {
      void idbSet(SESSIONS_STORAGE_KEY, json);
      return { ok: false, quota: true, error: 'Browser storage is full. Export a backup or delete old chats.' };
    }
    return { ok: false, error: 'Could not save sessions' };
  }
}

export function getActiveSessionId(): string | null {
  return localStorage.getItem(ACTIVE_SESSION_ID_KEY);
}

export function setActiveSessionId(id: string): void {
  localStorage.setItem(ACTIVE_SESSION_ID_KEY, id);
}

export function exportBackupToDisk(sessions: Session[]): void {
  const exportData = {
    app: 'EasyLM',
    version: '0.1.0',
    exportedAt: new Date().toISOString(),
    sessionsCount: sessions.length,
    sessions
  };

  const jsonStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().split('T')[0];

  const a = document.createElement('a');
  a.href = url;
  a.download = `easylm-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function restoreBackupFromDisk(jsonStr: string): { ok: boolean; count?: number; error?: string } {
  try {
    const parsed = JSON.parse(jsonStr);
    let sessionsToRestore: unknown[] = [];

    if (Array.isArray(parsed)) {
      sessionsToRestore = parsed;
    } else if (parsed && Array.isArray(parsed.sessions)) {
      sessionsToRestore = parsed.sessions;
    } else {
      return { ok: false, error: 'Invalid backup format: missing sessions array' };
    }

    const existing = loadAllSessions();
    const existingIds = new Set(existing.map(s => s.id));
    const merged = [...existing];

    let newCount = 0;
    for (const raw of sessionsToRestore) {
      const sess = sanitizeSession(raw);
      if (!sess) continue;
      if (!existingIds.has(sess.id)) {
        merged.push(sess);
        existingIds.add(sess.id);
        newCount++;
      }
    }

    const saved = saveAllSessions(merged);
    if (saved.quota) {
      return { ok: false, error: saved.error || 'Storage full' };
    }
    return { ok: true, count: newCount };
  } catch (err: any) {
    return { ok: false, error: err.message || 'JSON parse error' };
  }
}

export function wipeAllStoredSessions(): void {
  localStorage.removeItem(SESSIONS_STORAGE_KEY);
  localStorage.removeItem(ACTIVE_SESSION_ID_KEY);
  void idbSet(SESSIONS_STORAGE_KEY, '[]');
}
