#!/usr/bin/env python3
"""Regenerate docs/data.js from the AI Resource Center CSVs.

Sources:
  - data/ai_tools_directory.csv
  - data/reference_lists.csv
  - data/tool_comparison.csv
  - data/tool_evaluation.csv

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
COMPARISON_CSV = ROOT / "data" / "tool_comparison.csv"
EVALUATION_CSV = ROOT / "data" / "tool_evaluation.csv"
OUT_PATH = ROOT / "docs" / "data.js"


def split_list(value):
    if not value:
        return []
    return [part.strip() for part in value.replace("|", ";").split(";") if part.strip()]


def load_tools():
    with TOOLS_CSV.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        tools = []
        for row in reader:
            if not row.get("Tool ID"):
                continue
            tools.append(
                {
                    "id": row["Tool ID"],
                    "name": row["Tool Name"],
                    "category": row.get("Category") or "",
                    "subcategory": row.get("Subcategory") or "",
                    "pricing": row.get("Pricing Model") or "",
                    "status": row.get("Status") or "",
                    "url": row.get("URL") or "",
                    "description": row.get("Description") or "",
                    "platform": split_list(row.get("Platform")),
                    "department": row.get("Department") or "",
                    "useCases": split_list(row.get("Use Cases")),
                    "learningCurve": row.get("Learning Curve") or "",
                    "priority": row.get("Priority") or "",
                    "dataClassification": row.get("Data Classification") or "",
                    "owner": row.get("Owner") or "",
                    "dateAdded": row.get("Date Added") or "",
                    "lastReviewed": row.get("Last Reviewed") or "",
                    "notes": row.get("Notes") or "",
                }
            )
        return tools


def load_categories():
    categories = []
    with REFERENCE_CSV.open(newline="", encoding="utf-8") as f:
        reader = csv.reader(f)
        next(reader, None)
        for row in reader:
            if len(row) >= 2 and row[0] == "Categories" and row[1]:
                categories.append(row[1])
    return categories


def load_comparisons():
    if not COMPARISON_CSV.exists():
        return []
    with COMPARISON_CSV.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return [
            {
                "feature": row.get("Feature") or "",
                "tools": [t for t in [row.get("Tool A"), row.get("Tool B"), row.get("Tool C")] if t],
                "winner": row.get("Winner") or "",
                "notes": row.get("Notes") or "",
            }
            for row in reader
            if row.get("Feature")
        ]


def load_evaluations():
    if not EVALUATION_CSV.exists():
        return {}
    evaluations = {}
    with EVALUATION_CSV.open(newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            name = (row.get("Tool Name") or "").strip()
            if not name:
                continue
            evaluations[name] = {
                "score": row.get("Score") or "",
                "criteria": row.get("Criteria") or "",
                "recommendation": row.get("Recommendation") or "",
                "date": row.get("Evaluation Date") or "",
                "notes": row.get("Notes") or "",
                "evaluator": row.get("Evaluator") or "",
            }
    return evaluations


def main():
    tools = load_tools()
    categories = load_categories()
    comparisons = load_comparisons()
    evaluations = load_evaluations()

    js = (
        "// Auto-generated from data/*.csv — do not edit by hand.\n"
        f"const TOOLS = {json.dumps(tools, indent=2, ensure_ascii=False)};\n"
        f"const CATEGORIES = {json.dumps(categories, indent=2, ensure_ascii=False)};\n"
        f"const COMPARISONS = {json.dumps(comparisons, indent=2, ensure_ascii=False)};\n"
        f"const EVALUATIONS = {json.dumps(evaluations, indent=2, ensure_ascii=False)};\n"
    )

    OUT_PATH.write_text(js, encoding="utf-8")
    print(
        f"Wrote {len(tools)} tools, {len(categories)} categories, "
        f"{len(comparisons)} comparisons, {len(evaluations)} evaluations "
        f"to {OUT_PATH.relative_to(ROOT)}"
    )


if __name__ == "__main__":
    main()
