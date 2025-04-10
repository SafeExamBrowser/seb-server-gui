<template>
    <!------title notifications------->
    <v-row>
        <v-col class="primary-text-color text-h5 font-weight-bold">
            Notifications
        </v-col>
    </v-row>

    <v-row v-for="(value, key) in monitoringStore.monitoringOverviewData?.notifications" :key="key">
        <v-col>
            <v-btn
                append-icon="mdi-chevron-right">
                {{ value }} {{ translate(key) }}
            </v-btn>
        </v-col>
    </v-row>

    
    <!------title indicators------->
    <v-row>
        <v-col class="primary-text-color text-h5 font-weight-bold">
            Indicators
        </v-col>
    </v-row>

    <v-row v-for="(value, key) in monitoringStore.monitoringOverviewData?.indicators" :key="key">
        <v-col>
            <v-btn
                append-icon="mdi-chevron-right">
                {{ value }} {{ translate(key) }}
            </v-btn>
        </v-col>
    </v-row>

</template>

<script setup lang="ts">
    import { useMonitoringStore } from "@/stores/monitoringStore";
    import {translate} from "@/utils/generalUtils";


    //stores
    const monitoringStore = useMonitoringStore();


</script>

<style scoped>

</style>