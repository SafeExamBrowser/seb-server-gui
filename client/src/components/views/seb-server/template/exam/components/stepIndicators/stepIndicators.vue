<template>
    <StepItem
        :title="$t('createTemplateExam.steps.indicators.title')"
        :subtitle="$t('createTemplateExam.steps.indicators.subtitle')"
    >
        <IndicatorTable />
    </StepItem>
</template>

<script setup lang="ts">
import IndicatorTable from "@/components/views/seb-server/template/exam/components/stepIndicators/components/indicatorTable/IndicatorTable.vue";
</script>
