import { Session, Message } from '../types';

const SESSIONS_STORAGE_KEY = 'easylm_sessions';
const ACTIVE_SESSION_ID_KEY = 'easylm_active_session_id';

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

export function loadAllSessions(): Session[] {
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error loading sessions from storage:', err);
    return [];
  }
}

export function saveAllSessions(sessions: Session[]): void {
  try {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.error('Error saving sessions to storage:', err);
  }
}

export function getActiveSessionId(): string | null {
  return localStorage.getItem(ACTIVE_SESSION_ID_KEY);
}

export function setActiveSessionId(id: string): void {
  localStorage.setItem(ACTIVE_SESSION_ID_KEY, id);
}

/**
 * Single-click Backup to Local Disk (.json file)
 */
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

/**
 * Restore sessions from uploaded backup JSON file
 */
export function restoreBackupFromDisk(jsonStr: string): { ok: boolean; count?: number; error?: string } {
  try {
    const parsed = JSON.parse(jsonStr);
    let sessionsToRestore: Session[] = [];

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
    for (const sess of sessionsToRestore) {
      if (!existingIds.has(sess.id)) {
        merged.push(sess);
        newCount++;
      }
    }

    saveAllSessions(merged);
    return { ok: true, count: newCount };
  } catch (err: any) {
    return { ok: false, error: err.message || 'JSON parse error' };
  }
}

/**
 * Wipe all stored sessions
 */
export function wipeAllStoredSessions(): void {
  localStorage.removeItem(SESSIONS_STORAGE_KEY);
  localStorage.removeItem(ACTIVE_SESSION_ID_KEY);
}
