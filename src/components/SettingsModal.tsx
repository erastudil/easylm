import React from 'react';
import { AVAILABLE_MODELS } from '../engine/webllm_spindle';
import { Preset } from '../types';

export const SYSTEM_PRESETS: Preset[] = [
  {
    id: 'general',
    name: 'General Assistant',
    description: 'Helpful, clean, balanced conversational AI.',
    systemPrompt: 'You are EasyLM, an intelligent, private, and helpful AI assistant running locally in the user browser via WebGPU. Deliver clear, high-quality, and direct answers in markdown.'
  },
  {
    id: 'progen',
    name: 'Progen / High-Density Coder',
    description: 'Ruthless token efficiency, topic : comment, Cascadia code.',
    systemPrompt: 'You are EasyLM in Progen Mode. Follow Progen dialect: use "topic : comment" structure. No pleasantries, no recap, zero marketing filler. Produce pure, verified, executable code and dense technical analysis.'
  },
  {
    id: 'thinker',
    name: 'Deep Thinker / Analytical',
    description: 'Step-by-step problem breakdown, exhaustive edge case analysis.',
    systemPrompt: 'You are EasyLM in Deep Reasoning Mode. Before emitting your conclusion, carefully dissect assumptions, inspect edge cases, and eliminate failure modes step-by-step inside <think>...</think> tags.'
  },
  {
    id: 'editor',
    name: 'Authoritative Writing & Polish',
    description: 'Polished, authoritative prose with zero AI clichés.',
    systemPrompt: 'You are EasyLM Editor. Polish the text for punch, cadence, and clarity. Eliminate clichés, corporate filler, and passive voice.'
  },
  {
    id: 'custom',
    name: 'Custom System Prompt',
    description: 'User-specified mandate.',
    systemPrompt: ''
  }
];

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
  onChangeTemperature
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100
    }}>
      <div className="card-panel" style={{ width: '90%', maxWidth: '580px', padding: '1.75rem', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-mono)' }}>
            ⚙️ EasyLM Configuration
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#71717a', fontSize: '1.2rem', cursor: 'pointer' }}
            title="Close settings"
          >
            ×
          </button>
        </div>

        {/* Model Spindle Selector */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#a78bfa', marginBottom: '0.4rem' }}>
            Local WebGPU Model:
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {AVAILABLE_MODELS.map(m => (
              <div
                key={m.id}
                onClick={() => onSelectModel(m.id)}
                style={{
                  padding: '0.6rem 0.85rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  backgroundColor: selectedModel === m.id ? 'rgba(139, 92, 246, 0.2)' : '#111118',
                  border: selectedModel === m.id ? '1px solid #8b5cf6' : '1px solid rgba(139, 92, 246, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '0.85rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#ffffff' }}>{m.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#71717a' }}>{m.vramEst} VRAM required</div>
                </div>
                {selectedModel === m.id && <span style={{ color: '#8b5cf6', fontSize: '1.1rem' }}>✓</span>}
              </div>
            ))}
          </div>
        </div>

        {/* System Prompt Presets */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#a78bfa', marginBottom: '0.4rem' }}>
            System Mandate Preset:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginBottom: '0.6rem' }}>
            {SYSTEM_PRESETS.map(p => (
              <button
                key={p.id}
                onClick={() => onSelectPreset(p.id)}
                className="btn-pill"
                style={{
                  fontSize: '0.75rem',
                  padding: '0.4rem 0.6rem',
                  justifyContent: 'center',
                  backgroundColor: selectedPreset === p.id ? '#8b5cf6' : '#111118',
                  color: selectedPreset === p.id ? '#000000' : '#ffffff',
                  fontWeight: selectedPreset === p.id ? 600 : 400
                }}
              >
                {p.name}
              </button>
            ))}
          </div>

          {selectedPreset === 'custom' && (
            <textarea
              value={customPrompt}
              onChange={(e) => onChangeCustomPrompt(e.target.value)}
              placeholder="Paste your custom system instructions here..."
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

        {/* Feature Toggles */}
        <div style={{ marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '0.5rem', background: '#111118', borderRadius: '12px' }}>
            <span style={{ fontSize: '0.85rem' }}>⚡ In-App Hands (Math, Units, Web Search, Warehouse)</span>
            <input
              type="checkbox"
              checked={toolsEnabled}
              onChange={onToggleTools}
              style={{ accentColor: '#8b5cf6', width: '1.1rem', height: '1.1rem' }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', padding: '0.5rem', background: '#111118', borderRadius: '12px' }}>
            <span style={{ fontSize: '0.85rem' }}>🧠 Extended Thinking / Scratchpad Mode</span>
            <input
              type="checkbox"
              checked={extendedThinking}
              onChange={onToggleExtendedThinking}
              style={{ accentColor: '#8b5cf6', width: '1.1rem', height: '1.1rem' }}
            />
          </label>
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
