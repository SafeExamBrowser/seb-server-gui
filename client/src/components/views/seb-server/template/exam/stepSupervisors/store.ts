import { defineStore } from "pinia";

export const useStepSupervisorsStore = defineStore("stepSupervisors", () => {
    const isReady = ref(false);

    const markAsReady = () => {
        isReady.value = true;
    };

    return {
        isReady,
        markAsReady,
    };
});
