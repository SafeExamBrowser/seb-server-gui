export type SearchBarAction = {
    key: string;
    icon: string;
    label: string;
    tooltip?: string;
    onClick: () => void | Promise<void>;
    disabled?: () => boolean;
};
