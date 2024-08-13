'use client';
import { initialBarang, useBarang } from '../contexts/BarangContext';
import { Flex, Box, Title, Stack } from '@mantine/core';
import TableComponent from '@/components/Table';
import AddButton from '@/components/buttons/AddButton';
import StyledOverlay from '@/components/StyledOverlay';

export default function BarangList() {
  const { form, data, headers, headersMap, loading, open, barang, setBarang, getData, getBarang } = useBarang();

  const showBarang = async (id?: number) => {
    if (id) await getBarang(id).then(() => {
      open();
    });
  };

  const createBarang = () => {
    form.setValues(initialBarang);
    setBarang(null);

    open();
  };

  return (
    <Stack align="stretch" justify="center" gap="sm">
      <Flex justify="space-between" align="center">
        <Title>Barang</Title>
        <AddButton onClick={createBarang}>Tambah</AddButton>
      </Flex>
      <Box>
        <StyledOverlay visibility={loading} />
        <TableComponent
          data={data}
          headers={headers}
          headersMap={headersMap}
          options={{
            title: 'barang',
            deletePath: 'products',
            update: showBarang,
            refreshFn: getData,
            isLoading: loading,
          }}
        />
      </Box>
    </Stack>
  );
}