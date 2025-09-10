<template>
    <v-row>
        <v-col cols="12">
            <!------title------->
            <div class="text-h6 font-weight-bold mb-4">
                {{ translate("monitoringOverview.clientStates.clientStates") }}
            </div>
            <!------doughnut chart------->
            <v-row>
                <v-col cols="6">
                    <section class="chart-container">
                        <Doughnut
                            v-if="chartData != null"
                            :data="chartData"
                            :options="chartOptions"
                        />
                        <div class="chart-label font-weight-bold">
                            {{ translate("monitoringOverview.clients.total") }}
                            {{
                                monitoringStore.monitoringOverviewData
                                    ?.clientStates.total
                            }}
                        </div>
                    </section>
                </v-col>
                <v-col cols="6">
                    <v-row>
                        <v-col>
                            <template
                                v-for="(state, index) in clientStates"
                                :key="index"
                            >
                                <v-card
                                    v-if="state != ConnectionStatusEnum.MISSING"
                                    class="rounded-lg mb-3 pa-2"
                                    :color="getConnectionStatusColor(state)"
                                    :hover="true"
                                    :ripple="false"
                                    variant="flat"
                                    @click="
                                        monitoringViewService.goToMonitoring(
                                            MonitoringHeaderEnum.SHOW_STATES,
                                            state!,
                                            examId,
                                        )
                                    "
                                >
                                    <v-row>
                                        <v-col align="left"
                                            >{{ clientData[index] }}
                                            {{ translate(state) }}</v-col
                                        >
                                        <v-col align="right">
                                            <v-icon
                                                :icon="
                                                    getConnectionStatusIcon(
                                                        state,
                                                    )
                                                "
                                            ></v-icon>
                                        </v-col>
                                    </v-row>
                                </v-card>
                            </template>
                        </v-col>
                    </v-row>

                    <!------missing state------->

                    <v-row
                        v-if="
                            clientStates.includes(ConnectionStatusEnum.MISSING)
                        "
                        class="mt-6"
                    >
                        <v-col>
                            <v-card
                                class="rounded-lg mb-3 pa-2"
                                :color="
                                    getConnectionStatusColor(
                                        clientStates[clientStates.length - 1],
                                    )
                                "
                                :hover="true"
                                :ripple="false"
                                variant="flat"
                                @click="
                                    monitoringViewService.goToMonitoring(
                                        MonitoringHeaderEnum.SHOW_STATES,
                                        ConnectionStatusEnum.MISSING,
                                        examId,
                                    )
                                "
                            >
                                <v-row>
                                    <v-col align="left"
                                        >{{ clientData[clientData.length - 1] }}
                                        {{
                                            translate(
                                                clientStates[
                                                    clientStates.length - 1
                                                ],
                                            )
                                        }}
                                    </v-col>
                                    <v-col align="right">
                                        <v-icon
                                            :icon="
                                                getConnectionStatusIcon(
                                                    ConnectionStatusEnum.MISSING,
                                                )
                                            "
                                        ></v-icon>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { Doughnut } from "vue-chartjs";
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";
import { translate } from "@/utils/generalUtils";
import * as generalUtils from "@/utils/generalUtils";
import { ConnectionStatusEnum } from "@/models/seb-server/connectionStatusEnum";
import * as monitoringViewService from "@/services/seb-server/component-services/monitoringViewService";
import { MonitoringHeaderEnum } from "@/models/seb-server/monitoringEnums";
import { useI18n } from "vue-i18n";

// i18n
const i18n = useI18n();

// stores
const monitoringStore = useMonitoringStore();

// exam
const examId = useRoute().params.examId.toString();

// chart
ChartJS.register(ArcElement, Tooltip, Legend);

const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
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

const clientStatesListSortOrder: any = {
    [ConnectionStatusEnum.CONNECTION_REQUESTED]: 0,
    [ConnectionStatusEnum.READY]: 1,
    [ConnectionStatusEnum.ACTIVE]: 2,
    [ConnectionStatusEnum.CLOSED]: 3,
    [ConnectionStatusEnum.DISABLED]: 4,
    [ConnectionStatusEnum.MISSING]: 5,
};

// chart data
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

        const clientStatesList: {
            clientStates: ConnectionStatusEnum;
            clientAmount: number;
        }[] = Object.entries(
            monitoringStore.monitoringOverviewData.clientStates,
        )
            .filter(([key]) => key != "total")
            .map(([key, value]) => ({
                clientStates: generalUtils.findEnumValue(
                    ConnectionStatusEnum,
                    key,
                )!,
                clientAmount: value,
            }))
            .sort((a, b) => {
                return (
                    clientStatesListSortOrder[a.clientStates] -
                    clientStatesListSortOrder[b.clientStates]
                );
            });

        clientStatesList.forEach((item) => {
            if (item.clientAmount != 0) {
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

function getConnectionStatusIcon(
    connectionStatus: ConnectionStatusEnum | null,
): string {
    if (connectionStatus == null) return "mdi-chevron-right";

    switch (connectionStatus) {
        case ConnectionStatusEnum.CONNECTION_REQUESTED:
            return "mdi-signal-distance-variant";
        case ConnectionStatusEnum.READY:
            return "mdi-check";
        case ConnectionStatusEnum.ACTIVE:
            return "mdi-check-underline";
        case ConnectionStatusEnum.CLOSED:
            return "mdi-close";
        case ConnectionStatusEnum.DISABLED:
            return "mdi-send-lock";
        case ConnectionStatusEnum.MISSING:
            return "mdi-signal-off";
        default:
            return "mdi-chevron-right";
    }
}
</script>

<style scoped>
.chart-container {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 230px;
}
.chart-container canvas {
    width: 100% !important;
    height: auto !important;
}

.chart-label {
    position: absolute;
    text-align: center;
    font-size: clamp(0.9rem, 2vw, 1.2rem);
    line-height: 1.2;
}
</style>
