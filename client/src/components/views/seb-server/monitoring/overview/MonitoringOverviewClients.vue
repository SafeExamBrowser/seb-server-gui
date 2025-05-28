<template>

    <!------title------->
    <v-row>
        <v-col class="primary-text-color text-h5 font-weight-bold">
            Client States
        </v-col>
    </v-row>

    <!------doughnut chart------->
    <v-row>
        <v-col>
            <section class="chart-container">
                <Doughnut
                    v-if="chartData != null"
                    :options="chartOptions"
                    :data="chartData"
                />
                <div class="chart-label text-h5 font-weight-bold">
                    Total: {{ monitoringStore.monitoringOverviewData?.clientStates.total }}
                </div>
            </section>
        </v-col>
    </v-row>

    <!------state buttons------->
    <v-row class="mt-2">

        <!------all states (no missing)------->
        <v-col cols="6">
            <template v-for="(state, index) in clientStates" :key="index">
                <v-card
                    v-if="state != ConnectionStatusEnum.MISSING"

                    class="rounded-lg mb-3 pa-2" 
                    variant="flat"
                    :hover="true"
                    :ripple="false"
                    :color="getConnectionStatusColor(state)"
                    @click="monitoringViewService.goToMonitoring(
                                    MonitoringHeaderEnum.SHOW_STATES, 
                                    state!, 
                                    examId)">
                    
                    <v-row>
                        <v-col align="left">{{ clientData[index] }} {{translate(state)}}</v-col>
                        <v-col align="right">
                            <v-icon :icon="getConnectionStatusIcon(state)"></v-icon>
                        </v-col>
                    </v-row>
                </v-card>
            </template>
        </v-col>

        <!------missing state------->
        <v-col v-if="clientStates.includes(ConnectionStatusEnum.MISSING)">
            <v-card
                class="rounded-lg mb-3 pa-2" 
                variant="flat"
                :hover="true"
                :ripple="false"
                :color="getConnectionStatusColor(clientStates[clientStates.length-1])"
                @click="monitoringViewService.goToMonitoring(
                                    MonitoringHeaderEnum.SHOW_STATES, 
                                    ConnectionStatusEnum.MISSING, 
                                    examId)">

                <v-row>
                    <v-col align="left">{{ clientData[clientData.length-1] }} {{translate(clientStates[clientStates.length-1])}}</v-col>
                    <v-col align="right">
                        <v-icon :icon="getConnectionStatusIcon(ConnectionStatusEnum.MISSING)"></v-icon>
                    </v-col>
                </v-row>
            </v-card>
        </v-col>

    </v-row>

</template>

<script setup lang="ts">
    import { Doughnut } from "vue-chartjs";
    import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
    import { useMonitoringStore } from "@/stores/seb-server/monitoringStore";
    import {storeToRefs} from "pinia";
    import {translate} from "@/utils/generalUtils";
    import * as generalUtils from "@/utils/generalUtils";
    import {ConnectionStatusEnum} from "@/models/seb-server/connectionStatusEnum";
    import * as monitoringViewService from "@/services/seb-server/component-services/monitoringViewService";
    import { MonitoringHeaderEnum } from "@/models/seb-server/monitoringEnums";
    import { useI18n } from "vue-i18n";

    //i18n
    const i18n = useI18n();

    //stores
    const monitoringStore = useMonitoringStore();
    const monitoringStoreRef = storeToRefs(monitoringStore);

    //exam
    const examId = useRoute().params.examId.toString();

    //chart
    ChartJS.register(ArcElement, Tooltip, Legend)

    const chartOptions = ref({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        }
    });

    const chartData = ref<{
        labels: string[],
        datasets: [
            {
                backgroundColor: string[],
                data: number[]
            }
        ]
    }>();

    const clientStatesListSortOrder: any = {
        [ConnectionStatusEnum.CONNECTION_REQUESTED]: 0,
        [ConnectionStatusEnum.READY]: 1,
        [ConnectionStatusEnum.ACTIVE]: 2,
        [ConnectionStatusEnum.CLOSED]: 3,
        [ConnectionStatusEnum.DISABLED]: 4,
        [ConnectionStatusEnum.MISSING]: 5
    };

    //chart data
    const clientStates = ref<(ConnectionStatusEnum | null)[]>([]);
    const clientLabels = ref<string[]>([]);
    const clientData = ref<number[]>([]);
    const clientColors = ref<string[]>([]);


    watch(() => monitoringStore.monitoringOverviewData?.clientStates, () => {
        if(monitoringStore.monitoringOverviewData == null){
            return;
        }

        clientStates.value = [];
        clientLabels.value = [];
        clientData.value = [];
        clientColors.value = [];

        const clientStatesList: {clientStates: ConnectionStatusEnum, clientAmount: number}[] = Object.entries(monitoringStore.monitoringOverviewData.clientStates)
            .filter(([key]) => key != "total")
            .map(([key, value]) => ({
                clientStates: generalUtils.findEnumValue(ConnectionStatusEnum, key)!,
                clientAmount: value
            }))
            .sort((a, b) => {
                return clientStatesListSortOrder[a.clientStates] - clientStatesListSortOrder[b.clientStates];
            });

        clientStatesList.forEach((item) => {
                if(item.clientAmount != 0){
                    clientLabels.value.push(translate(item.clientStates, i18n));
                    clientStates.value.push(item.clientStates);
                    clientData.value.push(item.clientAmount);
                    clientColors.value.push(getConnectionStatusColor(item.clientStates));
                }
            }
        );

        chartData.value = {
            labels: clientLabels.value,
            datasets: [
                {
                    backgroundColor: clientColors.value,
                    data: clientData.value,
                }
            ]
        }

    },{deep: true});

    function getConnectionStatusColor(connectionStatus: ConnectionStatusEnum | null): string {
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

    function getConnectionStatusIcon(connectionStatus: ConnectionStatusEnum | null): string {
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
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .chart-label {
        position: absolute;
    }

</style>