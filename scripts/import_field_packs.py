"""Copy public field-kb textbooks into EasyLM warehouse and strip house paths."""
from pathlib import Path
import re

SRC = Path(r"C:\Users\jpm05\documents\field\field-kb\warehouse\undergrad")
DST = Path(r"C:\Users\jpm05\documents\hnai\easylm\warehouse")

# House-contaminated: rewrite, do not copy.
COPY = [
    "math",
    "physics",
    "chemistry",
    "biology",
    "philosophy",
    "methods",
    "history",
    "civics",
    "geography",
    "health",
    "agriculture",
    "weather",
    "art",
    "music",
    "literature",
    "engineering",
    "finance",
    "law",
    "computing",
]


def sanitize(text: str, slug: str) -> str:
    text = re.sub(
        r'home:\s*"[^"]+"',
        f'home: "warehouse/{slug}/"',
        text,
        count=1,
    )
    text = text.replace("field/field-kb/warehouse/undergrad/", "warehouse/")
    text = text.replace("field/field-kb/warehouse/", "warehouse/")
    text = text.replace("house-mcp **calc**", "EasyLM **calc** hand")
    text = text.replace("house-mcp **units**", "EasyLM **units** hand")
    text = text.replace("house-mcp", "EasyLM")
    text = text.replace("`mcp/CALC.md`", "the EasyLM calc hand")
    text = text.replace("`mcp/UNITS.md`", "the EasyLM units hand")
    text = text.replace("mcp/CALC.md", "EasyLM calc hand")
    text = text.replace("mcp/UNITS.md", "EasyLM units hand")
    text = text.replace("../../meta/FETCH_AND_CITE.md", "warehouse/LAW.md")
    text = text.replace("../tools/", "EasyLM calc and units hands")
    # drop house-only related pointers that would 404 in this repo
    text = re.sub(r'\n  - "\.\./eee/"', "", text)
    text = re.sub(r'\n  - "\.\./docker/"', "", text)
    text = re.sub(r'\n  - "\.\./ollama/"', "", text)
    text = re.sub(r'\n  - "\.\./linux_os/"', "", text)
    text = re.sub(r'\n  - "\.\./mcp/"', "", text)
    text = re.sub(r'\n  - "../../stack/INVENTORY.md"', "", text)
    text = re.sub(r'\n  - "langs/"', "", text)
    return text


def main() -> None:
    for slug in COPY:
        src = SRC / slug
        dst = DST / slug
        dst.mkdir(parents=True, exist_ok=True)
        for name in ("TEXTBOOK.md", "LINK_INDEX.md"):
            f = src / name
            if not f.exists():
                raise SystemExit(f"missing {f}")
            out = sanitize(f.read_text(encoding="utf-8"), slug)
            (dst / name).write_text(out, encoding="utf-8")
            print(f"wrote {dst / name} ({len(out.splitlines())} lines)")


if __name__ == "__main__":
    main()
