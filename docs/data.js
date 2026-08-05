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
    "notes": "Best project context for multi-file work"
  },
  {
    "feature": "Research",
    "tools": [
      "Perplexity",
      "ChatGPT",
      "Gemini"
    ],
    "winner": "Perplexity",
    "notes": "Best citations for open-web fact-finding"
  },
  {
    "feature": "Everyday writing",
    "tools": [
      "ChatGPT",
      "Claude",
      "Gemini"
    ],
    "winner": "ChatGPT",
    "notes": "Fast default for drafts and brainstorming"
  },
  {
    "feature": "Long documents",
    "tools": [
      "Claude",
      "ChatGPT",
      "Gemini"
    ],
    "winner": "Claude",
    "notes": "Strongest long-context careful analysis"
  },
  {
    "feature": "Workspace multimodal",
    "tools": [
      "Gemini",
      "ChatGPT",
      "Claude"
    ],
    "winner": "Gemini",
    "notes": "Best fit when work lives in Google Workspace"
  },
  {
    "feature": "Agentic coding",
    "tools": [
      "Antigravity",
      "Cursor",
      "OpenHands"
    ],
    "winner": "Antigravity",
    "notes": "Already used in delivery for agent-first spikes"
  },
  {
    "feature": "Scraping to RAG",
    "tools": [
      "Firecrawl",
      "Crawl4AI",
      "Browser Use"
    ],
    "winner": "Firecrawl",
    "notes": "Clean hosted path to markdown/JSON for LLMs"
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
const CHOOSER_JOBS = [
  {
    "id": "JOB-001",
    "label": "Research with citations",
    "description": "Find current facts and sources before you write.",
    "tools": [
      "Perplexity"
    ],
    "tip": "Best first stop when sources matter — still verify citations."
  },
  {
    "id": "JOB-002",
    "label": "Everyday writing & brainstorming",
    "description": "Drafts emails notes ideas and quick Q&A.",
    "tools": [
      "ChatGPT"
    ],
    "tip": "Default general assistant for everyday work."
  },
  {
    "id": "JOB-003",
    "label": "Long docs & careful analysis",
    "description": "Reason over long documents reports or complex briefs.",
    "tools": [
      "Claude"
    ],
    "tip": "Preferred for long context careful writing and code review."
  },
  {
    "id": "JOB-004",
    "label": "Google Workspace & multimodal",
    "description": "Work inside Docs Drive Gmail or with images/video.",
    "tools": [
      "Gemini"
    ],
    "tip": "Use when the work lives in Google Workspace."
  },
  {
    "id": "JOB-005",
    "label": "Code in our repos",
    "description": "Multi-file coding refactors and project-aware help.",
    "tools": [
      "Cursor",
      "Antigravity"
    ],
    "tip": "Cursor for IDE work; Antigravity for agentic coding sessions."
  },
  {
    "id": "JOB-006",
    "label": "Scrape or browser automation",
    "description": "Turn websites into clean data or drive a browser with agents.",
    "tools": [
      "Firecrawl",
      "Crawl4AI",
      "Browser Use"
    ],
    "tip": "Only on approved targets — respect ToS and rate limits."
  },
  {
    "id": "JOB-007",
    "label": "Analyze data & Power BI",
    "description": "Ad hoc CSV exploration or Power BI report help.",
    "tools": [
      "Julius AI",
      "Power BI Copilot"
    ],
    "tip": "Julius for sample/internal files; Power BI Copilot inside Fabric."
  },
  {
    "id": "JOB-008",
    "label": "Q&A over our documents",
    "description": "Ask questions grounded in an uploaded doc pack.",
    "tools": [
      "NotebookLM"
    ],
    "tip": "Do not upload client-confidential files without approval."
  },
  {
    "id": "JOB-009",
    "label": "Fast first-draft decks",
    "description": "Generate a first-pass presentation to polish.",
    "tools": [
      "Gamma"
    ],
    "tip": "Review branding and accuracy before external use."
  },
  {
    "id": "JOB-010",
    "label": "Automate agents & workflows",
    "description": "Self-hosted agents across messaging terminal or browser.",
    "tools": [
      "OpenClaw",
      "Hermes Agent"
    ],
    "tip": "Lock down channels and keep secrets off unapproved models."
  }
];
const DECISION_GUIDES = [
  {
    "id": "GUIDE-001",
    "title": "Everyday AI assistants",
    "category": "Assistants",
    "summary": "Pick ChatGPT, Claude, Gemini, or Perplexity for the job.",
    "tips": [
      {
        "tool": "ChatGPT",
        "useWhen": "Everyday writing, brainstorming, quick coding help, and general Q&A.",
        "skipWhen": "When you need citations, very long documents, or Workspace-native workflows.",
        "order": 1
      },
      {
        "tool": "Claude",
        "useWhen": "Long-document analysis, careful writing, complex reasoning, and coding reviews.",
        "skipWhen": "When you mainly need live web citations or quick everyday chat.",
        "order": 2
      },
      {
        "tool": "Gemini",
        "useWhen": "Google Workspace workflows, multimodal understanding, and search-linked research.",
        "skipWhen": "As the team default for writing/reasoning until Workspace data handling is confirmed for client work.",
        "order": 3
      },
      {
        "tool": "Perplexity",
        "useWhen": "Fast web research with citations and fact-finding before deeper analysis.",
        "skipWhen": "When synthesizing your own docs, polishing prose, or deep coding — verify every citation.",
        "order": 4
      }
    ]
  },
  {
    "id": "GUIDE-002",
    "title": "Coding assistants",
    "category": "AI Coding",
    "summary": "Choose the right coding surface for the task.",
    "tips": [
      {
        "tool": "GitHub Copilot",
        "useWhen": "Inline completions and light pair-programming inside GitHub/IDEs.",
        "skipWhen": "Multi-file project-aware work — prefer Cursor.",
        "order": 1
      },
      {
        "tool": "Cursor",
        "useWhen": "Day-to-day software delivery, refactors, and project-aware coding.",
        "skipWhen": "When you want a fully agent-first session — try Antigravity.",
        "order": 2
      },
      {
        "tool": "Antigravity",
        "useWhen": "Agentic coding and accelerated development already used in delivery.",
        "skipWhen": "When you need tight IDE-centric control — prefer Cursor; review every agent change.",
        "order": 3
      },
      {
        "tool": "Claude",
        "useWhen": "Careful coding reviews and reasoning outside the IDE.",
        "skipWhen": "As a substitute for Cursor on multi-file repo work.",
        "order": 4
      }
    ]
  },
  {
    "id": "GUIDE-003",
    "title": "Research & knowledge",
    "category": "Research",
    "summary": "Match the research tool to your source of truth.",
    "tips": [
      {
        "tool": "Perplexity",
        "useWhen": "Open-web discovery and cited fact-finding.",
        "skipWhen": "Primary research you must verify from originals; confidential briefs.",
        "order": 1
      },
      {
        "tool": "NotebookLM",
        "useWhen": "Q&A and briefings grounded in uploaded docs, notes, and source packs.",
        "skipWhen": "Open-web research; client-confidential uploads without approval.",
        "order": 2
      },
      {
        "tool": "ChatGPT",
        "useWhen": "Synthesizing notes into drafts after you already have sources.",
        "skipWhen": "When citations or live web grounding are required.",
        "order": 3
      },
      {
        "tool": "Claude",
        "useWhen": "Deep analysis of long research packs and careful report writing.",
        "skipWhen": "Quick cited web lookup — start with Perplexity.",
        "order": 4
      }
    ]
  }
];
const PROMPTS = [
  {
    "id": "PRM-001",
    "title": "Meeting summary",
    "category": "Productivity",
    "useCase": "Meeting Notes",
    "text": "Summarize these meeting notes into: (1) decisions, (2) action items with owners and due dates, (3) open questions. Flag anything ambiguous.",
    "models": [
      "Claude",
      "ChatGPT"
    ],
    "owner": "Anshu Jain",
    "dateAdded": "2026-07-07",
    "role": "Everyone"
  },
  {
    "id": "PRM-002",
    "title": "Client email draft",
    "category": "Productivity",
    "useCase": "Email Writing",
    "text": "Draft a clear, professional client email. Tone: helpful and direct. Include a short subject line, 3–5 sentence body, and one clear ask or next step. Context: {{context}}",
    "models": [
      "ChatGPT",
      "Claude"
    ],
    "owner": "Anshu Jain",
    "dateAdded": "2026-08-05",
    "role": "Everyone"
  },
  {
    "id": "PRM-003",
    "title": "Code review checklist",
    "category": "AI Coding",
    "useCase": "Code Review",
    "text": "Review this diff like a senior engineer. List: (1) bugs or regressions, (2) security/secrets risks, (3) missing tests, (4) readability issues, (5) suggested fixes. Be specific to line-level changes.",
    "models": [
      "Claude",
      "Cursor"
    ],
    "owner": "Anshu Jain",
    "dateAdded": "2026-08-05",
    "role": "Engineering"
  },
  {
    "id": "PRM-004",
    "title": "Refactor plan",
    "category": "AI Coding",
    "useCase": "Coding",
    "text": "Given this codebase context, propose a safe refactor plan in small PRs. For each step: goal, files touched, risks, and how to verify. Prefer incremental changes over a big rewrite.",
    "models": [
      "Cursor",
      "Claude"
    ],
    "owner": "Anshu Jain",
    "dateAdded": "2026-08-05",
    "role": "Engineering"
  },
  {
    "id": "PRM-005",
    "title": "Scrape brief",
    "category": "Scraping & automation",
    "useCase": "Web Scraping",
    "text": "Turn this scraping request into a brief: target URLs, fields to extract, rate limits, ToS/robots constraints, output schema (JSON), and failure modes. Do not invent access to blocked pages.",
    "models": [
      "ChatGPT",
      "Claude"
    ],
    "owner": "Anshu Jain",
    "dateAdded": "2026-08-05",
    "role": "Engineering"
  },
  {
    "id": "PRM-006",
    "title": "Power BI narrative",
    "category": "Data & BI",
    "useCase": "Report Writing",
    "text": "Write a short executive narrative for this Power BI visual/metric set. Cover: what changed, why it might have changed, and 2 questions for the business owner. Do not invent numbers not present in the data.",
    "models": [
      "ChatGPT",
      "Power BI Copilot"
    ],
    "owner": "Anshu Jain",
    "dateAdded": "2026-08-05",
    "role": "Data"
  },
  {
    "id": "PRM-007",
    "title": "SQL explore",
    "category": "Data & BI",
    "useCase": "SQL",
    "text": "Given this table schema, propose 3 useful exploratory SQL queries and what each would teach us. Assume read-only access. Flag joins that could explode row counts.",
    "models": [
      "ChatGPT",
      "Claude"
    ],
    "owner": "Anshu Jain",
    "dateAdded": "2026-08-05",
    "role": "Data"
  },
  {
    "id": "PRM-008",
    "title": "Research brief",
    "category": "Research",
    "useCase": "Deep Research",
    "text": "Research {{topic}}. Return: key findings with sources, what is still uncertain, and a recommended next step for our team. Prefer primary sources over blogs.",
    "models": [
      "Perplexity"
    ],
    "owner": "Anshu Jain",
    "dateAdded": "2026-08-05",
    "role": "Everyone"
  },
  {
    "id": "PRM-009",
    "title": "RAG chunk plan",
    "category": "AI agents & RAG",
    "useCase": "Knowledge Management",
    "text": "Design a chunking and metadata plan for this document set for a RAG chatbot. Include chunk size guidance, metadata fields, and evaluation questions to catch hallucinations.",
    "models": [
      "Claude",
      "ChatGPT"
    ],
    "owner": "Anshu Jain",
    "dateAdded": "2026-08-05",
    "role": "Engineering"
  },
  {
    "id": "PRM-010",
    "title": "Status update",
    "category": "Productivity",
    "useCase": "Documentation",
    "text": "Rewrite these rough notes into a crisp weekly status update: Done / Doing / Blocked / Ask. Max 120 words. No fluff.",
    "models": [
      "ChatGPT",
      "Claude"
    ],
    "owner": "Anshu Jain",
    "dateAdded": "2026-08-05",
    "role": "Everyone"
  },
  {
    "id": "PRM-011",
    "title": "Deck outline",
    "category": "Creative & productivity",
    "useCase": "Presentation",
    "text": "Create a 6-slide outline for {{audience}} about {{topic}}. Each slide: title + 3 bullets max. End with a clear ask.",
    "models": [
      "ChatGPT",
      "Gamma"
    ],
    "owner": "Anshu Jain",
    "dateAdded": "2026-08-05",
    "role": "Management"
  },
  {
    "id": "PRM-012",
    "title": "Support reply",
    "category": "Productivity",
    "useCase": "Email Writing",
    "text": "Draft a support reply that acknowledges the issue, explains the next step, and sets expectation on timing. Empathetic but concise. Context: {{ticket}}",
    "models": [
      "Claude",
      "ChatGPT"
    ],
    "owner": "Anshu Jain",
    "dateAdded": "2026-08-05",
    "role": "Operations"
  },
  {
    "id": "PRM-013",
    "title": "Pre-prod leftover scan",
    "category": "AI Coding",
    "useCase": "Pre-prod checklist",
    "text": "Scan the current changes / open files / git diff for leftovers that must NOT ship to production. Flag and list with file + line guidance: (1) temporary test code or hard-coded test values, (2) debug logs console.log / print / debugger / TODO-test, (3) commented-out code left for 'just in case', (4) feature flags or if (false) / if (true) test branches, (5) mock data bypasses auth skips or forced returns, (6) secrets API keys or localhost URLs that should be env-based, (7) WIP comments like 'remove before prod' or 'testing only'. For each finding: severity (Blocker/Warn), why it is risky, and the exact cleanup action. If clean, say so explicitly. Do not refactor unrelated code.",
    "models": [
      "Cursor",
      "Antigravity",
      "Claude"
    ],
    "owner": "Anshu Jain",
    "dateAdded": "2026-08-05",
    "role": "Engineering"
  },
  {
    "id": "PRM-014",
    "title": "Pre-merge hygiene checklist",
    "category": "AI Coding",
    "useCase": "Pre-prod checklist",
    "text": "Before I open / merge this PR, review the diff like a production gate. Answer only: (1) Any test-only changes still present? (2) Any commented blocks that should be deleted not kept? (3) Any behavior that differs from production intent (hard-coded IDs, skip validation, sample data)? (4) Any logging that is too noisy or leaks sensitive data? (5) Missing cleanup commits I should make now? Output a short PASS / FAIL with a bullet list of required fixes. Prefer deleting dead test code over leaving it commented.",
    "models": [
      "Cursor",
      "Antigravity",
      "Claude"
    ],
    "owner": "Anshu Jain",
    "dateAdded": "2026-08-05",
    "role": "Engineering"
  },
  {
    "id": "PRM-015",
    "title": "Strip test scaffolding",
    "category": "AI Coding",
    "useCase": "Pre-prod checklist",
    "text": "Remove all temporary testing scaffolding from the current work while keeping the real feature intact. Delete (do not comment out): debug prints, temporary asserts used only for manual verification, hard-coded test inputs, bypassed checks, and 'testing' branches. Restore production paths (env config, real validation, proper error handling). Summarize what you removed and what you kept. Ask me before changing anything that looks like intentional production behavior.",
    "models": [
      "Cursor",
      "Antigravity"
    ],
    "owner": "Anshu Jain",
    "dateAdded": "2026-08-05",
    "role": "Engineering"
  },
  {
    "id": "PRM-016",
    "title": "Prod readiness after agent edits",
    "category": "AI Coding",
    "useCase": "Pre-prod checklist",
    "text": "We used Cursor / Antigravity for this change and may have left experimental edits. Re-read the modified files end-to-end for production readiness. Check: unused imports left from experiments, duplicate logic from try-then-keep both versions, mismatched names after renames, incomplete renames, dead code paths, and any 'temporary' comments. Produce: (A) blockers to fix before deploy, (B) nice-to-fix, (C) a minimal cleanup patch plan in order. Be strict — false confidence causes production issues.",
    "models": [
      "Cursor",
      "Antigravity",
      "Claude"
    ],
    "owner": "Anshu Jain",
    "dateAdded": "2026-08-05",
    "role": "Engineering"
  }
];
const USE_CASES = [
  {
    "id": "UC-001",
    "title": "Weekly report automation",
    "department": "Operations",
    "tool": "ChatGPT",
    "status": "Adopted",
    "owner": "Anshu Jain",
    "impact": "Saves ~2 hours per week drafting ops summaries",
    "date": "2026-07-07",
    "role": "Operations"
  },
  {
    "id": "UC-002",
    "title": "Code review assistant",
    "department": "Engineering",
    "tool": "Cursor",
    "status": "Adopted",
    "owner": "Anshu Jain",
    "impact": "Faster first-pass review consistency on PRs",
    "date": "2026-07-07",
    "role": "Engineering"
  },
  {
    "id": "UC-003",
    "title": "Customer email drafting",
    "department": "Operations",
    "tool": "Claude",
    "status": "Pilot",
    "owner": "Anshu Jain",
    "impact": "Faster response drafts with clearer tone",
    "date": "2026-07-07",
    "role": "Operations"
  },
  {
    "id": "UC-004",
    "title": "Cited competitor research",
    "department": "Everyone",
    "tool": "Perplexity",
    "status": "Adopted",
    "owner": "Anshu Jain",
    "impact": "Cuts discovery time before proposal writing",
    "date": "2026-08-05",
    "role": "Everyone"
  },
  {
    "id": "UC-005",
    "title": "Doc-pack briefings",
    "department": "Everyone",
    "tool": "NotebookLM",
    "status": "Pilot",
    "owner": "Anshu Jain",
    "impact": "Quick Q&A over internal briefing packs",
    "date": "2026-08-05",
    "role": "Everyone"
  },
  {
    "id": "UC-006",
    "title": "Agentic coding spikes",
    "department": "Engineering",
    "tool": "Antigravity",
    "status": "Production",
    "owner": "Anshu Jain",
    "impact": "Accelerates prototypes that humans then harden",
    "date": "2026-08-05",
    "role": "Engineering"
  },
  {
    "id": "UC-007",
    "title": "Website-to-RAG extraction",
    "department": "Engineering",
    "tool": "Firecrawl",
    "status": "Testing",
    "owner": "Anshu Jain",
    "impact": "Cleaner markdown/JSON for LLM pipelines",
    "date": "2026-08-05",
    "role": "Engineering"
  },
  {
    "id": "UC-008",
    "title": "Ad hoc CSV analysis",
    "department": "Data Engineering",
    "tool": "Julius AI",
    "status": "Pilot",
    "owner": "Anshu Jain",
    "impact": "Faster exploratory charts on sample datasets",
    "date": "2026-08-05",
    "role": "Data"
  }
];
const LEARNING = [
  {
    "id": "RES-001",
    "title": "Prompt Engineering Guide",
    "type": "Documentation",
    "skillLevel": "Intermediate",
    "role": "Everyone",
    "url": "https://platform.openai.com/docs/guides/prompt-engineering",
    "description": "Official OpenAI prompt engineering guide for clearer outputs.",
    "dateAdded": "2026-07-07"
  },
  {
    "id": "RES-002",
    "title": "Google AI Essentials",
    "type": "Course",
    "skillLevel": "Beginner",
    "role": "Everyone",
    "url": "https://grow.google/ai",
    "description": "Introductory AI course for business users and new joiners.",
    "dateAdded": "2026-07-07"
  },
  {
    "id": "RES-003",
    "title": "Claude Documentation",
    "type": "Documentation",
    "skillLevel": "Advanced",
    "role": "Engineering",
    "url": "https://docs.anthropic.com",
    "description": "Anthropic model and API documentation for deeper Claude use.",
    "dateAdded": "2026-07-07"
  },
  {
    "id": "RES-004",
    "title": "Cursor Docs",
    "type": "Documentation",
    "skillLevel": "Intermediate",
    "role": "Engineering",
    "url": "https://docs.cursor.com",
    "description": "How to use Cursor for project-aware coding and agents.",
    "dateAdded": "2026-08-05"
  },
  {
    "id": "RES-005",
    "title": "Perplexity Help Center",
    "type": "Documentation",
    "skillLevel": "Beginner",
    "role": "Everyone",
    "url": "https://www.perplexity.ai/hub",
    "description": "Tips for cited research and verifying sources.",
    "dateAdded": "2026-08-05"
  },
  {
    "id": "RES-006",
    "title": "Power BI Copilot docs",
    "type": "Documentation",
    "skillLevel": "Intermediate",
    "role": "Data",
    "url": "https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-introduction",
    "description": "Microsoft guidance for Copilot inside Power BI / Fabric.",
    "dateAdded": "2026-08-05"
  },
  {
    "id": "RES-007",
    "title": "NotebookLM overview",
    "type": "Documentation",
    "skillLevel": "Beginner",
    "role": "Everyone",
    "url": "https://support.google.com/notebooklm",
    "description": "How to ground answers in your own document packs.",
    "dateAdded": "2026-08-05"
  },
  {
    "id": "RES-008",
    "title": "OWASP LLM Top 10",
    "type": "Documentation",
    "skillLevel": "Intermediate",
    "role": "Engineering",
    "url": "https://owasp.org/www-project-top-10-for-large-language-model-applications/",
    "description": "Security risks to watch when building or using LLM apps.",
    "dateAdded": "2026-08-05"
  },
  {
    "id": "RES-009",
    "title": "Internal AI safety reminder",
    "type": "Playbook",
    "skillLevel": "Beginner",
    "role": "Everyone",
    "url": "https://daily-code-solutions.github.io/DCS-Resources/?view=guides",
    "description": "Never paste client secrets PII or production data into unapproved tools.",
    "dateAdded": "2026-08-05"
  }
];
