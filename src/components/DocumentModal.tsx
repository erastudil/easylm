import React, { useState } from 'react';
import {
  DocumentMetadata,
  downloadBlob,
  exportJsonDocument,
  exportWordDoc,
  markdownTableToCsv,
  markdownToLatex,
  printOrSavePdf,
  sanitizeFilename,
  stripMarkdown
} from '../engine/export';
import { MarkdownRenderer } from './MarkdownRenderer';

interface DocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialContent?: string;
  initialTitle?: string;
  initialSubject?: string;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  isOpen,
  onClose,
  initialContent = '',
  initialTitle = 'Academic Assignment',
  initialSubject = 'General Studies'
}) => {
  const [content, setContent] = useState(initialContent);
  const [title, setTitle] = useState(initialTitle);
  const [author, setAuthor] = useState('EasyLM Scholar');
  const [subject, setSubject] = useState(initialSubject);
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const metadata: DocumentMetadata = {
    title: title.trim() || 'Document',
    author: author.trim() || 'Author',
    subject: subject.trim(),
    date
  };

  const showStatus = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 3500);
  };

  const handleExportPdf = () => {
    printOrSavePdf(content, metadata);
    showStatus('Prepared document for printing / PDF export.');
  };

  const handleExportWord = () => {
    exportWordDoc(content, metadata);
    showStatus('Exported Word document (.doc).');
  };

  const handleExportLatex = () => {
    const tex = markdownToLatex(content, metadata);
    downloadBlob(tex, `${sanitizeFilename(metadata.title)}.tex`, 'application/x-latex');
    showStatus('Exported LaTeX source (.tex).');
  };

  const handleExportCsv = () => {
    const csv = markdownTableToCsv(content);
    if (!csv) {
      alert('No Markdown table detected in this document. Add a table using | col1 | col2 | format.');
      return;
    }
    downloadBlob(csv, `${sanitizeFilename(metadata.title)}.csv`, 'text/csv');
    showStatus('Extracted and exported CSV spreadsheet.');
  };

  const handleExportMd = () => {
    downloadBlob(content, `${sanitizeFilename(metadata.title)}.md`, 'text/markdown');
    showStatus('Exported Markdown (.md).');
  };

  const handleExportTxt = () => {
    const plain = stripMarkdown(content);
    downloadBlob(plain, `${sanitizeFilename(metadata.title)}.txt`, 'text/plain');
    showStatus('Exported Plain Text (.txt).');
  };

  const handleExportJson = () => {
    exportJsonDocument(content, metadata);
    showStatus('Exported JSON document package.');
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;
  const readTimeMin = Math.ceil(wordCount / 200);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.88)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 150,
      padding: '1rem'
    }}>
      <div
        className="card-panel"
        style={{
          width: '100%',
          maxWidth: '1100px',
          height: '92vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.25rem',
          gap: '0.85rem',
          backgroundColor: '#09090e',
          border: '1px solid rgba(139, 92, 246, 0.35)',
          borderRadius: '12px',
          boxShadow: '0 0 35px rgba(139, 92, 246, 0.2)'
        }}
      >
        {/* Header Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(139, 92, 246, 0.25)', paddingBottom: '0.75rem' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.15rem', color: '#ffffff', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📝</span> Document Studio &amp; Human Touch-Up
            </h2>
            <div style={{ fontSize: '0.74rem', color: '#a1a1aa', marginTop: '0.15rem' }}>
              Polish homework, essays, lab reports, and export to PDF, Word, LaTeX, CSV, and Markdown.
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ display: 'flex', background: '#111118', borderRadius: '6px', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '2px' }}>
              <button
                type="button"
                onClick={() => setViewMode('split')}
                style={{
                  background: viewMode === 'split' ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
                  border: 'none',
                  color: viewMode === 'split' ? '#ffffff' : '#a1a1aa',
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.72rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Split View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('edit')}
                style={{
                  background: viewMode === 'edit' ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
                  border: 'none',
                  color: viewMode === 'edit' ? '#ffffff' : '#a1a1aa',
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.72rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Editor Only
              </button>
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                style={{
                  background: viewMode === 'preview' ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
                  border: 'none',
                  color: viewMode === 'preview' ? '#ffffff' : '#a1a1aa',
                  padding: '0.25rem 0.6rem',
                  fontSize: '0.72rem',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Preview Only
              </button>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: '#71717a', fontSize: '1.4rem', cursor: 'pointer', padding: '0 0.4rem', lineHeight: 1 }}
              title="Close"
            >
              ×
            </button>
          </div>
        </div>

        {/* Academic Metadata Fields */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.65rem',
          background: '#111118',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '8px',
          padding: '0.65rem 0.85rem'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.68rem', color: '#c4b5fd', fontFamily: 'var(--font-mono)', marginBottom: '0.15rem' }}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', background: '#07070a', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '4px', color: '#fff', padding: '0.35rem 0.5rem', fontSize: '0.78rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.68rem', color: '#c4b5fd', fontFamily: 'var(--font-mono)', marginBottom: '0.15rem' }}>Author / Student</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              style={{ width: '100%', background: '#07070a', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '4px', color: '#fff', padding: '0.35rem 0.5rem', fontSize: '0.78rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.68rem', color: '#c4b5fd', fontFamily: 'var(--font-mono)', marginBottom: '0.15rem' }}>Subject / Course</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{ width: '100%', background: '#07070a', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '4px', color: '#fff', padding: '0.35rem 0.5rem', fontSize: '0.78rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.68rem', color: '#c4b5fd', fontFamily: 'var(--font-mono)', marginBottom: '0.15rem' }}>Date</label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ width: '100%', background: '#07070a', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '4px', color: '#fff', padding: '0.35rem 0.5rem', fontSize: '0.78rem' }}
            />
          </div>
        </div>

        {/* Action / Export Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            <button onClick={handleExportPdf} className="btn-pill" style={{ fontSize: '0.74rem', padding: '0.35rem 0.75rem', backgroundColor: 'rgba(139, 92, 246, 0.2)', borderColor: '#8b5cf6', color: '#ffffff' }} title="Save or print as high-res vector PDF">
              <span>📄</span> PDF
            </button>
            <button onClick={handleExportWord} className="btn-pill" style={{ fontSize: '0.74rem', padding: '0.35rem 0.75rem' }} title="Export Microsoft Word & Google Docs compatible document">
              <span>📝</span> Word
            </button>
            <button onClick={handleExportLatex} className="btn-pill" style={{ fontSize: '0.74rem', padding: '0.35rem 0.75rem' }} title="Export LaTeX publication source">
              <span>📐</span> LaTeX
            </button>
            <button onClick={handleExportCsv} className="btn-pill" style={{ fontSize: '0.74rem', padding: '0.35rem 0.75rem' }} title="Extract and export table as CSV spreadsheet">
              <span>📊</span> CSV
            </button>
            <button onClick={handleExportMd} className="btn-pill" style={{ fontSize: '0.74rem', padding: '0.35rem 0.75rem' }} title="Export raw Markdown">
              <span>📜</span> Markdown
            </button>
            <button onClick={handleExportTxt} className="btn-pill" style={{ fontSize: '0.74rem', padding: '0.35rem 0.75rem' }} title="Export Plain Text">
              <span>📃</span> Text
            </button>
            <button onClick={handleExportJson} className="btn-pill" style={{ fontSize: '0.74rem', padding: '0.35rem 0.75rem' }} title="Export JSON package">
              <span>📦</span> JSON
            </button>
          </div>

          <div style={{ fontSize: '0.72rem', color: '#a1a1aa', fontFamily: 'var(--font-mono)' }}>
            {wordCount} words · {charCount} chars · ~{readTimeMin} min read
          </div>
        </div>

        {statusMsg && (
          <div style={{ fontSize: '0.74rem', color: '#34d399', backgroundColor: 'rgba(52, 211, 153, 0.1)', padding: '0.3rem 0.65rem', borderRadius: '6px', border: '1px solid rgba(52, 211, 153, 0.3)', fontFamily: 'var(--font-mono)' }}>
            ✓ {statusMsg}
          </div>
        )}

        {/* Content Workspace */}
        <div style={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: viewMode === 'split' ? '1fr 1fr' : '1fr',
          gap: '0.85rem'
        }}>
          {/* Markdown Source Touch-Up Area */}
          {(viewMode === 'split' || viewMode === 'edit') && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
              <div style={{ fontSize: '0.7rem', color: '#8b5cf6', fontFamily: 'var(--font-mono)', marginBottom: '0.25rem', fontWeight: 600 }}>
                EDIT SOURCE (MARKDOWN &amp; MATH)
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Type or touch up your assignment, essay, lab report, or notes here..."
                style={{
                  flex: 1,
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#07070a',
                  border: '1px solid rgba(139, 92, 246, 0.25)',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.82rem',
                  lineHeight: 1.5,
                  padding: '0.85rem',
                  resize: 'none',
                  outline: 'none'
                }}
              />
            </div>
          )}

          {/* Live Document Preview Area */}
          {(viewMode === 'split' || viewMode === 'preview') && (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
              <div style={{ fontSize: '0.7rem', color: '#34d399', fontFamily: 'var(--font-mono)', marginBottom: '0.25rem', fontWeight: 600 }}>
                DOCUMENT PREVIEW
              </div>
              <div style={{
                flex: 1,
                backgroundColor: '#0f0f16',
                border: '1px solid rgba(139, 92, 246, 0.25)',
                borderRadius: '8px',
                padding: '1.25rem',
                overflowY: 'auto'
              }}>
                <div style={{ borderBottom: '2px solid #8b5cf6', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
                  <h1 style={{ margin: 0, fontSize: '1.4rem', color: '#ffffff', fontWeight: 700 }}>{metadata.title}</h1>
                  <div style={{ display: 'flex', gap: '1.2rem', color: '#a1a1aa', fontSize: '0.74rem', marginTop: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                    <span><strong>Author:</strong> {metadata.author}</span>
                    {metadata.subject && <span><strong>Subject:</strong> {metadata.subject}</span>}
                    <span><strong>Date:</strong> {metadata.date}</span>
                  </div>
                </div>
                <MarkdownRenderer content={content} />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.4rem', borderTop: '1px solid rgba(139, 92, 246, 0.2)' }}>
          <button
            onClick={onClose}
            className="btn-pill btn-pill-primary"
            style={{ padding: '0.45rem 1.5rem', fontSize: '0.82rem' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
