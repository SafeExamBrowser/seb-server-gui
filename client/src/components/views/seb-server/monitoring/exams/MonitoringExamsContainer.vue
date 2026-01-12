<template>
    <v-container
        class="d-flex flex-column align-stretch px-0 pa-0"
        fluid
        style="min-height: 90vh"
    >
        <!-- Info and Search -->
        <MonitoringExamsInfo
            @load-monitoring-list-items-caller="loadMonitoringListItemsCaller"
        />

        <!-- Table Component -->
        <MonitoringExamsMain
            ref="monitoringExamsMainRef"
            class="flex-grow-1"
            style="min-height: 63vh"
        />
    </v-container>
</template>
<script setup lang="ts">
import { useAppBarStore } from "@/stores/store";
import MonitoringExamsMain from "@/components/views/seb-server/monitoring/exams/MonitoringExamsMain.vue";
import { translate } from "@/utils/generalUtils";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";

// stores
const appBarStore = useAppBarStore();
const monitoringStore = useMonitoringStore();
import { ref, onBeforeMount } from "vue";
import MonitoringExamsInfo from "@/components/views/seb-server/monitoring/exams/MonitoringExamsInfo.vue";

// ref to ExamListMain
const monitoringExamsMainRef = ref<InstanceType<
    typeof MonitoringExamsMain
> | null>(null);

onBeforeMount(() => {
    appBarStore.title = translate("titles.monitoring");
});

// call function in "ExamListMain"
function loadMonitoringListItemsCaller() {
    if (monitoringStore.currentPagingOptions == null) {
        return;
    }

    if (monitoringStore.currentPagingOptions.itemsPerPage === 0) {
        monitoringStore.currentPagingOptions.itemsPerPage = 10;
    }

    monitoringExamsMainRef.value?.loadItems(
        monitoringStore.currentPagingOptions,
    );
}
</script>

<style scoped></style>
