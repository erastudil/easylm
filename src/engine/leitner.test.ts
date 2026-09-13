import { describe, expect, it } from 'vitest';
import { dueCards, reviewCard, upsertMiss } from './leitner';

describe('leitner', () => {
  it('misses start in box 1 and are due today', () => {
    const cards = upsertMiss([], 'quiz1', 'q1', 'What is 2+2?', '2026-09-13');
    expect(cards[0].box).toBe(1);
    expect(dueCards(cards, '2026-09-13').length).toBe(1);
  });

  it('pass moves box up; fail returns to 1', () => {
    let card = upsertMiss([], 'quiz1', 'q1', 'p', '2026-09-13')[0];
    card = reviewCard(card, true, '2026-09-13');
    expect(card.box).toBe(2);
    expect(card.dueDay).toBe('2026-09-14');
    card = reviewCard(card, false, '2026-09-14');
    expect(card.box).toBe(1);
  });
});
