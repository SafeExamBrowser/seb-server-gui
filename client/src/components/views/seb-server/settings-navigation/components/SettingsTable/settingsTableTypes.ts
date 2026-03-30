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
