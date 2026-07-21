import { defineStore } from "pinia";
import { computed, ref } from "vue";

import {
    Indicator,
    IndicatorExisting,
    indicatorExistingSchema,
} from "@/models/seb-server/examTemplate.ts";

const getInitialState = () => ({
    indicators: [],
});

export const useStepIndicatorsStore = defineStore("stepIndicators", () => {
    const indicators = ref<IndicatorExisting[]>(getInitialState().indicators);

    const $reset = () => {
        indicators.value = getInitialState().indicators;
    };

    const createIndicator = (indicator: Indicator) => {
        indicators.value.push(
            indicatorExistingSchema.parse({
                ...indicator,
                // random ID, for identification in the store only (when submitting to BE, the BE will generate the real ID)
                id: crypto.getRandomValues(new Uint32Array(1))[0],
            }),
        );
    };

    const updateIndicator = (updatedIndicator: IndicatorExisting) => {
        indicators.value = indicators.value.map((existingIndicator) =>
            existingIndicator.id === updatedIndicator.id
                ? updatedIndicator
                : existingIndicator,
        );
    };

    const deleteIndicator = (indicator: IndicatorExisting) => {
        indicators.value = indicators.value.filter(
            (i) => i.id !== indicator.id,
        );
    };

    const isReady = computed(() => {
        // there are no rules for this step, everything is optional
        return true;
    });

    return {
        isReady,
        indicators,
        createIndicator,
        updateIndicator,
        deleteIndicator,
        $reset,
    };
});
