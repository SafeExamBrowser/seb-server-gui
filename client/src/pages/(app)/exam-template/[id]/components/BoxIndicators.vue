<template>
    <ExamTemplateBox :title="$t('examTemplateDetail.boxes.indicators.title')">
        <LoadingFallbackComponent :loading="loading" :errors="errors">
            <IndicatorsTable :deps="tableDeps" />
        </LoadingFallbackComponent>
    </ExamTemplateBox>
</template>

<script setup lang="ts">
import ExamTemplateBox from "./ExamTemplateBox.vue";
import IndicatorsTable from "@/components/widgets/indicatorsTable/IndicatorsTable.vue";
import LoadingFallbackComponent from "@/components/widgets/loadingFallbackComponent/LoadingFallbackComponent.vue";
import { IndicatorsTableDeps } from "@/components/widgets/indicatorsTable/types.ts";
import { useIndicatorTemplates } from "@/pages/(app)/exam-template/[id]/composables/api/useIndicatorTemplates.ts";

const { examTemplateId } = defineProps<{ examTemplateId: number }>();

const { indicators, loading, errors, createItem, updateItem, deleteItem } =
    useIndicatorTemplates(examTemplateId);

const tableDeps: IndicatorsTableDeps = {
    indicators,
    createItem,
    updateItem,
    deleteItem,
};
</script>
