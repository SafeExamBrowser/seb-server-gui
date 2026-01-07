<template>
    <AlertMsg
        v-if="monitoringViewService.isMonitoringDisabled()"
        :alert-props="{
            title: monitoringViewService.getMonitoringDisabledWarningText(),
            color: 'warning',
            type: 'alert',
            customText: '',
        }"
    >
    </AlertMsg>
    <v-row v-else>
        <v-col cols="12">
            <!-- Infos -->
            <v-row>
                <v-col cols="12">
                    <MonitoringOverviewInfos></MonitoringOverviewInfos>
                </v-col>
            </v-row>

            <!-- Client States, Notifications and Indicators -->
            <v-row align="stretch" class="mt-5">
                <!-- Client States -->
                <v-col :cols="hasIndicators ? 4 : 6">
                    <v-sheet class="pa-6 h-100" elevation="4" rounded="lg">
                        <MonitoringOverviewClients />
                    </v-sheet>
                </v-col>

                <!-- Notifications and ask -->
                <v-col :cols="hasIndicators ? 4 : 6">
                    <v-sheet class="pa-6 h-100" elevation="4" rounded="lg">
                        <MonitoringOverviewNotifications
                            v-if="
                                monitoringStore.monitoringOverviewData
                                    ?.notifications
                            "
                        />
                    </v-sheet>
                </v-col>

                <!-- Indicators -->
                <v-col v-if="hasIndicators" cols="4">
                    <v-sheet class="pa-6 h-100" elevation="4" rounded="lg">
                        <MonitoringOverviewIndicators />
                    </v-sheet>
                </v-col>
            </v-row>

            <!-- Groups -->
            <v-row v-if="hasGroups" class="mt-5">
                <v-col cols="12">
                    <v-sheet
                        class="pa-6 fill-height min-height-sheet"
                        elevation="4"
                        rounded="lg"
                    >
                        <MonitoringOverviewGroups></MonitoringOverviewGroups>
                    </v-sheet>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import * as monitoringViewService from "@/services/seb-server/component-services/monitoringViewService";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";
import { translate } from "@/utils/generalUtils";
import { useAppBarStore } from "@/stores/store";
import MonitoringOverviewIndicators from "@/components/views/seb-server/monitoring/overview/MonitoringOverviewIndicators.vue";
import * as indicatorService from "@/services/seb-server/component-services/indicatorViewService";
import { useRoute } from "vue-router";
import { computed, onBeforeMount, onBeforeUnmount } from "vue";
import { MonitoringOverview } from "@/models/seb-server/monitoring";
import { Indicators } from "@/models/seb-server/indicators";
import MonitoringOverviewInfos from "@/components/views/seb-server/monitoring/overview/MonitoringOverviewInfos.vue";
import MonitoringOverviewClients from "@/components/views/seb-server/monitoring/overview/MonitoringOverviewClients.vue";
import MonitoringOverviewNotifications from "@/components/views/seb-server/monitoring/overview/MonitoringOverviewNotifications.vue";
import MonitoringOverviewGroups from "@/components/views/seb-server/monitoring/overview/MonitoringOverviewGroups.vue";

// exam
const examId = useRoute().params.examId.toString();

// stores
const appBarStore = useAppBarStore();
const monitoringStore = useMonitoringStore();

// interval
let intervalRefresh: ReturnType<typeof setInterval> | null = null;
const REFRESH_INTERVAL = 5000;

onBeforeMount(async () => {
    appBarStore.title = translate("titles.monitoring");
    await monitoringViewService.getExamAndStore(examId);
    await getIndicatorData();
    await getOverviewData();
    await monitoringViewService.getAskAndStore(examId);
    await startIntervalRefresh();
});

onBeforeUnmount(() => {
    stopIntervalRefresh();
});

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

async function getOverviewData() {
    const overviewResponse: MonitoringOverview | null =
        await monitoringViewService.getOverview(examId);
    if (!overviewResponse) return;
    monitoringStore.monitoringOverviewData = overviewResponse;
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

<style scoped>
.min-height-sheet {
    min-height: 354px;
}
</style>
