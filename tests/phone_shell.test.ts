import { describe, it, expect } from 'vitest';
import {
  DEFAULT_PHONE_TAB,
  NARROW_MAX_PX,
  NARROW_QUERY,
  PHONE_TAB_KEY,
  PHONE_TABS,
  isPhoneTab,
  loadPhoneTab,
  parsePhoneTab,
  savePhoneTab
} from '../src/shell/phone_tabs';

function memStore(seed: Record<string, string> = {}) {
  const m = new Map<string, string>(Object.entries(seed));
  return {
    getItem: (k: string) => (m.has(k) ? m.get(k)! : null),
    setItem: (k: string, v: string) => {
      m.set(k, v);
    },
    dump: () => Object.fromEntries(m)
  };
}

describe('phone tabs', () => {
  it('lists Learn Studio Chat More in that order', () => {
    expect(PHONE_TABS).toEqual(['learn', 'studio', 'chat', 'more']);
  });

  it('defaults to Learn', () => {
    expect(DEFAULT_PHONE_TAB).toBe('learn');
    expect(parsePhoneTab(null)).toBe('learn');
    expect(parsePhoneTab(undefined)).toBe('learn');
    expect(parsePhoneTab('nope')).toBe('learn');
    expect(loadPhoneTab(null)).toBe('learn');
  });

  it('accepts only the four tab ids', () => {
    expect(isPhoneTab('learn')).toBe(true);
    expect(isPhoneTab('studio')).toBe(true);
    expect(isPhoneTab('chat')).toBe(true);
    expect(isPhoneTab('more')).toBe(true);
    expect(isPhoneTab('history')).toBe(false);
    expect(isPhoneTab('')).toBe(false);
  });

  it('persists last tab', () => {
    const store = memStore();
    savePhoneTab(store, 'studio');
    expect(store.dump()[PHONE_TAB_KEY]).toBe('studio');
    expect(loadPhoneTab(store)).toBe('studio');
    savePhoneTab(store, 'chat');
    expect(loadPhoneTab(store)).toBe('chat');
  });

  it('narrow cut is 768', () => {
    expect(NARROW_MAX_PX).toBe(768);
    expect(NARROW_QUERY).toBe('(max-width: 768px)');
  });
});
