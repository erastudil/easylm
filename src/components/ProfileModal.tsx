import React, { useState } from 'react';
import {
  UserProfile,
  loadProfiles,
  saveProfiles,
  getActiveProfile,
  setActiveProfileId,
  hasParentalPin,
  getProfileMemories,
  addProfileMemory,
  deleteProfileMemory,
  clearProfileMemories
} from '../engine/family';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestPinVerify: (onSuccess: () => void) => void;
  onOpenPinSetup: () => void;
  onProfileChanged: (profile: UserProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onRequestPinVerify,
  onOpenPinSetup,
  onProfileChanged
}) => {
  const [profiles, setProfiles] = useState<UserProfile[]>(() => loadProfiles());
  const [activeProfile, setActiveProfile] = useState<UserProfile>(() => getActiveProfile());
  const [newMemoryText, setNewMemoryText] = useState('');
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileRole, setNewProfileRole] = useState<'parent' | 'kid'>('kid');
  const [isAddingProfile, setIsAddingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState<'profiles' | 'memory' | 'parental'>('profiles');

  const memories = getProfileMemories(activeProfile.id);
  const pinConfigured = hasParentalPin();

  if (!isOpen) return null;

  const handleSelectProfile = (target: UserProfile) => {
    if (target.id === activeProfile.id) return;

    // If currently locked in a kid profile with a parental PIN, require PIN to switch
    if (activeProfile.role === 'kid' && activeProfile.parentalLockEnabled && pinConfigured) {
      onRequestPinVerify(() => {
        setActiveProfileId(target.id);
        setActiveProfile(target);
        onProfileChanged(target);
      });
    } else {
      setActiveProfileId(target.id);
      setActiveProfile(target);
      onProfileChanged(target);
    }
  };

  const handleAddMemory = () => {
    if (!newMemoryText.trim()) return;
    addProfileMemory(activeProfile.id, newMemoryText.trim());
    setNewMemoryText('');
  };

  const handleDeleteMemory = (id: string) => {
    deleteProfileMemory(id);
    setActiveProfile({ ...activeProfile }); // Trigger re-render
  };

  const handleClearMemories = () => {
    if (confirm(`Clear all saved memories for ${activeProfile.name}?`)) {
      clearProfileMemories(activeProfile.id);
      setActiveProfile({ ...activeProfile });
    }
  };

  const handleExportMemories = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(memories, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `easylm_memory_${activeProfile.name.toLowerCase().replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCreateProfile = () => {
    if (!newProfileName.trim()) return;
    const newProf: UserProfile = {
      id: 'prof-' + Date.now(),
      name: newProfileName.trim(),
      avatar: newProfileRole === 'kid' ? '🎒' : '👨‍👩‍👧',
      role: newProfileRole,
      personalityId: newProfileRole === 'kid' ? 'socratic_kid' : 'friendly',
      parentalLockEnabled: newProfileRole === 'kid',
      socraticTutorEnabled: newProfileRole === 'kid',
      readingLevel: newProfileRole === 'kid' ? 'middle' : 'general'
    };
    const updated = [...profiles, newProf];
    saveProfiles(updated);
    setProfiles(updated);
    setNewProfileName('');
    setIsAddingProfile(false);
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
      zIndex: 150,
      padding: '1rem'
    }}>
      <div className="card-panel" style={{ width: '100%', maxWidth: '580px', padding: '1.75rem', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>👨‍👩‍👧</span> Family & Profiles
          </h2>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#71717a', fontSize: '1.4rem', cursor: 'pointer' }}
          >
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', borderBottom: '1px solid rgba(139, 92, 246, 0.2)', paddingBottom: '0.6rem' }}>
          <button
            onClick={() => setActiveTab('profiles')}
            className="btn-pill"
            style={{
              fontSize: '0.78rem',
              backgroundColor: activeTab === 'profiles' ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
              borderColor: activeTab === 'profiles' ? '#8b5cf6' : 'transparent',
              color: activeTab === 'profiles' ? '#ffffff' : '#a1a1aa'
            }}
          >
            👥 Profiles ({profiles.length})
          </button>
          <button
            onClick={() => setActiveTab('memory')}
            className="btn-pill"
            style={{
              fontSize: '0.78rem',
              backgroundColor: activeTab === 'memory' ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
              borderColor: activeTab === 'memory' ? '#8b5cf6' : 'transparent',
              color: activeTab === 'memory' ? '#ffffff' : '#a1a1aa'
            }}
          >
            🧠 Memory Vault ({memories.length})
          </button>
          <button
            onClick={() => setActiveTab('parental')}
            className="btn-pill"
            style={{
              fontSize: '0.78rem',
              backgroundColor: activeTab === 'parental' ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
              borderColor: activeTab === 'parental' ? '#8b5cf6' : 'transparent',
              color: activeTab === 'parental' ? '#ffffff' : '#a1a1aa'
            }}
          >
            🔒 Parental Controls
          </button>
        </div>

        {/* Tab 1: Profiles */}
        {activeTab === 'profiles' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
              {profiles.map(p => {
                const isSelected = p.id === activeProfile.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProfile(p)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem 1rem',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      backgroundColor: isSelected ? 'rgba(139, 92, 246, 0.2)' : '#111118',
                      border: isSelected ? '1px solid #8b5cf6' : '1px solid rgba(139, 92, 246, 0.2)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.4rem' }}>{p.avatar}</span>
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span>{p.name}</span>
                          {p.role === 'kid' && (
                            <span style={{ fontSize: '0.68rem', backgroundColor: 'rgba(52, 211, 153, 0.15)', color: '#34d399', padding: '0.1rem 0.4rem', borderRadius: '4px', border: '1px solid rgba(52, 211, 153, 0.3)' }}>
                              Kid Safe
                            </span>
                          )}
                          {p.parentalLockEnabled && pinConfigured && (
                            <span title="Parental PIN lock enabled" style={{ fontSize: '0.75rem' }}>🔒</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#71717a', marginTop: '0.15rem' }}>
                          {p.role === 'kid' ? 'Homework coach. Network tools off. Household PIN if set.' : 'Unrestricted personal assistant'}
                        </div>
                      </div>
                    </div>

                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: isSelected ? '#a78bfa' : '#52525b' }}>
                      {isSelected ? '● Active' : 'Switch'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Add Profile Section */}
            {!isAddingProfile ? (
              <button
                onClick={() => setIsAddingProfile(true)}
                className="btn-pill"
                style={{ width: '100%', justifyContent: 'center', borderColor: 'rgba(139, 92, 246, 0.3)' }}
              >
                + Add Family Member / Child Profile
              </button>
            ) : (
              <div style={{ padding: '0.85rem', backgroundColor: '#111118', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.6rem' }}>
                  Create New Profile:
                </div>
                <input
                  type="text"
                  placeholder="e.g. Maya (6th Grade)"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#07070a',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.85rem',
                    marginBottom: '0.6rem'
                  }}
                />
                <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.8rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#a1a1aa', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="role"
                      checked={newProfileRole === 'kid'}
                      onChange={() => setNewProfileRole('kid')}
                      style={{ accentColor: '#8b5cf6' }}
                    />
                    <span>Student / Kid (Safe Mode)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#a1a1aa', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="role"
                      checked={newProfileRole === 'parent'}
                      onChange={() => setNewProfileRole('parent')}
                      style={{ accentColor: '#8b5cf6' }}
                    />
                    <span>General / Parent</span>
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={handleCreateProfile} className="btn-pill btn-pill-primary" style={{ flex: 1, justifyContent: 'center' }}>
                    Save Profile
                  </button>
                  <button onClick={() => setIsAddingProfile(false)} className="btn-pill" style={{ color: '#71717a' }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Sovereign Memory Vault */}
        {activeTab === 'memory' && (
          <div>
            <div style={{ fontSize: '0.8rem', color: '#a1a1aa', marginBottom: '0.85rem', lineHeight: 1.5 }}>
              Standing facts, learning preferences, and goals saved for <strong style={{ color: '#ffffff' }}>{activeProfile.name}</strong>. Stored in this browser. Export a JSON backup from the sidebar to take them with you.
            </div>

            {/* Add Memory Input */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="text"
                placeholder="e.g. Loves astronomy analogies; learning fractions in 5th grade..."
                value={newMemoryText}
                onChange={(e) => setNewMemoryText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddMemory()}
                style={{
                  flex: 1,
                  background: '#07070a',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  padding: '0.5rem 0.75rem',
                  fontSize: '0.82rem'
                }}
              />
              <button onClick={handleAddMemory} className="btn-pill btn-pill-primary" style={{ fontSize: '0.78rem' }}>
                Add
              </button>
            </div>

            {/* Memories List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '250px', overflowY: 'auto', marginBottom: '1rem' }}>
              {memories.length === 0 ? (
                <div style={{ padding: '1.25rem', textAlign: 'center', color: '#71717a', fontSize: '0.8rem', fontStyle: 'italic' }}>
                  No saved memories yet for this profile. Add a preference above or type "Remember that I like X" in chat!
                </div>
              ) : (
                memories.map(m => (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.55rem 0.75rem',
                      background: '#111118',
                      borderRadius: '8px',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      fontSize: '0.82rem',
                      color: '#ffffff'
                    }}
                  >
                    <span>📌 {m.text}</span>
                    <button
                      onClick={() => handleDeleteMemory(m.id)}
                      style={{ background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: '1rem' }}
                      title="Delete memory"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Export / Clear */}
            {memories.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button onClick={handleExportMemories} className="btn-pill" style={{ fontSize: '0.72rem' }}>
                  📥 Export Memory (.json)
                </button>
                <button onClick={handleClearMemories} className="btn-pill" style={{ fontSize: '0.72rem', color: '#f87171' }}>
                  🗑 Clear All
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Parental Controls */}
        {activeTab === 'parental' && (
          <div>
            <div style={{ padding: '1rem', backgroundColor: '#111118', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.3)', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span>🔒 4-Digit Parental PIN</span>
                  <span style={{ fontSize: '0.68rem', backgroundColor: pinConfigured ? 'rgba(52, 211, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: pinConfigured ? '#34d399' : '#f87171', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                    {pinConfigured ? 'Configured' : 'Not Set'}
                  </span>
                </div>
                <button onClick={onOpenPinSetup} className="btn-pill btn-pill-primary" style={{ fontSize: '0.75rem' }}>
                  {pinConfigured ? 'Change PIN' : 'Set PIN'}
                </button>
              </div>
              <p style={{ fontSize: '0.78rem', color: '#a1a1aa', margin: 0, lineHeight: 1.5 }}>
                When a PIN is set, this profile cannot switch to an unrestricted profile from the UI without it. The PIN is hashed in this browser. It is a household speed-bump, not a content filter and not COPPA. The local model can still speak if asked.
              </p>
            </div>

            <div style={{ padding: '1rem', backgroundColor: '#111118', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.4rem' }}>
                🛡️ Internet Safety Sentinel
              </div>
              <p style={{ fontSize: '0.78rem', color: '#a1a1aa', margin: '0 0 0.6rem 0', lineHeight: 1.5 }}>
                On student profiles, phone numbers, home addresses, school names, emails, and passwords block the send. The text stays in the box so they can edit. Adult profiles get a warning and still send.
              </p>
              <div style={{ fontSize: '0.72rem', color: '#34d399', fontFamily: 'var(--font-mono)' }}>
                Kid send is blocked on a PII hit. Network tools are off.
              </div>
            </div>
          </div>
        )}

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn-pill btn-pill-primary" style={{ minWidth: '100px', justifyContent: 'center' }}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
