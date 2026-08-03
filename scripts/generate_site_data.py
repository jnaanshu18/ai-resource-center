#!/usr/bin/env python3
"""Regenerate docs/data.js from data/ai_tools_directory.csv and
data/reference_lists.csv.

Run this after editing the CSVs (or re-exporting them from the Google
Sheet), then commit + push. GitHub Pages serves docs/ directly, so the
site updates on the next push with no other build step.

Usage:
    python3 scripts/generate_site_data.py
"""
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TOOLS_CSV = ROOT / "data" / "ai_tools_directory.csv"
REFERENCE_CSV = ROOT / "data" / "reference_lists.csv"
OUT_PATH = ROOT / "docs" / "data.js"


def load_tools():
    with TOOLS_CSV.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return [
            {
                "id": row["Tool ID"],
                "name": row["Tool Name"],
                "category": row["Category"],
                "status": row["Status"],
                "url": row["URL"],
                "description": row["Description"],
                "notes": row.get("Notes") or "",
            }
            for row in reader
            if row.get("Tool ID")
        ]


def load_categories():
    categories = []
    with REFERENCE_CSV.open(newline="", encoding="utf-8") as f:
        reader = csv.reader(f)
        next(reader, None)  # header row: "List Name,Value"
        for row in reader:
            if len(row) >= 2 and row[0] == "Categories" and row[1]:
                categories.append(row[1])
    return categories


def main():
    tools = load_tools()
    categories = load_categories()

    js = "// Auto-generated from data/ai_tools_directory.csv and data/reference_lists.csv — do not edit by hand.\n"
    js += "const TOOLS = " + json.dumps(tools, indent=2, ensure_ascii=False) + ";\n"
    js += "const CATEGORIES = " + json.dumps(categories, indent=2, ensure_ascii=False) + ";\n"

    OUT_PATH.write_text(js, encoding="utf-8")
    print(f"Wrote {len(tools)} tools and {len(categories)} categories to {OUT_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    main()

