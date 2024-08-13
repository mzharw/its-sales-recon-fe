'use client';
import { useBarang } from '../contexts/BarangContext';
import { Modal, Box, Grid, TextInput, Group, Input, NumberInput } from '@mantine/core';
import SubmitButtonWithLoader from '@/components/buttons/SubmitButtonWithLoader';

export default function BarangModal() {
  const { opened, close, form, onSubmit, formLoading, barang } = useBarang();

  return (
    <Modal opened={opened} onClose={close} title={(barang ? 'Update' : 'Create') + ' barang'} zIndex={110}>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Box pos="relative">
          <Grid>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <TextInput
                withAsterisk
                label="Kode"
                placeholder="Kode barang"
                {...form.getInputProps('code')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <TextInput
                withAsterisk
                label="Nama"
                placeholder="Nama barang"
                {...form.getInputProps('name')}
              />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6, lg: 6 }}>
              <NumberInput
                withAsterisk
                label="Harga"
                min={0}
                hideControls
                leftSection={<small>IDR</small>}
                decimalScale={2}
                thousandSeparator
                placeholder="Harga barang"
                key={form.key('price')}
                {...form.getInputProps('price')}
              />
            </Grid.Col>
          </Grid>
          <Group justify="flex-end" mt="md">
            <SubmitButtonWithLoader loading={formLoading} />
          </Group>
        </Box>
      </form>
    </Modal>
  );
}