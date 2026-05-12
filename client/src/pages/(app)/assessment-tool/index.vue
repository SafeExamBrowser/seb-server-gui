<template>
    <BasicSettingsPage
        :title="$t('titles.assessmentToolConnections')"
        :data-test-id="dataTestId"
    >
        <template #ActionButton>
            <AddButton
                text="assessmentToolConnections.assessmentToolsPage.addAssessmentTool"
                :route="{ name: '/(app)/assessment-tool/create/' }"
            />
        </template>

        <template #PanelMain>
            <SearchBar
                v-model="searchInputValue"
                class="mt-2"
                search-text="assessmentToolConnections.assessmentToolsPage.filters.searchField"
                :filter-sections="filterSections"
                :filter-values="selectedFilters"
                :data-test-id="dataTestId"
                dense
                @search="onSearch"
                @clear="onClearSearch"
                @update:filter-values="setFilters"
                @clear-filters="clearAll"
            />

            <div v-if="deleteError">{{ deleteError }}</div>
            <div v-else-if="statusError">{{ statusError }}</div>

            <LoadingFallbackComponent
                :loading="false"
                :errors="error ? [error] : []"
            >
                <EntityTable
                    class="px-3"
                    :headers="assessmentToolTableHeaders"
                    :items="tableData?.content ?? []"
                    :page-count="pageCount"
                    :items-per-page="options.itemsPerPage"
                    :options="options"
                    :loading="loading || deleteLoading || statusLoading"
                    :detail-route="assessmentToolDetailRoute"
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
    </BasicSettingsPage>

    <DeleteConfirmDialog
        v-model="deleteDialogOpen"
        :detail-text="deleteDetailText"
        translation-key-prefix="assessmentToolConnections.assessmentToolsPage"
        @confirm="confirmDelete"
    />

    <StatusConfirmDialog
        v-model="statusDialogOpen"
        :active="!!statusTarget?.active"
        translation-key-prefix="assessmentToolConnections.assessmentToolsPage"
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
import { useAssessmentToolsTableHeaders } from "@/pages/(app)/assessment-tool/composables/useAssessmentToolsTableHeaders.ts";
import { useAssessmentToolsTableActions } from "@/pages/(app)/assessment-tool/composables/useAssessmentToolsTableActions.ts";
import {
    useAssessmentToolsFilters,
    LMS_TYPE_FILTER_KEY,
} from "@/pages/(app)/assessment-tool/composables/useAssessmentToolsFilters.ts";
import { STATUS_FILTER_KEY } from "@/components/widgets/filters/statusFilterSection.ts";
import { INSTITUTION_FILTER_KEY } from "@/components/widgets/filters/useInstitutionFilterSection.ts";
import { useAssessmentTools } from "@/pages/(app)/assessment-tool/api/useAssessmentTools.ts";
import { useDeleteAssessmentTool } from "@/pages/(app)/assessment-tool/api/useDeleteAssessmentTool.ts";
import { useToggleAssessmentToolStatus } from "@/pages/(app)/assessment-tool/api/useToggleAssessmentTool.ts";
import type { AssessmentToolsResponse } from "@/models/seb-server/assessmentTool.ts";
import type { LMSTypeEnum } from "@/models/seb-server/assessmentToolEnums.ts";
import type { TableItem } from "@/components/widgets/entity-table/types.ts";
import AddButton from "@/components/widgets/AddButton.vue";
import { useRouter, type RouteLocationAsRelative } from "vue-router";

definePage({
    meta: {
        titleKey: "titles.assessmentToolConnections",
        pageTestId: "assessment-tools-page",
        isPageBlue: true,
    },
});

const router = useRouter();

const dataTestId = "assessmentTools";

const assessmentToolDetailRoute = (
    item: TableItem,
): RouteLocationAsRelative | null =>
    item.id != null
        ? {
              name: "/(app)/assessment-tool/[id]/",
              params: { id: String(item.id) },
          }
        : null;

const { headers: assessmentToolTableHeaders, cellFormatters } =
    useAssessmentToolsTableHeaders();
const filterSections = useAssessmentToolsFilters();

const tableData = ref<AssessmentToolsResponse>();

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
    await fetchAssessmentTools();
}, [STATUS_FILTER_KEY, INSTITUTION_FILTER_KEY, LMS_TYPE_FILTER_KEY]);

const selectedStatus = computed(() => selectedFilters.value.status);
const selectedInstitutionId = computed(
    () => selectedFilters.value.institutionId,
);
const selectedType = computed(
    () => selectedFilters.value.selectedType as LMSTypeEnum | null,
);

const {
    data: fetchedData,
    loading,
    error,
    fetchData: fetchAssessmentTools,
} = useAssessmentTools(
    options,
    searchField,
    selectedStatus,
    selectedType,
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
    removeAssessmentToolFromItem,
    loading: deleteLoading,
    error: deleteError,
} = useDeleteAssessmentTool(tableData);

const {
    toggleAssessmentToolStatusFromItem,
    loading: statusLoading,
    error: statusError,
} = useToggleAssessmentToolStatus(tableData);

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
    await removeAssessmentToolFromItem(deleteTarget.value);
    deleteDialogOpen.value = false;
}

async function confirmStatusChange() {
    if (!statusTarget.value) return;
    await toggleAssessmentToolStatusFromItem(statusTarget.value);
    statusDialogOpen.value = false;
}

const tableActions = useAssessmentToolsTableActions({
    onEdit: (item) => {
        const target = assessmentToolDetailRoute(item);
        if (!target) {
            // TODO @andrei implement error handling
            return;
        }
        void router.push(target);
    },
    onDelete: (item) => openDeleteDialog(item),
});
</script>
