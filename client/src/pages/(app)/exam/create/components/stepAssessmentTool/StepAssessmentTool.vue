<template>
    <StepItem
        :title="$t('createExam.steps.assessmentTool.title')"
        :subtitle="$t('createExam.steps.assessmentTool.subtitle')"
    >
        <v-container fluid class="ma-0 pa-0" :max-width="thresholds.sm">
            <LoadingFallbackComponent :loading="loading" :errors="errors">
                <v-select
                    v-model="store.selectedAssessmentToolId"
                    :label="
                        $t('createExam.steps.assessmentTool.fields.tool.label')
                    "
                    :placeholder="
                        $t(
                            'createExam.steps.assessmentTool.fields.tool.placeholder',
                        )
                    "
                    :items="assessmentTools?.content ?? []"
                    item-title="name"
                    item-value="id"
                    variant="outlined"
                />
            </LoadingFallbackComponent>
        </v-container>
    </StepItem>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useDisplay } from "vuetify";

import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import StepItem from "@/components/widgets/stepItem/StepItem.vue";

import { useStepAssessmentToolStore } from "./composables/store/useStepAssessmentToolStore.ts";

const { t } = useI18n();
const { thresholds: thresholdsRef } = useDisplay();
const thresholds = computed(() => thresholdsRef.value);

const store = useStepAssessmentToolStore();
const { assessmentTools, loading, error: errorLoading } = storeToRefs(store);

const errors = computed(() => {
    if (loading.value) {
        return undefined;
    }

    return [
        errorLoading.value ? errorLoading.value : undefined,
        assessmentTools.value && assessmentTools.value.content.length < 1
            ? t("createExam.steps.assessmentTool.noToolsAvailable")
            : undefined,
    ].filter((error) => error !== undefined);
});
</script>
