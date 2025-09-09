<template>
    <v-row>
        <v-col>
            <v-sheet class="rounded-lg pl-4 pt-3 pr-4" elevation="4">
                <v-row align="center" class="fill-height min-height">
                    <v-col v-if="quizImportStore.selectedQuiz">
                        <!------title and headers------->
                        <v-row>
                            <v-col
                                class="primary-text-color text-h5 font-weight-bold"
                                cols="3"
                            >
                                {{ quizImportStore.selectedQuiz?.quiz_name }}
                            </v-col>

                            <v-col class="text-subtitle-1" cols="3">
                                {{
                                    translate(
                                        "quizImportWizard.genericInfo.start",
                                    )
                                }}
                            </v-col>

                            <v-col class="text-subtitle-1" cols="3">
                                {{
                                    translate(
                                        "quizImportWizard.genericInfo.end",
                                    )
                                }}
                            </v-col>
                            <v-spacer></v-spacer>

                            <v-spacer />
                        </v-row>

                        <!------url and values------->
                        <v-row>
                            <!------url------->
                            <v-col
                                class="text-h7 text-decoration-underline"
                                cols="3"
                            >
                                <a
                                    :href="
                                        quizImportStore.selectedQuiz
                                            ?.quiz_start_url
                                    "
                                    target="_blank"
                                >
                                    {{
                                        quizImportStore.selectedQuiz
                                            ?.quiz_start_url
                                    }}
                                </a>
                            </v-col>

                            <!------start time------->
                            <v-col
                                class="primary-text-color text-h6 font-weight-bold"
                                cols="3"
                            >
                                {{
                                    timeUtils.formatIsoToReadableDateTime(
                                        quizImportStore.selectedQuiz
                                            ?.quiz_start_time,
                                    )
                                }}
                            </v-col>

                            <!------end time------->
                            <v-col
                                class="primary-text-color text-h6 font-weight-bold"
                                cols="3"
                            >
                                <template
                                    v-if="
                                        quizImportStore.selectedQuiz
                                            ?.quiz_end_time == null || ''
                                    "
                                >
                                    -
                                </template>
                                <template v-else>
                                    {{
                                        timeUtils.formatIsoToReadableDateTime(
                                            quizImportStore.selectedQuiz
                                                ?.quiz_end_time,
                                        )
                                    }}
                                </template>
                            </v-col>
                            <v-spacer></v-spacer>

                            <v-spacer />
                        </v-row>
                    </v-col>
                </v-row>
            </v-sheet>
        </v-col>
    </v-row>
</template>

<script setup lang="ts">
import { useQuizImportStore } from "@/stores/seb-server/quizImportStore";
import * as timeUtils from "@/utils/timeUtils";
import { translate } from "@/utils/generalUtils";

// stores
const quizImportStore = useQuizImportStore();
</script>

<style scoped>
.min-height {
    min-height: 10vh;
}
</style>
