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
    import * as generalUtils from "@/utils/generalUtils";
    import * as examViewService from "@/services/seb-server/component-services/examViewService";
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



    onBeforeMount(async () => {
        appBarStore.title = translate("titles.monitoring");

        if(monitoringStore.selectedExam == null){
            await monitoringViewService.getExamAndStore(examId);
        }

        await getIndicators();
        await getClientGroups();

        isDataLoaded.value = true;
    });




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
 



</script>

<style scoped>

</style>