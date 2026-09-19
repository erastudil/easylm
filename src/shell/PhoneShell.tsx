import React from 'react';
import { PhoneTab } from './phone_tabs';
import { BottomNav } from './BottomNav';

export const PhoneShell: React.FC<{
  tab: PhoneTab;
  onTab: (tab: PhoneTab) => void;
  keyboardOpen: boolean;
  learn: React.ReactNode;
  studio: React.ReactNode;
  chat: React.ReactNode;
  more: React.ReactNode;
  sheet?: React.ReactNode;
}> = ({ tab, onTab, keyboardOpen, learn, studio, chat, more, sheet }) => {
  return (
    <div className={`phone-shell${keyboardOpen ? ' phone-shell-kb' : ''}`}>
      <div className="phone-stage">
        <section className="phone-page" hidden={tab !== 'learn'} aria-hidden={tab !== 'learn'}>
          {learn}
        </section>
        <section className="phone-page" hidden={tab !== 'studio'} aria-hidden={tab !== 'studio'}>
          {studio}
        </section>
        <section className="phone-page" hidden={tab !== 'chat'} aria-hidden={tab !== 'chat'}>
          {chat}
        </section>
        <section className="phone-page" hidden={tab !== 'more'} aria-hidden={tab !== 'more'}>
          {more}
        </section>
      </div>
      {!keyboardOpen && <BottomNav tab={tab} onTab={onTab} />}
      {sheet}
    </div>
  );
};
