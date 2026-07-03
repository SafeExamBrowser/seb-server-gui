import { computed } from "vue";
import { useUrlTableState } from "@/components/widgets/entity-table/composables/useUrlTableState.ts";
import { usePagedListData } from "@/components/widgets/entity-table/composables/usePagedListData.ts";
import { STATUS_FILTER_KEY } from "@/components/widgets/filters/statusFilterSection.ts";
import { INSTITUTION_FILTER_KEY } from "@/components/widgets/filters/useInstitutionFilterSection.ts";
import {
    useAssessmentToolsFilters,
    LMS_TYPE_FILTER_KEY,
} from "./useAssessmentToolsFilters.ts";
import { useAssessmentToolsQuery } from "@/pages/(app)/assessment-tool/api/useAssessmentToolsQuery.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";
import { toServerPageQuery } from "@/utils/table/tableUtils.ts";
import type { GetLmsSetupsData } from "@/api/seb-server/generated/hey-api/types.gen.ts";

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
    } = useUrlTableState(async () => {}, [
        STATUS_FILTER_KEY,
        INSTITUTION_FILTER_KEY,
        LMS_TYPE_FILTER_KEY,
    ]);

    const assessmentToolsQuery = computed<GetLmsSetupsData["query"]>(() => {
        const status = selectedFilters.value.status;
        const institutionId = selectedFilters.value.institutionId;
        const lmsType = selectedFilters.value[LMS_TYPE_FILTER_KEY];
        return {
            ...toServerPageQuery(options.value),
            name: searchField.value || undefined,
            lms_type: lmsType || undefined,
            active:
                status === "Active"
                    ? true
                    : status === "Inactive"
                      ? false
                      : undefined,
            institutionId: institutionId ? Number(institutionId) : undefined,
        };
    });

    const {
        data,
        isFetching,
        error: queryError,
        refetch,
    } = useAssessmentToolsQuery(assessmentToolsQuery);
    const error = computed(() => toAppErrorOrUndefined(queryError.value));

    const { items, pageCount, errors, reloadList } = usePagedListData({
        data,
        error,
        options,
        fetchData: async () => {
            await refetch();
        },
    });

    return {
        items,
        pageCount,
        loading: isFetching,
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
