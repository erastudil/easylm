import React, { useRef, useEffect } from 'react';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    const nextH = Math.min(el.scrollHeight, 120);
    el.style.height = `${Math.max(nextH, 36)}px`;
  }, [inputPrompt]);

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
                      Processing prompt...
                    </span>
                  </div>
                  <div className="bubble-assistant processing-bubble" style={{ minWidth: '240px', padding: '0.85rem 1.15rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div className="processing-dots">
                        <span className="processing-dot dot-1" />
                        <span className="processing-dot dot-2" />
                        <span className="processing-dot dot-3" />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                        <span style={{ fontSize: '0.82rem', color: '#ffffff', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                          Processing prompt...
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>
                          WebGPU active · calculating tokens
                        </span>
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
        {isGenerating && (
          <div className="chat-stop-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '0.75rem' }}>
            <div className="processing-pulse-track">
              <div className="processing-pulse-bar" />
              <span className="processing-pulse-text">Model is active · computing response</span>
            </div>
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
