import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('EasyLM Single-Grip Verification (Ponytail Wu Wei)', () => {
  it('executes verify script with exit code 0', () => {
    const root = resolve(__dirname, '..');
    const output = execSync('node scripts/verify.mjs', { cwd: root, encoding: 'utf8' });
    expect(output).toContain('[PASS] All EasyLM invariants and production build verified green.');
  }, 60000);
});
