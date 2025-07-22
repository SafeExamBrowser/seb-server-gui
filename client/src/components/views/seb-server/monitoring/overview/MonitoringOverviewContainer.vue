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
            <v-row dense>
                <v-col  cols="12" class="">
                    <MonitoringOverviewInfos></MonitoringOverviewInfos>
                </v-col>
            </v-row>

            <!-- Client States, Notifications and Indicators -->
            <v-row >
                <!-- Client States -->
                <v-col  cols="4">
                    <MonitoringOverviewClients></MonitoringOverviewClients>
                </v-col>

                <!-- Notifications and Indicators -->
                <v-col  cols="8" v-if="monitoringStore.monitoringOverviewData?.notifications || monitoringStore.monitoringOverviewData?.indicators">
                    <MonitoringOverviewNotifications></MonitoringOverviewNotifications>
                </v-col>
            </v-row>

            <!-- Groups -->
            <v-row >
                <v-col  cols="12" >
                    <MonitoringOverviewGroups></MonitoringOverviewGroups>
                </v-col>
            </v-row>
        </v-col>
    </v-row>

<!--    <v-row v-else>-->
<!--        <v-col cols="4">-->
<!--            &lt;!&ndash;&#45;&#45;&#45;&#45;&#45;&#45;infos&#45;&#45;&#45;&#45;&#45;&#45;&ndash;&gt;-->
<!--            <v-row>-->
<!--                <v-col>-->
<!--                    <v-sheet class="rounded-lg pa-4" elevation="4">-->
<!--                        <MonitoringOverviewInfos></MonitoringOverviewInfos>-->
<!--                    </v-sheet>-->
<!--                </v-col>-->
<!--            </v-row>-->

<!--            &lt;!&ndash;&#45;&#45;&#45;&#45;&#45;&#45;clients&#45;&#45;&#45;&#45;&#45;&#45;&ndash;&gt;-->
<!--            <v-row>-->
<!--                <v-col>-->
<!--                    <v-sheet class="rounded-lg pa-4" elevation="4">-->
<!--                        <MonitoringOverviewClients></MonitoringOverviewClients>-->
<!--                    </v-sheet>-->
<!--                </v-col>-->
<!--            </v-row>-->
<!--        </v-col>-->

<!--        &lt;!&ndash;&#45;&#45;&#45;&#45;&#45;&#45;groups&#45;&#45;&#45;&#45;&#45;&#45;&ndash;&gt;-->
<!--        <v-col cols="5">-->
<!--            <v-sheet class="rounded-lg pa-4" elevation="4">-->
<!--                <MonitoringOverviewGroups></MonitoringOverviewGroups>-->
<!--            </v-sheet>-->
<!--        </v-col>-->

<!--        &lt;!&ndash;&#45;&#45;&#45;&#45;&#45;&#45;notifications & indicators&#45;&#45;&#45;&#45;&#45;&#45;&ndash;&gt;-->
<!--        <v-col cols="3" v-if="monitoringStore.monitoringOverviewData?.notifications || monitoringStore.monitoringOverviewData?.indicators">-->
<!--            <v-sheet class="rounded-lg pa-4" elevation="4">-->
<!--                <MonitoringOverviewNotifications></MonitoringOverviewNotifications>-->
<!--            </v-sheet>-->
<!--        </v-col>-->

<!--    </v-row>-->

</template>

<script setup lang="ts">
    import * as monitoringViewService from "@/services/seb-server/component-services/monitoringViewService";
    import * as examViewService from "@/services/seb-server/component-services/examViewService";
    import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";
    import { ExamStatusEnum, ExamTypeEnum } from "@/models/seb-server/examFiltersEnum";
    import * as generalUtils from "@/utils/generalUtils";
    import {translate} from "@/utils/generalUtils";
    import { useAppBarStore } from "@/stores/store";
    import {navigateTo} from "@/router/navigation";
    import * as constants from "@/utils/constants";


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
        // setRandomData();
        monitoringStore.selectedExam?.additionalAttributes
        startIntervalRefresh()
    });

    onBeforeUnmount(() => {
        stopIntervalRefresh();
    });


    async function getOverviewData(){
        const overviewResponse: MonitoringOverview | null = await monitoringViewService.getOverview(examId);

        if(overviewResponse == null){
            return;
        }

        monitoringStore.monitoringOverviewData = overviewResponse;
    }



    async function startIntervalRefresh(){
        intervalRefresh = setInterval(async () => {

            getOverviewData();
            // setRandomData();

        }, REFRESH_INTERVAL);
    }


    function setRandomData(){
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



    function stopIntervalRefresh(){
        if (intervalRefresh) {
            clearInterval(intervalRefresh);
        }
    }










</script>

<style scoped>

</style>
