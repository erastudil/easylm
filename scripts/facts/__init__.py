# SPDX-License-Identifier: AGPL-3.0-or-later
"""Aggregator of all verified fact packs for EasyLM stacks."""

import json
from pathlib import Path
import re
from typing import Dict, List, Tuple

from .common import Fact
from .facts_000_computing import METHODS_FACTS, COMPUTING_FACTS, SOFTWARE_FACTS, SECURITY_FACTS, AI_ML_FACTS
from .facts_100_philosophy import PHILOSOPHY_FACTS, PSYCHOLOGY_FACTS, TAO_TE_CHING_FACTS, RELIGION_FACTS
from .facts_300_social import SOCIOLOGY_FACTS, CIVICS_FACTS, FINANCE_FACTS, LAW_FACTS
from .facts_400_language_math import LANGUAGE_FACTS, MATH_FACTS
from .facts_500_physical_sciences import ASTRONOMY_FACTS, PHYSICS_FACTS, CHEMISTRY_FACTS, EARTH_SCIENCES_FACTS, BIOLOGY_FACTS
from .facts_600_applied_sciences import HEALTH_FACTS, ENGINEERING_FACTS, AGRICULTURE_FACTS, BUSINESS_FACTS, TRADES_FACTS
from .facts_700_arts_humanities import ART_FACTS, MUSIC_FACTS, LITERATURE_FACTS, POETRY_FACTS, HISTORY_FACTS, GEOGRAPHY_FACTS

CURATED_PACKS: Dict[str, List[Fact]] = {
    "methods": METHODS_FACTS,
    "computing": COMPUTING_FACTS,
    "software": SOFTWARE_FACTS,
    "security": SECURITY_FACTS,
    "ai_ml": AI_ML_FACTS,
    "philosophy": PHILOSOPHY_FACTS,
    "psychology": PSYCHOLOGY_FACTS,
    "tao_te_ching": TAO_TE_CHING_FACTS,
    "religion": RELIGION_FACTS,
    "sociology": SOCIOLOGY_FACTS,
    "civics": CIVICS_FACTS,
    "finance": FINANCE_FACTS,
    "law": LAW_FACTS,
    "language": LANGUAGE_FACTS,
    "math": MATH_FACTS,
    "astronomy": ASTRONOMY_FACTS,
    "physics": PHYSICS_FACTS,
    "chemistry": CHEMISTRY_FACTS,
    "earth_sciences": EARTH_SCIENCES_FACTS,
    "biology": BIOLOGY_FACTS,
    "health": HEALTH_FACTS,
    "engineering": ENGINEERING_FACTS,
    "agriculture": AGRICULTURE_FACTS,
    "business": BUSINESS_FACTS,
    "trades": TRADES_FACTS,
    "art": ART_FACTS,
    "music": MUSIC_FACTS,
    "literature": LITERATURE_FACTS,
    "poetry": POETRY_FACTS,
    "history": HISTORY_FACTS,
    "geography": GEOGRAPHY_FACTS,
}


def clean_text_for_progen(topic: str, comment: str) -> Tuple[str, str]:
    """Clean markdown artifacts, LaTeX symbols, and formatting for strict Progen iron."""
    # Clean topic
    top = re.sub(r"\[.*?\]|\(.*?\)", "", topic).strip()
    top = re.sub(r"[*_`]", "", top).strip()
    top = re.sub(r"^[0-9]+\.\s*", "", top).strip()
    top = re.sub(r"[:—\-.\?!]+$", "", top).strip()
    top = re.sub(r"\s+", " ", top).strip()
    top = top.lower()

    # Clean comment
    com = re.sub(r"[*_`]", "", comment).strip()
    com = re.sub(r"\$\$(.*?)\$\$", r"\1", com).strip()
    com = re.sub(r"\$(.*?)\$", r"\1", com).strip()
    com = re.sub(r"\\mathbf\{([^}]+)\}", r"\1", com).strip()
    com = re.sub(r"\\text\{([^}]+)\}", r"\1", com).strip()
    com = re.sub(r"\\implies", "yields", com).strip()
    com = re.sub(r"\\rightarrow", "leads to", com).strip()
    com = re.sub(r"\s+", " ", com).strip()
    if not com.endswith("."):
        com += "."
    return top, com


def extract_doors_from_link_index(link_index_text: str) -> List[Tuple[str, str]]:
    """Extract (topic/label, url) pairs from LINK_INDEX.md."""
    doors = []
    # Pattern 1: Table format | label | query | url | or | label | authority | url |
    table_matches = re.findall(
        r"\|\s*([^|\n]+?)\s*\|\s*([^|\n]+?)\s*\|\s*(https?://[^\s|\n]+)\s*\|",
        link_index_text
    )
    for tm in table_matches:
        label = tm[0].strip().replace("*", "")
        url = tm[2].strip()
        doors.append((label, url))

    # Pattern 2: Numbered format: 1. **label** — description \n https://...
    list_matches = re.findall(
        r"\d+\.\s+\*\*([^*]+)\*\*[^\n]*\n\s*(https?://\S+)",
        link_index_text
    )
    for lm in list_matches:
        label = lm[0].strip()
        url = lm[1].strip()
        doors.append((label, url))

    # Pattern 3: Fallback line matches for https://
    if not doors:
        url_matches = re.findall(r"(https?://\S+)", link_index_text)
        for u in url_matches:
            doors.append(("Official Door", u.rstrip(".,;)>]\"'")))

    return doors


def get_all_facts(stacks_dir: Path | str) -> Dict[str, List[Fact]]:
    """Return complete list of verified facts per pack, combining curated and textbook mined facts."""
    stacks_path = Path(stacks_dir)
    packs_meta = json.loads((stacks_path / "PACKS.json").read_text(encoding="utf-8"))
    meta_by_slug = {p["slug"]: p for p in packs_meta}

    all_packs: Dict[str, List[Fact]] = {}

    for slug, curated_list in CURATED_PACKS.items():
        meta = meta_by_slug.get(slug, {})
        dewey = meta.get("dewey", "000")
        link_file = stacks_path / slug / "LINK_INDEX.md"
        doors = []
        if link_file.exists():
            doors = extract_doors_from_link_index(link_file.read_text(encoding="utf-8"))
        fallback_door = doors[0][1] if doors else "https://en.wikipedia.org/"

        # Start with curated list
        fact_list = list(curated_list)

        # In addition, scan textbook for structured chapter definitions to maximize fact coverage
        tb_file = stacks_path / slug / "TEXTBOOK.md"
        if tb_file.exists():
            tb_lines = tb_file.read_text(encoding="utf-8").splitlines()
            current_chapter = "chapter 1.1"
            existing_topics = {f.topic.lower() for f in fact_list}

            for line in tb_lines:
                line_str = line.strip()
                if line_str.startswith("### "):
                    current_chapter = line_str.replace("### ", "").strip().lower()
                    continue

                # Pattern: Numbered or Bullet bold list item
                m = re.match(r"^(?:[0-9]+\.|[-*])\s+\*\*([^*:]+)(?:\*\*:|\:\*\*|\*\*)\s*(.+)$", line_str)
                if m:
                    raw_topic = m.group(1).strip()
                    raw_comment = m.group(2).strip()

                    clean_topic, clean_comment = clean_text_for_progen(raw_topic, raw_comment)

                    # Strict validation for high-quality fact inclusion
                    if (
                        2 <= len(clean_topic.split()) <= 6
                        and len(clean_topic) >= 4
                        and not clean_topic.startswith("http")
                        and not clean_topic.startswith("table of contents")
                        and clean_topic not in existing_topics
                        and len(clean_comment) >= 20
                        and not clean_comment.startswith("http")
                    ):
                        existing_topics.add(clean_topic)

                        # Match most specific door from LINK_INDEX or fallback
                        matched_door = fallback_door
                        for d_label, d_url in doors:
                            if any(w in d_label.lower() for w in clean_topic.split() if len(w) > 3):
                                matched_door = d_url
                                break

                        fact_list.append(
                            Fact(
                                topic=clean_topic,
                                comment=clean_comment,
                                dewey=dewey,
                                slug=slug,
                                chapter=current_chapter,
                                door=matched_door,
                                kind="topic_comment",
                            )
                        )

        all_packs[slug] = fact_list

    return all_packs
