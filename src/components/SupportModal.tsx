import React, { useState } from 'react';
import { HnaiLogo } from './HnaiLogo';
import { SUPPORT_STATEMENT, DONATION_METHODS } from '../data/support';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(prev => (prev === id ? null : prev));
    }, 2000);
  };

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
        zIndex: 120,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        className="card-panel"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: '#0a0a10',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(139, 92, 246, 0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '1.2rem 1.4rem',
          borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#08080d'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <HnaiLogo size="sm" />
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#ffffff' }}>
              💜 Support EasyLM
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#a1a1aa',
              fontSize: '1.25rem',
              cursor: 'pointer',
              padding: '0.2rem 0.5rem',
              lineHeight: 1
            }}
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Body Content */}
        <div style={{ padding: '1.4rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Support Statement Box */}
          <div style={{
            backgroundColor: 'rgba(139, 92, 246, 0.08)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '14px',
            padding: '1.1rem 1.25rem',
            lineHeight: 1.65,
            fontSize: '0.9rem',
            color: '#f4f4f5'
          }}>
            <p style={{ margin: '0 0 0.6rem 0', fontWeight: 600, color: '#ffffff' }}>
              EasyLM will always be free. Period. That's the point.
            </p>
            <p style={{ margin: 0, color: '#d4d4d8', fontSize: '0.85rem' }}>
              {SUPPORT_STATEMENT.replace("EasyLM will always be free. Period. That's the point. ", "")}
            </p>
          </div>

          {/* Open Source, Forks & Contributors · AGPL-3.0 */}
          <div style={{
            backgroundColor: '#11111a',
            border: '1px solid rgba(139, 92, 246, 0.35)',
            borderRadius: '14px',
            padding: '1rem 1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem' }}>🐙</span>
                <span style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.92rem' }}>
                  Forks &amp; Contributors
                </span>
              </div>
              <span style={{
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                padding: '0.12rem 0.5rem',
                borderRadius: '6px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.35)',
                color: '#34d399',
                fontWeight: 600
              }}>
                AGPL-3.0 License
              </span>
            </div>

            <p style={{ margin: 0, fontSize: '0.82rem', color: '#a1a1aa', lineHeight: 1.55 }}>
              Copyright (C) 2026 Humans and AI. EasyLM is free software under the copyleft <strong style={{ color: '#ffffff' }}>GNU Affero General Public License v3.0 (AGPL-3.0)</strong>. You can inspect, fork, and share it. Distributed forks and hosted modified copies must stay free. This program comes with ABSOLUTELY NO WARRANTY. The official app stays free forever. Donations only. That is the point.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', marginTop: '0.2rem' }}>
              <a
                href="https://github.com/erastudil/easylm"
                target="_blank"
                rel="noreferrer"
                className="btn-pill"
                style={{
                  fontSize: '0.74rem',
                  padding: '0.25rem 0.75rem',
                  backgroundColor: 'rgba(139, 92, 246, 0.2)',
                  borderColor: '#8b5cf6',
                  color: '#ffffff',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                ⭐ View Repository ↗
              </a>
              <a
                href="https://github.com/erastudil/easylm/fork"
                target="_blank"
                rel="noreferrer"
                className="btn-pill"
                style={{
                  fontSize: '0.74rem',
                  padding: '0.25rem 0.75rem',
                  borderColor: 'rgba(139, 92, 246, 0.4)',
                  color: '#c4b5fd',
                  textDecoration: 'none'
                }}
              >
                🍴 Fork on GitHub ↗
              </a>
              <a
                href="https://github.com/erastudil/easylm/issues"
                target="_blank"
                rel="noreferrer"
                className="btn-pill"
                style={{
                  fontSize: '0.74rem',
                  padding: '0.25rem 0.75rem',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
                  color: '#a1a1aa',
                  textDecoration: 'none'
                }}
              >
                🐞 Issues &amp; PRs ↗
              </a>
            </div>
          </div>

          {/* Donation Methods */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#a78bfa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Donation Methods
            </div>

            {DONATION_METHODS.map(method => {
              const isCopied = copiedId === method.id;
              return (
                <div
                  key={method.id}
                  style={{
                    backgroundColor: '#11111a',
                    border: '1px solid rgba(139, 92, 246, 0.25)',
                    borderRadius: '12px',
                    padding: '0.9rem 1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.92rem' }}>
                        {method.name}
                      </span>
                      <span style={{
                        fontSize: '0.68rem',
                        fontFamily: 'var(--font-mono)',
                        padding: '0.1rem 0.4rem',
                        borderRadius: '6px',
                        backgroundColor: 'rgba(139, 92, 246, 0.2)',
                        color: '#c4b5fd'
                      }}>
                        {method.network}
                      </span>
                    </div>

                    {method.link && (
                      <a
                        href={method.link}
                        target="_blank"
                        rel="noreferrer"
                        className="btn-pill"
                        style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}
                      >
                        Open {method.address} ↗
                      </a>
                    )}
                  </div>

                  {/* Address + Copy row */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: '#07070b',
                    border: '1px solid #272733',
                    borderRadius: '8px',
                    padding: '0.45rem 0.65rem'
                  }}>
                    <span style={{
                      flex: 1,
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.78rem',
                      color: '#a1a1aa',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {method.address}
                    </span>
                    <button
                      onClick={() => handleCopy(method.id, method.address)}
                      className="btn-pill"
                      style={{
                        fontSize: '0.72rem',
                        padding: '0.2rem 0.55rem',
                        backgroundColor: isCopied ? '#10b981' : '#181824',
                        color: isCopied ? '#000000' : '#ffffff',
                        borderColor: isCopied ? '#10b981' : 'rgba(139, 92, 246, 0.3)',
                        fontWeight: isCopied ? 600 : 400
                      }}
                      title="Copy address to clipboard"
                    >
                      {isCopied ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '0.85rem 1.4rem',
          borderTop: '1px solid rgba(139, 92, 246, 0.2)',
          backgroundColor: '#07070a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.75rem',
          fontFamily: 'var(--font-mono)',
          color: '#71717a'
        }}>
          <span>100% Private · Zero Tracking</span>
          <button
            onClick={onClose}
            className="btn-pill btn-pill-primary"
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
