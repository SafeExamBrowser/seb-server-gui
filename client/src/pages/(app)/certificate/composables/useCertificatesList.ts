import { useUrlTableState } from "@/components/widgets/entity-table/composables/useUrlTableState.ts";
import { usePagedListData } from "@/components/widgets/entity-table/composables/usePagedListData.ts";
import { useCertificates } from "./api/useCertificates.ts";

export const useCertificatesList = () => {
    const {
        searchInputValue,
        searchField,
        options,
        loadItems,
        onSearch,
        onClearSearch,
    } = useUrlTableState(async () => {
        await fetchCertificates();
    });

    const {
        data,
        loading,
        error,
        fetchData: fetchCertificates,
    } = useCertificates(options, searchField);

    const { items, pageCount, errors, reloadList } = usePagedListData({
        data,
        error,
        options,
        fetchData: fetchCertificates,
    });

    return {
        items,
        pageCount,
        loading,
        errors,
        options,
        searchInputValue,
        searchField,
        onSearch,
        onClearSearch,
        loadItems,
        reloadList,
    };
};
