import { defineStore } from "pinia";
import { ExamStatusEnum, ExamTypeEnum } from "@/models/examFiltersEnum";


export const useMonitoringStore = defineStore("monitoring", () => {
    //exam table
    const searchField = ref<string | null>(null);
    const startDate = ref<number | null>(null);
    const currentPagingOptions = ref<ServerTablePaging>();
    const activeTypeFilter = ref<ExamTypeEnum | null>(null);

    return {
        searchField,
        startDate,
        currentPagingOptions,
        activeTypeFilter
    };
});