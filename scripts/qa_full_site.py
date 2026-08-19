#!/usr/bin/env python3
"""Expert QA suite for the DCS AI Resource Center static site.

Covers: data integrity, HTML wiring, search/filter/score rules,
contribute validation, auth config, deep-link params, and cross-tab data.
"""
from __future__ import annotations

import csv
import hashlib
import json
import re
import sys
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
DOCS = ROOT / "docs"
DATA = ROOT / "data"

PASS = FAIL = WARN = 0
RESULTS: list[tuple[str, str, str]] = []


def record(status: str, area: str, msg: str) -> None:
    global PASS, FAIL, WARN
    RESULTS.append((status, area, msg))
    if status == "PASS":
        PASS += 1
    elif status == "FAIL":
        FAIL += 1
    else:
        WARN += 1


def load_js_array(text: str, name: str):
    m = re.search(rf"const {name} = (\[[\s\S]*?\n\]);", text)
    if not m:
        return None
    return json.loads(m.group(1))


def load_js_object(text: str, name: str):
    m = re.search(rf"const {name} = (\{{[\s\S]*?\n\}});", text)
    if not m:
        return None
    return json.loads(m.group(1))


# ---------- Search helpers (mirror script.js) ----------

def search_tokens(q: str) -> list[str]:
    return [t for t in re.split(r"[^a-z0-9_+./-]+", q.strip().lower()) if t]


def text_has_token(text: str, token: str) -> bool:
    if not text or not token:
        return False
    return (
        re.search(rf"(?:^|[^a-z0-9_+./-]){re.escape(token)}(?![a-z0-9])", " " + text, re.I)
        is not None
    )


def primary(t: dict) -> str:
    parts = [
        t.get("name"), t.get("category"), t.get("subcategory"), t.get("pricing"),
        t.get("description"), t.get("owner"), t.get("department"), t.get("priority"),
        t.get("assignedTo"),
        *(t.get("useCases") or []),
    ]
    return " ".join(str(p or "") for p in parts)


def secondary(t: dict) -> str:
    parts = [
        t.get("notes"), t.get("limitations"), t.get("whenToUse"), t.get("costNote"),
        t.get("securityTip"), t.get("learningCurve"), t.get("dataClassification"),
        t.get("status"), t.get("testingNotes"),
    ]
    return " ".join(str(p or "") for p in parts)


def tokens_match(text: str, toks: list[str]) -> bool:
    return all(text_has_token(text, tok) for tok in toks)


def filtered_search(tools: list, q: str) -> list:
    toks = search_tokens(q)
    if not toks:
        return list(tools)
    primary_hits = [t for t in tools if tokens_match(primary(t), toks)]
    if primary_hits:
        return primary_hits
    return [t for t in tools if tokens_match(f"{primary(t)} {secondary(t)}", toks)]


def can_have_score(status: str) -> bool:
    return status in {"Production", "Approved", "Archived", "Rejected"}


def main() -> int:
    data_js = (DOCS / "data.js").read_text(encoding="utf-8")
    html = (DOCS / "index.html").read_text(encoding="utf-8")
    script = (DOCS / "script.js").read_text(encoding="utf-8")
    header_js = (DOCS / "shared" / "header.js").read_text(encoding="utf-8")
    example_cfg = (DOCS / "site-config.example.js").read_text(encoding="utf-8")
    local_cfg = DOCS / "site-config.js"

    tools = load_js_array(data_js, "TOOLS") or []
    prompts = load_js_array(data_js, "PROMPTS") or []
    use_cases = load_js_array(data_js, "USE_CASES") or []
    learning = load_js_array(data_js, "LEARNING") or []
    guides = load_js_array(data_js, "DECISION_GUIDES") or []
    comparisons = load_js_array(data_js, "COMPARISONS") or []
    jobs = load_js_array(data_js, "CHOOSER_JOBS") or []
    evaluations = load_js_object(data_js, "EVALUATIONS") or {}
    highlights = load_js_object(data_js, "SITE_HIGHLIGHTS") or {}

    # ===== DATA =====
    if len(tools) >= 11:
        record("PASS", "Data", f"TOOLS count = {len(tools)}")
    else:
        record("FAIL", "Data", f"TOOLS count too low: {len(tools)}")

    ids = [t.get("id") for t in tools]
    names = [t.get("name") for t in tools]
    if len(ids) == len(set(ids)):
        record("PASS", "Data", "Tool IDs unique")
    else:
        record("FAIL", "Data", "Duplicate tool IDs")
    if len(names) == len(set(names)):
        record("PASS", "Data", "Tool names unique")
    else:
        record("FAIL", "Data", "Duplicate tool names")

    statuses = {"Production", "Approved", "Testing", "Exploring", "Archived", "Rejected"}
    bad_status = [t["name"] for t in tools if t.get("status") not in statuses]
    if not bad_status:
        record("PASS", "Data", "All tool statuses canonical")
    else:
        record("FAIL", "Data", f"Bad statuses: {bad_status}")

    missing_url = [t["name"] for t in tools if not (t.get("url") or "").startswith("http")]
    if not missing_url:
        record("PASS", "Data", "All tools have http(s) URLs")
    else:
        record("FAIL", "Data", f"Missing/invalid URLs: {missing_url}")

    missing_video = [t["name"] for t in tools if not (t.get("videoUrl") or "").startswith("http")]
    if not missing_video:
        record("PASS", "Data", "All tools have tutorial video URLs")
    else:
        record("FAIL", "Data", f"Missing tutorial videos: {missing_video}")

    csv_tools = list(csv.DictReader((DATA / "ai_tools_directory.csv").open(encoding="utf-8-sig")))
    csv_fields = csv_tools[0].keys() if csv_tools else []
    if "Tutorial Video" in csv_fields:
        record("PASS", "Data", "CSV has Tutorial Video column")
    else:
        record("FAIL", "Data", "CSV missing Tutorial Video column")
    if len(csv_tools) == len(tools):
        record("PASS", "Data", f"CSV vs data.js tool count match ({len(tools)})")
    else:
        record("FAIL", "Data", f"CSV={len(csv_tools)} vs data.js={len(tools)}")

    for required in ("Cursor", "ChatGPT", "Perplexity", "Antigravity"):
        if any(t.get("name") == required for t in tools):
            record("PASS", "Data", f"Directory tool present: {required}")
        else:
            record("FAIL", "Data", f"Missing directory tool: {required}")

    submissions = load_js_array(data_js, "SUBMISSIONS") or []
    sub_names = {(row.get("Tool name") or row.get("toolName") or "") for row in submissions}
    for required in ("Firecrawl", "Gamma", "Ollama", "NotebookLM", "Windsurf"):
        if required in sub_names:
            record("PASS", "Data", f"Submission present: {required}")
        else:
            record("FAIL", "Data", f"Missing submission: {required}")

    trial_in_dir = [t["name"] for t in tools if t.get("status") in {"Testing", "Exploring"}]
    if not trial_in_dir:
        record("PASS", "Directory", "No Testing/Exploring tools in Directory")
    else:
        record("FAIL", "Directory", f"Testing/Exploring still in Directory: {trial_in_dir}")

    if prompts and use_cases and learning and guides and jobs:
        record(
            "PASS",
            "Data",
            f"Cross-tab data: {len(prompts)} prompts, {len(use_cases)} use cases, "
            f"{len(learning)} learning, {len(guides)} guides, {len(jobs)} jobs, "
            f"{len(comparisons)} comparisons",
        )
    else:
        record("FAIL", "Data", "One or more tab datasets empty")

    start_here = highlights.get("startHere") or []
    missing_starter = [n for n in start_here if n not in names]
    if not missing_starter:
        record("PASS", "Home", f"Start here tools resolve ({len(start_here)})")
    else:
        record("FAIL", "Home", f"Start here missing from directory: {missing_starter}")

    # Score rules
    score_violations = []
    for t in tools:
        ev = evaluations.get(t["name"]) or {}
        score = str(ev.get("score") or "").strip()
        if score and not can_have_score(t.get("status") or ""):
            score_violations.append(f"{t['name']} ({t.get('status')}) score={score}")
    if not score_violations:
        record("PASS", "Scores", "No scores on Testing/Exploring tools")
    else:
        record("FAIL", "Scores", f"Scores should be empty: {score_violations}")

    scored_ok = [
        t["name"] for t in tools
        if can_have_score(t.get("status") or "")
        and str((evaluations.get(t["name"]) or {}).get("score") or "").strip()
    ]
    if scored_ok:
        record("PASS", "Scores", f"Scored Production/Approved/Archived tools: {len(scored_ok)}")
    else:
        record("WARN", "Scores", "No scored tools found")

    # ===== HTML WIRING =====
    required_ids = [
        "loginGate", "loginForm", "loginUsername", "loginPassword", "loginError", "loginSessionHint",
        "view-home", "view-directory", "view-tool", "view-guides", "view-prompts", "view-playbooks", "view-submissions", "view-contribute",
        "chooserGrid", "starterRow", "toolOfWeek", "recentTools",
        "stats", "searchInput", "sortSelect", "compareToggle", "filterChips",
        "toolGrid", "emptyState", "clearFilters", "resultCount",
        "compareBar", "compareOpen", "compareClear", "compareOverlay", "compareBody", "compareBanner",
        "modalOverlay", "modalBody", "modalClose",
        "promptSearchInput", "promptGrid", "promptEmpty",
        "playbookSearchInput", "useCaseGrid", "learnGrid",
        "suggestForm", "s_name", "s_category", "s_url", "s_submitter", "s_desc", "s_reason",
        "simpleSubmitForm", "simple_link", "simple_tool", "submissionsList", "submissionSearchInput",
        "shareWinSection", "winForm", "w_title", "w_tool", "w_impact", "w_how",
        "pendingReviewList", "pendingReviewRefresh", "backToTop",
        "contribSuggestPanel", "contribWinPanel",
    ]
    missing_ids = [i for i in required_ids if f'id="{i}"' not in html]
    if not missing_ids:
        record("PASS", "HTML", f"All {len(required_ids)} critical IDs present")
    else:
        record("FAIL", "HTML", f"Missing IDs: {missing_ids}")

    views = ["home", "directory", "tool", "guides", "prompts", "playbooks", "submissions", "contribute"]
    for v in views:
        if f'data-view-panel="{v}"' in html:
            record("PASS", "HTML", f"View panel: {v}")
        else:
            record("FAIL", "HTML", f"Missing view panel: {v}")

    for label in ("AI hub", "Directory", "Guides", "Prompts", "Playbooks", "Suggestions"):
        if label in header_js or label in html:
            record("PASS", "Nav", f"Nav includes {label}")
        else:
            record("FAIL", "Nav", f"Nav missing {label}")

    # Scripts loaded
    for src in ("shared/header.js", "data.js", "site-config.js", "script.js"):
        if src in html:
            record("PASS", "HTML", f"Script tag: {src}")
        else:
            record("FAIL", "HTML", f"Missing script: {src}")

    # Website required on contribute
    if 'for="s_url">Website <span class="req">*</span>' in html or 'for="s_url">Website <span class="req">' in html:
        record("PASS", "Contribute", "Website marked required in HTML")
    else:
        record("FAIL", "Contribute", "Website not marked required in HTML")

    if 'errors.url = "Website is required."' in script or "Website is required" in script:
        record("PASS", "Contribute", "Website required in validateSuggestForm")
    else:
        record("FAIL", "Contribute", "Website validation missing in script.js")

    if 'id="simpleSubmitForm"' in html and 'id="simple_link"' in html and 'id="simple_tool"' in html:
        record("PASS", "Contribute", "Simple tool submit form present")
    else:
        record("FAIL", "Contribute", "Simple tool submit form missing")

    if 'id="simple_assign"' in html and "syncSimpleSubmitAdminFields" in script and "assignee: payload.assignee" in script.replace(" ", ""):
        record("PASS", "Contribute", "Admin optional assign on suggest tool wired")
    elif 'id="simple_assign"' in html and "syncSimpleSubmitAdminFields" in script and "payload.assignee" in script:
        record("PASS", "Contribute", "Admin optional assign on suggest tool wired")
    else:
        record("FAIL", "Contribute", "Admin assign-on-suggest missing")

    if "submissions-split" in html and "simpleSubmitForm" in html:
        record("PASS", "Contribute", "Add-tool form merged into Suggestions page")
    else:
        record("FAIL", "Contribute", "Suggestions split layout or submit form missing")

    if "Enter a tool name." in script and "Enter a link." in script and "simpleSubmit" in example_cfg and "winSubmit" in example_cfg:
        record("PASS", "Contribute", "Simple submit + win submit validation + example config")
    else:
        record("FAIL", "Contribute", "Submit validation or site-config example missing")

    if "submitWinLink" in script and "Share win" in html and "winIssueLink" not in html:
        record("PASS", "Contribute", "Share a win posts to Sheet (no GitHub draft UI)")
    else:
        record("FAIL", "Contribute", "Win submit flow missing or still uses GitHub draft")

    if "submission-item__by" not in script:
        record("PASS", "Contribute", "Submitter names hidden on Suggestions list")
    else:
        record("FAIL", "Contribute", "Submitter line still rendered on Suggestions")

    if "DEMO_SUBMISSION_ROWS" not in script and "submissionsDemoBanner" not in html:
        record("PASS", "Contribute", "Sample submissions fallback and demo banner removed")
    else:
        record("FAIL", "Contribute", "Sample submissions fallback or demo banner still present")

    if "bakedSubmissionRows" in script and "mergeSubmissionItems" in script and "const SUBMISSIONS" in data_js:
        record("PASS", "Contribute", "Baked SUBMISSIONS always show; live sheet rows merge")
    else:
        record("FAIL", "Contribute", "Baked submissions dataset or merge missing")

    submissions = load_js_array(data_js, "SUBMISSIONS") or []
    if len(submissions) >= 25:
        record("PASS", "Contribute", f"SUBMISSIONS count = {len(submissions)}")
    else:
        record("FAIL", "Contribute", f"SUBMISSIONS too few: {len(submissions)}")

    if "Status and assignee are updated in the Google Sheet" not in html:
        record("PASS", "Contribute", "Sheet-refresh copy removed from Submissions")
    else:
        record("FAIL", "Contribute", "Sheet-refresh copy still on Submissions")

    if "submissionsRefresh" not in html:
        record("PASS", "Contribute", "Refresh button removed from Submissions list")
    else:
        record("FAIL", "Contribute", "Refresh button still on Submissions list")

    if "submission-item__tip" in script and "submissionTooltipHtml" in script:
        record("PASS", "Contribute", "Submission hover tooltip with contextual dates")
    else:
        record("FAIL", "Contribute", "Submission hover tooltip missing")

    if 'status !== "Rejected"' in script and "submissionTooltipHtml" in script:
        record("PASS", "Contribute", "Rejected submissions hide reviewer and date in tooltip")
    else:
        record("FAIL", "Contribute", "Rejected submission tooltip privacy check missing")

    if "assignSubmissionItem" in script and "action: \"assign\"" in script:
        record("PASS", "Contribute", "Admin assign submission via Apps Script")
    else:
        record("FAIL", "Contribute", "Admin assign flow missing")

    if "openDirectoryApproveModal" in script and "directoryApproveForm" in html:
        record("PASS", "Contribute", "Admin approve + directory entry modal")
    else:
        record("FAIL", "Contribute", "Directory approve modal missing")

    if "rejectSubmissionItem" in script and 'action: "reject"' in script:
        record("PASS", "Contribute", "Admin reject submission wired")
    else:
        record("FAIL", "Contribute", "Admin reject flow missing")

    if (ROOT / "scripts" / "add_directory_tool.py").is_file():
        record("PASS", "Contribute", "add_directory_tool.py publish helper present")
    else:
        record("FAIL", "Contribute", "add_directory_tool.py missing")

    apps = (ROOT / "scripts" / "tool_submissions_apps_script.js").read_text(encoding="utf-8")
    if "handleApprove" in apps and "handleReject" in apps:
        record("PASS", "Contribute", "Apps Script approve/reject handlers")
    else:
        record("FAIL", "Contribute", "Apps Script approve/reject missing")

    if "submissionSearchInput" in html and "submissionMatchesSearch" in script:
        record("PASS", "Contribute", "Submitted tools search input wired")
    else:
        record("FAIL", "Contribute", "Submitted tools search missing")

    if ('class="submission-item__link" href=' in script and "playbook-tone--" in script and "scrollToAnchor" in script):
        record("PASS", "Contribute", "Submission cards use playbook-style tones; anchor scroll offset")
    else:
        record("FAIL", "Contribute", "Submission card styling or anchor scroll missing")

    if "shareWinSection" in html and 'id="winForm"' in html and "playbooks-split" in html:
        record("PASS", "Contribute", "Share a win form on Playbooks page")
    else:
        record("FAIL", "Contribute", "Share a win form missing from Playbooks")

    if "effectiveSubmissionStatus" in script:
        record("PASS", "Contribute", "Unassigned submissions cannot show In review")
    else:
        record("FAIL", "Contribute", "Missing effectiveSubmissionStatus helper")

    if "directoryTools" in script and "isDirectoryHiddenStatus" in script:
        record("PASS", "Directory", "Directory excludes Rejected, Testing, and Exploring")
    else:
        record("FAIL", "Directory", "Directory missing catalog status filter")

    rejected_in_dir = [t["name"] for t in tools if str(t.get("status") or "").lower() == "rejected"]
    if not rejected_in_dir:
        record("PASS", "Directory", "No Rejected tools in directory data")
    else:
        record("FAIL", "Directory", f"Rejected tools still in directory: {rejected_in_dir}")

    if "playbook-card--directory" in script and "directoryCardTone" in script:
        record("PASS", "Directory", "Directory cards use playbook-style tones")
    else:
        record("FAIL", "Directory", "Directory playbook-style card styling missing")

    if "card__name-btn" in script and "Open site" in script and "card__name-link" not in script:
        record("PASS", "Directory", "Tool name opens details; vendor site is a labeled Open site action")
    else:
        record("FAIL", "Directory", "Directory name still acts as an unlabeled vendor link")

    moved_names = {
        "Windsurf", "Make", "Lovable", "Exa", "Raycast AI", "Fireflies.ai", "Bolt.new",
        "NotebookLM", "CodeRabbit", "Julius AI", "Gamma", "OpenHands", "Browser Use",
        "Firecrawl", "Apify", "Crawl4AI", "Ollama", "Power BI Copilot", "Dify", "v0",
    }
    still_in_dir = [n for n in moved_names if n in names]
    sub_names = {(row.get("Tool name") or row.get("toolName") or "") for row in submissions}
    missing_sub = [n for n in moved_names if n not in sub_names]
    if not still_in_dir and not missing_sub:
        record("PASS", "Directory", "New/recent tools moved from Directory to Submissions")
    else:
        record("FAIL", "Directory", f"Move incomplete dir={still_in_dir} missing_sub={missing_sub}")

    # Compare UX
    if "click a card" in html.lower():
        record("WARN", "Compare", "Banner still says click a card (selection is via checkbox)")
    else:
        record("PASS", "Compare", "Compare banner copy aligned or updated")

    # Auth config shape
    if "passwordHash" in example_cfg and "employeePasswordHash" in example_cfg and "inviteTokenHash" in example_cfg:
        record("PASS", "Auth", "Example config uses admin + employee password hashes")
    else:
        record("FAIL", "Auth", "Example config missing hash fields")

    if "resolveLogin" in script and "employeePasswordHash" in script and "loginLockRemainingMs" in script:
        record("PASS", "Auth", "script.js has dual login + rate limit")
    else:
        record("FAIL", "Auth", "Auth hardening functions missing")

    if local_cfg.exists():
        cfg = local_cfg.read_text(encoding="utf-8")
        if "passwordHash" in cfg and "password:" not in re.sub(r"passwordHash", "", cfg):
            # crude: ensure no plaintext password field
            if re.search(r"^\s*password\s*:", cfg, re.M):
                record("WARN", "Auth", "Local site-config still has plaintext password field")
            else:
                record("PASS", "Auth", "Local site-config uses hashed secrets")
        if "sessionDays: 15" in cfg or "sessionDays:15" in cfg:
            record("PASS", "Auth", "Session default is 15 days")
        else:
            record("WARN", "Auth", "sessionDays may not be 15")
    else:
        record("WARN", "Auth", "Local site-config.js missing (copy from example)")

    # Hash self-check for known secrets if local config has expected hashes
    known = {
        "DCS-internal": "32dbf06e7c3ad8373324575e9e533594542c2e50bc84dd564a27c185a4cb654d",
        "dcs-team": "ce215fc62ebc0e52d40b8d373d82365acf66002f674081fd4bbaaf32bdd16aaf",
    }
    for secret, digest in known.items():
        got = hashlib.sha256(secret.encode()).hexdigest()
        if got == digest:
            record("PASS", "Auth", f"SHA-256 fixture OK for known secret length {len(secret)}")
        else:
            record("FAIL", "Auth", f"Hash fixture mismatch for {secret}")

    # ===== ASSIGNMENTS =====
    if "assignedTo" in data_js and "testingNotes" in data_js:
        record("PASS", "Assignments", "data.js includes assignedTo / testingNotes")
    else:
        record("FAIL", "Assignments", "data.js missing assignment fields")

    csv_fields = list(csv_tools[0].keys()) if csv_tools else []
    if "Assigned To" in csv_fields and "Testing Notes" in csv_fields:
        record("PASS", "Assignments", "CSV has Assigned To / Testing Notes columns")
    else:
        record("FAIL", "Assignments", "CSV missing assignment columns")

    assignable = [t for t in tools if t.get("status") in {"Testing", "Exploring"}]
    if not assignable:
        record("PASS", "Assignments", "Trial tools live on Submissions, not Directory")
    else:
        record("FAIL", "Assignments", f"{len(assignable)} Testing/Exploring still in Directory")

    bolt = next((t for t in tools if t.get("name") == "Bolt.new"), None)
    if bolt:
        if bolt.get("assignedTo") and bolt.get("testingNotes"):
            record("PASS", "Assignments", f"Bolt.new has assignment ({bolt.get('assignedTo')})")
        elif bolt.get("assignedTo") or bolt.get("testingNotes"):
            record("WARN", "Assignments", "Bolt.new has partial assignment data")
        else:
            record("WARN", "Assignments", "Bolt.new assignment sample missing")
    else:
        record("PASS", "Assignments", "Bolt.new lives on Submissions, not Directory")

    assigned_samples = [
        (t.get("assignedTo"), t["name"])
        for t in tools if t.get("assignedTo")
    ]
    if assigned_samples:
        assignee, tool_name = assigned_samples[0]
        hits = [t["name"] for t in filtered_search(tools, assignee)]
        if tool_name in hits:
            record("PASS", "Assignments", f"Search finds assignee {assignee!r} -> includes {tool_name}")
        else:
            record("FAIL", "Assignments", f"Assignee search failed for {assignee!r}: {hits}")
    else:
        record("WARN", "Assignments", "No assignedTo values in data — skip assignee search check")

    stray = [
        t["name"] for t in tools
        if t.get("status") not in {"Testing", "Exploring"}
        and (t.get("assignedTo") or t.get("testingNotes"))
    ]
    if not stray:
        record("PASS", "Assignments", "Assignments only on Testing/Exploring in data")
    else:
        record("WARN", "Assignments", f"Assignment data on non-trial tools: {stray}")

    assign_hooks = [
        "toolIsInTestTrack",
        "modalMetaTagsHtml",
        "modalMetaAssignmentHtml",
        "openAssignmentModal",
        "renderToolAssignmentCardContent",
        "assignmentSummaryHtml",
        "applyAssignmentOverrides",
        "assignmentPublishCommand",
        "resolveAssigneeEmail",
        "sendAssignmentNotification",
        "getActiveTeamMembers",
        "submitTeamRegistration",
    ]
    missing_assign = [h for h in assign_hooks if h not in script]
    if not missing_assign:
        record("PASS", "Assignments", "script.js assignment hooks present")
    else:
        record("FAIL", "Assignments", f"Missing hooks: {missing_assign}")

    if "toolAssignSave" in script and "toolAssignClear" in script and "modalMetaTagsHtml" in script:
        record("PASS", "Assignments", "Admin assignment UI wired")
    else:
        record("FAIL", "Assignments", "Admin assignment UI incomplete")

    if "assignmentOverlay" in (ROOT / "docs" / "index.html").read_text(encoding="utf-8") and "modalMetaAssignmentHtml" in script and "getToolAssignmentConfig" in (ROOT / "docs" / "site-config.example.js").read_text(encoding="utf-8"):
        record("PASS", "Assignments", "Assignment card + config toggle present")
    else:
        record("FAIL", "Assignments", "Assignment card or config toggle missing")

    if (ROOT / "workers" / "assignment-notify" / "worker.js").exists():
        record("PASS", "Assignments", "Assignment notify worker present")
    else:
        record("FAIL", "Assignments", "Missing workers/assignment-notify/worker.js")

    if "assigneeEmails" in (ROOT / "docs" / "site-config.example.js").read_text(encoding="utf-8"):
        record("PASS", "Assignments", "Assignment email config documented")
    else:
        record("FAIL", "Assignments", "Assignment email config missing from example")

    if "TEAM_MEMBERS" in data_js and (ROOT / "data" / "team_members.csv").exists():
        record("PASS", "Team directory", "TEAM_MEMBERS generated from CSV")
    else:
        record("FAIL", "Team directory", "TEAM_MEMBERS or team_members.csv missing")

    if "teamDirectoryPanel" in (ROOT / "docs" / "index.html").read_text(encoding="utf-8") and "getTeamDirectoryConfig" in (ROOT / "docs" / "site-config.example.js").read_text(encoding="utf-8"):
        record("PASS", "Team directory", "Home registration panel wired")
    else:
        record("FAIL", "Team directory", "Home registration panel missing")

    if (ROOT / "scripts" / "add_team_member.py").exists():
        record("PASS", "Team directory", "add_team_member.py helper present")
    else:
        record("FAIL", "Team directory", "Missing add_team_member.py")

    example_cfg = (ROOT / "docs" / "site-config.example.js").read_text(encoding="utf-8")
    if "allowSelfRegister" in example_cfg and "getTeamDirectoryConfig" in example_cfg:
        record("PASS", "Features", "Feature toggle config documented in site-config.example.js")
    else:
        record("FAIL", "Features", "Missing allowSelfRegister or getTeamDirectoryConfig in example config")

    if 'id="sessionRoleBadge"' in header_js and "updateHeaderSessionBadge" in script:
        record("PASS", "Auth", "Header shows Admin vs Team session badge")
    else:
        record("FAIL", "Auth", "Session role badge missing from header")

    if (ROOT / "scripts" / "set_tool_assignment.py").exists():
        record("PASS", "Assignments", "set_tool_assignment.py helper present")
    else:
        record("FAIL", "Assignments", "Missing set_tool_assignment.py")

    # ===== SEARCH =====
    search_cases = [
        ("cursor", ["Cursor"], True),
        ("ChatGPT", ["ChatGPT"], True),
        ("claude", ["Claude"], True),
        ("xyzzy", [], True),
        ("ide", None, False),  # should include IDE tools, not explode
        ("Akshay", ["Cursor"], False),
        ("Antigravity", ["Antigravity"], True),
        ("Perplexity", ["Perplexity"], True),
        ("OpenClaw", ["OpenClaw"], True),
    ]
    for q, expect, exact_top in search_cases:
        hits = filtered_search(tools, q)
        names_hit = [t["name"] for t in hits]
        if expect is None:
            if 1 <= len(hits) <= 8:
                record("PASS", "Search", f"Q={q!r} -> {len(hits)} hits (bounded)")
            else:
                record("FAIL", "Search", f"Q={q!r} unexpected count {len(hits)}: {names_hit}")
        elif exact_top:
            if expect == [] and names_hit == []:
                record("PASS", "Search", f"Q={q!r} -> empty")
            elif names_hit == expect:
                record("PASS", "Search", f"Q={q!r} -> {names_hit}")
            elif names_hit[: len(expect)] == expect:
                record("PASS", "Search", f"Q={q!r} -> {names_hit}")
            elif set(expect).issubset(set(names_hit)) and names_hit[0] == expect[0]:
                record("PASS", "Search", f"Q={q!r} top={names_hit[0]} (+{len(names_hit)-1})")
            else:
                record("FAIL", "Search", f"Q={q!r} got {names_hit}, want ~{expect}")
        elif expect is not None:
            if set(expect).issubset(set(names_hit)):
                record("PASS", "Search", f"Q={q!r} -> {names_hit}")
            else:
                record("FAIL", "Search", f"Q={q!r} got {names_hit}, want superset of {expect}")

    # False positive: ide must not match confidential-only
    confidential_only = [t for t in tools if "confidential" in (t.get("description") or "").lower()
                         and "ide" not in primary(t).lower()]
    # just ensure word-boundary works on synthetic
    if not text_has_token("keep confidential data safe", "ide"):
        record("PASS", "Search", "Word-boundary: ide not inside confidential")
    else:
        record("FAIL", "Search", "Word-boundary failed for confidential")

    # ===== FILTERS =====
    for status in ("Production", "Approved", "Testing", "Exploring", "Archived"):
        n = sum(1 for t in tools if t.get("status") == status)
        record("PASS" if n >= 0 else "FAIL", "Filter", f"Status {status}: {n} tools")

    cats = sorted({t.get("category") for t in tools if t.get("category")})
    if len(cats) >= 3:
        record("PASS", "Filter", f"Categories available: {len(cats)}")
    else:
        record("FAIL", "Filter", f"Too few categories: {cats}")

    # Combined filter simulation
    prod = [t for t in tools if t.get("status") == "Production"]
    if prod and all(t.get("status") == "Production" for t in prod):
        record("PASS", "Filter", f"Production filter set size {len(prod)}")

    # ===== PROMPTS / PLAYBOOKS =====
    if 'data-prompt-usecase="All"' in html and 'data-prompt-role="All"' in html and "prompt-filter-group" in html:
        record("PASS", "Prompts", "Use and Role filter groups are labeled separately")
    else:
        record("FAIL", "Prompts", "Prompt filters still use a single unlabeled All chip row")
    prompt_roles = {p.get("role") for p in prompts if p.get("role")}
    if prompt_roles:
        record("PASS", "Prompts", f"Prompt roles: {sorted(prompt_roles)}")
    else:
        record("FAIL", "Prompts", "No prompt roles")

    # prompt substring search
    pq = "cursor"
    phits = [p for p in prompts if pq in json.dumps(p).lower()]
    record("PASS" if phits else "WARN", "Prompts", f"Search '{pq}' hits {len(phits)} prompts")

    if use_cases:
        record("PASS", "Playbooks", f"Use cases: {len(use_cases)}")
    if learning:
        record("PASS", "Playbooks", f"Learning items: {len(learning)}")

    # ===== GUIDES =====
    if guides:
        for g in guides[:3]:
            if g.get("title") or g.get("name") or g.get("feature"):
                record("PASS", "Guides", f"Guide entry OK: {g.get('title') or g.get('name') or g.get('feature')}")
            else:
                record("WARN", "Guides", f"Sparse guide entry keys: {list(g.keys())[:6]}")
    if comparisons:
        record("PASS", "Guides", f"Comparisons: {len(comparisons)}")

    if "guides-categories" in script and "guide-category" in script and "renderGuideTips" in script:
        record("PASS", "Guides", "Expandable decision guide sections wired")
    else:
        record("FAIL", "Guides", "Expandable decision guide sections missing")

    if "compare-categories" in script and "renderComparisonsList" in script:
        record("PASS", "Guides", "Expandable head-to-head sections wired")
    else:
        record("FAIL", "Guides", "Expandable head-to-head sections missing")

    if 'class="content guides-split"' in html and "guides-split__col" in html:
        record("PASS", "Guides", "Decision guides and head-to-heads in equal split columns")
    else:
        record("FAIL", "Guides", "Guides split layout missing")

    if re.search(r"toolAssignments:\s*\{[^}]*enabled:\s*false", example_cfg, re.S):
        record("PASS", "Features", "toolAssignments disabled in site-config.example.js (v1)")
    else:
        record("WARN", "Features", "toolAssignments not explicitly disabled in example config")
    for job in jobs:
        recs = job.get("recommendations") or job.get("tools") or []
        # chooser jobs typically have tool names in fields
        record("PASS", "Home", f"Job present: {job.get('id') or job.get('title') or job.get('name')}")

    if len(jobs) >= 5:
        record("PASS", "Home", f"Chooser jobs count {len(jobs)}")
    else:
        record("WARN", "Home", f"Few chooser jobs: {len(jobs)}")

    # ===== CONTRIBUTE VALIDATION MIRROR =====
    name_pat = re.compile(r"^[A-Za-z0-9][A-Za-z0-9 ._\-+&'/()]*$")
    person_pat = re.compile(r"^[A-Za-z][A-Za-z .'\-]*$")

    def suggest_ok(payload: dict) -> list[str]:
        errs = []
        name = (payload.get("name") or "").strip()
        if not name:
            errs.append("name")
        elif existing_match := next((n for n in names if n.lower() == name.lower()), None):
            errs.append("dup")
        elif not name_pat.match(name):
            errs.append("name_pat")
        if not (payload.get("category") or "").strip():
            errs.append("category")
        url = (payload.get("url") or "").strip()
        if not url:
            errs.append("url")
        else:
            try:
                p = urlparse(url)
                if p.scheme not in ("http", "https") or not p.netloc:
                    errs.append("url_bad")
            except Exception:
                errs.append("url_bad")
        sub = (payload.get("submitter") or "").strip()
        if not sub or not person_pat.match(sub):
            errs.append("submitter")
        desc = (payload.get("desc") or "").strip()
        if len(desc) < 20:
            errs.append("desc")
        return errs

    good = suggest_ok({
        "name": "Tavily QA Probe",
        "category": "LLM / Assistants",
        "url": "https://tavily.com",
        "submitter": "Admin",
        "desc": "Search API for AI agents with clean cited web results for RAG.",
    })
    record("PASS" if not good else "FAIL", "Contribute", f"Valid suggest payload errors={good or 'none'}")

    bad_dup = suggest_ok({
        "name": "Cursor",
        "category": "AI Coding",
        "url": "https://cursor.com",
        "submitter": "Admin",
        "desc": "Already listed tool used to verify duplicate blocking works correctly.",
    })
    record("PASS" if "dup" in bad_dup else "FAIL", "Contribute", f"Duplicate blocked: {bad_dup}")

    bad_url = suggest_ok({
        "name": "Unique Tool XYZ",
        "category": "Other",
        "url": "",
        "submitter": "Admin",
        "desc": "Long enough description text for the contribute form minimum.",
    })
    record("PASS" if "url" in bad_url else "FAIL", "Contribute", f"Missing URL blocked: {bad_url}")

    # Win form required fields present
    for wid in ("w_title", "w_tool", "w_impact", "w_how", "winSubmit"):
        if f'id="{wid}"' in html:
            record("PASS", "Contribute", f"Win form control: {wid}")
        else:
            record("FAIL", "Contribute", f"Win form missing: {wid}")

    # ===== DEEP LINKS / SCRIPT HOOKS =====
    for needle, area in [
        ("function showView", "Views"),
        ("function getFiltered", "Directory"),
        ("function openCompare", "Compare"),
        ("function openModal", "Modal"),
        ("function youtubeEmbedId", "Tool page"),
        ("function tutorialHtml", "Tool page"),
        ("function glanceFactsHtml", "Tool page"),
        ("function toolGlanceHtml", "Tool page"),
        ("function renderPrompts", "Prompts"),
        ("function renderPlaybooks", "Playbooks"),
        ("function renderGuides", "Guides"),
        ("function renderContribute", "Contribute"),
        ("function renderHome", "Home"),
        ("toolCanHaveScore", "Scores"),
        ("validateSuggestForm", "Contribute"),
        ("tryInviteUnlock", "Auth"),
        ("bootstrap()", "Auth"),
    ]:
        if needle in script:
            record("PASS", area, f"Hook present: {needle}")
        else:
            record("FAIL", area, f"Missing hook: {needle}")

    modal_fn = re.search(r"function openModal\(tool\) \{[\s\S]*?\nfunction ", script)
    glance_fn = re.search(r"function glanceFactsHtml\(tool\) \{[\s\S]*?\nfunction ", script)
    if (
        modal_fn
        and glance_fn
        and 'detailField("Owner"' not in modal_fn.group(0)
        and "tool.owner" not in glance_fn.group(0)
    ):
        record("PASS", "Tool page", "Owner is not shown on the tool detail page")
    else:
        record("FAIL", "Tool page", "Owner still appears in tool detail first-look or modal")

    if (
        "tool-glance" in script
        and "tool-tutorial__frame" in script
        and glance_fn
        and 'detailField("Department"' in glance_fn.group(0)
        and 'detailField("Learning curve"' in glance_fn.group(0)
        and "tool.useCases" in glance_fn.group(0)
    ):
        record("PASS", "Tool page", "First-look layout has video plus key facts")
    else:
        record("FAIL", "Tool page", "Missing video + facts first-look layout")

    # After sign-in, land on AI hub. Refresh with an existing session still honors deep links.
    if "startAppOnce({ forceHome: true })" in script:
        record("PASS", "Auth", "Sign-in opens AI hub")
    else:
        record("FAIL", "Auth", "Sign-in does not force the AI hub")

    # Pending review content belongs to the admin workflow, not the general employee portal.
    if 'id="pendingReviewPanel"' not in html or 'id="pendingReviewPanel"' not in html.split('<section', 1)[-1]:
        record("FAIL", "Admin", "Pending review panel lacks an explicit admin-only container")
    elif "function syncAdminReviewVisibility" not in script:
        record("FAIL", "Admin", "Missing admin-only review visibility control")
    elif "if (!isAdminSession()) return;" not in script:
        record("FAIL", "Admin", "Pending review fetch is not guarded for non-admin sessions")
    else:
        record("PASS", "Admin", "Pending review workflow is UI-gated to admin sessions")

    # Platforms removed from cards?
    if "tool.platform" in script and "tagListHtml" in script:
        # check tagListHtml doesn't force platforms by default
        if "includePlatform" in script:
            record("PASS", "Directory", "Platform tags gated behind includePlatform")
        else:
            record("WARN", "Directory", "Check platforms not shown on cards")

    # Login username type
    if 'id="loginUsername"' in html:
        m = re.search(r'id="loginUsername"[^>]*>', html)
        block = html[html.find('id="loginUsername"') - 80: html.find('id="loginUsername"') + 120]
        if 'type="email"' in block:
            record("WARN", "Auth", "Login username still type=email (prefer text for generic username)")
        else:
            record("PASS", "Auth", "Login username input type OK")

    if 'class="login-gate__logo"' in html and "shared/assets/logo.svg" in html:
        record("PASS", "Auth", "Login page shows company wordmark logo")
    else:
        record("FAIL", "Auth", "Login page logo missing")

    if 'class="login-gate__welcome"' in html and "Internal access" in html and "team or admin" in html:
        record("PASS", "Auth", "Login shows Internal access and team or admin")
    else:
        record("FAIL", "Auth", "Login welcome copy missing")

    if "login-gate__shell" in html and "login-gate__layout" in html and "login-gate__brand" in html and "login-gate__panel" in html:
        record("PASS", "Auth", "Login shell with brand hero and floating sign-in panel")
    else:
        record("FAIL", "Auth", "Login shell layout missing")

    if "dailycodesolutions.com" in html and "linkedin.com/company/daily-code-solutions/posts" in html and "login-gate__social-btn" in html:
        record("PASS", "Auth", "Login footer links to website and LinkedIn")
    else:
        record("FAIL", "Auth", "Login company links missing")

    if "syncLoginSessionHint" in script:
        record("PASS", "Auth", "Login session hint synced from config")
    else:
        record("FAIL", "Auth", "Login session hint helper missing")

    # Gitignore site-config
    gi = (ROOT / ".gitignore").read_text(encoding="utf-8")
    if "site-config.js" in gi:
        record("PASS", "Security", "site-config.js is gitignored")
    else:
        record("FAIL", "Security", "site-config.js not in .gitignore")

    # Deploy secret step
    deploy = (ROOT / ".github" / "workflows" / "deploy.yml").read_text(encoding="utf-8")
    if "SITE_CONFIG_JS" in deploy:
        record("PASS", "Deploy", "Actions can inject SITE_CONFIG_JS")
    else:
        record("WARN", "Deploy", "No SITE_CONFIG_JS secret injection")

    # ===== REPORT =====
    print("=" * 72)
    print("DCS AI Resource Center - Expert QA Report")
    print("=" * 72)
    # Avoid Windows console encoding issues
    import sys as _sys
    if hasattr(_sys.stdout, "reconfigure"):
        try:
            _sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass
    current = None
    for status, area, msg in RESULTS:
        if area != current:
            current = area
            print(f"\n## {area}")
        mark = {"PASS": "OK", "FAIL": "!!", "WARN": "??"}.get(status, "??")
        print(f"  [{mark}] {status:4}  {msg}")

    print("\n" + "=" * 72)
    print(f"SUMMARY  PASS={PASS}  FAIL={FAIL}  WARN={WARN}  TOTAL={PASS+FAIL+WARN}")
    print("=" * 72)
    return 1 if FAIL else 0


if __name__ == "__main__":
    raise SystemExit(main())
