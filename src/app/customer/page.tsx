import {Suspense} from 'react';
import CustomerList from './components/CustomerList';
import CustomerModal from './components/CustomerModal';
import {CustomerProvider} from './contexts/CustomerContext';
import {Loader} from "@mantine/core";

export default function CustomerPage() {
    return (
        <CustomerProvider>
            <Suspense fallback={<Loader/>}>
                <CustomerList/>
                <CustomerModal/>
            </Suspense>
        </CustomerProvider>
    );
}