<template>
    <v-container
        fluid
        class="d-flex flex-column align-stretch px-0 pa-0"
        style="min-height: 90vh;"
    >
        <!-- Info and Search -->
        <MonitoringExamsInfo
            class="flex-grow-0"
            @loadMonitoringListItemsCaller="loadMonitoringListItemsCaller"
        />

        <!-- Table Component -->
        <MonitoringExamsMain
            class="flex-grow-1"
            style="min-height: 69vh;"
            ref="monitoringExamsMainRef"
        />
    </v-container>
</template>
<script setup lang="ts">
import {useAppBarStore} from '@/stores/store';
import * as constants from "@/utils/constants";
import MonitoringExamsMain from "@/components/views/seb-server/monitoring/exams/MonitoringExamsMain.vue";
import {translate} from "@/utils/generalUtils";
import {useMonitoringStore} from "@/stores/seb-server/monitoringStore";

//stores
const appBarStore = useAppBarStore();
const monitoringStore = useMonitoringStore();

//ref to ExamListMain
const monitoringExamsMainRef = ref<InstanceType<typeof MonitoringExamsMain> | null>(null);

onBeforeMount(() => {
    appBarStore.title = translate("titles.monitoring");
});

//call function in "ExamListMain"
function loadMonitoringListItemsCaller() {
    if (monitoringStore.currentPagingOptions == null) {
        return;
    }

    if (monitoringStore.currentPagingOptions.itemsPerPage == 0) {
        monitoringStore.currentPagingOptions.itemsPerPage = 10;
    }

    monitoringExamsMainRef.value?.loadItems(monitoringStore.currentPagingOptions);
}


</script>

<style scoped>
</style>
