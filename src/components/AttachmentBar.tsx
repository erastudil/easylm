import React from 'react';
import { AttachedDoc } from '../engine/family';

interface AttachmentBarProps {
  doc: AttachedDoc | null;
  onRemove: () => void;
  onQuickAction: (actionPrompt: string) => void;
}

export const AttachmentBar: React.FC<AttachmentBarProps> = ({
  doc,
  onRemove,
  onQuickAction
}) => {
  if (!doc) return null;

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      style={{
        maxWidth: '820px',
        width: '100%',
        margin: '0 auto 0.4rem auto',
        padding: '0.55rem 0.85rem',
        backgroundColor: '#0c0c12',
        border: '1px solid rgba(139, 92, 246, 0.35)',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.45rem',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
          <span style={{ fontSize: '1.1rem' }}>📄</span>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '300px' }}>
            {doc.name}
          </span>
          <span style={{ fontSize: '0.72rem', color: '#a78bfa', fontFamily: 'var(--font-mono)' }}>
            ({formatSize(doc.size)})
          </span>
          <span style={{ fontSize: '0.68rem', backgroundColor: 'rgba(52, 211, 153, 0.15)', color: '#34d399', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
            Local Ingest
          </span>
        </div>

        <button
          onClick={onRemove}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#71717a',
            cursor: 'pointer',
            fontSize: '1.1rem',
            padding: '0 0.25rem'
          }}
          title="Remove document"
        >
          ×
        </button>
      </div>

      {/* Quick Action Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.72rem', color: '#71717a', fontFamily: 'var(--font-mono)' }}>
          Study Tools:
        </span>
        <button
          onClick={() => onQuickAction(`Please provide a clear, beginner-friendly summary of the attached document "${doc.name}", highlighting its main concepts, key vocabulary, and big takeaways.`)}
          className="btn-pill"
          style={{ fontSize: '0.72rem', padding: '0.15rem 0.55rem', backgroundColor: '#181822', borderColor: 'rgba(139, 92, 246, 0.3)' }}
        >
          📝 Summarize
        </button>
        <button
          onClick={() => onQuickAction(`Based on the attached document "${doc.name}", create an interactive 5-question study quiz (multiple choice or short answer) to test my understanding, with an answer key and explanations at the bottom.`)}
          className="btn-pill"
          style={{ fontSize: '0.72rem', padding: '0.15rem 0.55rem', backgroundColor: '#181822', borderColor: 'rgba(139, 92, 246, 0.3)' }}
        >
          🧠 Quiz Me (5 Questions)
        </button>
        <button
          onClick={() => onQuickAction(`Act as my patient Socratic homework tutor for the attached document "${doc.name}". Help me understand the hardest concept step-by-step by asking guiding questions rather than giving away answers.`)}
          className="btn-pill"
          style={{ fontSize: '0.72rem', padding: '0.15rem 0.55rem', backgroundColor: '#181822', borderColor: 'rgba(139, 92, 246, 0.3)' }}
        >
          🎓 Socratic Coach
        </button>
        <button
          onClick={() => onQuickAction(`Explain the core ideas of "${doc.name}" simply, as if explaining to a 10-year-old student, using vivid real-world analogies.`)}
          className="btn-pill"
          style={{ fontSize: '0.72rem', padding: '0.15rem 0.55rem', backgroundColor: '#181822', borderColor: 'rgba(139, 92, 246, 0.3)' }}
        >
          💡 Explain Like I'm 10
        </button>
      </div>
    </div>
  );
};
