<template>
    <div>
        <SectionSubtitle :name="section.label" />
        <div class="rounded-lg mt-2 pa-4 bg-surface-container-low">
            <KeyValueList
                v-if="section.items.length > 0"
                :items="section.items"
            />
            <template v-else>
                {{ $t("createTemplateExam.steps.summary.emptyValue") }}
            </template>
        </div>
    </div>
</template>
<script setup lang="ts">
import KeyValueList from "@/components/widgets/keyValueList/KeyValueList.vue";
import SectionSubtitle from "@/components/widgets/SectionSubtitle.vue";
import { SummarySectionData } from "@/components/widgets/wizardSummary/types";

defineProps<{
    section: SummarySectionData;
}>();
</script>
