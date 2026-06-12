import { platformApi } from './platformApi';

export async function getSchedules() {
  const data = await platformApi.schedule();
  return data.schedule || data.rows || [];
}
