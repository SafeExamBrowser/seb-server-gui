<template>
    <div>
        <h1>{{ summaryBox.label }}</h1>
        <div v-for="item in summaryBox.items" :key="item.label">
            <b>{{ item.label }}</b>
            <p>{{ item.value }}</p>
        </div>
    </div>
</template>
<script setup lang="ts">
import { SummaryBox } from "@/components/views/seb-server/template/exam/components/stepSummary/components/types";

defineProps<{
    summaryBox: SummaryBox;
}>();
</script>
