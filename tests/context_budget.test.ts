import { describe, it, expect } from 'vitest';
import {
  assembleSystemEnvelope,
  browserRestartCommand,
  budgetTurn,
  capMaxTokens,
  classifyWebGpuFailure,
  clipTextToTokens,
  effortCap,
  ENVELOPE_FRACTION,
  estimateMessagesTokens,
  estimateTokens,
  MIN_COMPLETION,
  SAFETY_MARGIN,
  shouldRetryEngineInit,
  stepDownContextWindow,
  getOomFallbackModel
} from '../src/engine/context_budget';
import { PERSONALITIES } from '../src/data/personalities';
import { CORE_INTERACTION_PROTOCOLS, CORE_INTERACTION_PROTOCOLS_COMPACT } from '../src/data/protocols';
import { SYSTEM_TOOLS_PROMPT } from '../src/engine/tools';

describe('context budget', () => {
  it('estimates tokens as ceil(chars/4)', () => {
    expect(estimateTokens('abcd')).toBe(1);
    expect(estimateTokens('abcde')).toBe(2);
    expect(estimateTokens('')).toBe(0);
  });

  it('never lets max_tokens equal the full window when a prompt is present', () => {
    const ctx = 4096;
    const prompt = 3500;
    const capped = capMaxTokens(prompt, ctx, ctx);
    expect(capped).toBe(ctx - prompt - SAFETY_MARGIN);
    expect(capped).toBeLessThan(ctx);
    expect(capped).toBeGreaterThan(0);
  });

  it('caps effort below remaining context', () => {
    expect(effortCap(4096, false)).toBe(1024);
    expect(effortCap(32768, false)).toBe(2048);
    expect(effortCap(32768, true)).toBe(4096);
    const effort = effortCap(4096, false);
    const capped = capMaxTokens(200, 4096, effort);
    expect(capped).toBe(1024);
    expect(capped).toBeLessThan(4096 - 200);
    expect(capMaxTokens(200, 4096, 4096)).toBe(4096 - 200 - SAFETY_MARGIN);
  });

  it('returns 0 when the prompt already fills the window', () => {
    expect(capMaxTokens(4096, 4096, 1024)).toBe(0);
    expect(capMaxTokens(4100, 4096, 1024)).toBe(0);
  });

  it('clips text to a token budget', () => {
    const long = 'x'.repeat(400);
    const clipped = clipTextToTokens(long, 10);
    expect(estimateTokens(clipped)).toBeLessThanOrEqual(11);
    expect(clipped).toContain('[clipped]');
  });

  it('keeps the Han Feizi + protocols + tools envelope inside 40% of a 4k window', () => {
    const voice = PERSONALITIES.find(p => p.id === 'han_feizi')?.systemPrompt || '';
    expect(voice.length).toBeGreaterThan(1000);
    const assembled = assembleSystemEnvelope({
      voice,
      protocols: CORE_INTERACTION_PROTOCOLS,
      protocolsCompact: CORE_INTERACTION_PROTOCOLS_COMPACT,
      tools: SYSTEM_TOOLS_PROMPT
    }, 4096);
    expect(assembled.clipped).toBe(true);
    expect(estimateTokens(assembled.text)).toBeLessThanOrEqual(Math.floor(4096 * ENVELOPE_FRACTION) + 8);
  });

  it('does not clip a short friendly envelope on 32k', () => {
    const voice = PERSONALITIES.find(p => p.id === 'friendly')?.systemPrompt || '';
    const assembled = assembleSystemEnvelope({
      voice,
      protocols: CORE_INTERACTION_PROTOCOLS,
      protocolsCompact: CORE_INTERACTION_PROTOCOLS_COMPACT,
      tools: SYSTEM_TOOLS_PROMPT
    }, 32768);
    expect(assembled.clipped).toBe(false);
    expect(assembled.text).toContain(voice.slice(0, 40));
  });

  it('budgetTurn drops history before overflowing completion', () => {
    const messages = [
      { role: 'system' as const, content: 'sys '.repeat(200) },
      ...Array.from({ length: 8 }, (_, i) => ({
        role: (i % 2 === 0 ? 'user' : 'assistant') as 'user' | 'assistant',
        content: 'turn '.repeat(400)
      }))
    ];
    const before = estimateMessagesTokens(messages);
    expect(before).toBeGreaterThan(4096);
    const budget = budgetTurn(messages, 4096, { extendedThinking: false });
    expect(budget.maxTokens).toBeGreaterThanOrEqual(MIN_COMPLETION);
    expect(budget.promptTokens + budget.maxTokens + SAFETY_MARGIN).toBeLessThanOrEqual(4096);
    expect(budget.clipped).toBe(true);
    expect(budget.messages.length).toBeLessThan(messages.length);
  });

  it('classifies GPU-process death separately from sleep dispose', () => {
    expect(classifyWebGpuFailure(new Error('Unable to find a compatible GPU'))).toBe('gpu_process_dead');
    expect(classifyWebGpuFailure(new Error('Failed to requestAdapter'))).toBe('gpu_process_dead');
    expect(classifyWebGpuFailure(new Error("Failed to execute 'requestDevice' on 'GPUAdapter': D3D12 create command queue failed with DXGI_ERROR_DEVICE_REMOVED (0x887A0005)"))).toBe('gpu_process_dead');
    expect(classifyWebGpuFailure(new Error('device lost'))).toBe('device_lost');
    expect(classifyWebGpuFailure(new Error('Engine disposed'))).toBe('disposed');
    expect(classifyWebGpuFailure(new Error('out of memory'))).toBe('oom');
  });

  it('fail-closes: never retries GPU-process death, device-lost, or OOM', () => {
    expect(shouldRetryEngineInit('gpu_process_dead', 1, null)).toBe(false);
    expect(shouldRetryEngineInit('device_lost', 1, null)).toBe(false);
    expect(shouldRetryEngineInit('oom', 1, null)).toBe(false);
    expect(shouldRetryEngineInit('disposed', 1, 'process_dead')).toBe(false);
    expect(shouldRetryEngineInit('disposed', 1, 'lost')).toBe(false);
    expect(shouldRetryEngineInit('disposed', 1, null)).toBe(true);
    expect(shouldRetryEngineInit('disposed', 2, null)).toBe(false);
  });

  it('picks the sovereign restart command for chrome, brave, zen, and refuses edge', () => {
    expect(browserRestartCommand('Mozilla/5.0 Chrome/120', false)).toBe('chrome://restart');
    expect(browserRestartCommand('Mozilla/5.0 Chrome/120', true)).toBe('brave://restart');
    expect(browserRestartCommand('Mozilla/5.0 Zen/1.0', false)).toBe('about:restart');
    expect(browserRestartCommand('Mozilla/5.0 Firefox/120', false)).toBe('about:restart');
    // Edge is never recommended; falls back to chromium/sovereign restart
    expect(browserRestartCommand('Mozilla/5.0 Edg/120', false)).toBe('chrome://restart');
  });

  it('provides progressive context window step-down and OOM fallback model', () => {
    expect(stepDownContextWindow(32768)).toBe(16384);
    expect(stepDownContextWindow(16384)).toBe(8192);
    expect(stepDownContextWindow(8192)).toBe(4096);
    expect(stepDownContextWindow(4096)).toBe(2048);
    expect(stepDownContextWindow(2048)).toBe(1024);
    expect(stepDownContextWindow(1024)).toBe(512);

    expect(getOomFallbackModel('DeepSeek-R1-Distill-Qwen-7B-q4f16_1-MLC')).toBe('Qwen2.5-1.5B-Instruct-q4f16_1-MLC');
    expect(getOomFallbackModel('Qwen2.5-1.5B-Instruct-q4f16_1-MLC')).toBe('Llama-3.2-1B-Instruct-q4f16_1-MLC');
  });
});
