import React, { useState } from 'react';
import { HnaiLogo } from './HnaiLogo';
import { Session } from '../types';
import {
  backupToGoogleDrive,
  restoreFromGoogleDrive,
  getStoredGoogleClientId,
  setStoredGoogleClientId,
  DEFAULT_GOOGLE_CLIENT_ID
} from '../engine/google_drive';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: Session[];
  onSessionsReload: () => void;
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  sessions,
  onSessionsReload
}) => {
  const [clientId, setClientId] = useState<string>(() => getStoredGoogleClientId());
  const [passphrase, setPassphrase] = useState<string>('');
  const [useEncryption, setUseEncryption] = useState<boolean>(false);
  const [showConfig, setShowConfig] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSaveClientId = () => {
    setStoredGoogleClientId(clientId);
    setStatusMessage({ type: 'info', text: 'Saved Google Client ID locally.' });
  };

  const handleBackup = async () => {
    setIsLoading(true);
    setStatusMessage({ type: 'info', text: 'Connecting to Google Drive...' });
    try {
      const res = await backupToGoogleDrive(sessions, clientId, useEncryption ? passphrase : undefined);
      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: `✓ Backed up ${sessions.length} sessions to your Google Drive AppData folder at ${new Date().toLocaleTimeString()}!`
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: `Backup failed: ${res.error}`
        });
      }
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: `Error: ${e?.message || String(e)}` });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    setIsLoading(true);
    setStatusMessage({ type: 'info', text: 'Fetching backup from Google Drive...' });
    try {
      const res = await restoreFromGoogleDrive(clientId, useEncryption ? passphrase : undefined);
      if (res.ok) {
        onSessionsReload();
        setStatusMessage({
          type: 'success',
          text: `✓ Successfully restored ${res.count || 0} new session(s) from your Google Drive backup!`
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: `Restore failed: ${res.error}`
        });
      }
    } catch (e: any) {
      setStatusMessage({ type: 'error', text: `Error: ${e?.message || String(e)}` });
    } finally {
      setIsLoading(false);
    }
  };

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
        zIndex: 130,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        className="card-panel"
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: '#0a0a10',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(139, 92, 246, 0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '1.2rem 1.4rem',
          borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#08080d'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <HnaiLogo size="sm" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>📁</span>
              <h2 style={{ margin: 0, fontSize: '1.1rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#ffffff' }}>
                Google Drive Sync
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#a1a1aa',
              fontSize: '1.25rem',
              cursor: 'pointer',
              padding: '0.2rem 0.5rem'
            }}
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '1.3rem 1.4rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
          {/* Sovereign Guarantee Box */}
          <div style={{
            backgroundColor: 'rgba(139, 92, 246, 0.08)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '12px',
            padding: '0.9rem 1.1rem',
            fontSize: '0.82rem',
            color: '#d4d4d8',
            lineHeight: 1.55
          }}>
            <strong style={{ color: '#ffffff' }}>Zero HNAI Servers:</strong> EasyLM connects directly from your browser to your Google Drive via client-side OAuth. Your chat sessions and memories are saved into your private Google Drive <code style={{ color: '#c4b5fd' }}>appDataFolder</code>.
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div style={{
              padding: '0.7rem 0.9rem',
              borderRadius: '10px',
              fontSize: '0.8rem',
              backgroundColor: statusMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : statusMessage.type === 'error' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(139, 92, 246, 0.15)',
              border: statusMessage.type === 'success' ? '1px solid #10b981' : statusMessage.type === 'error' ? '1px solid #ef4444' : '1px solid #8b5cf6',
              color: statusMessage.type === 'success' ? '#6ee7b7' : statusMessage.type === 'error' ? '#fca5a5' : '#c4b5fd'
            }}>
              {statusMessage.text}
            </div>
          )}

          {/* Main Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              onClick={handleBackup}
              disabled={isLoading}
              className="btn-pill btn-pill-primary"
              style={{
                padding: '0.75rem 1rem',
                justifyContent: 'center',
                fontSize: '0.85rem',
                gap: '0.5rem',
                opacity: isLoading ? 0.6 : 1
              }}
            >
              <span>⬆️</span>
              <span>Backup to Drive</span>
            </button>

            <button
              onClick={handleRestore}
              disabled={isLoading}
              className="btn-pill"
              style={{
                padding: '0.75rem 1rem',
                justifyContent: 'center',
                fontSize: '0.85rem',
                gap: '0.5rem',
                borderColor: 'rgba(139, 92, 246, 0.4)',
                backgroundColor: 'rgba(139, 92, 246, 0.12)',
                color: '#ffffff',
                opacity: isLoading ? 0.6 : 1
              }}
            >
              <span>⬇️</span>
              <span>Restore from Drive</span>
            </button>
          </div>

          {/* Zero-Knowledge Encryption Toggle */}
          <div style={{
            backgroundColor: '#11111a',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            borderRadius: '12px',
            padding: '0.9rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.82rem', color: '#ffffff', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={useEncryption}
                onChange={(e) => setUseEncryption(e.target.checked)}
                style={{ accentColor: '#8b5cf6' }}
              />
              <span>🔒 Encrypt with Passphrase (Zero-Knowledge)</span>
            </label>

            {useEncryption && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.2rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>
                  Encrypts data using AES-GCM-256 via WebCrypto before upload. Google cannot read your chats.
                </span>
                <input
                  type="password"
                  placeholder="Enter custom passphrase..."
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  style={{
                    backgroundColor: '#07070b',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    padding: '0.45rem 0.75rem',
                    fontSize: '0.82rem'
                  }}
                />
              </div>
            )}
          </div>

          {/* Advanced Google Client ID Config Accordion */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.6rem' }}>
            <button
              onClick={() => setShowConfig(!showConfig)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#a78bfa',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <span>{showConfig ? '▼' : '▶'}</span>
              <span>Advanced: Custom Google OAuth Client ID</span>
            </button>

            {showConfig && (
              <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', color: '#71717a' }}>
                  If deploying your own instance, provide your OAuth 2.0 Web Client ID from Google Cloud Console.
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder="Enter your Google Client ID..."
                    style={{
                      flex: 1,
                      backgroundColor: '#07070b',
                      border: '1px solid rgba(139, 92, 246, 0.3)',
                      borderRadius: '8px',
                      color: '#ffffff',
                      padding: '0.4rem 0.65rem',
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-mono)'
                    }}
                  />
                  <button
                    onClick={handleSaveClientId}
                    className="btn-pill"
                    style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem' }}
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '0.85rem 1.4rem',
          borderTop: '1px solid rgba(139, 92, 246, 0.2)',
          backgroundColor: '#07070a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.72rem',
          color: '#71717a',
          fontFamily: 'var(--font-mono)'
        }}>
          <span>Client-to-Cloud · No intermediary</span>
          <button
            onClick={onClose}
            className="btn-pill"
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.85rem' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
