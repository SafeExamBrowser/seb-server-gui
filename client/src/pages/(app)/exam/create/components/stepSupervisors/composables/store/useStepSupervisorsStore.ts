import { defineStore } from "pinia";
import { computed, ref } from "vue";

const getInitialState = () => ({
    selectedSupervisorIds: [],
});

export const useStepSupervisorsStore = defineStore(
    "createExam_stepSupervisors",
    () => {
        const selectedSupervisorIds = ref<string[]>(
            getInitialState().selectedSupervisorIds,
        );

        const $reset = () => {
            selectedSupervisorIds.value =
                getInitialState().selectedSupervisorIds;
        };

        const isReady = computed<boolean>(
            () => selectedSupervisorIds.value.length > 0,
        );

        return {
            isReady,
            selectedSupervisorIds,
            $reset,
        };
    },
);
