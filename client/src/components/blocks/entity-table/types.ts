import type { ComputedRef, Ref } from "vue";

export type HeaderTranslateType =
    | "institutionName"
    | "dateTime"
    | "assessmentToolType"
    | "certificateTypes"
    | "examType"
    | "examStatus";

export type SettingsTableHeader = {
    title: string;
    key: string;
    width?: string;
    sortable?: boolean;
    translateType?: HeaderTranslateType;
};

export type PagedResponse = {
    number_of_pages?: number;
    page_size?: number;
    content?: unknown[];
};

export type TableFilters = Record<string, string | null>;

export type LoadItemsFn = () => Promise<void>;

export type TableItem = Record<string, unknown>;

export type CellFormatter = (value: unknown, item: TableItem) => string;

export type UseSettingsTableCellFormattersParams = {
    headers: Ref<SettingsTableHeader[]> | ComputedRef<SettingsTableHeader[]>;
};
