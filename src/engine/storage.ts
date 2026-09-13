import { Session, Message, LakeType } from '../types';
import { loadAllProgress, restoreAllProgress } from './progress';
import { getProfileMemories, addProfileMemory } from './family';

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
      loopProtected: Boolean((m as Message).loopProtected),
      rating: ((m as Message).rating === 'heaven' || (m as Message).rating === 'hell' || (m as Message).rating === 'neutral')
        ? (m as Message).rating
        : undefined
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
    sessions,
    progress: loadAllProgress()
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
    if (parsed && parsed.progress && typeof parsed.progress === 'object' && !Array.isArray(parsed.progress)) {
      restoreAllProgress(parsed.progress as Record<string, unknown>);
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

export function classifySessionLake(session: Session): LakeType {
  const assistantMsgs = (session.messages || []).filter(m => m.role === 'assistant');
  if (assistantMsgs.length === 0) return 'purgatory';

  const hasHell = assistantMsgs.some(m => m.rating === 'hell');
  if (hasHell) return 'hell';

  const hasHeaven = assistantMsgs.some(m => m.rating === 'heaven');
  if (hasHeaven) return 'heaven';

  return 'purgatory';
}

export interface TriLakeExportDataset {
  app: string;
  version: string;
  exportedAt: string;
  lakeFilter: 'all' | LakeType;
  counts: {
    heaven: number;
    purgatory: number;
    hell: number;
    total: number;
  };
  lakes: {
    heaven: Session[];
    purgatory: Session[];
    hell: Session[];
  };
}

export function buildTriLakeExport(sessions: Session[], filter: 'all' | LakeType = 'all'): TriLakeExportDataset {
  const lakes: { heaven: Session[]; purgatory: Session[]; hell: Session[] } = {
    heaven: [],
    purgatory: [],
    hell: []
  };

  for (const s of sessions) {
    const lake = classifySessionLake(s);
    lakes[lake].push(s);
  }

  return {
    app: 'EasyLM',
    version: '0.1.0',
    exportedAt: new Date().toISOString(),
    lakeFilter: filter,
    counts: {
      heaven: lakes.heaven.length,
      purgatory: lakes.purgatory.length,
      hell: lakes.hell.length,
      total: sessions.length
    },
    lakes: filter === 'all' ? lakes : {
      heaven: filter === 'heaven' ? lakes.heaven : [],
      purgatory: filter === 'purgatory' ? lakes.purgatory : [],
      hell: filter === 'hell' ? lakes.hell : []
    }
  };
}

export function exportTriLakeLogsToDisk(sessions: Session[], filter: 'all' | LakeType = 'all'): void {
  const dataset = buildTriLakeExport(sessions, filter);
  const jsonStr = JSON.stringify(dataset, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const dateStr = new Date().toISOString().split('T')[0];

  const a = document.createElement('a');
  a.href = url;
  a.download = `easylm-trilake-memory-${filter}-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export interface TriLakeAnalysisResult {
  totalRated: number;
  approvedCount: number;
  rejectedCount: number;
  insightsAdded: number;
  insights: string[];
  message: string;
}

export function analyzeTriLakePatterns(sessions: Session[], profileId: string): TriLakeAnalysisResult {
  const heavenMsgs: Message[] = [];
  const hellMsgs: Message[] = [];

  for (const s of sessions) {
    for (const m of s.messages || []) {
      if (m.role === 'assistant') {
        if (m.rating === 'heaven') heavenMsgs.push(m);
        else if (m.rating === 'hell') hellMsgs.push(m);
      }
    }
  }

  const totalRated = heavenMsgs.length + hellMsgs.length;
  if (totalRated === 0) {
    return {
      totalRated: 0,
      approvedCount: 0,
      rejectedCount: 0,
      insightsAdded: 0,
      insights: [],
      message: 'No rated messages found yet. Rate answers with 👍 (Approve) or 👎 (Reject) in chat to train your personal profile.'
    };
  }

  const generatedInsights: string[] = [];

  // 1. Analyze Heaven (Approved) patterns
  if (heavenMsgs.length > 0) {
    const totalWords = heavenMsgs.reduce((acc, m) => acc + m.content.trim().split(/\s+/).length, 0);
    const avgWords = Math.round(totalWords / heavenMsgs.length);

    if (avgWords < 90) {
      generatedInsights.push('Prefers concise, punchy answers under 90 words with zero preamble.');
    } else if (avgWords > 250) {
      generatedInsights.push('Prefers thorough, comprehensive explanations with deep step-by-step breakdowns.');
    }

    const withCode = heavenMsgs.filter(m => /```[\s\S]*?```/.test(m.content)).length;
    if (withCode / heavenMsgs.length >= 0.35) {
      generatedInsights.push('Values runnable code snippets and concrete programming examples.');
    }

    const withMath = heavenMsgs.filter(m => /\$\$[\s\S]*?\$\$|\$[^$\n]+\$|\\\[[\s\S]*?\\\]/.test(m.content)).length;
    if (withMath / heavenMsgs.length >= 0.25) {
      generatedInsights.push('Values formal mathematical equations and explicit formula derivations.');
    }

    const withTables = heavenMsgs.filter(m => /\|[\s-:]+\|/.test(m.content)).length;
    if (withTables / heavenMsgs.length >= 0.25) {
      generatedInsights.push('Values structured comparison tables and tabular layouts.');
    }

    const withBullets = heavenMsgs.filter(m => /^[\s]*[-*+]\s+/m.test(m.content)).length;
    if (withBullets / heavenMsgs.length >= 0.5) {
      generatedInsights.push('Prefers answers structured with clear bullet-point takeaways.');
    }
  }

  // 2. Analyze Hell (Rejected) patterns
  if (hellMsgs.length > 0) {
    const apologetic = hellMsgs.filter(m => /\b(sorry|apologize|apologies|as an ai|as a language model)\b/i.test(m.content)).length;
    if (apologetic / hellMsgs.length >= 0.25) {
      generatedInsights.push('Dislikes apologetic or sycophantic filler (e.g. "I apologize", "As an AI").');
    }

    const wallsOfText = hellMsgs.filter(m => {
      const words = m.content.trim().split(/\s+/).length;
      const hasStructure = /```|\||\n#|\n-|\n\*/.test(m.content);
      return words > 200 && !hasStructure;
    }).length;
    if (wallsOfText / hellMsgs.length >= 0.3) {
      generatedInsights.push('Dislikes unstructured walls of text; requires headings, lists, or code breaks.');
    }
  }

  // Deduplicate against existing profile memories
  const existing = new Set(getProfileMemories(profileId).map(m => m.text.toLowerCase().trim()));
  const newInsights = generatedInsights.filter(ins => !existing.has(ins.toLowerCase().trim()));

  for (const ins of newInsights) {
    addProfileMemory(profileId, ins);
  }

  return {
    totalRated,
    approvedCount: heavenMsgs.length,
    rejectedCount: hellMsgs.length,
    insightsAdded: newInsights.length,
    insights: newInsights,
    message: newInsights.length > 0
      ? `Analyzed ${totalRated} rated responses (${heavenMsgs.length} approved, ${hellMsgs.length} rejected). Added ${newInsights.length} new insight${newInsights.length === 1 ? '' : 's'} to memory bank!`
      : `Analyzed ${totalRated} rated responses. All discovered patterns are already recorded in memory.`
  };
}

