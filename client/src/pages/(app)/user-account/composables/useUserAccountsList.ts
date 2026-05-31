import { computed } from "vue";
import { useUrlTableState } from "@/components/widgets/entity-table/composables/useUrlTableState.ts";
import { usePagedListData } from "@/components/widgets/entity-table/composables/usePagedListData.ts";
import { STATUS_FILTER_KEY } from "@/components/widgets/filters/statusFilterSection.ts";
import { INSTITUTION_FILTER_KEY } from "@/components/widgets/filters/useInstitutionFilterSection.ts";
import { useUserAccountsFilters } from "./useUserAccountsFilters.ts";
import { useUserAccounts } from "@/pages/(app)/user-account/api/useUserAccounts.ts";

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
    } = useUrlTableState(async () => {
        await fetchUserAccounts();
    }, [STATUS_FILTER_KEY, INSTITUTION_FILTER_KEY]);

    const selectedStatus = computed(() => selectedFilters.value.status);
    const selectedInstitutionId = computed(
        () => selectedFilters.value.institutionId,
    );

    const {
        data,
        loading,
        error,
        fetchData: fetchUserAccounts,
    } = useUserAccounts(
        options,
        searchField,
        selectedStatus,
        selectedInstitutionId,
    );

    const { items, pageCount, errors, reloadList } = usePagedListData({
        data,
        error,
        options,
        fetchData: fetchUserAccounts,
    });

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
