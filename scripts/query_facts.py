# SPDX-License-Identifier: AGPL-3.0-or-later
"""CLI query tool for the Progen Fact Database.

Enables instant lookup of verified facts by topic assertion, Dewey classification,
subject slug, or BM25 full-text search across all 31 EasyLM stacks.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import sys

# Ensure UTF-8 output on Windows consoles
if sys.stdout and hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

REPO_ROOT = Path(__file__).resolve().parents[3]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))
PROGEN_SRC = REPO_ROOT / "progen" / "src"
if str(PROGEN_SRC) not in sys.path:
    sys.path.insert(0, str(PROGEN_SRC))

from progen.db import ProgenDB


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Query the EasyLM Progen Fact Database."
    )
    default_db = REPO_ROOT / "hnai" / "easylm" / "stacks" / "stacks_facts.db"
    parser.add_argument(
        "--db",
        type=str,
        default=str(default_db),
        help=f"Path to SQLite ProgenDB (default: {default_db})",
    )
    parser.add_argument(
        "-s", "--search",
        type=str,
        help="BM25 full-text search query across topic, comment, and asides",
    )
    parser.add_argument(
        "-t", "--topic",
        type=str,
        help="Filter by topic (exact match or wildcard with *)",
    )
    parser.add_argument(
        "-f", "--fact",
        type=str,
        help="Fast cached lookup for exact topic assertion via db.fact()",
    )
    parser.add_argument(
        "-d", "--dewey",
        type=str,
        help="Filter by Dewey classification code or range (e.g. 530, 500*, 500-599)",
    )
    parser.add_argument(
        "--slug",
        type=str,
        help="Filter by subject slug (e.g. physics, law, software, computing)",
    )
    parser.add_argument(
        "--kind",
        type=str,
        choices=["definition", "topic_comment", "elevated", "test"],
        help="Filter by unit kind",
    )
    parser.add_argument(
        "-l", "--limit",
        type=int,
        default=25,
        help="Maximum results to return (default: 25)",
    )
    parser.add_argument(
        "--offset",
        type=int,
        default=0,
        help="Result offset for pagination (default: 0)",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        help="Output results in JSON format",
    )
    parser.add_argument(
        "--count",
        action="store_true",
        help="Print only the count of matching units",
    )

    args = parser.parse_args()
    db_path = Path(args.db)
    if not db_path.is_file():
        # Fallback to runtime db if default not found
        fallback = REPO_ROOT / "hnai" / "easylm" / "data" / "facts.db"
        if fallback.is_file():
            db_path = fallback
        else:
            sys.stderr.write(f"ERROR: Database not found: {args.db}\n")
            sys.exit(1)

    db = ProgenDB(db_path)

    # 1. Fast exact fact lookup
    if args.fact:
        val = db.fact(args.fact)
        if args.json:
            print(json.dumps({"topic": args.fact, "result": val}))
        elif val:
            print(val)
        else:
            print(f"NOT_FOUND: {args.fact}")
        db.close()
        return

    # 2. Map slug to source_uri filter if requested
    source_uri_filter = None
    if args.slug:
        source_uri_filter = f"/{args.slug}/"

    # 3. Query units
    limit = 100000 if args.count else args.limit
    results = db.query(
        topic=args.topic,
        dewey_code=args.dewey,
        kind=args.kind,
        source_uri=source_uri_filter,
        search=args.search,
        limit=limit,
        offset=args.offset,
    )


    if args.count:
        print(len(results))
        db.close()
        return

    if args.json:
        out = [
            {
                "id": r.id,
                "dewey": r.dewey_code,
                "slug": r.dewey_slug,
                "kind": r.kind,
                "topic": r.topic,
                "comment": r.comment,
                "asides": r.asides,
                "source": r.source_uri,
            }
            for r in results
        ]
        print(json.dumps(out, indent=2))
        db.close()
        return

    # 4. Standard human/agent readable Progen Iron output
    if not results:
        print("NO_RESULTS")
        db.close()
        return

    for r in results:
        dewey_str = f"[{r.dewey_code}]" if r.dewey_code else "[---]"
        print(f"{dewey_str} {r.to_markdown()}")

    db.close()


if __name__ == "__main__":
    main()
