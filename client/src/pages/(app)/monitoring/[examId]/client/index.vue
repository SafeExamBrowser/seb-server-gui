<template>
    <template v-if="isDataLoaded">
        <MonitoringClientsInfo
            :exam-id="examId"
            @update-page-info="updateAll"
        ></MonitoringClientsInfo>
        <MonitoringClientsMain
            ref="mainRef"
            :exam-id="examId"
        ></MonitoringClientsMain>
    </template>
</template>

<script setup lang="ts">
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";
import * as monitoringService from "@/services/seb-server/monitoringService.ts";
import * as useMonitoringData from "../client/composables/useMonitoringData.ts";

import * as indicatorService from "@/services/seb-server/indicatorService.ts";
import MonitoringClientsMain from "../client/components/MonitoringClientsMain.vue";
import { useRoute } from "vue-router";
import { ref, onBeforeMount, onBeforeUnmount } from "vue";
import { MonitoringOverview } from "@/models/seb-server/monitoring.ts";
import { Indicators } from "@/models/seb-server/indicators.ts";
import MonitoringClientsInfo from "../client/components/MonitoringClientsInfo.vue";

definePage({
    meta: {
        titleKey: "titles.monitoring",
        pageTestId: "monitoring-detail-clients-page",
    },
});

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

const mainRef = ref();

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

// NOTE: This is the backend data fetch that gets called in an update interval.
//       To prevent subsequent calls when the backend is not responding, what would lead to
//       sending more calls and allocate unnecessary resources on the backend, we use the
//       dataFetching here to track the fetching and only fetch data if there was a response
//       from the former call.
async function getOverviewData() {
    if (dataFetching) {
        console.warn(
            "********** Skip client list data fetch due to no response from backend",
        );
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
    mainRef.value.updatePage();
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

<style scoped></style>
