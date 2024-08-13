'use client';
import { useTransaksi } from '../../contexts/TransaksiContext';
import { Box, Modal, NumberInput, ScrollArea, Table } from '@mantine/core';
import EmptyTable from '@/components/tables/EmptyTable';
import { serializeData } from '@/utils/table';

export default function TransaksiDetailModal() {
  const {
    form,
    detailModal,
    transaksi,
    loading,
    onSubmit,
  } = useTransaksi();

  const dataBarang = transaksi?.details?.map((barang, index) => (
    <Table.Tr key={'transaksi_detail_' + index}>
      <Table.Td>{index + 1}</Table.Td>
      <Table.Td>{barang.products?.code}</Table.Td>
      <Table.Td>{barang.products?.name}</Table.Td>
      <Table.Td>{barang.quantity}</Table.Td>
      <Table.Td>{barang.listPrice}</Table.Td>
      <Table.Td>{barang.discountPercentage}</Table.Td>
      <Table.Td>{barang.discountValue}</Table.Td>
      <Table.Td>{barang.priceAfterDiscount}</Table.Td>
      <Table.Td>{barang.total}</Table.Td>
    </Table.Tr>
  ));

  const detailBarang = transaksi?.details?.length ? (
    <Table>
      <Table.Thead>
        <Table.Tr>
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
      <Table.Tbody>
        {dataBarang}
      </Table.Tbody>
      <Table.Tfoot>
        <Table.Tr className={'border-b-0'}>
          <Table.Td colSpan={7}></Table.Td>
          <Table.Td>Subtotal</Table.Td>
          <Table.Td>
            <NumberInput
              min={0}
              thousandSeparator
              variant="unstyled"
              placeholder="Subtotal"
              value={transaksi.subtotal}
              fixedDecimalScale
              decimalScale={2}
              readOnly
            />
          </Table.Td>
        </Table.Tr>
        <Table.Tr className={'border-b-0'}>
          <Table.Td colSpan={7}></Table.Td>
          <Table.Td>Diskon</Table.Td>
          <Table.Td>
            <NumberInput
              min={0}
              hideControls
              thousandSeparator
              placeholder="Diskon"
              fixedDecimalScale
              value={transaksi.discount}
              decimalScale={2}
              variant="unstyled"
              readOnly
            />
          </Table.Td>
        </Table.Tr>
        <Table.Tr className={'border-b-0'}>
          <Table.Td colSpan={7}></Table.Td>
          <Table.Td>Ongkir</Table.Td>
          <Table.Td>
            <NumberInput
              min={0}
              hideControls
              thousandSeparator
              placeholder="Ongkir"
              fixedDecimalScale
              value={transaksi.shippingCost}
              decimalScale={2}
              variant="unstyled"
              readOnly
            />
          </Table.Td>
        </Table.Tr>
        <Table.Tr className={'border-b-0'}>
          <Table.Td colSpan={7}></Table.Td>
          <Table.Td>Total Bayar</Table.Td>
          <Table.Td>
            <NumberInput
              min={0}
              thousandSeparator
              placeholder="Total bayar"
              fixedDecimalScale
              value={transaksi.totalPayment}
              decimalScale={2}
              variant="unstyled"
              readOnly
            />
          </Table.Td>
        </Table.Tr>
      </Table.Tfoot>
    </Table>
  ) : null;

  const detailComponent = loading ? (
    <EmptyTable />
  ) : (
    <>
      <Table width={'100%'}>
        <Table.Tbody>
          <Table.Tr>
            <Table.Th>Tanggal transaksi</Table.Th>
            <Table.Td>{transaksi?.date ? serializeData(String(transaksi.date)) : ''}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>Kode transaksi</Table.Th>
            <Table.Td>{transaksi?.code}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>Nama customer</Table.Th>
            <Table.Td>{transaksi?.customerName}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>Jumlah barang</Table.Th>
            <Table.Td>{transaksi?.details?.length}</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
      {detailBarang}
    </>
  );

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Modal size={'xl'} opened={detailModal.opened} onClose={() => {
        detailModal.close();
      }} title={'View detail'} zIndex={110}>
        <Box className={'overflow-auto'}>
          {detailComponent}
        </Box>
      </Modal>
    </form>
  );
}