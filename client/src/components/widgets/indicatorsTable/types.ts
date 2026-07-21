import { Ref } from "vue";

import {
    Indicator,
    IndicatorExisting,
    indicatorExistingSchema,
    indicatorSchema,
    Threshold,
} from "@/models/seb-server/examTemplate.ts";
import { IndicatorEnum } from "@/models/seb-server/monitoringEnums.ts";

export type IndicatorTransient = {
    id?: number;
    name?: string;
    type?: IndicatorEnum.BATTERY_STATUS | IndicatorEnum.WLAN_STATUS;
    thresholds: Threshold[];
};

export const indicatorTransientToIndicator = (
    indicatorTransient: IndicatorTransient,
): Indicator => {
    return indicatorSchema.parse(indicatorTransient);
};

export const indicatorTransientToIndicatorExisting = (
    indicatorTransient: IndicatorTransient,
): IndicatorExisting => {
    return indicatorExistingSchema.parse(indicatorTransient);
};

export type IndicatorsTableDeps = {
    indicators: Ref<IndicatorExisting[]>;
    createItem: (item: Indicator) => Promise<void>;
    updateItem: (item: IndicatorExisting) => Promise<void>;
    deleteItem: (item: IndicatorExisting) => Promise<void>;
    confirmDelete?: boolean;
};
