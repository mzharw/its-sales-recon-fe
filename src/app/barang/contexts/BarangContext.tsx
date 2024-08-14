'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode, Dispatch, SetStateAction } from 'react';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notify } from '@/utils/notifications';
import { MESSAGES } from '@/constants/messages';
import { errorHandler, validator } from '@/utils/form';
import { generateHeaders } from '@/utils/table';
import { fetchBarang } from '../services/fetch';
import { HeaderProps } from '@/components/Table';
import { ErrorResponse } from '@/types';
import { fetchWithProxy } from '@/utils/fetch';

export interface Barang {
  id?: string | null;
  code: string;
  name: string;
  price: number;
}

export const initialBarang: Barang = {
  code: '',
  name: '',
  price: 0,
};

type BarangCols = typeof barangCols[number];
const barangCols = ['kode', 'nama', 'harga'] as const;

interface BarangContextType {
  data: Barang[];
  barang: Barang | null;
  setBarang: Dispatch<SetStateAction<Barang | null>>;
  form: ReturnType<typeof useForm<Barang>>;
  headers: HeaderProps;
  headersMap: Record<BarangCols, keyof Barang>;
  loading: boolean;
  formLoading: boolean;
  opened: boolean;
  open: () => void;
  close: () => void;
  onSubmit: (values: Barang) => Promise<void>;
  getData: () => Promise<void>;
  getBarang: (id: number) => Promise<void>;
}

const BarangContext = createContext<BarangContextType | null>(null);

export function BarangProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Barang[]>([]);
  const [barang, setBarang] = useState<Barang | null>(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm<Barang>({
    initialValues: initialBarang,
    validate: {
      code: (value) => validator('Kode', value, 'REQUIRED', 'MAX_LENGTH:10', 'MIN_LENGTH:1'),
      name: (value) => validator('Nama', value, 'REQUIRED', 'MAX_LENGTH:100', 'MIN_LENGTH:1'),
      price: (value) => validator('Harga', value, 'REQUIRED', 'MIN_EQUAL_VALUE:0'),
    },
  });

  const headers: HeaderProps = generateHeaders(...barangCols);
  const headersMap: Record<BarangCols, keyof Barang> = { kode: 'code', nama: 'name', harga: 'price' };

  async function getData() {
    setLoading(true);
    try {
      const result = await fetchBarang() as Barang[];
      setData(result);
    } catch (error) {
      notify(MESSAGES.ERROR.FETCH, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function getBarang(id: number) {
    setFormLoading(true);
    try {
      const result = await fetchBarang(id) as Barang;
      setBarang(result);
      form.setValues({ ...result, price: +result.price });
      form.resetDirty();
    } catch (error) {
      notify(MESSAGES.ERROR.FETCH, 'error');
    } finally {
      setFormLoading(false);
    }
  }

  async function onSubmit(values: Barang) {
    if (!form.isDirty()) return;

    setFormLoading(true);
    const id = barang?.id ?? '';

    try {
      const response = await fetchWithProxy(`products/${id}`, {
        method: barang ? 'PATCH' : 'POST',
        body: JSON.stringify(values),
      });

      if (response.ok) {
        notify(MESSAGES.SUCCESS.CREATE + 'barang', 'success');
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
    getData();
  }, []);

  return (
    <BarangContext.Provider
      value={{
        data,
        barang,
        setBarang,
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
        getBarang,
      }}
    >
      {children}
    </BarangContext.Provider>
  );
}

export const useBarang = (): BarangContextType => {
  const context = useContext(BarangContext);
  if (!context) {
    throw new Error('useBarang must be used within a BarangProvider');
  }
  return context;
};
