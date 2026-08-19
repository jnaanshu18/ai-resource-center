/**
 * Google Apps Script for AI Resource Center "Share a win" submissions.
 *
 * Setup (once):
 * 1. Create a Google Sheet with header row (first tab or dedicated tab):
 *    Submitted | Title | Tool used | Submitted by | Role | Impact | How | Status
 * 2. Extensions → Apps Script → paste this file.
 * 3. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the web app URL into docs/site-config.js → contribute.winSubmit.submitUrl
 * 5. Optional: File → Share → Publish to web → CSV; paste URL into winSubmit.csvUrl
 *
 * Status values: New | Approved | Rejected
 * Approve by adding the row to data/team_use_cases.csv, then push to main.
 */

const WIN_HEADERS = [
  "Submitted",
  "Title",
  "Tool used",
  "Submitted by",
  "Role",
  "Impact",
  "How",
  "Status",
];

function winSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName("Team wins") || ss.getSheets()[0];
}

function ensureWinHeaders(sheet) {
  const lastCol = Math.max(sheet.getLastColumn(), 1);
  const first = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const headers = first.map(function (h) {
    return String(h || "").trim();
  });
  if (!headers[0]) {
    sheet.getRange(1, 1, 1, WIN_HEADERS.length).setValues([WIN_HEADERS]);
  }
}

function headerIndexMap(sheet) {
  ensureWinHeaders(sheet);
  const lastCol = Math.max(sheet.getLastColumn(), WIN_HEADERS.length);
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) {
    return String(h || "").trim();
  });
  const map = {};
  headers.forEach(function (h, i) {
    if (h) map[h.toLowerCase()] = i;
  });
  return { headers: headers, map: map, lastCol: lastCol };
}

function colIndex(map, names) {
  for (var i = 0; i < names.length; i++) {
    var key = String(names[i] || "").toLowerCase();
    if (map[key] != null) return map[key];
  }
  return -1;
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function parseBody(e) {
  if (!e || !e.postData || !e.postData.contents) return {};
  try {
    return JSON.parse(e.postData.contents);
  } catch (err) {
    return {};
  }
}

function doPost(e) {
  try {
    const data = parseBody(e);
    const title = String(data.title || "").trim();
    if (title.length < 4 || title.length > 100) {
      return jsonOut({ ok: false, error: "Title is required (4–100 characters)." });
    }
    const tool = String(data.tool || data.toolUsed || "").trim();
    if (!tool || tool.length > 80) {
      return jsonOut({ ok: false, error: "Tool used is required." });
    }
    const impact = String(data.impact || "").trim();
    if (impact.length < 12 || impact.length > 400) {
      return jsonOut({ ok: false, error: "Impact is required (12–400 characters)." });
    }
    const sheet = winSheet();
    const info = headerIndexMap(sheet);
    const row = [];
    for (var i = 0; i < info.lastCol; i++) row.push("");
    function set(names, value) {
      const idx = colIndex(info.map, names);
      if (idx >= 0) row[idx] = value;
    }
    set(["Submitted", "Date", "Timestamp"], new Date().toISOString().slice(0, 10));
    set(["Title"], title);
    set(["Tool used", "Tool"], tool);
    set(["Submitted by", "Submitter", "Name"], String(data.submittedBy || data.name || "").trim().slice(0, 60));
    set(["Role"], String(data.role || "").trim().slice(0, 60));
    set(["Impact"], impact);
    set(["How"], String(data.how || "").trim().slice(0, 600));
    set(["Status"], "New");
    sheet.appendRow(row);
    return jsonOut({ ok: true });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  try {
    const action = e && e.parameter ? String(e.parameter.action || "") : "";
    if (action !== "list") {
      return jsonOut({ ok: true, message: "Team wins endpoint. Use ?action=list" });
    }
    const sheet = winSheet();
    ensureWinHeaders(sheet);
    const values = sheet.getDataRange().getValues();
    if (!values.length) return jsonOut({ ok: true, rows: [] });
    const headers = values[0].map(function (h) {
      return String(h || "").trim();
    });
    const rows = [];
    for (var i = 1; i < values.length; i++) {
      const row = {};
      headers.forEach(function (h, idx) {
        row[h] = values[i][idx];
      });
      if (String(row.Title || row.title || "").trim()) rows.push(row);
    }
    return jsonOut({ ok: true, rows: rows });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err), rows: [] });
  }
}
