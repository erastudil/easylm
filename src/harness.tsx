import React, { useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { ChatPane } from './shell/ChatPane';
import './styles/easylm.css';

// Temporary geometry harness for the prompt bar (NOT part of the app; deleted after use).
// Renders ChatPane in the empty state and flips idle / typed / generating so a
// headless browser can measure .chat-composer geometry in each state.
const Harness = () => {
  const [gen, setGen] = useState(false);
  const [text, setText] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: 8, padding: 8 }}>
        <button id="btn-idle" onClick={() => { setGen(false); setText(''); }}>idle</button>
        <button id="btn-typed" onClick={() => { setGen(false); setText('line one\nline two\nline three\nline four\nline five'); }}>typed</button>
        <button id="btn-gen" onClick={() => { setGen(true); setText(''); }}>generating</button>
      </div>
      <ChatPane
        compact={false}
        activeSession={undefined}
        isGenerating={gen}
        starterChips={[]}
        personalityName="Friendly Guide"
        inputPrompt={text}
        piiAlert={null}
        storageAlert={null}
        attachedDoc={null}
        fileInputRef={fileInputRef}
        messagesEndRef={messagesEndRef}
        modelReady={true}
        onLoadModel={() => {}}
        onShuffleChips={() => {}}
        onSendChip={() => {}}
        onOpenWelcome={() => {}}
        onOpenVoices={() => {}}
        onOpenDocument={() => {}}
        onRateMessage={() => {}}
        onDismissPii={() => {}}
        onDismissStorage={() => {}}
        onRemoveDoc={() => {}}
        onQuickAction={() => {}}
        onFilePicked={() => {}}
        onInputPrompt={setText}
        onSend={() => {}}
        onStop={() => {}}
      />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<Harness />);
