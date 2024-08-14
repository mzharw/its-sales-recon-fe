'use client';
import { TransaksiDetail, useTransaksi } from '../../contexts/TransaksiContext';
import {
  Modal,
  Box,
  Grid,
  TextInput,
  Group,
  Stack,
  Fieldset,
  Select,
  Table,
  NumberInput, ScrollArea, Button,
} from '@mantine/core';
import SubmitButtonWithLoader from '@/components/buttons/SubmitButtonWithLoader';
import { DatePickerInput } from '@mantine/dates';
import AddButton from '@/components/buttons/AddButton';
import EmptyTable from '@/components/tables/EmptyTable';
import { IconTrashX } from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { convertToNumber } from '@/utils/string';

export default function TransaksiModal() {
  const {
    transaksiModal,
    barangModal,
    barang,
    form,
    onSubmit,
    formLoading,
    customerList,
    customer,
    getCustomer,
    setBarangSelected,
  } = useTransaksi();

  const getDetail = (index: number): TransaksiDetail | undefined => {
    const details = form.getValues().details;
    return details ? details[index] : undefined;
  };

  const calculateSubtotal = (detail: TransaksiDetail | undefined): number => {
    if (!detail) {
      return 0;
    }
    return +detail.quantity * +detail.listPrice;
  };

  const calculateDiscountValue = (detail: TransaksiDetail | undefined): number => {
    if (!detail) {
      return 0;
    }

    return +detail.listPrice * (+detail.discountPercentage / 100);
  };

  const calculatePriceAfterDiscount = (detail: TransaksiDetail | undefined): number => {
    if (!detail) {
      return 0;
    }

    const discountValue = calculateDiscountValue(detail);
    detail.discountValue = discountValue;
    return (+detail.listPrice ?? discountValue) - discountValue;
  };

  const calculateTotal = (detail: TransaksiDetail | undefined): number => {
    if (!detail) {
      return 0;
    }

    detail.priceAfterDiscount = calculatePriceAfterDiscount(detail);
    const subtotal = calculateSubtotal(detail);
    const diff = subtotal - (+detail.priceAfterDiscount * +detail.quantity);

    return subtotal - diff;
  };

  const calculateDetail = (index: number, key: keyof Omit<TransaksiDetail, 'products'>, value: string): void => {
    const detail = getDetail(index);
    if (!detail) return;

    let convertedValue: number = value ? convertToNumber(value) : 0;

    if (key === 'discountPercentage' && convertedValue > 100) {
      convertedValue = 100;
    }

    detail[key] = convertedValue;

    const total = calculateTotal(detail);

    const previousTotal = detail.total || 0;
    const diff = total - previousTotal;

    detail.total = total;

    if (diff !== 0) {
      calculateSubtotalTransaksi(diff);
    }

    form.setValues(detail);
  };

  const calculateSubtotalTransaksi = (total: number) => {
    const currentSubtotal = form.getValues().subtotal || 0;
    form.setFieldValue('subtotal', currentSubtotal + total);
    calculateTotalPayment();
  };

  const calculateTotalPayment = (key: string | null = null, value: string | null = null) => {
    const values = form.getValues();

    if (key) form.setFieldValue(key, value ? convertToNumber(value) : 0);

    form.setFieldValue('totalPayment', values.subtotal - values.discount + values.shippingCost);
  };

  const removeDetail = (index: number) => {
    const detail = getDetail(index);
    if (!detail) return;

    calculateSubtotalTransaksi(-detail.total);
    form.removeListItem('details', index);
  };

  const footer = form.getValues().details?.length ? (
    <Table.Tfoot>
      <Table.Tr className={'border-b-0'}>
        <Table.Td colSpan={8}></Table.Td>
        <Table.Td>Subtotal</Table.Td>
        <Table.Td>
          <NumberInput
            min={0}
            thousandSeparator
            variant="unstyled"
            placeholder="Subtotal"
            fixedDecimalScale
            decimalScale={2}
            key={form.key(`subtotal`)}
            {...form.getInputProps(`subtotal`)}
            readOnly
          />
        </Table.Td>
      </Table.Tr>
      <Table.Tr className={'border-b-0'}>
        <Table.Td colSpan={8}></Table.Td>
        <Table.Td>Diskon</Table.Td>
        <Table.Td>
          <NumberInput
            min={0}
            hideControls
            thousandSeparator
            placeholder="Diskon"
            fixedDecimalScale
            decimalScale={2}
            key={form.key(`discount`)}
            {...form.getInputProps(`discount`)}
            onBlur={(value) => calculateTotalPayment('discount', value.currentTarget.value)}
          />
        </Table.Td>
      </Table.Tr>
      <Table.Tr className={'border-b-0'}>
        <Table.Td colSpan={8}></Table.Td>
        <Table.Td>Ongkir</Table.Td>
        <Table.Td>
          <NumberInput
            min={0}
            hideControls
            thousandSeparator
            placeholder="Ongkir"
            fixedDecimalScale
            decimalScale={2}
            key={form.key(`shippingCost`)}
            {...form.getInputProps(`shippingCost`)}
            onBlur={(value) => calculateTotalPayment('shippingCost', value.currentTarget.value)}
          />
        </Table.Td>
      </Table.Tr>
      <Table.Tr className={'border-b-0'}>
        <Table.Td colSpan={8}></Table.Td>
        <Table.Td>Total Bayar</Table.Td>
        <Table.Td>
          <NumberInput
            min={0}
            thousandSeparator
            variant="unstyled"
            placeholder="Total bayar"
            fixedDecimalScale
            decimalScale={2}
            key={form.key(`totalPayment`)}
            {...form.getInputProps(`totalPayment`)}
            readOnly
          />
        </Table.Td>
      </Table.Tr>
    </Table.Tfoot>) : <Table.Caption><EmptyTable /></Table.Caption>;

  const customerInfo = customer.id ? (<>
    <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
      <TextInput
        label="Kode"
        placeholder="Kode customer"
        value={customer.code}
        disabled
      />
    </Grid.Col>
    <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
      <TextInput
        label="Telp"
        placeholder="Telp customer"
        value={customer.telp}
        disabled
      />
    </Grid.Col></>) : null;

  let i = 1;
  const barangDetails = form.getValues().details?.map((detail: TransaksiDetail, index: number) => {
    return (
      <Table.Tr key={index + 'details'}>
        <Table.Td>
          <Button onClick={() => modals.openConfirmModal({
            title: 'Confirm delete barang',
            confirmProps: { color: 'red' },
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            onConfirm: () => removeDetail(index),
          })}
                  size={'compact-sm'} variant={'light'}
                  color={'red'}
                  type={'button'}>
            <IconTrashX size={'20'} />
          </Button>
        </Table.Td>
        <Table.Td>
          {i++}
        </Table.Td>
        <Table.Td>
          {barang[index]?.code}
        </Table.Td>
        <Table.Td>
          {barang[index]?.name}
        </Table.Td>
        <Table.Td>
          <NumberInput
            min={0}
            allowNegative={false}
            allowDecimal={false}
            thousandSeparator
            hideControls
            placeholder="Qty"
            key={form.key(`details.${index}.quantity`)}
            {...form.getInputProps(`details.${index}.quantity`)}
            onBlur={(value) => calculateDetail(index, 'quantity', value.currentTarget.value)}
          />
        </Table.Td>
        <Table.Td>
          <NumberInput
            min={0}
            thousandSeparator
            decimalScale={2}
            variant="unstyled"
            placeholder="Harga bandrol"
            key={form.key(`details.${index}.listPrice`)}
            {...form.getInputProps(`details.${index}.listPrice`)}
            readOnly
          />
        </Table.Td>
        <Table.Td>
          <NumberInput
            min={0}
            max={100}
            allowNegative={false}
            thousandSeparator
            placeholder="% Diskon"
            rightSection={<small>%</small>}
            key={form.key(`details.${index}.discountPercentage`)}
            {...form.getInputProps(`details.${index}.discountPercentage`)}
            onBlur={(value) => calculateDetail(index, 'discountPercentage', value.currentTarget.value)}
          />
        </Table.Td>
        <Table.Td>
          <NumberInput
            min={0}
            thousandSeparator
            variant="unstyled"
            placeholder="Jumlah diskon"
            decimalScale={2}
            fixedDecimalScale
            key={form.key(`details.${index}.discountValue`)}
            {...form.getInputProps(`details.${index}.discountValue`)}
            readOnly
          />
        </Table.Td>
        <Table.Td>
          <NumberInput
            min={0}
            thousandSeparator
            variant="unstyled"
            placeholder="Harga diskon"
            fixedDecimalScale
            decimalScale={2}
            key={form.key(`details.${index}.priceAfterDiscount`)}
            {...form.getInputProps(`details.${index}.priceAfterDiscount`)}
            readOnly
          />
        </Table.Td>
        <Table.Td>
          <NumberInput
            min={0}
            thousandSeparator
            variant="unstyled"
            placeholder="Total"
            fixedDecimalScale
            decimalScale={2}
            key={form.key(`details.${index}.total`)}
            {...form.getInputProps(`details.${index}.total`)}
            readOnly
          />
        </Table.Td>
      </Table.Tr>
    );
  });

  const transaksiBarangHeader = (
    <Table.Thead>
      <Table.Tr>
        <Table.Th rowSpan={2}>
          <AddButton size={'compact-md'} onClick={() => {
            transaksiModal.close();
            barangModal.open();
            setBarangSelected(null);
          }}>
            <small>Add</small>
          </AddButton>
        </Table.Th>
        <Table.Th rowSpan={2}>No</Table.Th>
        <Table.Th rowSpan={2}>Kode Barang</Table.Th>
        <Table.Th rowSpan={2}>Nama Barang</Table.Th>
        <Table.Th rowSpan={2}>Qty</Table.Th>
        <Table.Th rowSpan={2}>Harga Bandrol</Table.Th>
        <Table.Th colSpan={2}>Diskon</Table.Th>
        <Table.Th rowSpan={2}>Harga Diskon</Table.Th>
        <Table.Th rowSpan={2}>Total</Table.Th>
      </Table.Tr>
      <Table.Tr>
        <Table.Th>(%)</Table.Th>
        <Table.Th>(Rp.)</Table.Th>
      </Table.Tr>
    </Table.Thead>
  );

  return (
    <Modal size={'80%'} opened={transaksiModal.opened} onClose={transaksiModal.close} title="Create transaksi"
           zIndex={110}>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Box pos="relative">
          <Stack gap={'md'}>
            <Fieldset legend="Transaksi">
              <Grid>
                <Grid.Col span={12}>
                  <TextInput
                    withAsterisk
                    label="No."
                    description={'No transaksi will be auto-generated by system after submitted'}
                    disabled
                  />
                </Grid.Col>
                <Grid.Col span={12}>
                  <DatePickerInput
                    withAsterisk
                    label="Tanggal"
                    placeholder="Pilih tanggal transaksi"
                    {...form.getInputProps('date')}
                    // value={date}
                    // onChange={setDate}
                  />
                </Grid.Col>
              </Grid>
            </Fieldset>
            <Fieldset legend={'Customer'}>
              <Grid>
                <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
                  <Select
                    withAsterisk
                    data={customerList}
                    label={'Customer'}
                    value={customer.id}
                    error={form.errors.customerId}
                    placeholder={'Pilih customer'}
                    onChange={getCustomer}
                  />
                </Grid.Col>
                {customerInfo}
              </Grid>
            </Fieldset>
            <ScrollArea>
              <Table stickyHeader captionSide="bottom">
                {transaksiBarangHeader}
                <Table.Tbody className={'border-b'}>
                  {barangDetails}
                </Table.Tbody>
                {footer}
              </Table>
            </ScrollArea>
          </Stack>

          <Group justify="flex-end" mt="md">
            <SubmitButtonWithLoader
              loading={formLoading}
              tooltip={form.getValues().details?.length ? '' : 'You have to add atleast 1 barang'}
              color={form.getValues().details?.length ? 'blue' : 'yellow'}
            />
          </Group>
        </Box>
      </form>
    </Modal>
  )
    ;
}