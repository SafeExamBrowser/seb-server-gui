<template>
    <div :class="{ 'border-t mt-4 pt-4': !isFirst }">
        <template v-for="(subItem, index) in item.items" :key="subItem.label">
            <SummarySectionItemBasic :item="subItem" :is-first="index === 0" />
        </template>
    </div>
</template>
<script setup lang="ts">
import SummarySectionItemBasic from "./SummarySectionItemBasic.vue";
import { SummarySectionItem } from "@/components/widgets/wizardSummary/types";

defineProps<{
    item: SummarySectionItem & { type: "collection" };
    isFirst: boolean;
}>();
</script>
