import { googleSheetsApi } from './googleSheetsApi';

export async function getCurriculum() {
  const result = await googleSheetsApi.syncCurriculum();
  return result.rows || result.data || [];
}

export async function syncCurriculum() {
  return googleSheetsApi.syncCurriculum();
}
