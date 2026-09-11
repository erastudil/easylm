/**
 * Anti-Loop Technology for Local & Reasoning Models (EasyLM)
 *
 * Real-time interception and surgical pruning of:
 * 1. Exact phrase cycles (repetitive n-grams from 6 to 300 characters)
 * 2. Ping-pong alternating cycles (A -> B -> A -> B)
 * 3. Word-level runaway repetition (e.g. "wait wait wait wait")
 * 4. Thought runaway limit (reasoning exceeding safety token budget without </think>)
 * 5. Clean thought closure and loop tail excision
 */

export interface LoopDetectionResult {
  isLoop: boolean;
  reason?: 'phrase_cycle' | 'ngram_cycle' | 'short_ngram_cycle' | 'word_repetition' | 'ping_pong_cycle' | 'thought_runaway';
  period?: number;
  repetitions?: number;
  matchedChunk?: string;
}

export class AntiLoopDetector {
  private buffer: string = '';
  private maxThoughtLength: number;

  constructor(maxThoughtLength = 3200) {
    this.maxThoughtLength = maxThoughtLength;
  }

  public reset(): void {
    this.buffer = '';
  }

  public feed(chunk: string): LoopDetectionResult {
    this.buffer += chunk;
    return this.check(this.buffer);
  }

  /**
   * Inspect current cumulative generation for repetitive loops or runaway reasoning
   */
  public check(text: string): LoopDetectionResult {
    const len = text.length;

    // 1. Runaway thinking check (<think> unclosed exceeding character budget)
    if (text.includes('<think>') && !text.includes('</think>')) {
      const thinkIndex = text.indexOf('<think>');
      const thoughtLen = len - (thinkIndex + 7);
      if (thoughtLen > this.maxThoughtLength) {
        return {
          isLoop: true,
          reason: 'thought_runaway'
        };
      }
    }

    if (len < 10) return { isLoop: false };

    // 2. Trailing Word/Token Repetition (e.g. " wait wait wait wait")
    const words = text.trim().split(/\s+/).slice(-8);
    if (words.length >= 4) {
      const last = words[words.length - 1].toLowerCase();
      if (last.length >= 2 && words.slice(-4).every(w => w.toLowerCase() === last)) {
        return {
          isLoop: true,
          reason: 'word_repetition',
          period: last.length + 1,
          repetitions: 4,
          matchedChunk: last
        };
      }
    }

    // 3. Consecutive Suffix Cycle Detection
    // Checks candidate period lengths L from 6 to 250 characters
    const maxPeriod = Math.min(250, Math.floor(len / 2));
    for (let L = 6; L <= maxPeriod; L++) {
      const chunk1 = text.slice(len - L);
      const chunk2 = text.slice(len - 2 * L, len - L);

      if (chunk1 === chunk2) {
        // High confidence: 45+ chars identical twice is an unnatural loop
        if (L >= 45) {
          return {
            isLoop: true,
            reason: 'phrase_cycle',
            period: L,
            repetitions: 2,
            matchedChunk: chunk1
          };
        }

        // Medium confidence: 14 to 44 chars repeated 3 times
        if (len >= 3 * L) {
          const chunk3 = text.slice(len - 3 * L, len - 2 * L);
          if (chunk1 === chunk3) {
            if (L >= 14) {
              return {
                isLoop: true,
                reason: 'ngram_cycle',
                period: L,
                repetitions: 3,
                matchedChunk: chunk1
              };
            }

            // Short phrases: 6 to 13 chars repeated 4 times
            if (len >= 4 * L) {
              const chunk4 = text.slice(len - 4 * L, len - 3 * L);
              if (chunk1 === chunk4) {
                return {
                  isLoop: true,
                  reason: 'short_ngram_cycle',
                  period: L,
                  repetitions: 4,
                  matchedChunk: chunk1
                };
              }
            }
          }
        }
      }
    }

    // 4. Alternating Ping-Pong Cycle: A B A B (2 alternating distinct chunks)
    const maxHalfPeriod = Math.min(120, Math.floor(len / 4));
    for (let L = 12; L <= maxHalfPeriod; L++) {
      const a1 = text.slice(len - L);
      const b1 = text.slice(len - 2 * L, len - L);
      const a2 = text.slice(len - 3 * L, len - 2 * L);
      const b2 = text.slice(len - 4 * L, len - 3 * L);

      if (a1 === a2 && b1 === b2 && a1.trim() !== b1.trim()) {
        return {
          isLoop: true,
          reason: 'ping_pong_cycle',
          period: 2 * L,
          repetitions: 2,
          matchedChunk: b1 + a1
        };
      }
    }

    return { isLoop: false };
  }

  /**
   * Excises repeating loop cycles while preserving the original statement and closing thinking tags
   */
  public prune(text: string, loop: LoopDetectionResult): string {
    let cleaned = text;

    if (loop.reason === 'thought_runaway') {
      cleaned = text.trimEnd();
      if (cleaned.includes('<think>') && !cleaned.includes('</think>')) {
        cleaned += '\n... [Reasoning budget reached — capped by Anti-Loop Sentinel]\n</think>\n';
      }
      return cleaned;
    }

    if (loop.period && loop.repetitions) {
      const excessChars = (loop.repetitions - 1) * loop.period;
      cleaned = text.slice(0, Math.max(0, text.length - excessChars)).trimEnd();
    }

    // If the loop occurred inside <think>, cleanly close it
    if (cleaned.includes('<think>') && !cleaned.includes('</think>')) {
      cleaned += '\n... [Reasoning loop intercepted by Anti-Loop Sentinel]\n</think>\n';
    }

    return cleaned;
  }
}
