import { ServerTablePaging } from "@/models/types.ts";
import type { ComputedRef, Ref } from "vue";

// if you have a type that you need to have translated, add it here and add logic to formatterMap in useSettingsTableCellFormatter.ts
export type HeaderTranslateType =
    | "institutionName"
    | "dateTime"
    | "assessmentToolType"
    | "certificateTypes";

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

export type LoadItemsFn = (params: {
    options: ServerTablePaging;
    searchField: string | null;
    filters: TableFilters;
}) => Promise<void>;

export type TableItem = Record<string, unknown>;

export type CellFormatter = (value: unknown, item: TableItem) => string;

export type UseSettingsTableCellFormattersParams = {
    headers: Ref<SettingsTableHeader[]> | ComputedRef<SettingsTableHeader[]>;
};
