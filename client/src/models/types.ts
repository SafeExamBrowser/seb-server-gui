export type ServerTablePaging = {
    page: number;
    itemsPerPage: number;
    sortBy: { key: string; order: string }[];
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
