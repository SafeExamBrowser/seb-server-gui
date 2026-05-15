<template>
    <div class="pa-4">
        <div class="text-primary text-title-large font-weight-bold mb-2">
            {{ quiz.quiz_name }}
        </div>
        <v-row no-gutters>
            <v-col cols="12" md="6">
                <div class="text-body-medium">
                    {{ $t("createExam.steps.quiz.preview.start") }}
                </div>
                <div class="text-primary text-body-large font-weight-medium">
                    {{ formatIsoToReadableDateTime(quiz.quiz_start_time) }}
                </div>
            </v-col>
            <v-col cols="12" md="6">
                <div class="text-body-medium">
                    {{ $t("createExam.steps.quiz.preview.end") }}
                </div>
                <div class="text-primary text-body-large font-weight-medium">
                    {{
                        quiz.quiz_end_time
                            ? formatIsoToReadableDateTime(quiz.quiz_end_time)
                            : "—"
                    }}
                </div>
            </v-col>
        </v-row>
        <v-row v-if="quiz.quiz_start_url" no-gutters class="mt-2">
            <v-col>
                <div class="text-body-medium">
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
            </v-col>
        </v-row>
    </div>
</template>

<script setup lang="ts">
import { Quiz } from "@/models/seb-server/quiz.ts";
import { formatIsoToReadableDateTime } from "@/utils/timeUtils.ts";

defineProps<{
    quiz: Quiz;
}>();
</script>
