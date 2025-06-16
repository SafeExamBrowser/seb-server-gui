<template>
    <template v-if="isDataLoaded">
        <MonitoringDetailsInfo></MonitoringDetailsInfo>
        <MonitoringDetailsMain></MonitoringDetailsMain>
    </template>
</template>

<script setup lang="ts">
    import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";
    import { useAppBarStore } from "@/stores/store";
    import {translate} from "@/utils/generalUtils";
    import * as monitoringViewService from "@/services/seb-server/component-services/monitoringViewService";


    //route params
    const examId = useRoute().params.examId.toString();
    const connectionToken = useRoute().params.connectionToken.toString();
    // const connectionId = useRoute().params.connectionId.toString();

    //stores
    const monitoringStore = useMonitoringStore();
    const appBarStore = useAppBarStore();

    //data load
    const isDataLoaded = ref<boolean>(false);

    //interval
    let intervalRefresh: any | null = null;
    const REFRESH_INTERVAL: number = 1 * 5000;

    onBeforeMount(async () => {
        appBarStore.title = translate("titles.monitoring");

        await getSingleConnection();
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


    //==============data fetching================
    async function getSingleConnection(){
        const singleConnectionResponse: SingleConnection | null = await monitoringViewService.getSingleConnection(examId, connectionToken);
        if(singleConnectionResponse == null){
            return;
        }

        monitoringStore.selectedSingleConn = singleConnectionResponse;
    }

    async function getPendingNotifications(){
        const notificationsResponse: ClientNotification[] | null = await monitoringViewService.getPendingNotifcations(examId, connectionToken);
        if(notificationsResponse == null){
            return;
        }

        monitoringStore.pendingNotifications = notificationsResponse;
    }


    //=================data preparing===================
    async function storeClientGroups(){
        if(monitoringStore.selectedSingleConn == null){
            return;
        }

        monitoringStore.clientGroupsSingle = monitoringViewService.extractClientGroupNames(monitoringStore.selectedSingleConn.cg);
    }


    //=================interval===================
    async function startIntervalRefresh(){
        intervalRefresh = setInterval(async () => {
            getSingleConnection();
            getPendingNotifications();
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