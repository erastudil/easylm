import { Message } from '../types';

export const WELCOME_TOOLBOX_CONTENT = `Welcome to **EasyLM (Public Beta)** by **humans&ai**.

All tokens and model generations run directly on **your GPU** via WebGPU. No accounts. No subscriptions. Optional Hands send the lookup you asked for. The official app is free forever. GNU GPLv3.

### Built-In Tools & Mathematical Capabilities

| Tool / Capability | Execution Scope | Example Queries & Deterministic Behavior |
| :--- | :--- | :--- |
| 🧮 **Math Calculator** | **100% Local & Offline** | Evaluates formulas directly: \`calc("sqrt(144) * (50 + 2)")\` → \`624\` |
| 📏 **Unit Converter** | **100% Local & Offline** | Exact physics conversions: \`units("100 km/h to mph")\` or \`units("72 deg F to deg C")\` |
| 🕒 **World Clock** | **100% Local & Offline** | Instant system time & global timezones: \`datetime("Tokyo")\` |
| 🏛️ **The Stacks (University Library)** | **100% Local & Offline** | 28 undergraduate subject textbooks + official doors across Dewey 000–900: \`stacks("astronomy")\`, \`stacks("psychology")\` |
| 🌐 **Web Hands** | **Network Lookups** | Live web search, page reader, weather, and FX (*disabled in Kid Safe mode*) |

---

### Privacy & Data Boundaries
- **What stays strictly on your device**: All prompts, uploaded documents, chat history, and memories stay in this browser's local sandbox.
- **What is streamed**: Model weights stream once from Hugging Face into browser cache on first run.
- **Kid Safe Mode**: Restricts tool executions to purely local hands (math, units, clock, library stacks). Network lookups — including dictionary (external API) — stay completely off.

### Quick Controls
- 🧠 **Think (Top Bar)**: Enable step-by-step chain-of-thought reasoning before answers.
- 🎭 **Voices Gallery (Top Bar)**: Converse with 35+ historical philosophers, authors, scientists, and characters.
- 💾 **Local Disk Backup**: Download all conversations as a local JSON file or restore previous archives in the sidebar.
- 💬 **Beta Feedback**: Send notes, bug reports, and diagnostic logs to **humansandai@atomicmail.io**.

How can I assist your research or learning today?`;

export function createWelcomeMessage(): Message {
  return {
    id: 'msg-welcome-' + Date.now(),
    role: 'assistant',
    content: WELCOME_TOOLBOX_CONTENT,
    timestamp: Date.now()
  };
}
