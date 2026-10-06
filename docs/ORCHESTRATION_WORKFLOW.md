# Standardized Multi-Agent Orchestration & Adversarial Review Workflow

This document codifies the sovereign multi-agent development and adversarial review workflow established across Antigravity (AGY), Grok 4.7, Claude Opus 5.5, and OpenAI GPT-6.1 Sol Pro.

---

## 1. Principles & The 5S Cycle

1. **Seiri (Sort / Cut)**: Cut unneeded dependencies, dead libraries, telemetry, and external cloud servers. Sovereign local software runs 100% on-device.
2. **Seiton (Straighten / Place)**: Discrete typed data structures (e.g. AtMem atoms over monolithic dumps). Clean directory boundaries, zero horizontal scrollbars.
3. **Seiso (Shine / Clean)**: Every pass leaves the repository cleaner than it was found. Done means a command ran. No faked tests.
4. **Standardize (Systematize)**: Repeatable invocation protocols (`summon <model> <prompt>`). Progen speech cadence on terminal output (`topic : comment.` with blank line).
5. **Sustain (Discipline)**: Continuous deterministic assertion suites (`npm test`, `tools/verify.sh`). All devbox and container environments fully version-controlled and revertible.

---

## 2. Agent Role Taxonomy

```
+-----------------------------------------------------------------------------------+
|                           CONDUCTOR (Root AGY Agent)                             |
|  - Tracks task plan, budgets, and invariants                                       |
|  - Dispatches parallel subagents & manages context window budget                   |
|  - Preserves Google/Grok quotas (>70% reserve)                                     |
+-----------------------------------------+-----------------------------------------+
                                          |
        +---------------------------------+---------------------------------+
        |                                 |                                 |
+-------v----------------+       +--------v---------------+       +---------v----------------+
|   BUILDER SUBAGENTS    |       |   AUDITOR SUBAGENTS    |       |     SUMMON GATEWAY       |
| - Specialized refactors|       | - Unit test runners    |       | - Claude Opus 5.5        |
| - Workspace: share/work|       | - Invariant assertion  |       | - GPT-6.1 Sol Pro        |
| - Discrete file edits  |       | - Memory leak audits   |       | - DeepSeek V3 (cheap/free|
+------------------------+       +------------------------+       +--------------------------+
```

### Roles
1. **Conductor (Root Agent)**:
   - Maintains situational awareness, user requirements, and system invariants.
   - Never consumes context on huge text walls; delegates large scans or reviews to subagents or frontier models.
   - Enforces the 70% quota floor for Gemini and Grok.
2. **Builder Subagents**:
   - Invoked via `invoke_subagent` using workspace `share` (git worktree) or `inherit`.
   - Modifies specific architectural components (e.g. AtMem privacy fences, WebGPU context manager, UI modals).
3. **Auditor / Invariant Verifier Subagents**:
   - Executes real runtime tests (`npm test`, `verify.sh`).
   - Verifies zero cross-profile/client leakage, token budget ceilings, and failure fencing.
4. **Frontier Summon Reviewers**:
   - Invoked via sovereign CLI (`python tools/summon <model> <prompt>`).
   - OpenRouter and Vercel AI Gateway balance utilized for adversarial teardowns.
   - Claude Opus 5.5 and GPT-6.1 Sol Pro conduct deep structural critique; DeepSeek V3 handles rapid high-volume auditing.

---

## 3. Sovereign Summon Protocol

The `summon` tool routes prompts directly to frontier models via HTTP streaming without third-party frameworks:

```bash
# High-effort adversarial critique
python tools/summon opus 5.5 "Audit AtMem client partition invariants for race conditions"

# Sol 6.1 Pro deep systems review
python tools/summon sol 6.1 "Review WebGPU buffer allocation and memory drop recovery"

# Cost-effective high-throughput review
python tools/summon deepseek/deepseek-chat "Lint TypeScript schemas and check edge cases"
```

### Model Selection & Budget Routing Matrix
| Task Complexity | Primary Model | Routing Path | Budget Priority |
|---|---|---|---|
| Invariant Audit & High-Risk Review | `anthropic/claude-opus-5.5` | OpenRouter / Vercel | High-effort credit authorization |
| Systems Deep Architecture Review | `openai/gpt-6.1-sol-pro` | OpenRouter / Vercel | High-effort credit authorization |
| Broad File Sweep & Schema Lint | `deepseek/deepseek-chat` | OpenRouter | Low-cost balance optimization |
| Root Task Orchestration & Edits | AGY (Google Gemini) | Native AGY | Quota maintained >70% |
| Terminal / CLI Loop Operations | Grok 4.7 | Native Grok | Quota maintained >70% |

---

## 4. Multi-Agent Development Lifecycle

1. **Phase 1: Invariant Identification & Scope Definition**:
   - Pin down non-negotiable invariants (e.g. zero cross-client leakage, zero Edge telemetry, local WebGPU execution).
2. **Phase 2: Surgical Implementation**:
   - Builders execute atomic edits. Every edit preserves backwards compatibility with existing profiles and schemas.
3. **Phase 3: Verification & Test Suite Expansion**:
   - Auditors create and execute deterministic unit tests covering normal paths, edge cases, and adversary attempts.
4. **Phase 4: Adversarial Frontier Critique**:
   - Conductor dispatches an adversarial review prompt to Opus 5.5 and DeepSeek V3.
   - Critical observations and vulnerabilities are extracted into a markdown observation report.
5. **Phase 5: Kaizen Remediation**:
   - Deficiencies identified by the frontier models are immediately resolved in code and locked in with new regression tests.

---

## 5. Invariants & Fences

- **Local Execution**: All LLM inference runs inside the user's browser via WebGPU (MLC/TVM). Zero prompt or session data is transmitted to cloud APIs.
- **Privacy Fences**: Client memory partitions (`clientId`) must be isolated with cryptographic rigor and runtime assertion checks. Contamination throws a fatal exception.
- **Sovereign Browsers**: Brave is default (`brave://restart`), Zen/Firefox is fallback (`about:restart`). Microsoft Edge is NEVER recommended or spawned.
- **UI Ergonomics**: Zero horizontal scrollbars (`overflow-x: hidden`, `flex-wrap: wrap`). Zero button parentheticals. Crisp human-readable labels.
