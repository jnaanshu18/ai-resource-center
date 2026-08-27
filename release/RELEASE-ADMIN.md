# DCS AI Resource Center — Admin Guide

**Site URL:** https://ai.dailycodesolutions.com/  
**Last updated:** 26 August 2026  

**For:** People who review tool suggestions and team wins on the site.  
**Not for:** General employees — share [RELEASE-EMPLOYEES.md](RELEASE-EMPLOYEES.md) with them instead.  
**Technical setup & deploy:** See [RELEASE-MAINTAINER.md](RELEASE-MAINTAINER.md) (site maintainer only).

---

## For v1 — main purpose for everyone (including admins)

**The number-one job at launch is to suggest AI tools** the team should evaluate.

That applies to **you as an admin too** — not only employees. Browse what you use or hear about, and add it to the queue. The more quality suggestions we collect in v1, the stronger the Directory becomes.

You can also **review** what others submit and **approve team wins** — but **suggesting tools comes first**.

---

## How to suggest a tool (start here)

1. Open https://ai.dailycodesolutions.com/ and sign in with **admin@dailycodesolutions.com**
2. Go to **Suggestions** → suggest form (or **Contribute** tab)
3. Enter **tool name**, **website URL** (required), and a short note on why the team should look at it
4. Submit — your suggestion appears in the queue as **New** (same as any employee submission)
5. You or another admin can **Review** it later (see below)

**Tip:** Suggest tools you personally use or want the team to try — don’t wait for someone else to add them.

**Data safety:** Never paste client secrets, personal data, or production credentials into the form.

---

## Sign in

1. Open https://ai.dailycodesolutions.com/
2. Sign in with **admin@dailycodesolutions.com** and the admin password (shared securely with admins only)
3. You land on **AI hub** — use the top navigation like any employee

**Keep admin credentials private.** Do not post them in public Slack channels or email threads.

---

## Your role

| Role | Login | What they do |
|------|-------|--------------|
| **Employee** | Shared team account or invite link | Browse the site, **suggest tools**, share wins |
| **Admin** | admin@dailycodesolutions.com | **Suggest tools** like everyone else, **plus** review the queue and approve team wins |

After sign-in, your header badge shows **Admin** (employees see **Team**).

---

## Review tool suggestions

Go to **Suggestions**. Each card in the queue has a **Review** button (admin only).

### Step 1 — Open Review

Click **Review** on a suggestion. You will see the tool name, link, who suggested it (if shown), and any notes.

### Step 2 — Choose an action

| Action | When to use it |
|--------|----------------|
| **Assign** | Hand the suggestion to someone on the team to evaluate. Pick a name and add an optional comment. Status becomes **In review**. |
| **Reject** | The tool is not a fit. You **must** add a comment explaining why. Status becomes **Rejected**. |
| **Add to Directory** | The tool is cleared for the team. Only available when status is **In review**. Opens a short catalog form. |

### Step 3 — Add to Directory (when approving)

Fill in the required fields (category, pricing, description, tutorial video URL). Click **Approve & queue publish**.

The site will:

1. Mark the suggestion **Approved** in the tracking sheet
2. Download a small **JSON file** to your computer

**Send that JSON file to the site maintainer.** They publish it to the live Directory (usually within a day). The tool will **not** appear in Directory until they do.

### Suggestion statuses (quick reference)

| Status | Meaning |
|--------|---------|
| **New** | Just submitted — assign someone or reject |
| **In review** | Someone is evaluating — approve for Directory or reject |
| **Approved** | Cleared — waiting for maintainer to publish live |
| **Rejected** | Not approved — reason is in the admin note |

---

## Approve team wins

When someone uses **Team stories → Share a win**, their story goes to a **Google Sheet** (Team wins tab).

1. Open the Team wins sheet (link from site maintainer)
2. Find the new row
3. Read the submission — check it has no client secrets or personal data
4. Set **Status** to **Approved**

Approved wins appear on **Team stories** on the site automatically. Reject or leave as pending if it needs edits — contact the submitter directly.

---

## Share access with employees

| Task | What to do |
|------|------------|
| Give employees site access | Share the **team** username and password securely (not in public channels) |
| Invite link | Ask the site maintainer to generate one if you use invite links |
| Rotate team password | Ask the site maintainer — they update it on the server |

---

## Remind the team

- **Directory** = tools DCS has already approved for use
- **Suggestions** = tools still being evaluated — not approved yet
- Never paste client data, passwords, or production secrets into AI tools or suggestion forms

---

## Employee announcement (copy-paste draft)

> **Subject:** DCS AI Resource Center is live  
>  
> We’ve launched an internal site to help you find AI tools DCS already trusts:  
> **https://ai.dailycodesolutions.com/**  
>  
> - **Directory** — approved tools with tutorials and compare  
> - **Choose a tool** — guides when you’re deciding between options  
> - **Prompts** — copy-ready prompts for common tasks  
> - **Team stories** — real examples from the team  
> - **Suggestions** — **propose tools for us to review (main ask for v1)**  
>  
> Sign in with the shared **team** credentials we’ve sent separately.  
> Questions? Reply in [your channel] or contact [admin name].

---

## When to contact the site maintainer

| Situation | They can help with |
|-----------|-------------------|
| Tool approved but not in Directory yet | Publish the JSON file you downloaded |
| Site won’t load or looks broken | Server / deploy issues |
| Login stopped working for everyone | Password or config update |
| Wrong text on a tool page | Update catalog data |
| Need a new admin password | Rotate admin credentials |
| Apps Script / sheet not receiving submissions | Backend integration |

---

## What’s on the site today (v1)

15 directory tools · 16 prompts · 10 team stories · 9 learning links · 7 comparisons · 10 AI hub jobs
