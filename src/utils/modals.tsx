import {OpenConfirmModal} from "@mantine/modals/lib/context";
import {Text} from "@mantine/core";

export const modalConfirmProps: OpenConfirmModal = {
    centered: true,
    confirmProps: {color: 'red'},
    labels: {confirm: 'Delete', cancel: "Cancel"},
}

export const deleteConfirmProps: OpenConfirmModal = (name: string) => {
    return {
        ...modalConfirmProps,
        title: 'Delete confirmation',
        children: (<Text size={'sm'}>{`Are you sure want to delete ${name} ?`}</Text>),
    }
}