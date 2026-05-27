import { defineStore } from "pinia";
import { ref } from "vue";

const getInitialState = () => ({
    quitPassword: "",
    templateQuitPassword: "",
});

export const useStepQuitPasswordStore = defineStore(
    "createExam_stepQuitPassword",
    () => {
        const quitPassword = ref<string>(getInitialState().quitPassword);

        const templateQuitPassword = ref<string>(
            getInitialState().templateQuitPassword,
        );

        const $reset = () => {
            quitPassword.value = getInitialState().quitPassword;
            templateQuitPassword.value = getInitialState().templateQuitPassword;
        };

        return {
            quitPassword,
            templateQuitPassword,
            $reset,
        };
    },
);
