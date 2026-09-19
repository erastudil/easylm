import React from 'react';
import { Session } from '../types';
import { classifySessionLake } from '../engine/storage';

export const ChatSheet: React.FC<{
  sessions: Session[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  onOpenHistory: () => void;
  onClose: () => void;
}> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  onOpenHistory,
  onClose
}) => {
  return (
    <div className="phone-sheet-backdrop" onClick={onClose}>
      <div className="phone-sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Chats">
        <div className="phone-sheet-handle" />
        <div className="phone-sheet-actions">
          <button
            type="button"
            className="btn-pill btn-pill-primary"
            style={{ flex: 1, minHeight: 44 }}
            onClick={() => {
              onNewSession();
              onClose();
            }}
            title="Start a new chat"
          >
            New Chat
          </button>
          <button
            type="button"
            className="btn-pill"
            style={{ minHeight: 44 }}
            onClick={() => {
              onOpenHistory();
              onClose();
            }}
            title="Search all chats"
          >
            History
          </button>
        </div>
        <div className="phone-sheet-list">
          {sessions.length === 0 ? (
            <div className="phone-empty">No chats yet.</div>
          ) : (
            sessions.map((s) => {
              const isActive = s.id === activeSessionId;
              const lake = classifySessionLake(s);
              return (
                <div
                  key={s.id}
                  className={isActive ? 'phone-session phone-session-on' : 'phone-session'}
                  onClick={() => {
                    onSelectSession(s.id);
                    onClose();
                  }}
                >
                  <span className="phone-session-title">
                    {(lake === 'approved' || lake === 'heaven') && <span title="Approved">👍 </span>}
                    {(lake === 'rejected' || lake === 'hell') && <span title="Rejected">👎 </span>}
                    {s.title}
                  </span>
                  <button
                    type="button"
                    className="phone-session-del"
                    title="Delete chat"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(s.id);
                    }}
                  >
                    ×
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
