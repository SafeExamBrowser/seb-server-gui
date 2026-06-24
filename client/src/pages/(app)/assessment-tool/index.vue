<template>
    <BasicPage
        :title="$t('titles.assessmentToolConnections')"
        :bread-crumb="[{ label: $t('titles.assessmentToolConnections') }]"
        :data-test-id="dataTestId"
        :panel-left-collapsed="!filtersOpen"
    >
        <template #SubNav>
            <SettingsNavigation />
        </template>

        <template #ActionButton>
            <AddButton
                :route="{ name: '/(app)/assessment-tool/create/' }"
                :data-test-id="dataTestId"
            />
        </template>

        <template #PanelLeft>
            <SearchBar
                v-model="list.searchInputValue"
                :applied-search="list.searchField"
                search-text="assessmentToolConnections.list.filters.searchField"
                :filter-sections="list.filterSections"
                :filter-values="list.selectedFilters"
                :data-test-id="dataTestId"
                @search="list.onSearch"
                @clear="list.onClearSearch"
                @update:filter-values="list.setFilters"
                @clear-filters="list.clearAll"
            />
        </template>

        <template #PanelMain>
            <FilterControlsRow
                :open="filtersOpen"
                :pills="activePills"
                :data-test-id="dataTestId"
                @toggle="filtersOpen = !filtersOpen"
                @remove="onRemovePill"
                @clear-all="list.clearAll"
            />
            <LoadingFallbackComponent :loading="false" :errors="list.errors">
                <EntityTable
                    class="px-2 pt-2"
                    :headers="list.headers"
                    :items="list.items"
                    :page-count="list.pageCount"
                    :items-per-page="list.options.itemsPerPage"
                    :options="list.options"
                    :loading="list.loading"
                    :detail-route="list.detailRoute"
                    :cell-formatters="list.cellFormatters"
                    :actions="list.actions"
                    :data-test-id="dataTestId"
                    :item-key="assessmentToolListConfig.itemKey"
                    @update:options="list.loadItems"
                >
                    <template #cell-active="{ item, rowTestId }">
                        <ActiveStatusChip
                            :active="!!item.active"
                            :data-test-id="`${rowTestId}-status-chip`"
                            @click="statusFlow.openDialog(item)"
                        />
                    </template>
                </EntityTable>
            </LoadingFallbackComponent>
        </template>
    </BasicPage>

    <DeleteConfirmDialog
        v-model="deleteFlow.dialogOpen"
        :detail-text="deleteFlow.detailText"
        translation-key-prefix="assessmentToolConnections.list"
        :data-test-id="dataTestId"
        @confirm="deleteFlow.confirm"
    />

    <StatusConfirmDialog
        v-model="statusFlow.dialogOpen"
        :active="!!statusFlow.target?.active"
        translation-key-prefix="assessmentToolConnections.list"
        :data-test-id="dataTestId"
        @confirm="statusFlow.confirm"
    />
</template>

<script setup lang="ts">
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
import AddButton from "@/components/widgets/AddButton.vue";
import { assessmentToolListConfig } from "./assessmentToolListConfig.ts";
import { useAssessmentToolsOverview } from "./composables/useAssessmentToolsOverview.ts";

definePage({
    meta: {
        titleKey: "titles.assessmentToolConnections",
        pageTestId: "assessment-tools-page",
        isPageBlue: true,
    },
});

const dataTestId = assessmentToolListConfig.testIdBase;

const { list, deleteFlow, statusFlow } = useAssessmentToolsOverview();

const { filtersOpen, activePills, onRemovePill } = useListFilterPanel({
    search: { applied: () => list.searchField, clear: list.onClearSearch },
    filterSections: () => list.filterSections,
    selectedFilters: () => list.selectedFilters,
    setFilters: list.setFilters,
});
</script>
