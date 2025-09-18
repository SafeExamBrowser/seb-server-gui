import { defineStore } from "pinia";

export const useStepSupervisorsStore = defineStore("stepSupervisors", () => {
    const ready = ref(false);

    const markAsReady = () => {
        ready.value = true;
    };

    return {
        ready,
        markAsReady,
    };
});
