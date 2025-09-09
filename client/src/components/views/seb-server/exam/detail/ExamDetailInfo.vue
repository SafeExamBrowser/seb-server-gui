<template>
    <!-- Breadcrumb and Title-->
    <v-row dense>
        <v-col class="pl-5 mb-1" cols="12" md="10">
            <div class="path-text d-flex align-center">
                <span
                    class="breadcrumb-link"
                    @click="navigateTo(constants.HOME_PAGE_ROUTE)"
                >
                    {{ translate("titles.home") }}
                </span>

                <span class="breadcrumb-arrow">›</span>

                <span
                    class="breadcrumb-link"
                    @click="navigateTo(constants.EXAM_ROUTE)"
                >
                    {{ translate("titles.exams") }}
                </span>

                <span class="breadcrumb-arrow">›</span>
            </div>
        </v-col>

        <v-col class="pl-10" cols="12" md="10">
            <div class="primary-text-color text-h4 font-weight-bold">
                {{ examStore.selectedExam?.quizName }}
            </div>
        </v-col>
    </v-row>

    <v-row>
        <v-col>
            <v-sheet class="rounded-lg pl-4 pt-3 pr-4" elevation="4">
                <v-row align="center" class="fill-height">
                    <v-col>
                        <!------title and headers------->
                        <v-row>
                            <v-col class="text-subtitle-1" cols="3">
                                {{ translate("examDetail.info.url") }}
                            </v-col>

                            <v-col class="text-subtitle-1" cols="3">
                                {{ translate("examDetail.info.start") }}
                            </v-col>

                            <v-col class="text-subtitle-1" cols="3">
                                {{ translate("examDetail.info.end") }}
                            </v-col>
                            <v-spacer></v-spacer>

                            <v-col class="text-subtitle-1" cols="2">
                                {{ translate("examDetail.info.typeStatus") }}
                            </v-col>
                        </v-row>

                        <!------url and values------->
                        <v-row>
                            <!------url------->
                            <v-col
                                class="text-h7 text-decoration-underline"
                                cols="3"
                            >
                                <a
                                    :href="examStore.selectedExam?.startURL"
                                    target="_blank"
                                >
                                    {{ examStore.selectedExam?.startURL }}
                                </a>
                            </v-col>

                            <!------start time------->
                            <v-col
                                class="primary-text-color text-h6 font-weight-bold"
                                cols="3"
                            >
                                {{
                                    timeUtils.formatIsoToReadableDateTime(
                                        examStore.selectedExam?.quizStartTime,
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
                                        examStore.selectedExam?.quizEndTime ==
                                            null || ''
                                    "
                                >
                                    -
                                </template>
                                <template v-else>
                                    {{
                                        timeUtils.formatIsoToReadableDateTime(
                                            examStore.selectedExam?.quizEndTime,
                                        )
                                    }}
                                </template>
                            </v-col>
                            <v-spacer></v-spacer>

                            <!------exam type & status------->
                            <v-col cols="2">
                                <v-chip
                                    class="mr-1"
                                    size="small"
                                    variant="tonal"
                                >
                                    {{
                                        translate(
                                            generalUtils.findEnumValue(
                                                ExamTypeEnum,
                                                examStore.selectedExam?.type,
                                            ),
                                        )
                                    }}
                                </v-chip>
                                <v-chip
                                    :color="
                                        generalUtils.getExamStatusFilterColor(
                                            generalUtils.findEnumValue(
                                                ExamStatusEnum,
                                                examStore.selectedExam?.status,
                                            ),
                                        )
                                    "
                                    size="small"
                                    variant="tonal"
                                >
                                    {{
                                        translate(
                                            generalUtils.findEnumValue(
                                                ExamStatusEnum,
                                                examStore.selectedExam?.status,
                                            ),
                                        )
                                    }}
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
import { useExamStore } from "@/stores/seb-server/examStore";
import * as constants from "@/utils/constants";
import * as timeUtils from "@/utils/timeUtils";
import * as generalUtils from "@/utils/generalUtils";
import {
    ExamStatusEnum,
    ExamTypeEnum,
} from "@/models/seb-server/examFiltersEnum";
import { useI18n } from "vue-i18n";
import { translate } from "@/utils/generalUtils";
import { navigateTo } from "@/router/navigation";

// i18n
const i18n = useI18n();

// stores
const examStore = useExamStore();
</script>

<style scoped></style>
