import {Customer} from '../contexts/CustomerContext';

export async function fetchCustomer(id: number | string = ''): Promise<Customer[] | Customer> {
    const response = await fetch(`/api/proxy?path=customers/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch customers');
    }
    return response.json();
}