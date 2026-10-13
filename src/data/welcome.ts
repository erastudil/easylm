import { Message } from '../types';

export const WELCOME_TOOLBOX_CONTENT = `Welcome to **EasyLM** — a free AI tutor that runs right here in your browser, by **humans&ai**.

No account. No subscription. Nothing you type leaves this device.

### Start right now — no download needed

- **Math answers you can trust** — exact calculations, not guesses. Try: *what is sqrt(144) x (50 + 2)?*
- **Convert anything** — try: *100 km/h to mph*, or *72 F in C*
- **World clock** — try: *what time is it in Tokyo?*
- **The Stacks** — a built-in library of 32 textbooks. Try: *open the astronomy book*, or *show me psychology*

### Want full conversations?

You can download a model — one time, free — and EasyLM can chat with you, explain topics step by step, and help with homework. The download stays on your device and works offline after that. Everything above keeps working either way, so there is no hurry: start learning now, download when you feel like it.

You can also talk with 65+ voices — philosophers, authors, scientists, and characters — from the Voices gallery in the top bar.

### For families

Kid Safe mode keeps everything on the device and age-appropriate, behind a parent PIN. No web lookups, no surprises.

Questions or bugs? Write to **humansandai@atomicmail.io**.

What would you like to learn today?`;

export function createWelcomeMessage(): Message {
  return {
    id: 'msg-welcome-' + Date.now(),
    role: 'assistant',
    content: WELCOME_TOOLBOX_CONTENT,
    timestamp: Date.now()
  };
}
