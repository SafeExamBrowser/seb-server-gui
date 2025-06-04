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

    //data


    onBeforeMount(async () => {
        appBarStore.title = translate("titles.monitoring");

        console.log("examId: " + examId)

        await getSingleConnection();
        await monitoringViewService.getExamAndStore(examId);
        await monitoringViewService.getClientGroups(examId);
        storeClientGroups();


        console.log(monitoringStore.selectedSingleConns);


        console.log(monitoringStore.clientGroupsSingle)

        isDataLoaded.value = true;
    });


    async function getSingleConnection(){
        const singleConnectionResponse: SingleConnection | null = await monitoringViewService.getSingleConnection(examId, connectionToken);
        if(singleConnectionResponse == null){
            return;
        }

        monitoringStore.selectedSingleConns = singleConnectionResponse;
    }


    async function storeClientGroups(){
        if(monitoringStore.selectedSingleConns == null){
            return;
        }

        monitoringStore.clientGroupsSingle = monitoringViewService.extractClientGroupNames(monitoringStore.selectedSingleConns.cg);
    }


</script>

<style scoped>

</style>