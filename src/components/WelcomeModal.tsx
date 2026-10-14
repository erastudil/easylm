import React, { useState } from 'react';
import { HnaiLogo } from './HnaiLogo';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: (dontShowAgain: boolean) => void;
  onOpenHelp?: () => void;
  onOpenVoices?: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({
  isOpen,
  onClose,
  onOpenHelp,
  onOpenVoices
}) => {
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 130,
        padding: '1rem'
      }}
      onClick={() => onClose(dontShowAgain)}
    >
      <div
        className="card-panel"
        style={{
          width: '95vw',
          maxWidth: '1040px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: '#09090f',
          border: '1px solid rgba(139, 92, 246, 0.45)',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(139, 92, 246, 0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '1.1rem 1.5rem',
          borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#07070c',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <HnaiLogo size="sm" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ffffff' }}>
                  Welcome to EasyLM
                </h2>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  fontFamily: 'var(--font-mono)',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '6px',
                  backgroundColor: 'rgba(139, 92, 246, 0.25)',
                  border: '1px solid #8b5cf6',
                  color: '#c4b5fd'
                }}>
                  PUBLIC BETA
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>
                A free tutor that runs on your device · No account, nothing to install
              </div>
            </div>
          </div>
          <button
            onClick={() => onClose(dontShowAgain)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#a1a1aa',
              fontSize: '1.35rem',
              cursor: 'pointer',
              padding: '0.2rem 0.5rem',
              lineHeight: 1
            }}
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Body: Responsive 3-Column Grid utilizing width and minimizing vertical scroll */}
        <div style={{
          padding: '1.25rem 1.5rem',
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
          alignContent: 'start'
        }}>
          {/* Column 1: Private by design */}
          <div style={{
            backgroundColor: '#0d0d16',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '14px',
            padding: '1.1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>🛡️</span>
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                Private by design
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#a1a1aa', lineHeight: 1.55 }}>
              Everything happens on your own computer or phone. What you type stays here — it is never sent to us or anyone else.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.76rem', color: '#d4d4d8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: '#34d399' }}>✓</span>
                <span>No account to create, no sign-up</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: '#34d399' }}>✓</span>
                <span>Works offline once a chat model is downloaded</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: '#34d399' }}>✓</span>
                <span>If you turn on web lookups, only that lookup leaves your device</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: '#34d399' }}>✓</span>
                <span>Free forever</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', marginTop: '0.35rem', paddingTop: '0.45rem', borderTop: '1px solid rgba(255, 255, 255, 0.07)' }}>
                <span style={{ color: '#c4b5fd' }}>🔐</span>
                <span style={{ fontSize: '0.73rem', color: '#c4b5fd', lineHeight: 1.45 }}>
                  Sharing this computer? You can lock EasyLM with a PIN or password in Settings.
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Try it right away */}
          <div style={{
            backgroundColor: '#0d0d16',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '14px',
            padding: '1.1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>⚡</span>
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                Try it right away
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#a1a1aa', lineHeight: 1.55 }}>
              These work the moment the page opens — no download needed:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.76rem', color: '#d4d4d8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>🧮</span>
                <span><strong>Exact math answers</strong>: try <code>sqrt(144) * (50 + 2)</code></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>📏</span>
                <span><strong>Convert anything</strong>: try <code>100 km/h to mph</code></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>📚</span>
                <span><strong>A built-in library of 32 textbooks</strong>: try “open the astronomy book”</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>🕒</span>
                <span><strong>World clock</strong>: try “what time is it in Tokyo?”</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>🌐</span>
                <span><strong>Optional web lookups</strong> for current facts (off in Kid Safe mode)</span>
              </div>
            </div>
          </div>

          {/* Column 3: Make it yours */}
          <div style={{
            backgroundColor: '#0d0d16',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '14px',
            padding: '1.1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>💡</span>
              <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                Make it yours
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#a1a1aa', lineHeight: 1.55 }}>
              When you are ready, you can:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.76rem', color: '#d4d4d8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>💬</span>
                <span><strong>Download a chat model</strong> (one time, free) for full conversations and step-by-step explanations</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>🎭</span>
                <span><strong>Talk with 65+ voices</strong> — philosophers, authors, scientists, and characters</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>🧠</span>
                <span><strong>Turn on step-by-step answers</strong> to see how a result is reached</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>🔒</span>
                <span><strong>Set up Kid Safe mode</strong> with a parent PIN — age-appropriate, on-device only</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>💾</span>
                <span><strong>Back up or move your chats</strong> from Settings</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer: Do not show again checkbox + Action button */}
        <div style={{
          padding: '0.9rem 1.5rem',
          borderTop: '1px solid rgba(139, 92, 246, 0.2)',
          backgroundColor: '#07070c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          flexShrink: 0
        }}>
          {/* Checkbox */}
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            userSelect: 'none'
          }}>
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              style={{
                accentColor: '#8b5cf6',
                width: '1.05rem',
                height: '1.05rem',
                cursor: 'pointer'
              }}
            />
            <span style={{ fontSize: '0.8rem', color: '#d4d4d8' }}>
              Don't show this welcome guide on startup
            </span>
          </label>

          {/* Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            {onOpenVoices && (
              <button
                onClick={() => {
                  onClose(dontShowAgain);
                  onOpenVoices();
                }}
                className="btn-pill"
                style={{
                  fontSize: '0.78rem',
                  padding: '0.35rem 0.85rem',
                  borderColor: 'rgba(139, 92, 246, 0.35)',
                  color: '#c4b5fd'
                }}
              >
                <span>🎭</span> Browse Voices
              </button>
            )}
            <button
              onClick={() => onClose(dontShowAgain)}
              className="btn-pill btn-pill-primary"
              style={{
                fontSize: '0.82rem',
                padding: '0.45rem 1.25rem',
                fontWeight: 600
              }}
            >
              Start Exploring EasyLM →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
