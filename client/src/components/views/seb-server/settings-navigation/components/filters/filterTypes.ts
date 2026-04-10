export type FilterOption = {
    value: string;
    label: string;
    color?: string;
};

export type FilterSectionDef = {
    key: string;
    title: string;
    options: FilterOption[];
};
