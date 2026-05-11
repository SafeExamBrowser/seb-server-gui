export type Institution = {
    modelId: string;
    entityType?: "INSTITUTION";
    name: string;
};

export type InstitutionAdmin = {
    id: number;
    name: string;
    urlSuffix?: string;
    logoImage?: string;
    active?: boolean;
};

export type InstitutionResponse = {
    number_of_pages: number;
    page_number: number;
    page_size: number;
    content: InstitutionAdmin[];
};

export type CreateInstitutionPar = {
    name: string;
    urlSuffix?: string;
    logoImage?: File | string;
};

export type EditInstitutionPar = {
    id: number;
    name: string;
    urlSuffix?: string;
    logoImage?: File | string;
    active?: boolean;
};
