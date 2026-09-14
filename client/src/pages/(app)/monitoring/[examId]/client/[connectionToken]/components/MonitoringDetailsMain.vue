<template>
    <v-card
        border
        elevation="1"
        rounded="lg"
        class="h-100 flex-grow-1 flex-shrink-0 d-flex flex-column"
    >
        <template v-if="screenProctoringEnabled">
            <v-tabs
                v-model="currentView"
                class="flex-grow-0 flex-shrink-0"
                color="primary"
                grow
            >
                <v-tab prepend-icon="mdi-monitor-eye" value="proctoring">
                    {{ $t("monitoringDetails.main.screenProctoring") }}
                </v-tab>
                <v-tab prepend-icon="mdi-format-list-bulleted" value="logs">
                    {{ $t("monitoringDetails.main.clientLogs") }}
                </v-tab>
            </v-tabs>
            <v-divider />
        </template>

        <!-- Proctoring view -->
        <div
            v-if="currentView === 'proctoring'"
            class="pa-4 flex-1-1-0 d-flex flex-column"
            :style="{ minHeight: 0 }"
        >
            <ProctoringViewPage :session-id-prop="connectionToken" />
        </div>

        <!-- Logs view -->
        <div
            v-else
            class="pa-4 flex-1-1-0 overflow-y-auto"
            :style="{ minHeight: 0 }"
        >
            <MonitoringClientLogsContainer />
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { VCard, VDivider, VTab, VTabs } from "vuetify/components";

import ProctoringViewPage from "@/components/widgets/ProctoringViewPage.vue";
import MonitoringClientLogsContainer from "@/pages/(app)/monitoring/[examId]/client/[connectionToken]/components/MonitoringClientLogsContainer.vue";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";

const props = defineProps<{
    connectionToken: string;
}>();

const connectionToken = props.connectionToken;

const monitoringStore = useMonitoringStore();

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
