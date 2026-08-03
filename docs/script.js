// DCS AI Resource Center — client-side dynamic directory.
// Reads TOOLS / COMPARISONS / EVALUATIONS from data.js, no backend required.

const STATUS_GROUP = {
  Adopted: "mint", Production: "mint",
  Testing: "amber", Pilot: "amber",
  Researching: "blue", Planned: "blue",
  Archived: "coral", Deprecated: "coral", Rejected: "coral",
};

const COMPARE_MAX = 3;

const state = {
  search: "",
  status: null,
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
  const adopted = TOOLS.filter(t => ["Adopted", "Production"].includes(t.status)).length;
  const testing = TOOLS.filter(t => ["Testing", "Pilot"].includes(t.status)).length;
  const research = TOOLS.filter(t => ["Researching", "Planned"].includes(t.status)).length;

  const stats = [
    { label: "tools tracked", value: total, cls: "" },
    { label: "adopted / production", value: adopted, cls: "stat--mint" },
    { label: "testing / pilot", value: testing, cls: "stat--amber" },
    { label: "researching / planned", value: research, cls: "stat--blue" },
  ];

  document.getElementById("stats").innerHTML = stats.map(s => `
    <div class="stat ${s.cls}">
      <span class="stat__value">${s.value}</span>
      <span class="stat__label">${s.label}</span>
    </div>
  `).join("");
}

function countBy(key) {
  const values = [...new Set(TOOLS.map(t => t[key]).filter(Boolean))].sort();
  const counts = Object.fromEntries(values.map(v => [v, TOOLS.filter(t => t[key] === v).length]));
  return { values, counts };
}

function renderChips() {
  const statuses = [...new Set(TOOLS.map(t => t.status))];
  const statusCounts = Object.fromEntries(statuses.map(s => [s, TOOLS.filter(t => t.status === s).length]));
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

  document.getElementById("filterChips").innerHTML = `
    <div class="filter-group">
      <div class="filter-group__label">Status</div>
      <div class="chiprow">
        <button class="chip" data-filter="all" type="button">All (${TOOLS.length})</button>
        ${statusChips}
      </div>
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
    if (state.status && t.status !== state.status) return false;
    if (state.category && t.category !== state.category) return false;
    if (state.pricing && t.pricing !== state.pricing) return false;
    if (q) {
      const haystack = [
        t.name, t.category, t.subcategory, t.pricing, t.status,
        t.description, t.notes, t.owner, t.department, t.priority,
        t.learningCurve, t.dataClassification,
        ...(t.platform || []), ...(t.useCases || []),
      ].join(" ").toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  list.sort((a, b) => {
    if (state.sort === "status") return a.status.localeCompare(b.status) || a.name.localeCompare(b.name);
    if (state.sort === "category") return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
    if (state.sort === "pricing") return (a.pricing || "").localeCompare(b.pricing || "") || a.name.localeCompare(b.name);
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
  const filtersActive = state.search || state.status || state.category || state.pricing;
  clearBtn.hidden = !filtersActive;

  if (list.length === 0) {
    grid.innerHTML = "";
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  grid.innerHTML = list.map((t, i) => {
    const group = STATUS_GROUP[t.status] || "blue";
    const selected = isCompared(t.id);
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
          <span class="badge badge--${group}">${escapeHtml(t.status)}</span>
        </div>
        <p class="card__desc">${escapeHtml(t.description)}</p>
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
    </div>

    <div class="detail-panels">
      ${tool.notes ? `<div class="modal__notes"><strong>Team notes</strong>${escapeHtml(tool.notes)}</div>` : ""}
      ${evalData ? `
        <div class="modal__notes modal__eval">
          <strong>Evaluation</strong>
          <div class="modal__stars-row">${starsHtml(evalData)}</div>
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
    ${tool.url ? `<a class="modal__cta" href="${escapeHtml(tool.url)}" target="_blank" rel="noopener">Open ${escapeHtml(tool.name)}</a>` : ""}
  `;
  document.getElementById("modalOverlay").hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modalOverlay").hidden = true;
  if (document.getElementById("compareOverlay").hidden) {
    document.body.style.overflow = "";
  }
}

function syncChipUI() {
  const allActive = !state.status && !state.category && !state.pricing;
  document.querySelectorAll("#filterChips .chip").forEach(el => {
    if (el.dataset.filter === "all") {
      el.classList.toggle("active", allActive);
      return;
    }
    if (el.dataset.status) {
      el.classList.toggle("active", el.dataset.status === state.status);
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
}

function rerender() {
  syncChipUI();
  renderCards();
  syncCompareUI();
}

function clearFilters() {
  state.search = "";
  state.status = null;
  state.category = null;
  state.pricing = null;
  document.getElementById("searchInput").value = "";
  rerender();
}

function populateCategoryDropdown() {
  const select = document.getElementById("s_category");
  const options = (typeof CATEGORIES !== "undefined" ? CATEGORIES : [])
    .map(c => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`)
    .join("");
  select.insertAdjacentHTML("beforeend", options);
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

  bar.hidden = !state.compareMode;
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
    { label: "Data class", values: tools.map(t => t.dataClassification || "—") },
    { label: "Owner", values: tools.map(t => t.owner || "Unassigned") },
    {
      label: "Rating",
      values: tools.map(t => {
        const ev = evaluationFor(t);
        return ev ? starsHtml(ev) : "—";
      }),
      html: true,
    },
    { label: "Use cases", values: tools.map(t => (t.useCases || []).join(", ") || "—") },
    { label: "Description", values: tools.map(t => t.description || "—") },
    { label: "Notes", values: tools.map(t => t.notes || "—") },
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
              ? `<td><a href="${escapeHtml(t.url)}" target="_blank" rel="noopener">Open ↗</a></td>`
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

function closeCompare() {
  document.getElementById("compareOverlay").hidden = true;
  if (document.getElementById("modalOverlay").hidden && document.getElementById("suggestOverlay").hidden) {
    document.body.style.overflow = "";
  }
}

function init() {
  renderStats();
  renderChips();
  renderCards();
  populateCategoryDropdown();
  syncCompareUI();

  document.getElementById("searchInput").addEventListener("input", e => {
    state.search = e.target.value;
    renderCards();
  });

  document.getElementById("sortSelect").addEventListener("change", e => {
    state.sort = e.target.value;
    renderCards();
  });

  document.getElementById("filterChips").addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (!chip) return;

    if (chip.dataset.filter === "all") {
      state.status = null;
      state.category = null;
      state.pricing = null;
      rerender();
      return;
    }

    if (chip.dataset.status) {
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
    if (e.target.id === "modalOverlay") closeModal();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      closeModal();
      closeSuggest();
      closeCompare();
    }
  });

  document.getElementById("openSuggestHero").addEventListener("click", openSuggest);
  document.getElementById("suggestClose").addEventListener("click", closeSuggest);
  document.getElementById("suggestOverlay").addEventListener("click", e => {
    if (e.target.id === "suggestOverlay") closeSuggest();
  });

  document.getElementById("suggestForm").addEventListener("submit", e => {
    e.preventDefault();
    document.getElementById("suggestFormWrap").hidden = true;
    document.getElementById("suggestSuccess").hidden = false;
  });

  document.getElementById("suggestAnother").addEventListener("click", () => {
    document.getElementById("suggestForm").reset();
    document.getElementById("suggestSuccess").hidden = true;
    document.getElementById("suggestFormWrap").hidden = false;
  });
}

function openSuggest() {
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
