import React, { useState } from 'react';
import { Session } from '../types';
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
  clearProfileMemories,
  AtMemCategory,
  AtMemAtom
} from '../engine/family';
import { analyzeTriLakePatterns } from '../engine/storage';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestPinVerify: (onSuccess: () => void) => void;
  onOpenPinSetup: () => void;
  onProfileChanged: (profile: UserProfile) => void;
  sessions?: Session[];
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  onRequestPinVerify,
  onOpenPinSetup,
  onProfileChanged,
  sessions
}) => {
  const [profiles, setProfiles] = useState<UserProfile[]>(() => loadProfiles());
  const [activeProfile, setActiveProfile] = useState<UserProfile>(() => getActiveProfile());
  const [newMemoryText, setNewMemoryText] = useState('');
  const [newMemoryCategory, setNewMemoryCategory] = useState<AtMemCategory>('fact');
  const [newMemoryGoverned, setNewMemoryGoverned] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | AtMemCategory>('all');
  const [memoryError, setMemoryError] = useState<string | null>(null);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileRole, setNewProfileRole] = useState<'parent' | 'kid'>('kid');
  const [isAddingProfile, setIsAddingProfile] = useState(false);
  const [activeTab, setActiveTab] = useState<'profiles' | 'memory' | 'parental'>('profiles');
  const [analysisBanner, setAnalysisBanner] = useState<{ text: string; ok: boolean } | null>(null);

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
    setMemoryError(null);
    try {
      addProfileMemory(
        activeProfile.id,
        newMemoryText.trim(),
        newMemoryCategory,
        activeProfile.role === 'kid' && newMemoryGoverned,
        activeProfile.role === 'kid' && newMemoryGoverned ? 'parent' : 'user'
      );
      setNewMemoryText('');
      setNewMemoryGoverned(false);
      setActiveProfile({ ...activeProfile });
    } catch (err: any) {
      setMemoryError(err?.message || 'Failed to add memory');
    }
  };

  const handleDeleteMemory = (m: AtMemAtom) => {
    setMemoryError(null);
    if (m.governed && pinConfigured) {
      onRequestPinVerify(() => {
        deleteProfileMemory(m.id, true);
        setActiveProfile({ ...activeProfile });
      });
    } else {
      deleteProfileMemory(m.id, false);
      setActiveProfile({ ...activeProfile });
    }
  };

  const handleClearMemories = () => {
    setMemoryError(null);
    if (confirm(`Clear elective memories for ${activeProfile.name}? Standing governed mandates will be preserved.`)) {
      clearProfileMemories(activeProfile.id, false);
      setActiveProfile({ ...activeProfile });
    }
  };

  const handleAnalyzeLakes = () => {
    const res = analyzeTriLakePatterns(sessions || [], activeProfile.id);
    setAnalysisBanner({ text: res.message, ok: res.insightsAdded > 0 || res.totalRated > 0 });
    setActiveProfile({ ...activeProfile });
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
    <div className="modal-overlay" style={{
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
      <div className="card-panel" style={{ width: '100%', maxWidth: '640px', maxHeight: '92vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
        {/* Fixed Header & Tabs HUD (Never scrolls away) */}
        <div style={{
          padding: '1.4rem 1.75rem 0.85rem',
          borderBottom: '1px solid rgba(139, 92, 246, 0.25)',
          backgroundColor: '#09090e',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>👨‍👩‍👧</span> Family &amp; Profiles
            </h2>
            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: '#71717a', fontSize: '1.5rem', cursor: 'pointer', padding: '0 0.25rem', lineHeight: 1 }}
              title="Close"
            >
              ×
            </button>
          </div>

          {/* Tab Navigation */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
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
              👥 Profiles
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
              🧠 Memory Vault
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
        </div>

        {/* Scrollable Content Body */}
        <div style={{
          padding: '1.4rem 1.75rem 1.75rem',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem'
        }}>

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

        {/* Tab 2: Sovereign Memory Vault (AtMem & Governance) */}
        {activeTab === 'memory' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ fontSize: '0.78rem', color: '#a1a1aa', lineHeight: 1.5 }}>
              AtMem sovereign memory for <strong style={{ color: '#ffffff' }}>{activeProfile.name}</strong>. Discrete rules, goals, preferences, and facts filtered attentively at runtime under a 256-token budget.
            </div>

            {/* Error Message */}
            {memoryError && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '8px',
                padding: '0.55rem 0.75rem',
                fontSize: '0.75rem',
                color: '#fca5a5'
              }}>
                ⚠ {memoryError}
              </div>
            )}

            {/* Tri-Lake Analysis Notification Banner */}
            {analysisBanner && (
              <div style={{
                backgroundColor: analysisBanner.ok ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                border: analysisBanner.ok ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '8px',
                padding: '0.65rem 0.85rem',
                fontSize: '0.78rem',
                color: analysisBanner.ok ? '#34d399' : '#fca5a5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem'
              }}>
                <span>{analysisBanner.text}</span>
                <button
                  onClick={() => setAnalysisBanner(null)}
                  style={{ background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}
                >
                  ×
                </button>
              </div>
            )}

            {/* Add Memory Form */}
            <div style={{
              backgroundColor: '#111118',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              borderRadius: '10px',
              padding: '0.85rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem'
            }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="e.g. Preparing for biology exam on Friday; loves astronomy analogies..."
                  value={newMemoryText}
                  onChange={(e) => setNewMemoryText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddMemory()}
                  style={{
                    flex: 1,
                    minWidth: '220px',
                    background: '#07070a',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    color: '#ffffff',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.82rem'
                  }}
                />

                <select
                  value={newMemoryCategory}
                  onChange={(e) => setNewMemoryCategory(e.target.value as AtMemCategory)}
                  style={{
                    backgroundColor: '#07070a',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    borderRadius: '8px',
                    color: '#c4b5fd',
                    padding: '0.45rem 0.6rem',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    cursor: 'pointer'
                  }}
                >
                  <option value="fact">Fact</option>
                  <option value="goal">Goal</option>
                  <option value="preference">Preference</option>
                  <option value="rule">Rule</option>
                </select>

                <button
                  onClick={handleAddMemory}
                  className="btn-pill btn-pill-primary"
                  style={{ fontSize: '0.78rem', padding: '0.45rem 0.85rem' }}
                >
                  Add Memory
                </button>
              </div>

              {activeProfile.role === 'kid' && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.74rem', color: '#c4b5fd', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={newMemoryGoverned}
                    onChange={(e) => setNewMemoryGoverned(e.target.checked)}
                    style={{ accentColor: '#8b5cf6' }}
                  />
                  <span>🛡️ Set as Governed Mandate (Protected by Parental PIN)</span>
                </label>
              )}
            </div>

            {/* Category Filter Pills */}
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {(['all', 'rule', 'goal', 'preference', 'fact', 'insight'] as const).map((cat) => {
                const isSel = categoryFilter === cat;
                const label = cat === 'all' ? 'All' : cat === 'rule' ? 'Rules' : cat === 'goal' ? 'Goals' : cat === 'preference' ? 'Preferences' : cat === 'fact' ? 'Facts' : 'Insights';
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className="btn-pill"
                    style={{
                      fontSize: '0.68rem',
                      padding: '0.2rem 0.55rem',
                      backgroundColor: isSel ? 'rgba(139, 92, 246, 0.25)' : '#07070a',
                      borderColor: isSel ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)',
                      color: isSel ? '#ffffff' : '#a1a1aa',
                      fontWeight: isSel ? 600 : 400
                    }}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Memories List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '240px', overflowY: 'auto' }}>
              {memories.length === 0 ? (
                <div style={{ padding: '1.25rem', textAlign: 'center', color: '#71717a', fontSize: '0.78rem', fontStyle: 'italic' }}>
                  No saved memories yet for this profile. Add a preference above or type "Remember that I like X" in chat!
                </div>
              ) : (
                memories
                  .filter(m => categoryFilter === 'all' || m.category === categoryFilter)
                  .map(m => {
                    const badgeColor = m.governed
                      ? { bg: 'rgba(139, 92, 246, 0.25)', border: '#8b5cf6', text: '#c4b5fd' }
                      : m.category === 'rule'
                      ? { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.35)', text: '#fca5a5' }
                      : m.category === 'goal'
                      ? { bg: 'rgba(14, 165, 233, 0.15)', border: 'rgba(14, 165, 233, 0.35)', text: '#7dd3fc' }
                      : m.category === 'preference'
                      ? { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.35)', text: '#86efac' }
                      : m.category === 'insight'
                      ? { bg: 'rgba(245, 158, 11, 0.15)', border: 'rgba(245, 158, 11, 0.35)', text: '#fcd34d' }
                      : { bg: 'rgba(255, 255, 255, 0.08)', border: 'rgba(255, 255, 255, 0.15)', text: '#d4d4d8' };

                    const badgeLabel = m.governed
                      ? '🛡️ Mandate'
                      : m.category.charAt(0).toUpperCase() + m.category.slice(1);

                    return (
                      <div
                        key={m.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.5rem 0.75rem',
                          background: '#111118',
                          borderRadius: '8px',
                          border: m.governed ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid rgba(255, 255, 255, 0.08)',
                          fontSize: '0.8rem',
                          color: '#ffffff',
                          gap: '0.5rem'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0 }}>
                          <span style={{
                            fontSize: '0.65rem',
                            fontFamily: 'var(--font-mono)',
                            fontWeight: 600,
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            backgroundColor: badgeColor.bg,
                            border: `1px solid ${badgeColor.border}`,
                            color: badgeColor.text,
                            flexShrink: 0
                          }}>
                            {badgeLabel}
                          </span>
                          <span style={{ wordBreak: 'break-word' }}>{m.text}</span>
                        </div>

                        <button
                          onClick={() => handleDeleteMemory(m)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#71717a',
                            cursor: 'pointer',
                            fontSize: '1.1rem',
                            padding: '0 0.25rem',
                            flexShrink: 0
                          }}
                          title={m.governed ? 'Requires Parental PIN to delete' : 'Delete memory'}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })
              )}
            </div>

            {/* Analysis & Actions */}
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginTop: '0.35rem' }}>
              <button
                onClick={handleAnalyzeLakes}
                className="btn-pill"
                style={{
                  fontSize: '0.74rem',
                  padding: '0.35rem 0.75rem',
                  backgroundColor: 'rgba(139, 92, 246, 0.2)',
                  borderColor: '#8b5cf6',
                  color: '#ffffff',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
                title="Scan approved and rejected responses across all chats, extract style & domain patterns, and store them in this profile's memory bank"
              >
                <span>⚡</span> Analyze Lake Patterns
              </button>

              <div style={{ display: 'flex', gap: '0.45rem' }}>
                {memories.length > 0 && (
                  <>
                    <button onClick={handleExportMemories} className="btn-pill" style={{ fontSize: '0.72rem' }}>
                      📥 Export JSON
                    </button>
                    <button onClick={handleClearMemories} className="btn-pill" style={{ fontSize: '0.72rem', color: '#f87171' }}>
                      🗑 Clear Elective
                    </button>
                  </>
                )}
              </div>
            </div>
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
    </div>
  );
};
