<template>
    <template v-if="isDataLoaded">
        <MonitoringDetailsInfo
            @update-page-info="updatePage"
        ></MonitoringDetailsInfo>
        <MonitoringDetailsMain
            @update-page-main="updatePage"
        ></MonitoringDetailsMain>
    </template>
</template>

<script setup lang="ts">
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";
import { useAppBarStore } from "@/stores/store";
import { translate } from "@/utils/generalUtils";
import * as monitoringViewService from "@/services/seb-server/component-services/monitoringViewService";
import * as indicatorViewService from "@/services/seb-server/component-services/indicatorViewService";
import { useRoute } from "vue-router";
import { ref, onBeforeMount, onBeforeUnmount } from "vue";
import {
    ClientNotification,
    SingleConnection,
} from "@/models/seb-server/monitoring";
import { Indicators } from "@/models/seb-server/indicators";
import MonitoringDetailsMain from "@/components/views/seb-server/monitoring/client-detail/MonitoringDetailsMain.vue";
import MonitoringDetailsInfo from "@/components/views/seb-server/monitoring/client-detail/MonitoringDetailsInfo.vue";

// route params
const examId = useRoute().params.examId.toString();
const connectionToken = useRoute().params.connectionToken.toString();
// const connectionId = useRoute().params.connectionId.toString();

// stores
const monitoringStore = useMonitoringStore();
const appBarStore = useAppBarStore();

// data load
const isDataLoaded = ref<boolean>(false);

// interval
let intervalRefresh: ReturnType<typeof setInterval> | null = null;
let dataFetching = false;
const REFRESH_INTERVAL: number = 5000;

onBeforeMount(async () => {
    appBarStore.title = translate("titles.monitoring");

    await getSingleConnection();
    await getIndicators();
    await monitoringViewService.getExamAndStore(examId);
    await monitoringViewService.getClientGroups(examId);
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
        await monitoringViewService.getSingleConnection(
            examId,
            connectionToken,
        );
    if (singleConnectionResponse == null) {
        return;
    }

    monitoringStore.selectedSingleConn = singleConnectionResponse;
}

async function getIndicators() {
    const indicatorsResponse: Indicators | null =
        await indicatorViewService.getIndicators(examId);

    if (indicatorsResponse == null) {
        return;
    }

    monitoringStore.indicators = indicatorsResponse;
}

async function getPendingNotifications() {
    const notificationsResponse: ClientNotification[] | null =
        await monitoringViewService.getPendingNotifcations(
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

    monitoringStore.clientGroupsSingle =
        monitoringViewService.extractClientGroupNames(
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
