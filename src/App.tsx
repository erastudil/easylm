import React, { useState, useEffect, useRef } from 'react';
import { Session, Message, ToolExecution } from './types';
import {
  createNewSession,
  loadAllSessions,
  saveAllSessions,
  getActiveSessionId,
  setActiveSessionId
} from './engine/storage';
import {
  isWebGPUSupported,
  DEFAULT_MODEL_ID,
  streamChatCompletion,
  ProgressStatus,
  AVAILABLE_MODELS
} from './engine/webllm_spindle';
import { dispatchTool, SYSTEM_TOOLS_PROMPT } from './engine/tools';
import { Sidebar } from './components/Sidebar';
import { MessageItem } from './components/MessageItem';
import { SettingsModal, PERSONALITIES } from './components/SettingsModal';
import { HelpModal } from './components/HelpModal';
import { SupportModal } from './components/SupportModal';
import { EASYLM_GUIDE_PROMPT_CONTEXT } from './data/help_guide';
import { detectDevice, DeviceInfo } from './engine/device';
import { createWelcomeMessage } from './data/welcome';
import { CORE_INTERACTION_PROTOCOLS } from './data/protocols';

export const App: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionIdState] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth > 768 : false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);

  // Model & Personality Configuration
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL_ID);
  const [selectedPersonality, setSelectedPersonality] = useState<string>('friendly');
  const [personalityDropdownOpen, setPersonalityDropdownOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [toolsEnabled, setToolsEnabled] = useState<boolean>(true);
  const [extendedThinking, setExtendedThinking] = useState<boolean>(false);
  const [temperature, setTemperature] = useState<number>(0.3);
  const [searxngUrl, setSearxngUrl] = useState<string>(() => localStorage.getItem('easylm_searxng_url') || '');
  const [showWelcomeMessage, setShowWelcomeMessage] = useState<boolean>(() => {
    const saved = localStorage.getItem('easylm_show_welcome');
    return saved === null ? true : saved === 'true';
  });

  const handleToggleWelcomeMessage = () => {
    const next = !showWelcomeMessage;
    setShowWelcomeMessage(next);
    localStorage.setItem('easylm_show_welcome', String(next));
  };

  // Runtime State
  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [modelProgress, setModelProgress] = useState<ProgressStatus | null>(null);
  const [webGpuAvailable, setWebGpuAvailable] = useState<boolean>(true);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const personalityDropdownRef = useRef<HTMLDivElement>(null);

  // Close personality dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (personalityDropdownRef.current && !personalityDropdownRef.current.contains(e.target as Node)) {
        setPersonalityDropdownOpen(false);
      }
    };
    if (personalityDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [personalityDropdownOpen]);

  // Save SearXNG URL to localStorage
  const handleUpdateSearxng = (url: string) => {
    setSearxngUrl(url);
    localStorage.setItem('easylm_searxng_url', url);
  };

  // 1. Initial boot: detect device hardware & load sessions
  useEffect(() => {
    detectDevice().then(dev => {
      setDeviceInfo(dev);
      setWebGpuAvailable(dev.hasWebGPU);
      if (dev.isMobile && dev.recommendedModel) {
        setSelectedModel(dev.recommendedModel);
      }
    });

    const loaded = loadAllSessions();
    if (loaded.length > 0) {
      setSessions(loaded);
      const savedActive = getActiveSessionId();
      if (savedActive && loaded.some(s => s.id === savedActive)) {
        setActiveSessionIdState(savedActive);
      } else {
        setActiveSessionIdState(loaded[0].id);
      }
    } else {
      const initial = createNewSession('Welcome to EasyLM');
      const shouldWelcome = localStorage.getItem('easylm_show_welcome');
      if (shouldWelcome === null || shouldWelcome === 'true') {
        initial.messages.push(createWelcomeMessage());
      }
      setSessions([initial]);
      setActiveSessionIdState(initial.id);
      saveAllSessions([initial]);
    }
  }, []);

  // Sync active session ID
  useEffect(() => {
    if (activeSessionId) {
      setActiveSessionId(activeSessionId);
    }
  }, [activeSessionId]);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Create New Session
  const handleNewSession = () => {
    const newSess = createNewSession('New Conversation');
    if (showWelcomeMessage) {
      newSess.messages.push(createWelcomeMessage());
    }
    const updated = [newSess, ...sessions];
    setSessions(updated);
    setActiveSessionIdState(newSess.id);
    saveAllSessions(updated);
  };

  // Global Keyboard shortcuts (Ctrl+K or Ctrl+N for new session)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'n')) {
        e.preventDefault();
        handleNewSession();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sessions]);

  useEffect(() => {
    scrollToBottom();
  }, [sessions, activeSessionId, isGenerating]);

  // Active Session Lookup
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  // Delete Session
  const handleDeleteSession = (id: string) => {
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    saveAllSessions(updated);
    if (activeSessionId === id) {
      if (updated.length > 0) {
        setActiveSessionIdState(updated[0].id);
      } else {
        handleNewSession();
      }
    }
  };

  // Reload Sessions after Restore/Wipe
  const handleSessionsReload = () => {
    const loaded = loadAllSessions();
    setSessions(loaded);
    if (loaded.length > 0) {
      setActiveSessionIdState(loaded[0].id);
    } else {
      handleNewSession();
    }
  };

  // Helper to extract clean display text from streamed tokens (hiding raw tool_call tags)
  const cleanDisplayContent = (text: string): string => {
    return text.replace(/<tool_call>[\s\S]*?(?:<\/tool_call>|$)/gi, '').trim();
  };

  // Send Prompt & Run Inference Loop
  const handleSendMessage = async () => {
    const trimmed = inputPrompt.trim();
    if (!trimmed || isGenerating || !activeSession) return;

    setInputPrompt('');
    const userMsgId = 'msg-' + Date.now();
    const newUserMsg: Message = {
      id: userMsgId,
      role: 'user',
      content: trimmed,
      timestamp: Date.now()
    };

    // Update active session with user message
    const updatedMessages = [...activeSession.messages, newUserMsg];
    const sessionTitle = activeSession.messages.length <= 1 
      ? trimmed.slice(0, 30) + (trimmed.length > 30 ? '...' : '')
      : activeSession.title;

    const updatedSession: Session = {
      ...activeSession,
      title: sessionTitle,
      updatedAt: Date.now(),
      messages: updatedMessages
    };

    const newSessionsList = sessions.map(s => s.id === activeSession.id ? updatedSession : s);
    setSessions(newSessionsList);
    saveAllSessions(newSessionsList);

    setIsGenerating(true);

    // Build system mandate based on Personality
    const personality = PERSONALITIES.find(p => p.id === selectedPersonality) || PERSONALITIES[0];
    let systemInstruction = personality.systemPrompt;
    if (selectedPersonality === 'custom' && customPrompt) {
      systemInstruction = customPrompt;
    }

    // Always inject core interaction protocols (Professional referral triage, Depression/Kaizen, Acute Crisis)
    systemInstruction += '\n\n' + CORE_INTERACTION_PROTOCOLS;

    // In-chat help detection: if prompt asks about help, features, or how EasyLM works
    const isHelpAsk = /^(?:help|\?|guide|what can you do|how do you work|who are you|explain yourself|about you)/i.test(trimmed) || trimmed.toLowerCase().includes('how do you work');
    if (isHelpAsk) {
      systemInstruction += '\n\n' + EASYLM_GUIDE_PROMPT_CONTEXT + '\n\nINSTRUCTION: The user is asking about how EasyLM works or asking for help. Explain who you are, how you run locally, your in-app tools, privacy, and prompting advice in a warm, friendly, and accessible manner.';
    }

    // Extended thinking instruction injection if enabled
    if (extendedThinking) {
      systemInstruction += '\n\n[EXTENDED THINKING PROTOCOL]\nInspect assumptions, evaluate evidence, and explore edge cases step-by-step inside <think>...</think> tags before delivering your final workpiece.';
    }

    if (toolsEnabled) {
      systemInstruction += '\n' + SYSTEM_TOOLS_PROMPT;
    }

    const executedTools: ToolExecution[] = [];

    // Pre-flight heuristic: Detect direct math, unit, URL fetch, literary chapters, quotes, or search requests
    const mathMatch = trimmed.match(/^(?:what is|calculate|compute|eval)\s+([0-9+\-*/().\s^sqrtpowpi]+)$/i);
    const unitMatch = trimmed.match(/^(?:convert\s+)?([\d.]+\s*[a-zA-Z]+\s*(?:to|in)\s*[a-zA-Z]+)$/i);
    const directSearchMatch = trimmed.match(/^(?:search|search for|google|web search)\s*:\s*(.+)$/i);
    const urlMatch = trimmed.match(/(https?:\/\/[^\s]+)/i);
    const directFetchMatch = trimmed.match(/^(?:fetch|read|browse|summarize|inspect)\s+(https?:\/\/[^\s]+)$/i);
    const chapterMatch = trimmed.match(/(?:summarize|read|tell me about|what happens in|overview of)?\s*(?:the\s+)?(?:chapter|act|canto)\s*(\d+|[ivxlcdm]+)\s+(?:of|in)\s+(.+)/i)
      || trimmed.match(/(?:summarize|read|tell me about|what happens in|overview of)?\s*(.+?)\s+chapter\s*(\d+|[ivxlcdm]+)/i);
    const quoteMatch = trimmed.match(/(?:famous\s+)?(?:quotes?|quotations?|sayings?)\s+(?:from|by|in)\s+(.+)/i);

    if (toolsEnabled && mathMatch) {
      const toolRes = await dispatchTool('calc', mathMatch[1]);
      executedTools.push(toolRes);
    } else if (toolsEnabled && unitMatch) {
      const toolRes = await dispatchTool('units', unitMatch[1]);
      executedTools.push(toolRes);
    } else if (toolsEnabled && directFetchMatch) {
      const toolRes = await dispatchTool('web_fetch', directFetchMatch[1]);
      executedTools.push(toolRes);
    } else if (toolsEnabled && directSearchMatch) {
      const toolRes = await dispatchTool('web_search', directSearchMatch[1], searxngUrl);
      executedTools.push(toolRes);
    } else if (toolsEnabled && urlMatch && (trimmed.toLowerCase().includes('read') || trimmed.toLowerCase().includes('summarize') || trimmed === urlMatch[1])) {
      const toolRes = await dispatchTool('web_fetch', urlMatch[1]);
      executedTools.push(toolRes);
    } else if (toolsEnabled && chapterMatch) {
      const chNum = chapterMatch[1] && /^\d+|[ivxlcdm]+$/i.test(chapterMatch[1]) ? chapterMatch[1] : chapterMatch[2];
      const rawBook = (chapterMatch[1] === chNum ? chapterMatch[2] : chapterMatch[1]).trim();
      const cleanBook = rawBook.replace(/^(?:the\s+)?book\s+/i, '');
      const toolRes = await dispatchTool('web_search', `${cleanBook} Chapter ${chNum}`, searxngUrl);
      executedTools.push(toolRes);
    } else if (toolsEnabled && quoteMatch) {
      const toolRes = await dispatchTool('web_search', `quotes from ${quoteMatch[1].trim()}`, searxngUrl);
      executedTools.push(toolRes);
    }

    // Prepare assistant response message placeholder
    const assistantMsgId = 'asst-' + Date.now();
    const assistantPlaceholder: Message = {
      id: assistantMsgId,
      role: 'assistant',
      content: executedTools.length > 0 ? `I've calculated that using in-app tools:\n\n${executedTools[0].result}` : '',
      toolsUsed: executedTools,
      timestamp: Date.now()
    };

    // If deterministic math/unit tool directly solved it, finish immediately without spinning up full LLM
    if (executedTools.length > 0 && !directSearchMatch && !urlMatch && !directFetchMatch && !chapterMatch && !quoteMatch && !extendedThinking) {
      const finalSess = {
        ...updatedSession,
        messages: [...updatedMessages, assistantPlaceholder]
      };
      const finalSessionsList = sessions.map(s => s.id === activeSession.id ? finalSess : s);
      setSessions(finalSessionsList);
      saveAllSessions(finalSessionsList);
      setIsGenerating(false);
      return;
    }

    // Otherwise, stream through WebLLM
    try {
      const convoMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: 'system', content: systemInstruction }
      ];

      // Inject recent conversation history (last 8 turns)
      const historySlice = updatedMessages.slice(-8);
      for (const m of historySlice) {
        convoMessages.push({
          role: m.role as any,
          content: m.content
        });
      }

      // If pre-flight tools (e.g. web_fetch or direct search) ran, inject context into the active turn
      if (executedTools.length > 0) {
        const lastMsg = convoMessages[convoMessages.length - 1];
        if (lastMsg && lastMsg.role === 'user') {
          const toolData = executedTools.map(t => `[${t.tool.toUpperCase()} RESULT for "${t.query}"]:\n${t.result}`).join('\n\n');
          lastMsg.content = `${toolData}\n\nUser prompt: ${lastMsg.content}`;
        }
      }

      let currentStreamed = '';
      const startTime = Date.now();

      // Start initial stream
      const result = await streamChatCompletion(
        convoMessages,
        selectedModel,
        temperature,
        2048,
        (delta) => {
          currentStreamed += delta;
          // In-flight token update - strip raw tool call tags from visible text!
          setSessions(prev => prev.map(s => {
            if (s.id !== activeSession.id) return s;
            const msgs = [...updatedMessages];
            msgs.push({
              ...assistantPlaceholder,
              content: cleanDisplayContent(currentStreamed)
            });
            return { ...s, messages: msgs };
          }));
        },
        (prog) => setModelProgress(prog)
      );

      // Check if model emitted a tool call!
      const rawOutput = result.fullText;
      const toolMatch = rawOutput.match(/<tool_call>([\s\S]*?)(?:<\/tool_call>|$)/i);

      if (toolMatch && toolsEnabled) {
        let callName = '';
        let callQuery = '';
        try {
          const parsed = JSON.parse(toolMatch[1].trim());
          callName = parsed.name || '';
          if (parsed.query) {
            callQuery = String(parsed.query);
          } else if (parsed.location) {
            callQuery = String(parsed.location);
          } else if (parsed.word) {
            callQuery = String(parsed.word);
          } else if (parsed.topic) {
            callQuery = String(parsed.topic);
          } else if (parsed.expression || parsed.input) {
            callQuery = String(parsed.expression || parsed.input);
          } else if (parsed.amount || parsed.from || parsed.to) {
            callQuery = `${parsed.amount || ''} ${parsed.from || ''} to ${parsed.to || ''}`.trim();
          }
        } catch {
          const nMatch = toolMatch[1].match(/"name"\s*:\s*"([^"]+)"/);
          const qMatch = toolMatch[1].match(/"(?:query|expression|input|location|word|topic)"\s*:\s*"([^"]+)"/);
          if (nMatch) callName = nMatch[1];
          if (qMatch) callQuery = qMatch[1];
        }

        if (callName) {
          // Execute the intercepted tool!
          const toolExecution = await dispatchTool(callName, callQuery || trimmed, searxngUrl);
          executedTools.push(toolExecution);

          // Update UI with the tool badge immediately
          setSessions(prev => prev.map(s => {
            if (s.id !== activeSession.id) return s;
            const msgs = [...updatedMessages];
            msgs.push({
              ...assistantPlaceholder,
              content: 'Synthesizing verified results...',
              toolsUsed: executedTools
            });
            return { ...s, messages: msgs };
          }));

          // Construct follow-up turn to let the model synthesize the answer
          const toolFollowUpMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
            ...convoMessages,
            { role: 'assistant', content: rawOutput },
            {
              role: 'user',
              content: `[TOOL EXECUTION RESULT FOR ${toolExecution.tool}]:\n${toolExecution.result}\n\nPlease synthesize this verified data into a direct, friendly, and complete answer for the user.`
            }
          ];

          let followUpStreamed = '';
          const finalResult = await streamChatCompletion(
            toolFollowUpMessages,
            selectedModel,
            temperature,
            2048,
            (delta) => {
              followUpStreamed += delta;
              setSessions(prev => prev.map(s => {
                if (s.id !== activeSession.id) return s;
                const msgs = [...updatedMessages];
                msgs.push({
                  ...assistantPlaceholder,
                  content: cleanDisplayContent(followUpStreamed),
                  toolsUsed: executedTools
                });
                return { ...s, messages: msgs };
              }));
            },
            (prog) => setModelProgress(prog)
          );

          const finalAssistantMsg: Message = {
            id: assistantMsgId,
            role: 'assistant',
            content: finalResult.fullText || 'Results retrieved successfully.',
            thinking: finalResult.thinking || result.thinking,
            thoughtDurationMs: Date.now() - startTime,
            toolsUsed: executedTools,
            timestamp: Date.now()
          };

          const finalSessionObj = {
            ...updatedSession,
            messages: [...updatedMessages, finalAssistantMsg]
          };

          setSessions(prev => prev.map(s => s.id === activeSession.id ? finalSessionObj : s));
          saveAllSessions(sessions.map(s => s.id === activeSession.id ? finalSessionObj : s));
          return;
        }
      }

      // If no tool call was emitted, commit the clean message
      const finalAssistantMsg: Message = {
        id: assistantMsgId,
        role: 'assistant',
        content: cleanDisplayContent(result.fullText) || result.fullText,
        thinking: result.thinking,
        thoughtDurationMs: Date.now() - startTime,
        toolsUsed: executedTools,
        timestamp: Date.now()
      };

      const finalSessionObj = {
        ...updatedSession,
        messages: [...updatedMessages, finalAssistantMsg]
      };

      setSessions(prev => prev.map(s => s.id === activeSession.id ? finalSessionObj : s));
      saveAllSessions(sessions.map(s => s.id === activeSession.id ? finalSessionObj : s));
    } catch (err: any) {
      console.error('Inference error:', err);
      const errMsg: Message = {
        id: assistantMsgId,
        role: 'assistant',
        content: `**Notice:** ${err?.message || String(err)}\n\n*Ensure your browser supports WebGPU (Chrome/Edge 113+) and hardware acceleration is turned on.*`,
        timestamp: Date.now()
      };
      setSessions(prev => prev.map(s => s.id === activeSession.id ? { ...s, messages: [...updatedMessages, errMsg] } : s));
    } finally {
      setIsGenerating(false);
      setModelProgress(null);
    }
  };

  // Drag & Drop File Handling
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileIngest(files[0]);
    }
  };

  const handleFileIngest = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        setInputPrompt(prev => (prev ? prev + '\n\n' : '') + `[ATTACHED DOCUMENT: ${file.name}]\n${text.slice(0, 8000)}`);
      }
    };
    reader.readAsText(file);
  };

  const currentModelLabel = AVAILABLE_MODELS.find(m => m.id === selectedModel)?.label || 'Qwen 2.5 3B';
  const currentPersonality = PERSONALITIES.find(p => p.id === selectedPersonality) || PERSONALITIES[0];

  return (
    <div 
      style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: '#000000' }}
      onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
      onDragLeave={() => setIsDraggingFile(false)}
      onDrop={handleDrop}
    >
      {/* File Drop Visual Overlay */}
      {isDraggingFile && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(139, 92, 246, 0.25)',
          border: '3px dashed #8b5cf6',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontFamily: 'var(--font-mono)',
          fontSize: '1.5rem',
          backdropFilter: 'blur(4px)'
        }}>
          Drop text, code, or markdown file to attach
        </div>
      )}

      {/* Left Sidebar */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={setActiveSessionIdState}
        onNewSession={handleNewSession}
        onDeleteSession={handleDeleteSession}
        onSessionsReload={handleSessionsReload}
        isOpen={sidebarOpen}
        onToggleOpen={() => setSidebarOpen(!sidebarOpen)}
        onOpenSupport={() => setSupportOpen(true)}
      />

      {/* Main Chat Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>
        {/* Header HUD */}
        <header
          className="header-hud"
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'nowrap',
            width: '100%',
            padding: '0.75rem 1.25rem',
            backgroundColor: '#07070b',
            borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
            zIndex: 30
          }}
        >
          {/* Left: Brand & Model */}
          <div className="header-brand-wrap" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.65rem', flexShrink: 0, marginLeft: sidebarOpen ? '0' : '3.5rem' }}>
            <span className="header-title-text" style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', fontSize: '0.95rem', letterSpacing: '0.04em', color: '#ffffff' }}>
              EasyLM
            </span>
            <span className="model-pill-badge" style={{
              fontSize: '0.72rem',
              fontFamily: 'var(--font-mono)',
              padding: '0.15rem 0.5rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(139, 92, 246, 0.15)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              color: '#c4b5fd'
            }}>
              {currentModelLabel.split('(')[0].trim()}
            </span>
          </div>

          {/* Right: Controls & Badges */}
          <div className="header-actions" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem', flexShrink: 0, marginLeft: 'auto' }}>
            {/* Extended Thinking Toggle Button */}
            <button
              onClick={() => setExtendedThinking(!extendedThinking)}
              className="btn-pill"
              style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.65rem',
                gap: '0.35rem',
                backgroundColor: extendedThinking ? 'rgba(139, 92, 246, 0.25)' : '#111118',
                borderColor: extendedThinking ? '#8b5cf6' : 'rgba(139, 92, 246, 0.25)',
                color: extendedThinking ? '#ffffff' : '#71717a'
              }}
              title={extendedThinking ? 'Extended thinking active (click to turn OFF)' : 'Extended thinking disabled (click to turn ON)'}
            >
              <span>🧠</span>
              <span><span className="hide-on-mobile">Think </span>{extendedThinking ? 'ON' : 'OFF'}</span>
            </button>

            {/* Tools Indicator */}
            {toolsEnabled && (
              <span 
                style={{ fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: '#10b981', padding: '0.2rem 0.45rem', background: 'rgba(16,185,129,0.1)', borderRadius: '9999px', border: '1px solid rgba(16,185,129,0.3)' }}
                title="In-app tools (Math, Units, Search, Web Reader, Weather, FX) active"
              >
                <span>⚡</span>
                <span className="hide-on-mobile"> Hands</span>
              </span>
            )}

            {/* Personality Dropdown Menu */}
            <div ref={personalityDropdownRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setPersonalityDropdownOpen(!personalityDropdownOpen)}
                className="btn-pill"
                style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.65rem',
                  gap: '0.35rem',
                  backgroundColor: personalityDropdownOpen ? 'rgba(139, 92, 246, 0.2)' : '#111118',
                  borderColor: personalityDropdownOpen ? '#8b5cf6' : 'rgba(139, 92, 246, 0.3)',
                  color: '#ffffff'
                }}
                title="Select AI Personality"
              >
                <span>{currentPersonality.name}</span>
                <span style={{
                  fontSize: '0.6rem',
                  color: '#a78bfa',
                  transition: 'transform 0.15s ease',
                  transform: personalityDropdownOpen ? 'rotate(180deg)' : 'none'
                }}>
                  ▼
                </span>
              </button>

              {personalityDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '240px',
                  backgroundColor: '#0c0c12',
                  border: '1px solid rgba(139, 92, 246, 0.35)',
                  borderRadius: '12px',
                  padding: '0.4rem',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.8)',
                  zIndex: 100,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}>
                  <div style={{
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-mono)',
                    color: '#71717a',
                    padding: '0.25rem 0.5rem 0.15rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    Select Personality
                  </div>
                  {PERSONALITIES.map(p => {
                    const isSelected = selectedPersonality === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedPersonality(p.id);
                          setPersonalityDropdownOpen(false);
                          if (p.id === 'custom' && !customPrompt) {
                            setSettingsOpen(true);
                          }
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.5rem 0.65rem',
                          borderRadius: '8px',
                          border: isSelected ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
                          backgroundColor: isSelected ? 'rgba(139, 92, 246, 0.18)' : 'transparent',
                          color: isSelected ? '#ffffff' : '#d4d4d8',
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontFamily: 'var(--font-mono)',
                          transition: 'background-color 0.15s'
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.08)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: isSelected ? 700 : 500 }}>
                            {p.name}
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#71717a', marginTop: '0.1rem', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {p.description}
                          </div>
                        </div>
                        {isSelected && (
                          <span style={{ color: '#8b5cf6', fontSize: '0.9rem', fontWeight: 700, marginLeft: '0.5rem' }}>
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Help Guide Button */}
            <button
              onClick={() => setHelpOpen(true)}
              className="btn-pill"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem', gap: '0.3rem', borderColor: 'rgba(139, 92, 246, 0.4)', color: '#c4b5fd' }}
              title="Open EasyLM Guide & AI Primer"
            >
              <span>?</span>
              <span className="hide-on-mobile"> Help</span>
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setSettingsOpen(true)}
              className="btn-pill"
              style={{ padding: '0.25rem 0.6rem' }}
              title="Configure model, personalities, SearXNG, and tools"
            >
              ⚙
            </button>
          </div>
        </header>

        {/* WebGPU Device Status Notification Banner if unsupported */}
        {!webGpuAvailable && (
          <div style={{
            backgroundColor: '#1c1307',
            borderBottom: '1px solid #d97706',
            color: '#fbbf24',
            padding: '0.65rem 1.25rem',
            fontSize: '0.78rem',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem'
          }}>
            <span>
              {deviceInfo?.isIOS 
                ? '⚠️ iOS WebGPU: Turn on in Settings → Safari → Advanced → Feature Flags → WebGPU, then refresh.'
                : '⚠️ WebGPU not detected: Use Chrome, Edge (113+), or Android Chrome with hardware acceleration for local AI.'}
            </span>
          </div>
        )}

        {/* Progress HUD bar during model download / warmup */}
        {modelProgress && (
          <div style={{
            backgroundColor: '#12121c',
            borderBottom: '1px solid #8b5cf6',
            padding: '0.5rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: '#c4b5fd'
          }}>
            <span>{modelProgress.text}</span>
            <div style={{ width: '120px', height: '6px', background: '#272733', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.round((modelProgress.progress || 0) * 100)}%`, height: '100%', background: '#8b5cf6', transition: 'width 0.2s' }} />
            </div>
          </div>
        )}

        {/* Messages Stream */}
        <div className="messages-scroll-area" style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ maxWidth: '820px', width: '100%', margin: '0 auto' }}>
            {activeSession && activeSession.messages.map((m) => (
              <MessageItem key={m.id} message={m} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Floating Rounded Prompt Bar */}
        <div className="prompt-wrapper" style={{ padding: '0.75rem 2rem 1.5rem', display: 'flex', justifyContent: 'center', zIndex: 20 }}>
          <div className="floating-prompt" style={{ maxWidth: '820px', width: '100%', padding: '0.5rem 0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {/* Attachment Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#71717a',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                  padding: '0.3rem'
                }}
                title="Attach text, code, or markdown document"
              >
                📎
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.json,.csv,.py,.ts,.js,.rs"
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileIngest(e.target.files[0]);
                  }
                }}
              />

              {/* Text Input */}
              <textarea
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Ask anything, do math, paste a link, or drop a document..."
                rows={1}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.95rem',
                  resize: 'none',
                  maxHeight: '120px',
                  padding: '0.5rem 0'
                }}
              />

              {/* Send Button */}
              <button
                onClick={handleSendMessage}
                disabled={isGenerating || !inputPrompt.trim()}
                className="btn-pill btn-pill-primary"
                style={{
                  padding: '0.5rem 1rem',
                  opacity: (isGenerating || !inputPrompt.trim()) ? 0.4 : 1,
                  cursor: (isGenerating || !inputPrompt.trim()) ? 'not-allowed' : 'pointer'
                }}
                title="Send message (Enter)"
              >
                {isGenerating ? '✦' : '➤'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Help Modal */}
      <HelpModal
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
      />

      {/* Support Modal */}
      <SupportModal
        isOpen={supportOpen}
        onClose={() => setSupportOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
        selectedPreset={selectedPersonality}
        onSelectPreset={setSelectedPersonality}
        customPrompt={customPrompt}
        onChangeCustomPrompt={setCustomPrompt}
        toolsEnabled={toolsEnabled}
        onToggleTools={() => setToolsEnabled(!toolsEnabled)}
        extendedThinking={extendedThinking}
        onToggleExtendedThinking={() => setExtendedThinking(!extendedThinking)}
        temperature={temperature}
        onChangeTemperature={setTemperature}
        searxngUrl={searxngUrl}
        onChangeSearxngUrl={handleUpdateSearxng}
        showWelcomeMessage={showWelcomeMessage}
        onToggleWelcomeMessage={handleToggleWelcomeMessage}
      />
    </div>
  );
};
