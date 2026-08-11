#!/usr/bin/env python3
"""Update Assigned To / Testing Notes for a tool in ai_tools_directory.csv.

Usage:
  python scripts/set_tool_assignment.py --id AIT-037 --assignee "Akshay" --notes "Try dashboard build"
  python scripts/set_tool_assignment.py --name "Bolt.new" --assignee "Akshay" --clear-notes
"""
from __future__ import annotations

import argparse
import csv
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "data" / "ai_tools_directory.csv"
GENERATE = ROOT / "scripts" / "generate_site_data.py"


def main() -> int:
    parser = argparse.ArgumentParser(description="Set tool testing assignment in CSV")
    parser.add_argument("--id", help="Tool ID, e.g. AIT-037")
    parser.add_argument("--name", help="Tool name, e.g. Bolt.new")
    parser.add_argument("--assignee", default="", help="Person assigned for testing/exploring")
    parser.add_argument("--notes", default=None, help="Admin testing notes (omit to leave unchanged)")
    parser.add_argument("--clear-notes", action="store_true", help="Clear testing notes")
    parser.add_argument("--no-regenerate", action="store_true", help="Skip regenerating docs/data.js")
    args = parser.parse_args()

    if not args.id and not args.name:
        print("Provide --id or --name", file=sys.stderr)
        return 1

    with CSV_PATH.open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        fieldnames = list(reader.fieldnames or [])
        rows = list(reader)

    if "Assigned To" not in fieldnames:
        fieldnames += ["Assigned To", "Testing Notes"]

    target = None
    for row in rows:
        if args.id and row.get("Tool ID") == args.id:
            target = row
            break
        if args.name and row.get("Tool Name") == args.name:
            target = row
            break

    if not target:
        print("Tool not found", file=sys.stderr)
        return 1

    target["Assigned To"] = args.assignee.strip()
    if args.clear_notes or (not args.assignee.strip() and args.notes is None):
        target["Testing Notes"] = ""
    elif args.notes is not None:
        target["Testing Notes"] = args.notes.strip()

    with CSV_PATH.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Updated {target.get('Tool Name')} ({target.get('Tool ID')})")
    print(f"  Assigned To: {target.get('Assigned To') or '(cleared)'}")
    print(f"  Testing Notes: {target.get('Testing Notes') or '(empty)'}")

    if not args.no_regenerate:
        subprocess.run([sys.executable, str(GENERATE)], check=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
