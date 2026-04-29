<template>
    <BasicSettingsPage :title="$t('titles.userAccounts')">
        <template #ActionButton>
            <AddButton
                text="userAccount.userAccountPage.addUserContext"
                :route="{ name: '/(app)/user-account/create/' }"
            />
        </template>

        <template #PanelMain>
            <v-col>
                <SearchBar
                    v-model="searchInputValue"
                    search-text="userAccount.userAccountPage.filters.searchField"
                    :filter-sections="filterSections"
                    :filter-values="selectedFilters"
                    dense
                    @search="onSearch"
                    @clear="onClearSearch"
                    @update:filter-values="setFilters"
                    @clear-filters="clearAll"
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
                                :detail-route="userAccountDetailRoute"
                                :item-identifier-key="
                                    userAccountItemIdentifierKey
                                "
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
import type { UserAccountResponse } from "@/models/userAccount.ts";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";
import AddButton from "@/components/widgets/AddButton.vue";
import { useDetailRouteNavigation } from "@/router/detailRoute";
import type { RouteLocationAsRelative } from "vue-router";

const userAccountDetailRoute = {
    name: "/(app)/user-account/[userUuid]/",
} satisfies RouteLocationAsRelative<"/(app)/user-account/[userUuid]/">;

const userAccountItemIdentifierKey = "uuid" as const;

definePage({
    meta: {
        titleKey: "titles.userAccounts",
        pageTestId: "user-accounts-page",
        isPageBlue: true,
    },
});
const { headers: userAccountsTableHeaders, cellFormatters } =
    useUserAccountsTableHeaders();
const filterSections = useUserAccountsFilters();
const { pushDetailRoute } = useDetailRouteNavigation();

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
    onEdit: (item) =>
        pushDetailRoute(
            userAccountDetailRoute,
            item,
            userAccountItemIdentifierKey,
        ),
    onDelete: (item) => openDeleteDialog(item),
});
</script>
