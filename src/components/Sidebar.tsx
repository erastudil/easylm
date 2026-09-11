import React, { useRef } from 'react';
import { Session } from '../types';
import { exportBackupToDisk, restoreBackupFromDisk, wipeAllStoredSessions } from '../engine/storage';
import { HnaiLogo } from './HnaiLogo';

interface SidebarProps {
  sessions: Session[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  onSessionsReload: () => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  onOpenSupport: () => void;
  onOpenPersonalityModal?: () => void;
  onOpenFeedback?: () => void;
  onOpenGoogleDrive?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onSessionsReload,
  isOpen,
  onToggleOpen,
  onOpenSupport,
  onOpenPersonalityModal,
  onOpenFeedback,
  onOpenGoogleDrive
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBackup = () => {
    exportBackupToDisk(sessions);
  };

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const res = restoreBackupFromDisk(content);
        if (res.ok) {
          alert(`Restored ${res.count || 0} sessions successfully.`);
          onSessionsReload();
        } else {
          alert(`Restore failed: ${res.error}`);
        }
      }
    };
    reader.readAsText(file);
  };

  const handleWipe = () => {
    if (confirm('Are you sure you want to delete all local sessions from this browser? This cannot be undone unless you backed up to disk.')) {
      wipeAllStoredSessions();
      onSessionsReload();
    }
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="mobile-backdrop"
          onClick={onToggleOpen}
        />
      )}

      <aside 
        className="sidebar-drawer"
        style={{
          width: isOpen ? '280px' : '0px',
          minWidth: isOpen ? '280px' : '0px',
          transition: 'all 0.25s ease-in-out',
          backgroundColor: '#09090e',
          borderRight: isOpen ? '1px solid rgba(139, 92, 246, 0.2)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden',
          zIndex: 50
        }}
      >
        {/* Top Header - Deduplicated Title, showing HNAI Logo + Conversations */}
        <div style={{ padding: '1.2rem 1rem 0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <HnaiLogo size="sm" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: '#c4b5fd', fontWeight: 600 }}>
              Chats
            </span>
          </div>
          <button 
            onClick={onToggleOpen}
            style={{ background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: '1.1rem' }}
            title="Collapse sidebar"
          >
            ◀
          </button>
        </div>

        {/* New Session Button */}
        <div style={{ padding: '0.5rem 1rem' }}>
          <button 
            onClick={() => {
              onNewSession();
              if (window.innerWidth < 768) onToggleOpen();
            }}
            className="btn-pill btn-pill-primary"
            style={{ width: '100%', justifyContent: 'center', gap: '0.5rem' }}
            title="Start fresh conversation"
          >
            <span>+</span> New Session
          </button>
        </div>

        {/* Session List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0.75rem' }}>
          <div style={{ fontSize: '0.7rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.5rem 0.5rem 0.3rem', fontFamily: 'var(--font-mono)' }}>
            Recent History ({sessions.length})
          </div>
          
          {sessions.length === 0 ? (
            <div style={{ padding: '1.5rem 0.5rem', textAlign: 'center', color: '#52525b', fontSize: '0.85rem' }}>
              No chats yet. Start typing to begin.
            </div>
          ) : (
            sessions.map((s) => {
              const isActive = s.id === activeSessionId;
              return (
                <div
                  key={s.id}
                  onClick={() => {
                    onSelectSession(s.id);
                    if (window.innerWidth < 768) onToggleOpen();
                  }}
                  style={{
                    padding: '0.6rem 0.75rem',
                    borderRadius: '12px',
                    marginBottom: '0.3rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: isActive ? 'rgba(139, 92, 246, 0.15)' : 'transparent',
                    border: isActive ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
                    color: isActive ? '#ffffff' : '#a1a1aa',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.85rem', flex: 1 }}>
                    {s.title}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(s.id);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#52525b',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      padding: '0.2rem'
                    }}
                    title="Delete chat"
                  >
                    ×
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Local Storage & Backup Actions */}
        <div style={{ padding: '0.8rem 1rem', borderTop: '1px solid rgba(139, 92, 246, 0.2)', backgroundColor: '#07070a' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {onOpenPersonalityModal && (
              <button
                onClick={onOpenPersonalityModal}
                className="btn-pill"
                style={{
                  width: '100%',
                  fontSize: '0.78rem',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  borderColor: 'rgba(139, 92, 246, 0.35)',
                  color: '#e4e4e7',
                  fontWeight: 500
                }}
                title="Browse Thinkers, Authors & Characters (Gallery)"
              >
                <span>🎭</span> Voices Gallery
              </button>
            )}
            <button
              onClick={onOpenSupport}
              className="btn-pill"
              style={{
                width: '100%',
                fontSize: '0.78rem',
                justifyContent: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(139, 92, 246, 0.14)',
                borderColor: 'rgba(139, 92, 246, 0.45)',
                color: '#c4b5fd',
                fontWeight: 600
              }}
              title="Support EasyLM with Bitcoin, Solana, or Cash App"
            >
              <span>💜</span> Support EasyLM
            </button>
            {onOpenFeedback && (
              <button
                onClick={onOpenFeedback}
                className="btn-pill"
                style={{
                  width: '100%',
                  fontSize: '0.78rem',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'rgba(234, 179, 8, 0.1)',
                  borderColor: 'rgba(234, 179, 8, 0.35)',
                  color: '#fef08a',
                  fontWeight: 500
                }}
                title="Send beta feedback, bugs, or writeups to humansandai@atomicmail.io"
              >
                <span>💬</span> Send Beta Feedback
              </button>
            )}
            {onOpenGoogleDrive && (
              <button
                onClick={onOpenGoogleDrive}
                className="btn-pill"
                style={{
                  width: '100%',
                  fontSize: '0.78rem',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'rgba(59, 130, 246, 0.12)',
                  borderColor: 'rgba(59, 130, 246, 0.35)',
                  color: '#93c5fd',
                  fontWeight: 500
                }}
                title="Optional Drive AppData backup. This copy leaves the machine."
              >
                <span>📁</span> Google Drive Sync
              </button>
            )}
            <button
              onClick={handleBackup}
              className="btn-pill"
              style={{ width: '100%', fontSize: '0.78rem', justifyContent: 'center', gap: '0.4rem' }}
              title="Download all chats as a local JSON file"
            >
              <span>💾</span> Backup to Disk
            </button>
            <button
              onClick={handleRestoreClick}
              className="btn-pill"
              style={{ width: '100%', fontSize: '0.78rem', justifyContent: 'center', gap: '0.4rem' }}
              title="Restore chats from local JSON file"
            >
              <span>📥</span> Restore Backup
            </button>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept=".json" 
              style={{ display: 'none' }} 
              onChange={handleFileChange} 
            />
            <button
              onClick={handleWipe}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ef4444',
                fontSize: '0.75rem',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                marginTop: '0.3rem',
                textAlign: 'center'
              }}
              title="Wipe all local storage"
            >
              Clear Stored Data
            </button>
          </div>
          
          <div style={{ marginTop: '0.8rem', textAlign: 'center', fontSize: '0.7rem', color: '#52525b', fontFamily: 'var(--font-mono)' }}>
            100% Private · WebGPU In-Browser
          </div>
        </div>
      </aside>

      {/* Toggle button when closed */}
      {!isOpen && (
        <button
          onClick={onToggleOpen}
          style={{
            position: 'absolute',
            top: '0.85rem',
            left: '0.85rem',
            zIndex: 40,
            background: '#111118',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '9999px',
            color: '#a78bfa',
            padding: '0.4rem 0.75rem',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem'
          }}
          title="Open chat sidebar"
        >
          ☰
        </button>
      )}
    </>
  );
};
