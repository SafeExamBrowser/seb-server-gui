import { computed, reactive } from "vue";
import { type RouteLocationAsRelative, useRouter } from "vue-router";

import type { TableItem } from "@/components/widgets/entity-table/types.ts";
import { ScheduledDeleteStatusEnum } from "@/models/seb-server/scheduled-deletion.ts";

import { useScheduledDeleteTableHeaders } from "./useScheduledDeleteTableHeaders.ts";
import { useScheduledDeleteDeleteFlow } from "./useScheduledDeletionDeleteFlow.ts";
import { useScheduledDeletionList } from "./useScheduledDeletionList.ts";
import { useScheduledDeletionTableActions } from "./useScheduledDeletionTableActions.ts";

export const useScheduledDeletionOverview = () => {
    const router = useRouter();

    const detailRoute = (item: TableItem): RouteLocationAsRelative | null =>
        item.id != null
            ? {
                  name: "/(app)/scheduled-deletion/[id]/",
                  params: { id: String(item.id) },
              }
            : null;

    const { headers, cellFormatters } = useScheduledDeleteTableHeaders();

    const {
        items,
        pageCount,
        loading,
        errors,
        options,
        dateValue,
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
        setDate,
    } = useScheduledDeletionList();

    const tableLoading = computed(() => loading.value || deleteLoading.value);

    const {
        deleteDialogOpen,
        deleteDetailText,
        deleteError,
        deleteLoading,
        openDeleteDialog,
        confirmDelete,
    } = useScheduledDeleteDeleteFlow({ onDeleteSuccess: reloadList });

    const actions = useScheduledDeletionTableActions({
        onNavigate: (item) => {
            const target = detailRoute(item);
            if (!target) {
                // TODO @andrei implement error handling
                return;
            }
            void router.push(target);
        },
        canDelete: (item) => {
            return item.state === ScheduledDeleteStatusEnum.PENDING;
        },
        onDelete: openDeleteDialog,
    });

    return {
        list: reactive({
            items,
            pageCount,
            errors,
            options,
            dateValue,
            headers,
            cellFormatters,
            loading: tableLoading,
            detailRoute: detailRoute,
            actions,
            searchInputValue,
            searchField,
            selectedFilters,
            filterSections,
            onSearch,
            onClearSearch,
            setFilters,
            clearAll,
            loadItems,
            setDate,
        }),
        deleteFlow: reactive({
            dialogOpen: deleteDialogOpen,
            detailText: deleteDetailText,
            error: deleteError,
            confirm: confirmDelete,
        }),
    };
};
