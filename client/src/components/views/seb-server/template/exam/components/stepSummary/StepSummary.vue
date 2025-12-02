<template>
    <StepItem
        :title="$t('createTemplateExam.steps.summary.title')"
        :subtitle="$t('createTemplateExam.steps.summary.subtitle')"
    >
        <SummarySections :sections="summarySections" />
    </StepItem>
</template>
<script setup lang="ts">
import StepItem from "@/components/widgets/stepItem/StepItem.vue";
import { useSummary } from "@/components/views/seb-server/template/exam/components/stepSummary/composables/useSummary";
import SummarySections from "@/components/views/seb-server/template/exam/components/stepSummary/components/SummarySections.vue";

const summarySections = useSummary();
</script>
