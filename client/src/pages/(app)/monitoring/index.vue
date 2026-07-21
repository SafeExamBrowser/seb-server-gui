<template>
    <BasicPage
        :title="$t('titles.monitoring')"
        :bread-crumb="[{ label: $t('titles.monitoring') }]"
        :data-test-id="dataTestId"
        :panel-left-collapsed="!filtersOpen"
    >
        <template #PanelLeft>
            <SearchBar
                v-model="list.searchInputValue"
                :applied-search="list.searchField"
                search-text="monitoringExams.info.examNameSearchPlaceholder"
                date-title="monitoringExams.info.examStartSearchPlaceholder"
                :date-value="list.dateValue"
                :filter-sections="list.filterSections"
                :filter-values="list.selectedFilters"
                :data-test-id="dataTestId"
                @search="list.onSearch"
                @clear="list.onClearSearch"
                @update:date-value="list.setDate"
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
                    item-key="id"
                    @update:options="list.loadItems"
                >
                    <template #cell-type="{ formattedValue }">
                        <EnumChip :label="formattedValue" />
                    </template>

                    <template #cell-status="{ value, formattedValue }">
                        <EnumChip
                            :label="formattedValue"
                            :color="examStatusColor[value as ExamStatusEnum]"
                        />
                    </template>
                </EntityTable>
            </LoadingFallbackComponent>
        </template>
    </BasicPage>
</template>

<script setup lang="ts">
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import EntityTable from "@/components/widgets/entity-table/EntityTable.vue";
import EnumChip from "@/components/widgets/EnumChip.vue";
import FilterControlsRow from "@/components/widgets/filters/FilterControlsRow.vue";
import { useListFilterPanel } from "@/components/widgets/filters/useListFilterPanel.ts";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import SearchBar from "@/components/widgets/searches/SearchBar.vue";
import {
    examStatusColor,
    ExamStatusEnum,
} from "@/models/seb-server/examFiltersEnum.ts";

import { useMonitoringOverview } from "./composables/useMonitoringOverview.ts";

definePage({
    meta: {
        titleKey: "titles.monitoring",
        pageTestId: "monitoring-page",
    },
});

const dataTestId = "monitoring";

const { list } = useMonitoringOverview();

const { filtersOpen, activePills, onRemovePill } = useListFilterPanel({
    search: { applied: () => list.searchField, clear: list.onClearSearch },
    filterSections: () => list.filterSections,
    selectedFilters: () => list.selectedFilters,
    setFilters: list.setFilters,
    date: { value: () => list.dateValue, clear: () => list.setDate(null) },
});
</script>
