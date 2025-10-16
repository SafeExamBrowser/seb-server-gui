<template>
    <template v-if="isDataLoaded">
        <MonitoringDetailsInfo></MonitoringDetailsInfo>
        <MonitoringDetailsMain></MonitoringDetailsMain>
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
let intervalRefresh: any | null = null;
// todo set interval
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
        getSingleConnection();
        getPendingNotifications();
    }, REFRESH_INTERVAL);
}

function stopIntervalRefresh() {
    if (intervalRefresh) {
        clearInterval(intervalRefresh);
    }
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
