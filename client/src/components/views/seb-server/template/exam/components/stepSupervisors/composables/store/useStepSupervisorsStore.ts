import { defineStore } from "pinia";
import { ref } from "vue";

const initialState = {
    isReady: true,
};

export const useStepSupervisorsStore = defineStore("stepSupervisors", () => {
    const isReady = ref(initialState.isReady);

    const $reset = () => {
        isReady.value = initialState.isReady;
    };

    return {
        isReady,
        $reset,
    };
});
