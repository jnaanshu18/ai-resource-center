// Auto-generated from data/*.csv — do not edit by hand.
const TOOLS = [
  {
    "id": "AIT-001",
    "name": "ChatGPT",
    "category": "LLM",
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
    "notes": "Default general assistant for everyday work. Prefer Claude for long-document reasoning when context limits matter."
  },
  {
    "id": "AIT-002",
    "name": "Claude",
    "category": "LLM",
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
    "notes": "Preferred for long documents and careful analysis. Strong context handling versus general chat tools."
  },
  {
    "id": "AIT-003",
    "name": "Gemini",
    "category": "LLM",
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
    "notes": "Approved for team use, especially Workspace and multimodal workflows. Not the primary default versus ChatGPT/Claude."
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
    "notes": "Solid baseline pair programmer in GitHub/IDEs. Cursor is the Production coding tool for deeper project-aware work."
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
    "notes": "Core AI coding IDE for delivery. Strong team adoption and the default for multi-file, project-aware work."
  },
  {
    "id": "AIT-006",
    "name": "Perplexity",
    "category": "Research",
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
    "notes": "Best first stop for cited web research. Prefer over plain LLM chat when sources matter."
  },
  {
    "id": "AIT-007",
    "name": "Midjourney",
    "category": "Image Generation",
    "subcategory": "Image Generator",
    "pricing": "Paid",
    "status": "Researching",
    "url": "https://www.midjourney.com",
    "description": "High-quality image generation for design concepts, creative exploration, and marketing visuals.",
    "platform": [
      "Web",
      "Desktop"
    ],
    "department": "Everyone",
    "useCases": [
      "Image Generation"
    ],
    "learningCurve": "Medium",
    "priority": "Low",
    "dataClassification": "Internal",
    "owner": "Anshu Jain",
    "dateAdded": "2026-07-07",
    "lastReviewed": "2026-08-03",
    "notes": "Niche creative exploration for concept art and marketing visuals. Confirm license terms before client-facing use."
  },
  {
    "id": "AIT-008",
    "name": "Notion AI",
    "category": "Productivity",
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
    "notes": "Useful inside existing Notion workflows for summaries and drafting. Not a replacement for research or coding tools."
  },
  {
    "id": "AIT-009",
    "name": "OpenClaw",
    "category": "AI Agent",
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
    "notes": "Core self-hosted agent gateway across messaging channels. Keep client secrets off unapproved models."
  },
  {
    "id": "AIT-010",
    "name": "Hermes Agent",
    "category": "AI Agent",
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
    "notes": "Core self-hosted agent for terminal, browser, and scheduled automations on our infrastructure."
  },
  {
    "id": "AIT-011",
    "name": "NotebookLM",
    "category": "Documentation",
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
    "notes": "Piloting for document Q&A, briefing packs, and knowledge synthesis. Do not upload client-confidential files without approval."
  },
  {
    "id": "AIT-012",
    "name": "Wispr Flow",
    "category": "Voice AI",
    "subcategory": "Voice Assistant",
    "pricing": "Freemium",
    "status": "Pilot",
    "url": "https://wisprflow.ai",
    "description": "AI voice dictation that works in any app with real-time transcription, filler-word cleanup, and spoken edit commands.",
    "platform": [
      "Desktop",
      "Mobile"
    ],
    "department": "Everyone",
    "useCases": [
      "Voice Typing",
      "Documentation",
      "Email Writing"
    ],
    "learningCurve": "Low",
    "priority": "Medium",
    "dataClassification": "Internal",
    "owner": "Anshu Jain",
    "dateAdded": "2026-07-07",
    "lastReviewed": "2026-08-03",
    "notes": "Piloting for faster drafting and hands-free input. Promote further only if weekly usage sticks."
  },
  {
    "id": "AIT-013",
    "name": "Google Stitch",
    "category": "UI Generation",
    "subcategory": "Cloud",
    "pricing": "Free",
    "status": "Planned",
    "url": "https://stitch.withgoogle.com",
    "description": "Google Labs AI design canvas that turns prompts, sketches, or URLs into UI mockups and exportable frontend code.",
    "platform": [
      "Web"
    ],
    "department": "Development",
    "useCases": [
      "Image Generation",
      "Coding",
      "Documentation"
    ],
    "learningCurve": "Medium",
    "priority": "Low",
    "dataClassification": "Internal",
    "owner": "Anshu Jain",
    "dateAdded": "2026-07-07",
    "lastReviewed": "2026-08-03",
    "notes": "Queued for UI ideation experiments. Overlaps with v0—compare before investing heavily."
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
    "notes": "High-value PR review automation. Testing for line-level feedback, security checks, and review quality in Git workflows."
  },
  {
    "id": "AIT-015",
    "name": "Julius AI",
    "category": "Data Analytics",
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
    "notes": "Piloting for ad hoc CSV/spreadsheet analysis and quick visuals. Use sample or internal data only."
  },
  {
    "id": "AIT-016",
    "name": "Comet",
    "category": "Browser Automation",
    "subcategory": "Browser Agent",
    "pricing": "Freemium",
    "status": "Researching",
    "url": "https://www.perplexity.ai/comet",
    "description": "Perplexity's Chromium-based AI browser with built-in assistant for search, summarisation, and agentic web task automation.",
    "platform": [
      "Desktop"
    ],
    "department": "Automation",
    "useCases": [
      "Research",
      "Web Scraping",
      "Deep Research"
    ],
    "learningCurve": "Medium",
    "priority": "Low",
    "dataClassification": "Internal",
    "owner": "Anshu Jain",
    "dateAdded": "2026-07-07",
    "lastReviewed": "2026-08-03",
    "notes": "Light research into an AI-native browser for summaries and small web tasks. Not a near-term priority."
  },
  {
    "id": "AIT-017",
    "name": "n8n",
    "category": "Workflow Automation",
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
    "notes": "Previously used; kept for reference. Prefer newer agent-based automation where possible."
  },
  {
    "id": "AIT-018",
    "name": "Gamma",
    "category": "Presentation",
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
    "notes": "Piloting for fast decks and client storytelling. Review branding before external use."
  },
  {
    "id": "AIT-019",
    "name": "Napkin AI",
    "category": "Design",
    "subcategory": "Diagram",
    "pricing": "Freemium",
    "status": "Planned",
    "url": "https://www.napkin.ai",
    "description": "Text-to-visual tool that turns pasted content into diagrams, flowcharts, mind maps, and infographics without prompt engineering.",
    "platform": [
      "Web"
    ],
    "department": "Everyone",
    "useCases": [
      "Visualization",
      "Presentation",
      "Documentation"
    ],
    "learningCurve": "Low",
    "priority": "Low",
    "dataClassification": "Internal",
    "owner": "Anshu Jain",
    "dateAdded": "2026-07-07",
    "lastReviewed": "2026-08-03",
    "notes": "Nice-to-have for turning notes into diagrams and visuals. Explore after higher-priority tools."
  },
  {
    "id": "AIT-020",
    "name": "OpenHands",
    "category": "AI Agent",
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
    "notes": "Queued autonomous coding agent. Revisit after Cursor and Antigravity capacity is stable."
  },
  {
    "id": "AIT-021",
    "name": "Browser Use",
    "category": "Browser Automation",
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
    "notes": "High fit for Python browser automation and agent-driven scraping. Active test candidate with Playwright under the hood."
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
    "notes": "Core agentic coding platform already used in delivery for vibe coding and accelerated development."
  },
  {
    "id": "AIT-023",
    "name": "Firecrawl",
    "category": "Browser Automation",
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
    "notes": "Strong scraping-to-RAG fit. Testing as a cleaner path than brittle custom parsers for LLM-ready web content."
  },
  {
    "id": "AIT-024",
    "name": "Apify",
    "category": "Browser Automation",
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
    "notes": "Evaluating managed scraping actors for ecommerce monitoring and client crawl projects."
  },
  {
    "id": "AIT-025",
    "name": "Crawl4AI",
    "category": "Browser Automation",
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
    "notes": "Python-native LLM crawler. Testing as an in-house companion to Browser Use for RAG-ready extraction."
  },
  {
    "id": "AIT-026",
    "name": "Ollama",
    "category": "LLM",
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
    "notes": "Testing local/private models when data should stay on-device. Not a quality replacement for Claude/ChatGPT."
  },
  {
    "id": "AIT-027",
    "name": "Power BI Copilot",
    "category": "Data Analytics",
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
    "notes": "High relevance for DCS Power BI delivery. Confirm Fabric/Copilot licensing before promising on client projects."
  },
  {
    "id": "AIT-028",
    "name": "Dify",
    "category": "AI Agent",
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
    "notes": "Queued for client RAG demos and internal knowledge bots. Prefer after Firecrawl/Ollama path is clearer; self-host when needed."
  },
  {
    "id": "AIT-029",
    "name": "Aider",
    "category": "AI Coding",
    "subcategory": "CLI Tool",
    "pricing": "Open Source",
    "status": "Researching",
    "url": "https://aider.chat",
    "description": "Terminal-based AI pair programmer that edits repos, commits changes, and works with your existing Git workflow.",
    "platform": [
      "CLI"
    ],
    "department": "Development",
    "useCases": [
      "Coding",
      "Debugging",
      "Code Review"
    ],
    "learningCurve": "Medium",
    "priority": "Low",
    "dataClassification": "Internal",
    "owner": "Anshu Jain",
    "dateAdded": "2026-08-03",
    "lastReviewed": "2026-08-03",
    "notes": "Optional terminal pair-programmer. Compare lightly against Cursor/OpenHands; not a near-term priority."
  },
  {
    "id": "AIT-030",
    "name": "v0",
    "category": "UI Generation",
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
    "notes": "Queued for fast React/Next UI prototypes and client handoff. Compare with Google Stitch."
  }
];
const CATEGORIES = [
  "LLM",
  "AI Coding",
  "AI Agent",
  "Automation",
  "Workflow Automation",
  "Browser Automation",
  "Research",
  "Search",
  "Data Analytics",
  "SQL",
  "Database",
  "Documentation",
  "Writing",
  "Productivity",
  "Presentation",
  "Meeting Assistant",
  "Voice AI",
  "Image Generation",
  "Video Generation",
  "UI Generation",
  "Design",
  "OCR",
  "Translation",
  "Email",
  "PDF",
  "Spreadsheet",
  "Power BI",
  "MCP",
  "API",
  "CLI",
  "DevOps",
  "Testing",
  "Security",
  "Education",
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
  },
  {
    "feature": "Image Generation",
    "tools": [
      "Midjourney",
      "Gemini",
      "ChatGPT"
    ],
    "winner": "Midjourney",
    "notes": "Highest visual quality"
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
