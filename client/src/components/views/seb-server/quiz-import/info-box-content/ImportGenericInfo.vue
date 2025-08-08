<template>
    <v-row>
        <v-col>
            <v-sheet elevation="4" class="rounded-lg pl-4 pt-3 pr-4">
                <v-row class="fill-height min-height" align="center">
                    <v-col v-if="quizImportStore.selectedQuiz">

                        <!------title and headers------->
                        <v-row>
                            <v-col cols="3" class="primary-text-color text-h5 font-weight-bold">
                                {{quizImportStore.selectedQuiz?.quiz_name}}
                            </v-col>

                            <v-col cols="2" class="text-subtitle-1">
                                {{translate("quizImportWizard.genericInfo.start")}}
                            </v-col>

                            <v-col cols="2" class="text-subtitle-1">
                                {{translate("quizImportWizard.genericInfo.end")}}
                            </v-col>
                            <v-spacer/>
                        </v-row>

                        <!------url and values------->
                        <v-row>
                            <!------url------->
                            <v-col cols="3" class="text-h7 text-decoration-underline">
                                <a :href="quizImportStore.selectedQuiz?.quiz_start_url" target="_blank">
                                    {{quizImportStore.selectedQuiz?.quiz_start_url}}
                                </a>
                            </v-col>

                            <!------start time------->
                            <v-col cols="2" class="primary-text-color text-h6 font-weight-bold">
                                {{timeUtils.formatIsoToReadableDateTime(quizImportStore.selectedQuiz?.quiz_start_time)}}
                            </v-col>

                            <!------end time------->
                            <v-col cols="2" class="primary-text-color text-h6 font-weight-bold">
                                <template v-if="quizImportStore.selectedQuiz?.quiz_end_time == null || ''">
                                    -
                                </template>
                                <template v-else>
                                    {{timeUtils.formatIsoToReadableDateTime(quizImportStore.selectedQuiz?.quiz_end_time)}}
                                </template>
                            </v-col>

                            <v-spacer/>
                        </v-row>

                    </v-col>
                </v-row>
            </v-sheet>
        </v-col>
    </v-row>

</template>

<script setup lang="ts">
    import {useQuizImportStore} from "@/stores/seb-server/quizImportStore";
    import * as timeUtils from "@/utils/timeUtils";
    import {translate} from "@/utils/generalUtils";


    //stores
    const quizImportStore = useQuizImportStore();

</script>

<style scoped>
.min-height {
    min-height: 10vh;
}


</style>
