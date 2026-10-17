# SPDX-License-Identifier: AGPL-3.0-or-later
"""Compile deterministic ChatML JSONL training datasets for EasyLM LoRA adapters.

Extracts verified subject units from EasyLM stacks and course curricula into
ChatML-formatted JSONL rows (`messages: [{role, content}, ...]`) suitable for
LoRA fine-tuning of EasyLM local models (0.5B to 27B).
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path
import re
import sys
from typing import Iterable


SYSTEM_PROMPT = (
    "You are EasyLM, an offline-first educational assistant grounded in verified "
    "textbook facts and Progen assertions."
)

_BULLET_RE = re.compile(r"^[-*]\s+\*\*([^*]+)\*\*[:\u2014\-]\s+(.+)$")
_PROGEN_RE = re.compile(r"^([^:=#|>]{2,60})\s*([:=])\s*([A-Za-z0-9].+)$")
# FACTS.md comments may open on a quote, TeX mark, caret, bracket, or comma.
# Those rows always carry a // door aside. The aside is what keeps textbook
# YAML and bold lines out of the training set.
_PROGEN_DOOR_RE = re.compile(
    r"^([^:=#|>]{2,60})\s*([:=])\s*(\S.*// door \S+.*)$"
)


def extract_units_from_markdown(text: str, dewey: str = "000", slug: str = "general") -> list[dict]:
    """Extract factual (topic, comment, chapter, dewey, slug) records from markdown."""
    units: list[dict] = []
    chapter = "General"
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        if line.startswith("## "):
            chapter = line[3:].strip() or "General"
            continue
        m_bul = _BULLET_RE.match(line)
        if m_bul:
            units.append({
                "topic": m_bul.group(1).strip(),
                "comment": m_bul.group(2).strip(),
                "dewey": dewey,
                "chapter": chapter,
                "slug": slug,
                "mark": ":",
            })
            continue
        if not line.startswith(("http", "#", "|", "//")):
            m_prog = _PROGEN_RE.match(line)
            if m_prog is None and " // door " in line:
                m_prog = _PROGEN_DOOR_RE.match(line)
            if m_prog:
                topic = m_prog.group(1).strip()
                if "http" not in topic and len(topic.split()) <= 6 and not topic.isdigit():
                    units.append({
                        "topic": topic,
                        "comment": m_prog.group(3).strip(),
                        "dewey": dewey,
                        "chapter": chapter,
                        "slug": slug,
                        "mark": m_prog.group(2),
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


def compile_stacks_to_jsonl(stacks_dir: Path, output_jsonl: Path) -> int:
    """Compile all subject markdown files in stacks_dir into a deduplicated JSONL file."""
    packs_file = stacks_dir / "PACKS.json"
    packs = json.loads(packs_file.read_text(encoding="utf-8")) if packs_file.exists() else []
    seen_ids: set[str] = set()
    rows: list[str] = []

    for pack in packs:
        slug = pack["slug"]
        dewey = pack.get("dewey", "000")
        for md_name in ("FACTS.md", "TEXTBOOK.md"):
            md_path = stacks_dir / slug / md_name
            if not md_path.exists():
                continue
            for unit in extract_units_from_markdown(md_path.read_text(encoding="utf-8"), dewey=dewey, slug=slug):
                rec = unit_to_chatml_record(unit)
                if rec["id"] not in seen_ids:
                    seen_ids.add(rec["id"])
                    rows.append(json.dumps(rec, ensure_ascii=False))

    output_jsonl.parent.mkdir(parents=True, exist_ok=True)
    output_jsonl.write_text("\n".join(rows) + ("\n" if rows else ""), encoding="utf-8")
    return len(rows)


def _run_self_test() -> None:
    sample_md = """# Physics (530)
## Thermodynamics
- **First Law of Thermodynamics**: Energy cannot be created or destroyed in an isolated system.
entropy = a measure of thermal energy unavailable for mechanical work.
"""
    units = extract_units_from_markdown(sample_md, dewey="530", slug="physics")
    assert len(units) == 2, f"Expected 2 units, got {len(units)}"
    rec0 = unit_to_chatml_record(units[0])
    rec1 = unit_to_chatml_record(units[1])
    assert rec0["dewey"] == "530" and rec0["slug"] == "physics"
    assert len(rec0["messages"]) == 3
    assert "First Law of Thermodynamics" in rec0["messages"][2]["content"]
    assert rec1["messages"][1]["content"].startswith("Define entropy")


def _run_door_comment_self_test() -> None:
    """Quoted and TeX comments with a door aside are facts. A quote without one is not."""
    sample_md = """# Chemistry (540)
## Nuclear
title: "methods — undergrad textbook"
not a fact : "this line has no door aside"
golden rule : "Treat others as you would want to be treated." // door https://plato.stanford.edu/
nuclide notation : ^{A}{Z}X denotes an isotope. // door https://goldbook.iupac.org/
"""
    units = extract_units_from_markdown(sample_md, dewey="540", slug="chemistry")
    topics = [unit["topic"] for unit in units]
    assert topics == ["golden rule", "nuclide notation"], topics
    assert units[0]["comment"].startswith('"Treat others')
    assert " // door " in units[0]["comment"]
    assert units[1]["comment"].startswith("^{A}")
    assert units[1]["mark"] == ":"


def main(argv: Iterable[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Compile EasyLM adapter ChatML JSONL dataset.")
    default_root = Path(__file__).resolve().parents[1]
    parser.add_argument("--stacks-dir", type=Path, default=default_root / "stacks")
    parser.add_argument("--out", type=Path, default=default_root / "data" / "adapter_train.jsonl")
    parser.add_argument("--self-test", action="store_true", help="Run deterministic unit self-test")
    args = parser.parse_args(list(argv) if argv is not None else None)

    if args.self_test:
        _run_self_test()
        _run_door_comment_self_test()
        print("[OK] compile_adapter_datasets self-test passed.")
        return 0

    count = compile_stacks_to_jsonl(args.stacks_dir, args.out)
    print(f"[OK] Compiled {count} ChatML training records to {args.out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
