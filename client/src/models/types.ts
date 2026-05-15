export type ServerTablePaging = {
    page: number;
    itemsPerPage: number;
    // TODO @andrei: this should use the SortOrder type, which is stricter (the key can't be any string, but just some specific strings)
    sortBy: { key: string; order: string }[];
};

export type SettingsFilterOption = {
    label: string;
    value: string;
};

export type SettingsFilterDefinition = {
    key: string;
    title: string;
    options: SettingsFilterOption[];
    visible?: boolean;
};

export type GridSize = {
    title: string;
    value: number;
};

export type NavigationItem = {
    title: string;
    route: string;
    icon: string;
};
