/**
 * Cloudflare Worker — sends assignment notification emails via Resend.
 *
 * Deploy:
 *   cd workers/assignment-notify
 *   npx wrangler secret put RESEND_API_KEY
 *   npx wrangler secret put NOTIFY_SECRET
 *   npx wrangler deploy
 *
 * Secrets / vars (wrangler.toml [vars] or dashboard):
 *   FROM_EMAIL  — verified sender in Resend, e.g. noreply@dailycodesolutions.com
 *   RESEND_API_KEY — Resend API key
 *   NOTIFY_SECRET — same value as toolAssignments.notify.webhookSecret in site-config.js
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmailHtml(payload, fromLabel) {
  const notes = payload.testingNotes
    ? `<p><strong>Notes from admin</strong></p><p>${escapeHtml(payload.testingNotes).replace(/\n/g, "<br>")}</p>`
    : "";
  const toolLink = payload.toolUrl
    ? `<p><a href="${escapeHtml(payload.toolUrl)}">Open tool website</a></p>`
    : "";
  const siteLink = payload.siteUrl
    ? `<p><a href="${escapeHtml(payload.siteUrl)}">Open AI Resource Center</a></p>`
    : "";
  return `
    <div style="font-family:system-ui,sans-serif;line-height:1.5;color:#111827;max-width:560px">
      <p>Hi ${escapeHtml(payload.assigneeName)},</p>
      <p>You have been assigned to <strong>${escapeHtml(payload.toolStatus)}</strong> this tool:</p>
      <p style="font-size:18px;font-weight:700;margin:12px 0">${escapeHtml(payload.toolName)}</p>
      ${notes}
      ${toolLink}
      ${siteLink}
      <p style="color:#6b7280;font-size:13px;margin-top:24px">— ${escapeHtml(fromLabel)}</p>
    </div>
  `.trim();
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }
    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    const secret = String(env.NOTIFY_SECRET || "").trim();
    if (secret) {
      const auth = request.headers.get("Authorization") || "";
      const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
      if (token !== secret) {
        return json({ error: "Unauthorized" }, 401);
      }
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }

    const assigneeEmail = String(payload.assigneeEmail || "").trim().toLowerCase();
    const toolName = String(payload.toolName || "").trim();
    if (!assigneeEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(assigneeEmail)) {
      return json({ error: "Invalid assigneeEmail" }, 400);
    }
    if (!toolName) {
      return json({ error: "Missing toolName" }, 400);
    }

    const fromEmail = String(env.FROM_EMAIL || "").trim();
    const apiKey = String(env.RESEND_API_KEY || "").trim();
    if (!fromEmail || !apiKey) {
      return json({ error: "Email service not configured" }, 503);
    }

    const fromLabel = String(payload.fromLabel || "DCS AI Resource Center").trim();
    const subject = `Assigned to ${payload.toolStatus || "test"}: ${toolName}`;
    const html = buildEmailHtml(payload, fromLabel);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${fromLabel} <${fromEmail}>`,
        to: [assigneeEmail],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      return json({ error: "Resend failed", detail }, 502);
    }

    const data = await res.json();
    return json({ ok: true, id: data.id || null });
  },
};
