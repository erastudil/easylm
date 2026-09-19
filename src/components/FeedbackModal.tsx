import React, { useState, useRef } from 'react';
import { HnaiLogo } from './HnaiLogo';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModel?: string;
}

const MAX_CHARS = 5000;
const FEEDBACK_EMAIL = 'humansandai@atomicmail.io';

// Whitelist of strictly safe static extensions & mime types
const ALLOWED_EXTENSIONS = ['.txt', '.md', '.docx', '.png', '.jpg', '.jpeg'];
const ALLOWED_MIME_TYPES = [
  'text/plain',
  'text/markdown',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg'
];

interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose, activeModel }) => {
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [attachments, setAttachments] = useState<AttachedFile[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [notice, setNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const valid: AttachedFile[] = [];
    const rejected: string[] = [];

    files.forEach(file => {
      const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
      const isExtAllowed = ALLOWED_EXTENSIONS.includes(ext);
      const isMimeAllowed = ALLOWED_MIME_TYPES.includes(file.type) || file.type === '';

      if (isExtAllowed && isMimeAllowed) {
        // Safe static file
        valid.push({
          id: `${file.name}-${file.size}-${Date.now()}`,
          name: file.name,
          size: file.size,
          type: file.type || ext
        });
      } else {
        // Disallowed / dynamic / non-static
        rejected.push(file.name);
      }
    });

    if (rejected.length > 0) {
      setRejectedFiles(prev => [...prev, ...rejected]);
      setNotice(`Rejected ${rejected.length} file(s). Only safe static documents (.txt, .md, .docx) and images (.png, .jpeg) are permitted.`);
    } else {
      setNotice(null);
    }

    if (valid.length > 0) {
      setAttachments(prev => [...prev, ...valid]);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const generateReportText = () => {
    const lines = [
      `=== EasyLM Public Beta Feedback ===`,
      `To: ${FEEDBACK_EMAIL}`,
      `Subject: ${subject || '[EasyLM Beta Feedback]'}`,
      `Date: ${new Date().toISOString()}`,
      `Model: ${activeModel || 'Qwen 2.5 3B'}`,
      `User Agent: ${navigator.userAgent}`,
      `WebGPU Available: ${'gpu' in navigator ? 'Yes' : 'No'}`,
      ``,
      `--- Attachments Prepared (${attachments.length}) ---`,
      attachments.length > 0
        ? attachments.map(a => `• ${a.name} (${formatFileSize(a.size)})`).join('\n')
        : '(None attached)',
      ``,
      `--- Feedback Message (${message.length}/${MAX_CHARS} chars) ---`,
      message || '(No message content entered)',
      ``,
      `==================================`
    ];
    return lines.join('\n');
  };

  const handleOpenEmail = () => {
    const finalSubject = subject.trim() ? `[EasyLM Beta] ${subject.trim()}` : `[EasyLM Beta Feedback] User Report`;
    
    let emailBody = `${message.trim()}\n\n`;
    emailBody += `----------------------------------------\n`;
    emailBody += `System Info:\n`;
    emailBody += `App: EasyLM (Public Beta)\n`;
    emailBody += `Model: ${activeModel || 'Qwen 2.5 3B'}\n`;
    emailBody += `WebGPU: ${'gpu' in navigator ? 'Active' : 'Unavailable'}\n`;
    emailBody += `Browser: ${navigator.userAgent}\n`;

    if (attachments.length > 0) {
      emailBody += `\nAttached Files In Review:\n`;
      emailBody += attachments.map(a => `- ${a.name} (${formatFileSize(a.size)})`).join('\n');
      emailBody += `\n(Please attach these files to this email before sending)\n`;
    }

    const mailtoUrl = `mailto:${FEEDBACK_EMAIL}?subject=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(emailBody)}`;
    window.open(mailtoUrl, '_blank');

    if (attachments.length > 0) {
      setNotice(`Email client opened! Please manually attach your ${attachments.length} selected file(s) before hitting send.`);
    }
  };

  const handleCopyReport = () => {
    const report = generateReportText();
    navigator.clipboard.writeText(report);
    setCopied(true);
    setNotice('✓ Full feedback report copied to clipboard! You can paste it directly into your email client.');
    setTimeout(() => setCopied(false), 2500);
  };

  const remainingChars = MAX_CHARS - message.length;
  const isNearLimit = remainingChars < 250;

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 125,
        padding: '1rem'
      }}
      onClick={onClose}
    >
      <div
        className="card-panel"
        style={{
          width: '100%',
          maxWidth: '620px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          backgroundColor: '#0a0a10',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(139, 92, 246, 0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '1.1rem 1.4rem',
          borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#08080d'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <HnaiLogo size="sm" />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.05rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#ffffff' }}>
                  💬 Public Beta Feedback
                </h2>
                <span style={{
                  fontSize: '0.62rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '9999px',
                  backgroundColor: 'rgba(234, 179, 8, 0.15)',
                  border: '1px solid rgba(234, 179, 8, 0.4)',
                  color: '#fde047'
                }}>
                  Beta
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#a1a1aa', marginTop: '0.15rem' }}>
                Direct channel to the developers: <span style={{ color: '#c4b5fd', fontFamily: 'var(--font-mono)' }}>{FEEDBACK_EMAIL}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#a1a1aa',
              fontSize: '1.25rem',
              cursor: 'pointer',
              padding: '0.2rem 0.5rem'
            }}
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: '1.25rem 1.4rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Status / Alert Banner */}
          {notice && (
            <div style={{
              backgroundColor: 'rgba(139, 92, 246, 0.12)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              borderRadius: '10px',
              padding: '0.65rem 0.9rem',
              fontSize: '0.8rem',
              color: '#f4f4f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem'
            }}>
              <span>{notice}</span>
              <button
                onClick={() => setNotice(null)}
                style={{ background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer', fontSize: '0.85rem' }}
              >
                ✕
              </button>
            </div>
          )}

          {/* Subject Field */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#c4b5fd', marginBottom: '0.35rem' }}>
              Subject
            </label>
            <input
              type="text"
              placeholder="e.g. Bug report: DeepSeek thinking loop / UI idea / Feedback"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#07070b',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '8px',
                color: '#ffffff',
                padding: '0.55rem 0.8rem',
                fontSize: '0.85rem'
              }}
            />
          </div>

          {/* Message Textarea */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#c4b5fd' }}>
                Feedback Details &amp; Reproduction Steps
              </label>
              <span style={{
                fontSize: '0.72rem',
                fontFamily: 'var(--font-mono)',
                color: isNearLimit ? '#ef4444' : '#71717a'
              }}>
                {message.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
              </span>
            </div>
            <textarea
              rows={6}
              maxLength={MAX_CHARS}
              placeholder="Describe what happened, what you expected, or what features you would love to see. If reporting an issue, include what model was selected and steps to reproduce..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#07070b',
                border: isNearLimit ? '1px solid #ef4444' : '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '8px',
                color: '#ffffff',
                padding: '0.65rem 0.8rem',
                fontSize: '0.85rem',
                lineHeight: 1.5,
                resize: 'vertical',
                fontFamily: 'var(--font-sans)'
              }}
            />
          </div>

          {/* Safe Static File Attachments */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <label style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: '#c4b5fd' }}>
                Safe Static Attachments (Screenshots, Logs &amp; Writeups)
              </label>
              <span style={{ fontSize: '0.68rem', color: '#71717a', fontFamily: 'var(--font-mono)' }}>
                .txt · .md · .docx · .png · .jpeg
              </span>
            </div>

            <div style={{
              backgroundColor: '#07070b',
              border: '1px dashed rgba(139, 92, 246, 0.35)',
              borderRadius: '10px',
              padding: '0.8rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                  Attach screenshots (.png, .jpg) or detailed documents (.txt, .md, .docx).
                </span>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-pill"
                  style={{ fontSize: '0.72rem', padding: '0.25rem 0.65rem', borderColor: '#8b5cf6', color: '#c4b5fd' }}
                >
                  📎 Choose Files
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".txt,.md,.docx,.png,.jpg,.jpeg,text/plain,text/markdown,image/png,image/jpeg,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </div>

              {/* Security Rule Warning */}
              <div style={{ fontSize: '0.68rem', color: '#71717a', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.4rem' }}>
                🛡️ <strong style={{ color: '#a1a1aa' }}>Static Safety Filter:</strong> Dynamic scripts, executables, HTML, and archive files (.exe, .js, .py, .zip, .html) are strictly rejected to ensure malware-free feedback.
              </div>

              {/* Attached List */}
              {attachments.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.2rem' }}>
                  {attachments.map(file => (
                    <span
                      key={file.id}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontSize: '0.72rem',
                        fontFamily: 'var(--font-mono)',
                        backgroundColor: 'rgba(139, 92, 246, 0.15)',
                        border: '1px solid rgba(139, 92, 246, 0.35)',
                        borderRadius: '6px',
                        padding: '0.2rem 0.5rem',
                        color: '#ffffff'
                      }}
                    >
                      <span>📎 {file.name}</span>
                      <span style={{ color: '#a1a1aa', fontSize: '0.65rem' }}>({formatFileSize(file.size)})</span>
                      <button
                        onClick={() => removeAttachment(file.id)}
                        style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0, marginLeft: '0.2rem' }}
                        title="Remove file"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {rejectedFiles.length > 0 && (
                <div style={{ fontSize: '0.7rem', color: '#f87171' }}>
                  ⚠️ Disallowed non-static file(s) omitted: {rejectedFiles.slice(-3).join(', ')}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '0.9rem 1.4rem',
          borderTop: '1px solid rgba(139, 92, 246, 0.2)',
          backgroundColor: '#07070a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.6rem'
        }}>
          <button
            onClick={handleCopyReport}
            className="btn-pill"
            style={{
              fontSize: '0.75rem',
              padding: '0.35rem 0.75rem',
              backgroundColor: copied ? '#10b981' : 'rgba(255,255,255,0.05)',
              color: copied ? '#000000' : '#e4e4e7',
              borderColor: copied ? '#10b981' : 'rgba(139, 92, 246, 0.3)'
            }}
            title="Copy full report to clipboard to paste into webmail (Gmail, Proton, etc.)"
          >
            {copied ? '✓ Copied Report' : '📋 Copy Report'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={onClose}
              className="btn-pill"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.85rem' }}
            >
              Cancel
            </button>
            <button
              onClick={handleOpenEmail}
              className="btn-pill btn-pill-primary"
              style={{
                fontSize: '0.78rem',
                padding: '0.35rem 1.1rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>✉️</span>
              <span>Open in Email Client</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
