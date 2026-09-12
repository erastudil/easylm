import { describe, expect, it } from 'vitest';
import { dispatchTool } from './tools';

describe('dispatchTool kidSafe', () => {
  it('refuses network tools', async () => {
    const res = await dispatchTool('web_fetch', 'https://example.com', undefined, { kidSafe: true });
    expect(res.isError).toBe(true);
    expect(res.result).toMatch(/network tools are off/i);
  });

  it('refuses dictionary (external dictionaryapi.dev)', async () => {
    const res = await dispatchTool('dictionary', 'serendipity', undefined, { kidSafe: true });
    expect(res.isError).toBe(true);
    expect(res.result).toMatch(/network tools are off/i);
  });

  it('still runs units', async () => {
    const res = await dispatchTool('units', '10 kg to lbs', undefined, { kidSafe: true });
    expect(res.isError).toBe(false);
    expect(res.result).toMatch(/lbs/);
  });
});
