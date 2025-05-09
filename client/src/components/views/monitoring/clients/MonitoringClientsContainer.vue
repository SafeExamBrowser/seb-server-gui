<template>
    <template v-if="isDataLoaded">
        <MonitoringClientsInfo></MonitoringClientsInfo>
        <MonitoringClientsMain></MonitoringClientsMain>
    </template>
</template>

<script setup lang="ts">
    import { useMonitoringStore } from "@/stores/monitoringStore";
    import { useAppBarStore } from "@/stores/store";
    import {translate} from "@/utils/generalUtils";
    import * as monitoringViewService from "@/services/component-services/monitoringViewService";
    import * as generalUtils from "@/utils/generalUtils";
    import * as examViewService from "@/services/component-services/examViewService";
    import * as indicatorViewService from "@/services/component-services/indicatorViewService";
    import * as clientGroupViewService from "@/services/component-services/clientGroupViewService";
    import MonitoringClientsMain from "@/components/views/monitoring/clients/MonitoringClientsMain.vue";

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
        await getClientGroups();
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

        monitoringStore.monitoringOverviewData = overviewResponse;
    }

    async function getIndicators(){
        const indicatorsResponse: Indicators | null = await indicatorViewService.getIndicators(examId);

        if(indicatorsResponse == null){
            return;
        }

        monitoringStore.indicators = indicatorsResponse;
    }

    async function getClientGroups(){
        const clientGroupsResponse: ClientGroups | null = await clientGroupViewService.getClientGroups(examId);
        if(clientGroupsResponse == null){
            return;
        }

        monitoringStore.clientGroups = clientGroupsResponse;
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