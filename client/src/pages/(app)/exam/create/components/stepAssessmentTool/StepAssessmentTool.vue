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
import { computed, watchEffect } from "vue";
import { useDisplay } from "vuetify";
import { useI18n } from "vue-i18n";
import StepItem from "@/components/widgets/stepItem/StepItem.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useAssessmentTools } from "./composables/api/useAssessmentTools.ts";
import { useStepAssessmentToolStore } from "./composables/store/useStepAssessmentToolStore.ts";

const { t } = useI18n();
const { thresholds: thresholdsRef } = useDisplay();
const thresholds = computed(() => thresholdsRef.value);

const store = useStepAssessmentToolStore();
const {
    data: assessmentTools,
    loading,
    error: errorLoading,
} = useAssessmentTools();

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

watchEffect(() => {
    if (
        store.selectedAssessmentToolId === undefined &&
        assessmentTools.value?.content.length === 1
    ) {
        store.selectedAssessmentToolId = assessmentTools.value.content[0].id;
    }
});
</script>
