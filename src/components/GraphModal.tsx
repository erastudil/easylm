import React, { useState, useMemo } from 'react';
import { generatePlotSvg, PlotOptions } from '../engine/plot';
import { downloadBlob, sanitizeFilename } from '../engine/export';

interface GraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertGraph?: (svgCode: string, title: string) => void;
}

export const GraphModal: React.FC<GraphModalProps> = ({
  isOpen,
  onClose,
  onInsertGraph
}) => {
  const [fnStr, setFnStr] = useState('x^2 - 4');
  const [title, setTitle] = useState('Parabola: y = x^2 - 4');
  const [xMin, setXMin] = useState(-5);
  const [xMax, setXMax] = useState(5);
  const [yMin, setYMin] = useState<number | undefined>(undefined);
  const [yMax, setYMax] = useState<number | undefined>(undefined);
  const [customY, setCustomY] = useState(false);
  const [copied, setCopied] = useState(false);

  const presets = [
    { label: 'x^2 - 4', fn: 'x^2 - 4', title: 'Quadratic: y = x^2 - 4', min: -5, max: 5 },
    { label: 'sin(x)', fn: 'sin(x)', title: 'Sine Wave: y = sin(x)', min: -6.28, max: 6.28 },
    { label: 'cos(x)', fn: 'cos(x)', title: 'Cosine Wave: y = cos(x)', min: -6.28, max: 6.28 },
    { label: 'x^3 - 3x', fn: 'x^3 - 3*x', title: 'Cubic: y = x^3 - 3x', min: -3, max: 3 },
    { label: 'sqrt(x)', fn: 'sqrt(x)', title: 'Square Root: y = sqrt(x)', min: 0, max: 25 },
    { label: '1 / x', fn: '1 / x', title: 'Hyperbola: y = 1/x', min: -5, max: 5 },
    { label: 'abs(x)', fn: 'abs(x)', title: 'Absolute Value: y = |x|', min: -6, max: 6 },
    { label: '2^x', fn: '2^x', title: 'Exponential: y = 2^x', min: -4, max: 6 }
  ];

  const plotOptions: PlotOptions = useMemo(() => ({
    fn: fnStr,
    title,
    xMin,
    xMax,
    yMin: customY ? yMin : undefined,
    yMax: customY ? yMax : undefined,
    width: 620,
    height: 380,
    color: '#a78bfa'
  }), [fnStr, title, xMin, xMax, yMin, yMax, customY]);

  const svgOutput = useMemo(() => {
    try {
      return generatePlotSvg(plotOptions);
    } catch {
      return '<svg><text x="20" y="20" fill="red">Invalid function</text></svg>';
    }
  }, [plotOptions]);

  if (!isOpen) return null;

  const handleDownloadSvg = () => {
    downloadBlob(svgOutput, `${sanitizeFilename(title || 'graph')}.svg`, 'image/svg+xml');
  };

  const handleCopySvg = async () => {
    try {
      await navigator.clipboard.writeText(svgOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.88)',
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
          maxWidth: '780px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: 0,
          backgroundColor: '#09090e',
          border: '1px solid rgba(139, 92, 246, 0.35)',
          borderRadius: '12px',
          boxShadow: '0 0 35px rgba(139, 92, 246, 0.2)'
        }}
      >
        {/* Fixed Header (Never scrolls away) */}
        <div style={{
          padding: '1.25rem 1.5rem 0.85rem',
          borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
          backgroundColor: '#09090e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.15rem', color: '#ffffff', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>📈</span> Math Grapher &amp; Coordinate Plane
            </h2>
            <div style={{ fontSize: '0.74rem', color: '#a1a1aa', marginTop: '0.15rem' }}>
              Deterministic 2D function plotting and vector SVG chart export.
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#71717a', fontSize: '1.5rem', cursor: 'pointer', padding: '0 0.4rem', lineHeight: 1 }}
            title="Close"
          >
            ×
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div style={{
          padding: '1.25rem 1.5rem 1.5rem',
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>

        {/* Function Input & Presets */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontFamily: 'var(--font-mono)', color: '#c4b5fd', fontWeight: 600 }}>
              f(x) =
            </span>
            <input
              type="text"
              value={fnStr}
              onChange={(e) => setFnStr(e.target.value)}
              placeholder="e.g. sin(x), x^2 - 4, sqrt(x), 2*x + 1"
              style={{
                flex: 1,
                background: '#111118',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                borderRadius: '6px',
                color: '#ffffff',
                padding: '0.45rem 0.75rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem'
              }}
            />
          </div>

          {/* Quick Presets */}
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: '#71717a', fontFamily: 'var(--font-mono)' }}>Presets:</span>
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setFnStr(p.fn);
                  setTitle(p.title);
                  setXMin(p.min);
                  setXMax(p.max);
                }}
                className="btn-pill"
                style={{
                  fontSize: '0.7rem',
                  padding: '0.2rem 0.5rem',
                  backgroundColor: fnStr === p.fn ? 'rgba(139, 92, 246, 0.25)' : '#111118',
                  borderColor: fnStr === p.fn ? '#8b5cf6' : 'rgba(139, 92, 246, 0.2)',
                  color: fnStr === p.fn ? '#ffffff' : '#a1a1aa'
                }}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Domain Bounds Controls */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '0.6rem',
          background: '#111118',
          border: '1px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '8px',
          padding: '0.65rem 0.85rem'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.68rem', color: '#a1a1aa', fontFamily: 'var(--font-mono)', marginBottom: '0.2rem' }}>X Min</label>
            <input
              type="number"
              value={xMin}
              onChange={(e) => setXMin(parseFloat(e.target.value) || -10)}
              style={{ width: '100%', background: '#07070a', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '4px', color: '#fff', padding: '0.3rem 0.5rem', fontSize: '0.76rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.68rem', color: '#a1a1aa', fontFamily: 'var(--font-mono)', marginBottom: '0.2rem' }}>X Max</label>
            <input
              type="number"
              value={xMax}
              onChange={(e) => setXMax(parseFloat(e.target.value) || 10)}
              style={{ width: '100%', background: '#07070a', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '4px', color: '#fff', padding: '0.3rem 0.5rem', fontSize: '0.76rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.68rem', color: '#a1a1aa', fontFamily: 'var(--font-mono)', marginBottom: '0.2rem' }}>Chart Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', background: '#07070a', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: '4px', color: '#fff', padding: '0.3rem 0.5rem', fontSize: '0.76rem' }}
            />
          </div>
        </div>

        {/* Live SVG Graph Canvas */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#07070a',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          borderRadius: '8px',
          padding: '0.5rem',
          minHeight: '340px'
        }}>
          <div dangerouslySetInnerHTML={{ __html: svgOutput }} style={{ width: '100%', display: 'flex', justifyContent: 'center' }} />
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              onClick={handleDownloadSvg}
              className="btn-pill"
              style={{ fontSize: '0.76rem', padding: '0.35rem 0.75rem', backgroundColor: 'rgba(139, 92, 246, 0.2)', borderColor: '#8b5cf6', color: '#ffffff' }}
              title="Download vector SVG file"
            >
              <span>📥</span> Download SVG
            </button>
            <button
              onClick={handleCopySvg}
              className="btn-pill"
              style={{ fontSize: '0.76rem', padding: '0.35rem 0.75rem' }}
              title="Copy SVG markup to clipboard"
            >
              <span>📋</span> {copied ? 'Copied SVG!' : 'Copy SVG'}
            </button>
            {onInsertGraph && (
              <button
                onClick={() => {
                  onInsertGraph(svgOutput, title);
                  onClose();
                }}
                className="btn-pill"
                style={{ fontSize: '0.76rem', padding: '0.35rem 0.75rem', borderColor: '#34d399', color: '#34d399' }}
              >
                <span>➕</span> Insert into Chat
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="btn-pill btn-pill-primary"
            style={{ padding: '0.45rem 1.25rem', fontSize: '0.82rem' }}
          >
            Done
          </button>
        </div>
        </div>
      </div>
    </div>
  );
};
