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
            <Doughnut
                v-if="chartData != null"
                :options="chartOptions"
                :data="chartData"
            />
        </v-col>
    </v-row>

    <!------labels------->
    <v-row v-for="(label, index) in labels">
        <v-col>
            <v-btn
                append-icon="mdi-chevron-right"
                :color="getConnectionStatusColor(label)">
                {{ data[index] }} {{translate(label)}}
            </v-btn>
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
        

        Object.entries(monitoringStore.monitoringOverviewData.clientStates)
            .filter(([key]) => key !== "total")
            .forEach(([connectionStatusString, amount]) => {

                const connectionStatus: ConnectionStatusEnum | null = generalUtils.findEnumValue(ConnectionStatusEnum, connectionStatusString);

                labels.value.push(connectionStatus);
                data.value.push(amount);
                colors.value.push(getConnectionStatusColor(connectionStatus));
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


    function getConnectionStatusColor(connectionStatus: ConnectionStatusEnum | null): string{
        if(connectionStatus == null){
            return "#000000";
        }

        if(connectionStatus == ConnectionStatusEnum.ACTIVE){
            return "#13e844";
        }

        if(connectionStatus == ConnectionStatusEnum.CONNECTION_REQUESTED){
            return "#e8a010";
        }

        if(connectionStatus == ConnectionStatusEnum.READY){
            return "#134fe8";
        }

        if(connectionStatus == ConnectionStatusEnum.DISABLED){
            return "#e81010";
        }

        return "#000000";
    }


</script>

<style scoped>

</style>