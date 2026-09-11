import React from 'react';
import { AVAILABLE_MODELS } from '../engine/webllm_spindle';
import { PERSONALITIES } from '../data/personalities';

export { PERSONALITIES };
export const SYSTEM_PRESETS = PERSONALITIES;

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: string;
  onSelectModel: (id: string) => void;
  selectedPreset: string;
  onSelectPreset: (id: string) => void;
  customPrompt: string;
  onChangeCustomPrompt: (prompt: string) => void;
  toolsEnabled: boolean;
  onToggleTools: () => void;
  extendedThinking: boolean;
  onToggleExtendedThinking: () => void;
  temperature: number;
  onChangeTemperature: (t: number) => void;
  searxngUrl: string;
  onChangeSearxngUrl: (url: string) => void;
  showWelcomeMessage: boolean;
  onToggleWelcomeMessage: () => void;
  onOpenProfiles?: () => void;
  onOpenPersonalityModal?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  selectedModel,
  onSelectModel,
  selectedPreset,
  onSelectPreset,
  customPrompt,
  onChangeCustomPrompt,
  toolsEnabled,
  onToggleTools,
  extendedThinking,
  onToggleExtendedThinking,
  temperature,
  onChangeTemperature,
  searxngUrl,
  onChangeSearxngUrl,
  showWelcomeMessage,
  onToggleWelcomeMessage,
  onOpenProfiles,
  onOpenPersonalityModal
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1rem'
    }}>
      <div className="card-panel" style={{ width: '100%', maxWidth: '580px', padding: '1.75rem', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>⚙️</span> EasyLM Settings
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#71717a', fontSize: '1.4rem', cursor: 'pointer' }}
            title="Close settings"
          >
            ×
          </button>
        </div>

        {/* Family Profiles & Sovereign Memory Access */}
        {onOpenProfiles && (
          <div style={{ marginBottom: '1.25rem' }}>
            <button
              onClick={() => {
                onClose();
                onOpenProfiles();
              }}
              className="btn-pill"
              style={{
                width: '100%',
                justifyContent: 'space-between',
                padding: '0.65rem 0.85rem',
                backgroundColor: 'rgba(139, 92, 246, 0.12)',
                borderColor: 'rgba(139, 92, 246, 0.35)',
                color: '#ffffff'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <span>👨‍👩‍👧</span>
                <span style={{ fontWeight: 500 }}>Family Profiles, Kid Safe & Sovereign Memory</span>
              </span>
              <span style={{ fontSize: '0.75rem', color: '#a78bfa' }}>Manage →</span>
            </button>
          </div>
        )}

        {/* Model Selector */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#a78bfa', marginBottom: '0.4rem' }}>
            Select Local AI Model:
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {AVAILABLE_MODELS.map(m => (
              <div
                key={m.id}
                onClick={() => onSelectModel(m.id)}
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  backgroundColor: selectedModel === m.id ? 'rgba(139, 92, 246, 0.18)' : '#111118',
                  border: selectedModel === m.id ? '1px solid #8b5cf6' : '1px solid rgba(139, 92, 246, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.85rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#ffffff' }}>{m.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#71717a' }}>{m.vramEst} VRAM required · Runs 100% on your device</div>
                </div>
                {selectedModel === m.id && <span style={{ color: '#8b5cf6', fontSize: '1.1rem' }}>✓</span>}
              </div>
            ))}
          </div>
        </div>

        {/* AI Personality Selector */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.45rem' }}>
            <label style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#a78bfa', margin: 0 }}>
              AI Personality & Voice:
            </label>
            {onOpenPersonalityModal && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPersonalityModal();
                }}
                className="btn-pill"
                style={{
                  fontSize: '0.72rem',
                  padding: '0.2rem 0.65rem',
                  backgroundColor: 'rgba(139, 92, 246, 0.15)',
                  borderColor: '#8b5cf6',
                  color: '#c4b5fd',
                  gap: '0.3rem'
                }}
                title="Open 22-Perspective Categorized Gallery"
              >
                <span>🎭</span>
                <span>Browse Gallery ({PERSONALITIES.length}) →</span>
              </button>
            )}
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.45rem',
            marginBottom: '0.6rem',
            maxHeight: '200px',
            overflowY: 'auto',
            paddingRight: '0.2rem'
          }}>
            {PERSONALITIES.map(p => (
              <button
                key={p.id}
                onClick={() => onSelectPreset(p.id)}
                className="btn-pill"
                style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.01em',
                  padding: '0.5rem 0.55rem',
                  justifyContent: 'flex-start',
                  gap: '0.35rem',
                  backgroundColor: selectedPreset === p.id ? '#8b5cf6' : '#111118',
                  color: selectedPreset === p.id ? '#000000' : '#ffffff',
                  border: selectedPreset === p.id ? '1px solid #8b5cf6' : '1px solid rgba(139, 92, 246, 0.25)',
                  fontWeight: selectedPreset === p.id ? 700 : 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                title={p.name}
              >
                {p.avatar && <span>{p.avatar}</span>}
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
              </button>
            ))}
          </div>

          {/* Selected Personality Metadata Box */}
          {(() => {
            const active = PERSONALITIES.find(p => p.id === selectedPreset);
            if (!active) return null;
            return (
              <div style={{
                backgroundColor: 'rgba(139, 92, 246, 0.08)',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                marginBottom: '0.5rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {active.avatar && <span>{active.avatar}</span>}
                    <span>{active.name}</span>
                  </span>
                  {active.era && (
                    <span style={{ fontSize: '0.68rem', color: '#8b5cf6', fontFamily: 'var(--font-mono)' }}>
                      {active.era}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#a1a1aa', lineHeight: 1.4 }}>
                  {active.description}
                </div>
                {active.writingStyle && (
                  <div style={{ fontSize: '0.68rem', color: '#71717a', fontStyle: 'italic', marginTop: '0.25rem' }}>
                    ✍️ {active.writingStyle}
                  </div>
                )}
              </div>
            );
          })()}

          {selectedPreset === 'custom' && (
            <textarea
              value={customPrompt}
              onChange={(e) => onChangeCustomPrompt(e.target.value)}
              placeholder="Paste your custom personality instructions here..."
              rows={4}
              style={{
                width: '100%',
                background: '#07070a',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '12px',
                color: '#ffffff',
                padding: '0.75rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                resize: 'vertical'
              }}
            />
          )}
        </div>

        {/* SearXNG Endpoint Configuration */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#a78bfa', marginBottom: '0.4rem' }}>
            Web Search Endpoint (SearXNG / Gateway):
          </label>
          <input
            type="text"
            value={searxngUrl}
            onChange={(e) => onChangeSearxngUrl(e.target.value)}
            placeholder="Default: /api/search (or http://localhost:8080)"
            style={{
              width: '100%',
              background: '#07070a',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '12px',
              color: '#ffffff',
              padding: '0.6rem 0.75rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem'
            }}
          />
          <div style={{ fontSize: '0.7rem', color: '#71717a', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
            Leave empty to use built-in search gateway (/api/search + Wikipedia fallback).
          </div>
        </div>

        {/* Feature Toggles */}
        <div style={{ marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '0.6rem 0.75rem', background: '#111118', borderRadius: '12px' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>👋 Show Toolbox Guide on fresh chats</div>
              <div style={{ fontSize: '0.7rem', color: '#71717a' }}>Explains in-app tools (weather, currency, math, dictionary) on load</div>
            </div>
            <input
              type="checkbox"
              checked={showWelcomeMessage}
              onChange={onToggleWelcomeMessage}
              style={{ accentColor: '#8b5cf6', width: '1.1rem', height: '1.1rem' }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '0.6rem 0.75rem', background: '#111118', borderRadius: '12px' }}>
            <span style={{ fontSize: '0.85rem' }}>⚡ In-App Hands (Weather, FX, Facts, Dictionary, Math, Web)</span>
            <input
              type="checkbox"
              checked={toolsEnabled}
              onChange={onToggleTools}
              style={{ accentColor: '#8b5cf6', width: '1.1rem', height: '1.1rem' }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '0.6rem 0.75rem', background: '#111118', borderRadius: '12px' }}>
            <span style={{ fontSize: '0.85rem' }}>🧠 Extended Thinking Mode (&lt;think&gt; trace)</span>
            <input
              type="checkbox"
              checked={extendedThinking}
              onChange={onToggleExtendedThinking}
              style={{ accentColor: '#8b5cf6', width: '1.1rem', height: '1.1rem' }}
            />
          </label>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.75rem', background: '#111118', borderRadius: '12px' }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>🛡️ Anti-Loop Sentinel</span>
                <span style={{ fontSize: '0.65rem', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', padding: '0.1rem 0.4rem', borderRadius: '6px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>Active</span>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#71717a' }}>Real-time cycle detection & runaway reasoning pruning for DeepSeek and local models</div>
            </div>
          </div>
        </div>

        {/* Temperature slider */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', marginBottom: '0.3rem' }}>
            <span style={{ color: '#a78bfa' }}>Sampling Temperature:</span>
            <span>{temperature.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.05"
            value={temperature}
            onChange={(e) => onChangeTemperature(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: '#8b5cf6' }}
          />
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="btn-pill btn-pill-primary"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          Save & Return to Chat
        </button>
      </div>
    </div>
  );
};
