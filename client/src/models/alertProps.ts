// eslint-disable-next-line @typescript-eslint/no-unused-vars
type AlertProps = {
    title: string;
    textKey?: string;
    color: string;
    type: string;
    timeout?: number;
    customText?: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ErrorProps = {
    color: string;
    textKey?: string;
    textCustom?: string;
    timeout?: number;
    details?: string;
};
