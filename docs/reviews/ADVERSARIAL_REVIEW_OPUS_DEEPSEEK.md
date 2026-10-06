# EasyLM Adversarial Review: AtMem Privacy, WebGPU Stability & Orchestration

**Date**: 2026-10-01
**Models**: DeepSeek V3 (`deepseek/deepseek-chat`) · Claude Opus 5.5 (`anthropic/claude-opus-5.5`)

## 1. DeepSeek V3 Adversarial Assessment

# ADVERSARIAL ENGINEERING REVIEW: EASYLM SOVEREIGN ARCHITECTURE

### 1. AtMem Client Partitioning & HIPAA Alignment
**Edge Cases:**
- **Legacy Atoms:** Ensure a migration script or invariant checker scans all existing atoms for `clientId` presence. Missing `clientId` atoms must be quarantined or assigned a default `clientId` (e.g., `legacy`) with explicit user confirmation.
- **Race Conditions:** `saveAllAtoms` must enforce atomic writes or use a mutex lock to prevent interleaved writes across client partitions. Consider a transactional model with rollback on invariant violation.

**HIPAA Compliance:**
- **Encryption:** Ensure AES-GCM-256 keys are securely managed (e.g., hardware-backed keystore or user-provided passphrase).
- **Audit Log Integrity:** Implement cryptographic signing of audit logs (e.g., HMAC) to prevent tampering.
- **Access Controls:** Enforce role-based access control (RBAC) for clinical practitioners and ensure multi-factor authentication (MFA) for access to the encrypted vault.

### 2. WebGPU OOM Recovery & Stability
**VRAM Management:**
- **Buffer Caching:** Verify that TVM/MLC engine pipeline explicitly releases VRAM buffers during step-down. Implement manual buffer deallocation hooks if necessary.
- **Device Recovery:** Add a watchdog timer to detect `gpu_process_dead` and trigger automatic restart of the WebGPU context.

**Browser Standardization:**
- **Edge Compatibility:** Reintroduce Edge commands (`edge://restart`) for broader compatibility, despite Brave/Chromium preference.

### 3. Personality Cards & Character Card V2 Interchange
**Ethical Safeguards:**
- **Diagnosis Boundaries:** Add disclaimers prohibiting diagnostic use (e.g., "This tool is not a substitute for professional clinical judgment").
- **Crisis Referral:** Integrate crisis hotline prompts and ensure `risk_factor` prioritization triggers immediate referral suggestions.

### 4. Multi-Agent Orchestration Codification
**Adversarial Review:**
- **Model Selection:** Ensure frontier models are vetted for bias, accuracy, and ethical alignment before inclusion in adversarial workflows.

### TOP 3 HIGH-PRIORITY RECOMMENDATIONS:
1. **Client Partitioning Hardening:** Implement a migration script for legacy atoms, enforce atomic writes in `saveAllAtoms`, and add cryptographic signing for audit logs.
2. **WebGPU VRAM Management:** Add manual buffer deallocation hooks and a watchdog timer for `gpu_process_dead` recovery.
3. **Ethical Safeguards:** Enhance clinical prompt cards with disclaimers and crisis referral mechanisms, ensuring compliance with ethical guidelines.

### CONCLUSION:
The implementation demonstrates robust technical foundations but requires additional hardening for enterprise HIPAA compliance, VRAM management, and ethical safeguards. Prioritize these areas in the next development wave.

---

## 2. Claude Opus 5.5 Adversarial Assessment

# Adversarial Review: EasyLM Sovereign Architecture

**Verdict:** The architecture direction is sound. Several claims are not yet backed by the implementation as described:

- "Cryptographic partitioning" is namespace filtering plus read-time assertions.
- "Zero network transmission" is stated but not enforced.
- Context step-down mostly targets the wrong memory.

Findings are ordered by severity.

---

## 1. `clientId` Partition Leakage

### 1.1 Legacy and unscoped atoms (CRITICAL)

| Vector | Failure mode |
|---|---|
| `atom.clientId === undefined` and the caller passes `clientId` as `undefined` (unselected client, URL param miss, deserialization bug) | `undefined === undefined` returns **every legacy atom**. The invariant check passes because nothing is "from another partition." |
| Filter written as `!a.clientId \|\| a.clientId === id` ("global" semantics) | Every legacy atom is injected into **every** client's envelope. |
| Non-canonical IDs: `"Client-1"` vs `"client-1"`, trailing whitespace, NFC vs NFD Unicode | Split partitions, or merged ones if any comparison path normalizes. |
| `clientId` derived from a name (e.g. `jane-doe`) | Collisions between clients with the same name. The audit log becomes PHI in plaintext. |

**Fixes:**
- Make `clientId` an opaque UUIDv4, never derived from PHI.
- Assert `typeof clientId === 'string' && UUID_RE.test(clientId)` at **every entry point**, before any query runs.
- Run a one-time migration that moves all unscoped atoms into a `__quarantine__` partition. The clinician must manually reassign them. Never auto-assign.

### 1.2 `saveAllAtoms` races (HIGH)

A whole-collection read-modify-write is unsafe on several axes:

- **Cross-tab lost updates.** Tab A and Tab B each load N atoms. A writes N+1, then B writes N+1′, and A's atom is silently destroyed. This is an integrity failure (§164.312(c)(1)), not just a UX bug.
- **Async attribution drift. This is the most likely real-world leak.** A generation or extraction starts under Client X. The clinician switches to Client Y mid-stream. On completion, the atom is tagged with the *current* active client (`state.activeClientId`). X's content now lives in Y's chart.
- **Stale closure on autosave.** A debounced save fires after a client switch and writes X's in-memory array under Y's key.

**Fixes:**
- Capture `clientId` at **request initiation** and thread it immutably through the generation pipeline.
- Reject the completion if `activeClientId !== capturedClientId`. Surface it to the user; do not silently retarget it.
- Use per-atom IndexedDB records with a `[clientId, atomId]` compound key and single-record transactions. Remove `saveAllAtoms` entirely.
- Use the Web Locks API (`navigator.locks.request('atmem:'+clientId, ...)`) for multi-record operations, plus a BroadcastChannel to invalidate other tabs' caches.

### 1.3 Leak surfaces outside the atom store (HIGH)

Your invariant checks only cover `getClientAtoms` and `getAppointmentPrepEnvelope`. Data also persists here:

- **WebLLM conversation state and KV cache.** If the engine is not `resetChat()`'d on client switch, Client X's turns remain in context for Client Y. Prefix caching makes this worse.
- **Embedding or vector index.** If semantic retrieval exists, a shared index returns cross-client nearest neighbors unless it is partitioned per client.
- **Chat transcript store, undo stacks, draft textareas, React/Vue component state** surviving route changes.
- **Character Card V2 export.** `character_book`, `mes_example`, `first_mes`, and `extensions` can carry memory-derived PHI. Export must be allowlist-based, not denylist-based.
- **Import.** Backup or card import can inject atoms with arbitrary `clientId`s. Re-validate on import and quarantine anything unknown.
- **Error paths.** A fatal exception whose message includes atom content can end up in console logs, crash dumps, or any error reporter.

### 1.4 Fatal throw as the only response (MEDIUM)

Fail-closed is correct for confidentiality. However, a single corrupt atom bricking a client's prep envelope five minutes before a session is an availability failure (§164.308(a)(7)).

**Fix:** Fail closed for the *offending records*. Quarantine them, write an audit entry, show a banner, and render the rest. Detection at read time also means storage is already commingled. Treat the assertion as a tripwire, not the control.

---

## 2. HIPAA Readiness Gaps

Software is not "HIPAA compliant"; covered entities are. Your goal is to make the clinician's §164.308 risk analysis easy to pass. Current gaps:

### 2.1 Encryption is likely theater against the realistic threat (CRITICAL)

The key question is where the AES-GCM key lives.

- If it is a non-extractable `CryptoKey` in IndexedDB next to the ciphertext, anyone with the unlocked profile or device can decrypt. You have added no protection beyond OS disk encryption.

**Required design:**
- **KEK:** derived from a clinician passphrase via Argon2id (WASM; m ≥ 64 MiB, t ≥ 3), or PBKDF2-SHA256 at ≥600k iterations as a fallback. A WebAuthn PRF extension is optional for hardware-backed unlock.
- **Per-client DEK**, wrapped by the KEK. This gives you:
  - Real cryptographic partitioning.
  - Crypto-shredding for record destruction.
  - Scoped export.
- **AAD = `clientId || atomId || schemaVersion`** on every GCM operation. A ciphertext moved into another partition then fails authentication. *This* is what makes "cryptographic partition invariant" true.
- **IVs:** random 96-bit per encryption. Never use counter-based IVs across tabs, since collisions catastrophically break GCM.
- **Automatic logoff (§164.312(a)(2)(iii)):** zero the KEK and DEKs from memory on idle timeout, `visibilitychange` to hidden past a threshold, and screen lock.

### 2.2 Audit log (HIGH)

| Gap | Fix |
|---|---|
| "Append-only" in browser storage is a convention; any script or devtools can rewrite it | HMAC hash chain: `entry_n.mac = HMAC(K_audit, entry_n ‖ mac_{n-1})`. Periodically export the head hash as an anchor. Gives tamper *evidence*. |
| Logs writes only? | Log **reads** too: envelope generation, view, export, print, decrypt. Access logging is the point of §164.312(b). |
| Log contains clientId plus action metadata, which is PHI | Encrypt it. Use a separate audit key so a viewer role can be split later. |
| No user identity | §164.312(a)(2)(i) unique user identification. Even single-user installs need a user ID in each entry for multi-clinician devices. |

### 2.3 Durability and availability (HIGH)

- IndexedDB is **best-effort** storage. Call `navigator.storage.persist()` and surface the result. Safari ITP can evict script-writable storage after 7 days without interaction.
- Clinical records carry state retention obligations, often 7+ years. Browser storage is not a system of record.
- **Ship encrypted, versioned backup export** (passphrase-wrapped) and a tested restore path. Without them you have no contingency plan.

### 2.4 "Zero network transmission" must be enforced, not asserted (HIGH)

- **Strict CSP.** `connect-src` limited to the model weight origin(s); `script-src 'self'` with no third-party scripts; `default-src 'none'` baseline. SRI on everything. No analytics or error reporters, ever.
- **Browser-level egress you do not control,** which must go in deployment guidance or a startup self-check:
  - **Chrome/Brave Enhanced Spellcheck** sends textarea contents to Google. Set `spellcheck="false"` on all PHI inputs.
  - **Extensions** (Grammarly, AI sidebars, password managers) have DOM read access. Recommend a dedicated browser profile with zero extensions.
  - Built-in browser AI and "help me write" features, and page translation.
  - OS and browser sync of profile directories. Tolerable only if the vault is passphrase-encrypted per §2.1.

### 2.5 Mental-health-specific regulatory surface (MEDIUM, but legal)

- **Psychotherapy notes (§164.501, §164.508(a)(2))** have heightened protection distinct from SOAP and progress notes. Model them as a separate category with separate export rules.
- **42 CFR Part 2** applies if the clinician works in a federally assisted SUD program. Part 2 data must not commingle with general atoms in envelopes or exports without consent tracking.
- **Amendment (§164.526) and accounting of disclosures (§164.528):** the audit log should support generating these.

### 2.6 PII Sentinel bypass gating (MEDIUM)

- If clinical mode is a `localStorage` flag, anyone can flip it.
- Bind the bypass to an unlocked vault session.
- Ensure it **cannot persist into non-clinical or child-facing modes**: separate storage namespace and re-arm on mode exit. Audit-log mode transitions.

---

## 3. WebGPU OOM: Does Step-Down Free VRAM?

**Short answer:** only if you tear down and rebuild the engine. Even then, most of your step-down levels free negligible memory.

### 3.1 What actually consumes VRAM

**KV cache.** WebLLM/TVM allocates the paged KV cache at engine creation, sized from `context_window_size`. Changing a config value on a live engine does nothing. The TVM runtime also pools buffers, so freed memory may be returned to the pool rather than released to the device.

**Weights dominate.** Take Qwen2.5-7B at q4f16 as an example:

- Weights: roughly 4–5 GB.
- KV cache with GQA (28 layers × 4 KV heads × 128 dim × 2 (K,V) × 2 bytes fp16) is about **57 KB per token**:

| Context | KV cache |
|---|---|
| 32k | ~1.8 GB |
| 4k | ~230 MB |
| 512 | ~29 MB |

Steps below 4k free only a few hundred MB total against multi-GB weights. Six of your seven levels are mostly wasted retries. If 4k fails, the model does not fit.

**Activations and workspace** scale with `prefill_chunk_size`, not context length. If you are not lowering prefill chunk size alongside context, you are leaving the second-largest lever untouched.

### 3.2 Correct recovery sequence

1. `await engine.unload()`.
2. Explicitly drop references so pooled `GPUBuffer`s are `destroy()`'d. Do not rely on GC.
3. Check `device.lost`. If lost, or the adapter is consumed (newer spec: one `requestDevice` per adapter), call `navigator.gpu.requestAdapter()` again.
4. Recreate the engine with reduced `context_window_size` **and** `prefill_chunk_size`.
5. Use about 3 levels (e.g. 8k → 4k → 2k), then go straight to the 1.5B model.

### 3.3 Error classification (MEDIUM)

- **Error-scope capture.** Wrap allocations with `pushErrorScope('out-of-memory')` and `pushErrorScope('validation')`, plus `onuncapturederror`. Many failures you are calling "oom" are validation errors: exceeding `maxBufferSize` or `maxStorageBufferBindingSize`. Retrying at a smaller context will never fix these. Check `adapter.limits` *before* load and refuse incompatible model shards up front.
- **Device-loss signals.** `device.lost` resolving with `reason: 'destroyed'` vs `undefined` vs a GPU process crash are distinct. Your `gpu_process_dead` vs `oom` split is right in spirit; make sure it keys off `device.lost`, not error-string matching.
- **Preflight estimation.** WebGPU exposes no VRAM query. Maintain a per-model estimate (weights + KV(ctx) + workspace) and warn before load.

### 3.4 Clinical safety of degradation (HIGH)

- **Silent context reduction in a clinical tool is dangerous.** At 512–1k tokens, system prompt + guardrails + `risk_factor` atoms may not fit. Assert that `risk_factor` atoms and safety instructions are **never truncated**. If they cannot fit, refuse to generate prep rather than generating without them.
- **The 1.5B fallback** has materially higher hallucination rates for structured clinical summarization. When it is active, show a persistent "degraded model — verify all output" banner and write an audit entry.

### 3.5 Restart commands and Edge removal

- `chrome://`, `brave://`, and `about:restart` **cannot be navigated to from web content**. They work only as copy-to-clipboard instructions. Make sure the UI does not present them as clickable links that silently fail.
- **Removing Edge is a product error for this market.** Edge is the default managed browser in a large share of clinical and enterprise Windows environments. It is Chromium, so WebGPU works. Re-add `edge://restart` guidance. Vendor neutrality should not mean excluding your likeliest enterprise users.

---

## 4. Clinical Card Ethics

### 4.1 Audience (CRITICAL)

**Clinician-facing `clinical_assistant`:** defensible.

**`reflective_counselor` and `cbt_guide`:**
- If these can be used by *clients*, or by anyone who is not a licensed clinician, you are shipping an AI therapy chatbot.
- Several US states have moved to restrict AI-delivered therapy. Illinois' 2025 Wellness and Oversight for Psychological Resources Act is the prominent example; Nevada and Utah have related laws.
- **Have counsel verify current applicability.** Architecturally, gate these cards behind clinical-mode unlock and frame them as clinician rehearsal and supervision tools, not client-facing agents.

### 4.2 Guardrail placement (HIGH)

- Card V2 import means any imported card can override the system prompt. Safety constraints living *inside* cards are removable by design.
- **Fix:** add a non-overridable guardrail layer injected by the runtime outside the card, rendered before and after the card content. On import, strip or flag cards that attempt to countermand it. Character Card V2 is a roleplay-ecosystem format, so expect adversarial and jailbreak-laden cards in the wild.

### 4.3 Required card-level constraints

| Risk | Constraint |
|---|---|
| **Diagnosis** | Never assign DSM-5-TR/ICD codes or diagnostic labels. May list "considerations for clinician evaluation," explicitly marked as such. |
| **SOAP fabrication** (most likely real harm) | S and O sections only from provided source material. No invented quotes, vitals, or mental-status findings. Mark inferences `[INFERRED]`. Leave fields empty rather than fill them. A fabricated MSE finding in a legal record is worse than a blank one. |
| **Rogerian sycophancy** | LLM "active listening" degrades into validating harmful cognitions and plans. The reflective card needs explicit non-endorsement of self-harm, harm to others, and disordered behaviors. |
| **CBT** | Restructuring prompts must not challenge accurate perceptions of real danger (abuse, unsafe housing). |
| **Crisis** | The model must not perform risk *assessment* or determine risk level. It surfaces documented `risk_factor` atoms and prompts the clinician to apply their own protocol (C-SSRS, safety plan). Crisis referral resources (988 in the US; locale-configurable) belong in a static UI element, not model-generated text. |

### 4.4 `risk_factor` ordering side effects (MEDIUM)

Placing `risk_factor` at the envelope top is correct for prep salience. Watch for two problems:

- **Priming:** the model may inject risk language into unrelated outputs, such as treatment-goal summaries.
- **Staleness:** a resolved ideation history from three years ago presented as current. Atoms need `recordedAt`, `status` (active/resolved), and `lastReviewedAt`, rendered in the envelope.

---

## 5. Multi-Agent Orchestration Note

I cannot verify the model identifiers listed. Regardless of which frontier models are used, flag two issues:

- **Cloud LLM review contradicts the sovereignty claim at dev time.** Enforce a rule that no real PHI and no realistic synthetic PHI derived from real cases enters repos, fixtures, prompts, or worktrees sent to cloud CLIs. Add a pre-commit PHI scanner.
- **LLM adversarial review supplements a human security review and pentest of the crypto and storage layer; it does not replace one.** Models reviewing models' code share blind spots, especially on crypto misuse.

---

## Top 3 Priorities for the Next Wave

### P1: Make partitioning actually cryptographic and race-free

- Argon2id passphrase KEK, per-client DEKs, GCM AAD bound to `clientId‖atomId`.
- Auto-lock with key zeroization.
- Per-atom IndexedDB records with compound keys; delete `saveAllAtoms`; Web Locks across tabs.
- `clientId` captured at request initiation, with completion rejected on mismatch.
- Legacy atoms moved to quarantine; `resetChat()` and KV purge on every client switch.
- Encrypted, HMAC-chained audit log covering reads.

### P2: Enforce zero egress and durability

- Strict CSP plus SRI; `spellcheck="false"` on PHI fields.
- Startup self-check: persistent storage granted, CSP active, warnings about extensions and profile.
- Encrypted backup and restore with a tested round-trip.
- Clinician deployment guide: dedicated profile, no extensions, OS disk encryption, screen lock.
- Restore Edge support.

### P3: Runtime clinical safety layer, with OOM fixes subordinate to it

- Non-overridable guardrail layer outside cards.
- Grounded-only SOAP generation with `[INFERRED]` tagging; diagnosis prohibition; static crisis-resource UI.
- Reflective and CBT cards gated to the clinician audience; card import sanitization.
- OOM path rebuilt: full unload and device re-acquisition, reduce prefill chunk size, 3-level step-down.
- Never truncate safety or risk content, and refuse to generate if it cannot fit.
- Persistent degraded-model banner and audit entry on 1.5B fallback.

**Lower priority, still needed:** psychotherapy-note and Part 2 categories, atom staleness metadata, preflight VRAM estimation, an amendment/accounting-of-disclosures report generator, and an external crypto audit before any "HIPAA-ready" marketing claim.
