import { Ref } from "vue";
import { IndicatorEnum } from "@/models/seb-server/monitoringEnums.ts";
import {
    Threshold,
    IndicatorExisting,
    indicatorExistingSchema,
} from "@/models/seb-server/examTemplate.ts";

export type IndicatorTransient = {
    id: number;
    name?: string;
    type?: IndicatorEnum.BATTERY_STATUS | IndicatorEnum.WLAN_STATUS;
    thresholds: Threshold[];
};

export const indicatorTransientToIndicator = (
    indicatorTransient: IndicatorTransient,
): IndicatorExisting => {
    return indicatorExistingSchema.parse(indicatorTransient);
};

export type IndicatorsTableDeps = {
    indicators: Ref<IndicatorExisting[]>;
    createItem: (item: IndicatorExisting) => Promise<void>;
    updateItem: (item: IndicatorExisting) => Promise<void>;
    deleteItem: (item: IndicatorExisting) => Promise<void>;
};
