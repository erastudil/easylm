/**
 * Alice Cognitive Engine client for EasyLM.
 * Loads compiled knowledge bundle from /alice/alice_mind_bundle.json
 * Runs deterministic interpretation, semantic graph retrieval, and citation ledger in-browser.
 */

// @ts-ignore
import { AliceMind } from '../vendor/alice-mind/mind.js';
import type { ProgressStatus } from './webllm';

export interface MindCompletionResult {
  fullText: string;
  thinking?: string;
  loopDetected?: boolean;
  loopReason?: string;
  citations?: any[];
  route?: string;
  confidence?: number;
}

let mindInstance: any = null;
let mindLoadPromise: Promise<any> | null = null;

export function isMindModel(modelId: string): boolean {
  const norm = (modelId || '').toLowerCase().trim();
  return norm === 'alice' || norm === 'alice-mind' || norm === 'alice-cognitive-mind';
}

export async function getOrInitMind(onProgress?: (p: ProgressStatus) => void): Promise<any> {
  if (mindInstance) return mindInstance;
  if (mindLoadPromise) return mindLoadPromise;

  mindLoadPromise = (async () => {
    onProgress?.({ text: 'Loading Alice cognitive bundle...', progress: 0.1 });
    const res = await fetch('/alice/alice_mind_bundle.json');
    if (!res.ok) {
      throw new Error(`Failed to load Alice bundle: ${res.status} ${res.statusText}`);
    }
    onProgress?.({ text: 'Parsing Alice knowledge bundle...', progress: 0.7 });
    const bundle = await res.json();
    onProgress?.({ text: 'Initializing cognitive graph index...', progress: 0.9 });
    const mind = new AliceMind(bundle);
    mindInstance = mind;
    onProgress?.({ text: 'Alice cognitive mind ready', progress: 1.0 });
    return mind;
  })();

  try {
    return await mindLoadPromise;
  } finally {
    mindLoadPromise = null;
  }
}

export async function streamMindCompletion(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  _modelId: string = 'alice',
  _temperature: number = 0.4,
  _maxTokens: number = 4096,
  onChunk: (chunkText: string) => void,
  onProgress?: (p: ProgressStatus) => void,
  _contextWindowSize?: number
): Promise<MindCompletionResult> {
  const mind = await getOrInitMind(onProgress);

  // Extract last user prompt and preceding history
  let lastUser = -1;
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'user') {
      lastUser = i;
      break;
    }
  }

  const prompt = lastUser >= 0 ? messages[lastUser].content : '';
  const history = messages.slice(0, Math.max(0, lastUser)).map(m => ({ role: m.role, content: m.content }));

  const res = mind.ask(prompt, { history });

  const answer = res.answer || '';
  const parts = answer.match(/\S+\s*/g) || [answer];

  // Stream chunks with tiny delay for smooth UI render
  for (let i = 0; i < parts.length; i += 6) {
    const chunk = parts.slice(i, i + 6).join('');
    onChunk(chunk);
    await new Promise(r => setTimeout(r, 8));
  }

  const thinking = `${res.route} · ${res.modality} · confidence ${(res.confidence * 100).toFixed(0)}%`;

  return {
    fullText: answer,
    thinking,
    citations: res.citations,
    route: res.route,
    confidence: res.confidence,
    loopDetected: false
  };
}
