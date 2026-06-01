<template>
    <AlertMsg
        v-if="isMonitoringDisabled()"
        :alert-props="{
            title: getMonitoringDisabledWarningText(),
            color: 'warning',
            type: 'alert',
            customText: '',
        }"
    >
    </AlertMsg>

    <BasicPage
        v-else
        :title="monitoringStore.selectedExam?.quizName ?? ''"
        :bread-crumb="breadCrumb"
        data-test-id="monitoring-detail-page"
    >
        <template #PanelLeft>
            <MonitoringContextPanel
                :refresh-seconds="REFRESH_INTERVAL / 1000"
            />
        </template>

        <template v-if="connectionsTotal != null" #ActionButton>
            <div
                class="d-inline-flex align-center ga-2 bg-surface border-thin rounded-lg px-4 py-2"
            >
                <v-icon color="primary" size="18">
                    mdi-account-multiple-outline
                </v-icon>
                <span class="text-primary text-subtitle-1 font-weight-bold">
                    {{ connectionsTotal }}
                </span>
                <span class="text-body-2 font-weight-medium">
                    {{ $t("monitoringOverview.infos.connections") }}
                </span>
            </div>
        </template>

        <template #PanelMain>
            <div class="pa-6">
                <v-row class="align-stretch">
                    <v-col cols="12" :md="hasIndicators ? 4 : 6">
                        <MonitoringOverviewClients :exam-id="examId" />
                    </v-col>

                    <v-col
                        v-if="hasNotifications"
                        cols="12"
                        :md="hasIndicators ? 4 : 6"
                    >
                        <MonitoringOverviewNotifications :exam-id="examId" />
                    </v-col>

                    <v-col v-if="hasIndicators" cols="12" md="4">
                        <MonitoringOverviewIndicators :exam-id="examId" />
                    </v-col>
                </v-row>

                <v-row v-if="hasGroups" class="mt-2">
                    <v-col cols="12">
                        <MonitoringOverviewGroups :exam-id="examId" />
                    </v-col>
                </v-row>
            </div>
        </template>
    </BasicPage>
</template>

<script setup lang="ts">
import AlertMsg from "@/components/widgets/AlertMsg.vue";
import BasicPage from "@/components/layout/pages/BasicPage.vue";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";
import * as indicatorService from "@/services/seb-server/indicatorService.ts";
import { useRoute } from "vue-router";
import { computed, onBeforeMount, onBeforeUnmount } from "vue";
import { MonitoringOverview } from "@/models/seb-server/monitoring.ts";
import { Indicators } from "@/models/seb-server/indicators.ts";
import MonitoringContextPanel from "./components/MonitoringContextPanel.vue";
import MonitoringOverviewClients from "./components/MonitoringOverviewClients.vue";
import MonitoringOverviewNotifications from "./components/MonitoringOverviewNotifications.vue";
import MonitoringOverviewIndicators from "./components/MonitoringOverviewIndicators.vue";
import MonitoringOverviewGroups from "./components/MonitoringOverviewGroups.vue";
import * as monitoringService from "@/services/seb-server/monitoringService.ts";
import * as useMonitoringData from "./client/composables/useMonitoringData.ts";
import {
    getMonitoringDisabledWarningText,
    isMonitoringDisabled,
} from "@/utils/monitoringUtils.ts";
import { translate } from "@/utils/generalUtils.ts";
import { typedTo } from "@/router/typedTo.ts";
import type { BreadCrumbItem } from "@/components/widgets/breadCrumb/types.ts";

definePage({
    meta: {
        titleKey: "titles.monitoring",
        pageTestId: "monitoring-detail-page",
    },
});

// exam
const examId = useRoute().params.examId;

// stores
const monitoringStore = useMonitoringStore();

// interval
let intervalRefresh: ReturnType<typeof setInterval> | null = null;
let dataFetching = false;
const REFRESH_INTERVAL = 5000;

onBeforeMount(async () => {
    await useMonitoringData.getExamAndStore(examId);
    await getIndicatorData();
    await getOverviewData();
    await useMonitoringData.getAskAndStore(examId);
    await startIntervalRefresh();
});

onBeforeUnmount(() => {
    stopIntervalRefresh();
});

const breadCrumb = computed<BreadCrumbItem[]>(() => [
    {
        label: translate("titles.monitoring"),
        link: typedTo({ name: "/(app)/monitoring/" }),
    },
    { label: monitoringStore.selectedExam?.quizName ?? "" },
]);

const connectionsTotal = computed(
    () => monitoringStore.monitoringOverviewData?.clientStates.total,
);

const hasNotifications = computed(
    () => monitoringStore.monitoringOverviewData?.notifications != null,
);

const hasIndicators = computed(
    () =>
        monitoringStore.monitoringOverviewData?.indicators.BATTERY_STATUS !=
            null &&
        monitoringStore.monitoringOverviewData?.indicators.WLAN_STATUS != null,
);

const hasGroups = computed(
    () =>
        (monitoringStore.monitoringOverviewData?.clientGroups.length ?? 0) > 0,
);

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

    if (!overviewResponse) {
        dataFetching = false;
        return;
    }

    monitoringStore.monitoringOverviewData = overviewResponse;
    dataFetching = false;
}

async function getIndicatorData() {
    const indicatorResponse: Indicators | null =
        await indicatorService.getIndicators(examId);
    if (!indicatorResponse) return;

    monitoringStore.indicators = indicatorResponse;

    if (monitoringStore.indicators?.content) {
        for (const indicator of monitoringStore.indicators.content) {
            if (indicator.type === "BATTERY_STATUS") {
                if (indicator.color) {
                    monitoringStore.batteryStatusDefaultColor =
                        "#" + indicator.color;
                }
            } else if (indicator.type === "WLAN_STATUS") {
                if (indicator.color) {
                    monitoringStore.wlanStatusDefaultColor =
                        "#" + indicator.color;
                }
            }
        }
    }
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
