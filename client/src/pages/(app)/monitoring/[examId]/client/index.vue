<template>
    <BasicPage
        v-if="isDataLoaded"
        :title="monitoringStore.selectedExam?.quizName ?? ''"
        :bread-crumb="breadCrumb"
        :panel-left-collapsed="!filtersOpen"
        :data-test-id="dataTestId"
    >
        <template #PanelLeft>
            <MonitoringClientsFilterPanel
                :exam-id="examId"
                @update-page-info="updateAll"
            />
        </template>

        <template #ActionButton>
            <v-sheet
                border
                color="surface"
                rounded="lg"
                class="d-inline-flex align-center ga-2 px-4 py-2"
            >
                <v-icon color="primary" size="18">
                    mdi-account-multiple-outline
                </v-icon>
                <span class="text-title-medium font-weight-bold text-primary">
                    {{ tableRef?.displayedCount ?? 0 }}
                </span>
                <span class="text-body-medium font-weight-bold">
                    {{ $t("monitoringClients.main.displayed") }}
                </span>
                <template v-if="selectedCount > 0">
                    <span class="text-medium-emphasis">·</span>
                    <span class="text-title-medium font-weight-bold">
                        {{ selectedCount }}
                    </span>
                    <span class="text-body-medium font-weight-bold">
                        {{ $t("monitoringClients.main.selected") }}
                    </span>
                </template>
            </v-sheet>
        </template>

        <template #PanelMain>
            <FilterControlsRow
                class="mb-3"
                :open="filtersOpen"
                :pills="activePills"
                :data-test-id="dataTestId"
                @toggle="handleToggleFilters"
                @remove="onRemovePill"
                @clear-all="handleClearAll"
            />
            <MonitoringClientsTable ref="tableRef" :exam-id="examId" />
        </template>
    </BasicPage>
</template>

<script setup lang="ts">
import { computed, ref, onBeforeMount, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import FilterControlsRow from "@/components/widgets/filters/FilterControlsRow.vue";
import { useListFilterPanel } from "@/components/widgets/filters/useListFilterPanel.ts";
import type { TableFilters } from "@/components/widgets/entity-table/types.ts";
import type { BreadCrumbItem } from "@/components/widgets/breadCrumb/types.ts";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";
import * as monitoringService from "@/services/seb-server/monitoringService.ts";
import * as indicatorService from "@/services/seb-server/indicatorService.ts";
import { MonitoringOverview } from "@/models/seb-server/monitoring.ts";
import { Indicators } from "@/models/seb-server/indicators.ts";
import { translate } from "@/utils/generalUtils.ts";
import { typedTo } from "@/router/typedTo.ts";
import * as useMonitoringData from "./composables/useMonitoringData.ts";
import { useMonitoringClientsFilters } from "./composables/useMonitoringClientsFilters.ts";
import MonitoringClientsFilterPanel from "./components/MonitoringClientsFilterPanel.vue";
import MonitoringClientsTable from "./components/MonitoringClientsTable.vue";

definePage({
    meta: {
        titleKey: "titles.monitoring",
        pageTestId: "monitoring-detail-clients-page",
    },
});

const dataTestId = "monitoring-clients";

// exam
const examId = useRoute().params.examId;

// stores
const monitoringStore = useMonitoringStore();

// data load
const isDataLoaded = ref<boolean>(false);

// interval
let intervalRefresh: ReturnType<typeof setInterval> | null = null;
let dataFetching = false;
const REFRESH_INTERVAL: number = 10000;

const tableRef = ref<InstanceType<typeof MonitoringClientsTable>>();

onBeforeMount(async () => {
    if (monitoringStore.selectedExam == null) {
        await useMonitoringData.getExamAndStore(examId);
    }

    await getIndicators();
    await useMonitoringData.getClientGroups(examId);
    await getOverviewData();

    startIntervalRefresh();

    isDataLoaded.value = true;
});

onBeforeUnmount(() => {
    stopIntervalRefresh();
    monitoringStore.clearClientValues();
});

const breadCrumb = computed<BreadCrumbItem[]>(() => {
    const items: BreadCrumbItem[] = [
        {
            label: translate("titles.monitoring"),
            link: typedTo({ name: "/(app)/monitoring/" }),
        },
    ];

    const selectedExam = monitoringStore.selectedExam;
    if (selectedExam !== null) {
        items.push({
            label: selectedExam.quizName,
            link: typedTo({
                name: "/(app)/monitoring/[examId]/",
                params: {
                    examId: selectedExam.id.toString(),
                },
            }),
        });
    }

    items.push({ label: translate("titles.clientList") });
    return items;
});

const selectedCount = computed(
    () => monitoringStore.selectedMonitoringIds.length,
);

// filters
const { filterSections, filterValues, applyFilterValues, clearAllFilters } =
    useMonitoringClientsFilters();

const { filtersOpen, activePills, onRemovePill } = useListFilterPanel({
    search: {
        applied: () => monitoringStore.searchName ?? undefined,
        clear: handleClearSearchPill,
    },
    filterSections: () => filterSections.value,
    selectedFilters: () => filterValues.value,
    setFilters: handleSetFilters,
});

function handleToggleFilters() {
    filtersOpen.value = !filtersOpen.value;
}

function handleSetFilters(next: TableFilters) {
    applyFilterValues(next);
    updateAll();
}

function handleClearSearchPill() {
    monitoringStore.searchName = null;
    updateAll();
}

function handleClearAll() {
    monitoringStore.searchName = null;
    clearAllFilters();
    updateAll();
}

// NOTE: This is the backend data fetch that gets called in an update interval.
//       To prevent subsequent calls when the backend is not responding, what would lead to
//       sending more calls and allocate unnecessary resources on the backend, we use the
//       dataFetching here to track the fetching and only fetch data if there was a response
//       from the former call.
async function getOverviewData() {
    if (dataFetching) {
        return;
    }

    dataFetching = true;

    const overviewResponse: MonitoringOverview | null =
        await monitoringService.getOverview(examId);

    if (overviewResponse == null) {
        dataFetching = false;
        return;
    }

    monitoringStore.monitoringOverviewData = overviewResponse;
    dataFetching = false;
}

async function updateAll() {
    getOverviewData();
    tableRef.value?.updatePage();
}

async function getIndicators() {
    const indicatorsResponse: Indicators | null =
        await indicatorService.getIndicators(examId);

    if (indicatorsResponse == null) {
        return;
    }

    monitoringStore.indicators = indicatorsResponse;
}

async function startIntervalRefresh() {
    intervalRefresh = setInterval(async () => {
        getOverviewData();
    }, REFRESH_INTERVAL);
}

function stopIntervalRefresh() {
    if (intervalRefresh) {
        clearInterval(intervalRefresh);
        intervalRefresh = null;
    }
}
</script>
