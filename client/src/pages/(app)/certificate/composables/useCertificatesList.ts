import { computed } from "vue";
import { useUrlTableState } from "@/components/widgets/entity-table/composables/useUrlTableState.ts";
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

    const items = computed(() => data.value?.content ?? []);
    const pageCount = computed(() => data.value?.number_of_pages ?? 0);
    const errors = computed(() => (error.value ? [error.value] : []));

    const reloadList = async () => {
        await fetchCertificates();

        const maxPage = Math.max(1, pageCount.value);

        if (options.value.page <= maxPage) {
            return;
        }

        options.value.page = maxPage;

        await fetchCertificates();
    };

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
