<template>
    <v-row>
        <v-col>
            <v-sheet elevation="4" class="rounded-lg pa-8">
                <v-row class="fill-height" align="center">
                    <v-col>

                        <!------title and headers------->
                        <v-row>
                            <v-col cols="3" class="primary-text-color text-h5 font-weight-bold">
                                {{examStore.selectedExam?.quizName}}
                            </v-col>

                            <v-col cols="2" class="text-subtitle-1">
                                Start
                            </v-col>

                            <v-col cols="2" class="text-subtitle-1">
                                End
                            </v-col>

                            <v-col cols="3" class="text-subtitle-1">
                                Description
                            </v-col>

                            <v-col cols="2" class="text-subtitle-1">
                                Exam Type & Status
                            </v-col>
                        </v-row>

                        <!------url and values------->
                        <v-row>
                            <!------url------->
                            <v-col cols="3" class="text-h7 text-decoration-underline">
                                <a :href="examStore.selectedExam?.startURL" target="_blank">
                                    {{examStore.selectedExam?.startURL}}
                                </a>
                            </v-col>

                            <!------start time------->
                            <v-col cols="2" class="primary-text-color text-h6 font-weight-bold">
                                {{timeUtils.formatIsoDateToFullDate(examStore.selectedExam?.quizStartTime)}}
                            </v-col>

                            <!------end time------->
                            <v-col cols="2" class="primary-text-color text-h6 font-weight-bold">
                                <template v-if="examStore.selectedExam?.quizEndTime == null || ''">
                                    -
                                </template>
                                <template v-else>
                                    {{timeUtils.formatIsoDateToFullDate(examStore.selectedExam?.quizEndTime)}}
                                </template>
                            </v-col>

                            <!------description------->
                            <v-col cols="3">
                                <template v-if="examStore.selectedExam?.description == null || ''">
                                    -
                                </template>
                                <template v-else>
                                    <span v-html="examStore.selectedExam?.description"></span>
                                </template>
                            </v-col>

                            <!------exam type & status------->
                            <v-col cols="2">
                                <v-chip 
                                    class="mr-1"
                                    variant="tonal"
                                    size="small">
                                    {{ generalUtils.getTypeFilterName(generalUtils.findEnumValue(ExamTypeEnum, examStore.selectedExam?.type)) }}
                                </v-chip>
                                <v-chip 
                                    variant="tonal"
                                    size="small"
                                    :color="generalUtils.getExamStatusFilterColor(generalUtils.findEnumValue(ExamStatusEnum, examStore.selectedExam?.status))">
                                    {{ generalUtils.getExamStatusFilterName(generalUtils.findEnumValue(ExamStatusEnum, examStore.selectedExam?.status)) }}
                                </v-chip>
                            </v-col>
                        </v-row>

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