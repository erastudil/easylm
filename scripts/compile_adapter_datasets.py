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

# House textbooks put the separator inside the bold: `- **Topic:** fact`.
# A few packs put it outside: `- **Topic**: fact`. Em dash and hyphen count too.
# The characters are written out because `\u2014` inside a raw string is not an em dash.
_BULLET_RE = re.compile(
    r"^[-*]\s+\*\*(?:"
    r"([^*]+?)\s*[:—–-]\s*\*\*"
    r"|([^*]+)\*\*\s*[:—–-]"
    r")\s+(.+)$"
)
_PROGEN_RE = re.compile(r"^([^:=#|>]{2,60})\s*([:=])\s*([A-Za-z0-9].+)$")


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
        if not line.startswith(("http", "#", "|", "//")):
            m_prog = _PROGEN_RE.match(line)
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
    parser.add_argument("--out", type=Path, default=default_root / "data" / "adapter_train.jsonl")
    parser.add_argument("--self-test", action="store_true", help="Run deterministic unit self-test")
    args = parser.parse_args(list(argv) if argv is not None else None)

    if args.self_test:
        _run_self_test()
        print("[OK] compile_adapter_datasets self-test passed.")
        return 0

    count = compile_stacks_to_jsonl(args.stacks_dir, args.out)
    print(f"[OK] Compiled {count} ChatML training records to {args.out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
