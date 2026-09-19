import React from 'react';
import { PhoneTab } from './phone_tabs';

const TABS: Array<{ id: PhoneTab; label: string }> = [
  { id: 'chat', label: 'Chat' },
  { id: 'studio', label: 'Studio' },
  { id: 'learn', label: 'Learn' },
  { id: 'options', label: 'Options' }
];

export const BottomNav: React.FC<{
  tab: PhoneTab;
  onTab: (tab: PhoneTab) => void;
}> = ({ tab, onTab }) => {
  return (
    <nav className="phone-bottom-nav" aria-label="EasyLM">
      {TABS.map((t) => {
        const on = tab === t.id;
        return (
          <button
            key={t.id}
            type="button"
            className={on ? 'phone-tab phone-tab-on' : 'phone-tab'}
            onClick={() => onTab(t.id)}
            title={t.label}
            aria-current={on ? 'page' : undefined}
          >
            {t.label}
          </button>
        );
      })}
    </nav>
  );
};
