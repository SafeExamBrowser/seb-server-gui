<template>
    <MonitoringExamsInfo @loadmonitoringListItemsCaller="loadmonitoringListItemsCaller"></MonitoringExamsInfo>
    <MonitoringExamsMain ref="monitoringExamsMainRef"></MonitoringExamsMain>
</template>

<script setup lang="ts">
    import { useAppBarStore } from '@/stores/store';
    import * as constants from "@/utils/constants";
    import MonitoringExamsMain from "@/components/views/monitoring/exams/MonitoringExamsMain.vue";
    import {translate} from "@/utils/generalUtils";
    import { useMonitoringStore } from "@/stores/monitoringStore";

    //stores
    const appBarStore = useAppBarStore();
    const monitoringStore = useMonitoringStore();

    //ref to ExamListMain
    const monitoringExamsMainRef = ref<InstanceType<typeof MonitoringExamsMain> | null>(null);

    onBeforeMount(() => {
        appBarStore.title = translate("titles.monitoring");
    });

    //call function in "ExamListMain"
    function loadmonitoringListItemsCaller(){
        if(monitoringStore.currentPagingOptions == null){
            return;
        }

        if(monitoringStore.currentPagingOptions.itemsPerPage == 0){
            monitoringStore.currentPagingOptions.itemsPerPage = 10; 
        }

        monitoringExamsMainRef.value?.loadItems(monitoringStore.currentPagingOptions);
    }



</script>

<style scoped>

</style>