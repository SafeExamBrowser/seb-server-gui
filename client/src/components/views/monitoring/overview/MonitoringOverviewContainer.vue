<template>

    <v-row>
        <v-col cols="4">
            <!--------infos-------->
            <v-row>
                <v-col>
                    <v-card class="rounded-lg pa-4" elevation="4">
                        <MonitoringOverviewInfos></MonitoringOverviewInfos>
                    </v-card>
                </v-col>
            </v-row>

            <!--------clients-------->
            <v-row>
                <v-col>
                    <v-card class="rounded-lg pa-4" elevation="4">
                        <MonitoringOverviewClients></MonitoringOverviewClients>
                    </v-card>
                </v-col>
            </v-row>
        </v-col>

        <!--------groups-------->
        <v-col cols="4">
            <v-card class="rounded-lg pa-4" elevation="4">
                <MonitoringOverviewGroups></MonitoringOverviewGroups>
            </v-card>
        </v-col>

        <!--------notifications-------->
        <v-col cols="4">
            <v-card class="rounded-lg pa-4" elevation="4">
                <MonitoringOverviewNotifications></MonitoringOverviewNotifications>
            </v-card>
        </v-col>
        
    </v-row>

</template>

<script setup lang="ts">


</script>

<style scoped>

</style>