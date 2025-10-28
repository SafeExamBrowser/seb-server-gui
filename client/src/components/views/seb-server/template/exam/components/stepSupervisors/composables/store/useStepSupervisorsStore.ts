import { defineStore } from "pinia";
import { computed, ref } from "vue";

const initialState = {
    selectedSupervisors: [],
};

export const useStepSupervisorsStore = defineStore("stepSupervisors", () => {
    const selectedSupervisors = ref<string[]>(initialState.selectedSupervisors);
    const isReady = computed<boolean>(
        () => selectedSupervisors.value.length > 0,
    );

    return {
        isReady,
        selectedSupervisors,
    };
});
