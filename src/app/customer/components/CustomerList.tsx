'use client';
import { useCustomer } from '../contexts/CustomerContext';
import { Flex, Box, Title, Stack } from '@mantine/core';
import TableComponent from '@/components/Table';
import AddButton from '@/components/buttons/AddButton';
import StyledOverlay from '@/components/StyledOverlay';
import { initialCustomer } from '@/app/customer/contexts/CustomerContext';

export default function CustomerList() {
  const { data, form, headers, headersMap, loading, open, getData, getCustomer, setCustomer } = useCustomer();
  const showCustomer = async (id?: number) => {
    if (id) await getCustomer(id).then(() => {
      open();
    });
  };

  const createCustomer = () => {
    form.setValues(initialCustomer);
    setCustomer(null);

    open();
  };


  return (
    <Stack align="stretch" justify="center" gap="sm">
      <Flex justify="space-between" align="center">
        <Title>Customer</Title>
        <AddButton onClick={createCustomer}>Tambah</AddButton>
      </Flex>
      <Box>
        <StyledOverlay visibility={loading} />
        <TableComponent
          data={data}
          headers={headers}
          headersMap={headersMap}
          options={{
            title: 'customer',
            deletePath: 'customers',
            update: showCustomer,
            refreshFn: getData,
            isLoading: loading,
          }}
        />
      </Box>
    </Stack>
  );
}