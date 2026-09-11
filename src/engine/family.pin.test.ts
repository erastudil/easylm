import { describe, expect, it } from 'vitest';
import { hashParentalPin } from './family';

describe('hashParentalPin', () => {
  it('is not plaintext and verifies with same salt', async () => {
    const rec = await hashParentalPin('1234');
    expect(rec.hash).not.toBe('1234');
    expect(rec.salt.length).toBeGreaterThan(8);
    const again = await hashParentalPin('1234', Uint8Array.from(atob(rec.salt), c => c.charCodeAt(0)), rec.iter);
    expect(again.hash).toBe(rec.hash);
    const other = await hashParentalPin('9999', Uint8Array.from(atob(rec.salt), c => c.charCodeAt(0)), rec.iter);
    expect(other.hash).not.toBe(rec.hash);
  });
});
