import { describe, it } from 'vitest';
import * as fs from 'node:fs';
import { execStacks } from '../src/engine/stacks';

// Temporary bench helper (not part of the app; deleted after use):
// dumps the app's own execStacks output for every query in stacks_queries.json.
describe('bench stacks dump', () => {
  it('dumps execStacks results for the query file', () => {
    const dir = 'C:\\Users\\jpm05\\easylm-bench';
    const queries: string[] = JSON.parse(fs.readFileSync(`${dir}\\stacks_queries.json`, 'utf-8'));
    const out: Record<string, string> = {};
    for (const q of queries) out[q] = execStacks(q);
    fs.writeFileSync(`${dir}\\stacks_results.json`, JSON.stringify(out, null, 1));
  });
});
