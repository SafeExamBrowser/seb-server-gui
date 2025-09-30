import { ExamTypeEnum } from "@/models/seb-server/examFiltersEnum";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

const initialState = {
    name: "",
    description: "",
    examType: ExamTypeEnum.UNDEFINED,
    configurationTemplate: undefined,
    clientConfiguration: undefined,
    lmsIntegration: true,
    institutionalDefault: false,
};

export const useStepNamingStore = defineStore("stepNaming", () => {
    const name = ref(initialState.name);
    const description = ref(initialState.description);
    const examType = ref<ExamTypeEnum>(initialState.examType);
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

    const isReady = computed(() => {
        return name.value.length > 0;
    });

    const $reset = () => {
        name.value = initialState.name;
        description.value = initialState.description;
        examType.value = initialState.examType;
        configurationTemplate.value = initialState.configurationTemplate;
        clientConfiguration.value = initialState.clientConfiguration;
        lmsIntegration.value = initialState.lmsIntegration;
        institutionalDefault.value = initialState.institutionalDefault;
    };

    return {
        name,
        description,
        examType,
        configurationTemplate,
        clientConfiguration,
        lmsIntegration,
        institutionalDefault,
        isReady,
        $reset,
    };
});
