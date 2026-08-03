#!/usr/bin/env python3
"""Regenerate docs/data.js from data/ai_tools_directory.csv.

Run this after editing the CSV (or re-exporting it from the Google Sheet),
then commit + push. GitHub Pages serves docs/ directly, so the site updates
on the next push with no other build step.

Usage:
    python3 scripts/generate_site_data.py
"""
import csv
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CSV_PATH = ROOT / "data" / "ai_tools_directory.csv"
OUT_PATH = ROOT / "docs" / "data.js"


def main():
    with CSV_PATH.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        tools = [
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

    js = "// Auto-generated from data/ai_tools_directory.csv — do not edit by hand.\n"
    js += "const TOOLS = " + json.dumps(tools, indent=2, ensure_ascii=False) + ";\n"

    OUT_PATH.write_text(js, encoding="utf-8")
    print(f"Wrote {len(tools)} tools to {OUT_PATH.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
