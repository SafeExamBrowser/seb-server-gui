<template>

    <AlertMsg
        v-if="monitoringStore.isMonitoringDisabled()"
        :alertProps="{
            title: monitoringStore.getMonitoringDisabledWarningText(),
            color: 'warning',
            type: 'alert',
            customText: ''
        }">
    </AlertMsg>

    <v-row v-else>
        <v-col cols="4">
            <!--------infos-------->
            <v-row>
                <v-col>
                    <v-sheet class="rounded-lg pa-4" elevation="4">
                        <MonitoringOverviewInfos></MonitoringOverviewInfos>
                    </v-sheet>
                </v-col>
            </v-row>

            <!--------clients-------->
            <v-row>
                <v-col>
                    <v-sheet class="rounded-lg pa-4" elevation="4">
                        <MonitoringOverviewClients></MonitoringOverviewClients>
                    </v-sheet>
                </v-col>
            </v-row>
        </v-col>

        <!--------groups-------->
        <v-col cols="4">
            <v-sheet class="rounded-lg pa-4" elevation="4">
                <MonitoringOverviewGroups></MonitoringOverviewGroups>
            </v-sheet>
        </v-col>

        <!--------notifications-------->
        <v-col cols="4">
            <v-sheet class="rounded-lg pa-4" elevation="4">
                <MonitoringOverviewNotifications></MonitoringOverviewNotifications>
            </v-sheet>
        </v-col>
        
    </v-row>

</template>

<script setup lang="ts">
    import * as monitoringViewService from "@/services/component-services/monitoringViewService";
    import * as examViewService from "@/services/component-services/examViewService";
    import { useMonitoringStore } from "@/stores/monitoringStore";
    import { ExamStatusEnum, ExamTypeEnum } from "@/models/examFiltersEnum";
    import * as generalUtils from "@/utils/generalUtils";
    import {translate} from "@/utils/generalUtils";
    import { useAppBarStore } from "@/stores/store";


    //exam
    const examId = useRoute().params.examId.toString();

    //stores
    const appBarStore = useAppBarStore();
    const monitoringStore = useMonitoringStore();

    //interval
    let intervalRefresh: any | null = null;
    const REFRESH_INTERVAL: number = 1 * 3000;



    onBeforeMount(async () => {
        appBarStore.title = translate("titles.monitoring");

        await getExam();
        await getOverviewData();

        startIntervalRefresh()
    });

    onBeforeUnmount(() => {
        stopIntervalRefresh();
    });


    async function getExam(){
        const examResponse: Exam | null = await examViewService.getExam(examId);

        if(examResponse == null){
            return;
        }

        monitoringStore.selectedExam = examResponse;
    }

    async function getOverviewData(){
        const overviewResponse: MonitoringOverview | null = await monitoringViewService.getOverview(examId);

        if(overviewResponse == null){
            return;
        }

        monitoringStore.monitoringOverviewData = overviewResponse;
    }



    async function startIntervalRefresh(){
        intervalRefresh = setInterval(async () => {
            // getOverviewData()

            const randomNumber1: number = Math.floor(Math.random() * 1000) + 1;
            const randomNumber2: number = Math.floor(Math.random() * 1000) + 1;
            const randomNumber3: number = Math.floor(Math.random() * 1000) + 1;
            const randomNumber4: number = Math.floor(Math.random() * 1000) + 1;


            // console.log(randomNumber1)


            monitoringStore.monitoringOverviewData!.clientStates.ACTIVE = randomNumber1; 
            monitoringStore.monitoringOverviewData!.clientStates.CONNECTION_REQUESTED = randomNumber2; 
            monitoringStore.monitoringOverviewData!.clientStates.DISABLED = randomNumber3; 
            monitoringStore.monitoringOverviewData!.clientStates.READY = randomNumber3; 

            monitoringStore.monitoringOverviewData!.clientGroups[0].clientAmount = randomNumber1; 
            monitoringStore.monitoringOverviewData!.clientGroups[1].clientAmount = randomNumber2; 
            monitoringStore.monitoringOverviewData!.clientGroups[2].clientAmount = randomNumber3; 


            // if(randomNumber1 > 700){
            //     monitoringStore.monitoringOverviewData?.clientGroups.push({
            //         id: 46,
            //         clientAmount: 50
            //     })

            // }






        }, REFRESH_INTERVAL);
    }

    function stopIntervalRefresh(){
        if (intervalRefresh) {
            clearInterval(intervalRefresh);
        }
    }










</script>

<style scoped>

</style>