'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notify } from '@/utils/notifications';
import { MESSAGES } from '@/constants/messages';
import { errorHandler, validator } from '@/utils/form';
import { generateHeaders } from '@/utils/table';
import { fetchCustomer } from '../services/fetch';
import { HeaderProps } from '@/components/Table';
import { ErrorResponse } from '@/types';
import { fetchBarang } from '@/app/barang/services/fetch';
import { Barang } from '@/app/barang/contexts/BarangContext';

export interface Customer {
  id?: string | null;
  code: string;
  name: string;
  telp: string;
}

export const initialCustomer: Customer = {
  code: '',
  name: '',
  telp: '',
};

export type CustomerCols = typeof customerCols[number];
const customerCols = ['kode', 'nama', 'telp'] as const;

interface CustomerContextType {
  data: Customer[];
  customer: Customer | null;
  setCustomer: Dispatch<SetStateAction<Customer | null>>;
  form: ReturnType<typeof useForm<Customer>>;
  headers: HeaderProps;
  headersMap: Record<CustomerCols, keyof Customer>;
  loading: boolean;
  formLoading: boolean;
  opened: boolean;
  open: () => void;
  close: () => void;
  onSubmit: (values: Customer) => Promise<void>;
  getData: () => Promise<void>;
  getCustomer: (id: number) => Promise<void>;
}

const CustomerContext = createContext<CustomerContextType | null>(null);

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Customer[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<Customer>({
    initialValues: initialCustomer,
    validate: {
      code: (value) => validator('Kode', value, 'REQUIRED', 'MAX_LENGTH:10', 'MIN_LENGTH:1'),
      name: (value) => validator('Nama', value, 'REQUIRED', 'MAX_LENGTH:100', 'MIN_LENGTH:1'),
      telp: (value) => validator('No Telp', value, 'REQUIRED', 'MAX_LENGTH:20'),
    },
  });

  const headers: HeaderProps = generateHeaders(...customerCols);
  const headersMap: Record<CustomerCols, keyof Customer> = { kode: 'code', nama: 'name', telp: 'telp' };

  async function getData() {
    setLoading(true);
    try {
      const result = await fetchCustomer() as Customer[];
      setData(result);
    } catch (error) {
      notify(MESSAGES.ERROR.FETCH, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function getCustomer(id: number) {
    try {
      setFormLoading(true);
      const result = await fetchCustomer(id) as Customer;
      setCustomer(result);
      form.setValues(result);
      form.resetDirty();
    } catch (error) {
      notify(MESSAGES.ERROR.FETCH, 'error');
    } finally {
      setFormLoading(false);
    }
  }


  async function onSubmit(values: Customer) {
    if (!form.isDirty()) return;

    setFormLoading(true);
    const id = customer?.id ?? '';

    try {
      const response = await fetch(`/api/proxy?path=customers/${id}`, {
        method: customer ? 'PATCH' : 'POST',
        body: JSON.stringify(values),
      });
      if (response.ok) {
        notify(MESSAGES.SUCCESS.CREATE + 'customer', 'success');
        await getData();
        form.reset();
        close();
      } else {
        throw await response.json();
      }
    } catch (error) {
      errorHandler(error as ErrorResponse, form);
    } finally {
      setFormLoading(false);
    }
  }

  useEffect(() => {
    getData().then();
  }, []);

  return (
    <CustomerContext.Provider
      value={{
        data,
        customer,
        setCustomer,
        form,
        headers,
        headersMap,
        loading,
        formLoading,
        opened,
        open,
        close,
        onSubmit,
        getData,
        getCustomer,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
}

export const useCustomer = (): CustomerContextType => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};
