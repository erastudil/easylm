import React, { useRef } from 'react';
import { Session } from '../types';
import { exportBackupToDisk, restoreBackupFromDisk, wipeAllStoredSessions } from '../engine/storage';
import { isVaultEncrypted } from '../engine/crypto_vault';

export const MoreView: React.FC<{
  profileName: string;
  profileAvatar: string;
  modelLabel: string;
  isModelReady: boolean;
  onOpenProfile: () => void;
  onOpenModel: () => void;
  onLoadModel: () => void;
  onOpenSettings: () => void;
  onOpenHistory: () => void;
  onOpenHelp: () => void;
  onOpenFeedback: () => void;
  onOpenCredits: () => void;
  onOpenSupport: () => void;
  onLockVault: () => void;
  onSessionsReload: () => void;
  sessions: Session[];
}> = ({
  profileName,
  profileAvatar,
  modelLabel,
  isModelReady,
  onOpenProfile,
  onOpenModel,
  onLoadModel,
  onOpenSettings,
  onOpenHistory,
  onOpenHelp,
  onOpenFeedback,
  onOpenCredits,
  onOpenSupport,
  onLockVault,
  onSessionsReload,
  sessions
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const vaultOn = isVaultEncrypted();

  const handleRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (!content) return;
      const res = restoreBackupFromDisk(content);
      if (res.ok) onSessionsReload();
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
    <div className="more-view">
      <div className="more-group">
        <button type="button" className="more-row" onClick={onOpenProfile} title="Family profiles">
          <span>{profileAvatar} {profileName.split('/')[0].trim()}</span>
          <span className="more-chevron">›</span>
        </button>
        <button type="button" className="more-row" onClick={onOpenModel} title="WebGPU models">
          <span>Model · {modelLabel.split('(')[0].trim()}</span>
          <span className="more-chevron">›</span>
        </button>
        {!isModelReady && (
          <button type="button" className="more-row" onClick={onLoadModel} title="Load model into WebGPU">
            <span>Load model</span>
            <span className="more-chevron">›</span>
          </button>
        )}
        <button type="button" className="more-row" onClick={onOpenSettings} title="Engine and security">
          <span>Settings</span>
          <span className="more-chevron">›</span>
        </button>
      </div>

      <div className="more-group">
        <button type="button" className="more-row" onClick={onOpenHistory} title="Search chats">
          <span>History</span>
          <span className="more-chevron">›</span>
        </button>
      </div>

      <div className="more-group">
        <button type="button" className="more-row" onClick={onOpenHelp} title="Guide">
          <span>Help</span>
          <span className="more-chevron">›</span>
        </button>
        <button type="button" className="more-row" onClick={onOpenFeedback} title="Beta feedback">
          <span>Feedback</span>
          <span className="more-chevron">›</span>
        </button>
        <button type="button" className="more-row" onClick={onOpenCredits} title="Credits">
          <span>Credits</span>
          <span className="more-chevron">›</span>
        </button>
        <button type="button" className="more-row" onClick={onOpenSupport} title="Support EasyLM">
          <span>Support</span>
          <span className="more-chevron">›</span>
        </button>
      </div>

      <div className="more-group">
        <button type="button" className="more-row" onClick={() => exportBackupToDisk(sessions)} title="Download backup">
          <span>Backup</span>
          <span className="more-chevron">›</span>
        </button>
        <button type="button" className="more-row" onClick={() => fileInputRef.current?.click()} title="Restore backup">
          <span>Restore</span>
          <span className="more-chevron">›</span>
        </button>
        {vaultOn && (
          <button type="button" className="more-row" onClick={onLockVault} title="Lock vault">
            <span>Lock vault</span>
            <span className="more-chevron">›</span>
          </button>
        )}
        <button type="button" className="more-row more-row-danger" onClick={handleWipe} title="Wipe chat storage">
          <span>Clear stored data</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: 'none' }}
        onChange={handleRestore}
      />
    </div>
  );
};
