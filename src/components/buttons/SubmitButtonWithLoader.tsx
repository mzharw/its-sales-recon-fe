import {Button, ButtonProps, Tooltip} from "@mantine/core";
import {ComponentPropsWithoutRef} from "react";

type SubmitButton = ButtonProps & ComponentPropsWithoutRef<'button'> & {
    loading: boolean,
    tooltip?: string,
    label?: string
}

export default function SubmitButtonWithLoader({loading = false, tooltip, label = 'Submit', ...props}: SubmitButton) {
    const button = <Button type="submit" loading={loading} loaderProps={{type: 'dots'}} {...props}>{label}</Button>

    return (tooltip ? <Tooltip.Floating label={tooltip}>{button}</Tooltip.Floating> : button)
}
