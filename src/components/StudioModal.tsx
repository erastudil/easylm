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
import {
  generatePlotSvg,
  PlotOptions,
  FunctionSpec,
  evalDerivative,
  findRoots,
  findExtrema,
  integrateSimpson,
  computeTableOfValues,
  evalFx
} from '../engine/plot';
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
          width: '98vw',
          maxWidth: '1680px',
          height: '96vh',
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

  const activeWorkerRef = useRef<Worker | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blobUrlRef = useRef<string | null>(null);

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
console.log("Pi approx (100k):", monteCarloPi(100000));
console.log("Real Math.PI:", Math.PI);`
    },
    {
      label: 'Fibonacci & Phi',
      code: `function fibonacci(n) {
  const seq = [0, 1];
  for (let i = 2; i < n; i++) {
    seq.push(seq[i - 1] + seq[i - 2]);
  }
  return seq;
}
const fib = fibonacci(20);
console.log("First 20 Fibonacci numbers:", fib);
const phi = fib[19] / fib[18];
console.log("Golden Ratio (phi) approx:", phi);
console.log("True Phi:", (1 + Math.sqrt(5)) / 2);`
    },
    {
      label: 'Quadratic Solver',
      code: `function solveQuadratic(a, b, c) {
  const disc = b * b - 4 * a * c;
  if (disc < 0) return { roots: "Complex", discriminant: disc };
  const r1 = (-b + Math.sqrt(disc)) / (2 * a);
  const r2 = (-b - Math.sqrt(disc)) / (2 * a);
  return { r1, r2, discriminant: disc };
}
console.log("Roots of 2x^2 + 5x - 3 = 0:", solveQuadratic(2, 5, -3));`
    },
    {
      label: 'Levenshtein Distance',
      code: `function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}
const s1 = "algorithm", s2 = "altruism";
console.log(\`Distance between "\${s1}" and "\${s2}":\`, levenshtein(s1, s2));`
    },
    {
      label: '2D Rotation',
      code: `function rotate2D(points, angleDeg) {
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return points.map(([x, y]) => [
    Math.round((x * cos - y * sin) * 1000) / 1000,
    Math.round((x * sin + y * cos) * 1000) / 1000
  ]);
}
const square = [[0,0], [1,0], [1,1], [0,1]];
console.log("Original square vertices:", square);
console.log("Rotated 45 degrees:", rotate2D(square, 45));`
    },
    {
      label: 'Mandelbrot ASCII',
      code: `function renderMandelbrot(width, height) {
  const chars = " .:-=+*#%@";
  let output = "";
  for (let y = 0; y < height; y++) {
    let line = "";
    for (let x = 0; x < width; x++) {
      const c_re = (x - width / 1.4) * 4.0 / width;
      const c_im = (y - height / 2) * 4.0 / width;
      let z_re = 0, z_im = 0, n = 0;
      while (z_re * z_re + z_im * z_im <= 4 && n < chars.length - 1) {
        const new_re = z_re * z_re - z_im * z_im + c_re;
        z_im = 2 * z_re * z_im + c_im;
        z_re = new_re;
        n++;
      }
      line += chars[n];
    }
    output += line + "\\n";
  }
  return output;
}
console.log(renderMandelbrot(48, 22));`
    },
    {
      label: 'Async Pipeline',
      code: `async function fetchAndProcess() {
  console.log("Initializing asynchronous task pipeline...");
  const task = (id, ms) => new Promise(res => {
    setTimeout(() => {
      console.log(\`Task \${id} completed after \${ms}ms\`);
      res({ id, value: id * 10 });
    }, ms);
  });

  const results = await Promise.all([task(1, 120), task(2, 60), task(3, 180)]);
  console.log("All concurrent tasks resolved:", results);
  return results.reduce((acc, curr) => acc + curr.value, 0);
}
return await fetchAndProcess();`
    }
  ];

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (activeWorkerRef.current) {
        activeWorkerRef.current.terminate();
        activeWorkerRef.current = null;
      }
      if (blobUrlRef.current) {
        try {
          URL.revokeObjectURL(blobUrlRef.current);
        } catch {}
        blobUrlRef.current = null;
      }
    };
  }, []);

  const handleStop = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (activeWorkerRef.current) {
      activeWorkerRef.current.terminate();
      activeWorkerRef.current = null;
    }
    if (blobUrlRef.current) {
      try {
        URL.revokeObjectURL(blobUrlRef.current);
      } catch {}
      blobUrlRef.current = null;
    }
    setIsRunning(false);
    setConsoleOutput((prev) => [...prev, '[STOPPED] Execution halted by user']);
  };

  const safeFormat = (arg: any): string => {
    if (arg === null) return 'null';
    if (arg === undefined) return 'undefined';
    if (typeof arg === 'symbol') return arg.toString();
    if (typeof arg === 'bigint') return arg.toString() + 'n';
    if (typeof arg === 'function') return arg.toString();
    if (typeof arg === 'object') {
      try {
        return JSON.stringify(arg, null, 2);
      } catch {
        try {
          return String(arg);
        } catch {
          return '[Unserializable Object]';
        }
      }
    }
    return String(arg);
  };

  const handleInThreadFallback = async (codeToRun: string) => {
    setIsRunning(true);
    const logs: string[] = [];
    const origLog = console.log;
    const origWarn = console.warn;
    const origError = console.error;
    const origInfo = console.info;

    try {
      console.log = (...args: any[]) => {
        logs.push('[LOG] ' + args.map(safeFormat).join(' '));
        origLog(...args);
      };
      console.info = (...args: any[]) => {
        logs.push('[INFO] ' + args.map(safeFormat).join(' '));
        origInfo(...args);
      };
      console.warn = (...args: any[]) => {
        logs.push('[WARN] ' + args.map(safeFormat).join(' '));
        origWarn(...args);
      };
      console.error = (...args: any[]) => {
        logs.push('[ERROR] ' + args.map(safeFormat).join(' '));
        origError(...args);
      };

      const start = performance.now();
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
      const runner = new AsyncFunction(codeToRun);

      const timeoutPromise = new Promise((_, reject) => {
        timeoutRef.current = setTimeout(() => {
          reject(new Error('Execution timed out after 10 seconds'));
        }, 10000);
      });

      const result = await Promise.race([runner(), timeoutPromise]);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      const elapsed = (performance.now() - start).toFixed(2);
      if (result !== undefined) {
        logs.push(`[RETURN] ${safeFormat(result)}`);
      }
      logs.push(`--- Execution completed in ${elapsed} ms ---`);
    } catch (err: any) {
      logs.push(`[EXCEPTION] ${err?.message || String(err)}`);
    } finally {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      console.log = origLog;
      console.info = origInfo;
      console.warn = origWarn;
      console.error = origError;
      setConsoleOutput((prev) => [...prev, ...logs]);
      setIsRunning(false);
    }
  };

  const handleRun = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (activeWorkerRef.current) {
      activeWorkerRef.current.terminate();
      activeWorkerRef.current = null;
    }
    if (blobUrlRef.current) {
      try {
        URL.revokeObjectURL(blobUrlRef.current);
      } catch {}
      blobUrlRef.current = null;
    }

    setIsRunning(true);
    setConsoleOutput([]);

    let workerStarted = false;
    let hasReceivedMessage = false;

    try {
      if (typeof Worker !== 'undefined' && typeof Blob !== 'undefined' && typeof URL !== 'undefined' && URL.createObjectURL) {
        const runnerScript = `
self.onmessage = null;

function safeFormat(arg) {
  if (arg === null) return 'null';
  if (arg === undefined) return 'undefined';
  if (typeof arg === 'symbol') return arg.toString();
  if (typeof arg === 'bigint') return arg.toString() + 'n';
  if (typeof arg === 'function') return arg.toString();
  if (typeof arg === 'object') {
    try {
      return JSON.stringify(arg, null, 2);
    } catch {
      try {
        return String(arg);
      } catch {
        return '[Unserializable Object]';
      }
    }
  }
  return String(arg);
}

const origLog = console.log;
const origWarn = console.warn;
const origError = console.error;
const origInfo = console.info;

console.log = function(...args) {
  self.postMessage({ type: 'log', level: 'LOG', text: args.map(safeFormat).join(' ') });
  if (origLog) origLog.apply(console, args);
};
console.warn = function(...args) {
  self.postMessage({ type: 'log', level: 'WARN', text: args.map(safeFormat).join(' ') });
  if (origWarn) origWarn.apply(console, args);
};
console.error = function(...args) {
  self.postMessage({ type: 'log', level: 'ERROR', text: args.map(safeFormat).join(' ') });
  if (origError) origError.apply(console, args);
};
console.info = function(...args) {
  self.postMessage({ type: 'log', level: 'INFO', text: args.map(safeFormat).join(' ') });
  if (origInfo) origInfo.apply(console, args);
};
console.clear = function() {
  self.postMessage({ type: 'clear' });
};
console.table = function(data) {
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0] !== null) {
    const keys = Object.keys(data[0]);
    const header = '| (idx) | ' + keys.join(' | ') + ' |';
    const sep = '|---|' + keys.map(() => '---').join('|') + '|';
    const rows = data.slice(0, 30).map((row, i) =>
      '| ' + i + ' | ' + keys.map(k => String(row[k] !== undefined ? row[k] : '')).join(' | ') + ' |'
    );
    self.postMessage({ type: 'log', level: 'TABLE', text: '\\n' + [header, sep, ...rows].join('\\n') });
  } else {
    self.postMessage({ type: 'log', level: 'TABLE', text: safeFormat(data) });
  }
};

self.onerror = function(message, source, lineno, colno, error) {
  self.postMessage({ type: 'error', error: (error && error.message) || String(message) || 'Script error' });
  return true;
};

self.onunhandledrejection = function(e) {
  self.postMessage({ type: 'error', error: (e.reason && e.reason.message) || String(e.reason || 'Unhandled Promise Rejection') });
};

(async () => {
  const start = performance.now();
  try {
    const __fn = async () => {
` + code + `
    };
    const __res = await __fn();
    const elapsed = (performance.now() - start).toFixed(2);
    if (__res !== undefined) {
      self.postMessage({ type: 'return', text: safeFormat(__res) });
    }
    self.postMessage({ type: 'done', elapsed });
  } catch (err) {
    self.postMessage({ type: 'error', error: (err && err.message) || String(err) });
  }
})();
`;

        const blob = new Blob([runnerScript], { type: 'application/javascript' });
        const blobUrl = URL.createObjectURL(blob);
        blobUrlRef.current = blobUrl;

        const worker = new Worker(blobUrl);
        activeWorkerRef.current = worker;

        const cleanup = () => {
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
          }
          if (activeWorkerRef.current === worker) {
            worker.terminate();
            activeWorkerRef.current = null;
          }
          if (blobUrlRef.current === blobUrl) {
            try {
              URL.revokeObjectURL(blobUrl);
            } catch {}
            blobUrlRef.current = null;
          }
          setIsRunning(false);
        };

        // 10-second timeout to prevent infinite loops
        timeoutRef.current = setTimeout(() => {
          setConsoleOutput((prev) => [...prev, '[TIMEOUT] Execution exceeded 10-second limit and was terminated']);
          cleanup();
        }, 10000);

        worker.onmessage = (e: MessageEvent) => {
          hasReceivedMessage = true;
          const msg = e.data;
          if (!msg || typeof msg !== 'object') return;

          if (msg.type === 'clear') {
            setConsoleOutput([]);
          } else if (msg.type === 'log') {
            setConsoleOutput((prev) => [...prev, `[${msg.level}] ${msg.text}`]);
          } else if (msg.type === 'return') {
            setConsoleOutput((prev) => [...prev, `[RETURN] ${msg.text}`]);
          } else if (msg.type === 'done') {
            setConsoleOutput((prev) => [...prev, `--- Execution completed in ${msg.elapsed} ms ---`]);
            cleanup();
          } else if (msg.type === 'error') {
            setConsoleOutput((prev) => [...prev, `[EXCEPTION] ${msg.error}`]);
            cleanup();
          }
        };

        worker.onerror = (e: ErrorEvent) => {
          // If worker failed before delivering any messages (e.g. CSP or Blob issue), fallback to in-thread runner
          if (!hasReceivedMessage) {
            cleanup();
            handleInThreadFallback(code);
            return;
          }
          setConsoleOutput((prev) => [...prev, `[EXCEPTION] ${e.message || 'Worker runtime error'}`]);
          cleanup();
        };

        workerStarted = true;
      }
    } catch {
      workerStarted = false;
    }

    if (!workerStarted) {
      handleInThreadFallback(code);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: '0.65rem' }}>
      {/* Toolbar & Presets */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {isRunning ? (
            <button
              type="button"
              onClick={handleStop}
              className="btn-pill"
              style={{ fontSize: '0.76rem', padding: '0.35rem 0.85rem', gap: '0.35rem', borderColor: '#ef4444', color: '#ef4444' }}
            >
              <span>⏹</span> Stop
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRun}
              className="btn-pill btn-pill-primary"
              style={{ fontSize: '0.76rem', padding: '0.35rem 0.85rem', gap: '0.35rem' }}
            >
              <span>▶</span> Run Code
            </button>
          )}
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
                const isError = line.startsWith('[ERROR]') || line.startsWith('[EXCEPTION]') || line.startsWith('[TIMEOUT]');
                const isWarn = line.startsWith('[WARN]') || line.startsWith('[STOPPED]');
                const isReturn = line.startsWith('[RETURN]');
                return (
                  <div
                    key={idx}
                    style={{
                      color: isError ? '#f87171' : isWarn ? '#fbbf24' : isReturn ? '#a78bfa' : '#e4e4e7',
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
   TOOL 4: GRAPH (Scientific & Graphing Calculator)
   ========================================================================= */

interface CalculatorFunction {
  id: string;
  fn: string;
  color: string;
  label: string;
  visible: boolean;
}

function GraphTool({
  onInsertIntoChat,
  onSendToWrite
}: {
  onInsertIntoChat?: (text: string) => void;
  onSendToWrite?: (svg: string, title: string) => void;
}) {
  const [functions, setFunctions] = useState<CalculatorFunction[]>([
    { id: '1', fn: 'x^2 - 4', color: '#a78bfa', label: 'f₁(x)', visible: true },
    { id: '2', fn: '2*x + 1', color: '#34d399', label: 'f₂(x)', visible: false },
    { id: '3', fn: 'sin(x)', color: '#38bdf8', label: 'f₃(x)', visible: false }
  ]);
  const [activeFnId, setActiveFnId] = useState<string>('1');
  const [subTab, setSubTab] = useState<'plot' | 'calc' | 'table'>('plot');

  // Bounds
  const [xMin, setXMin] = useState<number>(-10);
  const [xMax, setXMax] = useState<number>(10);
  const [yMin, setYMin] = useState<number>(-10);
  const [yMax, setYMax] = useState<number>(10);
  const [autoY, setAutoY] = useState<boolean>(true);

  // Calculus Tools State
  const [x0, setX0] = useState<number>(2);
  const [showTangent, setShowTangent] = useState<boolean>(false);
  const [roots, setRoots] = useState<number[] | null>(null);
  const [showRoots, setShowRoots] = useState<boolean>(false);
  const [extrema, setExtrema] = useState<Array<{ x: number; y: number; type: 'min' | 'max' }> | null>(null);
  const [showExtrema, setShowExtrema] = useState<boolean>(false);
  const [intA, setIntA] = useState<number>(0);
  const [intB, setIntB] = useState<number>(2);
  const [integralValue, setIntegralValue] = useState<number | null>(null);
  const [showIntegral, setShowIntegral] = useState<boolean>(false);

  // Table of values state
  const [tableStart, setTableStart] = useState<number>(-5);
  const [tableEnd, setTableEnd] = useState<number>(5);
  const [tableStep, setTableStep] = useState<number>(1);

  // Cursor Hover Coordinates
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);
  const [copied, setCopied] = useState(false);

  const activeFn = useMemo(() => {
    return functions.find((f) => f.id === activeFnId) || functions[0];
  }, [functions, activeFnId]);

  // Calculus derived calculations for active function
  const evalAtX0 = useMemo(() => {
    if (!activeFn?.fn) return NaN;
    return evalFx(activeFn.fn, x0);
  }, [activeFn, x0]);

  const derivativeAtX0 = useMemo(() => {
    if (!activeFn?.fn) return NaN;
    return evalDerivative(activeFn.fn, x0);
  }, [activeFn, x0]);

  const handleCalculateRoots = () => {
    if (!activeFn?.fn) return;
    const found = findRoots(activeFn.fn, xMin, xMax);
    setRoots(found);
    setShowRoots(true);
  };

  const handleCalculateExtrema = () => {
    if (!activeFn?.fn) return;
    const found = findExtrema(activeFn.fn, xMin, xMax);
    setExtrema(found);
    setShowExtrema(true);
  };

  const handleCalculateIntegral = () => {
    if (!activeFn?.fn) return;
    const val = integrateSimpson(activeFn.fn, intA, intB, 120);
    setIntegralValue(Math.round(val * 10000) / 10000);
    setShowIntegral(true);
  };

  // Compile plot points & decorations
  const points = useMemo(() => {
    const pts: Array<{ x: number; y: number; label?: string; color?: string }> = [];
    if (showRoots && roots) {
      roots.forEach((r) => {
        pts.push({ x: r, y: 0, label: `Root: ${r}`, color: '#34d399' });
      });
    }
    if (showExtrema && extrema) {
      extrema.forEach((e) => {
        pts.push({
          x: e.x,
          y: e.y,
          label: `${e.type === 'max' ? 'Max' : 'Min'}: (${e.x}, ${e.y})`,
          color: e.type === 'max' ? '#38bdf8' : '#f43f5e'
        });
      });
    }
    return pts;
  }, [showRoots, roots, showExtrema, extrema]);

  const tangentLine = useMemo(() => {
    if (!showTangent || !activeFn || !Number.isFinite(derivativeAtX0) || !Number.isFinite(evalAtX0)) {
      return undefined;
    }
    return {
      x0,
      slope: derivativeAtX0,
      y0: evalAtX0,
      color: '#fbbf24'
    };
  }, [showTangent, activeFn, x0, derivativeAtX0, evalAtX0]);

  const shadedRegions = useMemo(() => {
    if (!showIntegral || !activeFn) return undefined;
    const fnIdx = functions.findIndex((f) => f.id === activeFn.id);
    return [
      {
        from: intA,
        to: intB,
        fnIndex: fnIdx >= 0 ? fnIdx : 0,
        color: 'rgba(139, 92, 246, 0.3)'
      }
    ];
  }, [showIntegral, activeFn, functions, intA, intB]);

  const plotOptions: PlotOptions = useMemo(() => {
    const activeSpecs: FunctionSpec[] = functions
      .filter((f) => f.visible && f.fn.trim().length > 0)
      .map((f) => ({
        fn: f.fn,
        color: f.color,
        label: f.label,
        visible: true
      }));

    return {
      functions: activeSpecs,
      xMin,
      xMax,
      yMin: autoY ? undefined : yMin,
      yMax: autoY ? undefined : yMax,
      width: 680,
      height: 380,
      points: points.length > 0 ? points : undefined,
      tangentLine,
      shadedRegions,
      title: activeFn ? `Graphing Calculator · ${activeFn.label} = ${activeFn.fn}` : 'Graphing Calculator'
    };
  }, [functions, xMin, xMax, yMin, yMax, autoY, points, tangentLine, shadedRegions, activeFn]);

  const svgOutput = useMemo(() => {
    try {
      return generatePlotSvg(plotOptions);
    } catch {
      return '<svg><text x="20" y="20" fill="red">Invalid function expression</text></svg>';
    }
  }, [plotOptions]);

  // Table of Values computation
  const tableRows = useMemo(() => {
    if (subTab !== 'table') return [];
    const visibleFns = functions.filter((f) => f.visible);
    return computeTableOfValues(
      visibleFns.map((f) => f.fn),
      tableStart,
      tableEnd,
      tableStep
    );
  }, [subTab, functions, tableStart, tableEnd, tableStep]);

  const handleUpdateFunction = (id: string, updates: Partial<CalculatorFunction>) => {
    setFunctions((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const handleAddFunction = () => {
    if (functions.length >= 4) return;
    const colors = ['#a78bfa', '#34d399', '#38bdf8', '#fbbf24', '#f87171'];
    const newIdx = functions.length + 1;
    const newId = String(Date.now());
    setFunctions((prev) => [
      ...prev,
      {
        id: newId,
        fn: 'cos(x)',
        color: colors[(newIdx - 1) % colors.length],
        label: `f${newIdx}(x)`,
        visible: true
      }
    ]);
    setActiveFnId(newId);
  };

  const handleRemoveFunction = (id: string) => {
    if (functions.length <= 1) return;
    setFunctions((prev) => prev.filter((f) => f.id !== id));
    if (activeFnId === id) {
      const remaining = functions.filter((f) => f.id !== id);
      setActiveFnId(remaining[0]?.id || '1');
    }
  };

  const insertToken = (tok: string) => {
    if (!activeFn) return;
    handleUpdateFunction(activeFn.id, { fn: activeFn.fn + tok });
  };

  const presets = [
    { label: 'x² - 4', fn: 'x^2 - 4', min: -6, max: 6 },
    { label: 'sin(x)', fn: 'sin(x)', min: -6.28, max: 6.28 },
    { label: 'cos(x)', fn: 'cos(x)', min: -6.28, max: 6.28 },
    { label: 'x³ - 3x', fn: 'x^3 - 3*x', min: -3, max: 3 },
    { label: 'Gaussian exp(-x²)', fn: 'exp(-x^2)', min: -4, max: 4 },
    { label: '1 / x', fn: '1 / x', min: -5, max: 5 },
    { label: 'sqrt(x)', fn: 'sqrt(x)', min: 0, max: 20 },
    { label: '|x|', fn: 'abs(x)', min: -6, max: 6 },
    { label: 'Damped Sine', fn: 'exp(-0.2*x) * sin(3*x)', min: 0, max: 12 }
  ];

  const handleSvgMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const margin = { top: 45, right: 35, bottom: 45, left: 60 };
    const plotW = rect.width - margin.left - margin.right;
    const plotH = rect.height - margin.top - margin.bottom;

    const mouseX = e.clientX - rect.left - margin.left;
    const mouseY = e.clientY - rect.top - margin.top;

    if (mouseX >= 0 && mouseX <= plotW && mouseY >= 0 && mouseY <= plotH) {
      const mathX = xMin + (mouseX / plotW) * (xMax - xMin);
      const mathY = yMin + ((plotH - mouseY) / plotH) * (yMax - yMin);
      setHoverCoord({
        x: Math.round(mathX * 100) / 100,
        y: Math.round(mathY * 100) / 100
      });
    } else {
      setHoverCoord(null);
    }
  };

  const handleDownloadSvg = () => {
    downloadBlob(svgOutput, `${sanitizeFilename(activeFn?.label || 'graphing_calculator')}.svg`, 'image/svg+xml');
  };

  const handleCopySvg = async () => {
    try {
      await navigator.clipboard.writeText(svgOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: '0.65rem' }}>
      {/* Top Header: Function Equations & Mode Switches */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', backgroundColor: '#09090e', padding: '0.65rem', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '8px' }}>
        {/* Function Entries */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {functions.map((f) => (
            <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              <input
                type="checkbox"
                checked={f.visible}
                onChange={(e) => handleUpdateFunction(f.id, { visible: e.target.checked })}
                title="Toggle curve visibility"
                style={{ cursor: 'pointer', accentColor: f.color }}
              />
              <button
                type="button"
                onClick={() => setActiveFnId(f.id)}
                style={{
                  fontSize: '0.76rem',
                  fontFamily: 'var(--font-mono)',
                  color: f.color,
                  fontWeight: 600,
                  backgroundColor: activeFnId === f.id ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
                  border: activeFnId === f.id ? `1px solid ${f.color}` : '1px solid transparent',
                  borderRadius: '4px',
                  padding: '0.15rem 0.4rem',
                  cursor: 'pointer'
                }}
              >
                {f.label} =
              </button>
              <input
                type="text"
                value={f.fn}
                onChange={(e) => handleUpdateFunction(f.id, { fn: e.target.value })}
                onFocus={() => setActiveFnId(f.id)}
                placeholder="e.g. x^2 - 4, sin(x), sqrt(x)"
                style={{
                  flex: 1,
                  minWidth: '180px',
                  backgroundColor: '#050508',
                  border: `1px solid ${activeFnId === f.id ? f.color : 'rgba(255, 255, 255, 0.12)'}`,
                  borderRadius: '5px',
                  padding: '0.3rem 0.6rem',
                  color: '#ffffff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem'
                }}
              />
              <input
                type="color"
                value={f.color}
                onChange={(e) => handleUpdateFunction(f.id, { color: e.target.value })}
                style={{ width: '26px', height: '26px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: 'transparent' }}
                title="Change curve color"
              />
              {functions.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveFunction(f.id)}
                  style={{ background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: '0.9rem' }}
                  title="Remove function"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Function Actions & Sub-Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem', paddingTop: '0.3rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
            {functions.length < 4 && (
              <button
                type="button"
                onClick={handleAddFunction}
                className="btn-pill"
                style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem' }}
              >
                + Add Function
              </button>
            )}
            {/* Quick Math Keypad Chips */}
            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginLeft: '0.4rem' }}>
              {['sin(', 'cos(', 'tan(', 'sqrt(', 'exp(', 'abs(', '^2', 'pi', 'tau'].map((tok) => (
                <button
                  key={tok}
                  type="button"
                  onClick={() => insertToken(tok)}
                  style={{
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '0.15rem 0.4rem',
                    backgroundColor: '#111118',
                    border: '1px solid rgba(139, 92, 246, 0.2)',
                    borderRadius: '4px',
                    color: '#c4b5fd',
                    cursor: 'pointer'
                  }}
                >
                  {tok}
                </button>
              ))}
            </div>
          </div>

          {/* Subtabs: Plot / Calculus / Table */}
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            <button
              type="button"
              onClick={() => setSubTab('plot')}
              className="btn-pill"
              style={{
                fontSize: '0.72rem',
                padding: '0.2rem 0.6rem',
                backgroundColor: subTab === 'plot' ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
                borderColor: subTab === 'plot' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)',
                color: subTab === 'plot' ? '#ffffff' : '#a1a1aa'
              }}
            >
              📈 Plot
            </button>
            <button
              type="button"
              onClick={() => setSubTab('calc')}
              className="btn-pill"
              style={{
                fontSize: '0.72rem',
                padding: '0.2rem 0.6rem',
                backgroundColor: subTab === 'calc' ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
                borderColor: subTab === 'calc' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)',
                color: subTab === 'calc' ? '#ffffff' : '#a1a1aa'
              }}
            >
              📐 Calculus
            </button>
            <button
              type="button"
              onClick={() => setSubTab('table')}
              className="btn-pill"
              style={{
                fontSize: '0.72rem',
                padding: '0.2rem 0.6rem',
                backgroundColor: subTab === 'table' ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
                borderColor: subTab === 'table' ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)',
                color: subTab === 'table' ? '#ffffff' : '#a1a1aa'
              }}
            >
              📊 Table
            </button>
          </div>
        </div>
      </div>

      {/* Main Body: Plot View vs Table View */}
      {subTab === 'table' ? (
        /* Table of Values View */
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', backgroundColor: '#07070a', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '10px', padding: '0.85rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.74rem', color: '#a1a1aa', fontFamily: 'var(--font-mono)' }}>Range:</span>
            <span style={{ fontSize: '0.72rem', color: '#71717a' }}>Start:</span>
            <input
              type="number"
              value={tableStart}
              onChange={(e) => setTableStart(parseFloat(e.target.value) || 0)}
              style={{ width: '60px', backgroundColor: '#09090e', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '4px', color: '#fff', padding: '0.2rem 0.4rem', fontSize: '0.74rem' }}
            />
            <span style={{ fontSize: '0.72rem', color: '#71717a' }}>End:</span>
            <input
              type="number"
              value={tableEnd}
              onChange={(e) => setTableEnd(parseFloat(e.target.value) || 10)}
              style={{ width: '60px', backgroundColor: '#09090e', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '4px', color: '#fff', padding: '0.2rem 0.4rem', fontSize: '0.74rem' }}
            />
            <span style={{ fontSize: '0.72rem', color: '#71717a' }}>Step (Δx):</span>
            <input
              type="number"
              step="0.1"
              value={tableStep}
              onChange={(e) => setTableStep(parseFloat(e.target.value) || 1)}
              style={{ width: '60px', backgroundColor: '#09090e', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '4px', color: '#fff', padding: '0.2rem 0.4rem', fontSize: '0.74rem' }}
            />
          </div>

          <div style={{ flex: 1, overflowY: 'auto', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '6px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem', fontFamily: 'var(--font-mono)' }}>
              <thead>
                <tr style={{ backgroundColor: '#111118', borderBottom: '1px solid rgba(139, 92, 246, 0.2)' }}>
                  <th style={{ padding: '0.45rem 0.75rem', textAlign: 'left', color: '#c4b5fd' }}>x</th>
                  {functions.filter((f) => f.visible).map((f) => (
                    <th key={f.id} style={{ padding: '0.45rem 0.75rem', textAlign: 'left', color: f.color }}>
                      {f.label} ({f.fn})
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableRows.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)', backgroundColor: i % 2 === 0 ? 'transparent' : '#0a0a0f' }}>
                    <td style={{ padding: '0.35rem 0.75rem', color: '#ffffff', fontWeight: 600 }}>{r.x}</td>
                    {r.values.map((v, vIdx) => (
                      <td key={vIdx} style={{ padding: '0.35rem 0.75rem', color: v == null ? '#71717a' : '#e4e4e7' }}>
                        {v == null ? 'undefined' : v}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Live SVG Plot & Calculus Controls View */
        <div style={{ flex: 1, minHeight: 0, display: 'grid', gridTemplateColumns: subTab === 'calc' ? '1fr 280px' : '1fr', gap: '0.65rem' }}>
          {/* Left: SVG Canvas */}
          <div
            onMouseMove={handleSvgMouseMove}
            onMouseLeave={() => setHoverCoord(null)}
            style={{
              position: 'relative',
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
            <div
              dangerouslySetInnerHTML={{ __html: svgOutput }}
              style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            />
            {/* Live Hover Coordinate Readout */}
            {hoverCoord && (
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(12, 12, 18, 0.85)',
                  border: '1px solid #8b5cf6',
                  borderRadius: '6px',
                  padding: '0.2rem 0.55rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.72rem',
                  color: '#ffffff',
                  pointerEvents: 'none'
                }}
              >
                x: {hoverCoord.x}, y: {hoverCoord.y}
              </div>
            )}
          </div>

          {/* Right: Calculus Analysis Panel */}
          {subTab === 'calc' && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.65rem',
                backgroundColor: '#09090e',
                border: '1px solid rgba(139, 92, 246, 0.25)',
                borderRadius: '10px',
                padding: '0.85rem',
                overflowY: 'auto'
              }}
            >
              <div style={{ fontSize: '0.78rem', fontFamily: 'var(--font-mono)', color: '#c4b5fd', fontWeight: 600 }}>
                Calculus Tools: {activeFn?.label}
              </div>

              {/* Value Evaluation & Derivative at x0 */}
              <div style={{ backgroundColor: '#111118', padding: '0.6rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>Target Point (x₀):</span>
                  <input
                    type="number"
                    value={x0}
                    onChange={(e) => setX0(parseFloat(e.target.value) || 0)}
                    style={{ width: '55px', backgroundColor: '#07070a', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '4px', color: '#fff', padding: '0.15rem 0.35rem', fontSize: '0.74rem' }}
                  />
                </div>
                <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#ffffff', marginBottom: '0.25rem' }}>
                  f({x0}) = <span style={{ color: '#34d399' }}>{Number.isFinite(evalAtX0) ? evalAtX0.toFixed(4) : 'NaN'}</span>
                </div>
                <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#ffffff', marginBottom: '0.35rem' }}>
                  f'({x0}) = <span style={{ color: '#fbbf24' }}>{Number.isFinite(derivativeAtX0) ? derivativeAtX0.toFixed(4) : 'NaN'}</span>
                </div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', color: '#fbbf24', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={showTangent}
                    onChange={(e) => setShowTangent(e.target.checked)}
                    style={{ accentColor: '#fbbf24' }}
                  />
                  Render Tangent Line on Plot
                </label>
              </div>

              {/* Roots Finder */}
              <div style={{ backgroundColor: '#111118', padding: '0.6rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>Roots [f(x) = 0]:</span>
                  <button
                    type="button"
                    onClick={handleCalculateRoots}
                    className="btn-pill"
                    style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}
                  >
                    Find Roots
                  </button>
                </div>
                {roots && (
                  <div style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#34d399' }}>
                    {roots.length === 0 ? 'No roots found in view' : `Roots: ${roots.join(', ')}`}
                  </div>
                )}
              </div>

              {/* Local Extrema Finder */}
              <div style={{ backgroundColor: '#111118', padding: '0.6rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.72rem', color: '#a1a1aa' }}>Local Extrema:</span>
                  <button
                    type="button"
                    onClick={handleCalculateExtrema}
                    className="btn-pill"
                    style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}
                  >
                    Find Extrema
                  </button>
                </div>
                {extrema && (
                  <div style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: '#c4b5fd' }}>
                    {extrema.length === 0 ? (
                      'No extrema found in view'
                    ) : (
                      extrema.map((e, idx) => (
                        <div key={idx}>
                          {e.type.toUpperCase()}: ({e.x}, {e.y})
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Numerical Definite Integral */}
              <div style={{ backgroundColor: '#111118', padding: '0.6rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ fontSize: '0.72rem', color: '#a1a1aa', marginBottom: '0.35rem' }}>
                  Definite Integral (∫ₐᵇ f(x)dx):
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.7rem', color: '#71717a' }}>a:</span>
                  <input
                    type="number"
                    value={intA}
                    onChange={(e) => setIntA(parseFloat(e.target.value) || 0)}
                    style={{ width: '50px', backgroundColor: '#07070a', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '4px', color: '#fff', padding: '0.15rem 0.35rem', fontSize: '0.74rem' }}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#71717a' }}>b:</span>
                  <input
                    type="number"
                    value={intB}
                    onChange={(e) => setIntB(parseFloat(e.target.value) || 0)}
                    style={{ width: '50px', backgroundColor: '#07070a', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '4px', color: '#fff', padding: '0.15rem 0.35rem', fontSize: '0.74rem' }}
                  />
                  <button
                    type="button"
                    onClick={handleCalculateIntegral}
                    className="btn-pill"
                    style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}
                  >
                    Integrate
                  </button>
                </div>
                {integralValue !== null && (
                  <div style={{ fontSize: '0.74rem', fontFamily: 'var(--font-mono)', color: '#c4b5fd', marginTop: '0.2rem' }}>
                    Area ≈ <span style={{ color: '#ffffff', fontWeight: 600 }}>{integralValue}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Controls: Presets, Window Bounds & Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
        {/* Bounds & Presets Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.4rem' }}>
          {/* Window Presets */}
          <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.7rem', color: '#71717a', fontFamily: 'var(--font-mono)' }}>Curves:</span>
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  if (activeFn) {
                    handleUpdateFunction(activeFn.id, { fn: p.fn });
                    setXMin(p.min);
                    setXMax(p.max);
                  }
                }}
                className="btn-pill"
                style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Bounds Controls */}
          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.7rem', color: '#a1a1aa', fontFamily: 'var(--font-mono)' }}>X:</span>
            <input
              type="number"
              value={xMin}
              onChange={(e) => setXMin(parseFloat(e.target.value) || -10)}
              style={{ width: '50px', backgroundColor: '#07070a', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '4px', color: '#fff', padding: '0.15rem 0.35rem', fontSize: '0.72rem' }}
            />
            <span style={{ color: '#71717a', fontSize: '0.7rem' }}>to</span>
            <input
              type="number"
              value={xMax}
              onChange={(e) => setXMax(parseFloat(e.target.value) || 10)}
              style={{ width: '50px', backgroundColor: '#07070a', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '4px', color: '#fff', padding: '0.15rem 0.35rem', fontSize: '0.72rem' }}
            />
            <button
              type="button"
              onClick={() => {
                setXMin(-10);
                setXMax(10);
              }}
              className="btn-pill"
              style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}
              title="Reset window to standard [-10, 10]"
            >
              Standard
            </button>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '0.45rem' }}>
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
                onClick={() => onInsertIntoChat(`[Graph: ${activeFn?.label || 'f(x)'} = ${activeFn?.fn || ''}]\n\`\`\`xml\n${svgOutput}\n\`\`\``)}
                className="btn-pill"
                style={{ fontSize: '0.74rem', padding: '0.3rem 0.75rem', borderColor: '#34d399', color: '#34d399' }}
              >
                <span>➕</span> Insert into Chat
              </button>
            )}
            {onSendToWrite && (
              <button
                onClick={() => onSendToWrite(`### Graphing Calculator: ${activeFn?.label || 'f(x)'} = ${activeFn?.fn || ''}\n\`\`\`xml\n${svgOutput}\n\`\`\``, activeFn?.label || 'Graph')}
                className="btn-pill"
                style={{ fontSize: '0.74rem', padding: '0.3rem 0.75rem' }}
              >
                <span>✍️</span> Send to Write
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   TOOL 5: DRAW / PAINT (Interactive HTML5 Canvas Studio)
   ========================================================================= */

type DrawToolMode = 'pen' | 'brush' | 'highlighter' | 'line' | 'arrow' | 'rect' | 'circle' | 'text' | 'fill' | 'eraser';
type GridMode = 'none' | 'dots' | 'graph';

function DrawTool({
  onInsertIntoChat,
  onSendToWrite
}: {
  onInsertIntoChat?: (text: string) => void;
  onSendToWrite?: (dataUrl: string, title: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<DrawToolMode>('pen');
  const [color, setColor] = useState('#8b5cf6'); // Ina Violet
  const [size, setSize] = useState(4);
  const [isFilled, setIsFilled] = useState(false);
  const [gridMode, setGridMode] = useState<GridMode>('none');
  const [textInput, setTextInput] = useState('Note');

  const [isDrawing, setIsDrawing] = useState(false);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const snapshotRef = useRef<ImageData | null>(null);

  const [history, setHistory] = useState<ImageData[]>([]);
  const [redoStack, setRedoStack] = useState<ImageData[]>([]);

  const colors = [
    { label: 'Ina Violet', hex: '#8b5cf6' },
    { label: 'Lavender', hex: '#c4b5fd' },
    { label: 'Sky Blue', hex: '#38bdf8' },
    { label: 'Deep Blue', hex: '#3b82f6' },
    { label: 'Emerald', hex: '#10b981' },
    { label: 'Mint', hex: '#34d399' },
    { label: 'Lime', hex: '#84cc16' },
    { label: 'Yellow', hex: '#eab308' },
    { label: 'Amber', hex: '#f59e0b' },
    { label: 'Orange', hex: '#f97316' },
    { label: 'Red', hex: '#ef4444' },
    { label: 'Rose', hex: '#f43f5e' },
    { label: 'Pink', hex: '#ec4899' },
    { label: 'White', hex: '#ffffff' },
    { label: 'Slate', hex: '#71717a' },
    { label: 'Black', hex: '#000000' }
  ];

  // Draw background and optional grid
  const drawBackground = (ctx: CanvasRenderingContext2D, width: number, height: number, mode: GridMode) => {
    ctx.fillStyle = '#09090e';
    ctx.fillRect(0, 0, width, height);

    if (mode === 'dots') {
      ctx.fillStyle = 'rgba(139, 92, 246, 0.25)';
      const step = 24;
      for (let x = step / 2; x < width; x += step) {
        for (let y = step / 2; y < height; y += step) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (mode === 'graph') {
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.12)';
      ctx.lineWidth = 1;
      const step = 24;
      ctx.beginPath();
      for (let x = 0; x < width; x += step) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += step) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
    }
  };

  // Initialize canvas
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

    drawBackground(ctx, rect.width, rect.height, gridMode);
    setHistory([ctx.getImageData(0, 0, canvas.width, canvas.height)]);
    setRedoStack([]);
  }, []);

  const getCanvasCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  // Flood fill algorithm
  const performFloodFill = (startX: number, startY: number, fillHex: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const rect = canvas.getBoundingClientRect();
    const px = Math.floor(startX * (w / rect.width));
    const py = Math.floor(startY * (h / rect.height));

    if (px < 0 || px >= w || py < 0 || py >= h) return;

    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;

    // Parse target color
    const temp = document.createElement('canvas');
    temp.width = temp.height = 1;
    const tctx = temp.getContext('2d')!;
    tctx.fillStyle = fillHex;
    tctx.fillRect(0, 0, 1, 1);
    const target = tctx.getImageData(0, 0, 1, 1).data;
    const tr = target[0], tg = target[1], tb = target[2], ta = 255;

    const startIdx = (py * w + px) * 4;
    const sr = data[startIdx], sg = data[startIdx + 1], sb = data[startIdx + 2], sa = data[startIdx + 3];

    if (Math.abs(sr - tr) < 4 && Math.abs(sg - tg) < 4 && Math.abs(sb - tb) < 4 && Math.abs(sa - ta) < 4) {
      return;
    }

    const matches = (idx: number) => {
      return Math.abs(data[idx] - sr) <= 32 &&
             Math.abs(data[idx + 1] - sg) <= 32 &&
             Math.abs(data[idx + 2] - sb) <= 32;
    };

    const queue: number[] = [px, py];
    const visited = new Uint8Array(w * h);
    visited[py * w + px] = 1;

    let head = 0;
    while (head < queue.length && queue.length < w * h * 2) {
      const cx = queue[head++];
      const cy = queue[head++];
      const idx = (cy * w + cx) * 4;

      data[idx] = tr;
      data[idx + 1] = tg;
      data[idx + 2] = tb;
      data[idx + 3] = ta;

      const neighbors = [
        [cx - 1, cy],
        [cx + 1, cy],
        [cx, cy - 1],
        [cx, cy + 1]
      ];

      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
          const npos = ny * w + nx;
          if (!visited[npos]) {
            visited[npos] = 1;
            if (matches(npos * 4)) {
              queue.push(nx, ny);
            }
          }
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
    commitSnapshot();
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) => {
    const headLength = Math.max(12, size * 2.5);
    const dx = toX - fromX;
    const dy = toY - fromY;
    const angle = Math.atan2(dy, dx);
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(toX, toY);
    ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  };

  const commitSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const snap = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory((prev) => [...prev.slice(-20), snap]);
    setRedoStack([]);
  };

  const onStartAction = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'fill') {
      performFloodFill(x, y, color);
      return;
    }

    if (tool === 'text') {
      ctx.font = `${Math.max(12, size * 3.5)}px sans-serif`;
      ctx.fillStyle = color;
      ctx.fillText(textInput || 'Note', x, y);
      commitSnapshot();
      return;
    }

    setIsDrawing(true);
    startPosRef.current = { x, y };
    snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    if (tool === 'pen' || tool === 'brush' || tool === 'highlighter' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const onMoveAction = (x: number, y: number) => {
    if (!isDrawing || !startPosRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (tool === 'pen' || tool === 'brush' || tool === 'highlighter' || tool === 'eraser') {
      if (tool === 'eraser') {
        ctx.strokeStyle = '#09090e';
        ctx.lineWidth = size * 3.5;
        ctx.globalAlpha = 1.0;
      } else if (tool === 'highlighter') {
        ctx.strokeStyle = color;
        ctx.lineWidth = size * 3;
        ctx.globalAlpha = 0.35;
      } else if (tool === 'brush') {
        ctx.strokeStyle = color;
        ctx.lineWidth = size * 2;
        ctx.globalAlpha = 0.85;
      } else {
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        ctx.globalAlpha = 1.0;
      }
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      // Shape live preview: restore original snapshot first
      if (snapshotRef.current) {
        ctx.putImageData(snapshotRef.current, 0, 0);
      }

      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = size;
      ctx.globalAlpha = 1.0;

      const sx = startPosRef.current.x;
      const sy = startPosRef.current.y;

      if (tool === 'line') {
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(x, y);
        ctx.stroke();
      } else if (tool === 'arrow') {
        drawArrow(ctx, sx, sy, x, y);
      } else if (tool === 'rect') {
        const rw = x - sx;
        const rh = y - sy;
        if (isFilled) {
          ctx.fillRect(sx, sy, rw, rh);
        } else {
          ctx.strokeRect(sx, sy, rw, rh);
        }
      } else if (tool === 'circle') {
        const rx = Math.abs(x - sx) / 2;
        const ry = Math.abs(y - sy) / 2;
        const cx = Math.min(sx, x) + rx;
        const cy = Math.min(sy, y) + ry;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        if (isFilled) {
          ctx.fill();
        } else {
          ctx.stroke();
        }
      }
    }
  };

  const onEndAction = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    startPosRef.current = null;
    snapshotRef.current = null;
    commitSnapshot();
  };

  // Undo & Redo
  const handleUndo = () => {
    if (history.length <= 1) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const current = history[history.length - 1];
    const prevHistory = history.slice(0, -1);
    const target = prevHistory[prevHistory.length - 1];

    if (target && current) {
      ctx.putImageData(target, 0, 0);
      setHistory(prevHistory);
      setRedoStack((prev) => [...prev, current]);
    }
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const next = redoStack[redoStack.length - 1];
    const nextRedo = redoStack.slice(0, -1);

    if (next) {
      ctx.putImageData(next, 0, 0);
      setRedoStack(nextRedo);
      setHistory((prev) => [...prev, next]);
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    drawBackground(ctx, rect.width, rect.height, gridMode);
    commitSnapshot();
  };

  const handleGridChange = (mode: GridMode) => {
    setGridMode(mode);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    drawBackground(ctx, rect.width, rect.height, mode);
    commitSnapshot();
  };

  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `easylm-canvas-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: '0.65rem' }}>
      {/* Primary Toolbar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', backgroundColor: '#09090e', padding: '0.65rem', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '8px' }}>
        {/* Tool Selector Row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.45rem' }}>
          <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {[
              { id: 'pen', label: '✏️ Pen' },
              { id: 'brush', label: '🖌️ Brush' },
              { id: 'highlighter', label: '🖍️ Highlight' },
              { id: 'line', label: '📏 Line' },
              { id: 'arrow', label: '↗️ Arrow' },
              { id: 'rect', label: '🔲 Rect' },
              { id: 'circle', label: '⭕ Circle' },
              { id: 'text', label: '🔤 Text' },
              { id: 'fill', label: '🪣 Fill' },
              { id: 'eraser', label: '🧹 Eraser' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTool(t.id as DrawToolMode)}
                className="btn-pill"
                style={{
                  fontSize: '0.72rem',
                  padding: '0.2rem 0.55rem',
                  backgroundColor: tool === t.id ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
                  borderColor: tool === t.id ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)',
                  color: tool === t.id ? '#ffffff' : '#a1a1aa'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Undo / Redo / Clear / PNG */}
          <div style={{ display: 'flex', gap: '0.3rem', alignItems: 'center' }}>
            <button
              type="button"
              onClick={handleUndo}
              disabled={history.length <= 1}
              className="btn-pill"
              style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', opacity: history.length <= 1 ? 0.35 : 1 }}
              title="Undo stroke (Ctrl+Z)"
            >
              ↩️ Undo
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={redoStack.length === 0}
              className="btn-pill"
              style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', opacity: redoStack.length === 0 ? 0.35 : 1 }}
              title="Redo stroke"
            >
              ↪️ Redo
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="btn-pill"
              style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}
              title="Clear canvas"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={handleDownloadPng}
              className="btn-pill"
              style={{ fontSize: '0.7rem', padding: '0.2rem 0.55rem', backgroundColor: 'rgba(139, 92, 246, 0.2)', borderColor: '#8b5cf6', color: '#ffffff' }}
              title="Download canvas as PNG"
            >
              💾 PNG
            </button>
          </div>
        </div>

        {/* Second Row: Palette, Size, Shapes Mode, Grid */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.35rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
          {/* 16 Color Palette Swatches */}
          <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {colors.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => setColor(c.hex)}
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: c.hex,
                  border: color === c.hex ? '2px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.2)',
                  cursor: 'pointer',
                  padding: 0
                }}
                title={c.label}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{ width: '22px', height: '22px', padding: 0, border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: 'transparent' }}
              title="Custom Color Picker"
            />
          </div>

          {/* Controls: Size, Shape Fill, Grid Mode, Text Field */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Stroke Size Slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span style={{ fontSize: '0.7rem', color: '#a1a1aa', fontFamily: 'var(--font-mono)' }}>Size: {size}px</span>
              <input
                type="range"
                min={1}
                max={42}
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value, 10))}
                style={{ width: '65px', cursor: 'pointer' }}
              />
            </div>

            {/* Shape Fill Toggle (for rect & circle) */}
            {(tool === 'rect' || tool === 'circle') && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: '#c4b5fd', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={isFilled}
                  onChange={(e) => setIsFilled(e.target.checked)}
                  style={{ accentColor: '#8b5cf6' }}
                />
                Fill Shape
              </label>
            )}

            {/* Text Input for Text Tool */}
            {tool === 'text' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ fontSize: '0.7rem', color: '#a1a1aa' }}>Text:</span>
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Click to place text"
                  style={{ width: '90px', backgroundColor: '#07070a', border: '1px solid rgba(139, 92, 246, 0.3)', borderRadius: '4px', color: '#fff', padding: '0.15rem 0.35rem', fontSize: '0.72rem' }}
                />
              </div>
            )}

            {/* Grid Backdrop Switcher */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span style={{ fontSize: '0.7rem', color: '#71717a', fontFamily: 'var(--font-mono)' }}>Grid:</span>
              {(['none', 'dots', 'graph'] as GridMode[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => handleGridChange(g)}
                  style={{
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-mono)',
                    padding: '0.15rem 0.4rem',
                    backgroundColor: gridMode === g ? 'rgba(139, 92, 246, 0.25)' : 'transparent',
                    border: gridMode === g ? '1px solid #8b5cf6' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '4px',
                    color: gridMode === g ? '#ffffff' : '#71717a',
                    cursor: 'pointer'
                  }}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive HTML5 Canvas Area */}
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
          onMouseDown={(e) => {
            const { x, y } = getCanvasCoords(e.clientX, e.clientY);
            onStartAction(x, y);
          }}
          onMouseMove={(e) => {
            const { x, y } = getCanvasCoords(e.clientX, e.clientY);
            onMoveAction(x, y);
          }}
          onMouseUp={onEndAction}
          onMouseLeave={onEndAction}
          onTouchStart={(e) => {
            if (e.touches[0]) {
              const { x, y } = getCanvasCoords(e.touches[0].clientX, e.touches[0].clientY);
              onStartAction(x, y);
            }
          }}
          onTouchMove={(e) => {
            if (e.touches[0]) {
              const { x, y } = getCanvasCoords(e.touches[0].clientX, e.touches[0].clientY);
              onMoveAction(x, y);
            }
          }}
          onTouchEnd={onEndAction}
          onTouchCancel={onEndAction}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            touchAction: 'none',
            cursor:
              tool === 'eraser'
                ? 'cell'
                : tool === 'fill'
                ? 'copy'
                : tool === 'text'
                ? 'text'
                : 'crosshair'
          }}
        />
      </div>

      {/* Footer Send / Insert Actions */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.4rem', alignItems: 'center' }}>
        {onSendToWrite && (
          <button
            type="button"
            onClick={() => {
              const canvas = canvasRef.current;
              if (!canvas) return;
              onSendToWrite(canvas.toDataURL('image/png'), 'Canvas Diagram');
            }}
            className="btn-pill"
            style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem' }}
          >
            <span>✍️</span> Send to Write
          </button>
        )}
        {onInsertIntoChat && (
          <button
            type="button"
            onClick={() => onInsertIntoChat('[Drawing: Interactive Canvas Diagram Generated in Studio]')}
            className="btn-pill"
            style={{ fontSize: '0.72rem', padding: '0.3rem 0.65rem', borderColor: '#34d399', color: '#34d399' }}
          >
            <span>➕</span> Insert into Chat
          </button>
        )}
      </div>
    </div>
  );
}
