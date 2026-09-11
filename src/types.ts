export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  thinking?: string;
  thoughtDurationMs?: number;
  toolsUsed?: ToolExecution[];
  timestamp: number;
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
  isReasoning?: boolean;
}

export interface Personality {
  id: string;
  name: string;
  badge: string;
  description: string;
  systemPrompt: string;
}

export type Preset = Personality;

