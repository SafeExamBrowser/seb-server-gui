<template>
    <div class="d-flex align-start ga-3 pa-4">
        <v-icon
            icon="mdi-check-circle-outline"
            color="primary"
            size="26"
            class="mt-1"
        />
        <div class="flex-grow-1">
            <div
                class="d-flex align-center ga-1 text-body-small text-medium-emphasis text-uppercase font-weight-bold mb-1"
            >
                <v-icon icon="mdi-magnify" size="14" />
                {{ $t("createExam.steps.quiz.preview.selectedExam") }}
            </div>
            <div class="text-primary text-title-medium font-weight-bold mb-3">
                {{ quiz.quiz_name }}
            </div>
            <div class="d-flex flex-wrap ga-8">
                <div>
                    <div class="text-body-small text-medium-emphasis">
                        {{ $t("createExam.steps.quiz.preview.start") }}
                    </div>
                    <div
                        class="text-primary text-body-medium font-weight-medium"
                    >
                        {{ formatIsoToReadableDateTime(quiz.quiz_start_time) }}
                    </div>
                </div>
                <div>
                    <div class="text-body-small text-medium-emphasis">
                        {{ $t("createExam.steps.quiz.preview.end") }}
                    </div>
                    <div
                        class="text-primary text-body-medium font-weight-medium"
                    >
                        {{
                            quiz.quiz_end_time
                                ? formatIsoToReadableDateTime(
                                      quiz.quiz_end_time,
                                  )
                                : "—"
                        }}
                    </div>
                </div>
                <div v-if="quiz.quiz_start_url">
                    <div class="text-body-small text-medium-emphasis">
                        {{ $t("createExam.steps.quiz.preview.startUrl") }}
                    </div>
                    <a
                        class="text-primary text-body-medium text-decoration-underline"
                        :href="quiz.quiz_start_url"
                        target="_blank"
                        rel="noopener"
                    >
                        {{ quiz.quiz_start_url }}
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Quiz } from "@/models/seb-server/quiz.ts";
import { formatIsoToReadableDateTime } from "@/utils/timeUtils.ts";

defineProps<{
    quiz: Quiz;
}>();
</script>
