# DCS AI Resource Center

Internal site for Daily Code Solutions — find approved AI tools, prompts, playbooks, and suggest new tools for the team to review.

| | URL |
|---|---|
| **Production** | https://ai.dailycodesolutions.com/ |
| **Preview** | https://jnaanshu18.github.io/ai-resource-center/ |

Static site in `docs/`. Tool data is generated from CSVs in `data/` into `docs/data.js` on every push to `main`.

---

## Quick start

**New to the repo**

1. Clone the repo and open `docs/index.html` with a local static server (or use the preview URL above).
2. Copy config: `docs/site-config.example.js` → `docs/site-config.js` (gitignored).
3. Set login hashes: `python scripts/hash_auth_secret.py "your-password"` → paste into `site-config.js`.
4. Regenerate data after CSV edits: `python scripts/generate_site_data.py`.

**Updating content**

1. Edit files in `data/`.
2. Push to `main` — GitHub Actions regenerates `docs/data.js` and deploys Pages.
3. Optional check: `python scripts/qa_full_site.py`

**Login (v1)**

| Account | Purpose |
|---|---|
| Admin | Full site + admin controls |
| Employee (`team` + shared password) | Browse, suggest tools, share wins |
| Invite link (`?invite=…`) | Same as employee |

The login screen is a soft gate only — use Cloudflare Access on production for real protection.

---

## What’s on the site

| Nav | What it is |
|---|---|
| **AI hub** | Job chooser, Start here, Tool of the week |
| **Directory** | Approved tools (Production, Approved, Archived) — search, compare, detail pages |
| **Guides** | When to use / skip guides and head-to-head comparisons |
| **Prompts** | Searchable prompt library |
| **Playbooks** | Team use cases and learning links |
| **Suggestions** | Tool queue (New / In review / Rejected), suggest a tool, share a win |

Tools being evaluated live on **Suggestions**, not in the Directory, until an admin adds them to `data/ai_tools_directory.csv`.

---

## Tool statuses

| Status | Where |
|---|---|
| **Production** | Directory — core daily tools |
| **Approved** | Directory — cleared for team use |
| **Archived** | Directory — kept for history |
| **New / In review / Rejected** | Suggestions queue (`data/tool_submissions.csv`) |

---

## Configuration (`docs/site-config.js`)

Copy from `site-config.example.js`. Never commit real secrets.

| Setting | Purpose |
|---|---|
| `environment` | `"preview"` or `"production"` |
| `auth.*` | Login hashes and session settings |
| `contribute.simpleSubmit` | Google Apps Script URL for tool suggestions |
| `contribute.winSubmit` | Apps Script URL for share-a-win |

For production deploy, paste the full `site-config.js` into the GitHub Actions secret **`SITE_CONFIG_JS`**.

Apps Script templates: `scripts/tool_submissions_apps_script.js`, `scripts/team_wins_apps_script.js`.

---

## Deploy (maintainers)

1. Repo **Settings → Pages → GitHub Actions** as the source.
2. Add secret **`SITE_CONFIG_JS`** with production config.
3. Push to `main`.
4. Point DNS for `ai.dailycodesolutions.com` at GitHub Pages (CNAME to your org Pages host).

---

## Repository layout

```
data/                  CSV source of truth
scripts/
  generate_site_data.py   CSV → docs/data.js
  qa_full_site.py         Automated checks
  hash_auth_secret.py     Password / invite hashes
docs/                  Published site (HTML, CSS, JS)
  data.js              Generated — do not edit by hand
  site-config.js       Local secrets (gitignored)
.github/workflows/     Deploy on push to main
```

**Main CSVs**

| File | Powers |
|---|---|
| `ai_tools_directory.csv` | Directory + tool detail pages |
| `tool_submissions.csv` | Suggestions queue |
| `prompt_library.csv` | Prompts |
| `team_use_cases.csv` / `learning_resources.csv` | Playbooks |
| `chooser_jobs.csv` | AI hub job chooser |
| `decision_guides.csv` / `tool_comparison.csv` | Guides |
| `site_highlights.csv` | Start here + Tool of the week |
| `team_members.csv` | Team roster (assignments / admin) |

---

## Data safety

Do not paste client secrets, production data, or confidential code into AI tools or suggestion forms.

---

## Useful commands

```bash
python scripts/generate_site_data.py
python scripts/qa_full_site.py
python scripts/hash_auth_secret.py "secret"
python scripts/add_team_member.py --name "Name" --email "name@dailycodesolutions.com"
node --check docs/script.js
```

Personal runbooks and notes: `personal/` (gitignored).
