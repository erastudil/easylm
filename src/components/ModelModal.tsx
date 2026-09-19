import React, { useState, useEffect } from 'react';
import { ModelOption } from '../types';
import { AVAILABLE_MODELS, registerCustomHFModel, ProgressStatus, resetWebGPUAndCaches } from '../engine/webllm';
import { DeviceInfo } from '../engine/device';

interface ModelModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: string;
  onSelectModel: (id: string) => void;
  deviceInfo?: DeviceInfo | null;
  isModelReady?: boolean;
  onLoadModel?: (id: string) => void;
  modelProgress?: ProgressStatus | null;
}

export const ModelModal: React.FC<ModelModalProps> = ({
  isOpen,
  onClose,
  selectedModel,
  onSelectModel,
  deviceInfo,
  isModelReady,
  onLoadModel,
  modelProgress
}) => {
  const [activeTab, setActiveTab] = useState<'all' | '4gb' | '8gb' | '16gb' | 'hf'>('all');
  const [hfQuery, setHfQuery] = useState('');
  const [hfResults, setHfResults] = useState<Array<{ id: string; downloads?: number; likes?: number }>>([]);
  const [hfLoading, setHfLoading] = useState(false);
  const [hfError, setHfError] = useState<string | null>(null);
  const [cacheNotice, setCacheNotice] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const handleResetCache = async () => {
    setIsResetting(true);
    setCacheNotice(null);
    try {
      const res = await resetWebGPUAndCaches(selectedModel);
      setCacheNotice(res.message || 'Cache cleared & WebGPU reset.');
    } catch (e: any) {
      setCacheNotice(`Notice: ${e?.message || e}`);
    } finally {
      setIsResetting(false);
    }
  };

  if (!isOpen) return null;

  const filteredModels = AVAILABLE_MODELS.filter(m => {
    if (activeTab === 'all') return true;
    if (activeTab === '4gb') return m.vramTier === '4gb';
    if (activeTab === '8gb') return m.vramTier === '8gb';
    if (activeTab === '16gb') return m.vramTier === '16gb';
    return true;
  });

  const handleSearchHf = async () => {
    const q = hfQuery.trim() || 'mlc-ai';
    setHfLoading(true);
    setHfError(null);
    try {
      const searchTarget = q.includes('mlc') ? q : `${q} mlc`;
      const resp = await fetch(`https://huggingface.co/api/models?search=${encodeURIComponent(searchTarget)}&limit=12&full=false`);
      if (!resp.ok) throw new Error(`Hugging Face API returned HTTP ${resp.status}`);
      const data = await resp.json();
      if (Array.isArray(data)) {
        setHfResults(data.map((m: any) => ({
          id: m.id,
          downloads: m.downloads,
          likes: m.likes
        })));
      } else {
        setHfResults([]);
      }
    } catch (err: any) {
      setHfError(err?.message || 'Failed to query Hugging Face API');
    } finally {
      setHfLoading(false);
    }
  };

  const handleSelectCustomHfModel = (repoId: string) => {
    const modelId = repoId.split('/')[1] || repoId;
    registerCustomHFModel({
      model: `https://huggingface.co/${repoId}`,
      model_id: modelId,
      model_lib: `https://raw.githubusercontent.com/mlc-ai/binary-mlc-llm-libs/main/web-llm-models/v0_2_84/base/${modelId}_cs1k-webgpu.wasm`,
      vram_required_MB: 4000
    });
    onSelectModel(modelId);
    if (onLoadModel) onLoadModel(modelId);
    onClose();
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 150,
      padding: '1rem'
    }}>
      <div
        className="card-panel"
        style={{
          width: '100%',
          maxWidth: '840px',
          height: '88vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.5rem',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexShrink: 0 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff' }}>
              <span>🧠</span> WebGPU Model Selection &amp; VRAM Tiers
            </h2>
            <div style={{ fontSize: '0.78rem', color: '#a1a1aa', marginTop: '0.2rem' }}>
              Select a model tailored to your GPU VRAM. Tokens stream directly from your browser memory.
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#71717a', fontSize: '1.5rem', cursor: 'pointer', padding: '0 0.25rem' }}
            title="Close"
          >
            ×
          </button>
        </div>

        {/* Hardware Status Banner */}
        {deviceInfo && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
            padding: '0.55rem 0.85rem',
            backgroundColor: 'rgba(139, 92, 246, 0.08)',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            borderRadius: '8px',
            marginBottom: '0.85rem',
            fontSize: '0.76rem',
            fontFamily: 'var(--font-mono)',
            flexShrink: 0
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e4e4e7', flexWrap: 'wrap' }}>
              <span style={{
                display: 'inline-block',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: deviceInfo.hasWebGPU ? '#10b981' : '#ef4444'
              }} />
              <span><strong>Hardware:</strong> {deviceInfo.osName} · {deviceInfo.gpuVendor || 'WebGPU Adapter'} {deviceInfo.gpuRenderer ? `(${deviceInfo.gpuRenderer})` : ''}</span>
              <span style={{ color: '#a78bfa' }}>(~{deviceInfo.estimatedVRAMGB || 8} GB VRAM)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={handleResetCache}
                disabled={isResetting}
                className="btn-pill"
                style={{
                  fontSize: '0.68rem',
                  padding: '0.2rem 0.55rem',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  borderColor: 'rgba(239, 68, 68, 0.3)',
                  color: '#fca5a5',
                  cursor: 'pointer'
                }}
                title="Clear cached model weights from browser storage and reset WebGPU adapter"
              >
                {isResetting ? 'Resetting...' : '🧹 Clear Cache & Reset WebGPU'}
              </button>
              <span style={{
                padding: '0.1rem 0.4rem',
                borderRadius: '9999px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontWeight: 600
              }}>
                Recommended: {deviceInfo?.recommendedModel ? (AVAILABLE_MODELS.find(m => m.id === deviceInfo.recommendedModel)?.label || deviceInfo.recommendedModel) : 'Qwen 2.5 3B'}
              </span>
            </div>
            {cacheNotice && (
              <div style={{ width: '100%', fontSize: '0.7rem', color: '#34d399', marginTop: '0.2rem' }}>
                ✓ {cacheNotice}
              </div>
            )}
          </div>
        )}

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.85rem', flexShrink: 0 }}>
          {[
            { id: 'all', label: 'All Models', count: AVAILABLE_MODELS.length },
            { id: '8gb', label: '6GB–8GB (Standard / Laptops)', count: AVAILABLE_MODELS.filter(m => m.vramTier === '8gb').length },
            { id: '4gb', label: '4GB (Ultralight / Mobile)', count: AVAILABLE_MODELS.filter(m => m.vramTier === '4gb').length },
            { id: '16gb', label: '8GB–16GB (High Performance)', count: AVAILABLE_MODELS.filter(m => m.vramTier === '16gb').length },
            { id: 'hf', label: '🤗 Search Hugging Face', count: undefined }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="btn-pill"
              style={{
                fontSize: '0.75rem',
                padding: '0.3rem 0.75rem',
                backgroundColor: activeTab === tab.id ? 'rgba(139, 92, 246, 0.25)' : '#111118',
                borderColor: activeTab === tab.id ? '#8b5cf6' : 'rgba(139, 92, 246, 0.2)',
                color: activeTab === tab.id ? '#ffffff' : '#a1a1aa',
                cursor: 'pointer'
              }}
            >
              {tab.label} {tab.count !== undefined ? `(${tab.count})` : ''}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '0.25rem' }}>
          {activeTab === 'hf' ? (
            /* Hugging Face Explorer */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{
                padding: '0.75rem',
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                fontSize: '0.8rem',
                color: '#d4d4d8'
              }}>
                <p style={{ margin: '0 0 0.5rem 0' }}>
                  🤗 <strong>Hugging Face WebLLM Streamer</strong>: Search and stream any WebLLM-quantized model directly from Hugging Face repositories into your WebGPU device.
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Search Hugging Face models (e.g. 'mlc-ai', 'Qwen2.5', 'Llama-3.2')..."
                    value={hfQuery}
                    onChange={(e) => setHfQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearchHf()}
                    style={{
                      flex: 1,
                      backgroundColor: '#07070a',
                      border: '1px solid rgba(139, 92, 246, 0.35)',
                      borderRadius: '6px',
                      color: '#ffffff',
                      padding: '0.45rem 0.75rem',
                      fontSize: '0.82rem'
                    }}
                  />
                  <button
                    onClick={handleSearchHf}
                    className="btn-pill"
                    style={{ backgroundColor: '#8b5cf6', color: '#ffffff', borderColor: '#8b5cf6', padding: '0.45rem 1rem' }}
                    disabled={hfLoading}
                  >
                    {hfLoading ? 'Searching...' : 'Search HF'}
                  </button>
                </div>
              </div>

              {hfError && (
                <div style={{ color: '#ef4444', fontSize: '0.8rem', padding: '0.5rem' }}>
                  ⚠️ {hfError}
                </div>
              )}

              {hfResults.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '0.65rem' }}>
                  {hfResults.map(res => (
                    <div
                      key={res.id}
                      style={{
                        padding: '0.75rem',
                        backgroundColor: '#111118',
                        border: '1px solid rgba(139, 92, 246, 0.25)',
                        borderRadius: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '0.5rem'
                      }}
                    >
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.82rem', fontWeight: 600, color: '#ffffff', wordBreak: 'break-all' }}>
                          {res.id}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#71717a', marginTop: '0.25rem' }}>
                          {res.downloads !== undefined ? `⬇️ ${res.downloads.toLocaleString()} downloads` : ''} {res.likes !== undefined ? `· ❤️ ${res.likes}` : ''}
                        </div>
                      </div>
                      <button
                        onClick={() => handleSelectCustomHfModel(res.id)}
                        className="btn-pill"
                        style={{
                          fontSize: '0.74rem',
                          padding: '0.3rem 0.6rem',
                          backgroundColor: 'rgba(139, 92, 246, 0.2)',
                          borderColor: '#8b5cf6',
                          color: '#c4b5fd',
                          justifyContent: 'center'
                        }}
                      >
                        ⚡ Stream to WebGPU
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                !hfLoading && (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#71717a', fontSize: '0.82rem' }}>
                    Type a query or search for community WebLLM models hosted on Hugging Face.
                  </div>
                )
              )}
            </div>
          ) : (
            /* Curated Model Suite Grid */
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(255px, 1fr))', gap: '0.75rem' }}>
              {filteredModels.map(m => {
                const isSelected = selectedModel === m.id;
                const isCurrentlyReady = isSelected && isModelReady;
                return (
                  <div
                    key={m.id}
                    onClick={() => onSelectModel(m.id)}
                    style={{
                      padding: '0.85rem',
                      backgroundColor: isSelected ? 'rgba(139, 92, 246, 0.12)' : '#111118',
                      border: isSelected ? '1.5px solid #8b5cf6' : '1px solid rgba(139, 92, 246, 0.2)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div>
                      {/* Top Badges Row */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.3rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                        <span style={{
                          fontSize: '0.66rem',
                          fontFamily: 'var(--font-mono)',
                          padding: '0.1rem 0.4rem',
                          borderRadius: '4px',
                          backgroundColor: m.vramTier === '4gb' ? 'rgba(56, 189, 248, 0.15)' : m.vramTier === '8gb' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(236, 72, 153, 0.15)',
                          color: m.vramTier === '4gb' ? '#38bdf8' : m.vramTier === '8gb' ? '#34d399' : '#f472b6',
                          fontWeight: 600
                        }}>
                          {m.vramEst}
                        </span>

                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          {m.isDefault && (
                            <span style={{ fontSize: '0.64rem', padding: '0.1rem 0.35rem', borderRadius: '4px', backgroundColor: 'rgba(234, 179, 8, 0.15)', color: '#fde047', fontWeight: 600 }}>
                              Default
                            </span>
                          )}
                          {(deviceInfo?.recommendedModel === m.id || (!deviceInfo && m.isRecommended)) && (
                            <span style={{ fontSize: '0.64rem', padding: '0.1rem 0.35rem', borderRadius: '4px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: '#34d399', fontWeight: 600 }}>
                              ★ Recommended
                            </span>
                          )}
                          {m.isReasoning && (
                            <span style={{ fontSize: '0.64rem', padding: '0.1rem 0.35rem', borderRadius: '4px', backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', fontWeight: 600 }}>
                              🧠 Think
                            </span>
                          )}
                          {m.isCoding && (
                            <span style={{ fontSize: '0.64rem', padding: '0.1rem 0.35rem', borderRadius: '4px', backgroundColor: 'rgba(14, 165, 233, 0.2)', color: '#38bdf8', fontWeight: 600 }}>
                              💻 Code
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Model Label */}
                      <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#ffffff', marginBottom: '0.3rem', fontFamily: 'var(--font-mono)' }}>
                        {m.label}
                      </div>

                      {/* Description */}
                      <div style={{ fontSize: '0.74rem', color: '#a1a1aa', lineHeight: 1.45, marginBottom: '0.6rem' }}>
                        {m.description}
                      </div>
                    </div>

                    {/* Footer / Action */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: '0.4rem', fontSize: '0.72rem' }}>
                      <span style={{ color: '#71717a' }}>
                        Download: ~{(m.sizeMB / 1024).toFixed(1)} GB
                      </span>

                      {isSelected ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          {isCurrentlyReady ? (
                            <span style={{ color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                              Loaded
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (onLoadModel) onLoadModel(m.id);
                              }}
                              className="btn-pill"
                              style={{
                                fontSize: '0.68rem',
                                padding: '0.2rem 0.5rem',
                                backgroundColor: 'rgba(139, 92, 246, 0.25)',
                                borderColor: '#8b5cf6',
                                color: '#ffffff'
                              }}
                            >
                              ⚡ Load Now
                            </button>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: '#8b5cf6', fontWeight: 500 }}>
                          Select →
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '0.85rem',
          borderTop: '1px solid rgba(139, 92, 246, 0.2)',
          marginTop: '0.85rem',
          flexShrink: 0
        }}>
          <div style={{ fontSize: '0.74rem', color: '#71717a', maxWidth: '520px' }}>
            💡 <strong>Guideline:</strong> Qwen 2.5 3B is the recommended default for 8GB cards. Bonsai 2 is recommended for high performance cards (~12GB VRAM and under).
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {onLoadModel && (
              <button
                onClick={() => {
                  onLoadModel(selectedModel);
                  onClose();
                }}
                className="btn-pill"
                style={{
                  backgroundColor: 'rgba(139, 92, 246, 0.25)',
                  borderColor: '#8b5cf6',
                  color: '#ffffff',
                  padding: '0.4rem 0.85rem',
                  fontSize: '0.78rem'
                }}
              >
                ⚡ Load Selected Model
              </button>
            )}
            <button
              onClick={onClose}
              className="btn-pill"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem' }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
