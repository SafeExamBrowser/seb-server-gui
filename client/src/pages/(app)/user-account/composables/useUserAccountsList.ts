import { computed } from "vue";
import { useUrlTableState } from "@/components/widgets/entity-table/composables/useUrlTableState.ts";
import { usePagedListData } from "@/components/widgets/entity-table/composables/usePagedListData.ts";
import { STATUS_FILTER_KEY } from "@/components/widgets/filters/statusFilterSection.ts";
import { INSTITUTION_FILTER_KEY } from "@/components/widgets/filters/useInstitutionFilterSection.ts";
import { useUserAccountsFilters } from "./useUserAccountsFilters.ts";
import { useUserAccounts } from "@/pages/(app)/user-account/api/useUserAccounts.ts";
import { toServerPageQuery } from "@/utils/table/tableUtils.ts";
import type { GetUserAccountsData } from "@/api/seb-server/generated/hey-api/types.gen.ts";

export const useUserAccountsList = () => {
    const filterSections = useUserAccountsFilters();

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
    ]);

    const accountsQuery = computed<GetUserAccountsData["query"]>(() => {
        const status = selectedFilters.value.status;
        const institutionId = selectedFilters.value.institutionId;
        return {
            ...toServerPageQuery(options.value),
            surname: searchField.value || undefined,
            active:
                status === "Active"
                    ? true
                    : status === "Inactive"
                      ? false
                      : undefined,
            institutionId: institutionId ? Number(institutionId) : undefined,
        };
    });

    const { data, isFetching, error, refetch } = useUserAccounts(accountsQuery);

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
