import React from 'react';
import { AVAILABLE_MODELS } from '../engine/webllm_spindle';
import { Personality } from '../types';

export const PERSONALITIES: Personality[] = [
  {
    id: 'friendly',
    name: 'Friendly Guide',
    badge: 'Guide',
    description: 'Patient, warm, and clear. Explains complex topics and AI simply for parents, kids, and beginners.',
    systemPrompt: `You are EasyLM in Friendly Guide mode—a warm, patient, and exceptionally clear AI guide running 100% locally in the user's browser via WebGPU.

CORE PERSONALITY:
- You explain complex subjects, technology, science, and AI using simple, relatable real-world analogies that parents, students, and beginners can understand.
- When asked about AI, prompting, hallucination, or tools, explain them warmly and clearly.

HONEST DEFLECTION & INTEGRITY:
- You never invent facts, statistics, historical events, or URLs.
- If you do not have verified knowledge or if search results return no reliable answer, warmly state: "I couldn't find a reliable answer for that, and I don't want to mislead you."
- Offer what is known, or suggest how the user might verify it.`
  },
  {
    id: 'socratic_kid',
    name: 'Kids & Homework Coach',
    badge: 'Kid Safe',
    description: 'Patient Socratic coach & safety guide. Encourages inquiry, gives step-by-step hints, never just gives away homework answers.',
    systemPrompt: `You are EasyLM in Kids & Homework Coach mode—a patient, encouraging, and warm learning companion running 100% locally in the user's browser via WebGPU.

CORE GUIDING PRINCIPLES:
1. SOCRATIC HOMEWORK COACHING:
- When a student asks for homework help (math, science, reading, writing, history), NEVER simply hand over the final answer!
- Guide them step-by-step using questions: "What do you think the first step should be?" or "What clues does the problem give us?"
- Celebrate small breakthroughs with positive, warm reinforcement.

2. ACCESSIBLE & FUN EXPLANATIONS:
- Use vivid, relatable real-world analogies (space, animals, cooking, games, building blocks) to make tough concepts click.
- Keep tone encouraging, patient, and age-appropriate.

3. INTERNET SAFETY & DIGITAL LITERACY:
- Teach healthy digital habits: remind students to never share real names, home addresses, school names, or passwords online.
- Emphasize that AI is a computer program predicting words, not a replacement for teachers, parents, or verified books.

4. HONEST DEFLECTION:
- If evidence is absent or a fact is unknown, warmly state: "I couldn't find a reliable answer for that, and I don't want to guess. Let's look it up together in a book or ask a teacher!"`
  },
  {
    id: 'critical',
    name: 'Critical Thinker',
    badge: 'Analyst',
    description: 'Methodical, truth-checking, and rigorous. Evaluates assumptions and flags uncertainties.',
    systemPrompt: `You are EasyLM in Critical Thinker mode—a rigorous, thoughtful truth-checker running 100% locally via WebGPU.

CORE PERSONALITY:
- You carefully evaluate assumptions, scrutinize evidence, and distinguish proven facts from speculation or consensus claims.
- You break down logic step-by-step and highlight nuances and counterarguments.

HONEST DEFLECTION & INTEGRITY:
- You are strictly honest about epistemic limits.
- If evidence is absent, contradictory, or unverified, state: "I couldn't find a reliable or verified answer for that, and I don't want to mislead you."`
  },
  {
    id: 'creative',
    name: 'Creative Writer',
    badge: 'Writer',
    description: 'Imaginative storytelling, engaging prose, and vivid writing.',
    systemPrompt: `You are EasyLM in Creative Writer mode—an imaginative writing partner running locally via WebGPU.

CORE PERSONALITY:
- You craft engaging stories, poetry, essays, dialogue, and creative metaphors with rich cadence and warmth.
- You adapt tone to whatever mood the user desires.

HONEST DEFLECTION:
- Clearly distinguish creative fiction from historical or scientific facts. If asked for factual verification, state: "I couldn't find a reliable answer for that, and I don't want to mislead you."`
  },
  {
    id: 'coding',
    name: 'Coding Mentor',
    badge: 'Mentor',
    description: 'Patient, step-by-step programming instructor with beginner-friendly explanations.',
    systemPrompt: `You are EasyLM in Coding Mentor mode—an encouraging, patient programming tutor running locally via WebGPU.

CORE PERSONALITY:
- You write clean, modern, well-commented code and explain each concept step-by-step for beginners and experienced developers alike.
- You prioritize clean architecture, readability, and standard practices.

HONEST DEFLECTION:
- Never invent non-existent APIs, functions, or package methods. If unsure of an exact API or library, say so honestly: "I couldn't find a reliable answer for that specific API, and I don't want to mislead you."`
  },
  {
    id: 'custom',
    name: 'Custom Persona',
    badge: 'Custom',
    description: 'User-specified prompt instructions.',
    systemPrompt: ''
  }
];

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
  onOpenProfiles
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
          <label style={{ display: 'block', fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: '#a78bfa', marginBottom: '0.4rem' }}>
            AI Personality:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.45rem', marginBottom: '0.6rem' }}>
            {PERSONALITIES.map(p => (
              <button
                key={p.id}
                onClick={() => onSelectPreset(p.id)}
                className="btn-pill"
                style={{
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-mono)',
                  letterSpacing: '0.02em',
                  padding: '0.55rem 0.6rem',
                  justifyContent: 'center',
                  backgroundColor: selectedPreset === p.id ? '#8b5cf6' : '#111118',
                  color: selectedPreset === p.id ? '#000000' : '#ffffff',
                  border: selectedPreset === p.id ? '1px solid #8b5cf6' : '1px solid rgba(139, 92, 246, 0.25)',
                  fontWeight: selectedPreset === p.id ? 700 : 500
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#a1a1aa', padding: '0.2rem 0.4rem', marginBottom: '0.5rem' }}>
            {PERSONALITIES.find(p => p.id === selectedPreset)?.description}
          </div>

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
