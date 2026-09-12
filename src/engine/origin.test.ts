import { describe, expect, it } from 'vitest';
import { allowedOrigin } from './origin';

describe('allowedOrigin', () => {
  it('allows prod and local vite, rejects *', () => {
    expect(allowedOrigin('https://easylm.vercel.app')).toBe('https://easylm.vercel.app');
    expect(allowedOrigin('http://localhost:5175')).toBe('http://localhost:5175');
    expect(allowedOrigin('https://evil.example')).toBe(null);
    expect(allowedOrigin('*')).toBe(null);
  });
});
