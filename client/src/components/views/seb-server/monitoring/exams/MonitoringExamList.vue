<template>
    <BasicPage :title="$t('titles.monitoring')" :bread-crumb="[]">
        <template #PanelTop>
            <SearchBar
                v-model="searchInputValue"
                search-text="monitoringExams.info.examName"
                search-title="monitoringExams.info.examNameSearchPlaceholder"
                date-title="monitoringExams.info.examStartSearchPlaceholder"
                :date-value="dateValue"
                :filter-sections="filterSections"
                :filter-values="selectedFilters"
                @search="onSearch"
                @clear="onClear"
                @update:date-value="setDate"
                @update:filter-values="setFilters"
                @clear-filters="resetFilters"
            />
        </template>
        <template #PanelMain>
            <div v-if="error" class="pa-4">{{ error }}</div>
            <LoadingFallbackComponent :loading="false" :errors="[]">
                <EntityTable
                    :headers="tableHeaders"
                    :items="tableData?.content ?? []"
                    :total-items="totalItems"
                    :page-count="pageCount"
                    :items-per-page="options.itemsPerPage"
                    :options="options"
                    :loading="loading"
                    :detail-route="getRouteName('MonitoringOverview')"
                    route-param-key="examId"
                    item-identifier-key="id"
                    translation-key-prefix="monitoringExams"
                    :cell-formatters="cellFormatters"
                    @update:options="loadItems"
                />
            </LoadingFallbackComponent>
        </template>
    </BasicPage>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import SearchBar from "@/components/blocks/searches/SearchBar.vue";
import EntityTable from "@/components/blocks/entity-table/EntityTable.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useUrlTableState } from "@/components/blocks/entity-table/composables/useUrlTableState.ts";
import { useMonitoringTableHeaders } from "@/components/views/seb-server/monitoring/exams/composables/useMonitoringTableHeaders.ts";
import {
    useMonitoringFilters,
    TYPE_FILTER_KEY,
    MONITORING_STATUS_FILTER_KEY,
} from "@/components/views/seb-server/monitoring/exams/composables/useMonitoringFilters.ts";
import { useMonitoringExams } from "@/components/views/seb-server/monitoring/exams/api/useMonitoringExams.ts";
import { useTableCellFormatters } from "@/components/blocks/entity-table/composables/useTableCellFormatters.ts";
import { getRouteName } from "@/router/routeNames.ts";
import type { Exams } from "@/models/seb-server/exam.ts";

const tableHeaders = useMonitoringTableHeaders();
const filterSections = useMonitoringFilters();

const tableData = ref<Exams>();

const {
    searchInputValue,
    searchField,
    selectedFilters,
    dateValue,
    dateTimestamp,
    options,
    totalItems,
    loadItems,
    onSearch,
    setFilters,
    resetFilters,
    clearAll,
    setDate,
} = useUrlTableState(
    tableData,
    async () => {
        await fetchExams();
    },
    [TYPE_FILTER_KEY, MONITORING_STATUS_FILTER_KEY],
    "startDate",
);

async function onClear() {
    await clearAll();
}

const selectedType = computed(() => selectedFilters.value[TYPE_FILTER_KEY]);
const selectedStatus = computed(
    () => selectedFilters.value[MONITORING_STATUS_FILTER_KEY],
);

const {
    data: fetchedData,
    loading,
    error,
    fetchData: fetchExams,
} = useMonitoringExams(
    options,
    searchField,
    dateTimestamp,
    selectedType,
    selectedStatus,
);

watch(
    fetchedData,
    (v) => {
        tableData.value = v;
    },
    { immediate: true },
);

const pageCount = computed(() => tableData.value?.number_of_pages ?? 0);

const { cellFormatters } = useTableCellFormatters({
    headers: tableHeaders,
});
</script>
