import { ExamTypeEnum } from "@/models/seb-server/examFiltersEnum";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

const initialState = {
    name: "",
    description: "",
    examType: ExamTypeEnum.UNDEFINED,
    sebClientTemplate: undefined,
    connectionConfiguration: undefined,
    assesmentToolIntegration: true,
    institutionalDefault: false,
};

export const useStepNamingStore = defineStore("stepNaming", () => {
    const name = ref(initialState.name);
    const description = ref(initialState.description);
    const examType = ref<ExamTypeEnum>(initialState.examType);
    const sebClientTemplate = ref<string | undefined>(
        initialState.sebClientTemplate,
    );
    const connectionConfiguration = ref<string | undefined>(
        initialState.connectionConfiguration,
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
        sebClientTemplate.value = initialState.sebClientTemplate;
        connectionConfiguration.value = initialState.connectionConfiguration;
        assesmentToolIntegration.value = initialState.assesmentToolIntegration;
        institutionalDefault.value = initialState.institutionalDefault;
    };

    return {
        name,
        description,
        examType,
        sebClientTemplate,
        connectionConfiguration,
        assesmentToolIntegration,
        institutionalDefault,
        isReady,
        $reset,
    };
});
