import React, { useRef } from 'react';
import { Session } from '../types';
import { exportBackupToDisk, restoreBackupFromDisk, wipeAllStoredSessions, classifySessionLake } from '../engine/storage';
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
  onOpenHistory?: () => void;
  onOpenStudio?: () => void;
  onOpenLearn?: () => void;
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
  onOpenHistory,
  onOpenStudio,
  onOpenLearn
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
    if (confirm('Delete all local chat sessions from this browser? Studio and Learn progress stays. Backup first if you want the chats.')) {
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
        {/* Top Header - HNAI Logo + Chats Title */}
        <div style={{ padding: '1.1rem 1rem 0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <HnaiLogo size="sm" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: '#c4b5fd', fontWeight: 600 }}>
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

        {/* Top Action Buttons: New Session & Full History */}
        <div style={{ padding: '0.4rem 0.85rem 0.6rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <button 
            onClick={() => {
              onNewSession();
              if (window.innerWidth < 768) onToggleOpen();
            }}
            className="btn-pill btn-pill-primary"
            style={{ width: '100%', justifyContent: 'center', gap: '0.45rem', fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
            title="Start fresh conversation"
          >
            <span>+</span> New Chat
          </button>

          {onOpenHistory && (
            <button
              onClick={() => {
                onOpenHistory();
                if (window.innerWidth < 768) onToggleOpen();
              }}
              className="btn-pill"
              style={{
                width: '100%',
                justifyContent: 'center',
                gap: '0.4rem',
                fontSize: '0.76rem',
                padding: '0.35rem 0.75rem',
                backgroundColor: 'rgba(139, 92, 246, 0.12)',
                borderColor: 'rgba(139, 92, 246, 0.35)',
                color: '#c4b5fd'
              }}
              title="Search, filter, and manage full conversation history"
            >
              <span>📜</span> Full History ({sessions.length})
            </button>
          )}
        </div>

        {/* Spacious Session History List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.4rem 0.75rem' }}>
          <div style={{ fontSize: '0.68rem', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.3rem 0.4rem 0.4rem', fontFamily: 'var(--font-mono)' }}>
            Recent Conversations
          </div>
          
          {sessions.length === 0 ? (
            <div style={{ padding: '2.5rem 0.5rem', textAlign: 'center', color: '#52525b', fontSize: '0.82rem' }}>
              No chats yet. Start typing to begin.
            </div>
          ) : (
            sessions.map((s) => {
              const isActive = s.id === activeSessionId;
              const lake = classifySessionLake(s);
              return (
                <div
                  key={s.id}
                  onClick={() => {
                    onSelectSession(s.id);
                    if (window.innerWidth < 768) onToggleOpen();
                  }}
                  style={{
                    padding: '0.55rem 0.7rem',
                    borderRadius: '10px',
                    marginBottom: '0.3rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: isActive ? 'rgba(139, 92, 246, 0.18)' : 'transparent',
                    border: isActive ? '1px solid rgba(139, 92, 246, 0.45)' : '1px solid transparent',
                    color: isActive ? '#ffffff' : '#a1a1aa',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', overflow: 'hidden', flex: 1 }}>
                    {(lake === 'approved' || lake === 'heaven') && <span title="Approved Lake" style={{ fontSize: '0.72rem' }}>👍</span>}
                    {(lake === 'rejected' || lake === 'hell') && <span title="Rejected Lake" style={{ fontSize: '0.72rem' }}>👎</span>}
                    {lake === 'candidate' && <span title="Candidate Lake" style={{ fontSize: '0.65rem', opacity: 0.4 }}>⚪</span>}
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.82rem' }}>
                      {s.title}
                    </span>
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
                      padding: '0.2rem',
                      lineHeight: 1
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

        {/* Consolidated Bottom Toolbar (Studio, Learn, Backup, Restore, Support) */}
        <div style={{ padding: '0.75rem 0.85rem', borderTop: '1px solid rgba(139, 92, 246, 0.2)', backgroundColor: '#07070a' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.38rem' }}>
            {onOpenStudio && (
              <button
                onClick={onOpenStudio}
                className="btn-pill"
                style={{
                  width: '100%',
                  fontSize: '0.76rem',
                  padding: '0.35rem 0.6rem',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'rgba(139, 92, 246, 0.18)',
                  borderColor: 'rgba(139, 92, 246, 0.45)',
                  color: '#c4b5fd',
                  fontWeight: 600
                }}
                title="Studio: Read textbooks, Write documents, Code sandbox, Graph functions, Draw canvas"
              >
                <span>🎨</span> Studio (Read, Write, Code, Graph)
              </button>
            )}

            {onOpenLearn && (
              <button
                onClick={onOpenLearn}
                className="btn-pill"
                style={{
                  width: '100%',
                  fontSize: '0.76rem',
                  padding: '0.35rem 0.6rem',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'rgba(52, 211, 153, 0.12)',
                  borderColor: 'rgba(52, 211, 153, 0.35)',
                  color: '#34d399',
                  fontWeight: 600
                }}
                title="Learn: Undergraduate curriculum, syllabus walks, quizzes, daily flashcards"
              >
                <span>🎓</span> Learn (Curriculum &amp; Walks)
              </button>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
              <button
                onClick={handleBackup}
                className="btn-pill"
                style={{ fontSize: '0.72rem', padding: '0.3rem 0.45rem', justifyContent: 'center', gap: '0.3rem' }}
                title="Download all chats, Tri-Lake memory, and study progress as a single JSON backup"
              >
                <span>💾</span> Backup
              </button>
              <button
                onClick={handleRestoreClick}
                className="btn-pill"
                style={{ fontSize: '0.72rem', padding: '0.3rem 0.45rem', justifyContent: 'center', gap: '0.3rem' }}
                title="Restore chats and progress from local JSON backup"
              >
                <span>📥</span> Restore
              </button>
            </div>

            <input 
              ref={fileInputRef} 
              type="file" 
              accept=".json" 
              style={{ display: 'none' }} 
              onChange={handleFileChange} 
            />

            {/* Support EasyLM at the bottom */}
            <button
              onClick={onOpenSupport}
              className="btn-pill"
              style={{
                width: '100%',
                fontSize: '0.76rem',
                padding: '0.35rem 0.6rem',
                justifyContent: 'center',
                gap: '0.4rem',
                backgroundColor: 'rgba(139, 92, 246, 0.14)',
                borderColor: 'rgba(139, 92, 246, 0.45)',
                color: '#c4b5fd',
                fontWeight: 600
              }}
              title="Support EasyLM: 100% public good, open source, patient sovereign education"
            >
              <span>💜</span> Support EasyLM
            </button>

            <button
              onClick={handleWipe}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ef4444',
                fontSize: '0.68rem',
                fontFamily: 'var(--font-mono)',
                cursor: 'pointer',
                marginTop: '0.15rem',
                textAlign: 'center'
              }}
              title="Wipe all local chat storage"
            >
              Clear Stored Data
            </button>
          </div>
          
          <div style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.68rem', color: '#52525b', fontFamily: 'var(--font-mono)' }}>
            100% Sovereign · WebGPU In-Browser
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
