from pathlib import Path
import json, re

root = Path(__file__).resolve().parents[1] / "warehouse"
packs = json.loads((root / "PACKS.json").read_text(encoding="utf-8"))
print("packs", len(packs))
doors = 0
for p in packs:
    tb = (root / p["slug"] / "TEXTBOOK.md").read_text(encoding="utf-8")
    li = (root / p["slug"] / "LINK_INDEX.md").read_text(encoding="utf-8")
    n = len(tb.splitlines())
    d = len(set(re.findall(r"https://[^\s)|>\]]+", li)))
    doors += d
    ch = len(re.findall(r"^## ", tb, re.M))
    print(f"{p['dewey']:>3} {p['slug']:<12} {n:4} lines  {ch:2} ch  {d:2} doors")
print("door urls", doors)
