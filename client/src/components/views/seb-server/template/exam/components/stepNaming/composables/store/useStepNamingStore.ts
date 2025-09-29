import { ExamTypeEnum } from "@/models/seb-server/examFiltersEnum";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useStepNamingStore = defineStore("stepNaming", () => {
    const name = ref("");
    const description = ref("");
    const examType = ref<ExamTypeEnum>(ExamTypeEnum.UNDEFINED);
    const sebClientTemplate = ref<string>();
    const connectionConfiguration = ref<string>();
    const assesmentToolIntegration = ref<boolean>(true);
    const institutionalDefault = ref<boolean>(false);

    const isReady = computed(() => {
        return name.value.length > 0;
    });

    return {
        name,
        description,
        examType,
        sebClientTemplate,
        connectionConfiguration,
        assesmentToolIntegration,
        institutionalDefault,
        isReady,
    };
});
