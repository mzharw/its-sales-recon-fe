'use client';
import {useCustomer} from '../contexts/CustomerContext';
import {Modal, Box, Grid, TextInput, Group, Input} from '@mantine/core';
import {IMaskInput} from 'react-imask';
import SubmitButtonWithLoader from '@/components/buttons/SubmitButtonWithLoader';

export default function CustomerModal() {
    const {opened, close, form, onSubmit, formLoading, customer} = useCustomer();

    return (
        <Modal opened={opened} onClose={close} title={(customer ? 'Update' : 'Create') + ' customer'} zIndex={110}>
            <form onSubmit={form.onSubmit(onSubmit)}>
                <Box pos="relative">
                    <Grid>
                        <Grid.Col span={{base: 12, md: 6, lg: 6}}>
                            <TextInput
                                withAsterisk
                                label="Kode"
                                placeholder="Kode customer"
                                {...form.getInputProps('code')}
                            />
                        </Grid.Col>
                        <Grid.Col span={{base: 12, md: 6, lg: 6}}>
                            <TextInput
                                withAsterisk
                                label="Nama"
                                placeholder="Nama customer"
                                {...form.getInputProps('name')}
                            />
                        </Grid.Col>
                        <Grid.Col span={{base: 12, md: 6, lg: 6}}>
                            <Input.Wrapper
                                label="No Telp"
                                description="Nomor telepon"
                                error={form.errors.telp}
                                required
                            >
                                <Input
                                    component={IMaskInput}
                                    mask="+62-{000-0000-0000}"
                                    placeholder="No Telp customer"
                                    {...form.getInputProps('telp')}
                                />
                            </Input.Wrapper>
                        </Grid.Col>
                    </Grid>
                    <Group justify="flex-end" mt="md">
                        <SubmitButtonWithLoader loading={formLoading}/>
                    </Group>
                </Box>
            </form>
        </Modal>
    );
}