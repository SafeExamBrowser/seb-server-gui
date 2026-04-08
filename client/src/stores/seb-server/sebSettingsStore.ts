import { defineStore } from "pinia";
import { ref, computed } from "vue";

const getInitialState = () => ({
    isReady: false,
    isExam: true,
    selectedContainerId: null,
    readonly: true,
    activeSEBClientConnection: null,
    dialogTitle: null,
    ignoreSEBService: false,
});

export const useSEBSettingsStore = defineStore("sebSettings", () => {
    // store is ready when selectedContainerId is set
    const isReady = computed<boolean>(
        () => selectedContainerId.value != undefined,
    );

    // indicates we currently work with Exam SEB Settings. If false we work with Configuration Template SEB Settings
    const isExam = ref<boolean>(getInitialState().isExam);
    // The SEB Settings container Id, either Exam id or Configuration Template id
    const selectedContainerId = ref<number | null>(
        getInitialState().selectedContainerId,
    );
    // readonly flag for SEB Settings. Depends on Exam State or User rights or something else
    const readonly = ref<boolean>(getInitialState().readonly);
    // indicates if there are active SEB client connections. This is only needed within Exam context
    const activeSEBClientConnection = ref<number | null>(
        getInitialState().activeSEBClientConnection,
    );

    const dialogTitle = ref<string | null>(getInitialState().dialogTitle);

    const ignoreSEBService = ref<boolean>(getInitialState().ignoreSEBService);

    const fp = "pt-1 pb-1";
    const cp = "pt-1 pb-1 pl-0";

    const $reset = () => {
        isExam.value = getInitialState().isExam;
        selectedContainerId.value = getInitialState().selectedContainerId;
        readonly.value = getInitialState().readonly;
        activeSEBClientConnection.value =
            getInitialState().activeSEBClientConnection;
        dialogTitle.value = getInitialState().dialogTitle;
        ignoreSEBService.value = getInitialState().ignoreSEBService;
    };

    return {
        isReady,
        isExam,
        selectedContainerId,
        readonly,
        ignoreSEBService,
        activeSEBClientConnection,
        dialogTitle,
        fp,
        cp,
        $reset,
    };
});
