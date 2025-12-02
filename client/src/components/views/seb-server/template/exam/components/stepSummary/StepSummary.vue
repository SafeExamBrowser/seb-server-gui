<template>
    <StepItem
        :title="$t('createTemplateExam.steps.summary.title')"
        :subtitle="$t('createTemplateExam.steps.summary.subtitle')"
    >
        <SummaryBox
            v-for="summaryBox in summary"
            :key="summaryBox.label"
            :summary-box="summaryBox"
        />
    </StepItem>
</template>
<script setup lang="ts">
import StepItem from "@/components/widgets/stepItem/StepItem.vue";
import SummaryBox from "@/components/views/seb-server/template/exam/components/stepSummary/components/SummaryBox.vue";
import { useSummary } from "@/components/views/seb-server/template/exam/components/stepSummary/composables/useSummary";

const summary = useSummary();
</script>
