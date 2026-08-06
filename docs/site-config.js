// Single switch for preview vs production hosting.
// When Daily Code Solutions approves go-live, change environment to "production".
// Everything else (issue drafts, live URL helpers) follows this file.

const SITE_CONFIG = {
  /** @type {"preview" | "production"} */
  environment: "preview",

  preview: {
    label: "Preview (personal)",
    liveSite: "https://jnaanshu18.github.io/ai-resource-center/",
    issueNewUrl: "https://github.com/jnaanshu18/ai-resource-center/issues/new",
  },

  production: {
    label: "Production (Daily Code Solutions)",
    liveSite: "https://daily-code-solutions.github.io/DCS-Resources/",
    issueNewUrl: "https://github.com/Daily-Code-Solutions/DCS-Resources/issues/new",
  },
};

function getSiteConfig() {
  const env = SITE_CONFIG.environment === "production" ? "production" : "preview";
  return SITE_CONFIG[env];
}
