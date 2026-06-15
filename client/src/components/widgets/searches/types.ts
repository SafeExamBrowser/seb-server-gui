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
