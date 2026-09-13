import { localDay, addDays } from './course';

export interface LeitnerCard {
  id: string;
  prompt: string;
  box: number;
  dueDay: string;
  itemId: string;
  questionId: string;
}

export function newCard(itemId: string, questionId: string, prompt: string, today: string): LeitnerCard {
  return {
    id: `${itemId}:${questionId}`,
    prompt,
    box: 1,
    dueDay: today,
    itemId,
    questionId
  };
}

export function dueCards(cards: LeitnerCard[], today: string): LeitnerCard[] {
  return cards.filter(c => c.dueDay <= today).sort((a, b) => a.box - b.box);
}

export function reviewCard(card: LeitnerCard, passed: boolean, today: string): LeitnerCard {
  if (!passed) {
    return { ...card, box: 1, dueDay: today };
  }
  const box = Math.min(5, card.box + 1);
  const wait = 2 ** (box - 2);
  return { ...card, box, dueDay: addDays(today, wait) };
}

export function upsertMiss(cards: LeitnerCard[], itemId: string, questionId: string, prompt: string, today: string): LeitnerCard[] {
  const id = `${itemId}:${questionId}`;
  const existing = cards.find(c => c.id === id);
  if (existing) {
    return cards.map(c => (c.id === id ? { ...c, prompt, dueDay: today, box: 1 } : c));
  }
  return [...cards, newCard(itemId, questionId, prompt, today)];
}

export function dropCard(cards: LeitnerCard[], id: string): LeitnerCard[] {
  return cards.filter(c => c.id !== id);
}

export function localDayFromDate(d: Date = new Date()): string {
  return localDay(d);
}
