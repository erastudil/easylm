import React, { useState } from 'react';
import {
  PERSONALITIES,
  PERSONALITY_CATEGORIES,
  ExtendedPersonality
} from '../data/personalities';

interface PersonalityModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPersonality: string;
  onSelectPersonality: (id: string) => void;
  onOpenCustomSettings?: () => void;
}

export const PersonalityModal: React.FC<PersonalityModalProps> = ({
  isOpen,
  onClose,
  selectedPersonality,
  onSelectPersonality,
  onOpenCustomSettings
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!isOpen) return null;

  const filteredPersonalities = PERSONALITIES.filter(p => {
    // Category match
    const categoryMatch = selectedCategory === 'all' || p.category === selectedCategory;

    // Search query match
    if (!categoryMatch) return false;
    if (!searchQuery.trim()) return true;

    const q = searchQuery.toLowerCase();
    const nameMatch = p.name.toLowerCase().includes(q);
    const descMatch = p.description.toLowerCase().includes(q);
    const eraMatch = p.era ? p.era.toLowerCase().includes(q) : false;
    const styleMatch = p.writingStyle ? p.writingStyle.toLowerCase().includes(q) : false;
    const badgeMatch = p.badge.toLowerCase().includes(q);
    const bookMatch = p.book ? p.book.toLowerCase().includes(q) : false;

    return nameMatch || descMatch || eraMatch || styleMatch || badgeMatch || bookMatch;
  });

  const handleSelect = (p: ExtendedPersonality) => {
    onSelectPersonality(p.id);
    onClose();
    if (p.id === 'custom' && onOpenCustomSettings) {
      onOpenCustomSettings();
    }
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
      zIndex: 160,
      padding: '1rem'
    }}>
      <div
        className="card-panel"
        style={{
          width: '100%',
          maxWidth: '780px',
          height: '85vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexShrink: 0 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff' }}>
              <span>🎭</span> Perspectives & Author Voices
            </h2>
            <div style={{ fontSize: '0.78rem', color: '#a1a1aa', marginTop: '0.2rem' }}>
              Choose a philosopher, scientist, classic author, or coach to shape thinking and writing style.
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#71717a', fontSize: '1.5rem', cursor: 'pointer', padding: '0 0.25rem' }}
            title="Close"
          >
            ×
          </button>
        </div>

        {/* Search Bar & Category Filter Row */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1rem', flexShrink: 0 }}>
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by thinker, author, style, or method (e.g. 'Feynman', 'Kant', 'gothic', 'deduction')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                background: '#07070a',
                border: '1px solid rgba(139, 92, 246, 0.35)',
                borderRadius: '10px',
                color: '#ffffff',
                padding: '0.6rem 0.85rem 0.6rem 2.2rem',
                fontSize: '0.85rem'
              }}
            />
            <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#71717a', fontSize: '0.9rem' }}>
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer' }}
              >
                ×
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
            {PERSONALITY_CATEGORIES.map(cat => {
              const isActive = selectedCategory === cat.id;
              const count = cat.id === 'all'
                ? PERSONALITIES.length
                : PERSONALITIES.filter(p => p.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="btn-pill"
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.65rem',
                    gap: '0.35rem',
                    whiteSpace: 'nowrap',
                    backgroundColor: isActive ? 'rgba(139, 92, 246, 0.25)' : '#111118',
                    borderColor: isActive ? '#8b5cf6' : 'rgba(139, 92, 246, 0.2)',
                    color: isActive ? '#ffffff' : '#a1a1aa'
                  }}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label} ({count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Personality Cards Grid */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '0.75rem', paddingRight: '0.25rem' }}>
          {filteredPersonalities.map(p => {
            const isSelected = selectedPersonality === p.id;
            return (
              <div
                key={p.id}
                onClick={() => handleSelect(p)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? 'rgba(139, 92, 246, 0.22)' : '#111118',
                  border: isSelected ? '1px solid #8b5cf6' : '1px solid rgba(139, 92, 246, 0.2)',
                  transition: 'all 0.15s ease',
                  position: 'relative'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ fontSize: '1.35rem' }}>{p.avatar}</span>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#ffffff' }}>
                        {p.name}
                      </span>
                    </div>
                    {isSelected && (
                      <span style={{ fontSize: '0.7rem', color: '#a78bfa', fontWeight: 700 }}>
                        ✓
                      </span>
                    )}
                  </div>

                  {p.book && (
                    <div style={{ fontSize: '0.68rem', color: '#c4b5fd', fontFamily: 'var(--font-mono)', marginBottom: '0.15rem' }}>
                      📖 {p.book}
                    </div>
                  )}

                  {p.era && (
                    <div style={{ fontSize: '0.68rem', color: '#8b5cf6', fontFamily: 'var(--font-mono)', marginBottom: '0.35rem' }}>
                      {p.era}
                    </div>
                  )}

                  <p style={{ fontSize: '0.75rem', color: '#a1a1aa', margin: '0 0 0.5rem 0', lineHeight: 1.45 }}>
                    {p.description}
                  </p>
                </div>

                <div>
                  {p.writingStyle && (
                    <div style={{ fontSize: '0.68rem', color: '#71717a', fontStyle: 'italic', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.4rem', marginTop: '0.2rem' }}>
                      ✍️ {p.writingStyle}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ fontSize: '0.72rem', color: '#71717a' }}>
            Historical figures & public domain literature. Zero brand infringement.
          </div>
          <button
            onClick={onClose}
            className="btn-pill btn-pill-primary"
            style={{ padding: '0.4rem 1.25rem' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
