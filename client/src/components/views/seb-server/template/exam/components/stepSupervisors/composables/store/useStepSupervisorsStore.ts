import { defineStore } from "pinia";
import { ref } from "vue";

const initialState = {
    isReady: false,
};

export const useStepSupervisorsStore = defineStore("stepSupervisors", () => {
    const isReady = ref(initialState.isReady);

    const markAsReady = () => {
        isReady.value = true;
    };

    const $reset = () => {
        isReady.value = initialState.isReady;
    };

    return {
        isReady,
        markAsReady,
        $reset,
    };
});
