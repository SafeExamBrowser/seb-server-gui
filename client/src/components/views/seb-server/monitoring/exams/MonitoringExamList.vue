<template>
    <BasicPage :title="$t('titles.monitoring')" :bread-crumb="breadCrumb">
        <template #PanelMain>
            <div class="d-flex flex-column fill-height ga-4">
                <v-card elevation="4" rounded="lg" class="flex-shrink-0">
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
                </v-card>

                <v-card
                    elevation="4"
                    rounded="lg"
                    class="flex-grow-1 overflow-y-auto"
                    style="min-height: 0"
                >
                    <div v-if="error" class="pa-4">{{ error }}</div>

                    <LoadingFallbackComponent :loading="false" :errors="[]">
                        <EntityTable
                            :headers="tableHeaders"
                            :items="tableData?.content ?? []"
                            :page-count="pageCount"
                            :items-per-page="options.itemsPerPage"
                            :options="options"
                            :loading="loading"
                            :detail-route="getRouteName('MonitoringOverview')"
                            route-param-key="examId"
                            item-identifier-key="id"
                            :cell-formatters="cellFormatters"
                            @update:options="loadItems"
                        />
                    </LoadingFallbackComponent>
                </v-card>
            </div>
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
import { useSebServerCellFormatters } from "@/components/views/seb-server/composables/useSebServerCellFormatters.ts";
import { getRouteName } from "@/router/routeNames.ts";
import { translate } from "@/utils/generalUtils.ts";
import type { Exams } from "@/models/seb-server/exam.ts";
import type { BreadCrumbItem } from "@/components/widgets/breadCrumb/types.ts";

const breadCrumb: BreadCrumbItem[] = [
    { label: translate("titles.home"), link: "/" },
];

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

const { cellFormatters } = useSebServerCellFormatters(tableHeaders);
</script>
