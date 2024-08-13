'use client';
import { useTransaksi } from '../contexts/TransaksiContext';
import { Flex, Box, Title, Stack } from '@mantine/core';
import TableComponent from '@/components/Table';
import AddButton from '@/components/buttons/AddButton';
import StyledOverlay from '@/components/StyledOverlay';

export default function TransaksiList() {
  const { data, headers, headersMap, loading, transaksiModal, detailModal, getData, getTransaksi } = useTransaksi();

  const viewTransaksi = async (id?: string) => {
    if (id) await getTransaksi(+id).then(() => detailModal.open());
  };

  return (
    <Stack align="stretch" justify="center" gap="sm">
      <Flex justify="space-between" align="center">
        <Title>Transaksi</Title>
        <AddButton onClick={transaksiModal.open}>Tambah</AddButton>
      </Flex>
      <Box>
        <StyledOverlay visibility={loading} />
        <TableComponent
          data={data}
          headers={headers}
          headersMap={headersMap}
          options={{
            title: 'transaksi',
            view: viewTransaksi,
            refreshFn: getData,
            isLoading: loading,
          }}
        />
      </Box>
    </Stack>
  );
}