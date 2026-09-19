export const PHONE_TABS = ['learn', 'studio', 'chat', 'more'] as const;
export type PhoneTab = (typeof PHONE_TABS)[number];

export const DEFAULT_PHONE_TAB: PhoneTab = 'learn';
export const PHONE_TAB_KEY = 'easylm_phone_tab';
export const NARROW_QUERY = '(max-width: 768px)';
export const NARROW_MAX_PX = 768;

export type TabStorage = Pick<Storage, 'getItem' | 'setItem'>;

export function isPhoneTab(value: string | null | undefined): value is PhoneTab {
  return (PHONE_TABS as readonly string[]).includes(value || '');
}

export function parsePhoneTab(raw: string | null | undefined): PhoneTab {
  return isPhoneTab(raw) ? raw : DEFAULT_PHONE_TAB;
}

export function loadPhoneTab(storage: Pick<Storage, 'getItem'> | null | undefined): PhoneTab {
  if (!storage) return DEFAULT_PHONE_TAB;
  try {
    return parsePhoneTab(storage.getItem(PHONE_TAB_KEY));
  } catch {
    return DEFAULT_PHONE_TAB;
  }
}

export function savePhoneTab(storage: Pick<Storage, 'setItem'> | null | undefined, tab: PhoneTab): void {
  if (!storage || !isPhoneTab(tab)) return;
  try {
    storage.setItem(PHONE_TAB_KEY, tab);
  } catch {
    // private mode / quota
  }
}
