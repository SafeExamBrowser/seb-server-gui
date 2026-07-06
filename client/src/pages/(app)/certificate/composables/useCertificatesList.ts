import { computed } from "vue";
import { useUrlTableState } from "@/components/widgets/entity-table/composables/useUrlTableState.ts";
import { usePagedListData } from "@/components/widgets/entity-table/composables/usePagedListData.ts";
import { useCertificatesQuery } from "@/pages/(app)/certificate/api/useCertificatesQuery.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";
import { toServerPageQuery } from "@/utils/table/tableUtils.ts";
import type { GetCertificatesData } from "@/api/seb-server/generated/hey-api/types.gen.ts";

export const useCertificatesList = () => {
    const {
        searchInputValue,
        searchField,
        options,
        loadItems,
        onSearch,
        onClearSearch,
    } = useUrlTableState(async () => {});

    const certificatesQuery = computed<GetCertificatesData["query"]>(() => ({
        ...toServerPageQuery(options.value),
        alias: searchField.value || undefined,
    }));

    const {
        data,
        isFetching,
        error: queryError,
        refetch,
    } = useCertificatesQuery(certificatesQuery);
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
        onSearch,
        onClearSearch,
        loadItems,
        reloadList,
    };
};
