import {notifications} from "@mantine/notifications";
import {
    IconX,
    IconCheck,
} from "@tabler/icons-react";

type Context = 'success' | 'error';

export function notify(msg: string, context: Context): void {
    const colors = {
        success: "green",
        error: "red"
    }

    const titles = {
        success: "Success",
        error: "Error",
    }

    const icons = {
        success: <IconCheck/>,
        error: <IconX/>,
    }

    notifications.show({
        title: titles[context],
        message: msg,
        icon: icons[context],
        color: colors[context]
    })
}