import { computed } from "vue";
import { useUrlTableState } from "@/components/widgets/entity-table/composables/useUrlTableState.ts";
import { usePagedListData } from "@/components/widgets/entity-table/composables/usePagedListData.ts";
import { STATUS_FILTER_KEY } from "@/components/widgets/filters/statusFilterSection.ts";
import { useInstitutionsFilters } from "./useInstitutionsFilters.ts";
import { useInstitutionsQuery } from "@/pages/(app)/institution/api/useInstitutionsQuery.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";
import { toServerPageQuery } from "@/utils/table/tableUtils.ts";
import type { GetInstitutionsData } from "@/api/seb-server/generated/hey-api/types.gen.ts";

export const useInstitutionsList = () => {
    const filterSections = useInstitutionsFilters();

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
    } = useUrlTableState(async () => {}, [STATUS_FILTER_KEY]);

    const institutionsQuery = computed<GetInstitutionsData["query"]>(() => {
        const status = selectedFilters.value.status;
        return {
            ...toServerPageQuery(options.value),
            name: searchField.value || undefined,
            active:
                status === "Active"
                    ? true
                    : status === "Inactive"
                      ? false
                      : undefined,
        };
    });

    const {
        data,
        isFetching,
        error: queryError,
        refetch,
    } = useInstitutionsQuery(institutionsQuery);
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
