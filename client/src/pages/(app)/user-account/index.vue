<template>
    <BasicPage
        :title="$t('titles.userAccounts')"
        :bread-crumb="[{ label: $t('titles.userAccounts') }]"
        :data-test-id="dataTestId"
        :panel-left-collapsed="!filtersOpen"
    >
        <template #SubNav>
            <SettingsNavigation />
        </template>

        <template #ActionButton>
            <AddButton
                :route="{ name: '/(app)/user-account/create/' }"
                :data-test-id="dataTestId"
            />
        </template>

        <template #PanelLeft>
            <SearchBar
                v-model="searchInputValue"
                :applied-search="searchField"
                search-text="userAccount.list.filters.searchField"
                :filter-sections="filterSections"
                :filter-values="selectedFilters"
                :data-test-id="dataTestId"
                @search="onSearch"
                @clear="onClearSearch"
                @update:filter-values="setFilters"
                @clear-filters="clearAll"
            />
        </template>

        <template #PanelMain>
            <FilterControlsRow
                :open="filtersOpen"
                :pills="activePills"
                :data-test-id="dataTestId"
                @toggle="filtersOpen = !filtersOpen"
                @remove="onRemovePill"
                @clear-all="clearAll"
            />
            <LoadingFallbackComponent
                :loading="false"
                :errors="error ? [error] : []"
            >
                <EntityTable
                    class="px-2 pt-2"
                    :headers="userAccountsTableHeaders"
                    :items="tableData?.content ?? []"
                    :page-count="pageCount"
                    :items-per-page="options.itemsPerPage"
                    :options="options"
                    :loading="loading || deleteLoading || statusLoading"
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
    </BasicPage>

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
import { computed, ref, watch } from "vue";
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import SettingsNavigation from "@/components/widgets/navigation/SettingsNavigation.vue";
import SearchBar from "@/components/widgets/searches/SearchBar.vue";
import EntityTable from "@/components/widgets/entity-table/EntityTable.vue";
import FilterControlsRow from "@/components/widgets/filters/FilterControlsRow.vue";
import { useListFilterPanel } from "@/components/widgets/filters/useListFilterPanel.ts";
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
import type { UserAccountResponse } from "@/models/userAccount.ts";
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

const tableData = ref<UserAccountResponse>();

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
} = useUrlTableState(async () => {
    await fetchUserAccounts();
}, [STATUS_FILTER_KEY, INSTITUTION_FILTER_KEY]);

const { filtersOpen, activePills, onRemovePill } = useListFilterPanel({
    search: { applied: searchField, clear: onClearSearch },
    filterSections,
    selectedFilters,
    setFilters,
});

const selectedStatus = computed(() => selectedFilters.value.status);
const selectedInstitutionId = computed(
    () => selectedFilters.value.institutionId,
);

const {
    data: fetchedData,
    loading,
    error,
    fetchData: fetchUserAccounts,
} = useUserAccounts(
    options,
    searchField,
    selectedStatus,
    selectedInstitutionId,
);

watch(
    fetchedData,
    (v) => {
        tableData.value = v;
    },
    { immediate: true },
);

const pageCount = computed(() => tableData.value?.number_of_pages ?? 0);

const {
    removeUserAccountFromItem,
    error: deleteError,
    loading: deleteLoading,
} = useDeleteUserAccount();

const {
    toggleUserAccountStatusFromItem,
    error: statusError,
    loading: statusLoading,
} = useToggleUserAccountStatus();

// Dialog state
const deleteTarget = ref<TableItem | null>(null);
const statusTarget = ref<TableItem | null>(null);
const deleteDialogOpen = ref(false);
const statusDialogOpen = ref(false);

const deleteDetailText = computed(() => {
    if (!deleteTarget.value) return "";
    return String(deleteTarget.value.name ?? "");
});

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
    if (!item) return;
    await removeUserAccountFromItem(item);
    deleteDialogOpen.value = false;
    if (deleteError.value) {
        notify.serverError(deleteError.value, { contextLabel: "useraccount" });
        return;
    }
    const uuid = item.uuid;
    if (typeof uuid === "string" && tableData.value?.content) {
        tableData.value.content = tableData.value.content.filter(
            (user) => user.uuid !== uuid,
        );
    }
}

async function confirmStatusChange() {
    const item = statusTarget.value;
    if (!item) return;
    await toggleUserAccountStatusFromItem(item);
    statusDialogOpen.value = false;
    if (statusError.value) {
        notify.serverError(statusError.value, {
            contextLabel: "useraccount.status",
        });
        return;
    }
    const uuid = item.uuid;
    const previousActive = item.active;
    if (
        typeof uuid === "string" &&
        typeof previousActive === "boolean" &&
        tableData.value?.content
    ) {
        tableData.value.content = tableData.value.content.map((user) =>
            user.uuid === uuid ? { ...user, active: !previousActive } : user,
        );
    }
}

const tableActions = useUserAccountsTableActions({
    onEdit: (item) => {
        const target = userAccountDetailRoute(item);
        if (!target) {
            // TODO @andrei implement error handling
            return;
        }
        void router.push(target);
    },
    onDelete: (item) => openDeleteDialog(item),
});
</script>
