import React, { useState, useEffect } from 'react';
import { DeviceInfo } from '../engine/device';
import { CONTRIBUTORS_CREDITS, OPEN_SOURCE_COVENANT } from '../data/credits';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  temperature: number;
  onChangeTemperature: (t: number) => void;
  contextLimit: number;
  onChangeContextLimit: (limit: number) => void;
  searxngUrl: string;
  onChangeSearxngUrl: (url: string) => void;
  showWelcomeMessage: boolean;
  onToggleWelcomeMessage: () => void;
  deviceInfo?: DeviceInfo | null;
  initialTab?: 'engine' | 'credits';
  onOpenModelModal?: () => void;
  onOpenProfiles?: () => void;
  onOpenWelcomeGuide?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  temperature,
  onChangeTemperature,
  contextLimit,
  onChangeContextLimit,
  searxngUrl,
  onChangeSearxngUrl,
  showWelcomeMessage,
  onToggleWelcomeMessage,
  deviceInfo,
  initialTab,
  onOpenModelModal,
  onOpenProfiles,
  onOpenWelcomeGuide
}) => {
  const [activeTab, setActiveTab] = useState<'engine' | 'credits'>(initialTab || 'engine');

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const getTempDescription = (t: number) => {
    if (t <= 0.2) return 'Icy & Deterministic — strictly focused on logic, coding, and exact facts.';
    if (t <= 0.5) return 'Balanced & Articulate — clear, conversational, and reliable.';
    if (t <= 0.8) return 'Creative & Expressive — richer vocabulary and exploratory connections.';
    return 'Highly Imaginative — wild associations, poetry, and unpredictable brainstorming.';
  };

  const recommendedLimit = deviceInfo?.recommendedContextLimit || 4096;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 140,
      padding: '1rem'
    }}>
      <div
        className="card-panel"
        style={{
          width: '100%',
          maxWidth: activeTab === 'credits' ? '680px' : '560px',
          padding: '1.75rem',
          maxHeight: '90vh',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          transition: 'max-width 0.2s ease'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff' }}>
              <span>⚙️</span> EasyLM Settings
            </h2>
            <div style={{ fontSize: '0.76rem', color: '#a1a1aa', marginTop: '0.15rem' }}>
              Inference parameters, context memory, and open-source credits.
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#71717a', fontSize: '1.5rem', cursor: 'pointer', padding: '0 0.25rem' }}
            title="Close"
          >
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          borderBottom: '1px solid rgba(139, 92, 246, 0.25)',
          paddingBottom: '0.6rem'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('engine')}
            className="btn-pill"
            style={{
              fontSize: '0.78rem',
              padding: '0.4rem 0.85rem',
              backgroundColor: activeTab === 'engine' ? 'rgba(139, 92, 246, 0.25)' : '#07070a',
              borderColor: activeTab === 'engine' ? '#8b5cf6' : 'rgba(139, 92, 246, 0.2)',
              color: activeTab === 'engine' ? '#ffffff' : '#a1a1aa',
              fontWeight: activeTab === 'engine' ? 600 : 400
            }}
          >
            ⚙️ Inference &amp; Engine
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('credits')}
            className="btn-pill"
            style={{
              fontSize: '0.78rem',
              padding: '0.4rem 0.85rem',
              backgroundColor: activeTab === 'credits' ? 'rgba(139, 92, 246, 0.25)' : '#07070a',
              borderColor: activeTab === 'credits' ? '#8b5cf6' : 'rgba(139, 92, 246, 0.2)',
              color: activeTab === 'credits' ? '#ffffff' : '#a1a1aa',
              fontWeight: activeTab === 'credits' ? 600 : 400
            }}
          >
            📜 Credits &amp; Open Source ({CONTRIBUTORS_CREDITS.length})
          </button>
        </div>

        {activeTab === 'credits' ? (
          /* Credits & Open Source Attributions View */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Covenant Banner */}
            <div style={{
              backgroundColor: 'rgba(139, 92, 246, 0.08)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '12px',
              padding: '1rem',
              fontSize: '0.78rem',
              lineHeight: 1.55,
              color: '#d4d4d8'
            }}>
              <div style={{ fontWeight: 600, color: '#c4b5fd', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>🛡️</span> {OPEN_SOURCE_COVENANT.title}
              </div>
              <p style={{ margin: '0 0 0.5rem 0', color: '#a1a1aa' }}>
                {OPEN_SOURCE_COVENANT.summary}
              </p>
              <div style={{ fontSize: '0.72rem', color: '#8b5cf6', fontFamily: 'var(--font-mono)' }}>
                Standing on the shoulders of giants · Credit where credit is due.
              </div>
            </div>

            {/* Contributor & Repository Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {CONTRIBUTORS_CREDITS.map(c => (
                <div
                  key={c.id}
                  style={{
                    backgroundColor: '#111118',
                    border: '1px solid rgba(139, 92, 246, 0.25)',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem'
                  }}
                >
                  {/* Contributor Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>
                          {c.name}
                        </span>
                        <a
                          href={c.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '0.74rem',
                            fontFamily: 'var(--font-mono)',
                            color: '#8b5cf6',
                            textDecoration: 'none',
                            backgroundColor: 'rgba(139, 92, 246, 0.15)',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            border: '1px solid rgba(139, 92, 246, 0.3)'
                          }}
                        >
                          @{c.handle} ↗
                        </a>
                        {c.website && (
                          <a
                            href={c.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: '0.72rem',
                              fontFamily: 'var(--font-mono)',
                              color: '#a1a1aa',
                              textDecoration: 'none'
                            }}
                          >
                            {c.website.replace('https://', '')} ↗
                          </a>
                        )}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#a1a1aa', marginTop: '0.15rem' }}>
                        {c.role}
                      </div>
                    </div>
                    <span style={{
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-mono)',
                      color: '#34d399',
                      backgroundColor: 'rgba(52, 211, 153, 0.1)',
                      border: '1px solid rgba(52, 211, 153, 0.25)',
                      borderRadius: '6px',
                      padding: '0.15rem 0.5rem'
                    }}>
                      {c.license}
                    </span>
                  </div>

                  {/* Summary */}
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#d4d4d8', lineHeight: 1.5 }}>
                    {c.summary}
                  </p>

                  {/* Adopted Innovations */}
                  {c.adoptedInnovations.length > 0 && (
                    <div style={{
                      backgroundColor: '#07070a',
                      borderRadius: '8px',
                      padding: '0.6rem 0.75rem',
                      border: '1px solid rgba(255, 255, 255, 0.05)'
                    }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#c4b5fd', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Adopted Innovations &amp; Architectural Influence:
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.72rem', color: '#a1a1aa', lineHeight: 1.45 }}>
                        {c.adoptedInnovations.map((inv, idx) => (
                          <li key={idx} style={{ marginBottom: '0.15rem' }}>{inv}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Repositories */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.15rem' }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Repositories &amp; Code:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.4rem' }}>
                      {c.projects.map(p => (
                        <a
                          key={p.name}
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            display: 'block',
                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                            borderRadius: '6px',
                            padding: '0.45rem 0.6rem',
                            textDecoration: 'none',
                            transition: 'border-color 0.15s ease'
                          }}
                        >
                          <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#c4b5fd', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <span>{p.repo}</span>
                            <span style={{ fontSize: '0.68rem' }}>↗</span>
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#71717a', marginTop: '0.2rem', lineHeight: 1.35 }}>
                            {p.description}
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Inference & Engine Settings View */
          <>
            {/* Sampling Temperature */}
            <div style={{
              backgroundColor: '#111118',
              border: '1px solid rgba(139, 92, 246, 0.25)',
          borderRadius: '12px',
          padding: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#ffffff', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>🌡️</span> Sampling Temperature
            </label>
            <span style={{
              fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              padding: '0.15rem 0.5rem',
              borderRadius: '6px',
              backgroundColor: 'rgba(139, 92, 246, 0.2)',
              color: '#c4b5fd',
              border: '1px solid rgba(139, 92, 246, 0.4)'
            }}>
              {temperature.toFixed(2)}
            </span>
          </div>

          <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.74rem', color: '#a1a1aa', lineHeight: 1.5 }}>
            {getTempDescription(temperature)}
          </p>

          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.05"
            value={temperature}
            onChange={(e) => onChangeTemperature(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#8b5cf6', cursor: 'pointer' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: '#71717a', marginTop: '0.35rem', fontFamily: 'var(--font-mono)' }}>
            <span>0.0 (Strict Logic)</span>
            <span>0.5 (Balanced)</span>
            <span>1.0 (Creative)</span>
          </div>
        </div>

        {/* Context Limit Setting */}
        <div style={{
          backgroundColor: '#111118',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          borderRadius: '12px',
          padding: '1rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ fontSize: '0.84rem', fontWeight: 600, color: '#ffffff', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>📏</span> Context Memory Limit
            </label>
            <span style={{
              fontSize: '0.78rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700,
              padding: '0.15rem 0.5rem',
              borderRadius: '6px',
              backgroundColor: 'rgba(52, 211, 153, 0.15)',
              color: '#34d399',
              border: '1px solid rgba(52, 211, 153, 0.3)'
            }}>
              {contextLimit} tokens (~{Math.round(contextLimit * 0.75)} words)
            </span>
          </div>

          <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.74rem', color: '#a1a1aa', lineHeight: 1.5 }}>
            Defines how much conversation history, long-form documents, and academic library context is retained in WebGPU KV-cache memory during inference. 32k is the standard default for 8GB cards; up to 128k–256k on high-VRAM machines.
          </p>

          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              { val: 8192, label: '8k (Ultralight)' },
              { val: 16384, label: '16k (Light Laptop)' },
              { val: 32768, label: '32k (8GB Default)' },
              { val: 65536, label: '64k (Extended)' },
              { val: 131072, label: '128k (Deep Context)' },
              { val: 262144, label: '256k (Workstation Max)' }
            ].map(opt => {
              const isSelected = contextLimit === opt.val;
              const isRec = opt.val === recommendedLimit;
              return (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => onChangeContextLimit(opt.val)}
                  className="btn-pill"
                  style={{
                    fontSize: '0.74rem',
                    padding: '0.35rem 0.65rem',
                    backgroundColor: isSelected ? 'rgba(139, 92, 246, 0.25)' : '#07070a',
                    borderColor: isSelected ? '#8b5cf6' : 'rgba(139, 92, 246, 0.2)',
                    color: isSelected ? '#ffffff' : '#a1a1aa',
                    fontWeight: isSelected ? 600 : 400
                  }}
                >
                  {opt.label} {isRec ? '✨' : ''}
                </button>
              );
            })}
          </div>
        </div>

        {/* Web Search Endpoint (SearXNG / Custom Gateway) */}
        <div style={{
          backgroundColor: '#111118',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          borderRadius: '12px',
          padding: '1rem'
        }}>
          <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, color: '#ffffff', fontFamily: 'var(--font-mono)', marginBottom: '0.3rem' }}>
            <span>🌐</span> Custom Web Search Endpoint
          </label>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.74rem', color: '#a1a1aa', lineHeight: 1.5 }}>
            Optional private SearXNG instance or custom gateway. Leave empty to use EasyLM's built-in serverless proxy (<code style={{ color: '#c4b5fd' }}>/api/search</code>).
          </p>
          <input
            type="text"
            value={searxngUrl}
            onChange={(e) => onChangeSearxngUrl(e.target.value)}
            placeholder="Default: /api/search (or e.g. http://localhost:8080)"
            style={{
              width: '100%',
              background: '#07070a',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '8px',
              color: '#ffffff',
              padding: '0.55rem 0.75rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem'
            }}
          />
        </div>

        {/* Startup Welcome Guide Toggle */}
        <div style={{
          backgroundColor: '#111118',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          borderRadius: '12px',
          padding: '0.85rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer'
        }} onClick={onToggleWelcomeMessage}>
          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 500, color: '#ffffff' }}>
              👋 Show Welcome Guide on startup
            </div>
            <div style={{ fontSize: '0.72rem', color: '#71717a', marginTop: '0.15rem' }}>
              Displays the interactive zero-install primer when you launch EasyLM.
            </div>
          </div>
          <input
            type="checkbox"
            checked={showWelcomeMessage}
            onChange={onToggleWelcomeMessage}
            style={{ accentColor: '#8b5cf6', width: '1.15rem', height: '1.15rem', cursor: 'pointer' }}
          />
        </div>

        {/* Quick Links / Hardware Summary */}
        {deviceInfo && (
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(139, 92, 246, 0.08)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            borderRadius: '10px',
            fontSize: '0.74rem',
            color: '#a1a1aa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <div>
              <span style={{ color: '#e4e4e7', fontWeight: 600 }}>Detected GPU: </span>
              <span>{deviceInfo.gpuVendor || 'WebGPU'} {deviceInfo.gpuRenderer || ''} (~{deviceInfo.estimatedVRAMGB || 8}GB VRAM)</span>
            </div>
            {onOpenModelModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenModelModal();
                }}
                className="btn-pill"
                style={{
                  fontSize: '0.72rem',
                  padding: '0.2rem 0.6rem',
                  backgroundColor: 'rgba(139, 92, 246, 0.2)',
                  borderColor: '#8b5cf6',
                  color: '#c4b5fd'
                }}
              >
                Browse Models &amp; VRAM Tiers →
              </button>
            )}
          </div>
        )}
        </>
      )}

        {/* Action Button */}
        <button
          onClick={onClose}
          className="btn-pill btn-pill-primary"
          style={{ width: '100%', justifyContent: 'center', padding: '0.65rem', fontSize: '0.85rem' }}
        >
          Done
        </button>
      </div>
    </div>
  );
};
