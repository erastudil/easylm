# Progen Fact Database — EasyLM Stacks Master Catalogue

Canonical offline relational and full-text indexed store of verified academic facts,
definitions, laws, theorems, and constants mirrored directly from textbook references and link doors.

## Summary Metrics

- **Total Subjects**: 32 academic stacks (001 through 910)
- **Total Verified Facts**: 1,615 units
- **Total Citation Doors & References**: 1,615 asides
- **Dialect**: Strict Progen Iron (`topic = comment.` and `topic : comment.`)
- **Storage Engine**: Zero-rent SQLite with WAL mode, Dewey indexes, and FTS5 full-text triggers
- **Linter Status**: 0 errors, 0 warnings across all files

## Master Dewey Taxonomy & Unit Distribution

| Dewey | Slug | Subject Title | Facts | Primary Reference Door |
|:---|:---|:---|---:|:---|
| `001` | [`methods`](methods/FACTS.md) | Scientific Method & Inquiry | 73 | [https://plato.stanford.edu/entries/scientific-method/](https://plato.stanford.edu/entries/scientific-method/) |
| `004` | [`computing`](computing/FACTS.md) | Computing & Computer Systems | 83 | [https://plato.stanford.edu/entries/turing-machine/](https://plato.stanford.edu/entries/turing-machine/) |
| `005` | [`software`](software/FACTS.md) | Software Engineering & Architecture | 30 | [https://standards.ieee.org/](https://standards.ieee.org/) |
| `005.8` | [`security`](security/FACTS.md) | Information Security & Cryptography | 84 | [https://csrc.nist.gov/](https://csrc.nist.gov/) |
| `006` | [`ai_ml`](ai_ml/FACTS.md) | Artificial Intelligence & Machine Learning | 40 | [https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/](https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/) |
| `100` | [`philosophy`](philosophy/FACTS.md) | Philosophy, Logic & Epistemology | 85 | [https://plato.stanford.edu/entries/argument/](https://plato.stanford.edu/entries/argument/) |
| `150` | [`psychology`](psychology/FACTS.md) | Psychology & Cognitive Science | 50 | [https://www.ncbi.nlm.nih.gov/books/NBK538339/](https://www.ncbi.nlm.nih.gov/books/NBK538339/) |
| `181` | [`tao_te_ching`](tao_te_ching/FACTS.md) | Tao Te Ching (道德經) — Lao Tzu | 28 | [https://ctext.org/dao-de-jing](https://ctext.org/dao-de-jing) |
| `200` | [`religion`](religion/FACTS.md) | Comparative Religion & Mythology | 37 | [https://plato.stanford.edu/entries/philosophy-religion/](https://plato.stanford.edu/entries/philosophy-religion/) |
| `300` | [`sociology`](sociology/FACTS.md) | Sociology & Cultural Anthropology | 48 | [https://plato.stanford.edu/entries/durkheim/](https://plato.stanford.edu/entries/durkheim/) |
| `302.23` | [`media`](media/FACTS.md) | Media, Social Platforms & Information Disorders | 35 | [https://www.ftc.gov/](https://www.ftc.gov/) |
| `320` | [`civics`](civics/FACTS.md) | Civics & Political Science | 71 | [https://www.archives.gov/founding-docs/constitution](https://www.archives.gov/founding-docs/constitution) |
| `330` | [`finance`](finance/FACTS.md) | Finance & Macroeconomics | 51 | [https://www.sec.gov/](https://www.sec.gov/) |
| `340` | [`law`](law/FACTS.md) | Law & Jurisprudence | 68 | [https://www.law.cornell.edu/wex/common_law](https://www.law.cornell.edu/wex/common_law) |
| `400` | [`language`](language/FACTS.md) | Language & Linguistics | 41 | [https://plato.stanford.edu/entries/linguistics/](https://plato.stanford.edu/entries/linguistics/) |
| `510` | [`math`](math/FACTS.md) | Mathematics & Analysis | 61 | [https://plato.stanford.edu/entries/peano/](https://plato.stanford.edu/entries/peano/) |
| `520` | [`astronomy`](astronomy/FACTS.md) | Astronomy & Astrophysics | 45 | [https://ssd.jpl.nasa.gov/](https://ssd.jpl.nasa.gov/) |
| `530` | [`physics`](physics/FACTS.md) | Physics & Classical/Quantum Mechanics | 40 | [https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/](https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/) |
| `540` | [`chemistry`](chemistry/FACTS.md) | Chemistry & Molecular Systems | 51 | [https://physics.nist.gov/cuu/Constants/](https://physics.nist.gov/cuu/Constants/) |
| `550` | [`earth_sciences`](earth_sciences/FACTS.md) | Earth Sciences & Planetary Systems | 48 | [https://www.usgs.gov/](https://www.usgs.gov/) |
| `570` | [`biology`](biology/FACTS.md) | Biology & Life Sciences | 69 | [https://openstax.org/details/books/biology-2e](https://openstax.org/details/books/biology-2e) |
| `610` | [`health`](health/FACTS.md) | Health & Human Physiology | 78 | [https://www.nih.gov/](https://www.nih.gov/) |
| `620` | [`engineering`](engineering/FACTS.md) | Engineering Mechanics & Systems | 37 | [https://ocw.mit.edu/courses/mechanical-engineering/](https://ocw.mit.edu/courses/mechanical-engineering/) |
| `630` | [`agriculture`](agriculture/FACTS.md) | Agriculture & Agronomy | 31 | [https://www.nrcs.usda.gov/](https://www.nrcs.usda.gov/) |
| `650` | [`business`](business/FACTS.md) | Business Administration & Management | 65 | [https://www.nobelprize.org/prizes/economic-sciences/1991/coase/facts/](https://www.nobelprize.org/prizes/economic-sciences/1991/coase/facts/) |
| `690` | [`trades`](trades/FACTS.md) | Skilled Trades & Precision Fabrication | 53 | [https://www.mmsonline.com/](https://www.mmsonline.com/) |
| `700` | [`art`](art/FACTS.md) | Art & Visual Design | 35 | [https://www.metmuseum.org/toah/](https://www.metmuseum.org/toah/) |
| `780` | [`music`](music/FACTS.md) | Music Theory & Acoustics | 33 | [https://www.iso.org/standard/3601.html](https://www.iso.org/standard/3601.html) |
| `800` | [`literature`](literature/FACTS.md) | Literature & Rhetoric | 32 | [https://plato.stanford.edu/entries/aristotle-rhetoric/](https://plato.stanford.edu/entries/aristotle-rhetoric/) |
| `811` | [`poetry`](poetry/FACTS.md) | Poetry & Poetics | 23 | [https://www.poetryfoundation.org/learn/glossary-terms/meter](https://www.poetryfoundation.org/learn/glossary-terms/meter) |
| `900` | [`history`](history/FACTS.md) | World History & Historiography | 55 | [https://www.historians.org/](https://www.historians.org/) |
| `910` | [`geography`](geography/FACTS.md) | Geography & Human Demography | 35 | [https://www.usgs.gov/](https://www.usgs.gov/) |

## Database Schema Architecture

The compiled database (`stacks_facts.db`, mirrored to `data/facts.db` and `progen/data/stacks_facts.db`)
uses the zero-rent ProgenDB schema:

```sql
-- Core unit assertions
CREATE TABLE units (
    id TEXT PRIMARY KEY,                 -- SHA-256 hash of uri:line:topic:comment
    source_id INTEGER NOT NULL,          -- Foreign key to sources(id)
    line_no INTEGER NOT NULL,            -- Source line number
    kind TEXT NOT NULL,                  -- 'definition' or 'topic_comment'
    mark TEXT,                           -- '=' or ':'
    topic TEXT NOT NULL,                 -- Canonical assertion topic
    comment TEXT NOT NULL,               -- Verified factual statement
    dewey_code TEXT,                     -- Dewey Decimal classification code
    parent_unit_id TEXT,                 -- Parent unit hierarchy
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (source_id) REFERENCES sources(id) ON DELETE CASCADE,
    FOREIGN KEY (dewey_code) REFERENCES dewey_classes(code) ON DELETE SET NULL
);

-- Asides storing citation doors and chapter references
CREATE TABLE asides (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    unit_id TEXT NOT NULL,               -- Foreign key to units(id)
    text TEXT NOT NULL,                  -- 'door <url> // ref <chapter>'
    line_no INTEGER NOT NULL,
    FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE
);

-- FTS5 virtual table synchronized automatically via SQLite triggers
CREATE VIRTUAL TABLE units_fts USING fts5(
    unit_id UNINDEXED,
    topic,
    comment,
    dewey_code UNINDEXED,
    asides_text
);
```

## Query Usage Examples

### 1. Command-Line Fact Lookup
```bash
# Search facts via BM25 full-text search
python hnai/easylm/scripts/query_facts.py --search "quantum superposition"

# Query exact topic assertion
python hnai/easylm/scripts/query_facts.py --topic "algorithm"

# Filter by Dewey classification range
python hnai/easylm/scripts/query_facts.py --dewey "500-599" --limit 20

# Filter by subject slug
python hnai/easylm/scripts/query_facts.py --slug "physics"
```

### 2. Python Programmatic Querying
```python
from progen.db import ProgenDB

db = ProgenDB("hnai/easylm/stacks/stacks_facts.db")

# Fast cached topic assertion
fact_line = db.fact("scientific method")
print(fact_line)

# Full-text search
results = db.query(search="conservation of energy", limit=5)
for u in results:
    print(f"[{u.dewey_code}] {u.to_markdown()}")
```

---
*Compiled with zero rent. Grounded in primary academic references.*
