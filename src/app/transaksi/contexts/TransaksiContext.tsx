'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode, SetStateAction, Dispatch } from 'react';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { notify } from '@/utils/notifications';
import { MESSAGES } from '@/constants/messages';
import { errorHandler, validator } from '@/utils/form';
import { generateHeaders } from '@/utils/table';
import { fetchTransaksi } from '../services/fetch';
import { HeaderProps } from '@/components/Table';
import { Customer } from '@/app/customer/contexts/CustomerContext';
import { fetchCustomer } from '@/app/customer/services/fetch';
import { ComboboxItem } from '@mantine/core';
import { ErrorResponse, ModalContext } from '@/types';
import { Barang } from '@/app/barang/contexts/BarangContext';
import { fetchBarang } from '@/app/barang/services/fetch';

export interface TransaksiDetail {
  id?: number;
  productId: number;
  listPrice: number;
  quantity: number;
  discountPercentage: number;
  discountValue: number;
  priceAfterDiscount: number;
  total: number;
  products?: Barang;
}

export interface Transaksi {
  id?: number;
  code: string;
  date: number | string | Date;
  customerId: string;
  customerName: string;
  subtotal: number;
  discount: number;
  shippingCost: number;
  totalPayment: number;
  totalDetails: number;
  details?: TransaksiDetail[];
  customers?: Customer | null;
}

const initialTransaksi: Transaksi = {
  code: '',
  date: new Date(),
  customerId: '',
  subtotal: 0,
  discount: 0,
  shippingCost: 0,
  totalPayment: 0,
  totalDetails: 0,
  details: [],
  customers: null,
  customerName: '',
};

export type TransaksiCols = typeof transaksiCols[number];
const transaksiCols = [
  'no_transaksi',
  'tanggal',
  'nama_customer',
  'jumlah_barang',
  'subtotal',
  'diskon',
  'ongkir',
  'total'] as const;

interface TransaksiContextType {
  data: Transaksi[];
  transaksi: Transaksi | null;
  customer: Omit<Customer, 'name'>;
  customerList: ComboboxItem[];
  barangSelected: string | null;
  barangList: ComboboxItem[];
  barang: { [key: string]: Barang };
  form: ReturnType<typeof useForm<Transaksi>>;
  headers: HeaderProps;
  headersMap: Record<TransaksiCols, keyof Transaksi>;
  loading: boolean;
  formLoading: boolean;
  transaksiModal: ModalContext;
  barangModal: ModalContext;
  detailModal: ModalContext;
  onSubmit: (values: Transaksi) => Promise<void>;
  getData: () => Promise<void>;
  getTransaksi: (id: number) => Promise<void>;
  getCustomer: (key: string | null) => void;
  getBarang: (key: string | null) => void;
  setBarangSelected: Dispatch<SetStateAction<string | null>>;
}

const TransaksiContext = createContext<TransaksiContextType | null>(null);

export function TransaksiProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Transaksi[]>([]);
  const [transaksi, setTransaksi] = useState<Transaksi | null>(null);
  const [customer, setCustomer] = useState<Omit<Customer, 'name'>>(
    {
      id: null,
      code: '',
      telp: '',
    },
  );
  const [customerData, setCustomerData] = useState<Customer[]>([]);
  const [customerList, setCustomerList] = useState<ComboboxItem[]>([]);
  const [barang, _setBarang] = useState<{ [key: string]: Barang }>({});
  const [barangData, setBarangData] = useState<Barang[]>([]);
  const [barangList, setBarangList] = useState<ComboboxItem[]>([]);
  const [barangSelected, setBarangSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [transaksiModalOpened, { open: openTransaksiModal, close: closeTransaksiModal }] = useDisclosure(false);
  const [barangModalOpened, { open: openBarangModal, close: closeBarangModal }] = useDisclosure(false);
  const [detailModalOpened, { open: openDetailModal, close: closeDetailModal }] = useDisclosure(false);


  const form = useForm<Transaksi>({
    initialValues: initialTransaksi,
    validateInputOnChange: true,
    validate: {
      // code: (value) => validator('Kode', value, 'REQUIRED', 'MAX_LENGTH:10', 'MIN_LENGTH:1'),
      customerId: (value) => validator('Customer', value, 'REQUIRED'),
      date: (value) => validator('Tanggal', value, 'REQUIRED'),
      subtotal: (value) => validator('Subtotal', value, 'REQUIRED', 'MIN_VALUE:0'),
      discount: (value) => validator('Diskon', value, 'REQUIRED', 'MIN_VALUE:0'),
      shippingCost: (value) => validator('Ongkir', value, 'REQUIRED', 'MIN_VALUE:0'),
      totalPayment: (value) => validator('Total bayar', value, 'REQUIRED', 'MIN_VALUE:0'),
      details: {
        quantity: (value: number) => validator('Qty', value, 'REQUIRED', 'MIN_EQUAL_VALUE:0'),
        productId: (value: number) => validator('Barang', value, 'REQUIRED'),
        listPrice: (value: number) => validator('Harga bandrol', value, 'REQUIRED', 'MIN_EQUAL_VALUE:0'),
        discountValue: (value: number) => validator('Jumlah diskon', value, 'REQUIRED', 'MIN_VALUE:0'),
        discountPercentage: (value: number) => validator('Persentase diskon', value, 'REQUIRED', 'MIN_VALUE:0', 'MAX_EQUAL_VALUE:100'),
        priceAfterDiscount: (value: number) => validator('Harga diskon', value, 'REQUIRED', 'MIN_VALUE:0'),
        total: (value: number) => validator('Total', value, 'REQUIRED', 'MIN_VALUE:0'),
      },
    },
  });

  const headers: HeaderProps = generateHeaders(...transaksiCols);

  const headersMap: Record<TransaksiCols, keyof Transaksi> = {
    no_transaksi: 'code', jumlah_barang: 'totalDetails', subtotal: 'subtotal',
    ongkir: 'shippingCost', nama_customer: 'customerName', diskon: 'discount',
    tanggal: 'date', total: 'totalPayment',
  };

  async function getData() {
    setLoading(true);
    try {
      const result = await fetchTransaksi() as Transaksi[];
      setData(result);
    } catch (error) {
      notify(MESSAGES.ERROR.FETCH, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function getTransaksi(id: number) {
    setLoading(true);
    try {
      const result = await fetchTransaksi(id) as Transaksi;
      setTransaksi(result);
    } catch (error) {
      notify(MESSAGES.ERROR.FETCH, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function getCustomerData() {
    setLoading(true);
    try {
      const result = await fetchCustomer() as Customer[];
      setCustomerData(result);

      const customerOptions = result.map((value: Customer, index: number) => ({
        value: String(index),
        label: value.name,
      }));

      setCustomerList(customerOptions);

    } catch (error) {
      notify(MESSAGES.ERROR.FETCH, 'error');
    } finally {
      setLoading(false);
    }
  }

  async function getBarangData() {
    setFormLoading(true);
    try {
      const result = await fetchBarang() as Barang[];
      setBarangData(result);

      const barangOptions = result.map((value: Barang, index: number) => ({
        value: String(index),
        label: value.name,
      }));

      setBarangList(barangOptions);

    } catch (error) {
      notify(MESSAGES.ERROR.FETCH, 'error');
    } finally {
      setFormLoading(false);
    }
  }

  async function onSubmit(values: Transaksi) {
    setFormLoading(true);
    try {
      const response = await fetch('/api/proxy?path=sales', {
        method: 'POST',
        body: JSON.stringify(values),
      });
      if (response.ok) {
        notify(MESSAGES.SUCCESS.CREATE + 'transaksi', 'success');
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

  function getCustomer(value: string | null) {
    let customer = null;
    if (value) customer = customerData.at(+value);

    form.setFieldValue('customerId', customer?.id ?? '');

    setCustomer({
      id: value ?? null,
      code: customer?.code ?? '',
      telp: customer?.telp ?? '',
    });
  }

  function getBarang(value: string | null) {
    let data = null;
    if (value) data = barangData.at(+value);

    if (value && data) {
      barang[+value] = data;
    }

    setBarangSelected(value);

  }

  const transaksiModal: ModalContext = {
    opened: transaksiModalOpened,
    open: openTransaksiModal,
    close: closeTransaksiModal,
  };

  const barangModal: ModalContext = {
    opened: barangModalOpened,
    open: openBarangModal,
    close: closeBarangModal,
  };

  const detailModal: ModalContext = {
    opened: detailModalOpened,
    open: openDetailModal,
    close: closeDetailModal,
  };

  useEffect(() => {
    getData();
    getCustomerData();
    getBarangData();
  }, []);

  return (
    <TransaksiContext.Provider
      value={{
        data,
        transaksi,
        customer,
        customerList,
        barang,
        barangList,
        barangSelected,
        form,
        headers,
        headersMap,
        loading,
        formLoading,
        transaksiModal,
        barangModal,
        detailModal,
        onSubmit,
        getData,
        getTransaksi,
        getCustomer,
        getBarang,
        setBarangSelected,
      }}
    >
      {children}
    </TransaksiContext.Provider>
  );
}

export const useTransaksi = (): TransaksiContextType => {
  const context = useContext(TransaksiContext);
  if (!context) {
    throw new Error('useTransaksi must be used within a TransaksiProvider');
  }
  return context;
};
