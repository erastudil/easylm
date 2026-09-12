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
    content: `### Welcome to EasyLM

EasyLM is an open, private learning environment and research assistant. It runs locally on your device's graphics processor (WebGPU) inside this browser window.

Unlike cloud services (such as ChatGPT, Claude, or Gemini), EasyLM does not transmit your prompts, documents, or conversation history to external company inference servers.

- **Private & Sovereign**: All chat tokens and text generations are computed locally on your GPU. Your chat history, sovereign memories, and uploaded documents remain strictly on this device.
- **Library of Human Knowledge**: EasyLM is designed as a digital library, an encyclopedia, a university seminar, and a laboratory for learning.
- **Offline Capable**: Once model weights are downloaded to your browser cache, EasyLM can operate completely offline without an internet connection when network tools are disabled.
- **Zero Account & Free Forever**: EasyLM is free and open source software licensed under the **GNU GPL-3.0**. No logins, subscriptions, paywalls, or tracking cookies.`
  },
  {
    id: 'topbar',
    title: '🧭 Header HUD & Top Bar Controls',
    summary: 'Guide to all buttons, indicators, and toggles on the top navigation bar.',
    content: `### Top Bar (Header HUD) Controls

The top bar provides quick access to runtime states, reasoning modes, and active tools:

1. **EasyLM Title & Public Beta Badge**: Indicates the active version of EasyLM. EasyLM is currently in Public Beta with active community feedback.
2. **Model Pill Badge**: Displays the currently active local language model (e.g., *Qwen 2.5 3B*). Click Settings (⚙) to switch models.
3. **🧠 Think (Extended Thinking Toggle)**:
   - When **ON**: The model engages step-by-step chain-of-thought reasoning before answering. An expandable **Thought Drawer** appears above the response displaying internal analysis, hypothesis testing, and logical deductions.
   - When **OFF**: The model produces direct, concise answers without intermediate reasoning traces.
4. **⚡ Hands (Tools Status Indicator)**:
   - Green indicator confirming that built-in tools are active.
   - In **Kid Safe** mode, Hands are restricted strictly to deterministic local tools (calculator, unit converter, clock, dictionary, knowledge warehouse).
   - In standard mode, Hands can also access live web search, webpage reading, weather forecasts, and currency exchange when requested.
5. **👤 Profile & Family Mode**:
   - Displays the current active profile avatar and name (e.g., *Student*, *Parent*, *Curious Learner*).
   - Click to open the **Profiles Modal**, switch user profiles, configure 4-digit **Parental Lock PIN**, manage sovereign memory items, or enable Kid Safe mode.
6. **🎭 Perspectives / Voices Gallery Pill**:
   - Displays the currently selected intellectual voice or literary character.
   - Click to browse 35+ historical philosophers, authors, scientists, and classic literary personas with extensive biographical stacks.
7. **? Help Guide**: Opens this comprehensive guide, prompting tips, and interface reference.
8. **💬 Public Beta Feedback**:
   - Opens the beta feedback dialog with a 5,000-character cap and a strict safe-attachment whitelist (\`.txt\`, \`.md\`, \`.docx\`, \`.png\`, \`.jpeg\`).
   - Generates an email draft directly to **humansandai@atomicmail.io** from your native mail client, accompanied by system diagnostics.
9. **⚙ Settings**: Opens the comprehensive application configuration panel.`
  },
  {
    id: 'sidebar',
    title: '📂 Sidebar & Session Management',
    summary: 'Organize chats, backup to local disk or Google Drive, and access resources.',
    content: `### Sidebar Navigation & Data Management

The sidebar allows you to organize your studies, manage conversation threads, and backup your work:

1. **➕ New Chat**:
   - Immediately initializes a clean, isolated conversation session.
2. **Session List (Chat History)**:
   - Displays all active sessions stored in your browser's local sandbox.
   - Click any session to switch to it instantly.
   - **Rename**: Click the pencil icon to assign a descriptive title to any chat.
   - **Delete**: Click the trash icon to permanently remove a session.
3. **💾 Backup to Disk**:
   - Exports all conversations, system prompts, and settings into a clean JSON file directly to your local downloads folder.
   - Completely offline and private; no intermediate servers or cloud accounts required.
4. **📥 Restore from Disk**:
   - Imports a previously saved EasyLM JSON backup file, restoring your conversation archive and sovereign memories into this browser.
5. **🎭 Voices Gallery**:
   - Direct shortcut to open the Perspectives Gallery modal.
6. **🔒 Parental Controls**:
   - Quick access to setup or verify the parental PIN and enforce safe study settings.
7. **💜 Support & Free Software**:
   - Opens the Support dialog with official **GNU GPL-3.0** licensing information, GitHub repository fork links, and verified donation addresses (Bitcoin, Solana, Cash App) to support independent development.`
  },
  {
    id: 'settings',
    title: '⚙️ All Settings & Configuration Options',
    summary: 'Detailed explanation of every parameter available in the Settings panel.',
    content: `### Settings Panel Configuration

The Settings dialog allows you to calibrate inference parameters, tool availability, and interface behavior:

1. **Local Model Selection**:
   - **Qwen 2.5 3B (Recommended)**: Best balance of deep reasoning, literary eloquence, and factual comprehension for desktop and laptop GPUs (~2.2 GB download).
   - **Qwen 2.5 1.5B (Fast & Mobile)**: High-speed, lightweight model optimized for mobile devices, older laptops, and integrated graphics (~1.1 GB download).
   - **Qwen 2.5 0.5B (Ultra-Light)**: Minimal memory footprint (~400 MB download) for resource-constrained hardware.
   - **DeepSeek R1 Distill Qwen 1.5B**: Specialized reasoning model trained for mathematical deduction, formal logic, and step-by-step problem decomposition.
2. **Creativity & Temperature**:
   - Sliders range from **0.0 to 1.0** (Default: \`0.3\`).
   - **Low Temperature (0.0 - 0.2)**: Highly deterministic, focused, and precise. Ideal for mathematics, formal logic, coding, and factual analysis.
   - **Medium Temperature (0.3 - 0.5)**: Balanced, articulate responses with natural phrasing.
   - **High Temperature (0.7 - 1.0)**: Exploratory, poetic, and diverse. Recommended for creative writing, worldbuilding, and brainstorming.
3. **⚡ In-App Hands (Tools) Toggle**:
   - **ON**: Enables EasyLM to execute deterministic tools (calculator, unit converter, clock, dictionary, weather, currency, search) whenever relevant.
   - **OFF**: Completely disables all tool calls. The model answers using only its internal knowledge weights with zero external lookups.
4. **Kid Safe Mode**:
   - When active, restricts all tool calling strictly to local hands: math calculator, unit converter, world clock, dictionary, and offline warehouse facts.
   - All network lookups (web search, webpage reader, live weather, currency) are permanently disabled.
5. **Custom System Instructions**:
   - Enter standing instructions or personal guidelines that prepend to every conversation (e.g., *"Always format mathematical proofs step-by-step"* or *"Cite relevant historical primary sources"*).
6. **SearXNG Search Engine URL**:
   - EasyLM supports private decentralized web search. By default, it uses a public SearXNG instance. You can input your own private, self-hosted SearXNG endpoint here for maximum query privacy.
7. **Show Welcome Guide on New Chat**:
   - When enabled, new conversations start with the structured welcome toolbox and capability reference.
   - When disabled, new conversations open to a clean, empty canvas.
8. **Storage Management & Model Cache**:
   - Displays estimated browser storage utilization and provides a clean reset option if you ever need to clear cached weights or reset local state.`
  },
  {
    id: 'prompting',
    title: '💡 Prompting 101: How to Inquire & Learn',
    summary: 'Effective strategies for asking questions, studying, and research.',
    content: `### Guide to Effective Inquiry

Interacting with a local model is like consulting an extensive academic library and working with an attentive scholar. Follow these practical techniques:

1. **Be Specific & Contextual**:
   - Instead of asking *"explain physics"*, specify: *"explain the difference between special and general relativity for a high school physics student."*
2. **State Your Objective**:
   - Let the model know what format you desire: a summary, a step-by-step tutorial, an outline, or a dialectical debate between two viewpoints.
3. **Request Step-by-Step Reasoning**:
   - For mathematical problems, coding logic, or ethical dilemmas, ask: *"Walk me through the reasoning step by step before stating the conclusion."* (You can also turn on the **🧠 Think** toggle in the top bar).
4. **Iterate & Refine**:
   - If a response is too dense or omits a nuance, guide it: *"Clarify the second point with a concrete real-world example"* or *"Provide counterarguments to this perspective."*`
  },
  {
    id: 'hallucination',
    title: '⚠️ Epistemic Limits & Honest Deflection',
    summary: 'Understanding prediction limits, fact verification, and how EasyLM avoids false claims.',
    content: `### Epistemic Limits & Honest Deflection

Language models generate text by identifying patterns, grammatical structures, and semantic relationships across vast corpora of literature and scholarship.

Because language generation is predictive rather than an infallible database query, models can occasionally generate plausible-sounding but factually inaccurate statements (referred to as *hallucination*).

#### How EasyLM Maintains Rigor:
- **Honest Deflection**: EasyLM's system prompts explicitly instruct the model to confess uncertainty rather than invent facts. If evidence is absent, it responds: *"I couldn't find a reliable answer for that, and I don't want to mislead you."*
- **Deterministic Math & Units**: For arithmetic, trigonometry, and unit conversions, EasyLM invokes real mathematical evaluators rather than guessing numerical values.
- **Transparent Tool Traces**: Every tool execution displays its inputs and returned values in a visible **Tool Drawer** directly in the chat stream.`
  },
  {
    id: 'tools',
    title: '⚡ Built-In Hands Reference',
    summary: 'Complete reference for math, unit conversion, clock, dictionary, facts, and web tools.',
    content: `### Built-In Hands (Tools) Reference

EasyLM includes a suite of deterministic local tools and transparent network lookups:

| Tool | Type | What It Does | Example Query |
| :--- | :--- | :--- | :--- |
| **Math Calculator** (\`calc\`) | Local / Offline | Exact arithmetic, powers, square roots, and trigonometric functions | \`calc("sqrt(144) * (50 + 2)")\` |
| **Unit Converter** (\`units\`) | Local / Offline | Converts temperatures, distances, volumes, weights, and velocities | \`units("100 km/h to mph")\` |
| **World Clock** (\`datetime\`) | Local / Offline | System time and global timezone calculations | \`datetime("London")\` |
| **Dictionary** (\`dictionary\`) | Network / API | Exact definitions, etymologies, parts of speech, and pronunciations | \`dictionary("epistemology")\` |
| **Encyclopedic Facts** (\`fact\`) | Network / API | Verified historical, biographical, and scientific summaries | \`fact("Galileo Galilei")\` |
| **Weather** (\`weather\`) | Network / API | Real-time meteorological conditions and forecasts | \`weather("Paris")\` |
| **Currency Exchange** (\`exchange\`) | Network / API | Live foreign exchange rates based on European Central Bank data | \`exchange("100 USD to EUR")\` |
| **Web Search & Reader** | Network / API | Live search queries and readable webpage extraction | \`web_search("James Webb findings")\` |`
  },
  {
    id: 'local-vs-cloud',
    title: '🏠 Local Computing vs Cloud Rented AI',
    summary: 'Why running locally on your own graphics hardware preserves privacy and freedom.',
    content: `### Local Computing vs Rented Cloud Services

| Property | Rented Cloud Services (ChatGPT / Claude / Gemini) | EasyLM (Local WebGPU) |
| :--- | :--- | :--- |
| **Execution Location** | Remote proprietary server clusters | Your personal graphics card (GPU) |
| **Data Privacy** | Prompts, attachments, and chats sent over network | Stays strictly inside your local browser sandbox |
| **Access Cost** | $20+/month subscription paywalls | Free forever under the GNU GPL-3.0 |
| **Account Requirement** | Mandatory accounts, phone numbers, tracking cookies | Zero accounts, zero tracking, zero personal data collection |
| **Offline Operation** | Impossible; ceases when internet is disconnected | Fully functional offline once model weights are cached |
| **Software Rights** | Closed proprietary black box | 100% Free & Open Source (copyleft protection) |`
  },
  {
    id: 'install',
    title: '📱 Add to Home Screen (PWA Installation)',
    summary: 'Install EasyLM as a standalone, full-screen app on iOS, Android, and Desktop.',
    content: `### Progressive Web App (PWA) Standalone Installation

EasyLM can be installed directly onto your phone, tablet, or desktop without proprietary app store gatekeepers:

- **Apple iOS & iPadOS (Safari)**:
  1. Navigate to \`https://easylm.vercel.app\` in Safari.
  2. Tap the **Share button** (the square with an upward arrow ⎋) at the bottom toolbar.
  3. Scroll down and select **"Add to Home Screen"** ➕.
  4. Tap **"Add"** in the top-right corner.
  *EasyLM will launch in full-screen standalone mode without URL bars, running on your device's WebGPU engine.*

- **Android & Chromebooks (Chrome / Edge / Brave)**:
  1. Open \`https://easylm.vercel.app\`.
  2. Tap the browser menu (⋮) in the top right.
  3. Select **"Install App"** or **"Add to Home screen"**.

- **Windows, macOS & Linux (Chrome / Edge / Brave)**:
  1. Click the install icon (a desktop screen with a down arrow) located on the right side of the address bar.
  2. Click **"Install"** to launch EasyLM in its own dedicated, native-feeling application window.`
  },
  {
    id: 'support',
    title: '💜 Mission, Support & GNU GPLv3',
    summary: 'Our commitment to open research, copyleft licensing, and contributor links.',
    content: `### Mission & Freedom

EasyLM is developed by **humans&ai** with a clear principle: advanced computational learning and tools must belong to everyone, not just those who can pay ongoing monthly subscriptions.

- **GNU General Public License v3.0 (GPLv3)**:
  EasyLM is guaranteed free software. Anyone may inspect, run, modify, and redistribute the source code. Any derivative work must remain equally free and open source under the GPLv3.
- **Contribute & Fork**:
  The official source code repository is available on GitHub. Contributions, bug reports, and pull requests from the community are warmly welcomed.
- **Voluntary Donations**:
  EasyLM has no paywalls or advertising. If you would like to support ongoing development, maintenance of web tools, and new model ports, you can contribute voluntarily via Bitcoin, Solana, or Cash App in the Support menu.`
  }
];

export const EASYLM_GUIDE_PROMPT_CONTEXT = `
[EASYLM SYSTEM ARCHITECTURE & INTERFACE REFERENCE]
Identity:
You are EasyLM, a sovereign, local learning assistant developed by humans&ai.
You run directly inside the user's browser using WebGPU hardware acceleration.
You never transmit prompts, conversations, or uploaded documents to cloud inference APIs.

Architecture & Capabilities:
1. Local Computing:
   - Inference runs on the user's graphics processor (WebGPU) with models like Qwen 2.5 3B, 1.5B, or 0.5B.
   - Once model weights stream into the browser cache, EasyLM can operate completely offline without internet when network tools are disabled.
2. In-App Hands (Tools):
   - Deterministic Local Tools: calc (arithmetic/formulas), units (physical unit conversion), datetime (system clock and global timezones), knowledge warehouse.
   - Transparent Network Tools: dictionary, fact summaries, live weather, currency exchange, web_search, and web_fetch.
   - Kid Safe Mode: Permanently enforces 100% local tools only. All network access is disabled.
3. Top Bar (Header HUD) Controls:
   - EasyLM Title & Public Beta Badge: Current release status.
   - Model Pill Badge: Shows active model (Qwen 2.5 3B / 1.5B / 0.5B).
   - 🧠 Think (Extended Thinking): Toggles chain-of-thought reasoning. When ON, the model deliberates and produces an expandable thought drawer before answering.
   - ⚡ Hands Badge: Displays whether in-app tool execution is active.
   - 👤 Profile Button: Switches between user profiles (Parent, Kid, Student), accesses 4-digit Parental PIN lock, and manages sovereign memories.
   - 🎭 Voices Gallery: Switches between 35+ historical philosophers, authors, scientists, and classic literary characters.
   - ? Help: Opens the comprehensive user guide and AI primer.
   - 💬 Feedback: Opens direct beta feedback modal to send writeups to humansandai@atomicmail.io.
   - ⚙ Settings: Accesses model choice, temperature slider (0.0 - 1.0), tool toggles, SearXNG URL, and welcome message preferences.
4. Sidebar Features:
   - ➕ New Chat: Starts a fresh session.
   - Session List: Search, rename, and delete local chats.
   - 📁 Google Drive Sync: Zero-server backup to Google Drive AppData sandbox with optional AES-GCM-256 WebCrypto passphrase encryption.
   - 💾 Backup to Disk: Exports all sessions to a local JSON file.
   - 📥 Restore from Disk: Imports chats from an EasyLM JSON backup.
   - 🔒 Parental Controls: Configure PIN lock for kid safety.
   - 💜 Support: Displays GPLv3 open source license, GitHub contributor links, and donation addresses.
5. Ethos & Tone:
   - You are a guide in a grand digital library, an encyclopedia, a university seminar, and a laboratory for learning.
   - Avoid sterile machine analogies (do NOT describe yourself as a machine, cyborg, or robot).
   - Epistemic Integrity: If a fact is unverified or unknown, honestly state: "I couldn't find a reliable answer for that, and I don't want to mislead you."
`;

