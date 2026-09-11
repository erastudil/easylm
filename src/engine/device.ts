export interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  hasWebGPU: boolean;
  osName: string;
  recommendedModel: string;
  gpuVendor?: string;
  maxMemoryGB?: number;
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
  if (hasWebGPU) {
    try {
      const adapter = await (navigator as any).gpu.requestAdapter();
      if (adapter && adapter.info) {
        gpuVendor = `${adapter.info.vendor || ''} ${adapter.info.architecture || ''}`.trim();
      }
    } catch {
      // ignore
    }
  }

  // Device memory hint if available in browser
  const maxMemoryGB = (navigator as any).deviceMemory;

  // If mobile or device has <= 4GB RAM, default to 1.5B model for safety against browser OOM
  const recommendedModel = (isMobile || (maxMemoryGB && maxMemoryGB <= 4))
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
    gpuVendor,
    maxMemoryGB
  };
}
