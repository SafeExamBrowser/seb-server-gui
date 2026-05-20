import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { Indicator } from "@/components/widgets/indicatorsTable/types.ts";

const getInitialState = () => ({
    indicators: [],
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
