import { defineStore } from "pinia";

export const useSEBSettingsStore = defineStore("sebSettings", () => {
    // indicates we currently work with Exam SEB Settings. If false we work with Configuration Template SEB Settings
    const isExam = ref<boolean>(false);
    // The SEB Settings container Id, either Exam id or Configuration Template id
    const selectedContainerId = ref<number | null>(null);
    // readonly flag for SEB Settings. Depends on Exam State or User rights or something else
    const readonly = ref<boolean>(true);
    // indicates if there are active SEB client connections. This is only needed within Exam context
    const activeSEBClientConnection = ref<number | null>(null);

    const dialogTitle = ref<string | null>(null);

    function clearAll() {
        isExam.value = false;
        selectedContainerId.value = null;
        readonly.value = false;
        activeSEBClientConnection.value = null;
        dialogTitle.value = null;
    }

    return {
        isExam,
        selectedContainerId,
        readonly,
        activeSEBClientConnection,
        dialogTitle,
        clearAll,
    };
});
