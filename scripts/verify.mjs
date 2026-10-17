import { execSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

function assert(condition, message) {
  if (!condition) {
    console.error(`[VERIFY FAIL] ${message}`);
    process.exit(1);
  }
}

console.log('==> [1/6] Running prebuild compilation (Stacks and Courses)...');
execSync('node scripts/compile_stacks.mjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/compile_courses.mjs', { cwd: ROOT, stdio: 'inherit' });
assert(existsSync(resolve(ROOT, 'src/data/stacks_compiled.ts')), 'stacks_compiled.ts must exist');
assert(existsSync(resolve(ROOT, 'src/data/courses_compiled.ts')), 'courses_compiled.ts must exist');

console.log('==> [2/6] Verifying model selection and cache invariants...');
const webllmContent = readFileSync(resolve(ROOT, 'src/engine/webllm.ts'), 'utf8');

// 1. Invariant: DEFAULT_MODEL_ID is the 500MB Bonsai 2 2B universal default
assert(
  webllmContent.includes("export const DEFAULT_MODEL_ID = 'easylm-bonsai-2-2b';"),
  "DEFAULT_MODEL_ID must be 'easylm-bonsai-2-2b'"
);

// 1b. Invariant: Bonsai 2 WebLLM records point to verified HTTP 200 Qwen3.5-2B/4B/9B-q4f16_1-MLC endpoints
assert(
  webllmContent.includes("model: 'https://huggingface.co/mlc-ai/Qwen3.5-2B-q4f16_1-MLC'") &&
    webllmContent.includes("model: 'https://huggingface.co/mlc-ai/Qwen3.5-4B-q4f16_1-MLC'") &&
    webllmContent.includes("model: 'https://huggingface.co/mlc-ai/Qwen3.5-9B-q4f16_1-MLC'"),
  'webllm.ts must map Bonsai 2 2B, 4B, 9B, and 27B to verified mlc-ai/Qwen3.5-* MLC endpoints'
);

// 2. Invariant: 10 fine-tuned models in AVAILABLE_MODELS (Bonsai 2 2B, 4B, 9B, 27B + Gemma 4 / Qwen 3 / DeepSeek V4)
const expectedModelIds = [
  'easylm-bonsai-2-2b',
  'easylm-bonsai-2-4b',
  'easylm-bonsai-2-9b',
  'easylm-gemma-4-e2b-it',
  'easylm-gemma-4-e4b-it',
  'easylm-qwen3-4b-instruct',
  'easylm-deepseek-v4-distill-9b',
  'easylm-gemma-4-12b-it',
  'easylm-gemma-4-26b-a4b-it',
  'easylm-bonsai-2-27b'
];

for (const id of expectedModelIds) {
  assert(webllmContent.includes(`id: '${id}'`), `AVAILABLE_MODELS must include model ${id}`);
}

// 3. Invariant: retired models are NOT in AVAILABLE_MODELS
const retiredModelIds = [
  'Qwen2.5-3B-Instruct-q4f16_1-MLC',
  'Llama-3.2-1B-Instruct-q4f16_1-MLC',
  'SmolLM2-360M-Instruct-q4f16_1-MLC',
  'Phi-3.5-mini-instruct-q4f16_1-MLC',
  'Mistral-7B-Instruct-v0.3-q4f16_1-MLC',
  'Qwen2.5-7B-Instruct-q4f16_1-MLC',
  'Qwen2.5-Coder-7B-Instruct-q4f16_1-MLC',
  'gemma-2-9b-it-q4f16_1-MLC'
];

// Check AVAILABLE_MODELS block specifically
const availableModelsBlock = webllmContent.split('export const AVAILABLE_MODELS: ModelOption[] = [')[1]?.split('];')[0];
assert(availableModelsBlock, 'AVAILABLE_MODELS block must be found in webllm.ts');

for (const id of retiredModelIds) {
  assert(!availableModelsBlock.includes(`id: '${id}'`), `Retired model ${id} must not be in AVAILABLE_MODELS`);
}

// 4. Invariant: Alice is excluded until ready
assert(!availableModelsBlock.includes("id: 'alice'"), "Alice must not be in AVAILABLE_MODELS until ready");

// 5. Invariant: cache self-healing and indexeddb retry implemented
assert(
  webllmContent.includes("cacheBackend: 'indexeddb'"),
  'getOrInitEngine must include indexeddb cacheBackend fallback'
);
assert(
  webllmContent.includes('clearModelCache(modelId)'),
  'getOrInitEngine must include clearModelCache recovery'
);

// 6. Invariant: Vercel CSP connect-src permits Hugging Face CDN subdomains
const vercelContent = readFileSync(resolve(ROOT, 'vercel.json'), 'utf8');
const vercelJson = JSON.parse(vercelContent);
const cspHeader = vercelJson.headers?.[0]?.headers?.find(h => h.key === 'Content-Security-Policy')?.value || '';
assert(cspHeader.includes('https://*.cdn.hf.co'), 'vercel.json CSP must include https://*.cdn.hf.co');
assert(cspHeader.includes('https://*.aws.cdn.hf.co'), 'vercel.json CSP must include https://*.aws.cdn.hf.co');
assert(cspHeader.includes('https://cdn-lfs.hf.co'), 'vercel.json CSP must include https://cdn-lfs.hf.co');

// 7. Invariant: the model-load prompt waits for the first AI action (no boot-time download gate)
const appContent = readFileSync(resolve(ROOT, 'src/App.tsx'), 'utf8');
assert(
  appContent.includes('pendingAiPromptRef'),
  'handleSendMessage must stash the pending prompt behind the model-load decision'
);
assert(
  !appContent.includes("if (showPromptPref !== 'false') {"),
  'the hardware prompt must not open at boot; it fires on the first AI action'
);

console.log('==> [3/6] Verifying device recommendations...');
const deviceContent = readFileSync(resolve(ROOT, 'src/engine/device.ts'), 'utf8');
assert(
  deviceContent.includes("let recommendedModel = 'easylm-bonsai-2-2b';"),
  "detectDeviceUnsafe must recommend 'easylm-bonsai-2-2b' as default"
);
assert(
  deviceContent.includes("export const IOS_RECOMMENDED_MODEL = 'easylm-bonsai-2-2b';"),
  "IOS_RECOMMENDED_MODEL must be 'easylm-bonsai-2-2b'"
);


console.log('==> [4/6] Verifying README model table matches the catalog (issues #5/#6)...');
const readmeContent = readFileSync(resolve(ROOT, 'README.md'), 'utf8');
const catalogEntries = [...availableModelsBlock.matchAll(/id: '([^']+)',[\s\S]{0,200}?label: '([^']+)',[\s\S]{0,200}?sizeMB: (\d+)/g)]
  .map(m => ({ id: m[1], label: m[2], sizeMB: Number(m[3]) }));
assert(catalogEntries.length === expectedModelIds.length, 'catalog entries must parse from AVAILABLE_MODELS');
const tableSection = readmeContent.split('## Supported Models')[1]?.split('\n## ')[0];
assert(tableSection, 'README must have a Supported Models section');
const tableRows = [...tableSection.matchAll(/\| \*\*(.+?)\*\* \| ~([\d.]+) GB \|/g)]
  .map(m => ({ label: m[1], gb: Number(m[2]) }));
assert(
  tableRows.length === catalogEntries.length,
  `README model table must list exactly the ${catalogEntries.length} catalog models (found ${tableRows.length})`
);
for (const entry of catalogEntries) {
  const row = tableRows.find(r => r.label === entry.label);
  assert(row, `README model table must include ${entry.label}`);
  assert(
    Math.abs(row.gb - entry.sizeMB / 1000) <= 0.15,
    `README download size for ${entry.label} (~${row.gb} GB) must match catalog sizeMB ${entry.sizeMB}`
  );
}
assert(readmeContent.includes('Llama 3.2 1B Instruct'), 'README must document the kid-profile model (Llama 3.2 1B Instruct)');

console.log('==> [5/6] Running kid allowlist and stacks chapter tests...');
execSync('node ./node_modules/vitest/vitest.mjs run tests/kid_models.test.ts tests/stacks_chapters.test.ts', { cwd: ROOT, stdio: 'inherit' });

console.log('==> [6/6] Verifying TypeScript and Vite production bundle (npm run build)...');
execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });

console.log('\n[PASS] All EasyLM invariants and production build verified green.');
process.exit(0);
