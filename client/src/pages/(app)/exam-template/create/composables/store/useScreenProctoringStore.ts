import { defineStore } from "pinia";
import { ref } from "vue";

const getInitialState = () => ({
    enabled: false,
});

export const useScreenProctoringStore = defineStore("screenProctoring", () => {
    const enabled = ref<boolean>(getInitialState().enabled);

    const $reset = () => {
        enabled.value = getInitialState().enabled;
    };

    return {
        enabled,
        $reset,
    };
});
