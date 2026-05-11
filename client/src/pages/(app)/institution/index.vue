<template>
    <BasicSettingsPage
        :title="$t('titles.institutions')"
        :data-test-id="dataTestId"
    >
        <template #ActionButton>
            <AddButton
                text="institutions.institutionPage.addInstitution"
                :route="{ name: '/(app)/institution/create/' }"
            />
        </template>

        <template #PanelMain>
            <v-col>
                <SearchBar
                    v-model="searchInputValue"
                    search-text="institutions.institutionPage.filters.searchField"
                    :filter-sections="filterSections"
                    :filter-values="selectedFilters"
                    :data-test-id="dataTestId"
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
                                :headers="institutionsTableHeaders"
                                :items="tableData?.content ?? []"
                                :page-count="pageCount"
                                :items-per-page="options.itemsPerPage"
                                :options="options"
                                :loading="
                                    loading || deleteLoading || statusLoading
                                "
                                :detail-route="institutionDetailRoute"
                                :actions="tableActions"
                                :data-test-id="dataTestId"
                                item-key="modelId"
                                @update:options="loadItems"
                            >
                                <template #cell-logoImage="{ item, rowTestId }">
                                    <v-img
                                        v-if="logoSrcOf(item)"
                                        :src="logoSrcOf(item)"
                                        :max-height="40"
                                        :max-width="80"
                                        :data-test-id="`${rowTestId}-logo`"
                                    />
                                </template>
                                <template #cell-active="{ item, rowTestId }">
                                    <ActiveStatusChip
                                        :active="!!item.active"
                                        :data-test-id="`${rowTestId}-status-chip`"
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
        translation-key-prefix="institutions.institutionPage"
        @confirm="confirmDelete"
    />

    <StatusConfirmDialog
        v-model="statusDialogOpen"
        :active="!!statusTarget?.active"
        translation-key-prefix="institutions.institutionPage"
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
import AddButton from "@/components/widgets/AddButton.vue";
import { useUrlTableState } from "@/components/widgets/entity-table/composables/useUrlTableState.ts";
import { STATUS_FILTER_KEY } from "@/components/widgets/filters/statusFilterSection.ts";
import { useInstitutionsTableHeaders } from "@/pages/(app)/institution/composables/useInstitutionsTableHeaders.ts";
import { useInstitutionsTableActions } from "@/pages/(app)/institution/composables/useInstitutionsTableActions.ts";
import { useInstitutionsFilters } from "@/pages/(app)/institution/composables/useInstitutionsFilters.ts";
import { useInstitutions } from "@/pages/(app)/institution/api/useInstitutions.ts";
import { useDeleteInstitution } from "@/pages/(app)/institution/api/useDeleteInstitution.ts";
import { useToggleInstitutionStatus } from "@/pages/(app)/institution/api/useToggleInstitutionStatus.ts";
import type { InstitutionResponse } from "@/models/seb-server/institution.ts";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";
import { useRouter, type RouteLocationAsRelative } from "vue-router";

definePage({
    meta: {
        titleKey: "titles.institutions",
        pageTestId: "institutions-page",
        isPageBlue: true,
    },
});

const router = useRouter();

const dataTestId = "institutions";

const institutionDetailRoute = (
    item: TableItem,
): RouteLocationAsRelative | null =>
    item.modelId != null
        ? {
              name: "/(app)/institution/[modelId]/",
              params: { modelId: String(item.modelId) },
          }
        : null;

const { headers: institutionsTableHeaders } = useInstitutionsTableHeaders();
const filterSections = useInstitutionsFilters();

const tableData = ref<InstitutionResponse>();

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
    await fetchInstitutions();
}, [STATUS_FILTER_KEY]);

const selectedStatus = computed(() => selectedFilters.value.status);

const {
    data: fetchedData,
    loading,
    error,
    fetchData: fetchInstitutions,
} = useInstitutions(options, searchField, selectedStatus);

watch(
    fetchedData,
    (v) => {
        tableData.value = v;
    },
    { immediate: true },
);

const pageCount = computed(() => tableData.value?.number_of_pages ?? 0);

const {
    removeInstitutionFromItem,
    loading: deleteLoading,
    error: deleteError,
} = useDeleteInstitution(tableData);

const {
    toggleInstitutionStatusFromItem,
    loading: statusLoading,
    error: statusError,
} = useToggleInstitutionStatus(tableData);

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
    await removeInstitutionFromItem(deleteTarget.value);
    deleteDialogOpen.value = false;
}

async function confirmStatusChange() {
    if (!statusTarget.value) return;
    await toggleInstitutionStatusFromItem(statusTarget.value);
    statusDialogOpen.value = false;
}

function logoSrcOf(item: TableItem): string | undefined {
    const logo = item.logoImage;
    if (typeof logo !== "string" || logo === "") return undefined;
    return logo.startsWith("data:") ? logo : `data:image/png;base64,${logo}`;
}

const tableActions = useInstitutionsTableActions({
    onEdit: (item) => {
        const target = institutionDetailRoute(item);
        if (!target) return;
        void router.push(target);
    },
    onDelete: (item) => openDeleteDialog(item),
});
</script>
