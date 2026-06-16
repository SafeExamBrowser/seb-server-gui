export type FilterOption = {
    value: string;
    label: string;
    color?: string;
    count?: number;
};

export type FilterSectionDef = {
    key: string;
    title: string;
    options: FilterOption[];
    // When true, several options can be selected at once. The selected values
    // are stored comma-separated under the section key (This is per my knowledge only supported for Exam Type ATM. , we will commit it for the demo and see how ppl respond)
    // TODO Andrei verify if desired for more endpoints
    multiple?: boolean;
    testIdSuffix?: string;
};
