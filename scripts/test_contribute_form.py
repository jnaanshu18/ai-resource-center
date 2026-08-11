"""Validate Contribute 'Add a tool' rules with sample payloads (mirrors docs/script.js)."""
from __future__ import annotations

import csv
import re
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
TOOLS = list(csv.DictReader((ROOT / "data" / "ai_tools_directory.csv").open(encoding="utf-8-sig")))
CATEGORIES = {
    r["Value"]
    for r in csv.DictReader((ROOT / "data" / "reference_lists.csv").open(encoding="utf-8-sig"))
    if r.get("List Name") == "Categories"
}
PRICING = {
    r["Value"]
    for r in csv.DictReader((ROOT / "data" / "reference_lists.csv").open(encoding="utf-8-sig"))
    if r.get("List Name") == "Pricing Models"
}

LIMITS = {
    "name": (2, 80),
    "desc": (20, 500),
    "reason": (20, 800),
    "submitter": (2, 60),
    "url": 300,
}
NAME_PATTERN = re.compile(r"^[A-Za-z0-9][A-Za-z0-9 ._\-+&'/()]*$")
PERSON_PATTERN = re.compile(r"^[A-Za-z][A-Za-z .'\-]*$")
URGENCY = {
    "Exploring / learning",
    "Nice to have",
    "Useful this quarter",
    "Needed for a project soon",
    "Blocking work now",
}
SENSITIVE = [
    re.compile(p, re.I)
    for p in [
        r"\bclient\s+secret",
        r"\bapi\s+key",
        r"\bpassword\b",
        r"\bproduction\s+(db|database|data|server)\b",
        r"\bpii\b",
    ]
]


def existing_match(name: str):
    n = name.strip().lower()
    for t in TOOLS:
        if (t.get("Tool Name") or "").strip().lower() == n:
            return t.get("Tool Name")
    return None


def valid_url(url: str) -> bool:
    try:
        p = urlparse(url)
        return p.scheme in ("http", "https") and bool(p.netloc)
    except Exception:
        return False


def validate(payload: dict) -> list[str]:
    errors = []
    name = (payload.get("name") or "").strip()
    category = (payload.get("category") or "").strip()
    pricing = (payload.get("pricing") or "").strip()
    url = (payload.get("url") or "").strip()
    urgency = (payload.get("urgency") or "").strip()
    submitter = (payload.get("submitter") or "").strip()
    desc = (payload.get("desc") or "").strip()
    reason = (payload.get("reason") or "").strip()

    if not name:
        errors.append("name: required")
    elif not (LIMITS["name"][0] <= len(name) <= LIMITS["name"][1]):
        errors.append("name: length")
    elif not NAME_PATTERN.match(name):
        errors.append("name: pattern")
    else:
        dup = existing_match(name)
        if dup:
            errors.append(f"name: duplicate ({dup})")

    if not category:
        errors.append("category: required")
    elif category not in CATEGORIES:
        errors.append("category: invalid")

    if pricing and pricing not in PRICING:
        errors.append("pricing: invalid")

    if not url:
        errors.append("url: required")
    elif len(url) > LIMITS["url"]:
        errors.append("url: length")
    elif not valid_url(url):
        errors.append("url: invalid")

    if urgency and urgency not in URGENCY:
        errors.append("urgency: invalid")

    if not submitter:
        errors.append("submitter: required")
    elif not (LIMITS["submitter"][0] <= len(submitter) <= LIMITS["submitter"][1]):
        errors.append("submitter: length")
    elif not PERSON_PATTERN.match(submitter):
        errors.append("submitter: pattern")

    if not desc or not (LIMITS["desc"][0] <= len(desc) <= LIMITS["desc"][1]):
        errors.append("desc: length")
    if reason and not (LIMITS["reason"][0] <= len(reason) <= LIMITS["reason"][1]):
        errors.append("reason: length")

    blob = f"{desc} {reason}"
    if any(p.search(blob) for p in SENSITIVE):
        errors.append("sensitive: warning-worthy content")

    return errors


SAMPLES = [
    {
        "label": "Tavily (valid contribute sample)",
        "expect_ok": True,
        "payload": {
            "name": "Tavily",
            "category": "LLM / Assistants",
            "pricing": "Freemium",
            "url": "https://tavily.com",
            "urgency": "Useful this quarter",
            "submitter": "Anshu Jain",
            "desc": "Search API built for AI agents that returns clean, cited web results for research and RAG workflows.",
            "reason": "Worth trying for agent research alongside Perplexity and Firecrawl on client discovery work.",
        },
    },
    {
        "label": "Optional test plan (valid contribute sample)",
        "expect_ok": True,
        "payload": {
            "name": "QA Optional Test Plan Tool",
            "category": "LLM / Assistants",
            "pricing": "Freemium",
            "url": "https://example.com/qa-optional-test-plan",
            "urgency": "Nice to have",
            "submitter": "Anshu Jain",
            "desc": "A regression fixture proving that an otherwise valid proposal does not require a test-plan response.",
        },
    },
    {
        "label": "Midjourney (valid contribute sample)",
        "expect_ok": True,
        "payload": {
            "name": "Midjourney",
            "category": "Creative & productivity",
            "pricing": "Paid",
            "url": "https://www.midjourney.com",
            "urgency": "Nice to have",
            "submitter": "Aagam",
            "desc": "Image generation tool for concept art, mood boards, and marketing visuals from text prompts.",
            "reason": "Useful for early creative concepts before brand designers take over client-facing assets.",
        },
    },
    {
        "label": "Duplicate Cursor (should fail)",
        "expect_ok": False,
        "payload": {
            "name": "Cursor",
            "category": "AI Coding",
            "pricing": "Paid",
            "url": "https://cursor.com",
            "urgency": "Nice to have",
            "submitter": "Anshu Jain",
            "desc": "This should fail because Cursor is already listed in the directory catalog.",
            "reason": "Validation must block exact duplicate tool names before opening a GitHub draft.",
        },
    },
    {
        "label": "Empty required fields (should fail)",
        "expect_ok": False,
        "payload": {
            "name": "",
            "category": "",
            "url": "",
            "submitter": "",
            "desc": "short",
            "reason": "short",
        },
    },
]


def main() -> int:
    print(f"Directory tools loaded: {len(TOOLS)}")
    print("=== Contribute form validation ===")
    failed = 0
    for case in SAMPLES:
        errors = validate(case["payload"])
        ok = len(errors) == 0
        passed = ok == case["expect_ok"]
        status = "PASS" if passed else "FAIL"
        if not passed:
            failed += 1
        print(f"[{status}] {case['label']} -> ok={ok} errors={errors or '—'}")
        if ok and case["expect_ok"]:
            p = case["payload"]
            print(f"       draft: Add tool: {p['name']} | {p['category']} | {p['url']}")
    print()
    print("ALL CHECKS PASSED" if failed == 0 else f"{failed} CHECK(S) FAILED")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
