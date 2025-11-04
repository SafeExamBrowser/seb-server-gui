export type IndicatorTransient = {
    id: number;
    examTemplateId?: number;
    name?: string;
    type?: string;
    // TODO @alain: thresholds
};

// TODO @alain: derive this from a zod schema
export type Indicator = {
    id: number;
    examTemplateId?: number;
    name: string;
    type: string;
    // TODO @alain: thresholds
};
