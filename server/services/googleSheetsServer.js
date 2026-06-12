import { getGoogleConnectionStatus, readSheet } from './googleWorkspace.js';
import { TEMPORARY_CURRICULUM_SHEET_ID, systemSpreadsheetId } from './platformSheets.js';

function idFromUrl(value = '') {
  return String(value).match(/\/spreadsheets\/d\/([^/]+)/)?.[1] || '';
}

export async function getDataSourceStatus() {
  const google = await getGoogleConnectionStatus();
  let systemId = '';
  try {
    systemId = systemSpreadsheetId();
  } catch {
    systemId = '';
  }
  return {
    google,
    curriculum: {
      configured: Boolean(TEMPORARY_CURRICULUM_SHEET_ID),
      spreadsheetId: TEMPORARY_CURRICULUM_SHEET_ID,
      tabName: process.env.TEMPORARY_CURRICULUM_TAB || 'Curriculum'
    },
    system: { configured: Boolean(systemId), spreadsheetId: systemId },
    schedule: {
      configured: Boolean(process.env.GOOGLE_SCHEDULE_SHEET_ID || idFromUrl(process.env.GOOGLE_SCHEDULE_SHEET_URL)),
      spreadsheetId: process.env.GOOGLE_SCHEDULE_SHEET_ID || idFromUrl(process.env.GOOGLE_SCHEDULE_SHEET_URL)
    },
    newApplications: {
      configured: Boolean(process.env.GOOGLE_NEW_APPLICATIONS_SHEET_ID || idFromUrl(process.env.GOOGLE_NEW_APPLICATIONS_SHEET_URL)),
      spreadsheetId: process.env.GOOGLE_NEW_APPLICATIONS_SHEET_ID || idFromUrl(process.env.GOOGLE_NEW_APPLICATIONS_SHEET_URL)
    },
    checkedAt: new Date().toISOString()
  };
}

export async function syncSource(name) {
  const sources = {
    curriculum: [TEMPORARY_CURRICULUM_SHEET_ID, process.env.TEMPORARY_CURRICULUM_TAB || 'Curriculum'],
    schedule: [process.env.GOOGLE_SCHEDULE_SHEET_ID || idFromUrl(process.env.GOOGLE_SCHEDULE_SHEET_URL), process.env.GOOGLE_SCHEDULE_TAB || 'English Taxo Schedule'],
    'new-applications': [process.env.GOOGLE_NEW_APPLICATIONS_SHEET_ID || idFromUrl(process.env.GOOGLE_NEW_APPLICATIONS_SHEET_URL), process.env.GOOGLE_NEW_APPLICATIONS_TAB || 'New Applications']
  };
  const source = sources[name];
  if (!source?.[0]) {
    const error = new Error(`Data source ${name} is not configured.`);
    error.status = 503;
    throw error;
  }
  const sheet = await readSheet(source[0], source[1]);
  return {
    source: name,
    imported: sheet.rows.length,
    skipped: 0,
    lastSync: sheet.fetchedAt,
    headers: sheet.sourceHeaders
  };
}
