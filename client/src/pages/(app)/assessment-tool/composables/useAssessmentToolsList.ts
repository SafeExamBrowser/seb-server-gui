import { computed } from "vue";
import { useUrlTableState } from "@/components/widgets/entity-table/composables/useUrlTableState.ts";
import { STATUS_FILTER_KEY } from "@/components/widgets/filters/statusFilterSection.ts";
import { INSTITUTION_FILTER_KEY } from "@/components/widgets/filters/useInstitutionFilterSection.ts";
import {
    useAssessmentToolsFilters,
    LMS_TYPE_FILTER_KEY,
} from "./useAssessmentToolsFilters.ts";
import { useAssessmentTools } from "@/pages/(app)/assessment-tool/api/useAssessmentTools.ts";
import type { LMSTypeEnum } from "@/models/seb-server/assessmentToolEnums.ts";

export const useAssessmentToolsList = () => {
    const filterSections = useAssessmentToolsFilters();

    const {
        searchInputValue,
        searchField,
        selectedFilters,
        options,
        loadItems,
        onSearch,
        onClearSearch,
        setFilters,
        clearAll,
    } = useUrlTableState(async () => {
        await fetchAssessmentTools();
    }, [STATUS_FILTER_KEY, INSTITUTION_FILTER_KEY, LMS_TYPE_FILTER_KEY]);

    const selectedStatus = computed(() => selectedFilters.value.status);
    const selectedInstitutionId = computed(
        () => selectedFilters.value.institutionId,
    );
    const selectedType = computed(
        () => selectedFilters.value.selectedType as LMSTypeEnum | null,
    );

    const {
        data,
        loading,
        error,
        fetchData: fetchAssessmentTools,
    } = useAssessmentTools(
        options,
        searchField,
        selectedStatus,
        selectedType,
        selectedInstitutionId,
    );

    const items = computed(() => data.value?.content ?? []);
    const pageCount = computed(() => data.value?.number_of_pages ?? 0);
    const errors = computed(() => (error.value ? [error.value] : []));

    const reloadList = async () => {
        await fetchAssessmentTools();

        const maxPage = Math.max(1, pageCount.value);

        if (options.value.page <= maxPage) {
            return;
        }

        options.value.page = maxPage;

        await fetchAssessmentTools();
    };

    return {
        items,
        pageCount,
        loading,
        errors,
        options,
        searchInputValue,
        searchField,
        selectedFilters,
        filterSections,
        onSearch,
        onClearSearch,
        setFilters,
        clearAll,
        loadItems,
        reloadList,
    };
};
