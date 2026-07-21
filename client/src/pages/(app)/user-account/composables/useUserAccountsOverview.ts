import { computed, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { type RouteLocationAsRelative, useRouter } from "vue-router";

import { useEntityDeleteFlow } from "@/components/widgets/entity-table/composables/useEntityDeleteFlow.ts";
import { useEntityStatusFlow } from "@/components/widgets/entity-table/composables/useEntityStatusFlow.ts";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";
import { isTeacherOnlyAccount } from "@/models/userAccount.ts";
import { useDeleteUserAccountMutation } from "@/pages/(app)/user-account/api/useDeleteUserAccountMutation.ts";
import { useToggleUserAccountStatusMutation } from "@/pages/(app)/user-account/api/useToggleUserAccountStatusMutation.ts";
import { toAppErrorOrUndefined } from "@/services/errors/toAppError.ts";

import { useUserAccountsList } from "./useUserAccountsList.ts";
import { useUserAccountsTableActions } from "./useUserAccountsTableActions.ts";
import { useUserAccountsTableHeaders } from "./useUserAccountsTableHeaders.ts";

export const useUserAccountsOverview = () => {
    const router = useRouter();
    const { t } = useI18n();

    const userAccountDetailRoute = (
        item: TableItem,
    ): RouteLocationAsRelative | undefined =>
        item.uuid != null && !isTeacherOnlyAccount(item.userRoles)
            ? {
                  name: "/(app)/user-account/[userUuid]/",
                  params: { userUuid: String(item.uuid) },
              }
            : undefined;

    const { headers, cellFormatters } = useUserAccountsTableHeaders();

    const list = useUserAccountsList();

    const {
        mutateAsync: removeUserAccount,
        error: deleteMutationError,
        isPending: deleteLoading,
    } = useDeleteUserAccountMutation();
    const deleteError = computed(() =>
        toAppErrorOrUndefined(deleteMutationError.value),
    );

    const deleteFlow = useEntityDeleteFlow({
        remove: async (item) => {
            try {
                await removeUserAccount(String(item.uuid));
            } catch {
                /* empty */
            }
        },
        error: deleteError,
        loading: deleteLoading,
        contextLabel: "useraccount",
        detailTextOf: (item) => String(item.name ?? ""),
        onDeleteSuccess: list.reloadList,
    });

    const {
        changeUserAccountStatus,
        error: statusMutationError,
        isPending: statusLoading,
    } = useToggleUserAccountStatusMutation();
    const statusError = computed(() =>
        toAppErrorOrUndefined(statusMutationError.value),
    );

    const statusToggleDisabled = (item: TableItem): boolean =>
        isTeacherOnlyAccount(item.userRoles);
    const statusToggleTooltip = (item: TableItem): string | undefined =>
        statusToggleDisabled(item)
            ? t("userAccount.teacherNotEditable.message")
            : undefined;

    const statusFlow = useEntityStatusFlow({
        toggle: async (item) => {
            try {
                await changeUserAccountStatus(String(item.uuid), !!item.active);
            } catch {
                /* empty */
            }
        },
        error: statusError,
        loading: statusLoading,
        contextLabel: "useraccount.status",
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
            disabled: statusToggleDisabled,
            tooltip: statusToggleTooltip,
        }),
    };
};
