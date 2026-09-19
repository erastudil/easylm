import React from 'react';
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
                  Zero-Install Local WebGPU Intelligence · In-Browser Privacy · Deterministic Tools &amp; University Stacks
                </p>
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
                    {compact ? (
                      <span>{chip.label}</span>
                    ) : (
                      <>
                        <span style={{ fontWeight: 600, color: '#c4b5fd' }}>{chip.label}:</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.74rem' }}>{chip.prompt}</span>
                      </>
                    )}
                  </button>
                ))}
              </div>
              <button type="button" onClick={onShuffleChips} className="btn-pill" title="Shuffle starter questions">
                Shuffle
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
              {activeSession.messages.map((m) => (
                <MessageItem
                  key={m.id}
                  message={m}
                  onOpenDocument={(text) => onOpenDocument(text)}
                  onRateMessage={(rating) => onRateMessage(m.id, rating)}
                />
              ))}
              <div ref={messagesEndRef} style={{ height: '1.5rem', flexShrink: 0 }} />
            </>
          )}
        </div>
      </div>

      <div className="prompt-wrapper">
        {isGenerating && (
          <div className="chat-stop-row">
            <button type="button" className="chat-stop-btn" onClick={onStop} title="Stop generating">
              Stop
            </button>
          </div>
        )}

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

        <div className="floating-prompt chat-composer">
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
            <button type="button" className="btn-pill chat-send chat-send-stop" onClick={onStop} title="Stop">
              Stop
            </button>
          ) : (
            <button
              type="button"
              className="btn-pill btn-pill-primary chat-send"
              onClick={onSend}
              disabled={!inputPrompt.trim()}
              title="Send"
            >
              Send
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
