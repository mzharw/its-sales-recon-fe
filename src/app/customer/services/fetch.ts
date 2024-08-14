import {Customer} from '../contexts/CustomerContext';
import { fetchWithProxy } from '@/utils/fetch';

export async function fetchCustomer(id: number | string = ''): Promise<Customer[] | Customer> {
    const response = await fetchWithProxy(`customers/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch customers');
    }
    return response.json();
}