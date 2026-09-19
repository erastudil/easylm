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
  it('lists Chat Studio Learn Options in that order', () => {
    expect(PHONE_TABS).toEqual(['chat', 'studio', 'learn', 'options']);
  });

  it('defaults to Chat', () => {
    expect(DEFAULT_PHONE_TAB).toBe('chat');
    expect(parsePhoneTab(null)).toBe('chat');
    expect(parsePhoneTab(undefined)).toBe('chat');
    expect(parsePhoneTab('nope')).toBe('chat');
    expect(loadPhoneTab(null)).toBe('chat');
  });

  it('migrates legacy more tab to options', () => {
    expect(parsePhoneTab('more')).toBe('options');
  });

  it('accepts only the four tab ids', () => {
    expect(isPhoneTab('chat')).toBe(true);
    expect(isPhoneTab('studio')).toBe(true);
    expect(isPhoneTab('learn')).toBe(true);
    expect(isPhoneTab('options')).toBe(true);
    expect(isPhoneTab('more')).toBe(false);
    expect(isPhoneTab('history')).toBe(false);
    expect(isPhoneTab('')).toBe(false);
  });

  it('persists last tab', () => {
    const store = memStore();
    savePhoneTab(store, 'studio');
    expect(store.dump()[PHONE_TAB_KEY]).toBe('studio');
    expect(loadPhoneTab(store)).toBe('studio');
    savePhoneTab(store, 'options');
    expect(loadPhoneTab(store)).toBe('options');
  });

  it('narrow cut is 768', () => {
    expect(NARROW_MAX_PX).toBe(768);
    expect(NARROW_QUERY).toBe('(max-width: 768px)');
  });
});
