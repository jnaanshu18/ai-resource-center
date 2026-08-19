"""Add Tutorial Video column to ai_tools_directory.csv.

Getting-started / tutorial videos for the tool detail page.
Prefer official product videos, then well-known beginner walkthroughs.
"""
import csv
from pathlib import Path
from urllib.parse import parse_qs, urlparse
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parent.parent
PATH = ROOT / "data" / "ai_tools_directory.csv"

VIDEOS = {
    "ChatGPT": "https://www.youtube.com/watch?v=jUv6Uq36O3c",
    "Claude": "https://www.youtube.com/watch?v=0vZ_UVLhSQQ",
    "Gemini": "https://www.youtube.com/watch?v=PDMcpthR88U",
    "GitHub Copilot": "https://www.youtube.com/watch?v=n0NlxUyA7FI",
    "Cursor": "https://www.youtube.com/watch?v=4IskO3BKwNY",
    "Perplexity": "https://www.youtube.com/watch?v=-jgxCRCfyJg",
    "Notion AI": "https://www.youtube.com/watch?v=a-lJXdZicfA",
    "OpenClaw": "https://www.youtube.com/watch?v=n1sfrc-RjyM",
    "Hermes Agent": "https://www.youtube.com/watch?v=mTYxpIRK7xA",
    "NotebookLM": "https://www.youtube.com/watch?v=OdCmZvPdr4s",
    "CodeRabbit": "https://www.youtube.com/watch?v=IqBKf4u5MtA",
    "Julius AI": "https://www.youtube.com/watch?v=ir8qShUBCco",
    "n8n": "https://www.youtube.com/watch?v=GuaKeDS6UKU",
    "Gamma": "https://www.youtube.com/watch?v=KcbXKUR7-a0",
    "OpenHands": "https://www.youtube.com/watch?v=ZglVZUe1VCU",
    "Browser Use": "https://www.youtube.com/watch?v=zGkVKix_CRU",
    "Antigravity": "https://www.youtube.com/watch?v=-0Irz8G0PEE",
    "Firecrawl": "https://www.youtube.com/watch?v=eH8JdttKIdA",
    "Apify": "https://www.youtube.com/watch?v=FHz48dx0Zgo",
    "Crawl4AI": "https://www.youtube.com/watch?v=JWfNLF_g_V0",
    "Ollama": "https://www.youtube.com/watch?v=xJu2DzQVmis",
    "Power BI Copilot": "https://www.youtube.com/watch?v=T1R9BSzpzLA",
    "Dify": "https://www.youtube.com/watch?v=dJ34OU_JY7Y",
    "v0": "https://www.youtube.com/watch?v=tFPGwS7Z0IA",
    "Windsurf": "https://www.youtube.com/watch?v=29N-1iki2Ls",
    "Make": "https://www.youtube.com/watch?v=sTHrxgxe-1k",
    "Lovable": "https://www.youtube.com/watch?v=CfwNxDEXe6I",
    "Exa": "https://www.youtube.com/watch?v=9ZQP7PfHnuI",
    "Raycast AI": "https://www.youtube.com/watch?v=O5qyJpQ8tzw",
    "Fireflies.ai": "https://www.youtube.com/watch?v=8NNEnT0UkBY",
    "Bolt.new": "https://www.youtube.com/watch?v=5zfOitaKfmM",
}


def youtube_id(url):
    parsed = urlparse(url)
    host = (parsed.hostname or "").lower()
    if "youtu.be" in host:
        return parsed.path.lstrip("/").split("/")[0]
    if "youtube" in host:
        qs = parse_qs(parsed.query)
        if qs.get("v"):
            return qs["v"][0]
        parts = [p for p in parsed.path.split("/") if p]
        if parts and parts[0] in ("embed", "shorts", "live") and len(parts) > 1:
            return parts[1]
    return ""


def verify_youtube(url):
    vid = youtube_id(url)
    if not vid:
        return False, "not a YouTube URL"
    oembed = f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={vid}&format=json"
    try:
        with urlopen(oembed, timeout=15) as resp:
            ok = 200 <= resp.status < 300
            return ok, "ok" if ok else f"status {resp.status}"
    except Exception as exc:
        return False, str(exc)


def main():
    with PATH.open(encoding="utf-8-sig", newline="") as f:
        rows = list(csv.DictReader(f))
        fieldnames = list(rows[0].keys()) if rows else []
    if "Tutorial Video" not in fieldnames:
        if "URL" in fieldnames:
            fieldnames.insert(fieldnames.index("URL") + 1, "Tutorial Video")
        else:
            fieldnames.append("Tutorial Video")

    failed = []
    for row in rows:
        name = (row.get("Tool Name") or "").strip()
        url = VIDEOS.get(name, row.get("Tutorial Video") or "")
        row["Tutorial Video"] = url
        if url:
            ok, reason = verify_youtube(url)
            status = "OK" if ok else f"FAIL ({reason})"
            print(f"{name}: {status} {url}")
            if not ok:
                failed.append(name)
        else:
            print(f"{name}: MISSING")
            failed.append(name)

    with PATH.open("w", encoding="utf-8", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)
    print("updated", PATH.name, "tools", len(rows), "problems", failed)


if __name__ == "__main__":
    main()
