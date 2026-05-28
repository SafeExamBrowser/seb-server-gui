<template>
    <BasicSettingsPage
        :title="$t('titles.userAccounts')"
        :data-test-id="dataTestId"
    >
        <template #ActionButton>
            <AddButton
                :route="{ name: '/(app)/user-account/create/' }"
                :data-test-id="dataTestId"
            />
        </template>

        <template #PanelMain>
            <SearchBar
                v-model="searchInputValue"
                class="mt-2"
                search-text="userAccount.list.filters.searchField"
                :filter-sections="filterSections"
                :filter-values="selectedFilters"
                :data-test-id="dataTestId"
                dense
                @search="onSearch"
                @clear="onClearSearch"
                @update:filter-values="setFilters"
                @clear-filters="clearAll"
            />

            <LoadingFallbackComponent
                :loading="false"
                :errors="error ? [error] : []"
            >
                <EntityTable
                    class="px-3"
                    :headers="userAccountsTableHeaders"
                    :items="fetchedData?.content ?? []"
                    :page-count="pageCount"
                    :items-per-page="options.itemsPerPage"
                    :options="options"
                    :loading="isFetching || deletePending || statusPending"
                    :detail-route="userAccountDetailRoute"
                    :cell-formatters="cellFormatters"
                    :actions="tableActions"
                    :data-test-id="dataTestId"
                    item-key="uuid"
                    @update:options="loadItems"
                >
                    <template #cell-active="{ item, rowTestId }">
                        <ActiveStatusChip
                            :active="!!item.active"
                            :data-test-id="`${rowTestId}-status-chip`"
                            @click="openStatusDialog(item)"
                        />
                    </template>
                </EntityTable>
            </LoadingFallbackComponent>
        </template>
    </BasicSettingsPage>

    <DeleteConfirmDialog
        v-model="deleteDialogOpen"
        :detail-text="deleteDetailText"
        translation-key-prefix="userAccount.list"
        @confirm="confirmDelete"
    />

    <StatusConfirmDialog
        v-model="statusDialogOpen"
        :active="!!statusTarget?.active"
        translation-key-prefix="userAccount.list"
        @confirm="confirmStatusChange"
    />
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import BasicSettingsPage from "@/components/layout/pages/BasicSettingsPage.vue";
import SearchBar from "@/components/widgets/searches/SearchBar.vue";
import EntityTable from "@/components/widgets/entity-table/EntityTable.vue";
import ActiveStatusChip from "@/components/widgets/ActiveStatusChip.vue";
import DeleteConfirmDialog from "@/components/widgets/confirmDialog/DeleteConfirmDialog.vue";
import StatusConfirmDialog from "@/components/widgets/confirmDialog/StatusConfirmDialog.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useUrlTableState } from "@/components/widgets/entity-table/composables/useUrlTableState.ts";
import { useUserAccountsTableHeaders } from "@/pages/(app)/user-account/composables/useUserAccountsTableHeaders.ts";
import { useUserAccountsTableActions } from "@/pages/(app)/user-account/composables/useUserAccountsTableActions.ts";
import { useUserAccountsFilters } from "@/pages/(app)/user-account/composables/useUserAccountsFilters.ts";
import { STATUS_FILTER_KEY } from "@/components/widgets/filters/statusFilterSection.ts";
import { INSTITUTION_FILTER_KEY } from "@/components/widgets/filters/useInstitutionFilterSection.ts";
import { useUserAccounts } from "@/pages/(app)/user-account/api/useUserAccounts.ts";
import { useDeleteUserAccount } from "@/pages/(app)/user-account/api/useDeleteUserAccount.ts";
import { useToggleUserAccountStatus } from "@/pages/(app)/user-account/api/useToggleUserAccountStatus.ts";
import { notify } from "@/services/notifications/notify.ts";
import { toServerPageQuery } from "@/utils/table/tableUtils.ts";
import type { GetUserAccountsData } from "@/api/seb-server/generated/hey-api/types.gen.ts";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";
import AddButton from "@/components/widgets/AddButton.vue";
import { useRouter, type RouteLocationAsRelative } from "vue-router";

definePage({
    meta: {
        titleKey: "titles.userAccounts",
        pageTestId: "user-accounts-page",
        isPageBlue: true,
    },
});

const router = useRouter();

const dataTestId = "userAccounts";

const userAccountDetailRoute = (
    item: TableItem,
): RouteLocationAsRelative | null =>
    item.uuid != null
        ? {
              name: "/(app)/user-account/[userUuid]/",
              params: { userUuid: String(item.uuid) },
          }
        : null;

const { headers: userAccountsTableHeaders, cellFormatters } =
    useUserAccountsTableHeaders();
const filterSections = useUserAccountsFilters();

const {
    searchInputValue,
    searchField,
    selectedFilters,
    options,
    loadItems,
    onSearch,
    onClearSearch,
    setFilters,
    clearAll,
} = useUrlTableState(async () => {}, [
    STATUS_FILTER_KEY,
    INSTITUTION_FILTER_KEY,
]);

const accountsQuery = computed<GetUserAccountsData["query"]>(() => {
    const status = selectedFilters.value.status;
    const institutionId = selectedFilters.value.institutionId;
    return {
        ...toServerPageQuery(options.value),
        surname: searchField.value || undefined,
        active:
            status === "Active"
                ? "true"
                : status === "Inactive"
                  ? "false"
                  : undefined,
        institutionId: institutionId ? Number(institutionId) : undefined,
    };
});

const { data: fetchedData, isFetching, error } = useUserAccounts(accountsQuery);

const pageCount = computed(() => fetchedData.value?.number_of_pages ?? 0);

const {
    removeUserAccount,
    error: deleteError,
    isPending: deletePending,
} = useDeleteUserAccount();

const {
    changeUserAccountStatus,
    error: statusError,
    isPending: statusPending,
} = useToggleUserAccountStatus();

const deleteTarget = ref<TableItem>();
const statusTarget = ref<TableItem>();
const deleteDialogOpen = ref(false);
const statusDialogOpen = ref(false);

const deleteDetailText = computed(() => String(deleteTarget.value?.name ?? ""));

function openDeleteDialog(item: TableItem) {
    deleteTarget.value = item;
    deleteDialogOpen.value = true;
}

function openStatusDialog(item: TableItem) {
    statusTarget.value = item;
    statusDialogOpen.value = true;
}

async function confirmDelete() {
    const item = deleteTarget.value;
    if (typeof item?.uuid !== "string") return;
    try {
        await removeUserAccount(item.uuid);
    } catch {
        notify.serverError(deleteError.value, { contextLabel: "useraccount" });
    } finally {
        deleteDialogOpen.value = false;
    }
}

async function confirmStatusChange() {
    const item = statusTarget.value;
    if (typeof item?.uuid !== "string" || typeof item.active !== "boolean") {
        return;
    }
    try {
        await changeUserAccountStatus(item.uuid, item.active);
    } catch {
        notify.serverError(statusError.value, {
            contextLabel: "useraccount.status",
        });
    } finally {
        statusDialogOpen.value = false;
    }
}

const tableActions = useUserAccountsTableActions({
    onEdit: (item) => {
        const target = userAccountDetailRoute(item);
        if (!target) {
            return;
        }
        void router.push(target);
    },
    onDelete: (item) => openDeleteDialog(item),
});
</script>
