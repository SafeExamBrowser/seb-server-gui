<template>
    <BasicPage
        :title="$t('titles.monitoring')"
        :bread-crumb="[{ label: $t('titles.monitoring') }]"
    >
        <template #PanelTop>
            <SearchBar
                v-model="searchInputValue"
                search-text="monitoringExams.info.examNameSearchPlaceholder"
                date-title="monitoringExams.info.examStartSearchPlaceholder"
                :date-value="dateValue"
                :filter-sections="filterSections"
                :filter-values="selectedFilters"
                @search="onSearch"
                @clear="onClearSearch"
                @update:date-value="setDate"
                @update:filter-values="setFilters"
                @clear-filters="clearAll"
            />
        </template>
        <template #PanelMain>
            <LoadingFallbackComponent
                :loading="false"
                :errors="error ? [error] : []"
            >
                <EntityTable
                    class="pl-6 pr-6 pt-3"
                    :headers="tableHeaders"
                    :items="tableData?.content ?? []"
                    :page-count="pageCount"
                    :items-per-page="options.itemsPerPage"
                    :options="options"
                    :loading="loading"
                    :detail-route="monitoringDetailRoute"
                    :item-identifier-key="monitoringIdentifierKey"
                    :cell-formatters="cellFormatters"
                    :actions="tableActions"
                    @update:options="loadItems"
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
import { computed, ref, watch } from "vue";
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import SearchBar from "@/components/widgets/searches/SearchBar.vue";
import EntityTable from "@/components/widgets/entity-table/EntityTable.vue";
import EnumChip from "@/components/widgets/EnumChip.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useUrlTableState } from "@/components/widgets/entity-table/composables/useUrlTableState.ts";
import { useMonitoringTableHeaders } from "@/pages/(app)/monitoring/composables/useMonitoringTableHeaders.ts";
import { useMonitoringTableActions } from "@/pages/(app)/monitoring/composables/useMonitoringTableActions.ts";
import {
    useMonitoringFilters,
    TYPE_FILTER_KEY,
    MONITORING_STATUS_FILTER_KEY,
} from "@/pages/(app)/monitoring/composables/useMonitoringFilters.ts";
import { useMonitoringExams } from "@/pages/(app)/monitoring/api/useMonitoringExams.ts";
import type { Exams } from "@/models/seb-server/exam.ts";
import {
    ExamStatusEnum,
    examStatusColor,
} from "@/models/seb-server/examFiltersEnum.ts";
import { useDetailRouteNavigation } from "../../../router/routeNavigation.ts";
import type { RouteLocationAsRelative } from "vue-router";

definePage({
    meta: {
        titleKey: "titles.monitoring",
        pageTestId: "monitoring-page",
    },
});
const monitoringDetailRoute: RouteLocationAsRelative = {
    name: "/(app)/monitoring/[examId]/",
};

const monitoringIdentifierKey = "id";

const { headers: tableHeaders, cellFormatters } = useMonitoringTableHeaders();
const filterSections = useMonitoringFilters();
const { pushDetailRoute } = useDetailRouteNavigation();

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
    onClearSearch,
    setFilters,
    clearAll,
    setDate,
} = useUrlTableState(
    async () => {
        await fetchExams();
    },
    [TYPE_FILTER_KEY, MONITORING_STATUS_FILTER_KEY],
    "startDate",
);

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

const tableActions = useMonitoringTableActions({
    onNavigate: (item) =>
        pushDetailRoute(monitoringDetailRoute, item, monitoringIdentifierKey),
});
</script>
