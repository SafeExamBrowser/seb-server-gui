import { ExamTypeEnum } from "@/models/seb-server/examFiltersEnum";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

const initialState = {
    name: "",
    description: "",
    examType: ExamTypeEnum.UNDEFINED,
    configurationTemplate: undefined,
    clientConfiguration: undefined,
    assesmentToolIntegration: true,
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
    const assesmentToolIntegration = ref<boolean>(
        initialState.assesmentToolIntegration,
    );
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
        assesmentToolIntegration.value = initialState.assesmentToolIntegration;
        institutionalDefault.value = initialState.institutionalDefault;
    };

    return {
        name,
        description,
        examType,
        configurationTemplate,
        clientConfiguration,
        assesmentToolIntegration,
        institutionalDefault,
        isReady,
        $reset,
    };
});
