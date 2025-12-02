<template>
    <div>
        <SectionSubtitle :name="section.label" />
        <div class="rounded-lg mt-2 pa-4 bg-grey-lighten-5">
            <div v-for="item in section.items" :key="item.label">
                <b>{{ item.label }}</b>
                <p>{{ item.value }}</p>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { SummarySectionData } from "@/components/views/seb-server/template/exam/components/stepSummary/components/types";
import SectionSubtitle from "@/components/widgets/SectionSubtitle.vue";

defineProps<{
    section: SummarySectionData;
}>();
</script>
