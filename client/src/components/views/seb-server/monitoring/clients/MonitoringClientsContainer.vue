<template>
    <template v-if="isDataLoaded">
        <MonitoringClientsInfo></MonitoringClientsInfo>
        <MonitoringClientsMain></MonitoringClientsMain>
    </template>
</template>

<script setup lang="ts">
    import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";
    import { useAppBarStore } from "@/stores/store";
    import {translate} from "@/utils/generalUtils";
    import * as monitoringViewService from "@/services/seb-server/component-services/monitoringViewService";
    import * as indicatorViewService from "@/services/seb-server/component-services/indicatorViewService";
    import * as clientGroupViewService from "@/services/seb-server/component-services/clientGroupViewService";
    import MonitoringClientsMain from "@/components/views/seb-server/monitoring/clients/MonitoringClientsMain.vue";



    //exam
    const examId = useRoute().params.examId.toString();

    //stores
    const monitoringStore = useMonitoringStore();
    const appBarStore = useAppBarStore();

    //data load
    const isDataLoaded = ref<boolean>(false);

    //interval
    let intervalRefresh: any | null = null;
    const REFRESH_INTERVAL: number = 1 * 10000;


    onBeforeMount(async () => {
        appBarStore.title = translate("titles.monitoring");

        if(monitoringStore.selectedExam == null){
            await monitoringViewService.getExamAndStore(examId);
        }

        await getIndicators();
        await monitoringViewService.getClientGroups(examId);
        await getOverviewData();

        startIntervalRefresh()

        isDataLoaded.value = true;
    });

    onBeforeUnmount(() => {
        stopIntervalRefresh();
        monitoringStore.clearValues();
    });

    async function getOverviewData(){
        const overviewResponse: MonitoringOverview | null = await monitoringViewService.getOverview(examId);

        if(overviewResponse == null){
            return;
        }

        // const randomNumber1: number = Math.floor(Math.random() * 1000) + 1;
        // const randomNumber2: number = Math.floor(Math.random() * 1000) + 1;
        // overviewResponse.notifications.total = 1212; 
        // overviewResponse.notifications.LOCK_SCREEN = randomNumber1; 
        // overviewResponse.notifications.RAISE_HAND = randomNumber2; 

        monitoringStore.monitoringOverviewData = overviewResponse;

        // console.log(monitoringStore.monitoringOverviewData)
    }

    async function getIndicators(){
        const indicatorsResponse: Indicators | null = await indicatorViewService.getIndicators(examId);

        if(indicatorsResponse == null){
            return;
        }

        monitoringStore.indicators = indicatorsResponse;
    }

    async function startIntervalRefresh(){
        intervalRefresh = setInterval(async () => {
            getOverviewData()

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