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
                <v-col cols="4">
                    <v-sheet class="pa-6 h-100" elevation="4" rounded="lg">
                        <MonitoringOverviewClients />
                    </v-sheet>
                </v-col>

                <!-- Notifications and ask -->
                <v-col cols="4">
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
                <v-col cols="4">
                    <v-sheet class="pa-6 h-100" elevation="4" rounded="lg">
                        <MonitoringOverviewIndicators
                            v-if="
                                monitoringStore.monitoringOverviewData
                                    ?.indicators
                            "
                        />
                    </v-sheet>
                </v-col>
            </v-row>

            <!-- Groups -->
            <v-row class="mt-5">
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
import { onBeforeMount, onBeforeUnmount } from "vue";

// exam
const examId = useRoute().params.examId.toString();

// stores
const appBarStore = useAppBarStore();
const monitoringStore = useMonitoringStore();

// interval
let intervalRefresh: any | null = null;
const REFRESH_INTERVAL: number = 5000;

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

    for (const indicator of monitoringStore.indicators?.content) {
        if (indicator.type === "BATTERY_STATUS") {
            if (indicator.color) {
                monitoringStore.batteryStatusDefaultColor =
                    "#" + indicator.color;
            }
        } else if (indicator.type === "WLAN_STATUS") {
            if (indicator.color) {
                monitoringStore.wlanStatusDefaultColor = "#" + indicator.color;
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
    }
}
</script>

<style scoped>
.min-height-sheet {
    min-height: 354px;
}
</style>
