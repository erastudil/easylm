import React, { useState } from 'react';
import { browserRestartCommand } from '../engine/context_budget';

interface GpuRestartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GpuRestartModal: React.FC<GpuRestartModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const command = browserRestartCommand();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      const input = document.getElementById('easylm-gpu-restart-cmd') as HTMLInputElement | null;
      if (input) {
        input.focus();
        input.select();
      }
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 400,
      padding: '1rem',
      overflowX: 'hidden'
    }}>
      <div
        className="card-panel"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '1.5rem',
          overflowX: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', fontFamily: 'var(--font-mono)', color: '#ffffff' }}>
            WebGPU lost the GPU
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#71717a', fontSize: '1.4rem', cursor: 'pointer' }}
            title="Close"
          >
            ×
          </button>
        </div>

        <p style={{ fontSize: '0.86rem', color: '#e4e4e7', margin: '0 0 0.85rem 0', lineHeight: 1.55 }}>
          WebGPU is not finding your GPU. Copy this command and paste it in the address bar to hard-restart the browser. Tabs come back, but they reload. Save unsaved work first.
        </p>

        <input
          id="easylm-gpu-restart-cmd"
          readOnly
          value={command}
          onFocus={(e) => e.currentTarget.select()}
          title="Paste this in the address bar"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            background: '#07070a',
            border: '1px solid #8b5cf6',
            borderRadius: '10px',
            color: '#ffffff',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            padding: '0.55rem 0.75rem',
            marginBottom: '1rem'
          }}
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn-pill btn-pill-primary"
            onClick={handleCopy}
            title="Copy the restart command"
          >
            {copied ? 'Copied' : 'Copy command'}
          </button>
          <button
            type="button"
            className="btn-pill"
            onClick={onClose}
            title="Close"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
