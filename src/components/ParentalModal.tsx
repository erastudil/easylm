import React, { useState } from 'react';
import { verifyParentalPin, setParentalPin, clearParentalPin, hasParentalPin } from '../engine/family';

interface ParentalModalProps {
  isOpen: boolean;
  mode: 'verify' | 'setup';
  onClose: () => void;
  onSuccess: () => void;
}

export const ParentalModal: React.FC<ParentalModalProps> = ({
  isOpen,
  mode,
  onClose,
  onSuccess
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const pinExists = hasParentalPin();

  if (!isOpen) return null;

  const handleVerify = () => {
    if (verifyParentalPin(pin)) {
      setError('');
      setPin('');
      onSuccess();
    } else {
      setError('Incorrect PIN. Please try again.');
    }
  };

  const handleSavePin = () => {
    if (pin.trim().length < 4) {
      setError('PIN must be at least 4 digits.');
      return;
    }
    setParentalPin(pin.trim());
    setError('');
    setPin('');
    onSuccess();
  };

  const handleRemovePin = () => {
    clearParentalPin();
    setError('');
    setPin('');
    onSuccess();
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
      zIndex: 200,
      padding: '1rem'
    }}>
      <div className="card-panel" style={{ width: '100%', maxWidth: '380px', padding: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🔒</span> {mode === 'verify' ? 'Parental Lock' : 'Parental Controls'}
          </h3>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#71717a', fontSize: '1.4rem', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>

        <p style={{ fontSize: '0.85rem', color: '#a1a1aa', margin: '0 0 1.25rem 0', lineHeight: 1.5 }}>
          {mode === 'verify'
            ? 'Enter your 4-digit Parent PIN to unlock settings or switch to an unrestricted profile.'
            : 'Set a 4-digit PIN to prevent children or students from exiting Kid Safe mode or changing guardrails.'}
        </p>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.78rem', color: '#c4b5fd', fontFamily: 'var(--font-mono)', marginBottom: '0.4rem' }}>
            {mode === 'verify' ? 'Enter PIN:' : 'New 4-Digit PIN:'}
          </label>
          <input
            type="password"
            maxLength={8}
            autoFocus
            value={pin}
            onChange={(e) => {
              setPin(e.target.value.replace(/[^0-9]/g, ''));
              setError('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                mode === 'verify' ? handleVerify() : handleSavePin();
              }
            }}
            placeholder="••••"
            style={{
              width: '100%',
              background: '#07070a',
              border: error ? '1px solid #ef4444' : '1px solid rgba(139, 92, 246, 0.4)',
              borderRadius: '10px',
              color: '#ffffff',
              padding: '0.65rem 0.85rem',
              fontFamily: 'var(--font-mono)',
              fontSize: '1.2rem',
              letterSpacing: '0.3em',
              textAlign: 'center'
            }}
          />
          {error && (
            <div style={{ color: '#ef4444', fontSize: '0.78rem', marginTop: '0.4rem', fontFamily: 'var(--font-mono)' }}>
              {error}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {mode === 'verify' ? (
            <button
              onClick={handleVerify}
              className="btn-pill btn-pill-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Unlock Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleSavePin}
                className="btn-pill btn-pill-primary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {pinExists ? 'Update PIN Lock' : 'Enable PIN Lock'}
              </button>
              {pinExists && (
                <button
                  onClick={handleRemovePin}
                  className="btn-pill"
                  style={{ width: '100%', justifyContent: 'center', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#f87171' }}
                >
                  Disable PIN Protection
                </button>
              )}
            </>
          )}

          <button
            onClick={onClose}
            className="btn-pill"
            style={{ width: '100%', justifyContent: 'center', color: '#71717a' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
