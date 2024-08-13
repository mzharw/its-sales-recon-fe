import { Text } from '@mantine/core';

export const modalConfirmProps = {
  centered: true,
  confirmProps: { color: 'red' },
  labels: { confirm: 'Delete', cancel: 'Cancel' },
};

export const deleteConfirmProps = (name: string) => {
  return {
    ...modalConfirmProps,
    title: 'Delete confirmation',
    children: (<Text size={'sm'}>{`Are you sure want to delete ${name} ?`}</Text>),
  };
};