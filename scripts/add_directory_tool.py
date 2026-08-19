#!/usr/bin/env python3
"""Add an approved tool to data/ai_tools_directory.csv from JSON (admin publish step).

Used after admin completes the in-site Directory form on Suggestions.

Usage:
  python scripts/add_directory_tool.py --json path/to/tool.json
  python scripts/add_directory_tool.py --json -   # stdin

JSON keys (camelCase or CSV column names):
  toolName, category, subcategory, pricing, status, url, videoUrl, description,
  platform (list or "Web; Desktop"), department, useCases, learningCurve, priority,
  dataClassification, owner, notes, limitations, whenToUse, alternatives,
  costNote, securityTip, approvedModels, link (submission URL for status sync)

Optional: --no-regenerate, --no-mark-submission
"""
from __future__ import annotations

import argparse
import csv
import json
import re
import subprocess
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DIR_CSV = ROOT / "data" / "ai_tools_directory.csv"
SUB_CSV = ROOT / "data" / "tool_submissions.csv"
GENERATE = ROOT / "scripts" / "generate_site_data.py"

DIRECTORY_FIELDS = [
    "Tool ID",
    "Tool Name",
    "Category",
    "Subcategory",
    "Pricing Model",
    "Status",
    "URL",
    "Tutorial Video",
    "Description",
    "Platform",
    "Department",
    "Use Cases",
    "Learning Curve",
    "Priority",
    "Data Classification",
    "Owner",
    "Date Added",
    "Last Reviewed",
    "Notes",
    "Limitations",
    "When to Use",
    "Alternatives",
    "Cost Note",
    "Security Tip",
    "Approved Models",
    "Assigned To",
    "Testing Notes",
]


def split_list(value) -> list[str]:
    if not value:
        return []
    if isinstance(value, list):
        return [str(v).strip() for v in value if str(v).strip()]
    return [part.strip() for part in str(value).replace("|", ";").split(";") if part.strip()]


def join_list(value) -> str:
    return "; ".join(split_list(value))


def pick(data: dict, *keys: str, default: str = "") -> str:
    for key in keys:
        if key in data and data[key] is not None and str(data[key]).strip():
            return str(data[key]).strip()
        for k, v in data.items():
            if k.lower() == key.lower() and v is not None and str(v).strip():
                return str(v).strip()
    return default


def next_tool_id(rows: list[dict]) -> str:
    max_n = 0
    for row in rows:
        tid = row.get("Tool ID") or ""
        m = re.match(r"AIT-(\d+)", str(tid).strip(), re.I)
        if m:
            max_n = max(max_n, int(m.group(1)))
    return f"AIT-{max_n + 1:03d}"


def normalize_link(link: str) -> str:
    return str(link or "").strip().rstrip("/").lower()


def mark_submission_approved(link: str, tool_name: str) -> bool:
    if not SUB_CSV.exists():
        return False
    with SUB_CSV.open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        fieldnames = list(reader.fieldnames or [])
        rows = list(reader)
    if not rows:
        return False
    link_key = normalize_link(link)
    name_key = tool_name.strip().lower()
    updated = False
    for row in rows:
        row_link = normalize_link(row.get("Link") or "")
        row_name = (row.get("Tool name") or row.get("Tool Name") or "").strip().lower()
        if (link_key and row_link == link_key) or (name_key and row_name == name_key):
            row["Status"] = "Approved"
            updated = True
    if not updated:
        return False
    with SUB_CSV.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)
    return True


def build_directory_row(data: dict, existing_rows: list[dict]) -> dict:
    today = date.today().isoformat()
    name = pick(data, "toolName", "Tool Name", "name")
    if not name:
        raise ValueError("toolName is required")
    url = pick(data, "url", "URL")
    if not url.startswith(("http://", "https://")):
        raise ValueError("url must be http(s)")
    category = pick(data, "category", "Category")
    if not category:
        raise ValueError("category is required")
    pricing = pick(data, "pricing", "Pricing Model", "Pricing")
    if not pricing:
        raise ValueError("pricing is required")
    status = pick(data, "status", "Status", default="Approved")
    description = pick(data, "description", "Description")
    if len(description) < 20:
        raise ValueError("description must be at least 20 characters")
    video = pick(data, "videoUrl", "Tutorial Video", "video")
    if not video.startswith(("http://", "https://")):
        raise ValueError("videoUrl (Tutorial Video) is required")

    for row in existing_rows:
        if (row.get("Tool Name") or "").strip().lower() == name.lower():
            raise ValueError(f"Tool already in directory: {name}")
        if normalize_link(row.get("URL") or "") == normalize_link(url):
            raise ValueError(f"URL already in directory: {url}")

    return {
        "Tool ID": pick(data, "toolId", "Tool ID", "id") or next_tool_id(existing_rows),
        "Tool Name": name,
        "Category": category,
        "Subcategory": pick(data, "subcategory", "Subcategory"),
        "Pricing Model": pricing,
        "Status": status,
        "URL": url,
        "Tutorial Video": video,
        "Description": description,
        "Platform": join_list(pick(data, "platform", "Platform")),
        "Department": pick(data, "department", "Department", default="Everyone"),
        "Use Cases": join_list(pick(data, "useCases", "Use Cases")),
        "Learning Curve": pick(data, "learningCurve", "Learning Curve", default="Medium"),
        "Priority": pick(data, "priority", "Priority", default="Medium"),
        "Data Classification": pick(data, "dataClassification", "Data Classification", default="Internal"),
        "Owner": pick(data, "owner", "Owner", default="Admin"),
        "Date Added": pick(data, "dateAdded", "Date Added", default=today),
        "Last Reviewed": pick(data, "lastReviewed", "Last Reviewed", default=today),
        "Notes": pick(data, "notes", "Notes"),
        "Limitations": pick(data, "limitations", "Limitations"),
        "When to Use": pick(data, "whenToUse", "When to Use"),
        "Alternatives": pick(data, "alternatives", "Alternatives"),
        "Cost Note": pick(data, "costNote", "Cost Note"),
        "Security Tip": pick(data, "securityTip", "Security Tip"),
        "Approved Models": join_list(pick(data, "approvedModels", "Approved Models")),
        "Assigned To": pick(data, "assignedTo", "Assigned To"),
        "Testing Notes": pick(data, "testingNotes", "Testing Notes"),
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Add approved tool to ai_tools_directory.csv")
    parser.add_argument("--json", required=True, help="Path to JSON file, or - for stdin")
    parser.add_argument("--no-regenerate", action="store_true")
    parser.add_argument("--no-mark-submission", action="store_true")
    args = parser.parse_args()

    if args.json == "-":
        payload = json.load(sys.stdin)
    else:
        path = Path(args.json)
        payload = json.loads(path.read_text(encoding="utf-8"))

    with DIR_CSV.open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        fieldnames = list(reader.fieldnames or DIRECTORY_FIELDS)
        rows = list(reader)

    for col in DIRECTORY_FIELDS:
        if col not in fieldnames:
            fieldnames.append(col)

    row = build_directory_row(payload, rows)
    rows.append(row)

    with DIR_CSV.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Added {row['Tool Name']} ({row['Tool ID']}) to {DIR_CSV.relative_to(ROOT)}")

    if not args.no_mark_submission:
        sub_link = pick(payload, "link", "submissionLink", "URL")
        if mark_submission_approved(sub_link, row["Tool Name"]):
            print(f"Marked submission Approved in {SUB_CSV.relative_to(ROOT)}")

    if not args.no_regenerate:
        subprocess.run([sys.executable, str(GENERATE)], check=True)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except (ValueError, json.JSONDecodeError) as exc:
        print(str(exc), file=sys.stderr)
        raise SystemExit(1)
