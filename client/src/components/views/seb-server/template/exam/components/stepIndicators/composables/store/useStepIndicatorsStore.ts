import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
    Indicator,
    IndicatorTransient,
} from "@/components/views/seb-server/template/exam/components/stepIndicators/types";

const getInitialState = () => ({
    indicators: [],
});

export const getEmptyIndicator = (): IndicatorTransient => ({
    id: crypto.getRandomValues(new Uint32Array(1))[0], // random ID, for FE use only (when submitting to BE, the BE will generate the real ID)
    thresholds: [],
});

export const useStepIndicatorsStore = defineStore("stepIndicators", () => {
    const indicators = ref<Indicator[]>(getInitialState().indicators);

    const $reset = () => {
        indicators.value = getInitialState().indicators;
    };

    const createIndicator = (indicator: Indicator) => {
        indicators.value.push(indicator);
    };

    const updateIndicator = (updatedIndicator: Indicator) => {
        indicators.value = indicators.value.map((existingIndicator) =>
            existingIndicator.id === updatedIndicator.id
                ? updatedIndicator
                : existingIndicator,
        );
    };

    const deleteIndicator = (indicator: Indicator) => {
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
