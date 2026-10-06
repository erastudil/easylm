# SPDX-License-Identifier: AGPL-3.0-or-later
"""Common data structures and helper utilities for Progen facts generation."""

from __future__ import annotations
from dataclasses import dataclass
from typing import Optional


import re


@dataclass
class Fact:
    topic: str
    comment: str
    dewey: str
    slug: str
    chapter: str
    door: str
    kind: str = "topic_comment"  # "definition" (=) or "topic_comment" (:)

    def to_progen(self) -> str:
        mark = "=" if self.kind == "definition" else ":"
        
        # Clean topic: no parens, no trailing punctuation, no marketing tell words
        topic_clean = re.sub(r"[()]", "", self.topic).strip()
        topic_clean = re.sub(r"[:—\-.\?!]+$", "", topic_clean).strip()
        topic_clean = re.sub(r"\bleverage\b", "multiplier", topic_clean, flags=re.I)
        
        # Clean comment: no parens, normalize spaces, replace colons to avoid packed topics, end with period
        comment_clean = re.sub(r"[()]", "", self.comment).strip()
        comment_clean = re.sub(r"^(?:is|are|was|were)\s+", "", comment_clean, flags=re.I).strip()
        comment_clean = re.sub(r":\s*", " - ", comment_clean)
        comment_clean = re.sub(r"\bleverage\b", "yield", comment_clean, flags=re.I)
        comment_clean = re.sub(r"\brobust\b", "durable", comment_clean, flags=re.I)
        comment_clean = re.sub(r"\bvise\b", "clamp", comment_clean, flags=re.I)
        comment_clean = re.sub(r"\b(end|face)\s+mill\b", r"\1 cutter", comment_clean, flags=re.I)
        comment_clean = re.sub(r"\bdry\s+milling\b", "dry machining", comment_clean, flags=re.I)
        comment_clean = re.sub(r"\s+", " ", comment_clean).strip()
        if not comment_clean.endswith("."):
            comment_clean += "."


        # Clean chapter ref: no parens, no dots before spaces, no colons, no shop latch triggers
        ref_clean = re.sub(r"[():]", " ", self.chapter).strip()
        ref_clean = re.sub(r"\.(?=\s)", "", ref_clean).strip().strip(".")
        ref_clean = re.sub(r"\b(lathe|mill)\b", "turning", ref_clean, flags=re.I)
        ref_clean = re.sub(r"\s+", " ", ref_clean).strip()

        # Format as standard Progen unit with door and ref asides
        door_aside = f"// door {self.door.strip()}" if self.door else ""
        ref_aside = f"// ref {ref_clean}" if ref_clean else ""
        asides_str = f"{door_aside} {ref_aside}".strip()
        if asides_str:
            return f"{topic_clean} {mark} {comment_clean} {asides_str}"
        return f"{topic_clean} {mark} {comment_clean}"

