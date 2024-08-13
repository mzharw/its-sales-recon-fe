'use client';
import Dashboard from '@/app/dashboard/Dashboard';
import { Loader } from '@mantine/core';
import { DashboardProvider } from '@/app/dashboard/contexts/DashboardContext';
import { Suspense } from 'react';

export default function Home() {
  return (
    <DashboardProvider>
      <Suspense fallback={<Loader />}>
        <Dashboard />
      </Suspense>
    </DashboardProvider>
  );
}