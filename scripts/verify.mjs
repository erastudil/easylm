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

console.log('==> [1/5] Running prebuild compilation (Stacks and Courses)...');
execSync('node scripts/compile_stacks.mjs', { cwd: ROOT, stdio: 'inherit' });
execSync('node scripts/compile_courses.mjs', { cwd: ROOT, stdio: 'inherit' });
assert(existsSync(resolve(ROOT, 'src/data/stacks_compiled.ts')), 'stacks_compiled.ts must exist');
assert(existsSync(resolve(ROOT, 'src/data/courses_compiled.ts')), 'courses_compiled.ts must exist');

console.log('==> [2/5] Verifying model selection and cache invariants...');
const webllmContent = readFileSync(resolve(ROOT, 'src/engine/webllm.ts'), 'utf8');

// 1. Invariant: DEFAULT_MODEL_ID is the 4B Gemma fine-tune
assert(
  webllmContent.includes("export const DEFAULT_MODEL_ID = 'easylm-gemma-4-e4b-it';"),
  "DEFAULT_MODEL_ID must be 'easylm-gemma-4-e4b-it'"
);

// 2. Invariant: exactly 7 fine-tuned models in AVAILABLE_MODELS
const expectedModelIds = [
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

const pickerLabels = [...availableModelsBlock.matchAll(/label: '([^']+)'/g)].map(match => match[1]);
assert(
  pickerLabels.length === expectedModelIds.length,
  `AVAILABLE_MODELS must expose ${expectedModelIds.length} labels, found ${pickerLabels.length}`
);

const readme = readFileSync(resolve(ROOT, 'README.md'), 'utf8');
const supportedModels = readme.split('## Supported Models')[1]?.split('\n## ')[0] || '';
assert(supportedModels.length > 0, 'README must include a Supported Models section');
for (const label of pickerLabels) {
  assert(
    supportedModels.includes(`**${label}**`),
    `README Supported Models must name picker model ${label}`
  );
}
const retiredReadmeNames = [
  'Qwen 2.5 3B Instruct',
  'Llama 3.2 3B Instruct',
  'Gemma 2 9B Instruct',
  'DeepSeek-R1 Distill Qwen 7B',
  'DeepSeek-R1 Distill Qwen 1.5B',
  'Qwen 2.5 1.5B Instruct',
  'Recommended for ~12GB'
];
for (const name of retiredReadmeNames) {
  assert(!supportedModels.includes(name), `README Supported Models still says "${name}"`);
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

console.log('==> [3/5] Verifying device recommendations...');
const deviceContent = readFileSync(resolve(ROOT, 'src/engine/device.ts'), 'utf8');
assert(
  deviceContent.includes("let recommendedModel = 'easylm-gemma-4-e4b-it';"),
  "detectDeviceUnsafe must recommend 'easylm-gemma-4-e4b-it' as default"
);
assert(
  deviceContent.includes("export const IOS_RECOMMENDED_MODEL = 'easylm-gemma-4-e2b-it';"),
  "IOS_RECOMMENDED_MODEL must be 'easylm-gemma-4-e2b-it'"
);

console.log('==> [4/5] Running kid allowlist tests (tests/kid_models.test.ts)...');
execSync('node ./node_modules/vitest/vitest.mjs run tests/kid_models.test.ts', { cwd: ROOT, stdio: 'inherit' });

console.log('==> [5/5] Verifying TypeScript and Vite production bundle (npm run build)...');
execSync('npm run build', { cwd: ROOT, stdio: 'inherit' });

console.log('\n[PASS] All EasyLM invariants and production build verified green.');
process.exit(0);
