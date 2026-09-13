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
                Zero-Install Local WebGPU Intelligence · Free Forever under GNU AGPL-3.0
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
          {/* Column 1: Sovereign Privacy */}
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
                Sovereign Privacy
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#a1a1aa', lineHeight: 1.55 }}>
              Inference runs <strong style={{ color: '#ffffff' }}>on your GPU</strong> via WebGPU. Prompts and chat history stay in this browser unless you export them.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.76rem', color: '#d4d4d8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: '#34d399' }}>✓</span>
                <span>No accounts. No analytics cookies.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: '#34d399' }}>✓</span>
                <span>Weights stream once from Hugging Face into cache</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: '#34d399' }}>✓</span>
                <span>Hands off: no lookup. Hands on: that lookup leaves the machine.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ color: '#34d399' }}>✓</span>
                <span>Official app free forever. AGPL-3.0 copyleft.</span>
              </div>
            </div>
          </div>

          {/* Column 2: In-App Hands & Library */}
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
                Deterministic Hands
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#a1a1aa', lineHeight: 1.55 }}>
              Deterministic tools execute automatically when exact answers are needed:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.76rem', color: '#d4d4d8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>🧮</span>
                <span><strong>Math Evaluator</strong>: <code>sqrt(144) * (50 + 2)</code></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>📏</span>
                <span><strong>Unit Converter</strong>: <code>100 km/h to mph</code></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>📚</span>
                <span><strong>Dewey Stacks 000–900</strong>: University reference</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>🕒</span>
                <span><strong>World Clock</strong>: Instant local/global time</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>🌐</span>
                <span><strong>Web Hands</strong>: Live lookups (off in Kid Safe)</span>
              </div>
            </div>
          </div>

          {/* Column 3: Navigation & Controls */}
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
                Controls &amp; Voices
              </h3>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#a1a1aa', lineHeight: 1.55 }}>
              Tailor your learning and reasoning experience:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.76rem', color: '#d4d4d8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>🧠</span>
                <span><strong>Think Toggle</strong>: Step-by-step reasoning drawer</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>🎭</span>
                <span><strong>Voices Gallery</strong>: 35+ thinkers, authors &amp; personas</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>💾</span>
                <span><strong>Disk Backup</strong>: Export/restore local JSON archives</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>🔒</span>
                <span><strong>Kid Safe PIN</strong>: Household speed-bump. Local hands only. Not a school filter.</span>
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
            <span style={{ fontSize: '0.7rem', color: '#71717a' }}>
              (reopen anytime in Settings or Help)
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
