import { Message } from '../types';

export const WELCOME_TOOLBOX_CONTENT = `Welcome to **EasyLM** by **humans&ai** — 100% private, free AI running entirely inside your browser via WebGPU.

### ⚡ Built-In Deterministic Toolbox
EasyLM comes equipped with local tools that execute automatically in the background:

- **🌤️ Live Weather:** Real-time conditions & 3-day forecast (*"weather Dallas"*, *"is it raining in Tokyo?"*).
- **💱 Currency FX:** Live European Central Bank exchange rates (*"100 USD to EUR"*, *"50,000 yen in USD"*).
- **📖 Dictionary & Etymology:** Exact definitions & word origins (*"define serendipity"*).
- **🏛️ Encyclopedic Facts:** Verified summaries for history, science & notable figures (*"who was Alan Turing?"*).
- **🧮 Math & Unit Conversion:** Deterministic calculations (*"sqrt(144) * 5200"*, *"3.75 gal to fl oz"*).
- **🌐 Web Search & Reader:** Live search & page content reader (*"summarize https://example.com"*).

### 💡 Quick Controls
- **🧠 Extended Thinking:** Toggle **"Think"** on the top bar for deep step-by-step reasoning.
- **🎭 22 Voices & Perspectives:** Click the personality pill (**Friendly Guide 🎭**) or sidebar to open the **Gallery** (Socrates, Feynman, Letterman’s Razor, Stoics, Kant, Wu Wei, Twain, Austen, Poe, and more).
- **💾 Local Backup:** All chats stay in this browser. Click **"Backup to Disk"** anytime in the sidebar.

How can I help you today?`;

export function createWelcomeMessage(): Message {
  return {
    id: 'msg-welcome-' + Date.now(),
    role: 'assistant',
    content: WELCOME_TOOLBOX_CONTENT,
    timestamp: Date.now()
  };
}
