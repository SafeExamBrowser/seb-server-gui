<template>
    <div>
        <b>{{ item.label }}</b>
        <span>{{ item.value }}</span>
    </div>
</template>
<script setup lang="ts">
import { SummarySectionItem } from "@/components/views/seb-server/template/exam/components/stepSummary/components/types";

defineProps<{
    item: SummarySectionItem & { type: "basic" };
}>();
</script>
