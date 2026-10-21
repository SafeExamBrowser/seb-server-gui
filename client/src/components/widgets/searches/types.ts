// Values of the URL query params a search page manages, keyed by param name.
// Missing or empty values mean the param is absent from the URL.
export type SearchQueryValues = Partial<Record<string, string>>;

export type SearchBarAction = {
    key: string;
    icon: string;
    label: string;
    tooltip?: string;
    color?: string;
    variant?: "flat" | "outlined" | "tonal" | "text";
    onClick: () => void | Promise<void>;
    disabled?: () => boolean;
};
