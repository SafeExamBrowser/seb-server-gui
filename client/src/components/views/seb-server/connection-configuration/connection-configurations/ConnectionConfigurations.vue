<template>
    <BasicSettingsPage :title="$t('titles.connectionConfigurations')">
        <template #ActionButton>
            <AddButton
                text="connectionConfigurations.connectionConfigurationsPage.addConnectionConfiguration"
                :route="{ name: 'CreateConnectionConfiguration' }"
            />
        </template>

        <template #PanelMain>
            <v-col>
                <SearchBar
                    v-model="searchInputValue"
                    search-text="connectionConfigurations.connectionConfigurationsPage.filters.searchField"
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
                                :headers="connectionConfigurationTableHeaders"
                                :items="tableData?.content ?? []"
                                :page-count="pageCount"
                                :items-per-page="options.itemsPerPage"
                                :options="options"
                                :loading="
                                    loading || deleteLoading || statusLoading
                                "
                                :detail-route="
                                    getRouteName(
                                        'ConnectionConfigurationDetailAndView',
                                    )
                                "
                                route-param-key="id"
                                item-identifier-key="id"
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
        translation-key-prefix="connectionConfigurations.connectionConfigurationsPage"
        @confirm="confirmDelete"
    />

    <StatusConfirmDialog
        v-model="statusDialogOpen"
        :active="!!statusTarget?.active"
        translation-key-prefix="connectionConfigurations.connectionConfigurationsPage"
        @confirm="confirmStatusChange"
    />
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import BasicSettingsPage from "@/components/layout/pages/BasicSettingsPage.vue";
import { getRouteName } from "@/router/routeNames.ts";
import SearchBar from "@/components/widgets/searches/SearchBar.vue";
import EntityTable from "@/components/widgets/entity-table/EntityTable.vue";
import ActiveStatusChip from "@/components/widgets/ActiveStatusChip.vue";
import DeleteConfirmDialog from "@/components/widgets/confirmDialog/DeleteConfirmDialog.vue";
import StatusConfirmDialog from "@/components/widgets/confirmDialog/StatusConfirmDialog.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useUrlTableState } from "@/components/widgets/entity-table/composables/useUrlTableState.ts";
import { useTableNavigation } from "@/components/widgets/entity-table/composables/useTableNavigation.ts";
import { useConnectionConfigurationsTableHeaders } from "@/components/views/seb-server/connection-configuration/connection-configurations/composables/useConnectionConfigurationsTableHeaders.ts";
import { useConnectionConfigurationsTableActions } from "@/components/views/seb-server/connection-configuration/connection-configurations/composables/useConnectionConfigurationsTableActions.ts";
import { useConnectionConfigurationsFilters } from "@/components/views/seb-server/connection-configuration/connection-configurations/composables/useConnectionConfigurationsFilters.ts";
import { STATUS_FILTER_KEY } from "@/components/widgets/filters/statusFilterSection.ts";
import { INSTITUTION_FILTER_KEY } from "@/components/widgets/filters/useInstitutionFilterSection.ts";
import { useConnectionConfigurations } from "@/components/views/seb-server/connection-configuration/connection-configurations/api/useConnectionConfigurations.ts";
import { useDeleteConnectionConfiguration } from "@/components/views/seb-server/connection-configuration/connection-configurations/api/useDeleteConnectionConfiguration.ts";
import { useToggleConnectionConfigurationStatus } from "@/components/views/seb-server/connection-configuration/connection-configurations/api/useToggleConnectionConfigurationStatus.ts";
import type { ConnectionConfigurations } from "@/models/seb-server/connectionConfiguration.ts";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";
import AddButton from "@/components/widgets/AddButton.vue";

const { headers: connectionConfigurationTableHeaders, cellFormatters } =
    useConnectionConfigurationsTableHeaders();
const filterSections = useConnectionConfigurationsFilters();

const tableData = ref<ConnectionConfigurations>();

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
    await fetchConnectionConfigurations();
}, [STATUS_FILTER_KEY, INSTITUTION_FILTER_KEY]);

const selectedStatus = computed(() => selectedFilters.value.status);
const selectedInstitutionId = computed(
    () => selectedFilters.value.institutionId,
);

const {
    data: fetchedData,
    loading,
    error,
    fetchData: fetchConnectionConfigurations,
} = useConnectionConfigurations(
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
    removeConnectionConfigurationFromItem,
    loading: deleteLoading,
    error: deleteError,
} = useDeleteConnectionConfiguration(tableData);

const {
    toggleConnectionConfigurationStatusFromItem,
    loading: statusLoading,
    error: statusError,
} = useToggleConnectionConfigurationStatus(tableData);

// Dialog state
const deleteTarget = ref<TableItem | null>(null);
const statusTarget = ref<TableItem | null>(null);
const deleteDialogOpen = ref(false);
const statusDialogOpen = ref(false);

const { navigateToItem } = useTableNavigation(
    getRouteName("ConnectionConfigurationDetailAndView"),
    "id",
    "id",
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
    await removeConnectionConfigurationFromItem(deleteTarget.value);
    deleteDialogOpen.value = false;
}

async function confirmStatusChange() {
    if (!statusTarget.value) return;
    await toggleConnectionConfigurationStatusFromItem(statusTarget.value);
    statusDialogOpen.value = false;
}

const tableActions = useConnectionConfigurationsTableActions({
    onEdit: (item) => navigateToItem(item),
    onDelete: (item) => openDeleteDialog(item),
});
</script>
