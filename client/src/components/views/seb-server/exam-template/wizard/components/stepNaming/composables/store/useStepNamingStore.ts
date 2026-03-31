import { ExamTypeEnum } from "@/models/seb-server/examFiltersEnum";
import { defineStore } from "pinia";
import { ref } from "vue";

const getInitialState = () => ({
    isReady: false,
    name: undefined,
    description: undefined,
    examType: undefined,
    configurationTemplate: undefined,
    clientConfiguration: undefined,
    lmsIntegration: false,
    institutionalDefault: false,
});

export const useStepNamingStore = defineStore("stepNaming", () => {
    const isReady = ref(getInitialState().isReady);
    const name = ref(getInitialState().name);
    const description = ref(getInitialState().description);
    const examType = ref<ExamTypeEnum | undefined>(getInitialState().examType);
    const configurationTemplate = ref<string | undefined>(
        getInitialState().configurationTemplate,
    );
    const clientConfiguration = ref<string | undefined>(
        getInitialState().clientConfiguration,
    );
    const lmsIntegration = ref<boolean>(getInitialState().lmsIntegration);
    const institutionalDefault = ref<boolean>(
        getInitialState().institutionalDefault,
    );

    const $reset = () => {
        isReady.value = getInitialState().isReady;
        name.value = getInitialState().name;
        description.value = getInitialState().description;
        examType.value = getInitialState().examType;
        configurationTemplate.value = getInitialState().configurationTemplate;
        clientConfiguration.value = getInitialState().clientConfiguration;
        lmsIntegration.value = getInitialState().lmsIntegration;
        institutionalDefault.value = getInitialState().institutionalDefault;
    };

    return {
        isReady,
        name,
        description,
        examType,
        configurationTemplate,
        clientConfiguration,
        lmsIntegration,
        institutionalDefault,
        $reset,
    };
});
