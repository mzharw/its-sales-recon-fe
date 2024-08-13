import { Stats } from '@/app/dashboard/contexts/DashboardContext';

export async function fetchStats(): Promise<Stats> {
  console.log(process.env)
  const response = await fetch(`/api/proxy?path=sales/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch stats');
  }
  return response.json();
}