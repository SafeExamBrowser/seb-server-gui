import { z } from "zod";

export type IndicatorTransient = {
    id: number;
    examTemplateId?: number; // TODO @alain: is this even needed here? I don't think so?
    name?: string;
    type?: string; // TODO @alain: type needs to be more narrow (limited enum values)
    // TODO @alain: thresholds
};

const indicatorSchema = z.object({
    id: z.number(),
    name: z.string(),
    type: z.string().optional(), // TODO @alain: fix type (discriminated union based on enum)
    // TODO @alain: thresholds
});

export type Indicator = z.infer<typeof indicatorSchema>;

export const indicatorTransientToIndicator = (
    indicatorTransient: IndicatorTransient,
): Indicator => {
    return indicatorSchema.parse(indicatorTransient);
};
