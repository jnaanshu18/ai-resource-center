# DCS AI Resource Center

Internal hub for Daily Code Solutions to discover **which AI tools we trust**, copy useful **prompts**, follow **playbooks**, and stop re-evaluating the same options twice.

**Live site (preview):** https://jnaanshu18.github.io/ai-resource-center/

**Production (after approval):** https://ai.dailycodesolutions.com/

**Owner:** Anshu Jain

**Focus areas:** Python engineering · Ecommerce · Scraping & automation · ETL/ELT · Data analytics & Power BI · AI agents & RAG

> **Hosting switch:** Contribute drafts go to the repo in `docs/site-config.js` (gitignored). Copy `docs/site-config.example.js` → `docs/site-config.js` and use SHA-256 hashes for password/invite (`python scripts/hash_auth_secret.py "secret"`). Keep `environment: "preview"` on the personal repo; set `"production"` when DCS is approved. For real access control on the live domain, use Cloudflare Access (see Deploy setup).

---

## What’s on the site

| Section | Purpose |
|---|---|
| **AI hub** | Job chooser (“what do you need to do?”); Start here / Tool of the week under a secondary fold |
| **Directory** | Full tool inventory — search, status buckets, side-by-side of 2–3 tools, detail modal |
| **Guides** | When-to-use / skip-when decision guides + documented head-to-head winners |
| **Prompts** | Searchable prompt library, role quick filters, Before production checklist, copy prompt / copy link |
| **Playbooks** | Team use cases + learning resources (search + role filters) |
| **Contribute** | Add a tool (for team Testing after admin approval) or share a win |

**Deep links (examples):**
- `?view=home|directory|guides|prompts|playbooks|contribute`
- `?job=JOB-010` — open AI hub with a job chooser selection
- `?tool=Cursor` or `?tool=AIT-005` — open a tool detail
- `?starter=1` — Directory Start here shortlist
- `?bucket=trusted` — Production + Approved tools
- `?status=Testing` — filter by status
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

Research → Testing with safe data → Measure impact → **Approved** / **Production**, or archive / reject.

### Tool status guide

| Status | Meaning |
|---|---|
| **Production** | Core daily workflow tool |
| **Approved** | Approved for team use |
| **Testing** | Being evaluated now |
| **Exploring** | On the radar, not day-to-day yet |
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

**Local preview:** copy `docs/site-config.example.js` to `docs/site-config.js`, then open `docs/index.html` via any static file server (or open the file in a browser).

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
| `reference_lists.csv` | Add-tool form categories (and related lists) |

---

## Deploy setup (one-time)

1. GitHub → repo **Settings → Pages → Build and deployment → Source → GitHub Actions**
2. Push to `main`
3. Preview site: https://jnaanshu18.github.io/ai-resource-center/
4. When moving to the company repo, set `environment: "production"` in `docs/site-config.js` and push there too.

### Soft login gate (client-side)

The username/password screen is a **soft gate** only. Anyone can still download `docs/` assets. Do not treat it as real security for confidential data.

**Local setup**

1. Copy `docs/site-config.example.js` → `docs/site-config.js`
2. Generate hashes (never commit plaintext passwords):

```bash
python scripts/hash_auth_secret.py "admin-password"
python scripts/hash_auth_secret.py "shared-employee-password"
python scripts/hash_auth_secret.py "your-invite-token"
```

3. Set `auth.passwordHash` (admin), `auth.employeePasswordHash` (shared team login), and optional `auth.inviteTokenHash`. Use `auth.username` for admin and `auth.employeeUsername` for the shared employee account (default `team`). Set a unique `auth.sessionSalt`. Default session length is **7 days**.

**Who sees what**

| Login | Sees |
|---|---|
| Admin (`auth.username`) | Full site + pending approval panel on Contribute |
| Employee (`auth.employeeUsername`) | Full site — directory, guides, contribute, no admin panel |
| Invite link (`?invite=…`) | Same as employee login |

**Deploy secret (GitHub Actions)**

- Repo → **Settings → Secrets → Actions** → add `SITE_CONFIG_JS` with the full contents of your real `docs/site-config.js`
- Deploy uses that secret when present; otherwise it falls back to the example file

### Real protection for production (`ai.dailycodesolutions.com`)

Put auth **in front of** the static site before company-wide release:

1. Put the domain behind **Cloudflare** (or similar)
2. Enable **Cloudflare Access** — allow `@dailycodesolutions.com` (Google Workspace / email OTP)
3. Optionally set `auth.enabled: false` in site-config once Access is on (avoid double login)

Client-only login cannot hide `data.js`. Prefer Access (or SSO) for anything sensitive.

### Custom domain (`ai.dailycodesolutions.com`)

1. In the **company** GitHub repo (Pages settings), set custom domain to `ai.dailycodesolutions.com` and enable HTTPS.
2. At your DNS provider, add a **CNAME** record: `ai` → `daily-code-solutions.github.io` (use the org/user Pages host GitHub shows).
3. Wait for DNS + GitHub certificate, then open https://ai.dailycodesolutions.com/
4. In `docs/site-config.js`, set `environment: "production"` so Contribute drafts and pending queue point at the company repo.

### Personal notes (not in git)

Put local-only checklists and runbooks in **`personal/`** (gitignored). Examples: launch guide, feature toggles, production checklist. Add any future personal files there — no need to update `.gitignore`.

---

## Source

Content originated from Google Sheets: *AI Resource Center — DCS AI Capability Draft*. The CSVs under `data/` are the versioned source used by this repo and the live site.
