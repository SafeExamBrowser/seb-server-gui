export type Institution = {
    modelId: string;
    entityType?: "INSTITUTION";
    id?: number;
    name: string;
    urlSuffix?: string;
    logoImage?: string;
    themeName?: string;
    active?: boolean;
};

export type InstitutionResponse = {
    number_of_pages: number;
    page_number: number;
    page_size: number;
    content: Institution[];
};

export type OptionalParGetInstitutions = {
    page_size?: number;
    page_number?: number;
    sort?: string;
    name?: string;
    active?: string | null;
};

export type CreateInstitutionPar = {
    name: string;
    urlSuffix?: string;
    themeName?: string;
    logoImage?: string;
};

export type EditInstitutionPar = {
    id: number;
    name: string;
    urlSuffix?: string;
    themeName?: string;
    logoImage?: string;
    active?: boolean;
};
