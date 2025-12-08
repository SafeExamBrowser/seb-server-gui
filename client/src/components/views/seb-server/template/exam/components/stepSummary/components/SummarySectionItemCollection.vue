<template>
    <div :class="{ 'border-t mt-4 pt-4': !isFirst }">
        <template v-for="(subItem, index) in item.items" :key="subItem.label">
            <SummarySectionItemBasic :item="subItem" :is-first="index === 0" />
        </template>
    </div>
</template>
<script setup lang="ts">
import SummarySectionItemBasic from "@/components/views/seb-server/template/exam/components/stepSummary/components/SummarySectionItemBasic.vue";
import { SummarySectionItem } from "@/components/views/seb-server/template/exam/components/stepSummary/components/types";

defineProps<{
    item: SummarySectionItem & { type: "collection" };
    isFirst: boolean;
}>();
</script>
