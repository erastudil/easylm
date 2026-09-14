import React, { useState } from 'react';
import { unlockVault, getVaultMeta } from '../engine/crypto_vault';

interface VaultUnlockModalProps {
  isOpen: boolean;
  onUnlocked: () => void;
  onResetVault?: () => void;
}

export const VaultUnlockModal: React.FC<VaultUnlockModalProps> = ({
  isOpen,
  onUnlocked,
  onResetVault
}) => {
  const [passphrase, setPassphrase] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isUnlocking, setIsUnlocking] = useState(false);

  if (!isOpen) return null;

  const meta = getVaultMeta();
  const isPin = meta?.type === 'pin';

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase.trim()) return;

    setIsUnlocking(true);
    setError(null);
    try {
      const ok = await unlockVault(passphrase.trim());
      if (ok) {
        setPassphrase('');
        onUnlocked();
      } else {
        setError(`Incorrect ${isPin ? 'PIN' : 'password'}. Please try again.`);
      }
    } catch {
      setError('Decryption error. Please try again.');
    } finally {
      setIsUnlocking(false);
    }
  };

  const handleReset = () => {
    if (confirm('Warning: Resetting the vault will erase encrypted chats and memories from this browser. This cannot be undone. Proceed?')) {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('easylm_vault_encrypted');
        localStorage.removeItem('easylm_vault_meta');
        localStorage.removeItem('easylm_sessions');
        localStorage.removeItem('easylm_sovereign_memory');
      }
      if (onResetVault) {
        onResetVault();
      } else {
        window.location.reload();
      }
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.92)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 300,
        padding: '1rem'
      }}
    >
      <div
        style={{
          backgroundColor: '#0c0c12',
          border: '1px solid #8b5cf6',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '420px',
          padding: '1.75rem',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(139, 92, 246, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🔐</span>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#ffffff', fontWeight: 600 }}>
              Sovereign Vault Locked
            </h3>
            <div style={{ fontSize: '0.72rem', color: '#a1a1aa', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
              AES-256 Encrypted Local Storage
            </div>
          </div>
        </div>

        <p style={{ margin: 0, fontSize: '0.82rem', color: '#d4d4d8', lineHeight: 1.55 }}>
          Your local conversations and notes are encrypted. Enter your {isPin ? 'PIN' : 'password'} to decrypt your database for this session.
        </p>

        <form onSubmit={handleUnlock} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <input
            type="password"
            autoFocus
            placeholder={isPin ? 'Enter PIN' : 'Enter password'}
            value={passphrase}
            onChange={(e) => setPassphrase(e.target.value)}
            disabled={isUnlocking}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              backgroundColor: '#07070a',
              border: error ? '1px solid #ef4444' : '1px solid rgba(139, 92, 246, 0.4)',
              borderRadius: '8px',
              padding: '0.6rem 0.85rem',
              color: '#ffffff',
              fontSize: '0.95rem',
              textAlign: isPin ? 'center' : 'left',
              letterSpacing: isPin ? '0.2em' : 'normal',
              fontFamily: 'var(--font-mono)'
            }}
          />

          {error && (
            <div style={{ fontSize: '0.75rem', color: '#f87171', fontFamily: 'var(--font-mono)' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isUnlocking || !passphrase.trim()}
            className="btn-pill btn-pill-primary"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '0.55rem',
              fontSize: '0.85rem',
              opacity: isUnlocking || !passphrase.trim() ? 0.6 : 1
            }}
          >
            {isUnlocking ? 'Decrypting...' : 'Unlock Vault'}
          </button>
        </form>

        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: '#52525b', fontFamily: 'var(--font-mono)' }}>
            100% In-Browser WebCrypto
          </span>
          <button
            type="button"
            onClick={handleReset}
            style={{
              background: 'none',
              border: 'none',
              color: '#71717a',
              fontSize: '0.72rem',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontFamily: 'var(--font-mono)'
            }}
            title="Reset vault if password is forgotten (erases encrypted chats)"
          >
            Forgot? Reset Vault
          </button>
        </div>
      </div>
    </div>
  );
};
