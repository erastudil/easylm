import React, { useRef } from 'react';
import { Session, TriLakeRating } from '../types';
import { AttachedDoc } from '../engine/family';
import { MessageItem } from '../components/MessageItem';
import { AttachmentBar } from '../components/AttachmentBar';
import { HnaiLogo } from '../components/HnaiLogo';

export interface StarterChip {
  label: string;
  prompt: string;
}

export const ChatPane: React.FC<{
  compact: boolean;
  activeSession: Session | undefined;
  isGenerating: boolean;
  starterChips: StarterChip[];
  personalityName: string;
  inputPrompt: string;
  piiAlert: string | null;
  storageAlert: string | null;
  attachedDoc: AttachedDoc | null;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  modelReady: boolean;
  onLoadModel: () => void;
  onShuffleChips: () => void;
  onSendChip: (prompt: string) => void;
  onOpenWelcome: () => void;
  onOpenVoices: () => void;
  onOpenDocument: (text: string) => void;
  onRateMessage: (messageId: string, rating: TriLakeRating) => void;
  onDismissPii: () => void;
  onDismissStorage: () => void;
  onRemoveDoc: () => void;
  onQuickAction: (prompt: string) => void;
  onFilePicked: (file: File) => void;
  onInputPrompt: (value: string) => void;
  onSend: () => void;
  onStop: () => void;
}> = ({
  compact,
  activeSession,
  isGenerating,
  starterChips,
  personalityName,
  inputPrompt,
  piiAlert,
  storageAlert,
  attachedDoc,
  fileInputRef,
  messagesEndRef,
  modelReady,
  onLoadModel,
  onShuffleChips,
  onSendChip,
  onOpenWelcome,
  onOpenVoices,
  onOpenDocument,
  onRateMessage,
  onDismissPii,
  onDismissStorage,
  onRemoveDoc,
  onQuickAction,
  onFilePicked,
  onInputPrompt,
  onSend,
  onStop
}) => {
  const empty = !activeSession || activeSession.messages.length === 0;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className={compact ? 'chat-pane chat-pane-compact' : 'chat-pane'}>
      <div className="messages-scroll-area">
        <div className="chat-pane-inner">
          {empty ? (
            <div className="chat-empty">
              <div className="chat-empty-brand">
                <HnaiLogo size={compact ? 'sm' : 'md'} />
                <span className="chat-empty-name">EasyLM</span>
              </div>
              {!compact && (
                <p className="chat-empty-lead">
                  Runs 100% locally in your browser
                </p>
              )}
              {!modelReady && (
                <div className="chat-empty-note">
                  <p>
                    Plenty already works offline. Chat answers need a one-time model download.
                  </p>
                  <button type="button" onClick={onLoadModel} className="btn-pill">
                    Load model
                  </button>
                </div>
              )}
              <div className="chat-chip-wrap">
                {starterChips.map((chip) => (
                  <button
                    key={chip.prompt}
                    type="button"
                    onClick={() => onSendChip(chip.prompt)}
                    className="btn-pill chat-chip"
                    title={chip.prompt}
                  >
                    <span>{chip.label}</span>
                  </button>
                ))}
              </div>
              <button type="button" onClick={onShuffleChips} className="btn-pill" title="Shuffle starter questions" aria-label="Shuffle starter questions">
                🔀
              </button>
              <div className="chat-empty-links">
                <button type="button" className="chat-text-link" onClick={onOpenWelcome}>
                  Welcome
                </button>
                <button type="button" className="chat-text-link" onClick={onOpenVoices}>
                  Voice · {personalityName}
                </button>
              </div>
            </div>
          ) : (
            <>
              {activeSession.messages.map((m, idx) => (
                <MessageItem
                  key={m.id}
                  message={m}
                  streaming={isGenerating && idx === activeSession.messages.length - 1 && m.role === 'assistant'}
                  onOpenDocument={(text) => onOpenDocument(text)}
                  onRateMessage={(rating) => onRateMessage(m.id, rating)}
                />
              ))}
              {isGenerating && activeSession.messages[activeSession.messages.length - 1]?.role === 'user' && (
                <div className="flex flex-col w-full items-start my-3.5 prompt-processing-row">
                  <div className="flex items-center gap-1.5 mb-1.5 px-2 text-xs font-mono text-zinc-500">
                    <span style={{ color: '#a78bfa', fontWeight: 600 }}>EasyLM</span>
                    <span>·</span>
                    <span className="animate-pulse" style={{ color: '#34d399', fontWeight: 600 }}>
                      Thinking…
                    </span>
                  </div>
                  <div className="bubble-assistant processing-bubble" style={{ minWidth: '240px', padding: '0.85rem 1.15rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="processing-dots">
                        <span className="processing-dot dot-1" />
                        <span className="processing-dot dot-2" />
                        <span className="processing-dot dot-3" />
                      </div>
                    </div>
                    <div className="processing-shimmer-line" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} style={{ height: '1.5rem', flexShrink: 0 }} />
            </>
          )}
        </div>
      </div>

      <div className="prompt-wrapper">
        {piiAlert && (
          <div className="chat-alert chat-alert-warn">
            <span>{piiAlert}</span>
            <button type="button" onClick={onDismissPii} title="Dismiss">×</button>
          </div>
        )}
        {storageAlert && (
          <div className="chat-alert chat-alert-err">
            <span>{storageAlert}</span>
            <button type="button" onClick={onDismissStorage} title="Dismiss">×</button>
          </div>
        )}

        <AttachmentBar
          doc={attachedDoc}
          onRemove={onRemoveDoc}
          onQuickAction={onQuickAction}
        />

        <div className={`floating-prompt chat-composer${isGenerating ? ' is-generating' : ''}`}>
          <button
            type="button"
            className="chat-attach"
            onClick={() => fileInputRef.current?.click()}
            title="Attach a text file"
          >
            📎
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,.md,.json,.csv,.py,.ts,.js,.rs,.css"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) onFilePicked(e.target.files[0]);
            }}
          />
          <textarea
            ref={textareaRef}
            value={inputPrompt}
            onChange={(e) => onInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder="Ask, do math, paste a link..."
            rows={1}
            className="chat-input"
          />
          {isGenerating ? (
            <button type="button" className="chat-send-btn" onClick={onStop} title="Stop generating" aria-label="Stop generating">
              ■
            </button>
          ) : (
            <button
              type="button"
              className="chat-send-btn"
              onClick={onSend}
              disabled={!inputPrompt.trim()}
              title="Send"
              aria-label="Send"
            >
              ➤
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
