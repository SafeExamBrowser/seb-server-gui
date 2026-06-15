<template>
    <!-- Main card: peer views -->
    <v-card border elevation="1" rounded="lg">
        <template v-if="screenProctoringEnabled">
            <v-tabs v-model="currentView" color="primary" grow>
                <v-tab prepend-icon="mdi-monitor-eye" value="proctoring">
                    {{ $t("monitoringDetails.main.screenProctoring") }}
                </v-tab>
                <v-tab prepend-icon="mdi-format-list-bulleted" value="logs">
                    {{ $t("monitoringDetails.main.clientLogs") }}
                </v-tab>
            </v-tabs>
            <v-divider />
        </template>

        <div class="pa-4">
            <!-- Proctoring view -->
            <div v-if="currentView === 'proctoring'">
                <ProctoringViewPage :session-id-prop="connectionToken" />
            </div>

            <!-- Logs view -->
            <div v-else>
                <MonitoringClientLogsContainer />
            </div>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";
import { ref, computed, watch } from "vue";
import ProctoringViewPage from "@/components/widgets/ProctoringViewPage.vue";
import MonitoringClientLogsContainer from "@/pages/(app)/monitoring/[examId]/client/[connectionToken]/components/MonitoringClientLogsContainer.vue";

const props = defineProps<{
    connectionToken: string;
}>();

// route params
const connectionToken = props.connectionToken;

// stores
const monitoringStore = useMonitoringStore();

// attributes for switch between logs and screen proctor view
const screenProctoringEnabled = computed(() => {
    return (
        monitoringStore.selectedExam?.additionalAttributes
            .enableScreenProctoring === "true"
    );
});
const currentView = ref<"proctoring" | "logs">(
    screenProctoringEnabled.value ? "proctoring" : "logs",
);

watch(screenProctoringEnabled, (enabled) => {
    currentView.value = enabled ? "proctoring" : "logs";
});
</script>
