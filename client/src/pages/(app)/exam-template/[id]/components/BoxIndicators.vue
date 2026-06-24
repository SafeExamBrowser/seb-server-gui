<template>
    <DetailBox>
        <IndicatorsTable :deps="tableDeps" />
    </DetailBox>
</template>

<script setup lang="ts">
import DetailBox from "@/components/widgets/DetailBox.vue";
import IndicatorsTable from "@/components/widgets/indicatorsTable/IndicatorsTable.vue";
import { IndicatorExisting } from "@/models/seb-server/examTemplate.ts";
import { IndicatorsTableDeps } from "@/components/widgets/indicatorsTable/types.ts";
import { useIndicators } from "@/pages/(app)/exam-template/[id]/composables/api/useIndicators.ts";

const { examTemplateId, indicators: initialIndicators } = defineProps<{
    examTemplateId: number;
    indicators: IndicatorExisting[];
}>();

const { indicators, createItem, updateItem, deleteItem } = useIndicators(
    examTemplateId,
    initialIndicators,
);

const tableDeps: IndicatorsTableDeps = {
    indicators,
    createItem,
    updateItem,
    deleteItem,
    confirmDelete: true,
};
</script>
