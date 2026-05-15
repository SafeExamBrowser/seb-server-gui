import { defineStore } from "pinia";
import { ref } from "vue";

const getInitialState = () => ({
    quitPassword: "",
});

export const useStepQuitPasswordStore = defineStore(
    "createExam_stepQuitPassword",
    () => {
        const quitPassword = ref<string>(getInitialState().quitPassword);

        const $reset = () => {
            quitPassword.value = getInitialState().quitPassword;
        };

        return {
            quitPassword,
            $reset,
        };
    },
);
