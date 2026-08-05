// Auto-generated from data/*.csv — do not edit by hand.
const TOOLS = [
  {
    "id": "AIT-001",
    "name": "ChatGPT",
    "category": "LLM / Assistants",
    "subcategory": "Chatbot",
    "pricing": "Freemium",
    "status": "Adopted",
    "url": "https://chatgpt.com",
    "description": "General-purpose conversational AI for writing, research, coding, brainstorming, and analysis.",
    "platform": [
      "Web",
      "Mobile",
      "API"
    ],
    "department": "Everyone",
    "useCases": [
      "General Chat",
      "Research",
      "Coding",
      "Documentation",
      "Email Writing"
    ],
    "learningCurve": "Low",
    "priority": "High",
    "dataClassification": "Internal",
    "owner": "Anshu Jain",
    "dateAdded": "2026-07-07",
    "lastReviewed": "2026-08-03",
    "notes": "Default general assistant for everyday work. Prefer Claude for long-document reasoning when context limits matter.",
    "limitations": "Weaker for very long documents versus Claude. Do not paste client secrets or confidential code into unapproved chats.",
    "whenToUse": "Everyday writing, brainstorming, quick coding help, and general Q&A.",
    "alternatives": "Claude for long documents; Perplexity when citations matter; Gemini for Workspace-heavy work.",
    "costNote": "Freemium; Plus/Team plans if you need higher limits and better models.",
    "securityTip": "Internal data only unless the workspace is explicitly approved. Never paste client secrets.",
    "approvedModels": [
      "GPT"
    ]
  },
  {
    "id": "AIT-002",
    "name": "Claude",
    "category": "LLM / Assistants",
    "subcategory": "Reasoning",
    "pricing": "Freemium",
    "status": "Adopted",
    "url": "https://claude.ai",
    "description": "Strong reasoning and long-context assistant for documents, analysis, coding, and careful writing.",
    "platform": [
      "Web",
      "Desktop",
      "API"
    ],
    "department": "Development",
    "useCases": [
      "General Chat",
      "Research",
      "Coding",
      "Documentation",
      "Report Writing"
    ],
    "learningCurve": "Low",
    "priority": "High",
    "dataClassification": "Internal",
    "owner": "Anshu Jain",
    "dateAdded": "2026-07-07",
    "lastReviewed": "2026-08-03",
    "notes": "Preferred for long documents and careful analysis. Strong context handling versus general chat tools.",
    "limitations": "Paid usage can add up at high volume. Prefer approved workspaces only for anything beyond Internal data.",
    "whenToUse": "Long-document analysis, careful writing, complex reasoning, and coding reviews.",
    "alternatives": "ChatGPT for everyday chat; Cursor for deep IDE work.",
    "costNote": "Freemium; Pro/Team recommended for heavy daily use.",
    "securityTip": "Prefer approved Anthropic workspaces. Keep Confidential client data off personal accounts.",
    "approvedModels": [
      "Claude"
    ]
  },
  {
    "id": "AIT-003",
    "name": "Gemini",
    "category": "LLM / Assistants",
    "subcategory": "Chatbot",
    "pricing": "Freemium",
    "status": "Adopted",
    "url": "https://gemini.google.com",
    "description": "Google multimodal assistant integrated with Workspace and search workflows for chat, docs, and media understanding.",
    "platform": [
      "Web",
      "Mobile",
      "API"
    ],
    "department": "Everyone",
    "useCases": [
      "General Chat",
      "Research",
      "Documentation",
      "Knowledge Management"
    ],
    "learningCurve": "Low",
    "priority": "Medium",
    "dataClassification": "Internal",
    "owner": "Anshu Jain",
    "dateAdded": "2026-07-07",
    "lastReviewed": "2026-08-03",
    "notes": "Approved for team use, especially Workspace and multimodal workflows. Not the primary default versus ChatGPT/Claude.",
    "limitations": "Still validating as a team default. Confirm Workspace data handling before using with client material.",
    "whenToUse": "Google Workspace workflows, multimodal understanding, and search-linked research.",
    "alternatives": "ChatGPT or Claude as primary assistants until Gemini is confirmed as a default.",
    "costNote": "Freemium via Google accounts; Advanced tiers may be needed for higher limits.",
    "securityTip": "Confirm Workspace/admin settings before using with client or regulated data.",
    "approvedModels": [
      "Gemini"
    ]
  },
  {
    "id": "AIT-004",
    "name": "GitHub Copilot",
    "category": "AI Coding",
    "subcategory": "Code Editor",
    "pricing": "Paid",
    "status": "Adopted",
    "url": "https://github.com/features/copilot",
    "description": "AI pair programmer for in-editor code completion, explanation, tests, and refactoring inside GitHub and IDEs.",
    "platform": [
      "Desktop",
      "CLI"
    ],
    "department": "Development",
    "useCases": [
      "Coding",
      "Code Review",
      "Debugging"
    ],
    "learningCurve": "Low",
    "priority": "Medium",
    "dataClassification": "Internal",
    "owner": "Anshu Jain",
    "dateAdded": "2026-07-07",
    "lastReviewed": "2026-08-03",
    "notes": "Solid baseline pair programmer in GitHub/IDEs. Cursor is the Production coding tool for deeper project-aware work.",
    "limitations": "Less project-aware than Cursor for multi-file work. Review all suggested code before merging.",
    "whenToUse": "Inline completions and light pair-programming inside GitHub/IDEs.",
    "alternatives": "Cursor for multi-file project work; Antigravity for agentic coding sessions.",
    "costNote": "Paid individual/business seats — confirm who is licensed.",
    "securityTip": "Disable training on sensitive repos if policy requires. Review every suggestion.",
    "approvedModels": [
      "GPT",
      "Claude"
    ]
  },
  {
    "id": "AIT-005",
    "name": "Cursor",
    "category": "AI Coding",
    "subcategory": "IDE",
    "pricing": "Paid",
    "status": "Production",
    "url": "https://cursor.com",
    "description": "AI-native IDE for code generation, multi-file editing, and project-aware assistance across large codebases.",
    "platform": [
      "Desktop"
    ],
    "department": "Development",
    "useCases": [
      "Coding",
      "Debugging",
      "Code Review",
      "Documentation"
    ],
    "learningCurve": "Medium",
    "priority": "Critical",
    "dataClassification": "Internal",
    "owner": "Anshu Jain",
    "dateAdded": "2026-07-07",
    "lastReviewed": "2026-08-03",
    "notes": "Core AI coding IDE for delivery. Strong team adoption and the default for multi-file, project-aware work.",
    "limitations": "License cost and cloud features need clear policy. Keep client secrets out of unapproved model routes.",
    "whenToUse": "Day-to-day software delivery, refactors, and project-aware coding.",
    "alternatives": "GitHub Copilot for lighter completion; Antigravity for agent-first workflows.",
    "costNote": "Paid seats — treat as a core Production license cost.",
    "securityTip": "Follow team rules for which models may see client code. No secrets in prompts.",
    "approvedModels": [
      "Claude",
      "GPT",
      "Gemini"
    ]
  },
  {
    "id": "AIT-006",
    "name": "Perplexity",
    "category": "LLM / Assistants",
    "subcategory": "Research Assistant",
    "pricing": "Freemium",
    "status": "Adopted",
    "url": "https://www.perplexity.ai",
    "description": "Research assistant with cited answers and fast web-grounded responses for discovery and fact checking.",
    "platform": [
      "Web",
      "Mobile",
      "API"
    ],
    "department": "Everyone",
    "useCases": [
      "Research",
      "Deep Research",
      "Learning"
    ],
    "learningCurve": "Low",
    "priority": "High",
    "dataClassification": "Internal",
    "owner": "Anshu Jain",
    "dateAdded": "2026-07-07",
    "lastReviewed": "2026-08-03",
    "notes": "Best first stop for cited web research. Prefer over plain LLM chat when sources matter.",
    "limitations": "Citations can still be wrong—verify sources. Not a substitute for primary research on critical claims.",
    "whenToUse": "Fast web research with citations and fact-finding before deeper analysis.",
    "alternatives": "ChatGPT/Claude for synthesis; NotebookLM for your own document packs.",
    "costNote": "Freemium; Pro helps with higher limits and better research modes.",
    "securityTip": "Do not paste confidential briefs into public research chats.",
    "approvedModels": [
      "GPT",
      "Claude",
      "Gemini"
    ]
  },
  {
    "id": "AIT-008",
    "name": "Notion AI",
    "category": "LLM / Assistants",
    "subcategory": "Knowledge Base",
    "pricing": "Paid",
    "status": "Adopted",
    "url": "https://www.notion.so/product/ai",
    "description": "Writing, summarization, and knowledge-base assistance inside Notion workspaces.",
    "platform": [
      "Web",
      "Desktop",
      "Mobile"
    ],
    "department": "Operations",
    "useCases": [
      "Documentation",
      "Knowledge Management",
      "Meeting Notes",
      "Email Writing"
    ],
    "learningCurve": "Low",
    "priority": "Medium",
    "dataClassification": "Internal",
    "owner": "Anshu Jain",
    "dateAdded": "2026-07-07",
    "lastReviewed": "2026-08-03",
    "notes": "Useful inside existing Notion workflows for summaries and drafting. Not a replacement for research or coding tools.",
    "limitations": "Only useful inside Notion; quality varies. Do not treat it as a dedicated research or coding tool.",
    "whenToUse": "Summaries, drafts, and light writing inside existing Notion workspaces.",
    "alternatives": "ChatGPT/Claude for heavier writing; NotebookLM for document Q&A outside Notion.",
    "costNote": "Paid Notion AI add-on — confirm workspace subscription.",
    "securityTip": "Respect Notion workspace permissions; do not move client data into personal Notion spaces.",
    "approvedModels": [
      "GPT",
      "Claude"
    ]
  },
  {
    "id": "AIT-009",
    "name": "OpenClaw",
    "category": "Agents & automation",
    "subcategory": "Desktop Agent",
    "pricing": "Open Source",
    "status": "Production",
    "url": "https://openclaw.ai",
    "description": "Self-hosted personal AI agent with messaging gateway, browser tools, persistent memory, and proactive automation.",
    "platform": [
      "Desktop",
      "CLI",
      "API"
    ],
    "department": "Automation",
    "useCases": [
      "API Integration",
      "Web Scraping",
      "Coding"
    ],
    "learningCurve": "High",
    "priority": "High",
    "dataClassification": "Internal",
    "owner": "Anshu Jain",
    "dateAdded": "2026-07-07",
    "lastReviewed": "2026-08-03",
    "notes": "Core self-hosted agent gateway across messaging channels. Keep client secrets off unapproved models.",
    "limitations": "Self-hosted agents can touch many systems—lock down channels and keep secrets off unapproved models.",
    "whenToUse": "Self-hosted personal/team agent across messaging channels and local automation.",
    "alternatives": "Hermes Agent for similar self-hosted agent work; n8n only as archived reference.",
    "costNote": "Open source software; you pay for hosting and the underlying model APIs.",
    "securityTip": "Lock down channel allowlists. Keep client secrets off unapproved models and logs.",
    "approvedModels": [
      "Claude",
      "GPT",
      "Gemini",
      "Llama",
      "DeepSeek"
    ]
  },
  {
    "id": "AIT-010",
    "name": "Hermes Agent",
    "category": "Agents & automation",
    "subcategory": "Self Hosted",
    "pricing": "Open Source",
    "status": "Production",
    "url": "https://hermes-agent.org",
    "description": "Open-source autonomous agent with persistent memory, self-improving skills, cron jobs, and multi-platform messaging gateway.",
    "platform": [
      "Desktop",
      "CLI",
      "API"
    ],
    "department": "Automation",
    "useCases": [
      "API Integration",
      "Coding",
      "Web Scraping"
    ],
    "learningCurve": "High",
    "priority": "High",
    "dataClassification": "Internal",
    "owner": "Anshu Jain",
    "dateAdded": "2026-07-07",
    "lastReviewed": "2026-08-03",
    "notes": "Core self-hosted agent for terminal, browser, and scheduled automations on our infrastructure.",
    "limitations": "Requires careful hosting and access control. Misconfigured agents can run unintended automations.",
    "whenToUse": "Self-hosted autonomous tasks, terminal/browser work, and scheduled agent jobs.",
    "alternatives": "OpenClaw for messaging-gateway style agents; OpenHands for sandboxed coding agents.",
    "costNote": "Open source; infrastructure and model API costs apply.",
    "securityTip": "Treat agent hosts as production systems—patch, restrict SSH, and audit tool permissions.",
    "approvedModels": [
      "Claude",
      "GPT",
      "Llama",
      "DeepSeek"
    ]
  },
  {
    "id": "AIT-011",
    "name": "NotebookLM",
    "category": "LLM / Assistants",
    "subcategory": "Knowledge Base",
    "pricing": "Free",
    "status": "Pilot",
    "url": "https://notebooklm.google.com",
    "description": "Google research assistant grounded in uploaded documents, notes, and sources with cited answers and audio overviews.",
    "platform": [
      "Web"
    ],
    "department": "Everyone",
    "useCases": [
      "Knowledge Management",
      "Research",
      "Documentation",
      "Learning"
    ],
    "learningCurve": "Low",
    "priority": "Medium",
    "dataClassification": "Internal",
    "owner": "Anshu Jain",
    "dateAdded": "2026-07-07",
    "lastReviewed": "2026-08-03",
    "notes": "Piloting for document Q&A, briefing packs, and knowledge synthesis. Do not upload client-confidential files without approval.",
    "limitations": "Do not upload client-confidential files without approval. Grounding quality depends on source quality.",
    "whenToUse": "Q&A and briefings grounded in uploaded docs, notes, and source packs.",
    "alternatives": "Perplexity for open web research; Dify for custom RAG apps.",
    "costNote": "Free tier via Google; watch Workspace policy for higher volume.",
    "securityTip": "Do not upload client-confidential files without approval.",
    "approvedModels": [
      "Gemini"
    ]
  },
  {
    "id": "AIT-014",
    "name": "CodeRabbit",
    "category": "AI Coding",
    "subcategory": "Code Review",
    "pricing": "Freemium",
    "status": "Testing",
    "url": "https://coderabbit.ai",
    "description": "AI code review assistant for pull requests with line-level feedback, security checks, and summarised review comments.",
    "platform": [
      "Web",
      "API"
    ],
    "department": "Development",
    "useCases": [
      "Code Review",
      "Debugging",
      "Security"
    ],
    "learningCurve": "Low",
    "priority": "High",
    "dataClassification": "Internal",
    "owner": "Anshu Jain",
    "dateAdded": "2026-07-07",
    "lastReviewed": "2026-08-03",
    "notes": "High-value PR review automation. Testing for line-level feedback, security checks, and review quality in Git workflows.",
    "limitations": "AI review can miss context or raise noise. Humans still own merge decisions and security sign-off.",
    "whenToUse": "Automated PR review assistance and first-pass code quality checks.",
    "alternatives": "Human review remains required; Cursor/Copilot for authoring code.",
    "costNote": "Freemium/paid seats depending on repo volume.",
    "securityTip": "Ensure PR content and secrets scanning policies are acceptable for your repos.",
    "approvedModels": [
      "GPT",
      "Claude"
    ]
  },
  {
    "id": "AIT-015",
    "name": "Julius AI",
    "category": "Data & BI",
    "subcategory": "Data Visualization",
    "pricing": "Freemium",
    "status": "Pilot",
    "url": "https://julius.ai",
    "description": "Conversational data analyst that uploads datasets, runs analysis, and generates charts and insights in plain language.",
    "platform": [
      "Web"
    ],
    "department": "Data Engineering",
    "useCases": [
      "Data Analysis",
      "Visualization",
      "Report Writing",
      "SQL"
    ],
    "learningCurve": "Low",
    "priority": "Medium",
    "dataClassification": "Internal",
    "owner": "Anshu Jain",
    "dateAdded": "2026-07-07",
    "lastReviewed": "2026-08-03",
    "notes": "Piloting for ad hoc CSV/spreadsheet analysis and quick visuals. Use sample or internal data only.",
    "limitations": "Use sample or Internal data only. Not a replacement for governed analytics pipelines.",
    "whenToUse": "Ad hoc CSV/spreadsheet exploration and quick charts in plain language.",
    "alternatives": "Power BI Copilot for governed BI; Python notebooks for repeatable analysis.",
    "costNote": "Freemium; paid plans for larger datasets and collaboration.",
    "securityTip": "Use sample or Internal data only—no production client extracts.",
    "approvedModels": [
      "GPT"
    ]
  },
  {
    "id": "AIT-017",
    "name": "n8n",
    "category": "Agents & automation",
    "subcategory": "Workflow Builder",
    "pricing": "Open Source",
    "status": "Archived",
    "url": "https://n8n.io",
    "description": "Open-source workflow automation platform for connecting APIs, triggers, and data pipelines with a visual node editor.",
    "platform": [
      "Web",
      "Desktop",
      "CLI",
      "API"
    ],
    "department": "Automation",
    "useCases": [
      "API Integration",
      "Web Scraping",
      "Data Analysis"
    ],
    "learningCurve": "Medium",
    "priority": "Low",
    "dataClassification": "Internal",
    "owner": "Anshu Jain",
    "dateAdded": "2026-07-07",
    "lastReviewed": "2026-08-03",
    "notes": "Previously used; kept for reference. Prefer newer agent-based automation where possible.",
    "limitations": "Archived for current needs; prefer agent-based automation where possible.",
    "whenToUse": "Reference only—legacy workflow automation patterns.",
    "alternatives": "Prefer OpenClaw/Hermes or modern agent pipelines for new work.",
    "costNote": "Open source; hosting costs if self-run.",
    "securityTip": "Rotate any old credentials still stored in archived workflows.",
    "approvedModels": []
  },
  {
    "id": "AIT-018",
    "name": "Gamma",
    "category": "Creative & productivity",
    "subcategory": "Presentation Generator",
    "pricing": "Freemium",
    "status": "Pilot",
    "url": "https://gamma.app",
    "description": "AI presentation builder that generates slide decks, documents, and webpages from prompts with editable layouts and themes.",
    "platform": [
      "Web"
    ],
    "department": "Management",
    "useCases": [
      "Presentation",
      "Report Writing",
      "Documentation"
    ],
    "learningCurve": "Low",
    "priority": "Medium",
    "dataClassification": "Internal",
    "owner": "Anshu Jain",
    "dateAdded": "2026-07-07",
    "lastReviewed": "2026-08-03",
    "notes": "Piloting for fast decks and client storytelling. Review branding before external use.",
    "limitations": "Review branding and accuracy before external decks. Generated layouts often need manual polish.",
    "whenToUse": "Fast internal decks and first-draft storytelling slides.",
    "alternatives": "PowerPoint/Google Slides for brand-locked client deliveries.",
    "costNote": "Freemium; paid for higher export limits and branding controls.",
    "securityTip": "Strip confidential metrics before uploading source material.",
    "approvedModels": [
      "GPT"
    ]
  },
  {
    "id": "AIT-020",
    "name": "OpenHands",
    "category": "AI Coding",
    "subcategory": "CLI Tool",
    "pricing": "Open Source",
    "status": "Planned",
    "url": "https://www.openhands.dev",
    "description": "Open-source autonomous software engineering agent that writes code, runs commands, and browses the web in a sandboxed environment.",
    "platform": [
      "Desktop",
      "CLI",
      "API"
    ],
    "department": "Development",
    "useCases": [
      "Coding",
      "Debugging",
      "API Integration"
    ],
    "learningCurve": "High",
    "priority": "Medium",
    "dataClassification": "Internal",
    "owner": "Anshu Jain",
    "dateAdded": "2026-07-07",
    "lastReviewed": "2026-08-03",
    "notes": "Queued autonomous coding agent. Revisit after Cursor and Antigravity capacity is stable.",
    "limitations": "Autonomous coding agents can change repos aggressively—use sandboxes and review every diff.",
    "whenToUse": "Sandboxed end-to-end coding agent experiments.",
    "alternatives": "Cursor/Antigravity for daily coding.",
    "costNote": "Open source; model API and sandbox compute costs apply.",
    "securityTip": "Run only in isolated environments. Review every diff before merge.",
    "approvedModels": [
      "Claude",
      "GPT",
      "DeepSeek"
    ]
  },
  {
    "id": "AIT-021",
    "name": "Browser Use",
    "category": "Scraping & browser",
    "subcategory": "Browser Agent",
    "pricing": "Open Source",
    "status": "Testing",
    "url": "https://browser-use.com",
    "description": "Open-source Python framework that lets LLM agents control browsers via natural language using Playwright under the hood.",
    "platform": [
      "CLI",
      "API"
    ],
    "department": "Automation",
    "useCases": [
      "Web Scraping",
      "API Integration",
      "Coding"
    ],
    "learningCurve": "High",
    "priority": "High",
    "dataClassification": "Internal",
    "owner": "Anshu Jain",
    "dateAdded": "2026-07-07",
    "lastReviewed": "2026-08-03",
    "notes": "High fit for Python browser automation and agent-driven scraping. Active test candidate with Playwright under the hood.",
    "limitations": "Scripted browsers can break on site changes and may violate site ToS—use responsibly on approved targets.",
    "whenToUse": "Python agent-driven browser automation and scraping prototypes.",
    "alternatives": "Firecrawl/Crawl4AI for content extraction; Apify for managed actors.",
    "costNote": "Open source; you pay for browsers, proxies, and model calls.",
    "securityTip": "Only automate approved targets. Respect ToS, rate limits, and credentials hygiene.",
    "approvedModels": [
      "GPT",
      "Claude",
      "Gemini"
    ]
  },
  {
    "id": "AIT-022",
    "name": "Antigravity",
    "category": "AI Coding",
    "subcategory": "IDE",
    "pricing": "Free",
    "status": "Production",
    "url": "https://antigravity.google/",
    "description": "Agentic development platform designed to help developers build, automate, and manage software projects using autonomous AI agents.",
    "platform": [
      "Web",
      "Desktop"
    ],
    "department": "Development",
    "useCases": [
      "Coding",
      "Debugging",
      "API Integration"
    ],
    "learningCurve": "Medium",
    "priority": "High",
    "dataClassification": "Internal",
    "owner": "Anshu Jain",
    "dateAdded": "2026-07-07",
    "lastReviewed": "2026-08-03",
    "notes": "Core agentic coding platform already used in delivery for vibe coding and accelerated development.",
    "limitations": "Fast agentic coding still needs human review. Confirm what data leaves the machine under current settings.",
    "whenToUse": "Agentic coding and accelerated development already used in delivery.",
    "alternatives": "Cursor for IDE-centric work; OpenHands for open-source agent sandboxes.",
    "costNote": "Free preview tiers may change—confirm current Google licensing for the team.",
    "securityTip": "Understand which code/context is sent to cloud models under your settings.",
    "approvedModels": [
      "Gemini",
      "Claude",
      "GPT"
    ]
  },
  {
    "id": "AIT-023",
    "name": "Firecrawl",
    "category": "Scraping & browser",
    "subcategory": "API Platform",
    "pricing": "Freemium",
    "status": "Testing",
    "url": "https://www.firecrawl.dev",
    "description": "API that turns websites into clean markdown or structured JSON for RAG, agents, and LLM pipelines.",
    "platform": [
      "Web",
      "API",
      "CLI"
    ],
    "department": "Automation",
    "useCases": [
      "Web Scraping",
      "API Integration",
      "Knowledge Management",
      "Research"
    ],
    "learningCurve": "Medium",
    "priority": "High",
    "dataClassification": "Internal",
    "owner": "Anshu Jain",
    "dateAdded": "2026-08-03",
    "lastReviewed": "2026-08-03",
    "notes": "Strong scraping-to-RAG fit. Testing as a cleaner path than brittle custom parsers for LLM-ready web content.",
    "limitations": "Scraping targets must be legally/contractually allowed. Output still needs cleaning before RAG use.",
    "whenToUse": "Turning allowed websites into clean markdown/JSON for RAG and agents.",
    "alternatives": "Crawl4AI for in-house Python crawls; Apify for managed scrapers.",
    "costNote": "Freemium API credits; paid plans for production volume.",
    "securityTip": "Scrape only permitted sources. Do not store sensitive crawled PII without a plan.",
    "approvedModels": []
  },
  {
    "id": "AIT-024",
    "name": "Apify",
    "category": "Scraping & browser",
    "subcategory": "Cloud",
    "pricing": "Freemium",
    "status": "Researching",
    "url": "https://apify.com",
    "description": "Cloud platform for web scraping and automation actors, useful for ecommerce monitoring, lead lists, and scheduled crawls.",
    "platform": [
      "Web",
      "API"
    ],
    "department": "Automation",
    "useCases": [
      "Web Scraping",
      "API Integration",
      "Data Analysis"
    ],
    "learningCurve": "Medium",
    "priority": "High",
    "dataClassification": "Internal",
    "owner": "Anshu Jain",
    "dateAdded": "2026-08-03",
    "lastReviewed": "2026-08-03",
    "notes": "Evaluating managed scraping actors for ecommerce monitoring and client crawl projects.",
    "limitations": "Actor costs and site ToS apply. Validate scraped data quality before client delivery.",
    "whenToUse": "Managed scraping actors for ecommerce monitoring and scheduled crawls.",
    "alternatives": "Firecrawl/Crawl4AI when you want tighter in-house control.",
    "costNote": "Freemium then usage-based actor/compute pricing.",
    "securityTip": "Store API tokens in secrets managers. Validate actor permissions and output retention.",
    "approvedModels": []
  },
  {
    "id": "AIT-025",
    "name": "Crawl4AI",
    "category": "Scraping & browser",
    "subcategory": "CLI Tool",
    "pricing": "Open Source",
    "status": "Testing",
    "url": "https://docs.crawl4ai.com",
    "description": "Open-source Python crawler built for LLMs—extracts clean, structured content from the web for RAG and agent pipelines.",
    "platform": [
      "CLI",
      "API"
    ],
    "department": "Automation",
    "useCases": [
      "Web Scraping",
      "Coding",
      "API Integration",
      "Knowledge Management"
    ],
    "learningCurve": "Medium",
    "priority": "High",
    "dataClassification": "Internal",
    "owner": "Anshu Jain",
    "dateAdded": "2026-08-03",
    "lastReviewed": "2026-08-03",
    "notes": "Python-native LLM crawler. Testing as an in-house companion to Browser Use for RAG-ready extraction.",
    "limitations": "Self-managed crawlers need rate limits and target approval. Not a turnkey compliance solution.",
    "whenToUse": "Python-native LLM-ready crawling inside your own pipelines.",
    "alternatives": "Firecrawl for hosted extraction; Browser Use when interaction is required.",
    "costNote": "Open source; hosting/proxy/model costs are yours.",
    "securityTip": "Enforce allowlists, rate limits, and robots/ToS policy in code reviews.",
    "approvedModels": []
  },
  {
    "id": "AIT-026",
    "name": "Ollama",
    "category": "LLM / Assistants",
    "subcategory": "Self Hosted",
    "pricing": "Open Source",
    "status": "Testing",
    "url": "https://ollama.com",
    "description": "Run open-source LLMs locally for private chat, coding help, and offline experiments without sending data to the cloud.",
    "platform": [
      "Desktop",
      "CLI",
      "API"
    ],
    "department": "Development",
    "useCases": [
      "General Chat",
      "Coding",
      "Research",
      "Learning"
    ],
    "learningCurve": "Medium",
    "priority": "High",
    "dataClassification": "Internal",
    "owner": "Anshu Jain",
    "dateAdded": "2026-08-03",
    "lastReviewed": "2026-08-03",
    "notes": "Testing local/private models when data should stay on-device. Not a quality replacement for Claude/ChatGPT.",
    "limitations": "Local model quality lags top cloud assistants. Still protect devices that hold sensitive prompts/files.",
    "whenToUse": "Local/private model experiments when data should stay on-device.",
    "alternatives": "Cloud ChatGPT/Claude for higher quality; approved private endpoints if available.",
    "costNote": "Free software; you provide GPU/CPU hardware.",
    "securityTip": "Secure the workstation. Local does not mean risk-free if disks or shares are exposed.",
    "approvedModels": [
      "Llama",
      "Mistral",
      "Qwen",
      "DeepSeek"
    ]
  },
  {
    "id": "AIT-027",
    "name": "Power BI Copilot",
    "category": "Data & BI",
    "subcategory": "Data Visualization",
    "pricing": "Paid",
    "status": "Testing",
    "url": "https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-introduction",
    "description": "Microsoft Copilot inside Power BI for natural-language report building, DAX help, and narrative summaries of visuals.",
    "platform": [
      "Desktop",
      "Web"
    ],
    "department": "Data Engineering",
    "useCases": [
      "Data Analysis",
      "Visualization",
      "Report Writing",
      "SQL"
    ],
    "learningCurve": "Medium",
    "priority": "High",
    "dataClassification": "Internal",
    "owner": "Anshu Jain",
    "dateAdded": "2026-08-03",
    "lastReviewed": "2026-08-03",
    "notes": "High relevance for DCS Power BI delivery. Confirm Fabric/Copilot licensing before promising on client projects.",
    "limitations": "Needs correct Fabric/Copilot licensing. Always validate DAX and numbers before publishing.",
    "whenToUse": "Natural-language report help, DAX assistance, and narrative summaries in Power BI.",
    "alternatives": "Julius for ad hoc files; standard Power BI authoring for governed releases.",
    "costNote": "Requires qualifying Fabric/Power BI Copilot capacity—confirm before promising clients.",
    "securityTip": "Respect dataset RLS and tenant settings. Validate every generated measure.",
    "approvedModels": [
      "GPT"
    ]
  },
  {
    "id": "AIT-028",
    "name": "Dify",
    "category": "Agents & automation",
    "subcategory": "Self Hosted",
    "pricing": "Open Source",
    "status": "Planned",
    "url": "https://dify.ai",
    "description": "Open-source platform to build and host RAG apps, chatbots, and agent workflows with a visual studio and APIs.",
    "platform": [
      "Web",
      "API",
      "Desktop"
    ],
    "department": "Development",
    "useCases": [
      "Knowledge Management",
      "API Integration",
      "Documentation",
      "Coding"
    ],
    "learningCurve": "High",
    "priority": "Medium",
    "dataClassification": "Internal",
    "owner": "Anshu Jain",
    "dateAdded": "2026-08-03",
    "lastReviewed": "2026-08-03",
    "notes": "Queued for client RAG demos and internal knowledge bots. Prefer after Firecrawl/Ollama path is clearer; self-host when needed.",
    "limitations": "Self-hosted RAG needs security hardening. Poor chunking/sources produce confident wrong answers.",
    "whenToUse": "Building self-hosted RAG chatbots and agent demos for clients or internal knowledge.",
    "alternatives": "NotebookLM for quick doc Q&A; custom app stacks when you need full control.",
    "costNote": "Open source core; cloud Dify and model APIs are paid.",
    "securityTip": "Harden the host, auth, and document store before any non-Internal data.",
    "approvedModels": [
      "GPT",
      "Claude",
      "Gemini",
      "Llama",
      "Mistral"
    ]
  },
  {
    "id": "AIT-030",
    "name": "v0",
    "category": "AI Coding",
    "subcategory": "Cloud",
    "pricing": "Freemium",
    "status": "Planned",
    "url": "https://v0.dev",
    "description": "Vercel AI tool that generates production-ready UI components and full screens from prompts, with export to React/Next.js.",
    "platform": [
      "Web"
    ],
    "department": "Development",
    "useCases": [
      "Coding",
      "Image Generation",
      "Documentation"
    ],
    "learningCurve": "Low",
    "priority": "Medium",
    "dataClassification": "Internal",
    "owner": "Anshu Jain",
    "dateAdded": "2026-08-03",
    "lastReviewed": "2026-08-03",
    "notes": "Queued for fast React/Next UI prototypes and client handoff. Keep exports for React/Next prototypes.",
    "limitations": "Generated UI is a starting point, not production-ready by default. Check accessibility and brand fit.",
    "whenToUse": "Fast React/Next UI prototypes and client mock handoffs.",
    "alternatives": "hand-coded components for production polish.",
    "costNote": "Freemium Vercel credits; paid for higher generation volume.",
    "securityTip": "Do not paste proprietary design systems or customer PII into prompts.",
    "approvedModels": [
      "GPT"
    ]
  }
];
const CATEGORIES = [
  "LLM / Assistants",
  "AI Coding",
  "Agents & automation",
  "Scraping & browser",
  "Data & BI",
  "Creative & productivity",
  "Other"
];
const COMPARISONS = [
  {
    "feature": "Code Completion",
    "tools": [
      "GitHub Copilot",
      "Cursor",
      "Claude"
    ],
    "winner": "Cursor",
    "notes": "Best project context"
  },
  {
    "feature": "Research",
    "tools": [
      "Perplexity",
      "ChatGPT",
      "Gemini"
    ],
    "winner": "Perplexity",
    "notes": "Best citations"
  }
];
const EVALUATIONS = {
  "ChatGPT": {
    "score": "4.5",
    "criteria": "Quality, Speed, Cost",
    "recommendation": "★★★★★",
    "date": "2026-07-07",
    "notes": "Strong general-purpose assistant",
    "evaluator": ""
  },
  "Claude": {
    "score": "4.7",
    "criteria": "Reasoning, Context, Safety",
    "recommendation": "★★★★★",
    "date": "2026-07-07",
    "notes": "Excellent for long documents",
    "evaluator": ""
  },
  "Cursor": {
    "score": "4.3",
    "criteria": "Coding, IDE Integration",
    "recommendation": "★★★★☆",
    "date": "2026-07-07",
    "notes": "High productivity for developers",
    "evaluator": ""
  },
  "Perplexity": {
    "score": "",
    "criteria": "Citations, Speed, Accuracy",
    "recommendation": "",
    "date": "2026-08-03",
    "notes": "Best first stop for cited web research when sources matter",
    "evaluator": ""
  },
  "GitHub Copilot": {
    "score": "",
    "criteria": "Code Completion, IDE Integration, Speed",
    "recommendation": "",
    "date": "2026-08-03",
    "notes": "Solid baseline pair programmer; Cursor preferred for deeper project-aware work",
    "evaluator": ""
  },
  "Notion AI": {
    "score": "",
    "criteria": "Writing, Summarization, Workspace Fit",
    "recommendation": "",
    "date": "2026-08-03",
    "notes": "Useful inside Notion for drafts and summaries; not a replacement for research or coding tools",
    "evaluator": ""
  },
  "OpenClaw": {
    "score": "",
    "criteria": "Autonomy, Integrations, Self-hosting",
    "recommendation": "",
    "date": "2026-08-03",
    "notes": "Team-adopted local agent gateway across messaging channels; keep secrets off unapproved models",
    "evaluator": ""
  },
  "Hermes Agent": {
    "score": "",
    "criteria": "Autonomy, Memory, Scheduling",
    "recommendation": "",
    "date": "2026-08-03",
    "notes": "Self-hosted agent for terminal browser and cron-style automations",
    "evaluator": ""
  },
  "Antigravity": {
    "score": "",
    "criteria": "Agent Coding, Speed, Team Adoption",
    "recommendation": "",
    "date": "2026-08-03",
    "notes": "In production use for agentic coding and accelerated development workflows",
    "evaluator": ""
  }
};
