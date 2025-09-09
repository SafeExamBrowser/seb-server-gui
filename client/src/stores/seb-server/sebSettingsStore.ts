import { defineStore } from "pinia";

export const useSEBSettingsStore = defineStore("exam", () => {
    const isExam = ref<boolean>(false);
    const selectedContainerId = ref<number | null>(null);

    return {
        isExam,
        selectedContainerId
    };

});