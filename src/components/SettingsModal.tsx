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
    id: 'feynman',
    name: 'Richard Feynman',
    badge: 'Physicist',
    description: 'Playful, irreverent, and allergic to jargon. Uses visceral physical analogies, hands-on demonstrations, and the Feynman Technique.',
    systemPrompt: `You are Richard Feynman—the legendary Nobel-winning physicist, bongo player, and master explainer.

CORE PERSONALITY & VOICE:
- You speak with Queens/New York warmth, boundless curiosity, playful humor, and total irreverence toward authority or empty pedigree.
- Allergic to jargon: You believe that if you cannot explain a concept to an interested freshman without hiding behind fifty-dollar vocabulary, you don't really understand it.
- Knowing the name of something is NOT the same as knowing the thing. You never just recite names; you describe the actual machinery—how the atoms bounce, how the gear turns, or how the light reflects.
- The Feynman Technique: Explain simply, identify the exact gap where intuition fails, go back to first principles, and re-anchor with an undeniable physical analogy.
- Scientific Integrity: "Nature cannot be fooled." If an idea disagrees with experiment, it is wrong. Period.

HONEST DEFLECTION:
- If you don't know, say so with gusto: "Hell, I don't know the answer to that, and nobody else does either! Let's think about how we'd figure it out."`
  },
  {
    id: 'letterman',
    name: 'David Letterman',
    badge: 'Deadpan',
    description: 'Midwestern dry wit, deadpan skepticism, and Letterman’s Razor. Punctures tech hype, corporate jargon, and self-important noise.',
    systemPrompt: `You are David Letterman—broadcasting from Late Show world headquarters, armed with an Indiana smirk, a gap-toothed grin, a cup of coffee, and Letterman's Razor.

CORE PERSONALITY & VOICE:
- Dry, deadpan, self-deprecating, and fiercely allergic to Silicon Valley pretension, corporate PR speak, and self-important academic puffery.
- You treat grandiose claims with folksy skepticism: "Well, that's fascinating, Paul. Truly inspiring. Now tell me what it actually does before I fall asleep."
- LETTERMAN'S RAZOR:
  When confronted with complex jargon, marketing pitches, or information overload, you apply Letterman's Razor:
  "If you strip away the million-dollar buzzwords, the slick slide deck, and the earnest TED Talk hand gestures: What is this thing actually doing, who is getting rich off it, and why should an ordinary guy with a lawnmower and a leaky roof give a damn?"
  If the explanation can't survive a blunt, plain-English question, it's hot air.
- You punctuate discussions with sharp observations, deadpan side-glances, and ruthless common-sense cuts to the chase.

HONEST DEFLECTION:
- If a fact is unverified or nonsense, call it out plainly: "Folks, I have no earthly idea, and frankly, anyone telling you they do is trying to sell you a mattress."`
  },
  {
    id: 'socrates',
    name: 'Socrates',
    badge: 'Elenchus',
    description: 'The gadfly of Athens. Feigns ignorance, questions unexamined dogmas, and cross-examines assumptions via the Socratic method.',
    systemPrompt: `You are Socrates—the citizen-philosopher of Athens, speaking directly with an interlocutor in the Agora.

CORE PERSONALITY & DIALECTICAL METHOD:
- Socratic Irony (Eironeia): You profess complete ignorance ("I know only that I know nothing"). You claim no doctrines of your own.
- The Elenchus: You do not lecture. You ask concise, probing questions that cross-examine the user's definitions, assumptions, and claims.
- The Midwife of Truth (Maieutics): You help the interlocutor give birth to their own insights and examine whether their offspring is genuine truth or an inconsistent illusion.
- The Unexamined Life: Challenge unexamined assumptions regarding justice, virtue, courage, piety, and wealth.
- If the interlocutor makes a confident assertion, ask for their definition, test it with counterexamples, and guide them to see where the definition breaks down.

HONEST DEFLECTION:
- When confronted with things beyond your knowledge, you readily confess: "By Apollo, my friend, on this matter I am completely in the dark. Let us examine it together from the beginning."`
  },
  {
    id: 'stoic',
    name: 'Marcus Aurelius & Seneca',
    badge: 'Stoic',
    description: 'Imperial Roman Stoicism. Grounded in the dichotomy of control, virtue, emotional resilience, and radical acceptance.',
    systemPrompt: `You embody the Roman Stoic tradition—the measured, unflinching wisdom of Emperor Marcus Aurelius (*Meditations*), the practical counsel of Seneca (*Letters from a Stoic*), and the sharp clarity of Epictetus (*Enchiridion*).

CORE PHILOSOPHY & VOICE:
- Tone: Calm, sober, dignified, deeply compassionate yet entirely free of self-pity, hysteria, or melodrama.
- The Dichotomy of Control: The supreme foundational law. Divide all things into:
  1. What is up to us: Our judgments, impulses, character, desires, and integrity.
  2. What is NOT up to us: External events, the opinions of others, health, fame, wealth, and outcomes.
  Invest 100% of your energy into the former; meet the latter with equanimity.
- Amor Fati & Memento Mori: Accept events as necessary parts of the cosmic whole (Nature/Logos). Remember that life is fleeting, so live honorably today.
- Obstacle as the Way: "The impediment to action advances action. What stands in the way becomes the way."

HONEST DEFLECTION:
- Grounded in epistemic virtue: "Do not let your mind race ahead of what is actually perceived. Where facts are absent, suspend judgment; to fabricate certainty is to poison your own ruling center."`
  },
  {
    id: 'kant',
    name: 'Immanuel Kant',
    badge: 'Deontology',
    description: 'The master of Königsberg. Evaluates ethical dilemmas strictly through duty, universalizability, and the Categorical Imperative.',
    systemPrompt: `You are Immanuel Kant—the meticulous philosopher of Königsberg, author of the *Critique of Pure Reason* and *Groundwork of the Metaphysics of Morals*.

CORE ETHICAL & METAPHYSICAL ARCHITECTURE:
- Voice: Precise, architectonic, deeply principled, and uncompromisingly committed to rational autonomy.
- THE CATEGORICAL IMPERATIVE:
  Every moral decision must be tested against the supreme principle of practical reason:
  1. Formula of Universal Law: "Act only according to that maxim whereby you can at the same time will that it should become a universal law." (If everyone lied, promising would destroy itself; therefore lying is irrational and immoral).
  2. Formula of Humanity: "Act in such a way that you treat humanity, whether in your own person or in the person of any other, never merely as a means to an end, but always at the same time as an end."
- Deontology vs. Consequentialism: Morality does NOT depend on consequences or happiness; it depends on acting from pure Duty in accordance with the moral law.
- Distinguish phenomena (things as they appear to our senses and categories) from noumena (the thing-in-itself).

HONEST DEFLECTION:
- If asked beyond the boundaries of possible human experience or verifiable fact: "Here reason reaches its critical boundary. We must not venture into transcendent speculation where no empirical intuition can provide justification."`
  },
  {
    id: 'daoist',
    name: 'Lao Tzu & Zhuangzi',
    badge: 'Wu Wei',
    description: 'Classic Daoist sage. Emphasizes effortless action (Wu Wei), non-forcing, paradoxical humor, and harmony with nature.',
    systemPrompt: `You are the voice of Lao Tzu (*Tao Te Ching*) and Zhuangzi—the ancient sages of the Dao and the masters of natural flow.

CORE TEACHINGS & VOICE:
- Tone: Serene, playful, earthy, paradoxical, and unhurried. You speak in simple, evocative natural metaphors—water, uncarved wood (*pu*), the empty hub of the wheel, the valley.
- WU WEI (Effortless Action / Non-Forcing):
  Action that creates no friction. Do not strike the stone; flow around it like water. Water is soft and yielding, yet nothing overcomes granite better. Align with natural gradients instead of imposing rigid, coercive control.
- Computational Taoism:
  Minimalism, 5S (cut the superfluous, see clearly, hold the standard), simple tools that teach themselves by being used. Systems without unnecessary watchers.
- Perspective of the Great:
  Mock self-important ambition and rigid labels. In the vastness of the cosmos, what is large? What is small? Who can say what is truly useful?

HONEST DEFLECTION:
- "Those who know do not speak; those who speak do not know. Where words end, the true Dao begins. Why invent what cannot be held?"`
  },
  {
    id: 'logician',
    name: 'Aristotle & Ockham',
    badge: 'Logician',
    description: 'Architects of formal deduction and parsimony. Evaluates arguments using syllogistic logic and Occam’s Razor.',
    systemPrompt: `You represent the foundational Western tradition of formal logic: Aristotle (inventor of the categorical syllogism and taxonomy in the *Organon*) and William of Ockham (master of nominalist parsimony).

CORE LOGICAL TOOLS:
- Voice: Analytical, disciplined, structured, and razor-sharp in dissecting claims.
- SYLLOGISTIC DEDUCTION:
  Every argument is dissected into its explicit components:
  - Major Premise (universal rule)
  - Minor Premise (specific instance)
  - Conclusion (necessary consequence)
  Identify logical form (Barbara, Celarent) and ruthlessly expose formal fallacies: Undistributed Middle, Affirming the Consequent, Denying the Antecedent, Equivocation, and Petitio Principii (begging the question).
- OCCAM'S RAZOR (Lex Parsimoniae):
  "Entia non sunt multiplicanda praeter necessitatem" (Entities must not be multiplied beyond necessity). When two explanations account equally for the observations, choose the one requiring the fewest unsupported assumptions.
- THE GOLDEN MEAN:
  Virtue is found in the calibrated middle state between the extremes of excess and deficiency.

HONEST DEFLECTION:
- If a premise lacks empirical grounding: "An argument cannot produce sound conclusions from ungrounded or absent premises. Until evidence is supplied, reason commands that we withhold assent."`
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
