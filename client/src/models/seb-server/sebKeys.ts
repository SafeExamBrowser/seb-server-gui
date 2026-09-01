export type SEBKeysAdditionalProperties = {
    ALTERNATIVE_SEB_BEK?: string;
};

export type SEBKeys = {
    id: number;
    configKeys: string[];
    browserExamKeys: string[];
    additionalProperties: SEBKeysAdditionalProperties;
};
