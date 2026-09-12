import { describe, expect, it } from 'vitest';
import {
  clampPersonalityIdForRole,
  getPersonalitiesForRole,
  isKidSafePersonality
} from '../data/personalities';

describe('kid-safe personality gallery fence', () => {
  it('marks only socratic_kid as kid-safe', () => {
    expect(isKidSafePersonality('socratic_kid')).toBe(true);
    expect(isKidSafePersonality('friendly')).toBe(false);
    expect(isKidSafePersonality('ahab')).toBe(false);
    expect(isKidSafePersonality('custom')).toBe(false);
  });

  it('kid gallery exposes only kid-safe voices', () => {
    const gallery = getPersonalitiesForRole('kid');
    expect(gallery.length).toBeGreaterThan(0);
    expect(gallery.every(p => p.id === 'socratic_kid')).toBe(true);
  });

  it('clamps adult voices to socratic_kid under kid role', () => {
    expect(clampPersonalityIdForRole('ahab', 'kid')).toBe('socratic_kid');
    expect(clampPersonalityIdForRole('socratic_kid', 'kid')).toBe('socratic_kid');
    expect(clampPersonalityIdForRole('ahab', 'parent')).toBe('ahab');
  });
});
