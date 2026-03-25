import { computed, onMounted, ref } from "vue";
import type { ServerTablePaging } from "@/models/types";
import type { BaseSettingsStoreView } from "@/components/views/seb-server/settings-navigation/store/storeContract";

type PagedResponse = {
    number_of_pages?: number;
    page_size?: number;
    content?: unknown[];
};

type LoadItemsFn = (params: {
    options: ServerTablePaging;
    searchField: string | null;
    selectedStatus: string | null;
    selectedInstitutionId: string | null;
}) => Promise<void>;

export function useServerSettingsTable<TResponse extends PagedResponse>(
    store: BaseSettingsStoreView<unknown>,
    data: { value: TResponse | undefined },
    loadFn: LoadItemsFn,
    initialOptions?: ServerTablePaging,
) {
    const selectedStatus = ref<string | null>(null);
    const selectedInstitutionId = ref<string | null>(null);

    const options = ref<ServerTablePaging>(
        initialOptions ?? {
            page: 1,
            itemsPerPage: 10,
            sortBy: [{ key: "name", order: "asc" }],
        },
    );

    function getSafeOptions(
        newOptions?: Partial<ServerTablePaging>,
    ): ServerTablePaging {
        return {
            page: newOptions?.page ?? options.value.page ?? 1,
            itemsPerPage:
                newOptions?.itemsPerPage ?? options.value.itemsPerPage ?? 10,
            sortBy: newOptions?.sortBy ?? options.value.sortBy ?? [],
        };
    }

    const totalItems = computed(() => {
        if (!data.value) return 0;

        return (
            (data.value.number_of_pages ?? 1) *
            (data.value.page_size ?? data.value.content?.length ?? 0)
        );
    });

    async function loadItems(newOptions?: ServerTablePaging) {
        if (newOptions) {
            options.value = getSafeOptions(newOptions);
        } else {
            options.value = getSafeOptions();
        }

        store.currentPagingOptions = options.value;

        await loadFn({
            options: options.value,
            searchField: store.searchField,
            selectedStatus: selectedStatus.value,
            selectedInstitutionId: selectedInstitutionId.value,
        });
    }

    async function onSearch() {
        options.value = getSafeOptions({
            page: 1,
        });

        await loadItems();
    }

    async function onClearSearch() {
        selectedStatus.value = null;
        selectedInstitutionId.value = null;

        options.value = getSafeOptions({
            page: 1,
        });

        await loadItems();
    }

    onMounted(async () => {
        options.value = getSafeOptions();
        await loadItems();
    });

    return {
        selectedStatus,
        selectedInstitutionId,
        options,
        totalItems,
        loadItems,
        onSearch,
        onClearSearch,
        getSafeOptions,
    };
}
