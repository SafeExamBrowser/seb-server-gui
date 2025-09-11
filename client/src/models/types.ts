// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ServerTablePaging = {
    page: number;
    itemsPerPage: number;
    sortBy: { key: string; order: string }[];
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type GridSize = {
    title: string;
    value: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type NavigationItem = {
    title: string;
    route: string;
    icon: string;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ImportWizardSteps = {
    name: string;
    value: number;
    type?: string;
};
