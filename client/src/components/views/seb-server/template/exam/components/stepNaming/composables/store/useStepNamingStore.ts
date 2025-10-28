import { ExamTypeEnum } from "@/models/seb-server/examFiltersEnum";
import { defineStore } from "pinia";
import { ref } from "vue";

const initialState = {
    isReady: false,
    name: undefined,
    description: undefined,
    examType: undefined,
    configurationTemplate: undefined,
    clientConfiguration: undefined,
    lmsIntegration: false,
    institutionalDefault: false,
};

export const useStepNamingStore = defineStore("stepNaming", () => {
    const isReady = ref(initialState.isReady);
    const name = ref(initialState.name);
    const description = ref(initialState.description);
    const examType = ref<ExamTypeEnum | undefined>(initialState.examType);
    const configurationTemplate = ref<string | undefined>(
        initialState.configurationTemplate,
    );
    const clientConfiguration = ref<string | undefined>(
        initialState.clientConfiguration,
    );
    const lmsIntegration = ref<boolean>(initialState.lmsIntegration);
    const institutionalDefault = ref<boolean>(
        initialState.institutionalDefault,
    );

    const $reset = () => {
        isReady.value = initialState.isReady;
        name.value = initialState.name;
        description.value = initialState.description;
        examType.value = initialState.examType;
        configurationTemplate.value = initialState.configurationTemplate;
        clientConfiguration.value = initialState.clientConfiguration;
        lmsIntegration.value = initialState.lmsIntegration;
        institutionalDefault.value = initialState.institutionalDefault;
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
