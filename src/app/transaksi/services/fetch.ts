import { Transaksi } from '../contexts/TransaksiContext';
import { fetchWithProxy } from '@/utils/fetch';

export async function fetchTransaksi(id: number | string = ''): Promise<Transaksi[] | Transaksi> {
  const response = await fetchWithProxy(`sales/${id ? id + '/view' : id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch sales');
  }
  return response.json();
}