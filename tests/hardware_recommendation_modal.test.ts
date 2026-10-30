import { describe, it, expect, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// No-recommendation case: catalog lookup misses and the catalog is empty, so recModel is undefined.
vi.mock('../src/engine/webllm', () => ({
  AVAILABLE_MODELS: [],
  findModelOption: () => undefined,
  formatDownloadGB: (sizeMB: number) => (sizeMB / 1000).toFixed(2)
}));

import { HardwareRecommendationModal } from '../src/components/HardwareRecommendationModal';

const noop = () => {};

describe('HardwareRecommendationModal with no recommended model', () => {
  it('renders without throwing when recModel is undefined', () => {
    const html = renderToStaticMarkup(
      createElement(HardwareRecommendationModal, {
        isOpen: true,
        onClose: noop,
        deviceInfo: null,
        onConfirmLoad: noop,
        onDecline: noop
      })
    );
    expect(html).toContain('easylm-bonsai-2-2b');
    expect(html).toContain('one-time download from Hugging Face');
    expect(html).not.toContain('undefined');
    expect(html).not.toContain('NaN');
  });
});
