import {Barang} from '../contexts/BarangContext';

export async function fetchBarang(id: number | string = ''): Promise<Barang[] | Barang> {
    const response = await fetch(`/api/proxy?path=products/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch customers');
    }
    return response.json();
}