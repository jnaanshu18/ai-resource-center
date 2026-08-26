/**
 * DCS AI Resource Center header.
 * Logo links to the in-app AI hub; main-site links are replaced
 * by in-app navigation: AI hub, Directory, Choose a tool, Prompts, Team stories, Suggestions.
 */
(function () {
  const ASSET_BASE = new URL("./assets/", document.currentScript.src).href;

  const NAV = [
    { label: "AI hub", view: "home" },
    { label: "Directory", view: "directory" },
    { label: "Choose a tool", view: "guides" },
    { label: "Prompts", view: "prompts" },
    { label: "Team stories", view: "playbooks" },
    { label: "Suggestions", view: "submissions" },
  ];

  function render() {
    const mount = document.getElementById("dcs-site-header");
    if (!mount) return;

    mount.innerHTML = `
      <header class="dcs-header" id="dcsHeader">
        <div class="dcs-header__inner">
          <a class="dcs-header__logo" href="?" data-view="home" aria-label="AI hub home">
            <img src="${ASSET_BASE}logo.svg" width="118" height="26" alt="Daily Code Solutions" fetchpriority="high">
          </a>

          <nav class="app-nav" aria-label="AI Resource Center">
            <ul class="dcs-header__nav">
              ${NAV.map((item) => `
                <li>
                  <button
                    type="button"
                    class="app-nav__link${item.view === "home" ? " is-active" : ""}"
                    data-view="${item.view}"
                    ${item.view === "home" ? 'aria-current="page"' : ""}
                  >${item.label}</button>
                </li>
              `).join("")}
              <li class="dcs-header__role-item">
                <span class="dcs-header__role" id="sessionRoleBadge" hidden aria-live="polite"></span>
              </li>
              <li class="dcs-header__signout-item">
                <button type="button" class="app-nav__link app-nav__link--signout" id="signOutBtn" hidden>Sign out</button>
              </li>
            </ul>
          </nav>

          <button class="dcs-header__toggle" type="button" id="dcsHeaderToggle" aria-expanded="false" aria-controls="dcsHeader" aria-label="Open menu">
            <span aria-hidden="true"></span>
          </button>
        </div>
      </header>
    `;

    const header = document.getElementById("dcsHeader");
    const toggle = document.getElementById("dcsHeaderToggle");
    if (!header || !toggle) return;

    function setOpen(open) {
      header.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    }

    toggle.addEventListener("click", () => {
      setOpen(!header.classList.contains("is-open"));
    });

    mount.addEventListener("click", (e) => {
      if (e.target.closest("[data-view]")) setOpen(false);
    });

    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 901px)").matches) setOpen(false);
    });
  }

  // Script is mounted right after #dcs-site-header — render immediately.
  if (document.getElementById("dcs-site-header")) {
    render();
  } else if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render);
  } else {
    render();
  }
})();
