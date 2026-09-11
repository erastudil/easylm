import React from 'react';

interface HnaiLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const HnaiLogo: React.FC<HnaiLogoProps> = ({ className = '', size = 'md' }) => {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  const pad = isSm ? '0.15rem 0.45rem' : isLg ? '0.35rem 0.85rem' : '0.2rem 0.55rem';
  const fontSize = isSm ? '0.7rem' : isLg ? '0.95rem' : '0.78rem';

  return (
    <span
      className={`inline-flex items-center select-none font-mono ${className}`}
      style={{
        background: '#000000',
        border: '1px solid #8b5cf6',
        borderRadius: '8px',
        padding: pad,
        fontSize: fontSize,
        lineHeight: 1,
        letterSpacing: '-0.02em',
        boxShadow: '0 0 10px rgba(139, 92, 246, 0.25)',
        display: 'inline-flex',
        alignItems: 'center',
        verticalAlign: 'middle',
      }}
      title="Humans and AI"
    >
      <span style={{ color: '#ffffff', fontWeight: 600 }}>humans</span>
      <span style={{ color: '#808080', fontWeight: 600 }}>&amp;</span>
      <span style={{ color: '#ffffff', fontWeight: 600 }}>ai</span>
    </span>
  );
};
