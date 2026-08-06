# DCS AI Resource Center

Internal hub for Daily Code Solutions to discover **which AI tools we trust**, copy useful **prompts**, follow **playbooks**, and stop re-evaluating the same options twice.

**Live site (preview):** https://jnaanshu18.github.io/ai-resource-center/

**Production (after approval):** https://daily-code-solutions.github.io/DCS-Resources/

**Owner:** Anshu Jain

**Focus areas:** Python engineering · Ecommerce · Scraping & automation · ETL/ELT · Data analytics & Power BI · AI agents & RAG

> **Hosting switch:** Contribute drafts (Suggest a tool / Share a win) go to the repo set in `docs/site-config.js`. Keep `environment: "preview"` while testing on the personal repo; set `"production"` when Daily Code Solutions is approved — one line change.

---

## What’s on the site

| Section | Purpose |
|---|---|
| **AI hub** | Job chooser (“what do you need to do?”); Start here / Tool of the week under a secondary fold |
| **Directory** | Full tool inventory — search, status buckets, side-by-side of 2–3 tools, detail modal |
| **Guides** | When-to-use / skip-when decision guides + documented head-to-head winners |
| **Prompts** | Searchable prompt library, role quick filters, Before production checklist, copy prompt / copy link |
| **Playbooks** | Team use cases + learning resources (search + role filters) |
| **Contribute** | Suggest a tool or share a win (creates a review draft) |

**Deep links (examples):**
- `?view=home|directory|guides|prompts|playbooks|contribute`
- `?job=JOB-010` — open AI hub with a job chooser selection
- `?tool=Cursor` or `?tool=AIT-005` — open a tool detail
- `?starter=1` — Directory Start here shortlist
- `?bucket=trusted` — Trusted tools (Adopted / Production)
- `?view=prompts&pid=PRM-013` — jump to a prompt
- `?view=prompts&pq=production` — prompt keyword search
- `?view=playbooks&bq=report` — playbook search
- `?view=contribute&tab=win` — Share a win form
- `?compare=1` — Directory side-by-side mode

Stack: plain HTML / CSS / vanilla JS in `docs/` (no framework). Data is generated into `docs/data.js` from CSVs.

---

## Repository structure

```
ai-resource-center/
├── README.md
├── .github/workflows/deploy.yml   # Regenerate data.js + GitHub Pages deploy
├── data/                          # Source of truth (edit these)
│   ├── ai_tools_directory.csv     # Tool inventory
│   ├── tool_evaluation.csv        # Optional scores / notes per tool
│   ├── tool_comparison.csv        # Head-to-head winners
│   ├── chooser_jobs.csv           # Home job → tool recommendations
│   ├── decision_guides.csv        # Compare tab use-when / skip-when
│   ├── prompt_library.csv         # Prompt library
│   ├── team_use_cases.csv         # Playbooks — use cases
│   ├── learning_resources.csv     # Playbooks — learning links
│   ├── site_highlights.csv        # Start here shortlist + optional Tool of the week
│   └── reference_lists.csv        # Controlled lists (e.g. categories)
├── scripts/
│   └── generate_site_data.py      # CSV → docs/data.js
└── docs/                          # Published site (GitHub Pages)
    ├── index.html
    ├── style.css
    ├── script.js
    ├── data.js                    # Auto-generated — do not edit by hand
    └── shared/                    # Temporary DCS header chrome
```

### Current data snapshot (from generator)

| Source | Count |
|---|---|
| Tools | 24 |
| Categories | 7 |
| Comparisons | 7 |
| Evaluations | 9 |
| Chooser jobs | 10 |
| Decision guides | 3 |
| Prompts | 16 |
| Use cases | 8 |
| Learning resources | 9 |

---

## Decision path

Research → Test with safe data → Pilot → Measure impact → **Adopt**, extend, reject, or archive.

### Tool status guide

| Status | Meaning |
|---|---|
| **Planned** | On the radar, not started |
| **Researching** | Exploring docs, demos, alternatives |
| **Testing** | Hands-on trial |
| **Pilot** | Small-group / time-boxed trial |
| **Adopted** | Approved for team use |
| **Production** | Core daily workflow tool |
| **Deprecated** | Phasing out — don’t start new work |
| **Archived** | No longer used — kept for history |
| **Rejected** | Evaluated and declined |

---

## Data safety

Never paste client secrets, API keys, production data, payment data, PII, or confidential client code into unapproved AI tools or into Contribute drafts.

---

## Updating content

1. Edit the relevant file(s) under `data/` (or re-export from the Google Sheet and replace the CSV).
2. Push to `main`.
3. GitHub Actions runs `scripts/generate_site_data.py`, updates `docs/data.js` if needed, and deploys `docs/` to Pages.

**Manual regenerate (optional):**

```bash
python scripts/generate_site_data.py
```

**Local preview:** open `docs/index.html` via any static file server (or open the file in a browser).

### Which CSV feeds what

| CSV | Powers |
|---|---|
| `ai_tools_directory.csv` | Directory, Home shortlist / Tool of the week, tool modals |
| `chooser_jobs.csv` | Home job chooser |
| `decision_guides.csv` | Guides — decision guides |
| `tool_comparison.csv` | Guides — head-to-heads + Directory side-by-side notes |
| `tool_evaluation.csv` | Ratings / eval notes on tool details |
| `prompt_library.csv` | Prompts tab |
| `team_use_cases.csv` | Playbooks — use cases |
| `learning_resources.csv` | Playbooks — learning |
| `site_highlights.csv` | Home Start here shortlist; optional fixed Tool of the week (`Kind=Tool of the week`) |
| `reference_lists.csv` | Suggest-form categories (and related lists) |

---

## Deploy setup (one-time)

1. GitHub → repo **Settings → Pages → Build and deployment → Source → GitHub Actions**
2. Push to `main`
3. Preview site: https://jnaanshu18.github.io/ai-resource-center/
4. When moving to the company repo, set `environment: "production"` in `docs/site-config.js` and push there too.

---

## Source

Content originated from Google Sheets: *AI Resource Center — DCS AI Capability Draft*. The CSVs under `data/` are the versioned source used by this repo and the live site.
