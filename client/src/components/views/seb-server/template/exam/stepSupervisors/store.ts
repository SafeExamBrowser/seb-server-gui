import { defineStore } from "pinia";
import { ref } from "vue";

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
