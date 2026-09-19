import React from 'react';

export const ChatPhoneBar: React.FC<{
  title: string;
  modelReady: boolean;
  working: boolean;
  thinkingOn: boolean;
  handsOn: boolean;
  voiceName: string;
  modelLabel: string;
  overflowOpen: boolean;
  onOpenChats: () => void;
  onToggleOverflow: () => void;
  onToggleThink: () => void;
  onToggleHands: () => void;
  onOpenVoice: () => void;
  onOpenModel: () => void;
  onLoadModel: () => void;
  onOpenProfile: () => void;
}> = ({
  title,
  modelReady,
  working,
  thinkingOn,
  handsOn,
  voiceName,
  modelLabel,
  overflowOpen,
  onOpenChats,
  onToggleOverflow,
  onToggleThink,
  onToggleHands,
  onOpenVoice,
  onOpenModel,
  onLoadModel,
  onOpenProfile
}) => {
  const status = working ? 'working' : modelReady ? 'ready' : 'cold';
  return (
    <header className="chat-phone-bar">
      <button type="button" className="chat-phone-chats" onClick={onOpenChats} title="Chats">
        Chats
      </button>
      <div className="chat-phone-title" title={title}>
        <span className={`chat-phone-dot chat-phone-dot-${status}`} title={status} />
        <span className="chat-phone-title-text">{title}</span>
      </div>
      <button type="button" className="chat-phone-more" onClick={onToggleOverflow} title="Chat options" aria-expanded={overflowOpen}>
        ⋯
      </button>
      {overflowOpen && (
        <div className="chat-overflow">
          <button type="button" className="more-row" onClick={onToggleThink} title="Extended thinking">
            <span>Think</span>
            <span>{thinkingOn ? 'ON' : 'OFF'}</span>
          </button>
          <button type="button" className="more-row" onClick={onToggleHands} title="Local tools">
            <span>Hands</span>
            <span>{handsOn ? 'ON' : 'OFF'}</span>
          </button>
          <button type="button" className="more-row" onClick={onOpenVoice} title="Voice">
            <span>Voice</span>
            <span>{voiceName}</span>
          </button>
          <button type="button" className="more-row" onClick={onOpenModel} title="Model">
            <span>Model</span>
            <span>{modelLabel.split('(')[0].trim()}</span>
          </button>
          {!modelReady && (
            <button type="button" className="more-row" onClick={onLoadModel} title="Load model">
              <span>Load</span>
              <span>›</span>
            </button>
          )}
          <button type="button" className="more-row" onClick={onOpenProfile} title="Profile">
            <span>Profile</span>
            <span>›</span>
          </button>
        </div>
      )}
    </header>
  );
};
