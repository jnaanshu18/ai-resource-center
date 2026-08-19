// Single switch for preview vs production hosting.
// Copy this file to site-config.js and fill in local values:
//   copy docs/site-config.example.js docs/site-config.js
// site-config.js is gitignored — do not commit plaintext passwords.
//
// Feature on/off for v1 vs later launches: see personal/FEATURE_TOGGLES.md (local, gitignored).
//
// Soft gate only — use Cloudflare Access for real production protection.
// Generate hashes:
//   python scripts/hash_auth_secret.py "your-password"
//   python scripts/hash_auth_secret.py "your-invite-token"

const SITE_CONFIG = {
  /** @type {"preview" | "production"} */
  environment: "preview",

  /**
   * Soft internal gate — store SHA-256 hex hashes, not plaintext secrets.
   * Admin login unlocks pending-approval panel; employee login is shared site access.
   */
  auth: {
    enabled: true,
    /** Admin username — pending approval panel (case-insensitive) */
    username: "admin@example.com",
    /** SHA-256 hex of admin password */
    passwordHash: "e2186dbdb1bb4193608605e84f33208765b5693b55edd4f730a719a100eeea6f",
    /** Shared employee username — full site, no admin panel */
    employeeUsername: "team",
    /** SHA-256 hex of shared employee password */
    employeePasswordHash: "e2186dbdb1bb4193608605e84f33208765b5693b55edd4f730a719a100eeea6f",
    /** Optional invite link (?invite=…) — same access as employee login */
    inviteTokenHash: "e2186dbdb1bb4193608605e84f33208765b5693b55edd4f730a719a100eeea6f",
    sessionDays: 15,
    sessionSalt: "change-me-session-salt",
    sessionKey: "dcs-ai-rc-auth",
    maxLoginAttempts: 5,
    lockoutSeconds: 60,
  },

  /**
   * Testing/Exploring tool assignments (assignee tag, admin card, directory summaries).
   * Set enabled: false to hide the whole feature without removing CSV data.
   */
  toolAssignments: {
    enabled: false,  // V1 off — set true when ready to use Assign tool in UI
    /**
     * Email the assignee when an admin saves an assignment (requires workers/assignment-notify).
     * Assignee emails come from TEAM_MEMBERS (team directory) first, then assigneeEmails below.
     */
    notify: {
      enabled: false,  // V1 off — see personal/FEATURE_TOGGLES.md
      webhookUrl: "",
      webhookSecret: "",
      /** Optional extra name -> email overrides */
      assigneeEmails: {},
      emailDomain: "dailycodesolutions.com",
      fromLabel: "DCS AI Resource Center",
    },
  },

  /**
   * Team directory — roster from data/team_members.csv (assignment dropdown).
   * V1: allowSelfRegister false — no Home registration form; add members via CSV.
   * See personal/FEATURE_TOGGLES.md to enable self-registration later.
   */
  teamDirectory: {
    enabled: true,
    allowSelfRegister: false,
    registerLabel: "team-register",
    emailDomain: "dailycodesolutions.com",
  },

  /**
   * Contribute / submissions.
   * fullForm: legacy GitHub-issue “Add a tool” (kept, off by default).
   * simpleSubmit: tool name + link POST to Apps Script.
   * winSubmit: share-a-win POST to Apps Script (separate Sheet).
   * Submissions page always shows data/tool_submissions.csv (baked into data.js);
   * optional csvUrl rows merge on top.
   * See scripts/tool_submissions_apps_script.js and scripts/team_wins_apps_script.js.
   */
  contribute: {
    fullForm: { enabled: false },
    simpleSubmit: {
      enabled: true,
      /** Paste the Apps Script web app URL here (Deploy → New deployment → Web app, Anyone). Do not invent a URL. */
      submitUrl: "",
      /** File → Share → Publish to web → CSV URL for the Submissions page. */
      csvUrl: "",
      /** Same value as Apps Script Script property ASSIGN_SECRET (enables admin assign on site). */
      assignSecret: "",
    },
    winSubmit: {
      enabled: true,
      /** Apps Script web app URL for team wins (separate Sheet deployment). */
      submitUrl: "",
      /** Optional published CSV URL for admin review / future merge. */
      csvUrl: "",
    },
  },

  preview: {
    label: "Preview (personal)",
    liveSite: "https://YOUR_USER.github.io/ai-resource-center/",
    issueNewUrl: "https://github.com/YOUR_USER/ai-resource-center/issues/new",
    githubOwner: "YOUR_USER",
    githubRepo: "ai-resource-center",
    suggestionLabel: "tool-add",
    winLabel: "team-win",
  },

  production: {
    label: "Production (Daily Code Solutions)",
    liveSite: "https://ai.dailycodesolutions.com/",
    issueNewUrl: "https://github.com/Daily-Code-Solutions/DCS-Resources/issues/new",
    githubOwner: "Daily-Code-Solutions",
    githubRepo: "DCS-Resources",
    suggestionLabel: "tool-add",
    winLabel: "team-win",
  },
};

function getSiteConfig() {
  const env = SITE_CONFIG.environment === "production" ? "production" : "preview";
  return SITE_CONFIG[env];
}

function getAuthConfig() {
  const auth = SITE_CONFIG.auth || {};
  const sessionDays = Number(auth.sessionDays) > 0
    ? Number(auth.sessionDays)
    : (Number(auth.sessionHours) > 0 ? Number(auth.sessionHours) / 24 : 7);
  return {
    enabled: auth.enabled !== false,
    username: String(auth.username || "admin@example.com").trim().toLowerCase(),
    passwordHash: String(auth.passwordHash || "").trim().toLowerCase(),
    employeeUsername: String(auth.employeeUsername || "team").trim().toLowerCase(),
    employeePasswordHash: String(auth.employeePasswordHash || "").trim().toLowerCase(),
    inviteTokenHash: String(auth.inviteTokenHash || "").trim().toLowerCase(),
    sessionDays,
    sessionSalt: String(auth.sessionSalt || auth.sessionKey || "dcs-ai-rc-auth"),
    sessionKey: String(auth.sessionKey || "dcs-ai-rc-auth"),
    maxLoginAttempts: Math.max(1, Number(auth.maxLoginAttempts) || 5),
    lockoutSeconds: Math.max(5, Number(auth.lockoutSeconds) || 60),
  };
}

function getToolAssignmentConfig() {
  const cfg = SITE_CONFIG.toolAssignments || {};
  const notify = cfg.notify || {};
  const assigneeEmails = notify.assigneeEmails && typeof notify.assigneeEmails === "object"
    ? notify.assigneeEmails
    : {};
  return {
    enabled: cfg.enabled !== false,
    notify: {
      enabled: notify.enabled === true && cfg.enabled !== false,
      webhookUrl: String(notify.webhookUrl || "").trim(),
      webhookSecret: String(notify.webhookSecret || "").trim(),
      assigneeEmails,
      emailDomain: String(notify.emailDomain || "").trim(),
      fromLabel: String(notify.fromLabel || "DCS AI Resource Center").trim(),
    },
  };
}

function getTeamDirectoryConfig() {
  const cfg = SITE_CONFIG.teamDirectory || {};
  const enabled = cfg.enabled !== false;
  const allowSelfRegister = cfg.allowSelfRegister === true && enabled;
  return {
    enabled,
    allowSelfRegister,
    registerLabel: String(cfg.registerLabel || "team-register").trim(),
    emailDomain: String(cfg.emailDomain || "dailycodesolutions.com").trim(),
  };
}

function getContributeConfig() {
  const cfg = SITE_CONFIG.contribute || {};
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
