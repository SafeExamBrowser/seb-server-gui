export type ServerTablePaging = {
    page: number;
    itemsPerPage: number;
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

export type ImportWizardSteps = {
    name: string;
    value: number;
    type?: string;
};
