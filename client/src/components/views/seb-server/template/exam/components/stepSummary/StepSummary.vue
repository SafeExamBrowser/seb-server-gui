<template>
    <StepItem
        :title="$t('createTemplateExam.steps.summary.title')"
        :subtitle="$t('createTemplateExam.steps.summary.subtitle')"
    >
        <WizardSummary :sections="summarySections" />
    </StepItem>
</template>
<script setup lang="ts">
import StepItem from "@/components/widgets/stepItem/StepItem.vue";
import { useSummary } from "@/components/views/seb-server/template/exam/components/stepSummary/composables/useSummary";
import WizardSummary from "@/components/views/seb-server/template/exam/components/stepSummary/components/WizardSummary.vue";

const summarySections = useSummary();
</script>
