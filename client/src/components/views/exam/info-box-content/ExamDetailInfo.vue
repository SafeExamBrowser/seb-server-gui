<template>
    <v-row>
        <v-col>
            <v-sheet 
                elevation="4"
                class="rounded-lg pa-8"
                height="300">

                <v-row class="fill-height" align="center">

                    <!--Title-->
                    <v-col cols="4">
                        <div class="primary-text-color text-h4 font-weight-bold">
                            {{examStore.selectedExam?.quizName}}
                        </div>
                    </v-col>

                    <!--info row-->
                    <v-col cols="8" v-if="examStore.selectedExam != null">

                        <!---------titles--------->
                        <v-row>
                            <v-col cols="4">
                                <div class="primary-text-color text-subtitle-1">
                                    Start
                                </div>
                            </v-col>

                            <v-col cols="2">
                                <div class="primary-text-color text-subtitle-1">
                                    End
                                </div>
                            </v-col>

                            <v-col cols="2">
                                <div class="primary-text-color text-subtitle-1">
                                    Exam Description
                                </div>
                            </v-col>

                            <v-col cols="4">
                                <div class="primary-text-color text-subtitle-1">
                                    Exam Type & Status
                                </div>
                            </v-col>
                        </v-row>
                        <!------------------------->

                        <!---------values--------->
                        <v-row>
                            <v-col class="primary-text-color text-h6 font-weight-bold" cols="4">
                                {{timeUtils.formatIsoDateToFullDate(examStore.selectedExam?.quizStartTime)}}
                            </v-col>

                            <v-col class="primary-text-color text-h6 font-weight-bold" cols="2">
                                <template v-if="examStore.selectedExam?.quizEndTime == null || ''">
                                    -
                                </template>
                                <template v-else>
                                    {{timeUtils.formatIsoDateToFullDate(examStore.selectedExam?.quizEndTime)}}
                                </template>
                            </v-col>

                            <v-col class="text-h6" cols="2">
                                <template v-if="examStore.selectedExam?.description == null || ''">
                                    -
                                </template>
                                <template v-else>
                                    {{examStore.selectedExam?.description}}
                                </template>
                            </v-col>

                            <v-col cols="4">
                                <v-chip 
                                    class="mr-2"
                                    variant="tonal">
                                    {{ generalUtils.getTypeFilterName(generalUtils.findEnumValue(ExamTypeEnum, examStore.selectedExam.type)) }}
                                </v-chip>
                                <v-chip 
                                    variant="tonal"
                                    :color="generalUtils.getExamStatusFilterColor(generalUtils.findEnumValue(ExamStatusEnum, examStore.selectedExam.status))">
                                    {{ generalUtils.getExamStatusFilterName(generalUtils.findEnumValue(ExamStatusEnum, examStore.selectedExam.status)) }}
                                </v-chip>
                            </v-col>

                        </v-row>
                        <!------------------------->

                    </v-col>
                </v-row>

            </v-sheet>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
    import { useExamStore } from '@/stores/examStore';
    import * as constants from "@/utils/constants";
    import * as timeUtils from "@/utils/timeUtils";
    import * as generalUtils from "@/utils/generalUtils";
    import { ExamStatusEnum, ExamTypeEnum } from "@/models/examFiltersEnum";

    //stores
    const examStore = useExamStore();

</script>

<style scoped>

</style>