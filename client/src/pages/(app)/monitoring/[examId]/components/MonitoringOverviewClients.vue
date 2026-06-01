<template>
    <v-card border="thin" flat rounded="lg" class="h-100 d-flex flex-column">
        <div class="px-5 py-3 d-flex align-center">
            <span class="text-subtitle-1 font-weight-bold">
                {{ $t("monitoringOverview.clientStates.clientStates") }}
            </span>
        </div>
        <v-divider />

        <div class="pa-5 flex-grow-1 d-flex flex-wrap align-center ga-5">
            <!-- Doughnut -->
            <div
                class="position-relative mx-auto flex-shrink-0"
                :style="{ width: '150px', maxWidth: '150px' }"
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
                    <div class="text-h6 font-weight-bold">
                        {{
                            monitoringStore.monitoringOverviewData?.clientStates
                                .total
                        }}
                    </div>
                    <div
                        class="text-caption font-weight-bold text-uppercase text-medium-emphasis"
                    >
                        {{ $t("monitoringOverview.clients.total") }}
                    </div>
                </div>
            </div>

            <!-- State list -->
            <div
                class="flex-grow-1 d-flex flex-column ga-1"
                :style="{ minWidth: '160px' }"
            >
                <v-hover
                    v-for="(state, index) in clientStates"
                    :key="index"
                    v-slot="{ isHovering, props: hoverProps }"
                >
                    <div
                        v-bind="hoverProps"
                        class="d-flex align-center ga-3 px-3 py-2 rounded-lg"
                        :class="isHovering ? 'bg-surface-light' : ''"
                        :style="{ cursor: 'pointer' }"
                        @click="
                            goToMonitoring(
                                MonitoringHeaderEnum.SHOW_STATES,
                                state!,
                                examId,
                            )
                        "
                    >
                        <span
                            class="d-inline-block rounded-circle flex-shrink-0"
                            :style="{
                                width: '11px',
                                height: '11px',
                                backgroundColor: clientColors[index],
                            }"
                        ></span>
                        <span class="flex-grow-1 text-body-2">
                            {{ translate(state) }}
                        </span>
                        <span class="text-body-2 font-weight-bold">
                            {{ clientData[index] }}
                        </span>
                    </div>
                </v-hover>
            </div>
        </div>
    </v-card>
</template>

<script setup lang="ts">
import { Doughnut } from "vue-chartjs";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore.ts";
import { translate } from "@/utils/generalUtils.ts";
import * as generalUtils from "@/utils/generalUtils.ts";
import { ConnectionStatusEnum } from "@/models/seb-server/connectionStatusEnum.ts";
import { MonitoringHeaderEnum } from "@/models/seb-server/monitoringEnums.ts";
import { useI18n } from "vue-i18n";
import { ref, watch } from "vue";
import { goToMonitoring } from "../composables/useMonitoringNavigation.ts";

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

watch(
    () => monitoringStore.monitoringOverviewData?.clientStates,
    () => {
        if (monitoringStore.monitoringOverviewData == null) {
            return;
        }

        clientStates.value = [];
        clientLabels.value = [];
        clientData.value = [];
        clientColors.value = [];

        type StateCount = {
            clientStates: ConnectionStatusEnum;
            clientAmount: number;
        };

        const clientStatesList: StateCount[] = Object.entries(
            monitoringStore.monitoringOverviewData.clientStates,
        )
            .filter(([key]) => key !== "total")
            .map(([key, value]) => {
                const parsed = generalUtils.findEnumValue(
                    ConnectionStatusEnum,
                    key,
                );
                return parsed
                    ? { clientStates: parsed, clientAmount: Number(value) }
                    : null;
            })
            .filter((x): x is StateCount => x !== null)
            .sort((a, b) => {
                return (
                    clientStatesListSortOrder[a.clientStates] -
                    clientStatesListSortOrder[b.clientStates]
                );
            });

        clientStatesList.forEach((item) => {
            if (item.clientAmount !== 0) {
                clientLabels.value.push(translate(item.clientStates, i18n));
                clientStates.value.push(item.clientStates);
                clientData.value.push(item.clientAmount);
                clientColors.value.push(
                    getConnectionStatusColor(item.clientStates),
                );
            }
        });

        chartData.value = {
            labels: clientLabels.value,
            datasets: [
                {
                    backgroundColor: clientColors.value,
                    data: clientData.value,
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
