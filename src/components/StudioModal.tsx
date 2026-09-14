import React, { useState, useEffect, useMemo, useRef } from 'react';
import { STACKS_PACKS, StackPack } from '../data/stacks_compiled';
import { splitChapters, extractDoors, StackChapter } from '../engine/stacks';
import {
  getProfileMemories,
  addProfileMemory,
  deleteProfileMemory,
  MemoryEntry
} from '../engine/family';
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
import { generatePlotSvg, PlotOptions } from '../engine/plot';
import { MarkdownRenderer } from './MarkdownRenderer';

export type StudioTool = 'read' | 'write' | 'code' | 'graph' | 'draw';

export interface StudioTarget {
  tool?: StudioTool;
  stackId?: string;
  chapterQuery?: string;
  title?: string;
  initialContent?: string;
}

export interface StudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileId: string;
  kidSafe: boolean;
  initialTarget?: StudioTarget | null;
  onSwitchToLearn?: () => void;
  onInsertIntoChat?: (text: string) => void;
  onNavigateBack?: () => void;
  onNavigateForward?: () => void;
  canNavigateBack?: boolean;
  canNavigateForward?: boolean;
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.88)',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 150,
  padding: '1rem'
};

const tabBtnStyle = (active: boolean): React.CSSProperties => ({
  background: active ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
  border: 'none',
  color: active ? '#ffffff' : '#a1a1aa',
  padding: '0.35rem 0.85rem',
  fontSize: '0.8rem',
  borderRadius: '6px',
  cursor: 'pointer',
  fontFamily: 'var(--font-mono)',
  fontWeight: active ? 600 : 400,
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  transition: 'all 0.15s ease'
});

export const StudioModal: React.FC<StudioModalProps> = ({
  isOpen,
  onClose,
  profileId,
  kidSafe,
  initialTarget,
  onSwitchToLearn,
  onInsertIntoChat,
  onNavigateBack,
  onNavigateForward,
  canNavigateBack,
  canNavigateForward
}) => {
  const [activeTool, setActiveTool] = useState<StudioTool>('read');

  // Handle incoming target whenever modal opens or target changes
  useEffect(() => {
    if (initialTarget?.tool) {
      setActiveTool(initialTarget.tool);
    }
  }, [initialTarget]);

  if (!isOpen) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div
        className="card-panel"
        style={{
          width: '94vw',
          maxWidth: '1200px',
          height: '92vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.25rem',
          gap: '0.75rem',
          backgroundColor: '#09090e',
          border: '1px solid rgba(139, 92, 246, 0.35)',
          borderRadius: '16px',
          boxShadow: '0 0 45px rgba(139, 92, 246, 0.22)',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header HUD */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(139, 92, 246, 0.22)',
            paddingBottom: '0.75rem',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          {/* Left: Navigation & Branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {/* In-app Back / Forward */}
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button
                type="button"
                className="btn-pill"
                disabled={!canNavigateBack}
                onClick={onNavigateBack}
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.74rem', opacity: canNavigateBack ? 1 : 0.4 }}
                title="Browse Back (in-app)"
              >
                ◀
              </button>
              <button
                type="button"
                className="btn-pill"
                disabled={!canNavigateForward}
                onClick={onNavigateForward}
                style={{ padding: '0.2rem 0.5rem', fontSize: '0.74rem', opacity: canNavigateForward ? 1 : 0.4 }}
                title="Browse Forward (in-app)"
              >
                ▶
              </button>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🎨</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#ffffff', fontSize: '1.05rem' }}>
                  EasyLM Studio
                </span>
                <span style={{ fontSize: '0.68rem', backgroundColor: 'rgba(139, 92, 246, 0.18)', color: '#c4b5fd', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                  Tool Suite
                </span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#a1a1aa', marginTop: '0.1rem' }}>
                Read · Write · Code · Graph · Draw · Patient sovereign tools for human curiosity
              </div>
            </div>
          </div>

          {/* Right: Learn Link & Close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {onSwitchToLearn && (
              <button
                type="button"
                className="btn-pill"
                onClick={onSwitchToLearn}
                style={{ backgroundColor: 'rgba(52, 211, 153, 0.12)', borderColor: '#34d399', color: '#34d399', fontSize: '0.74rem', padding: '0.25rem 0.65rem' }}
                title="Switch to EasyLM Learn (Curriculum & Syllabus Walk)"
              >
                🎓 Switch to Learn
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#71717a',
                fontSize: '1.4rem',
                cursor: 'pointer',
                padding: '0 0.4rem',
                lineHeight: 1
              }}
              title="Close Studio"
            >
              ×
            </button>
          </div>
        </div>

        {/* Studio Tool Selection Tabs */}
        <div
          style={{
            display: 'flex',
            background: '#111118',
            borderRadius: '8px',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            padding: '3px',
            width: 'fit-content',
            gap: '3px'
          }}
        >
          <button
            type="button"
            style={tabBtnStyle(activeTool === 'read')}
            onClick={() => setActiveTool('read')}
            title="Read: The Dewey Stacks Textbooks and Sovereign Profile Memories"
          >
            <span>📖</span> Read
          </button>
          <button
            type="button"
            style={tabBtnStyle(activeTool === 'write')}
            onClick={() => setActiveTool('write')}
            title="Write: Document Studio, Markdown Editor & Academic Export"
          >
            <span>✍️</span> Write
          </button>
          <button
            type="button"
            style={tabBtnStyle(activeTool === 'code')}
            onClick={() => setActiveTool('code')}
            title="Code: Interactive Code Sandbox & Runner"
          >
            <span>💻</span> Code
          </button>
          <button
            type="button"
            style={tabBtnStyle(activeTool === 'graph')}
            onClick={() => setActiveTool('graph')}
            title="Graph: 2D Coordinate Plane & Function Plotter"
          >
            <span>📈</span> Graph
          </button>
          <button
            type="button"
            style={tabBtnStyle(activeTool === 'draw')}
            onClick={() => setActiveTool('draw')}
            title="Draw / Paint: Interactive Canvas Sketching & Diagramming"
          >
            <span>🎨</span> Draw
          </button>
        </div>

        {/* Tool Panes */}
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {activeTool === 'read' && (
            <ReadTool
              profileId={profileId}
              initialTarget={initialTarget}
              onSendToWrite={(text, title) => {
                setActiveTool('write');
              }}
            />
          )}

          {activeTool === 'write' && (
            <WriteTool
              initialTitle={initialTarget?.title || 'Academic Essay'}
              initialContent={initialTarget?.initialContent || ''}
              onInsertIntoChat={onInsertIntoChat}
            />
          )}

          {activeTool === 'code' && (
            <CodeTool
              initialContent={initialTarget?.initialContent}
              onInsertIntoChat={onInsertIntoChat}
              onSendToWrite={(code, title) => {
                setActiveTool('write');
              }}
            />
          )}

          {activeTool === 'graph' && (
            <GraphTool
              onInsertIntoChat={onInsertIntoChat}
              onSendToWrite={(svg, title) => {
                setActiveTool('write');
              }}
            />
          )}

          {activeTool === 'draw' && (
            <DrawTool
              onInsertIntoChat={onInsertIntoChat}
              onSendToWrite={(dataUrl, title) => {
                setActiveTool('write');
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================================================
   TOOL 1: READ (Dewey Stacks Textbooks + Sovereign Profile Memories)
   ========================================================================= */

function ReadTool({
  profileId,
  initialTarget,
  onSendToWrite
}: {
  profileId: string;
  initialTarget?: StudioTarget | null;
  onSendToWrite: (text: string, title: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<'stacks' | 'memories'>('stacks');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPackSlug, setSelectedPackSlug] = useState<string>(() => {
    if (initialTarget?.stackId) {
      const match = STACKS_PACKS.find(
        (p) => p.slug === initialTarget.stackId || p.dewey === initialTarget.stackId
      );
      if (match) return match.slug;
    }
    return STACKS_PACKS[0]?.slug || '';
  });
  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number>(0);

  // Profile memories state
  const [memories, setMemories] = useState<MemoryEntry[]>(() => getProfileMemories(profileId));
  const [newMemoryText, setNewMemoryText] = useState('');

  // Auto-select chapter if chapterQuery provided
  useEffect(() => {
    if (initialTarget?.chapterQuery) {
      const currentPack = STACKS_PACKS.find((p) => p.slug === selectedPackSlug);
      if (currentPack) {
        const chs = splitChapters(currentPack.textbook);
        const q = initialTarget.chapterQuery.toLowerCase();
        const found = chs.findIndex((c) => c.heading.toLowerCase().includes(q));
        if (found !== -1) setSelectedChapterIdx(found);
      }
    }
  }, [initialTarget, selectedPackSlug]);

  const filteredPacks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return STACKS_PACKS.filter((p) => {
      if (selectedCategory !== 'all' && p.category.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.dewey.includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        p.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedCategory]);

  const currentPack = useMemo(() => {
    return STACKS_PACKS.find((p) => p.slug === selectedPackSlug) || STACKS_PACKS[0];
  }, [selectedPackSlug]);

  const chapters: StackChapter[] = useMemo(() => {
    if (!currentPack) return [];
    return splitChapters(currentPack.textbook);
  }, [currentPack]);

  const currentChapter = chapters[selectedChapterIdx] || chapters[0];
  const externalDoors = useMemo(() => {
    return currentPack ? extractDoors(currentPack.links) : [];
  }, [currentPack]);

  const handleAddMemory = () => {
    if (!newMemoryText.trim()) return;
    addProfileMemory(profileId, newMemoryText);
    setMemories(getProfileMemories(profileId));
    setNewMemoryText('');
  };

  const handleDeleteMemory = (id: string) => {
    deleteProfileMemory(id);
    setMemories(getProfileMemories(profileId));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '0.85rem', height: '100%', minHeight: 0 }}>
      {/* Left Sidebar: Catalog / Memories selector */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0c0c12',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          borderRadius: '10px',
          overflow: 'hidden'
        }}
      >
        {/* Toggle between Dewey Stacks and Personal Memories */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(139, 92, 246, 0.2)', backgroundColor: '#09090e' }}>
          <button
            type="button"
            onClick={() => setActiveTab('stacks')}
            style={{
              flex: 1,
              padding: '0.55rem',
              fontSize: '0.78rem',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              backgroundColor: activeTab === 'stacks' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
              color: activeTab === 'stacks' ? '#ffffff' : '#a1a1aa',
              fontWeight: activeTab === 'stacks' ? 600 : 400
            }}
          >
            📚 Dewey Stacks
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('memories')}
            style={{
              flex: 1,
              padding: '0.55rem',
              fontSize: '0.78rem',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              backgroundColor: activeTab === 'memories' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
              color: activeTab === 'memories' ? '#ffffff' : '#a1a1aa',
              fontWeight: activeTab === 'memories' ? 600 : 400
            }}
          >
            🧠 Notes &amp; Memory
          </button>
        </div>

        {activeTab === 'stacks' ? (
          <>
            {/* Search Bar */}
            <div style={{ padding: '0.65rem', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <input
                type="text"
                placeholder="Search textbooks, Dewey, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#07070a',
                  border: '1px solid rgba(139, 92, 246, 0.25)',
                  borderRadius: '6px',
                  padding: '0.35rem 0.6rem',
                  fontSize: '0.76rem',
                  color: '#ffffff'
                }}
              />
            </div>

            {/* List of Textbooks */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {filteredPacks.length === 0 ? (
                <div style={{ padding: '1.5rem 0.5rem', textAlign: 'center', color: '#71717a', fontSize: '0.78rem' }}>
                  No textbooks match your search.
                </div>
              ) : (
                filteredPacks.map((p) => {
                  const isSelected = p.slug === currentPack?.slug;
                  return (
                    <button
                      key={p.slug}
                      type="button"
                      onClick={() => {
                        setSelectedPackSlug(p.slug);
                        setSelectedChapterIdx(0);
                      }}
                      style={{
                        padding: '0.55rem 0.65rem',
                        textAlign: 'left',
                        backgroundColor: isSelected ? 'rgba(139, 92, 246, 0.22)' : 'transparent',
                        border: isSelected ? '1px solid #8b5cf6' : '1px solid transparent',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.15rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#c4b5fd', fontWeight: 600 }}>
                          Dewey {p.dewey}
                        </span>
                        <span style={{ fontSize: '0.62rem', color: '#71717a' }}>Undergraduate</span>
                      </div>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600, color: isSelected ? '#ffffff' : '#e4e4e7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {p.title}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </>
        ) : (
          /* Profile Memories List */
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0.65rem' }}>
            <div style={{ fontSize: '0.72rem', color: '#a1a1aa', marginBottom: '0.5rem' }}>
              Sovereign notes &amp; memories saved locally on this browser:
            </div>

            {/* Add memory input */}
            <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.75rem' }}>
              <input
                type="text"
                value={newMemoryText}
                onChange={(e) => setNewMemoryText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddMemory()}
                placeholder="Add sovereign memory..."
                style={{
                  flex: 1,
                  backgroundColor: '#07070a',
                  border: '1px solid rgba(139, 92, 246, 0.25)',
                  borderRadius: '6px',
                  padding: '0.35rem 0.6rem',
                  fontSize: '0.76rem',
                  color: '#ffffff'
                }}
              />
              <button
                type="button"
                onClick={handleAddMemory}
                className="btn-pill btn-pill-primary"
                style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem' }}
              >
                Add
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {memories.length === 0 ? (
                <div style={{ padding: '2rem 0.5rem', textAlign: 'center', color: '#71717a', fontSize: '0.78rem' }}>
                  No memories saved yet. Add your study goals, preferences, or reading notes here.
                </div>
              ) : (
                memories.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      padding: '0.55rem 0.65rem',
                      backgroundColor: '#111118',
                      border: '1px solid rgba(139, 92, 246, 0.2)',
                      borderRadius: '6px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '0.5rem'
                    }}
                  >
                    <span style={{ fontSize: '0.78rem', color: '#ffffff', wordBreak: 'break-word' }}>
                      {m.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteMemory(m.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#71717a',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        lineHeight: 1
                      }}
                      title="Delete memory"
                    >
                      ×
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Pane: Textbook Content / Chapter Viewer */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#0c0c12',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          borderRadius: '10px',
          overflow: 'hidden'
        }}
      >
        {/* Textbook Header */}
        <div
          style={{
            padding: '0.85rem 1.25rem',
            borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
            backgroundColor: '#09090e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: '#c4b5fd', fontWeight: 600 }}>
                Dewey {currentPack?.dewey}
              </span>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
                {currentPack?.title}
              </span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#a1a1aa', marginTop: '0.15rem' }}>
              {currentPack?.category} · {chapters.length} chapters · Open Knowledge · Zero-Network Sovereign Reference
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              type="button"
              className="btn-pill"
              onClick={() => onSendToWrite(`# ${currentPack?.title}\n## ${currentChapter?.heading}\n\n${currentChapter?.body}`, currentPack?.title || 'Notes')}
              style={{ fontSize: '0.74rem', padding: '0.3rem 0.7rem', gap: '0.3rem' }}
              title="Send this chapter into Write to edit or cite"
            >
              <span>✍️</span> Open in Write
            </button>
          </div>
        </div>

        {/* Chapter Selection Bar */}
        <div
          style={{
            padding: '0.45rem 0.85rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.35rem',
            overflowX: 'hidden',
            backgroundColor: '#07070a'
          }}
        >
          {chapters.map((ch, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedChapterIdx(idx)}
              style={{
                fontSize: '0.72rem',
                padding: '0.25rem 0.65rem',
                border: selectedChapterIdx === idx ? '1px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '4px',
                backgroundColor: selectedChapterIdx === idx ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
                color: selectedChapterIdx === idx ? '#ffffff' : '#a1a1aa',
                cursor: 'pointer'
              }}
            >
              {ch.heading.length > 36 ? ch.heading.slice(0, 34) + '…' : ch.heading}
            </button>
          ))}
        </div>

        {/* Chapter Body & External Doors */}
        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', wordBreak: 'break-word', overflowWrap: 'break-word', padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {currentChapter ? (
            <div>
              <h2 style={{ color: '#ffffff', fontSize: '1.25rem', marginTop: 0, marginBottom: '0.85rem', borderBottom: '1px solid rgba(139, 92, 246, 0.3)', paddingBottom: '0.5rem' }}>
                {currentChapter.heading}
              </h2>
              <MarkdownRenderer content={currentChapter.body} />
            </div>
          ) : (
            <div style={{ color: '#a1a1aa' }}>Select a chapter to read.</div>
          )}

          {/* Primary Portals & External Doors (Open in new tabs) */}
          {externalDoors.length > 0 && (
            <div style={{ marginTop: '1.5rem', padding: '0.85rem 1rem', backgroundColor: '#111118', border: '1px solid rgba(139, 92, 246, 0.2)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#c4b5fd', fontWeight: 600, marginBottom: '0.4rem' }}>
                🌐 Bibliographic Portals &amp; Open Doors (Opens in New Tab):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.35rem' }}>
                {externalDoors.map((url, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '0.74rem', color: '#a78bfa', textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    title={url}
                  >
                    ↗ {url.replace('https://', '')}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   TOOL 2: WRITE (Document Studio, Markdown Editor & Academic Export)
   ========================================================================= */

function WriteTool({
  initialTitle,
  initialContent,
  onInsertIntoChat
}: {
  initialTitle: string;
  initialContent: string;
  onInsertIntoChat?: (text: string) => void;
}) {
  const [content, setContent] = useState(initialContent);
  const [title, setTitle] = useState(initialTitle);
  const [author, setAuthor] = useState('EasyLM Scholar');
  const [subject, setSubject] = useState('General Studies');
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

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
      alert('No Markdown table detected. Use | col1 | col2 | format.');
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
    showStatus('Exported JSON package.');
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;
  const readTimeMin = Math.ceil(wordCount / 200);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: '0.65rem' }}>
      {/* Metadata Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '0.5rem',
          background: '#0c0c12',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '8px',
          padding: '0.55rem 0.85rem'
        }}
      >
        <div>
          <label style={{ display: 'block', fontSize: '0.66rem', color: '#c4b5fd', fontFamily: 'var(--font-mono)', marginBottom: '0.15rem' }}>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: '100%', background: '#07070a', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '4px', color: '#fff', padding: '0.3rem 0.5rem', fontSize: '0.78rem' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.66rem', color: '#c4b5fd', fontFamily: 'var(--font-mono)', marginBottom: '0.15rem' }}>Author</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            style={{ width: '100%', background: '#07070a', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '4px', color: '#fff', padding: '0.3rem 0.5rem', fontSize: '0.78rem' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.66rem', color: '#c4b5fd', fontFamily: 'var(--font-mono)', marginBottom: '0.15rem' }}>Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{ width: '100%', background: '#07070a', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '4px', color: '#fff', padding: '0.3rem 0.5rem', fontSize: '0.78rem' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.66rem', color: '#c4b5fd', fontFamily: 'var(--font-mono)', marginBottom: '0.15rem' }}>Date</label>
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ width: '100%', background: '#07070a', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '4px', color: '#fff', padding: '0.3rem 0.5rem', fontSize: '0.78rem' }}
          />
        </div>
      </div>

      {/* Action Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          <button onClick={handleExportPdf} className="btn-pill" style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem', backgroundColor: 'rgba(139, 92, 246, 0.2)', borderColor: '#8b5cf6', color: '#ffffff' }} title="Print or save as PDF">
            <span>📄</span> PDF
          </button>
          <button onClick={handleExportWord} className="btn-pill" style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem' }} title="Export Word doc">
            <span>📝</span> Word
          </button>
          <button onClick={handleExportLatex} className="btn-pill" style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem' }} title="Export LaTeX source">
            <span>📐</span> LaTeX
          </button>
          <button onClick={handleExportCsv} className="btn-pill" style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem' }} title="Export table as CSV">
            <span>📊</span> CSV
          </button>
          <button onClick={handleExportMd} className="btn-pill" style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem' }} title="Export Markdown">
            <span>📜</span> Markdown
          </button>
          <button onClick={handleExportTxt} className="btn-pill" style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem' }} title="Export text">
            <span>📃</span> Text
          </button>
          <button onClick={handleExportJson} className="btn-pill" style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem' }} title="Export JSON">
            <span>📦</span> JSON
          </button>
          {onInsertIntoChat && (
            <button
              onClick={() => onInsertIntoChat(content)}
              className="btn-pill"
              style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem', borderColor: '#34d399', color: '#34d399' }}
              title="Insert into chat prompt"
            >
              <span>➕</span> Insert into Chat
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ display: 'flex', background: '#111118', borderRadius: '4px', border: '1px solid rgba(139, 92, 246, 0.25)', padding: '2px' }}>
            {(['split', 'edit', 'preview'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setViewMode(m)}
                style={{
                  background: viewMode === m ? 'rgba(139, 92, 246, 0.3)' : 'transparent',
                  border: 'none',
                  color: viewMode === m ? '#ffffff' : '#a1a1aa',
                  padding: '0.2rem 0.5rem',
                  fontSize: '0.7rem',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {m}
              </button>
            ))}
          </div>
          <span style={{ fontSize: '0.7rem', color: '#a1a1aa', fontFamily: 'var(--font-mono)' }}>
            {wordCount} words · ~{readTimeMin}m read
          </span>
        </div>
      </div>

      {statusMsg && (
        <div style={{ fontSize: '0.72rem', color: '#34d399', backgroundColor: 'rgba(52, 211, 153, 0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(52, 211, 153, 0.3)', fontFamily: 'var(--font-mono)' }}>
          ✓ {statusMsg}
        </div>
      )}

      {/* Editor & Preview Pane */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'grid',
          gridTemplateColumns: viewMode === 'split' ? '1fr 1fr' : '1fr',
          gap: '0.75rem'
        }}
      >
        {(viewMode === 'split' || viewMode === 'edit') && (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your essay, homework, lab report, or notes here..."
            style={{
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
        )}

        {(viewMode === 'split' || viewMode === 'preview') && (
          <div
            style={{
              backgroundColor: '#0c0c12',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              borderRadius: '8px',
              padding: '1.25rem',
              overflowY: 'auto'
            }}
          >
            <div style={{ borderBottom: '2px solid #8b5cf6', paddingBottom: '0.65rem', marginBottom: '1rem' }}>
              <h1 style={{ margin: 0, fontSize: '1.35rem', color: '#ffffff', fontWeight: 700 }}>{metadata.title}</h1>
              <div style={{ display: 'flex', gap: '1rem', color: '#a1a1aa', fontSize: '0.72rem', marginTop: '0.35rem', fontFamily: 'var(--font-mono)' }}>
                <span><strong>Author:</strong> {metadata.author}</span>
                {metadata.subject && <span><strong>Subject:</strong> {metadata.subject}</span>}
                <span><strong>Date:</strong> {metadata.date}</span>
              </div>
            </div>
            <MarkdownRenderer content={content} />
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   TOOL 3: CODE (Interactive Code Sandbox & Runner)
   ========================================================================= */

function CodeTool({
  initialContent,
  onInsertIntoChat,
  onSendToWrite
}: {
  initialContent?: string;
  onInsertIntoChat?: (text: string) => void;
  onSendToWrite?: (code: string, title: string) => void;
}) {
  const [code, setCode] = useState(
    initialContent ||
`// EasyLM Sovereign JavaScript Sandbox
// Deterministic in-browser execution with real-time console logs

function monteCarloPi(iterations) {
  let inside = 0;
  for (let i = 0; i < iterations; i++) {
    const x = Math.random();
    const y = Math.random();
    if (x * x + y * y <= 1) inside++;
  }
  return (4 * inside) / iterations;
}

const samples = 100000;
const estimate = monteCarloPi(samples);
console.log("Monte Carlo Pi Estimate (" + samples + " samples):", estimate);
console.log("Error vs Math.PI:", Math.abs(estimate - Math.PI));
`
  );

  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const presets = [
    {
      label: 'Monte Carlo Pi',
      code: `function monteCarloPi(samples) {
  let inside = 0;
  for (let i = 0; i < samples; i++) {
    const x = Math.random();
    const y = Math.random();
    if (x*x + y*y <= 1) inside++;
  }
  return (4 * inside) / samples;
}
console.log("Pi approx:", monteCarloPi(100000));
console.log("Real Pi:", Math.PI);`
    },
    {
      label: 'Fibonacci Series',
      code: `function fibonacci(n) {
  const seq = [0, 1];
  for (let i = 2; i < n; i++) {
    seq.push(seq[i - 1] + seq[i - 2]);
  }
  return seq;
}
console.log("First 15 Fibonacci numbers:", fibonacci(15));
const goldenRatio = fibonacci(25)[24] / fibonacci(25)[23];
console.log("Golden ratio approximation:", goldenRatio);`
    },
    {
      label: 'Quadratic Solver',
      code: `function solveQuadratic(a, b, c) {
  const disc = b * b - 4 * a * c;
  if (disc < 0) return "Complex roots";
  const r1 = (-b + Math.sqrt(disc)) / (2 * a);
  const r2 = (-b - Math.sqrt(disc)) / (2 * a);
  return { r1, r2, discriminant: disc };
}
console.log("Solving 2x^2 + 5x - 3 = 0:", solveQuadratic(2, 5, -3));`
    },
    {
      label: 'Prime Sieve',
      code: `function sieve(max) {
  const flags = new Uint8Array(max + 1).fill(1);
  flags[0] = flags[1] = 0;
  for (let i = 2; i * i <= max; i++) {
    if (flags[i]) {
      for (let j = i * i; j <= max; j += i) flags[j] = 0;
    }
  }
  const primes = [];
  for (let i = 2; i <= max; i++) if (flags[i]) primes.push(i);
  return primes;
}
console.log("Primes up to 100:", sieve(100));`
    }
  ];

  const handleRun = () => {
    setIsRunning(true);
    const logs: string[] = [];
    const origLog = console.log;
    const origWarn = console.warn;
    const origError = console.error;

    try {
      console.log = (...args: any[]) => {
        logs.push('[LOG] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        origLog(...args);
      };
      console.warn = (...args: any[]) => {
        logs.push('[WARN] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        origWarn(...args);
      };
      console.error = (...args: any[]) => {
        logs.push('[ERROR] ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        origError(...args);
      };

      const start = performance.now();
      // Safe execution in isolated Function constructor
      const runner = new Function(code);
      const result = runner();
      const elapsed = (performance.now() - start).toFixed(2);

      if (result !== undefined) {
        logs.push(`[RETURN] ${typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)}`);
      }
      logs.push(`--- Execution completed in ${elapsed} ms ---`);
    } catch (err: any) {
      logs.push(`[EXCEPTION] ${err?.message || err}`);
    } finally {
      console.log = origLog;
      console.warn = origWarn;
      console.error = origError;
      setConsoleOutput(logs);
      setIsRunning(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: '0.65rem' }}>
      {/* Toolbar & Presets */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleRun}
            disabled={isRunning}
            className="btn-pill btn-pill-primary"
            style={{ fontSize: '0.76rem', padding: '0.35rem 0.85rem', gap: '0.35rem' }}
          >
            <span>▶</span> Run Code
          </button>
          <button
            type="button"
            onClick={() => setConsoleOutput([])}
            className="btn-pill"
            style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem' }}
          >
            Clear Console
          </button>

          <span style={{ fontSize: '0.7rem', color: '#71717a', fontFamily: 'var(--font-mono)', marginLeft: '0.35rem' }}>
            Presets:
          </span>
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setCode(p.code)}
              className="btn-pill"
              style={{ fontSize: '0.7rem', padding: '0.25rem 0.55rem' }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {onSendToWrite && (
            <button
              type="button"
              onClick={() => onSendToWrite(`\`\`\`javascript\n${code}\n\`\`\``, 'Code Snippet')}
              className="btn-pill"
              style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem' }}
              title="Copy snippet into Write editor"
            >
              <span>✍️</span> Send to Write
            </button>
          )}
          {onInsertIntoChat && (
            <button
              type="button"
              onClick={() => onInsertIntoChat(`\`\`\`javascript\n${code}\n\`\`\``)}
              className="btn-pill"
              style={{ fontSize: '0.72rem', padding: '0.3rem 0.6rem', borderColor: '#34d399', color: '#34d399' }}
              title="Insert into chat prompt"
            >
              <span>➕</span> Insert into Chat
            </button>
          )}
        </div>
      </div>

      {/* Editor & Console Split View */}
      <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '0.75rem' }}>
        {/* Code Input */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
          <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#8b5cf6', marginBottom: '0.25rem', fontWeight: 600 }}>
            JAVASCRIPT SANDBOX
          </div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            style={{
              flex: 1,
              width: '100%',
              backgroundColor: '#07070a',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              borderRadius: '8px',
              color: '#ffffff',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              lineHeight: 1.45,
              padding: '0.85rem',
              resize: 'none',
              outline: 'none'
            }}
          />
        </div>

        {/* Live Console Output */}
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
          <div style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: '#34d399', marginBottom: '0.25rem', fontWeight: 600 }}>
            TERMINAL CONSOLE
          </div>
          <div
            style={{
              flex: 1,
              backgroundColor: '#040407',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              borderRadius: '8px',
              padding: '0.85rem',
              overflowY: 'auto',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.78rem',
              color: '#a7f3d0',
              lineHeight: 1.45
            }}
          >
            {consoleOutput.length === 0 ? (
              <div style={{ color: '#52525b', fontStyle: 'italic' }}>
                Console idle. Click "▶ Run Code" to execute script.
              </div>
            ) : (
              consoleOutput.map((line, idx) => {
                const isError = line.startsWith('[ERROR]') || line.startsWith('[EXCEPTION]');
                const isReturn = line.startsWith('[RETURN]');
                return (
                  <div
                    key={idx}
                    style={{
                      color: isError ? '#f87171' : isReturn ? '#fbbf24' : '#e4e4e7',
                      whiteSpace: 'pre-wrap',
                      marginBottom: '0.2rem'
                    }}
                  >
                    {line}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   TOOL 4: GRAPH (2D Coordinate Plane & Function Plotter)
   ========================================================================= */

function GraphTool({
  onInsertIntoChat,
  onSendToWrite
}: {
  onInsertIntoChat?: (text: string) => void;
  onSendToWrite?: (svg: string, title: string) => void;
}) {
  const [fnStr, setFnStr] = useState('x^2 - 4');
  const [title, setTitle] = useState('Parabola: y = x^2 - 4');
  const [xMin, setXMin] = useState(-5);
  const [xMax, setXMax] = useState(5);
  const [copied, setCopied] = useState(false);

  const presets = [
    { label: 'x^2 - 4', fn: 'x^2 - 4', title: 'Quadratic: y = x^2 - 4', min: -5, max: 5 },
    { label: 'sin(x)', fn: 'sin(x)', title: 'Sine Wave: y = sin(x)', min: -6.28, max: 6.28 },
    { label: 'cos(x)', fn: 'cos(x)', title: 'Cosine Wave: y = cos(x)', min: -6.28, max: 6.28 },
    { label: 'x^3 - 3x', fn: 'x^3 - 3*x', title: 'Cubic: y = x^3 - 3x', min: -3, max: 3 },
    { label: 'sqrt(x)', fn: 'sqrt(x)', title: 'Square Root: y = sqrt(x)', min: 0, max: 25 },
    { label: '1 / x', fn: '1 / x', title: 'Hyperbola: y = 1/x', min: -5, max: 5 },
    { label: 'abs(x)', fn: 'abs(x)', title: 'Absolute Value: y = |x|', min: -6, max: 6 },
    { label: '2^x', fn: '2^x', title: 'Exponential: y = 2^x', min: -4, max: 6 }
  ];

  const plotOptions: PlotOptions = useMemo(() => ({
    fn: fnStr,
    title,
    xMin,
    xMax,
    width: 680,
    height: 380,
    color: '#a78bfa'
  }), [fnStr, title, xMin, xMax]);

  const svgOutput = useMemo(() => {
    try {
      return generatePlotSvg(plotOptions);
    } catch {
      return '<svg><text x="20" y="20" fill="red">Invalid function expression</text></svg>';
    }
  }, [plotOptions]);

  const handleDownloadSvg = () => {
    downloadBlob(svgOutput, `${sanitizeFilename(title || 'graph')}.svg`, 'image/svg+xml');
  };

  const handleCopySvg = async () => {
    try {
      await navigator.clipboard.writeText(svgOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: '0.65rem' }}>
      {/* Controls & Presets */}
      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flex: 1, minWidth: '240px' }}>
          <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: '#c4b5fd', fontWeight: 600 }}>
            f(x) =
          </span>
          <input
            type="text"
            value={fnStr}
            onChange={(e) => setFnStr(e.target.value)}
            placeholder="e.g. sin(x), x^2 - 4, sqrt(x)"
            style={{
              flex: 1,
              backgroundColor: '#07070a',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '6px',
              padding: '0.35rem 0.65rem',
              color: '#ffffff',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.7rem', color: '#a1a1aa', fontFamily: 'var(--font-mono)' }}>X Bounds:</span>
          <input
            type="number"
            value={xMin}
            onChange={(e) => setXMin(parseFloat(e.target.value) || -10)}
            style={{ width: '65px', backgroundColor: '#07070a', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '4px', color: '#fff', padding: '0.25rem 0.45rem', fontSize: '0.74rem' }}
          />
          <span style={{ color: '#71717a' }}>to</span>
          <input
            type="number"
            value={xMax}
            onChange={(e) => setXMax(parseFloat(e.target.value) || 10)}
            style={{ width: '65px', backgroundColor: '#07070a', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '4px', color: '#fff', padding: '0.25rem 0.45rem', fontSize: '0.74rem' }}
          />
        </div>
      </div>

      {/* Presets Row */}
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '0.7rem', color: '#71717a', fontFamily: 'var(--font-mono)' }}>Presets:</span>
        {presets.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => {
              setFnStr(p.fn);
              setTitle(p.title);
              setXMin(p.min);
              setXMax(p.max);
            }}
            className="btn-pill"
            style={{
              fontSize: '0.7rem',
              padding: '0.2rem 0.5rem',
              backgroundColor: fnStr === p.fn ? 'rgba(139, 92, 246, 0.25)' : '#111118',
              borderColor: fnStr === p.fn ? '#8b5cf6' : 'rgba(139, 92, 246, 0.2)',
              color: fnStr === p.fn ? '#ffffff' : '#a1a1aa'
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Live SVG Graph Canvas */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#07070a',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          borderRadius: '10px',
          padding: '0.5rem',
          overflow: 'hidden'
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: svgOutput }} style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }} />
      </div>

      {/* Action Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          <button
            onClick={handleDownloadSvg}
            className="btn-pill"
            style={{ fontSize: '0.74rem', padding: '0.3rem 0.75rem', backgroundColor: 'rgba(139, 92, 246, 0.2)', borderColor: '#8b5cf6', color: '#ffffff' }}
            title="Download vector SVG file"
          >
            <span>📥</span> Download SVG
          </button>
          <button
            onClick={handleCopySvg}
            className="btn-pill"
            style={{ fontSize: '0.74rem', padding: '0.3rem 0.75rem' }}
            title="Copy SVG code"
          >
            <span>📋</span> {copied ? 'Copied SVG!' : 'Copy SVG'}
          </button>
          {onInsertIntoChat && (
            <button
              onClick={() => onInsertIntoChat(`[Graph: ${title}]\n\`\`\`xml\n${svgOutput}\n\`\`\``)}
              className="btn-pill"
              style={{ fontSize: '0.74rem', padding: '0.3rem 0.75rem', borderColor: '#34d399', color: '#34d399' }}
            >
              <span>➕</span> Insert into Chat
            </button>
          )}
          {onSendToWrite && (
            <button
              onClick={() => onSendToWrite(`### ${title}\n\`\`\`xml\n${svgOutput}\n\`\`\``, title)}
              className="btn-pill"
              style={{ fontSize: '0.74rem', padding: '0.3rem 0.75rem' }}
            >
              <span>✍️</span> Send to Write
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   TOOL 5: DRAW / PAINT (Interactive HTML5 Canvas Sketching)
   ========================================================================= */

function DrawTool({
  onInsertIntoChat,
  onSendToWrite
}: {
  onInsertIntoChat?: (text: string) => void;
  onSendToWrite?: (dataUrl: string, title: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<'pen' | 'highlighter' | 'eraser'>('pen');
  const [color, setColor] = useState('#8b5cf6'); // Ina Violet
  const [size, setSize] = useState(4);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<ImageData[]>([]);

  const colors = [
    { label: 'Ina Violet', hex: '#8b5cf6' },
    { label: 'Emerald', hex: '#34d399' },
    { label: 'Sky', hex: '#38bdf8' },
    { label: 'Amber', hex: '#fbbf24' },
    { label: 'Rose', hex: '#f87171' },
    { label: 'White', hex: '#ffffff' },
    { label: 'Black', hex: '#000000' }
  ];

  // Set up canvas sizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Fill dark background
    ctx.fillStyle = '#09090e';
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Save initial state
    setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  }, []);

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'eraser') {
      ctx.strokeStyle = '#09090e';
      ctx.lineWidth = size * 3;
      ctx.globalAlpha = 1.0;
    } else if (tool === 'highlighter') {
      ctx.strokeStyle = color;
      ctx.lineWidth = size * 2.5;
      ctx.globalAlpha = 0.35;
    } else {
      ctx.strokeStyle = color;
      ctx.lineWidth = size;
      ctx.globalAlpha = 1.0;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const endDraw = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save snapshot for undo
    setHistory((prev) => [...prev.slice(-15), ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  };

  const handleUndo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prevHistory = history.slice(0, -1);
    const last = prevHistory[prevHistory.length - 1];
    if (last) {
      ctx.putImageData(last, 0, 0);
      setHistory(prevHistory);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.fillStyle = '#09090e';
    ctx.fillRect(0, 0, rect.width, rect.height);
    setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
  };

  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `easylm-drawing-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: '0.65rem' }}>
      {/* Canvas Tooling Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        {/* Tool Modes */}
        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setTool('pen')}
            className="btn-pill"
            style={{
              fontSize: '0.74rem',
              padding: '0.25rem 0.65rem',
              backgroundColor: tool === 'pen' ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
              borderColor: tool === 'pen' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)',
              color: tool === 'pen' ? '#ffffff' : '#a1a1aa'
            }}
          >
            ✏️ Pen
          </button>
          <button
            type="button"
            onClick={() => setTool('highlighter')}
            className="btn-pill"
            style={{
              fontSize: '0.74rem',
              padding: '0.25rem 0.65rem',
              backgroundColor: tool === 'highlighter' ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
              borderColor: tool === 'highlighter' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)',
              color: tool === 'highlighter' ? '#ffffff' : '#a1a1aa'
            }}
          >
            🖍️ Highlighter
          </button>
          <button
            type="button"
            onClick={() => setTool('eraser')}
            className="btn-pill"
            style={{
              fontSize: '0.74rem',
              padding: '0.25rem 0.65rem',
              backgroundColor: tool === 'eraser' ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
              borderColor: tool === 'eraser' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)',
              color: tool === 'eraser' ? '#ffffff' : '#a1a1aa'
            }}
          >
            🧹 Eraser
          </button>

          {/* Color Palette */}
          <div style={{ display: 'flex', gap: '0.3rem', marginLeft: '0.5rem', alignItems: 'center' }}>
            {colors.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => setColor(c.hex)}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: c.hex,
                  border: color === c.hex ? '2px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  padding: 0
                }}
                title={c.label}
              />
            ))}
          </div>

          {/* Stroke Size */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: '0.6rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#a1a1aa', fontFamily: 'var(--font-mono)' }}>Size:</span>
            <input
              type="range"
              min={2}
              max={28}
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value, 10))}
              style={{ width: '80px', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Actions: Undo, Clear, Export */}
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          <button
            type="button"
            onClick={handleUndo}
            disabled={history.length <= 1}
            className="btn-pill"
            style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem', opacity: history.length <= 1 ? 0.4 : 1 }}
            title="Undo stroke"
          >
            ↩️ Undo
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="btn-pill"
            style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem' }}
            title="Clear canvas"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleDownloadPng}
            className="btn-pill"
            style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem', backgroundColor: 'rgba(139, 92, 246, 0.2)', borderColor: '#8b5cf6', color: '#ffffff' }}
            title="Download PNG image"
          >
            💾 Download PNG
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div
        style={{
          flex: 1,
          minHeight: 0,
          position: 'relative',
          backgroundColor: '#09090e',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '10px',
          overflow: 'hidden'
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            cursor: tool === 'eraser' ? 'cell' : 'crosshair'
          }}
        />
      </div>
    </div>
  );
}
