import React, { useState } from 'react';
import { DeviceInfo } from '../engine/device';
import { AVAILABLE_MODELS } from '../engine/webllm';

export interface HardwareRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  deviceInfo: DeviceInfo | null;
  onConfirmLoad: (remember: boolean) => void;
  onDecline: (remember: boolean) => void;
  onOpenSettings?: () => void;
}

export const HardwareRecommendationModal: React.FC<HardwareRecommendationModalProps> = ({
  isOpen,
  onClose,
  deviceInfo,
  onConfirmLoad,
  onDecline,
  onOpenSettings
}) => {
  const [rememberSelection, setRememberSelection] = useState(false);

  if (!isOpen) return null;

  const recModelId = deviceInfo?.recommendedModel || 'easylm-gemma-4-e4b-it';
  const recModel = AVAILABLE_MODELS.find((m) => m.id === recModelId) || AVAILABLE_MODELS[0];

  const handleYes = () => {
    onConfirmLoad(rememberSelection);
  };

  const handleNo = () => {
    onDecline(rememberSelection);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 350,
        padding: '1rem',
        overflowX: 'hidden'
      }}
    >
      <div
        className="card-panel"
        style={{
          width: '100%',
          maxWidth: '480px',
          padding: '1.5rem',
          overflowX: 'hidden',
          backgroundColor: '#0c0c14',
          border: '1px solid rgba(139, 92, 246, 0.35)',
          borderRadius: '12px',
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.9), 0 0 20px rgba(139, 92, 246, 0.25)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
            paddingBottom: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>⚡</span>
            <h3
              style={{
                margin: 0,
                fontSize: '1.05rem',
                fontFamily: 'var(--font-mono)',
                color: '#ffffff',
                fontWeight: 600
              }}
            >
              Hardware Detected
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#71717a',
              fontSize: '1.4rem',
              cursor: 'pointer',
              lineHeight: 1
            }}
            title="Close"
          >
            ×
          </button>
        </div>

        {/* Hardware & Recommended Model Card */}
        <div
          style={{
            backgroundColor: '#111118',
            border: '1px solid rgba(139, 92, 246, 0.25)',
            borderRadius: '8px',
            padding: '0.85rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          {deviceInfo && (
            <div
              style={{
                fontSize: '0.72rem',
                color: '#a1a1aa',
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                flexWrap: 'wrap'
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: deviceInfo.hasWebGPU ? '#10b981' : '#f43f5e',
                  display: 'inline-block'
                }}
              />
              <span>
                <strong>Device:</strong> {deviceInfo.osName} · {deviceInfo.gpuVendor || 'WebGPU Adapter'}{' '}
                {deviceInfo.gpuRenderer ? `(${deviceInfo.gpuRenderer})` : ''}
              </span>
              <span style={{ color: '#a78bfa' }}>
                (~{deviceInfo.estimatedVRAMGB || 8} GB VRAM)
              </span>
            </div>
          )}

          <div
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.06)',
              paddingTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.2rem' }}>🧠</span>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                  {recModel?.label || recModelId}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#c4b5fd', fontFamily: 'var(--font-mono)' }}>
                  {recModel?.vramEst || '~2.5 GB VRAM'}
                  {recModel?.sizeMB ? ` · ~${Math.round((recModel.sizeMB / 1024) * 10) / 10} GB download` : ''}
                </div>
              </div>
            </div>
            <span
              style={{
                fontSize: '0.65rem',
                fontFamily: 'var(--font-mono)',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                backgroundColor: 'rgba(52, 211, 153, 0.15)',
                color: '#34d399',
                border: '1px solid rgba(52, 211, 153, 0.3)'
              }}
            >
              RECOMMENDED
            </span>
          </div>
        </div>

        {/* Question Prompt */}
        <div style={{ fontSize: '0.88rem', color: '#e4e4e7', lineHeight: 1.5 }}>
          Here is the recommended model for your device, do you want to load the weights from huggingface now?
        </div>

        {/* Buttons (Yes / No) */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
          <button
            type="button"
            className="btn-pill btn-pill-primary"
            onClick={handleYes}
            style={{
              flex: 1,
              padding: '0.6rem 1rem',
              fontSize: '0.88rem',
              fontWeight: 600,
              justifyContent: 'center'
            }}
          >
            Yes
          </button>
          <button
            type="button"
            className="btn-pill"
            onClick={handleNo}
            style={{
              flex: 1,
              padding: '0.6rem 1rem',
              fontSize: '0.88rem',
              justifyContent: 'center',
              backgroundColor: '#181822',
              color: '#a1a1aa'
            }}
          >
            No
          </button>
        </div>

        {/* Checkbox: Remember my selection, do not show this message again */}
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.78rem',
            color: '#a1a1aa',
            cursor: 'pointer',
            marginTop: '0.25rem'
          }}
        >
          <input
            type="checkbox"
            checked={rememberSelection}
            onChange={(e) => setRememberSelection(e.target.checked)}
            style={{ accentColor: '#8b5cf6', width: '1rem', height: '1rem', cursor: 'pointer' }}
          />
          <span>remember my selection, do not show this message again</span>
        </label>

        {/* Note: Change setting anytime in the settings menu */}
        <div
          style={{
            fontSize: '0.72rem',
            color: '#71717a',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            paddingTop: '0.65rem',
            textAlign: 'center'
          }}
        >
          change setting anytime in the settings menu.
          {onOpenSettings && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSettings();
              }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#a78bfa',
                textDecoration: 'underline',
                cursor: 'pointer',
                marginLeft: '0.35rem',
                fontSize: '0.72rem'
              }}
            >
              Settings
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
