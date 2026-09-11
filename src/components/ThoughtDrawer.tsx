import React, { useState } from 'react';

interface ThoughtDrawerProps {
  thinking: string;
  durationMs?: number;
}

export const ThoughtDrawer: React.FC<ThoughtDrawerProps> = ({ thinking, durationMs }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!thinking || !thinking.trim()) return null;

  const durationSec = durationMs ? (durationMs / 1000).toFixed(1) : undefined;
  const tokenEst = Math.ceil(thinking.length / 4);

  return (
    <div className="thought-drawer">
      <div 
        className="thought-header" 
        onClick={() => setIsOpen(!isOpen)}
        title="Click to view raw reasoning traces"
      >
        <span className="flex items-center gap-2">
          <span>🧠 Thought Trace</span>
          {durationSec && <span className="text-xs text-zinc-500">({durationSec}s)</span>}
          <span className="text-xs text-zinc-500">~{tokenEst} tokens</span>
        </span>
        <span className="text-xs">{isOpen ? '▲ collapse' : '▼ expand'}</span>
      </div>
      {isOpen && (
        <div className="thought-body font-mono">
          {thinking}
        </div>
      )}
    </div>
  );
};
