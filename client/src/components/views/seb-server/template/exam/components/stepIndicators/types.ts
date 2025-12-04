import { z } from "zod";
import { IndicatorEnum } from "@/models/seb-server/monitoringEnums";

export type Threshold = {
    value: number;
    color: string;
};

export type IndicatorTransient = {
    id: number;
    name?: string;
    type?: IndicatorEnum.BATTERY_STATUS | IndicatorEnum.WLAN_STATUS;
    thresholds: Threshold[];
};

const indicatorSchema = z.object({
    id: z.number(),
    name: z.string(),
    type: z.enum([IndicatorEnum.BATTERY_STATUS, IndicatorEnum.WLAN_STATUS]),
    thresholds: z.array(
        z.object({
            value: z.number(),
            color: z.string(),
        }),
    ),
});

export type Indicator = z.infer<typeof indicatorSchema>;

export const indicatorTransientToIndicator = (
    indicatorTransient: IndicatorTransient,
): Indicator => {
    return indicatorSchema.parse(indicatorTransient);
};
