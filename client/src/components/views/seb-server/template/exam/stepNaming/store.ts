import { ExamTypeEnum } from "@/models/seb-server/examFiltersEnum";
import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useStepNamingStore = defineStore("stepNaming", () => {
    const name = ref("");
    const description = ref("");
    const examType = ref<ExamTypeEnum>(ExamTypeEnum.UNDEFINED);

    const isReady = computed(() => {
        return name.value.length > 0;
    });

    return {
        name,
        description,
        examType,
        isReady,
    };
});
