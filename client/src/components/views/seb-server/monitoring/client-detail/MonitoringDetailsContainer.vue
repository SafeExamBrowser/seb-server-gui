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

    //exam
    const examId = useRoute().params.examId.toString();

    //stores
    const monitoringStore = useMonitoringStore();
    const appBarStore = useAppBarStore();

    //data load
    const isDataLoaded = ref<boolean>(false);


    onBeforeMount(async () => {
        appBarStore.title = translate("titles.monitoring");



        isDataLoaded.value = true;

    });


</script>

<style scoped>

</style>