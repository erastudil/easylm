export type TriLakeRating = 'approved' | 'rejected' | 'neutral' | 'heaven' | 'hell';
export type LakeType = 'approved' | 'candidate' | 'rejected' | 'heaven' | 'purgatory' | 'hell';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  thinking?: string;
  thoughtDurationMs?: number;
  toolsUsed?: ToolExecution[];
  timestamp: number;
  loopProtected?: boolean;
  rating?: TriLakeRating;
}

export interface ToolExecution {
  tool: string;
  query: string;
  result: string;
  durationMs: number;
  isError?: boolean;
}

export interface Session {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
  systemPreset?: string;
  customSystemPrompt?: string;
}

export interface ModelOption {
  id: string;
  label: string;
  sizeMB: number;
  vramEst: string;
  vramTier?: '4gb' | '8gb' | '16gb' | '32gb';
  isReasoning?: boolean;
  isCoding?: boolean;
  isDefault?: boolean;
  isRecommended?: boolean;
  description?: string;
}

export interface Personality {
  id: string;
  name: string;
  badge: string;
  description: string;
  systemPrompt: string;
  avatar?: string;
  era?: string;
  writingStyle?: string;
  category?: 'practical' | 'philosophy' | 'science' | 'literature' | 'characters';
  book?: string;
}

export type Preset = Personality;

