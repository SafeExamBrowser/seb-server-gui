import { computed, reactive } from "vue";
import { useRouter, type RouteLocationAsRelative } from "vue-router";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";
import { useUserAccountsTableHeaders } from "./useUserAccountsTableHeaders.ts";
import { useUserAccountsTableActions } from "./useUserAccountsTableActions.ts";
import { useUserAccountsList } from "./useUserAccountsList.ts";
import { useUserAccountsDeleteFlow } from "./useUserAccountsDeleteFlow.ts";
import { useUserAccountsStatusFlow } from "./useUserAccountsStatusFlow.ts";

export const useUserAccountsOverview = () => {
    const router = useRouter();

    const userAccountDetailRoute = (
        item: TableItem,
    ): RouteLocationAsRelative | null =>
        item.uuid != null
            ? {
                  name: "/(app)/user-account/[userUuid]/",
                  params: { userUuid: String(item.uuid) },
              }
            : null;

    const { headers, cellFormatters } = useUserAccountsTableHeaders();

    const list = useUserAccountsList();

    const deleteFlow = useUserAccountsDeleteFlow({
        onDeleteSuccess: list.reloadList,
    });

    const statusFlow = useUserAccountsStatusFlow({
        onStatusChangeSuccess: list.reloadList,
    });

    const tableLoading = computed(
        () =>
            list.loading.value ||
            deleteFlow.deleteLoading.value ||
            statusFlow.statusLoading.value,
    );

    const actions = useUserAccountsTableActions({
        onEdit: (item) => {
            const target = userAccountDetailRoute(item);
            if (!target) {
                // TODO @andrei implement error handling
                return;
            }
            void router.push(target);
        },
        onDelete: deleteFlow.openDeleteDialog,
    });

    return {
        list: reactive({
            items: list.items,
            pageCount: list.pageCount,
            errors: list.errors,
            options: list.options,
            headers,
            cellFormatters,
            loading: tableLoading,
            detailRoute: userAccountDetailRoute,
            actions,
            searchInputValue: list.searchInputValue,
            searchField: list.searchField,
            selectedFilters: list.selectedFilters,
            filterSections: list.filterSections,
            onSearch: list.onSearch,
            onClearSearch: list.onClearSearch,
            setFilters: list.setFilters,
            clearAll: list.clearAll,
            loadItems: list.loadItems,
        }),
        deleteFlow: reactive({
            dialogOpen: deleteFlow.deleteDialogOpen,
            detailText: deleteFlow.deleteDetailText,
            confirm: deleteFlow.confirmDelete,
        }),
        statusFlow: reactive({
            dialogOpen: statusFlow.statusDialogOpen,
            target: statusFlow.statusTarget,
            openDialog: statusFlow.openStatusDialog,
            confirm: statusFlow.confirmStatusChange,
        }),
    };
};
