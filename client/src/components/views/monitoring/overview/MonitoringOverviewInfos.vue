<template>
    <v-row>
        <!------title------->
        <v-col class="primary-text-color text-h5 font-weight-bold">
            {{monitoringStore.selectedExam?.quizName}}
        </v-col>

        <!------running label------->
        <v-col>
            <v-chip 
                variant="flat"
                class=""
                color="green">
                {{translate(generalUtils.findEnumValue(ExamStatusEnum, monitoringStore.selectedExam?.status))}}
            </v-chip>
        </v-col>
    </v-row>

    <v-row class="mt-6">
        <!------start time label------->
        <v-col class="text-subtitle-1">
            Start
        </v-col>

        <!------end time label------->
        <v-col class="text-subtitle-1">
            End
        </v-col>
    </v-row>

    <v-row>
        <!------start time------->
        <v-col class="primary-text-color text-h6 font-weight-bold">
            {{timeUtils.formatIsoDateToFullDate(monitoringStore.selectedExam?.quizStartTime)}}
        </v-col>

        <!------end time------->
        <v-col class="primary-text-color text-h6 font-weight-bold">
            <template v-if="monitoringStore.selectedExam?.quizEndTime == null || ''">
                -
            </template>
            <template v-else>
                {{timeUtils.formatIsoDateToFullDate(monitoringStore.selectedExam?.quizEndTime)}}
            </template>
        </v-col>
    </v-row>

</template>

<script setup lang="ts">
    import {translate} from "@/utils/generalUtils";
    import { useMonitoringStore } from "@/stores/monitoringStore";
    import { ExamStatusEnum, ExamTypeEnum } from "@/models/examFiltersEnum";
    import * as generalUtils from "@/utils/generalUtils";
    import * as timeUtils from "@/utils/timeUtils";


    //stores
    const monitoringStore = useMonitoringStore();


</script>

<style scoped>

</style>