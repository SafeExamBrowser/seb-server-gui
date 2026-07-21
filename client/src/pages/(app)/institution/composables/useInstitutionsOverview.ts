import { computed, reactive } from "vue";
import { type RouteLocationAsRelative, useRouter } from "vue-router";

import { useEntityDeleteFlow } from "@/components/widgets/entity-table/composables/useEntityDeleteFlow.ts";
import { useEntityStatusFlow } from "@/components/widgets/entity-table/composables/useEntityStatusFlow.ts";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";
import { useDeleteInstitutionMutation } from "@/pages/(app)/institution/api/useDeleteInstitutionMutation.ts";
import { useToggleInstitutionStatusMutation } from "@/pages/(app)/institution/api/useToggleInstitutionStatusMutation.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";

import { useInstitutionsList } from "./useInstitutionsList.ts";
import { useInstitutionsTableActions } from "./useInstitutionsTableActions.ts";
import { useInstitutionsTableHeaders } from "./useInstitutionsTableHeaders.ts";

export const useInstitutionsOverview = () => {
    const router = useRouter();

    const institutionDetailRoute = (
        item: TableItem,
    ): RouteLocationAsRelative | undefined =>
        item.id != null
            ? {
                  name: "/(app)/institution/[id]/",
                  params: { id: String(item.id) },
              }
            : undefined;

    const { headers } = useInstitutionsTableHeaders();

    const list = useInstitutionsList();

    const {
        mutateAsync: removeInstitution,
        error: deleteMutationError,
        isPending: deleteLoading,
    } = useDeleteInstitutionMutation();
    const deleteError = computed(() =>
        toAppErrorOrUndefined(deleteMutationError.value),
    );

    const deleteFlow = useEntityDeleteFlow({
        remove: async (item) => {
            try {
                await removeInstitution(String(item.id));
            } catch {
                /* empty */
            }
        },
        error: deleteError,
        loading: deleteLoading,
        contextLabel: "institution",
        detailTextOf: (item) => String(item.name ?? ""),
        onDeleteSuccess: list.reloadList,
    });

    const {
        changeInstitutionStatus,
        error: statusMutationError,
        isPending: statusLoading,
    } = useToggleInstitutionStatusMutation();
    const statusError = computed(() =>
        toAppErrorOrUndefined(statusMutationError.value),
    );

    const statusFlow = useEntityStatusFlow({
        toggle: async (item) => {
            try {
                await changeInstitutionStatus(String(item.id), !!item.active);
            } catch {
                /* empty */
            }
        },
        error: statusError,
        loading: statusLoading,
        contextLabel: "institution.status",
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
