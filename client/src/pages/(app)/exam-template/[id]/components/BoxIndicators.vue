<template>
    <ExamTemplateBox :title="$t('examTemplateDetail.boxes.indicators.title')">
        <IndicatorsTable :deps="tableDeps" />
    </ExamTemplateBox>
</template>

<script setup lang="ts">
import ExamTemplateBox from "./ExamTemplateBox.vue";
import IndicatorsTable from "@/components/widgets/indicatorsTable/IndicatorsTable.vue";
import { IndicatorExisting } from "@/models/seb-server/examTemplate.ts";
import { IndicatorsTableDeps } from "@/components/widgets/indicatorsTable/types.ts";
import { useIndicatorTemplates } from "@/pages/(app)/exam-template/[id]/composables/api/useIndicatorTemplates.ts";

const { examTemplateId, indicators: initialIndicators } = defineProps<{
    examTemplateId: number;
    indicators: IndicatorExisting[];
}>();

const { indicators, createItem, updateItem, deleteItem } =
    useIndicatorTemplates(examTemplateId, initialIndicators);

const tableDeps: IndicatorsTableDeps = {
    indicators,
    createItem,
    updateItem,
    deleteItem,
};
</script>
