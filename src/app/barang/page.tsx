import {Suspense} from 'react';
import BarangList from './components/BarangList';
import BarangModal from './components/BarangModal';
import {BarangProvider} from './contexts/BarangContext';
import {Loader} from "@mantine/core";

export default function BarangPage() {
    return (
        <BarangProvider>
            <Suspense fallback={<Loader/>}>
                <BarangList/>
                <BarangModal/>
            </Suspense>
        </BarangProvider>
    );
}