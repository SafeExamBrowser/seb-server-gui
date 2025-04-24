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

    <!------labels------->
    <v-row class="mt-2">

        <v-col cols="6">
            <template v-for="(label, index) in labels" :key="index">
                <v-card
                    v-if="label != ConnectionStatusEnum.MISSING"

                    class="rounded-lg mb-3 pa-2" 
                    variant="flat"
                    :hover="true"
                    :ripple="false"
                    :color="getConnectionStatusColor(label)"
                    @click="">
                    
                    <v-row>
                        <v-col align="left"><span>{{ data[index] }} {{translate(label)}}</span></v-col>
                        <v-col align="right"><v-icon>mdi-chevron-right</v-icon></v-col>
                    </v-row>
                </v-card>
            </template>
        </v-col>

        <v-col v-if="labels.includes(ConnectionStatusEnum.MISSING)">
            <v-card
                class="rounded-lg mb-3 pa-2" 
                variant="flat"
                :hover="true"
                :ripple="false"
                :color="getConnectionStatusColor(labels[labels.length-1])"
                @click="">

                <v-row>
                    <v-col align="left"><span>{{ data[data.length-1] }} {{translate(labels[labels.length-1])}}</span></v-col>
                    <v-col align="right"><v-icon>mdi-chevron-right</v-icon></v-col>
                </v-row>
            </v-card>
        </v-col>

    </v-row>

</template>

<script setup lang="ts">
    import { Doughnut } from "vue-chartjs";
    import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
    import { useMonitoringStore } from "@/stores/monitoringStore";
    import {storeToRefs} from "pinia";
    import {translate} from "@/utils/generalUtils";
    import * as generalUtils from "@/utils/generalUtils";
    import {ConnectionStatusEnum} from "@/models/connectionStatusEnum";

    //stores
    const monitoringStore = useMonitoringStore();
    const monitoringStoreRef = storeToRefs(monitoringStore);

    //chart
    ChartJS.register(ArcElement, Tooltip, Legend)

    const chartOptions = ref({
        responsive: true,
        maintainAspectRatio: false
    });

    const chartData = ref<{
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
    const labels = ref<(ConnectionStatusEnum | null)[]>([]);
    const data = ref<number[]>([])
    const colors = ref<string[]>([])


    watch(() => monitoringStore.monitoringOverviewData?.clientStates, () => {

        // console.log("it got here client states")

        if(monitoringStore.monitoringOverviewData == null){
            return;
        }

        labels.value = []
        data.value = []
        colors.value = []

        const clientStatesList: {clientStates: ConnectionStatusEnum, clientAmount: number}[] = Object.entries(monitoringStore.monitoringOverviewData.clientStates)
            .filter(([key]) => key != "total")
            .map(([key, value]) => ({
                clientStates: generalUtils.findEnumValue(ConnectionStatusEnum, key)!,
                clientAmount: value
            }))
            .sort((a, b) => {
                return clientStatesListSortOrder[a.clientStates] - clientStatesListSortOrder[b.clientStates];
            });

        console.log(clientStatesList);

        clientStatesList.forEach((item) => {
                labels.value.push(item.clientStates);
                data.value.push(item.clientAmount);
                colors.value.push(getConnectionStatusColor(item.clientStates));
            }
        );

        chartData.value = {
            datasets: [
                {
                    backgroundColor: colors.value,
                    data: data.value
                }
            ]
        }

    },{deep: true});

    function getConnectionStatusColor(connectionStatus: ConnectionStatusEnum | null): string {
        if (connectionStatus == null) return "#000000";

        switch (connectionStatus) {
            case ConnectionStatusEnum.CONNECTION_REQUESTED:
                return "#FFA726";
            case ConnectionStatusEnum.READY:
                return "#26C6DA";
            case ConnectionStatusEnum.ACTIVE:
                return "#66BB6A";
            case ConnectionStatusEnum.CLOSED:
                return "#7E57C2";
            case ConnectionStatusEnum.DISABLED:
                return "#9E9E9E";
            case ConnectionStatusEnum.MISSING:
                return "#EF5350";
            default:
                return "#000000";
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