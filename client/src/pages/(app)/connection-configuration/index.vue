<template>
    <BasicPage
        :title="$t('titles.connectionConfigurations')"
        :data-test-id="dataTestId"
        :panel-left-collapsed="!filtersOpen"
    >
        <template #ActionButton>
            <AddButton
                :route="{ name: '/(app)/connection-configuration/create/' }"
                :data-test-id="dataTestId"
            />
        </template>

        <template #PanelLeft>
            <SearchBar
                v-model="searchInputValue"
                search-text="connectionConfigurations.list.filters.searchField"
                :filter-sections="filterSections"
                :filter-values="selectedFilters"
                :data-test-id="dataTestId"
                @search="onSearch"
                @clear="onClearSearch"
                @update:filter-values="setFilters"
                @clear-filters="clearAll"
                @collapse="filtersOpen = false"
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
                    :headers="connectionConfigurationTableHeaders"
                    :items="tableData?.content ?? []"
                    :page-count="pageCount"
                    :items-per-page="options.itemsPerPage"
                    :options="options"
                    :loading="loading || deleteLoading || statusLoading"
                    :detail-route="connectionConfigurationDetailRoute"
                    :cell-formatters="cellFormatters"
                    :actions="tableActions"
                    :data-test-id="dataTestId"
                    item-key="id"
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
        translation-key-prefix="connectionConfigurations.list"
        @confirm="confirmDelete"
    />

    <StatusConfirmDialog
        v-model="statusDialogOpen"
        :active="!!statusTarget?.active"
        translation-key-prefix="connectionConfigurations.list"
        @confirm="confirmStatusChange"
    />
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import SearchBar from "@/components/widgets/searches/SearchBar.vue";
import EntityTable from "@/components/widgets/entity-table/EntityTable.vue";
import FilterControlsRow from "@/components/widgets/filters/FilterControlsRow.vue";
import { useActiveFilterPills } from "@/components/widgets/filters/useActiveFilterPills.ts";
import ActiveStatusChip from "@/components/widgets/ActiveStatusChip.vue";
import DeleteConfirmDialog from "@/components/widgets/confirmDialog/DeleteConfirmDialog.vue";
import StatusConfirmDialog from "@/components/widgets/confirmDialog/StatusConfirmDialog.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useUrlTableState } from "@/components/widgets/entity-table/composables/useUrlTableState.ts";
import { useConnectionConfigurationsTableHeaders } from "@/pages/(app)/connection-configuration/composables/useConnectionConfigurationsTableHeaders.ts";
import { useConnectionConfigurationsTableActions } from "@/pages/(app)/connection-configuration/composables/useConnectionConfigurationsTableActions.ts";
import { useConnectionConfigurationsFilters } from "@/pages/(app)/connection-configuration/composables/useConnectionConfigurationsFilters.ts";
import { STATUS_FILTER_KEY } from "@/components/widgets/filters/statusFilterSection.ts";
import { INSTITUTION_FILTER_KEY } from "@/components/widgets/filters/useInstitutionFilterSection.ts";
import { useConnectionConfigurations } from "@/pages/(app)/connection-configuration/api/useConnectionConfigurations.ts";
import { useDeleteConnectionConfiguration } from "@/pages/(app)/connection-configuration/api/useDeleteConnectionConfiguration.ts";
import { useToggleConnectionConfigurationStatus } from "@/pages/(app)/connection-configuration/api/useToggleConnectionConfigurationStatus.ts";
import { notify } from "@/services/notifications/notify.ts";
import type { ConnectionConfigurations } from "@/models/seb-server/connectionConfiguration.ts";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";
import AddButton from "@/components/widgets/AddButton.vue";
import { useRouter, type RouteLocationAsRelative } from "vue-router";

definePage({
    meta: {
        titleKey: "titles.connectionConfigurations",
        pageTestId: "connection-configurations-page",
        isPageBlue: true,
        das: true,
    },
});

const router = useRouter();

const dataTestId = "connectionConfigurations";

const connectionConfigurationDetailRoute = (
    item: TableItem,
): RouteLocationAsRelative | null =>
    item.id != null
        ? {
              name: "/(app)/connection-configuration/[id]/",
              params: { id: String(item.id) },
          }
        : null;

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

const filtersOpen = ref(true);

const activePills = useActiveFilterPills(filterSections, selectedFilters);

function onRemovePill(sectionKey: string) {
    void setFilters({ ...selectedFilters.value, [sectionKey]: null });
}

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
    error: deleteError,
    loading: deleteLoading,
} = useDeleteConnectionConfiguration();

const {
    toggleConnectionConfigurationStatusFromItem,
    error: statusError,
    loading: statusLoading,
} = useToggleConnectionConfigurationStatus();

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
    await removeConnectionConfigurationFromItem(item);
    deleteDialogOpen.value = false;
    if (deleteError.value) {
        notify.serverError(deleteError.value, {
            contextLabel: "connectionconfiguration",
        });
        return;
    }
    const id = item.id;
    if (typeof id === "number" && tableData.value?.content) {
        tableData.value.content = tableData.value.content.filter(
            (config) => config.id !== id,
        );
    }
}

async function confirmStatusChange() {
    const item = statusTarget.value;
    if (!item) return;
    await toggleConnectionConfigurationStatusFromItem(item);
    statusDialogOpen.value = false;
    if (statusError.value) {
        notify.serverError(statusError.value, {
            contextLabel: "connectionconfiguration.status",
        });
        return;
    }
    const id = item.id;
    const previousActive = item.active;
    if (
        typeof id === "number" &&
        typeof previousActive === "boolean" &&
        tableData.value?.content
    ) {
        tableData.value.content = tableData.value.content.map((config) =>
            config.id === id ? { ...config, active: !previousActive } : config,
        );
    }
}

const tableActions = useConnectionConfigurationsTableActions({
    onEdit: (item) => {
        const target = connectionConfigurationDetailRoute(item);
        if (!target) {
            // TODO @andrei implement error handling
            return;
        }
        void router.push(target);
    },
    onDelete: (item) => openDeleteDialog(item),
});
</script>
