'use client';
import {
  Stack,
  Title,
} from '@mantine/core';
import { DataProps, StatsGrid } from '@/components/StatsGrid';
import { useDashboard } from '@/app/dashboard/contexts/DashboardContext';

export default function Dashboard() {
  const { stats } = useDashboard();
  return (
    <Stack
      align="stretch"
      justify="center"
      gap="sm">
      <Title>Dashboard</Title>
      <StatsGrid data={stats as DataProps[]} />
    </Stack>
  );
}