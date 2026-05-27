export type TableHeader = {
    title: string;
    key: string;
    width?: string;
    sortable?: boolean;
    align?: "start" | "center" | "end";
};

export type TableFilters = Record<string, string | null>;

export type LoadItemsFn = () => Promise<void>;

export type TableItem = Record<string, unknown>;

export type CellFormatter = (value: unknown, item: TableItem) => string;

export interface TableAction<T extends TableItem = TableItem> {
    key: string;
    icon: string;
    label: string;
    tooltip?: string;
    color?: string;
    onClick: (item: T) => void | Promise<void>;
    visible?: (item: T) => boolean;
    disabled?: (item: T) => boolean;
}
