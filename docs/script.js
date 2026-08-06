// DCS AI Resource Center — client-side dynamic directory.
// Reads TOOLS / COMPARISONS / EVALUATIONS from data.js, no backend required.

const STATUS_GROUP = {
  Adopted: "mint", Production: "mint",
  Testing: "amber", Pilot: "amber",
  Researching: "blue", Planned: "blue",
  Archived: "coral", Deprecated: "coral", Rejected: "coral",
};

/** Lifecycle buckets for default “safe to use” filtering and clickable stats. */
const STATUS_BUCKETS = {
  trusted: ["Adopted", "Production"],
  trying: ["Testing", "Pilot"],
  exploring: ["Researching", "Planned"],
  paused: ["Deprecated", "Archived", "Rejected"],
};

/** Older ?bucket= values still resolve after the rename. */
const LEGACY_STATUS_BUCKETS = {
  approved: "trusted",
  testing: "trying",
  research: "exploring",
};

const STATUS_ORDER = [
  "Production", "Adopted", "Testing", "Pilot",
  "Researching", "Planned", "Archived", "Deprecated", "Rejected",
];

const COMPARE_MAX = 3;

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

const VIEWS = ["home", "directory", "guides", "prompts", "playbooks", "contribute"];

const state = {
  view: "home",
  search: "",
  status: null,
  statusBucket: null, // default: show full directory
  starter: false,
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
};

const jobsData = () => (typeof CHOOSER_JOBS !== "undefined" ? CHOOSER_JOBS : []);
const guidesData = () => (typeof DECISION_GUIDES !== "undefined" ? DECISION_GUIDES : []);
const promptsData = () => (typeof PROMPTS !== "undefined" ? PROMPTS : []);
const useCasesData = () => (typeof USE_CASES !== "undefined" ? USE_CASES : []);
const learningData = () => (typeof LEARNING !== "undefined" ? LEARNING : []);
const comparisonsData = () => (typeof COMPARISONS !== "undefined" ? COMPARISONS : []);

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
  const trusted = TOOLS.filter(t => STATUS_BUCKETS.trusted.includes(t.status)).length;
  const trying = TOOLS.filter(t => STATUS_BUCKETS.trying.includes(t.status)).length;
  const exploring = TOOLS.filter(t => STATUS_BUCKETS.exploring.includes(t.status)).length;

  const stats = [
    { label: "Tools tracked", value: total, cls: "", filter: "all" },
    { label: "Trusted", value: trusted, cls: "stat--mint", bucket: "trusted" },
    { label: "Trying", value: trying, cls: "stat--amber", bucket: "trying" },
    { label: "Exploring", value: exploring, cls: "stat--blue", bucket: "exploring" },
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
  const trustedCount = TOOLS.filter(t => STATUS_BUCKETS.trusted.includes(t.status)).length;
  const tryingCount = TOOLS.filter(t => STATUS_BUCKETS.trying.includes(t.status)).length;
  const exploringCount = TOOLS.filter(t => STATUS_BUCKETS.exploring.includes(t.status)).length;
  const pausedCount = TOOLS.filter(t => STATUS_BUCKETS.paused.includes(t.status)).length;
  const categories = countBy("category");
  const pricing = countBy("pricing");
  const moreOpen = Boolean(state.category || state.pricing);
  const statusOpen = Boolean(state.status);

  const statusChips = statuses.map(s => `
    <button class="chip" data-status="${s}" type="button">${s} (${statusCounts[s]})</button>
  `).join("");
  const categoryChips = categories.values.map(c => `
    <button class="chip" data-category="${escapeHtml(c)}" type="button">${escapeHtml(c)} (${categories.counts[c]})</button>
  `).join("");
  const pricingChips = pricing.values.map(c => `
    <button class="chip" data-pricing="${escapeHtml(c)}" type="button">${escapeHtml(c)} (${pricing.counts[c]})</button>
  `).join("");

  const starterCount = startHereNames().filter(n => TOOLS.some(t => t.name === n)).length;

  document.getElementById("filterChips").innerHTML = `
    <div class="filter-group">
      <div class="filter-group__label">Status</div>
      <div class="chiprow">
        <button class="chip chip--starter" data-starter="true" type="button">Start here (${starterCount})</button>
        <button class="chip" data-filter="all" type="button">All (${TOOLS.length})</button>
        <button class="chip" data-bucket="trusted" type="button">Trusted (${trustedCount})</button>
        <button class="chip" data-bucket="trying" type="button">Trying (${tryingCount})</button>
        <button class="chip" data-bucket="exploring" type="button">Exploring (${exploringCount})</button>
        <button class="chip" data-bucket="paused" type="button">Not for new work (${pausedCount})</button>
      </div>
      <details class="status-guide">
        <summary class="status-guide__summary">What do these mean?</summary>
        <dl class="status-guide__list">
          <div class="status-guide__row">
            <dt><span class="status-guide__swatch status-guide__swatch--starter"></span>Start here</dt>
            <dd>Shortlist for new joiners</dd>
          </div>
          <div class="status-guide__row">
            <dt><span class="status-guide__swatch status-guide__swatch--mint"></span>Trusted</dt>
            <dd>Adopted or Production — safe for team work</dd>
          </div>
          <div class="status-guide__row">
            <dt><span class="status-guide__swatch status-guide__swatch--amber"></span>Trying</dt>
            <dd>Testing or Pilot — evaluate carefully</dd>
          </div>
          <div class="status-guide__row">
            <dt><span class="status-guide__swatch status-guide__swatch--blue"></span>Exploring</dt>
            <dd>Planned or Researching — not day-to-day yet</dd>
          </div>
          <div class="status-guide__row">
            <dt><span class="status-guide__swatch status-guide__swatch--coral"></span>Not for new work</dt>
            <dd>Deprecated, Archived, or Rejected</dd>
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
          <div class="status-guide__row">
            <dt><span class="status-guide__swatch status-guide__swatch--coral"></span>Deprecated</dt>
            <dd>Phasing out — don’t start new work</dd>
          </div>
          <div class="status-guide__row">
            <dt><span class="status-guide__swatch status-guide__swatch--coral"></span>Archived</dt>
            <dd>No longer used — kept for history</dd>
          </div>
          <div class="status-guide__row">
            <dt><span class="status-guide__swatch status-guide__swatch--coral"></span>Rejected</dt>
            <dd>Evaluated and declined</dd>
          </div>
        </dl>
      </details>
      <details class="filter-more" id="statusExact"${statusOpen ? " open" : ""}>
        <summary class="filter-more__summary">
          Exact status
          <span class="filter-more__hint">Production · Pilot · Archived…</span>
        </summary>
        <div class="filter-more__body">
          <div class="chiprow">${statusChips}</div>
        </div>
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
      if (!startHereNames().includes(t.name)) return false;
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

/** Stars when scored; otherwise an explicit “not scored” label so blank ≠ bad. */
function ratingHtml(evalData) {
  const stars = starsHtml(evalData);
  if (stars) return stars;
  return `<span class="rating-pending">Not scored yet</span>`;
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
      <article class="card${selected ? " card--selected" : ""}" data-id="${escapeHtml(t.id)}" style="animation-delay:${Math.min(i * 30, 300)}ms">
        ${state.compareMode ? `
          <label class="card__compare">
            <input type="checkbox" data-compare-id="${escapeHtml(t.id)}" ${selected ? "checked" : ""} ${!selected && state.compareIds.length >= COMPARE_MAX ? "disabled" : ""}>
            <span>Select</span>
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
        <div class="card__actions">
          <button type="button" class="card__cta" data-open-details="${escapeHtml(t.id)}">View details</button>
          ${t.url
            ? `<a class="card__cta-secondary" href="${escapeHtml(t.url)}" target="_blank" rel="noopener">Open site</a>`
            : ""}
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
          ${ratingHtml(evalData)}
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
          <div class="modal__stars-row">${ratingHtml(evalData)}</div>
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
        ${isCompared(tool.id) ? "Remove from side-by-side" : state.compareIds.length >= COMPARE_MAX ? "Side-by-side list is full" : "Add to side-by-side"}
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

/** Persist view + filters + optional tool deep link for Slack/share URLs. */
function syncUrl({ tool } = {}) {
  const url = new URL(window.location.href);
  const params = url.searchParams;

  if (state.view && state.view !== "home") params.set("view", state.view);
  else params.delete("view");

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

  if (tool === null) params.delete("tool");
  else if (tool && tool.name) params.set("tool", tool.name);

  history.replaceState(null, "", url);
}

/** Restore view + filters from URL params. */
function applyFiltersFromUrl() {
  const params = new URLSearchParams(window.location.search);

  const view = params.get("view");
  if (view && VIEWS.includes(view)) state.view = view;

  if (params.get("starter") === "1") {
    state.starter = true;
    state.status = null;
    state.statusBucket = null;
    if (!view) state.view = "directory";
  } else {
    state.starter = false;
    const status = params.get("status");
    const bucket = params.get("bucket");
    if (status && STATUS_ORDER.includes(status)) {
      state.status = status;
      state.statusBucket = null;
      if (!view) state.view = "directory";
    } else if (bucket) {
      const resolved = STATUS_BUCKETS[bucket]
        ? bucket
        : LEGACY_STATUS_BUCKETS[bucket];
      if (resolved && STATUS_BUCKETS[resolved]) {
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
    if (!view) state.view = "contribute";
  }

  if (params.get("compare") === "1" || params.get("tool")) {
    if (!view) state.view = "directory";
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
  const input = document.getElementById("searchInput");
  if (input) input.value = "";
  rerender();
}

/** Navigate to directory (optionally Start here / compare mode). */
function browseTools({ starter = false, compare = false } = {}) {
  if (starter) {
    state.starter = true;
    state.status = null;
    state.statusBucket = null;
  }
  if (compare) {
    state.compareMode = true;
  }
  showView("directory");
  requestAnimationFrame(() => {
    document.getElementById("find-tools")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function showView(view) {
  if (!VIEWS.includes(view)) view = "home";
  state.view = view;

  document.querySelectorAll("[data-view-panel]").forEach(panel => {
    panel.hidden = panel.dataset.viewPanel !== view;
  });

  document.querySelectorAll(".app-nav__link").forEach(btn => {
    const active = btn.dataset.view === view;
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
  else if (state.view === "directory") {
    renderStats();
    renderChips();
    renderCards();
    syncCompareUI();
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
    : TOOLS.filter(t => STATUS_BUCKETS.trusted.includes(t.status));
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
}

function guideTone(category) {
  const key = String(category || "").toLowerCase();
  if (key.includes("assistant") || key.includes("llm") || key.includes("chat")) return "assistants";
  if (key.includes("coding") || key.includes("code") || key.includes("dev")) return "coding";
  if (key.includes("research") || key.includes("knowledge")) return "research";
  return "default";
}

function renderGuides() {
  const list = document.getElementById("guidesList");
  const comps = document.getElementById("comparisonsList");
  if (!list) return;

  list.innerHTML = guidesData().map(guide => {
    const tone = guideTone(guide.category);
    return `
    <article class="guide-card guide-tone--${tone}">
      <div class="guide-card__head">
        <span class="guide-card__cat">${escapeHtml(guide.category)}</span>
        <h3 class="guide-card__title">${escapeHtml(guide.title)}</h3>
        <p class="guide-card__summary">${escapeHtml(guide.summary)}</p>
      </div>
      <div class="guide-tips">
        ${guide.tips.map(tip => {
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
        }).join("")}
      </div>
    </article>
  `;
  }).join("") || `<p class="empty">No decision guides yet.</p>`;

  comps.innerHTML = comparisonsData().map(c => `
    <article class="compare-note compare-note--page compare-note--slate">
      <div class="compare-note__kind">Head-to-head</div>
      <strong class="compare-note__feature">${escapeHtml(c.feature)}</strong>
      <p class="compare-note__matchup">${escapeHtml(c.tools.join(" vs "))}</p>
      <p class="compare-note__winner">Winner: <em>${escapeHtml(c.winner || "—")}</em></p>
      ${c.notes ? `<p class="compare-note__body">${escapeHtml(c.notes)}</p>` : ""}
      <div class="compare-note__actions">
        ${c.tools.map(name => {
          const t = findToolByName(name);
          const isWinner = c.winner && name === c.winner;
          const chipClass = `chip${isWinner ? " chip--winner" : ""}`;
          return t
            ? `<button type="button" class="${chipClass}" data-open-tool="${escapeHtml(t.id)}">${escapeHtml(name)}${isWinner ? " ✓" : ""}</button>`
            : `<span class="${chipClass}">${escapeHtml(name)}${isWinner ? " ✓" : ""}</span>`;
        }).join("")}
      </div>
    </article>
  `).join("") || `<p class="empty">No comparisons yet.</p>`;
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

function playbookTone(role) {
  const key = String(role || "Everyone").toLowerCase();
  if (key.includes("engineer") || key.includes("develop")) return "engineering";
  if (key.includes("data")) return "data";
  if (key.includes("operation") || key.includes("support")) return "operations";
  if (key.includes("manage")) return "management";
  if (key.includes("every")) return "everyone";
  return "default";
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

function renderContribute() {
  syncContributeTabs();
  populateWinToolDropdown();
}

function syncContributeTabs() {
  const suggestPanel = document.getElementById("contribSuggestPanel");
  const winPanel = document.getElementById("contribWinPanel");
  const tabSuggest = document.getElementById("tabSuggest");
  const tabWin = document.getElementById("tabWin");
  if (!suggestPanel || !winPanel) return;

  const isWin = state.contribTab === "win";
  suggestPanel.hidden = isWin;
  winPanel.hidden = !isWin;
  tabSuggest?.classList.toggle("is-active", !isWin);
  tabWin?.classList.toggle("is-active", isWin);
  tabSuggest?.setAttribute("aria-selected", String(!isWin));
  tabWin?.setAttribute("aria-selected", String(isWin));
}

function populateWinToolDropdown() {
  const select = document.getElementById("w_tool");
  if (!select || select.dataset.ready === "1") return;
  const opts = TOOLS
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
  const impact = (document.getElementById("w_impact").value || "").trim();
  let ok = true;

  if (!title || title.length < 4) {
    setWinFieldError("w_title", "Add a short title (at least 4 characters).");
    ok = false;
  }
  if (!tool) {
    setWinFieldError("w_tool", "Pick the tool you used.");
    ok = false;
  }
  if (!impact || impact.length < 12) {
    setWinFieldError("w_impact", "Describe the impact (at least 12 characters).");
    ok = false;
  }
  if (!ok && formErr) {
    formErr.hidden = false;
    formErr.textContent = "Please fix the highlighted fields before submitting.";
  }
  return ok;
}

function buildWinDraft() {
  const title = (document.getElementById("w_title").value || "").trim();
  const tool = (document.getElementById("w_tool").value || "").trim();
  const name = (document.getElementById("w_name").value || "").trim();
  const role = (document.getElementById("w_role").value || "").trim();
  const impact = (document.getElementById("w_impact").value || "").trim();
  const how = (document.getElementById("w_how").value || "").trim();
  return [
    `## Team win: ${title}`,
    "",
    `- **Tool:** ${tool}`,
    `- **Shared by:** ${name || "—"}`,
    `- **Role:** ${role || "—"}`,
    "",
    "### Impact",
    impact,
    "",
    "### How we used it",
    how || "—",
    "",
    "_Submitted via AI Resource Center share-a-win form._",
  ].join("\n");
}

function showWinDraft() {
  const title = (document.getElementById("w_title").value || "").trim();
  const body = buildWinDraft();
  window.__winDraftText = body;
  const issueUrl = new URL(SUGGEST_ISSUE_REPO);
  issueUrl.searchParams.set("title", `Team win: ${title}`);
  issueUrl.searchParams.set("body", body);
  document.getElementById("winIssueLink").href = issueUrl.toString();
  document.getElementById("winCopyStatus").hidden = true;
  document.getElementById("winForm").hidden = true;
  document.getElementById("winSuccess").hidden = false;
}

function resetWinForm() {
  document.getElementById("winForm").reset();
  document.getElementById("winForm").hidden = false;
  document.getElementById("winSuccess").hidden = true;
  ["w_title", "w_tool", "w_impact"].forEach(k => setWinFieldError(k, ""));
  updateWinCounts();
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
  const tool = TOOLS.find(t => t.id === idOrName) || findToolByName(idOrName);
  if (tool) openModal(tool);
}

function bindAppNavigation() {
  document.querySelector(".app-nav")?.addEventListener("click", e => {
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
      if (go.dataset.compare === "1") {
        browseTools({ compare: true });
        return;
      }
      if (go.dataset.tab === "win") {
        state.contribTab = "win";
      }
      showView(view);
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

  document.getElementById("winForm")?.addEventListener("submit", e => {
    e.preventDefault();
    if (!validateWinForm()) return;
    showWinDraft();
  });

  ["w_impact", "w_how"].forEach(id => {
    document.getElementById(id)?.addEventListener("input", updateWinCounts);
  });

  document.getElementById("winCopyDraft")?.addEventListener("click", () => {
    copyText(window.__winDraftText || "", document.getElementById("winCopyStatus"));
  });

  document.getElementById("winAnother")?.addEventListener("click", resetWinForm);
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
  const btn = document.getElementById("compareToggle");
  if (btn) {
    btn.classList.toggle("is-active", on);
    btn.setAttribute("aria-pressed", String(on));
  }
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
  const count = state.compareIds.length;
  const onDirectory = state.view === "directory";
  const selecting = state.compareMode && onDirectory;

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

  if (count === 0) text.textContent = "Select 2–3 tools for side-by-side";
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
        return ratingHtml(ev);
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
  document.getElementById("compareOverlay").hidden = false;
  document.body.style.overflow = "hidden";
}

/** Close side-by-side overlay and exit selection mode (hides bottom bar). */
function closeCompare() {
  const overlay = document.getElementById("compareOverlay");
  const wasOpen = overlay && !overlay.hidden;
  if (overlay) overlay.hidden = true;
  if (document.getElementById("modalOverlay").hidden) {
    document.body.style.overflow = "";
  }
  if (wasOpen && state.compareMode) {
    setCompareMode(false);
  }
}

function init() {
  applyFiltersFromUrl();
  populateCategoryDropdown();
  populatePricingDropdown();
  populateDepartmentDropdown();
  bindAppNavigation();
  showView(state.view);
  openToolFromUrl();

  const params = new URLSearchParams(window.location.search);
  if (params.get("compare") === "1") {
    setCompareMode(true);
  }

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
    const detailsBtn = e.target.closest("[data-open-details]");
    if (detailsBtn) {
      const tool = TOOLS.find(t => t.id === detailsBtn.dataset.openDetails);
      if (tool) openModal(tool);
    }
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
    if (e.key !== "Escape") return;
    if (!document.getElementById("compareOverlay").hidden) {
      closeCompare();
      return;
    }
    closeModal();
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
  state.contribTab = "suggest";
  showView("contribute");
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

init();
