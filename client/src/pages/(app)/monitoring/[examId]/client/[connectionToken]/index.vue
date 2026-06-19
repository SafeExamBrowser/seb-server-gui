<template>
    <BasicPage
        v-if="isDataLoaded"
        floating
        :title="clientName"
        :bread-crumb="breadCrumb"
        data-test-id="monitoring-client-detail-page"
    >
        <template #PanelLeft>
            <MonitoringDetailsContextPanel
                :exam-id="examId"
                :connection-token="connectionToken"
                @update-page-info="handleUpdatePage"
            />
        </template>

        <template #ActionButton>
            <v-btn
                color="black"
                prepend-icon="mdi-arrow-left"
                variant="outlined"
                @click="handleBackToClientList"
            >
                {{ $t("monitoringDetails.info.backToClientList") }}
            </v-btn>
        </template>

        <template #PanelMain>
            <MonitoringDetailsMain :connection-token="connectionToken" />
        </template>
    </BasicPage>
</template>

<script setup lang="ts">
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";
import * as monitoringService from "@/services/seb-server/monitoringService.ts";
import * as indicatorService from "@/services/seb-server/indicatorService.ts";
import { useRoute, useRouter } from "vue-router";
import { computed, ref, onBeforeMount, onBeforeUnmount } from "vue";
import {
    ClientNotification,
    SingleConnection,
} from "@/models/seb-server/monitoring.ts";
import { Indicators } from "@/models/seb-server/indicators.ts";
import MonitoringDetailsMain from "./components/MonitoringDetailsMain.vue";
import MonitoringDetailsContextPanel from "./components/MonitoringDetailsContextPanel.vue";
import * as useMonitoringData from "@/pages/(app)/monitoring/[examId]/client/composables/useMonitoringData.ts";
import { extractClientGroupNames } from "@/utils/monitoringUtils.ts";
import { translate } from "@/utils/generalUtils.ts";
import { typedTo } from "@/router/typedTo.ts";
import type { BreadCrumbItem } from "@/components/widgets/breadCrumb/types.ts";

// route params
const examId = useRoute().params.examId;
const connectionToken = useRoute().params.connectionToken;

// stores
const monitoringStore = useMonitoringStore();
const router = useRouter();

// data load
const isDataLoaded = ref(false);

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

//= ==============breadcrumb, title and navigation====================
const nameParts = computed(() => {
    const rawName =
        monitoringStore.selectedSingleConn?.cdat.examUserSessionId ?? "";
    return rawName.split("|").filter((part) => part.trim() !== "");
});

const clientName = computed(() => nameParts.value.join(" ").trim());

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
                params: { examId: selectedExam.id.toString() },
            }),
        });
    }

    items.push({
        label: translate("titles.clientList"),
        link: typedTo({
            name: "/(app)/monitoring/[examId]/client/",
            params: { examId },
        }),
    });

    return items;
});

function handleBackToClientList() {
    void router.push({
        name: "/(app)/monitoring/[examId]/client/",
        params: { examId },
        query: monitoringStore.currentMonitoringQuery,
    });
}

//= =============data fetching================
// NOTE: This is the backend data fetch that gets called in an update interval.
//       To prevent subsequent calls when the backend is not responding, what would lead to
//       sending more calls and allocate unnecessary resources on the backend, we use the
//       dataFetching here to track the fetching and only fetch data if there was a response
//       from the former call.
async function fetchData() {
    if (dataFetching) {
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

async function handleUpdatePage() {
    getSingleConnection();
    getPendingNotifications();
}
</script>
