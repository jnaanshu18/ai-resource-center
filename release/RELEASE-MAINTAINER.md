# DCS AI Resource Center — Maintainer Guide

**Release:** v1.0  
**Site URL:** https://ai.dailycodesolutions.com/  
**Last updated:** 26 August 2026  

**For:** Site maintainer(s) — deploy, config, CSV/git, scripts.  
**Share with admins:** [RELEASE-ADMIN.md](RELEASE-ADMIN.md) (review workflow only).  
**Share with employees:** [RELEASE-EMPLOYEES.md](RELEASE-EMPLOYEES.md).

---

## Roles

| Role | Login | Can do |
|------|-------|--------|
| **Employee** | Shared `team` account or invite link | Browse all tabs, suggest tools, share wins, compare tools |
| **Admin** | `admin@dailycodesolutions.com` | Review/assign/reject suggestions, approve wins in Sheet, queue Directory publish (JSON handoff to you) |
| **Maintainer** | (this guide) | Deploy, config secrets, publish Directory tools, fix integrations |

Login is a **soft gate** (shared password in browser storage). **Production must use Cloudflare Access** (or equivalent) for network-level protection.

---

## Publishing a tool to Directory

Admins approve in the UI and download a JSON file. You publish it:

```bash
python scripts/add_directory_tool.py --json directory-tool-name.json
python scripts/generate_site_data.py
git add data/ docs/data.js
git commit -m "Add [Tool name] to directory"
git push
```

Or edit `data/ai_tools_directory.csv` directly and push — GitHub Actions regenerates `docs/data.js`.

---

## Launch checklist

### Infrastructure
- [ ] DNS for `ai.dailycodesolutions.com` points to GitHub Pages
- [ ] GitHub **Settings → Pages → Source = GitHub Actions**
- [ ] Secret **`SITE_CONFIG_JS`** set with production config (`docs/site-config.production.js` template)
- [ ] `environment: "production"` in deployed config
- [ ] Cloudflare Access (or VPN) in front of production URL
- [ ] Push latest `main` and confirm Actions deploy succeeds

### Google Sheets / Apps Script
- [ ] DCS Apps Script deployed as web app (**Anyone** access)
- [ ] `submitUrl` and `winSubmit.submitUrl` set in production config
- [ ] `ASSIGN_SECRET` Script property matches `assignSecret` in config
- [ ] Submissions + Team wins tabs receiving test rows
- [ ] Published CSV URLs work (or `listWins` action tested)

### Auth
- [ ] Admin password hash updated and shared securely with admins only
- [ ] Employee (`team`) password shared securely with company — not in repo
- [ ] Invite token if using invite links: `python scripts/hash_auth_secret.py "token"`
- [ ] Test login on production in incognito (admin + team)

### Content
- [ ] `data/ai_tools_directory.csv` reviewed
- [ ] `data/tool_submissions.csv` queue current
- [ ] `data/team_use_cases.csv` + approved sheet wins reviewed
- [ ] `data/site_highlights.csv` — Start here + Tool of the week current
- [ ] Run `python scripts/generate_site_data.py` and commit if CSV changed

### Quality
- [ ] `python scripts/qa_full_site.py` — target **0 FAIL**
- [ ] `node --check docs/script.js`
- [ ] Smoke test all 6 nav tabs on production
- [ ] Test suggest-a-tool + share-a-win end-to-end
- [ ] Test tool compare end-to-end

### Communication
- [ ] Announce URL + team login to employees
- [ ] Share Employee Guide (Word/PDF) — not Maintainer guide
- [ ] Brief admins on [RELEASE-ADMIN.md](RELEASE-ADMIN.md) review workflow

---

## Deploy process

```
1. Edit data/*.csv  (or docs/*.js / css for UI)
2. python scripts/generate_site_data.py   ← only after CSV edits
3. git commit + push to main
4. GitHub Actions: regenerate data.js → deploy Pages (~2–3 min)
5. Optional: python scripts/qa_full_site.py
```

**Do not commit** `docs/site-config.js` — production config lives in GitHub secret `SITE_CONFIG_JS`.

---

## v1 scope — intentionally off

| Feature | Config / code | Enable when |
|---------|---------------|-------------|
| Tool assignment UI | `toolAssignments.enabled: false` | Ready to assign Testing/Exploring tools |
| Assignment email notify | `toolAssignments.notify.enabled: false` | Worker + Resend configured |
| Team self-registration | `teamDirectory.allowSelfRegister: false` | Want open signup form |
| Client-work + internal contact | `TOOL_TRUST_ROW_ENABLED = false` | Policy/contact data ready |
| Legacy full Add a tool form | `contribute.fullForm.enabled: false` | Not planned for v1 |

---

## QA status (26 Aug 2026)

```
python scripts/qa_full_site.py
→ PASS=190  FAIL=1  WARN=1  TOTAL=192
```

| Result | Item |
|--------|------|
| **FAIL** | Comparisons missing `scenario` field — cosmetic |
| **WARN** | No assignees in CSV (expected — assignments off for v1) |

---

## Security & compliance

- Passwords: **SHA-256 hashes** only — never plaintext in git
- `docs/site-config.js` and `docs/site-config.production.js` are **gitignored**
- Config injected at deploy via **`SITE_CONFIG_JS`** secret
- Rotate passwords: `python scripts/hash_auth_secret.py`, update `SITE_CONFIG_JS`, redeploy
- Login rate limit: 5 attempts → 60s lockout

---

## Support runbook

| Topic | Action |
|-------|--------|
| Site down / deploy failed | GitHub Actions → re-run workflow |
| Wrong tool data | Edit CSV → push |
| Admin JSON waiting to publish | `add_directory_tool.py --json` → push |
| Login issues | Rotate hash, update `SITE_CONFIG_JS`, redeploy |
| Apps Script errors | Sheet + Apps Script execution log |

**Commands**

```bash
python scripts/generate_site_data.py
python scripts/qa_full_site.py
python scripts/hash_auth_secret.py "new-password"
python scripts/add_team_member.py --name "Name" --email "name@domain.com"
python scripts/add_directory_tool.py --help
node --check docs/script.js
```

---

*Day-to-day editing: [README.md](README.md). Personal runbooks: `personal/` (local, gitignored).*
