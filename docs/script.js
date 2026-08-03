// DCS AI Resource Center — client-side dynamic directory.
// Reads TOOLS from data.js, no backend required.

const STATUS_GROUP = {
  Adopted: "mint", Production: "mint",
  Testing: "amber", Pilot: "amber",
  Researching: "blue", Planned: "blue",
  Archived: "coral", Deprecated: "coral", Rejected: "coral",
};

const state = {
  search: "",
  status: null,
  category: null,
  sort: "name",
};

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str || "";
  return div.innerHTML;
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

function renderChips() {
  const statuses = [...new Set(TOOLS.map(t => t.status))];
  const categories = [...new Set(TOOLS.map(t => t.category))].sort();

  document.getElementById("statusChips").innerHTML = statuses.map(s => `
    <button class="chip" data-status="${s}" type="button">${s}</button>
  `).join("");

  document.getElementById("categoryChips").innerHTML = categories.map(c => `
    <button class="chip" data-category="${escapeHtml(c)}" type="button">${escapeHtml(c)}</button>
  `).join("");
}

function getFiltered() {
  const q = state.search.trim().toLowerCase();
  let list = TOOLS.filter(t => {
    if (state.status && t.status !== state.status) return false;
    if (state.category && t.category !== state.category) return false;
    if (q) {
      const haystack = `${t.name} ${t.category} ${t.status} ${t.description} ${t.notes}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });

  list.sort((a, b) => {
    if (state.sort === "status") return a.status.localeCompare(b.status) || a.name.localeCompare(b.name);
    if (state.sort === "category") return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
    return a.name.localeCompare(b.name);
  });

  return list;
}

function renderCards() {
  const list = getFiltered();
  const grid = document.getElementById("toolGrid");
  const empty = document.getElementById("emptyState");
  const count = document.getElementById("resultCount");
  const clearBtn = document.getElementById("clearFilters");

  count.textContent = `${list.length} of ${TOOLS.length} tool${TOOLS.length === 1 ? "" : "s"}`;
  const filtersActive = state.search || state.status || state.category;
  clearBtn.hidden = !filtersActive;

  if (list.length === 0) {
    grid.innerHTML = "";
    empty.hidden = false;
    return;
  }
  empty.hidden = true;

  grid.innerHTML = list.map((t, i) => {
    const group = STATUS_GROUP[t.status] || "blue";
    return `
      <article class="card card--${group}" data-id="${escapeHtml(t.id)}" style="animation-delay:${Math.min(i * 30, 300)}ms" tabindex="0" role="button" aria-label="View details for ${escapeHtml(t.name)}">
        <div class="card__top">
          <div>
            <div class="card__name">${escapeHtml(t.name)}</div>
            <div class="card__id">${escapeHtml(t.id)}</div>
          </div>
          <span class="badge badge--${group}">${escapeHtml(t.status)}</span>
        </div>
        <div class="card__category">${escapeHtml(t.category)}</div>
        <p class="card__desc">${escapeHtml(t.description)}</p>
        ${t.notes ? `<p class="card__notes">${escapeHtml(t.notes)}</p>` : ""}
        ${t.url ? `<a class="card__link" href="${escapeHtml(t.url)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">visit ↗</a>` : ""}
      </article>
    `;
  }).join("");
}

function openModal(tool) {
  const group = STATUS_GROUP[tool.status] || "blue";
  document.getElementById("modalBody").innerHTML = `
    <div class="modal__id">${escapeHtml(tool.id)}</div>
    <h2 class="modal__name" id="modalName">${escapeHtml(tool.name)}</h2>
    <div class="modal__meta">
      <span class="badge badge--${group}">${escapeHtml(tool.status)}</span>
      <span class="card__category">${escapeHtml(tool.category)}</span>
    </div>
    <p class="modal__desc">${escapeHtml(tool.description)}</p>
    ${tool.notes ? `<div class="modal__notes"><strong>Team notes</strong>${escapeHtml(tool.notes)}</div>` : ""}
    ${tool.url ? `<a class="modal__cta" href="${escapeHtml(tool.url)}" target="_blank" rel="noopener">Open ${escapeHtml(tool.name)} ↗</a>` : ""}
  `;
  document.getElementById("modalOverlay").hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modalOverlay").hidden = true;
  document.body.style.overflow = "";
}

function syncChipUI() {
  document.querySelectorAll("#statusChips .chip").forEach(el => {
    el.classList.toggle("active", el.dataset.status === state.status);
  });
  document.querySelectorAll("#categoryChips .chip").forEach(el => {
    el.classList.toggle("active", el.dataset.category === state.category);
  });
}

function rerender() {
  syncChipUI();
  renderCards();
}

function clearFilters() {
  state.search = "";
  state.status = null;
  state.category = null;
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

function init() {
  renderStats();
  renderChips();
  renderCards();
  populateCategoryDropdown();

  document.getElementById("searchInput").addEventListener("input", e => {
    state.search = e.target.value;
    renderCards();
  });

  document.getElementById("sortSelect").addEventListener("change", e => {
    state.sort = e.target.value;
    renderCards();
  });

  document.getElementById("statusChips").addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    state.status = state.status === chip.dataset.status ? null : chip.dataset.status;
    rerender();
  });

  document.getElementById("categoryChips").addEventListener("click", e => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    state.category = state.category === chip.dataset.category ? null : chip.dataset.category;
    rerender();
  });

  document.getElementById("clearFilters").addEventListener("click", clearFilters);
  document.getElementById("emptyClear").addEventListener("click", clearFilters);

  document.getElementById("toolGrid").addEventListener("click", e => {
    const card = e.target.closest(".card");
    if (!card) return;
    const tool = TOOLS.find(t => t.id === card.dataset.id);
    if (tool) openModal(tool);
  });

  document.getElementById("toolGrid").addEventListener("keydown", e => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest(".card");
    if (!card) return;
    e.preventDefault();
    const tool = TOOLS.find(t => t.id === card.dataset.id);
    if (tool) openModal(tool);
  });

  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalOverlay").addEventListener("click", e => {
    if (e.target.id === "modalOverlay") closeModal();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { closeModal(); closeSuggest(); }
  });

  // --- Suggest a Tool (UI only — not wired to a backend yet) ---
  document.getElementById("openSuggest").addEventListener("click", openSuggest);
  document.getElementById("suggestClose").addEventListener("click", closeSuggest);
  document.getElementById("suggestOverlay").addEventListener("click", e => {
    if (e.target.id === "suggestOverlay") closeSuggest();
  });

  document.getElementById("suggestForm").addEventListener("submit", e => {
    e.preventDefault();
    // NOTE: no submission target wired up yet — this just previews the
    // confirmation state. Hook this up once the intake destination
    // (GitHub Issue, internal backend, etc.) is decided.
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
  document.body.style.overflow = "";
}

init();
