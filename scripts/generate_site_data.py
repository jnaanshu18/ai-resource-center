#!/usr/bin/env python3
"""Regenerate docs/data.js from the AI Resource Center CSVs.

Sources:
  - data/ai_tools_directory.csv
  - data/reference_lists.csv
  - data/tool_comparison.csv
  - data/tool_evaluation.csv
  - data/chooser_jobs.csv
  - data/decision_guides.csv
  - data/prompt_library.csv
  - data/team_use_cases.csv
  - data/learning_resources.csv
  - data/site_highlights.csv
  - data/team_members.csv
  - data/tool_submissions.csv

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
DATA = ROOT / "data"
OUT_PATH = ROOT / "docs" / "data.js"


def split_list(value):
    if not value:
        return []
    return [part.strip() for part in value.replace("|", ";").split(";") if part.strip()]


def load_csv_dicts(path):
    if not path.exists():
        return []
    with path.open(newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def load_tools():
    tools = []
    for row in load_csv_dicts(DATA / "ai_tools_directory.csv"):
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
                "videoUrl": row.get("Tutorial Video") or "",
                "description": row.get("Description") or "",
                "platform": split_list(row.get("Platform")),
                "department": row.get("Department") or "",
                "useCases": split_list(row.get("Use Cases")),
                "learningCurve": row.get("Learning Curve") or "",
                "priority": row.get("Priority") or "",
                "dataClassification": row.get("Data Classification") or "",
                "owner": row.get("Owner") or "",
                "assignedTo": row.get("Assigned To") or "",
                "testingNotes": row.get("Testing Notes") or "",
                "dateAdded": row.get("Date Added") or "",
                "lastReviewed": row.get("Last Reviewed") or "",
                "notes": row.get("Notes") or "",
                "limitations": row.get("Limitations") or "",
                "whenToUse": row.get("When to Use") or "",
                "alternatives": row.get("Alternatives") or "",
                "costNote": row.get("Cost Note") or "",
                "securityTip": row.get("Security Tip") or "",
                "approvedModels": split_list(row.get("Approved Models")),
            }
        )
    return tools


def load_categories():
    return load_reference_list("Categories")


def load_reference_list(kind):
    items = []
    path = DATA / "reference_lists.csv"
    if not path.exists():
        return items
    with path.open(newline="", encoding="utf-8") as f:
        reader = csv.reader(f)
        next(reader, None)
        for row in reader:
            if len(row) >= 2 and row[0] == kind and row[1]:
                items.append(row[1])
    return items


def load_departments():
    return load_reference_list("Departments")


def load_team_roles():
    return load_reference_list("Team Roles")


def load_comparisons():
    return [
        {
            "feature": row.get("Feature") or "",
            "tools": [t for t in [row.get("Tool A"), row.get("Tool B"), row.get("Tool C")] if t],
            "winner": row.get("Winner") or "",
            "notes": row.get("Notes") or "",
        }
        for row in load_csv_dicts(DATA / "tool_comparison.csv")
        if row.get("Feature")
    ]


def load_evaluations():
    evaluations = {}
    for row in load_csv_dicts(DATA / "tool_evaluation.csv"):
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


def load_chooser_jobs():
    return [
        {
            "id": row.get("Job ID") or "",
            "label": row.get("Label") or "",
            "description": row.get("Description") or "",
            "tools": split_list(row.get("Tool Names")),
            "tip": row.get("Tip") or "",
        }
        for row in load_csv_dicts(DATA / "chooser_jobs.csv")
        if row.get("Job ID")
    ]


def load_decision_guides():
    guides = {}
    for row in load_csv_dicts(DATA / "decision_guides.csv"):
        gid = (row.get("Guide ID") or "").strip()
        if not gid:
            continue
        if gid not in guides:
            guides[gid] = {
                "id": gid,
                "title": row.get("Guide Title") or "",
                "category": row.get("Guide Category") or "",
                "summary": row.get("Guide Summary") or "",
                "tips": [],
            }
        tool = (row.get("Tool Name") or "").strip()
        if tool:
            guides[gid]["tips"].append(
                {
                    "tool": tool,
                    "useWhen": row.get("Use When") or "",
                    "skipWhen": row.get("Skip When") or "",
                    "order": int(row.get("Sort Order") or 99),
                }
            )
    result = list(guides.values())
    for g in result:
        g["tips"].sort(key=lambda t: t["order"])
    result.sort(key=lambda g: g["id"])
    return result


def load_prompts():
    return [
        {
            "id": row.get("Prompt ID") or "",
            "title": row.get("Title") or "",
            "category": row.get("Category") or "",
            "useCase": row.get("Use Case") or "",
            "text": row.get("Prompt Text") or "",
            "models": split_list(row.get("Model")),
            "owner": row.get("Owner") or "",
            "dateAdded": row.get("Date Added") or "",
            "role": row.get("Role") or "Everyone",
        }
        for row in load_csv_dicts(DATA / "prompt_library.csv")
        if row.get("Prompt ID")
    ]


def load_use_cases():
    return [
        {
            "id": row.get("Use Case ID") or "",
            "title": row.get("Title") or "",
            "department": row.get("Department") or "",
            "tool": row.get("Tool Used") or "",
            "owner": row.get("Owner") or "",
            "impact": row.get("Impact") or "",
            "date": row.get("Date") or "",
            "role": row.get("Role") or row.get("Department") or "Everyone",
        }
        for row in load_csv_dicts(DATA / "team_use_cases.csv")
        if row.get("Use Case ID")
    ]


def load_learning():
    return [
        {
            "id": row.get("Resource ID") or "",
            "title": row.get("Title") or "",
            "type": row.get("Type") or "",
            "skillLevel": row.get("Skill Level") or "",
            "role": row.get("Role") or "Everyone",
            "url": row.get("URL") or "",
            "description": row.get("Description") or "",
            "dateAdded": row.get("Date Added") or "",
        }
        for row in load_csv_dicts(DATA / "learning_resources.csv")
        if row.get("Resource ID")
    ]


def load_team_members():
    return [
        {
            "id": row.get("Member ID") or "",
            "name": row.get("Name") or "",
            "email": row.get("Email") or "",
            "department": row.get("Department") or "",
            "role": row.get("Role") or "Team",
            "active": str(row.get("Active") or "yes").strip().lower() not in ("no", "false", "0"),
        }
        for row in load_csv_dicts(DATA / "team_members.csv")
        if row.get("Member ID") and row.get("Name") and row.get("Email")
    ]


def load_submissions():
    rows = []
    for row in load_csv_dicts(DATA / "tool_submissions.csv"):
        link = (row.get("Link") or row.get("URL") or "").strip()
        name = (row.get("Tool name") or row.get("Tool Name") or "").strip()
        if not link:
            continue
        assigned = (row.get("Assigned to") or row.get("Assignee") or "").strip()
        status = (row.get("Status") or "New").strip() or "New"
        status_lower = status.lower()
        if status_lower == "investigating":
            status = "In review"
        if not assigned and status_lower in ("investigating", "in review"):
            status = "New"
        rows.append(
            {
                "Submitted": (row.get("Submitted") or row.get("Date") or "").strip(),
                "Tool name": name,
                "Link": link,
                "Submitted by": (row.get("Submitted by") or row.get("Submitter") or "").strip(),
                "Why Suggested": (row.get("Why Suggested") or row.get("Note") or row.get("Notes") or "").strip(),
                "Why Rejected": (row.get("Why Rejected") or "").strip(),
                "Note": (row.get("Note") or "").strip() if (row.get("Why Suggested") or "").strip() else "",
                "Status": status,
                "Assigned to": assigned,
                "Assigned date": (row.get("Assigned date") or row.get("Assigned Date") or "").strip(),
                "Rejected date": (row.get("Rejected date") or row.get("Rejected Date") or "").strip(),
            }
        )
    return rows


def load_site_highlights():
    """Start here shortlist + optional fixed Tool of the week from CSV."""
    start_here = []
    featured = ""
    for row in load_csv_dicts(DATA / "site_highlights.csv"):
        kind = (row.get("Kind") or "").strip().lower()
        name = (row.get("Tool Name") or "").strip()
        if not name:
            continue
        order = int(row.get("Sort Order") or 99)
        if kind == "start here":
            start_here.append({"name": name, "order": order})
        elif kind in ("tool of the week", "featured"):
            featured = name
    start_here.sort(key=lambda item: (item["order"], item["name"]))
    return {
        "startHere": [item["name"] for item in start_here],
        "toolOfTheWeek": featured,
    }


def main():
    tools = load_tools()
    categories = load_categories()
    comparisons = load_comparisons()
    evaluations = load_evaluations()
    jobs = load_chooser_jobs()
    guides = load_decision_guides()
    prompts = load_prompts()
    use_cases = load_use_cases()
    learning = load_learning()
    highlights = load_site_highlights()
    team_members = load_team_members()
    departments = load_departments()
    team_roles = load_team_roles()
    submissions = load_submissions()

    js = (
        "// Auto-generated from data/*.csv — do not edit by hand.\n"
        f"const TOOLS = {json.dumps(tools, indent=2, ensure_ascii=False)};\n"
        f"const CATEGORIES = {json.dumps(categories, indent=2, ensure_ascii=False)};\n"
        f"const COMPARISONS = {json.dumps(comparisons, indent=2, ensure_ascii=False)};\n"
        f"const EVALUATIONS = {json.dumps(evaluations, indent=2, ensure_ascii=False)};\n"
        f"const CHOOSER_JOBS = {json.dumps(jobs, indent=2, ensure_ascii=False)};\n"
        f"const DECISION_GUIDES = {json.dumps(guides, indent=2, ensure_ascii=False)};\n"
        f"const PROMPTS = {json.dumps(prompts, indent=2, ensure_ascii=False)};\n"
        f"const USE_CASES = {json.dumps(use_cases, indent=2, ensure_ascii=False)};\n"
        f"const LEARNING = {json.dumps(learning, indent=2, ensure_ascii=False)};\n"
        f"const SITE_HIGHLIGHTS = {json.dumps(highlights, indent=2, ensure_ascii=False)};\n"
        f"const TEAM_MEMBERS = {json.dumps(team_members, indent=2, ensure_ascii=False)};\n"
        f"const DEPARTMENTS = {json.dumps(departments, indent=2, ensure_ascii=False)};\n"
        f"const TEAM_ROLES = {json.dumps(team_roles, indent=2, ensure_ascii=False)};\n"
        f"const SUBMISSIONS = {json.dumps(submissions, indent=2, ensure_ascii=False)};\n"
    )

    OUT_PATH.write_text(js, encoding="utf-8")
    print(
        f"Wrote {len(tools)} tools, {len(categories)} categories, "
        f"{len(comparisons)} comparisons, {len(evaluations)} evaluations, "
        f"{len(jobs)} jobs, {len(guides)} guides, {len(prompts)} prompts, "
        f"{len(use_cases)} use cases, {len(learning)} learning, "
        f"{len(team_members)} team members, "
        f"{len(submissions)} submissions, "
        f"{len(highlights['startHere'])} start-here "
        f"to {OUT_PATH.relative_to(ROOT)}"
    )


if __name__ == "__main__":
    main()
