// Auto-generated from data/*.csv — do not edit by hand.
const TOOLS = [
  {
    "id": "AIT-001",
    "name": "ChatGPT",
    "category": "LLM / Assistants",
    "subcategory": "Chatbot",
    "pricing": "Freemium",
    "status": "Approved",
    "url": "https://chatgpt.com",
    "videoUrl": "https://www.youtube.com/watch?v=jUv6Uq36O3c",
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
    "owner": "Admin",
    "assignedTo": "",
    "testingNotes": "",
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
    "status": "Approved",
    "url": "https://claude.ai",
    "videoUrl": "https://www.youtube.com/watch?v=0vZ_UVLhSQQ",
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
    "owner": "Admin",
    "assignedTo": "",
    "testingNotes": "",
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
    "status": "Approved",
    "url": "https://gemini.google.com",
    "videoUrl": "https://www.youtube.com/watch?v=PDMcpthR88U",
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
    "owner": "Admin",
    "assignedTo": "",
    "testingNotes": "",
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
    "status": "Approved",
    "url": "https://github.com/features/copilot",
    "videoUrl": "https://www.youtube.com/watch?v=n0NlxUyA7FI",
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
    "owner": "Admin",
    "assignedTo": "",
    "testingNotes": "",
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
    "videoUrl": "https://www.youtube.com/watch?v=4IskO3BKwNY",
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
    "owner": "Akshay",
    "assignedTo": "",
    "testingNotes": "",
    "dateAdded": "2026-07-07",
    "lastReviewed": "2026-08-03",
    "notes": "Core AI coding IDE for delivery. Strong team adoption and the default for multi-file, project-aware work.",
    "limitations": "License cost and cloud features need clear policy. Keep client secrets out of unapproved model routes.",
    "whenToUse": "Day-to-day software delivery, refactors, and project-aware coding.",
    "alternatives": "GitHub Copilot for lighter completion; Antigravity for agent-first workflows; Windsurf while testing alternate AI IDEs.",
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
    "status": "Approved",
    "url": "https://www.perplexity.ai",
    "videoUrl": "https://www.youtube.com/watch?v=-jgxCRCfyJg",
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
    "owner": "Admin",
    "assignedTo": "",
    "testingNotes": "",
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
    "status": "Approved",
    "url": "https://www.notion.so/product/ai",
    "videoUrl": "https://www.youtube.com/watch?v=a-lJXdZicfA",
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
    "owner": "Admin",
    "assignedTo": "",
    "testingNotes": "",
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
    "videoUrl": "https://www.youtube.com/watch?v=n1sfrc-RjyM",
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
    "owner": "Admin",
    "assignedTo": "",
    "testingNotes": "",
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
    "videoUrl": "https://www.youtube.com/watch?v=mTYxpIRK7xA",
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
    "owner": "Admin",
    "assignedTo": "",
    "testingNotes": "",
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
    "id": "AIT-017",
    "name": "n8n",
    "category": "Agents & automation",
    "subcategory": "Workflow Builder",
    "pricing": "Open Source",
    "status": "Archived",
    "url": "https://n8n.io",
    "videoUrl": "https://www.youtube.com/watch?v=GuaKeDS6UKU",
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
    "owner": "Admin",
    "assignedTo": "",
    "testingNotes": "",
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
    "id": "AIT-022",
    "name": "Antigravity",
    "category": "AI Coding",
    "subcategory": "IDE",
    "pricing": "Free",
    "status": "Production",
    "url": "https://antigravity.google/",
    "videoUrl": "https://www.youtube.com/watch?v=-0Irz8G0PEE",
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
    "owner": "Aagam",
    "assignedTo": "",
    "testingNotes": "",
    "dateAdded": "2026-07-07",
    "lastReviewed": "2026-08-03",
    "notes": "Core agentic coding platform already used in delivery for vibe coding and accelerated development.",
    "limitations": "Fast agentic coding still needs human review. Confirm what data leaves the machine under current settings.",
    "whenToUse": "Agentic coding and accelerated development already used in delivery.",
    "alternatives": "Cursor for IDE-centric work; Windsurf while testing alternate AI IDEs; OpenHands for open-source agent sandboxes.",
    "costNote": "Free preview tiers may change—confirm current Google licensing for the team.",
    "securityTip": "Understand which code/context is sent to cloud models under your settings.",
    "approvedModels": [
      "Gemini",
      "Claude",
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
    "notes": "Strong general-purpose assistant — everyday writing and brainstorming default",
    "evaluator": "DCS catalog review"
  },
  "Claude": {
    "score": "4.7",
    "criteria": "Reasoning, Context, Safety",
    "recommendation": "★★★★★",
    "date": "2026-07-07",
    "notes": "Excellent for long documents and careful analysis",
    "evaluator": "DCS catalog review"
  },
  "Cursor": {
    "score": "4.8",
    "criteria": "Coding, IDE Integration, Project context",
    "recommendation": "★★★★★",
    "date": "2026-08-06",
    "notes": "Core Production coding IDE for multi-file delivery work — top team rating",
    "evaluator": "DCS catalog review"
  },
  "Perplexity": {
    "score": "4.4",
    "criteria": "Citations, Speed, Accuracy",
    "recommendation": "★★★★☆",
    "date": "2026-08-05",
    "notes": "Best first stop for cited web research when sources matter",
    "evaluator": "DCS catalog review"
  },
  "Gemini": {
    "score": "4.0",
    "criteria": "Workspace fit, Multimodal, Quality",
    "recommendation": "★★★★☆",
    "date": "2026-08-05",
    "notes": "Adopted for Workspace/multimodal; not the primary default versus ChatGPT/Claude",
    "evaluator": "DCS catalog review"
  },
  "GitHub Copilot": {
    "score": "3.9",
    "criteria": "Code Completion, IDE Integration, Speed",
    "recommendation": "★★★☆☆",
    "date": "2026-08-05",
    "notes": "Solid baseline pair programmer; Cursor preferred for deeper project-aware work",
    "evaluator": "DCS catalog review"
  },
  "Notion AI": {
    "score": "3.7",
    "criteria": "Writing, Summarization, Workspace Fit",
    "recommendation": "★★★☆☆",
    "date": "2026-08-05",
    "notes": "Useful inside Notion for drafts and summaries; not a replacement for research or coding tools",
    "evaluator": "DCS catalog review"
  },
  "OpenClaw": {
    "score": "4.5",
    "criteria": "Autonomy, Integrations, Self-hosting",
    "recommendation": "★★★★★",
    "date": "2026-08-06",
    "notes": "Production messaging-gateway agent; lock down channels and keep secrets off unapproved models",
    "evaluator": "DCS catalog review"
  },
  "Hermes Agent": {
    "score": "4.5",
    "criteria": "Autonomy, Memory, Scheduling",
    "recommendation": "★★★★★",
    "date": "2026-08-06",
    "notes": "Production self-hosted agent for terminal browser and cron-style automations",
    "evaluator": "DCS catalog review"
  },
  "Antigravity": {
    "score": "4.5",
    "criteria": "Agent Coding, Speed, Team Adoption",
    "recommendation": "★★★★★",
    "date": "2026-08-06",
    "notes": "Production agentic coding already used in delivery; human review still required",
    "evaluator": "DCS catalog review"
  },
  "NotebookLM": {
    "score": "",
    "criteria": "Doc grounding, Briefings, Ease of use",
    "recommendation": "",
    "date": "2026-08-05",
    "notes": "Pilot for document Q&A and briefing packs — no client-confidential uploads without approval",
    "evaluator": "DCS catalog review"
  },
  "CodeRabbit": {
    "score": "",
    "criteria": "PR review quality, Security signals, Noise",
    "recommendation": "",
    "date": "2026-08-05",
    "notes": "High-value Testing candidate for first-pass PR review; humans still own merge decisions",
    "evaluator": "DCS catalog review"
  },
  "Julius AI": {
    "score": "",
    "criteria": "Ad hoc analysis, Charts, Data safety",
    "recommendation": "",
    "date": "2026-08-05",
    "notes": "Pilot for CSV/spreadsheet exploration — Internal/sample data only",
    "evaluator": "DCS catalog review"
  },
  "n8n": {
    "score": "2.8",
    "criteria": "Workflow fit, Maintainability, Current need",
    "recommendation": "★★☆☆☆",
    "date": "2026-08-05",
    "notes": "Archived reference — prefer OpenClaw/Hermes or modern agent pipelines for new work",
    "evaluator": "DCS catalog review"
  },
  "Gamma": {
    "score": "",
    "criteria": "Speed, Deck quality, Brand polish",
    "recommendation": "",
    "date": "2026-08-05",
    "notes": "Pilot for fast internal decks; review branding before external client use",
    "evaluator": "DCS catalog review"
  },
  "OpenHands": {
    "score": "",
    "criteria": "Autonomy, Sandbox safety, Review burden",
    "recommendation": "",
    "date": "2026-08-05",
    "notes": "Planned — revisit after Cursor/Antigravity capacity is stable; sandbox-only experiments",
    "evaluator": "DCS catalog review"
  },
  "Browser Use": {
    "score": "",
    "criteria": "Python fit, Playwright control, Reliability",
    "recommendation": "",
    "date": "2026-08-05",
    "notes": "Strong Testing fit for agent-driven browser automation on approved targets",
    "evaluator": "DCS catalog review"
  },
  "Firecrawl": {
    "score": "",
    "criteria": "Clean extraction, RAG readiness, Hosted ease",
    "recommendation": "",
    "date": "2026-08-05",
    "notes": "Testing winner for scraping-to-RAG markdown/JSON versus brittle custom parsers",
    "evaluator": "DCS catalog review"
  },
  "Apify": {
    "score": "",
    "criteria": "Managed actors, Ecommerce fit, Cost clarity",
    "recommendation": "",
    "date": "2026-08-05",
    "notes": "Researching managed scrapers for ecommerce monitoring — validate ToS and actor costs",
    "evaluator": "DCS catalog review"
  },
  "Crawl4AI": {
    "score": "",
    "criteria": "Python-native crawl, LLM-ready output, Control",
    "recommendation": "",
    "date": "2026-08-05",
    "notes": "Testing in-house companion to Browser Use for RAG-ready extraction",
    "evaluator": "DCS catalog review"
  },
  "Ollama": {
    "score": "",
    "criteria": "Privacy, Local quality, Offline use",
    "recommendation": "",
    "date": "2026-08-05",
    "notes": "Testing local/private models when data should stay on-device — quality lags top cloud assistants",
    "evaluator": "DCS catalog review"
  },
  "Power BI Copilot": {
    "score": "",
    "criteria": "DAX help, Report speed, DCS delivery fit",
    "recommendation": "",
    "date": "2026-08-05",
    "notes": "High relevance for Power BI delivery; confirm Fabric/Copilot licensing before client promises",
    "evaluator": "DCS catalog review"
  },
  "Dify": {
    "score": "",
    "criteria": "RAG studio, Self-hosting, Security hardening",
    "recommendation": "",
    "date": "2026-08-05",
    "notes": "Planned for client RAG demos after Firecrawl/Ollama path is clearer",
    "evaluator": "DCS catalog review"
  },
  "v0": {
    "score": "",
    "criteria": "UI speed, React/Next export, Production polish",
    "recommendation": "",
    "date": "2026-08-05",
    "notes": "Planned for fast React/Next prototypes — starting point only; check a11y and brand",
    "evaluator": "DCS catalog review"
  },
  "Windsurf": {
    "score": "",
    "criteria": "Coding, Agentic IDE, Cursor alternative",
    "recommendation": "",
    "date": "2026-08-06",
    "notes": "Testing alternate AI IDE; Cursor remains the Production default until evaluation finishes",
    "evaluator": "DCS catalog review"
  },
  "Make": {
    "score": "",
    "criteria": "",
    "recommendation": "",
    "date": "2026-08-06",
    "notes": "Exploring visual automation; n8n archived — validate scenario cost and credential handling",
    "evaluator": "DCS catalog review"
  },
  "Lovable": {
    "score": "",
    "criteria": "",
    "recommendation": "",
    "date": "2026-08-06",
    "notes": "Exploring AI app builder for demos/MVPs — not production without review",
    "evaluator": "DCS catalog review"
  },
  "Exa": {
    "score": "",
    "criteria": "",
    "recommendation": "",
    "date": "2026-08-06",
    "notes": "Testing neural search API for agents/RAG alongside Perplexity and Firecrawl",
    "evaluator": "DCS catalog review"
  },
  "Raycast AI": {
    "score": "",
    "criteria": "",
    "recommendation": "",
    "date": "2026-08-06",
    "notes": "Exploring desktop AI commands to cut context-switching time",
    "evaluator": "DCS catalog review"
  },
  "Fireflies.ai": {
    "score": "",
    "criteria": "",
    "recommendation": "",
    "date": "2026-08-06",
    "notes": "Testing meeting transcription/summaries to reduce follow-up time",
    "evaluator": "DCS catalog review"
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
        "tool": "Windsurf",
        "useWhen": "Evaluating an alternate AI IDE / agentic editor versus Cursor.",
        "skipWhen": "As a replacement for Cursor/Antigravity until Testing finishes — keep client secrets out.",
        "order": 4
      },
      {
        "tool": "Claude",
        "useWhen": "Careful coding reviews and reasoning outside the IDE.",
        "skipWhen": "As a substitute for Cursor on multi-file repo work.",
        "order": 5
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
    "owner": "Admin",
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
    "owner": "Admin",
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
    "owner": "Admin",
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
    "owner": "Admin",
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
    "owner": "Admin",
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
    "owner": "Admin",
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
    "owner": "Admin",
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
    "owner": "Admin",
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
    "owner": "Admin",
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
    "owner": "Admin",
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
    "owner": "Admin",
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
    "owner": "Admin",
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
    "owner": "Admin",
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
    "owner": "Admin",
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
    "owner": "Admin",
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
    "owner": "Admin",
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
    "status": "Approved",
    "owner": "Admin",
    "impact": "Saves ~2 hours per week drafting ops summaries",
    "date": "2026-07-07",
    "role": "Operations"
  },
  {
    "id": "UC-002",
    "title": "Code review assistant",
    "department": "Engineering",
    "tool": "Cursor",
    "status": "Approved",
    "owner": "Admin",
    "impact": "Faster first-pass review consistency on PRs",
    "date": "2026-07-07",
    "role": "Engineering"
  },
  {
    "id": "UC-003",
    "title": "Customer email drafting",
    "department": "Operations",
    "tool": "Claude",
    "status": "Testing",
    "owner": "Admin",
    "impact": "Faster response drafts with clearer tone",
    "date": "2026-07-07",
    "role": "Operations"
  },
  {
    "id": "UC-004",
    "title": "Cited competitor research",
    "department": "Everyone",
    "tool": "Perplexity",
    "status": "Approved",
    "owner": "Admin",
    "impact": "Cuts discovery time before proposal writing",
    "date": "2026-08-05",
    "role": "Everyone"
  },
  {
    "id": "UC-005",
    "title": "Doc-pack briefings",
    "department": "Everyone",
    "tool": "NotebookLM",
    "status": "Testing",
    "owner": "Admin",
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
    "owner": "Admin",
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
    "owner": "Admin",
    "impact": "Cleaner markdown/JSON for LLM pipelines",
    "date": "2026-08-05",
    "role": "Engineering"
  },
  {
    "id": "UC-008",
    "title": "Ad hoc CSV analysis",
    "department": "Data Engineering",
    "tool": "Julius AI",
    "status": "Testing",
    "owner": "Admin",
    "impact": "Faster exploratory charts on sample datasets",
    "date": "2026-08-05",
    "role": "Data"
  },
  {
    "id": "UC-009",
    "title": "Cut project busywork even when I am away from the laptop",
    "department": "Engineering",
    "tool": "Hermes Agent",
    "status": "Approved",
    "owner": "Anshu Jain",
    "impact": "I can keep the AI Resource Center moving from Telegram, not only at the desk. Hermes handles setup questions, Google Apps Script steps, permission checks, and verification so I do not stall until I am back on the laptop. That shortened the loop from blocked to done on the same day.",
    "date": "2026-08-20",
    "role": "Engineering"
  },
  {
    "id": "UC-010",
    "title": "Run Gmail, WhatsApp, calendar, and daily follow-ups from one OpenClaw thread",
    "department": "Engineering",
    "tool": "OpenClaw",
    "status": "Approved",
    "owner": "Anshu Jain",
    "impact": "Inbox and chat no longer wait until I am at the desk. OpenClaw triages Gmail, drafts WhatsApp replies, checks the calendar, and knocks out small everyday tasks in one place. I spend less time hopping apps and less time catching up after I step away.",
    "date": "2026-08-20",
    "role": "Engineering"
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
    "url": "?view=guides",
    "description": "Never paste client secrets PII or production data into unapproved tools.",
    "dateAdded": "2026-08-05"
  }
];
const SITE_HIGHLIGHTS = {
  "startHere": [
    "Cursor",
    "Antigravity",
    "ChatGPT",
    "Claude",
    "Perplexity"
  ],
  "toolOfTheWeek": ""
};
const TEAM_MEMBERS = [
  {
    "id": "TM-001",
    "name": "Anshu Jain",
    "email": "jnaanshu@gmail.com",
    "department": "Engineering",
    "role": "Admin",
    "active": true
  },
  {
    "id": "TM-002",
    "name": "Akshay",
    "email": "akshay@dailycodesolutions.com",
    "department": "Engineering",
    "role": "Team",
    "active": true
  }
];
const DEPARTMENTS = [
  "Development",
  "Engineering",
  "Automation",
  "Reporting",
  "Data Engineering",
  "Management",
  "Operations",
  "Support",
  "Everyone"
];
const TEAM_ROLES = [
  "Developer",
  "Project Manager",
  "QA Engineer",
  "Data Analyst",
  "Designer",
  "DevOps Engineer",
  "Manager",
  "Admin",
  "Other"
];
const SUBMISSIONS = [
  {
    "Submitted": "2026-08-18",
    "Tool name": "Midjourney",
    "Link": "https://www.midjourney.com/",
    "Submitted by": "Akshay",
    "Note": "Suggested for AI image generation on client moodboards and creative concepts. Useful when decks need custom visuals beyond stock art.",
    "Status": "New",
    "Assigned to": "",
    "Assigned date": "",
    "Rejected date": ""
  },
  {
    "Submitted": "2026-08-17",
    "Tool name": "ElevenLabs",
    "Link": "https://elevenlabs.io/",
    "Submitted by": "Anshu Jain",
    "Note": "Suggested for natural voiceovers in product demos and explainer videos. Check data handling before using any client audio.",
    "Status": "In review",
    "Assigned to": "Akshay",
    "Assigned date": "2026-08-17",
    "Rejected date": ""
  },
  {
    "Submitted": "2026-08-16",
    "Tool name": "Groq",
    "Link": "https://groq.com/",
    "Submitted by": "Akshay",
    "Note": "Suggested for very fast LLM inference on prototypes and latency-sensitive demos. Compare response times with our hosted models.",
    "Status": "In review",
    "Assigned to": "Anshu Jain",
    "Assigned date": "2026-08-16",
    "Rejected date": ""
  },
  {
    "Submitted": "2026-08-15",
    "Tool name": "Runway",
    "Link": "https://runwayml.com/",
    "Submitted by": "Anshu Jain",
    "Note": "Suggested for AI video editing and short promo clips. Helpful for marketing samples without a full production setup.",
    "Status": "Approved",
    "Assigned to": "Anshu Jain",
    "Assigned date": "2026-08-15",
    "Rejected date": ""
  },
  {
    "Submitted": "2026-08-14",
    "Tool name": "Descript",
    "Link": "https://www.descript.com/",
    "Submitted by": "Akshay",
    "Note": "Suggested for editing podcasts and screen recordings by editing the transcript. Cuts post-production time on talking-head content.",
    "Status": "New",
    "Assigned to": "",
    "Assigned date": "",
    "Rejected date": ""
  },
  {
    "Submitted": "2026-08-13",
    "Tool name": "Hugging Face",
    "Link": "https://huggingface.co/",
    "Submitted by": "Anshu Jain",
    "Note": "Suggested as a hub for open models datasets and demo Spaces. Useful for trying models before we commit to a stack.",
    "Status": "In review",
    "Assigned to": "Akshay",
    "Assigned date": "2026-08-13",
    "Rejected date": ""
  },
  {
    "Submitted": "2026-08-12",
    "Tool name": "HeyGen",
    "Link": "https://www.heygen.com/",
    "Submitted by": "Akshay",
    "Note": "Suggested for AI presenter and avatar videos. Rejected because outputs feel too branded for client-facing DCS work.",
    "Status": "Rejected",
    "Assigned to": "Anshu Jain",
    "Assigned date": "",
    "Rejected date": "2026-08-12"
  },
  {
    "Submitted": "2026-08-11",
    "Tool name": "Replit Agent",
    "Link": "https://replit.com/",
    "Submitted by": "",
    "Note": "Suggested for browser-based coding with an AI agent on quick spikes. Compare with Cursor when production ownership matters.",
    "Status": "New",
    "Assigned to": "",
    "Assigned date": "",
    "Rejected date": ""
  },
  {
    "Submitted": "2026-08-10",
    "Tool name": "Bolt.new",
    "Link": "https://bolt.new",
    "Submitted by": "",
    "Note": "Suggested for rapid full-stack prototypes from a prompt. Compare with Lovable and v0 on speed vs polish for internal demos.",
    "Status": "In review",
    "Assigned to": "Anshu Jain",
    "Assigned date": "2026-08-10",
    "Rejected date": ""
  },
  {
    "Submitted": "2026-08-06",
    "Tool name": "Windsurf",
    "Link": "https://windsurf.com",
    "Submitted by": "",
    "Note": "Suggested as an AI-native IDE alternative to Cursor for teams who want a different agentic coding workflow.",
    "Status": "New",
    "Assigned to": "",
    "Assigned date": "",
    "Rejected date": ""
  },
  {
    "Submitted": "2026-08-06",
    "Tool name": "Fireflies.ai",
    "Link": "https://fireflies.ai",
    "Submitted by": "",
    "Note": "Suggested to auto-capture meeting notes, action items, and call summaries. Could reduce manual follow-up after client calls.",
    "Status": "New",
    "Assigned to": "",
    "Assigned date": "",
    "Rejected date": ""
  },
  {
    "Submitted": "2026-08-06",
    "Tool name": "Exa",
    "Link": "https://exa.ai",
    "Submitted by": "",
    "Note": "Suggested for AI-native web search and research APIs. Fits agent workflows that need fresher sources than generic search.",
    "Status": "New",
    "Assigned to": "",
    "Assigned date": "",
    "Rejected date": ""
  },
  {
    "Submitted": "2026-08-06",
    "Tool name": "Make",
    "Link": "https://www.make.com",
    "Submitted by": "",
    "Note": "Suggested for no-code automation between SaaS tools. Lighter option when full agent platforms are more than we need.",
    "Status": "New",
    "Assigned to": "",
    "Assigned date": "",
    "Rejected date": ""
  },
  {
    "Submitted": "2026-08-06",
    "Tool name": "Lovable",
    "Link": "https://lovable.dev",
    "Submitted by": "",
    "Note": "Suggested for generating web app prototypes from prompts. Good for validating ideas before custom UI investment.",
    "Status": "New",
    "Assigned to": "",
    "Assigned date": "",
    "Rejected date": ""
  },
  {
    "Submitted": "2026-08-06",
    "Tool name": "Raycast AI",
    "Link": "https://www.raycast.com/core-features/ai",
    "Submitted by": "",
    "Note": "Suggested for engineers in a launcher workflow—quick AI answers and snippets without leaving the keyboard.",
    "Status": "New",
    "Assigned to": "",
    "Assigned date": "",
    "Rejected date": ""
  },
  {
    "Submitted": "2026-08-03",
    "Tool name": "Firecrawl",
    "Link": "https://www.firecrawl.dev",
    "Submitted by": "Admin",
    "Note": "Suggested for turning websites into clean LLM-ready markdown for RAG. Cleaner than maintaining brittle custom scrapers.",
    "Status": "New",
    "Assigned to": "",
    "Assigned date": "",
    "Rejected date": ""
  },
  {
    "Submitted": "2026-08-03",
    "Tool name": "Apify",
    "Link": "https://apify.com",
    "Submitted by": "Admin",
    "Note": "Suggested for managed web scraping on e-commerce monitoring and client crawl projects. Offloads ops on scheduled extracts.",
    "Status": "New",
    "Assigned to": "",
    "Assigned date": "",
    "Rejected date": ""
  },
  {
    "Submitted": "2026-08-03",
    "Tool name": "Crawl4AI",
    "Link": "https://docs.crawl4ai.com",
    "Submitted by": "Admin",
    "Note": "Suggested as a Python-first crawler built for LLM ingestion. Pairs well with our RAG stack and browser automation work.",
    "Status": "New",
    "Assigned to": "",
    "Assigned date": "",
    "Rejected date": ""
  },
  {
    "Submitted": "2026-08-03",
    "Tool name": "Ollama",
    "Link": "https://ollama.com",
    "Submitted by": "Admin",
    "Note": "Suggested for running models locally when data must stay on-device. Complements cloud tools—not a full Claude or ChatGPT replacement.",
    "Status": "New",
    "Assigned to": "",
    "Assigned date": "",
    "Rejected date": ""
  },
  {
    "Submitted": "2026-08-03",
    "Tool name": "Power BI Copilot",
    "Link": "https://learn.microsoft.com/en-us/power-bi/create-reports/copilot-introduction",
    "Submitted by": "Admin",
    "Note": "Suggested for DCS Power BI delivery—natural language DAX report building and summaries. Confirm Microsoft licensing on client work.",
    "Status": "New",
    "Assigned to": "",
    "Assigned date": "",
    "Rejected date": ""
  },
  {
    "Submitted": "2026-08-03",
    "Tool name": "Dify",
    "Link": "https://dify.ai",
    "Submitted by": "Admin",
    "Note": "Suggested for client RAG apps and internal knowledge bots with a visual builder. Self-host when data residency matters.",
    "Status": "New",
    "Assigned to": "",
    "Assigned date": "",
    "Rejected date": ""
  },
  {
    "Submitted": "2026-08-03",
    "Tool name": "v0",
    "Link": "https://v0.dev",
    "Submitted by": "Admin",
    "Note": "Suggested for fast React and Next UI generation from prompts. Useful for client mockups and exportable front-end starts.",
    "Status": "New",
    "Assigned to": "",
    "Assigned date": "",
    "Rejected date": ""
  },
  {
    "Submitted": "2026-07-07",
    "Tool name": "NotebookLM",
    "Link": "https://notebooklm.google.com",
    "Submitted by": "Admin",
    "Note": "Suggested for document Q&A, briefing packs, and research synthesis. Use internal docs only—avoid confidential client files unless approved.",
    "Status": "New",
    "Assigned to": "",
    "Assigned date": "",
    "Rejected date": ""
  },
  {
    "Submitted": "2026-07-07",
    "Tool name": "CodeRabbit",
    "Link": "https://coderabbit.ai",
    "Submitted by": "Admin",
    "Note": "Suggested for automated PR reviews with line-level feedback and security checks. Fits teams on GitHub or GitLab workflows.",
    "Status": "New",
    "Assigned to": "",
    "Assigned date": "",
    "Rejected date": ""
  },
  {
    "Submitted": "2026-07-07",
    "Tool name": "Julius AI",
    "Link": "https://julius.ai",
    "Submitted by": "Admin",
    "Note": "Suggested for quick CSV analysis charts and spreadsheet questions in plain English. Best on sample or internal data.",
    "Status": "New",
    "Assigned to": "",
    "Assigned date": "",
    "Rejected date": ""
  },
  {
    "Submitted": "2026-07-07",
    "Tool name": "Gamma",
    "Link": "https://gamma.app",
    "Submitted by": "Admin",
    "Note": "Suggested for polished slide decks and one-pagers from an outline. Speeds up client storytelling and internal updates.",
    "Status": "New",
    "Assigned to": "",
    "Assigned date": "",
    "Rejected date": ""
  },
  {
    "Submitted": "2026-07-07",
    "Tool name": "OpenHands",
    "Link": "https://www.openhands.dev",
    "Submitted by": "Admin",
    "Note": "Suggested as an autonomous coding agent for multi-step dev tasks. Revisit once our primary IDE workflow is settled.",
    "Status": "New",
    "Assigned to": "",
    "Assigned date": "",
    "Rejected date": ""
  },
  {
    "Submitted": "2026-07-07",
    "Tool name": "Browser Use",
    "Link": "https://browser-use.com",
    "Submitted by": "Admin",
    "Note": "Suggested for Python browser automation driven by LLM agents. Strong fit for scripted scraping and QA on Playwright.",
    "Status": "New",
    "Assigned to": "",
    "Assigned date": "",
    "Rejected date": ""
  }
];
