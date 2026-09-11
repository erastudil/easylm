import React, { useState } from 'react';

interface ThoughtDrawerProps {
  thinking: string;
  durationMs?: number;
  loopProtected?: boolean;
}

export const ThoughtDrawer: React.FC<ThoughtDrawerProps> = ({ thinking, durationMs, loopProtected }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!thinking || !thinking.trim()) return null;

  const durationSec = durationMs ? (durationMs / 1000).toFixed(1) : undefined;
  const tokenEst = Math.ceil(thinking.length / 4);
  const isLoopCapped = loopProtected || thinking.includes('Anti-Loop Sentinel');

  return (
    <div className="thought-drawer">
      <div 
        className="thought-header" 
        onClick={() => setIsOpen(!isOpen)}
        title="Click to view raw reasoning traces"
      >
        <span className="flex items-center gap-2">
          <span>🧠 Thought Trace</span>
          {durationSec ? (
            <span className="text-xs text-zinc-500">({durationSec}s)</span>
          ) : (
            <span className="text-xs text-purple-400 animate-pulse">(thinking...)</span>
          )}
          <span className="text-xs text-zinc-500">~{tokenEst} tokens</span>
          {isLoopCapped && (
            <span 
              className="text-xs px-1.5 py-0.5 rounded font-mono" 
              style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c4b5fd', border: '1px solid rgba(139, 92, 246, 0.3)' }}
              title="Anti-Loop Sentinel detected repetitive reasoning patterns and cleanly capped the thought trace"
            >
              🛡️ Anti-Loop Capped
            </span>
          )}
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
