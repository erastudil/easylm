import React from 'react';
import { Message } from '../types';
import { ThoughtDrawer } from './ThoughtDrawer';
import { CopyButton } from './CopyButton';
import { MarkdownRenderer } from './MarkdownRenderer';

interface MessageItemProps {
  message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex flex-col w-full ${isUser ? 'items-end' : 'items-start'} my-2.5`}>
      {/* Role / Timestamp / Header row */}
      <div className="flex items-center justify-between gap-2 mb-1 px-2 text-xs font-mono text-zinc-500" style={{ maxWidth: isUser ? '85%' : '90%', width: '100%' }}>
        <div className="flex items-center gap-1.5">
          <span style={{ color: isUser ? '#c4b5fd' : '#a78bfa', fontWeight: 600 }}>
            {isUser ? 'You' : 'EasyLM'}
          </span>
          <span>·</span>
          <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        
        {/* Sleek copy button in header for user prompts */}
        {isUser && (
          <CopyButton text={message.content} label="Copy" />
        )}
      </div>

      {/* Main bubble */}
      <div className={isUser ? 'bubble-user' : 'bubble-assistant'}>
        {/* Render tool executions if any */}
        {message.toolsUsed && message.toolsUsed.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {message.toolsUsed.map((t, idx) => (
              <div key={idx} className="tool-badge" title={`Execution completed in ${t.durationMs}ms`}>
                <span>⚡ {t.tool}:</span>
                <span className="text-zinc-300 truncate max-w-sm">{t.result}</span>
              </div>
            ))}
          </div>
        )}

        {/* Thought trace accordion if assistant reasoning exists */}
        {!isUser && message.thinking && (
          <ThoughtDrawer thinking={message.thinking} durationMs={message.thoughtDurationMs} />
        )}

        {/* Markdown Content rendering */}
        {isUser ? (
          <div className="whitespace-pre-wrap leading-relaxed">
            {message.content}
          </div>
        ) : (
          <MarkdownRenderer content={message.content} />
        )}

        {/* Sleek Action bar for assistant message */}
        {!isUser && (
          <div className="mt-3 pt-2.5 border-t border-zinc-800/40 flex items-center justify-end">
            <CopyButton text={message.content} label="Copy Response" />
          </div>
        )}
      </div>
    </div>
  );
};
