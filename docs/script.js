// DCS AI Resource Center — client-side dynamic directory.
// Reads TOOLS / COMPARISONS / EVALUATIONS from data.js, no backend required.

const STATUS_GROUP = {
  Adopted: "mint", Production: "mint",
  Testing: "amber", Pilot: "amber",
  Researching: "blue", Planned: "blue",
  Archived: "coral", Deprecated: "coral", Rejected: "coral",
};

/** Lifecycle buckets for default “safe to use” filtering and (later) clickable stats. */
const STATUS_BUCKETS = {
  approved: ["Adopted", "Production"],
  testing: ["Testing", "Pilot"],
  research: ["Researching", "Planned"],
};

const STATUS_ORDER = [
  "Production", "Adopted", "Testing", "Pilot",
  "Researching", "Planned", "Archived", "Deprecated", "Rejected",
];

const COMPARE_MAX = 3;

/** Curated shortlist for new joiners — Production IDEs + everyday LLMs. */
const START_HERE_NAMES = ["Cursor", "Antigravity", "ChatGPT", "Claude", "Perplexity"];

const SUGGEST_ISSUE_REPO = "https://github.com/Daily-Code-Solutions/DCS-Resources/issues/new";

const state = {
  search: "",
  status: null,
  statusBucket: null, // default: show full directory
  starter: false,
  category: null,
  pricing: null,
  sort: "name",
  compareMode: false,
  compareIds: [],
};

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
}

function evaluationFor(tool) {
  if (typeof EVALUATIONS === "undefined") return null;
  return EVALUATIONS[tool.name] || null;
}

function renderStats() {
  const total = TOOLS.length;
  const adopted = TOOLS.filter(t => STATUS_BUCKETS.approved.includes(t.status)).length;
  const testing = TOOLS.filter(t => STATUS_BUCKETS.testing.includes(t.status)).length;
  const research = TOOLS.filter(t => STATUS_BUCKETS.research.includes(t.status)).length;

  const stats = [
    { label: "Tools tracked", value: total, cls: "", filter: "all" },
    { label: "In use", value: adopted, cls: "stat--mint", bucket: "approved" },
    { label: "Testing / pilot", value: testing, cls: "stat--amber", bucket: "testing" },
    { label: "Researching / planned", value: research, cls: "stat--blue", bucket: "research" },
  ];

  document.getElementById("stats").innerHTML = stats.map(s => {
    const scope = s.filter
      ? `data-filter="${s.filter}"`
      : `data-bucket="${s.bucket}"`;
    return `
      <button type="button" class="stat ${s.cls}" ${scope} title="Filter tools by this group">
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
    if (state.starter) {
      active = false;
    } else if (el.dataset.filter === "all") {
      active = !state.status && !state.statusBucket;
    } else if (el.dataset.bucket) {
      active = !state.status && el.dataset.bucket === state.statusBucket;
    }
    el.classList.toggle("is-active", active);
    el.setAttribute("aria-pressed", String(active));
  });
}

function countBy(key) {
  const values = [...new Set(TOOLS.map(t => t[key]).filter(Boolean))].sort();
  const counts = Object.fromEntries(values.map(v => [v, TOOLS.filter(t => t[key] === v).length]));
  return { values, counts };
}

function renderChips() {
  const statuses = [...new Set(TOOLS.map(t => t.status))]
    .sort((a, b) => {
      const ia = STATUS_ORDER.indexOf(a);
      const ib = STATUS_ORDER.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });
  const statusCounts = Object.fromEntries(statuses.map(s => [s, TOOLS.filter(t => t.status === s).length]));
  const approvedCount = TOOLS.filter(t => STATUS_BUCKETS.approved.includes(t.status)).length;
  const categories = countBy("category");
  const pricing = countBy("pricing");
  const moreOpen = Boolean(state.category || state.pricing);

  const statusChips = statuses.map(s => `
    <button class="chip" data-status="${s}" type="button">${s} (${statusCounts[s]})</button>
  `).join("");
  const categoryChips = categories.values.map(c => `
    <button class="chip" data-category="${escapeHtml(c)}" type="button">${escapeHtml(c)} (${categories.counts[c]})</button>
  `).join("");
  const pricingChips = pricing.values.map(c => `
    <button class="chip" data-pricing="${escapeHtml(c)}" type="button">${escapeHtml(c)} (${pricing.counts[c]})</button>
  `).join("");

  const starterCount = START_HERE_NAMES.filter(n => TOOLS.some(t => t.name === n)).length;

  document.getElementById("filterChips").innerHTML = `
    <div class="filter-group">
      <div class="filter-group__label">Status</div>
      <div class="chiprow">
        <button class="chip chip--starter" data-starter="true" type="button">Start here (${starterCount})</button>
        <button class="chip" data-filter="all" type="button">All (${TOOLS.length})</button>
        <button class="chip" data-bucket="approved" type="button">In use (${approvedCount})</button>
        ${statusChips}
      </div>
      <details class="status-guide">
        <summary class="status-guide__summary">What do these mean?</summary>
        <dl class="status-guide__list">
          <div class="status-guide__row">
            <dt><span class="status-guide__swatch status-guide__swatch--starter"></span>Start here</dt>
            <dd>Shortlist for new joiners</dd>
          </div>
          <div class="status-guide__row">
            <dt><span class="status-guide__swatch status-guide__swatch--mint"></span>Production</dt>
            <dd>Core daily tools · team default</dd>
          </div>
          <div class="status-guide__row">
            <dt><span class="status-guide__swatch status-guide__swatch--mint"></span>Adopted</dt>
            <dd>Approved for team use</dd>
          </div>
          <div class="status-guide__row">
            <dt><span class="status-guide__swatch status-guide__swatch--amber"></span>Testing / Pilot</dt>
            <dd>Being evaluated now</dd>
          </div>
          <div class="status-guide__row">
            <dt><span class="status-guide__swatch status-guide__swatch--blue"></span>Planned / Researching</dt>
            <dd>Not ready for day-to-day work</dd>
          </div>
        </dl>
      </details>
    </div>
    <details class="filter-more" id="filterMore"${moreOpen ? " open" : ""}>
      <summary class="filter-more__summary">
        More filters
        <span class="filter-more__hint">Category · Pricing</span>
      </summary>
      <div class="filter-more__body">
        <div class="filter-group">
          <div class="filter-group__label">Category</div>
          <div class="chiprow">${categoryChips}</div>
        </div>
        <div class="filter-group">
          <div class="filter-group__label">Pricing</div>
          <div class="chiprow">${pricingChips}</div>
        </div>
      </div>
    </details>
  `;
  syncChipUI();
}

function getFiltered() {
  const q = state.search.trim().toLowerCase();
  let list = TOOLS.filter(t => {
    if (state.starter) {
      if (!START_HERE_NAMES.includes(t.name)) return false;
    } else if (state.status) {
      if (t.status !== state.status) return false;
    } else if (state.statusBucket) {
      const allowed = STATUS_BUCKETS[state.statusBucket] || [];
      if (!allowed.includes(t.status)) return false;
    }
    if (state.category && t.category !== state.category) return false;
    if (state.pricing && t.pricing !== state.pricing) return false;
    if (q) {
      const haystack = [
        t.name, t.category, t.subcategory, t.pricing, t.status,
        t.description, t.notes, t.limitations, t.whenToUse, t.alternatives,
        t.costNote, t.securityTip, t.owner, t.department, t.priority,
        t.learningCurve, t.dataClassification,
        ...(t.platform || []), ...(t.useCases || []), ...(t.approvedModels || []),
      ].join(" ").toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  const PRIORITY_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3, Backlog: 4 };

  list.sort((a, b) => {
    if (state.starter && state.sort === "name") {
      const ia = START_HERE_NAMES.indexOf(a.name);
      const ib = START_HERE_NAMES.indexOf(b.name);
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

function hasScoredEval(evalData) {
  if (!evalData || evalData.score === "" || evalData.score == null) return false;
  return !Number.isNaN(parseFloat(evalData.score));
}

function hasUsefulEval(evalData) {
  if (!evalData) return false;
  return hasScoredEval(evalData) || Boolean(evalData.criteria) || Boolean(evalData.notes) || Boolean(evalData.date);
}

function filtersAreActive() {
  return Boolean(
    state.search.trim() ||
    state.starter ||
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

  count.textContent = `${list.length} of ${TOOLS.length} tool${TOOLS.length === 1 ? "" : "s"}`;
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
    const guide = t.whenToUse || "";
    return `
      <article class="card${selected ? " card--selected" : ""}" data-id="${escapeHtml(t.id)}" style="animation-delay:${Math.min(i * 30, 300)}ms" tabindex="0" role="button" aria-label="View details for ${escapeHtml(t.name)}">
        ${state.compareMode ? `
          <label class="card__compare" onclick="event.stopPropagation()">
            <input type="checkbox" data-compare-id="${escapeHtml(t.id)}" ${selected ? "checked" : ""} ${!selected && state.compareIds.length >= COMPARE_MAX ? "disabled" : ""}>
            <span>Compare</span>
          </label>
        ` : ""}
        <div class="card__top">
          <div class="card__identity">
            ${logoHtml(t)}
            <h3 class="card__name">${escapeHtml(t.name)}</h3>
          </div>
          <div class="card__badges">
            ${t.status === "Production" ? `<span class="card__default">Team default</span>` : ""}
            <span class="badge badge--${group}">${escapeHtml(t.status)}</span>
          </div>
        </div>
        <p class="card__desc">${escapeHtml(t.description)}</p>
        ${guide ? `<p class="card__guide">${escapeHtml(guide)}</p>` : ""}
        <div class="card__meta">
          ${t.lastReviewed ? `<span>Reviewed ${escapeHtml(t.lastReviewed)}</span>` : `<span>Not reviewed</span>`}
        </div>
        ${tagListHtml(t, { includePlatform: true })}
        ${t.url
          ? `<a class="card__cta" href="${escapeHtml(t.url)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">Visit tool</a>`
          : `<span class="card__cta card__cta--muted">View details</span>`}
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

function openModal(tool) {
  const group = STATUS_GROUP[tool.status] || "blue";
  const evalData = evaluationFor(tool);
  document.getElementById("modalBody").innerHTML = `
    <div class="modal__header">
      ${logoHtml(tool)}
      <div>
        <h2 class="modal__name" id="modalName">${escapeHtml(tool.name)}</h2>
        <div class="modal__meta">
          <span class="badge badge--${group}">${escapeHtml(tool.status)}</span>
          ${starsHtml(evalData)}
          ${tagListHtml(tool)}
        </div>
      </div>
    </div>
    <p class="modal__desc">${escapeHtml(tool.description)}</p>

    <div class="detail-grid">
      ${detailField("Owner", tool.owner || "Unassigned")}
      ${detailField("Department", tool.department)}
      ${detailField("Priority", tool.priority)}
      ${detailField("Learning curve", tool.learningCurve)}
      ${detailField("Data classification", tool.dataClassification)}
      ${detailField("Date added", tool.dateAdded)}
      ${detailField("Last reviewed", tool.lastReviewed || "Not reviewed")}
      ${detailField("Subcategory", tool.subcategory)}
      ${detailPills("Platforms", tool.platform)}
      ${detailPills("Use cases", tool.useCases)}
      ${detailPills("Approved models", tool.approvedModels)}
    </div>

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
      ${hasUsefulEval(evalData) ? `
        <div class="modal__notes modal__eval">
          <strong>Evaluation</strong>
          ${hasScoredEval(evalData) ? `<div class="modal__stars-row">${starsHtml(evalData)}</div>` : ""}
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
  document.getElementById("modalOverlay").hidden = false;
  document.body.style.overflow = "hidden";
  setToolQueryParam(tool);
}

function closeModal() {
  document.getElementById("modalOverlay").hidden = true;
  if (document.getElementById("compareOverlay").hidden) {
    document.body.style.overflow = "";
  }
  setToolQueryParam(null);
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

/** Persist filters + optional tool deep link for Slack/share URLs. */
function syncUrl({ tool } = {}) {
  const url = new URL(window.location.href);
  const params = url.searchParams;

  if (state.starter) params.set("starter", "1");
  else params.delete("starter");

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

  if (tool === null) params.delete("tool");
  else if (tool && tool.name) params.set("tool", tool.name);

  history.replaceState(null, "", url);
}

/** Restore filters from ?bucket=&status=&category=&pricing=&q=&sort=&starter= */
function applyFiltersFromUrl() {
  const params = new URLSearchParams(window.location.search);

  if (params.get("starter") === "1") {
    state.starter = true;
    state.status = null;
    state.statusBucket = null;
  } else {
    state.starter = false;
    const status = params.get("status");
    const bucket = params.get("bucket");
    if (status && STATUS_ORDER.includes(status)) {
      state.status = status;
      state.statusBucket = null;
    } else if (bucket && STATUS_BUCKETS[bucket]) {
      state.status = null;
      state.statusBucket = bucket;
    }
  }

  const category = params.get("category");
  if (category && TOOLS.some(t => t.category === category)) {
    state.category = category;
  }

  const pricing = params.get("pricing");
  if (pricing && TOOLS.some(t => t.pricing === pricing)) {
    state.pricing = pricing;
  }

  const q = params.get("q");
  if (q) {
    state.search = q;
    const input = document.getElementById("searchInput");
    if (input) input.value = q;
  }

  const sort = params.get("sort");
  const sortSelect = document.getElementById("sortSelect");
  if (sort && sortSelect && [...sortSelect.options].some(o => o.value === sort)) {
    state.sort = sort;
    sortSelect.value = sort;
  }
}

/** Open a tool from ?tool=Name or ?tool=AIT-001 (e.g. shared Slack links). */
function openToolFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const tool = findToolByQuery(params.get("tool"));
  if (!tool) return;
  openModal(tool);
}

function syncChipUI() {
  const allActive = !state.starter && !state.status && !state.statusBucket && !state.category && !state.pricing;
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
  state.status = null;
  state.statusBucket = null;
  state.category = null;
  state.pricing = null;
  document.getElementById("searchInput").value = "";
  rerender();
}

/** Hero “Browse tools”: scroll to the full directory without forcing Start here. */
function browseTools() {
  document.getElementById("find-tools")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function populateCategoryDropdown() {
  const select = document.getElementById("s_category");
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
  const btn = document.getElementById("compareToggle");
  btn.classList.toggle("is-active", on);
  btn.setAttribute("aria-pressed", String(on));
  if (!on) {
    state.compareIds = [];
  }
  rerender();
}

function syncCompareUI() {
  const bar = document.getElementById("compareBar");
  const openBtn = document.getElementById("compareOpen");
  const text = document.getElementById("compareBarText");
  const count = state.compareIds.length;

  if (state.compareMode) {
    bar.hidden = false;
    bar.removeAttribute("hidden");
    bar.classList.add("is-visible");
  } else {
    bar.hidden = true;
    bar.classList.remove("is-visible");
  }
  document.body.classList.toggle("has-compare-bar", state.compareMode);

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
    const btn = document.getElementById("compareToggle");
    btn.classList.add("is-active");
    btn.setAttribute("aria-pressed", "true");
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
    { label: "Platform", values: tools.map(t => (t.platform || []).join(", ") || "—") },
    { label: "Department", values: tools.map(t => t.department || "—") },
    { label: "Priority", values: tools.map(t => t.priority || "—") },
    { label: "Learning curve", values: tools.map(t => t.learningCurve || "—") },
    { label: "Data classification", values: tools.map(t => t.dataClassification || "—") },
    { label: "Owner", values: tools.map(t => t.owner || "Unassigned") },
    {
      label: "Rating",
      values: tools.map(t => {
        const ev = evaluationFor(t);
        return starsHtml(ev) || "—";
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
    <p class="compare-empty">No saved head-to-head rows yet for this set. Add them in <code>data/tool_comparison.csv</code>.</p>
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
  document.getElementById("compareOverlay").hidden = false;
  document.body.style.overflow = "hidden";
}

/** Close compare overlay only — keep selection and compare mode. */
function closeCompare() {
  document.getElementById("compareOverlay").hidden = true;
  if (document.getElementById("modalOverlay").hidden && document.getElementById("suggestOverlay").hidden) {
    document.body.style.overflow = "";
  }
}

function init() {
  applyFiltersFromUrl();
  renderStats();
  renderChips();
  renderCards();
  populateCategoryDropdown();
  populatePricingDropdown();
  populateDepartmentDropdown();
  syncCompareUI();
  syncUrl();
  openToolFromUrl();

  document.getElementById("stats").addEventListener("click", e => {
    const stat = e.target.closest(".stat");
    if (!stat) return;

    if (stat.dataset.filter === "all") {
      state.starter = false;
      state.status = null;
      state.statusBucket = null;
    } else if (stat.dataset.bucket) {
      const bucket = stat.dataset.bucket;
      state.starter = false;
      state.status = null;
      state.statusBucket = state.statusBucket === bucket ? null : bucket;
    }
    rerender();
    document.getElementById("find-tools")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
        state.status = null;
        state.statusBucket = null;
      }
      rerender();
      return;
    }

    if (chip.dataset.filter === "all") {
      state.starter = false;
      state.status = null;
      state.statusBucket = null;
      state.category = null;
      state.pricing = null;
      rerender();
      return;
    }

    if (chip.dataset.bucket) {
      const bucket = chip.dataset.bucket;
      state.starter = false;
      state.status = null;
      state.statusBucket = state.statusBucket === bucket ? null : bucket;
      rerender();
      return;
    }

    if (chip.dataset.status) {
      state.starter = false;
      state.statusBucket = null;
      state.status = state.status === chip.dataset.status ? null : chip.dataset.status;
      rerender();
      return;
    }

    if (chip.dataset.category) {
      state.category = state.category === chip.dataset.category ? null : chip.dataset.category;
      rerender();
      return;
    }

    if (chip.dataset.pricing) {
      state.pricing = state.pricing === chip.dataset.pricing ? null : chip.dataset.pricing;
      rerender();
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
    if (e.target.closest(".card__compare") || e.target.closest(".card__cta")) return;
    const card = e.target.closest(".card");
    if (!card) return;
    if (state.compareMode) {
      toggleCompareId(card.dataset.id);
      return;
    }
    const tool = TOOLS.find(t => t.id === card.dataset.id);
    if (tool) openModal(tool);
  });

  document.getElementById("toolGrid").addEventListener("keydown", e => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest(".card");
    if (!card) return;
    e.preventDefault();
    if (state.compareMode) {
      toggleCompareId(card.dataset.id);
      return;
    }
    const tool = TOOLS.find(t => t.id === card.dataset.id);
    if (tool) openModal(tool);
  });

  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalOverlay").addEventListener("click", e => {
    if (e.target.id === "modalOverlay") {
      closeModal();
      return;
    }
    const compareBtn = e.target.closest("#modalCompareBtn");
    if (compareBtn && !compareBtn.disabled) {
      toggleCompareFromModal(compareBtn.dataset.id);
    }
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeModal();
      closeSuggest();
      closeCompare();
    }
  });

  document.getElementById("browseToolsHero").addEventListener("click", browseTools);
  document.getElementById("openSuggestHero").addEventListener("click", openSuggest);
  document.getElementById("suggestClose").addEventListener("click", closeSuggest);
  document.getElementById("suggestOverlay").addEventListener("click", e => {
    if (e.target.id === "suggestOverlay") closeSuggest();
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
      status.textContent = "Draft copied — paste into Slack, email, or a GitHub issue.";
    } catch {
      status.hidden = false;
      status.textContent = "Couldn’t copy automatically — select the text from the GitHub issue draft instead.";
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

  const lines = [
    `## Tool suggestion: ${name}`,
    "",
    `- **Category:** ${category || "—"}`,
    `- **Pricing:** ${pricing || "—"}`,
    `- **Urgency:** ${urgency || "—"}`,
    `- **Website:** ${url || "—"}`,
    `- **Suggested by:** ${submitter || "—"}`,
    `- **Department:** ${dept || "—"}`,
    "",
    "### What it does",
    desc || "—",
    "",
    "### Why evaluate",
    reason || "—",
    "",
    "_Submitted via AI Resource Center suggest form._",
  ];
  return lines.join("\n");
}

function showSuggestDraft() {
  const name = suggestValue("s_name");
  const body = buildSuggestDraft();
  window.__suggestDraftText = body;

  const issueUrl = new URL(SUGGEST_ISSUE_REPO);
  issueUrl.searchParams.set("title", `Tool suggestion: ${name}`);
  issueUrl.searchParams.set("body", body);

  const link = document.getElementById("suggestIssueLink");
  link.href = issueUrl.toString();

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
    el.textContent = "Don’t paste confidential client data, secrets, or production details into suggestions. Describe the need without sensitive values — you can still submit.";
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

  if (urlRaw) {
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

  if (submitter) {
    if (submitter.length < SUGGEST_LIMITS.submitter.min || submitter.length > SUGGEST_LIMITS.submitter.max) {
      errors.submitter = `Use ${SUGGEST_LIMITS.submitter.min}–${SUGGEST_LIMITS.submitter.max} characters.`;
    } else if (!PERSON_PATTERN.test(submitter)) {
      errors.submitter = "Use letters, spaces, apostrophes, or hyphens only.";
    }
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
      closeSuggest();
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
  resetSuggestForm();
  document.getElementById("suggestFormWrap").hidden = false;
  document.getElementById("suggestSuccess").hidden = true;
  document.getElementById("suggestOverlay").hidden = false;
  document.body.style.overflow = "hidden";
  document.getElementById("s_name").focus();
}

function closeSuggest() {
  document.getElementById("suggestOverlay").hidden = true;
  if (document.getElementById("modalOverlay").hidden && document.getElementById("compareOverlay").hidden) {
    document.body.style.overflow = "";
  }
}

init();
