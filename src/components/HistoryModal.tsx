import React, { useState, useMemo } from 'react';
import { Session } from '../types';
import { classifySessionLake } from '../engine/storage';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: Session[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onNewSession: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onNewSession
}) => {
  const [search, setSearch] = useState('');
  const [filterLake, setFilterLake] = useState<'all' | 'approved' | 'candidate' | 'rejected'>('all');

  const filteredSessions = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sessions.filter(s => {
      const lake = classifySessionLake(s);
      if (filterLake === 'approved' && lake !== 'approved' && lake !== 'heaven') return false;
      if (filterLake === 'rejected' && lake !== 'rejected' && lake !== 'hell') return false;
      if (filterLake === 'candidate' && lake !== 'candidate' && lake !== 'purgatory') return false;

      if (!q) return true;
      if (s.title.toLowerCase().includes(q)) return true;
      return (s.messages || []).some(m => m.content.toLowerCase().includes(q));
    });
  }, [sessions, search, filterLake]);

  if (!isOpen) return null;

  const handleExportSingleSession = (e: React.MouseEvent, s: Session) => {
    e.stopPropagation();
    const jsonStr = JSON.stringify(s, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date(s.createdAt).toISOString().split('T')[0];
    const safeTitle = s.title.replace(/[^a-z0-9_-]/gi, '_').slice(0, 30);
    const a = document.createElement('a');
    a.href = url;
    a.download = `easylm-session-${safeTitle}-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (ts: number) => {
    try {
      const d = new Date(ts);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
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
        zIndex: 140,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#0c0c12',
          border: '1px solid rgba(139, 92, 246, 0.35)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '780px',
          height: '85vh',
          maxHeight: '750px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '1.1rem 1.25rem', borderBottom: '1px solid rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', backgroundColor: '#09090e' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.25rem' }}>📜</span>
            <div>
              <div style={{ fontSize: '0.98rem', fontWeight: 600, color: '#ffffff' }}>
                Conversation History
              </div>
              <div style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>
                Browse, search, export, and resume your local sovereign chats ({sessions.length} total)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => {
                onNewSession();
                onClose();
              }}
              className="btn-pill btn-pill-primary"
              style={{ fontSize: '0.75rem', padding: '0.3rem 0.7rem', gap: '0.3rem' }}
            >
              <span>+</span> New Chat
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#71717a',
                cursor: 'pointer',
                fontSize: '1.4rem',
                lineHeight: 1,
                padding: '0.2rem 0.5rem'
              }}
              title="Close history"
            >
              ×
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', flexDirection: 'column', gap: '0.65rem', backgroundColor: '#0e0e16' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              placeholder="Search chat titles or message keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: '#07070a',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '8px',
                padding: '0.45rem 0.75rem',
                fontSize: '0.82rem',
                color: '#ffffff'
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="btn-pill"
                style={{ fontSize: '0.75rem', padding: '0.4rem 0.65rem' }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Lake filter tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.7rem', color: '#71717a', fontFamily: 'var(--font-mono)', marginRight: '0.2rem' }}>
              Filter:
            </span>
            <button
              onClick={() => setFilterLake('all')}
              className="btn-pill"
              style={{
                fontSize: '0.72rem',
                padding: '0.2rem 0.6rem',
                backgroundColor: filterLake === 'all' ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
                borderColor: filterLake === 'all' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)',
                color: filterLake === 'all' ? '#ffffff' : '#a1a1aa'
              }}
            >
              All
            </button>
            <button
              onClick={() => setFilterLake('approved')}
              className="btn-pill"
              style={{
                fontSize: '0.72rem',
                padding: '0.2rem 0.6rem',
                backgroundColor: filterLake === 'approved' ? 'rgba(74, 222, 128, 0.2)' : 'transparent',
                borderColor: filterLake === 'approved' ? '#4ade80' : 'rgba(255, 255, 255, 0.1)',
                color: filterLake === 'approved' ? '#4ade80' : '#a1a1aa'
              }}
            >
              👍 Approved
            </button>
            <button
              onClick={() => setFilterLake('candidate')}
              className="btn-pill"
              style={{
                fontSize: '0.72rem',
                padding: '0.2rem 0.6rem',
                backgroundColor: filterLake === 'candidate' ? 'rgba(161, 161, 170, 0.2)' : 'transparent',
                borderColor: filterLake === 'candidate' ? '#a1a1aa' : 'rgba(255, 255, 255, 0.1)',
                color: filterLake === 'candidate' ? '#ffffff' : '#a1a1aa'
              }}
            >
              ⚪ Unrated / Candidate
            </button>
            <button
              onClick={() => setFilterLake('rejected')}
              className="btn-pill"
              style={{
                fontSize: '0.72rem',
                padding: '0.2rem 0.6rem',
                backgroundColor: filterLake === 'rejected' ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
                borderColor: filterLake === 'rejected' ? '#f87171' : 'rgba(255, 255, 255, 0.1)',
                color: filterLake === 'rejected' ? '#f87171' : '#a1a1aa'
              }}
            >
              👎 Flagged / Rejected
            </button>
          </div>
        </div>

        {/* Sessions List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.85rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {filteredSessions.length === 0 ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#71717a', fontSize: '0.85rem' }}>
              {search || filterLake !== 'all'
                ? 'No conversations match the search query and lake filter.'
                : 'No conversations saved yet. Start typing in chat to begin!'}
            </div>
          ) : (
            filteredSessions.map(s => {
              const isActive = s.id === activeSessionId;
              const lake = classifySessionLake(s);
              const isApproved = lake === 'approved' || lake === 'heaven';
              const isRejected = lake === 'rejected' || lake === 'hell';
              const lastMsg = s.messages && s.messages.length > 0 ? s.messages[s.messages.length - 1] : null;
              const firstUserMsg = s.messages?.find(m => m.role === 'user');

              return (
                <div
                  key={s.id}
                  onClick={() => {
                    onSelectSession(s.id);
                    onClose();
                  }}
                  style={{
                    backgroundColor: isActive ? 'rgba(139, 92, 246, 0.15)' : '#111118',
                    border: isActive ? '1px solid #8b5cf6' : '1px solid rgba(139, 92, 246, 0.2)',
                    borderRadius: '10px',
                    padding: '0.85rem 1rem',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.45rem',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden', flex: 1 }}>
                      {isApproved && <span title="Approved Lake" style={{ fontSize: '0.8rem' }}>👍</span>}
                      {isRejected && <span title="Rejected Lake" style={{ fontSize: '0.8rem' }}>👎</span>}
                      {!isApproved && !isRejected && <span title="Candidate Lake" style={{ fontSize: '0.8rem', opacity: 0.5 }}>⚪</span>}
                      <span style={{ fontSize: '0.92rem', fontWeight: 600, color: isActive ? '#ffffff' : '#e4e4e7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {s.title}
                      </span>
                      {isActive && (
                        <span style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', backgroundColor: 'rgba(139, 92, 246, 0.3)', color: '#c4b5fd', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                          Current
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <button
                        onClick={(e) => handleExportSingleSession(e, s)}
                        className="btn-pill"
                        style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
                        title="Download this conversation as JSON"
                      >
                        💾 Export
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete "${s.title}"?`)) {
                            onDeleteSession(s.id);
                          }
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#71717a',
                          cursor: 'pointer',
                          fontSize: '1.1rem',
                          padding: '0.2rem 0.4rem',
                          lineHeight: 1
                        }}
                        title="Delete conversation"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>

                  {/* Snippet */}
                  {(firstUserMsg || lastMsg) && (
                    <div style={{ fontSize: '0.75rem', color: '#a1a1aa', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontStyle: 'italic' }}>
                      "{firstUserMsg ? firstUserMsg.content.slice(0, 140) : lastMsg?.content.slice(0, 140)}"
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#71717a' }}>
                    <span>{s.messages?.length || 0} message{s.messages?.length === 1 ? '' : 's'}</span>
                    <span>Updated: {formatDate(s.updatedAt || s.createdAt)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '0.75rem 1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#09090e', fontSize: '0.72rem', color: '#71717a', fontFamily: 'var(--font-mono)' }}>
          <span>100% Local Browser Storage (IndexedDB + localStorage)</span>
          <button
            onClick={onClose}
            className="btn-pill"
            style={{ fontSize: '0.74rem', padding: '0.3rem 0.8rem' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
