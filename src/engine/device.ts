export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  hasWebGPU: boolean;
  osName: string;
  recommendedModel: string;
  hardwareTier: 'ultralight' | 'standard' | 'power';
  gpuVendor?: string;
  maxMemoryGB?: number;
  maxBufferSizeMB?: number;
}

/**
 * Detect runtime device, mobile OS, memory tier, and WebGPU hardware
 */
export async function detectDevice(): Promise<DeviceInfo> {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent || '' : '';
  const isIOS = /iPad|iPhone|iPod/.test(ua) || (typeof navigator !== 'undefined' && navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isAndroid = /Android/i.test(ua);
  const isMobile = isIOS || isAndroid || (typeof window !== 'undefined' && window.innerWidth <= 768);
  const isTablet = /iPad|tablet/i.test(ua) || (typeof window !== 'undefined' && window.innerWidth > 768 && window.innerWidth <= 1024);

  const hasWebGPU = typeof navigator !== 'undefined' && 'gpu' in navigator && !!(navigator as any).gpu;

  let gpuVendor: string | undefined;
  let maxBufferSizeMB: number | undefined;

  if (hasWebGPU) {
    try {
      // Request high-performance adapter to prefer discrete GPU over integrated where available
      const adapter = await (navigator as any).gpu.requestAdapter({ powerPreference: 'high-performance' });
      if (adapter) {
        if (adapter.info) {
          gpuVendor = `${adapter.info.vendor || ''} ${adapter.info.architecture || ''}`.trim();
        }
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

  // Determine hardware tier:
  // - Ultralight: mobile, tablets, or systems with <= 4GB RAM or small GPU buffer (< 1GB)
  // - Power: desktops with >= 16GB RAM and large buffer (> 2GB)
  // - Standard: general desktop/laptop with 6GB-16GB RAM
  let hardwareTier: 'ultralight' | 'standard' | 'power' = 'standard';
  if (isMobile || isIOS || isAndroid || (maxMemoryGB && maxMemoryGB <= 4) || (maxBufferSizeMB && maxBufferSizeMB < 1000)) {
    hardwareTier = 'ultralight';
  } else if (maxMemoryGB && maxMemoryGB >= 16 && maxBufferSizeMB && maxBufferSizeMB >= 2048) {
    hardwareTier = 'power';
  }

  // Choose model that runs comfortably without tab crash or thermal throttling:
  // - Ultralight tier -> 1.5B (~1.4 GB VRAM, instant startup, safe in mobile tabs)
  // - Standard & Power -> 3B (~2.2 GB VRAM, high intelligence, lightning fast)
  const recommendedModel = hardwareTier === 'ultralight'
    ? 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC'
    : 'Qwen2.5-3B-Instruct-q4f16_1-MLC';

  let osName = 'Desktop';
  if (isIOS) osName = 'iOS';
  else if (isAndroid) osName = 'Android';
  else if (/Mac/i.test(ua)) osName = 'macOS';
  else if (/Win/i.test(ua)) osName = 'Windows';
  else if (/Linux/i.test(ua)) osName = 'Linux';

  return {
    isMobile,
    isTablet,
    isIOS,
    isAndroid,
    hasWebGPU,
    osName,
    recommendedModel,
    hardwareTier,
    gpuVendor,
    maxMemoryGB,
    maxBufferSizeMB
  };
}
