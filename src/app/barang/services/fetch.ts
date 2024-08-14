import {Barang} from '../contexts/BarangContext';
import { fetchWithProxy } from '@/utils/fetch';

export async function fetchBarang(id: number | string = ''): Promise<Barang[] | Barang> {
    const response = await fetchWithProxy(`products/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch customers');
    }
    return response.json();
}