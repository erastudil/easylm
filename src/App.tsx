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
  stopGeneration,
  ProgressStatus,
  AVAILABLE_MODELS
} from './engine/webllm_spindle';
import { dispatchTool, SYSTEM_TOOLS_PROMPT } from './engine/tools';
import { Sidebar } from './components/Sidebar';
import { MessageItem } from './components/MessageItem';
import { SettingsModal } from './components/SettingsModal';
import { PersonalityModal } from './components/PersonalityModal';
import { PERSONALITIES } from './data/personalities';
import { HelpModal } from './components/HelpModal';
import { SupportModal } from './components/SupportModal';
import { FeedbackModal } from './components/FeedbackModal';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { EASYLM_GUIDE_PROMPT_CONTEXT } from './data/help_guide';
import { detectDevice, DeviceInfo } from './engine/device';
import { createWelcomeMessage, WELCOME_TOOLBOX_CONTENT } from './data/welcome';
import { CORE_INTERACTION_PROTOCOLS } from './data/protocols';
import {
  UserProfile,
  AttachedDoc,
  getActiveProfile,
  getProfileMemories,
  detectPII,
  hasParentalPin
} from './engine/family';
import { ParentalModal } from './components/ParentalModal';
import { ProfileModal } from './components/ProfileModal';
import { AttachmentBar } from './components/AttachmentBar';

export const App: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionIdState] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth > 768 : false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [googleDriveModalOpen, setGoogleDriveModalOpen] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);

  // Family Mode, Profiles, Parental Controls, and Sovereign Memory
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(() => getActiveProfile());
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [parentalModalOpen, setParentalModalOpen] = useState(false);
  const [parentalModalMode, setParentalModalMode] = useState<'verify' | 'setup'>('verify');
  const [pendingPinAction, setPendingPinAction] = useState<(() => void) | null>(null);
  const [piiAlert, setPiiAlert] = useState<string | null>(null);
  const [attachedDoc, setAttachedDoc] = useState<AttachedDoc | null>(null);

  // Model & Personality Configuration
  const [selectedModel, setSelectedModel] = useState<string>(DEFAULT_MODEL_ID);
  const [selectedPersonality, setSelectedPersonality] = useState<string>(() => {
    const prof = getActiveProfile();
    return prof.personalityId || 'friendly';
  });
  const [personalityModalOpen, setPersonalityModalOpen] = useState(false);
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

  const handleRequestPinVerify = (onSuccess: () => void) => {
    setPendingPinAction(() => onSuccess);
    setParentalModalMode('verify');
    setParentalModalOpen(true);
  };

  const handleOpenPinSetup = () => {
    setParentalModalMode('setup');
    setParentalModalOpen(true);
  };

  const handlePinSuccess = () => {
    setParentalModalOpen(false);
    if (pendingPinAction) {
      pendingPinAction();
      setPendingPinAction(null);
    }
  };

  const handleProfileChanged = (newProfile: UserProfile) => {
    setCurrentProfile(newProfile);
    if (newProfile.personalityId) {
      setSelectedPersonality(newProfile.personalityId);
    }
  };

  // Runtime State
  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [modelProgress, setModelProgress] = useState<ProgressStatus | null>(null);
  const [webGpuAvailable, setWebGpuAvailable] = useState<boolean>(true);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      // Refresh welcome messages with latest formatted copy
      const refreshed = loaded.map(sess => ({
        ...sess,
        messages: sess.messages.map(m => {
          if (m.id.startsWith('msg-welcome-') || (m.role === 'assistant' && m.content.startsWith('Welcome to **EasyLM**'))) {
            return { ...m, content: WELCOME_TOOLBOX_CONTENT };
          }
          return m;
        })
      }));
      setSessions(refreshed);
      saveAllSessions(refreshed);
      const savedActive = getActiveSessionId();
      if (savedActive && refreshed.some(s => s.id === savedActive)) {
        setActiveSessionIdState(savedActive);
      } else {
        setActiveSessionIdState(refreshed[0].id);
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

  // Stop active inference
  const handleStopGeneration = async () => {
    await stopGeneration();
    setIsGenerating(false);
    setModelProgress(null);
  };

  // Global Keyboard shortcuts (Ctrl+K or Ctrl+N for new session, Esc to stop generation)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'n')) {
        e.preventDefault();
        handleNewSession();
      } else if (e.key === 'Escape' && isGenerating) {
        e.preventDefault();
        handleStopGeneration();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sessions, isGenerating]);

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
    return text
      .replace(/<tool_call>[\s\S]*?(?:<\/tool_call>|$)/gi, '')
      .replace(/```(?:tool_call|json)\s*\{[\s\S]*?"(?:name|function|tool)"[\s\S]*?\}\s*```/gi, '')
      .replace(/<function=[a-zA-Z0-9_]+>[\s\S]*?(?:<\/function>|$)/gi, '')
      .trim();
  };

  // Helper to cleanly separate in-flight thinking traces from display response during live generation
  const parseStreamedTokens = (raw: string): { displayContent: string; inFlightThinking?: string } => {
    let inFlightThinking: string | undefined = undefined;
    let text = raw;

    if (raw.includes('<think>')) {
      const closedMatch = raw.match(/<think>([\s\S]*?)<\/think>/i);
      if (closedMatch) {
        inFlightThinking = closedMatch[1].trim();
        text = raw.replace(/<think>[\s\S]*?<\/think>/i, '');
      } else {
        const openMatch = raw.match(/<think>([\s\S]*)$/i);
        if (openMatch) {
          inFlightThinking = openMatch[1].trim();
          text = ''; // Actively reasoning; suppress raw think tags from main bubble
        }
      }
    }

    return {
      displayContent: cleanDisplayContent(text),
      inFlightThinking
    };
  };

  // Send Prompt & Run Inference Loop
  const handleSendMessage = async (overridePrompt?: string | React.MouseEvent) => {
    const rawInput = typeof overridePrompt === 'string' ? overridePrompt : inputPrompt;
    const trimmed = rawInput.trim();
    if (!trimmed || isGenerating || !activeSession) return;

    // Internet Safety Sentinel: check for personal identifiable info (PII)
    const piiCheck = detectPII(trimmed);
    if (piiCheck.hasPII) {
      setPiiAlert(`🛡️ Internet Safety Sentinel: Notice: You included a ${piiCheck.detectedTypes.join(', ')}. EasyLM runs 100% locally on your computer, but remember to never share private details on public websites!`);
      setTimeout(() => setPiiAlert(null), 8000);
    }

    setInputPrompt('');
    const userMsgId = 'msg-' + Date.now();

    let userDisplayContent = trimmed;
    let docContext = '';
    if (attachedDoc) {
      docContext = `[ATTACHED DOCUMENT: ${attachedDoc.name} (${Math.round(attachedDoc.size / 1024)} KB)]:\n${attachedDoc.content.slice(0, 14000)}\n\n`;
      userDisplayContent = `📄 [Attached: ${attachedDoc.name}]\n\n${trimmed}`;
    }

    const newUserMsg: Message = {
      id: userMsgId,
      role: 'user',
      content: userDisplayContent,
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

    // Always inject core interaction protocols (Professional triage, Depression/Kaizen, Acute Crisis, Kids & Family)
    systemInstruction += '\n\n' + CORE_INTERACTION_PROTOCOLS;

    // Sovereign Memory Vault injection
    const profileMemories = getProfileMemories(currentProfile.id);
    if (profileMemories.length > 0) {
      systemInstruction += '\n\n[USER SOVEREIGN MEMORY & NOTEBOOK]:\n' + profileMemories.map(m => '- ' + m.text).join('\n');
    }

    // Kid Safe / Socratic tutor mandate
    if (currentProfile.role === 'kid' || currentProfile.socraticTutorEnabled) {
      systemInstruction += '\n\n[KID SAFE & SOCRATIC TUTOR MANDATE]:\nGuide the student step-by-step with inquiry, hints, and questions. Never hand over direct solutions to homework or tests. Keep tone warm, patient, and encouraging.';
    }

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

    // Pre-flight heuristic: Detect direct math, unit, URL fetch, search, repository queries, quotes, or chapters
    const mathMatch = trimmed.match(/^(?:what is|calculate|compute|eval)\s+([0-9+\-*/().\s^sqrtpowpi]+)$/i);
    const unitMatch = trimmed.match(/^(?:convert\s+)?([\d.]+\s*[a-zA-Z]+\s*(?:to|in)\s*[a-zA-Z]+)$/i);
    const directSearchMatch = trimmed.match(/^(?:search|search for|google|web search)\s*:\s*(.+)$/i);
    const urlMatch = trimmed.match(/(https?:\/\/[^\s]+)/i);
    const directFetchMatch = trimmed.match(/^(?:fetch|read|browse|summarize|inspect)\s+(https?:\/\/[^\s]+)$/i);

    // Direct repository trigger: wikiquote, wikisource, gutenberg
    const repoMatch = trimmed.match(/\b(?:check|search|look up|find on|on|from)?\s*(wikiquote|wikisource|gutenberg)\b(?:\s+(?:for|about|on|in))?\s*(.+)?/i);

    // Universal literary quotes query (e.g. "What are some quotes from...", "quotes in Hamlet", "lines by Dumas")
    const quoteMatch = !repoMatch && trimmed.match(/\b(?:quotes?|quotations?|sayings?|lines?)\b\s+(?:from|by|in|of|about)\s+(.+)/i);

    // Universal chapter query (e.g. "Summarize chapter 5 of...", "The Count of Monte Cristo chapter 1", "What happens in act 1 scene 1")
    const chapterMatch = !repoMatch && (
      trimmed.match(/\b(?:chapter|act|canto|volume)\s*(\d+|[ivxlcdm]+)\b\s+(?:of|in|from)\s+(.+)/i)
      || trimmed.match(/(.+?)\s+\b(?:chapter|act|canto|volume)\s*(\d+|[ivxlcdm]+)\b/i)
    );

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
    } else if (toolsEnabled && repoMatch) {
      const target = (repoMatch[2] || trimmed)
        .replace(/^(?:for|about|on|in)\s+/i, '')
        .replace(/[?.!]+$/, '')
        .trim();
      const toolRes = await dispatchTool('web_search', target, searxngUrl);
      executedTools.push(toolRes);
    } else if (toolsEnabled && quoteMatch) {
      const cleanTarget = quoteMatch[1]
        .replace(/^(?:the\s+)?(?:book|novel|play)\s+/i, '')
        .replace(/[?.!]+$/, '')
        .trim();
      const toolRes = await dispatchTool('web_search', `quotes from ${cleanTarget}`, searxngUrl);
      executedTools.push(toolRes);
    } else if (toolsEnabled && chapterMatch) {
      const chNum = /^\d+|[ivxlcdm]+$/i.test(chapterMatch[1]) ? chapterMatch[1] : chapterMatch[2];
      const rawBook = (chapterMatch[1] === chNum ? chapterMatch[2] : chapterMatch[1])
        .replace(/^(?:summarize|read|tell me about|what happens in|overview of)\s+/i, '')
        .replace(/\s+(?:summary|overview)$/i, '')
        .replace(/[?.!]+$/, '')
        .trim();
      const toolRes = await dispatchTool('web_search', `${rawBook} Chapter ${chNum}`, searxngUrl);
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
    if (executedTools.length > 0 && !directSearchMatch && !urlMatch && !directFetchMatch && !repoMatch && !chapterMatch && !quoteMatch && !extendedThinking) {
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

      // If attached document exists, inject its content into the active turn
      if (docContext) {
        const lastMsg = convoMessages[convoMessages.length - 1];
        if (lastMsg && lastMsg.role === 'user') {
          lastMsg.content = `${docContext}User prompt: ${trimmed}`;
        }
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
          const { displayContent, inFlightThinking } = parseStreamedTokens(currentStreamed);
          // In-flight token update - clean display text and live thinking trace
          setSessions(prev => prev.map(s => {
            if (s.id !== activeSession.id) return s;
            const msgs = [...updatedMessages];
            msgs.push({
              ...assistantPlaceholder,
              content: displayContent,
              thinking: inFlightThinking
            });
            return { ...s, messages: msgs };
          }));
        },
        (prog) => setModelProgress(prog)
      );

      // Check if model emitted a tool call in any supported format
      const rawOutput = result.fullText;
      let toolJsonStr = '';

      const xmlMatch = rawOutput.match(/<tool_call>([\s\S]*?)(?:<\/tool_call>|$)/i);
      const mdMatch = rawOutput.match(/```(?:tool_call|json)?\s*(\{[\s\S]*?"(?:name|function|tool)"[\s\S]*?\})\s*```/i);
      const fnMatch = rawOutput.match(/<function=([a-zA-Z0-9_]+)>([\s\S]*?)(?:<\/function>|$)/i);

      if (xmlMatch) {
        toolJsonStr = xmlMatch[1].trim();
      } else if (mdMatch) {
        toolJsonStr = mdMatch[1].trim();
      }

      if ((toolJsonStr || fnMatch) && toolsEnabled) {
        let callName = '';
        let callQuery = '';

        if (fnMatch) {
          callName = fnMatch[1];
          callQuery = fnMatch[2].trim();
        } else if (toolJsonStr) {
          try {
            const parsed = JSON.parse(toolJsonStr);
            callName = parsed.name || parsed.function?.name || parsed.tool || '';

            // Handle Qwen-native arguments (object or string) or standard top-level fields
            const args = parsed.arguments || parsed.parameters || parsed;
            if (typeof args === 'string') {
              try {
                const inner = JSON.parse(args);
                callQuery = inner.query || inner.location || inner.word || inner.topic || inner.expression || inner.input || inner.q || String(args);
              } catch {
                callQuery = args;
              }
            } else if (typeof args === 'object' && args !== null) {
              if (args.query) callQuery = String(args.query);
              else if (args.location) callQuery = String(args.location);
              else if (args.word) callQuery = String(args.word);
              else if (args.topic) callQuery = String(args.topic);
              else if (args.expression || args.input) callQuery = String(args.expression || args.input);
              else if (args.amount || args.from || args.to) callQuery = `${args.amount || ''} ${args.from || ''} to ${args.to || ''}`.trim();
              else if (args.q) callQuery = String(args.q);
            }
          } catch {
            const nMatch = toolJsonStr.match(/"(?:name|function|tool)"\s*:\s*"([^"]+)"/);
            const qMatch = toolJsonStr.match(/"(?:query|expression|input|location|word|topic|q)"\s*:\s*"([^"]+)"/)
              || toolJsonStr.match(/"arguments"\s*:\s*\{[^}]*"(?:query|expression|input|location|word|topic|q)"\s*:\s*"([^"]+)"/);
            if (nMatch) callName = nMatch[1];
            if (qMatch) callQuery = qMatch[1];
          }
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
              const { displayContent, inFlightThinking } = parseStreamedTokens(followUpStreamed);
              setSessions(prev => prev.map(s => {
                if (s.id !== activeSession.id) return s;
                const msgs = [...updatedMessages];
                msgs.push({
                  ...assistantPlaceholder,
                  content: displayContent,
                  thinking: inFlightThinking || result.thinking,
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
            loopProtected: finalResult.loopDetected || result.loopDetected,
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
        loopProtected: result.loopDetected,
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
        setAttachedDoc({
          name: file.name,
          size: file.size,
          content: text,
          type: file.type || 'text/plain'
        });
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
        onOpenPersonalityModal={() => setPersonalityModalOpen(true)}
        onOpenFeedback={() => setFeedbackModalOpen(true)}
        onOpenGoogleDrive={() => setGoogleDriveModalOpen(true)}
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
            <span style={{
              fontSize: '0.62rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              padding: '0.12rem 0.45rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(234, 179, 8, 0.15)',
              border: '1px solid rgba(234, 179, 8, 0.45)',
              color: '#fde047'
            }}>
              Public Beta
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

            {/* Family Profile Button */}
            <button
              onClick={() => setProfileModalOpen(true)}
              className="btn-pill"
              style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.65rem',
                gap: '0.35rem',
                backgroundColor: currentProfile.role === 'kid' ? 'rgba(52, 211, 153, 0.15)' : '#111118',
                borderColor: currentProfile.role === 'kid' ? 'rgba(52, 211, 153, 0.4)' : 'rgba(139, 92, 246, 0.25)',
                color: currentProfile.role === 'kid' ? '#34d399' : '#ffffff'
              }}
              title="Family Profiles, Kid Safe & Sovereign Memory"
            >
              <span>{currentProfile.avatar}</span>
              <span className="hide-on-mobile">{currentProfile.name.split('/')[0].trim()}</span>
              {currentProfile.parentalLockEnabled && hasParentalPin() && <span style={{ fontSize: '0.65rem' }}>🔒</span>}
            </button>

            {/* Personality Gallery Pill Button */}
            <button
              onClick={() => setPersonalityModalOpen(true)}
              className="btn-pill"
              style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.65rem',
                gap: '0.35rem',
                backgroundColor: personalityModalOpen ? 'rgba(139, 92, 246, 0.25)' : '#111118',
                borderColor: personalityModalOpen ? '#8b5cf6' : 'rgba(139, 92, 246, 0.3)',
                color: '#ffffff'
              }}
              title="Browse Perspectives & Voices Gallery"
            >
              {currentPersonality.avatar && <span>{currentPersonality.avatar}</span>}
              <span>{currentPersonality.name}</span>
              <span style={{ fontSize: '0.7rem', color: '#c4b5fd' }}>🎭</span>
            </button>

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

            {/* Public Beta Feedback Button */}
            <button
              onClick={() => setFeedbackModalOpen(true)}
              className="btn-pill"
              style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.6rem',
                gap: '0.3rem',
                borderColor: 'rgba(234, 179, 8, 0.4)',
                backgroundColor: feedbackModalOpen ? 'rgba(234, 179, 8, 0.2)' : '#111118',
                color: '#fef08a'
              }}
              title="Send beta feedback, bug reports, and writeups to humansandai@atomicmail.io"
            >
              <span>💬</span>
              <span className="hide-on-mobile"> Feedback</span>
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
        <div className="prompt-wrapper" style={{ padding: '0.75rem 2rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 20 }}>
          {/* Floating Stop Indicator when generating */}
          {isGenerating && (
            <div style={{ marginBottom: '0.5rem', zIndex: 25 }}>
              <button
                onClick={handleStopGeneration}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.35rem 0.95rem',
                  backgroundColor: '#18181b',
                  border: '1px solid rgba(239, 68, 68, 0.6)',
                  borderRadius: '9999px',
                  color: '#f87171',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.6)',
                  transition: 'all 0.15s ease'
                }}
                title="Stop generating response (Esc)"
              >
                <span style={{ fontSize: '0.7rem' }}>⏹</span>
                <span>Stop Generating</span>
                <span style={{ color: '#71717a', fontSize: '0.7rem', fontWeight: 400 }}>(Esc)</span>
              </button>
            </div>
          )}

          {/* PII Safety Alert Banner */}
          {piiAlert && (
            <div style={{
              maxWidth: '820px',
              width: '100%',
              margin: '0 auto 0.45rem auto',
              padding: '0.5rem 0.85rem',
              backgroundColor: 'rgba(234, 179, 8, 0.12)',
              border: '1px solid rgba(234, 179, 8, 0.4)',
              borderRadius: '10px',
              color: '#fde047',
              fontSize: '0.78rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>{piiAlert}</span>
              </div>
              <button
                onClick={() => setPiiAlert(null)}
                style={{ background: 'transparent', border: 'none', color: '#fde047', cursor: 'pointer', fontSize: '1rem', padding: '0 0.3rem' }}
              >
                ×
              </button>
            </div>
          )}

          {/* Attached Document Bar with Quick Study Actions */}
          <AttachmentBar
            doc={attachedDoc}
            onRemove={() => setAttachedDoc(null)}
            onQuickAction={(actionPrompt) => handleSendMessage(actionPrompt)}
          />

          <div className="floating-prompt" style={{ maxWidth: '820px', width: '100%', padding: '0.5rem 0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {/* Attachment Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: attachedDoc ? '#8b5cf6' : '#71717a',
                  fontSize: '1.25rem',
                  cursor: 'pointer',
                  padding: '0.3rem'
                }}
                title="Attach text, code, notes, or homework document"
              >
                📎
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.md,.json,.csv,.py,.ts,.js,.rs,.html,.xml,.css"
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

              {/* Send or Stop Button */}
              {isGenerating ? (
                <button
                  onClick={handleStopGeneration}
                  className="btn-pill"
                  style={{
                    padding: '0.5rem 0.95rem',
                    backgroundColor: '#dc2626',
                    border: '1px solid #ef4444',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    borderRadius: '9999px',
                    transition: 'all 0.15s ease'
                  }}
                  title="Stop generating response (Esc)"
                >
                  <span style={{ fontSize: '0.75rem' }}>⏹</span>
                  <span>Stop</span>
                </button>
              ) : (
                <button
                  onClick={handleSendMessage}
                  disabled={!inputPrompt.trim()}
                  className="btn-pill btn-pill-primary"
                  style={{
                    padding: '0.5rem 1rem',
                    opacity: !inputPrompt.trim() ? 0.4 : 1,
                    cursor: !inputPrompt.trim() ? 'not-allowed' : 'pointer'
                  }}
                  title="Send message (Enter)"
                >
                  ➤
                </button>
              )}
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

      {/* Public Beta Feedback Modal */}
      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        activeModel={currentModelLabel}
      />

      {/* Google Drive AppData Sync Modal */}
      <GoogleDriveModal
        isOpen={googleDriveModalOpen}
        onClose={() => setGoogleDriveModalOpen(false)}
        sessions={sessions}
        onSessionsReload={handleSessionsReload}
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
        onOpenProfiles={() => setProfileModalOpen(true)}
        onOpenPersonalityModal={() => setPersonalityModalOpen(true)}
      />

      {/* 22-Perspective & Author Voices Gallery Modal */}
      <PersonalityModal
        isOpen={personalityModalOpen}
        onClose={() => setPersonalityModalOpen(false)}
        selectedPersonality={selectedPersonality}
        onSelectPersonality={(id) => {
          setSelectedPersonality(id);
        }}
        onOpenCustomSettings={() => setSettingsOpen(true)}
      />

      {/* Profile & Sovereign Memory Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onRequestPinVerify={handleRequestPinVerify}
        onOpenPinSetup={handleOpenPinSetup}
        onProfileChanged={handleProfileChanged}
      />

      {/* Parental PIN Lock Modal */}
      <ParentalModal
        isOpen={parentalModalOpen}
        mode={parentalModalMode}
        onClose={() => setParentalModalOpen(false)}
        onSuccess={handlePinSuccess}
      />
    </div>
  );
};
