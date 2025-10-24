export type AlertProps = {
    title: string;
    textKey?: string;
    color: string;
    type: string;
    timeout?: number;
    customText?: string;
};

export type ErrorProps = {
    color: string;
    textKey?: string;
    textCustom?: string;
    timeout?: number;
    details?: string;
};
