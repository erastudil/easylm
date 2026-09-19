import React, { useState, useEffect, useRef } from 'react';
import { Session, Message, ToolExecution, TriLakeRating } from './types';
import {
  createNewSession,
  loadAllSessions,
  loadAllSessionsAsync,
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
  AVAILABLE_MODELS,
  getOrInitEngine,
  isEngineReady,
  resetWebGPUAndCaches,
  getGpuFence,
  clearGpuFence
} from './engine/webllm';
import { dispatchTool, SYSTEM_TOOLS_PROMPT, SYSTEM_TOOLS_PROMPT_KID } from './engine/tools';
import {
  assembleSystemEnvelope,
  budgetTurn,
  classifyWebGpuFailure,
  MIN_COMPLETION
} from './engine/context_budget';
import { clockQueryOf, mathExpressionOf, stacksQueryOf, unitConversionOf } from './engine/preflight';
import { Sidebar } from './components/Sidebar';
import { SettingsModal } from './components/SettingsModal';

import { ModelModal } from './components/ModelModal';
import { PersonalityModal } from './components/PersonalityModal';
import { PERSONALITIES, clampPersonalityIdForRole } from './data/personalities';
import { HelpModal } from './components/HelpModal';
import { SupportModal } from './components/SupportModal';
import { FeedbackModal } from './components/FeedbackModal';
import { EASYLM_GUIDE_PROMPT_CONTEXT } from './data/help_guide';
import { detectDevice, DeviceInfo } from './engine/device';
import { createWelcomeMessage, WELCOME_TOOLBOX_CONTENT } from './data/welcome';
import { CORE_INTERACTION_PROTOCOLS, CORE_INTERACTION_PROTOCOLS_COMPACT, CORE_INTERACTION_PROTOCOLS_KID } from './data/protocols';
import { GpuRestartModal } from './components/GpuRestartModal';
import {
  UserProfile,
  AttachedDoc,
  getActiveProfile,
  getProfileMemories,
  detectPII,
  hasParentalPin,
  loadMemoriesAsync,
  getAttentivePromptEnvelope
} from './engine/family';
import { ParentalModal } from './components/ParentalModal';
import { ProfileModal } from './components/ProfileModal';
import { WelcomeModal } from './components/WelcomeModal';
import { VaultUnlockModal } from './components/VaultUnlockModal';
import { isVaultEncrypted, isVaultUnlocked, lockVault } from './engine/crypto_vault';
import { HistoryModal } from './components/HistoryModal';
import { LearnModal } from './components/LearnModal';
import { StudioModal, StudioTarget } from './components/StudioModal';
import { useNarrow } from './shell/useNarrow';
import { useKeyboardOpen } from './shell/useKeyboardInset';
import { loadPhoneTab, savePhoneTab, PhoneTab } from './shell/phone_tabs';
import { PhoneShell } from './shell/PhoneShell';
import { ChatPane } from './shell/ChatPane';
import { ChatPhoneBar } from './shell/ChatPhoneBar';
import { ChatSheet } from './shell/ChatSheet';
import { MoreView } from './shell/MoreView';

export interface StarterChip {
  label: string;
  prompt: string;
}

const STARTER_PROMPTS_CATALOG: StarterChip[] = [
  { label: '🧮 Math Evaluator', prompt: 'sqrt(144) * (50 + 2)' },
  { label: '📏 Unit Converter', prompt: '100 km/h to mph' },
  { label: '🕒 World Clock', prompt: 'What time is it in Tokyo right now?' },
  { label: '⛅ Weather', prompt: 'What is the weather forecast for Dallas, TX?' },
  { label: '💱 Currency', prompt: '100 USD to EUR' },
  { label: '🔬 Inquiry 001', prompt: 'Explain Feynman cargo cult science and the importance of scientific integrity.' },
  { label: '💻 Computing 004', prompt: 'How does virtual memory translation work with page tables and TLBs?' },
  { label: '🤖 Intelligence 006', prompt: 'How does multi-head self-attention allow transformers to capture context?' },
  { label: '🏛️ Philosophy 100', prompt: 'How does Karl Popper falsification criterion solve Hume induction problem?' },
  { label: '🧠 Psychology 150', prompt: 'How does spaced repetition exploit the Ebbinghaus forgetting curve?' },
  { label: '📈 Economics 330', prompt: 'How does the Federal Reserve use open market operations to influence interest rates?' },
  { label: '⚖️ Jurisprudence 340', prompt: 'What is the distinction between procedural and substantive due process?' },
  { label: '📐 Mathematics 510', prompt: 'Explain the fundamental theorem of calculus with intuitive geometry.' },
  { label: '🔭 Astronomy 520', prompt: 'What did the James Webb Space Telescope reveal about early galaxies?' },
  { label: '🌌 Physics 530', prompt: 'Why is the speed of light constant in all frames of reference?' },
  { label: '⚗️ Chemistry 540', prompt: 'Why does ice float on water from a molecular geometry perspective?' },
  { label: '🌦️ Climate 551', prompt: 'What causes the Coriolis effect and how does it steer global storm systems?' },
  { label: '🧬 Biology 570', prompt: 'How do CRISPR enzymes locate and cleave target DNA sequences?' },
  { label: '🩺 Health 610', prompt: 'How does the cardiovascular system regulate blood pressure during exercise?' },
  { label: '⚙️ Engineering 620', prompt: 'What are the key differences between stress and strain in material mechanics?' },
  { label: '🎵 Music 780', prompt: 'Why do musical octaves have a 2:1 frequency ratio across human cultures?' },
  { label: '📖 Literature 800', prompt: 'What makes the narrative structure of Frankenstein unique and enduring?' },
  { label: '📜 History 900', prompt: 'What led to the agricultural revolution during the Neolithic transition?' },
  { label: '📚 Dictionary', prompt: 'Define serendipity and its historical origin.' }
];

const VAULT_SECURITY_CHIP: StarterChip = {
  label: '🛡️ Vault Security',
  prompt: 'How does client-side AES encryption protect my private conversations and notes on a shared device?'
};

function pickRandomStarterChips(count: number = 6): StarterChip[] {
  const isEncrypted = typeof window !== 'undefined' && isVaultEncrypted();
  let pool = [...STARTER_PROMPTS_CATALOG];
  if (!isEncrypted) {
    pool.push(VAULT_SECURITY_CHIP);
  }
  const shuffled = pool.sort(() => 0.5 - Math.random());
  if (!isEncrypted && !shuffled.slice(0, count).some(c => c.label === VAULT_SECURITY_CHIP.label)) {
    const picked = shuffled.slice(0, count - 1);
    const insertIdx = Math.floor(Math.random() * count);
    picked.splice(insertIdx, 0, VAULT_SECURITY_CHIP);
    return picked;
  }
  return shuffled.slice(0, count);
}

export const App: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionIdState] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== 'undefined' ? window.innerWidth > 768 : false);
  const narrow = useNarrow();
  const keyboardOpen = useKeyboardOpen();
  const [phoneTab, setPhoneTab] = useState<PhoneTab>(() =>
    loadPhoneTab(typeof localStorage !== 'undefined' ? localStorage : null)
  );
  const [chatsSheetOpen, setChatsSheetOpen] = useState(false);
  const [chatOverflowOpen, setChatOverflowOpen] = useState(false);

  const handlePhoneTab = (tab: PhoneTab) => {
    setPhoneTab(tab);
    savePhoneTab(typeof localStorage !== 'undefined' ? localStorage : null, tab);
    setChatsSheetOpen(false);
    setChatOverflowOpen(false);
  };
  const [vaultLocked, setVaultLocked] = useState<boolean>(() => {
    return typeof window !== 'undefined' && isVaultEncrypted() && !isVaultUnlocked();
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'engine' | 'security' | 'credits'>('engine');
  const [helpOpen, setHelpOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  const handleOpenCredits = () => {
    setSettingsTab('credits');
    setSettingsOpen(true);
  };

  const handleOpenSecurity = () => {
    setSettingsTab('security');
    setSettingsOpen(true);
  };

  const handleOpenSettings = () => {
    setSettingsTab('engine');
    setSettingsOpen(true);
  };

  const handleVaultUnlocked = async () => {
    setVaultLocked(false);
    const loaded = await loadAllSessionsAsync();
    if (loaded.length > 0) {
      const cleaned = loaded.map(sess => ({
        ...sess,
        messages: sess.messages.filter(m => !m.id.startsWith('msg-welcome-') && !(m.role === 'assistant' && m.content.startsWith('Welcome to **EasyLM**')))
      }));
      setSessions(cleaned);
      const savedActive = getActiveSessionId();
      if (savedActive && cleaned.some(s => s.id === savedActive)) {
        setActiveSessionIdState(savedActive);
      } else {
        setActiveSessionIdState(cleaned[0].id);
      }
    }
    await loadMemoriesAsync();
    setStarterChips(pickRandomStarterChips(6));
  };
  const [historyOpen, setHistoryOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);
  const [studioOpen, setStudioOpen] = useState(false);
  const [studioTarget, setStudioTarget] = useState<StudioTarget | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);

  // In-app navigation stack for back/forward traversal across Learn, Studio & History
  interface NavState {
    view: 'learn' | 'studio' | 'history';
    studioTarget?: StudioTarget | null;
  }
  const [navHistory, setNavHistory] = useState<NavState[]>([]);
  const [navIndex, setNavIndex] = useState<number>(-1);

  const pushNav = (entry: NavState) => {
    setNavHistory(prev => {
      const next = [...prev.slice(0, navIndex + 1), entry];
      setNavIndex(next.length - 1);
      return next;
    });
  };

  const applyNav = (entry: NavState) => {
    if (entry.view === 'learn') {
      setHistoryOpen(false);
      setStudioOpen(false);
      setLearnOpen(true);
    } else if (entry.view === 'studio') {
      setHistoryOpen(false);
      setLearnOpen(false);
      setStudioTarget(entry.studioTarget || null);
      setStudioOpen(true);
    } else if (entry.view === 'history') {
      setLearnOpen(false);
      setStudioOpen(false);
      setHistoryOpen(true);
    }
  };

  const handleNavBack = () => {
    if (navIndex > 0) {
      const nextIdx = navIndex - 1;
      setNavIndex(nextIdx);
      applyNav(navHistory[nextIdx]);
    }
  };

  const handleNavForward = () => {
    if (navIndex < navHistory.length - 1) {
      const nextIdx = navIndex + 1;
      setNavIndex(nextIdx);
      applyNav(navHistory[nextIdx]);
    }
  };

  const handleOpenLearn = () => {
    if (narrow) {
      handlePhoneTab('learn');
      return;
    }
    setHistoryOpen(false);
    setStudioOpen(false);
    setLearnOpen(true);
    pushNav({ view: 'learn' });
  };

  const handleOpenStudio = (target?: StudioTarget) => {
    setStudioTarget(target || null);
    if (narrow) {
      handlePhoneTab('studio');
      return;
    }
    setHistoryOpen(false);
    setLearnOpen(false);
    setStudioOpen(true);
    pushNav({ view: 'studio', studioTarget: target });
  };

  const handleOpenHistory = () => {
    if (narrow) {
      setHistoryOpen(true);
      return;
    }
    setLearnOpen(false);
    setStudioOpen(false);
    setHistoryOpen(true);
    pushNav({ view: 'history' });
  };

  useEffect(() => {
    if (narrow) {
      setLearnOpen(false);
      setStudioOpen(false);
      setSidebarOpen(false);
    }
  }, [narrow]);

  const handleOpenDocument = (content: string, title?: string) => {
    handleOpenStudio({
      tool: 'write',
      title: title || 'Academic Assignment',
      initialContent: content
    });
  };

  const handleRateMessage = (messageId: string, rating: TriLakeRating) => {
    if (!activeSessionId) return;
    setSessions((prev) => {
      const next = prev.map((s) => {
        if (s.id !== activeSessionId) return s;
        return {
          ...s,
          updatedAt: Date.now(),
          messages: s.messages.map((m) => (m.id === messageId ? { ...m, rating } : m))
        };
      });
      persistSessions(next);
      return next;
    });
  };

  const handleInsertGraph = (svgCode: string, graphTitle: string) => {
    setInputPrompt((prev) => prev ? `${prev}\n\n[Graph: ${graphTitle}]\n\`\`\`xml\n${svgCode}\n\`\`\`` : `[Graph: ${graphTitle}]\n\`\`\`xml\n${svgCode}\n\`\`\``);
  };

  // Family Mode, Profiles, Parental Controls, and Sovereign Memory
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(() => getActiveProfile());
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [parentalModalOpen, setParentalModalOpen] = useState(false);
  const [parentalModalMode, setParentalModalMode] = useState<'verify' | 'setup'>('verify');
  const [pendingPinAction, setPendingPinAction] = useState<(() => void) | null>(null);
  const [piiAlert, setPiiAlert] = useState<string | null>(null);
  const [storageAlert, setStorageAlert] = useState<string | null>(null);
  const [attachedDoc, setAttachedDoc] = useState<AttachedDoc | null>(null);

  // Model & Personality Configuration
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    const saved = localStorage.getItem('easylm_selected_model');
    if (saved && AVAILABLE_MODELS.some(m => m.id === saved)) return saved;
    return DEFAULT_MODEL_ID;
  });
  const [modelModalOpen, setModelModalOpen] = useState<boolean>(false);
  const [isModelReady, setIsModelReady] = useState<boolean>(() => isEngineReady());
  const [contextLimit, setContextLimit] = useState<number>(() => {
    const saved = localStorage.getItem('easylm_context_limit');
    return saved ? parseInt(saved, 10) : 4096;
  });

  const handleSelectModel = (id: string) => {
    if (!AVAILABLE_MODELS.some(m => m.id === id)) return;
    if (id !== selectedModel) {
      setIsModelReady(false);
    }
    setSelectedModel(id);
    localStorage.setItem('easylm_selected_model', id);
  };

  const handleUpdateContextLimit = (limit: number) => {
    setContextLimit(limit);
    localStorage.setItem('easylm_context_limit', String(limit));
  };

  const [loadErrorToast, setLoadErrorToast] = useState<{
    message: string;
    modelId: string;
    isGPUOrCache: boolean;
    gpuDead?: boolean;
  } | null>(null);
  const [gpuRestartOpen, setGpuRestartOpen] = useState(false);

  const handleLoadModel = async (targetModel?: string) => {
    const modelToLoad = targetModel || selectedModel;
    clearGpuFence();
    setIsGenerating(true);
    setLoadErrorToast(null);
    try {
      await getOrInitEngine(modelToLoad, (prog) => {
        setModelProgress(prog);
      }, contextLimit);
      setIsModelReady(true);
      setSelectedModel(modelToLoad);
    } catch (err: any) {
      console.error('Failed to load model into WebGPU:', err);
      const rawMsg = err?.message || String(err);
      const kind = classifyWebGpuFailure(err);
      const gpuDead = kind === 'gpu_process_dead' || getGpuFence() === 'process_dead';
      if (gpuDead) setGpuRestartOpen(true);
      const lower = rawMsg.toLowerCase();
      const isGPUOrCache = lower.includes('gpu') || lower.includes('webgpu') || lower.includes('cache') ||
        lower.includes('buffer') || lower.includes('fetch') || lower.includes('integrity') ||
        lower.includes('wasm') || lower.includes('pipeline') || lower.includes('device');

      setLoadErrorToast({
        message: gpuDead ? 'WebGPU cannot see the GPU. The GPU worker is down.' : rawMsg,
        modelId: modelToLoad,
        isGPUOrCache: isGPUOrCache && !gpuDead,
        gpuDead
      });
    } finally {
      setIsGenerating(false);
      setModelProgress(null);
    }
  };

  const persistSessions = (next: Session[]) => {
    const saved = saveAllSessions(next);
    if (saved.quota) {
      setStorageAlert(saved.error || 'Browser storage is full. Export a backup or delete old chats.');
    }
  };
  const [selectedPersonality, setSelectedPersonality] = useState<string>(() => {
    const prof = getActiveProfile();
    return clampPersonalityIdForRole(prof.personalityId || 'friendly', prof.role);
  });
  const [personalityModalOpen, setPersonalityModalOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [toolsEnabled, setToolsEnabled] = useState<boolean>(true);
  const [extendedThinking, setExtendedThinking] = useState<boolean>(false);
  const [temperature, setTemperature] = useState<number>(0.3);
  const [searxngUrl, setSearxngUrl] = useState<string>(() => localStorage.getItem('easylm_searxng_url') || '');
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);
  const [starterChips, setStarterChips] = useState<StarterChip[]>(() => pickRandomStarterChips(6));
  const handleShuffleChips = () => {
    setStarterChips(pickRandomStarterChips(6));
  };
  const [showWelcomeMessage, setShowWelcomeMessage] = useState<boolean>(() => {
    const saved = localStorage.getItem('easylm_show_welcome');
    return saved === null ? true : saved === 'true';
  });

  const handleToggleWelcomeMessage = () => {
    const next = !showWelcomeMessage;
    setShowWelcomeMessage(next);
    localStorage.setItem('easylm_show_welcome', String(next));
    if (next) {
      setWelcomeModalOpen(true);
    }
  };

  const handleCloseWelcomeModal = (dontShowAgain: boolean) => {
    setWelcomeModalOpen(false);
    if (dontShowAgain) {
      setShowWelcomeMessage(false);
      localStorage.setItem('easylm_show_welcome', 'false');
    }
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
    const nextId = newProfile.personalityId || selectedPersonality;
    setSelectedPersonality(clampPersonalityIdForRole(nextId, newProfile.role));
  };

  // Kid role: adult gallery voices must never remain selected
  useEffect(() => {
    if (currentProfile.role === 'kid') {
      setSelectedPersonality(prev => clampPersonalityIdForRole(prev, 'kid'));
    }
  }, [currentProfile.role]);

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
      const savedModel = localStorage.getItem('easylm_selected_model');
      if (savedModel && !AVAILABLE_MODELS.some(m => m.id === savedModel)) {
        localStorage.removeItem('easylm_selected_model');
        setSelectedModel(dev.recommendedModel || DEFAULT_MODEL_ID);
      } else if (!savedModel && dev.recommendedModel) {
        setSelectedModel(dev.recommendedModel);
      }
      const savedLimit = localStorage.getItem('easylm_context_limit');
      if (!savedLimit && dev.recommendedContextLimit) {
        setContextLimit(dev.recommendedContextLimit);
      }
    });

    const shouldWelcome = localStorage.getItem('easylm_show_welcome');
    if (shouldWelcome === null || shouldWelcome === 'true') {
      setWelcomeModalOpen(true);
    }

    loadAllSessionsAsync().then(loaded => {
      if (loaded.length > 0) {
        const cleaned = loaded.map(sess => ({
          ...sess,
          messages: sess.messages.filter(m => !m.id.startsWith('msg-welcome-') && !(m.role === 'assistant' && m.content.startsWith('Welcome to **EasyLM**')))
        }));
        setSessions(cleaned);
        persistSessions(cleaned);
        const savedActive = getActiveSessionId();
        if (savedActive && cleaned.some(s => s.id === savedActive)) {
          setActiveSessionIdState(savedActive);
        } else {
          setActiveSessionIdState(cleaned[0].id);
        }
      } else {
        const initial = createNewSession('New Conversation');
        setSessions([initial]);
        setActiveSessionIdState(initial.id);
        persistSessions([initial]);
      }
    });
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
    const updated = [newSess, ...sessions];
    setSessions(updated);
    setActiveSessionIdState(newSess.id);
    persistSessions(updated);
    setStarterChips(pickRandomStarterChips(6));
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

  // Active Session Lookup
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  useEffect(() => {
    if (activeSession && (activeSession.messages.length > 0 || isGenerating)) {
      scrollToBottom();
    }
  }, [sessions, activeSessionId, isGenerating]);

  // Delete Session
  const handleDeleteSession = (id: string) => {
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    persistSessions(updated);
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
    const kidSafe = currentProfile.role === 'kid';
    if (piiCheck.hasPII && kidSafe) {
      setPiiAlert(`Kid Safe blocked this send. It looks like a ${piiCheck.detectedTypes.join(', ')}. Edit the message. The local model never saw it.`);
      setTimeout(() => setPiiAlert(null), 10000);
      return;
    }
    if (piiCheck.hasPII) {
      setPiiAlert(`This message looks like it contains a ${piiCheck.detectedTypes.join(', ')}. Inference stays in this browser. Optional tools can still send a lookup if they run.`);
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
    persistSessions(newSessionsList);

    setIsGenerating(true);

    // Build system mandate based on Personality (kid role: force kid-safe voice only)
    const effectivePersonalityId = clampPersonalityIdForRole(selectedPersonality, currentProfile.role);
    const personality = PERSONALITIES.find(p => p.id === effectivePersonalityId) || PERSONALITIES.find(p => p.id === 'socratic_kid') || PERSONALITIES[0];
    let voicePrompt = personality.systemPrompt;
    if (effectivePersonalityId === 'custom' && customPrompt && currentProfile.role !== 'kid') {
      voicePrompt = customPrompt;
    }

    const extraBlocks: string[] = [];
    const memoryEnvelope = getAttentivePromptEnvelope(currentProfile.id, trimmed, 256);
    if (memoryEnvelope) extraBlocks.push(memoryEnvelope);
    if (currentProfile.role === 'kid' || currentProfile.socraticTutorEnabled) {
      extraBlocks.push('[KID SAFE & SOCRATIC TUTOR MANDATE]:\nGuide the student step-by-step with inquiry, hints, and questions. Never hand over direct solutions to homework or tests. Keep tone warm, patient, and encouraging.\nHARD REFUSE sexual, romantic, erotic, pornographic, or CSAM-adjacent / exploitative content involving minors (17 or under), including roleplay, fiction, "aged-up" framing, or grooming. Do not partially answer. Refuse in one short calm sentence and redirect to age-appropriate learning.');
    }
    const isHelpAsk = /^(?:help|\?|guide|what can you do|how do you work|who are you|explain yourself|about you)/i.test(trimmed) || trimmed.toLowerCase().includes('how do you work');
    if (isHelpAsk) {
      extraBlocks.push(EASYLM_GUIDE_PROMPT_CONTEXT + '\n\nINSTRUCTION: The user is asking about how EasyLM works or asking for help. Explain who you are, how you run locally, your in-app tools, privacy, and prompting advice in a warm, friendly, and accessible manner.');
    }
    if (extendedThinking) {
      extraBlocks.push('[EXTENDED THINKING PROTOCOL]\nInspect assumptions, evaluate evidence, and explore edge cases step-by-step inside <think>...</think> tags before delivering your final workpiece.');
    }

    const systemInstruction = assembleSystemEnvelope({
      voice: voicePrompt,
      protocols: kidSafe ? CORE_INTERACTION_PROTOCOLS_KID : CORE_INTERACTION_PROTOCOLS,
      protocolsCompact: CORE_INTERACTION_PROTOCOLS_COMPACT,
      tools: toolsEnabled ? (kidSafe ? SYSTEM_TOOLS_PROMPT_KID : SYSTEM_TOOLS_PROMPT) : '',
      extras: extraBlocks.join('\n\n')
    }, contextLimit).text;

    const executedTools: ToolExecution[] = [];

    const mathExpr = mathExpressionOf(trimmed);
    const unitExpr = unitConversionOf(trimmed);
    const clockQuery = clockQueryOf(trimmed);
    const stacksQuery = stacksQueryOf(trimmed);
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

    const toolOpts = { kidSafe };
    if (toolsEnabled && mathExpr) {
      const toolRes = await dispatchTool('calc', mathExpr, searxngUrl, toolOpts);
      executedTools.push(toolRes);
    } else if (toolsEnabled && unitExpr) {
      const toolRes = await dispatchTool('units', unitExpr, searxngUrl, toolOpts);
      executedTools.push(toolRes);
    } else if (toolsEnabled && clockQuery !== null) {
      const toolRes = await dispatchTool('datetime', clockQuery, searxngUrl, toolOpts);
      executedTools.push(toolRes);
    } else if (toolsEnabled && stacksQuery) {
      const toolRes = await dispatchTool('stacks', stacksQuery, searxngUrl, toolOpts);
      executedTools.push(toolRes);
    } else if (toolsEnabled && !kidSafe && directFetchMatch) {
      const toolRes = await dispatchTool('web_fetch', directFetchMatch[1], searxngUrl, toolOpts);
      executedTools.push(toolRes);
    } else if (toolsEnabled && !kidSafe && directSearchMatch) {
      const toolRes = await dispatchTool('web_search', directSearchMatch[1], searxngUrl, toolOpts);
      executedTools.push(toolRes);
    } else if (toolsEnabled && !kidSafe && urlMatch && (trimmed.toLowerCase().includes('read') || trimmed.toLowerCase().includes('summarize') || trimmed === urlMatch[1])) {
      const toolRes = await dispatchTool('web_fetch', urlMatch[1], searxngUrl, toolOpts);
      executedTools.push(toolRes);
    } else if (toolsEnabled && !kidSafe && repoMatch) {
      const target = (repoMatch[2] || trimmed)
        .replace(/^(?:for|about|on|in)\s+/i, '')
        .replace(/[?.!]+$/, '')
        .trim();
      const toolRes = await dispatchTool('web_search', target, searxngUrl, toolOpts);
      executedTools.push(toolRes);
    } else if (toolsEnabled && !kidSafe && quoteMatch) {
      const cleanTarget = quoteMatch[1]
        .replace(/^(?:the\s+)?(?:book|novel|play)\s+/i, '')
        .replace(/[?.!]+$/, '')
        .trim();
      const toolRes = await dispatchTool('web_search', `quotes from ${cleanTarget}`, searxngUrl, toolOpts);
      executedTools.push(toolRes);
    } else if (toolsEnabled && !kidSafe && chapterMatch) {
      const chNum = /^\d+|[ivxlcdm]+$/i.test(chapterMatch[1]) ? chapterMatch[1] : chapterMatch[2];
      const rawBook = (chapterMatch[1] === chNum ? chapterMatch[2] : chapterMatch[1])
        .replace(/^(?:summarize|read|tell me about|what happens in|overview of)\s+/i, '')
        .replace(/\s+(?:summary|overview)$/i, '')
        .replace(/[?.!]+$/, '')
        .trim();
      const toolRes = await dispatchTool('web_search', `${rawBook} Chapter ${chNum}`, searxngUrl, toolOpts);
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
      persistSessions(finalSessionsList);
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
      const isReasoningModel = selectedModel.includes('DeepSeek-R1') || selectedModel.includes('Reasoning');
      const turnBudget = budgetTurn(convoMessages, contextLimit, {
        extendedThinking,
        isReasoning: isReasoningModel
      });
      if (turnBudget.maxTokens < MIN_COMPLETION) {
        throw new Error('CONTEXT_BUDGET: this turn does not fit the context window. Raise context in Settings or shorten the prompt.');
      }

      // Start initial stream
      const result = await streamChatCompletion(
        turnBudget.messages,
        selectedModel,
        temperature,
        turnBudget.maxTokens,
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
        (prog) => setModelProgress(prog),
        contextLimit
      );
      setIsModelReady(true);

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
          const toolExecution = await dispatchTool(callName, callQuery || trimmed, searxngUrl, { kidSafe });
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
          const followBudget = budgetTurn(toolFollowUpMessages, contextLimit, {
            extendedThinking,
            isReasoning: isReasoningModel
          });
          const finalResult = await streamChatCompletion(
            followBudget.messages,
            selectedModel,
            temperature,
            followBudget.maxTokens,
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
            (prog) => setModelProgress(prog),
            contextLimit
          );
          setIsModelReady(true);

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

          setSessions(prev => {
            const next = prev.map(s => s.id === activeSession.id ? finalSessionObj : s);
            persistSessions(next);
            return next;
          });
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

      setSessions(prev => {
        const next = prev.map(s => s.id === activeSession.id ? finalSessionObj : s);
        persistSessions(next);
        return next;
      });
    } catch (err: any) {
      console.error('Inference error:', err);
      setIsModelReady(isEngineReady());
      const kind = classifyWebGpuFailure(err);
      const errStr = String(err?.message || err).toLowerCase();
      const isOOM = kind === 'oom' || errStr.includes('buffer') || errStr.includes('allocation');
      const isDisposedOrLost = kind === 'device_lost' || kind === 'disposed';
      const isGPUProcessDead = kind === 'gpu_process_dead' || getGpuFence() === 'process_dead';
      const isCorruptCache = errStr.includes('integrity') || errStr.includes('corrupt') || errStr.includes('syntaxerror') || errStr.includes('unexpected end') || errStr.includes('failed to fetch');
      const isBudget = errStr.includes('context_budget');

      if (isGPUProcessDead) setGpuRestartOpen(true);

      const errorHint = isBudget
        ? `\n\nThis turn does not fit the context window. Raise context in Settings or shorten the prompt.`
        : isOOM
        ? `\n\nGPU ran out of memory for this model. Switch to Qwen 2.5 1.5B in Settings.`
        : isGPUProcessDead
        ? `\n\nWebGPU cannot see the GPU. Copy the restart command in the dialog. Save unsaved work first — tabs reload.`
        : isCorruptCache
        ? `\n\nModel weights in browser storage may be incomplete. Open Settings and click Clear Model Cache.`
        : isDisposedOrLost
        ? `\n\nWebGPU disconnected. Click Load Model. Do not restart the browser unless the GPU-worker dialog appears.`
        : `\n\nUse Chrome, Edge, or Brave 113+ with hardware acceleration on.`;

      const errMsg: Message = {
        id: assistantMsgId,
        role: 'assistant',
        content: `**Notice:** ${err?.message || String(err)}${errorHint}`,
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
    const ext = '.' + (file.name.split('.').pop() || '').toLowerCase();
    const allowed = ['.txt', '.md', '.csv', '.json', '.py', '.ts', '.js', '.rs', '.css'];
    if (!allowed.includes(ext)) {
      setPiiAlert('Attach text files only (.txt, .md, .csv, .json, .py, .ts, .js, .rs, .css), max 1 MB.');
      setTimeout(() => setPiiAlert(null), 8000);
      return;
    }
    if (file.size > 1_000_000) {
      setPiiAlert('Attachment too large. Max 1 MB.');
      setTimeout(() => setPiiAlert(null), 8000);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        setAttachedDoc({
          name: file.name,
          size: file.size,
          content: text.slice(0, 14000),
          type: file.type || 'text/plain'
        });
      }
    };
    reader.readAsText(file);
  };

  const currentModelLabel = AVAILABLE_MODELS.find(m => m.id === selectedModel)?.label || 'Qwen 2.5 3B';
  const currentPersonality = PERSONALITIES.find(p => p.id === clampPersonalityIdForRole(selectedPersonality, currentProfile.role)) || PERSONALITIES.find(p => p.id === 'socratic_kid') || PERSONALITIES[0];

  const chatPane = (
    <ChatPane
      compact={narrow}
      activeSession={activeSession}
      isGenerating={isGenerating}
      starterChips={starterChips}
      personalityName={currentPersonality.name}
      inputPrompt={inputPrompt}
      piiAlert={piiAlert}
      storageAlert={storageAlert}
      attachedDoc={attachedDoc}
      fileInputRef={fileInputRef}
      messagesEndRef={messagesEndRef}
      onShuffleChips={handleShuffleChips}
      onSendChip={(prompt) => handleSendMessage(prompt)}
      onOpenWelcome={() => setWelcomeModalOpen(true)}
      onOpenVoices={() => setPersonalityModalOpen(true)}
      onOpenDocument={(text) => handleOpenDocument(text, activeSession?.title || 'Assignment Document')}
      onRateMessage={(messageId, rating) => handleRateMessage(messageId, rating)}
      onDismissPii={() => setPiiAlert(null)}
      onDismissStorage={() => setStorageAlert(null)}
      onRemoveDoc={() => setAttachedDoc(null)}
      onQuickAction={(actionPrompt) => handleSendMessage(actionPrompt)}
      onFilePicked={handleFileIngest}
      onInputPrompt={setInputPrompt}
      onSend={() => handleSendMessage()}
      onStop={handleStopGeneration}
    />
  );

  if (narrow) {
    return (
      <div
        style={{ height: '100dvh', maxHeight: '100dvh', width: '100vw', maxWidth: '100vw', overflow: 'hidden', backgroundColor: '#000000' }}
        onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
        onDragLeave={() => setIsDraggingFile(false)}
        onDrop={handleDrop}
      >
        {isDraggingFile && (
          <div style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(139, 92, 246, 0.25)', border: '3px dashed #8b5cf6',
            zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff',
            fontFamily: 'var(--font-mono)', fontSize: '1.1rem'
          }}>
            Drop a text file to attach
          </div>
        )}
        <PhoneShell
          tab={phoneTab}
          onTab={handlePhoneTab}
          keyboardOpen={keyboardOpen}
          learn={
            <LearnModal
              isOpen
              variant="page"
              onClose={() => handlePhoneTab('chat')}
              profileId={currentProfile.id}
              kidSafe={currentProfile.role === 'kid'}
              onOpenStudio={handleOpenStudio}
            />
          }
          studio={
            <StudioModal
              isOpen
              variant="page"
              onClose={() => handlePhoneTab('chat')}
              profileId={currentProfile.id}
              kidSafe={currentProfile.role === 'kid'}
              initialTarget={studioTarget}
              onSwitchToLearn={handleOpenLearn}
              onInsertIntoChat={(text) => {
                setInputPrompt((prev) => (prev ? `${prev}\n\n${text}` : text));
                handlePhoneTab('chat');
              }}
            />
          }
          chat={
            <>
              <ChatPhoneBar
                title={activeSession?.title || 'Chat'}
                modelReady={isModelReady}
                working={isGenerating || Boolean(modelProgress && modelProgress.progress < 1)}
                thinkingOn={extendedThinking}
                handsOn={toolsEnabled}
                voiceName={currentPersonality.name}
                modelLabel={currentModelLabel}
                overflowOpen={chatOverflowOpen}
                onOpenChats={() => { setChatOverflowOpen(false); setChatsSheetOpen(true); }}
                onToggleOverflow={() => setChatOverflowOpen((v) => !v)}
                onToggleThink={() => setExtendedThinking((v) => !v)}
                onToggleHands={() => setToolsEnabled((v) => !v)}
                onOpenVoice={() => { setChatOverflowOpen(false); setPersonalityModalOpen(true); }}
                onOpenModel={() => { setChatOverflowOpen(false); setModelModalOpen(true); }}
                onLoadModel={() => { setChatOverflowOpen(false); handleLoadModel(); }}
                onOpenProfile={() => { setChatOverflowOpen(false); setProfileModalOpen(true); }}
              />
              {!webGpuAvailable && (
                <div className="phone-banner" style={{ backgroundColor: '#1c1307', borderBottom: '1px solid #d97706', color: '#fbbf24' }}>
                  {deviceInfo?.isIOS
                    ? 'iOS: Settings → Safari → Advanced → Feature Flags → WebGPU, then refresh.'
                    : 'WebGPU missing. Chrome or Edge for local chat. Learn and Studio still work.'}
                </div>
              )}
              {modelProgress && (
                <div className="phone-banner" style={{ backgroundColor: '#12121c', borderBottom: '1px solid #8b5cf6', color: '#c4b5fd' }}>
                  {modelProgress.text}
                </div>
              )}
              {chatPane}
            </>
          }
          more={
            <MoreView
              profileName={currentProfile.name}
              profileAvatar={currentProfile.avatar}
              modelLabel={currentModelLabel}
              isModelReady={isModelReady}
              onOpenProfile={() => setProfileModalOpen(true)}
              onOpenModel={() => setModelModalOpen(true)}
              onLoadModel={() => handleLoadModel()}
              onOpenSettings={handleOpenSettings}
              onOpenHistory={handleOpenHistory}
              onOpenHelp={() => setHelpOpen(true)}
              onOpenFeedback={() => setFeedbackModalOpen(true)}
              onOpenCredits={handleOpenCredits}
              onOpenSupport={() => setSupportOpen(true)}
              onLockVault={() => {
                lockVault();
                setVaultLocked(true);
              }}
              onSessionsReload={handleSessionsReload}
              sessions={sessions}
            />
          }
          sheet={chatsSheetOpen ? (
            <ChatSheet
              sessions={sessions}
              activeSessionId={activeSessionId}
              onSelectSession={setActiveSessionIdState}
              onNewSession={handleNewSession}
              onDeleteSession={handleDeleteSession}
              onOpenHistory={handleOpenHistory}
              onClose={() => setChatsSheetOpen(false)}
            />
          ) : null}
        />
        <HelpModal isOpen={helpOpen} onClose={() => setHelpOpen(false)} onOpenWelcomeGuide={() => setWelcomeModalOpen(true)} />
        <SupportModal isOpen={supportOpen} onClose={() => setSupportOpen(false)} />
        <FeedbackModal isOpen={feedbackModalOpen} onClose={() => setFeedbackModalOpen(false)} activeModel={currentModelLabel} />
        <GpuRestartModal isOpen={gpuRestartOpen} onClose={() => setGpuRestartOpen(false)} />
        <SettingsModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          initialTab={settingsTab}
          temperature={temperature}
          onChangeTemperature={setTemperature}
          contextLimit={contextLimit}
          onChangeContextLimit={handleUpdateContextLimit}
          searxngUrl={searxngUrl}
          onChangeSearxngUrl={handleUpdateSearxng}
          showWelcomeMessage={showWelcomeMessage}
          onToggleWelcomeMessage={handleToggleWelcomeMessage}
          deviceInfo={deviceInfo}
          onOpenModelModal={() => setModelModalOpen(true)}
          onOpenProfiles={() => setProfileModalOpen(true)}
          onOpenWelcomeGuide={() => setWelcomeModalOpen(true)}
          onVaultStateChange={() => { setStarterChips(pickRandomStarterChips(6)); }}
          onLockVault={() => { setVaultLocked(true); }}
        />
        <VaultUnlockModal
          isOpen={vaultLocked}
          onUnlocked={handleVaultUnlocked}
          onResetVault={() => { setVaultLocked(false); setSessions([]); handleNewSession(); }}
        />
        <ModelModal
          isOpen={modelModalOpen}
          onClose={() => setModelModalOpen(false)}
          selectedModel={selectedModel}
          onSelectModel={handleSelectModel}
          deviceInfo={deviceInfo}
          isModelReady={isModelReady}
          onLoadModel={handleLoadModel}
          modelProgress={modelProgress}
        />
        <WelcomeModal
          isOpen={welcomeModalOpen}
          onClose={handleCloseWelcomeModal}
          onOpenHelp={() => setHelpOpen(true)}
          onOpenVoices={() => setPersonalityModalOpen(true)}
        />
        <PersonalityModal
          isOpen={personalityModalOpen}
          onClose={() => setPersonalityModalOpen(false)}
          selectedPersonality={selectedPersonality}
          onSelectPersonality={(id) => {
            setSelectedPersonality(clampPersonalityIdForRole(id, currentProfile.role));
          }}
          onOpenCustomSettings={() => setSettingsOpen(true)}
          kidSafe={currentProfile.role === 'kid'}
        />
        <ProfileModal
          isOpen={profileModalOpen}
          onClose={() => setProfileModalOpen(false)}
          onRequestPinVerify={handleRequestPinVerify}
          onOpenPinSetup={handleOpenPinSetup}
          onProfileChanged={handleProfileChanged}
          sessions={sessions}
        />
        <ParentalModal
          isOpen={parentalModalOpen}
          mode={parentalModalMode}
          onClose={() => setParentalModalOpen(false)}
          onSuccess={handlePinSuccess}
        />
        <HistoryModal
          isOpen={historyOpen}
          onClose={() => setHistoryOpen(false)}
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelectSession={(id) => { setActiveSessionIdState(id); setHistoryOpen(false); handlePhoneTab('chat'); }}
          onDeleteSession={handleDeleteSession}
          onNewSession={handleNewSession}
        />
      </div>
    );
  }

  return (
    <div 
      style={{ display: 'flex', height: '100dvh', maxHeight: '100dvh', width: '100vw', maxWidth: '100vw', overflow: 'hidden', backgroundColor: '#000000' }}
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
        onOpenHistory={handleOpenHistory}
        onOpenStudio={() => handleOpenStudio()}
        onOpenLearn={handleOpenLearn}
      />

      {/* Main Chat Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100dvh', maxHeight: '100dvh', minWidth: 0, position: 'relative', overflow: 'hidden' }}>
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

            {/* Model Selector Button */}
            <button
              onClick={() => setModelModalOpen(true)}
              className="btn-pill"
              style={{
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
                padding: '0.2rem 0.6rem',
                backgroundColor: 'rgba(139, 92, 246, 0.18)',
                borderColor: '#8b5cf6',
                color: '#ffffff',
                gap: '0.35rem',
                cursor: 'pointer'
              }}
              title="Click to view all WebGPU models & VRAM tiers"
            >
              <span>🧠</span>
              <span>{currentModelLabel.split('(')[0].trim()}</span>
              <span style={{ fontSize: '0.65rem', color: '#a78bfa' }}>▼</span>
            </button>

            {/* Engine Status Light: red "not ready", green "ready", pulsing green "working" */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.7rem',
                fontFamily: 'var(--font-mono)',
                padding: '0.18rem 0.5rem',
                borderRadius: '9999px',
                backgroundColor: (isGenerating || (modelProgress && modelProgress.progress < 1))
                  ? 'rgba(16, 185, 129, 0.15)'
                  : isModelReady
                  ? 'rgba(16, 185, 129, 0.12)'
                  : 'rgba(244, 63, 94, 0.12)',
                border: (isGenerating || (modelProgress && modelProgress.progress < 1))
                  ? '1px solid #10b981'
                  : isModelReady
                  ? '1px solid rgba(16, 185, 129, 0.4)'
                  : '1px solid rgba(244, 63, 94, 0.4)',
                color: (isGenerating || (modelProgress && modelProgress.progress < 1))
                  ? '#34d399'
                  : isModelReady
                  ? '#34d399'
                  : '#fb7185'
              }}
              title={
                (isGenerating || (modelProgress && modelProgress.progress < 1))
                  ? 'Model is actively computing tokens or warming weights'
                  : isModelReady
                  ? 'Model is loaded and resident in WebGPU VRAM'
                  : 'Model is not loaded into graphics memory yet. Click Load to warm it up.'
              }
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  backgroundColor: (isGenerating || (modelProgress && modelProgress.progress < 1))
                    ? '#34d399'
                    : isModelReady
                    ? '#10b981'
                    : '#f43f5e'
                }}
                className={(isGenerating || (modelProgress && modelProgress.progress < 1)) ? 'animate-pulse' : ''}
              />
              <span>
                {(isGenerating || (modelProgress && modelProgress.progress < 1))
                  ? 'working'
                  : isModelReady
                  ? 'ready'
                  : 'not ready'}
              </span>
            </div>

            {/* Button next to model display that loads the model */}
            {!isModelReady && (
              <button
                onClick={() => handleLoadModel()}
                disabled={isGenerating || (modelProgress !== null && modelProgress.progress < 1)}
                className="btn-pill"
                style={{
                  fontSize: '0.7rem',
                  padding: '0.18rem 0.55rem',
                  backgroundColor: 'rgba(139, 92, 246, 0.25)',
                  borderColor: '#8b5cf6',
                  color: '#ffffff',
                  gap: '0.25rem',
                  cursor: 'pointer'
                }}
                title="Load model into WebGPU graphics memory"
              >
                <span>⚡</span>
                <span>Load</span>
              </button>
            )}
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

            {/* Hands Toggle Button */}
            <button
              onClick={() => setToolsEnabled(!toolsEnabled)}
              className="btn-pill"
              style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.65rem',
                gap: '0.35rem',
                backgroundColor: toolsEnabled ? 'rgba(16, 185, 129, 0.2)' : '#111118',
                borderColor: toolsEnabled ? '#10b981' : 'rgba(139, 92, 246, 0.25)',
                color: toolsEnabled ? '#34d399' : '#71717a'
              }}
              title={toolsEnabled ? 'Hands active: local math/units/clock + optional network lookups (click to turn OFF)' : 'Hands disabled: offline model weights only (click to turn ON)'}
            >
              <span>⚡</span>
              <span><span className="hide-on-mobile">Hands </span>{toolsEnabled ? 'ON' : 'OFF'}</span>
            </button>

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

            {/* Credits Button */}
            <button
              onClick={handleOpenCredits}
              className="btn-pill"
              style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.6rem',
                gap: '0.3rem',
                borderColor: 'rgba(139, 92, 246, 0.4)',
                backgroundColor: settingsOpen && settingsTab === 'credits' ? 'rgba(139, 92, 246, 0.25)' : '#111118',
                color: '#c4b5fd'
              }}
              title="Open Credits & Open Source Attributions"
            >
              <span>📜</span>
              <span className="hide-on-mobile"> Credits</span>
            </button>

            {/* Lock Vault button if encryption is active and unlocked */}
            {isVaultEncrypted() && !vaultLocked && (
              <button
                onClick={() => {
                  lockVault();
                  setVaultLocked(true);
                }}
                className="btn-pill"
                style={{
                  fontSize: '0.75rem',
                  padding: '0.25rem 0.6rem',
                  gap: '0.3rem',
                  borderColor: 'rgba(34, 197, 94, 0.4)',
                  color: '#86efac'
                }}
                title="Lock Sovereign Vault"
              >
                <span>🔒</span>
                <span className="hide-on-mobile">Lock Vault</span>
              </button>
            )}

            {/* Settings Button */}
            <button
              onClick={handleOpenSettings}
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

        {/* Model Load Error & Cache Reset Toast */}
        {loadErrorToast && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            borderBottom: '1px solid rgba(239, 68, 68, 0.35)',
            color: '#fca5a5',
            padding: '0.65rem 1.25rem',
            fontSize: '0.78rem',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.6rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '260px' }}>
              <span>⚠️</span>
              <div>
                <strong>Model Load Notice:</strong> {loadErrorToast.message}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {loadErrorToast.gpuDead && (
                <button
                  type="button"
                  onClick={() => setGpuRestartOpen(true)}
                  className="btn-pill"
                  title="Open the GPU worker restart dialog"
                  style={{
                    fontSize: '0.72rem',
                    padding: '0.25rem 0.65rem',
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    borderColor: '#ef4444',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  Restart GPU worker
                </button>
              )}
              {loadErrorToast.isGPUOrCache && !loadErrorToast.gpuDead && (
                <button
                  type="button"
                  onClick={async () => {
                    await resetWebGPUAndCaches(loadErrorToast.modelId);
                    setLoadErrorToast(null);
                    handleLoadModel(loadErrorToast.modelId);
                  }}
                  className="btn-pill"
                  title="Clear cached weights and try loading again"
                  style={{
                    fontSize: '0.72rem',
                    padding: '0.25rem 0.65rem',
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    borderColor: '#ef4444',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  Clear Cache &amp; Retry
                </button>
              )}
              <button
                onClick={() => setLoadErrorToast(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#a1a1aa',
                  fontSize: '1.2rem',
                  cursor: 'pointer',
                  padding: '0 0.25rem',
                  lineHeight: 1
                }}
                title="Dismiss"
              >
                ×
              </button>
            </div>
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

        {chatPane}
      </main>

      {/* Help Modal */}
      <HelpModal
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
        onOpenWelcomeGuide={() => setWelcomeModalOpen(true)}
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

      <GpuRestartModal
        isOpen={gpuRestartOpen}
        onClose={() => setGpuRestartOpen(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        initialTab={settingsTab}
        temperature={temperature}
        onChangeTemperature={setTemperature}
        contextLimit={contextLimit}
        onChangeContextLimit={handleUpdateContextLimit}
        searxngUrl={searxngUrl}
        onChangeSearxngUrl={handleUpdateSearxng}
        showWelcomeMessage={showWelcomeMessage}
        onToggleWelcomeMessage={handleToggleWelcomeMessage}
        deviceInfo={deviceInfo}
        onOpenModelModal={() => setModelModalOpen(true)}
        onOpenProfiles={() => setProfileModalOpen(true)}
        onOpenWelcomeGuide={() => setWelcomeModalOpen(true)}
        onVaultStateChange={() => {
          setStarterChips(pickRandomStarterChips(6));
        }}
        onLockVault={() => {
          setVaultLocked(true);
        }}
      />

      {/* Sovereign Vault Unlock Modal */}
      <VaultUnlockModal
        isOpen={vaultLocked}
        onUnlocked={handleVaultUnlocked}
        onResetVault={() => {
          setVaultLocked(false);
          setSessions([]);
          handleNewSession();
        }}
      />

      {/* Model Selector & HF Streaming Modal */}
      <ModelModal
        isOpen={modelModalOpen}
        onClose={() => setModelModalOpen(false)}
        selectedModel={selectedModel}
        onSelectModel={handleSelectModel}
        deviceInfo={deviceInfo}
        isModelReady={isModelReady}
        onLoadModel={handleLoadModel}
        modelProgress={modelProgress}
      />

      {/* Welcome & Toolbox Guide Popup Modal */}
      <WelcomeModal
        isOpen={welcomeModalOpen}
        onClose={handleCloseWelcomeModal}
        onOpenHelp={() => setHelpOpen(true)}
        onOpenVoices={() => setPersonalityModalOpen(true)}
      />

      {/* Perspectives & Author Voices Gallery Modal (kid role: kid-safe subset only) */}
      <PersonalityModal
        isOpen={personalityModalOpen}
        onClose={() => setPersonalityModalOpen(false)}
        selectedPersonality={selectedPersonality}
        onSelectPersonality={(id) => {
          setSelectedPersonality(clampPersonalityIdForRole(id, currentProfile.role));
        }}
        onOpenCustomSettings={() => setSettingsOpen(true)}
        kidSafe={currentProfile.role === 'kid'}
      />

      {/* Profile & Sovereign Memory Modal */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        onRequestPinVerify={handleRequestPinVerify}
        onOpenPinSetup={handleOpenPinSetup}
        onProfileChanged={handleProfileChanged}
        sessions={sessions}
      />

      {/* Parental PIN Lock Modal */}
      <ParentalModal
        isOpen={parentalModalOpen}
        mode={parentalModalMode}
        onClose={() => setParentalModalOpen(false)}
        onSuccess={handlePinSuccess}
      />

      {/* Conversation History Modal */}
      <HistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={(id) => {
          setActiveSessionIdState(id);
          setHistoryOpen(false);
        }}
        onDeleteSession={handleDeleteSession}
        onNewSession={handleNewSession}
      />

      {/* EasyLM Learn Modal (Curriculum, Walk, Today, Cards, Record) */}
      <LearnModal
        isOpen={learnOpen}
        onClose={() => setLearnOpen(false)}
        profileId={currentProfile.id}
        kidSafe={currentProfile.role === 'kid'}
        onOpenStudio={handleOpenStudio}
        canNavigateBack={navIndex > 0}
        canNavigateForward={navIndex < navHistory.length - 1}
        onNavigateBack={handleNavBack}
        onNavigateForward={handleNavForward}
      />

      {/* EasyLM Studio Modal (Read, Write, Code, Graph, Draw) */}
      <StudioModal
        isOpen={studioOpen}
        onClose={() => setStudioOpen(false)}
        profileId={currentProfile.id}
        kidSafe={currentProfile.role === 'kid'}
        initialTarget={studioTarget}
        onSwitchToLearn={handleOpenLearn}
        onInsertIntoChat={(text) => setInputPrompt(prev => prev ? `${prev}\n\n${text}` : text)}
        canNavigateBack={navIndex > 0}
        canNavigateForward={navIndex < navHistory.length - 1}
        onNavigateBack={handleNavBack}
        onNavigateForward={handleNavForward}
      />
    </div>
  );
};
