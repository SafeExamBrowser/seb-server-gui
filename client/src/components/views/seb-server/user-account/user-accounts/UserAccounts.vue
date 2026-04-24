<template>
    <BasicSettingsPage :title="$t('titles.userAccounts')">
        <template #ActionButton>
            <AddButton
                text="userAccount.userAccountPage.addUserContext"
                :route="{ name: 'CreateUserAccount' }"
            />
        </template>

        <template #PanelMain>
            <v-col>
                <SearchBar
                    v-model="searchInputValue"
                    search-text="userAccount.userAccountPage.filters.searchField"
                    search-title="userAccount.userAccountPage.filters.searchTitle"
                    :filter-sections="filterSections"
                    :filter-values="selectedFilters"
                    @search="onSearch"
                    @clear="onClearSearch"
                    @update:filter-values="setFilters"
                    @clear-filters="resetFilters"
                />

                <v-row>
                    <v-col>
                        <div v-if="deleteError">{{ deleteError }}</div>
                        <div v-else-if="statusError">{{ statusError }}</div>
                        <LoadingFallbackComponent
                            :loading="false"
                            :errors="error ? [error] : []"
                        >
                            <EntityTable
                                :headers="userAccountsTableHeaders"
                                :items="tableData?.content ?? []"
                                :page-count="pageCount"
                                :items-per-page="options.itemsPerPage"
                                :options="options"
                                :loading="
                                    loading || deleteLoading || statusLoading
                                "
                                :detail-route="getRouteName('EditUserAccount')"
                                route-param-key="userUuid"
                                item-identifier-key="uuid"
                                :cell-formatters="cellFormatters"
                                :actions="tableActions"
                                @update:options="loadItems"
                            >
                                <template #cell-active="{ item }">
                                    <ActiveStatusChip
                                        :active="!!item.active"
                                        @click="openStatusDialog(item)"
                                    />
                                </template>
                            </EntityTable>
                        </LoadingFallbackComponent>
                    </v-col>
                </v-row>
            </v-col>
        </template>
    </BasicSettingsPage>

    <DeleteConfirmDialog
        v-model="deleteDialogOpen"
        :detail-text="deleteDetailText"
        translation-key-prefix="userAccount.userAccountPage"
        @confirm="confirmDelete"
    />

    <StatusConfirmDialog
        v-model="statusDialogOpen"
        :active="!!statusTarget?.active"
        translation-key-prefix="userAccount.userAccountPage"
        @confirm="confirmStatusChange"
    />
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import BasicSettingsPage from "@/components/layout/pages/BasicSettingsPage.vue";
import { getRouteName } from "@/router/routeNames.ts";
import SearchBar from "@/components/blocks/searches/SearchBar.vue";
import EntityTable from "@/components/blocks/entity-table/EntityTable.vue";
import ActiveStatusChip from "@/components/widgets/ActiveStatusChip.vue";
import DeleteConfirmDialog from "@/components/widgets/confirmDialog/DeleteConfirmDialog.vue";
import StatusConfirmDialog from "@/components/widgets/confirmDialog/StatusConfirmDialog.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useUrlTableState } from "@/components/blocks/entity-table/composables/useUrlTableState.ts";
import { useTableNavigation } from "@/components/blocks/entity-table/composables/useTableNavigation.ts";
import { useUserAccountsTableHeaders } from "@/components/views/seb-server/user-account/user-accounts/composables/useUserAccountsTableHeaders.ts";
import { useUserAccountsTableActions } from "@/components/views/seb-server/user-account/user-accounts/composables/useUserAccountsTableActions.ts";
import { useUserAccountsFilters } from "@/components/views/seb-server/user-account/user-accounts/composables/useUserAccountsFilters.ts";
import { STATUS_FILTER_KEY } from "@/components/blocks/filters/statusFilterSection.ts";
import { INSTITUTION_FILTER_KEY } from "@/components/blocks/filters/useInstitutionFilterSection.ts";
import { useUserAccounts } from "@/components/views/seb-server/user-account/user-accounts/api/useUserAccounts.ts";
import { useDeleteUserAccount } from "@/components/views/seb-server/user-account/user-accounts/api/useDeleteUserAccount.ts";
import { useToggleUserAccountStatus } from "@/components/views/seb-server/user-account/user-accounts/api/useToggleUserAccountStatus.ts";
import type { UserAccountResponse } from "@/models/userAccount.ts";
import type { TableItem } from "@/components/blocks/entity-table/types.ts";
import AddButton from "@/components/widgets/AddButton.vue";

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
    resetFilters,
} = useUrlTableState(async () => {
    await fetchUserAccounts();
}, [STATUS_FILTER_KEY, INSTITUTION_FILTER_KEY]);

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
    loading: deleteLoading,
    error: deleteError,
} = useDeleteUserAccount(tableData);

const {
    toggleUserAccountStatusFromItem,
    loading: statusLoading,
    error: statusError,
} = useToggleUserAccountStatus(tableData);

// Dialog state
const deleteTarget = ref<TableItem | null>(null);
const statusTarget = ref<TableItem | null>(null);
const deleteDialogOpen = ref(false);
const statusDialogOpen = ref(false);

const { navigateToItem } = useTableNavigation(
    getRouteName("EditUserAccount"),
    "uuid",
    "userUuid",
);

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
    if (!deleteTarget.value) return;
    await removeUserAccountFromItem(deleteTarget.value);
    deleteDialogOpen.value = false;
}

async function confirmStatusChange() {
    if (!statusTarget.value) return;
    await toggleUserAccountStatusFromItem(statusTarget.value);
    statusDialogOpen.value = false;
}

const tableActions = useUserAccountsTableActions({
    onEdit: (item) => navigateToItem(item),
    onDelete: (item) => openDeleteDialog(item),
});
</script>
