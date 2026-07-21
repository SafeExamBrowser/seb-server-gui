<template>
    <StepItem
        :title="$t('createTemplateExam.steps.indicators.title')"
        :subtitle="$t('createTemplateExam.steps.indicators.subtitle')"
    >
        <IndicatorsTable :deps="tableDeps" />
    </StepItem>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";

import IndicatorsTable from "@/components/widgets/indicatorsTable/IndicatorsTable.vue";
import { IndicatorsTableDeps } from "@/components/widgets/indicatorsTable/types.ts";
import StepItem from "@/components/widgets/stepItem/StepItem.vue";
import { useStepIndicatorsStore } from "@/pages/(app)/exam-template/create/components/stepIndicators/composables/store/useStepIndicatorsStore.ts";

const store = useStepIndicatorsStore();
const { indicators } = storeToRefs(store);

const tableDeps: IndicatorsTableDeps = {
    indicators,
    createItem: async (indicator) => store.createIndicator(indicator),
    updateItem: async (indicator) => store.updateIndicator(indicator),
    deleteItem: async (indicator) => store.deleteIndicator(indicator),
};
</script>
