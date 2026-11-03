# EasyLM 23-Adapter Rebuild Firing Report — 2026-10-21

- **Checkout**: `C:\Users\jpm05\Documents\easylm`
- **GCP Project**: `bastion-510306` (Project Number `418186637754`, Region `us-central1`)
- **Billing Account**: `billingAccounts/0123AD-17F5D7-0989FC` (`My Billing Account`, `open: true`, `currencyCode: USD`)
- **Hugging Face Uploads**: `0` (nothing uploaded, merged, or pushed)
- **Completed Adapter Runs (with evidence files)**: `0 / 23` (`23 / 23` failed in-container at import time prior to step 1)

---

## 1. Phase 0 Verification — Launch Definition, Base Model Pins, GCS Trainer Sync & Dataset Hashes

### 0.1 — 23-Run Lineup Matrix (`LINEUP_ADAPTER_MATRIX`)

Updated in both `scripts/train_adapters_gcloud.py` and `scripts/deploy_vertex_training_job.py` (along with updating `--lineup-matrix` CLI help strings from `10-adapter` to `23-adapter`):

```python
LINEUP_ADAPTER_MATRIX: Dict[str, List[str]] = {
    "bonsai-2-2b": ["stacks", "hands", "kidsafety", "hydra"],
    "bonsai-2-4b": ["stacks", "hands", "hydra"],
    "bonsai-2-9b": ["stacks", "hands", "hydra"],
    "bonsai-2-27b": ["stacks", "hands", "hydra"],
    "gemma-4-e2b": ["stacks", "hands", "kidsafety", "hydra"],
    "gemma-4-e4b": ["stacks", "hands", "hydra"],
    "gemma-4-12b": ["stacks", "hands", "hydra"],
}
```

- **Bonsai 2 family**: `4 + 3 + 3 + 3 = 13` runs.
- **Gemma 4 family**: `4 + 3 + 3 = 10` runs.
- **Total scheduled runs**: `23` runs.

### 0.2 — Base Model Revision Pins (`BASE_MODEL_PINS`) as Fired

Added `BASE_MODEL_PINS` to both `scripts/train_adapters_gcloud.py` and `scripts/deploy_vertex_training_job.py` and wired `revision=base_revision` into `AutoTokenizer.from_pretrained(...)` and `AutoModelForCausalLM.from_pretrained(...)` in `scripts/train_adapters_gcloud.py`:

| Tier Alias | Hugging Face Base Repository | Pinned Git Revision SHA (`BASE_MODEL_PINS`) | Upstream HF HEAD (`2026-10-21`) | Last Modified (UTC) | Gated | Drift |
|---|---|---|---|---|---|---|
| `bonsai-2-2b` | `Qwen/Qwen3.5-2B` | `15852e8c16360a2fea060d615a32b45270f8a8fc` | `15852e8c16360a2fea060d615a32b45270f8a8fc` | `2026-03-02T11:26:29.000Z` | `false` | None (`0` commits) |
| `bonsai-2-4b` | `Qwen/Qwen3.5-4B` | `851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a` | `851bf6e806efd8d0a36b00ddf55e13ccb7b8cd0a` | `2026-03-02T00:52:52.000Z` | `false` | None (`0` commits) |
| `bonsai-2-9b` | `Qwen/Qwen3.5-9B` | `c202236235762e1c871ad0ccb60c8ee5ba337b9a` | `c202236235762e1c871ad0ccb60c8ee5ba337b9a` | `2026-03-02T00:51:43.000Z` | `false` | None (`0` commits) |
| `bonsai-2-27b` | `Qwen/Qwen3.5-27B` | `fc05daec18b0a78c049392ed2e771dde82bdf654` | `fc05daec18b0a78c049392ed2e771dde82bdf654` | `2026-04-24T02:54:49.000Z` | `false` | None (`0` commits) |
| `gemma-4-e2b` | `google/gemma-4-E2B-it` | `3e22461f65e89153144f8adb70e3b8c2cc9845a7` | `3e22461f65e89153144f8adb70e3b8c2cc9845a7` | `2026-07-20T16:41:56.000Z` | `false` | None (`0` commits) |
| `gemma-4-e4b` | `google/gemma-4-E4B-it` | `ee0ef6023621cff504d758262d4e04895a5af4a2` | `ee0ef6023621cff504d758262d4e04895a5af4a2` | `2026-07-20T16:42:03.000Z` | `false` | None (`0` commits) |
| `gemma-4-12b` | `google/gemma-4-12B-it` | `707f0a3b8a3c7ad586ed01e27eafbad8a27dd0f7` | `707f0a3b8a3c7ad586ed01e27eafbad8a27dd0f7` | `2026-07-20T16:42:08.000Z` | `false` | None (`0` commits) |

### 0.3 — Laptop vs. GCS Trainer Script Hash Proof

- **Command**:
  ```powershell
  gcloud storage cp C:\Users\jpm05\Documents\easylm\scripts\train_adapters_gcloud.py gs://bastion-510306-vault/easylm/scripts/train_adapters_gcloud.py
  gcloud storage cp gs://bastion-510306-vault/easylm/scripts/train_adapters_gcloud.py C:\Users\jpm05\.gemini\antigravity-cli\brain\dca630a2-35ef-4342-8974-6b353f74c25a\gcs_train_adapters_gcloud.py
  ```
- **Exit Code**: `0`
- **GCS Object Metadata**: `gs://bastion-510306-vault/easylm/scripts/train_adapters_gcloud.py` (Generation `1792568891590333`, `25,672` bytes, Updated `2026-10-21T07:48:11Z`)

| Artifact Location | Path / URI | Size (Bytes) | SHA-256 Digest | Contains 23-Run Matrix & Pins |
|---|---|---:|---|---|
| Laptop Checkout | `C:\Users\jpm05\Documents\easylm\scripts\train_adapters_gcloud.py` | `25,672` | `4e2e42f7f4abde938a0a5258f4bd7273a138a689672b4bc501322c79807e3c18` | `True` |
| GCS Read-Back Copy | `gs://bastion-510306-vault/easylm/scripts/train_adapters_gcloud.py` | `25,672` | `4e2e42f7f4abde938a0a5258f4bd7273a138a689672b4bc501322c79807e3c18` | `True` |

### 0.4 — Recomputed Dataset SHA-256 Hashes vs. `data/easylm_sft_dataset_manifest.json`

- **Command**:
  ```powershell
  python -c "import json, hashlib, pathlib; m = json.loads(pathlib.Path('data/easylm_sft_dataset_manifest.json').read_text('utf-8')); [print(k, hashlib.sha256(pathlib.Path(v['path']).read_bytes()).hexdigest(), v['sha256'], pathlib.Path(v['path']).stat().st_size, v['bytes'], sum(1 for l in pathlib.Path(v['path']).read_text('utf-8').splitlines() if l.strip()), v['conversations'], sep='|') for k, v in m['datasets'].items()]"
  ```
- **Exit Code**: `0`

#### Four Active Lineup Adapter Datasets

| Adapter | File Path | Conversations | Size (Bytes) | Recomputed SHA-256 | Manifest SHA-256 | Match |
|---|---|---:|---:|---|---|---|
| `stacks` | `data/adapter_stacks_chatml.jsonl` | `41,177` | `42,585,161` | `8e20540dde16f2002862f1e50b0ce376b53dab0f19ebb8e9eb1bdfe86d7fa1ca` | `8e20540dde16f2002862f1e50b0ce376b53dab0f19ebb8e9eb1bdfe86d7fa1ca` | `PASS` |
| `hands` | `data/adapter_hands_chatml.jsonl` | `958` | `3,288,821` | `bbc8b128e09d6128afa1f1c4beab345c505683984c9d7e284468dd4e3e5cb1df` | `bbc8b128e09d6128afa1f1c4beab345c505683984c9d7e284468dd4e3e5cb1df` | `PASS` |
| `kidsafety` | `data/adapter_kidsafety_chatml.jsonl` | `1,744` | `1,704,619` | `3b932a7069c32f5b6839486fc5c15fdf9940dc727182b5b32a26d4d69ef252a0` | `3b932a7069c32f5b6839486fc5c15fdf9940dc727182b5b32a26d4d69ef252a0` | `PASS` |
| `hydra` | `data/adapter_hydra_chatml.jsonl` | `9,313` | `13,896,420` | `279f8e9ba086624e4e2c746498c650574d65694e1083e08ff7f822548cc9991e` | `279f8e9ba086624e4e2c746498c650574d65694e1083e08ff7f822548cc9991e` | `PASS` |

*(All 7 additional manifest entries — `adapter_personalities_chatml.jsonl`, `adapter_tools_chatml.jsonl`, `adapter_features_chatml.jsonl`, `adapter_settings_chatml.jsonl`, `adapter_security_chatml.jsonl`, `adapter_easylm_master_chatml.jsonl`, and `easylm_unified_sft_chatml.jsonl` — also matched their manifest SHA-256 digests, byte sizes, and conversation counts 100%.)*

---

## 2. Phase 1 — Verification Gates & Hyperparameter Discrepancy Note

### Gate Results

| Gate | Command | Exit Code | Result Summary |
|---|---|---:|---|
| Gate 1 (Trainer Dry-Run Schedule) | `python scripts/train_adapters_gcloud.py --lineup-matrix --dry-run` | `0` | Emitted JSON plan with `"mode": "lineup_matrix"`, `"total_adapters": 23` (13 Bonsai 2 runs + 10 Gemma 4 runs), all `"dataset_exists": true`, and `"base_model_revision"` populated for every run. |
| Gate 2 (Repository & Publish Gate Verification) | `node scripts/verify.mjs` | `0` | `[1/6]` Stacks/Courses prebuild (`32` packs, `0` fail, `0` warn); `[2/6]` WebLLM model & empty `OFFICIAL_ADAPTERS` invariants; `[3/6]` device recommendations; `[4/6]` README model table sync; `[5/6]` Vitest (`3` files, `35/35` tests passed) + `tests/adapter_publish_gate_test.py` (`22/22` tests `OK`); `[6/6]` `npm run build` (`tsc && vite build` succeeded in `5.84s`). |

### Hyperparameter Discrepancy Note

- **Trainer defaults (`scripts/train_adapters_gcloud.py`)**:
  - `--lr`: `2e-4` (`0.0002`) across all tiers
  - `--max-seq-len`: `4096` across all tiers
  - `--batch-size`: `4`, `--grad-accum`: `4` across all tiers
- **Dispatcher container CLI args (`scripts/deploy_vertex_training_job.py` -> `build_vertex_custom_job_spec`)**:
  - Passes `--max-seq-len 2048` on **all** tiers (differing from the trainer default `4096`).
  - For large tiers (`bonsai-2-9b`, `bonsai-2-27b`, `gemma-4-12b`), passes `--lr 1e-4` (`0.0001`), `--batch-size 2`, and `--grad-accum 8` (differing from the trainer defaults `2e-4`, `4`, `4`).
  - For smaller tiers (`bonsai-2-2b`, `bonsai-2-4b`, `gemma-4-e2b`, `gemma-4-e4b`), passes `--lr 2e-4`, `--batch-size 4`, and `--grad-accum 4`.
- **Governing values**: Because `scripts/deploy_vertex_training_job.py` constructs the explicit `python3 train_adapters_gcloud.py ...` CLI invocation executed inside each Vertex AI container, the dispatcher's values (`--max-seq-len 2048`, and `lr=1e-4, batch_size=2, grad_accum=8` on `9b`/`12b`/`27b`) governed this firing. Neither script's hyperparameter defaults were altered.

---

## 3. Phase 2 & 3 — Per-Job Firing Table (23 Runs: 13 Bonsai First, 10 Gemma Second)

- **Dispatch Command**: `python scripts/deploy_vertex_training_job.py --lineup-matrix --stage-data` (Exit Code `0`)
- **Machine Spec**: `a2-highgpu-1g` (`1x NVIDIA_TESLA_A100` 40GB, `SPOT` scheduling strategy, `100GB pd-ssd` boot disk) in `us-central1`
- **Container Image**: `us-docker.pkg.dev/vertex-ai/training/pytorch-gpu.2-4.py310:latest`

| # | Job ID (`customJobs/*`) | Run (`Base × Dataset`) | Base Repo & Pin (`SHA[:10]`) | Dataset SHA-256 (`SHA[:12]`) | Submit Time (`createTime` UTC) | Start → End Time (UTC) | Status | Duration | Local Artifact Path (`output/adapters/*`) | Eval Headline Numbers | Est. Spend (USD) |
|---:|---|---|---|---|---|---|---|---:|---|---|---:|
| 1 | `87680632066408448` | `bonsai-2-2b × stacks` | `Qwen/Qwen3.5-2B` @ `15852e8c16` | `8e20540dde16` | `2026-10-21T07:56:18Z` | `08:05:58Z → 08:07:29Z` | `JOB_STATE_FAILED` | `91.0s` | `NONE` *(incomplete run: 0 adapter/evidence files)* | `N/A` *(pre-step-1 import failure)* | `$0.0291` |
| 2 | `8636638624722452480` | `bonsai-2-2b × hands` | `Qwen/Qwen3.5-2B` @ `15852e8c16` | `bbc8b128e09d` | `2026-10-21T07:56:20Z` | `08:05:38Z → 08:07:10Z` | `JOB_STATE_FAILED` | `92.0s` | `NONE` *(incomplete run: 0 adapter/evidence files)* | `N/A` *(pre-step-1 import failure)* | `$0.0294` |
| 3 | `8171641963196448768` | `bonsai-2-2b × kidsafety` | `Qwen/Qwen3.5-2B` @ `15852e8c16` | `3b932a7069c3` | `2026-10-21T07:56:22Z` | `08:05:59Z → 08:07:29Z` | `JOB_STATE_FAILED` | `90.0s` | `NONE` *(incomplete run: 0 adapter/evidence files)* | `N/A` *(pre-step-1 import failure)* | `$0.0288` |
| 4 | `8271847054905442304` | `bonsai-2-2b × hydra` | `Qwen/Qwen3.5-2B` @ `15852e8c16` | `279f8e9ba086` | `2026-10-21T07:56:24Z` | `08:09:13Z → 08:10:14Z` | `JOB_STATE_FAILED` | `61.0s` | `NONE` *(incomplete run: 0 adapter/evidence files)* | `N/A` *(pre-step-1 import failure)* | `$0.0195` |
| 5 | `677652183251943424` | `bonsai-2-4b × stacks` | `Qwen/Qwen3.5-4B` @ `851bf6e806` | `8e20540dde16` | `2026-10-21T07:56:25Z` | `08:09:25Z → 08:10:25Z` | `JOB_STATE_FAILED` | `60.0s` | `NONE` *(incomplete run: 0 adapter/evidence files)* | `N/A` *(pre-step-1 import failure)* | `$0.0192` |
| 6 | `2228016354974236672` | `bonsai-2-4b × hands` | `Qwen/Qwen3.5-4B` @ `851bf6e806` | `bbc8b128e09d` | `2026-10-21T07:56:27Z` | `08:09:36Z → 08:11:08Z` | `JOB_STATE_FAILED` | `92.0s` | `NONE` *(incomplete run: 0 adapter/evidence files)* | `N/A` *(pre-step-1 import failure)* | `$0.0294` |
| 7 | `67414433743241216` | `bonsai-2-4b × hydra` | `Qwen/Qwen3.5-4B` @ `851bf6e806` | `279f8e9ba086` | `2026-10-21T07:56:31Z` | `08:12:44Z → 08:14:15Z` | `JOB_STATE_FAILED` | `91.0s` | `NONE` *(incomplete run: 0 adapter/evidence files)* | `N/A` *(pre-step-1 import failure)* | `$0.0291` |
| 8 | `5634989473080016896` | `bonsai-2-9b × stacks` | `Qwen/Qwen3.5-9B` @ `c202236235` | `8e20540dde16` | `2026-10-21T07:56:32Z` | `08:16:02Z → 08:17:33Z` | `JOB_STATE_FAILED` | `91.0s` | `NONE` *(incomplete run: 0 adapter/evidence files)* | `N/A` *(pre-step-1 import failure)* | `$0.0291` |
| 9 | `4852489037824393216` | `bonsai-2-9b × hands` | `Qwen/Qwen3.5-9B` @ `c202236235` | `bbc8b128e09d` | `2026-10-21T07:56:35Z` | `08:12:39Z → 08:14:10Z` | `JOB_STATE_FAILED` | `91.0s` | `NONE` *(incomplete run: 0 adapter/evidence files)* | `N/A` *(pre-step-1 import failure)* | `$0.0291` |
| 10 | `4732017747792232448` | `bonsai-2-9b × hydra` | `Qwen/Qwen3.5-9B` @ `c202236235` | `279f8e9ba086` | `2026-10-21T07:56:37Z` | `08:15:01Z → 08:16:32Z` | `JOB_STATE_FAILED` | `91.0s` | `NONE` *(incomplete run: 0 adapter/evidence files)* | `N/A` *(pre-step-1 import failure)* | `$0.0291` |
| 11 | `11119438401110016` | `bonsai-2-27b × stacks` | `Qwen/Qwen3.5-27B` @ `fc05daec18` | `8e20540dde16` | `2026-10-21T07:56:39Z` | `08:16:41Z → 08:18:12Z` | `JOB_STATE_FAILED` | `91.0s` | `NONE` *(incomplete run: 0 adapter/evidence files)* | `N/A` *(pre-step-1 import failure)* | `$0.0291` |
| 12 | `3546445145886949376` | `bonsai-2-27b × hands` | `Qwen/Qwen3.5-27B` @ `fc05daec18` | `bbc8b128e09d` | `2026-10-21T07:56:40Z` | `08:16:49Z → 08:17:52Z` | `JOB_STATE_FAILED` | `63.0s` | `NONE` *(incomplete run: 0 adapter/evidence files)* | `N/A` *(pre-step-1 import failure)* | `$0.0201` |
| 13 | `8833671108419911680` | `bonsai-2-27b × hydra` | `Qwen/Qwen3.5-27B` @ `fc05daec18` | `279f8e9ba086` | `2026-10-21T07:56:42Z` | `08:20:06Z → 08:21:37Z` | `JOB_STATE_FAILED` | `91.0s` | `NONE` *(incomplete run: 0 adapter/evidence files)* | `N/A` *(pre-step-1 import failure)* | `$0.0291` |
| 14 | `4286161384682553344` | `gemma-4-e2b × stacks` | `google/gemma-4-E2B-it` @ `3e22461f65` | `8e20540dde16` | `2026-10-21T07:56:44Z` | `08:20:16Z → 08:21:47Z` | `JOB_STATE_FAILED` | `91.0s` | `NONE` *(incomplete run: 0 adapter/evidence files)* | `N/A` *(pre-step-1 import failure)* | `$0.0291` |
| 15 | `474990200020271104` | `gemma-4-e2b × hands` | `google/gemma-4-E2B-it` @ `3e22461f65` | `bbc8b128e09d` | `2026-10-21T07:56:46Z` | `08:20:00Z → 08:21:01Z` | `JOB_STATE_FAILED` | `61.0s` | `NONE` *(incomplete run: 0 adapter/evidence files)* | `N/A` *(pre-step-1 import failure)* | `$0.0195` |
| 16 | `5086676218447659008` | `gemma-4-e2b × kidsafety` | `google/gemma-4-E2B-it` @ `3e22461f65` | `3b932a7069c3` | `2026-10-21T07:56:48Z` | `08:33:00Z → 08:34:31Z` | `JOB_STATE_FAILED` | `91.0s` | `NONE` *(incomplete run: 0 adapter/evidence files)* | `N/A` *(pre-step-1 import failure)* | `$0.0291` |
| 17 | `6491799302187253760` | `gemma-4-e2b × hydra` | `google/gemma-4-E2B-it` @ `3e22461f65` | `279f8e9ba086` | `2026-10-21T07:56:50Z` | `08:32:53Z → 08:34:23Z` | `JOB_STATE_FAILED` | `90.0s` | `NONE` *(incomplete run: 0 adapter/evidence files)* | `N/A` *(pre-step-1 import failure)* | `$0.0288` |
| 18 | `7158332047038087168` | `gemma-4-e4b × stacks` | `google/gemma-4-E4B-it` @ `ee0ef60236` | `8e20540dde16` | `2026-10-21T07:56:52Z` | `08:32:37Z → 08:34:08Z` | `JOB_STATE_FAILED` | `91.0s` | `NONE` *(incomplete run: 0 adapter/evidence files)* | `N/A` *(pre-step-1 import failure)* | `$0.0291` |
| 19 | `2591682024884404224` | `gemma-4-e4b × hands` | `google/gemma-4-E4B-it` @ `ee0ef60236` | `bbc8b128e09d` | `2026-10-21T07:56:53Z` | `08:36:38Z → 08:38:11Z` | `JOB_STATE_FAILED` | `93.0s` | `NONE` *(incomplete run: 0 adapter/evidence files)* | `N/A` *(pre-step-1 import failure)* | `$0.0297` |
| 20 | `7804598593565753344` | `gemma-4-e4b × hydra` | `google/gemma-4-E4B-it` @ `ee0ef60236` | `279f8e9ba086` | `2026-10-21T07:56:56Z` | `08:36:55Z → 08:37:56Z` | `JOB_STATE_FAILED` | `61.0s` | `NONE` *(incomplete run: 0 adapter/evidence files)* | `N/A` *(pre-step-1 import failure)* | `$0.0195` |
| 21 | `8311253551644934144` | `gemma-4-12b × stacks` | `google/gemma-4-12B-it` @ `707f0a3b8a` | `8e20540dde16` | `2026-10-21T07:56:58Z` | `08:36:37Z → 08:37:38Z` | `JOB_STATE_FAILED` | `61.0s` | `NONE` *(incomplete run: 0 adapter/evidence files)* | `N/A` *(pre-step-1 import failure)* | `$0.0195` |
| 22 | `817263771700428800` | `gemma-4-12b × hands` | `google/gemma-4-12B-it` @ `707f0a3b8a` | `bbc8b128e09d` | `2026-10-21T07:57:00Z` | `08:40:02Z → 08:41:04Z` | `JOB_STATE_FAILED` | `62.0s` | `NONE` *(incomplete run: 0 adapter/evidence files)* | `N/A` *(pre-step-1 import failure)* | `$0.0198` |
| 23 | `5428949790127816704` | `gemma-4-12b × hydra` | `google/gemma-4-12B-it` @ `707f0a3b8a` | `279f8e9ba086` | `2026-10-21T07:57:02Z` | `08:40:18Z → 08:41:49Z` | `JOB_STATE_FAILED` | `91.0s` | `NONE` *(incomplete run: 0 adapter/evidence files)* | `N/A` *(pre-step-1 import failure)* | `$0.0291` |

---

## 4. Failures Section — Verbatim Errors & Retry Disposition

### Root Cause Across All 23 Jobs

In `scripts/deploy_vertex_training_job.py`, `TRAINING_IMAGE_URI` is set to `us-docker.pkg.dev/vertex-ai/training/pytorch-gpu.2-4.py310:latest` (which provides Python `3.10` and `torch==2.4.0+cu124`), and `build_vertex_custom_job_spec` runs:

```bash
pip install --upgrade pip && pip install python-json-logger 'transformers>=5.17.0' 'peft>=0.14.0' 'trl>=0.12.0' datasets accelerate bitsandbytes safetensors
```

Because `transformers>=5.17.0` declares `torch>=2.6; extra == "torch"` only as an optional extra rather than a hard wheel requirement, `pip` installs `transformers-5.20.2`, `peft-0.21.2`, `trl-1.14.2`, and `accelerate-1.15.0` while leaving the container's `torch==2.4.0` untouched. When `train_adapters_gcloud.py` executes `from peft import LoraConfig, TaskType` at line 490, `transformers-5.20.2` checks `is_torch_available()` (which evaluates to `False` because `torch 2.4.0 < 2.6.0`), skips `import torch.nn as nn` in `/opt/python/3.10/lib/python3.10/site-packages/transformers/integrations/accelerate.py`, and crashes immediately at line 65 with `NameError: name 'nn' is not defined`.

### Verbatim Container Python Traceback (Captured via Cloud Logging across all 23 jobs)

```text
Traceback (most recent call last):
  File "//train_adapters_gcloud.py", line 656, in <module>
    sys.exit(main())
  File "//train_adapters_gcloud.py", line 651, in main
    train_single_adapter(model_alias, base_model_id, adapter, data_file, args)
  File "//train_adapters_gcloud.py", line 490, in train_single_adapter
    from peft import LoraConfig, TaskType
  File "/opt/python/3.10/lib/python3.10/site-packages/peft/__init__.py", line 17, in <module>
    from .auto import (
  File "/opt/python/3.10/lib/python3.10/site-packages/peft/auto.py", line 32, in <module>
    from .peft_model import (
  File "/opt/python/3.10/lib/python3.10/site-packages/peft/peft_model.py", line 43, in <module>
    from peft.tuners.lora.variants import get_alora_offsets_for_forward, get_alora_offsets_for_generate
  File "/opt/python/3.10/lib/python3.10/site-packages/peft/tuners/__init__.py", line 61, in <module>
    from .peanut import PeanutConfig, PeanutModel
  File "/opt/python/3.10/lib/python3.10/site-packages/peft/tuners/peanut/__init__.py", line 17, in <module>
    from .config import PeanutConfig
  File "/opt/python/3.10/lib/python3.10/site-packages/peft/tuners/peanut/config.py", line 19, in <module>
    from transformers.activations import ACT2FN
  File "/opt/python/3.10/lib/python3.10/site-packages/transformers/activations.py", line 22, in <module>
    from .integrations.hub_kernels import use_kernel_forward_from_hub
  File "/opt/python/3.10/lib/python3.10/site-packages/transformers/integrations/hub_kernels.py", line 26, in <module>
    from ..conversion_mapping import get_checkpoint_conversion_mapping, register_checkpoint_conversion_mapping
  File "/opt/python/3.10/lib/python3.10/site-packages/transformers/conversion_mapping.py", line 21, in <module>
    from .core_model_loading import (
  File "/opt/python/3.10/lib/python3.10/site-packages/transformers/core_model_loading.py", line 35, in <module>
    from .integrations.accelerate import get_device, offload_weight
  File "/opt/python/3.10/lib/python3.10/site-packages/transformers/integrations/accelerate.py", line 65, in <module>
    ) -> tuple[int, list[str], list[nn.Module]]:
NameError: name 'nn' is not defined
```

### Per-Job Verbatim Vertex AI Failure Records

| # | Job ID | Run (`Base × Dataset`) | Verbatim Vertex AI `error` Object & Container Exception | Labeled Retry Attempted? |
|---:|---|---|---|---|
| 1 | `87680632066408448` | `bonsai-2-2b × stacks` | `{"code": 3, "message": "The replica workerpool0-0 exited with a non-zero status of 1. Termination reason: Error. To find out more about why your job exited please check the logs: https://console.cloud.google.com/logs/viewer?project=418186637754&resource=ml_job%2Fjob_id%2F87680632066408448&advancedFilter=resource.type%3D%22ml_job%22%0Aresource.labels.job_id%3D%2287680632066408448%22"}` — Container: `File "/opt/python/3.10/lib/python3.10/site-packages/transformers/integrations/accelerate.py", line 65, in <module> ) -> tuple[int, list[str], list[nn.Module]]: NameError: name 'nn' is not defined` | No (`0` retries — deterministic container dependency defect) |
| 2 | `8636638624722452480` | `bonsai-2-2b × hands` | `{"code": 3, "message": "The replica workerpool0-0 exited with a non-zero status of 1. Termination reason: Error. To find out more about why your job exited please check the logs: https://console.cloud.google.com/logs/viewer?project=418186637754&resource=ml_job%2Fjob_id%2F8636638624722452480&advancedFilter=resource.type%3D%22ml_job%22%0Aresource.labels.job_id%3D%228636638624722452480%22"}` — Container: `File "/opt/python/3.10/lib/python3.10/site-packages/transformers/integrations/accelerate.py", line 65, in <module> ) -> tuple[int, list[str], list[nn.Module]]: NameError: name 'nn' is not defined` | No (`0` retries — deterministic container dependency defect) |
| 3 | `8171641963196448768` | `bonsai-2-2b × kidsafety` | `{"code": 3, "message": "The replica workerpool0-0 exited with a non-zero status of 1. Termination reason: Error. To find out more about why your job exited please check the logs: https://console.cloud.google.com/logs/viewer?project=418186637754&resource=ml_job%2Fjob_id%2F8171641963196448768&advancedFilter=resource.type%3D%22ml_job%22%0Aresource.labels.job_id%3D%228171641963196448768%22"}` — Container: `File "/opt/python/3.10/lib/python3.10/site-packages/transformers/integrations/accelerate.py", line 65, in <module> ) -> tuple[int, list[str], list[nn.Module]]: NameError: name 'nn' is not defined` | No (`0` retries — deterministic container dependency defect) |
| 4 | `8271847054905442304` | `bonsai-2-2b × hydra` | `{"code": 3, "message": "The replica workerpool0-0 exited with a non-zero status of 1. Termination reason: Error. To find out more about why your job exited please check the logs: https://console.cloud.google.com/logs/viewer?project=418186637754&resource=ml_job%2Fjob_id%2F8271847054905442304&advancedFilter=resource.type%3D%22ml_job%22%0Aresource.labels.job_id%3D%228271847054905442304%22"}` — Container: `File "/opt/python/3.10/lib/python3.10/site-packages/transformers/integrations/accelerate.py", line 65, in <module> ) -> tuple[int, list[str], list[nn.Module]]: NameError: name 'nn' is not defined` | No (`0` retries — deterministic container dependency defect) |
| 5 | `677652183251943424` | `bonsai-2-4b × stacks` | `{"code": 3, "message": "The replica workerpool0-0 exited with a non-zero status of 1. Termination reason: Error. To find out more about why your job exited please check the logs: https://console.cloud.google.com/logs/viewer?project=418186637754&resource=ml_job%2Fjob_id%2F677652183251943424&advancedFilter=resource.type%3D%22ml_job%22%0Aresource.labels.job_id%3D%22677652183251943424%22"}` — Container: `File "/opt/python/3.10/lib/python3.10/site-packages/transformers/integrations/accelerate.py", line 65, in <module> ) -> tuple[int, list[str], list[nn.Module]]: NameError: name 'nn' is not defined` | No (`0` retries — deterministic container dependency defect) |
| 6 | `2228016354974236672` | `bonsai-2-4b × hands` | `{"code": 3, "message": "The replica workerpool0-0 exited with a non-zero status of 1. Termination reason: Error. To find out more about why your job exited please check the logs: https://console.cloud.google.com/logs/viewer?project=418186637754&resource=ml_job%2Fjob_id%2F2228016354974236672&advancedFilter=resource.type%3D%22ml_job%22%0Aresource.labels.job_id%3D%222228016354974236672%22"}` — Container: `File "/opt/python/3.10/lib/python3.10/site-packages/transformers/integrations/accelerate.py", line 65, in <module> ) -> tuple[int, list[str], list[nn.Module]]: NameError: name 'nn' is not defined` | No (`0` retries — deterministic container dependency defect) |
| 7 | `67414433743241216` | `bonsai-2-4b × hydra` | `{"code": 3, "message": "The replica workerpool0-0 exited with a non-zero status of 1. Termination reason: Error. To find out more about why your job exited please check the logs: https://console.cloud.google.com/logs/viewer?project=418186637754&resource=ml_job%2Fjob_id%2F67414433743241216&advancedFilter=resource.type%3D%22ml_job%22%0Aresource.labels.job_id%3D%2267414433743241216%22"}` — Container: `File "/opt/python/3.10/lib/python3.10/site-packages/transformers/integrations/accelerate.py", line 65, in <module> ) -> tuple[int, list[str], list[nn.Module]]: NameError: name 'nn' is not defined` | No (`0` retries — deterministic container dependency defect) |
| 8 | `5634989473080016896` | `bonsai-2-9b × stacks` | `{"code": 3, "message": "The replica workerpool0-0 exited with a non-zero status of 1. Termination reason: Error. To find out more about why your job exited please check the logs: https://console.cloud.google.com/logs/viewer?project=418186637754&resource=ml_job%2Fjob_id%2F5634989473080016896&advancedFilter=resource.type%3D%22ml_job%22%0Aresource.labels.job_id%3D%225634989473080016896%22"}` — Container: `File "/opt/python/3.10/lib/python3.10/site-packages/transformers/integrations/accelerate.py", line 65, in <module> ) -> tuple[int, list[str], list[nn.Module]]: NameError: name 'nn' is not defined` | No (`0` retries — deterministic container dependency defect) |
| 9 | `4852489037824393216` | `bonsai-2-9b × hands` | `{"code": 3, "message": "The replica workerpool0-0 exited with a non-zero status of 1. Termination reason: Error. To find out more about why your job exited please check the logs: https://console.cloud.google.com/logs/viewer?project=418186637754&resource=ml_job%2Fjob_id%2F4852489037824393216&advancedFilter=resource.type%3D%22ml_job%22%0Aresource.labels.job_id%3D%224852489037824393216%22"}` — Container: `File "/opt/python/3.10/lib/python3.10/site-packages/transformers/integrations/accelerate.py", line 65, in <module> ) -> tuple[int, list[str], list[nn.Module]]: NameError: name 'nn' is not defined` | No (`0` retries — deterministic container dependency defect) |
| 10 | `4732017747792232448` | `bonsai-2-9b × hydra` | `{"code": 3, "message": "The replica workerpool0-0 exited with a non-zero status of 1. Termination reason: Error. To find out more about why your job exited please check the logs: https://console.cloud.google.com/logs/viewer?project=418186637754&resource=ml_job%2Fjob_id%2F4732017747792232448&advancedFilter=resource.type%3D%22ml_job%22%0Aresource.labels.job_id%3D%224732017747792232448%22"}` — Container: `File "/opt/python/3.10/lib/python3.10/site-packages/transformers/integrations/accelerate.py", line 65, in <module> ) -> tuple[int, list[str], list[nn.Module]]: NameError: name 'nn' is not defined` | No (`0` retries — deterministic container dependency defect) |
| 11 | `11119438401110016` | `bonsai-2-27b × stacks` | `{"code": 3, "message": "The replica workerpool0-0 exited with a non-zero status of 1. Termination reason: Error. To find out more about why your job exited please check the logs: https://console.cloud.google.com/logs/viewer?project=418186637754&resource=ml_job%2Fjob_id%2F11119438401110016&advancedFilter=resource.type%3D%22ml_job%22%0Aresource.labels.job_id%3D%2211119438401110016%22"}` — Container: `File "/opt/python/3.10/lib/python3.10/site-packages/transformers/integrations/accelerate.py", line 65, in <module> ) -> tuple[int, list[str], list[nn.Module]]: NameError: name 'nn' is not defined` | No (`0` retries — deterministic container dependency defect) |
| 12 | `3546445145886949376` | `bonsai-2-27b × hands` | `{"code": 3, "message": "The replica workerpool0-0 exited with a non-zero status of 1. Termination reason: Error. To find out more about why your job exited please check the logs: https://console.cloud.google.com/logs/viewer?project=418186637754&resource=ml_job%2Fjob_id%2F3546445145886949376&advancedFilter=resource.type%3D%22ml_job%22%0Aresource.labels.job_id%3D%223546445145886949376%22"}` — Container: `File "/opt/python/3.10/lib/python3.10/site-packages/transformers/integrations/accelerate.py", line 65, in <module> ) -> tuple[int, list[str], list[nn.Module]]: NameError: name 'nn' is not defined` | No (`0` retries — deterministic container dependency defect) |
| 13 | `8833671108419911680` | `bonsai-2-27b × hydra` | `{"code": 3, "message": "The replica workerpool0-0 exited with a non-zero status of 1. Termination reason: Error. To find out more about why your job exited please check the logs: https://console.cloud.google.com/logs/viewer?project=418186637754&resource=ml_job%2Fjob_id%2F8833671108419911680&advancedFilter=resource.type%3D%22ml_job%22%0Aresource.labels.job_id%3D%228833671108419911680%22"}` — Container: `File "/opt/python/3.10/lib/python3.10/site-packages/transformers/integrations/accelerate.py", line 65, in <module> ) -> tuple[int, list[str], list[nn.Module]]: NameError: name 'nn' is not defined` | No (`0` retries — deterministic container dependency defect) |
| 14 | `4286161384682553344` | `gemma-4-e2b × stacks` | `{"code": 3, "message": "The replica workerpool0-0 exited with a non-zero status of 1. Termination reason: Error. To find out more about why your job exited please check the logs: https://console.cloud.google.com/logs/viewer?project=418186637754&resource=ml_job%2Fjob_id%2F4286161384682553344&advancedFilter=resource.type%3D%22ml_job%22%0Aresource.labels.job_id%3D%224286161384682553344%22"}` — Container: `File "/opt/python/3.10/lib/python3.10/site-packages/transformers/integrations/accelerate.py", line 65, in <module> ) -> tuple[int, list[str], list[nn.Module]]: NameError: name 'nn' is not defined` | No (`0` retries — deterministic container dependency defect) |
| 15 | `474990200020271104` | `gemma-4-e2b × hands` | `{"code": 3, "message": "The replica workerpool0-0 exited with a non-zero status of 1. Termination reason: Error. To find out more about why your job exited please check the logs: https://console.cloud.google.com/logs/viewer?project=418186637754&resource=ml_job%2Fjob_id%2F474990200020271104&advancedFilter=resource.type%3D%22ml_job%22%0Aresource.labels.job_id%3D%22474990200020271104%22"}` — Container: `File "/opt/python/3.10/lib/python3.10/site-packages/transformers/integrations/accelerate.py", line 65, in <module> ) -> tuple[int, list[str], list[nn.Module]]: NameError: name 'nn' is not defined` | No (`0` retries — deterministic container dependency defect) |
| 16 | `5086676218447659008` | `gemma-4-e2b × kidsafety` | `{"code": 3, "message": "The replica workerpool0-0 exited with a non-zero status of 1. Termination reason: Error. To find out more about why your job exited please check the logs: https://console.cloud.google.com/logs/viewer?project=418186637754&resource=ml_job%2Fjob_id%2F5086676218447659008&advancedFilter=resource.type%3D%22ml_job%22%0Aresource.labels.job_id%3D%225086676218447659008%22"}` — Container: `File "/opt/python/3.10/lib/python3.10/site-packages/transformers/integrations/accelerate.py", line 65, in <module> ) -> tuple[int, list[str], list[nn.Module]]: NameError: name 'nn' is not defined` | No (`0` retries — deterministic container dependency defect) |
| 17 | `6491799302187253760` | `gemma-4-e2b × hydra` | `{"code": 3, "message": "The replica workerpool0-0 exited with a non-zero status of 1. Termination reason: Error. To find out more about why your job exited please check the logs: https://console.cloud.google.com/logs/viewer?project=418186637754&resource=ml_job%2Fjob_id%2F6491799302187253760&advancedFilter=resource.type%3D%22ml_job%22%0Aresource.labels.job_id%3D%226491799302187253760%22"}` — Container: `File "/opt/python/3.10/lib/python3.10/site-packages/transformers/integrations/accelerate.py", line 65, in <module> ) -> tuple[int, list[str], list[nn.Module]]: NameError: name 'nn' is not defined` | No (`0` retries — deterministic container dependency defect) |
| 18 | `7158332047038087168` | `gemma-4-e4b × stacks` | `{"code": 3, "message": "The replica workerpool0-0 exited with a non-zero status of 1. Termination reason: Error. To find out more about why your job exited please check the logs: https://console.cloud.google.com/logs/viewer?project=418186637754&resource=ml_job%2Fjob_id%2F7158332047038087168&advancedFilter=resource.type%3D%22ml_job%22%0Aresource.labels.job_id%3D%227158332047038087168%22"}` — Container: `File "/opt/python/3.10/lib/python3.10/site-packages/transformers/integrations/accelerate.py", line 65, in <module> ) -> tuple[int, list[str], list[nn.Module]]: NameError: name 'nn' is not defined` | No (`0` retries — deterministic container dependency defect) |
| 19 | `2591682024884404224` | `gemma-4-e4b × hands` | `{"code": 3, "message": "The replica workerpool0-0 exited with a non-zero status of 1. Termination reason: Error. To find out more about why your job exited please check the logs: https://console.cloud.google.com/logs/viewer?project=418186637754&resource=ml_job%2Fjob_id%2F2591682024884404224&advancedFilter=resource.type%3D%22ml_job%22%0Aresource.labels.job_id%3D%222591682024884404224%22"}` — Container: `File "/opt/python/3.10/lib/python3.10/site-packages/transformers/integrations/accelerate.py", line 65, in <module> ) -> tuple[int, list[str], list[nn.Module]]: NameError: name 'nn' is not defined` | No (`0` retries — deterministic container dependency defect) |
| 20 | `7804598593565753344` | `gemma-4-e4b × hydra` | `{"code": 3, "message": "The replica workerpool0-0 exited with a non-zero status of 1. Termination reason: Error. To find out more about why your job exited please check the logs: https://console.cloud.google.com/logs/viewer?project=418186637754&resource=ml_job%2Fjob_id%2F7804598593565753344&advancedFilter=resource.type%3D%22ml_job%22%0Aresource.labels.job_id%3D%227804598593565753344%22"}` — Container: `File "/opt/python/3.10/lib/python3.10/site-packages/transformers/integrations/accelerate.py", line 65, in <module> ) -> tuple[int, list[str], list[nn.Module]]: NameError: name 'nn' is not defined` | No (`0` retries — deterministic container dependency defect) |
| 21 | `8311253551644934144` | `gemma-4-12b × stacks` | `{"code": 3, "message": "The replica workerpool0-0 exited with a non-zero status of 1. Termination reason: Error. To find out more about why your job exited please check the logs: https://console.cloud.google.com/logs/viewer?project=418186637754&resource=ml_job%2Fjob_id%2F8311253551644934144&advancedFilter=resource.type%3D%22ml_job%22%0Aresource.labels.job_id%3D%228311253551644934144%22"}` — Container: `File "/opt/python/3.10/lib/python3.10/site-packages/transformers/integrations/accelerate.py", line 65, in <module> ) -> tuple[int, list[str], list[nn.Module]]: NameError: name 'nn' is not defined` | No (`0` retries — deterministic container dependency defect) |
| 22 | `817263771700428800` | `gemma-4-12b × hands` | `{"code": 3, "message": "The replica workerpool0-0 exited with a non-zero status of 1. Termination reason: Error. To find out more about why your job exited please check the logs: https://console.cloud.google.com/logs/viewer?project=418186637754&resource=ml_job%2Fjob_id%2F817263771700428800&advancedFilter=resource.type%3D%22ml_job%22%0Aresource.labels.job_id%3D%22817263771700428800%22"}` — Container: `File "/opt/python/3.10/lib/python3.10/site-packages/transformers/integrations/accelerate.py", line 65, in <module> ) -> tuple[int, list[str], list[nn.Module]]: NameError: name 'nn' is not defined` | No (`0` retries — deterministic container dependency defect) |
| 23 | `5428949790127816704` | `gemma-4-12b × hydra` | `{"code": 3, "message": "The replica workerpool0-0 exited with a non-zero status of 1. Termination reason: Error. To find out more about why your job exited please check the logs: https://console.cloud.google.com/logs/viewer?project=418186637754&resource=ml_job%2Fjob_id%2F5428949790127816704&advancedFilter=resource.type%3D%22ml_job%22%0Aresource.labels.job_id%3D%225428949790127816704%22"}` — Container: `File "/opt/python/3.10/lib/python3.10/site-packages/transformers/integrations/accelerate.py", line 65, in <module> ) -> tuple[int, list[str], list[nn.Module]]: NameError: name 'nn' is not defined` | No (`0` retries — deterministic container dependency defect) |

---

## 5. Total Spend & Trial-Credit Status

- **Bonsai 2 Set (13 jobs)**: `1,095.0 seconds` (`18.25 minutes` / `0.3042 GPU-hours`) -> **`$0.3498 USD`** (at `$1.15/hr` Spot `a2-highgpu-1g` + `100GB pd-ssd` in `us-central1`).
- **Gemma 4 Set (10 jobs)**: `792.0 seconds` (`13.20 minutes` / `0.2200 GPU-hours`) -> **`$0.2530 USD`**.
- **Total Spend Across All 23 Jobs**: `1,887.0 seconds` (`31.45 minutes` / `0.5242 GPU-hours`) -> **`$0.6028 USD`** (`$0.5766 USD` at bare Compute Engine Spot A100 rate of `$1.1006/hr`).
- **Trial-Credit Remainder**:
  - `gcloud billing projects describe bastion-510306` and `gcloud billing accounts describe 0123AD-17F5D7-0989FC --format=json` report `billingEnabled: true` and `open: true` (`currencyCode: "USD"`, `displayName: "My Billing Account"`).
  - The Cloud Billing CLI/API does not expose promotional free-trial credit balances programmatically (the exact credit balance is visible only in the interactive GCP Console under Billing → Credits).
