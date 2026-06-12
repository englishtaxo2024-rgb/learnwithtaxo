import { platformApi } from './platformApi';

export async function getMaterialMap() {
  const data = await platformApi.materials();
  return data.materials || data.rows || [];
}
