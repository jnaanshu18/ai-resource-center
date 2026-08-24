#!/usr/bin/env python3
"""Add or update a person in data/team_members.csv.

Usage:
  python scripts/add_team_member.py --name "Alex Rivera" --email alex@dailycodesolutions.com --department Operations
  python scripts/add_team_member.py --id TM-003 --name "Alex Rivera" --email alex@dailycodesolutions.com --inactive
"""
from __future__ import annotations

import argparse
import csv
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV_PATH = ROOT / "data" / "team_members.csv"
GENERATE = ROOT / "scripts" / "generate_site_data.py"


def next_member_id(rows: list[dict]) -> str:
    nums = []
    for row in rows:
        raw = str(row.get("Member ID") or "")
        match = re.match(r"TM-(\d+)$", raw, re.I)
        if match:
            nums.append(int(match.group(1)))
    return f"TM-{(max(nums) + 1) if nums else 1:03d}"


def main() -> int:
    parser = argparse.ArgumentParser(description="Add or update team directory member")
    parser.add_argument("--id", help="Member ID, e.g. TM-003")
    parser.add_argument("--name", required=True, help="Full display name")
    parser.add_argument("--email", required=True, help="Work email")
    parser.add_argument("--department", default="", help="Department or team")
    parser.add_argument("--role", default="Team", help="Role label")
    parser.add_argument("--inactive", action="store_true", help="Mark inactive instead of active")
    parser.add_argument("--no-regenerate", action="store_true", help="Skip regenerating docs/data.js")
    args = parser.parse_args()

    name = args.name.strip()
    email = args.email.strip().lower()
    if not name or not email:
        print("Name and email are required", file=sys.stderr)
        return 1
    if "@" not in email:
        print("Invalid email", file=sys.stderr)
        return 1

    with CSV_PATH.open(newline="", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        fieldnames = list(reader.fieldnames or [])
        rows = list(reader)

    if not fieldnames:
        fieldnames = ["Member ID", "Name", "Email", "Department", "Role", "Active"]

    target = None
    if args.id:
        target = next((r for r in rows if r.get("Member ID") == args.id), None)
    if not target:
        target = next(
            (r for r in rows if str(r.get("Email") or "").strip().lower() == email),
            None,
        )
    if not target:
        target = next(
            (r for r in rows if str(r.get("Name") or "").strip().lower() == name.lower()),
            None,
        )

    active = "no" if args.inactive else "yes"
    if target:
        target["Name"] = name
        target["Email"] = email
        target["Department"] = args.department.strip()
        target["Role"] = args.role.strip() or "Team"
        target["Active"] = active
        member_id = target.get("Member ID") or next_member_id(rows)
        target["Member ID"] = member_id
    else:
        member_id = args.id or next_member_id(rows)
        rows.append({
            "Member ID": member_id,
            "Name": name,
            "Email": email,
            "Department": args.department.strip(),
            "Role": args.role.strip() or "Team",
            "Active": active,
        })

    with CSV_PATH.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"Saved team member {name} ({member_id})")
    print(f"  Email: {email}")
    print(f"  Active: {active}")

    if not args.no_regenerate:
        subprocess.run([sys.executable, str(GENERATE)], check=True)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
