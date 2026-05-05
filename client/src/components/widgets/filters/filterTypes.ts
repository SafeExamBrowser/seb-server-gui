export type FilterOption = {
    value: string;
    label: string;
    color?: string;
};

export type FilterSectionDef = {
    key: string;
    title: string;
    options: FilterOption[];
    // Suffix used when composing data-testid attributes (e.g. "statusFilter"
    // produces `${prefix}-statusFilter-chip-Active`). Falls back to `key`.
    testIdSuffix?: string;
};
