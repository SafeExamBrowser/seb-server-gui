<template>
    <template v-if="isDataLoaded">
        <MonitoringClientsInfo
            @update-page-info="updateAll"
        ></MonitoringClientsInfo>
        <MonitoringClientsMain ref="mainRef"></MonitoringClientsMain>
    </template>
</template>

<script setup lang="ts">
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";
import { useAppBarStore } from "@/stores/store";
import { translate } from "@/utils/generalUtils";
import * as monitoringViewService from "@/services/seb-server/component-services/monitoringViewService";
import * as indicatorViewService from "@/services/seb-server/component-services/indicatorViewService";
import MonitoringClientsMain from "@/components/views/seb-server/monitoring/clients/MonitoringClientsMain.vue";
import { useRoute } from "vue-router";
import { ref, onBeforeMount, onBeforeUnmount } from "vue";
import { MonitoringOverview } from "@/models/seb-server/monitoring";
import { Indicators } from "@/models/seb-server/indicators";

// exam
const examId = useRoute().params.examId.toString();

// stores
const monitoringStore = useMonitoringStore();
const appBarStore = useAppBarStore();

// data load
const isDataLoaded = ref<boolean>(false);

// interval
let intervalRefresh: ReturnType<typeof setInterval> | null = null;
const REFRESH_INTERVAL: number = 10000;

const mainRef = ref();

onBeforeMount(async () => {
    appBarStore.title = translate("titles.monitoring");

    if (monitoringStore.selectedExam == null) {
        await monitoringViewService.getExamAndStore(examId);
    }

    await getIndicators();
    await monitoringViewService.getClientGroups(examId);
    await getOverviewData();

    startIntervalRefresh();

    isDataLoaded.value = true;
});

onBeforeUnmount(() => {
    stopIntervalRefresh();
    monitoringStore.clearClientValues();
});

async function getOverviewData() {
    const overviewResponse: MonitoringOverview | null =
        await monitoringViewService.getOverview(examId);

    if (overviewResponse == null) {
        return;
    }

    monitoringStore.monitoringOverviewData = overviewResponse;
}

async function updateAll() {
    getOverviewData();
    mainRef.value.updatePage();
}

async function getIndicators() {
    const indicatorsResponse: Indicators | null =
        await indicatorViewService.getIndicators(examId);

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
