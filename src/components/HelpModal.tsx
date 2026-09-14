import React, { useState } from 'react';
import { EASYLM_HELP_SECTIONS } from '../data/help_guide';
import { HnaiLogo } from './HnaiLogo';
import { MarkdownRenderer } from './MarkdownRenderer';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenWelcomeGuide?: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, onOpenWelcomeGuide }) => {
  const [activeTab, setActiveTab] = useState<string>(EASYLM_HELP_SECTIONS[0].id);

  if (!isOpen) return null;

  const currentSection = EASYLM_HELP_SECTIONS.find(s => s.id === activeTab) || EASYLM_HELP_SECTIONS[0];

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
        zIndex: 110,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        className="card-panel"
        style={{
          width: '96vw',
          maxWidth: '1440px',
          height: '92vh',
          minHeight: '600px',
          maxHeight: '95vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: '#0a0a10',
          border: '1px solid rgba(139, 92, 246, 0.4)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#08080d',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <HnaiLogo size="sm" />
            <h2 style={{ margin: 0, fontSize: '1.15rem', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
              EasyLM Guide &amp; Knowledge Base
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#a1a1aa',
              fontSize: '1.4rem',
              cursor: 'pointer',
              padding: '0.2rem 0.5rem',
              borderRadius: '6px'
            }}
            title="Close guide"
          >
            ×
          </button>
        </div>

        {/* Content Layout (Sidebar tabs + Main pane) */}
        <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden', flexDirection: 'row' }} className="help-modal-body">
          {/* Navigation Sidebar */}
          <div style={{
            width: '260px',
            minWidth: '240px',
            backgroundColor: '#07070b',
            borderRight: '1px solid rgba(139, 92, 246, 0.15)',
            padding: '0.75rem',
            overflowY: 'auto',
            flexShrink: 0
          }}>
            {EASYLM_HELP_SECTIONS.map((sec) => {
              const isActive = sec.id === activeTab;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveTab(sec.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '10px',
                    marginBottom: '0.35rem',
                    cursor: 'pointer',
                    fontSize: '0.82rem',
                    fontFamily: 'var(--font-sans)',
                    fontWeight: isActive ? 600 : 400,
                    backgroundColor: isActive ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                    border: isActive ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
                    color: isActive ? '#ffffff' : '#a1a1aa',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ fontWeight: 600 }}>{sec.title}</div>
                  <div style={{ fontSize: '0.7rem', color: '#71717a', marginTop: '0.15rem' }}>{sec.summary}</div>
                </button>
              );
            })}
          </div>

          {/* Section Body */}
          <div style={{ flex: 1, minHeight: 0, padding: '1.75rem 2rem', overflowY: 'auto', backgroundColor: '#0a0a10' }}>
            <MarkdownRenderer content={currentSection.content} />
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '0.85rem 1.5rem',
          borderTop: '1px solid rgba(139, 92, 246, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#07070b',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color: '#71717a', fontFamily: 'var(--font-mono)' }}>
              Tip: You can also type "help" directly in chat anytime!
            </span>
            {onOpenWelcomeGuide && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenWelcomeGuide();
                }}
                className="btn-pill"
                style={{
                  fontSize: '0.72rem',
                  padding: '0.2rem 0.65rem',
                  borderColor: 'rgba(139, 92, 246, 0.3)',
                  color: '#c4b5fd'
                }}
              >
                👋 View Welcome Guide
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="btn-pill btn-pill-primary"
            style={{ fontSize: '0.8rem', padding: '0.35rem 1rem' }}
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
