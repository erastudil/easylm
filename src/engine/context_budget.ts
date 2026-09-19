/**
 * Context / effort budget. Hard fence against WebGPU OOM and GPU-process death.
 * Prompt tokens + max_tokens + margin must fit the loaded context window.
 */

export const CHARS_PER_TOKEN = 4;
export const SAFETY_MARGIN = 64;
export const MIN_COMPLETION = 256;
export const ENVELOPE_FRACTION = 0.4;

export type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };
export type GpuFence = null | 'lost' | 'process_dead';
export type WebGpuFailureKind = 'gpu_process_dead' | 'device_lost' | 'oom' | 'disposed' | 'other';

export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / CHARS_PER_TOKEN);
}

export function estimateMessagesTokens(messages: Array<{ content: string }>): number {
  return messages.reduce((n, m) => n + estimateTokens(m.content || '') + 4, 0);
}

export function clipTextToTokens(text: string, maxTokens: number): string {
  if (maxTokens <= 0) return '';
  const maxChars = maxTokens * CHARS_PER_TOKEN;
  if (text.length <= maxChars) return text;
  const cut = Math.max(0, maxChars - 16);
  return text.slice(0, cut).trimEnd() + '\n[clipped]';
}

/** Completion effort: never the full context window. */
export function effortCap(contextWindow: number, extendedThinking: boolean): number {
  const ctx = Math.max(1, contextWindow || 4096);
  if (extendedThinking) {
    if (ctx >= 32768) return 4096;
    if (ctx >= 16384) return 2048;
    return 1024;
  }
  if (ctx >= 32768) return 2048;
  if (ctx >= 16384) return 1536;
  return 1024;
}

export function capMaxTokens(promptTokens: number, contextWindow: number, effort: number): number {
  const ctx = Math.max(1, contextWindow || 4096);
  const remaining = ctx - Math.max(0, promptTokens) - SAFETY_MARGIN;
  if (remaining <= 0) return 0;
  const want = effort > 0 ? effort : remaining;
  return Math.max(0, Math.min(want, remaining, ctx));
}

export function assembleSystemEnvelope(
  parts: { voice: string; protocols: string; tools: string; extras?: string; protocolsCompact?: string },
  contextWindow: number
): { text: string; clipped: boolean } {
  let budget = Math.max(256, Math.floor(Math.max(1, contextWindow) * ENVELOPE_FRACTION));
  let clipped = false;
  const chunks: string[] = [];

  const take = (raw: string, compact?: string) => {
    const text = (raw || '').trim();
    if (!text) return;
    const need = estimateTokens(text);
    if (need <= budget) {
      chunks.push(text);
      budget -= need;
      return;
    }
    if (compact) {
      const compactText = compact.trim();
      const cNeed = estimateTokens(compactText);
      if (cNeed <= budget) {
        chunks.push(compactText);
        budget -= cNeed;
        clipped = true;
        return;
      }
    }
    if (budget < 32) {
      clipped = true;
      return;
    }
    chunks.push(clipTextToTokens(text, budget));
    budget = 0;
    clipped = true;
  };

  take(parts.extras || '');
  take(parts.tools);
  take(parts.protocols, parts.protocolsCompact);
  take(parts.voice);

  return { text: chunks.join('\n\n'), clipped };
}

export interface TurnBudget {
  messages: ChatMessage[];
  maxTokens: number;
  promptTokens: number;
  contextWindow: number;
  clipped: boolean;
}

export function budgetTurn(
  messages: ChatMessage[],
  contextWindow: number,
  opts?: { extendedThinking?: boolean; isReasoning?: boolean }
): TurnBudget {
  const ctx = Math.max(1, contextWindow || 4096);
  const effort = effortCap(ctx, !!(opts?.extendedThinking || opts?.isReasoning));
  const msgs: ChatMessage[] = messages.map(m => ({ role: m.role, content: m.content }));
  let clipped = false;

  const fit = () => {
    const promptTokens = estimateMessagesTokens(msgs);
    const maxTokens = capMaxTokens(promptTokens, ctx, effort);
    return { promptTokens, maxTokens };
  };

  let { promptTokens, maxTokens } = fit();

  while (maxTokens < MIN_COMPLETION && msgs.length > 2) {
    const idx = msgs.findIndex((m, i) => i > 0 && m.role !== 'system');
    if (idx < 0) break;
    msgs.splice(idx, 1);
    clipped = true;
    ({ promptTokens, maxTokens } = fit());
  }

  if (maxTokens < MIN_COMPLETION) {
    const sys = msgs.find(m => m.role === 'system');
    if (sys) {
      const others = estimateMessagesTokens(msgs.filter(m => m !== sys));
      const sysBudget = ctx - others - SAFETY_MARGIN - MIN_COMPLETION;
      if (sysBudget > 64 && estimateTokens(sys.content) > sysBudget) {
        sys.content = clipTextToTokens(sys.content, sysBudget);
        clipped = true;
        ({ promptTokens, maxTokens } = fit());
      }
    }
  }

  return {
    messages: msgs,
    maxTokens: Math.max(0, maxTokens),
    promptTokens,
    contextWindow: ctx,
    clipped
  };
}

export function classifyWebGpuFailure(err: unknown): WebGpuFailureKind {
  const s = String((err as { message?: string } | undefined)?.message || err).toLowerCase();
  if (
    s.includes('unable to find a compatible gpu') ||
    s.includes('cannot find webgpu') ||
    s.includes('failed to requestadapter') ||
    s.includes('adapter request returned null') ||
    s.includes('gpu worker is down') ||
    s.includes('dxgi_error_device_removed') ||
    s.includes('0x887a0005') ||
    s.includes('create command queue failed') ||
    s.includes('device_removed')
  ) {
    return 'gpu_process_dead';
  }
  if (s.includes('out of memory') || (s.includes('oom') && s.includes('gpu')) || s.includes('maxbuffersize')) {
    return 'oom';
  }
  if (s.includes('device lost') || s.includes('devicelost')) {
    return 'device_lost';
  }
  if (s.includes('disposed') || s.includes('not loaded')) {
    return 'disposed';
  }
  return 'other';
}

export function shouldRetryEngineInit(
  kind: WebGpuFailureKind,
  attempt: number,
  fence: GpuFence
): boolean {
  if (attempt >= 2) return false;
  if (fence === 'process_dead' || fence === 'lost') return false;
  if (kind === 'gpu_process_dead' || kind === 'device_lost' || kind === 'oom') return false;
  return kind === 'disposed';
}

export function browserRestartCommand(userAgent?: string, hasBrave?: boolean): string {
  const ua = userAgent || (typeof navigator !== 'undefined' ? navigator.userAgent : '');
  const brave = hasBrave ?? (typeof navigator !== 'undefined' && !!(navigator as { brave?: unknown }).brave);
  if (brave || /brave/i.test(ua)) return 'brave://restart';
  if (/edg\//i.test(ua)) return 'edge://restart';
  return 'chrome://restart';
}
