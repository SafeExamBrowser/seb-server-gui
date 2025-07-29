<template>
    <!-- Breadcrumb and Title -->
    <v-row dense>
        <!-- Breadcrumb -->
        <v-col cols="12" md="10" class="pl-5 mb-1">
            <div class="path-text d-flex align-center">
            <span
                class="breadcrumb-link"
                @click="navigateTo(constants.HOME_PAGE_ROUTE)"
            >
                {{ translate("titles.home") }}
            </span>

                <span class="breadcrumb-arrow">›</span>

                <span
                    class="breadcrumb-active"
                    @click="navigateTo(constants.MONITORING_ROUTE)"
                >
                {{ translate("titles.monitoring") }}
                </span>
            </div>
        </v-col>

        <!-- Title -->
        <v-col cols="12" md="10" class="pl-10">
            <div class="primary-text-color text-h4 font-weight-bold">
                {{ monitoringStore.selectedExam?.quizName }}
            </div>
        </v-col>

        <v-col cols="12" md="2" class="pl-10"></v-col>
    </v-row>

    <!-- Status, Start and End Date -->
    <v-row dense class="mt-5">
        <v-col cols="12">
            <v-sheet
                elevation="4"
                class="rounded-lg pa-4 d-flex justify-space-between align-center"
            >
                <!-- Status -->
                <v-col cols="4">
                    <div class="d-flex align-center" style="margin-right: 24px;">
                        <div
                            class="mr-3 d-flex align-center justify-center"
                            style="width: 52px; height: 52px; background-color: #e0f5ed; border-radius: 10px; padding: 8px;"
                        >
                            <v-icon size="28" color="green">mdi-play</v-icon>
                        </div>
                        <div>
                            <div class="text-body-2 font-weight-bold text-grey-darken-1">
                                {{ translate("monitoringOverview.infos.status") }}
                            </div>
                            <div
                                class="font-weight-bold text-body-1 mt-1"
                                :style="{
                                    color: generalUtils.getExamStatusFilterColor(
                                    generalUtils.findEnumValue(ExamStatusEnum, monitoringStore.selectedExam?.status)
                                        )
                                    }"
                            >
                                {{
                                    translate(
                                        generalUtils.findEnumValue(ExamStatusEnum, monitoringStore.selectedExam?.status)
                                    )
                                }}
                            </div>
                        </div>
                    </div>
                </v-col>

                <!-- Start Date -->
                <v-col cols="4">
                    <div class="d-flex align-center">
                        <div
                            class="mr-3 d-flex align-center justify-center"
                            style="width: 52px; height: 52px; background-color: #EBEFF7; border-radius: 10px; padding: 8px;"
                        >
                            <v-icon size="28" color="#215caf">mdi-calendar-blank</v-icon>
                        </div>
                        <div>
                            <div class="text-body-2 font-weight-bold text-grey-darken-1">
                                {{ translate("monitoringOverview.infos.start") }}
                            </div>
                            <div class="font-weight-bold text-body-1">
                                {{ timeUtils.formatIsoToReadableDateTime(monitoringStore.selectedExam?.quizStartTime) }}
                            </div>
                        </div>
                    </div>
                </v-col>

                <!-- End Date -->
                <v-col cols="4">
                    <div class="d-flex align-center">
                        <div
                            class="mr-3 d-flex align-center justify-center"
                            style="width: 52px; height: 52px; background-color: #EBEFF7; border-radius: 10px; padding: 8px;"
                        >
                            <v-icon size="28" color="#215caf">mdi-calendar-check</v-icon>
                        </div>
                        <div>
                            <div class="text-body-2 font-weight-bold text-grey-darken-1">
                                {{ translate("monitoringOverview.infos.end") }}
                            </div>
                            <div class="font-weight-bold text-body-1">
                                <template v-if="!monitoringStore.selectedExam?.quizEndTime">
                                    -
                                </template>
                                <template v-else>
                                    {{
                                        timeUtils.formatIsoToReadableDateTime(monitoringStore.selectedExam?.quizEndTime)
                                    }}
                                </template>
                            </div>
                        </div>
                    </div>
                </v-col>
            </v-sheet>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import {translate} from "@/utils/generalUtils";
import {useMonitoringStore} from "@/stores/seb-server/monitoringStore";
import {ExamStatusEnum, ExamTypeEnum} from "@/models/seb-server/examFiltersEnum";
import * as generalUtils from "@/utils/generalUtils";
import * as timeUtils from "@/utils/timeUtils";
import {navigateTo} from "@/router/navigation";
import * as constants from "@/utils/constants";


//stores
const monitoringStore = useMonitoringStore();


</script>

<style scoped>
</style>
