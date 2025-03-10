<template>
    <v-row>
        <v-col>
            <v-sheet 
                elevation="4"
                class="rounded-lg pa-8"
               >

                <v-row 
                    class="fill-height"
                    align="center"
                    >

                    <v-col cols="5">
                        <v-row>
                            <v-col>
                                <div class="primary-text-color text-h5 font-weight-bold">
                                    {{quizImportStore.selectedQuiz?.quiz_name}}
                                </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col>
                                <div class="text-h6">
                                    <a :href="quizImportStore.selectedQuiz?.quiz_start_url" target="_blank">
                                        {{quizImportStore.selectedQuiz?.quiz_start_url}}
                                    </a>
                                </div>
                            </v-col>
                        </v-row>
                        
                    </v-col>

                    <v-col cols="4">
                        <div>
                            <v-row>
                                <v-col>
                                    <div class="text-subtitle-1">
                                        Start
                                    </div>
                                </v-col>
                                <v-col>
                                    <div class="text-subtitle-1">
                                        End
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="primary-text-color text-h6 font-weight-bold">
                                    {{timeUtils.formatIsoDateToFullDate(quizImportStore.selectedQuiz?.quiz_start_time)}}
                                </v-col>
                                <v-col class="primary-text-color text-h6 font-weight-bold">
                                    <template v-if="quizImportStore.selectedQuiz?.quiz_end_time == null || ''">
                                        -
                                    </template>
                                    <template v-else>
                                        {{timeUtils.formatIsoDateToFullDate(quizImportStore.selectedQuiz?.quiz_end_time)}}
                                    </template>

                                </v-col>
                            </v-row>
                        </div>
                    </v-col>

                    <v-col cols="3">
                        <v-row>
                                <v-col>
                                    <div class="text-subtitle-1">
                                        Exam Description
                                    </div>
                                </v-col>
                            </v-row>
                            <v-row>
                                <v-col class="primary-text-color text-h6">
                                    <template v-if="quizImportStore.selectedQuiz?.quiz_description == null || ''">
                                        -
                                    </template>
                                    <template v-else>
                                        
                                        {{quizImportStore.selectedQuiz?.quiz_description}}
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
    import {useQuizImportStore} from "@/stores/quizImportStore";
    import * as timeUtils from "@/utils/timeUtils";

    //stores
    const quizImportStore = useQuizImportStore();

</script>

<style scoped>



</style>