import { Transaksi } from '../contexts/TransaksiContext';

export async function fetchTransaksi(id: number | string = ''): Promise<Transaksi[] | Transaksi> {
  const response = await fetch(`/api/proxy?path=sales/${id ? id + '/view' : id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch sales');
  }
  return response.json();
}