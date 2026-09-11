import React, { useState } from 'react';
import { Message } from '../types';
import { ThoughtDrawer } from './ThoughtDrawer';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex flex-col w-full ${isUser ? 'items-end' : 'items-start'} my-2`}>
      {/* Role / Tool header */}
      <div className="flex items-center gap-2 mb-1 px-2 text-xs font-mono text-zinc-500">
        <span>{isUser ? 'You' : 'EasyLM Spindle'}</span>
        <span>·</span>
        <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>

      {/* Main bubble */}
      <div className={isUser ? 'bubble-user' : 'bubble-assistant'}>
        {/* Render tool executions if any */}
        {message.toolsUsed && message.toolsUsed.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {message.toolsUsed.map((t, idx) => (
              <div key={idx} className="tool-badge" title={`Execution took ${t.durationMs}ms`}>
                <span>⚡ {t.tool}:</span>
                <span className="text-zinc-300 truncate max-w-xs">{t.result}</span>
              </div>
            ))}
          </div>
        )}

        {/* Thought trace accordion if assistant reasoning exists */}
        {!isUser && message.thinking && (
          <ThoughtDrawer thinking={message.thinking} durationMs={message.thoughtDurationMs} />
        )}

        {/* Content */}
        <div className="prose-content whitespace-pre-wrap">
          {message.content}
        </div>

        {/* Action bar for assistant message */}
        {!isUser && (
          <div className="mt-3 pt-2 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-500 font-mono">
            <span>WebGPU local VRAM</span>
            <button
              onClick={handleCopy}
              className="hover:text-purple-400 bg-transparent border-none cursor-pointer transition-colors"
              title="Copy message to clipboard"
            >
              {copied ? '✓ Copied' : '📋 Copy'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
