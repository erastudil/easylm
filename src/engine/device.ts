import { patchWebGPUAdapterFallback } from './webllm';

export type HardwareTier = 'ultralight' | 'standard' | 'high_performance' | 'workstation';

export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  hasWebGPU: boolean;
  osName: string;
  recommendedModel: string;
  hardwareTier: HardwareTier;
  recommendedContextLimit: number;
  gpuVendor?: string;
  gpuRenderer?: string;
  maxMemoryGB?: number;
  maxBufferSizeMB?: number;
  estimatedVRAMGB?: number;
}

/**
 * Detect runtime device, OS, memory tier, and WebGPU hardware capabilities.
 * Follows Odysseus / Hugging Face WebGPU standards:
 * - Never classifies desktop/laptop window resize as a mobile phone.
 * - Laptops with iGPU or discrete GPU default to Standard (8GB class / 3B model), not ultralight.
 * - Recommends hardware-matched context limits (2k, 4k, 8k).
 */
export async function detectDevice(): Promise<DeviceInfo> {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (typeof navigator !== 'undefined' && navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);
  // Real mobile device check - never treat half-screen laptop windows as a phone!
  const isMobile = isIOS || isAndroid;
  const isTablet = /iPad|tablet/i.test(ua) || (typeof window !== 'undefined' && isMobile && window.innerWidth > 600);

  const hasWebGPU = typeof navigator !== 'undefined' && 'gpu' in navigator && !!(navigator as any).gpu;

  let gpuVendor: string | undefined;
  let gpuRenderer: string | undefined;
  let maxBufferSizeMB: number | undefined;
  let isDiscreteGPU = false;

  if (hasWebGPU) {
    try {
      patchWebGPUAdapterFallback();
      // 1. Request high-performance adapter to prefer discrete GPU over integrated where available
      let adapter = await (navigator as any).gpu.requestAdapter({ powerPreference: 'high-performance' });
      // 2. Fallback to default adapter
      if (!adapter) {
        adapter = await (navigator as any).gpu.requestAdapter();
      }
      // 3. Fallback to low-power adapter
      if (!adapter) {
        adapter = await (navigator as any).gpu.requestAdapter({ powerPreference: 'low-power' });
      }

      if (adapter) {
        let info = adapter.info;
        if (!info && typeof adapter.requestAdapterInfo === 'function') {
          try {
            info = await adapter.requestAdapterInfo();
          } catch {
            // ignore
          }
        }
        info = info || {};

        let vendor = (info.vendor || '').trim();
        let arch = (info.architecture || '').trim();
        let desc = (info.description || info.device || '').trim();

        // Extract vendor if generic wrapper or description contains hardware string
        const combined = `${vendor} ${arch} ${desc}`.trim();
        const lowerCombined = combined.toLowerCase();

        if (
          lowerCombined.includes('nvidia') ||
          lowerCombined.includes('geforce') ||
          lowerCombined.includes('rtx') ||
          lowerCombined.includes('gtx')
        ) {
          if (!vendor || vendor.toLowerCase() === 'google' || vendor.toLowerCase() === 'microsoft') {
            vendor = 'NVIDIA';
          }
          isDiscreteGPU = true;
        } else if (lowerCombined.includes('amd') || lowerCombined.includes('radeon')) {
          if (!vendor || vendor.toLowerCase() === 'google' || vendor.toLowerCase() === 'microsoft') {
            vendor = 'AMD';
          }
          isDiscreteGPU = true;
        } else if (
          lowerCombined.includes('apple') ||
          lowerCombined.includes('m1') ||
          lowerCombined.includes('m2') ||
          lowerCombined.includes('m3') ||
          lowerCombined.includes('m4')
        ) {
          vendor = 'Apple';
          isDiscreteGPU = true;
        } else if (lowerCombined.includes('intel') || lowerCombined.includes('arc') || lowerCombined.includes('iris') || lowerCombined.includes('uhd')) {
          if (!vendor) vendor = 'Intel';
          if (lowerCombined.includes('arc')) {
            isDiscreteGPU = true;
          }
        }

        gpuVendor = vendor || (combined ? 'WebGPU' : undefined);
        gpuRenderer = (desc || arch) ? `${arch} ${desc}`.trim() : undefined;

        if (adapter.limits) {
          maxBufferSizeMB = Math.round((adapter.limits.maxBufferSize || 0) / (1024 * 1024));
        }
      }
    } catch {
      // ignore
    }
  }

  // Device memory hint if available in browser
  const maxMemoryGB: number | undefined = typeof navigator !== 'undefined' ? (navigator as any).deviceMemory : undefined;

  let osName = 'Desktop';
  if (isIOS) osName = 'iOS';
  else if (isAndroid) osName = 'Android';
  else if (/Mac/i.test(ua)) osName = 'macOS';
  else if (/Win/i.test(ua)) osName = 'Windows';
  else if (/Linux/i.test(ua)) osName = 'Linux';

  // Determine hardware tier and context window recommendations:
  // - Ultralight (4GB class): mobile phones, low-memory tablets -> 8,192 or 16,384 tokens
  // - Standard (6GB - 8GB class): standard laptops/desktops -> 32,768 tokens (Nexus default)
  // - High Performance (12GB - 16GB class): discrete GPUs (RTX, Radeon, Apple Pro) -> 65,536 or 131,072 tokens
  // - Workstation (24GB - 32GB+ class): heavy workstation GPUs (RTX 4080/4090, Apple M Max/Ultra) -> 262,144 tokens (256k max)
  let hardwareTier: HardwareTier = 'standard';
  let estimatedVRAMGB = 8;
  let recommendedContextLimit = 32768; // 32k comfortable default for 8GB

  if (isMobile) {
    if ((maxMemoryGB && maxMemoryGB <= 4) || (maxBufferSizeMB && maxBufferSizeMB < 512)) {
      hardwareTier = 'ultralight';
      estimatedVRAMGB = 4;
      recommendedContextLimit = 8192;
    } else {
      hardwareTier = 'standard';
      estimatedVRAMGB = 6;
      recommendedContextLimit = 16384;
    }
  } else {
    // Desktop or Laptop
    if (isDiscreteGPU && maxMemoryGB && maxMemoryGB >= 32) {
      hardwareTier = 'workstation';
      estimatedVRAMGB = 24;
      recommendedContextLimit = 262144; // 256k max
    } else if (isDiscreteGPU || (maxMemoryGB && maxMemoryGB >= 16)) {
      hardwareTier = 'high_performance';
      estimatedVRAMGB = 12;
      recommendedContextLimit = 65536; // 64k
    } else {
      // Default laptop/desktop PC (8GB class)
      hardwareTier = 'standard';
      estimatedVRAMGB = 8;
      recommendedContextLimit = 32768; // 32k default
    }
  }

  // Model recommendation:
  // - Ultralight -> 1.5B (~1.4 GB VRAM)
  // - Standard (8GB class) -> 3B (~2.2 GB VRAM) — light work on 8GB cards!
  // - High Performance (~12GB VRAM & under) -> Bonsai 2 27B (~6.8 GB VRAM)
  let recommendedModel = 'Qwen2.5-3B-Instruct-q4f16_1-MLC';
  if (hardwareTier === 'ultralight') {
    recommendedModel = 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC';
  } else if (hardwareTier === 'high_performance' || (estimatedVRAMGB >= 10 && estimatedVRAMGB <= 16)) {
    recommendedModel = 'Bonsai-2-27B-MLC';
  }

  return {
    isMobile,
    isTablet,
    isIOS,
    isAndroid,
    hasWebGPU,
    osName,
    recommendedModel,
    hardwareTier,
    recommendedContextLimit,
    gpuVendor,
    gpuRenderer,
    maxMemoryGB,
    maxBufferSizeMB,
    estimatedVRAMGB
  };
}
