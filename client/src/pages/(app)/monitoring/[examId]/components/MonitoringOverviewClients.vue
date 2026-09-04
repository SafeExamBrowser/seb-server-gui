<template>
    <v-card border elevation="1" rounded="lg" class="h-100 d-flex flex-column">
        <div class="d-flex align-center px-5 py-4 bg-background">
            <span class="text-body-medium font-weight-bold">
                {{ $t("monitoringOverview.clientStates.clientStates") }}
            </span>
        </div>
        <v-divider />

        <LoadingFallbackComponent :loading="loading">
            <div
                class="flex-grow-1 d-flex flex-wrap align-center justify-center ga-4 pa-5"
            >
                <v-sheet
                    color="transparent"
                    width="132"
                    height="132"
                    class="position-relative flex-shrink-0"
                >
                    <Doughnut :data="chartData" :options="chartOptions" />
                    <div
                        class="position-absolute text-center"
                        :style="{
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                        }"
                    >
                        <div class="text-headline-small font-weight-bold">
                            {{
                                monitoringStore.monitoringOverviewData
                                    ?.clientStates.total
                            }}
                        </div>
                        <div
                            class="text-body-small font-weight-bold text-uppercase text-medium-emphasis"
                        >
                            {{ $t("monitoringOverview.clients.total") }}
                        </div>
                    </div>
                </v-sheet>

                <div
                    class="flex-grow-1 d-flex flex-column ga-1"
                    :style="{ minWidth: '150px', maxWidth: '260px' }"
                >
                    <v-hover
                        v-for="(state, index) in clientStates"
                        :key="index"
                        v-slot="{ isHovering, props: hoverProps }"
                    >
                        <div
                            v-bind="hoverProps"
                            class="d-flex align-center ga-2 pa-2 rounded-lg"
                            :class="isHovering ? 'bg-background' : ''"
                            :style="{ cursor: 'pointer' }"
                            @click="
                                goToMonitoring(
                                    MonitoringHeaderEnum.SHOW_STATES,
                                    state,
                                    examId,
                                )
                            "
                        >
                            <v-avatar :color="clientColors[index]" size="11" />
                            <span
                                class="flex-grow-1 text-body-medium font-weight-medium"
                            >
                                {{ translate(state) }}
                            </span>
                            <span class="text-body-medium font-weight-bold">
                                {{ clientData[index] }}
                            </span>
                        </div>
                    </v-hover>
                </div>
            </div>
        </LoadingFallbackComponent>
    </v-card>
</template>

<script setup lang="ts">
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { computed, ref } from "vue";
import { Doughnut } from "vue-chartjs";
import { useI18n } from "vue-i18n";
import { VAvatar, VCard, VDivider, VHover, VSheet } from "vuetify/components";

import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { MonitoringHeaderEnum } from "@/models/seb-server/monitoringEnums.ts";
import { goToMonitoring } from "@/pages/(app)/monitoring/[examId]/composables/useMonitoringNavigation.ts";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";
import { translate } from "@/utils/generalUtils.ts";
import {
    CONNECTION_STATUS_DISPLAY_ORDER,
    getConnectionStatusColor,
} from "@/utils/monitoringUtils.ts";

const props = defineProps<{
    examId: string;
}>();

const i18n = useI18n();
const monitoringStore = useMonitoringStore();
const examId = props.examId;

ChartJS.register(ArcElement, Tooltip, Legend);

const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: true,
    cutout: "66%",
    plugins: {
        legend: {
            display: false,
        },
    },
});

const clientStates = CONNECTION_STATUS_DISPLAY_ORDER;
const clientColors = clientStates.map((state) =>
    getConnectionStatusColor(state),
);

const loading = computed(() => {
    return monitoringStore.monitoringOverviewData == null;
});

const clientData = computed(() => {
    const states = monitoringStore.monitoringOverviewData?.clientStates;
    return clientStates.map((state) => states?.[state] ?? 0);
});

const chartData = computed(() => {
    const chartLabels: string[] = [];
    const chartColors: string[] = [];
    const chartCounts: number[] = [];
    clientData.value.forEach((amount, index) => {
        if (amount > 0) {
            chartLabels.push(translate(clientStates[index], i18n));
            chartColors.push(clientColors[index]);
            chartCounts.push(amount);
        }
    });

    return {
        labels: chartLabels,
        datasets: [
            {
                backgroundColor: chartColors,
                data: chartCounts,
            },
        ],
    };
});
</script>
