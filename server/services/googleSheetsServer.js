export async function getDataSourceStatus() {
  return {
    curriculum: { status: 'configured', url: process.env.GOOGLE_CURRICULUM_SHEET_URL },
    schedule: { status: 'configured', url: process.env.GOOGLE_SCHEDULE_SHEET_URL },
    newApplications: { status: 'permission_required_possible', url: process.env.GOOGLE_NEW_APPLICATIONS_SHEET_URL },
    lastSync: null
  };
}

export async function syncSource(name) {
  return {
    source: name,
    mode: 'preview',
    imported: 0,
    skipped: 0,
    reviewRequired: name === 'new-applications' ? 1 : 0,
    message: name === 'new-applications' ? 'Permission required fallback is enabled for 403 responses.' : 'Sync scaffold ready for service account/OAuth/CSV import.'
  };
}
