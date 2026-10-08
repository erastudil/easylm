# SPDX-License-Identifier: AGPL-3.0-or-later
"""Automated test suite for the EasyLM Progen Fact Database.

Verifies:
1. Coverage across all 31 academic packs in PACKS.json.
2. Dialect conformance (0 lint errors via progen.lint.lint_text).
3. SQLite database integrity, Dewey classification coverage, and aside links.
4. FTS5 full-text indexing and retrieval across all disciplines.
5. Query CLI functionality and JSON output.
"""

from __future__ import annotations

import json
from pathlib import Path
import subprocess
import sys
import unittest

REPO_ROOT = Path(__file__).resolve().parents[3]
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))
PROGEN_SRC = REPO_ROOT / "progen" / "src"
if str(PROGEN_SRC) not in sys.path:
    sys.path.insert(0, str(PROGEN_SRC))

from progen.db import ProgenDB
from progen.lint import lint_text
from progen.parse import parse_text, Role


class TestStacksFacts(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.stacks_dir = REPO_ROOT / "hnai" / "easylm" / "stacks"
        cls.db_path = cls.stacks_dir / "stacks_facts.db"
        cls.runtime_db = REPO_ROOT / "hnai" / "easylm" / "data" / "facts.db"
        cls.progen_db = REPO_ROOT / "progen" / "data" / "stacks_facts.db"
        cls.packs_meta = json.loads((cls.stacks_dir / "PACKS.json").read_text(encoding="utf-8"))

    def test_all_32_subjects_have_facts_md(self):
        """Every subject pack in PACKS.json must contain a non-empty FACTS.md."""
        self.assertEqual(len(self.packs_meta), 32)
        for p in self.packs_meta:
            slug = p["slug"]
            facts_file = self.stacks_dir / slug / "FACTS.md"
            self.assertTrue(facts_file.is_file(), f"Missing FACTS.md for {slug}")
            content = facts_file.read_text(encoding="utf-8").strip()
            self.assertGreater(len(content), 100, f"FACTS.md for {slug} is empty or too short")

    def test_all_facts_files_pass_progen_linter(self):
        """Every FACTS.md must pass progen.lint.lint_text with 0 errors and 0 warnings."""
        total_findings = 0
        for p in self.packs_meta:
            slug = p["slug"]
            facts_file = self.stacks_dir / slug / "FACTS.md"
            content = facts_file.read_text(encoding="utf-8")
            findings = lint_text(content, role="agent")
            if findings:
                for f in findings:
                    print(f"Linter Finding in {slug}:{f.line} [{f.rule}] {f.title} ({f.excerpt})")
                total_findings += len(findings)
        self.assertEqual(total_findings, 0, f"Total linter findings across packs: {total_findings}")

    def test_all_facts_parse_progen_iron(self):
        """Every unit in FACTS.md must parse into a valid Iron unit with topic and comment."""
        for p in self.packs_meta:
            slug = p["slug"]
            facts_file = self.stacks_dir / slug / "FACTS.md"
            content = facts_file.read_text(encoding="utf-8")
            doc = parse_text(content, role=Role.SYNTAX)
            units = [u for u in doc.units if u.topic]
            self.assertGreaterEqual(len(units), 20, f"Expected at least 20 units in {slug}, got {len(units)}")
            for u in units:
                self.assertIsNotNone(u.topic)
                self.assertGreater(len(u.topic.strip()), 0)
                self.assertIsNotNone(u.comment)
                self.assertGreater(len(u.comment.strip()), 0)

    def test_database_files_exist_and_healthy(self):
        """Database files in stacks, runtime data, and progen data must exist and pass integrity check."""
        for path in [self.db_path, self.runtime_db, self.progen_db]:
            self.assertTrue(path.is_file(), f"Missing database file at {path}")
            db = ProgenDB(path)
            cur = db.conn.cursor()
            cur.execute("PRAGMA integrity_check;")
            status = cur.fetchone()[0]
            self.assertEqual(status, "ok", f"Integrity check failed for {path}")
            db.close()

    def test_database_metrics_and_dewey_coverage(self):
        """Database must have >= 1,500 units, 31 unique Dewey codes, and 0 unclassified units."""
        db = ProgenDB(self.db_path)
        cur = db.conn.cursor()

        cur.execute("SELECT COUNT(*) as count FROM units;")
        total_units = cur.fetchone()["count"]
        self.assertGreaterEqual(total_units, 1500, f"Expected at least 1,500 units, found {total_units}")

        cur.execute("SELECT COUNT(DISTINCT dewey_code) as dewey_count FROM units;")
        dewey_count = cur.fetchone()["dewey_count"]
        self.assertEqual(dewey_count, 32, f"Expected 32 Dewey classes in units, found {dewey_count}")

        cur.execute("SELECT COUNT(*) as unclassified FROM units WHERE dewey_code IS NULL;")
        unclassified = cur.fetchone()["unclassified"]
        self.assertEqual(unclassified, 0, f"Found {unclassified} unclassified units")

        cur.execute("SELECT COUNT(*) as asides_count FROM asides;")
        asides_count = cur.fetchone()["asides_count"]
        self.assertEqual(asides_count, total_units, "Every unit must have associated citation/ref asides")

        db.close()

    def test_fts5_search_multi_disciplinary(self):
        """FTS5 search must return relevant hits across all major disciplines."""
        db = ProgenDB(self.db_path)
        queries = {
            "computing": ["algorithm", "turing", "cryptography"],
            "philosophy": ["realism", "epistemology", "tao"],
            "sciences": ["entropy", "quantum", "mitochondria"],
            "social": ["constitution", "precedent", "marx"],
            "arts": ["harmonic", "sonnet", "color", "perspective"],
        }
        for category, terms in queries.items():
            for term in terms:
                results = db.query(search=term, limit=10)
                self.assertGreater(
                    len(results), 0, f"Expected FTS5 hits for '{term}' in category '{category}'"
                )
                first = results[0]
                self.assertTrue(
                    term.lower() in first.topic.lower()
                    or term.lower() in first.comment.lower()
                    or any(term.lower() in a.lower() for a in first.asides),
                    f"Search term '{term}' not found in top result fields",
                )
        db.close()

    def test_topic_lookup_and_fact_store(self):
        """ProgenDB should support exact topic lookup and alphanumeric fact storage."""
        # Test unit retrieval by exact topic from production database
        db = ProgenDB(self.db_path)
        units = db.query(topic="church turing thesis")
        self.assertEqual(len(units), 1)
        self.assertEqual(units[0].topic, "church turing thesis")
        self.assertEqual(units[0].dewey_code, "004")
        db.close()

        # Test put_fact / fact alphanumeric key-value store in isolated DB
        mem_db = ProgenDB(":memory:")
        uid = mem_db.put_fact("chemical water symbol", "h2o")
        self.assertIsNotNone(uid)
        fact_val = mem_db.fact("chemical water symbol")
        self.assertEqual(fact_val, "chemical water symbol: h2o")
        mem_db.close()



    def test_query_facts_cli(self):
        """CLI tool query_facts.py should run cleanly and support queries, count, and JSON output."""
        cli_script = REPO_ROOT / "hnai" / "easylm" / "scripts" / "query_facts.py"

        # 1. Total count
        cmd_count = [sys.executable, str(cli_script), "--count"]
        res_count = subprocess.run(cmd_count, capture_output=True, text=True, check=True)
        count_val = int(res_count.stdout.strip())
        self.assertGreaterEqual(count_val, 1500)

        # 2. Search query
        cmd_search = [sys.executable, str(cli_script), "--search", "thermodynamics", "--limit", "3"]
        res_search = subprocess.run(cmd_search, capture_output=True, text=True, check=True)
        self.assertIn("[530]", res_search.stdout)

        # 3. JSON output
        cmd_json = [sys.executable, str(cli_script), "--slug", "physics", "--limit", "2", "--json"]
        res_json = subprocess.run(cmd_json, capture_output=True, text=True, check=True)
        data = json.loads(res_json.stdout)
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]["dewey"], "530")

    def test_facts_index_master_catalogue_exists(self):
        """FACTS_INDEX.md must exist and link to all 31 subjects."""
        index_file = self.stacks_dir / "FACTS_INDEX.md"
        self.assertTrue(index_file.is_file(), "FACTS_INDEX.md is missing")
        text = index_file.read_text(encoding="utf-8")
        self.assertIn("Master Dewey Taxonomy", text)
        for p in self.packs_meta:
            slug = p["slug"]
            self.assertIn(f"[`{slug}`]({slug}/FACTS.md)", text)


if __name__ == "__main__":
    unittest.main()
