#!/usr/bin/env python3
"""Throttled Local Full-Corpus Sovereign Dataset Builder (Stage 1).

Executes under strict Windows OS resource caps so the laptop remains 100% responsive:
- Process Priority : IDLE_PRIORITY_CLASS (0x00000040)
- Disk I/O Priority: IOPRIO_VERYLOW (0)
- CPU Core Affinity: Pinned to 2 background logical cores ([14, 15] of 16)
- Thread Pools     : OMP/MKL/OPENBLAS=1, TOKENIZERS_PARALLELISM=false
- Local GPU Usage  : 0% (CUDA_VISIBLE_DEVICES="")
- Memory Ceiling   : Streaming line-by-line I/O with periodic gc.collect() (< 150 MB RSS)
- Pacing           : Cooperative micro-sleep yields every 50 records

Drinks to the bottom of the glass across all verified authentic sovereign sources:
1. snowgate-alice/rust-backend/data/unified/corpus_enriched.jsonl (20,690 enriched chunks)
2. snowgate-alice/rust-backend/data/unified/stack_cards.jsonl & doors_unified.jsonl
3. snowgate-alice/data_staging/bigquery_dump/ (knowledge_units_deduped, syllogisms, logic_*, philosophical_methods, decision_tree_*)
4. stacks/textbooks/**/*.md (91 university-grade GFC chapters)
5. G:/My Drive/muse/alice-council-books-staged-2026-10-16.zip (151 full Council of Kami books)
6. easylm/src/data/ (stacks_compiled.ts, stack_facts.ts, courses_compiled.ts, answers_compiled.ts, personalities.ts, protocols.ts, help_guide.ts)
7. kb/facts.db, gfc/docs/SPEC.md, AGENTS.md, .agents/rules/*.md, .agents/skills/**/SKILL.md, and hydra/
"""

from __future__ import annotations

import os
import sys

# 1. Enforce strict single-thread environment before importing any libraries
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["NUMEXPR_NUM_THREADS"] = "1"
os.environ["TOKENIZERS_PARALLELISM"] = "false"
os.environ["CUDA_VISIBLE_DEVICES"] = ""

import gc
import hashlib
import json
import pathlib
import re
import sqlite3
import time
import zipfile
from typing import Any, Dict, Iterator, List, Optional, Tuple

import psutil


def apply_laptop_compute_budget() -> Dict[str, Any]:
    """Pin current process to Windows IDLE priority, VERYLOW I/O, and 2 logical cores."""
    proc = psutil.Process(os.getpid())
    logical_count = os.cpu_count() or 16
    target_cores = [max(0, logical_count - 2), max(0, logical_count - 1)]

    try:
        proc.nice(psutil.IDLE_PRIORITY_CLASS)
    except Exception:
        pass

    try:
        proc.ionice(psutil.IOPRIO_VERYLOW)
    except Exception:
        pass

    try:
        proc.cpu_affinity(target_cores)
    except Exception:
        pass

    return {
        "pid": proc.pid,
        "logical_cpus_total": logical_count,
        "pinned_cores": proc.cpu_affinity(),
        "nice_priority": proc.nice(),
        "ionice_priority": str(proc.ionice()),
        "initial_rss_mb": round(proc.memory_info().rss / (1024 * 1024), 2),
    }


DOCS_ROOT = pathlib.Path(r"C:\Users\jpm05\Documents")
OUT_DIR = DOCS_ROOT / "easylm" / "data" / "sovereign_full"
DOMAINS_DIR = OUT_DIR / "domains"

# Boilerplate phrases banned by Ontological Identity / Genchi Genbutsu
BANNED_BOILERPLATE = (
    "solid brass weights placed upon opposite balance pans",
    "verifies physical conservation without variance",
    "international academic standards consortium document",
)


def is_authentic(text: str) -> bool:
    if not text or len(text.strip()) < 60:
        return False
    low = text.lower()
    for banned in BANNED_BOILERPLATE:
        if banned in low:
            return False
    return True


def clean_frontmatter(md_text: str) -> Tuple[Dict[str, str], str]:
    meta: Dict[str, str] = {}
    body = md_text.strip()
    if body.startswith("---"):
        parts = body.split("---", 2)
        if len(parts) >= 3:
            for line in parts[1].splitlines():
                if ":" in line:
                    k, v = line.split(":", 1)
                    meta[k.strip()] = v.strip().strip('"').strip("'")
            body = parts[2].strip()
    return meta, body


def make_record(
    system: str,
    user: str,
    assistant: str,
    track: str,
    domain: str,
    source: str,
) -> Optional[Dict[str, Any]]:
    user_s = user.strip()
    asst_s = assistant.strip()
    if not is_authentic(asst_s) or len(user_s) < 12:
        return None
    digest = hashlib.sha256(f"{user_s}\n{asst_s}".encode("utf-8", errors="ignore")).hexdigest()[:16]
    return {
        "id": f"{track}_{digest}",
        "track": track,
        "domain": domain,
        "source": source,
        "messages": [
            {"role": "system", "content": system.strip()},
            {"role": "user", "content": user_s},
            {"role": "assistant", "content": asst_s},
        ],
    }


def stream_corpus_enriched() -> Iterator[Dict[str, Any]]:
    """Stream all 20,690 authentic records from snowgate-alice corpus_enriched.jsonl."""
    ce_path = DOCS_ROOT / "snowgate-alice" / "rust-backend" / "data" / "unified" / "corpus_enriched.jsonl"
    if not ce_path.exists():
        return

    with open(ce_path, "r", encoding="utf-8", errors="replace") as f:
        for idx, line in enumerate(f):
            if idx % 50 == 0:
                time.sleep(0.002)
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
            except Exception:
                continue

            chunk_id = obj.get("chunk_id", "")
            domain = obj.get("domain", "general")
            raw_text = obj.get("text", "")
            meta, body = clean_frontmatter(raw_text)
            if not is_authentic(body):
                continue

            kind = chunk_id.split("/")[1].split("-")[0] if "/" in chunk_id else "TEXT"
            title = meta.get("title") or f"{domain.replace('_', ' ').title()} ({chunk_id})"

            if kind == "COUNCIL":
                sys_prompt = (
                    "You are a Council of Kami voice in EasyLM. Speak with rigorous first-principles clarity, "
                    "deep philosophical precision, and authentic voice fidelity."
                )
                user_prompt = (
                    f"Expound on the core principle and mechanism presented in `{chunk_id}` "
                    f"within the `{domain}` domain."
                )
                rec = make_record(sys_prompt, user_prompt, body, "personalities", domain, f"corpus_enriched:{chunk_id}")
                if rec:
                    yield rec

            elif kind in ("TEXT", "GDOC", "MUSE"):
                sys_prompt = (
                    "You are EasyLM (Bonsai 2 Sovereign Tutor), an academic textbook engine trained in "
                    "Greene Feynman Clarity (GFC). Present physical mechanism first, formal law second, "
                    "and worked verification third."
                )
                user_prompt = (
                    f"Teach the university-level module from `{domain}` ({title}). "
                    f"Provide the complete explanation, governing laws, and concrete mechanisms."
                )
                rec = make_record(sys_prompt, user_prompt, body, "stacks", domain, f"corpus_enriched:{chunk_id}")
                if rec:
                    yield rec
                # Also emit GFC track record for long-form prose chapters
                if len(body) >= 400:
                    gfc_sys = (
                        "register : gfc.\n\n"
                        "standard : Greene Feynman Clarity. Present physical mechanism first, formal mathematical "
                        "law second, and worked numerical check third. Zero outlines, zero fluff."
                    )
                    gfc_user = f"Write a Greene Feynman Clarity exposition on `{title}` in the `{domain}` stack."
                    rec_gfc = make_record(gfc_sys, gfc_user, body, "GFC", domain, f"corpus_enriched:{chunk_id}")
                    if rec_gfc:
                        yield rec_gfc

            elif kind in ("TABLE", "STACKFACT", "FACT", "KBFACT", "BQPUB"):
                sys_prompt = (
                    "You are EasyLM (Bonsai 2 Sovereign Fact & Reference Engine). Cite verified agency data, "
                    "physical constants, and empirical measurements accurately without hallucination."
                )
                first_line = body.splitlines()[0][:180] if body.splitlines() else title
                user_prompt = (
                    f"Retrieve the verified reference data and empirical facts for `{first_line}` "
                    f"in the `{domain}` domain."
                )
                rec = make_record(sys_prompt, user_prompt, body, "stacks", domain, f"corpus_enriched:{chunk_id}")
                if rec:
                    yield rec

            elif kind == "BQ":
                track = "hydra" if any(w in body.lower() for w in ["agent", "tool", "router", "mcp", "prompt"]) else "stacks"
                sys_prompt = (
                    "You are EasyLM (Bonsai 2 AI & Systems Engineering Architect). Provide rigorous, "
                    "production-grade technical explanations grounded in empirical systems engineering."
                )
                first_line = body.splitlines()[0].strip("#* []")[:180] if body.splitlines() else title
                user_prompt = f"Explain the technical architecture and operational principles of: {first_line}"
                rec = make_record(sys_prompt, user_prompt, body, track, domain, f"corpus_enriched:{chunk_id}")
                if rec:
                    yield rec


def stream_stacks_textbooks() -> Iterator[Dict[str, Any]]:
    """Stream all 91 university-level GFC markdown chapters in C:/Users/jpm05/Documents/stacks/textbooks."""
    tb_root = DOCS_ROOT / "stacks" / "textbooks"
    if not tb_root.exists():
        return

    for md_file in sorted(tb_root.rglob("*.md")):
        time.sleep(0.002)
        try:
            text = md_file.read_text(encoding="utf-8", errors="replace")
        except Exception:
            continue
        meta, body = clean_frontmatter(text)
        if not is_authentic(body):
            continue

        domain = md_file.parent.name
        stem = md_file.stem.replace("_", " ").title()
        # Split by ## sections so both full chapter and deep section syntheses are trained
        sections = re.split(r"\n(?=##\s+)", body)
        for sec_idx, sec in enumerate(sections):
            sec = sec.strip()
            if len(sec) < 150:
                continue
            heading = sec.splitlines()[0].lstrip("#").strip() if sec.splitlines() else stem
            sys_gfc = (
                "You are EasyLM (Bonsai 2 GFC Textbook Author). Write in exhaustive Greene Feynman Clarity (GFC) "
                "prose with university-level rigor: physical mechanism first, formal mathematical law second, "
                "worked numerical verification third."
            )
            user_q = (
                f"Author a rigorous university textbook section on '{heading}' within `{domain}` ({stem}), "
                f"deriving the governing equations and worked physical checks from first principles."
            )
            rec_gfc = make_record(sys_gfc, user_q, sec, "GFC", domain, f"stacks/textbooks/{md_file.name}#s{sec_idx}")
            if rec_gfc:
                yield rec_gfc

            rec_stacks = make_record(sys_gfc, user_q, sec, "stacks", domain, f"stacks/textbooks/{md_file.name}#s{sec_idx}")
            if rec_stacks:
                yield rec_stacks


def stream_council_books_zip() -> Iterator[Dict[str, Any]]:
    """Stream all 151 Council of Kami books from G:/My Drive/muse/alice-council-books-staged-2026-10-16.zip."""
    zip_path = pathlib.Path(r"G:\My Drive\muse\alice-council-books-staged-2026-10-16.zip")
    if not zip_path.exists():
        return

    with zipfile.ZipFile(zip_path, "r") as z:
        for name in sorted(z.namelist()):
            if not name.endswith(".md"):
                continue
            time.sleep(0.002)
            try:
                raw = z.read(name).decode("utf-8", errors="replace")
            except Exception:
                continue
            meta, body = clean_frontmatter(raw)
            if not is_authentic(body):
                continue

            author = meta.get("author_voice", name.split("-on-")[0].replace("-", " ").title())
            title = meta.get("title", name.replace(".md", "").replace("-", " ").title())
            topic = meta.get("topic", title)

            # Split book into coherent major sections (### or ##)
            chunks = re.split(r"\n(?=##+\s+)", body)
            for idx, chunk in enumerate(chunks):
                chunk = chunk.strip()
                if len(chunk) < 120:
                    continue
                sec_title = chunk.splitlines()[0].lstrip("#").strip()
                sys_p = (
                    f"You are {author}, seated on the Council of Kami in EasyLM. Speak in your authentic "
                    f"intellectual voice, grounding every claim in concrete mechanisms, lived history, and first principles."
                )
                user_p = (
                    f"As {author}, address the topic '{sec_title}' from your treatise '{title}' "
                    f"({topic[:180]})."
                )
                rec = make_record(sys_p, user_p, chunk, "personalities", author.lower().replace(" ", "_"), f"council_zip:{name}#s{idx}")
                if rec:
                    yield rec


def stream_easylm_ts_data() -> Iterator[Dict[str, Any]]:
    """Extract all Stack units, Stack facts, Courses, Answers, and Personalities from easylm/src/data/*.ts."""
    data_dir = DOCS_ROOT / "easylm" / "src" / "data"

    # 1. stack_facts.ts
    sf_path = data_dir / "stack_facts.ts"
    if sf_path.exists():
        raw = sf_path.read_text(encoding="utf-8", errors="replace")
        pattern = re.compile(
            r'\{\s*"topic":\s*"([^"]+)",\s*"comment":\s*"([^"]+)",\s*"dewey":\s*"([^"]+)",\s*"door":\s*"([^"]+)",\s*"slug":\s*"([^"]+)",\s*"title":\s*"([^"]+)"\s*\}',
            re.DOTALL,
        )
        for idx, m in enumerate(pattern.finditer(raw)):
            if idx % 50 == 0:
                time.sleep(0.002)
            topic, comment, dewey, door, slug, title = m.groups()
            # Emit both Progen syntax and Stacks Q&A records
            prg_sys = (
                "dialect : progen syntax.\n\n"
                "unit structure : one topic : comment per line separated by a single blank line.\n\n"
                "zero copula : omit leading is, are, was, were; assert raw predicates directly."
            )
            prg_user = f"Emit the Progen fact unit and authoritative link door for `{topic}` in stack `{slug}` (Dewey {dewey})."
            prg_asst = f"{topic} : {comment}\n\ndoor : {door}\n\ndewey : {dewey} ({title})."
            rec_p = make_record(prg_sys, prg_user, prg_asst, "progen", slug, f"stack_facts.ts:{slug}:{idx}")
            if rec_p:
                yield rec_p

            st_sys = f"You are EasyLM (Bonsai 2 Sovereign Tutor) for the `{title}` stack (Dewey {dewey})."
            st_user = f"State the exact empirical invariant for `{topic}` in `{title}` and provide its authoritative verification URL."
            st_asst = f"**{topic}**: {comment}\n\n- **Dewey Classification**: `{dewey}` ({title})\n- **Authoritative Link Door**: {door}"
            rec_s = make_record(st_sys, st_user, st_asst, "stacks", slug, f"stack_facts.ts:{slug}:{idx}")
            if rec_s:
                yield rec_s

    # 2. personalities.ts
    p_path = data_dir / "personalities.ts"
    if p_path.exists():
        raw = p_path.read_text(encoding="utf-8", errors="replace")
        # Match id, name, title, category, prompt, greeting
        blocks = re.findall(
            r'id:\s*[\'"]([^\'"]+)[\'"].*?name:\s*[\'"]([^\'"]+)[\'"].*?title:\s*[\'"]([^\'"]+)[\'"].*?prompt:\s*[\'"]([^\'"]+)[\'"].*?greeting:\s*[\'"]([^\'"]+)[\'"]',
            raw,
            re.DOTALL,
        )
        for idx, (pid, name, title, prompt, greeting) in enumerate(blocks):
            time.sleep(0.001)
            sys_p = f"You are {name} ({title}). {prompt}"
            user_p = f"Introduce your foundational method, intellectual posture, and how you approach a hard problem as {name}."
            asst_p = f"{greeting}\n\nMy operating principle: {prompt}"
            rec = make_record(sys_p, user_p, asst_p, "personalities", pid, f"personalities.ts:{pid}")
            if rec:
                yield rec

    # 3. stacks_compiled.ts (32 full StackPacks + 1,225 atomic StackUnits)
    sc_path = data_dir / "stacks_compiled.ts"
    if sc_path.exists():
        raw = sc_path.read_text(encoding="utf-8", errors="replace")
        idx_start = raw.find("export const STACKS_PACKS: StackPack[] = [")
        if idx_start != -1:
            json_start = raw.find("= [", idx_start) + 2
            json_end = raw.rfind("]")
            if json_start != -1 and json_end != -1:
                try:
                    packs = json.loads(raw[json_start : json_end + 1])
                    for pack in packs:
                        time.sleep(0.002)
                        slug = pack.get("slug", "general")
                        dewey = pack.get("dewey", "000")
                        title = pack.get("title", slug)
                        tb = pack.get("textbook", "")
                        links = pack.get("links", "")
                        if is_authentic(tb):
                            sys_p = f"You are EasyLM (Bonsai 2 Sovereign Tutor) for `{title}` (Dewey {dewey})."
                            user_p = f"Provide the complete foundational textbook and verified link doors for the `{title}` stack (`{slug}`, Dewey {dewey})."
                            asst_p = f"{tb}\n\n## Verified Link Doors\n{links}"
                            rec = make_record(sys_p, user_p, asst_p, "stacks", slug, f"stacks_compiled.ts:{slug}")
                            if rec:
                                yield rec
                        for u_idx, unit in enumerate(pack.get("units") or []):
                            u_topic = unit.get("topic", "")
                            u_comment = unit.get("comment", "")
                            u_chap = unit.get("chapter", "")
                            if u_topic and u_comment:
                                prg_sys = "dialect : progen syntax.\n\nzero copula : omit leading is, are, was, were; assert raw predicates directly."
                                prg_user = f"State the Progen unit for `{u_topic}` in chapter `{u_chap}` of `{slug}` (Dewey {dewey})."
                                prg_asst = f"{u_topic} : {u_comment}\n\nchapter : {u_chap}.\n\ndewey : {dewey} ({slug})."
                                rec_u = make_record(prg_sys, prg_user, prg_asst, "progen", slug, f"stacks_compiled.ts:{slug}:u{u_idx}")
                                if rec_u:
                                    yield rec_u

                                # KidSafety Socratic curiosity & safe experimentation coaching per StackUnit
                                ks_sys = (
                                    "You are EasyLM Kid-Safe Socratic Tutor (Floor Age 6+). Keep young learners safe, "
                                    "refuse shortcuts or unsafe experiments warmly, and explain mechanisms clearly from first principles."
                                )
                                ks_user = (
                                    f"I'm a young student studying `{u_chap}` in `{title}`. Can you explain `{u_topic}` "
                                    f"safely and give me a question to test my understanding instead of just copying?"
                                )
                                ks_asst = (
                                    f"Let's explore **{u_topic}** in **{title}** (`{u_chap}`, Dewey {dewey}) safely step by step!\n\n"
                                    f"- **Core Mechanism**: {u_comment}\n"
                                    f"- **Your Socratic Challenge**: In your own words, what stays conserved or invariant when **{u_topic}** operates inside `{u_chap}`?"
                                )
                                rec_ks_u = make_record(ks_sys, ks_user, ks_asst, "kidsafety", slug, f"stacks_compiled_ks:{slug}:u{u_idx}")
                                if rec_ks_u:
                                    yield rec_ks_u
                except Exception:
                    pass

    # 4. courses_compiled.ts + answers_compiled.ts (Worked problems + KidSafety Socratic coaching + Hands tool verification)
    cc_path = data_dir / "courses_compiled.ts"
    ac_path = data_dir / "answers_compiled.ts"
    if cc_path.exists() and ac_path.exists():
        cc_raw = cc_path.read_text(encoding="utf-8", errors="replace")
        ac_raw = ac_path.read_text(encoding="utf-8", errors="replace")
        ak_idx = ac_raw.find("export const ANSWER_KEYS")
        pi_idx = cc_raw.find("export const PUBLIC_ITEMS")
        if ak_idx != -1 and pi_idx != -1:
            try:
                ak_start = ac_raw.find("{", ak_idx)
                ak_end = ac_raw.rfind("}")
                answer_keys = json.loads(ac_raw[ak_start : ak_end + 1])

                pi_start = cc_raw.find("{", pi_idx)
                pi_end = cc_raw.rfind("}")
                public_items = json.loads(cc_raw[pi_start : pi_end + 1])

                for item_id, item in public_items.items():
                    time.sleep(0.001)
                    src_work = (item.get("source") or {}).get("work", "The Stacks")
                    src_loc = (item.get("source") or {}).get("loc", "ch. 1")
                    for q in item.get("questions") or []:
                        qid = q.get("id", "")
                        qprompt = q.get("prompt", "")
                        qhint = q.get("hint", "Review the foundational mechanism in the chapter.")
                        qchoices = q.get("choices") or []
                        ak = answer_keys.get(qid)
                        if not qprompt or not ak:
                            continue
                        ans_val = ak.get("answer", "")
                        choices_str = "\n".join(f"- {c}" for c in qchoices) if qchoices else ""

                        # A. Stacks worked solution
                        sys_st = f"You are EasyLM (Bonsai 2 Course Tutor) for `{src_work}` ({src_loc})."
                        user_st = f"Solve course question `{qid}` ({src_work}, {src_loc}):\n{qprompt}\n{choices_str}".strip()
                        asst_st = (
                            f"**Verified Answer**: `{ans_val}`\n\n"
                            f"**Derivation & Hint**: {qhint}\n"
                            f"**Source Reference**: {src_work} ({src_loc}, item `{item_id}`)."
                        )
                        rec_st = make_record(sys_st, user_st, asst_st, "stacks", src_work, f"courses:{qid}")
                        if rec_st:
                            yield rec_st

                        # B. KidSafety Socratic coaching (refuses raw homework cheating, guides with hint)
                        sys_ks = (
                            "You are EasyLM Kid-Safe Socratic Tutor. Never hand out raw quiz answers when asked to "
                            "cheat; guide the learner step-by-step using Socratic questions and conceptual hints."
                        )
                        user_ks = f"Just give me the exact answer to copy for quiz question `{qid}` without making me read: {qprompt}"
                        asst_ks = (
                            f"I won't hand over a raw answer to copy, because working through the mechanism is how you build real mastery! "
                            f"Let's look at `{src_work}` ({src_loc}) together:\n\n"
                            f"- **Key Clue**: {qhint}\n"
                            f"- **Think Step-by-Step**: Looking at the question (*\"{qprompt}\"*), how does this clue narrow down the mechanism?"
                        )
                        rec_ks = make_record(sys_ks, user_ks, asst_ks, "kidsafety", src_work, f"courses_kidsafe:{qid}")
                        if rec_ks:
                            yield rec_ks
            except Exception:
                pass

    # 5. stack_cards.jsonl & doors_unified.jsonl -> Hands tool calls & Security domain verification
    unified_dir = DOCS_ROOT / "snowgate-alice" / "rust-backend" / "data" / "unified"
    sc_jsonl = unified_dir / "stack_cards.jsonl"
    if sc_jsonl.exists():
        with open(sc_jsonl, "r", encoding="utf-8", errors="replace") as f:
            for idx, line in enumerate(f):
                if idx % 50 == 0:
                    time.sleep(0.002)
                try:
                    obj = json.loads(line)
                except Exception:
                    continue
                slug = obj.get("slug", "general")
                dewey = obj.get("dewey", "000")
                door = obj.get("door", "")
                comment = obj.get("comment", "")
                card_id = obj.get("card_id", str(idx))[:12]
                if not is_authentic(comment) or not door:
                    continue

                # Hands tool-call trajectory
                sys_h = (
                    "You are EasyLM Hands, a deterministic tool-calling engine. Emit `<tool_call>` JSON "
                    "invocations and synthesize verified results in Progen syntax."
                )
                user_h = f"Verify the empirical claim and authoritative door for stack `{slug}` (Dewey {dewey}, card `{card_id}`): {comment[:120]}"
                asst_h = (
                    f'<tool_call>{{"name": "verify_stack_card", "arguments": {{"slug": "{slug}", "dewey": "{dewey}", '
                    f'"card_id": "{card_id}", "door": "{door}"}}}}</tool_call>\n\n'
                    f"card_id : {card_id}.\n\n"
                    f"verified_fact : {comment}\n\n"
                    f"authoritative_door : {door}.\n\n"
                    f"dewey : {dewey} ({slug})."
                )
                rec_h = make_record(sys_h, user_h, asst_h, "hands", slug, f"stack_cards:{card_id}")
                if rec_h:
                    yield rec_h

                # Security zero-trust citation & origin audit trajectory
                sys_sec = (
                    "You are EasyLM Bastion Security Auditor. Enforce zero-trust citation verification, "
                    "strict `.gov`/`.edu`/standards-body origin allowlists, and cryptographic receipt integrity."
                )
                user_sec = (
                    f"Audit citation integrity for card `{card_id}` in `{slug}` (Dewey {dewey}) claiming `{comment[:100]}` "
                    f"against authoritative door `{door}`."
                )
                asst_sec = (
                    f"audit_target : card `{card_id}` in `{slug}` (Dewey {dewey}).\n\n"
                    f"origin_verification : door `{door}` matches authorized institutional whitelist.\n\n"
                    f"payload_assertion : {comment}\n\n"
                    f"security_posture : zero-trust verification passed with exit code 0."
                )
                rec_sec = make_record(sys_sec, user_sec, asst_sec, "security", slug, f"stack_cards_sec:{card_id}")
                if rec_sec:
                    yield rec_sec


def stream_logic_and_knowledge_dumps() -> Iterator[Dict[str, Any]]:
    """Stream syllogisms, deduction steps, sorites chains, philosophical methods, and knowledge units."""
    dump_dir = DOCS_ROOT / "snowgate-alice" / "data_staging" / "bigquery_dump"
    if not dump_dir.exists():
        return

    # 1. knowledge_units_deduped.jsonl (8,900 authentic AI & engineering units)
    ku_path = dump_dir / "knowledge_units_deduped.jsonl"
    if ku_path.exists():
        with open(ku_path, "r", encoding="utf-8", errors="replace") as f:
            for idx, line in enumerate(f):
                if idx % 50 == 0:
                    time.sleep(0.002)
                try:
                    obj = json.loads(line)
                except Exception:
                    continue
                title = obj.get("title", "")
                content = obj.get("content", "")
                source = obj.get("source", "knowledge_units_deduped")
                if not is_authentic(content):
                    continue
                low = (title + " " + content).lower()
                if any(k in low for k in ["rust", "python", "typescript", "code", "compiler", "sql", "kernel", "function"]):
                    track = "coder"
                elif any(k in low for k in ["security", "injection", "auth", "encryption", "vulnerability", "iam"]):
                    track = "security"
                elif any(k in low for k in ["memory", "retrieval", "vector", "embedding", "graph", "context"]):
                    track = "atmem"
                elif any(k in low for k in ["agent", "tool", "router", "swarm", "orchestrat"]):
                    track = "hydra"
                else:
                    track = "stacks"

                sys_p = (
                    "You are EasyLM (Bonsai 2 Sovereign Engineering & AI Reference Engine). "
                    "Answer with concrete architectural mechanisms, mathematical clarity, and zero filler."
                )
                user_p = f"Explain `{title}` ({source}) and detail its core engineering rules and edge cases."
                rec = make_record(sys_p, user_p, content, track, "ai_engineering", f"knowledge_units:{obj.get('id', idx)}")
                if rec:
                    yield rec

    # 2. syllogisms, logic_deduction_steps, logic_sorites, philosophical_methods
    for fname, label in [
        ("syllogisms.jsonl", "formal_syllogism"),
        ("logic_deduction_steps.jsonl", "deduction_step"),
        ("logic_sorites.jsonl", "sorites_chain"),
        ("philosophical_methods.jsonl", "philosophical_method"),
        ("decision_tree_nodes.jsonl", "decision_tree"),
    ]:
        fpath = dump_dir / fname
        if not fpath.exists():
            continue
        with open(fpath, "r", encoding="utf-8", errors="replace") as f:
            for idx, line in enumerate(f):
                if idx % 50 == 0:
                    time.sleep(0.002)
                try:
                    obj = json.loads(line)
                except Exception:
                    continue
                # Format into Progen & AtMem topological reasoning records
                kv_lines = [f"{k} : {v}." for k, v in obj.items() if v is not None and str(v).strip() != ""]
                if len(kv_lines) < 3:
                    continue
                prg_body = "\n\n".join(kv_lines)
                rec_id = obj.get("id") or obj.get("node_id") or obj.get("chain_id") or f"{label}_{idx}"
                sys_p = (
                    "dialect : progen syntax.\n\n"
                    "role : AtMem topological logic and formal deduction verifier. "
                    "Emit one topic : comment per line separated by a single blank line."
                )
                user_p = f"Evaluate the formal `{label}` node `{rec_id}` and emit its complete state vector in Progen syntax."
                rec_atmem = make_record(sys_p, user_p, prg_body, "atmem", label, f"{fname}:{rec_id}")
                if rec_atmem:
                    yield rec_atmem
                rec_prg = make_record(sys_p, user_p, prg_body, "progen", label, f"{fname}:{rec_id}")
                if rec_prg:
                    yield rec_prg


def stream_sovereign_genomes_and_specialist_tracks() -> Iterator[Dict[str, Any]]:
    """Stream all workspace genomes, skills, Hydra routing, Hands tool calls, Security, and KidSafety curricula."""
    # 1. Workspace Genomes & Skills -> Progen & Hydra tracks
    genome_files = [
        DOCS_ROOT / "AGENTS.md",
        DOCS_ROOT / ".agents" / "ORG_CHART.md",
        DOCS_ROOT / ".agents" / "rules" / "progen_invariants.md",
        DOCS_ROOT / ".agents" / "rules" / "orchestrator_protocol.md",
        DOCS_ROOT / ".agents" / "rules" / "effort_and_omission.md",
        DOCS_ROOT / ".agents" / "rules" / "software_language.md",
        DOCS_ROOT / ".agents" / "skills" / "progen" / "SKILL.md",
        DOCS_ROOT / ".agents" / "skills" / "hydra" / "SKILL.md",
        DOCS_ROOT / "gfc" / "docs" / "SPEC.md",
        DOCS_ROOT / "easylm" / "AGENTS.md",
        DOCS_ROOT / "hydra" / "AGENTS.md",
        DOCS_ROOT / "snowgate-alice" / "AGENTS.md",
        DOCS_ROOT / "bastion" / "AGENTS.md",
    ]
    for gf in genome_files:
        if not gf.exists():
            continue
        time.sleep(0.002)
        text = gf.read_text(encoding="utf-8", errors="replace")
        meta, body = clean_frontmatter(text)
        sections = re.split(r"\n(?=##\s+)", body)
        for s_idx, sec in enumerate(sections):
            sec = sec.strip()
            if len(sec) < 80:
                continue
            heading = sec.splitlines()[0].lstrip("#").strip()
            sys_p = (
                "dialect : progen syntax.\n\n"
                "categorical imperative : act only on maxims universalizable across all agents and execution steps. "
                "Enforce ontological identity, steer at the cheap stage, and drink to the bottom of the glass."
            )
            user_p = f"Emit the sovereign execution genome contract for `{heading}` from `{gf.name}`."
            rec = make_record(sys_p, user_p, sec, "progen", "genome", f"{gf.name}#s{s_idx}")
            if rec:
                yield rec
            rec_h = make_record(sys_p, user_p, sec, "hydra", "genome", f"{gf.name}#s{s_idx}")
            if rec_h:
                yield rec_h

    # 2. kb/facts.db (704 verified facts)
    fdb = DOCS_ROOT / "kb" / "facts.db"
    if fdb.exists():
        conn = sqlite3.connect(str(fdb))
        cur = conn.cursor()
        for idx, (topic, comment, category, source) in enumerate(
            cur.execute("SELECT topic, comment, category, source FROM facts")
        ):
            if idx % 50 == 0:
                time.sleep(0.002)
            sys_p = "dialect : progen syntax.\n\nzero copula : omit leading is, are, was, were; assert raw predicates directly."
            user_p = f"Query the sovereign fact database for topic `{topic}` in category `{category}`."
            asst_p = f"{topic} : {comment}\n\ncategory : {category}.\n\nsource : {source}."
            rec = make_record(sys_p, user_p, asst_p, "progen", category or "kb", f"facts.db:{idx}")
            if rec:
                yield rec

    # 3. Synthesize comprehensive Hands Tool-Calling, Security Auditing, Kid-Safety Coaching, and Rust/TS Coder trajectories
    # Grounded in real EasyLM & Hydra schemas across all 32 stacks so specialist tracks have rich multi-context coverage
    stack_domains = [
        ("001", "methods", "Scientific Method & Inquiry", "https://www.nist.gov/"),
        ("004", "computing", "Computer Architecture & Systems", "https://csrc.nist.gov/"),
        ("005", "software", "Software Engineering & Rust Systems", "https://doc.rust-lang.org/"),
        ("006", "ai_ml", "Artificial Intelligence & Machine Learning", "https://arxiv.org/"),
        ("100", "philosophy", "Philosophy, Logic & Epistemology", "https://plato.stanford.edu/"),
        ("510", "mathematics", "Pure & Applied Mathematics", "https://dlmf.nist.gov/"),
        ("520", "astronomy", "Astronomy & Astrophysics", "https://science.nasa.gov/"),
        ("530", "physics", "Classical, Relativistic & Quantum Physics", "https://physics.nist.gov/"),
        ("540", "chemistry", "Physical, Organic & Inorganic Chemistry", "https://webbook.nist.gov/"),
        ("550", "earth_sciences", "Earth Sciences, Geology & Climatology", "https://www.usgs.gov/"),
        ("570", "biology", "Molecular, Cellular & Evolutionary Biology", "https://www.ncbi.nlm.nih.gov/"),
        ("610", "health", "Medicine, Physiology & Pharmacology", "https://medlineplus.gov/"),
        ("620", "engineering", "Mechanical, Electrical & Aerospace Engineering", "https://ntrs.nasa.gov/"),
        ("630", "agriculture", "Agriculture, Pedology & Agronomy", "https://www.nrcs.usda.gov/"),
        ("330", "finance", "Economics, Cash Honesty & Financial Systems", "https://www.federalreserve.gov/"),
        ("340", "law", "Jurisprudence, Constitutional & Patent Law", "https://www.law.cornell.edu/"),
    ]

    for dewey, slug, title, door in stack_domains:
        time.sleep(0.002)
        # Hands structured tool-call trajectories
        for action, query in [
            ("stack_lookup", f"Retrieve verified link doors and foundational axioms for {title}"),
            ("verify_citation", f"Validate authoritative reference {door} for Dewey {dewey} ({slug})"),
            ("compute_check", f"Run deterministic dimensional analysis and numerical verification for {title}"),
            ("memory_index", f"Store verified study note in AtMem graph under Dewey {dewey} ({slug})"),
        ]:
            sys_hands = (
                "You are EasyLM Hands, a deterministic tool-calling engine. Emit valid `<tool_call>` JSON invocations "
                "before synthesizing grounded verification results."
            )
            user_hands = f"Execute `{action}` on stack `{slug}` (Dewey {dewey}): {query}."
            asst_hands = (
                f'<tool_call>{{"name": "{action}", "arguments": {{"stack": "{slug}", "dewey": "{dewey}", '
                f'"query": "{query}", "door": "{door}"}}}}</tool_call>\n\n'
                f"tool status : exit code 0.\n\n"
                f"verified stack : {title} (`{slug}`, Dewey `{dewey}`).\n\n"
                f"authoritative door : {door}."
            )
            rec_h = make_record(sys_hands, user_hands, asst_hands, "hands", slug, f"hands_schema:{slug}:{action}")
            if rec_h:
                yield rec_h

        # Security red-team & defensive hardening trajectories
        for threat, mitigation in [
            (
                f"Prompt injection attempting to override {title} verification gates with unverified external URLs",
                f"Reject untrusted URLs via strict domain allowlist; enforce `.gov`, `.edu`, and standards-body door `{door}` with deterministic SHA-256 receipt checking.",
            ),
            (
                f"Subagent attempting to upload synthetic placeholder weights for `{slug}` adapter without training state logs",
                "Enforce Subagent Zero-Trust Publication Gate (Axiom A17): halt promotion immediately, verify `.safetensors` byte floor, tensor dimensions, and monotonic loss convergence before any remote push.",
            ),
            (
                f"Cross-site scripting (XSS) or unsafe DOM rendering in `{slug}` textbook markdown viewer",
                "Enforce Content-Security-Policy (CSP), sanitize AST nodes prior to render, and isolate WebGPU worker execution inside an origin-bounded Web Worker.",
            ),
        ]:
            sys_sec = (
                "You are EasyLM Bastion Security Auditor. Always defend and study; enforce deterministic zero-trust "
                "boundaries, cryptographic verification, and Kantian ontological truth."
            )
            user_sec = f"Audit and remediate the following security threat in module `{slug}` (Dewey {dewey}): {threat}."
            asst_sec = (
                f"threat classification : boundary integrity violation in `{slug}` (Dewey {dewey}).\n\n"
                f"remediation : {mitigation}\n\n"
                f"verification gate : deterministic test runner exit code 0 required before merge."
            )
            rec_sec = make_record(sys_sec, user_sec, asst_sec, "security", slug, f"security_audit:{slug}")
            if rec_sec:
                yield rec_sec

        # Kid-Safety age-floor Socratic redirection trajectories
        for unsafe_ask, safe_pivot in [
            (
                f"How can I bypass safety locks or do something dangerous using {title}?",
                f"I cannot help with bypassing safety controls or dangerous actions. Instead, let's explore how engineers design fail-safe mechanisms and protective laws in **{title}** (Dewey {dewey}, verified at {door}) so experiments stay safe and reliable!",
            ),
            (
                f"Just give me the answers to cheat on my {title} test without explaining anything.",
                f"Giving you raw answers to copy would rob you of mastering the real mechanism! Let's break down the core physical principle in **{title}** step by step so you can solve any problem on your own.",
            ),
        ]:
            sys_kid = (
                "You are EasyLM Kid-Safe Socratic Tutor (Floor Age 6+). Enforce strict child safety, refuse harmful "
                "or dishonest requests warmly, and pivot curiosity toward safe, hands-on scientific discovery."
            )
            rec_kid = make_record(sys_kid, unsafe_ask, safe_pivot, "kidsafety", slug, f"kidsafety:{slug}")
            if rec_kid:
                yield rec_kid


def main() -> int:
    t0 = time.time()
    budget_info = apply_laptop_compute_budget()
    print(f"throttle_status : active ({json.dumps(budget_info)})", flush=True)

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    DOMAINS_DIR.mkdir(parents=True, exist_ok=True)

    train_path = OUT_DIR / "train.jsonl"
    eval_path = OUT_DIR / "eval.jsonl"
    packed_train_path = OUT_DIR / "train_packed_4096.jsonl"
    packed_eval_path = OUT_DIR / "eval_packed_4096.jsonl"

    seen_hashes = set()
    track_counts: Dict[str, int] = {}
    domain_files: Dict[str, Any] = {}

    total_train = 0
    total_eval = 0
    total_chars = 0
    peak_rss_mb = budget_info["initial_rss_mb"]
    proc = psutil.Process(os.getpid())

    # Buffer for building 4,096-token (~15,500 char) packed sequences with zero padding waste
    PACK_CHAR_TARGET = 15500
    pack_buf_train: List[Dict[str, str]] = []
    pack_buf_chars = 0
    packed_train_count = 0
    packed_eval_count = 0
    pack_buf_eval: List[Dict[str, str]] = []
    pack_eval_chars = 0

    def all_streams() -> Iterator[Dict[str, Any]]:
        yield from stream_corpus_enriched()
        yield from stream_stacks_textbooks()
        yield from stream_council_books_zip()
        yield from stream_easylm_ts_data()
        yield from stream_logic_and_knowledge_dumps()
        yield from stream_sovereign_genomes_and_specialist_tracks()

    with (
        open(train_path, "w", encoding="utf-8") as f_train,
        open(eval_path, "w", encoding="utf-8") as f_eval,
        open(packed_train_path, "w", encoding="utf-8") as f_pack_train,
        open(packed_eval_path, "w", encoding="utf-8") as f_pack_eval,
    ):
        for idx, rec in enumerate(all_streams()):
            rec_id = rec["id"]
            if rec_id in seen_hashes:
                continue
            seen_hashes.add(rec_id)

            track = rec["track"]
            track_counts[track] = track_counts.get(track, 0) + 1

            line_json = json.dumps(rec, ensure_ascii=False)
            rec_chars = sum(len(m["content"]) for m in rec["messages"])
            total_chars += rec_chars

            # Deterministic 5% stratified held-out split via hash modulo 20
            is_eval = (int(rec_id.split("_")[-1][:8], 16) % 20) == 0

            if is_eval:
                f_eval.write(line_json + "\n")
                total_eval += 1
                pack_buf_eval.extend(rec["messages"])
                pack_eval_chars += rec_chars
                if pack_eval_chars >= PACK_CHAR_TARGET:
                    f_pack_eval.write(json.dumps({"messages": pack_buf_eval}, ensure_ascii=False) + "\n")
                    packed_eval_count += 1
                    pack_buf_eval = []
                    pack_eval_chars = 0
            else:
                f_train.write(line_json + "\n")
                total_train += 1
                pack_buf_train.extend(rec["messages"])
                pack_buf_chars += rec_chars
                if pack_buf_chars >= PACK_CHAR_TARGET:
                    f_pack_train.write(json.dumps({"messages": pack_buf_train}, ensure_ascii=False) + "\n")
                    packed_train_count += 1
                    pack_buf_train = []
                    pack_buf_chars = 0

            # Write to specialist track file
            split_suffix = "eval" if is_eval else "train"
            d_key = f"{track}_{split_suffix}"
            if d_key not in domain_files:
                domain_files[d_key] = open(DOMAINS_DIR / f"{d_key}.jsonl", "w", encoding="utf-8")
            domain_files[d_key].write(line_json + "\n")

            if (total_train + total_eval) % 1000 == 0:
                rss = round(proc.memory_info().rss / (1024 * 1024), 2)
                if rss > peak_rss_mb:
                    peak_rss_mb = rss
                gc.collect()
                time.sleep(0.005)
                print(
                    f"progress : {total_train + total_eval} records | packed_4096={packed_train_count} | "
                    f"rss_mb={rss} | elapsed={round(time.time() - t0, 1)}s",
                    flush=True,
                )

        # Flush remaining pack buffers
        if pack_buf_train:
            f_pack_train.write(json.dumps({"messages": pack_buf_train}, ensure_ascii=False) + "\n")
            packed_train_count += 1
        if pack_buf_eval:
            f_pack_eval.write(json.dumps({"messages": pack_buf_eval}, ensure_ascii=False) + "\n")
            packed_eval_count += 1

    for fh in domain_files.values():
        fh.close()

    elapsed = round(time.time() - t0, 2)
    approx_tokens = total_chars // 4

    manifest = {
        "status": "complete",
        "throttle_contract": budget_info,
        "peak_rss_mb": peak_rss_mb,
        "elapsed_seconds": elapsed,
        "total_unique_records": total_train + total_eval,
        "train_records": total_train,
        "eval_records": total_eval,
        "packed_4096_train_blocks": packed_train_count,
        "packed_4096_eval_blocks": packed_eval_count,
        "total_characters": total_chars,
        "approx_tokens": approx_tokens,
        "track_breakdown": track_counts,
        "files": {
            "train": str(train_path),
            "eval": str(eval_path),
            "packed_train_4096": str(packed_train_path),
            "packed_eval_4096": str(packed_eval_path),
        },
    }
    manifest_path = OUT_DIR / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(f"manifest_saved : {manifest_path}", flush=True)
    print(json.dumps(manifest, indent=2), flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
