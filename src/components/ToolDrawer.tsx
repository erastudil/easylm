import React, { useState } from 'react';
import { ToolExecution } from '../types';
import { CopyButton } from './CopyButton';

interface ToolDrawerProps {
  tool: ToolExecution;
}

export const ToolDrawer: React.FC<ToolDrawerProps> = ({ tool }) => {
  const toolUpper = (tool.tool || 'TOOL').toUpperCase();
  const isMath = toolUpper === 'CALC' || toolUpper === 'UNITS';
  const [isOpen, setIsOpen] = useState(isMath);

  const summarySnippet = (tool.result || '').replace(/\n+/g, ' ').slice(0, 60);

  return (
    <div
      style={{
        backgroundColor: '#07070c',
        border: '1px solid rgba(139, 92, 246, 0.35)',
        borderLeft: isMath ? '3px solid #8b5cf6' : '1px solid rgba(139, 92, 246, 0.35)',
        borderRadius: isMath ? '2px' : '4px', // Strict rectangular box for math to signal objectivity
        marginBottom: '0.75rem',
        overflow: 'hidden',
        fontFamily: 'var(--font-mono)'
      }}
    >
      {/* Rectangular Header - Collapsed by default, auto-expanded for objective math */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '0.45rem 0.75rem',
          backgroundColor: isMath ? '#0a0a14' : '#0d0d16',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          fontSize: '0.76rem',
          userSelect: 'none'
        }}
        title="Click to expand/collapse deterministic tool output"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <span style={{ color: isMath ? '#c4b5fd' : '#10b981', fontWeight: 600 }}>
            {isMath ? '📐' : '⚡'} {toolUpper}
          </span>
          <span style={{ color: '#71717a' }}>·</span>
          <span style={{ color: '#a1a1aa', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {tool.query ? `"${tool.query}"` : summarySnippet}
          </span>
          {tool.durationMs !== undefined && (
            <span style={{ color: '#52525b', fontSize: '0.7rem' }}>({tool.durationMs}ms)</span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <span style={{ color: '#8b5cf6', fontSize: '0.72rem' }}>
            {isOpen ? '▲ Collapse' : '▶ Expand'}
          </span>
        </div>
      </div>

      {/* Rectangular Output Body */}
      {isOpen && (
        <div
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#040407',
            borderTop: '1px dashed rgba(139, 92, 246, 0.25)',
            fontSize: '0.8rem',
            lineHeight: 1.6,
            color: '#e4e4e7',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            position: 'relative'
          }}
        >
          <div style={{ position: 'absolute', top: '0.4rem', right: '0.5rem' }}>
            <CopyButton text={tool.result} label="Copy Output" />
          </div>
          <div style={{ paddingRight: '2rem' }}>
            {tool.result}
          </div>
        </div>
      )}
    </div>
  );
};
