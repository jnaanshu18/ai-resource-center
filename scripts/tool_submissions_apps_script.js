/**
 * Google Apps Script for AI Resource Center: tool submissions, approve queue, and share-a-win.
 *
 * Setup (once):
 * 1. Create a blank Google Sheet. Name it "DCS AI Resource Center".
 * 2. Extensions → Apps Script → paste this file → Save.
 * 3. Select setupDcsWorkbook in the function dropdown → Run. Authorize when asked.
 *    Creates tabs with all columns: Submissions | Directory queue | Team wins
 * 4. Set Script property ASSIGN_SECRET (needed for assign / approve / reject from the site):
 *    Project settings → Script properties → ASSIGN_SECRET = same value as site-config assignSecret
 * 5. Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone)
 * 6. Copy the web app URL into docs/site-config.js:
 *      contribute.simpleSubmit.submitUrl  AND  contribute.winSubmit.submitUrl  (same URL)
 * 7. Optional: File → Share → Publish to web → CSV of the Submissions tab → csvUrl
 *
 * Status values (Submissions): New | In review | Approved | Rejected
 * Status values (Team wins): New | Approved | Rejected
 * Approve also appends a row to the "Directory queue" tab for maintainer sync.
 */

const SUBMISSION_HEADERS = [
  "Submitted",
  "Tool name",
  "Link",
  "Submitted by",
  "Note",
  "Status",
  "Assigned to",
  "Assigned date",
  "Rejected date",
];

const TAB_SUBMISSIONS = "Submissions";
const TAB_DIRECTORY_QUEUE = "Directory queue";
const TAB_WINS = "Team wins";

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

const DIRECTORY_QUEUE_HEADERS = [
  "Queued",
  "Tool ID",
  "Tool Name",
  "Category",
  "Subcategory",
  "Pricing Model",
  "Status",
  "URL",
  "Tutorial Video",
  "Description",
  "Platform",
  "Department",
  "Use Cases",
  "Learning Curve",
  "Priority",
  "Data Classification",
  "Owner",
  "Date Added",
  "Last Reviewed",
  "Notes",
  "Limitations",
  "When to Use",
  "Alternatives",
  "Cost Note",
  "Security Tip",
  "Approved Models",
  "Source link",
  "Source tool name",
];

/** Optional fallback if Script property ASSIGN_SECRET is not set (prefer Script property). */
const ASSIGN_SECRET_FALLBACK = "";

function submissionSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(TAB_SUBMISSIONS) || ss.getSheets()[0];
}

function winSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(TAB_WINS);
  if (!sheet) {
    sheet = ss.insertSheet(TAB_WINS);
    writeHeaders_(sheet, WIN_HEADERS);
    styleTab_(sheet, WIN_HEADERS.length);
    statusDropdown_(sheet, 8, ["New", "Approved", "Rejected"]);
  }
  return sheet;
}

function directoryQueueSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(TAB_DIRECTORY_QUEUE);
  if (!sheet) {
    sheet = ss.insertSheet(TAB_DIRECTORY_QUEUE);
    sheet.getRange(1, 1, 1, DIRECTORY_QUEUE_HEADERS.length).setValues([DIRECTORY_QUEUE_HEADERS]);
  } else {
    const first = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0];
    if (!String(first[0] || "").trim()) {
      sheet.getRange(1, 1, 1, DIRECTORY_QUEUE_HEADERS.length).setValues([DIRECTORY_QUEUE_HEADERS]);
    }
  }
  return sheet;
}

function ensureHeaders(sheet) {
  const lastCol = Math.max(sheet.getLastColumn(), 1);
  const first = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  const headers = first.map(function (h) {
    return String(h || "").trim();
  });
  if (!headers[0]) {
    sheet.getRange(1, 1, 1, SUBMISSION_HEADERS.length).setValues([SUBMISSION_HEADERS]);
    return;
  }
  const hasTool = headers.some(function (h) {
    return h.toLowerCase() === "tool name";
  });
  if (!hasTool) {
    sheet.insertColumnAfter(1);
    sheet.getRange(1, 2).setValue("Tool name");
  }
  const refreshed = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 1)).getValues()[0].map(function (h) {
    return String(h || "").trim();
  });
  SUBMISSION_HEADERS.forEach(function (name) {
    if (!refreshed.some(function (h) {
      return h.toLowerCase() === name.toLowerCase();
    })) {
      const col = sheet.getLastColumn() + 1;
      sheet.getRange(1, col).setValue(name);
    }
  });
}

function headerIndexMap(sheet) {
  ensureHeaders(sheet);
  const lastCol = Math.max(sheet.getLastColumn(), SUBMISSION_HEADERS.length);
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

function normalizeLink(link) {
  return String(link || "").trim().replace(/\/+$/, "").toLowerCase();
}

function assignSecretExpected() {
  const fromProps = PropertiesService.getScriptProperties().getProperty("ASSIGN_SECRET");
  return String(fromProps || ASSIGN_SECRET_FALLBACK || "").trim();
}

function checkAssignSecret(token) {
  const expected = assignSecretExpected();
  if (!expected) return true;
  return String(token || "").trim() === expected;
}

function findSubmissionRow(sheet, info, link, toolName) {
  const linkKey = normalizeLink(link);
  const nameKey = String(toolName || "").trim().toLowerCase();
  const linkIdx = colIndex(info.map, ["Link", "URL"]);
  const nameIdx = colIndex(info.map, ["Tool name", "Tool"]);
  const values = sheet.getDataRange().getValues();
  for (var i = 1; i < values.length; i++) {
    const rowLink = linkIdx >= 0 ? normalizeLink(values[i][linkIdx]) : "";
    const rowName = nameIdx >= 0 ? String(values[i][nameIdx] || "").trim().toLowerCase() : "";
    if (linkKey && rowLink && rowLink === linkKey) return i + 1;
    if (!linkKey && nameKey && rowName === nameKey) return i + 1;
  }
  return -1;
}

function setCell(sheet, rowNum, info, names, value) {
  const idx = colIndex(info.map, names);
  if (idx < 0) return;
  sheet.getRange(rowNum, idx + 1).setValue(value);
}

function getCell(sheet, rowNum, info, names) {
  const idx = colIndex(info.map, names);
  if (idx < 0) return "";
  return String(sheet.getRange(rowNum, idx + 1).getValue() || "").trim();
}

function joinList(value) {
  if (!value) return "";
  if (Object.prototype.toString.call(value) === "[object Array]") {
    return value.map(function (v) { return String(v || "").trim(); }).filter(Boolean).join("; ");
  }
  return String(value || "").trim();
}

function pickDir(data, keys, fallback) {
  for (var i = 0; i < keys.length; i++) {
    var val = data[keys[i]];
    if (val != null && String(val).trim()) return String(val).trim();
  }
  return fallback || "";
}

function handleAssign(data) {
  if (!checkAssignSecret(data.token)) {
    return jsonOut({ ok: false, error: "Unauthorized assign request." });
  }
  const assignee = String(data.assignee || data.assignedTo || "").trim();
  if (assignee.length < 2 || assignee.length > 60) {
    return jsonOut({ ok: false, error: "Assignee name is required." });
  }
  const link = String(data.link || "").trim();
  const toolName = String(data.toolName || data.tool || "").trim();
  if (!link && !toolName) {
    return jsonOut({ ok: false, error: "Link or tool name is required to match a row." });
  }
  const sheet = submissionSheet();
  const info = headerIndexMap(sheet);
  const rowNum = findSubmissionRow(sheet, info, link, toolName);
  if (rowNum < 0) {
    return jsonOut({ ok: false, error: "Submission not found in sheet." });
  }
  const today = new Date().toISOString().slice(0, 10);
  setCell(sheet, rowNum, info, ["Assigned to", "Assignee"], assignee);
  setCell(sheet, rowNum, info, ["Assigned date"], today);
  setCell(sheet, rowNum, info, ["Status"], "In review");
  setCell(sheet, rowNum, info, ["Rejected date"], "");
  return jsonOut({ ok: true, assignedDate: today });
}

function handleReject(data) {
  if (!checkAssignSecret(data.token)) {
    return jsonOut({ ok: false, error: "Unauthorized reject request." });
  }
  const link = String(data.link || "").trim();
  const toolName = String(data.toolName || data.tool || "").trim();
  if (!link && !toolName) {
    return jsonOut({ ok: false, error: "Link or tool name is required to match a row." });
  }
  const reason = String(data.reason || data.rejectReason || "").trim().slice(0, 400);
  const sheet = submissionSheet();
  const info = headerIndexMap(sheet);
  const rowNum = findSubmissionRow(sheet, info, link, toolName);
  if (rowNum < 0) {
    return jsonOut({ ok: false, error: "Submission not found in sheet." });
  }
  const today = new Date().toISOString().slice(0, 10);
  setCell(sheet, rowNum, info, ["Status"], "Rejected");
  setCell(sheet, rowNum, info, ["Rejected date"], today);
  if (reason) {
    const noteIdx = colIndex(info.map, ["Note", "Notes"]);
    if (noteIdx >= 0) {
      const prev = String(sheet.getRange(rowNum, noteIdx + 1).getValue() || "").trim();
      const next = prev ? prev + " — Rejected: " + reason : "Rejected: " + reason;
      sheet.getRange(rowNum, noteIdx + 1).setValue(next.slice(0, 500));
    }
  }
  return jsonOut({ ok: true, rejectedDate: today });
}

function handleApprove(data) {
  if (!checkAssignSecret(data.token)) {
    return jsonOut({ ok: false, error: "Unauthorized approve request." });
  }
  const link = String(data.link || "").trim();
  const toolName = String(data.toolName || data.tool || "").trim();
  const dir = data.directory || data.tool || {};
  if (!link && !toolName) {
    return jsonOut({ ok: false, error: "Link or tool name is required to match a row." });
  }
  const name = pickDir(dir, ["toolName", "name", "Tool Name"], toolName);
  const url = pickDir(dir, ["url", "URL"], link);
  const category = pickDir(dir, ["category", "Category"], "");
  const pricing = pickDir(dir, ["pricing", "Pricing Model", "Pricing"], "");
  const description = pickDir(dir, ["description", "Description"], "");
  const video = pickDir(dir, ["videoUrl", "Tutorial Video", "video"], "");
  if (!name || name.length < 2) return jsonOut({ ok: false, error: "Tool name is required." });
  if (!/^https?:\/\//i.test(url)) return jsonOut({ ok: false, error: "Valid URL is required." });
  if (!category) return jsonOut({ ok: false, error: "Category is required." });
  if (!pricing) return jsonOut({ ok: false, error: "Pricing is required." });
  if (description.length < 20) return jsonOut({ ok: false, error: "Description must be at least 20 characters." });
  if (!/^https?:\/\//i.test(video)) return jsonOut({ ok: false, error: "Tutorial video URL is required." });

  const sheet = submissionSheet();
  const info = headerIndexMap(sheet);
  const rowNum = findSubmissionRow(sheet, info, link, toolName);
  if (rowNum < 0) {
    return jsonOut({ ok: false, error: "Submission not found in sheet." });
  }
  const today = new Date().toISOString().slice(0, 10);
  setCell(sheet, rowNum, info, ["Status"], "Approved");
  setCell(sheet, rowNum, info, ["Rejected date"], "");

  const queue = directoryQueueSheet();
  const toolId = pickDir(dir, ["toolId", "Tool ID", "id"], "");
  const queueRow = [
    today,
    toolId,
    name,
    category,
    pickDir(dir, ["subcategory", "Subcategory"], ""),
    pricing,
    pickDir(dir, ["status", "Status"], "Approved"),
    url,
    video,
    description,
    joinList(dir.platform || dir.Platform || ""),
    pickDir(dir, ["department", "Department"], "Everyone"),
    joinList(dir.useCases || dir["Use Cases"] || ""),
    pickDir(dir, ["learningCurve", "Learning Curve"], "Medium"),
    pickDir(dir, ["priority", "Priority"], "Medium"),
    pickDir(dir, ["dataClassification", "Data Classification"], "Internal"),
    pickDir(dir, ["owner", "Owner"], "Admin"),
    pickDir(dir, ["dateAdded", "Date Added"], today),
    pickDir(dir, ["lastReviewed", "Last Reviewed"], today),
    pickDir(dir, ["notes", "Notes"], getCell(sheet, rowNum, info, ["Note", "Notes"])),
    pickDir(dir, ["limitations", "Limitations"], ""),
    pickDir(dir, ["whenToUse", "When to Use"], ""),
    pickDir(dir, ["alternatives", "Alternatives"], ""),
    pickDir(dir, ["costNote", "Cost Note"], ""),
    pickDir(dir, ["securityTip", "Security Tip"], ""),
    joinList(dir.approvedModels || dir["Approved Models"] || ""),
    link,
    toolName,
  ];
  queue.appendRow(queueRow);
  return jsonOut({ ok: true, toolId: toolId, queued: true });
}

function handleSubmit(data) {
  const toolName = String(data.toolName || data.tool || "").trim();
  if (toolName.length < 2 || toolName.length > 80) {
    return jsonOut({ ok: false, error: "Tool name is required." });
  }
  const link = String(data.link || "").trim();
  if (!/^https?:\/\//i.test(link) || link.length > 300) {
    return jsonOut({ ok: false, error: "A valid http(s) link is required." });
  }
  const sheet = submissionSheet();
  const info = headerIndexMap(sheet);
  const row = [];
  for (var i = 0; i < info.lastCol; i++) row.push("");
  function set(names, value) {
    const idx = colIndex(info.map, names);
    if (idx >= 0) row[idx] = value;
  }
  set(["Submitted", "Date", "Timestamp"], new Date().toISOString().slice(0, 10));
  set(["Tool name", "Tool"], toolName);
  set(["Link", "URL"], link);
  set(["Submitted by", "Submitter"], String(data.submittedBy || "").trim().slice(0, 60));
  set(["Note", "Notes"], String(data.note || "").trim().slice(0, 200));
  const assignee = String(data.assignee || data.assignedTo || "").trim();
  const assignOnSubmit = assignee && checkAssignSecret(data.token);
  if (assignOnSubmit) {
    if (assignee.length < 2 || assignee.length > 60) {
      return jsonOut({ ok: false, error: "Assignee name is invalid." });
    }
    set(["Assigned to", "Assignee"], assignee);
    set(["Assigned date"], new Date().toISOString().slice(0, 10));
    set(["Status"], "In review");
  } else {
    set(["Status"], "New");
    set(["Assigned to", "Assignee"], "");
    set(["Assigned date"], "");
  }
  set(["Rejected date"], "");
  sheet.appendRow(row);
  return jsonOut({ ok: true });
}

function isWinPayload_(data) {
  const hasWin = String(data.title || "").trim() && String(data.impact || "").trim();
  const hasToolSubmit = String(data.toolName || data.link || "").trim();
  return hasWin && !hasToolSubmit;
}

function handleWin(data) {
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
  const info = headerIndexMapFor_(sheet, WIN_HEADERS);
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
}

function headerIndexMapFor_(sheet, expectedHeaders) {
  const lastCol = Math.max(sheet.getLastColumn(), expectedHeaders.length);
  const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(function (h) {
    return String(h || "").trim();
  });
  const map = {};
  headers.forEach(function (h, i) {
    if (h) map[h.toLowerCase()] = i;
  });
  return { headers: headers, map: map, lastCol: lastCol };
}

function writeHeaders_(sheet, headers) {
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
}

function getOrCreateTab_(ss, name) {
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  return sheet;
}

function styleTab_(sheet, headerCount) {
  sheet.setFrozenRows(1);
  const range = sheet.getRange(1, 1, 1, headerCount);
  range.setFontWeight("bold");
  range.setBackground("#eef2ff");
  range.setWrap(true);
  sheet.setRowHeight(1, 32);
}

function statusDropdown_(sheet, column, values) {
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(values, true)
    .setAllowInvalid(false)
    .build();
  sheet.getRange(2, column, 2000, 1).setDataValidation(rule);
}

/**
 * Run once from the Apps Script editor after pasting this file.
 * Creates Submissions, Directory queue, and Team wins tabs with required columns.
 */
function setupDcsWorkbook() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const first = ss.getSheets()[0];
  if (!ss.getSheetByName(TAB_SUBMISSIONS)) {
    first.setName(TAB_SUBMISSIONS);
  }
  const sub = ss.getSheetByName(TAB_SUBMISSIONS) || first;
  writeHeaders_(sub, SUBMISSION_HEADERS);
  styleTab_(sub, SUBMISSION_HEADERS.length);
  statusDropdown_(sub, 6, ["New", "In review", "Approved", "Rejected"]);

  const queue = getOrCreateTab_(ss, TAB_DIRECTORY_QUEUE);
  writeHeaders_(queue, DIRECTORY_QUEUE_HEADERS);
  styleTab_(queue, DIRECTORY_QUEUE_HEADERS.length);

  const wins = getOrCreateTab_(ss, TAB_WINS);
  writeHeaders_(wins, WIN_HEADERS);
  styleTab_(wins, WIN_HEADERS.length);
  statusDropdown_(wins, 8, ["New", "Approved", "Rejected"]);
}

function doPost(e) {
  try {
    const data = parseBody(e);
    const action = String(data.action || "submit").trim().toLowerCase();
    if (action === "assign") return handleAssign(data);
    if (action === "reject") return handleReject(data);
    if (action === "approve") return handleApprove(data);
    if (action === "win" || isWinPayload_(data)) return handleWin(data);
    return handleSubmit(data);
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  try {
    const action = e && e.parameter ? String(e.parameter.action || "") : "";
    if (action !== "list") {
      return jsonOut({
        ok: true,
        message: "Tool submissions endpoint. Use ?action=list or POST submit/assign/approve/reject.",
      });
    }
    const sheet = submissionSheet();
    ensureHeaders(sheet);
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
      if (String(row.Link || row.link || "").trim()) rows.push(row);
    }
    return jsonOut({ ok: true, rows: rows });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err), rows: [] });
  }
}
