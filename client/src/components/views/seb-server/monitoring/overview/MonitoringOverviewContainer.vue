<template>
    <AlertMsg
        v-if="monitoringViewService.isMonitoringDisabled()"
        :alertProps="{
            title: monitoringViewService.getMonitoringDisabledWarningText(),
            color: 'warning',
            type: 'alert',
            customText: ''
        }">
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
            <v-row class="mt-5" align="stretch">
                <!-- Client States -->
                <v-col cols="4">
                    <v-sheet elevation="4" rounded="lg" class="pa-6 h-100">
                        <MonitoringOverviewClients />
                    </v-sheet>
                </v-col>

                <!-- Notifications -->
                <v-col cols="4"
                      >
                    <v-sheet elevation="4" rounded="lg" class="pa-6 h-100">
                        <MonitoringOverviewNotifications  v-if="monitoringStore.monitoringOverviewData?.notifications"/>
                    </v-sheet>
                </v-col>

                <!-- Indicators -->
                <v-col cols="4">
                    <v-sheet elevation="4" rounded="lg" class="pa-6 h-100">
                        <MonitoringOverviewIndicators  v-if="monitoringStore.monitoringOverviewData?.indicators"/>
                    </v-sheet>
                </v-col>
            </v-row>


            <!-- Groups -->
            <v-row class="mt-5">
                <v-col cols="12">
                    <v-sheet elevation="4" rounded="lg" class="pa-6 fill-height min-height-sheet">
                        <MonitoringOverviewGroups></MonitoringOverviewGroups>
                    </v-sheet>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import * as monitoringViewService from "@/services/seb-server/component-services/monitoringViewService";
import * as indicatorService from "@/services/seb-server/component-services/indicatorViewService";
import {useMonitoringStore} from "@/stores/seb-server/monitoringStore";
import {translate} from "@/utils/generalUtils";
import {useAppBarStore} from "@/stores/store";
import MonitoringOverviewIndicators
    from "@/components/views/seb-server/monitoring/overview/MonitoringOverviewIndicators.vue";


//exam
const examId = useRoute().params.examId.toString();

//stores
const appBarStore = useAppBarStore();
const monitoringStore = useMonitoringStore();

//interval
let intervalRefresh: any | null = null;
const REFRESH_INTERVAL: number = 1 * 5000;


onBeforeMount(async () => {
    appBarStore.title = translate("titles.monitoring");

    await monitoringViewService.getExamAndStore(examId);
    await getOverviewData();
    await monitoringViewService.getAksAndStore(examId);
    console.log("AKS KEYS: " , monitoringStore.appSignatureKeys)
    // setRandomData();
    monitoringStore.selectedExam?.additionalAttributes
    startIntervalRefresh()
});

onBeforeUnmount(() => {
    stopIntervalRefresh();
});

//TODO Only one indicator being sent in overview, but more than one in getIndicators, for the same exam
async function getOverviewData() {
    const overviewResponse: MonitoringOverview | null = await monitoringViewService.getOverview(examId);
    const indicatorResponse: Indicators | null = await indicatorService.getIndicators(examId);

    console.log("📦 overviewResponse:", JSON.stringify(overviewResponse, null, 2));
    console.log("📦 indicatorResponse:", JSON.stringify(indicatorResponse, null, 2));

    if (!overviewResponse) return;

    monitoringStore.monitoringOverviewData = overviewResponse;
}

async function startIntervalRefresh() {
    intervalRefresh = setInterval(async () => {

        getOverviewData();
        // setRandomData();

    }, REFRESH_INTERVAL);
}


function setRandomData() {
    getOverviewData();

    // console.log(monitoringStore.monitoringOverviewData)

    const randomNumber1: number = Math.floor(Math.random() * 1000) + 1;
    const randomNumber2: number = Math.floor(Math.random() * 1000) + 1;
    const randomNumber3: number = Math.floor(Math.random() * 1000) + 1;
    const randomNumber4: number = Math.floor(Math.random() * 1000) + 1;
    const randomNumber5: number = Math.floor(Math.random() * 1000) + 1;
    const randomNumber6: number = Math.floor(Math.random() * 1000) + 1;


    monitoringStore.monitoringOverviewData!.clientStates.DISABLED = randomNumber1;
    monitoringStore.monitoringOverviewData!.clientStates.READY = randomNumber2;
    monitoringStore.monitoringOverviewData!.clientStates.ACTIVE = randomNumber3;
    monitoringStore.monitoringOverviewData!.clientStates.CONNECTION_REQUESTED = randomNumber4;
    monitoringStore.monitoringOverviewData!.clientStates.MISSING = randomNumber5;
    monitoringStore.monitoringOverviewData!.clientStates.CLOSED = randomNumber6;


    monitoringStore.monitoringOverviewData!.clientGroups[0].clientAmount = randomNumber1;
    monitoringStore.monitoringOverviewData!.clientGroups[1].clientAmount = randomNumber2;
    // monitoringStore.monitoringOverviewData!.clientGroups[2].clientAmount = randomNumber3;
    // monitoringStore.monitoringOverviewData!.clientGroups[3].clientAmount = randomNumber4;

    monitoringStore.monitoringOverviewData!.notifications.LOCK_SCREEN = randomNumber1;
    monitoringStore.monitoringOverviewData!.notifications.RAISE_HAND = randomNumber2;

    // monitoringStore.monitoringOverviewData!.indicators.BATTERY_STATUS = randomNumber3;
    // monitoringStore.monitoringOverviewData!.indicators.WLAN_STATUS = randomNumber4;


    // if(randomNumber1 > 700){
    //     monitoringStore.monitoringOverviewData?.clientGroups.push({
    //         id: 46,
    //         clientAmount: 50
    //     })

    // }
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
