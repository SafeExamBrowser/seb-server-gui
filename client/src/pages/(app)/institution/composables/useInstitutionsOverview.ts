import { computed, reactive } from "vue";
import { useRouter, type RouteLocationAsRelative } from "vue-router";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";
import { useInstitutionsTableHeaders } from "./useInstitutionsTableHeaders.ts";
import { useInstitutionsTableActions } from "./useInstitutionsTableActions.ts";
import { useInstitutionsList } from "./useInstitutionsList.ts";
import { useInstitutionsDeleteFlow } from "./useInstitutionsDeleteFlow.ts";
import { useInstitutionsStatusFlow } from "./useInstitutionsStatusFlow.ts";

export const useInstitutionsOverview = () => {
    const router = useRouter();

    const institutionDetailRoute = (
        item: TableItem,
    ): RouteLocationAsRelative | null =>
        typeof item.id === "number"
            ? {
                  name: "/(app)/institution/[id]/",
                  params: { id: String(item.id) },
              }
            : null;

    const { headers } = useInstitutionsTableHeaders();

    const list = useInstitutionsList();

    const deleteFlow = useInstitutionsDeleteFlow({
        onDeleteSuccess: list.reloadList,
    });

    const statusFlow = useInstitutionsStatusFlow({
        onStatusChangeSuccess: list.reloadList,
    });

    const tableLoading = computed(
        () =>
            list.loading.value ||
            deleteFlow.deleteLoading.value ||
            statusFlow.statusLoading.value,
    );

    const actions = useInstitutionsTableActions({
        onEdit: (item) => {
            const target = institutionDetailRoute(item);
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
            loading: tableLoading,
            detailRoute: institutionDetailRoute,
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
