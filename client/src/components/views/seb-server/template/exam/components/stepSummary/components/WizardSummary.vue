<template>
    <div class="d-flex flex-column ga-4">
        <SummarySection
            v-for="section in sections"
            :key="section.label"
            :section="section"
        />
    </div>
</template>
<script setup lang="ts">
import SummarySection from "@/components/views/seb-server/template/exam/components/stepSummary/components/SummarySection.vue";
import { SummarySectionData } from "@/components/views/seb-server/template/exam/components/stepSummary/components/types";

defineProps<{
    sections: SummarySectionData[];
}>();
</script>
