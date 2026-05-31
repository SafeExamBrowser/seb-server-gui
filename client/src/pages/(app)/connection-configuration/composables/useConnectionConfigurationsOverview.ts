import { computed, reactive } from "vue";
import { useRouter, type RouteLocationAsRelative } from "vue-router";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";
import { useConnectionConfigurationsTableHeaders } from "./useConnectionConfigurationsTableHeaders.ts";
import { useConnectionConfigurationsTableActions } from "./useConnectionConfigurationsTableActions.ts";
import { useConnectionConfigurationsList } from "./useConnectionConfigurationsList.ts";
import { useDeleteConnectionConfiguration } from "@/pages/(app)/connection-configuration/api/useDeleteConnectionConfiguration.ts";
import { useToggleConnectionConfigurationStatus } from "@/pages/(app)/connection-configuration/api/useToggleConnectionConfigurationStatus.ts";
import { useEntityDeleteFlow } from "@/components/widgets/entity-table/composables/useEntityDeleteFlow.ts";
import { useEntityStatusFlow } from "@/components/widgets/entity-table/composables/useEntityStatusFlow.ts";

export const useConnectionConfigurationsOverview = () => {
    const router = useRouter();

    const connectionConfigurationDetailRoute = (
        item: TableItem,
    ): RouteLocationAsRelative | null =>
        item.id != null
            ? {
                  name: "/(app)/connection-configuration/[id]/",
                  params: { id: String(item.id) },
              }
            : null;

    const { headers, cellFormatters } =
        useConnectionConfigurationsTableHeaders();

    const list = useConnectionConfigurationsList();

    const {
        removeConnectionConfigurationFromItem,
        error: deleteError,
        loading: deleteLoading,
    } = useDeleteConnectionConfiguration();

    const deleteFlow = useEntityDeleteFlow({
        remove: removeConnectionConfigurationFromItem,
        error: deleteError,
        loading: deleteLoading,
        contextLabel: "connectionconfiguration",
        detailTextOf: (item) => String(item.name ?? ""),
        onDeleteSuccess: list.reloadList,
    });

    const {
        toggleConnectionConfigurationStatusFromItem,
        error: statusError,
        loading: statusLoading,
    } = useToggleConnectionConfigurationStatus();

    const statusFlow = useEntityStatusFlow({
        toggle: toggleConnectionConfigurationStatusFromItem,
        error: statusError,
        loading: statusLoading,
        contextLabel: "connectionconfiguration.status",
        onStatusChangeSuccess: list.reloadList,
    });

    const tableLoading = computed(
        () =>
            list.loading.value ||
            deleteFlow.deleteLoading.value ||
            statusFlow.statusLoading.value,
    );

    const actions = useConnectionConfigurationsTableActions({
        onEdit: (item) => {
            const target = connectionConfigurationDetailRoute(item);
            if (!target) {
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
            detailRoute: connectionConfigurationDetailRoute,
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
