import { execMath } from './math';

export interface PlotOptions {
  fn?: string; // Mathematical expression like "sin(x)", "x^2 - 4", "exp(-x)"
  points?: Array<{ x: number; y: number; label?: string }>;
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  width?: number;
  height?: number;
  title?: string;
  xLabel?: string;
  yLabel?: string;
  color?: string;
}

export interface SamplePoint {
  x: number;
  y: number;
  valid: boolean;
}

/**
 * Safely evaluates a single-variable expression f(x) using deterministic math.
 */
export function evalFx(fnStr: string, x: number): number {
  if (!fnStr || typeof fnStr !== 'string') return NaN;

  // Handle forms like 2x, 3.5x -> 2 * x, 3.5 * x
  let cleaned = fnStr.replace(/(\d+(?:\.\d+)?)\s*([xX])\b/g, '$1 * $2');

  // Replace variable x with (value) strictly at word boundaries so functions like exp() are not broken
  cleaned = cleaned.replace(/\b[xX]\b/g, `(${x})`);

  try {
    const res = execMath(cleaned);
    if (res.ok && res.result != null) {
      const num = Number(res.result);
      return Number.isFinite(num) ? num : NaN;
    }
    return NaN;
  } catch {
    return NaN;
  }
}

/**
 * Samples a function across a domain [xMin, xMax].
 */
export function sampleFunction(
  fnStr: string,
  xMin: number = -10,
  xMax: number = 10,
  numSamples: number = 200
): SamplePoint[] {
  const points: SamplePoint[] = [];
  const step = (xMax - xMin) / (numSamples - 1);

  for (let i = 0; i < numSamples; i++) {
    const x = xMin + i * step;
    const y = evalFx(fnStr, x);
    const valid = Number.isFinite(y) && !Number.isNaN(y) && Math.abs(y) < 1e7;
    points.push({ x, y: valid ? y : 0, valid });
  }

  return points;
}

/**
 * Generates an SVG vector graphic representing the mathematical coordinate plane and graph.
 */
export function generatePlotSvg(options: PlotOptions): string {
  const width = options.width || 600;
  const height = options.height || 400;
  const margin = { top: 40, right: 30, bottom: 45, left: 55 };

  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;

  let xMin = options.xMin ?? -10;
  let xMax = options.xMax ?? 10;
  if (xMin >= xMax) {
    xMin = -10;
    xMax = 10;
  }

  // Sample points if function provided
  const samples: SamplePoint[] = options.fn
    ? sampleFunction(options.fn, xMin, xMax, 240)
    : [];

  // Determine Y range
  let yMin = options.yMin;
  let yMax = options.yMax;

  if (yMin == null || yMax == null) {
    const validY = samples.filter((p) => p.valid).map((p) => p.y);
    if (options.points) {
      for (const p of options.points) validY.push(p.y);
    }
    if (validY.length > 0) {
      const minVal = Math.min(...validY);
      const maxVal = Math.max(...validY);
      const span = maxVal - minVal || 2;
      const pad = span * 0.15;
      if (yMin == null) yMin = Math.floor(minVal - pad);
      if (yMax == null) yMax = Math.ceil(maxVal + pad);
    } else {
      yMin = -10;
      yMax = 10;
    }
  }

  // Clamp insane asymptotes
  if (yMax - yMin > 1000) {
    yMin = -50;
    yMax = 50;
  }
  if (yMin >= yMax) {
    yMin = -10;
    yMax = 10;
  }

  const toSvgX = (x: number) => margin.left + ((x - xMin) / (xMax - xMin)) * plotW;
  const toSvgY = (y: number) => margin.top + plotH - ((y - yMin!) / (yMax! - yMin!)) * plotH;

  // Generate grid lines & ticks
  const gridLines: string[] = [];
  const tickLabels: string[] = [];

  const xTicks = 8;
  const xStep = (xMax - xMin) / xTicks;
  for (let i = 0; i <= xTicks; i++) {
    const val = xMin + i * xStep;
    const sx = toSvgX(val);
    gridLines.push(`<line x1="${sx.toFixed(1)}" y1="${margin.top}" x2="${sx.toFixed(1)}" y2="${margin.top + plotH}" stroke="rgba(139, 92, 246, 0.15)" stroke-dasharray="3,3" />`);
    tickLabels.push(`<text x="${sx.toFixed(1)}" y="${margin.top + plotH + 18}" fill="#71717a" font-size="11" text-anchor="middle" font-family="monospace">${val.toFixed(Math.abs(val) < 10 ? 1 : 0)}</text>`);
  }

  const yTicks = 6;
  const yStep = (yMax - yMin) / yTicks;
  for (let i = 0; i <= yTicks; i++) {
    const val = yMin + i * yStep;
    const sy = toSvgY(val);
    gridLines.push(`<line x1="${margin.left}" y1="${sy.toFixed(1)}" x2="${margin.left + plotW}" y2="${sy.toFixed(1)}" stroke="rgba(139, 92, 246, 0.15)" stroke-dasharray="3,3" />`);
    tickLabels.push(`<text x="${margin.left - 8}" y="${(sy + 4).toFixed(1)}" fill="#71717a" font-size="11" text-anchor="end" font-family="monospace">${val.toFixed(Math.abs(val) < 10 ? 1 : 0)}</text>`);
  }

  // Axes (x=0 and y=0 lines)
  const axes: string[] = [];
  if (xMin <= 0 && xMax >= 0) {
    const zeroX = toSvgX(0);
    axes.push(`<line x1="${zeroX.toFixed(1)}" y1="${margin.top}" x2="${zeroX.toFixed(1)}" y2="${margin.top + plotH}" stroke="#8b5cf6" stroke-width="1.5" />`);
  }
  if (yMin <= 0 && yMax >= 0) {
    const zeroY = toSvgY(0);
    axes.push(`<line x1="${margin.left}" y1="${zeroY.toFixed(1)}" x2="${margin.left + plotW}" y2="${zeroY.toFixed(1)}" stroke="#8b5cf6" stroke-width="1.5" />`);
  }

  // Curve path
  let pathD = '';
  let inSegment = false;
  const color = options.color || '#c4b5fd';

  for (const pt of samples) {
    if (!pt.valid || pt.y < yMin! || pt.y > yMax!) {
      inSegment = false;
      continue;
    }
    const sx = toSvgX(pt.x).toFixed(1);
    const sy = toSvgY(pt.y).toFixed(1);
    if (!inSegment) {
      pathD += `M ${sx} ${sy} `;
      inSegment = true;
    } else {
      pathD += `L ${sx} ${sy} `;
    }
  }

  // Data points
  const pointsSvg: string[] = [];
  if (options.points) {
    for (const p of options.points) {
      if (p.x >= xMin && p.x <= xMax && p.y >= yMin && p.y <= yMax) {
        const sx = toSvgX(p.x);
        const sy = toSvgY(p.y);
        pointsSvg.push(`<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="4" fill="#34d399" stroke="#09090e" stroke-width="1.5" />`);
        if (p.label) {
          pointsSvg.push(`<text x="${(sx + 6).toFixed(1)}" y="${(sy - 6).toFixed(1)}" fill="#34d399" font-size="10" font-family="monospace">${p.label}</text>`);
        }
      }
    }
  }

  const titleText = options.title || (options.fn ? `f(x) = ${options.fn}` : 'Coordinate Plot');
  const xLabelText = options.xLabel || 'x';
  const yLabelText = options.yLabel || 'y';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="background-color: #09090e; border-radius: 8px;">
  <!-- Title -->
  <text x="${width / 2}" y="25" fill="#ffffff" font-size="14" font-weight="bold" font-family="sans-serif" text-anchor="middle">${titleText}</text>

  <!-- Plot Area Frame -->
  <rect x="${margin.left}" y="${margin.top}" width="${plotW}" height="${plotH}" fill="#0f0f16" stroke="rgba(139, 92, 246, 0.3)" stroke-width="1" />

  <!-- Grid Lines -->
  ${gridLines.join('\n  ')}

  <!-- Ticks & Labels -->
  ${tickLabels.join('\n  ')}

  <!-- Primary Axes -->
  ${axes.join('\n  ')}

  <!-- Function Graph Path -->
  ${pathD ? `<path d="${pathD.trim()}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />` : ''}

  <!-- Discrete Points -->
  ${pointsSvg.join('\n  ')}

  <!-- Axis Labels -->
  <text x="${width - margin.right + 5}" y="${toSvgY(0) ? toSvgY(0) + 4 : margin.top + plotH}" fill="#c4b5fd" font-size="12" font-style="italic" font-family="sans-serif">${xLabelText}</text>
  <text x="${margin.left}" y="${margin.top - 8}" fill="#c4b5fd" font-size="12" font-style="italic" font-family="sans-serif" text-anchor="middle">${yLabelText}</text>
</svg>`;
}
