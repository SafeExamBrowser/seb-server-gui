<template>
    <template v-if="isDataLoaded">
        <MonitoringDetailsInfo
            :exam-id="examId"
            :connection-token="connectionToken"
            @update-page-info="updatePage"
        ></MonitoringDetailsInfo>
        <MonitoringDetailsMain
            :exam-id="examId"
            :connection-token="connectionToken"
            @update-page-main="updatePage"
        ></MonitoringDetailsMain>
    </template>
</template>

<script setup lang="ts">
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";
import * as monitoringService from "@/services/seb-server/monitoringService.ts";
import * as indicatorService from "@/services/seb-server/indicatorService.ts";
import { useRoute } from "vue-router";
import { ref, onBeforeMount, onBeforeUnmount } from "vue";
import {
    ClientNotification,
    SingleConnection,
} from "@/models/seb-server/monitoring.ts";
import { Indicators } from "@/models/seb-server/indicators.ts";
import MonitoringDetailsMain from "@/pages/(app)/monitoring/[id]/client/[connectionToken]/components/MonitoringDetailsMain.vue";
import MonitoringDetailsInfo from "@/pages/(app)/monitoring/[id]/client/[connectionToken]/components/MonitoringDetailsInfo.vue";
import * as useMonitoringData from "@/components/views/seb-server/monitoring/composables/useMonitoringData.ts";
import { extractClientGroupNames } from "@/components/views/seb-server/monitoring/utils/monitoringUtils.ts";

// route params
const examId = useRoute().params.id;
const connectionToken = useRoute().params.connectionToken;

// stores
const monitoringStore = useMonitoringStore();

// data load
const isDataLoaded = ref<boolean>(false);

// interval
let intervalRefresh: ReturnType<typeof setInterval> | null = null;
let dataFetching = false;
const REFRESH_INTERVAL: number = 5000;

onBeforeMount(async () => {
    await getSingleConnection();
    await getIndicators();
    await useMonitoringData.getExamAndStore(examId);
    await useMonitoringData.getClientGroups(examId);
    await getPendingNotifications();
    storeClientGroups();

    startIntervalRefresh();

    isDataLoaded.value = true;
});

onBeforeUnmount(() => {
    stopIntervalRefresh();
});

//= =============data fetching================
// NOTE: This is the backend data fetch that gets called in an update interval.
//       To prevent subsequent calls when the backend is not responding, what would lead to
//       sending more calls and allocate unnecessary resources on the backend, we use the
//       dataFetching here to track the fetching and only fetch data if there was a response
//       from the former call.
async function fetchData() {
    if (dataFetching) {
        console.warn(
            "********** Skip client data fetch due to no response from backend",
        );
        return;
    }

    dataFetching = true;

    getSingleConnection();
    getPendingNotifications();
    dataFetching = false;
}

async function getSingleConnection() {
    const singleConnectionResponse: SingleConnection | null =
        await monitoringService.getSingleConnection(examId, connectionToken);
    if (singleConnectionResponse == null) {
        return;
    }

    monitoringStore.selectedSingleConn = singleConnectionResponse;
}

async function getIndicators() {
    const indicatorsResponse: Indicators | null =
        await indicatorService.getIndicators(examId);

    if (indicatorsResponse == null) {
        return;
    }

    monitoringStore.indicators = indicatorsResponse;
}

async function getPendingNotifications() {
    const notificationsResponse: ClientNotification[] | null =
        await monitoringService.getPendingNotifications(
            examId,
            connectionToken,
        );
    if (notificationsResponse == null) {
        return;
    }

    monitoringStore.pendingNotifications = notificationsResponse;
}

//= ================data preparing===================
async function storeClientGroups() {
    if (monitoringStore.selectedSingleConn == null) {
        return;
    }

    monitoringStore.clientGroupsSingle = extractClientGroupNames(
        monitoringStore.selectedSingleConn.cg,
    );
}

//= ================interval===================
async function startIntervalRefresh() {
    intervalRefresh = setInterval(async () => {
        fetchData();
    }, REFRESH_INTERVAL);
}

function stopIntervalRefresh() {
    if (intervalRefresh) {
        clearInterval(intervalRefresh);
    }
}

async function updatePage() {
    getSingleConnection();
    getPendingNotifications();
}

// //todo
//
// // Search + clear search
// function onSearch() {
//     searchQuery.value = userAccountStore.searchField?.trim().toLowerCase() ?? "";
//     options.value.page = 1;
// }
// function onClearSearch() {
//     userAccountStore.searchField = "";
//     searchQuery.value = "";
//     selectedStatus.value = null;
//     selectedInstitutionId.value = null;
//     options.value.page = 1;
// }
</script>

<style scoped></style>
