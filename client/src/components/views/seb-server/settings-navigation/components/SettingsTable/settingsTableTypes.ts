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
