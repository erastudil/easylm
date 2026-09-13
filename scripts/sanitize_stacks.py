from pathlib import Path

root = Path(__file__).resolve().parents[1] / "stacks"
count = 0
for f in root.rglob("*.md"):
    text = f.read_text(encoding="utf-8")
    orig = text
    text = text.replace("field/field-kb/warehouse/undergrad/", "stacks/")
    text = text.replace("field-kb/warehouse/undergrad/", "stacks/")
    text = text.replace("field/field-kb/warehouse/", "stacks/")
    text = text.replace("warehouse/meta/FETCH_AND_CITE.md", "stacks/LAW.md")
    text = text.replace("../../meta/FETCH_AND_CITE.md", "stacks/LAW.md")
    text = text.replace("warehouse/", "stacks/")
    text = text.replace("this warehouse", "The Stacks")
    text = text.replace("the warehouse", "The Stacks")
    if text != orig:
        f.write_text(text, encoding="utf-8")
        count += 1
print(f"Updated {count} markdown files in stacks")
