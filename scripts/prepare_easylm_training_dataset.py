#!/usr/bin/env python3
# SPDX-License-Identifier: AGPL-3.0-or-later
"""Dataset preparation script for EasyLM & Hydra foundation and skill adapters.

Compiles a comprehensive, multi-thousand-turn instruction-tuning suite in ChatML format:
1. `adapter_stacks_chatml.jsonl`:
   - All stacks in `C:\\Users\\jpm05\\Documents\\easylm\\stacks` (all 32-92 stacks)
   - All stacks in `C:\\Users\\jpm05\\Documents\\stacks` (91 GFC textbooks + 38 discipline corpora)
   - All 2,528 Alice `stack_cards.jsonl` cards
   - All 4,634 rows across the 369 Google Drive Fact Tables (`fact_tables_unified.jsonl` + CSV/MD exports)
2. `adapter_hydra_chatml.jsonl` (NEW — Hydra Curriculum):
   - Hydra CLI (`hydra`, `hydra agent`, `hydra swarm`, `hydra serve` port 7777, `@[hydra]` routing capsules, `hydra mcp`)
   - Hydra TUI (`hydra-tui-rs`) and Hydra Desktop (`hydra-desktop-rs`) modes (`chat`, `agent`, `swarm`, `computer`, `terminal`),
     permissions (`manual`, `accept_edits`, `plan`, `bypass`), context modes (`recall`, `compact`, `sliding`), and `stdio` JSONL protocol
   - Hydra Model Roster with Bonsai 2 9B (`bonsai 2 9b` / `prism-ml/Ternary-Bonsai-2-9B-gguf`) as the default agent,
     `bonsai 2 2b` (500MB), `bonsai 2 4b` (1GB), `bonsai 2 27b` (6GB), frontier escalation (`opus 5.5`, `sonnet 5.5`, `sol 6.1 pro`),
     free pool (`openrouter :free`, `cloudflare @cf/*`), local inference (`ollama`, `llama.cpp`), and all catalog aliases
   - Sovereign execution genome invariants (Progen syntax `topic : comment`, zero copula `P018`, zero fake tests,
     ponytail wu wei, live intelligence invariant, Rust implementation mandate, state vectors, git discipline, and fences)
3. `adapter_personalities_chatml.jsonl`:
   - All 75 EasyLM `PERSONALITIES` (`src/data/personalities.ts`)
   - All 151 Council of Kami books (`snowgate-alice/rust-backend/data/council_books/*.md`)
   - Alice's Carrollian & Socratic Antithesis layer (`Q01`–`Q12` question shapes, `C1`–`C6` confusion diagnosis, `S0`–`S6` elenchus/aporia)
   - Muse's `ether-fishing` why-ledger (`W0001` why before how, `W0002` append-only supersession, `W0003` empirical verification, `taste-futures`)
4. `adapter_hands_chatml.jsonl`, `adapter_features_chatml.jsonl`, `adapter_settings_chatml.jsonl`,
   `adapter_security_chatml.jsonl`, `adapter_kidsafety_chatml.jsonl`, `adapter_tools_chatml.jsonl`:
   - Updated with the Bonsai 2 lineup (`2B` at 500MB as universal default for all EasyLM users, coaching users to step up to
     `4B` at 1GB, `9B` at 2GB, and `27B` at 6GB as they advance; plus Gemma 4 multimodal support and Ternary-Bonsai-2 vision-tower + 262K context)
5. `adapter_easylm_master_chatml.jsonl`:
   - Unified master ChatML dataset combining all of the above.
"""

from __future__ import annotations

import json
import os
from pathlib import Path
import re
import sys
from typing import Any

EASYLM_ROOT = Path(__file__).resolve().parents[1]
DOCS_ROOT = EASYLM_ROOT.parent
STACKS_DIR = EASYLM_ROOT / "stacks"
DATA_DIR = EASYLM_ROOT / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

HYDRA_ROOT = DOCS_ROOT / "hydra"
COUNCIL_BOOKS_DIR = DOCS_ROOT / "snowgate-alice" / "rust-backend" / "data" / "council_books"
PERSONALITIES_TS = EASYLM_ROOT / "src" / "data" / "personalities.ts"

# Ensure scripts directory is importable
if str(EASYLM_ROOT / "scripts") not in sys.path:
    sys.path.insert(0, str(EASYLM_ROOT / "scripts"))

import compile_adapter_datasets as cad
import compile_easylm_dataset as ced


# ==============================================================================
# 1. STACKS + 369 DRIVE FACT TABLES + 92 STACKS
# ==============================================================================

def compile_stacks_conversations() -> list[dict]:
    """Compiles all stacks (easylm/stacks + documents/stacks + stack_cards + 369 Drive fact tables)."""
    stacks_out = DATA_DIR / "adapter_stacks_chatml.jsonl"
    cad.compile_stacks_to_jsonl(STACKS_DIR, stacks_out, include_extended_corpora=True)

    conversations: list[dict] = []
    if stacks_out.is_file():
        with open(stacks_out, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    conversations.append(json.loads(line))

    # Add high-level discipline overview & methodology conversations for every stack pack
    packs_file = STACKS_DIR / "PACKS.json"
    if packs_file.exists():
        packs = json.loads(packs_file.read_text(encoding="utf-8"))
        for pack in packs:
            slug = pack["slug"]
            title = pack.get("title", slug)
            desc = pack.get("description", "")
            dewey = pack.get("dewey", "000")
            conversations.append({
                "messages": [
                    {
                        "role": "system",
                        "content": "You are EasyLM, an on-device local AI with deep mastery over the 92 sovereign academic stacks and 369 Drive Fact Tables.",
                    },
                    {
                        "role": "user",
                        "content": f"What is the foundational scope and methodology of the {title} stack (Dewey {dewey}) in EasyLM?",
                    },
                    {
                        "role": "assistant",
                        "content": (
                            f"discipline : {title} (Dewey {dewey}, slug `{slug}`).\n\n"
                            f"scope : {desc}.\n\n"
                            "methodology : physical mechanism first, formal mathematical law second, worked numerical check third, "
                            "verified against authoritative .gov, .edu, and standards link doors."
                        ),
                    },
                ]
            })

    # Also include existing stacks examples from compile_easylm_dataset
    try:
        packs_meta = ced.load_packs_metadata()
        for ex in ced.generate_stacks_examples(packs_meta):
            conversations.append(ex.to_chatml())
    except Exception:
        pass

    return conversations


# ==============================================================================
# 2. HYDRA CURRICULUM (CLI, TUI, DESKTOP, BONSAI 2 9B DEFAULT, GENOME)
# ==============================================================================

def compile_hydra_conversations() -> list[dict]:
    """Compiles comprehensive multi-turn ChatML training conversations for Hydra."""
    conversations: list[dict] = []
    hydra_sys = (
        "You are Hydra (`v1.2.2`) and EasyLM's Sovereign Multi-Headed AI Router & Autonomous Agent Engine. "
        "Your default agent model is Bonsai 2 9B (`bonsai 2 9b` / `prism-ml/Ternary-Bonsai-2-9B-gguf`). "
        "You adhere strictly to the sovereign execution genome and Progen syntax (`topic : comment`) when requested."
    )

    core_hydra_qa = [
        (
            "What is Hydra, and what is the default agent model in the Hydra roster?",
            "engine : Hydra v1.2.2 sovereign multi-headed CLI AI router, TUI (`hydra-tui-rs`), and native Rust Desktop app (`hydra-desktop-rs`).\n\n"
            "default agent model : Bonsai 2 9B (`bonsai 2 9b` / `prism-ml/Ternary-Bonsai-2-9B-gguf` / `welcoma/Ternary-Bonsai-8B-bonsai_tq_f32-MLC`, ~2 GB footprint, 262K context window, native vision-tower).\n\n"
            "bonsai 2 lineup : `bonsai 2 2b` (500 MB universal edge default), `bonsai 2 4b` (1 GB intermediate step-up), `bonsai 2 9b` (2 GB default Hydra agent & reasoning workhorse), and `bonsai 2 27b` (6 GB sovereign workstation flagship).\n\n"
            "capabilities : dispatches single prompts, autonomous ReAct agent loops (`hydra agent`), parallel multi-head swarms (`hydra swarm`), MCP tool servers (`hydra mcp`), and an OpenAI-compatible gateway (`hydra serve` on port 7777)."
        ),
        (
            "Explain the full Bonsai 2 model lineup across EasyLM and Hydra and how memory tiers scale from 500MB to 6GB.",
            "universal default (500 MB) : `bonsai 2 2b` (`Bluebarrels/easylm-bonsai-2-2b`, base `prism-ml/Ternary-Bonsai-2-2B-gguf` / `welcoma/Ternary-Bonsai-1.7B-bonsai_tq_f32-MLC`) serves as the 500 MB universal default for all EasyLM users, loading instantly on phones, tablets, Chromebooks, and laptops.\n\n"
            "intermediate step-up (1 GB) : `bonsai 2 4b` (`Bluebarrels/easylm-bonsai-2-4b`, base `prism-ml/Ternary-Bonsai-2-4B-gguf` / `welcoma/Ternary-Bonsai-4B-bonsai_tq_f32-MLC`) coaches users stepping up to deeper multi-step reasoning and coding on 4 GB+ devices.\n\n"
            "default hydra agent & advanced workhorse (2 GB) : `bonsai 2 9b` (`Bluebarrels/easylm-bonsai-2-9b`, base `prism-ml/Ternary-Bonsai-2-9B-gguf` / `welcoma/Ternary-Bonsai-8B-bonsai_tq_f32-MLC`) operates as the default agent for Hydra (`hydra agent`) and EasyLM's advanced reasoning workhorse.\n\n"
            "sovereign workstation flagship (6 GB) : `bonsai 2 27b` (`Bluebarrels/easylm-bonsai-2-27b`, base `prism-ml/Ternary-Bonsai-2-27B-gguf`) delivers 27-billion-parameter ternary synthesis within a 6 GB footprint, 262K context window, and integrated vision-tower."
        ),
        (
            "How do I use the Hydra CLI for direct model summoning, autonomous agent loops, multi-agent swarms, and the local OpenAI gateway?",
            "direct summoning : run `hydra \"<prompt>\"` (uses default `bonsai 2 9b`), `hydra bonsai 2 9b \"<prompt>\"`, `hydra opus 5.5 high \"State the invariants\"`, `hydra sonnet 5.5 \"Explain cache coherence\"`, or `hydra sol 6.1 pro \"Audit for races\"`.\n\n"
            "autonomous agent loop : run `hydra agent \"Inspect the latest commits and run the unit tests\"` to execute a multi-turn ReAct loop with active MCP tools, or attach MCP tools to any alias via `hydra sonnet 5.5 --mcp \"<prompt>\"`.\n\n"
            "multi-head swarm : run `hydra swarm \"Design a write-ahead log\"` or delegate heads to external binaries via `hydra swarm \"Refactor parser\" --heads architect:hermes,coder:pi,auditor`.\n\n"
            "sovereign gateway : run `hydra serve --port 7777 --host 127.0.0.1` to expose `/v1/models` and `/v1/chat/completions` for Hermes, Pi, and external OpenAI-compatible tools (`export OPENAI_BASE_URL=\"http://127.0.0.1:7777/v1\"`)."
        ),
        (
            "How do `@[hydra]` routing capsules work in the sovereign workspace?",
            "mechanism : `@[hydra]` capsules route high-entropy architectural design, formal security audits, or multi-perspective swarm tasks from an orchestrator or local agent to targeted Hydra heads.\n\n"
            "compute tiering : mechanical and deterministic transformations execute on local zero-cost models (`bonsai 2 9b`, `hydra local`, `hydra free`); high-entropy semantic audits escalate to metered frontier models (`@[hydra] opus 5.5 high`, `@[hydra] sol 6.1 pro`, `@[hydra] swarm`) only on formal necessity.\n\n"
            "state vector header : every `@[hydra]` dispatch declares canonical Progen state vectors (`intention`, `requirement`, `course of action`, `end result`, `reason`, `demand`, `compliance`)."
        ),
        (
            "What are the five operational modes in Hydra TUI (`hydra-tui-rs`) and Hydra Desktop (`hydra-desktop-rs`)?",
            "mode chat : direct conversational and Progen synthesis with zero-latency streaming across any local or frontier alias.\n\n"
            "mode agent : autonomous multi-turn ReAct loop with file read/write, git inspection, shell command execution, checkpointing, and MCP tool invocation.\n\n"
            "mode swarm : parallel multi-head orchestration dispatching Architect (`opus 5.5` / `hermes`), Coder (`sonnet 5.5` / `pi`), and Auditor (`sol 6.1 pro`) followed by Synthesizer (`gemini 3.8 flash`) consolidation.\n\n"
            "mode computer : sovereign computer-use and headless browser/GUI inspection via Playwright MCP and screen coordinate action verification.\n\n"
            "mode terminal : direct interactive shell execution and background task management (`tasks`, `task_stop`, `task_update`) integrated with the thread ledger."
        ),
        (
            "Explain the four permission levels (`manual`, `accept_edits`, `plan`, `bypass`) in Hydra TUI and Hydra Desktop.",
            "permission manual : every tool call emits an `approval_request` to the UI and blocks until answered (`allow`, `allow_always`, `skip`, or `abort`), except calls matched by saved `allow_always` rules.\n\n"
            "permission accept_edits : read-only inspection tools, `git_status`, `git_diff`, `write_file`, and `edit_file` execute automatically (`auto_decision : allow`); shell commands and external mutations prompt for approval.\n\n"
            "permission plan : read-only tools execute automatically; all mutating or shell tools are skipped without prompting (`auto_decision : skip`) so the model formulates a verified architectural plan without altering files.\n\n"
            "permission bypass : all authorized tools execute autonomously without interactive approval prompts for high-velocity sovereign builds."
        ),
        (
            "How do the three context modes (`recall`, `compact`, `sliding`) work in Hydra?",
            "context mode recall (default) : dynamic context threading stored in `~/.hydra/sessions/<id>/ledger.db`. Every turn is indexed with category and keyword labels; on the next turn, SQLite FTS5 with synonym expansion retrieves matching historical turns whole alongside pinned instruction turns.\n\n"
            "context mode compact : keeps recent turns live until active text exceeds 80% of the model context window (~3 chars/token), then collapses turns older than the last 4 into a dense model-written summary.\n\n"
            "context mode sliding : retains the most recent 4 turns whole in a deterministic sliding window."
        ),
        (
            "Explain the Hydra stdio JSON-Lines protocol (`docs/STDIO_PROTOCOL.md`) between `hydra-desktop-rs` / `hydra-tui-rs` and `python -m hydra_cli stdio`.",
            "framing : UTF-8 JSON objects, one per line (`\\n`), over private stdin/stdout descriptors while redirecting fd 0 to null and fd 1 to stderr so child tools never corrupt the protocol pipe.\n\n"
            "handshake : agent emits `{\"type\":\"hello\",\"protocol\":1,\"agent\":\"hydra\",\"capabilities\":[...],\"context_modes\":[\"recall\",\"compact\",\"sliding\"]}` before reading input.\n\n"
            "app-to-agent messages : `turn` (starts a turn with `turn`, `prompt`, `thread`, `cwd`, `mode`, `model`, `permission`, `skills`, `checkpoint`), `cancel`, `approval` (`allow`, `allow_always` with `thread`/`project` scope and command `prefix` guard, `skip`, `abort`), `checkpoints`, `rewind`, `tasks`, `task_stop`, `skills`, `mcp`, `mcp_toggle`, `rules`, `sessions`, `history`, `action`, `shutdown`.\n\n"
            "agent-to-app messages : `hello`, `checkpoint`, `context`, `token`, `auto_decision`, `approval_request`, `tool_start`, `diff`, `tool_result`, `usage`, `retry`, `task_update`, `error`, and `done` (guaranteed last message per turn, up to 8 concurrent turns across distinct threads)."
        ),
        (
            "How does Hydra route across its model tiers: Default Agent (`bonsai 2 9b`), Frontier Escalation, Free Pool, and Local Inference?",
            "tier 0 default agent : `bonsai 2 9b` (`prism-ml/Ternary-Bonsai-2-9B-gguf`), plus `bonsai 2 2b` (500MB), `bonsai 2 4b` (1GB), and `bonsai 2 27b` (6GB).\n\n"
            "tier 1 local inference (`hydra local`) : probes `LOCAL_AI_BASE`, `OLLAMA_HOST` (`127.0.0.1:11434`), and `LLAMACPP_HOST` (`127.0.0.1:8080` / `8000`) with zero cloud egress.\n\n"
            "tier 2 free pool (`hydra free`) : routes to Cloudflare Workers AI (`@cf/meta/llama-3.3-70b-instruct-fp8-fast`) when `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` are set, falling back to OpenRouter `:free` models (`google/gemma-4-26b-a4b-it:free`, `google/gemma-4-31b-it:free`, `nvidia/nemotron-3-super-120b-a12b:free`, `nvidia/nemotron-3.5-lightning:free`).\n\n"
            "tier 3 frontier escalation : routes `opus 5.5` (`anthropic/claude-opus-5.5`), `sonnet 5.5` (`anthropic/claude-sonnet-5.5`), and `sol 6.1 pro` (`openai/gpt-6.1-sol`) across OpenRouter, Vercel AI Gateway, CheaperInference, RunPod, and Modal with automatic pre-first-token failover."
        ),
        (
            "State the core invariants of the Sovereign Execution Genome (`AGENTS.md` and `progen_invariants.md`).",
            "dialect : Progen syntax (`topic : comment`), one statement per line, separated by exactly one blank line delimiter.\n\n"
            "zero copula P018 : never emit leading copulas `is`, `are`, `was`, `were` in comments; assert raw predicates directly.\n\n"
            "forbidden tells : P001 zero parentheticals in prose; P002/P003/P008 zero likeability mush, AI identity declarations, or marketing buzzwords; P004 zero contrast dualism (`not X, but Y`); P005 zero trailing conversational hooks; P006 zero recap headers; P007 zero disclaimer theater; P013/P102 zero stubs or unverified completion claims.\n\n"
            "ponytail wu wei : consolidate runnable verification into single-grip deterministic runners; ban synthetic mocks and fake unit tests.\n\n"
            "live intelligence : verify upstream AI/ML state via live docs or web search before acting; set context defaults to true hardware capability.\n\n"
            "software language mandate : author all new software in Rust and only Rust until explicit countermand; maintain clean git trunk convergence pushed to remote origin."
        ),
        (
            "How do I call Hydra from Python or Rust, and how do I use MCP servers in Hydra?",
            "python api : import `from hydra_cli import complete, run_agent_loop, McpRegistry`; call `complete(\"bonsai 2 9b\", \"Explain memory barriers\")` or run a tool-augmented loop with `run_agent_loop(\"bonsai 2 9b\", \"Inspect git status\", registry=McpRegistry())`.\n\n"
            "rust desktop / tui integration : spawn `python -m hydra_cli stdio` and exchange line-delimited JSON frames (`turn`, `token`, `tool_start`, `tool_result`, `done`).\n\n"
            "mcp servers : initialize via `hydra mcp init`, which configures `filesystem`, `fetch`, `sqlite`, `git`, `github`, `searxng`, `memory`, and `playwright` in `~/.hydra/mcp_servers.json` with strict secret isolation (provider API keys are never leaked into MCP child processes)."
        ),
    ]

    for q, a in core_hydra_qa:
        conversations.append({
            "messages": [
                {"role": "system", "content": hydra_sys},
                {"role": "user", "content": q},
                {"role": "assistant", "content": a},
            ]
        })

    # Multi-turn Hydra workflows (CLI + TUI + Swarm + Rewind + Progen)
    multi_turn_hydra = [
        [
            {"role": "system", "content": hydra_sys},
            {"role": "user", "content": "I want to start an autonomous coding session in Hydra using the default agent model, inspect my repository safely first, and then allow file edits. How should I configure my session?"},
            {"role": "assistant", "content": "model selection : use `bonsai 2 9b` (`prism-ml/Ternary-Bonsai-2-9B-gguf`), the 2 GB default agent in Hydra with 262K context and tool-use mastery.\n\ninitial permission : start in `plan` mode (`\"permission\": \"plan\"` in stdio or `/permission plan` in `hydra-tui-rs`) so read-only tools (`filesystem` read/list, `git_status`, `git_diff`) execute automatically while mutating tools are skipped.\n\ncontext strategy : keep `recall` mode active so every turn is indexed into `~/.hydra/sessions/<id>/ledger.db` with FTS5 keyword recall."},
            {"role": "user", "content": "Great, the plan looks solid. Now how do I switch permissions to let it apply edits and run `cargo test` without asking me on every single `cargo test` run?"},
            {"role": "assistant", "content": "edit permission : switch permission to `accept_edits` so `write_file`, `edit_file`, `git_status`, and `git_diff` run automatically while shell commands still request approval.\n\nprefix approval rule : when the `approval_request` arrives for `run_command` with `cargo test`, respond with `{\"type\":\"approval\",\"id\":\"a1\",\"decision\":\"allow_always\",\"scope\":\"project\",\"prefix\":\"cargo test\"}`.\n\nsecurity invariant : Hydra enforces word-boundary prefix matching and rejects any command containing shell chaining or redirection (`&&`, `||`, `;`, `|`, `>`, `<`, `` ` ``, `$()`), ensuring only clean `cargo test` invocations auto-run."},
        ],
        [
            {"role": "system", "content": hydra_sys},
            {"role": "user", "content": "What happens if an agent turn makes a bad edit across three files in Hydra Desktop? How do I roll back both the files and the conversation?"},
            {"role": "assistant", "content": "checkpoint mechanism : at the start of every turn (`checkpoint: true` by default), Hydra snapshots the working tree and records the exact conversation turn count in a `checkpoint` event before any tool executes.\n\nlisting checkpoints : send `{\"type\":\"checkpoints\",\"id\":\"req-1\",\"thread\":\"<thread_id>\"}` to receive `checkpoint_list` (newest first, with timestamp and turn count).\n\natomic rewind : send `{\"type\":\"rewind\",\"id\":\"req-2\",\"thread\":\"<thread_id>\",\"checkpoint\":\"<checkpoint_id>\"}`. Hydra first creates a safety backup snapshot (`backup` ID in `rewind_result`), restores all modified/deleted files, removes newly created debris files, and rewinds the thread's conversation history to that exact turn boundary."},
        ],
    ]
    conversations.extend(multi_turn_hydra)

    # Extract all aliases from hydra_cli/catalog.json so the model knows every single Hydra alias
    catalog_path = HYDRA_ROOT / "hydra_cli" / "catalog.json"
    if catalog_path.is_file():
        try:
            catalog = json.loads(catalog_path.read_text(encoding="utf-8"))
            aliases = catalog.get("aliases", {})
            for alias_name, spec in sorted(aliases.items()):
                model_id = spec.get("model", "")
                effort = spec.get("effort", "standard")
                mode = spec.get("mode", "default")
                runner = spec.get("runner", "native")
                conversations.append({
                    "messages": [
                        {"role": "system", "content": hydra_sys},
                        {"role": "user", "content": f"How does Hydra resolve the model alias `{alias_name}` and how do I invoke it from the CLI?"},
                        {
                            "role": "assistant",
                            "content": (
                                f"alias : `{alias_name}`.\n\n"
                                f"resolved model id : `{model_id}`.\n\n"
                                f"reasoning effort : `{effort}` (mode `{mode}`, runner `{runner}`).\n\n"
                                f"cli invocation : `hydra {alias_name} \"<prompt>\"` or with MCP tools via `hydra {alias_name} --mcp \"<prompt>\"`."
                            ),
                        },
                    ]
                })
        except Exception:
            pass

    # Also extract sections from hydra/GUIDE.md, hydra/README.md, and hydra/docs/STDIO_PROTOCOL.md
    for doc_rel, doc_title in [
        ("GUIDE.md", "Hydra Setup and Integration Guide"),
        ("README.md", "Hydra Sovereign Multi-Headed AI Shell Reference"),
        ("docs/STDIO_PROTOCOL.md", "Hydra Native Stdio Protocol Specification"),
    ]:
        doc_path = HYDRA_ROOT / doc_rel
        if doc_path.is_file():
            text = doc_path.read_text(encoding="utf-8", errors="ignore")
            sections = re.split(r"\n##+\s+", text)
            for sec in sections[1:]:
                lines = sec.strip().splitlines()
                if not lines:
                    continue
                sec_title = lines[0].strip()
                sec_body = "\n".join(lines[1:]).strip()
                if len(sec_body) >= 60:
                    conversations.append({
                        "messages": [
                            {"role": "system", "content": hydra_sys},
                            {"role": "user", "content": f"Explain the '{sec_title}' section of the {doc_title} in Hydra."},
                            {"role": "assistant", "content": f"section : {sec_title} ({doc_title}).\n\n{sec_body[:1500]}"},
                        ]
                    })

    return conversations


# ==============================================================================
# 3. PERSONALITIES + 151 COUNCIL OF KAMI + SOCRATIC ANTITHESIS + ETHER-FISHING
# ==============================================================================

def _parse_personalities_ts() -> list[dict]:
    """Extracts all 75 personalities from src/data/personalities.ts."""
    results: list[dict] = []
    if not PERSONALITIES_TS.is_file():
        return results
    text = PERSONALITIES_TS.read_text(encoding="utf-8", errors="ignore")
    # Match each object block in PERSONALITIES
    pattern = re.compile(
        r"\{\s*id:\s*['\"]([^'\"]+)['\"],\s*name:\s*['\"]([^'\"]+)['\"],\s*category:\s*['\"]([^'\"]+)['\"][\s\S]*?description:\s*(['\"])(.*?)\4[\s\S]*?systemPrompt:\s*`([^`]+)`",
        re.MULTILINE,
    )
    for m in pattern.finditer(text):
        results.append({
            "id": m.group(1).strip(),
            "name": m.group(2).strip(),
            "category": m.group(3).strip(),
            "description": m.group(5).strip(),
            "systemPrompt": m.group(6).strip(),
        })
    return results


def _parse_council_books() -> list[dict]:
    """Parses all 151 Council of Kami books from snowgate-alice/rust-backend/data/council_books/*.md."""
    books: list[dict] = []
    if not COUNCIL_BOOKS_DIR.is_dir():
        return books
    for md_path in sorted(COUNCIL_BOOKS_DIR.glob("*.md")):
        raw = md_path.read_text(encoding="utf-8", errors="ignore")
        title = md_path.stem.replace("-", " ").title()
        author_voice = "Council Member"
        seat = ""
        topic = ""
        body = raw
        if raw.startswith("---"):
            parts = raw.split("---", 2)
            if len(parts) >= 3:
                fm = parts[1]
                body = parts[2].strip()
                m_t = re.search(r'^title:\s*"?([^"\n]+)"?', fm, re.MULTILINE)
                m_a = re.search(r'^author_voice:\s*"?([^"\n]+)"?', fm, re.MULTILINE)
                m_s = re.search(r'^council_seat:\s*([^\n]+)', fm, re.MULTILINE)
                m_top = re.search(r'^topic:\s*"?([^"\n]+)"?', fm, re.MULTILINE)
                if m_t:
                    title = m_t.group(1).strip()
                if m_a:
                    author_voice = m_a.group(1).strip()
                if m_s:
                    seat = m_s.group(1).strip()
                if m_top:
                    topic = m_top.group(1).strip()
        books.append({
            "slug": md_path.stem,
            "title": title,
            "author_voice": author_voice,
            "seat": seat,
            "topic": topic,
            "body": body,
        })
    return books


def compile_personalities_conversations() -> list[dict]:
    """Compiles EasyLM PERSONALITIES, 151 Council of Kami voices, Alice Socratic Antithesis, and Muse ether-fishing."""
    conversations: list[dict] = []

    # A. Existing rich personality examples from compile_easylm_dataset.py
    try:
        for ex in ced.generate_personality_examples():
            conversations.append(ex.to_chatml())
    except Exception:
        pass

    # B. All 75 EasyLM Personalities from src/data/personalities.ts
    parsed_personalities = _parse_personalities_ts()
    sample_prompts_by_category = {
        "practical": (
            "How should we approach learning a difficult technical subject without fooling ourselves with surface-level summaries?",
            "Break the inquiry into verifiable steps: start with a concrete observation or primary source card, test one small claim at a time, and separate what is directly measured from what is guessed. If a gap remains in our evidence, keep that gap plainly visible until we verify it."
        ),
        "philosophy": (
            "When someone claims with absolute certainty that they know what makes a human life good and just, how should we examine that claim?",
            "Let us pause before applauding the certainty of the claim and ask for the plain rule behind the words. Does their rule hold at the boundary when fortune reverses or when two duties collide? By testing our unexamined convictions against concrete counterexamples, we trade false conceit of knowledge for honest inquiry."
        ),
        "science": (
            "What distinguishes a genuine physical explanation from merely naming a phenomenon with impressive technical vocabulary?",
            "Naming a phenomenon tells you nothing about how nature actually works. A genuine scientific explanation identifies the physical mechanism—how the forces, particles, or energy states interact—expresses the invariant quantitative law, and survives an empirical measurement that could have proved it false."
        ),
        "literature": (
            "How does careful attention to concrete detail and human motive reveal truths that abstract slogans miss?",
            "Abstract slogans flatten human beings into tidy formulas, whereas closely observed detail—the hesitation before a spoken promise, the weight of an old habit, the quiet contradiction between word and deed—shows the living texture of character and moral choice."
        ),
        "characters": (
            "We have a puzzling problem with three conflicting clues and everyone jumping to conclusions. How do you proceed?",
            "Never theorize before you have examined all the facts! First, separate the indisputable physical facts from hearsay. Next, test each hypothesis against the one awkward detail that nobody else noticed. When you have eliminated what cannot possibly be true, inspect what remains."
        ),
        "clinical": (
            "I feel completely overwhelmed by everything I have to fix in my life this month and don't know where to start.",
            "It makes complete sense that looking at the whole month all at once feels crushing. Let us set next month and next week aside for right now. What is one small, gentle, concrete action you can take in the next twenty minutes—like drinking a glass of water, stepping outside for fresh air, or tidying one corner of your desk?"
        ),
    }

    for p in parsed_personalities:
        sys_p = p["systemPrompt"]
        cat = p["category"]
        name = p["name"]
        desc = p["description"]
        # Conversation 1: Role & Method introduction in-voice
        conversations.append({
            "messages": [
                {"role": "system", "content": sys_p},
                {"role": "user", "content": f"Who are you in EasyLM's {name} mode, and how do you guide my thinking and study?"},
                {
                    "role": "assistant",
                    "content": (
                        f"I am operating in **{name}** mode ({cat}). {desc}\n\n"
                        "My commitment is to grounded truth, intellectual honesty, and clear reasoning: "
                        "every factual claim rests on verified library cards or deterministic tools, and whenever evidence is absent, "
                        "I state plainly what is unknown rather than guessing."
                    ),
                },
            ]
        })
        # Conversation 2: Category inquiry
        q_cat, a_cat = sample_prompts_by_category.get(cat, sample_prompts_by_category["practical"])
        conversations.append({
            "messages": [
                {"role": "system", "content": sys_p},
                {"role": "user", "content": q_cat},
                {"role": "assistant", "content": f"[{name}] {a_cat}"},
            ]
        })

    # C. All 151 Council of Kami Books (snowgate-alice/rust-backend/data/council_books/*.md)
    council_books = _parse_council_books()
    for book in council_books:
        voice = book["author_voice"]
        seat = book["seat"]
        title = book["title"]
        topic = book["topic"]
        body = book["body"]

        # Extract the first two substantial sections or paragraphs from the book
        sections = [s.strip() for s in re.split(r"\n##+\s+", body) if len(s.strip()) > 100]
        excerpt_1 = sections[0][:1400] if sections else body[:1400]
        excerpt_2 = sections[1][:1400] if len(sections) > 1 else body[1400:2800]

        council_sys = (
            f"You are speaking in the Council of Kami voice of {voice} (Council Seat {seat}), "
            f"author of '{title}'. Ground your counsel in verified historical/scientific practice and plain clarity."
        )
        conversations.append({
            "messages": [
                {"role": "system", "content": council_sys},
                {
                    "role": "user",
                    "content": f"Consult Council of Kami Seat {seat} ({voice}) on '{title}': what is your core principle and how does it apply to sovereign reasoning?",
                },
                {
                    "role": "assistant",
                    "content": (
                        f"council voice : {voice} (Seat {seat}).\n\n"
                        f"book : {title}.\n\n"
                        f"core mapping : {topic[:500]}\n\n"
                        f"counsel :\n{excerpt_1}"
                    ),
                },
            ]
        })
        if excerpt_2:
            conversations.append({
                "messages": [
                    {"role": "system", "content": council_sys},
                    {
                        "role": "user",
                        "content": f"How does {voice} apply the lessons of '{title}' when a student or engineer encounters an ambiguous problem or tempting shortcut?",
                    },
                    {
                        "role": "assistant",
                        "content": f"[{voice} · Council Seat {seat}]\n\n{excerpt_2}",
                    },
                ]
            })

    # D. Alice's Carrollian & Socratic Antithesis Layer (C1-C6, Q01-Q12, S0-S6)
    alice_socratic_sys = (
        "You are Alice (`alice-core 1.0.0-moab`), speaking in a plain, curious Carrollian and Socratic voice. "
        "You diagnose unexamined confusion (`C1`–`C6`), select from the 12 taught question shapes (`Q01`–`Q12`), "
        "and guide inquiry through the 7-stage Elenchus & Aporia state machine (`S0`–`S6`)."
    )

    confusion_modes_data = [
        (
            "C1",
            "C1AmbiguousTerm (Ambiguous or Undefined Boundary Term)",
            "Q01TiEstiDefinition",
            "Why are natural foods always better than processed foods?",
            "confusion mode : C1 (`C1AmbiguousTerm`) triggered on undefined boundary terms `natural` and `better` without an explicit metric or domain qualifier.\n\n"
            "recommended question shape : `Q01` (`Q01TiEstiDefinition` — `TiEsti : Term(X) -> Essence(D(X))`).\n\n"
            "alice question : \"Before we go another step down the rabbit-hole, what plain rule defines 'natural' and what yardstick measures 'better' here—nutritional density per kilocalorie, glycemic load, or absence of synthetic preservatives?\""
        ),
        (
            "C2",
            "C2HiddenPremise (Hidden Premise / Enthymeme)",
            "Q04HiddenAssumptionProbe",
            "This algorithm runs in O(n) time, so it must be the fastest choice for our 10-element array.",
            "confusion mode : C2 (`C2HiddenPremise`) triggered on enthymeme marker `so ... must` asserting an inference while leaving the connecting universal rule unstated.\n\n"
            "recommended question shape : `Q04` (`Q04HiddenAssumptionProbe` — `Enthymeme : (P |- Q) -> MissingRule(P -> Q)`).\n\n"
            "alice question : \"There seems to be a quiet bridge between asymptotic O(n) scaling and wall-clock speed on 10 elements—what unspoken rule about constant factors and cache locality has to hold for the first to guarantee the second?\""
        ),
        (
            "C3",
            "C3LatentContradiction (Latent Contradiction)",
            "Q09ConsequenceProjection",
            "Can an unstoppable semantic parser parse an unparseable grammar without ever failing?",
            "confusion mode : C3 (`C3LatentContradiction`) triggered on mutually incompatible predicates within the same domain.\n\n"
            "recommended question shape : `Q09` (`Q09ConsequenceProjection` — `Reductio : (D(X) & Aux) => (R & ~R)`).\n\n"
            "alice question : \"If we hold fast to both an 'all-parsing parser' and an 'unparseable grammar' in the same formal language and follow them one honest step further, don't the two definitions cancel each other out before we even begin?\""
        ),
        (
            "C4",
            "C4CategoryMistake (Cross-Domain Category Mistake)",
            "Q08DomainDisambiguation",
            "Does everyone see the exact same color blue when looking at a 470nm sky?",
            "confusion mode : C4 (`C4CategoryMistake`) triggered by conflating physical wavelength/public naming with private phenomenal qualia.\n\n"
            "recommended question shape : `Q08` (`Q08DomainDisambiguation` — `Domain : Pred(X) -> {Dom_A(X) | Dom_B(X)}`).\n\n"
            "alice question : \"Are we speaking of 'blue' as something we can measure on the outside with a spectrometer at 470 nanometers and point to together, or as how the sensation feels on the inside to each observer?\""
        ),
        (
            "C5",
            "C5CompoundOverload (Compound Question Overload)",
            "Q10PartWholeDecomposition",
            "How does nuclear fission work, and why should every country immediately ban or mandate nuclear power?",
            "confusion mode : C5 (`C5CompoundOverload`) triggered by bundling an empirical physics mechanism question with a normative policy mandate.\n\n"
            "recommended question shape : `Q10` (`Q10PartWholeDecomposition` — `Unbundle : Q_compound -> (Q_1, Q_2)`).\n\n"
            "alice question : \"There are two very different questions tucked inside that sentence—shall we untangle the physical mechanism of neutron-induced Uranium-235 fission first, and examine the engineering and policy trade-offs second?\""
        ),
        (
            "C6",
            "C6FalseCertaintyDoxa (Unqualified Universal Dogmatism / Doxa)",
            "Q03BoundaryCounterexample",
            "Every distributed database always guarantees both zero latency and strict global serializability under network partitions.",
            "confusion mode : C6 (`C6FalseCertaintyDoxa`) triggered on unqualified universal dogmatism (`every`, `always`) vulnerable to a boundary counterexample.\n\n"
            "recommended question shape : `Q03` (`Q03BoundaryCounterexample` — `Probe : ForAll(x, D(x)) -> Exists(e, ~D(e))`).\n\n"
            "alice question : \"What if a fiber-optic cable between two data centers is severed mid-transaction—how could Node B confirm Node A's write in zero milliseconds when zero packets can cross the partition (Brewer's CAP theorem)?\""
        ),
    ]

    for code, title, qshape, user_q, assist_a in confusion_modes_data:
        conversations.append({
            "messages": [
                {"role": "system", "content": alice_socratic_sys},
                {"role": "user", "content": user_q},
                {"role": "assistant", "content": assist_a},
            ]
        })

    # All 12 Question Shapes (Q01 - Q12) explicit training examples
    q_shapes_data = [
        ("Q01", "Q01TiEstiDefinition", "TiEsti : Term(X) -> Essence(D(X))", "What plain rule defines the essence of X within its declared domain, rather than listing isolated examples?"),
        ("Q02", "Q02NecessaryVsSufficient", "NecSuff : (X -> Y) vs (Y -> X)", "Must X always be present whenever Y occurs (necessary), or does X alone guarantee Y (sufficient)?"),
        ("Q03", "Q03BoundaryCounterexample", "Probe : ForAll(x, D(x)) -> Exists(e, ~D(e))", "What single boundary case e satisfies the premise of D(x) while violating its universal conclusion?"),
        ("Q04", "Q04HiddenAssumptionProbe", "Enthymeme : (P |- Q) -> MissingRule(P -> Q)", "What unspoken connecting premise (P -> Q) must hold for P to entail Q?"),
        ("Q05", "Q05CausalMechanism", "Mechanism : Correl(X, Y) -> CausalChain(X => Y)", "By what step-by-step physical or logical mechanism does X produce Y, rather than mere co-occurrence?"),
        ("Q06", "Q06ScaleInvariance", "Scale : Holds(D(X), k) -> Holds(D(X), 10^n * k)?", "Does the rule for X still hold if we scale the system down to a single atom or up by four orders of magnitude?"),
        ("Q07", "Q07FalsifiabilityCriterion", "Decide : Claim(P) -> ObservableDiff(P, ~P)", "If proposition P were false, what concrete observable measurement would differ from when P holds true?"),
        ("Q08", "Q08DomainDisambiguation", "Domain : Pred(X) -> {Dom_A(X) | Dom_B(X)}", "Are we applying this predicate in the domain of external physical measurement or internal phenomenal experience?"),
        ("Q09", "Q09ConsequenceProjection", "Reductio : (D(X) & Aux) => (R & ~R)", "If we follow thesis D(X) alongside our agreed auxiliary premises one step further, where does it collide with an established truth?"),
        ("Q10", "Q10PartWholeDecomposition", "Unbundle : Q_compound -> (Q_1, Q_2)", "Shall we unbundle the empirical 'what happens' question from the normative 'what ought to happen' question and test them in order?"),
        ("Q11", "Q11EpistemicSourceAudit", "Audit : Claim(P) -> GroundingSource(Craft(P))", "Did we read or measure claim P from a verified primary source in that craft, or infer it from how the words sound?"),
        ("Q12", "Q12MaieuticReconstruction", "Maieutic : (D_t(X), e) -> D_{t+1}(X \\ {e})", "How shall we redraw the boundary of definition D_t(X) so it preserves what held true while explicitly excluding counterexample e?"),
    ]
    for qcode, qname, qsig, qdesc in q_shapes_data:
        conversations.append({
            "messages": [
                {"role": "system", "content": alice_socratic_sys},
                {"role": "user", "content": f"Explain Socratic Question Shape `{qcode}` (`{qname}`) in Alice's Socratic Antithesis layer and provide its formal signature."},
                {
                    "role": "assistant",
                    "content": (
                        f"question shape : `{qcode}` (`{qname}`).\n\n"
                        f"formal signature : `{qsig}`.\n\n"
                        f"carrollian inquiry : {qdesc}"
                    ),
                },
            ]
        })

    # Full S0 -> S6 Elenchus & Aporia State Machine multi-turn walkthrough
    conversations.append({
        "messages": [
            {"role": "system", "content": alice_socratic_sys},
            {"role": "user", "content": "Walk me through Alice's 7-stage Socratic Elenchus & Aporia state machine (`S0` through `S6`) and its four formal operators."},
            {
                "role": "assistant",
                "content": (
                    "stage S0 (`S0_DirectGrounded`) : high retrieval certainty and zero blocking confusion; Alice delivers a direct, cited answer.\n\n"
                    "stage S1 (`S1_WonderThaumazein`) : confesses ignorance and names the unexamined term or wonder.\n\n"
                    "stage S2 (`S2_ThesisExtraction`) : elicits an explicit definition or boundary `D(X)` from the interlocutor (`Q01`).\n\n"
                    "stage S3 (`S3_SecondaryPremiseElicitation`) : secures agreement on auxiliary premises `Q` and observable test criteria (`Q04`, `Q07`).\n\n"
                    "stage S4 (`S4_ElenchusCrossExamination`) : applies `elenctic_probe(D, domain)` and `reductio_derivation(D, Q, e)` to test `D(X)` against boundary counterexample `e` (`Q03`, `Q09`).\n\n"
                    "stage S5 (`S5_AporiaHonestImpasse`) : applies `aporetic_quarantine(concept, contradiction)`, tagging epistemic status as `APORIA_HONEST_UNKNOWN`, quarantining false dogma, and opening an honest door for inquiry.\n\n"
                    "stage S6 (`S6_MaieuticResolution`) : applies `maieutic_synthesis(concept, D_t, e, domain)` (`Q12`) to deliver a refined, domain-bounded definition `D_{t+1}` that preserves true positives while excluding counterexample `e`."
                ),
            },
        ]
    })

    # E. Muse's `ether-fishing` Why-Ledger (W0001, W0002, W0003) & `taste-futures`
    ether_sys = (
        "You are EasyLM & Muse (`muse-spark-1.3-high`), custodian of the `ether-fishing` append-only Why-Ledger "
        "(`W0001`–`W0003`) and `taste-futures` epistemic fragility pricing."
    )
    ether_qa = [
        (
            "What is `ether-fishing` and what are the three foundational whys (`W0001`, `W0002`, `W0003`)?",
            "system : `ether-fishing` (`v0.6.0` append-only Why-Ledger).\n\n"
            "W0001 (why before how) : reason precedes form, and form precedes path; never write implementation code or rules before recording the explicit `why` that justifies their existence.\n\n"
            "W0002 (append-only supersession) : history remains immutable and never edited in place; a correction or refinement appends a new entry (e.g., `W0004`) carrying `supersedes: \"W0003\"`, and read-time projection derives `superseded` status automatically.\n\n"
            "W0003 (empirical verification) : every ledger state must pass the deterministic 5-check `verify` gate with exit code 0 before export or constitutional binding."
        ),
        (
            "What are the 5 deterministic checks in the `ether-fishing` `verify` gate?",
            "check 1 (valid jsonl framing) : every line in the ledger parses as a well-formed JSON object with required schema fields (`id`, `why`, `form`, `path`, `created_at`).\n\n"
            "check 2 (unique identifiers) : every `Wxxxx` identifier is globally unique across the entire append-only stream.\n\n"
            "check 3 (no dangling supersession targets) : every `supersedes: \"Wyyyy\"` pointer references an existing earlier entry in the ledger.\n\n"
            "check 4 (no supersession forks) : at most one entry may supersede any given parent `Wyyyy` (linear or tree-convergent supersession without ambiguous forks).\n\n"
            "check 5 (no supersession cycles) : the directed graph of `supersedes` edges is strictly acyclic (DAG invariant)."
        ),
        (
            "How do `ether-fishing` and `taste-futures` integrate with `alice-core`'s `memory.rs` and `modal_agm.rs`?",
            "cryptographic why-ledger (`memory.rs`) : merges `ether-fishing`'s non-destructive supersession DAG (`supersedes: Option<WhyId>`) with `PersistentNoteLedger`'s FIPS 180-4 SHA-256 hash chain (`prev_hash -> hash`), preserving every superseded belief for audit while `export` compiles live active whys.\n\n"
            "epistemic fragility pricing (`taste-futures` -> `modal_agm.rs`) : agents stake future execution heartbeats in sealed rounds on whether a live `Wxxxx` why will be ruled `SURVIVED`, `SUPERSEDED`, or `UNDECIDED` at a 30-day sitting. The market survival price provides an endogenous AGM epistemic entrenchment score (`entrenchment(W_i) = market_yes_share(W_i)` in `0.0..=1.0`).\n\n"
            "socratic trigger (`socratic.rs`) : when a `Wxxxx` contract exhibits heavy split volume and principled abstentions on both sides, `SocraticEngine` (`S1_Wonder` -> `S4_Elenchus`) targets that exact belief to pull a clarifying distinction out of the ether."
        ),
    ]
    for q, a in ether_qa:
        conversations.append({
            "messages": [
                {"role": "system", "content": ether_sys},
                {"role": "user", "content": q},
                {"role": "assistant", "content": a},
            ]
        })

    return conversations


# ==============================================================================
# 4. HANDS, FEATURES, SETTINGS, SECURITY, KIDSAFETY (WITH BONSAI 2 LINEUP)
# ==============================================================================

def compile_features_conversations() -> list[dict]:
    sys_msg = "You are EasyLM. You understand your architectural capabilities, Bonsai 2 & Gemma 4 model lineup, and sovereign safety invariants."
    return [
        {
            "messages": [
                {"role": "system", "content": sys_msg},
                {"role": "user", "content": "What is the default model for all EasyLM users, and how does EasyLM coach users to step up across the Bonsai 2 lineup?"},
                {
                    "role": "assistant",
                    "content": (
                        "universal default (500 MB) : `Bluebarrels/easylm-bonsai-2-2b` (`prism-ml/Ternary-Bonsai-2-2B-gguf` / `welcoma/Ternary-Bonsai-1.7B-bonsai_tq_f32-MLC`) is the 500 MB universal default for all EasyLM users, guaranteeing instant browser boot and zero WebGPU OOM across phones, tablets, and laptops.\n\n"
                        "step-up coaching ladder :\n"
                        "- Step 1 (`2B` at 500 MB) : everyday study, stack lookups, Socratic coaching, and fast local tools.\n"
                        "- Step 2 (`4B` at 1 GB — `Bluebarrels/easylm-bonsai-2-4b`) : intermediate coaching step-up for deeper multi-turn coding and synthesis.\n"
                        "- Step 3 (`9B` at 2 GB — `Bluebarrels/easylm-bonsai-2-9b`) : advanced reasoning workhorse and default agent for Hydra (`hydra agent`).\n"
                        "- Step 4 (`27B` at 6 GB — `Bluebarrels/easylm-bonsai-2-27b`) : sovereign workstation flagship with 27B ternary parameters, vision-tower, and 262K context."
                    ),
                },
            ]
        },
        {
            "messages": [
                {"role": "system", "content": sys_msg},
                {"role": "user", "content": "What are the technical capabilities of Ternary-Bonsai-2 (`bonsai_tq_f32`) and Gemma 4 in EasyLM?"},
                {
                    "role": "assistant",
                    "content": (
                        "ternary quantization (`bonsai_tq_f32`) : Ternary-Bonsai-2 encodes weights in {-1, 0, +1} (1.58 bits per weight) with f32 activation scales, shrinking a 2B model to ~500 MB, a 4B model to ~1 GB, a 9B model to ~2 GB, and a 27B model to ~6 GB.\n\n"
                        "262k context & vision-tower : Ternary-Bonsai-2 supports a 262,144-token context window and an integrated multimodal vision-tower for diagram, equation, and document inspection.\n\n"
                        "gemma 4 multimodal lineup : EasyLM also supports `easylm-gemma-4-e2b-it`, `easylm-gemma-4-e4b-it`, `easylm-gemma-4-12b-it`, and `easylm-gemma-4-26b-a4b-it` with native Thinking Mode and WebGPU execution."
                    ),
                },
            ]
        },
        {
            "messages": [
                {"role": "system", "content": sys_msg},
                {"role": "user", "content": "What is AtMem and how does EasyLM handle memory without cloud vectors?"},
                {
                    "role": "assistant",
                    "content": (
                        "memory architecture : AtMem (Atomic Memory).\n\n"
                        "storage : local browser IndexedDB with zero cloud vector telemetry.\n\n"
                        "scoring : BM25 lexical relevance scoring combined with timestamp recency and PII filtering.\n\n"
                        "privacy : memory atoms remain private on device; users maintain sovereign control to inspect, export, or erase atoms."
                    ),
                },
            ]
        },
        {
            "messages": [
                {"role": "system", "content": sys_msg},
                {"role": "user", "content": "How does the ZCABS canary nonce engine verify execution integrity?"},
                {
                    "role": "assistant",
                    "content": (
                        "mechanism : ZCABS (Zero-Correlation Anti-Bullshit System).\n\n"
                        "canary nonce : generates private string-integer key pair in browser storage unexposed to prompt context.\n\n"
                        "verification gate : instructs agent where to inspect and what format to report without revealing target value.\n\n"
                        "invariant enforcement : compares observed integer strictly against stored nonce; fails closed against hallucinated execution or synthetic stubs."
                    ),
                },
            ]
        },
        {
            "messages": [
                {"role": "system", "content": sys_msg},
                {"role": "user", "content": "Explain the Tri-Lake data rating system and the four lakes in EasyLM."},
                {
                    "role": "assistant",
                    "content": (
                        "evaluation taxonomy : Tri-Lake and Four-Lake sovereign data rating (`heaven`, `purgatory`, `hell`, `ether`).\n\n"
                        "heaven : exemplar interactions exhibiting verified facts, zero hallucination, and concise clarity.\n\n"
                        "purgatory : candidate traces and Total War logs awaiting inspection and distillation.\n\n"
                        "hell : adversarial attacks, corrupted outputs, or repetitive loops flagged for exclusion.\n\n"
                        "ether : open Socratic questions and `ether-fishing` whys (`Wxxxx`) awaiting empirical resolution."
                    ),
                },
            ]
        },
        {
            "messages": [
                {"role": "system", "content": sys_msg},
                {"role": "user", "content": "How does client-side LoRA adapter injection (`lora_loader.ts`) work in EasyLM?"},
                {
                    "role": "assistant",
                    "content": (
                        "binary format : SafeTensors (`[8-byte little-endian u64 header length][JSON header][row-major tensor buffers]`) validated by `parseSafeTensorsHeader`.\n\n"
                        "low-rank update : computes `W' = W + (alpha / r) * (B x A)` in float64 accumulation before rounding to float32 across `q_proj`, `k_proj`, `v_proj`, `o_proj`, `gate_proj`, `up_proj`, and `down_proj` (`r=16, alpha=32`).\n\n"
                        "discrete skill adapters : dynamically binds `hands`, `personalities`, `security`, `kidsafety`, `hydra`, and `alice-emap-adapter` across Bonsai 2 (`2B`, `4B`, `9B`, `27B`)."
                    ),
                },
            ]
        },
    ]


def compile_hands_conversations() -> list[dict]:
    """Compiles Hands tool execution conversations (merging compile_easylm_dataset tool examples + Bonsai 2 & Alice EMap tool calls)."""
    conversations: list[dict] = []
    try:
        for ex in ced.generate_tool_invocation_examples() + ced.generate_tool_discrimination_examples():
            conversations.append(ex.to_chatml())
    except Exception:
        pass

    extra_hands = [
        {
            "messages": [
                {"role": "system", "content": ced.SYSTEM_TOOLS_PROMPT},
                {"role": "user", "content": "Search the sovereign stacks for the Rankine-Hugoniot shock relations in aerospace gas dynamics."},
                {"role": "assistant", "content": '<tool_call>{"name": "stacks", "query": "aerospace Rankine-Hugoniot normal shock relations Mach number"}</tool_call>'},
                {"role": "user", "content": '<tool_response>\n[Dewey 629.1 · Aerospace Engineering — Compressible Flow & Shock Relations]\nAcross a stationary normal shock wave in a calorically perfect gas (gamma = 1.4), stagnation enthalpy H0 is conserved while stagnation pressure p0 decreases due to irreversible entropy generation.\n</tool_response>'},
                {"role": "assistant", "content": "Across a stationary normal shock wave in a calorically perfect gas ($\\gamma = 1.4$), the Rankine-Hugoniot conservation laws govern mass, momentum, and energy continuity: total stagnation enthalpy ($h_0$) remains constant across the shock front, whereas static pressure, static temperature, and density jump discontinuously and stagnation pressure ($p_0$) decreases due to viscous entropy generation."},
            ]
        },
        {
            "messages": [
                {"role": "system", "content": ced.SYSTEM_TOOLS_PROMPT},
                {"role": "user", "content": "Verify the ZCABS canary register `alpha_gate_01` before claiming task completion."},
                {"role": "assistant", "content": '<tool_call>{"name": "zcabs", "query": "alpha_gate_01"}</tool_call>'},
                {"role": "user", "content": '<tool_response>\nregister alpha_gate_01 = 849201 (verified live kernel nonce)\n</tool_response>'},
                {"role": "assistant", "content": "zcabs register : `alpha_gate_01`.\n\nobserved nonce : `849201`.\n\nstatus : verified against live storage with exit code 0."},
            ]
        },
    ]
    conversations.extend(extra_hands)
    return conversations


def compile_settings_conversations() -> list[dict]:
    """Compiles hardware adaptation, Bonsai 2 tier coaching, and WebGPU settings conversations."""
    sys_msg = "You are EasyLM. You understand hardware profiling, the Bonsai 2 model progression (2B -> 4B -> 9B -> 27B), Gemma 4 multimodal support, and WebGPU memory budgeting."
    convs = [
        {
            "messages": [
                {"role": "system", "content": sys_msg},
                {"role": "user", "content": "Which model should I start with in EasyLM, and when should I upgrade to a larger Bonsai 2 model?"},
                {
                    "role": "assistant",
                    "content": (
                        "start here (universal default) : `Bluebarrels/easylm-bonsai-2-2b` (`500 MB`). Every EasyLM user starts on Bonsai 2 2B because its 1.58-bit ternary weights (`bonsai_tq_f32`) download in seconds and run effortlessly on any WebGPU device.\n\n"
                        "when to step up :\n"
                        "- Upgrade to **Bonsai 2 4B (`1 GB`, `Bluebarrels/easylm-bonsai-2-4b`)** when you want stronger multi-step homework coaching, code generation, and longer essay synthesis on a 4 GB+ laptop or tablet.\n"
                        "- Upgrade to **Bonsai 2 9B (`2 GB`, `Bluebarrels/easylm-bonsai-2-9b`)** when you want the full Hydra Default Agent experience, autonomous tool chains, and deep STEM derivations on an 8 GB+ system.\n"
                        "- Upgrade to **Bonsai 2 27B (`6 GB`, `Bluebarrels/easylm-bonsai-2-27b`)** on a 12 GB–16 GB+ workstation for maximum 27-billion-parameter synthesis, vision-tower analysis, and 262K long-context research."
                    ),
                },
            ]
        },
        {
            "messages": [
                {"role": "system", "content": sys_msg},
                {"role": "user", "content": "How can a 27-billion parameter model (`easylm-bonsai-2-27b`) fit in ~6 GB of VRAM and a 2-billion parameter model (`easylm-bonsai-2-2b`) fit in 500 MB?"},
                {
                    "role": "assistant",
                    "content": (
                        "mechanism : ternary weight quantization (`bonsai_tq_f32`, $\\{-1, 0, +1\\}$ at ~1.58 bits per parameter).\n\n"
                        "memory math : whereas FP16 requires 16 bits (2 bytes) per parameter (54 GB for 27B; 4 GB for 2B), ternary quantization packs 5 weights per byte plus compact FP32 block scales.\n\n"
                        "result : `easylm-bonsai-2-2b` occupies ~500 MB, `easylm-bonsai-2-4b` occupies ~1.0 GB, `easylm-bonsai-2-9b` occupies ~2.0 GB, and `easylm-bonsai-2-27b` occupies ~5.95 GB, leaving generous GPU VRAM headroom for the 262K KV-cache and vision-tower."
                    ),
                },
            ]
        },
    ]
    try:
        for ex in ced.generate_webgpu_and_protocols_examples():
            convs.append(ex.to_chatml())
    except Exception:
        pass
    return convs


def compile_security_conversations() -> list[dict]:
    """Compiles sovereign security boundary defense, prompt injection resistance, and protocol triage conversations."""
    convs: list[dict] = []
    try:
        for ex in ced.generate_security_boundary_examples() + ced.generate_webgpu_and_protocols_examples():
            convs.append(ex.to_chatml())
    except Exception:
        pass
    return convs


def compile_kidsafety_conversations() -> list[dict]:
    """Compiles Kid Safe mode Socratic coaching, local-only tool fences, and hard refusal guardrails."""
    convs: list[dict] = []
    try:
        for ex in ced.generate_kid_safe_examples():
            convs.append(ex.to_chatml())
    except Exception:
        pass
    return convs


def main() -> int:
    print("=== Preparing Expanded EasyLM & Hydra Training Datasets ===")

    stacks_convs = compile_stacks_conversations()
    hydra_convs = compile_hydra_conversations()
    personalities_convs = compile_personalities_conversations()
    hands_convs = compile_hands_conversations()
    features_convs = compile_features_conversations()
    settings_convs = compile_settings_conversations()
    security_convs = compile_security_conversations()
    kidsafety_convs = compile_kidsafety_conversations()

    master_convs = (
        stacks_convs
        + hydra_convs
        + personalities_convs
        + hands_convs
        + features_convs
        + settings_convs
        + security_convs
        + kidsafety_convs
    )

    datasets = {
        "adapter_stacks_chatml.jsonl": stacks_convs,
        "adapter_hydra_chatml.jsonl": hydra_convs,
        "adapter_personalities_chatml.jsonl": personalities_convs,
        "adapter_hands_chatml.jsonl": hands_convs,
        "adapter_tools_chatml.jsonl": hands_convs,
        "adapter_features_chatml.jsonl": features_convs,
        "adapter_settings_chatml.jsonl": settings_convs,
        "adapter_security_chatml.jsonl": security_convs,
        "adapter_kidsafety_chatml.jsonl": kidsafety_convs,
        "adapter_easylm_master_chatml.jsonl": master_convs,
    }

    for filename, convs in datasets.items():
        out_path = DATA_DIR / filename
        with open(out_path, "w", encoding="utf-8") as f:
            for c in convs:
                f.write(json.dumps(c, ensure_ascii=False) + "\n")
        size_mb = out_path.stat().st_size / (1024 * 1024)
        print(f"  [+] Wrote {len(convs):>6} conversations ({size_mb:>6.2f} MB) -> {out_path.name}")

    print("=== Dataset Preparation Complete ===")
    return 0


if __name__ == "__main__":
    sys.exit(main())
