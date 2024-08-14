'use client';
import {
  Box,
  LoadingOverlay,
  Stack,
  Title,
} from '@mantine/core';
import { DataProps, StatsGrid } from '@/components/StatsGrid';
import { useDashboard } from '@/app/dashboard/contexts/DashboardContext';

export default function Dashboard() {
  const { stats, loading } = useDashboard();
  return (
    <Stack
      align="stretch"
      justify="center"
      gap="sm"

    >
      <Title>Dashboard</Title>
      <Box className={'overflow-auto relative w-full min-h-36'}>
        <LoadingOverlay visible={loading} />
        <StatsGrid data={stats as DataProps[]} />
      </Box>
    </Stack>
  );
}