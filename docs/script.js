// DCS AI Resource Center — client-side dynamic directory.
// Reads TOOLS / COMPARISONS / EVALUATIONS from data.js, no backend required.

const STATUS_GROUP = {
  Production: "mint", Approved: "mint",
  Testing: "amber",
  Exploring: "blue",
  Archived: "coral", Rejected: "coral",
};

/** Optional grouped filters (URL legacy + Start here trusted). */
const STATUS_BUCKETS = {
  trusted: ["Production", "Approved"],
  trying: ["Testing"],
  exploring: ["Exploring"],
  paused: ["Archived", "Rejected"],
};

/** Older ?bucket= values still resolve after the rename. */
const LEGACY_STATUS_BUCKETS = {
  approved: "trusted",
  testing: "trying",
  research: "exploring",
};

const STATUS_ORDER = [
  "Production", "Approved", "Testing", "Exploring", "Archived", "Rejected",
];

const COMPARE_MAX = 3;
const TOOL_ASSIGNMENT_KEY = "dcs-ai-rc-tool-assignments";
const TEAM_REGISTER_PENDING_KEY = "dcs-ai-rc-team-register-pending";
const TOOL_ASSIGNABLE_STATUSES = new Set(["Testing", "Exploring"]);
/** Set true later to restore the Directory Filters expand/collapse control. */
const FILTERS_COLLAPSIBLE = false;

/** Fallback if SITE_HIGHLIGHTS is missing from data.js. */
const START_HERE_FALLBACK = ["Cursor", "Antigravity", "ChatGPT", "Claude", "Perplexity"];

function startHereNames() {
  const list = (typeof SITE_HIGHLIGHTS !== "undefined" && Array.isArray(SITE_HIGHLIGHTS.startHere))
    ? SITE_HIGHLIGHTS.startHere.filter(Boolean)
    : [];
  return list.length ? list : START_HERE_FALLBACK;
}

function featuredToolName() {
  if (typeof SITE_HIGHLIGHTS === "undefined") return "";
  return String(SITE_HIGHLIGHTS.toolOfTheWeek || "").trim();
}

const SUGGEST_ISSUE_REPO = (typeof getSiteConfig === "function"
  ? getSiteConfig().issueNewUrl
  : "https://github.com/jnaanshu18/ai-resource-center/issues/new");

const RECENT_DAYS = 15;

function buildIssueDraftUrl({ title, body, label }) {
  const url = new URL(SUGGEST_ISSUE_REPO);
  url.searchParams.set("title", title);
  url.searchParams.set("body", body);
  if (label) url.searchParams.set("labels", label);
  return url.toString();
}

function isRecentlyAdded(tool, withinDays = RECENT_DAYS) {
  const raw = tool?.dateAdded || tool?.lastReviewed || "";
  if (!raw) return false;
  const added = new Date(`${raw}T00:00:00`);
  if (Number.isNaN(added.getTime())) return false;
  const cutoff = Date.now() - withinDays * 24 * 60 * 60 * 1000;
  return added.getTime() >= cutoff;
}

function isRejectedStatus(status) {
  return String(status || "").trim().toLowerCase() === "rejected";
}

function isDirectoryHiddenStatus(status) {
  const s = String(status || "").trim().toLowerCase();
  return s === "rejected" || s === "testing" || s === "exploring";
}

/** Directory catalog: Production, Approved, Archived. Testing/Exploring and Rejected stay out. */
function directoryTools() {
  const all = typeof TOOLS === "undefined" ? [] : TOOLS;
  return all.filter(t => !isDirectoryHiddenStatus(t.status));
}

function recentlyAddedTools() {
  return directoryTools()
    .filter(t => isRecentlyAdded(t))
    .sort((a, b) => String(b.dateAdded || "").localeCompare(String(a.dateAdded || "")) || a.name.localeCompare(b.name));
}

const VIEWS = ["home", "directory", "guides", "prompts", "playbooks", "submissions", "contribute", "tool"];

const state = {
  view: "home",
  search: "",
  status: null,
  statusBucket: null, // default: show full directory
  starter: false,
  recent: false,
  category: null,
  pricing: null,
  sort: "name",
  compareMode: false,
  compareIds: [],
  promptRole: "All",
  promptUseCase: "All",
  promptSearch: "",
  playbookRole: "All",
  playbookSearch: "",
  promptId: null,
  contribTab: "suggest",
  chooserJobId: null,
  currentToolId: null,
  toolReturnView: "directory",
  submissionStatus: "All",
  submissionSearch: "",
  submissionsCache: [],
  directoryApproveItem: null,
  directoryApprovePayload: null,
};

const jobsData = () => (typeof CHOOSER_JOBS !== "undefined" ? CHOOSER_JOBS : []);
const guidesData = () => (typeof DECISION_GUIDES !== "undefined" ? DECISION_GUIDES : []);
const promptsData = () => (typeof PROMPTS !== "undefined" ? PROMPTS : []);
const useCasesData = () => (typeof USE_CASES !== "undefined" ? USE_CASES : []);
const learningData = () => (typeof LEARNING !== "undefined" ? LEARNING : []);
const comparisonsData = () => (typeof COMPARISONS !== "undefined" ? COMPARISONS : []);

function contributeConfig() {
  if (typeof getContributeConfig === "function") return getContributeConfig();
  const cfg = (typeof SITE_CONFIG !== "undefined" && SITE_CONFIG.contribute) || {};
  const full = cfg.fullForm || {};
  const simple = cfg.simpleSubmit || {};
  const win = cfg.winSubmit || {};
  return {
    fullFormEnabled: full.enabled === true,
    simpleSubmitEnabled: simple.enabled !== false,
    submitUrl: String(simple.submitUrl || "").trim(),
    csvUrl: String(simple.csvUrl || "").trim(),
    assignSecret: String(simple.assignSecret || "").trim(),
    winSubmitEnabled: win.enabled !== false,
    winSubmitUrl: String(win.submitUrl || "").trim(),
    winCsvUrl: String(win.csvUrl || "").trim(),
  };
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

function evaluationFor(tool) {
  if (typeof EVALUATIONS === "undefined") return null;
  return EVALUATIONS[tool.name] || null;
}

/** Scores for Production / Approved, and kept for Archived / Rejected history. */
function toolCanHaveScore(tool) {
  return tool && ["Production", "Approved", "Archived", "Rejected"].includes(tool.status);
}

function renderStats() {
  const catalog = directoryTools();
  const total = catalog.length;
  const byStatus = Object.fromEntries(STATUS_ORDER.map(s => [s, catalog.filter(t => t.status === s).length]));

  const starterCount = startHereNames().filter(n => catalog.some(t => t.name === n)).length;

  const stats = [
    { label: "Tools tracked", value: total, cls: "", filter: "all" },
    { label: "Start here", value: starterCount, cls: "stat--starter", starter: true },
    { label: "Production", value: byStatus.Production, cls: "stat--mint", status: "Production" },
    { label: "Approved", value: byStatus.Approved, cls: "stat--mint", status: "Approved" },
  ];

  document.getElementById("stats").innerHTML = stats.map(s => {
    let scope = "";
    if (s.filter) scope = `data-filter="${s.filter}"`;
    else if (s.starter) scope = `data-starter="true"`;
    else if (s.recent) scope = `data-recent="true"`;
    else if (s.status) scope = `data-status="${s.status}"`;
    return `
      <button type="button" class="stat ${s.cls}" ${scope} title="Filter tools">
        <span class="stat__value">${s.value}</span>
        <span class="stat__label">${s.label}</span>
      </button>
    `;
  }).join("");
  syncStatsUI();
}

function syncStatsUI() {
  document.querySelectorAll("#stats .stat").forEach(el => {
    let active = false;
    if (el.dataset.starter === "true") {
      active = state.starter;
    } else if (el.dataset.recent === "true") {
      active = state.recent;
    } else if (state.starter || state.recent) {
      active = false;
    } else if (el.dataset.filter === "all") {
      active = !state.status && !state.statusBucket;
    } else if (el.dataset.status) {
      active = !state.statusBucket && el.dataset.status === state.status;
    }
    el.classList.toggle("is-active", active);
    el.setAttribute("aria-pressed", String(active));
  });
}

function countBy(key) {
  const catalog = directoryTools();
  const values = [...new Set(catalog.map(t => t[key]).filter(Boolean))].sort();
  const counts = Object.fromEntries(values.map(v => [v, catalog.filter(t => t[key] === v).length]));
  return { values, counts };
}

function renderChips() {
  const categories = countBy("category");
  const pricing = countBy("pricing");
  const catalog = directoryTools();
  const starterCount = startHereNames().filter(n => catalog.some(t => t.name === n)).length;
  const statusChips = STATUS_ORDER
    .filter(s => !isRejectedStatus(s) && s !== "Testing" && s !== "Exploring")
    .map(s => {
      const count = catalog.filter(t => t.status === s).length;
      return `<button class="chip" data-status="${escapeHtml(s)}" type="button">${escapeHtml(s)} (${count})</button>`;
    })
    .join("");
  const moreOpen = FILTERS_COLLAPSIBLE
    ? Boolean(state.category || state.pricing || state.status)
    : true;
  const moreClass = FILTERS_COLLAPSIBLE ? "" : " filter-more--always";

  const categoryChips = categories.values.map(c => `
    <button class="chip" data-category="${escapeHtml(c)}" type="button">${escapeHtml(c)} (${categories.counts[c]})</button>
  `).join("");
  const pricingChips = pricing.values.map(c => `
    <button class="chip" data-pricing="${escapeHtml(c)}" type="button">${escapeHtml(c)} (${pricing.counts[c]})</button>
  `).join("");

  document.getElementById("filterChips").innerHTML = `
    <details class="filter-more${moreClass}" id="filterMore"${moreOpen ? " open" : ""}>
      <summary class="filter-more__summary">Filters</summary>
      <div class="filter-more__body">
        <div class="filter-group filter-group--title">
          <div class="filter-group__title">Filters</div>
          <div class="chiprow">
            <button class="chip" data-filter="all" type="button">All (${catalog.length})</button>
            <button class="chip chip--starter" data-starter="true" type="button">Start here (${starterCount})</button>
          </div>
        </div>
        <div class="filter-group">
          <div class="filter-group__label">Category</div>
          <div class="chiprow">${categoryChips}</div>
        </div>
        <div class="filter-group">
          <div class="filter-group__label">Pricing</div>
          <div class="chiprow">${pricingChips}</div>
        </div>
        <div class="filter-group">
          <div class="filter-group__label">Status</div>
          <div class="chiprow">
            ${statusChips}
          </div>
        </div>
      </div>
    </details>
  `;
  syncChipUI();
}

function escapeRegExp(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Split search into words; ignore empty tokens. */
function searchTokens(query) {
  return String(query || "")
    .trim()
    .toLowerCase()
    .split(/[^a-z0-9_+./-]+/i)
    .map(t => t.trim())
    .filter(Boolean);
}

/** Match token as a whole word (avoids “ide” in “confidential” / “ideas”). */
function textHasToken(text, token) {
  if (!text || !token) return false;
  const re = new RegExp(
    `(?:^|[^a-z0-9_+./-])${escapeRegExp(token)}(?![a-z0-9])`,
    "i"
  );
  return re.test(` ${text}`);
}

/** Primary fields users expect search to hit (not alternatives / approvedModels). */
function toolSearchPrimary(tool) {
  return [
    tool.name, tool.category, tool.subcategory, tool.pricing,
    tool.description, tool.owner, tool.department, tool.priority,
    tool.assignedTo,
    ...(tool.useCases || []),
  ].join(" ");
}

/** Notes and tips — used only when primary fields have no hits. */
function toolSearchSecondary(tool) {
  return [
    tool.notes, tool.limitations, tool.whenToUse, tool.costNote, tool.securityTip,
    tool.learningCurve, tool.dataClassification, tool.status, tool.testingNotes,
  ].join(" ");
}

function tokensMatchText(text, tokens) {
  return tokens.every(tok => textHasToken(text, tok));
}

function toolMatchesPrimary(tool, tokens) {
  return tokensMatchText(toolSearchPrimary(tool), tokens);
}

function toolMatchesSecondary(tool, tokens) {
  const haystack = `${toolSearchPrimary(tool)} ${toolSearchSecondary(tool)}`;
  return tokensMatchText(haystack, tokens);
}

/** Prefer name / category / owner hits when a search is active. */
function searchRank(tool, query) {
  const tokens = searchTokens(query);
  if (!tokens.length) return 0;
  const name = String(tool.name || "");
  const category = `${tool.category || ""} ${tool.subcategory || ""}`;
  const primary = toolSearchPrimary(tool);
  let rank = 0;
  tokens.forEach(tok => {
    if (textHasToken(name, tok)) rank += 12;
    else if (textHasToken(category, tok)) rank += 5;
    else if (textHasToken(tool.owner || "", tok)) rank += 4;
    else if (textHasToken(primary, tok)) rank += 2;
    else rank += 1;
  });
  return rank;
}

function getFiltered() {
  const q = state.search.trim();
  const tokens = searchTokens(q);
  let list = directoryTools().filter(t => {
    if (state.starter) {
      if (!startHereNames().includes(t.name)) return false;
    } else if (state.recent) {
      if (!isRecentlyAdded(t)) return false;
    } else if (state.status) {
      if (t.status !== state.status) return false;
    } else if (state.statusBucket) {
      const allowed = STATUS_BUCKETS[state.statusBucket] || [];
      if (!allowed.includes(t.status)) return false;
    }
    if (state.category && t.category !== state.category) return false;
    if (state.pricing && t.pricing !== state.pricing) return false;
    return true;
  });

  // Search: prefer name/description/use-cases; only fall back to notes if nothing matches.
  if (tokens.length) {
    const primaryHits = list.filter(t => toolMatchesPrimary(t, tokens));
    list = primaryHits.length ? primaryHits : list.filter(t => toolMatchesSecondary(t, tokens));
  }

  const PRIORITY_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3, Backlog: 4 };
  const searching = Boolean(tokens.length);

  list.sort((a, b) => {
    if (searching) {
      const ra = searchRank(a, q);
      const rb = searchRank(b, q);
      if (rb !== ra) return rb - ra;
    }
    if (state.recent && state.sort === "name") {
      return String(b.dateAdded || "").localeCompare(String(a.dateAdded || "")) || a.name.localeCompare(b.name);
    }
    if (state.starter && state.sort === "name") {
      const names = startHereNames();
      const ia = names.indexOf(a.name);
      const ib = names.indexOf(b.name);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    }
    if (state.sort === "status") {
      const ia = STATUS_ORDER.indexOf(a.status);
      const ib = STATUS_ORDER.indexOf(b.status);
      return ((ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)) || a.name.localeCompare(b.name);
    }
    if (state.sort === "category") return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
    if (state.sort === "pricing") return (a.pricing || "").localeCompare(b.pricing || "") || a.name.localeCompare(b.name);
    if (state.sort === "priority") {
      const pa = PRIORITY_ORDER[a.priority] ?? 99;
      const pb = PRIORITY_ORDER[b.priority] ?? 99;
      return pa - pb || a.name.localeCompare(b.name);
    }
    if (state.sort === "reviewed") {
      const da = a.lastReviewed || "";
      const db = b.lastReviewed || "";
      return db.localeCompare(da) || a.name.localeCompare(b.name);
    }
    return a.name.localeCompare(b.name);
  });

  return list;
}

function logoHtml(tool) {
  const letter = escapeHtml((tool.name || "?").trim().charAt(0).toUpperCase());
  if (tool.logo) {
    return `<div class="card__logo" data-letter="${letter}"><img src="${escapeHtml(tool.logo)}" alt="" loading="lazy" onerror="this.parentElement.classList.add('is-fallback'); this.remove();"></div>`;
  }
  if (tool.url) {
    try {
      const host = new URL(tool.url).hostname.replace(/^www\./, "");
      const src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`;
      return `<div class="card__logo" data-letter="${letter}"><img src="${src}" alt="" loading="lazy" onerror="this.parentElement.classList.add('is-fallback'); this.remove();"></div>`;
    } catch (_) { /* fall through */ }
  }
  return `<div class="card__logo is-fallback" data-letter="${letter}"></div>`;
}

function normalizeToolUrl(url) {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.hostname}${u.pathname}`.replace(/\/+$/, "").toLowerCase();
  } catch (_) {
    return String(url || "").trim().replace(/\/+$/, "").toLowerCase();
  }
}

function submissionCatalogTool(item) {
  const linkKey = normalizeToolUrl(item.link);
  const nameKey = (item.toolName || "").trim().toLowerCase();
  if (!linkKey && !nameKey) return null;
  return TOOLS.find(t => linkKey && t.url && normalizeToolUrl(t.url) === linkKey)
    || TOOLS.find(t => nameKey && t.name.toLowerCase() === nameKey)
    || null;
}

function submissionLogoHtml(item) {
  const name = (item.toolName || "").trim() || hostnameFromLink(item.link);
  const catalog = submissionCatalogTool(item);
  return logoHtml({ name, url: item.link, logo: catalog?.logo });
}

function submissionLinkHtml(item) {
  const href = escapeHtml(item.link);
  const hasName = Boolean((item.toolName || "").trim());
  const label = hasName ? item.toolName.trim() : hostnameFromLink(item.link);
  return `<a class="submission-item__link" href="${href}" target="_blank" rel="noopener" aria-label="Open ${escapeHtml(label)} website">${escapeHtml(label)}<span class="submission-item__link-icon" aria-hidden="true">↗</span></a>`;
}

function cardNameHtml(tool) {
  const name = escapeHtml(tool.name);
  return `<h3 class="card__name"><button type="button" class="card__name-btn" data-open-details="${escapeHtml(tool.id)}" aria-label="View details for ${name}">${name}</button></h3>`;
}

function cardSiteLinkHtml(tool) {
  if (!tool.url) return "";
  const name = escapeHtml(tool.name);
  return `<a class="card__cta-secondary" href="${escapeHtml(tool.url)}" target="_blank" rel="noopener" aria-label="Open ${name} website in a new tab">Open site <span aria-hidden="true">↗</span></a>`;
}

function tagListHtml(tool, { includePlatform = false } = {}) {
  const tags = [tool.category, tool.pricing].filter(Boolean);
  if (includePlatform && tool.platform && tool.platform.length) {
    tags.push(...tool.platform);
  }
  if (!tags.length) return "";
  return `
    <div class="card__tags">
      ${tags.map(tag => `<span class="card__tag">${escapeHtml(tag)}</span>`).join("")}
    </div>
  `;
}

/** Modal header tags — category and pricing only. */
function modalMetaTagsHtml(tool) {
  const tags = [tool.category, tool.pricing].filter(Boolean);
  if (!tags.length) return "";
  return `
    <div class="card__tags">
      ${tags.map(tag => `<span class="card__tag">${escapeHtml(tag)}</span>`).join("")}
    </div>
  `;
}

/** Admin assign button or team assignee label — shown next to tags in the modal header. */
function modalMetaAssignmentHtml(tool) {
  if (!toolIsInTestTrack(tool)) return "";
  if (isAdminSession()) {
    return `<button type="button" class="assignment-meta-btn" id="toolAssignmentOpen">Assign tool</button>`;
  }
  const assignee = effectiveAssignment(tool).assignedTo;
  if (!assignee) return "";
  return `<span class="card__tag card__tag--assignee">Assigned to: ${escapeHtml(assignee)}</span>`;
}

function starsHtml(evalData) {
  if (!evalData || evalData.score === "" || evalData.score == null) return "";
  const score = Math.max(0, Math.min(5, parseFloat(evalData.score)));
  if (Number.isNaN(score)) return "";

  const rounded = Math.round(score * 2) / 2;
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    if (rounded >= i) stars += `<span class="star star--full" aria-hidden="true">★</span>`;
    else if (rounded >= i - 0.5) stars += `<span class="star star--half" aria-hidden="true">★</span>`;
    else stars += `<span class="star star--empty" aria-hidden="true">★</span>`;
  }

  return `
    <div class="stars" role="img" aria-label="Rated ${rounded} out of 5">
      ${stars}
    </div>
  `;
}

/** Stars when scored; Testing/Exploring (and other pre-approval) show nothing. */
function ratingHtml(evalData, tool) {
  if (tool && !toolCanHaveScore(tool)) return "";
  const stars = starsHtml(evalData);
  if (stars) return stars;
  if (tool && toolCanHaveScore(tool)) {
  return `<span class="rating-pending">Not scored yet</span>`;
  }
  return "";
}

function hasScoredEval(evalData, tool) {
  if (tool && !toolCanHaveScore(tool)) return false;
  if (!evalData || evalData.score === "" || evalData.score == null) return false;
  return !Number.isNaN(parseFloat(evalData.score));
}

function hasUsefulEval(evalData, tool) {
  if (!evalData) return false;
  if (tool && !toolCanHaveScore(tool)) {
    // Keep notes/criteria for context, but never treat score as useful pre-approval.
    return Boolean(evalData.criteria) || Boolean(evalData.notes) || Boolean(evalData.date);
  }
  return hasScoredEval(evalData, tool) || Boolean(evalData.criteria) || Boolean(evalData.notes) || Boolean(evalData.date);
}

function toolAssignmentsEnabled() {
  return typeof getToolAssignmentConfig === "function"
    ? getToolAssignmentConfig().enabled
    : true;
}

function teamDirectoryEnabled() {
  return typeof getTeamDirectoryConfig === "function"
    ? getTeamDirectoryConfig().enabled
    : true;
}

function teamMembersData() {
  return Array.isArray(typeof TEAM_MEMBERS !== "undefined" ? TEAM_MEMBERS : null)
    ? TEAM_MEMBERS
    : [];
}

function getActiveTeamMembers() {
  return teamMembersData()
    .filter(member => member.active !== false && member.name && member.email)
    .sort((a, b) => a.name.localeCompare(b.name));
}

function findTeamMemberByName(name) {
  const key = String(name || "").trim().toLowerCase();
  if (!key) return null;
  return getActiveTeamMembers().find(member => member.name.toLowerCase() === key) || null;
}

function readTeamRegisterPending() {
  try {
    const raw = localStorage.getItem(TEAM_REGISTER_PENDING_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeTeamRegisterPending(list) {
  localStorage.setItem(TEAM_REGISTER_PENDING_KEY, JSON.stringify(list));
}

function teamMemberPublishCommand(name, email, department, role) {
  const safeName = String(name || "").replace(/"/g, '\\"');
  const safeEmail = String(email || "").replace(/"/g, '\\"');
  const safeDept = String(department || "").replace(/"/g, '\\"');
  const safeRole = String(role || "Team").replace(/"/g, '\\"');
  return `python scripts/add_team_member.py --name "${safeName}" --email "${safeEmail}" --department "${safeDept}" --role "${safeRole}"`;
}

function toolIsInTestTrack(tool) {
  return toolAssignmentsEnabled() && TOOL_ASSIGNABLE_STATUSES.has(tool?.status);
}

function readToolAssignmentOverrides() {
  try {
    const raw = localStorage.getItem(TOOL_ASSIGNMENT_KEY);
    const data = raw ? JSON.parse(raw) : null;
    return data && typeof data === "object" ? data : {};
  } catch {
    return {};
  }
}

function writeToolAssignmentOverride(toolId, payload) {
  const all = readToolAssignmentOverrides();
  all[String(toolId)] = {
    assignedTo: String(payload.assignedTo || "").trim(),
    testingNotes: String(payload.testingNotes || "").trim(),
    updatedAt: Date.now(),
  };
  localStorage.setItem(TOOL_ASSIGNMENT_KEY, JSON.stringify(all));
}

function applyAssignmentOverrides() {
  const overrides = readToolAssignmentOverrides();
  TOOLS.forEach(tool => {
    const o = overrides[tool.id];
    if (!o) return;
    if (o.assignedTo != null) tool.assignedTo = o.assignedTo;
    if (o.testingNotes != null) tool.testingNotes = o.testingNotes;
  });
}

function effectiveAssignment(tool) {
  if (!tool) return { assignedTo: "", testingNotes: "" };
  return {
    assignedTo: String(tool.assignedTo || "").trim(),
    testingNotes: String(tool.testingNotes || "").trim(),
  };
}

function truncateAssignmentText(text, max = 120) {
  const value = String(text || "").trim();
  if (value.length <= max) return value;
  return `${value.slice(0, max - 1)}…`;
}

function assignmentPublishCommand(toolId, assignedTo, testingNotes) {
  const assignee = String(assignedTo || "").replace(/"/g, '\\"');
  const notes = String(testingNotes || "").replace(/\s+/g, " ").replace(/"/g, '\\"').trim();
  return `python scripts/set_tool_assignment.py --id ${toolId} --assignee "${assignee}" --notes "${notes}"`;
}

function assignmentAssigneeFieldHtml(assignedTo) {
  const members = getActiveTeamMembers();
  if (members.length) {
    const options = [`<option value="">Select teammate…</option>`]
      .concat(members.map(member => {
        const selected = member.name === assignedTo ? " selected" : "";
        const dept = member.department ? ` · ${member.department}` : "";
        return `<option value="${escapeHtml(member.name)}"${selected}>${escapeHtml(member.name)}${escapeHtml(dept)}</option>`;
      }));
    const email = resolveAssigneeEmail(assignedTo);
    return `
      <div class="field">
        <label for="toolAssignName">Assigned to</label>
        <select id="toolAssignName" class="tool-assignment__input">${options.join("")}</select>
      </div>
      <div class="field">
        <label for="toolAssignEmailPreview">Email</label>
        <input type="email" id="toolAssignEmailPreview" class="tool-assignment__input tool-assignment__input--readonly" readonly tabindex="-1" value="${escapeHtml(email)}" placeholder="Select a teammate">
      </div>
    `;
  }
  return `
    <div class="field">
      <label for="toolAssignName">Assigned to</label>
      <input type="text" id="toolAssignName" class="tool-assignment__input" maxlength="60" placeholder="Teammate name" value="${escapeHtml(assignedTo)}">
    </div>
  `;
}

function bindAssignmentAssigneeField() {
  const field = document.getElementById("toolAssignName");
  const preview = document.getElementById("toolAssignEmailPreview");
  if (!field || !preview || field.tagName !== "SELECT") return;
  const sync = () => {
    const email = resolveAssigneeEmail(field.value);
    preview.value = email;
    preview.placeholder = field.value && !email ? "No email on file" : "Select a teammate";
  };
  field.onchange = sync;
  sync();
}

function resolveAssigneeEmail(name) {
  const key = String(name || "").trim();
  if (!key) return "";
  const member = findTeamMemberByName(key);
  if (member?.email) return String(member.email).trim();
  const notify = getToolAssignmentConfig().notify;
  if (notify.assigneeEmails[key]) return String(notify.assigneeEmails[key]).trim();
  const lowerKey = key.toLowerCase();
  for (const [label, email] of Object.entries(notify.assigneeEmails)) {
    if (label.toLowerCase() === lowerKey) return String(email).trim();
  }
  if (notify.emailDomain && /^[A-Za-z][A-Za-z .'\-]*$/.test(key)) {
    const slug = key.split(/\s+/)[0].toLowerCase().replace(/[^a-z0-9]/g, "");
    if (slug) return `${slug}@${notify.emailDomain}`;
  }
  return "";
}

async function sendAssignmentNotification(tool, assignedTo, testingNotes) {
  const notify = getToolAssignmentConfig().notify;
  if (!notify.enabled || !notify.webhookUrl) {
    return { skipped: true, reason: "disabled" };
  }
  const assigneeEmail = resolveAssigneeEmail(assignedTo);
  if (!assigneeEmail) {
    return { skipped: true, reason: "no-email" };
  }
  const site = typeof getSiteConfig === "function" ? getSiteConfig() : {};
  const notifyCfg = getToolAssignmentConfig().notify;
  const payload = {
    assigneeName: assignedTo,
    assigneeEmail,
    toolId: tool.id,
    toolName: tool.name,
    toolStatus: tool.status,
    toolUrl: tool.url || "",
    testingNotes,
    siteUrl: site.liveSite || window.location.origin,
    fromLabel: notifyCfg.fromLabel,
  };
  try {
    const headers = { "Content-Type": "application/json" };
    if (notify.webhookSecret) headers.Authorization = `Bearer ${notify.webhookSecret}`;
    const res = await fetch(notify.webhookUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { ok: false, reason: `http-${res.status}` };
    return { ok: true, email: assigneeEmail };
  } catch {
    return { ok: false, reason: "network" };
  }
}

function appendAssignmentNotifyStatus(result, assigneeName) {
  const status = document.getElementById("toolAssignStatus");
  if (!status || result.skipped && result.reason === "disabled") return;
  if (result.ok) {
    status.innerHTML += `<br>Notification email sent to ${escapeHtml(result.email)}.`;
    return;
  }
  if (result.reason === "no-email") {
    status.innerHTML += `<br>No email on file for ${escapeHtml(assigneeName)} — add them via Home → Team directory.`;
    return;
  }
  if (!result.skipped) {
    status.innerHTML += `<br>Could not send notification email (${escapeHtml(result.reason || "error")}).`;
  }
}

async function notifyAfterAssignmentSave(tool, assignedTo, testingNotes, previous) {
  if (!assignedTo) return;
  if (previous.assignedTo === assignedTo && previous.testingNotes === testingNotes) return;
  const result = await sendAssignmentNotification(tool, assignedTo, testingNotes);
  appendAssignmentNotifyStatus(result, assignedTo);
}

function assignmentSummaryHtml(tool) {
  return "";
}

function renderToolAssignmentCardContent(tool) {
  if (!isAdminSession() || !toolIsInTestTrack(tool)) return "";
  const { assignedTo, testingNotes } = effectiveAssignment(tool);
  const hasAssignment = Boolean(assignedTo || testingNotes);

  return `
    <div class="tool-assignment-wrap" id="toolAssignmentWrap" data-tool-id="${escapeHtml(tool.id)}">
      <h2 class="modal__name" id="assignmentTitle">${escapeHtml(tool.status)} assignment</h2>
      <p class="assignment-card__tool">${escapeHtml(tool.name)}</p>
      <div class="tool-assignment tool-assignment--edit" id="toolAssignmentEdit">
        ${assignmentAssigneeFieldHtml(assignedTo)}
        <div class="field">
          <label for="toolAssignNotes">Admin notes</label>
          <textarea id="toolAssignNotes" class="tool-assignment__textarea" rows="4" maxlength="500" placeholder="What to try, success criteria, deadline hints…">${escapeHtml(testingNotes)}</textarea>
        </div>
        <div class="tool-assignment__actions">
          <button type="button" class="btn-base btn-primary" id="toolAssignSave">Save assignment</button>
          ${hasAssignment ? `<button type="button" class="linkbtn" id="toolAssignClear">Clear assignment</button>` : ""}
        </div>
        <p class="field-note" id="toolAssignStatus" hidden></p>
      </div>
    </div>
  `;
}

function persistToolAssignment(tool, assignedTo, testingNotes, statusMessage) {
  tool.assignedTo = assignedTo;
  tool.testingNotes = testingNotes;
  writeToolAssignmentOverride(tool.id, { assignedTo, testingNotes });
  renderCards();
  openModal(tool);
  refreshAssignmentModal(tool);
  setTimeout(() => {
    const status = document.getElementById("toolAssignStatus");
    if (status && statusMessage) {
      status.hidden = false;
      status.innerHTML = statusMessage;
    }
  }, 0);
}

let assignmentModalToolId = null;

function openAssignmentModal(tool) {
  if (!isAdminSession() || !toolIsInTestTrack(tool)) return;
  assignmentModalToolId = tool.id;
  document.getElementById("assignmentBody").innerHTML = renderToolAssignmentCardContent(tool);
  document.getElementById("assignmentOverlay").hidden = false;
  bindToolAssignmentPanel(tool);
  bindAssignmentAssigneeField();
  document.getElementById("toolAssignName")?.focus();
}

function refreshAssignmentModal(tool) {
  if (!tool || assignmentModalToolId !== tool.id) return;
  if (document.getElementById("assignmentOverlay").hidden) return;
  document.getElementById("assignmentBody").innerHTML = renderToolAssignmentCardContent(tool);
  bindToolAssignmentPanel(tool);
  bindAssignmentAssigneeField();
}

function closeAssignmentModal() {
  document.getElementById("assignmentOverlay").hidden = true;
  assignmentModalToolId = null;
}

function bindToolAssignmentTrigger(tool) {
  if (!isAdminSession() || !toolIsInTestTrack(tool)) return;
  const btn = document.getElementById("toolAssignmentOpen");
  if (btn) btn.onclick = () => openAssignmentModal(tool);
}

function bindToolAssignmentPanel(tool) {
  if (!isAdminSession() || !toolIsInTestTrack(tool)) return;
  const wrap = document.getElementById("toolAssignmentWrap");
  if (!wrap) return;
  const saveBtn = document.getElementById("toolAssignSave");
  const clearBtn = document.getElementById("toolAssignClear");
  if (!saveBtn && !clearBtn) return;

  if (saveBtn) {
    saveBtn.onclick = () => {
      const assignedTo = document.getElementById("toolAssignName")?.value?.trim() || "";
      const testingNotes = document.getElementById("toolAssignNotes")?.value?.trim() || "";
      if (!assignedTo) {
        const status = document.getElementById("toolAssignStatus");
        if (status) {
          status.hidden = false;
          status.textContent = "Select who should test or explore this tool.";
        }
        document.getElementById("toolAssignName")?.focus();
        return;
      }
      if (!findTeamMemberByName(assignedTo) && !/^[A-Za-z][A-Za-z .'\-]*$/.test(assignedTo)) {
        const status = document.getElementById("toolAssignStatus");
        if (status) {
          status.hidden = false;
          status.textContent = "Use a simple name (letters, spaces, hyphens only).";
        }
        document.getElementById("toolAssignName")?.focus();
        return;
      }
      const cmd = assignmentPublishCommand(tool.id, assignedTo, testingNotes);
      const previous = effectiveAssignment(tool);
      persistToolAssignment(
        tool,
        assignedTo,
        testingNotes,
        `Saved on this device. To show everyone after deploy, run: <code>${escapeHtml(cmd)}</code> then commit and push.`
      );
      navigator.clipboard?.writeText(cmd).catch(() => {});
      void notifyAfterAssignmentSave(tool, assignedTo, testingNotes, previous);
    };
  }

  if (clearBtn) {
    clearBtn.onclick = () => {
      const cmd = `python scripts/set_tool_assignment.py --id ${tool.id} --assignee "" --clear-notes`;
      persistToolAssignment(
        tool,
        "",
        "",
        `Assignment cleared on this device. To update the team copy, run: <code>${escapeHtml(cmd)}</code> then commit and push.`
      );
      navigator.clipboard?.writeText(cmd).catch(() => {});
    };
  }
}

function chipFiltersAreActive() {
  return Boolean(
    state.starter ||
    state.recent ||
    state.status ||
    state.statusBucket ||
    state.category ||
    state.pricing
  );
}

function filtersAreActive() {
  return Boolean(
    state.search.trim() ||
    state.starter ||
    state.recent ||
    state.status ||
    state.statusBucket ||
    state.category ||
    state.pricing
  );
}

function isCompared(id) {
  return state.compareIds.includes(id);
}

function renderCards() {
  const list = getFiltered();
  const grid = document.getElementById("toolGrid");
  const empty = document.getElementById("emptyState");
  const count = document.getElementById("resultCount");
  const clearBtn = document.getElementById("clearFilters");

  const catalogCount = directoryTools().length;
  count.textContent = `${list.length} of ${catalogCount} tool${catalogCount === 1 ? "" : "s"}`;
  clearBtn.hidden = !filtersAreActive();

  if (list.length === 0) {
    grid.innerHTML = "";
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  grid.innerHTML = list.map((t, i) => {
    const group = STATUS_GROUP[t.status] || "blue";
    const selected = isCompared(t.id);
    const tone = directoryCardTone(t, i);
    return `
      <article class="directory-item playbook-card playbook-card--directory playbook-tone--${tone}${selected ? " directory-item--selected" : ""}" data-id="${escapeHtml(t.id)}" style="animation-delay:${Math.min(i * 30, 300)}ms">
        ${state.compareMode ? `
          <label class="card__compare">
            <input type="checkbox" data-compare-id="${escapeHtml(t.id)}" ${selected ? "checked" : ""} ${!selected && state.compareIds.length >= COMPARE_MAX ? "disabled" : ""}>
            <span>Select</span>
          </label>
        ` : ""}
        <div class="directory-item__top">
          <div class="directory-item__identity">
            ${logoHtml(t)}
            ${cardNameHtml(t)}
          </div>
          <div class="card__badges">
            ${isRecentlyAdded(t) ? `<span class="card__new">New</span>` : ""}
            <span class="badge badge--${group}">${escapeHtml(t.status)}</span>
          </div>
        </div>
        ${tagListHtml(t)}
        <p class="card__desc">${escapeHtml(t.description)}</p>
        ${assignmentSummaryHtml(t)}
        <div class="card__actions">
          <button type="button" class="card__cta" data-open-details="${escapeHtml(t.id)}">View details</button>
          ${cardSiteLinkHtml(t)}
        </div>
      </article>
    `;
  }).join("");
}

function detailField(label, value) {
  if (!value || (Array.isArray(value) && !value.length)) return "";
  const display = Array.isArray(value) ? value.join(" · ") : value;
  return `
    <div class="detail-field">
      <div class="detail-field__label">${escapeHtml(label)}</div>
      <div class="detail-field__value">${escapeHtml(display)}</div>
    </div>
  `;
}

function detailPills(label, values) {
  if (!values || !values.length) return "";
  return `
    <div class="detail-field detail-field--wide">
      <div class="detail-field__label">${escapeHtml(label)}</div>
      <div class="card__tags">
        ${values.map(v => `<span class="card__tag">${escapeHtml(v)}</span>`).join("")}
      </div>
    </div>
  `;
}

function youtubeEmbedId(url) {
  if (!url) return "";
  try {
    const parsed = new URL(String(url).trim());
    const host = (parsed.hostname || "").replace(/^www\./, "").toLowerCase();
    if (host === "youtu.be") {
      return parsed.pathname.replace(/^\//, "").split("/")[0] || "";
    }
    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      const v = parsed.searchParams.get("v");
      if (v) return v;
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (parts[0] && ["embed", "shorts", "live"].includes(parts[0]) && parts[1]) {
        return parts[1];
      }
    }
  } catch {
    return "";
  }
  return "";
}

function tutorialHtml(tool) {
  const url = (tool.videoUrl || "").trim();
  if (!url) return "";
  const yt = youtubeEmbedId(url);
  if (yt) {
    return `
      <div class="tool-tutorial">
        <div class="tool-tutorial__head">
          <h3 class="tool-tutorial__title" id="tutorialTitle">Tutorial</h3>
          <p class="tool-tutorial__desc">Watch a getting-started walkthrough, then open the tool.</p>
        </div>
        <div class="tool-tutorial__frame">
          <iframe
            src="https://www.youtube-nocookie.com/embed/${escapeHtml(yt)}"
            title="${escapeHtml(tool.name)} tutorial"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen
            loading="lazy"
            referrerpolicy="strict-origin-when-cross-origin"
          ></iframe>
        </div>
      </div>
    `;
  }
  return `
    <div class="tool-tutorial">
      <div class="tool-tutorial__head">
        <h3 class="tool-tutorial__title" id="tutorialTitle">Tutorial</h3>
        <p class="tool-tutorial__desc">Open the getting-started walkthrough in a new tab.</p>
      </div>
      <a class="modal__cta" href="${escapeHtml(url)}" target="_blank" rel="noopener">Watch tutorial ↗</a>
    </div>
  `;
}

function glanceFactsHtml(tool) {
  const useCases = detailPills("Use cases", tool.useCases);
  const models = detailPills("Approved models", tool.approvedModels);
  return `
    <div class="tool-glance__facts">
      <div class="tool-tutorial__head">
        <h3 class="tool-tutorial__title">Basic details</h3>
      </div>
      <div class="tool-facts">
        ${detailField("Subcategory", tool.subcategory || "—")}
        ${detailField("Department", tool.department || "—")}
        ${detailField("Priority", tool.priority || "—")}
        ${detailField("Learning curve", tool.learningCurve || "—")}
        ${detailField("Date added", tool.dateAdded || "—")}
        ${detailField("Last reviewed", tool.lastReviewed || "Not reviewed")}
      </div>
      ${useCases || models ? `<div class="tool-facts__pills">${useCases}${models}</div>` : ""}
    </div>
  `;
}

function toolGlanceHtml(tool) {
  const tutorial = tutorialHtml(tool);
  return `
    <section class="tool-glance${tutorial ? "" : " tool-glance--facts-only"}" aria-label="Tutorial and key facts">
      ${tutorial ? `<div class="tool-glance__media">${tutorial}</div>` : ""}
      ${glanceFactsHtml(tool)}
    </section>
  `;
}

function syncToolBackLabel() {
  const btn = document.getElementById("modalClose");
  if (!btn) return;
  const back = state.toolReturnView && state.toolReturnView !== "tool" ? state.toolReturnView : "directory";
  const labels = {
    home: "← Back to AI hub",
    directory: "← Back to directory",
    guides: "← Back to guides",
    prompts: "← Back to prompts",
    playbooks: "← Back to playbooks",
    submissions: "← Back to submissions",
    contribute: "← Back to contribute",
  };
  btn.textContent = labels[back] || "← Back to directory";
}

function openModal(tool) {
  if (!tool || isRejectedStatus(tool.status)) return;
  if (state.view !== "tool") {
    state.toolReturnView = VIEWS.includes(state.view) && state.view !== "tool" ? state.view : "directory";
  }
  state.currentToolId = tool.id;
  const group = STATUS_GROUP[tool.status] || "blue";
  const evalData = evaluationFor(tool);
  document.getElementById("modalBody").innerHTML = `
    <div class="modal__header">
      ${logoHtml(tool)}
      <div>
        <h2 class="modal__name" id="modalName">${escapeHtml(tool.name)}</h2>
        <div class="modal__meta">
          <span class="badge badge--${group}">${escapeHtml(tool.status)}</span>
          ${ratingHtml(evalData, tool)}
          ${modalMetaTagsHtml(tool)}
          ${modalMetaAssignmentHtml(tool)}
        </div>
      </div>
    </div>
    <p class="modal__desc">${escapeHtml(tool.description)}</p>
    ${toolGlanceHtml(tool)}

    <div class="detail-panels">
      ${tool.whenToUse ? `<div class="modal__notes"><strong>When to use</strong>${escapeHtml(tool.whenToUse)}</div>` : ""}
      ${tool.alternatives ? `<div class="modal__notes"><strong>Alternatives</strong>${escapeHtml(tool.alternatives)}</div>` : ""}
      ${tool.notes ? `<div class="modal__notes"><strong>Team notes</strong>${escapeHtml(tool.notes)}</div>` : ""}
      ${tool.limitations ? `<div class="modal__notes modal__notes--caution"><strong>Limitations</strong>${escapeHtml(tool.limitations)}</div>` : ""}
      ${tool.costNote || tool.securityTip ? `
        <div class="modal__notes">
          <strong>Cost & security</strong>
          ${tool.costNote ? `
            <div class="eval-row">
              <span class="eval-label">Cost</span>
              <span class="eval-value">${escapeHtml(tool.costNote)}</span>
            </div>` : ""}
          ${tool.securityTip ? `
            <div class="eval-row">
              <span class="eval-label">Security</span>
              <span class="eval-value">${escapeHtml(tool.securityTip)}</span>
            </div>` : ""}
        </div>` : ""}
      ${hasUsefulEval(evalData, tool) ? `
        <div class="modal__notes modal__eval">
          <strong>Evaluation</strong>
          ${toolCanHaveScore(tool) ? `<div class="modal__stars-row">${ratingHtml(evalData, tool)}</div>` : ""}
          ${evalData.criteria ? `
            <div class="eval-row">
              <span class="eval-label">Criteria</span>
              <span class="eval-value">${escapeHtml(evalData.criteria)}</span>
            </div>` : ""}
          ${evalData.date ? `
            <div class="eval-row">
              <span class="eval-label">Evaluated</span>
              <span class="eval-value">${escapeHtml(evalData.date)}</span>
            </div>` : ""}
          ${evalData.notes ? `<div class="eval-note">${escapeHtml(evalData.notes)}</div>` : ""}
        </div>
      ` : ""}
    </div>
    <div class="modal__actions">
      <button type="button" class="modal__cta modal__cta--secondary" id="modalCompareBtn" data-id="${escapeHtml(tool.id)}">
        ${isCompared(tool.id) ? "Remove from compare" : state.compareIds.length >= COMPARE_MAX ? "Compare list is full" : "Add to compare"}
      </button>
      ${tool.url ? `<a class="modal__cta" href="${escapeHtml(tool.url)}" target="_blank" rel="noopener">Open ${escapeHtml(tool.name)}</a>` : ""}
    </div>
  `;
  const compareBtn = document.getElementById("modalCompareBtn");
  if (compareBtn && !isCompared(tool.id) && state.compareIds.length >= COMPARE_MAX) {
    compareBtn.disabled = true;
  }
  bindToolAssignmentTrigger(tool);
  syncToolBackLabel();
  showView("tool");
}

function closeModal() {
  closeAssignmentModal();
  const back = state.toolReturnView && state.toolReturnView !== "tool" ? state.toolReturnView : "directory";
  state.currentToolId = null;
  document.body.style.overflow = "";
  showView(back);
}

function findToolByQuery(raw) {
  if (!raw) return null;
  const q = String(raw).trim().toLowerCase();
  if (!q) return null;
  return TOOLS.find(t =>
    (t.id && t.id.toLowerCase() === q) ||
    (t.name && t.name.toLowerCase() === q)
  ) || null;
}

function setToolQueryParam(tool) {
  syncUrl({ tool });
}

/** Persist view + filters + optional tool deep link for Slack/share URLs. */
function syncUrl({ tool } = {}) {
  const url = new URL(window.location.href);
  const params = url.searchParams;

  if (state.view && state.view !== "home") params.set("view", state.view);
  else params.delete("view");

  if (state.starter) params.set("starter", "1");
  else params.delete("starter");

  if (state.recent) params.set("recent", "1");
  else params.delete("recent");

  if (state.status) params.set("status", state.status);
  else params.delete("status");

  if (state.statusBucket) params.set("bucket", state.statusBucket);
  else params.delete("bucket");

  if (state.category) params.set("category", state.category);
  else params.delete("category");

  if (state.pricing) params.set("pricing", state.pricing);
  else params.delete("pricing");

  const q = state.search.trim();
  if (q) params.set("q", q);
  else params.delete("q");

  if (state.sort && state.sort !== "name") params.set("sort", state.sort);
  else params.delete("sort");

  if (state.view === "prompts" && state.promptRole && state.promptRole !== "All") {
    params.set("role", state.promptRole);
  } else if (state.view === "playbooks" && state.playbookRole && state.playbookRole !== "All") {
    params.set("role", state.playbookRole);
  } else {
    params.delete("role");
  }

  if (state.view === "prompts" && state.promptUseCase && state.promptUseCase !== "All") {
    params.set("puse", state.promptUseCase);
  } else {
    params.delete("puse");
  }

  if (state.view === "prompts" && state.promptSearch.trim()) {
    params.set("pq", state.promptSearch.trim());
  } else {
    params.delete("pq");
  }

  if (state.view === "prompts" && state.promptId) {
    params.set("pid", state.promptId);
  } else {
    params.delete("pid");
  }

  if (state.view === "playbooks" && state.playbookSearch.trim()) {
    params.set("bq", state.playbookSearch.trim());
  } else {
    params.delete("bq");
  }

  if (state.view === "contribute" && state.contribTab === "win") params.set("tab", "win");
  else params.delete("tab");

  if (state.view === "home" && state.chooserJobId) params.set("job", state.chooserJobId);
  else params.delete("job");

  if (state.view === "tool") {
    const current = TOOLS.find(t => t.id === state.currentToolId);
    if (current) params.set("tool", current.name);
    else params.delete("tool");
  } else if (tool === null) {
    params.delete("tool");
  } else if (tool && tool.name) {
    params.set("tool", tool.name);
  } else {
    params.delete("tool");
  }

  history.replaceState(null, "", url);
}

/** Restore view + filters from URL params. */
function applyFiltersFromUrl() {
  const params = new URLSearchParams(window.location.search);

  const view = params.get("view");
  if (view && VIEWS.includes(view)) state.view = view;

  if (params.get("starter") === "1") {
    state.starter = true;
    state.recent = false;
    state.status = null;
    state.statusBucket = null;
    if (!view) state.view = "directory";
  } else if (params.get("recent") === "1") {
    state.recent = true;
    state.starter = false;
    state.status = null;
    state.statusBucket = null;
    if (!view) state.view = "directory";
  } else {
    state.starter = false;
    state.recent = false;
    const statusRaw = params.get("status");
    const statusAliases = {
      Adopted: "Approved",
      Pilot: "Testing",
      Planned: "Exploring",
      Researching: "Exploring",
      Deprecated: "Archived",
    };
    const status = statusAliases[statusRaw] || statusRaw;
    const bucket = params.get("bucket");
    if (status === "Testing" || status === "Exploring") {
      state.status = null;
      state.statusBucket = null;
    } else if (status && STATUS_ORDER.includes(status)) {
      state.status = status;
      state.statusBucket = null;
      if (!view) state.view = "directory";
    } else if (bucket) {
      const resolved = STATUS_BUCKETS[bucket]
        ? bucket
        : LEGACY_STATUS_BUCKETS[bucket];
      if (resolved === "trying" || resolved === "exploring") {
        state.status = null;
        state.statusBucket = null;
      } else if (resolved && STATUS_BUCKETS[resolved]) {
        state.status = null;
        state.statusBucket = resolved;
        if (!view) state.view = "directory";
      }
    }
  }

  const category = params.get("category");
  if (category && TOOLS.some(t => t.category === category)) {
    state.category = category;
    if (!view) state.view = "directory";
  }

  const pricing = params.get("pricing");
  if (pricing && TOOLS.some(t => t.pricing === pricing)) {
    state.pricing = pricing;
    if (!view) state.view = "directory";
  }

  const q = params.get("q");
  if (q) {
    state.search = q;
    const input = document.getElementById("searchInput");
    if (input) input.value = q;
    if (!view) state.view = "directory";
  }

  const sort = params.get("sort");
  const sortSelect = document.getElementById("sortSelect");
  if (sort && sortSelect && [...sortSelect.options].some(o => o.value === sort)) {
    state.sort = sort;
    sortSelect.value = sort;
  }

  const job = params.get("job");
  if (job && jobsData().some(j => j.id === job)) {
    state.chooserJobId = job;
    if (!view) state.view = "home";
  }

  const role = params.get("role");
  if (role) {
    if (state.view === "prompts") state.promptRole = role;
    if (state.view === "playbooks") state.playbookRole = role;
  }

  const puse = params.get("puse");
  if (puse && state.view === "prompts") {
    state.promptUseCase = puse;
  }

  // Legacy pcat links collapse into search so old URLs still help
  const pcat = params.get("pcat");
  if (pcat && state.view === "prompts" && !params.get("pq")) {
    state.promptSearch = pcat;
  }

  const pq = params.get("pq");
  if (pq && state.view === "prompts") {
    state.promptSearch = pq;
  }

  const pid = params.get("pid");
  if (pid && state.view === "prompts") {
    state.promptId = pid;
  } else if (pid && !params.get("view")) {
    state.view = "prompts";
    state.promptId = pid;
  }

  const bq = params.get("bq");
  if (bq && (state.view === "playbooks" || !params.get("view"))) {
    if (!params.get("view")) state.view = "playbooks";
    state.playbookSearch = bq;
  }

  if (params.get("tab") === "win") {
    state.contribTab = "win";
    if (!view) state.view = "submissions";
  }

  if (params.get("compare") === "1" && !params.get("tool")) {
    if (!view) state.view = "directory";
  }

  const deepTool = findToolByQuery(params.get("tool"));
  if (deepTool) {
    state.currentToolId = deepTool.id;
    state.toolReturnView = view && view !== "tool" ? view : "directory";
    state.view = "tool";
  }
}

/** Open a tool from ?tool=Name or ?tool=AIT-001 (e.g. shared Slack links). */
function openToolFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const tool = findToolByQuery(params.get("tool"));
  if (!tool) return;
  if (state.view !== "directory" && state.view !== "home" && state.view !== "guides") {
    // keep current view; modal works globally
  }
  openModal(tool);
}

function resetChipFilters() {
  state.starter = false;
  state.recent = false;
  state.status = null;
  state.statusBucket = null;
  state.category = null;
  state.pricing = null;
}

function syncChipUI() {
  const allActive = !chipFiltersAreActive();
  document.querySelectorAll("#filterChips .chip").forEach(el => {
    if (el.dataset.starter === "true") {
      el.classList.toggle("active", state.starter);
      return;
    }
    if (el.dataset.filter === "all") {
      el.classList.toggle("active", allActive);
      return;
    }
    if (el.dataset.bucket) {
      el.classList.toggle("active", !state.starter && !state.status && el.dataset.bucket === state.statusBucket);
      return;
    }
    if (el.dataset.status) {
      el.classList.toggle("active", !state.starter && el.dataset.status === state.status);
      return;
    }
    if (el.dataset.category) {
      el.classList.toggle("active", el.dataset.category === state.category);
      return;
    }
    if (el.dataset.pricing) {
      el.classList.toggle("active", el.dataset.pricing === state.pricing);
    }
  });
  syncStatsUI();
}

function rerender() {
  syncChipUI();
  renderCards();
  syncCompareUI();
  syncUrl();
}

function clearFilters() {
  state.search = "";
  state.starter = false;
  state.recent = false;
  state.status = null;
  state.statusBucket = null;
  state.category = null;
  state.pricing = null;
  const input = document.getElementById("searchInput");
  if (input) input.value = "";
  rerender();
}

/** Navigate to directory (optionally Start here / New / compare mode). */
function browseTools({ starter = false, recent = false, compare = false } = {}) {
  if (starter) {
    state.starter = true;
    state.recent = false;
    state.status = null;
    state.statusBucket = null;
  } else if (recent) {
    state.recent = true;
    state.starter = false;
    state.status = null;
    state.statusBucket = null;
  }
  if (compare) {
    state.compareMode = true;
  }
  showView("directory");
  syncCompareUI();
  scrollToDirectoryResults();
}

function scrollToDirectoryResults() {
  const target = document.getElementById("toolResults")
    || document.getElementById("toolGrid")
    || document.getElementById("resultCount");
  if (!target) return;
  requestAnimationFrame(() => {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function fixedHeaderOffset() {
  const header = document.getElementById("dcsHeader") || document.querySelector(".dcs-header");
  return (header ? header.getBoundingClientRect().height : 53) + 16;
}

function scrollToAnchor(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const details = el.closest("details");
  if (details && !details.open) details.open = true;
  requestAnimationFrame(() => {
    const top = el.getBoundingClientRect().top + window.scrollY - fixedHeaderOffset();
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  });
}

function scrollToAnchorAfterView(id) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => scrollToAnchor(id));
  });
}

function showView(view) {
  if (!VIEWS.includes(view)) view = "home";
  if (view === "tool" && !state.currentToolId) view = "directory";
  if (view !== "tool") state.currentToolId = null;
  state.view = view;

  document.querySelectorAll("[data-view-panel]").forEach(panel => {
    panel.hidden = panel.dataset.viewPanel !== view;
  });

  const navView = view === "tool" ? "directory" : view;
  document.querySelectorAll(".app-nav__link").forEach(btn => {
    const active = btn.dataset.view === navView;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-current", active ? "page" : "false");
  });

  document.body.classList.toggle("has-compare-bar", view === "directory" && state.compareMode);
  const compareBar = document.getElementById("compareBar");
  if (compareBar && view !== "directory") {
    // Keep selection but hide bar off directory
    compareBar.hidden = true;
  } else if (view === "directory") {
    syncCompareUI();
  }

  renderCurrentView();
  syncUrl();
  window.scrollTo(0, 0);
}

function renderCurrentView() {
  if (state.view === "home") renderHome();
  else if (state.view === "guides") renderGuides();
  else if (state.view === "prompts") renderPrompts();
  else if (state.view === "playbooks") renderPlaybooks();
  else if (state.view === "contribute") renderContribute();
  else if (state.view === "submissions") renderSubmissions();
  else if (state.view === "directory") {
    renderStats();
    renderChips();
    renderCards();
    syncCompareUI();
  } else if (state.view === "tool") {
    syncToolBackLabel();
  }
}

function findToolByName(name) {
  const q = String(name || "").trim().toLowerCase();
  return TOOLS.find(t => (t.name || "").toLowerCase() === q) || null;
}

function isoWeekNumber(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

function toolOfTheWeek() {
  const fixed = featuredToolName();
  if (fixed) {
    const tool = findToolByName(fixed);
    if (tool) return tool;
  }
  const preferred = startHereNames().map(n => findToolByName(n)).filter(Boolean);
  const pool = preferred.length
    ? preferred
    : directoryTools().filter(t => STATUS_BUCKETS.trusted.includes(t.status));
  if (!pool.length) return null;
  return pool[isoWeekNumber() % pool.length];
}

function chooserTone(job, index = 0) {
  const text = `${job.label || ""} ${job.description || ""}`.toLowerCase();
  if (text.includes("research") || text.includes("citation")) return "research";
  if (text.includes("writ") || text.includes("brainstorm")) return "writing";
  if (text.includes("long doc") || text.includes("analysis") || text.includes("careful")) return "analysis";
  if (text.includes("workspace") || text.includes("multimodal") || text.includes("google")) return "workspace";
  if (text.includes("code") || text.includes("repo")) return "coding";
  if (text.includes("scrape") || text.includes("browser")) return "scrape";
  if (text.includes("data") || text.includes("power bi") || text.includes("analyz")) return "data";
  if (text.includes("document") || text.includes("q&a") || text.includes("notebook")) return "docs";
  if (text.includes("deck") || text.includes("present")) return "decks";
  if (text.includes("agent") || text.includes("automat") || text.includes("workflow")) return "agents";
  const fallback = ["research", "writing", "analysis", "workspace", "coding", "scrape", "data", "docs", "decks", "agents"];
  return fallback[index % fallback.length];
}

function homeToolTone(tool) {
  const cat = String(tool?.category || "").toLowerCase();
  if (cat.includes("llm") || cat.includes("assistant")) return "assistants";
  if (cat.includes("coding")) return "coding";
  if (cat.includes("scrap") || cat.includes("browser")) return "scrape";
  if (cat.includes("data")) return "data";
  if (cat.includes("agent")) return "agents";
  if (cat.includes("creative")) return "decks";
  if (cat.includes("knowledge")) return "docs";
  return "default";
}

function miniToolCard(tool, { tip = "" } = {}) {
  if (!tool) return "";
  const group = STATUS_GROUP[tool.status] || "blue";
  const tone = homeToolTone(tool);
  return `
    <button type="button" class="mini-card mini-card--tone-${tone}" data-open-tool="${escapeHtml(tool.id)}">
      <div class="mini-card__top">
        ${logoHtml(tool)}
        <div>
          <div class="mini-card__name">${escapeHtml(tool.name)}</div>
          <span class="badge badge--${group}">${escapeHtml(tool.status)}</span>
        </div>
      </div>
      <p class="mini-card__desc">${escapeHtml(tip || tool.whenToUse || tool.description)}</p>
    </button>
  `;
}

function departmentsData() {
  return Array.isArray(typeof DEPARTMENTS !== "undefined" ? DEPARTMENTS : null)
    ? DEPARTMENTS.filter(Boolean)
    : ["Engineering", "Operations", "Management"];
}

function teamRolesData() {
  return Array.isArray(typeof TEAM_ROLES !== "undefined" ? TEAM_ROLES : null)
    ? TEAM_ROLES.filter(Boolean)
    : ["Developer", "Manager", "Team"];
}

function populateTeamRegisterDropdowns() {
  const deptSelect = document.getElementById("tr_department");
  const roleSelect = document.getElementById("tr_role");
  if (deptSelect && !deptSelect.dataset.populated) {
    deptSelect.dataset.populated = "1";
    const current = deptSelect.value;
    deptSelect.innerHTML = `<option value="">Select department…</option>${departmentsData().map(item => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("")}`;
    if (current) deptSelect.value = current;
  }
  if (roleSelect && !roleSelect.dataset.populated) {
    roleSelect.dataset.populated = "1";
    const current = roleSelect.value;
    roleSelect.innerHTML = `<option value="">Select role…</option>${teamRolesData().map(item => `<option value="${escapeHtml(item)}">${escapeHtml(item)}</option>`).join("")}`;
    if (current) roleSelect.value = current;
  }
}

function renderTeamDirectoryPanel() {
  const panel = document.getElementById("teamDirectoryPanel");
  if (!panel) return;
  const cfg = typeof getTeamDirectoryConfig === "function" ? getTeamDirectoryConfig() : { enabled: false };
  const showRegistration = cfg.enabled && cfg.allowSelfRegister;
  panel.hidden = !showRegistration;
  if (!showRegistration) return;

  const formWrap = document.getElementById("teamRegisterForm");
  const success = document.getElementById("teamRegisterSuccess");
  const admin = document.getElementById("teamRegisterAdmin");
  if (formWrap) formWrap.hidden = false;
  if (success) success.hidden = true;
  if (admin) admin.hidden = !isAdminSession();
  populateTeamRegisterDropdowns();
  if (isAdminSession()) renderTeamRegisterPendingAdmin();
}

function validateTeamRegisterForm() {
  const name = document.getElementById("tr_name")?.value?.trim() || "";
  const email = document.getElementById("tr_email")?.value?.trim().toLowerCase() || "";
  const status = document.getElementById("teamRegisterStatus");
  if (!name || name.length < 2) {
    if (status) {
      status.hidden = false;
      status.textContent = "Enter your full name.";
    }
    document.getElementById("tr_name")?.focus();
    return null;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (status) {
      status.hidden = false;
      status.textContent = "Enter a valid work email.";
    }
    document.getElementById("tr_email")?.focus();
    return null;
  }
  const existing = getActiveTeamMembers().some(member =>
    member.email.toLowerCase() === email && member.name.toLowerCase() === name.toLowerCase()
  );
  if (existing) {
    if (status) {
      status.hidden = false;
      status.textContent = "You are already in the team directory.";
    }
    return null;
  }
  if (status) status.hidden = true;
  return {
    name,
    email,
    department: document.getElementById("tr_department")?.value?.trim() || "",
    role: document.getElementById("tr_role")?.value?.trim() || "Team",
  };
}

function buildTeamRegisterDraft(payload) {
  const cmd = teamMemberPublishCommand(payload.name, payload.email, payload.department, payload.role);
  return {
    title: `Team directory: ${payload.name}`,
    body: [
      "## Team directory registration",
      "",
      `- **Name:** ${payload.name}`,
      `- **Email:** ${payload.email}`,
      `- **Department:** ${payload.department || "—"}`,
      `- **Role:** ${payload.role || "Team"}`,
      "",
      "### Admin — add to directory",
      "",
      "Run locally, then commit and push:",
      "",
      "```bash",
      cmd,
      "git add data/team_members.csv docs/data.js",
      "git commit -m \"Add team member: " + payload.name + "\"",
      "git push",
      "```",
    ].join("\n"),
    cmd,
  };
}

function showTeamRegisterSuccess(payload) {
  const form = document.getElementById("teamRegisterForm");
  const success = document.getElementById("teamRegisterSuccess");
  const draft = buildTeamRegisterDraft(payload);
  const cfg = typeof getTeamDirectoryConfig === "function" ? getTeamDirectoryConfig() : {};
  const issueUrl = buildIssueDraftUrl({
    title: draft.title,
    body: draft.body,
    label: cfg.registerLabel || "team-register",
  });
  if (form) form.hidden = true;
  if (success) success.hidden = false;
  const link = document.getElementById("teamRegisterIssueLink");
  if (link) link.href = issueUrl;
  const copyBtn = document.getElementById("teamRegisterCopyDraft");
  if (copyBtn) {
    copyBtn.onclick = async () => {
      const text = `${draft.title}\n\n${draft.body}`;
      await navigator.clipboard?.writeText(text).catch(() => {});
      copyBtn.textContent = "Copied";
      setTimeout(() => { copyBtn.textContent = "Copy draft text"; }, 2000);
    };
  }
}

function submitTeamRegistration() {
  const payload = validateTeamRegisterForm();
  if (!payload) return;
  const pending = readTeamRegisterPending();
  if (pending.some(item =>
    item.email === payload.email && String(item.name || "").toLowerCase() === payload.name.toLowerCase()
  )) {
    const status = document.getElementById("teamRegisterStatus");
    if (status) {
      status.hidden = false;
      status.textContent = "You already submitted — waiting for admin approval.";
    }
    return;
  }
  pending.push({ ...payload, submittedAt: Date.now() });
  writeTeamRegisterPending(pending);
  showTeamRegisterSuccess(payload);
  if (isAdminSession()) renderTeamRegisterPendingAdmin();
}

function renderTeamRegisterPendingAdmin() {
  const list = document.getElementById("teamRegisterPendingList");
  if (!list || !isAdminSession()) return;
  const pending = readTeamRegisterPending();
  if (!pending.length) {
    list.innerHTML = `<p class="pending-list__status">No pending registrations on this device.</p>`;
    return;
  }
  list.innerHTML = pending.map(item => {
    const cmd = teamMemberPublishCommand(item.name, item.email, item.department, item.role);
    return `
      <article class="pending-item">
        <h4 class="pending-item__title">${escapeHtml(item.name)}</h4>
        <p class="pending-item__meta">${escapeHtml(item.email)}${item.department ? ` · ${escapeHtml(item.department)}` : ""}</p>
        <p class="pending-item__cmd"><code>${escapeHtml(cmd)}</code></p>
        <button type="button" class="linkbtn pending-item__copy" data-copy-cmd="${escapeHtml(cmd)}">Copy command</button>
      </article>
    `;
  }).join("");
  list.querySelectorAll("[data-copy-cmd]").forEach(btn => {
    btn.onclick = () => {
      navigator.clipboard?.writeText(btn.dataset.copyCmd || "").catch(() => {});
      btn.textContent = "Copied";
      setTimeout(() => { btn.textContent = "Copy command"; }, 1500);
    };
  });
}

function bindTeamRegisterForm() {
  const form = document.getElementById("teamRegisterForm");
  if (!form || form.dataset.bound === "1") return;
  form.dataset.bound = "1";
  form.addEventListener("submit", e => {
    e.preventDefault();
    submitTeamRegistration();
  });
}

function renderHome() {
  const grid = document.getElementById("chooserGrid");
  const result = document.getElementById("chooserResult");
  const starter = document.getElementById("starterRow");
  const totw = document.getElementById("toolOfWeek");
  if (!grid) return;

  grid.innerHTML = jobsData().map((job, i) => `
    <button type="button" class="chooser-card chooser-tone--${chooserTone(job, i)}${state.chooserJobId === job.id ? " is-active" : ""}" data-job="${escapeHtml(job.id)}">
      <span class="chooser-card__label">${escapeHtml(job.label)}</span>
      <span class="chooser-card__desc">${escapeHtml(job.description)}</span>
    </button>
  `).join("");

  if (state.chooserJobId) {
    const job = jobsData().find(j => j.id === state.chooserJobId);
    if (job) {
      const tools = job.tools.map(findToolByName).filter(Boolean);
      result.hidden = false;
      result.innerHTML = `
        <div class="chooser-result__badge" aria-hidden="true">Recommended for this job</div>
        <div class="chooser-result__head">
          <h3 class="chooser-result__title">${escapeHtml(job.label)}</h3>
          <p class="chooser-result__tip">${escapeHtml(job.tip)}</p>
        </div>
        <p class="chooser-result__tools-label">Trusted tools</p>
        <div class="starter-row">
          ${tools.map(t => miniToolCard(t)).join("") || "<p class='empty'>No matching tools in the directory yet.</p>"}
        </div>
      `;
      result.classList.remove("is-flash");
      void result.offsetWidth;
      result.classList.add("is-flash");
    }
  } else {
    result.hidden = true;
    result.innerHTML = "";
    result.classList.remove("is-flash");
  }

  starter.innerHTML = startHereNames().map(findToolByName).filter(Boolean).map(t => miniToolCard(t)).join("");

  const recentRow = document.getElementById("recentToolsRow");
  const recentEmpty = document.getElementById("recentToolsEmpty");
  if (recentRow) {
    const recent = recentlyAddedTools();
    recentRow.innerHTML = recent.map(t => miniToolCard(t, {
      tip: t.dateAdded ? `Added ${t.dateAdded}` : (t.whenToUse || t.description),
    })).join("");
    if (recentEmpty) recentEmpty.hidden = recent.length > 0;
  }

  const featured = toolOfTheWeek();
  if (featured && totw) {
    const group = STATUS_GROUP[featured.status] || "blue";
    const panel = totw.closest(".panel--feature");
    if (panel) panel.className = "panel panel--feature";
    totw.innerHTML = `
      <div class="totw">
        <div class="totw__identity">
          ${logoHtml(featured)}
          <div>
            <h3 class="totw__name">${escapeHtml(featured.name)}</h3>
            <div class="totw__meta">
              <span class="badge badge--${group}">${escapeHtml(featured.status)}</span>
              <span class="totw__cat">${escapeHtml(featured.category)}</span>
            </div>
          </div>
        </div>
        <p class="totw__desc">${escapeHtml(featured.description)}</p>
        <p class="totw__guide"><strong>Try it for:</strong> ${escapeHtml(featured.whenToUse || "Everyday team work")}</p>
        <div class="totw__actions">
          <button type="button" class="btn-base btn-primary totw__btn" data-open-tool="${escapeHtml(featured.id)}">View details</button>
          ${featured.url ? `<a class="btn-base btn-secondary totw__btn" href="${escapeHtml(featured.url)}" target="_blank" rel="noopener">Open tool</a>` : ""}
        </div>
      </div>
    `;
  }

  renderTeamDirectoryPanel();
}

function guideTone(category) {
  const key = String(category || "").toLowerCase();
  if (key.includes("assistant") || key.includes("llm") || key.includes("chat")) return "assistants";
  if (key.includes("coding") || key.includes("code") || key.includes("dev")) return "coding";
  if (key.includes("research") || key.includes("knowledge")) return "research";
  return "default";
}

function guideCategoryLabel(category) {
  const tone = guideTone(category);
  if (tone === "assistants") return "Assistants";
  if (tone === "coding") return "Coding";
  if (tone === "research") return "Research";
  return category || "Other";
}

function renderGuideTips(guide) {
  return (guide.tips || []).map(tip => {
    const tool = findToolByName(tip.tool);
    return `
      <div class="guide-tip">
        <div class="guide-tip__tool">
          ${tool ? logoHtml(tool) : ""}
          <button type="button" class="linkbtn" data-open-tool-name="${escapeHtml(tip.tool)}">${escapeHtml(tip.tool)}</button>
        </div>
        <div class="guide-tip__cols">
          <div class="guide-tip__col guide-tip__col--go">
            <span class="guide-tip__label guide-tip__label--go">Use when</span>
            <p>${escapeHtml(tip.useWhen)}</p>
          </div>
          <div class="guide-tip__col guide-tip__col--skip">
            <span class="guide-tip__label guide-tip__label--skip">Skip when</span>
            <p>${escapeHtml(tip.skipWhen)}</p>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function renderMatchupLine(c) {
  const tools = c.tools || [];
  return tools.map((name, i) => {
    const isWinner = c.winner && name === c.winner;
    const tool = `<span class="compare-category__tool${isWinner ? " compare-category__tool--winner" : ""}">${escapeHtml(name)}</span>`;
    const vs = i < tools.length - 1 ? `<span class="compare-category__vs">vs</span>` : "";
    return `${tool}${vs}`;
  }).join("");
}

function renderComparisonActions(c) {
  return (c.tools || []).map(name => {
    const t = findToolByName(name);
    const isWinner = c.winner && name === c.winner;
    const chipClass = `chip${isWinner ? " chip--winner" : ""}`;
    return t
      ? `<button type="button" class="${chipClass}" data-open-tool="${escapeHtml(t.id)}">${escapeHtml(name)}${isWinner ? " ✓" : ""}</button>`
      : `<span class="${chipClass}">${escapeHtml(name)}${isWinner ? " ✓" : ""}</span>`;
  }).join("");
}

function renderComparisonsList() {
  const comparisons = comparisonsData();
  if (!comparisons.length) {
    return `<p class="empty">No comparisons yet.</p>`;
  }

  return `
    <div class="compare-categories">
      ${comparisons.map(c => `
        <details class="compare-category compare-category--page">
          <summary class="compare-category__summary">
            <span class="compare-category__chev" aria-hidden="true"></span>
            <span class="compare-category__head">
              <span class="compare-category__title">${escapeHtml(c.feature)}</span>
              <span class="compare-category__matchup">${renderMatchupLine(c)}</span>
            </span>
            <span class="compare-category__winner">Winner: ${escapeHtml(c.winner || "—")}</span>
          </summary>
          <div class="compare-category__body">
            ${c.notes ? `<p class="compare-note__body">${escapeHtml(c.notes)}</p>` : ""}
            <div class="compare-note__actions">${renderComparisonActions(c)}</div>
          </div>
        </details>
      `).join("")}
    </div>
  `;
}

function renderGuides() {
  const list = document.getElementById("guidesList");
  const comps = document.getElementById("comparisonsList");
  if (!list) return;

  const guides = guidesData();

  if (!guides.length) {
    list.innerHTML = `<p class="empty">No decision guides yet.</p>`;
  } else {
    list.innerHTML = `
      <div class="guides-categories">
        ${guides.map(guide => {
          const tone = guideTone(guide.category);
          const label = guideCategoryLabel(guide.category);
          const toolCount = guide.tips?.length || 0;
          return `
            <details class="guide-category guide-tone--${tone}" data-guide-tone="${tone}">
              <summary class="guide-category__summary">
                <span class="guide-category__chev" aria-hidden="true"></span>
                <span class="guide-category__badge">${escapeHtml(label)}</span>
                <span class="guide-category__head">
                  <span class="guide-category__title">${escapeHtml(guide.title)}</span>
                  <span class="guide-category__desc">${escapeHtml(guide.summary)}</span>
                </span>
                <span class="guide-category__count">${toolCount} ${toolCount === 1 ? "tool" : "tools"}</span>
              </summary>
              <div class="guide-category__body">
                <div class="guide-tips">${renderGuideTips(guide)}</div>
              </div>
            </details>
          `;
        }).join("")}
      </div>
    `;
  }

  if (comps) {
    comps.innerHTML = renderComparisonsList();
  }
}

function uniqueRoles(items, key = "role") {
  const roles = [...new Set(items.map(i => i[key]).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  return ["All", ...roles.filter(r => r !== "All")];
}

function renderFilterChips(containerId, values, active, dataAttr) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = values.map(value => `
    <button type="button" class="chip${active === value ? " active" : ""}" data-${dataAttr}="${escapeHtml(value)}">${escapeHtml(value)}</button>
  `).join("");
}

function promptMatchesSearch(prompt, query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return true;
  const tokens = q.split(/\s+/).filter(Boolean);
  const haystack = [
    prompt.id,
    prompt.title,
    prompt.category,
    prompt.useCase,
    prompt.role,
    prompt.owner,
    prompt.text,
    ...(prompt.models || []),
  ].join(" ").toLowerCase();
  // Every word must match somewhere (meaningful multi-keyword search)
  return tokens.every(token => haystack.includes(token));
}

function syncPromptQuickChips() {
  document.querySelectorAll("[data-prompt-usecase]").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-prompt-usecase") === state.promptUseCase);
  });
  document.querySelectorAll("[data-prompt-role]").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-prompt-role") === state.promptRole);
  });
}

function promptShareUrl(id) {
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("view", "prompts");
  url.searchParams.set("pid", id);
  return url.toString();
}

function renderPrompts() {
  const grid = document.getElementById("promptGrid");
  const empty = document.getElementById("promptEmpty");
  const countEl = document.getElementById("promptResultCount");
  const clearBtn = document.getElementById("promptClearFilters");
  const searchInput = document.getElementById("promptSearchInput");
  if (!grid) return;

  if (searchInput && searchInput.value !== state.promptSearch) {
    searchInput.value = state.promptSearch;
  }

  const all = promptsData();
  syncPromptQuickChips();

  let list = all.filter(p => {
    const roleOk = state.promptRole === "All" || p.role === state.promptRole;
    const useOk = state.promptUseCase === "All" || p.useCase === state.promptUseCase;
    const searchOk = promptMatchesSearch(p, state.promptSearch);
    return roleOk && useOk && searchOk;
  });

  // Deep-linked prompt stays visible even if filters would hide it
  if (state.promptId) {
    const linked = all.find(p => p.id === state.promptId);
    if (linked && !list.some(p => p.id === linked.id)) {
      list = [linked, ...list];
    }
  }

  const filtersOn = state.promptRole !== "All" || state.promptUseCase !== "All" || Boolean(state.promptSearch.trim());
  if (clearBtn) clearBtn.hidden = !filtersOn;
  if (countEl) {
    countEl.textContent = `${list.length} of ${all.length} prompt${all.length === 1 ? "" : "s"}`;
  }

  empty.hidden = list.length > 0;
  grid.innerHTML = list.map(p => `
    <article class="prompt-card${state.promptId === p.id ? " prompt-card--focus" : ""}" id="prompt-${escapeHtml(p.id)}" data-prompt-id="${escapeHtml(p.id)}">
      <div class="prompt-card__top">
        <h3 class="prompt-card__title">${escapeHtml(p.title)}</h3>
        <span class="card__tag">${escapeHtml(p.role || "Everyone")}</span>
      </div>
      <p class="prompt-card__meta">${escapeHtml(p.category)}${p.useCase ? ` · ${escapeHtml(p.useCase)}` : ""}</p>
      ${(p.models || []).length ? `<div class="card__tags">${p.models.map(m => `<span class="card__tag">${escapeHtml(m)}</span>`).join("")}</div>` : ""}
      <pre class="prompt-card__text">${escapeHtml(p.text)}</pre>
      <div class="prompt-card__actions">
        <button type="button" class="btn-base btn-primary btn-copy" data-copy-prompt="${escapeHtml(p.id)}">Copy prompt</button>
        <button type="button" class="btn-base btn-secondary btn-copy-link" data-copy-prompt-link="${escapeHtml(p.id)}">Copy link</button>
      </div>
    </article>
  `).join("");

  if (state.promptId) {
    requestAnimationFrame(() => {
      document.getElementById(`prompt-${state.promptId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
}

function clearPromptFilters() {
  state.promptRole = "All";
  state.promptUseCase = "All";
  state.promptSearch = "";
  state.promptId = null;
  const searchInput = document.getElementById("promptSearchInput");
  if (searchInput) searchInput.value = "";
  renderPrompts();
  syncUrl();
}

function applyPromptUseCaseFilter(value) {
  state.promptUseCase = value || "All";
  renderPrompts();
  syncUrl();
}

function applyPromptRoleFilter(value) {
  state.promptRole = value || "All";
  renderPrompts();
  syncUrl();
}

function applyPromptSearchFromInput() {
  const searchInput = document.getElementById("promptSearchInput");
  state.promptSearch = searchInput ? searchInput.value : "";
  renderPrompts();
  syncUrl();
}

const PLAYBOOK_CARD_TONES = ["data", "engineering", "operations", "everyone", "management", "default"];

function playbookTone(role) {
  const key = String(role || "Everyone").toLowerCase();
  if (key.includes("engineer") || key.includes("develop")) return "engineering";
  if (key.includes("data")) return "data";
  if (key.includes("operation") || key.includes("support")) return "operations";
  if (key.includes("manage")) return "management";
  if (key.includes("every")) return "everyone";
  return "default";
}

function directoryCardTone(tool, index) {
  const cat = String(tool.category || "").toLowerCase();
  if (cat.includes("coding") || cat.includes("code")) return "engineering";
  if (cat.includes("llm") || cat.includes("assistant")) return "data";
  if (cat.includes("agent") || cat.includes("automation")) return "operations";
  if (cat.includes("research")) return "everyone";
  const status = String(tool.status || "").toLowerCase();
  if (status === "archived") return "management";
  if (status === "production") return "engineering";
  return PLAYBOOK_CARD_TONES[index % PLAYBOOK_CARD_TONES.length];
}

function playbookMatchesSearch(item, query) {
  const q = String(query || "").trim().toLowerCase();
  if (!q) return true;
  const tokens = q.split(/\s+/).filter(Boolean);
  const haystack = [
    item.id,
    item.title,
    item.department,
    item.tool,
    item.status,
    item.owner,
    item.impact,
    item.role,
    item.type,
    item.skillLevel,
    item.description,
  ].filter(Boolean).join(" ").toLowerCase();
  return tokens.every(token => haystack.includes(token));
}

function renderPlaybooks() {
  applyContributeMode();
  populateWinToolDropdown();
  const useGrid = document.getElementById("useCaseGrid");
  const learnGrid = document.getElementById("learnGrid");
  const countEl = document.getElementById("playbookResultCount");
  const clearBtn = document.getElementById("playbookClearFilters");
  const searchInput = document.getElementById("playbookSearchInput");
  if (!useGrid || !learnGrid) return;

  if (searchInput && searchInput.value !== state.playbookSearch) {
    searchInput.value = state.playbookSearch;
  }

  const cases = useCasesData();
  const learning = learningData();
  const roles = uniqueRoles([...cases, ...learning]);
  renderFilterChips("playbookRoleChips", roles, state.playbookRole, "playbook-role");

  const matches = (item) =>
    (state.playbookRole === "All" || item.role === state.playbookRole) &&
    playbookMatchesSearch(item, state.playbookSearch);

  const shownCases = cases.filter(matches);
  const shownLearning = learning.filter(matches);

  const filtersOn = state.playbookRole !== "All" || Boolean(state.playbookSearch.trim());
  if (clearBtn) clearBtn.hidden = !filtersOn;
  if (countEl) {
    const total = cases.length + learning.length;
    const shown = shownCases.length + shownLearning.length;
    countEl.textContent = `${shown} of ${total} items`;
  }

  useGrid.innerHTML = shownCases.map(uc => {
    const tool = findToolByName(uc.tool);
    const group = STATUS_GROUP[uc.status] || "blue";
    const tone = playbookTone(uc.role || uc.department);
    return `
      <article class="usecase-card playbook-card playbook-card--usecase playbook-tone--${tone}">
        <div class="playbook-card__kind">Use case</div>
        <div class="usecase-card__top">
          <h3 class="usecase-card__title">${escapeHtml(uc.title)}</h3>
          <span class="badge badge--${group}">${escapeHtml(uc.status || "—")}</span>
        </div>
        <p class="usecase-card__impact">${escapeHtml(uc.impact)}</p>
        <div class="usecase-card__meta">
          ${tool
            ? `<button type="button" class="linkbtn" data-open-tool="${escapeHtml(tool.id)}">${escapeHtml(uc.tool)}</button>`
            : `<span>${escapeHtml(uc.tool)}</span>`}
          <span>·</span>
          <span>${escapeHtml(uc.owner || "Unassigned")}</span>
          <span>·</span>
          <span>${escapeHtml(uc.role || uc.department || "")}</span>
        </div>
      </article>
    `;
  }).join("") || `<p class="empty">No use cases match.</p>`;

  learnGrid.innerHTML = shownLearning.map(res => {
    const tone = playbookTone(res.role);
    return `
      <article class="learn-card playbook-card playbook-card--learn playbook-tone--${tone}">
        <div class="playbook-card__kind">Learning</div>
        <div class="learn-card__top">
          <span class="card__tag">${escapeHtml(res.type)}</span>
          <span class="card__tag">${escapeHtml(res.skillLevel)}</span>
          <span class="card__tag">${escapeHtml(res.role)}</span>
        </div>
        <h3 class="learn-card__title">${escapeHtml(res.title)}</h3>
        <p class="learn-card__desc">${escapeHtml(res.description)}</p>
        ${res.url ? `<a class="card__cta" href="${escapeHtml(res.url)}" target="_blank" rel="noopener">Open resource ↗</a>` : ""}
      </article>
    `;
  }).join("") || `<p class="empty">No learning resources match.</p>`;
}

function clearPlaybookFilters() {
  state.playbookRole = "All";
  state.playbookSearch = "";
  const searchInput = document.getElementById("playbookSearchInput");
  if (searchInput) searchInput.value = "";
  renderPlaybooks();
  syncUrl();
}

function applyPlaybookSearchFromInput() {
  const searchInput = document.getElementById("playbookSearchInput");
  state.playbookSearch = searchInput ? searchInput.value : "";
  renderPlaybooks();
  syncUrl();
}

function syncAdminReviewVisibility() {
  const admin = isAdminSession();
  const showGithubReview = admin && contributeConfig().fullFormEnabled;
  const pendingPanel = document.getElementById("pendingReviewPanel");
  const howToPanel = document.querySelector(".panel--review-howto");
  if (pendingPanel) pendingPanel.hidden = !showGithubReview;
  if (howToPanel) howToPanel.hidden = !showGithubReview;
  return showGithubReview;
}

function syncSimpleSubmitAdminFields() {
  const field = document.getElementById("simpleAssignField");
  const select = document.getElementById("simple_assign");
  if (!field || !select) return;
  const show = isAdminSession();
  field.hidden = !show;
  if (!show) {
    select.value = "";
    setSimpleFieldError("assign", "");
    return;
  }
  const members = getActiveTeamMembers();
  const current = select.value;
  select.innerHTML = `<option value="">Optional — leave unassigned</option>${members.map(m =>
    `<option value="${escapeHtml(m.name)}">${escapeHtml(m.name)}</option>`
  ).join("")}`;
  if (current && members.some(m => m.name === current)) select.value = current;
}

function applyContributeMode() {
  const cfg = contributeConfig();
  const simpleWrap = document.getElementById("simpleSubmitWrap");
  const simpleSuccess = document.getElementById("simpleSubmitSuccess");
  const fullWrap = document.getElementById("suggestFormWrap");
  const fullSuccess = document.getElementById("suggestSuccess");
  const winSection = document.getElementById("shareWinSection");
  const winForm = document.getElementById("winForm");
  const winSuccess = document.getElementById("winSuccess");
  if (simpleWrap) {
    const showingSuccess = simpleSuccess && !simpleSuccess.hidden;
    simpleWrap.hidden = !cfg.simpleSubmitEnabled || showingSuccess;
  }
  if (simpleSuccess && !cfg.simpleSubmitEnabled) simpleSuccess.hidden = true;
  if (fullWrap) fullWrap.hidden = !cfg.fullFormEnabled;
  if (fullSuccess && !cfg.fullFormEnabled) fullSuccess.hidden = true;
  if (winSection) winSection.hidden = !cfg.winSubmitEnabled;
  if (winForm && winSuccess && !cfg.winSubmitEnabled) {
    winForm.hidden = false;
    winSuccess.hidden = true;
  }
  syncSimpleSubmitAdminFields();
}

function renderContribute() {
  applyContributeMode();
  syncContributeTabs();
  populateWinToolDropdown();
  if (syncAdminReviewVisibility()) {
    renderReviewHowto();
    loadPendingReviews();
  }
}

function renderReviewHowto() {
  const wrap = document.getElementById("reviewIssuesLinkWrap");
  if (!wrap || typeof getSiteConfig !== "function") return;
  const cfg = getSiteConfig();
  const issuesUrl = `https://github.com/${cfg.githubOwner}/${cfg.githubRepo}/issues`;
  wrap.innerHTML = `All open items: <a href="${escapeHtml(issuesUrl)}" target="_blank" rel="noopener">${escapeHtml(cfg.githubOwner)}/${escapeHtml(cfg.githubRepo)} issues</a>`;
}

async function loadPendingReviews() {
  if (!isAdminSession()) return;
  const list = document.getElementById("pendingReviewList");
  if (!list || typeof getSiteConfig !== "function") return;

  const cfg = getSiteConfig();
  list.innerHTML = `<p class="pending-list__status">Loading…</p>`;

  try {
    const api = `https://api.github.com/repos/${encodeURIComponent(cfg.githubOwner)}/${encodeURIComponent(cfg.githubRepo)}/issues?state=open&per_page=30`;
    const res = await fetch(api, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const issues = await res.json();
    const items = (Array.isArray(issues) ? issues : [])
      .filter(issue => !issue.pull_request)
      .filter(issue => {
        const labels = (issue.labels || []).map(l => (l.name || "").toLowerCase());
        const title = String(issue.title || "");
        const isSuggestion = labels.includes(String(cfg.suggestionLabel || "").toLowerCase())
          || labels.includes("tool-suggestion")
          || /^add tool:/i.test(title)
          || /^tool suggestion:/i.test(title);
        const isWin = labels.includes(String(cfg.winLabel || "").toLowerCase())
          || /^team win:/i.test(title);
        return isSuggestion || isWin;
      });

    if (!items.length) {
      list.innerHTML = `<p class="pending-list__status">Nothing waiting for Admin</p>`;
      return;
    }

    list.innerHTML = items.map(issue => {
      const labels = (issue.labels || []).map(l => (l.name || "").toLowerCase());
      const title = String(issue.title || "Untitled");
      const isWin = labels.includes(String(cfg.winLabel || "").toLowerCase()) || /^team win:/i.test(title);
      const kind = isWin ? "Win" : "Add tool";
      const created = issue.created_at ? new Date(issue.created_at).toLocaleDateString() : "";
      const issueKey = issue.number || issue.id || title;
      const assigned = assignmentFor(issueKey);
      const admin = isAdminSession();
      const assignBlock = !isWin ? `
          <div class="pending-item__assign">
            ${assigned
              ? `<p class="pending-item__assigned">Assigned to <strong>${escapeHtml(assigned.name)}</strong> for testing</p>`
              : `<p class="pending-item__hint">Waiting for Admin</p>`}
            ${admin ? `
              <div class="pending-assign" data-issue-key="${escapeHtml(String(issueKey))}">
                <label class="pending-assign__label" for="assign-${escapeHtml(String(issueKey))}">Assign for testing</label>
                <div class="pending-assign__row">
                  <input
                    type="text"
                    id="assign-${escapeHtml(String(issueKey))}"
                    class="pending-assign__input"
                    maxlength="60"
                    placeholder="Teammate name"
                    value="${assigned ? escapeHtml(assigned.name) : ""}"
                  >
                  <button type="button" class="pending-assign__btn" data-assign-issue="${escapeHtml(String(issueKey))}">
                    ${assigned ? "Update" : "Assign"}
                  </button>
                </div>
              </div>
            ` : ""}
          </div>
        ` : `<p class="pending-item__hint">Waiting for Admin</p>`;
      return `
        <article class="pending-item">
          <div class="pending-item__meta">
            <span class="pending-item__kind">${escapeHtml(kind)}</span>
            <span class="pending-item__status">Pending approval</span>
            ${created ? `<span class="pending-item__date">${escapeHtml(created)}</span>` : ""}
          </div>
          <a class="pending-item__title" href="${escapeHtml(issue.html_url)}" target="_blank" rel="noopener">${escapeHtml(title)}</a>
          ${assignBlock}
        </article>
      `;
    }).join("");

    if (isAdminSession()) bindPendingAssignActions(list);
  } catch (err) {
    list.innerHTML = `
      <p class="pending-list__status">Couldn’t load the list. Try Refresh again.</p>
      <p class="field-note">Fallback: open <a href="https://github.com/${escapeHtml(cfg.githubOwner)}/${escapeHtml(cfg.githubRepo)}/issues" target="_blank" rel="noopener">Issues</a> directly.</p>
    `;
  }
}

function bindPendingAssignActions(list) {
  if (!list || list.dataset.assignBound === "1") return;
  list.dataset.assignBound = "1";
  list.addEventListener("click", e => {
    const btn = e.target.closest("[data-assign-issue]");
    if (!btn || !isAdminSession()) return;
    const key = btn.dataset.assignIssue;
    const wrap = list.querySelector(`[data-issue-key="${key}"]`);
    const input = wrap?.querySelector(".pending-assign__input");
    const name = (input?.value || "").trim();
    if (!name) {
      input?.focus();
      return;
    }
    writeAssignment(key, name);
    loadPendingReviews();
  });
}

function syncContributeTabs() {
  const winPanel = document.getElementById("contribWinPanel");
  if (winPanel) winPanel.hidden = false;
}

function populateWinToolDropdown() {
  const select = document.getElementById("w_tool");
  if (!select || select.dataset.ready === "1") return;
  const opts = directoryTools()
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map(t => `<option value="${escapeHtml(t.name)}">${escapeHtml(t.name)}</option>`)
    .join("");
  select.insertAdjacentHTML("beforeend", opts);
  select.dataset.ready = "1";
}

function setWinFieldError(key, message) {
  const err = document.getElementById(`${key}_err`);
  const field = document.querySelector(`[data-field="${key}"]`);
  if (field) field.classList.toggle("is-invalid", Boolean(message));
  if (!err) return;
  if (message) {
    err.hidden = false;
    err.textContent = message;
  } else {
    err.hidden = true;
    err.textContent = "";
  }
}

function updateWinCounts() {
  const impact = document.getElementById("w_impact");
  const how = document.getElementById("w_how");
  const ic = document.getElementById("w_impact_count");
  const hc = document.getElementById("w_how_count");
  if (impact && ic) ic.textContent = `${impact.value.length} / 400`;
  if (how && hc) hc.textContent = `${how.value.length} / 600`;
}

function validateWinForm() {
  ["w_title", "w_tool", "w_impact"].forEach(k => setWinFieldError(k, ""));
  const formErr = document.getElementById("winFormErr");
  if (formErr) { formErr.hidden = true; formErr.textContent = ""; }

  const title = (document.getElementById("w_title").value || "").trim();
  const tool = (document.getElementById("w_tool").value || "").trim();
  const name = (document.getElementById("w_name").value || "").trim();
  const role = (document.getElementById("w_role").value || "").trim();
  const impact = (document.getElementById("w_impact").value || "").trim();
  const how = (document.getElementById("w_how").value || "").trim();
  let ok = true;

  if (!title || title.length < 4) {
    setWinFieldError("w_title", "Add a short headline (at least 4 characters).");
    ok = false;
  }
  if (!tool) {
    setWinFieldError("w_tool", "Choose the tool you used.");
    ok = false;
  }
  if (!impact || impact.length < 12) {
    setWinFieldError("w_impact", "Describe the impact in a sentence or two (at least 12 characters).");
    ok = false;
  }
  if (name && (name.length > 60 || !PERSON_PATTERN.test(name))) {
    ok = false;
    if (formErr) {
      formErr.hidden = false;
      formErr.textContent = "Use letters, spaces, apostrophes, or hyphens only in your name.";
    }
  }
  if (!ok && formErr && formErr.hidden) {
    formErr.hidden = false;
    formErr.textContent = "Check the highlighted fields and try again.";
  }
  return ok ? { title, tool, submittedBy: name, role, impact, how } : null;
}

function showWinSuccess() {
  const form = document.getElementById("winForm");
  const success = document.getElementById("winSuccess");
  if (form) form.hidden = true;
  if (success) success.hidden = false;
}

function resetWinForm() {
  document.getElementById("winForm")?.reset();
  const form = document.getElementById("winForm");
  const success = document.getElementById("winSuccess");
  if (form) form.hidden = !contributeConfig().winSubmitEnabled;
  if (success) success.hidden = true;
  ["w_title", "w_tool", "w_impact"].forEach(k => setWinFieldError(k, ""));
  const formErr = document.getElementById("winFormErr");
  if (formErr) { formErr.hidden = true; formErr.textContent = ""; }
  updateWinCounts();
}

async function submitWinLink(payload) {
  const cfg = contributeConfig();
  if (!cfg.winSubmitUrl) {
    throw new Error("Share a win is not configured. In docs/site-config.js set contribute.winSubmit.submitUrl to your Apps Script web app URL, then reload.");
  }
  const body = JSON.stringify({
    title: payload.title,
    tool: payload.tool,
    submittedBy: payload.submittedBy,
    role: payload.role,
    impact: payload.impact,
    how: payload.how,
  });
  try {
    const res = await fetch(cfg.winSubmitUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body,
    });
    if (res.type !== "opaque" && res.ok) {
      const data = await res.json().catch(() => ({ ok: true }));
      if (data && data.ok === false) throw new Error(data.error || "Submit failed.");
      return;
    }
    if (res.type !== "opaque" && !res.ok) throw new Error(`Submit failed (${res.status}).`);
  } catch (err) {
    if (err && /failed|not configured|Submit failed/i.test(String(err.message)) && !/Failed to fetch|NetworkError|CORS/i.test(String(err.message))) {
      throw err;
    }
    await fetch(cfg.winSubmitUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body,
    });
  }
}

async function copyText(text, statusEl) {
  try {
    await navigator.clipboard.writeText(text);
    statusEl.hidden = false;
    statusEl.textContent = "Copied — paste into Slack, email, or your review draft.";
  } catch {
    statusEl.hidden = false;
    statusEl.textContent = "Couldn’t copy automatically — open the review draft instead.";
  }
}

function openToolByIdOrName(idOrName) {
  const tool = directoryTools().find(t => t.id === idOrName) || findToolByName(idOrName);
  if (tool && !isRejectedStatus(tool.status)) openModal(tool);
}

function bindBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn || btn.dataset.bound === "1") return;
  btn.dataset.bound = "1";

  const sync = () => {
    const show = window.scrollY > 320 && !document.body.classList.contains("auth-locked");
    btn.hidden = !show;
  };

  window.addEventListener("scroll", sync, { passive: true });
  btn.addEventListener("click", () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  });
  sync();
}

function bindAppNavigation() {
  document.getElementById("dcs-site-header")?.addEventListener("click", e => {
    const btn = e.target.closest("[data-view]");
    if (!btn) return;
    showView(btn.dataset.view);
  });

  document.body.addEventListener("click", e => {
    const go = e.target.closest("[data-go-view]");
    if (go) {
      const view = go.dataset.goView;
      if (go.dataset.starter === "1") {
        browseTools({ starter: true });
        return;
      }
      if (go.dataset.recent === "1") {
        browseTools({ recent: true });
        return;
      }
      if (go.dataset.compare === "1") {
        browseTools({ compare: true });
        return;
      }
      if (go.dataset.tab === "win") {
        state.contribTab = "win";
      }
      showView(view);
      const scrollId = go.dataset.scrollTo;
      if (scrollId) {
        scrollToAnchorAfterView(scrollId);
      } else if (go.dataset.tab === "win") {
        scrollToAnchorAfterView("shareWinSection");
      }
      return;
    }

    const scrollTo = e.target.closest("[data-scroll-to]");
    if (scrollTo) {
      scrollToAnchor(scrollTo.dataset.scrollTo);
      return;
    }

    const jobBtn = e.target.closest("[data-job]");
    if (jobBtn && state.view === "home") {
      const id = jobBtn.dataset.job;
      const selecting = state.chooserJobId !== id;
      state.chooserJobId = selecting ? id : null;
      renderHome();
      syncUrl();
      if (selecting) {
        requestAnimationFrame(() => {
          document.getElementById("chooserResult")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      }
      return;
    }

    const openTool = e.target.closest("[data-open-tool]");
    if (openTool) {
      openToolByIdOrName(openTool.dataset.openTool);
      return;
    }

    const openName = e.target.closest("[data-open-tool-name]");
    if (openName) {
      openToolByIdOrName(openName.dataset.openToolName);
      return;
    }

    const copyBtn = e.target.closest("[data-copy-prompt]");
    if (copyBtn) {
      const prompt = promptsData().find(p => p.id === copyBtn.dataset.copyPrompt);
      if (!prompt) return;
      navigator.clipboard.writeText(prompt.text).then(() => {
        const prev = copyBtn.textContent;
        copyBtn.textContent = "Copied ✓";
        copyBtn.classList.add("is-copied");
        setTimeout(() => {
          copyBtn.textContent = prev;
          copyBtn.classList.remove("is-copied");
        }, 1400);
      }).catch(() => {
        copyBtn.textContent = "Copy failed";
      });
      return;
    }

    const copyLinkBtn = e.target.closest("[data-copy-prompt-link]");
    if (copyLinkBtn) {
      const id = copyLinkBtn.getAttribute("data-copy-prompt-link");
      if (!id) return;
      state.promptId = id;
      syncUrl();
      navigator.clipboard.writeText(promptShareUrl(id)).then(() => {
        const prev = copyLinkBtn.textContent;
        copyLinkBtn.textContent = "Link copied ✓";
        setTimeout(() => { copyLinkBtn.textContent = prev; }, 1400);
      }).catch(() => {
        copyLinkBtn.textContent = "Copy failed";
      });
      return;
    }

    const promptUseCase = e.target.closest("[data-prompt-usecase]");
    if (promptUseCase) {
      applyPromptUseCaseFilter(promptUseCase.getAttribute("data-prompt-usecase") || "All");
      return;
    }

    const promptRole = e.target.closest("[data-prompt-role]");
    if (promptRole) {
      applyPromptRoleFilter(promptRole.getAttribute("data-prompt-role") || "All");
      return;
    }

    const playbookRole = e.target.closest("[data-playbook-role]");
    if (playbookRole) {
      const next = playbookRole.getAttribute("data-playbook-role") || "All";
      state.playbookRole = next;
      renderPlaybooks();
      syncUrl();
    }
  });

  document.getElementById("promptClearFilters")?.addEventListener("click", clearPromptFilters);
  document.getElementById("promptEmptyClear")?.addEventListener("click", clearPromptFilters);
  document.getElementById("playbookClearFilters")?.addEventListener("click", clearPlaybookFilters);

  const promptSearchInput = document.getElementById("promptSearchInput");
  if (promptSearchInput) {
    promptSearchInput.addEventListener("input", () => {
      state.promptSearch = promptSearchInput.value;
      renderPrompts();
      syncUrl();
    });
    promptSearchInput.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        applyPromptSearchFromInput();
      }
    });
  }

  const playbookSearchInput = document.getElementById("playbookSearchInput");
  if (playbookSearchInput) {
    playbookSearchInput.addEventListener("input", () => {
      state.playbookSearch = playbookSearchInput.value;
      renderPlaybooks();
      syncUrl();
    });
    playbookSearchInput.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        applyPlaybookSearchFromInput();
      }
    });
  }

  document.querySelector(".contribute-tabs")?.addEventListener("click", e => {
    const tab = e.target.closest("[data-contrib]");
    if (!tab) return;
    state.contribTab = tab.dataset.contrib;
    syncContributeTabs();
    syncUrl();
  });

  document.getElementById("winForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const payload = validateWinForm();
    if (!payload) return;
    const btn = document.getElementById("winSubmit");
    const formErr = document.getElementById("winFormErr");
    if (btn) { btn.disabled = true; btn.textContent = "Submitting…"; }
    try {
      await submitWinLink(payload);
      showWinSuccess();
    } catch (err) {
      if (formErr) {
        formErr.hidden = false;
        formErr.textContent = err.message || "Something went wrong. Try again in a moment.";
      }
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = "Share win"; }
    }
  });

  ["w_impact", "w_how"].forEach(id => {
    document.getElementById(id)?.addEventListener("input", updateWinCounts);
  });

  document.getElementById("winAnother")?.addEventListener("click", resetWinForm);

  document.getElementById("pendingReviewRefresh")?.addEventListener("click", () => {
    loadPendingReviews();
  });

  bindSimpleSubmit();
  bindSubmissionsPage();
  populateDirectoryApproveDropdowns();
  bindDirectoryApproveModal();
}

function populateCategoryDropdown() {
  const select = document.getElementById("s_category");
  if (!select) return;
  const options = (typeof CATEGORIES !== "undefined" ? CATEGORIES : [])
    .map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`)
    .join("");
  select.insertAdjacentHTML("beforeend", options);
}

const PRICING_OPTIONS = ["Free", "Freemium", "Paid", "Enterprise", "Open Source", "Trial"];
const DEPARTMENT_OPTIONS = [
  "Development", "Automation", "Reporting", "Data Engineering",
  "Management", "Operations", "Support", "Everyone",
];
const URGENCY_OPTIONS = [
  "Exploring / learning",
  "Nice to have",
  "Useful this quarter",
  "Needed for a project soon",
  "Blocking work now",
];

function populatePricingDropdown() {
  const select = document.getElementById("s_pricing");
  if (!select) return;
  const fromTools = [...new Set(TOOLS.map(t => t.pricing).filter(Boolean))];
  const options = [...new Set([...PRICING_OPTIONS, ...fromTools])];
  select.insertAdjacentHTML(
    "beforeend",
    options.map(p => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join("")
  );
}

function populateDepartmentDropdown() {
  const select = document.getElementById("s_dept");
  if (!select) return;
  const fromTools = [...new Set(TOOLS.map(t => t.department).filter(Boolean))];
  const options = [...new Set([...DEPARTMENT_OPTIONS, ...fromTools])];
  select.insertAdjacentHTML(
    "beforeend",
    options.map(d => `<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`).join("")
  );
}

function setCompareMode(on) {
  state.compareMode = on;
  if (!on) {
    state.compareIds = [];
  }
  rerender();
}

function syncCompareUI() {
  const bar = document.getElementById("compareBar");
  const banner = document.getElementById("compareBanner");
  const openBtn = document.getElementById("compareOpen");
  const text = document.getElementById("compareBarText");
  const toggle = document.getElementById("compareToggle");
  const count = state.compareIds.length;
  const onDirectory = state.view === "directory";
  const selecting = state.compareMode && onDirectory;

  if (toggle) {
    toggle.classList.toggle("is-active", state.compareMode);
    toggle.setAttribute("aria-pressed", String(state.compareMode));
    toggle.textContent = state.compareMode ? "Done" : "Compare";
  }

  if (selecting) {
    bar.hidden = false;
    bar.removeAttribute("hidden");
    bar.classList.add("is-visible");
  } else {
    bar.hidden = true;
    bar.classList.remove("is-visible");
  }
  if (banner) banner.hidden = !selecting;
  document.body.classList.toggle("has-compare-bar", selecting);

  if (!state.compareMode) return;

  if (count === 0) text.textContent = "Select 2–3 tools to compare";
  else if (count === 1) text.textContent = "1 tool selected — pick at least one more";
  else text.textContent = `${count} of ${COMPARE_MAX} tools selected`;

  openBtn.disabled = count < 2;
}

function toggleCompareId(id) {
  const idx = state.compareIds.indexOf(id);
  if (idx >= 0) {
    state.compareIds.splice(idx, 1);
  } else if (state.compareIds.length < COMPARE_MAX) {
    state.compareIds.push(id);
  }
  rerender();
}

/** Add/remove from compare while viewing a tool detail; turns compare mode on. */
function toggleCompareFromModal(id) {
  const idx = state.compareIds.indexOf(id);
  if (idx >= 0) {
    state.compareIds.splice(idx, 1);
  } else if (state.compareIds.length >= COMPARE_MAX) {
    return;
  } else {
    state.compareIds.push(id);
  }

  if (!state.compareMode) {
    state.compareMode = true;
  }

  closeModal();
  rerender();
}

function selectedTools() {
  return state.compareIds.map(id => TOOLS.find(t => t.id === id)).filter(Boolean);
}

function matchingComparisons(tools) {
  if (typeof COMPARISONS === "undefined") return [];
  const names = new Set(tools.map(t => t.name));
  return COMPARISONS.filter(row => row.tools.filter(name => names.has(name)).length >= 2);
}

function renderComparePanel() {
  const tools = selectedTools();
  if (tools.length < 2) return;

  const rows = [
    { label: "Status", values: tools.map(t => t.status) },
    { label: "Category", values: tools.map(t => t.category || "—") },
    { label: "Subcategory", values: tools.map(t => t.subcategory || "—") },
    { label: "Pricing", values: tools.map(t => t.pricing || "—") },
    { label: "Department", values: tools.map(t => t.department || "—") },
    { label: "Priority", values: tools.map(t => t.priority || "—") },
    { label: "Learning curve", values: tools.map(t => t.learningCurve || "—") },
    { label: "Data classification", values: tools.map(t => t.dataClassification || "—") },
    { label: "Owner", values: tools.map(t => t.owner || "Unassigned") },
    {
      label: "Assigned to",
      values: tools.map(t => {
        if (!toolIsInTestTrack(t)) return "—";
        const a = effectiveAssignment(t).assignedTo;
        return a || "—";
      }),
    },
    {
      label: "Testing notes",
      values: tools.map(t => {
        if (!toolIsInTestTrack(t)) return "—";
        const n = effectiveAssignment(t).testingNotes;
        return n || "—";
      }),
    },
    {
      label: "Rating",
      values: tools.map(t => {
        const ev = evaluationFor(t);
        return ratingHtml(ev, t) || "—";
      }),
      html: true,
    },
    { label: "Use cases", values: tools.map(t => (t.useCases || []).join(", ") || "—") },
    { label: "Description", values: tools.map(t => t.description || "—") },
    { label: "Notes", values: tools.map(t => t.notes || "—") },
    { label: "When to use", values: tools.map(t => t.whenToUse || "—") },
    { label: "Alternatives", values: tools.map(t => t.alternatives || "—") },
    { label: "Limitations", values: tools.map(t => t.limitations || "—") },
    { label: "Cost note", values: tools.map(t => t.costNote || "—") },
    { label: "Security tip", values: tools.map(t => t.securityTip || "—") },
    { label: "Approved models", values: tools.map(t => (t.approvedModels || []).join(", ") || "—") },
  ];

  const comps = matchingComparisons(tools);
  const compsHtml = comps.length ? `
    <h3 class="compare-section__title">Documented comparisons</h3>
    <div class="compare-notes">
      ${comps.map(c => `
        <article class="compare-note">
          <strong>${escapeHtml(c.feature)}</strong>
          <p>${escapeHtml(c.tools.join(" vs "))} — winner: <em>${escapeHtml(c.winner || "—")}</em></p>
          ${c.notes ? `<p class="compare-note__body">${escapeHtml(c.notes)}</p>` : ""}
        </article>
      `).join("")}
    </div>
  ` : `
    <p class="compare-empty">No saved head-to-head rows yet for this set.</p>
  `;

  document.getElementById("compareBody").innerHTML = `
    <div class="compare-table-wrap">
      <table class="compare-table">
        <thead>
          <tr>
            <th scope="col">Attribute</th>
            ${tools.map(t => `
              <th scope="col">
                <div class="compare-tool">
                  ${logoHtml(t)}
                  <span>${escapeHtml(t.name)}</span>
                </div>
              </th>
            `).join("")}
          </tr>
        </thead>
        <tbody>
          ${rows.map(row => `
            <tr>
              <th scope="row">${escapeHtml(row.label)}</th>
              ${row.values.map(v => `<td>${row.html ? v : escapeHtml(v)}</td>`).join("")}
            </tr>
          `).join("")}
          <tr>
            <th scope="row">Website</th>
            ${tools.map(t => t.url
              ? `<td><a class="compare-link" href="${escapeHtml(t.url)}" target="_blank" rel="noopener">Open website ↗</a></td>`
              : "<td>—</td>"
            ).join("")}
          </tr>
        </tbody>
      </table>
    </div>
    ${compsHtml}
  `;
}

function openCompare() {
  if (state.compareIds.length < 2) return;
  renderComparePanel();
  const overlay = document.getElementById("compareOverlay");
  const modal = document.getElementById("compareModal");
  if (overlay) {
    overlay.hidden = false;
    overlay.scrollTop = 0;
  }
  if (modal) modal.scrollTop = 0;
  document.body.style.overflow = "hidden";
}

/** Close the compare overlay. Keep selection mode on so people can pick another set. */
function closeCompare() {
  const overlay = document.getElementById("compareOverlay");
  if (overlay) overlay.hidden = true;
  document.body.style.overflow = "";
}

function init(opts = {}) {
  applyAssignmentOverrides();
  applyFiltersFromUrl();
  if (opts.forceHome) {
    state.view = "home";
    state.currentToolId = null;
    state.compareMode = false;
    state.compareIds = [];
    resetChipFilters();
    state.search = "";
  }
  populateCategoryDropdown();
  populatePricingDropdown();
  populateDepartmentDropdown();
  bindAppNavigation();
  bindBackToTop();
  bindTeamRegisterForm();
  showView(state.view);
  if (!opts.forceHome) openToolFromUrl();

  const params = new URLSearchParams(window.location.search);
  if (!opts.forceHome && params.get("compare") === "1") {
    setCompareMode(true);
  }

  document.getElementById("stats").addEventListener("click", e => {
    const stat = e.target.closest(".stat");
    if (!stat) return;

    if (stat.dataset.filter === "all") {
      state.starter = false;
      state.recent = false;
      state.status = null;
      state.statusBucket = null;
    } else if (stat.dataset.starter === "true") {
      state.starter = !state.starter;
      if (state.starter) {
        state.recent = false;
        state.status = null;
        state.statusBucket = null;
      }
    } else if (stat.dataset.recent === "true") {
      state.recent = !state.recent;
      if (state.recent) {
        state.starter = false;
        state.status = null;
        state.statusBucket = null;
      }
    } else if (stat.dataset.status) {
      const next = stat.dataset.status;
      state.starter = false;
      state.recent = false;
      state.statusBucket = null;
      state.status = state.status === next ? null : next;
    } else if (stat.dataset.bucket) {
      const bucket = stat.dataset.bucket;
      state.starter = false;
      state.recent = false;
      state.status = null;
      state.statusBucket = state.statusBucket === bucket ? null : bucket;
    }
    rerender();
    scrollToDirectoryResults();
  });

  document.getElementById("searchInput").addEventListener("input", e => {
    state.search = e.target.value;
    renderCards();
    syncUrl();
  });

  document.getElementById("sortSelect").addEventListener("change", e => {
    state.sort = e.target.value;
    renderCards();
    syncUrl();
  });

  document.getElementById("filterChips").addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (!chip) return;

    if (chip.dataset.starter === "true") {
      state.starter = !state.starter;
      if (state.starter) {
        state.recent = false;
        state.status = null;
        state.statusBucket = null;
      }
      rerender();
      scrollToDirectoryResults();
      return;
    }

    if (chip.dataset.filter === "all") {
      resetChipFilters();
      rerender();
      scrollToDirectoryResults();
      return;
    }

    if (chip.dataset.bucket) {
      const bucket = chip.dataset.bucket;
      state.starter = false;
      state.recent = false;
      state.status = null;
      state.statusBucket = state.statusBucket === bucket ? null : bucket;
      rerender();
      scrollToDirectoryResults();
      return;
    }

    if (chip.dataset.status) {
      state.starter = false;
      state.recent = false;
      state.statusBucket = null;
      state.status = state.status === chip.dataset.status ? null : chip.dataset.status;
      rerender();
      scrollToDirectoryResults();
      return;
    }

    if (chip.dataset.category) {
      state.category = state.category === chip.dataset.category ? null : chip.dataset.category;
      rerender();
      scrollToDirectoryResults();
      return;
    }

    if (chip.dataset.pricing) {
      state.pricing = state.pricing === chip.dataset.pricing ? null : chip.dataset.pricing;
      rerender();
      scrollToDirectoryResults();
    }
  });

  document.getElementById("clearFilters").addEventListener("click", clearFilters);
  document.getElementById("emptyClear").addEventListener("click", clearFilters);

  document.getElementById("compareToggle").addEventListener("click", () => {
    setCompareMode(!state.compareMode);
  });
  document.getElementById("compareClear").addEventListener("click", () => {
    state.compareIds = [];
    rerender();
  });
  document.getElementById("compareOpen").addEventListener("click", openCompare);
  document.getElementById("compareClose").addEventListener("click", closeCompare);
  document.getElementById("compareOverlay").addEventListener("click", e => {
    if (e.target.id === "compareOverlay") closeCompare();
  });

  document.getElementById("toolGrid").addEventListener("change", e => {
    const input = e.target.closest("input[data-compare-id]");
    if (!input) return;
    toggleCompareId(input.dataset.compareId);
  });

  document.getElementById("toolGrid").addEventListener("click", e => {
    if (e.target.closest("a[href]")) return;

    if (state.compareMode && state.view === "directory") {
      if (e.target.closest(".card__compare") || e.target.closest("input[data-compare-id]")) return;
      const detailsBtn = e.target.closest(".card__cta[data-open-details]");
      if (detailsBtn) {
        const tool = TOOLS.find(t => t.id === detailsBtn.dataset.openDetails);
        if (tool) openModal(tool);
        return;
      }
      const card = e.target.closest(".directory-item[data-id]");
      if (card) toggleCompareId(card.dataset.id);
      return;
    }

    const detailsBtn = e.target.closest("[data-open-details]");
    if (detailsBtn) {
      const tool = TOOLS.find(t => t.id === detailsBtn.dataset.openDetails);
      if (tool) openModal(tool);
    }
  });

  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalOverlay").addEventListener("click", e => {
    const compareBtn = e.target.closest("#modalCompareBtn");
    if (compareBtn && !compareBtn.disabled) {
      toggleCompareFromModal(compareBtn.dataset.id);
    }
  });
  document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    if (!document.getElementById("assignmentOverlay").hidden) {
      closeAssignmentModal();
      return;
    }
    if (!document.getElementById("compareOverlay").hidden) {
      closeCompare();
      return;
    }
    if (state.view === "tool") closeModal();
  });

  document.getElementById("assignmentClose").addEventListener("click", closeAssignmentModal);
  document.getElementById("assignmentOverlay").addEventListener("click", e => {
    if (e.target.id === "assignmentOverlay") closeAssignmentModal();
  });

  bindSuggestValidation();

  document.getElementById("suggestForm").addEventListener("submit", e => {
    e.preventDefault();
    if (!validateSuggestForm()) return;
    showSuggestDraft();
  });

  document.getElementById("suggestCopyDraft").addEventListener("click", async () => {
    const text = window.__suggestDraftText || "";
    const status = document.getElementById("suggestCopyStatus");
    try {
      await navigator.clipboard.writeText(text);
      status.hidden = false;
      status.textContent = "Draft copied — paste into Slack, email, or your review channel.";
    } catch {
      status.hidden = false;
      status.textContent = "Couldn’t copy automatically — open the review draft instead.";
    }
  });

  document.getElementById("suggestAnother").addEventListener("click", () => {
    resetSuggestForm();
    document.getElementById("suggestSuccess").hidden = true;
    document.getElementById("suggestFormWrap").hidden = false;
    document.getElementById("s_name").focus();
  });
}

function buildSuggestDraft() {
  const name = suggestValue("s_name");
  const category = suggestValue("s_category");
  const pricing = suggestValue("s_pricing");
  const urgency = suggestValue("s_urgency");
  const url = suggestValue("s_url");
  const submitter = suggestValue("s_submitter");
  const dept = suggestValue("s_dept");
  const desc = suggestValue("s_desc");
  const reason = suggestValue("s_reason");
  const today = new Date().toISOString().slice(0, 10);

  const lines = [
    `## Add tool: ${name}`,
    "",
    `- **Intended status:** Approved (joins the Directory after review)`,
    `- **Category:** ${category || "—"}`,
    `- **Pricing:** ${pricing || "—"}`,
    `- **When to try:** ${urgency || "—"}`,
    `- **Website:** ${url || "—"}`,
    `- **Added by:** ${submitter || "—"}`,
    `- **Department:** ${dept || "—"}`,
    "",
    "### What it does",
    desc || "—",
    "",
    "### How teammates should test it",
    reason || "—",
    "",
    "### Admin checklist",
    `- [ ] Approve and add row to \`data/ai_tools_directory.csv\` with Status=Approved, Date Added=${today}`,
    "- [ ] Ask teammates to test, then close this issue",
    "- [ ] Or reject and comment why",
    "",
    "_Submitted via AI Resource Center — Add a tool._",
  ];
  return lines.join("\n");
}

function showSuggestDraft() {
  const name = suggestValue("s_name");
  const body = buildSuggestDraft();
  window.__suggestDraftText = body;
  const cfg = typeof getSiteConfig === "function" ? getSiteConfig() : {};

  const link = document.getElementById("suggestIssueLink");
  link.href = buildIssueDraftUrl({
    title: `Add tool: ${name}`,
    body,
    label: cfg.suggestionLabel || "tool-add",
  });

  document.getElementById("suggestCopyStatus").hidden = true;
  document.getElementById("suggestFormWrap").hidden = true;
  document.getElementById("suggestSuccess").hidden = false;
}

const SUGGEST_LIMITS = {
  name: { min: 2, max: 80 },
  desc: { min: 20, max: 500 },
  reason: { min: 20, max: 800 },
  submitter: { min: 2, max: 60 },
  url: { max: 300 },
};

const NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9 ._\-+&'/()]*$/;
const PERSON_PATTERN = /^[A-Za-z][A-Za-z .'\-]*$/;

function suggestValue(id) {
  return (document.getElementById(id).value || "").trim();
}

function setSuggestFieldError(fieldKey, message) {
  const field = document.querySelector(`[data-field="${fieldKey}"]`);
  const err = document.getElementById(`s_${fieldKey}_err`);
  if (!field || !err) return;
  if (message) {
    field.classList.add("is-invalid");
    err.hidden = false;
    err.textContent = message;
  } else {
    field.classList.remove("is-invalid");
    err.hidden = true;
    err.textContent = "";
  }
}

function setSimilarToolsWarning(tools) {
  const el = document.getElementById("s_name_similar");
  if (!el) return;
  if (!tools || !tools.length) {
    el.hidden = true;
    el.innerHTML = "";
    return;
  }
  const links = tools.map(t =>
    `<button type="button" class="similar-tool-link" data-tool-id="${escapeHtml(t.id)}">${escapeHtml(t.name)}</button>` +
    ` <span class="similar-tool-status">(${escapeHtml(t.status)})</span>`
  ).join(", ");
  el.hidden = false;
  el.innerHTML = `Similar tools already listed: ${links}. You can still submit if this is different.`;
}

function clearSuggestErrors() {
  document.querySelectorAll("#suggestForm [data-field]").forEach(el => el.classList.remove("is-invalid"));
  document.querySelectorAll("#suggestForm .field-error").forEach(el => {
    el.hidden = true;
    el.textContent = "";
  });
  setSimilarToolsWarning([]);
  const formErr = document.getElementById("suggestFormErr");
  if (formErr) {
    formErr.hidden = true;
    formErr.textContent = "";
  }
}

function updateSuggestCounts() {
  const desc = document.getElementById("s_desc");
  const reason = document.getElementById("s_reason");
  const descCount = document.getElementById("s_desc_count");
  const reasonCount = document.getElementById("s_reason_count");
  if (desc && descCount) descCount.textContent = `${desc.value.length} / ${SUGGEST_LIMITS.desc.max}`;
  if (reason && reasonCount) reasonCount.textContent = `${reason.value.length} / ${SUGGEST_LIMITS.reason.max}`;
  updateSensitiveWarning();
}

const SENSITIVE_PATTERNS = [
  /\bclient\s+secret/i,
  /\bapi\s+key/i,
  /\bpassword\b/i,
  /\bproduction\s+(db|database|data|server)\b/i,
  /\bpii\b/i,
  /\bpersonally\s+identifiable\b/i,
  /\bcustomer\s+(data|password|secret|pii)\b/i,
  /\bconfidential\b/i,
  /\bprivate\s+key\b/i,
  /\baccess\s+token\b/i,
  /\bssn\b/i,
  /\bcredit\s+card\b/i,
];

function updateSensitiveWarning() {
  const el = document.getElementById("s_sensitive_warn");
  if (!el) return;
  const text = `${suggestValue("s_desc")} ${suggestValue("s_reason")}`;
  const hit = SENSITIVE_PATTERNS.some(re => re.test(text));
  if (hit) {
    el.hidden = false;
    el.textContent = "Don’t paste confidential client data, secrets, or production details into tool submissions. Describe the need without sensitive values — you can still submit.";
  } else {
    el.hidden = true;
    el.textContent = "";
  }
}

function normalizeSuggestUrl(raw) {
  const value = raw.trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (/^[\w.-]+\.[a-z]{2,}([/:?#].*)?$/i.test(value)) return `https://${value}`;
  return value;
}

function isValidHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

const SUBMISSION_STATUSES = ["All", "New", "In review", "Rejected"];

function normalizeSubmissionStatus(raw) {
  const lower = String(raw || "New").trim().toLowerCase();
  if (lower === "investigating" || lower === "in review") return "In review";
  const known = ["New", "Approved", "Rejected"];
  return known.find(s => s.toLowerCase() === lower) || "New";
}

function isInReviewStatus(status) {
  return normalizeSubmissionStatus(status) === "In review";
}

function bakedSubmissionRows() {
  const src = (typeof SUBMISSIONS !== "undefined" && Array.isArray(SUBMISSIONS)) ? SUBMISSIONS : [];
  return src.map(normalizeSubmission).filter(Boolean);
}

function submissionKey(row) {
  const name = normalizeToolName(row.toolName || "");
  if (name) return `name:${name}`;
  return `link:${String(row.link || "").trim().toLowerCase()}`;
}

function mergeSubmissionItems(baked, live) {
  const map = new Map();
  baked.forEach(row => map.set(submissionKey(row), row));
  (live || []).forEach(row => {
    if (!row) return;
    const key = submissionKey(row);
    const prev = map.get(key);
    map.set(key, prev ? { ...prev, ...row } : row);
  });
  return [...map.values()];
}

function effectiveSubmissionStatus(item) {
  const assigned = Boolean((item.assignedTo || "").trim());
  let status = normalizeSubmissionStatus(item.status || "New");
  if (!assigned && status === "In review") status = "New";
  return status;
}

function isActiveSubmission(item) {
  return effectiveSubmissionStatus(item) !== "Approved";
}

function visibleSubmissionItems(items) {
  return (items || []).filter(isActiveSubmission);
}

function submissionStatusLabel(item) {
  return effectiveSubmissionStatus(item);
}

function submissionStatusClass(item) {
  const status = effectiveSubmissionStatus(item).toLowerCase();
  if (status === "in review") return "investigating";
  if (status === "rejected") return "rejected";
  if (status === "approved") return "approved";
  return "new";
}

function submissionField(row, ...keys) {
  for (const key of keys) {
    if (row[key] != null && String(row[key]).trim()) return String(row[key]).trim();
    const found = Object.keys(row).find(k => k.toLowerCase() === key.toLowerCase());
    if (found && row[found] != null && String(row[found]).trim()) return String(row[found]).trim();
  }
  return "";
}

function parseCsvText(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;
  const pushCell = () => { row.push(cell); cell = ""; };
  const pushRow = () => { rows.push(row); row = []; };
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    const next = text[i + 1];
    if (inQuotes) {
      if (c === '"' && next === '"') { cell += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else cell += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") pushCell();
    else if (c === "\n") { pushCell(); pushRow(); }
    else if (c !== "\r") cell += c;
  }
  if (cell.length || row.length) { pushCell(); pushRow(); }
  return rows.filter(r => r.some(v => String(v).trim()));
}

function rowsFromCsv(text) {
  const table = parseCsvText(text);
  if (table.length < 2) return [];
  const headers = table[0].map(h => String(h || "").trim());
  return table.slice(1).map(values => {
    const row = {};
    headers.forEach((h, i) => { row[h] = values[i] != null ? values[i] : ""; });
    return row;
  });
}

function normalizeSubmission(row) {
  const link = submissionField(row, "Link", "URL", "url");
  if (!link) return null;
  let status = normalizeSubmissionStatus(submissionField(row, "Status") || "New");
  const assignedTo = submissionField(row, "Assigned to", "Assignee", "Assigned");
  if (!assignedTo && status === "In review") status = "New";
  return {
    submitted: submissionField(row, "Submitted", "Date", "Timestamp"),
    toolName: submissionField(row, "Tool name", "Tool Name", "Tool"),
    link,
    submittedBy: submissionField(row, "Submitted by", "Submitter"),
    note: submissionField(row, "Note", "Notes"),
    status,
    assignedTo,
    assignedDate: submissionField(row, "Assigned date", "Assigned Date"),
    rejectedDate: submissionField(row, "Rejected date", "Rejected Date"),
  };
}

function sortSubmissionsNewest(items) {
  return items.slice().sort((a, b) => String(b.submitted).localeCompare(String(a.submitted)));
}

async function fetchSubmissionRows() {
  const cfg = contributeConfig();
  if (cfg.csvUrl) {
    try {
      const res = await fetch(cfg.csvUrl, { cache: "no-store" });
      if (res.ok) {
        const text = await res.text();
        return rowsFromCsv(text).map(normalizeSubmission).filter(Boolean);
      }
    } catch (_) { /* fall through to Apps Script list */ }
  }
  if (cfg.submitUrl) {
    const listUrl = cfg.submitUrl.includes("?")
      ? `${cfg.submitUrl}&action=list`
      : `${cfg.submitUrl}?action=list`;
    const res = await fetch(listUrl, { cache: "no-store" });
    if (!res.ok) throw new Error(`List request failed (${res.status})`);
    const data = await res.json();
    const rows = Array.isArray(data.rows) ? data.rows : [];
    return rows.map(normalizeSubmission).filter(Boolean);
  }
  throw new Error("missing-config");
}

async function loadSubmissionItems() {
  const baked = bakedSubmissionRows();
  let live = [];
  const cfg = contributeConfig();
  if (cfg.csvUrl || cfg.submitUrl) {
    try {
      live = await fetchSubmissionRows();
    } catch (_) { /* baked submissions still show */ }
  }
  return sortSubmissionsNewest(mergeSubmissionItems(baked, live));
}

function renderSubmissionFilters(items) {
  const wrap = document.getElementById("submissionsFilters");
  if (!wrap) return;
  const visible = visibleSubmissionItems(items);
  wrap.innerHTML = SUBMISSION_STATUSES.map(status => {
    const count = status === "All"
      ? visible.length
      : visible.filter(i => effectiveSubmissionStatus(i) === status).length;
    const active = state.submissionStatus === status ? " active" : "";
    return `<button type="button" class="chip${active}" data-submission-status="${escapeHtml(status)}">${escapeHtml(status)} (${count})</button>`;
  }).join("");
}

function hostnameFromLink(link) {
  try { return new URL(link).hostname.replace(/^www\./, ""); }
  catch (_) { return link; }
}

function submissionStatusBadge(status) {
  const s = status || "New";
  if (s === "In review") return "blue";
  if (s === "Rejected") return "coral";
  if (s === "Approved") return "mint";
  return "amber";
}

function submissionCardTone(item, index) {
  const status = effectiveSubmissionStatus(item);
  if (status === "In review") return "engineering";
  if (status === "Rejected") return "management";
  if (status === "Approved") return "everyone";
  return PLAYBOOK_CARD_TONES[index % PLAYBOOK_CARD_TONES.length];
}

function submissionAssigneeOptions() {
  const members = getActiveTeamMembers();
  const opts = members.map(m =>
    `<option value="${escapeHtml(m.name)}">${escapeHtml(m.name)}</option>`
  ).join("");
  return `<option value="">Choose a teammate</option>${opts}`;
}

function submissionTooltipDate(item, status) {
  if (status === "In review") return item.assignedDate || item.submitted || "";
  if (status === "Rejected") return item.rejectedDate || item.submitted || "";
  return item.submitted || "";
}

function submissionTooltipHtml(item) {
  const status = effectiveSubmissionStatus(item);
  const assignee = (item.assignedTo || "").trim();
  const date = submissionTooltipDate(item, status);
  const cfg = contributeConfig();
  const canAssign = isAdminSession() && cfg.submitUrl && status === "New" && !assignee;
  const metaParts = [];
  if (status !== "Rejected") {
    if (assignee) {
      metaParts.push(`<span><strong>Reviewer:</strong> ${escapeHtml(assignee)}</span>`);
    }
    if (date) {
      metaParts.push(`<span><strong>Date:</strong> ${escapeHtml(date)}</span>`);
    }
  }
  const lines = [];
  if (metaParts.length) {
    lines.push(`<p class="submission-item__tip-meta">${metaParts.join("")}</p>`);
  }
  if (!assignee && status === "New" && !canAssign) {
    lines.push(`<p class="submission-item__tip-open"><span class="submission-item__tip-open-pill">Available to the team</span></p>`);
  }
  if (item.note) {
    lines.push(`<p class="submission-item__tip-note">${escapeHtml(item.note)}</p>`);
  }
  let assignBlock = "";
  if (canAssign) {
    assignBlock = `
      <div class="submission-item__assign" data-submission-link="${escapeHtml(item.link)}">
        <label class="submission-item__assign-label">Assign reviewer</label>
        <div class="submission-item__assign-row">
          <select class="submission-item__assign-select">${submissionAssigneeOptions()}</select>
          <button type="button" class="btn-base btn-secondary submission-item__assign-btn">Assign</button>
        </div>
        <p class="submission-item__assign-err" hidden></p>
      </div>`;
  }
  const adminBlock = submissionAdminActionsHtml(item);
  if (!lines.length && !assignBlock && !adminBlock) return "";
  return `<div class="submission-item__tip" role="tooltip">${lines.join("")}${assignBlock}${adminBlock}</div>`;
}

function submissionAdminCanAct(item) {
  const cfg = contributeConfig();
  if (!isAdminSession() || !cfg.submitUrl || !cfg.assignSecret) return false;
  const status = effectiveSubmissionStatus(item);
  return status === "New" || status === "In review";
}

function submissionAdminActionsHtml(item) {
  if (!submissionAdminCanAct(item)) return "";
  return `
    <div class="submission-item__admin" data-submission-link="${escapeHtml(item.link)}">
      <div class="submission-item__admin-row">
        <button type="button" class="btn-base btn-secondary submission-item__approve-btn">Approve &amp; add to Directory</button>
        <button type="button" class="linkbtn submission-item__reject-btn">Reject</button>
      </div>
    </div>`;
}

function submissionDisplayName(item) {
  const name = (item.toolName || "").trim();
  return name || hostnameFromLink(item.link);
}

function submissionMatchesSearch(item, query) {
  const q = String(query || "").trim().toLowerCase();
  if (q.length < 2) return true;
  return submissionDisplayName(item).toLowerCase().includes(q);
}

function renderSubmissionsList(items) {
  const list = document.getElementById("submissionsList");
  if (!list) return;
  const searchInput = document.getElementById("submissionSearchInput");
  if (searchInput && searchInput.value !== state.submissionSearch) {
    searchInput.value = state.submissionSearch;
  }
  const visible = visibleSubmissionItems(items);
  const statusFiltered = state.submissionStatus === "All"
    ? visible
    : visible.filter(i => effectiveSubmissionStatus(i) === state.submissionStatus);
  const filtered = statusFiltered.filter(i => submissionMatchesSearch(i, state.submissionSearch));
  if (!filtered.length) {
    const q = state.submissionSearch.trim();
    const msg = q
      ? `No tools match “${escapeHtml(q)}”. Try a different spelling or clear the search.`
      : "Nothing in this status yet. Try All, or suggest a tool on the right.";
    list.innerHTML = `<p class="pending-list__status">${msg}</p>`;
    return;
  }
  list.innerHTML = filtered.map((item, index) => {
    const statusLabel = submissionStatusLabel(item);
    const badge = submissionStatusBadge(statusLabel);
    const tone = submissionCardTone(item, index);
    const titleHtml = submissionLinkHtml(item);
    const tip = submissionTooltipHtml(item);
    return `
      <article class="submission-item playbook-card playbook-card--submission playbook-tone--${tone}" tabindex="0">
        <div class="submission-item__top">
          <div class="submission-item__identity">
            ${submissionLogoHtml(item)}
            <h3 class="submission-item__title">${titleHtml}</h3>
          </div>
          <span class="badge badge--${badge}">${escapeHtml(statusLabel)}</span>
        </div>
        ${tip}
      </article>`;
  }).join("");
}

async function renderSubmissions() {
  const list = document.getElementById("submissionsList");
  if (list) list.innerHTML = `<p class="pending-list__status">Loading queue…</p>`;
  applyContributeMode();
  const items = visibleSubmissionItems(await loadSubmissionItems());
  if (state.submissionStatus === "Approved") state.submissionStatus = "All";
  state.submissionsCache = items;
  renderSubmissionFilters(items);
  renderSubmissionsList(items);
}

function setSimpleFieldError(key, message) {
  const err = document.getElementById(`simple_${key}_err`);
  const field = document.querySelector(`[data-simple-field="${key}"]`);
  if (err) {
    err.hidden = !message;
    err.textContent = message || "";
  }
  if (field) field.classList.toggle("has-error", Boolean(message));
}

function validateSimpleSubmit() {
  const fields = ["tool", "link", "note"];
  if (isAdminSession()) fields.push("assign");
  fields.forEach(k => setSimpleFieldError(k, ""));
  const formErr = document.getElementById("simpleSubmitErr");
  if (formErr) { formErr.hidden = true; formErr.textContent = ""; }
  const toolInput = document.getElementById("simple_tool");
  const linkInput = document.getElementById("simple_link");
  const toolName = (toolInput ? toolInput.value : "").trim();
  if (toolInput) toolInput.value = toolName;
  let link = normalizeSuggestUrl(linkInput ? linkInput.value : "");
  if (linkInput) linkInput.value = link;
  const note = (document.getElementById("simple_note")?.value || "").trim();
  const assignee = isAdminSession()
    ? (document.getElementById("simple_assign")?.value || "").trim()
    : "";
  let ok = true;
  if (!toolName) {
    setSimpleFieldError("tool", "Enter a tool name.");
    ok = false;
  } else if (toolName.length < SUGGEST_LIMITS.name.min || toolName.length > SUGGEST_LIMITS.name.max) {
    setSimpleFieldError("tool", `Use ${SUGGEST_LIMITS.name.min}–${SUGGEST_LIMITS.name.max} characters.`);
    ok = false;
  } else if (!NAME_PATTERN.test(toolName)) {
    setSimpleFieldError("tool", "Use letters, numbers, spaces, and . _ - & + ' / ( ) only.");
    ok = false;
  }
  if (!link) {
    setSimpleFieldError("link", "Enter a link.");
    ok = false;
  } else if (link.length > 300) {
    setSimpleFieldError("link", "Keep the URL to 300 characters or fewer.");
    ok = false;
  } else if (!isValidHttpUrl(link)) {
    setSimpleFieldError("link", "Use a valid URL starting with http:// or https://");
    ok = false;
  }
  if (note.length > 200) {
    setSimpleFieldError("note", "Keep your note to 200 characters or fewer.");
    ok = false;
  }
  if (assignee && (assignee.length < 2 || assignee.length > 60)) {
    setSimpleFieldError("assign", "Choose a valid teammate.");
    ok = false;
  }
  if (!ok && formErr) {
    formErr.hidden = false;
    formErr.textContent = "Check the highlighted fields and try again.";
  }
  return ok ? { toolName, link, submittedBy: "", note, assignee } : null;
}

function showSimpleSubmitSuccess() {
  const wrap = document.getElementById("simpleSubmitWrap");
  const success = document.getElementById("simpleSubmitSuccess");
  if (wrap) wrap.hidden = true;
  if (success) success.hidden = false;
}

function resetSimpleSubmit() {
  document.getElementById("simpleSubmitForm")?.reset();
  ["tool", "link", "note", "assign"].forEach(k => setSimpleFieldError(k, ""));
  const formErr = document.getElementById("simpleSubmitErr");
  if (formErr) { formErr.hidden = true; formErr.textContent = ""; }
  const wrap = document.getElementById("simpleSubmitWrap");
  const success = document.getElementById("simpleSubmitSuccess");
  if (wrap) wrap.hidden = !contributeConfig().simpleSubmitEnabled;
  if (success) success.hidden = true;
  syncSimpleSubmitAdminFields();
}

async function assignSubmissionItem(item, assignee) {
  const cfg = contributeConfig();
  if (!cfg.submitUrl) throw new Error("Assign requires Google Sheet submitUrl.");
  const body = JSON.stringify({
    action: "assign",
    token: cfg.assignSecret || "",
    link: item.link,
    toolName: item.toolName,
    assignee,
  });
  try {
    const res = await fetch(cfg.submitUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body,
    });
    if (res.type !== "opaque" && res.ok) {
      const data = await res.json().catch(() => ({ ok: false }));
      if (data && data.ok === false) throw new Error(data.error || "Assign failed.");
      return data;
    }
    if (res.type !== "opaque" && !res.ok) throw new Error(`Assign failed (${res.status}).`);
  } catch (err) {
    if (err && /failed|Assign failed|Unauthorized/i.test(String(err.message)) && !/Failed to fetch|NetworkError|CORS/i.test(String(err.message))) {
      throw err;
    }
    await fetch(cfg.submitUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body,
    });
  }
  return { assignedDate: new Date().toISOString().slice(0, 10) };
}

async function postSubmissionAction(payload) {
  const cfg = contributeConfig();
  if (!cfg.submitUrl) throw new Error("Submissions endpoint not configured.");
  const body = JSON.stringify({ ...payload, token: cfg.assignSecret || "" });
  try {
    const res = await fetch(cfg.submitUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body,
    });
    if (res.type !== "opaque" && res.ok) {
      const data = await res.json().catch(() => ({ ok: false }));
      if (data && data.ok === false) throw new Error(data.error || "Request failed.");
      return data;
    }
    if (res.type !== "opaque" && !res.ok) throw new Error(`Request failed (${res.status}).`);
  } catch (err) {
    if (err && /failed|Unauthorized|not configured/i.test(String(err.message)) && !/Failed to fetch|NetworkError|CORS/i.test(String(err.message))) {
      throw err;
    }
    await fetch(cfg.submitUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body,
    });
  }
  return { ok: true };
}

async function rejectSubmissionItem(item, reason) {
  return postSubmissionAction({
    action: "reject",
    link: item.link,
    toolName: item.toolName,
    reason: reason || "",
  });
}

async function approveSubmissionItem(item, directory) {
  return postSubmissionAction({
    action: "approve",
    link: item.link,
    toolName: item.toolName,
    directory,
  });
}

function suggestNextToolId() {
  let max = 0;
  const seen = new Set();
  (typeof TOOLS !== "undefined" ? TOOLS : []).forEach(t => {
    const id = t.id || "";
    if (seen.has(id)) return;
    seen.add(id);
    const m = /^AIT-(\d+)$/i.exec(id);
    if (m) max = Math.max(max, parseInt(m[1], 10));
  });
  return `AIT-${String(max + 1).padStart(3, "0")}`;
}

function populateDirectoryApproveDropdowns() {
  const cat = document.getElementById("da_category");
  if (cat && cat.options.length <= 1) {
    cat.innerHTML = `<option value="">Select category</option>${(typeof CATEGORIES !== "undefined" ? CATEGORIES : [])
      .map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`).join("")}`;
  }
  const pricing = document.getElementById("da_pricing");
  if (pricing && pricing.options.length <= 1) {
    pricing.innerHTML = `<option value="">Select pricing</option>${PRICING_OPTIONS
      .map(p => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`).join("")}`;
  }
  const dept = document.getElementById("da_department");
  if (dept && !dept.options.length) {
    dept.innerHTML = DEPARTMENT_OPTIONS
      .map(d => `<option value="${escapeHtml(d)}">${escapeHtml(d)}</option>`).join("");
  }
}

function setDirectoryApproveFieldError(key, message) {
  const err = document.getElementById(`da_${key}_err`);
  const field = document.querySelector(`[data-da-field="${key}"]`);
  if (err) {
    err.hidden = !message;
    err.textContent = message || "";
  }
  if (field) field.classList.toggle("has-error", Boolean(message));
}

function clearDirectoryApproveErrors() {
  ["category", "pricing", "description", "videoUrl"].forEach(k => setDirectoryApproveFieldError(k, ""));
  const formErr = document.getElementById("directoryApproveErr");
  if (formErr) { formErr.hidden = true; formErr.textContent = ""; }
}

function prefillDirectoryApproveForm(item) {
  const name = submissionDisplayName(item);
  document.getElementById("da_link").value = item.link || "";
  document.getElementById("da_toolName").value = item.toolName || name;
  document.getElementById("directoryApproveTitle").textContent = `Add ${name} to Directory`;
  document.getElementById("directoryApproveDesc").textContent =
    `Complete catalog fields for ${name}. The submission will be marked Approved and queued for publish.`;
  document.getElementById("da_description").value = (item.note || "").slice(0, 500);
  document.getElementById("da_notes").value = item.note || "";
  document.getElementById("da_videoUrl").value = "";
  document.getElementById("da_platform").value = "Web";
  document.getElementById("da_status").value = "Approved";
  document.getElementById("da_department").value = "Everyone";
  document.getElementById("da_learningCurve").value = "Medium";
  document.getElementById("da_priority").value = "Medium";
  document.getElementById("da_dataClassification").value = "Internal";
  document.getElementById("da_category").value = "";
  document.getElementById("da_subcategory").value = "";
  document.getElementById("da_pricing").value = "";
  document.getElementById("da_useCases").value = "";
  document.getElementById("da_limitations").value = "";
  document.getElementById("da_whenToUse").value = "";
  document.getElementById("da_securityTip").value = "Internal data only unless explicitly approved.";
  clearDirectoryApproveErrors();
}

function openDirectoryApproveModal(item) {
  state.directoryApproveItem = item;
  state.directoryApprovePayload = null;
  prefillDirectoryApproveForm(item);
  document.getElementById("directoryApproveFormWrap").hidden = false;
  document.getElementById("directoryApproveSuccess").hidden = true;
  document.getElementById("directoryApproveOverlay").hidden = false;
  document.getElementById("da_category")?.focus();
}

function closeDirectoryApproveModal() {
  document.getElementById("directoryApproveOverlay").hidden = true;
  state.directoryApproveItem = null;
}

function validateDirectoryApproveForm() {
  clearDirectoryApproveErrors();
  const category = (document.getElementById("da_category")?.value || "").trim();
  const pricing = (document.getElementById("da_pricing")?.value || "").trim();
  const description = (document.getElementById("da_description")?.value || "").trim();
  const videoUrl = (document.getElementById("da_videoUrl")?.value || "").trim();
  let ok = true;
  if (!category) {
    setDirectoryApproveFieldError("category", "Choose a category.");
    ok = false;
  }
  if (!pricing) {
    setDirectoryApproveFieldError("pricing", "Choose a pricing model.");
    ok = false;
  }
  if (description.length < 20) {
    setDirectoryApproveFieldError("description", "Use at least 20 characters.");
    ok = false;
  }
  if (!isValidHttpUrl(videoUrl)) {
    setDirectoryApproveFieldError("videoUrl", "Enter a valid tutorial video URL.");
    ok = false;
  }
  return ok;
}

function collectDirectoryApprovePayload(item) {
  const today = new Date().toISOString().slice(0, 10);
  const toolName = (document.getElementById("da_toolName")?.value || item.toolName || submissionDisplayName(item)).trim();
  const link = (document.getElementById("da_link")?.value || item.link || "").trim();
  return {
    toolId: suggestNextToolId(),
    toolName,
    link,
    submissionLink: link,
    category: (document.getElementById("da_category")?.value || "").trim(),
    subcategory: (document.getElementById("da_subcategory")?.value || "").trim(),
    pricing: (document.getElementById("da_pricing")?.value || "").trim(),
    status: (document.getElementById("da_status")?.value || "Approved").trim(),
    url: link,
    videoUrl: (document.getElementById("da_videoUrl")?.value || "").trim(),
    description: (document.getElementById("da_description")?.value || "").trim(),
    platform: (document.getElementById("da_platform")?.value || "").trim(),
    department: (document.getElementById("da_department")?.value || "Everyone").trim(),
    useCases: (document.getElementById("da_useCases")?.value || "").trim(),
    learningCurve: (document.getElementById("da_learningCurve")?.value || "Medium").trim(),
    priority: (document.getElementById("da_priority")?.value || "Medium").trim(),
    dataClassification: (document.getElementById("da_dataClassification")?.value || "Internal").trim(),
    owner: "Admin",
    dateAdded: today,
    lastReviewed: today,
    notes: (document.getElementById("da_notes")?.value || "").trim(),
    limitations: (document.getElementById("da_limitations")?.value || "").trim(),
    whenToUse: (document.getElementById("da_whenToUse")?.value || "").trim(),
    securityTip: (document.getElementById("da_securityTip")?.value || "").trim(),
    approvedModels: "",
  };
}

function directoryApproveJsonFilename(payload) {
  const slug = String(payload.toolName || "tool").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "tool";
  return `directory-${slug}.json`;
}

function directoryApprovePublishCommand(filename) {
  return `python scripts/add_directory_tool.py --json ${filename}`;
}

function downloadDirectoryApproveJson(payload) {
  const filename = directoryApproveJsonFilename(payload);
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
  return filename;
}

function showDirectoryApproveSuccess(payload, sheetOk) {
  state.directoryApprovePayload = payload;
  const filename = directoryApproveJsonFilename(payload);
  const cmd = directoryApprovePublishCommand(filename);
  document.getElementById("directoryApproveCmd").textContent = cmd;
  document.getElementById("directoryApproveFormWrap").hidden = true;
  document.getElementById("directoryApproveSuccess").hidden = false;
  if (!sheetOk) {
    const note = document.querySelector("#directoryApproveSuccess .field-note");
    if (note) {
      note.textContent = "Sheet update could not be confirmed — still run the publish command locally, then sync tool_submissions.csv if needed.";
    }
  }
  downloadDirectoryApproveJson(payload);
}

function bindDirectoryApproveModal() {
  const overlay = document.getElementById("directoryApproveOverlay");
  if (!overlay || overlay.dataset.bound === "1") return;
  overlay.dataset.bound = "1";

  document.getElementById("directoryApproveClose")?.addEventListener("click", closeDirectoryApproveModal);
  document.getElementById("directoryApproveCancel")?.addEventListener("click", closeDirectoryApproveModal);
  overlay.addEventListener("click", e => {
    if (e.target === overlay) closeDirectoryApproveModal();
  });

  document.getElementById("directoryApproveForm")?.addEventListener("submit", async e => {
    e.preventDefault();
    const item = state.directoryApproveItem;
    if (!item || !validateDirectoryApproveForm()) return;
    const payload = collectDirectoryApprovePayload(item);
    const btn = document.getElementById("directoryApproveSubmit");
    const formErr = document.getElementById("directoryApproveErr");
    if (btn) { btn.disabled = true; btn.textContent = "Saving…"; }
    let sheetOk = false;
    try {
      await approveSubmissionItem(item, payload);
      sheetOk = true;
      item.status = "Approved";
      renderSubmissionFilters(state.submissionsCache || []);
      renderSubmissionsList(state.submissionsCache || []);
      showDirectoryApproveSuccess(payload, sheetOk);
    } catch (err) {
      if (formErr) {
        formErr.hidden = false;
        formErr.textContent = err.message || "Could not update the sheet. Fix config or try again.";
      }
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = "Approve & queue publish"; }
    }
  });

  document.getElementById("directoryApproveCopyCmd")?.addEventListener("click", () => {
    const cmd = document.getElementById("directoryApproveCmd")?.textContent || "";
    navigator.clipboard?.writeText(cmd).catch(() => {});
  });

  document.getElementById("directoryApproveDownloadJson")?.addEventListener("click", () => {
    if (state.directoryApprovePayload) downloadDirectoryApproveJson(state.directoryApprovePayload);
  });

  document.getElementById("directoryApproveDone")?.addEventListener("click", () => {
    closeDirectoryApproveModal();
    renderSubmissions();
  });
}

async function submitSimpleLink(payload) {
  const cfg = contributeConfig();
  if (!cfg.submitUrl) {
    throw new Error("Submit is not configured. In docs/site-config.js set contribute.simpleSubmit.submitUrl to your Apps Script web app URL (Deploy → Web app), then reload.");
  }
  const body = JSON.stringify({
    toolName: payload.toolName,
    link: payload.link,
    submittedBy: payload.submittedBy,
    note: payload.note,
    ...(payload.assignee
      ? { assignee: payload.assignee, token: cfg.assignSecret || "" }
      : {}),
  });
  try {
    const res = await fetch(cfg.submitUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body,
    });
    if (res.type !== "opaque" && res.ok) {
      const data = await res.json().catch(() => ({ ok: true }));
      if (data && data.ok === false) throw new Error(data.error || "Submit failed.");
      return;
    }
    if (res.type !== "opaque" && !res.ok) throw new Error(`Submit failed (${res.status}).`);
  } catch (err) {
    if (err && /failed|not configured|Submit failed/i.test(String(err.message)) && !/Failed to fetch|NetworkError|CORS/i.test(String(err.message))) {
      throw err;
    }
    await fetch(cfg.submitUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body,
    });
  }
}

function bindSimpleSubmit() {
  const form = document.getElementById("simpleSubmitForm");
  if (!form) return;
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const payload = validateSimpleSubmit();
    if (!payload) return;
    const btn = document.getElementById("simpleSubmitBtn");
    const formErr = document.getElementById("simpleSubmitErr");
    if (btn) { btn.disabled = true; btn.textContent = "Submitting…"; }
    try {
      await submitSimpleLink(payload);
      showSimpleSubmitSuccess();
      renderSubmissions();
    } catch (err) {
      if (formErr) {
        formErr.hidden = false;
        formErr.textContent = err.message || "Something went wrong. Try again in a moment.";
      }
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = "Suggest tool"; }
    }
  });
  document.getElementById("simpleSubmitAnother")?.addEventListener("click", resetSimpleSubmit);
}

function bindSubmissionsPage() {
  const list = document.getElementById("submissionsList");
  if (list && list.dataset.assignBound !== "1") {
    list.dataset.assignBound = "1";
    list.addEventListener("click", async e => {
      const approveBtn = e.target.closest(".submission-item__approve-btn");
      if (approveBtn && isAdminSession()) {
        e.preventDefault();
        e.stopPropagation();
        const wrap = approveBtn.closest(".submission-item__admin");
        const link = wrap?.dataset.submissionLink || "";
        const item = (state.submissionsCache || []).find(i => i.link === link);
        if (item) openDirectoryApproveModal(item);
        return;
      }
      const rejectBtn = e.target.closest(".submission-item__reject-btn");
      if (rejectBtn && isAdminSession()) {
        e.preventDefault();
        e.stopPropagation();
        const wrap = rejectBtn.closest(".submission-item__admin");
        const link = wrap?.dataset.submissionLink || "";
        const item = (state.submissionsCache || []).find(i => i.link === link);
        if (!item) return;
        const name = submissionDisplayName(item);
        const reason = window.prompt(`Reject ${name}? Optional reason:`) ?? null;
        if (reason === null) return;
        rejectBtn.disabled = true;
        try {
          await rejectSubmissionItem(item, reason.trim());
          item.status = "Rejected";
          item.rejectedDate = new Date().toISOString().slice(0, 10);
          if (reason.trim() && item.note) item.note = `${item.note} — Rejected: ${reason.trim()}`;
          else if (reason.trim()) item.note = `Rejected: ${reason.trim()}`;
          renderSubmissionFilters(state.submissionsCache || []);
          renderSubmissionsList(state.submissionsCache || []);
        } catch (err) {
          window.alert(err.message || "Could not reject. Try again.");
        } finally {
          rejectBtn.disabled = false;
        }
        return;
      }
      const btn = e.target.closest(".submission-item__assign-btn");
      if (!btn || !isAdminSession()) return;
      e.preventDefault();
      e.stopPropagation();
      const wrap = btn.closest(".submission-item__assign");
      const link = wrap?.dataset.submissionLink || "";
      const select = wrap?.querySelector(".submission-item__assign-select");
      const errEl = wrap?.querySelector(".submission-item__assign-err");
      const assignee = (select?.value || "").trim();
      if (!assignee) {
        if (errEl) { errEl.hidden = false; errEl.textContent = "Choose a reviewer first."; }
        select?.focus();
        return;
      }
      const item = (state.submissionsCache || []).find(i => i.link === link);
      if (!item) return;
      if (errEl) { errEl.hidden = true; errEl.textContent = ""; }
      btn.disabled = true;
      btn.textContent = "Assigning…";
      try {
        const data = await assignSubmissionItem(item, assignee);
        item.assignedTo = assignee;
        item.status = "In review";
        item.assignedDate = (data && data.assignedDate) || new Date().toISOString().slice(0, 10);
        renderSubmissionFilters(state.submissionsCache || []);
        renderSubmissionsList(state.submissionsCache || []);
      } catch (err) {
        if (errEl) {
          errEl.hidden = false;
          errEl.textContent = err.message || "Could not assign. Try again.";
        }
      } finally {
        btn.disabled = false;
        btn.textContent = "Assign";
      }
    });
  }
  document.getElementById("submissionsFilters")?.addEventListener("click", e => {
    const chip = e.target.closest("[data-submission-status]");
    if (!chip) return;
    state.submissionStatus = chip.dataset.submissionStatus;
    renderSubmissionFilters(state.submissionsCache || []);
    renderSubmissionsList(state.submissionsCache || []);
  });
  const searchInput = document.getElementById("submissionSearchInput");
  if (searchInput && searchInput.dataset.bound !== "1") {
    searchInput.dataset.bound = "1";
    searchInput.addEventListener("input", e => {
      state.submissionSearch = e.target.value;
      renderSubmissionsList(state.submissionsCache || []);
    });
  }
}

function normalizeToolName(name) {
  return String(name || "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i - 1;
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cur = row[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
      prev = cur;
    }
  }
  return row[b.length];
}

function existingToolMatch(name) {
  const q = name.trim().toLowerCase();
  const qNorm = normalizeToolName(name);
  return TOOLS.find(t => {
    const n = (t.name || "").trim().toLowerCase();
    return n === q || normalizeToolName(t.name) === qNorm;
  }) || null;
}

function findSimilarTools(name) {
  const q = name.trim().toLowerCase();
  const qNorm = normalizeToolName(name);
  if (qNorm.length < 3) return [];

  const qTokens = q.split(/[^a-z0-9]+/).filter(t => t.length >= 3);
  const scored = [];

  TOOLS.forEach(tool => {
    const nameLower = (tool.name || "").trim().toLowerCase();
    const norm = normalizeToolName(tool.name);
    if (!norm || norm === qNorm) return; // exact handled separately

    let score = 0;
    if (norm.includes(qNorm) || qNorm.includes(norm)) score += 3;
    const dist = levenshtein(qNorm, norm);
    const maxLen = Math.max(qNorm.length, norm.length);
    if (maxLen && dist <= 2 && Math.abs(qNorm.length - norm.length) <= 2) score += 3;
    else if (maxLen && dist / maxLen <= 0.25) score += 2;

    const tTokens = nameLower.split(/[^a-z0-9]+/).filter(t => t.length >= 3);
    const overlap = qTokens.filter(t => tTokens.includes(t));
    if (overlap.length) score += overlap.length;

    if (score >= 2) scored.push({ tool, score });
  });

  return scored
    .sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name))
    .slice(0, 3)
    .map(s => s.tool);
}

function updateSimilarToolsWarning() {
  const name = suggestValue("s_name");
  if (!name || name.length < SUGGEST_LIMITS.name.min) {
    setSimilarToolsWarning([]);
    return;
  }
  if (existingToolMatch(name)) {
    setSimilarToolsWarning([]);
    return;
  }
  const similar = findSimilarTools(name);
  setSimilarToolsWarning(similar);
}

function validateSuggestForm() {
  clearSuggestErrors();
  updateSimilarToolsWarning();
  const errors = {};

  const name = suggestValue("s_name");
  const category = suggestValue("s_category");
  const pricing = suggestValue("s_pricing");
  const urlRaw = suggestValue("s_url");
  const urgency = suggestValue("s_urgency");
  const submitter = suggestValue("s_submitter");
  const desc = suggestValue("s_desc");
  const reason = suggestValue("s_reason");
  const dept = suggestValue("s_dept");

  if (!name) {
    errors.name = "Tool name is required.";
  } else if (name.length < SUGGEST_LIMITS.name.min || name.length > SUGGEST_LIMITS.name.max) {
    errors.name = `Use ${SUGGEST_LIMITS.name.min}–${SUGGEST_LIMITS.name.max} characters.`;
  } else if (!NAME_PATTERN.test(name)) {
    errors.name = "Use letters, numbers, spaces, and . _ - & + ' / ( ) only.";
  } else {
    const dup = existingToolMatch(name);
    if (dup) errors.name = `“${dup.name}” is already in the directory.`;
  }

  if (!category) {
    errors.category = "Please select a category.";
  } else if (typeof CATEGORIES !== "undefined" && CATEGORIES.length && !CATEGORIES.includes(category)) {
    errors.category = "Choose a category from the list.";
  }

  if (pricing) {
    const allowed = new Set([
      ...PRICING_OPTIONS,
      ...TOOLS.map(t => t.pricing).filter(Boolean),
    ]);
    if (!allowed.has(pricing)) errors.pricing = "Choose a pricing model from the list.";
  }

  if (!urlRaw) {
    errors.url = "Website is required.";
  } else {
    const url = normalizeSuggestUrl(urlRaw);
    if (url.length > SUGGEST_LIMITS.url.max) {
      errors.url = `URL must be ${SUGGEST_LIMITS.url.max} characters or fewer.`;
    } else if (!isValidHttpUrl(url)) {
      errors.url = "Enter a valid URL starting with http:// or https://";
    } else {
      document.getElementById("s_url").value = url;
    }
  }

  if (urgency && !URGENCY_OPTIONS.includes(urgency)) {
    errors.urgency = "Choose an urgency option from the list.";
  }

  if (!submitter) {
    errors.submitter = "Your name is required.";
  } else if (submitter.length < SUGGEST_LIMITS.submitter.min || submitter.length > SUGGEST_LIMITS.submitter.max) {
      errors.submitter = `Use ${SUGGEST_LIMITS.submitter.min}–${SUGGEST_LIMITS.submitter.max} characters.`;
    } else if (!PERSON_PATTERN.test(submitter)) {
      errors.submitter = "Use letters, spaces, apostrophes, or hyphens only.";
  }

  if (!desc) {
    errors.desc = "A short description is required.";
  } else if (desc.length < SUGGEST_LIMITS.desc.min) {
    errors.desc = `Add a bit more detail (at least ${SUGGEST_LIMITS.desc.min} characters).`;
  } else if (desc.length > SUGGEST_LIMITS.desc.max) {
    errors.desc = `Keep the description to ${SUGGEST_LIMITS.desc.max} characters or fewer.`;
  }

  if (reason) {
    if (reason.length < SUGGEST_LIMITS.reason.min) {
      errors.reason = `If you fill this in, use at least ${SUGGEST_LIMITS.reason.min} characters.`;
    } else if (reason.length > SUGGEST_LIMITS.reason.max) {
      errors.reason = `Keep this to ${SUGGEST_LIMITS.reason.max} characters or fewer.`;
    }
  }

  if (dept) {
    const allowed = new Set([
      ...DEPARTMENT_OPTIONS,
      ...TOOLS.map(t => t.department).filter(Boolean),
    ]);
    if (!allowed.has(dept)) errors.dept = "Choose a department from the list.";
  }

  Object.entries(errors).forEach(([key, message]) => setSuggestFieldError(key, message));

  if (Object.keys(errors).length) {
    const formErr = document.getElementById("suggestFormErr");
    formErr.hidden = false;
    formErr.textContent = "Please fix the highlighted fields before submitting.";
    const firstKey = Object.keys(errors)[0];
    const firstInput = document.querySelector(`[data-field="${firstKey}"] input, [data-field="${firstKey}"] textarea, [data-field="${firstKey}"] select`);
    if (firstInput) firstInput.focus();
    return false;
  }
  return true;
}

function resetSuggestForm() {
  document.getElementById("suggestForm").reset();
  clearSuggestErrors();
  updateSuggestCounts();
  updateSensitiveWarning();
}

function bindSuggestValidation() {
  updateSuggestCounts();
  ["s_desc", "s_reason"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", updateSuggestCounts);
  });

  const nameInput = document.getElementById("s_name");
  if (nameInput) {
    nameInput.addEventListener("input", () => {
      setSuggestFieldError("name", "");
      updateSimilarToolsWarning();
    });
    nameInput.addEventListener("blur", updateSimilarToolsWarning);
  }

  const similarBox = document.getElementById("s_name_similar");
  if (similarBox) {
    similarBox.addEventListener("click", e => {
      const link = e.target.closest(".similar-tool-link");
      if (!link) return;
      const tool = TOOLS.find(t => t.id === link.dataset.toolId);
      if (!tool) return;
      openModal(tool);
    });
  }

  const map = {
    s_category: "category",
    s_pricing: "pricing",
    s_url: "url",
    s_urgency: "urgency",
    s_submitter: "submitter",
    s_desc: "desc",
    s_reason: "reason",
    s_dept: "dept",
  };
  Object.entries(map).forEach(([id, key]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener("input", () => setSuggestFieldError(key, ""));
    el.addEventListener("change", () => setSuggestFieldError(key, ""));
  });
}

function openSuggest() {
  showView("contribute");
  const panel = document.getElementById("contribSuggestPanel");
  if (panel) panel.hidden = false;
  resetSuggestForm();
  document.getElementById("suggestFormWrap").hidden = false;
  document.getElementById("suggestSuccess").hidden = true;
  requestAnimationFrame(() => {
    document.getElementById("suggestForm")?.scrollIntoView({ behavior: "smooth", block: "start" });
    document.getElementById("s_name")?.focus();
  });
}

function closeSuggest() {
  // Suggest form is inline on Contribute — nothing to dismiss.
}

/* ---------- Soft auth gate (password / invite) ---------- */

let appInitialized = false;
/** Cached validated session for sync UI checks (admin assign, etc.). */
let cachedAuthSession = null;

const LOGIN_ATTEMPT_KEY = "dcs-ai-rc-login-attempts";

function startAppOnce(opts = {}) {
  if (appInitialized) {
    if (opts.forceHome) showView("home");
    return;
  }
  appInitialized = true;
  init(opts);
}

function authConfig() {
  return typeof getAuthConfig === "function"
    ? getAuthConfig()
    : {
      enabled: false,
      username: "admin@dailycodesolutions.com",
      passwordHash: "",
      employeeUsername: "team",
      employeePasswordHash: "",
      inviteTokenHash: "",
      sessionDays: 15,
      sessionSalt: "dcs-ai-rc-auth",
      sessionKey: "dcs-ai-rc-auth",
      maxLoginAttempts: 5,
      lockoutSeconds: 60,
    };
}

async function sha256Hex(text) {
  const data = new TextEncoder().encode(String(text || ""));
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqualHex(a, b) {
  const left = String(a || "").toLowerCase();
  const right = String(b || "").toLowerCase();
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let i = 0; i < left.length; i += 1) {
    mismatch |= left.charCodeAt(i) ^ right.charCodeAt(i);
  }
  return mismatch === 0;
}

async function secretMatches(entered, expectedHash) {
  const expected = String(expectedHash || "").trim().toLowerCase();
  if (!expected || expected.length !== 64) return false;
  const hex = await sha256Hex(entered);
  return timingSafeEqualHex(hex, expected);
}

async function sessionSignature(username, at, isAdmin, salt) {
  return sha256Hex(`${String(username || "").toLowerCase()}|${Number(at)}|${isAdmin ? 1 : 0}|${salt}`);
}

function readLoginAttempts() {
  try {
    const raw = sessionStorage.getItem(LOGIN_ATTEMPT_KEY);
    const data = raw ? JSON.parse(raw) : null;
    if (!data || typeof data !== "object") return { count: 0, lockedUntil: 0 };
    return {
      count: Math.max(0, Number(data.count) || 0),
      lockedUntil: Math.max(0, Number(data.lockedUntil) || 0),
    };
  } catch {
    return { count: 0, lockedUntil: 0 };
  }
}

function writeLoginAttempts(state) {
  try {
    sessionStorage.setItem(LOGIN_ATTEMPT_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

function clearLoginAttempts() {
  try { sessionStorage.removeItem(LOGIN_ATTEMPT_KEY); } catch { /* ignore */ }
}

function loginLockRemainingMs() {
  const { lockedUntil } = readLoginAttempts();
  return Math.max(0, lockedUntil - Date.now());
}

function registerLoginFailure(cfg) {
  const state = readLoginAttempts();
  const count = state.count + 1;
  const next = { count, lockedUntil: state.lockedUntil };
  if (count >= cfg.maxLoginAttempts) {
    next.lockedUntil = Date.now() + cfg.lockoutSeconds * 1000;
    next.count = 0;
  }
  writeLoginAttempts(next);
  return next;
}

async function readAuthSession() {
  const cfg = authConfig();
  const { sessionKey, sessionDays, sessionSalt } = cfg;
  try {
    const raw = localStorage.getItem(sessionKey);
    if (!raw) {
      cachedAuthSession = null;
      return null;
    }
    const data = JSON.parse(raw);
    if (!data?.ok || !data?.at || !data?.sig) {
      localStorage.removeItem(sessionKey);
      cachedAuthSession = null;
      return null;
    }
    const maxAge = sessionDays * 24 * 60 * 60 * 1000;
    if (Date.now() - Number(data.at) > maxAge) {
      localStorage.removeItem(sessionKey);
      cachedAuthSession = null;
      return null;
    }
    const expected = await sessionSignature(data.username, data.at, Boolean(data.isAdmin), sessionSalt);
    if (!timingSafeEqualHex(data.sig, expected)) {
      localStorage.removeItem(sessionKey);
      cachedAuthSession = null;
      return null;
    }
    cachedAuthSession = data;
    return data;
  } catch {
    cachedAuthSession = null;
    return null;
  }
}

async function writeAuthSession({ username = "", isAdmin = false } = {}) {
  const cfg = authConfig();
  const at = Date.now();
  const user = String(username || "").trim().toLowerCase();
  const admin = Boolean(isAdmin);
  const sig = await sessionSignature(user, at, admin, cfg.sessionSalt);
  const payload = {
    ok: true,
    at,
    username: user,
    isAdmin: admin,
    sig,
  };
  localStorage.setItem(cfg.sessionKey, JSON.stringify(payload));
  cachedAuthSession = payload;
}

function clearAuthSession() {
  const { sessionKey } = authConfig();
  localStorage.removeItem(sessionKey);
  cachedAuthSession = null;
  try { sessionStorage.removeItem(sessionKey); } catch { /* ignore */ }
  clearLoginAttempts();
}

async function isAuthenticated() {
  const cfg = authConfig();
  if (!cfg.enabled) return true;
  return Boolean(await readAuthSession());
}

/** Sync admin check for UI (uses cache refreshed on login / bootstrap). */
function isAdminSession() {
  const cfg = authConfig();
  if (!cfg.enabled) return true;
  const session = cachedAuthSession;
  if (!session) return false;
  return Boolean(session.isAdmin);
}

async function resolveLogin(username, password, cfg) {
  const value = String(username || "").trim().toLowerCase();
  if (!value || !String(password || "").trim()) return null;

  const adminUser = String(cfg.username || "").toLowerCase();
  const employeeUser = String(cfg.employeeUsername || "").toLowerCase();

  if (value === adminUser && await secretMatches(password, cfg.passwordHash)) {
    return { username: value, isAdmin: true };
  }
  if (employeeUser && value === employeeUser && await secretMatches(password, cfg.employeePasswordHash)) {
    return { username: value, isAdmin: false };
  }
  return null;
}

const ASSIGN_STORAGE_KEY = "dcs-ai-rc-assignments";

function readAssignments() {
  try {
    const raw = localStorage.getItem(ASSIGN_STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    return data && typeof data === "object" ? data : {};
  } catch {
    return {};
  }
}

function writeAssignment(issueKey, assignee) {
  const all = readAssignments();
  const key = String(issueKey);
  const name = String(assignee || "").trim();
  if (!name) {
    delete all[key];
  } else {
    all[key] = { name, at: Date.now() };
  }
  localStorage.setItem(ASSIGN_STORAGE_KEY, JSON.stringify(all));
}

function assignmentFor(issueKey) {
  return readAssignments()[String(issueKey)] || null;
}

function sessionRoleBadge() {
  const cfg = authConfig();
  if (!cfg.enabled || !cachedAuthSession) return null;
  return cachedAuthSession.isAdmin ? "Admin" : "Team";
}

function updateHeaderSessionBadge() {
  const badge = document.getElementById("sessionRoleBadge");
  if (!badge) return;
  const role = sessionRoleBadge();
  if (!role) {
    badge.hidden = true;
    badge.textContent = "";
    badge.classList.remove("dcs-header__role--admin", "dcs-header__role--team");
    badge.removeAttribute("aria-label");
    return;
  }
  badge.hidden = false;
  badge.textContent = role;
  badge.classList.toggle("dcs-header__role--admin", role === "Admin");
  badge.classList.toggle("dcs-header__role--team", role === "Team");
  badge.setAttribute("aria-label", `Signed in as ${role}`);
}

function unlockApp() {
  document.body.classList.remove("auth-locked");
  const gate = document.getElementById("loginGate");
  if (gate) gate.hidden = true;
  const signOut = document.getElementById("signOutBtn");
  if (signOut) signOut.hidden = !authConfig().enabled;
  updateHeaderSessionBadge();
  syncSimpleSubmitAdminFields();
}

function lockApp() {
  document.body.classList.add("auth-locked");
  const gate = document.getElementById("loginGate");
  if (gate) gate.hidden = false;
  const signOut = document.getElementById("signOutBtn");
  if (signOut) signOut.hidden = true;
  updateHeaderSessionBadge();
  const user = document.getElementById("loginUsername");
  const pass = document.getElementById("loginPassword");
  if (user) user.value = "";
  if (pass) pass.value = "";
  clearLoginErrors();
  syncSimpleSubmitAdminFields();
  requestAnimationFrame(() => user?.focus());
}

function clearLoginErrors() {
  ["loginError", "loginUsernameError", "loginPasswordError"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.hidden = true;
    el.textContent = "";
  });
  document.querySelectorAll("#loginForm [data-login-field]").forEach(el => {
    el.classList.remove("is-invalid");
  });
}

function setLoginFieldError(fieldKey, message) {
  const field = document.querySelector(`#loginForm [data-login-field="${fieldKey}"]`);
  const err = document.getElementById(
    fieldKey === "username" ? "loginUsernameError" : "loginPasswordError"
  );
  if (!field || !err) return;
  if (!message) {
    field.classList.remove("is-invalid");
    err.hidden = true;
    err.textContent = "";
    return;
  }
  field.classList.add("is-invalid");
  err.hidden = false;
  err.textContent = message;
}

function setLoginFormError(message) {
  const err = document.getElementById("loginError");
  if (!err) return;
  if (!message) {
    err.hidden = true;
    err.textContent = "";
    return;
  }
  err.hidden = false;
  err.textContent = message;
}

async function tryInviteUnlock() {
  const cfg = authConfig();
  if (!cfg.enabled || !cfg.inviteTokenHash) return false;
  const params = new URLSearchParams(window.location.search);
  const invite = String(params.get("invite") || "").trim();
  if (!invite) return false;
  if (!(await secretMatches(invite, cfg.inviteTokenHash))) return false;

  await writeAuthSession({ username: "invite", isAdmin: false });
  params.delete("invite");
  const next = params.toString();
  const clean = `${window.location.pathname}${next ? `?${next}` : ""}${window.location.hash || ""}`;
  window.history.replaceState({}, "", clean);
  return true;
}

function syncLoginSessionHint() {
  const el = document.getElementById("loginSessionHint");
  if (!el) return;
  const days = authConfig().sessionDays || 15;
  el.textContent = `${days}-day session on this device.`;
}

function syncLoginAccountHint() {
  const input = document.getElementById("loginUsername");
  if (!input || input.value) return;
  const teamUser = authConfig().employeeUsername || "team";
  input.placeholder = teamUser;
}

function bindAuthUi() {
  syncLoginSessionHint();
  syncLoginAccountHint();
  const form = document.getElementById("loginForm");
  form?.addEventListener("submit", async e => {
    e.preventDefault();
    clearLoginErrors();
    const cfg = authConfig();
    const username = document.getElementById("loginUsername")?.value || "";
    const password = document.getElementById("loginPassword")?.value || "";

    const remaining = loginLockRemainingMs();
    if (remaining > 0) {
      const secs = Math.ceil(remaining / 1000);
      setLoginFormError(`Too many attempts. Try again in ${secs}s.`);
      return;
    }

    let hasError = false;
    if (!username.trim()) {
      setLoginFieldError("username", "Enter your username.");
      hasError = true;
    }
    if (!password.trim()) {
      setLoginFieldError("password", "Enter your password.");
      hasError = true;
    }
    if (hasError) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    try {
      const login = await resolveLogin(username, password, cfg);
      if (!login) {
        const next = registerLoginFailure(cfg);
        if (next.lockedUntil > Date.now()) {
          setLoginFormError(`Too many attempts. Try again in ${cfg.lockoutSeconds}s.`);
        } else {
          setLoginFormError("Incorrect username or password.");
        }
        document.querySelectorAll("#loginForm [data-login-field]").forEach(el => {
          el.classList.add("is-invalid");
        });
        return;
      }

      clearLoginAttempts();
      await writeAuthSession({
        username: login.username,
        isAdmin: login.isAdmin,
      });
      unlockApp();
      startAppOnce({ forceHome: true });
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  });

  document.getElementById("loginUsername")?.addEventListener("input", () => {
    setLoginFieldError("username", "");
    setLoginFormError("");
  });
  document.getElementById("loginPassword")?.addEventListener("input", () => {
    setLoginFieldError("password", "");
    setLoginFormError("");
  });

  document.getElementById("signOutBtn")?.addEventListener("click", () => {
    clearAuthSession();
    lockApp();
  });
}

async function bootstrap() {
  bindAuthUi();
  const cfg = authConfig();

  if (!cfg.enabled) {
    unlockApp();
    startAppOnce();
    return;
  }

  const viaInvite = await tryInviteUnlock();
  if (viaInvite) {
    unlockApp();
    startAppOnce({ forceHome: true });
    return;
  }
  if (await isAuthenticated()) {
    unlockApp();
    startAppOnce();
    return;
  }

  lockApp();
}

bootstrap().catch(() => {
  lockApp();
});
