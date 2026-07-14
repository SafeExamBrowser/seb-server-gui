<template>
    <v-card border elevation="1" rounded="lg" class="h-100 d-flex flex-column">
        <div class="d-flex align-center px-5 py-4 bg-background">
            <span class="text-body-medium font-weight-bold">
                {{ $t("monitoringOverview.clientStates.clientStates") }}
            </span>
        </div>
        <v-divider />

        <LoadingFallbackComponent :loading="loading">
            <div class="flex-grow-1 d-flex flex-wrap align-center ga-4 pa-5">
                <v-sheet
                    color="transparent"
                    width="132"
                    height="132"
                    class="position-relative flex-shrink-0"
                >
                    <Doughnut
                        v-if="chartData != null"
                        :data="chartData"
                        :options="chartOptions"
                    />
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
                    :style="{ minWidth: '150px' }"
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
                                    state!,
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
import { Doughnut } from "vue-chartjs";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";
import { translate } from "@/utils/generalUtils.ts";
import { ConnectionStatusEnum } from "@/models/seb-server/connectionStatusEnum.ts";
import { MonitoringHeaderEnum } from "@/models/seb-server/monitoringEnums.ts";
import { useI18n } from "vue-i18n";
import { computed, ref, watch } from "vue";
import { goToMonitoring } from "../composables/useMonitoringNavigation.ts";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";

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

const chartData = ref<{
    labels: string[];
    datasets: [
        {
            backgroundColor: string[];
            data: number[];
        },
    ];
}>();

const clientStatesListSortOrder: Record<ConnectionStatusEnum, number> = {
    [ConnectionStatusEnum.CONNECTION_REQUESTED]: 0,
    [ConnectionStatusEnum.READY]: 1,
    [ConnectionStatusEnum.ACTIVE]: 2,
    [ConnectionStatusEnum.CLOSED]: 3,
    [ConnectionStatusEnum.DISABLED]: 4,
    [ConnectionStatusEnum.MISSING]: 5,
    [ConnectionStatusEnum.UNDEFINED]: 6,
};

const clientStates = ref<(ConnectionStatusEnum | null)[]>([]);
const clientLabels = ref<string[]>([]);
const clientData = ref<number[]>([]);
const clientColors = ref<string[]>([]);

const orderedStates = (
    Object.keys(clientStatesListSortOrder) as ConnectionStatusEnum[]
)
    .filter((state) => state !== ConnectionStatusEnum.UNDEFINED)
    .sort(
        (a, b) => clientStatesListSortOrder[a] - clientStatesListSortOrder[b],
    );

const loading = computed(() => {
    return monitoringStore.monitoringOverviewData == null;
});

watch(
    () => monitoringStore.monitoringOverviewData?.clientStates,
    () => {
        const states = monitoringStore.monitoringOverviewData?.clientStates;
        if (states == null) {
            return;
        }

        const counts = new Map<string, number>();
        Object.entries(states).forEach(([key, value]) => {
            if (key !== "total") {
                counts.set(key, Number(value));
            }
        });

        clientStates.value = orderedStates;
        clientLabels.value = orderedStates.map((state) =>
            translate(state, i18n),
        );
        clientData.value = orderedStates.map((state) => counts.get(state) ?? 0);
        clientColors.value = orderedStates.map((state) =>
            getConnectionStatusColor(state),
        );

        const chartLabels: string[] = [];
        const chartColors: string[] = [];
        const chartCounts: number[] = [];
        clientData.value.forEach((amount, index) => {
            if (amount > 0) {
                chartLabels.push(clientLabels.value[index]);
                chartColors.push(clientColors.value[index]);
                chartCounts.push(amount);
            }
        });

        chartData.value = {
            labels: chartLabels,
            datasets: [
                {
                    backgroundColor: chartColors,
                    data: chartCounts,
                },
            ],
        };
    },
    { deep: true },
);

function getConnectionStatusColor(
    connectionStatus: ConnectionStatusEnum | null,
): string {
    if (connectionStatus == null) return "#000000";

    switch (connectionStatus) {
        case ConnectionStatusEnum.CONNECTION_REQUESTED:
            return "#d7fad9";
        case ConnectionStatusEnum.READY:
            return "#abf7af";
        case ConnectionStatusEnum.ACTIVE:
            return "#66BB6A";
        case ConnectionStatusEnum.CLOSED:
            return "#d4f7ff";
        case ConnectionStatusEnum.DISABLED:
            return "#9E9E9E";
        case ConnectionStatusEnum.MISSING:
            return "#EF5350";
        default:
            return "#000000";
    }
}
</script>
