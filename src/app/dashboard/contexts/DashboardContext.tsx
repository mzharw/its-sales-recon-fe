import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { fetchStats } from '@/app/dashboard/services/fetch';
import { MESSAGES } from '@/constants/messages';
import { notify } from '@/utils/notifications';
import { DataProps } from '@/components/StatsGrid';

interface StatsProps {
  value: string;
  diff: number;
}

export interface Stats {
  sales: StatsProps,
  totalSales: StatsProps,
  soldProducts: StatsProps,
  activeCustomer: StatsProps,
}

interface DashboardContextType {
  stats: DataProps[] | null;
  loading: boolean;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [stats, setStats] = useState<DataProps[] | null>(null);
  const [loading, setLoading] = useState(false);

  const getStats = async () => {
    try {
      setLoading(true);
      const result = await fetchStats();

      setStats([
        { title: 'Transaksi', icon: 'receipt', value: result.sales.value, diff: result.sales.diff },
        { title: 'Penjualan', icon: 'coin', value: result.totalSales.value, diff: result.totalSales.diff },
        { title: 'Barang terjual', icon: 'discount', value: result.soldProducts.value, diff: result.soldProducts.diff },
        {
          title: 'Customer aktif',
          icon: 'user',
          value: result.activeCustomer.value,
          diff: result.activeCustomer.diff,
        },
      ]);
    } catch (error) {
      notify(MESSAGES.ERROR.FETCH, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStats().then();
  }, []);

  return (
    <DashboardContext.Provider value={{
      stats,
      loading,
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export const useDashboard = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
