import { defineStore } from "pinia";
import { ref } from "vue";

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
