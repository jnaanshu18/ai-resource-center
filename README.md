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
├── data/
│   ├── ai_tools_directory.csv     # Main tool inventory
│   ├── tool_evaluation.csv
│   ├── tool_comparison.csv        # Head-to-head winners
│   ├── chooser_jobs.csv           # Home “what do you need?” jobs
│   ├── decision_guides.csv        # When to use / skip guides
│   ├── team_use_cases.csv
│   ├── prompt_library.csv
│   ├── learning_resources.csv
│   └── reference_lists.csv        # Controlled lists (categories, etc.)
├── scripts/generate_site_data.py  # CSV → docs/data.js
└── docs/                          # GitHub Pages site
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

`docs/` is a multi-section internal hub (plain HTML/CSS/JS, no framework):

- **Home** — job chooser, Start here shortlist, Tool of the week
- **Directory** — search/filter/compare the full tool inventory
- **Compare** — when-to-use guides + documented head-to-heads
- **Prompts** — copyable team prompt library
- **Playbooks** — use cases + learning by role
- **Contribute** — suggest a tool or share a win (GitHub issue drafts)

**Setup (one-time):**
1. On GitHub: repo → **Settings → Pages → Build and deployment → Source → GitHub Actions**.
2. Push to `main`. The included workflow (`.github/workflows/deploy.yml`) regenerates `docs/data.js` from the CSV and publishes the site automatically.
3. Your site will be live at `https://daily-code-solutions.github.io/DCS-Resources/`.

**Updating the data that employees see:**
1. Edit CSVs under `data/` (tools, prompts, use cases, learning, chooser jobs, decision guides, comparisons) or re-export from the Google Sheet, then push to `main`.
2. That's it — the GitHub Action regenerates `docs/data.js` and redeploys automatically. Nothing to run locally.

To regenerate manually instead: `python3 scripts/generate_site_data.py`.

Deep links: `?view=home|directory|guides|prompts|playbooks|contribute`, plus existing `?tool=`, `?starter=1`, filters, and `?tab=win` on Contribute.

## Source
Exported from Google Sheets: *AI Resource Center — DCS AI Capability Draft*
