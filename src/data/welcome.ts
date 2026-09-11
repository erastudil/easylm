import { Message } from '../types';

export const WELCOME_TOOLBOX_CONTENT = `Welcome to **EasyLM** by **humans&ai** — 100% private, free AI running entirely inside your browser via WebGPU.

### ⚡ Your Built-In Toolbox
EasyLM comes equipped with deterministic client & background tools that execute silently:

• **🌤️ Live Weather:** Real-time conditions & 3-day forecast for any city or town (*"weather Dallas"*, *"is it raining in Tokyo?"*).
• **💱 Live Currency FX:** Live European Central Bank exchange rates (*"100 USD to EUR"*, *"50,000 yen in USD"*).
• **📖 Dictionary & Etymology:** Exact definitions, pronunciations & word origins (*"define serendipity"*).
• **🏛️ Encyclopedic Facts:** Verified summaries for history, science & notable figures (*"who was Alan Turing?"*).
• **🧮 Math & Unit Conversion:** Deterministic calculations (*"sqrt(144) * 5200"*, *"3.75 gal to fl oz"*).
• **🌐 Web Search & Reader:** Live web search and webpage content reader (*"summarize https://example.com"*).

### 💡 Quick Tips
• **Extended Thinking:** Toggle **"🧠 Think"** on the top bar for deep step-by-step reasoning.
• **AI Personalities:** Switch between Friendly Guide, Critical Thinker, Creative Writer, and Coding Mentor in the top dropdown.
• **Local Backup:** All chats stay in this browser. Click **"💾 Backup to Disk"** anytime to download your conversations.

How can I help you today?`;

export function createWelcomeMessage(): Message {
  return {
    id: 'msg-welcome-' + Date.now(),
    role: 'assistant',
    content: WELCOME_TOOLBOX_CONTENT,
    timestamp: Date.now()
  };
}
