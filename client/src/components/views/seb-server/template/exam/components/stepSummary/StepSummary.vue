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
import StepItem from "@/components/widgets/stepItem/StepItem.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { useSummary } from "@/components/views/seb-server/template/exam/components/stepSummary/composables/useSummary";
import WizardSummary from "@/components/widgets/wizardSummary/WizardSummary.vue";

const { summarySections, loading, errors } = useSummary();
</script>
