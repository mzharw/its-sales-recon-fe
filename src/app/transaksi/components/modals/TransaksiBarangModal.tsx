'use client';
import { useTransaksi } from '../../contexts/TransaksiContext';
import { Modal, Grid, TextInput, Group, Select, NumberInput } from '@mantine/core';
import SubmitButtonWithLoader from '@/components/buttons/SubmitButtonWithLoader';
import { Barang } from '@/app/barang/contexts/BarangContext';

export default function TransaksiBarangModal() {
  const {
    transaksiModal,
    barangModal,
    form,
    barangList,
    barang,
    formLoading,
    barangSelected,
    getBarang,
    onSubmit,
    setBarangSelected,
  } = useTransaksi();

  function setBarangValue(col: keyof Barang) {
    return barangSelected ? String(barang[+barangSelected][col]) : '';
  }

  const barangInfo = barangSelected ? (<>
    <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
      <TextInput
        label="Kode"
        placeholder="Kode barang"
        value={setBarangValue('code')}
        disabled
      />
    </Grid.Col>
    <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
      <NumberInput
        label="Harga"
        min={0}
        hideControls
        leftSection={<small>IDR</small>}
        decimalScale={2}
        thousandSeparator
        placeholder="Harga barang"
        value={setBarangValue('price')}
        disabled
      />
    </Grid.Col></>) : null;

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Modal size={'xl'} opened={barangModal.opened} onClose={() => {
        transaksiModal.open();
        barangModal.close();
      }} title="Add barang" zIndex={110}>
        <Grid>
          <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
            <Select
              withAsterisk
              data={barangList}
              label={'Barang'}
              value={barangSelected}
              placeholder={'Pilih barang'}
              onChange={getBarang}
            />
          </Grid.Col>
          {barangInfo}
        </Grid>
        <Group justify="flex-end" mt="md">
          <SubmitButtonWithLoader
            loading={formLoading}
            tooltip={barangSelected ? '' : 'You have to add atleast 1 barang'}
            label={'Add'}
            disabled={!barangSelected}
            type={'button'}
            onClick={() => {
              if (barangSelected && barang) {
                form.insertListItem('details', {
                  productId: +setBarangValue('id'),
                  listPrice: +setBarangValue('price'),
                  quantity: 0,
                  discountPercentage: 0,
                  discountValue: 0,
                  priceAfterDiscount: 0,
                  total: 0,
                });
              }

              barangModal.close();
              transaksiModal.open();
            }}
          />
        </Group>
      </Modal>
    </form>
  );
}