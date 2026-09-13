import React from 'react';
import { Message } from '../types';
import { ThoughtDrawer } from './ThoughtDrawer';
import { ToolDrawer } from './ToolDrawer';
import { CopyButton } from './CopyButton';
import { MarkdownRenderer } from './MarkdownRenderer';

interface MessageItemProps {
  message: Message;
  onOpenDocument?: (content: string) => void;
  onRateMessage?: (rating: 'heaven' | 'hell' | 'neutral') => void;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message, onOpenDocument, onRateMessage }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex flex-col w-full ${isUser ? 'items-end' : 'items-start'} my-3.5`}>
      {/* Role / Timestamp / Header row */}
      <div className="flex items-center justify-between gap-2 mb-1.5 px-2 text-xs font-mono text-zinc-500" style={{ maxWidth: isUser ? '88%' : '98%', width: '100%' }}>
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
        {/* Render tool executions in deterministic rectangular boxes */}
        {message.toolsUsed && message.toolsUsed.length > 0 && (
          <div className="w-full mb-3">
            {message.toolsUsed.map((t, idx) => (
              <ToolDrawer key={idx} tool={t} />
            ))}
          </div>
        )}

        {/* Thought trace accordion if assistant reasoning exists */}
        {!isUser && message.thinking && (
          <ThoughtDrawer 
            thinking={message.thinking} 
            durationMs={message.thoughtDurationMs} 
            loopProtected={message.loopProtected}
          />
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
          <div className="mt-3 pt-2.5 border-t border-zinc-800/40 flex items-center justify-between gap-2 flex-wrap">
            {/* Tri-Lake Rating: Thumbs Up (Heaven) / Thumbs Down (Hell) */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onRateMessage?.(message.rating === 'heaven' ? 'neutral' : 'heaven')}
                className="btn-pill"
                style={{
                  fontSize: '0.72rem',
                  padding: '0.2rem 0.5rem',
                  backgroundColor: message.rating === 'heaven' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(39, 39, 42, 0.4)',
                  borderColor: message.rating === 'heaven' ? 'rgba(74, 222, 128, 0.5)' : 'rgba(63, 63, 70, 0.4)',
                  color: message.rating === 'heaven' ? '#4ade80' : '#a1a1aa'
                }}
                title="Approve (Heaven Lake) — truthful, accurate, verified"
              >
                <span>👍</span>
                {message.rating === 'heaven' && <span style={{ marginLeft: '0.3rem', fontSize: '0.68rem', fontWeight: 600 }}>Heaven</span>}
              </button>

              <button
                type="button"
                onClick={() => onRateMessage?.(message.rating === 'hell' ? 'neutral' : 'hell')}
                className="btn-pill"
                style={{
                  fontSize: '0.72rem',
                  padding: '0.2rem 0.5rem',
                  backgroundColor: message.rating === 'hell' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(39, 39, 42, 0.4)',
                  borderColor: message.rating === 'hell' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(63, 63, 70, 0.4)',
                  color: message.rating === 'hell' ? '#f87171' : '#a1a1aa'
                }}
                title="Reject (Hell Lake) — hallucination, error, loop"
              >
                <span>👎</span>
                {message.rating === 'hell' && <span style={{ marginLeft: '0.3rem', fontSize: '0.68rem', fontWeight: 600 }}>Hell</span>}
              </button>
            </div>

            {/* Right: Document Studio & Copy Response */}
            <div className="flex items-center gap-2">
              {onOpenDocument && (
                <button
                  type="button"
                  onClick={() => onOpenDocument(message.content)}
                  className="btn-pill"
                  style={{
                    fontSize: '0.72rem',
                    padding: '0.2rem 0.55rem',
                    backgroundColor: 'rgba(139, 92, 246, 0.12)',
                    borderColor: 'rgba(139, 92, 246, 0.25)',
                    color: '#c4b5fd'
                  }}
                  title="Open in Document Studio for human touch-up and multi-format export"
                >
                  <span>📝</span> Edit &amp; Export
                </button>
              )}
              <CopyButton text={message.content} label="Copy Response" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
