import { defineStore } from "pinia";
import { computed, ref } from "vue";

const initialState = {
    selectedSupervisorIds: [],
};

export const useStepSupervisorsStore = defineStore("stepSupervisors", () => {
    const selectedSupervisorIds = ref<string[]>(
        initialState.selectedSupervisorIds,
    );

    const isReady = computed<boolean>(
        () => selectedSupervisorIds.value.length > 0,
    );

    return {
        isReady,
        selectedSupervisorIds,
    };
});
