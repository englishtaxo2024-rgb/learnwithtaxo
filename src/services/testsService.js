import { platformApi } from './platformApi';

export async function getTests() {
  const data = await platformApi.results('student');
  return data.tests || data.results || data.rows || [];
}
