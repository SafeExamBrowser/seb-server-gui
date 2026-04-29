import { computed, ref } from "vue";
import type { FilterSectionDef } from "@/components/widgets/filters/filterTypes";
import type { TableFilters } from "@/components/widgets/entity-table/types";
import { ExamTypeEnum } from "@/models/seb-server/examFiltersEnum";
import i18n from "@/i18n";

const EXAM_TYPE_FILTER_KEY = "examType";

const filterSections: FilterSectionDef[] = [
    {
        key: EXAM_TYPE_FILTER_KEY,
        title: i18n.global.t("examTemplateList.info.examType"),
        options: Object.values(ExamTypeEnum).map((value) => ({
            value,
            label: i18n.global.t(value),
        })),
    },
];

export const useExamTemplateSearch = () => {
    const searchInput = ref<string | null>(null);
    const searchQuery = ref<string | undefined>(undefined);
    const selectedFilters = ref<TableFilters>({
        [EXAM_TYPE_FILTER_KEY]: null,
    });

    const examType = computed(
        () => selectedFilters.value[EXAM_TYPE_FILTER_KEY] ?? undefined,
    );

    const commitSearch = () => {
        searchQuery.value = searchInput.value ?? undefined;
    };

    const updateFilters = (newFilters: TableFilters) => {
        selectedFilters.value = newFilters;
    };

    const resetFilters = () => {
        searchInput.value = null;
        searchQuery.value = undefined;
        selectedFilters.value = { [EXAM_TYPE_FILTER_KEY]: null };
    };

    return {
        filterSections,
        searchInput,
        searchQuery,
        selectedFilters,
        examType,
        commitSearch,
        updateFilters,
        resetFilters,
    };
};
