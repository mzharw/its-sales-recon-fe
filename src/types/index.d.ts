export interface ModalContext {
    opened: boolean;
    open: () => void;
    close: () => void;
}

export interface ErrorResponse {
    statusCode: number | string,
    message: string[] | string,
    error: string
}