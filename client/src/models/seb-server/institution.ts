export type Institution = {
    modelId: string;
    entityType?: "INSTITUTION";
    id?: number;
    name: string;
    urlSuffix?: string;
    logoImage?: string;
    active?: boolean;
};

export type InstitutionResponse = {
    number_of_pages: number;
    page_number: number;
    page_size: number;
    content: Institution[];
};

export type CreateInstitutionPar = {
    name: string;
    urlSuffix?: string;
    logoImage?: string;
};

export type EditInstitutionPar = {
    id: number;
    name: string;
    urlSuffix?: string;
    logoImage?: string;
    active?: boolean;
};
