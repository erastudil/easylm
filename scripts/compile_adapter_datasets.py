#!/usr/bin/env python3
# SPDX-License-Identifier: AGPL-3.0-or-later
"""Compile deterministic ChatML JSONL training datasets for EasyLM LoRA adapters.

Extracts verified subject units from:
1. EasyLM stacks (`C:\\Users\\jpm05\\Documents\\easylm\\stacks`, all 32-92 stacks)
2. Sovereign root stacks (`C:\\Users\\jpm05\\Documents\\stacks`, 91 textbooks + 38 corpus folders)
3. Unified Alice stack cards (`C:\\Users\\jpm05\\Documents\\snowgate-alice\\rust-backend\\data\\unified\\stack_cards.jsonl`)
4. Unified Google Drive Fact Tables (`C:\\Users\\jpm05\\Documents\\snowgate-alice\\data_staging\\drive_harvest\\fact_tables_unified.jsonl`, 369 tables)
into ChatML-formatted JSONL rows (`messages: [{role, content}, ...]`) suitable for
LoRA fine-tuning of EasyLM & Hydra local models (Bonsai 2 2B, 4B, 9B, 27B and Gemma 4).
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
from pathlib import Path
import re
import sys
from typing import Any, Iterable


SYSTEM_PROMPT = (
    "You are EasyLM, an offline-first educational assistant grounded in verified "
    "textbook facts, sovereign academic stacks, and Progen assertions."
)

# House textbooks put the separator inside the bold: `- **Topic:** fact`.
# A few packs put it outside: `- **Topic**: fact`. Em dash and hyphen count too.
# The characters are written out because `\u2014` inside a raw string is not an em dash.
_BULLET_RE = re.compile(
    r"^[-*]\s+\*\*(?:"
    r"([^*]+?)\s*[:—–-]\s*\*\*"
    r"|([^*]+)\*\*\s*[:—–-]"
    r")\s+(.+)$"
)
_PROGEN_RE = re.compile(r"^([^:=#|>]{2,80})\s*([:=])\s*([A-Za-z0-9\"'(].+)$")

EASYLM_ROOT = Path(__file__).resolve().parents[1]
DOCS_ROOT = EASYLM_ROOT.parent
ROOT_STACKS_DIR = DOCS_ROOT / "stacks"
FACT_TABLES_JSONL = DOCS_ROOT / "snowgate-alice" / "data_staging" / "drive_harvest" / "fact_tables_unified.jsonl"
STACK_CARDS_JSONL = DOCS_ROOT / "snowgate-alice" / "rust-backend" / "data" / "unified" / "stack_cards.jsonl"
STACKS_CANON_DIR = DOCS_ROOT / "snowgate-alice" / "data_staging" / "drive_harvest" / "stacks_canon_md"
DRIVE_EXPORTS_DIR = Path(r"G:\My Drive\fact tables\exports")


def extract_units_from_markdown(text: str, dewey: str = "000", slug: str = "general") -> list[dict]:
    """Extract factual (topic, comment, chapter, dewey, slug) records from markdown."""
    units: list[dict] = []
    chapter = "General"
    paragraphs: list[str] = []
    current_para: list[str] = []

    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            if current_para:
                joined = " ".join(current_para).strip()
                if len(joined) >= 120 and not joined.startswith(("#", "|", "```", "---")):
                    paragraphs.append((chapter, joined))
                current_para = []
            continue
        if line.startswith("## ") or line.startswith("### "):
            if current_para:
                joined = " ".join(current_para).strip()
                if len(joined) >= 120 and not joined.startswith(("#", "|", "```", "---")):
                    paragraphs.append((chapter, joined))
                current_para = []
            chapter = line.lstrip("#").strip() or "General"
            continue
        m_bul = _BULLET_RE.match(line)
        if m_bul:
            topic = (m_bul.group(1) or m_bul.group(2)).strip()
            units.append({
                "topic": topic,
                "comment": m_bul.group(3).strip(),
                "dewey": dewey,
                "chapter": chapter,
                "slug": slug,
                "mark": ":",
            })
            continue
        if not line.startswith(("http", "#", "|", "//", "---")):
            m_prog = _PROGEN_RE.match(line)
            if m_prog:
                topic = m_prog.group(1).strip()
                if "http" not in topic and len(topic.split()) <= 8 and not topic.isdigit():
                    units.append({
                        "topic": topic,
                        "comment": m_prog.group(3).strip(),
                        "dewey": dewey,
                        "chapter": chapter,
                        "slug": slug,
                        "mark": m_prog.group(2),
                    })
                    continue
            current_para.append(line)

    if current_para:
        joined = " ".join(current_para).strip()
        if len(joined) >= 120 and not joined.startswith(("#", "|", "```", "---")):
            paragraphs.append((chapter, joined))

    # If markdown is pure GFC textbook prose without bullet/progen lines, extract rich chapter paragraphs
    if not units and paragraphs:
        for idx, (chap, para) in enumerate(paragraphs[:12]):
            topic_label = chap if chap != "General" else f"{slug.replace('_', ' ')} principle {idx + 1}"
            units.append({
                "topic": topic_label,
                "comment": para[:900],
                "dewey": dewey,
                "chapter": chap,
                "slug": slug,
                "mark": ":",
            })

    return units


def unit_to_chatml_record(unit: dict) -> dict:
    """Convert a single extracted unit dict into a deterministic ChatML JSONL object."""
    topic = unit["topic"]
    comment = unit["comment"]
    dewey = unit.get("dewey", "000")
    slug = unit.get("slug", "general")
    chapter = unit.get("chapter", "General")
    mark = unit.get("mark", ":")
    prompt = (
        f"Define {topic} ({slug}, Dewey {dewey})."
        if mark == "="
        else f"Explain the key fact regarding {topic} in {chapter} ({slug})."
    )
    digest = hashlib.sha256(f"{dewey}:{slug}:{topic}:{comment}".encode("utf-8")).hexdigest()[:16]
    return {
        "id": digest,
        "dewey": dewey,
        "slug": slug,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": prompt},
            {"role": "assistant", "content": f"{topic} {mark} {comment}"},
        ],
    }


def extract_fact_tables_records(
    fact_tables_path: Path = FACT_TABLES_JSONL,
    exports_dir: Path = DRIVE_EXPORTS_DIR,
) -> list[dict]:
    """Extract ChatML records from the 369 unified Google Drive Fact Tables and CSV exports."""
    records: list[dict] = []
    seen_ids: set[str] = set()

    if fact_tables_path.is_file():
        with open(fact_tables_path, "r", encoding="utf-8", errors="ignore") as f:
            for raw_line in f:
                raw_line = raw_line.strip()
                if not raw_line:
                    continue
                try:
                    row = json.loads(raw_line)
                except Exception:
                    continue
                table_title = str(row.get("table_title") or "Sovereign Fact Table").strip()
                domain = str(row.get("domain") or "general_reference").strip()
                data_obj = row.get("data")
                row_idx = row.get("row_index", 1)

                if isinstance(data_obj, dict) and data_obj:
                    non_empty = [(str(k).strip(), str(v).strip()) for k, v in data_obj.items() if str(v).strip()]
                    if not non_empty:
                        continue
                    entity_col, entity_val = non_empty[0]
                    progen_lines = [f"table : {table_title}", f"domain : {domain}"]
                    for k, v in non_empty[:8]:
                        clean_k = k.lower().replace(":", " ").strip()
                        clean_v = v.replace("\n", " ").strip()
                        progen_lines.append(f"{clean_k} : {clean_v}")
                    assistant_body = "\n\n".join(progen_lines)
                    user_q = (
                        f"According to the '{table_title}' reference table ({domain}), "
                        f"what are the verified figures and properties for {entity_val} ({entity_col})?"
                    )
                else:
                    text_val = str(row.get("text") or "").strip()
                    if not text_val:
                        continue
                    user_q = f"Provide verified data from '{table_title}' ({domain}, row {row_idx})."
                    assistant_body = f"table : {table_title}\n\ndomain : {domain}\n\nrecord : {text_val}"

                digest = hashlib.sha256(f"fact_table:{table_title}:{row_idx}:{user_q}".encode("utf-8")).hexdigest()[:16]
                if digest not in seen_ids:
                    seen_ids.add(digest)
                    records.append({
                        "id": digest,
                        "dewey": "000",
                        "slug": f"fact_table_{domain}",
                        "messages": [
                            {"role": "system", "content": SYSTEM_PROMPT},
                            {"role": "user", "content": user_q},
                            {"role": "assistant", "content": assistant_body},
                        ],
                    })

    if exports_dir.is_dir():
        for csv_path in sorted(exports_dir.glob("*.csv")):
            table_name = csv_path.stem.replace("_", " ").title()
            try:
                with open(csv_path, "r", encoding="utf-8", errors="ignore") as cf:
                    reader = csv.DictReader(cf)
                    for idx, row in enumerate(reader):
                        if idx >= 25:
                            break
                        pairs = [(str(k).strip(), str(v).strip()) for k, v in row.items() if k and v and str(v).strip()]
                        if not pairs:
                            continue
                        head_k, head_v = pairs[0]
                        progen_lines = [f"source table : {table_name}"]
                        for k, v in pairs[:8]:
                            progen_lines.append(f"{k.lower().replace(':', ' ').strip()} : {v}")
                        user_q = f"What are the verified metrics for {head_v} in the {table_name} dataset?"
                        digest = hashlib.sha256(f"export_csv:{table_name}:{idx}:{head_v}".encode("utf-8")).hexdigest()[:16]
                        if digest not in seen_ids:
                            seen_ids.add(digest)
                            records.append({
                                "id": digest,
                                "dewey": "330",
                                "slug": "drive_fact_exports",
                                "messages": [
                                    {"role": "system", "content": SYSTEM_PROMPT},
                                    {"role": "user", "content": user_q},
                                    {"role": "assistant", "content": "\n\n".join(progen_lines)},
                                ],
                            })
            except Exception:
                continue

        for md_path in sorted(exports_dir.glob("*.md")):
            try:
                md_text = md_path.read_text(encoding="utf-8", errors="ignore")
                for unit in extract_units_from_markdown(md_text, dewey="320", slug=md_path.stem):
                    rec = unit_to_chatml_record(unit)
                    if rec["id"] not in seen_ids:
                        seen_ids.add(rec["id"])
                        records.append(rec)
            except Exception:
                continue

    return records


def compile_stacks_to_jsonl(
    stacks_dir: Path,
    output_jsonl: Path,
    include_extended_corpora: bool = True,
) -> int:
    """Compile all subject markdown files in stacks_dir (and extended sovereign stacks/fact tables) into JSONL."""
    packs_file = stacks_dir / "PACKS.json"
    packs = json.loads(packs_file.read_text(encoding="utf-8")) if packs_file.exists() else []
    seen_ids: set[str] = set()
    rows: list[str] = []

    pack_map: dict[str, str] = {}
    for pack in packs:
        slug = pack["slug"]
        dewey = str(pack.get("dewey", "000"))
        pack_map[slug] = dewey
        for md_name in ("FACTS.md", "TEXTBOOK.md"):
            md_path = stacks_dir / slug / md_name
            if not md_path.exists():
                continue
            for unit in extract_units_from_markdown(md_path.read_text(encoding="utf-8", errors="ignore"), dewey=dewey, slug=slug):
                rec = unit_to_chatml_record(unit)
                if rec["id"] not in seen_ids:
                    seen_ids.add(rec["id"])
                    rows.append(json.dumps(rec, ensure_ascii=False))

    # Also scan any additional stack directories in stacks_dir not yet in PACKS.json (e.g. expanded 92 stacks)
    if stacks_dir.is_dir():
        for subdir in sorted(stacks_dir.iterdir()):
            if not subdir.is_dir() or subdir.name in pack_map:
                continue
            slug = subdir.name
            dewey = "500"
            for md_name in ("FACTS.md", "TEXTBOOK.md"):
                md_path = subdir / md_name
                if not md_path.exists():
                    continue
                for unit in extract_units_from_markdown(md_path.read_text(encoding="utf-8", errors="ignore"), dewey=dewey, slug=slug):
                    rec = unit_to_chatml_record(unit)
                    if rec["id"] not in seen_ids:
                        seen_ids.add(rec["id"])
                        rows.append(json.dumps(rec, ensure_ascii=False))

    # If compiling the real workspace stacks, include C:\Users\jpm05\Documents\stacks, stack_cards.jsonl, and Drive fact tables
    if include_extended_corpora and stacks_dir.resolve() == (EASYLM_ROOT / "stacks").resolve():
        # 1. C:\Users\jpm05\Documents\stacks\textbooks (91 GFC textbooks)
        tb_dir = ROOT_STACKS_DIR / "textbooks"
        if tb_dir.is_dir():
            for md_path in sorted(tb_dir.rglob("*.md")):
                slug = md_path.parent.name if md_path.parent != tb_dir else md_path.stem
                for unit in extract_units_from_markdown(md_path.read_text(encoding="utf-8", errors="ignore"), dewey="500", slug=slug):
                    rec = unit_to_chatml_record(unit)
                    if rec["id"] not in seen_ids:
                        seen_ids.add(rec["id"])
                        rows.append(json.dumps(rec, ensure_ascii=False))

        # 2. C:\Users\jpm05\Documents\stacks\corpus (38 discipline corpora)
        corpus_dir = ROOT_STACKS_DIR / "corpus"
        if corpus_dir.is_dir():
            for disc_dir in sorted(corpus_dir.iterdir()):
                if not disc_dir.is_dir():
                    continue
                slug = disc_dir.name
                tb_files = sorted((disc_dir / "textbook").rglob("*.md")) if (disc_dir / "textbook").is_dir() else []
                for md_path in tb_files[:8]:
                    for unit in extract_units_from_markdown(md_path.read_text(encoding="utf-8", errors="ignore"), dewey="500", slug=slug):
                        rec = unit_to_chatml_record(unit)
                        if rec["id"] not in seen_ids:
                            seen_ids.add(rec["id"])
                            rows.append(json.dumps(rec, ensure_ascii=False))

        # 3. Unified stack_cards.jsonl (2,528 cards)
        if STACK_CARDS_JSONL.is_file():
            with open(STACK_CARDS_JSONL, "r", encoding="utf-8", errors="ignore") as scf:
                for line in scf:
                    line = line.strip()
                    if not line:
                        continue
                    try:
                        card = json.loads(line)
                    except Exception:
                        continue
                    topic = str(card.get("topic") or "").strip()
                    comment = str(card.get("comment") or "").strip()
                    slug = str(card.get("slug") or "general").strip()
                    dewey = str(card.get("dewey") or "000").strip()
                    door = str(card.get("door") or "").strip()
                    if topic and comment:
                        cite = f"\n\ndoor : {door}" if door else ""
                        unit = {
                            "topic": topic,
                            "comment": f"{comment}{cite}",
                            "dewey": dewey,
                            "chapter": str(card.get("title") or slug),
                            "slug": slug,
                            "mark": ":",
                        }
                        rec = unit_to_chatml_record(unit)
                        if rec["id"] not in seen_ids:
                            seen_ids.add(rec["id"])
                            rows.append(json.dumps(rec, ensure_ascii=False))

        # 4. Stacks canon markdowns from Drive harvest
        if STACKS_CANON_DIR.is_dir():
            for md_path in sorted(STACKS_CANON_DIR.glob("*.md")):
                for unit in extract_units_from_markdown(md_path.read_text(encoding="utf-8", errors="ignore"), dewey="000", slug=md_path.stem):
                    rec = unit_to_chatml_record(unit)
                    if rec["id"] not in seen_ids:
                        seen_ids.add(rec["id"])
                        rows.append(json.dumps(rec, ensure_ascii=False))

        # 5. Unified Drive Fact Tables (4,634 rows across 369 tables)
        for ft_rec in extract_fact_tables_records():
            if ft_rec["id"] not in seen_ids:
                seen_ids.add(ft_rec["id"])
                rows.append(json.dumps(ft_rec, ensure_ascii=False))

    output_jsonl.parent.mkdir(parents=True, exist_ok=True)
    output_jsonl.write_text("\n".join(rows) + ("\n" if rows else ""), encoding="utf-8")
    return len(rows)


def _run_self_test() -> None:
    sample_md = """# Physics (530)
## Thermodynamics
- **First Law of Thermodynamics:** Energy cannot be created or destroyed in an isolated system.
- **Isolated System**: a system that exchanges neither matter nor energy.
entropy = a measure of thermal energy unavailable for mechanical work.
"""
    units = extract_units_from_markdown(sample_md, dewey="530", slug="physics")
    assert len(units) == 3, f"Expected 3 units, got {len(units)}"
    assert units[0]["topic"] == "First Law of Thermodynamics"
    assert units[0]["comment"].startswith("Energy cannot")
    assert units[1]["topic"] == "Isolated System"
    rec0 = unit_to_chatml_record(units[0])
    rec2 = unit_to_chatml_record(units[2])
    assert rec0["dewey"] == "530" and rec0["slug"] == "physics"
    assert len(rec0["messages"]) == 3
    assert "First Law of Thermodynamics" in rec0["messages"][2]["content"]
    assert rec2["messages"][1]["content"].startswith("Define entropy")


def main(argv: Iterable[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Compile EasyLM adapter ChatML JSONL dataset.")
    default_root = Path(__file__).resolve().parents[1]
    parser.add_argument("--stacks-dir", type=Path, default=default_root / "stacks")
    parser.add_argument("--out", type=Path, default=default_root / "data" / "adapter_stacks_chatml.jsonl")
    parser.add_argument("--self-test", action="store_true", help="Run deterministic unit self-test")
    args = parser.parse_args(list(argv) if argv is not None else None)

    if args.self_test:
        _run_self_test()
        print("[OK] compile_adapter_datasets self-test passed.")
        return 0

    count = compile_stacks_to_jsonl(args.stacks_dir, args.out)
    print(f"[OK] Compiled {count} ChatML training records to {args.out}")

    # Mirror to adapter_train.jsonl if default output was used
    if args.out.name == "adapter_stacks_chatml.jsonl":
        legacy_out = args.out.parent / "adapter_train.jsonl"
        legacy_out.write_bytes(args.out.read_bytes())
        print(f"[OK] Mirrored {count} ChatML training records to {legacy_out}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
