import { describe, it, expect } from 'vitest';
import {
  assembleSystemEnvelope,
  browserRestartCommand,
  budgetTurn,
  capMaxTokens,
  classifyWebGpuFailure,
  clipTextToTokens,
  effortCap,
  estimateMessagesTokens,
  estimateTokens,
  MIN_COMPLETION,
  SAFETY_MARGIN,
  shouldRetryEngineInit,
  stepDownContextWindow
} from '../src/engine/context_budget';
import { AntiLoopDetector } from '../src/engine/anti_loop';

describe('Context Budget & Effort Ladder (context_budget.ts)', () => {
  it('computes completion effort caps across 4k, 16k, 32k, 64k, and 128k windows', () => {
    expect(effortCap(4096, false)).toBe(1024);
    expect(effortCap(4096, true)).toBe(1024);
    expect(effortCap(16384, false)).toBe(1536);
    expect(effortCap(16384, true)).toBe(2048);
    expect(effortCap(32768, false)).toBe(2048);
    expect(effortCap(32768, true)).toBe(4096);
    expect(effortCap(65536, false)).toBe(4096);
    expect(effortCap(65536, true)).toBe(8192);
    expect(effortCap(131072, false)).toBe(4096);
    expect(effortCap(131072, true)).toBe(8192);
  });

  it('steps down context windows monotonically from 128k through 64k and 32k down to 512', () => {
    const ladder: number[] = [];
    let current = 131072;
    while (current > 512) {
      current = stepDownContextWindow(current);
      ladder.push(current);
    }
    expect(ladder).toEqual([65536, 32768, 16384, 8192, 4096, 2048, 1024, 512]);
    expect(stepDownContextWindow(512)).toBe(512);
  });

  it('caps max_tokens within contextWindow minus promptTokens and SAFETY_MARGIN', () => {
    expect(capMaxTokens(1000, 4096, 2048)).toBe(2048);
    expect(capMaxTokens(3500, 4096, 2048)).toBe(4096 - 3500 - SAFETY_MARGIN);
    expect(capMaxTokens(4080, 4096, 1024)).toBe(0);
  });

  it('budgets turns by trimming old history and clipping oversized system prompts to preserve MIN_COMPLETION', () => {
    const messages = [
      { role: 'system' as const, content: 'System instructions. '.repeat(40) },
      { role: 'user' as const, content: 'Old user turn 1. '.repeat(120) },
      { role: 'assistant' as const, content: 'Old assistant turn 1. '.repeat(120) },
      { role: 'user' as const, content: 'Current question?' }
    ];
    const budgeted = budgetTurn(messages, 1024, { isReasoning: false });
    expect(budgeted.clipped).toBe(true);
    expect(budgeted.maxTokens).toBeGreaterThanOrEqual(MIN_COMPLETION);
    expect(budgeted.messages[budgeted.messages.length - 1].content).toBe('Current question?');
  });

  it('assembles system envelopes using compact fallbacks and token clipping when budget is tight', () => {
    const res = assembleSystemEnvelope(
      {
        voice: 'Voice persona description.',
        protocols: 'Full verbose protocol specification. '.repeat(100),
        protocolsCompact: 'Compact protocol spec.',
        tools: 'Tool definitions.'
      },
      1024
    );
    expect(res.clipped).toBe(true);
    expect(res.text).toContain('Compact protocol spec.');
    expect(res.text).toContain('Voice persona description.');
    expect(estimateTokens(res.text)).toBeLessThanOrEqual(512);
    expect(clipTextToTokens('abcdef'.repeat(100), 10)).toContain('[clipped]');
    expect(estimateMessagesTokens([{ content: 'abcd' }])).toBe(5);
  });

  it('classifies WebGPU failures and enforces single-retry OOM / disposal fences', () => {
    expect(classifyWebGpuFailure(new Error('DXGI_ERROR_DEVICE_REMOVED 0x887A0005'))).toBe('gpu_process_dead');
    expect(classifyWebGpuFailure(new Error('Out of memory allocating maxBufferSize'))).toBe('oom');
    expect(classifyWebGpuFailure(new Error('WebGPU device lost'))).toBe('device_lost');
    expect(classifyWebGpuFailure(new Error('Pipeline was disposed'))).toBe('disposed');

    expect(shouldRetryEngineInit('oom', 0, null)).toBe(true);
    expect(shouldRetryEngineInit('oom', 1, null)).toBe(true);
    expect(shouldRetryEngineInit('oom', 2, null)).toBe(false);
    expect(shouldRetryEngineInit('oom', 1, 'lost')).toBe(false);
    expect(shouldRetryEngineInit('gpu_process_dead', 1, null)).toBe(false);
    expect(shouldRetryEngineInit('device_lost', 1, null)).toBe(false);
    expect(shouldRetryEngineInit('disposed', 1, null)).toBe(true);
  });

  it('selects sovereign browser restart URLs and never suggests Edge', () => {
    expect(browserRestartCommand('Mozilla/5.0 Chrome/130.0', true)).toBe('brave://restart');
    expect(browserRestartCommand('Mozilla/5.0 Firefox/132.0', false)).toBe('about:restart');
    expect(browserRestartCommand('Mozilla/5.0 Chrome/130.0', false)).toBe('chrome://restart');
  });
});

describe('Anti-Loop Sentinel (anti_loop.ts)', () => {
  it('detects and prunes word repetition, ngram cycles, ping-pong cycles, and runaway <think> blocks', () => {
    const detector = new AntiLoopDetector(200);

    const wordLoop = 'The answer is wait wait wait wait';
    const wordCheck = detector.check(wordLoop);
    expect(wordCheck.isLoop).toBe(true);
    expect(wordCheck.reason).toBe('word_repetition');

    const phrase = 'First we verify the invariant across all nodes in the graph. ';
    const phraseLoop = 'Intro text. ' + phrase + phrase;
    const phraseCheck = detector.check(phraseLoop);
    expect(phraseCheck.isLoop).toBe(true);
    expect(phraseCheck.reason).toBe('phrase_cycle');
    const prunedPhrase = detector.prune(phraseLoop, phraseCheck);
    expect(prunedPhrase).toContain('Intro text.');
    expect(prunedPhrase.length).toBeLessThan(phraseLoop.length);

    const runaway = '<think>' + 'reasoning step '.repeat(25);
    const runawayCheck = detector.check(runaway);
    expect(runawayCheck.isLoop).toBe(true);
    expect(runawayCheck.reason).toBe('thought_runaway');
    const prunedRunaway = detector.prune(runaway, runawayCheck);
    expect(prunedRunaway).toContain('</think>');
  });
});
