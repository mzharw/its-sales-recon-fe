import { Stats } from '@/app/dashboard/contexts/DashboardContext';
import { fetchWithProxy } from '@/utils/fetch';

export async function fetchStats(): Promise<Stats> {
  const response = await fetchWithProxy(`sales/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }
  return response.json();
}