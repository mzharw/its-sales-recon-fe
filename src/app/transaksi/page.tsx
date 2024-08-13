import { Suspense } from 'react';
import { Loader } from '@mantine/core';
import TransaksiList from './components/TransaksiList';
import TransaksiModal from './components/modals/TransaksiModal';
import TransaksiBarangModal from '@/app/transaksi/components/modals/TransaksiBarangModal';
import TransaksiDetailModal from '@/app/transaksi/components/modals/TransaksiDetailModal';
import { TransaksiProvider } from './contexts/TransaksiContext';

export default function TransaksiPage() {
  return (
    <TransaksiProvider>
      <Suspense fallback={<Loader />}>
        <TransaksiList />
        <TransaksiModal />
        <TransaksiBarangModal />
        <TransaksiDetailModal />
      </Suspense>
    </TransaksiProvider>
  );
}