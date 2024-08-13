import {Button, ButtonProps} from "@mantine/core";
import {IconPlus} from "@tabler/icons-react";
import {ComponentPropsWithoutRef, ReactNode} from "react";

type AddButtonProps = ButtonProps & ComponentPropsWithoutRef<'button'> & {
    children?: ReactNode;
};

export default function AddButton({children, ...props}: AddButtonProps) {
    const icon = <IconPlus size={14}/>;
    return (
        <Button
            variant="gradient"
            leftSection={children ? icon : null}
            gradient={{from: 'blue', to: 'cyan', deg: 101}}
            {...props}
        >
            {children ?? icon}
        </Button>
    );
}