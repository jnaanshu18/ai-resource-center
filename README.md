# AI Resource Center — DCS AI Capability Draft

A centralized repository to discover, evaluate, compare, and share AI tools, prompts, workflows, learning resources, and team experiences.

**Objective:** improve AI adoption, reduce duplicate research, and help team members choose the right AI solution.

**Focus areas (Daily Code Solutions — AI Capability & Intelligence Center):** Python engineering • Ecommerce • Scraping & automation • ETL/ELT • Data analytics & Power BI • AI agents & RAG

**Repository Owner:** Anshu Jain

This project is a Git-friendly export of the "AI Resource Center — DCS AI Capability Draft" Google Sheet (each tab exported to CSV under `data/`), so it can be versioned, diffed, and reviewed like code.

## Structure

```
ai-resource-center/
├── README.md
├── SCORECARD.md              # DCS AI Scorecard summary (portfolio health, readiness, evidence)
└── data/
    ├── ai_tools_directory.csv     # Main tool inventory (22 tools)
    ├── tool_evaluation.csv        # Scored evaluations
    ├── tool_comparison.csv        # Head-to-head feature comparisons
    ├── team_use_cases.csv         # Documented team use cases
    ├── prompt_library.csv         # Reusable prompts
    ├── learning_resources.csv     # Courses, docs, tutorials
    ├── ai_news_releases.csv       # Tracked AI news items
    ├── ideas_backlog.csv          # Future enhancement ideas
    ├── contributors.csv           # Who contributed what
    ├── dashboard.csv              # Summary KPIs
    ├── reference_lists.csv        # Dropdown/source values (Categories, Status, etc.)
    └── dcs_reference_lists.csv    # DCS-specific controlled values
```

## Decision path
Research → Test with safe data → Pilot → Measure impact → Adopt, extend, reject, or archive.

## Data safety
Never use client secrets, API keys, production data, payment data, PII, or confidential client code in unapproved AI tools.

## Tool Status Guide
- **Planned** — on the radar, not started yet.
- **Researching** — exploring docs, demos, and alternatives.
- **Testing** — hands-on trial by team members.
- **Pilot** — controlled trial with a small group or time box.
- **Adopted** — approved for team use.
- **Production** — core, supported part of daily workflows.
- **Deprecated** — phasing out; do not start new work.
- **Archived** — no longer used; kept for history.
- **Rejected** — evaluated and decided not to use.

## Updating this repo
The Google Sheet remains the live collaborative source for the team. To sync changes into this repo:
1. Update the relevant tab(s) in the Google Sheet.
2. Export the updated tab(s) to CSV and replace the corresponding file(s) in `data/`.
3. Commit with a message describing what changed (e.g. `git commit -m "Update tool status: NotebookLM -> Adopted"`).

## Website

`docs/` contains a live, browsable directory of every tool — search, filter by status/category, click any card for full details. Plain HTML/CSS/JS, no framework, no backend.

**Setup (one-time):**
1. On GitHub: repo → **Settings → Pages → Build and deployment → Source → GitHub Actions**.
2. Push to `main`. The included workflow (`.github/workflows/deploy.yml`) regenerates `docs/data.js` from the CSV and publishes the site automatically.
3. Your site will be live at `https://daily-code-solutions.github.io/DCS-Resources/`.

**Updating the data that employees see:**
1. Edit `data/ai_tools_directory.csv` (or re-export it from the Google Sheet) and push to `main`.
2. That's it — the GitHub Action regenerates `docs/data.js` and redeploys automatically. Nothing to run locally.

To regenerate manually instead: `python3 scripts/generate_site_data.py`.

## Source
Exported from Google Sheets: *AI Resource Center — DCS AI Capability Draft*
