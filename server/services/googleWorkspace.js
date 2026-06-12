import { google } from 'googleapis';

const DEFAULT_SHEETS_SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets'
];
const DEFAULT_DRIVE_SCOPES = [
  'https://www.googleapis.com/auth/drive'
];

function envList(name, fallback) {
  const value = process.env[name];
  return value ? value.split(',').map((item) => item.trim()).filter(Boolean) : fallback;
}

function privateKey() {
  return String(process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
}

export function googleConfigured() {
  return Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && privateKey());
}

export function createGoogleAuth(scopes = DEFAULT_SHEETS_SCOPES) {
  if (!googleConfigured()) {
    const error = new Error('Google service account credentials are not configured.');
    error.status = 503;
    throw error;
  }
  return new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: privateKey(),
    scopes
  });
}

export function sheetsClient() {
  return google.sheets({
    version: 'v4',
    auth: createGoogleAuth(envList('GOOGLE_SHEETS_SCOPES', DEFAULT_SHEETS_SCOPES))
  });
}

export function driveClient() {
  return google.drive({
    version: 'v3',
    auth: createGoogleAuth(envList('GOOGLE_DRIVE_SCOPES', DEFAULT_DRIVE_SCOPES))
  });
}

export function normalizeHeader(value = '') {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[\s./-]+/g, '_')
    .replace(/[^\p{L}\p{N}_]/gu, '')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
}

export function normalizeHeaders(headers = []) {
  const used = new Map();
  return headers.map((header, index) => {
    const base = normalizeHeader(header) || `column_${index + 1}`;
    const count = used.get(base) || 0;
    used.set(base, count + 1);
    return count ? `${base}_${count + 1}` : base;
  });
}

export function safeHeaderMapping(headers = []) {
  const normalized = normalizeHeaders(headers);
  return Object.fromEntries(normalized.map((key, index) => [key, {
    index,
    source: headers[index] || '',
    key
  }]));
}

export function columnName(index) {
  let value = Number(index) + 1;
  let output = '';
  while (value > 0) {
    const remainder = (value - 1) % 26;
    output = String.fromCharCode(65 + remainder) + output;
    value = Math.floor((value - 1) / 26);
  }
  return output;
}

export async function readSheet(spreadsheetId, tabName) {
  if (!spreadsheetId || !tabName) {
    const error = new Error('Spreadsheet ID and tab name are required.');
    error.status = 503;
    throw error;
  }
  const sheets = sheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'${String(tabName).replace(/'/g, "''")}'`
  });
  const values = response.data.values || [];
  const sourceHeaders = values[0] || [];
  const headers = normalizeHeaders(sourceHeaders);
  const rows = values.slice(1).map((valuesRow, index) => ({
    _rowNumber: index + 2,
    ...Object.fromEntries(headers.map((header, column) => [header, valuesRow[column] ?? '']))
  }));
  return {
    spreadsheetId,
    tabName,
    sourceHeaders,
    headers,
    headerMap: safeHeaderMapping(sourceHeaders),
    rows,
    fetchedAt: new Date().toISOString()
  };
}

export async function appendRows(spreadsheetId, tabName, rows) {
  const values = Array.isArray(rows?.[0]) ? rows : [rows];
  const sheets = sheetsClient();
  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `'${String(tabName).replace(/'/g, "''")}'`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values }
  });
  return response.data.updates || {};
}

export async function appendRecord(spreadsheetId, tabName, record, columns) {
  await ensureColumns(spreadsheetId, tabName, columns);
  const values = columns.map((column) => record[column] ?? '');
  return appendRows(spreadsheetId, tabName, values);
}

export async function updateRow(spreadsheetId, tabName, rowNumber, data, columns) {
  if (!Number.isInteger(Number(rowNumber)) || Number(rowNumber) < 2) {
    throw new Error('A valid Sheet row number is required.');
  }
  const orderedColumns = columns || (await readSheet(spreadsheetId, tabName)).headers;
  const values = orderedColumns.map((column) => data[column] ?? '');
  const endColumn = columnName(Math.max(orderedColumns.length - 1, 0));
  const sheets = sheetsClient();
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `'${String(tabName).replace(/'/g, "''")}'!A${rowNumber}:${endColumn}${rowNumber}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [values] }
  });
  return { rowNumber: Number(rowNumber), updated: true };
}

export async function findRows(spreadsheetId, tabName, filters = {}) {
  const sheet = await readSheet(spreadsheetId, tabName);
  const entries = Object.entries(filters).filter(([, value]) => value !== undefined && value !== null && value !== '');
  return {
    ...sheet,
    rows: sheet.rows.filter((row) => entries.every(([key, value]) => {
      const actual = String(row[normalizeHeader(key)] ?? '').trim().toLowerCase();
      const expected = String(value).trim().toLowerCase();
      return actual === expected;
    }))
  };
}

export async function ensureColumns(spreadsheetId, tabName, columns) {
  const sheets = sheetsClient();
  let metadata = await sheets.spreadsheets.get({ spreadsheetId });
  let tab = metadata.data.sheets?.find((item) => item.properties?.title === tabName);
  if (!tab) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests: [{ addSheet: { properties: { title: tabName } } }] }
    });
  }

  const current = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: `'${String(tabName).replace(/'/g, "''")}'!1:1`
  });
  const existing = current.data.values?.[0] || [];
  const normalizedExisting = new Set(normalizeHeaders(existing));
  const missing = columns.filter((column) => !normalizedExisting.has(normalizeHeader(column)));
  const finalHeaders = [...existing, ...missing];
  if (!existing.length || missing.length) {
    const endColumn = columnName(Math.max(finalHeaders.length - 1, 0));
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `'${String(tabName).replace(/'/g, "''")}'!A1:${endColumn}1`,
      valueInputOption: 'RAW',
      requestBody: { values: [finalHeaders] }
    });
  }
  return normalizeHeaders(finalHeaders);
}

export async function getGoogleConnectionStatus() {
  if (!googleConfigured()) return { configured: false, connected: false, reason: 'credentials_missing' };
  try {
    const auth = createGoogleAuth();
    await auth.authorize();
    return { configured: true, connected: true };
  } catch (error) {
    return { configured: true, connected: false, reason: error.message };
  }
}
