<template>
    <DetailBox>
        <IndicatorsTable :deps="tableDeps" />
    </DetailBox>
</template>

<script setup lang="ts">
import { computed } from "vue";

import DetailBox from "@/components/widgets/DetailBox.vue";
import IndicatorsTable from "@/components/widgets/indicatorsTable/IndicatorsTable.vue";
import { IndicatorsTableDeps } from "@/components/widgets/indicatorsTable/types.ts";
import { IndicatorExisting } from "@/models/examTemplate.ts";
import { useIndicators } from "@/pages/(app)/exam-template/[id]/composables/api/useIndicators.ts";

const props = defineProps<{
    examTemplateId: number;
    indicators: IndicatorExisting[];
}>();

const { indicators, createItem, updateItem, deleteItem } = useIndicators(
    props.examTemplateId,
    computed(() => props.indicators),
);

const tableDeps: IndicatorsTableDeps = {
    indicators,
    createItem,
    updateItem,
    deleteItem,
    confirmDelete: true,
};
</script>
