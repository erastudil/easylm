import React from 'react';
import { PhoneTab } from './phone_tabs';
import { BottomNav } from './BottomNav';

export const PhoneShell: React.FC<{
  tab: PhoneTab;
  onTab: (tab: PhoneTab) => void;
  keyboardOpen: boolean;
  chat: React.ReactNode;
  studio: React.ReactNode;
  learn: React.ReactNode;
  options?: React.ReactNode;
  more?: React.ReactNode;
  sheet?: React.ReactNode;
}> = ({ tab, onTab, keyboardOpen, chat, studio, learn, options, more, sheet }) => {
  const optionsPane = options ?? more;
  return (
    <div className={`phone-shell${keyboardOpen ? ' phone-shell-kb' : ''}`}>
      <div className="phone-stage">
        <section className="phone-page" hidden={tab !== 'chat'} aria-hidden={tab !== 'chat'}>
          {chat}
        </section>
        <section className="phone-page" hidden={tab !== 'studio'} aria-hidden={tab !== 'studio'}>
          {studio}
        </section>
        <section className="phone-page" hidden={tab !== 'learn'} aria-hidden={tab !== 'learn'}>
          {learn}
        </section>
        <section className="phone-page" hidden={tab !== 'options'} aria-hidden={tab !== 'options'}>
          {optionsPane}
        </section>
      </div>
      {!keyboardOpen && <BottomNav tab={tab} onTab={onTab} />}
      {sheet}
    </div>
  );
};
