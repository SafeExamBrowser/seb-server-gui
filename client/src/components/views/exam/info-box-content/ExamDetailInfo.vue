<template>
    <v-row>
        <v-col>
            <v-sheet 
                elevation="4"
                class="rounded-lg pa-8"
                height="300">

                <v-row class="fill-height" align="center">

                    <v-col cols="5">
                        <div class="primary-text-color text-h4 font-weight-bold">
                            {{examStore.selectedExam?.quizName}}
                        </div>
                    </v-col>

                    <v-col cols="4">
                        <div>
                            <v-row>
                                <v-col>
                                    <div class="primary-text-color text-subtitle-1">
                                        Start
                                    </div>
                                </v-col>
                                <v-col>
                                    <div class="primary-text-color text-subtitle-1">
                                        End
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="primary-text-color text-h5 font-weight-bold">
                                    {{timeUtils.formatIsoDateToFullDate(examStore.selectedExam?.quizStartTime)}}
                                </v-col>
                                <v-col class="primary-text-color text-h5 font-weight-bold">
                                    <template v-if="examStore.selectedExam?.quizEndTime == null || ''">
                                        -
                                    </template>
                                    <template v-else>
                                        {{timeUtils.formatIsoDateToFullDate(examStore.selectedExam?.quizEndTime)}}
                                    </template>

                                </v-col>
                            </v-row>
                        </div>
                    </v-col>

                    <v-col cols="3">
                        <v-row>
                                <v-col>
                                    <div class="primary-text-color text-subtitle-1">
                                        Exam Description
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="text-h6">
                                    <template v-if="examStore.selectedExam?.description == null || ''">
                                        -
                                    </template>
                                    <template v-else>
                                        {{examStore.selectedExam?.description}}
                                    </template>

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

    //stores
    const examStore = useExamStore();

</script>

<style scoped>

</style>