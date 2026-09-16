import { execMath } from './math';

export interface FunctionSpec {
  fn: string;
  color?: string;
  label?: string;
  visible?: boolean;
}

export interface ShadedRegion {
  from: number;
  to: number;
  fnIndex?: number;
  color?: string;
}

export interface TangentLine {
  x0: number;
  slope: number;
  y0: number;
  color?: string;
}

export interface PlotOptions {
  fn?: string; // Mathematical expression like "sin(x)", "x^2 - 4", "exp(-x)"
  functions?: FunctionSpec[]; // Support multiple simultaneous functions
  points?: Array<{ x: number; y: number; label?: string; color?: string }>;
  shadedRegions?: ShadedRegion[];
  tangentLine?: TangentLine;
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

  // Handle implicit multiplication like 2x, 3.5x -> 2 * x, 3.5 * x
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
  numSamples: number = 240
): SamplePoint[] {
  const points: SamplePoint[] = [];
  const span = xMax - xMin || 1;
  const step = span / (numSamples - 1);

  for (let i = 0; i < numSamples; i++) {
    const x = xMin + i * step;
    const y = evalFx(fnStr, x);
    const valid = Number.isFinite(y) && !Number.isNaN(y) && Math.abs(y) < 1e7;
    points.push({ x, y: valid ? y : 0, valid });
  }

  return points;
}

/**
 * Computes numerical derivative f'(x0) via symmetric central difference.
 */
export function evalDerivative(fnStr: string, x0: number, h: number = 1e-5): number {
  const yPlus = evalFx(fnStr, x0 + h);
  const yMinus = evalFx(fnStr, x0 - h);
  if (!Number.isFinite(yPlus) || !Number.isFinite(yMinus)) return NaN;
  return (yPlus - yMinus) / (2 * h);
}

/**
 * Finds roots of f(x) = 0 in domain [xMin, xMax] via interval sign scanning and bisection.
 */
export function findRoots(fnStr: string, xMin: number, xMax: number, steps: number = 120): number[] {
  const roots: number[] = [];
  const step = (xMax - xMin) / steps;
  let prevX = xMin;
  let prevY = evalFx(fnStr, prevX);

  for (let i = 1; i <= steps; i++) {
    const currX = xMin + i * step;
    const currY = evalFx(fnStr, currX);

    if (Number.isFinite(prevY) && Number.isFinite(currY)) {
      if (Math.abs(currY) < 1e-7) {
        roots.push(Math.round(currX * 10000) / 10000);
      } else if (prevY * currY < 0) {
        // Bisection refinement
        let lo = prevX;
        let hi = currX;
        for (let b = 0; b < 24; b++) {
          const mid = (lo + hi) / 2;
          const yMid = evalFx(fnStr, mid);
          if (!Number.isFinite(yMid) || Math.abs(yMid) < 1e-7) {
            lo = mid;
            break;
          }
          if (prevY * yMid < 0) {
            hi = mid;
          } else {
            lo = mid;
          }
        }
        const found = Math.round(((lo + hi) / 2) * 10000) / 10000;
        if (!roots.some((r) => Math.abs(r - found) < 1e-3)) {
          roots.push(found);
        }
      }
    }
    prevX = currX;
    prevY = currY;
  }

  return roots.sort((a, b) => a - b);
}

/**
 * Finds local extrema in domain [xMin, xMax] where derivative changes sign.
 */
export function findExtrema(
  fnStr: string,
  xMin: number,
  xMax: number,
  steps: number = 120
): Array<{ x: number; y: number; type: 'min' | 'max' }> {
  const extrema: Array<{ x: number; y: number; type: 'min' | 'max' }> = [];
  const step = (xMax - xMin) / steps;
  let prevX = xMin;
  let prevD = evalDerivative(fnStr, prevX);

  for (let i = 1; i <= steps; i++) {
    const currX = xMin + i * step;
    const currD = evalDerivative(fnStr, currX);

    if (Number.isFinite(prevD) && Number.isFinite(currD)) {
      if (prevD * currD < 0) {
        // Sign change in derivative indicates extremum
        const midX = (prevX + currX) / 2;
        const yVal = evalFx(fnStr, midX);
        if (Number.isFinite(yVal)) {
          const type: 'min' | 'max' = prevD > 0 ? 'max' : 'min';
          const rx = Math.round(midX * 10000) / 10000;
          const ry = Math.round(yVal * 10000) / 10000;
          if (!extrema.some((e) => Math.abs(e.x - rx) < 1e-3)) {
            extrema.push({ x: rx, y: ry, type });
          }
        }
      }
    }
    prevX = currX;
    prevD = currD;
  }

  return extrema;
}

/**
 * Computes definite integral using composite Simpson's 1/3 rule.
 */
export function integrateSimpson(fnStr: string, a: number, b: number, n: number = 100): number {
  if (a === b) return 0;
  if (a > b) return -integrateSimpson(fnStr, b, a, n);

  // n must be even
  const evenN = n % 2 === 0 ? n : n + 1;
  const h = (b - a) / evenN;

  const fa = evalFx(fnStr, a);
  const fb = evalFx(fnStr, b);
  if (!Number.isFinite(fa) || !Number.isFinite(fb)) return NaN;

  let sum = fa + fb;
  for (let i = 1; i < evenN; i++) {
    const x = a + i * h;
    const y = evalFx(fnStr, x);
    if (!Number.isFinite(y)) return NaN;
    sum += i % 2 === 0 ? 2 * y : 4 * y;
  }

  return (h / 3) * sum;
}

/**
 * Computes table of values for multiple functions across [xStart, xEnd].
 */
export function computeTableOfValues(
  functions: string[],
  xStart: number,
  xEnd: number,
  step: number
): Array<{ x: number; values: (number | null)[] }> {
  const rows: Array<{ x: number; values: (number | null)[] }> = [];
  const safeStep = Math.max(0.001, Math.abs(step) || 1);
  const count = Math.min(200, Math.floor(Math.abs(xEnd - xStart) / safeStep) + 1);

  for (let i = 0; i < count; i++) {
    const x = Math.round((xStart + i * safeStep) * 10000) / 10000;
    const values = functions.map((fn) => {
      const y = evalFx(fn, x);
      return Number.isFinite(y) ? Math.round(y * 10000) / 10000 : null;
    });
    rows.push({ x, values });
  }

  return rows;
}

/**
 * Generates an SVG vector graphic representing the mathematical coordinate plane and graph.
 */
export function generatePlotSvg(options: PlotOptions): string {
  const width = options.width || 680;
  const height = options.height || 420;
  const margin = { top: 45, right: 35, bottom: 45, left: 60 };

  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;

  let xMin = options.xMin ?? -10;
  let xMax = options.xMax ?? 10;
  if (xMin >= xMax) {
    xMin = -10;
    xMax = 10;
  }

  // Compile list of function curves to render
  const defaultColors = ['#a78bfa', '#34d399', '#38bdf8', '#fbbf24', '#f87171'];
  const activeFunctions: FunctionSpec[] = [];

  if (options.functions && options.functions.length > 0) {
    options.functions.forEach((f, idx) => {
      if (f.visible !== false && f.fn && f.fn.trim()) {
        activeFunctions.push({
          fn: f.fn.trim(),
          color: f.color || defaultColors[idx % defaultColors.length],
          label: f.label || `f${idx + 1}(x)`
        });
      }
    });
  } else if (options.fn && options.fn.trim()) {
    activeFunctions.push({
      fn: options.fn.trim(),
      color: options.color || '#a78bfa',
      label: options.fn.trim()
    });
  }

  // Sample all functions
  const sampledCurves = activeFunctions.map((f) => ({
    spec: f,
    samples: sampleFunction(f.fn, xMin, xMax, 240)
  }));

  // Determine Y bounds
  let yMin = options.yMin;
  let yMax = options.yMax;

  if (yMin == null || yMax == null) {
    const validY: number[] = [];
    for (const c of sampledCurves) {
      for (const p of c.samples) {
        if (p.valid) validY.push(p.y);
      }
    }
    if (options.points) {
      for (const p of options.points) {
        if (Number.isFinite(p.y)) validY.push(p.y);
      }
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

  // Clamp asymptotic blowups
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
    gridLines.push(
      `<line x1="${sx.toFixed(1)}" y1="${margin.top}" x2="${sx.toFixed(1)}" y2="${margin.top + plotH}" stroke="rgba(139, 92, 246, 0.15)" stroke-dasharray="3,3" />`
    );
    tickLabels.push(
      `<text x="${sx.toFixed(1)}" y="${margin.top + plotH + 18}" fill="#71717a" font-size="11" text-anchor="middle" font-family="monospace">${val.toFixed(Math.abs(val) < 10 ? 1 : 0)}</text>`
    );
  }

  const yTicks = 6;
  const yStep = (yMax - yMin) / yTicks;
  for (let i = 0; i <= yTicks; i++) {
    const val = yMin + i * yStep;
    const sy = toSvgY(val);
    gridLines.push(
      `<line x1="${margin.left}" y1="${sy.toFixed(1)}" x2="${margin.left + plotW}" y2="${sy.toFixed(1)}" stroke="rgba(139, 92, 246, 0.15)" stroke-dasharray="3,3" />`
    );
    tickLabels.push(
      `<text x="${margin.left - 8}" y="${(sy + 4).toFixed(1)}" fill="#71717a" font-size="11" text-anchor="end" font-family="monospace">${val.toFixed(Math.abs(val) < 10 ? 1 : 0)}</text>`
    );
  }

  // Axes (x=0 and y=0 lines)
  const axes: string[] = [];
  if (xMin <= 0 && xMax >= 0) {
    const zeroX = toSvgX(0);
    axes.push(
      `<line x1="${zeroX.toFixed(1)}" y1="${margin.top}" x2="${zeroX.toFixed(1)}" y2="${margin.top + plotH}" stroke="#8b5cf6" stroke-width="1.5" />`
    );
  }
  if (yMin <= 0 && yMax >= 0) {
    const zeroY = toSvgY(0);
    axes.push(
      `<line x1="${margin.left}" y1="${zeroY.toFixed(1)}" x2="${margin.left + plotW}" y2="${zeroY.toFixed(1)}" stroke="#8b5cf6" stroke-width="1.5" />`
    );
  }

  // Shaded regions (definite integrals / areas under curve)
  const shadedSvg: string[] = [];
  if (options.shadedRegions && options.shadedRegions.length > 0) {
    options.shadedRegions.forEach((region) => {
      const targetCurve = sampledCurves[region.fnIndex || 0];
      if (!targetCurve) return;

      const subSamples = sampleFunction(targetCurve.spec.fn, region.from, region.to, 80);
      const polyPoints: string[] = [];
      const zeroY = toSvgY(0);

      // Start at (from, 0)
      polyPoints.push(`${toSvgX(region.from).toFixed(1)},${zeroY.toFixed(1)}`);

      // Follow curve
      for (const pt of subSamples) {
        if (pt.valid) {
          polyPoints.push(`${toSvgX(pt.x).toFixed(1)},${toSvgY(pt.y).toFixed(1)}`);
        }
      }

      // End at (to, 0)
      polyPoints.push(`${toSvgX(region.to).toFixed(1)},${zeroY.toFixed(1)}`);

      const shadeColor = region.color || 'rgba(139, 92, 246, 0.25)';
      shadedSvg.push(
        `<polygon points="${polyPoints.join(' ')}" fill="${shadeColor}" stroke="none" />`
      );
    });
  }

  // Curves paths
  const curvePaths: string[] = [];
  sampledCurves.forEach((c) => {
    let pathD = '';
    let inSegment = false;
    for (const pt of c.samples) {
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
    if (pathD) {
      curvePaths.push(
        `<path d="${pathD.trim()}" fill="none" stroke="${c.spec.color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />`
      );
    }
  });

  // Tangent line rendering
  const tangentSvg: string[] = [];
  if (options.tangentLine) {
    const { x0, slope, y0, color = '#fbbf24' } = options.tangentLine;
    // Tangent equation: y - y0 = slope * (x - x0) -> y = slope * (x - x0) + y0
    const xA = xMin;
    const yA = slope * (xA - x0) + y0;
    const xB = xMax;
    const yB = slope * (xB - x0) + y0;

    const sxA = toSvgX(xA);
    const syA = toSvgY(yA);
    const sxB = toSvgX(xB);
    const syB = toSvgY(yB);

    tangentSvg.push(
      `<line x1="${sxA.toFixed(1)}" y1="${syA.toFixed(1)}" x2="${sxB.toFixed(1)}" y2="${syB.toFixed(1)}" stroke="${color}" stroke-width="2" stroke-dasharray="4,4" />`
    );
    // Anchor point dot
    const s0x = toSvgX(x0);
    const s0y = toSvgY(y0);
    tangentSvg.push(
      `<circle cx="${s0x.toFixed(1)}" cy="${s0y.toFixed(1)}" r="4" fill="${color}" stroke="#09090e" stroke-width="1.5" />`
    );
  }

  // Discrete data points & roots
  const pointsSvg: string[] = [];
  if (options.points) {
    for (const p of options.points) {
      if (p.x >= xMin && p.x <= xMax && p.y >= yMin && p.y <= yMax) {
        const sx = toSvgX(p.x);
        const sy = toSvgY(p.y);
        const dotColor = p.color || '#34d399';
        pointsSvg.push(
          `<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="4" fill="${dotColor}" stroke="#09090e" stroke-width="1.5" />`
        );
        if (p.label) {
          pointsSvg.push(
            `<text x="${(sx + 6).toFixed(1)}" y="${(sy - 6).toFixed(1)}" fill="${dotColor}" font-size="10" font-family="monospace">${p.label}</text>`
          );
        }
      }
    }
  }

  // Legend box if multiple functions
  const legendSvg: string[] = [];
  if (sampledCurves.length > 1) {
    sampledCurves.forEach((c, idx) => {
      const lx = margin.left + 15 + idx * 110;
      const ly = margin.top + 20;
      legendSvg.push(
        `<line x1="${lx}" y1="${ly}" x2="${lx + 18}" y2="${ly}" stroke="${c.spec.color}" stroke-width="3" />`
      );
      legendSvg.push(
        `<text x="${lx + 24}" y="${ly + 4}" fill="#ffffff" font-size="11" font-family="monospace">${c.spec.label}</text>`
      );
    });
  }

  const titleText =
    options.title ||
    (activeFunctions.length === 1
      ? `f(x) = ${activeFunctions[0].fn}`
      : activeFunctions.length > 1
      ? 'Multi-Function Graph'
      : 'Coordinate Plot');
  const xLabelText = options.xLabel || 'x';
  const yLabelText = options.yLabel || 'y';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" style="background-color: #09090e; border-radius: 8px;">
  <!-- Title -->
  <text x="${width / 2}" y="25" fill="#ffffff" font-size="14" font-weight="bold" font-family="sans-serif" text-anchor="middle">${titleText}</text>

  <!-- Plot Area Frame -->
  <rect x="${margin.left}" y="${margin.top}" width="${plotW}" height="${plotH}" fill="#0f0f16" stroke="rgba(139, 92, 246, 0.3)" stroke-width="1" />

  <!-- Shaded Regions -->
  ${shadedSvg.join('\n  ')}

  <!-- Grid Lines -->
  ${gridLines.join('\n  ')}

  <!-- Ticks & Labels -->
  ${tickLabels.join('\n  ')}

  <!-- Primary Axes -->
  ${axes.join('\n  ')}

  <!-- Function Paths -->
  ${curvePaths.join('\n  ')}

  <!-- Tangent Line -->
  ${tangentSvg.join('\n  ')}

  <!-- Discrete Points -->
  ${pointsSvg.join('\n  ')}

  <!-- Legend -->
  ${legendSvg.join('\n  ')}

  <!-- Axis Labels -->
  <text x="${width - margin.right + 5}" y="${toSvgY(0) ? toSvgY(0) + 4 : margin.top + plotH}" fill="#c4b5fd" font-size="12" font-style="italic" font-family="sans-serif">${xLabelText}</text>
  <text x="${margin.left}" y="${margin.top - 8}" fill="#c4b5fd" font-size="12" font-style="italic" font-family="sans-serif" text-anchor="middle">${yLabelText}</text>
</svg>`;
}
