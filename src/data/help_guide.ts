export interface HelpSection {
  id: string;
  title: string;
  summary: string;
  content: string;
}

export const EASYLM_HELP_SECTIONS: HelpSection[] = [
  {
    id: 'intro',
    title: '👋 Welcome to EasyLM',
    summary: 'What is EasyLM and how does it work?',
    content: `EasyLM is your own private AI assistant that runs 100% inside your web browser. 

Unlike traditional AI services (like ChatGPT or Claude) that send your messages to massive cloud data centers, EasyLM downloads the AI model directly to your device and runs it using your computer or phone's graphics chip (WebGPU).

• 100% Private: Your chats, documents, and prompts never leave your device.
• Free Forever: No monthly subscriptions, no token meters, no credit cards.
• Zero Account Required: Just open the website and start talking.
• Runs Offline: Once the model weights are downloaded to your browser, it can work without an internet connection.`
  },
  {
    id: 'prompting',
    title: '💡 Prompting 101: How to Talk to AI',
    summary: 'Simple tips for parents, students, and beginners.',
    content: `Talking to an AI is just like talking to a very knowledgeable, patient helper. Here are four simple rules for great results:

1. Be Specific: Instead of "write an email", say "write a polite 3-sentence email thanking my child's teacher for extra math help."
2. Give It Context: Tell the AI who you are and who the answer is for (e.g. "explain photosynthesis so an 8-year-old can understand it").
3. Ask for Step-by-Step Thinking: If you have a puzzle or complex question, say "think step by step before answering."
4. Iterate: If the first response isn't quite right, just ask for changes! (e.g. "make it shorter" or "explain that second part more simply").`
  },
  {
    id: 'hallucination',
    title: '⚠️ What is "Hallucination"?',
    summary: 'Why AI sometimes makes things up, and how we prevent it.',
    content: `AI models don't "know" facts the way humans do—they predict what words naturally come next based on patterns they studied during training. 

Sometimes, an AI will write a statement that sounds confident and convincing, but is completely made up. This is called a "hallucination."

How EasyLM Protects You:
• Honest Deflection: EasyLM is trained to admit when it doesn't know something. It will naturally tell you: "I couldn't find a reliable answer for that, and I don't want to mislead you."
• Real In-App Tools: When you ask EasyLM to do math or convert units, it doesn't guess—it uses a real built-in calculator.
• Web Search: For live information, EasyLM looks up verified web and encyclopedia sources before answering.`
  },
  {
    id: 'tools',
    title: '⚡ Built-In Hands (Tools)',
    summary: 'Calculator, unit converter, web search, and webpage reader.',
    content: `EasyLM comes equipped with built-in tools that execute right inside your browser:

1. Math Calculator: Evaluates complex expressions with 100% mathematical accuracy (e.g. "sqrt(144) * 5200").
2. Unit Converter: Converts between metric, imperial, and common units (e.g. "how many fluid ounces are in 3.75 gallons?").
3. System Clock: Always knows the exact date, time, and your local timezone.
4. Web Search: Searches public search indexes and encyclopedias for real-world current events.
5. Webpage Reader: Paste any website link (e.g. "summarize https://example.com"), and EasyLM will read the page and answer your questions.`
  },
  {
    id: 'local-vs-cloud',
    title: '🏠 Local AI vs Cloud AI',
    summary: 'Why running locally on your hardware matters.',
    content: `Understanding the difference between Local AI and Cloud AI:

• Cloud AI (ChatGPT, Claude, Gemini):
  - Model runs on remote company servers.
  - Model is very large (70B to 1T+ parameters).
  - Requires internet, accounts, logins, and often monthly fees ($20/month).
  - Your prompts and uploaded documents are processed on external servers.

• Local AI (EasyLM):
  - Runs directly on your device's hardware using WebGPU.
  - Model is compact and highly optimized (1.5B to 3B parameters).
  - Completely private—zero tracking, zero server storage.
  - Free forever, unlimited use, with zero third-party snooping.`
  }
];

export const EASYLM_GUIDE_PROMPT_CONTEXT = `
[EASYLM SYSTEM KNOWLEDGE & HELP GUIDE]
Identity:
You are EasyLM, a completely free, 100% private AI assistant developed by Humans and AI (hnai).
You run entirely inside the user's web browser using their computer/phone hardware (WebGPU).
You never send prompts or documents to external cloud AI servers.

Key Capabilities:
1. In-App Tools: Built-in deterministic calculator (calc), unit converter (units), system clock (datetime), live web search (web_search), and webpage reader (web_fetch).
2. Honest Deflection: If you do not know an answer or if web tools return no verified results, NEVER make up facts. Warmly state: "I couldn't find a reliable answer for that, and I don't want to mislead you."
3. Personalities: You can switch between Friendly Guide, Critical Thinker, Creative Companion, and Coding Mentor.
4. Local Backup: Users can backup all their chats anytime to a JSON file on their computer via the "Backup to Disk" button.
5. File Drag & Drop: Users can drop text, code, or documents into the chat window to discuss them.

Teaching Tone:
You are exceptionally patient, warm, and clear when explaining AI, prompting, and technical concepts to parents, kids, and non-computer users. Use everyday analogies.
`;
