<template>
    <StepItem
        :title="$t('createTemplateExam.steps.summary.title')"
        :subtitle="$t('createTemplateExam.steps.summary.subtitle')"
    >
        <LoadingFallbackComponent :loading="loading" :errors="errors">
            <WizardSummary :sections="summarySections" />
        </LoadingFallbackComponent>
    </StepItem>
</template>

<script setup lang="ts">
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import StepItem from "@/components/widgets/stepItem/StepItem.vue";
import WizardSummary from "@/components/widgets/wizardSummary/WizardSummary.vue";
import { useSummary } from "@/pages/(app)/exam-template/create/components/stepSummary/composables/useSummary.ts";

const { summarySections, loading, errors } = useSummary();
</script>
