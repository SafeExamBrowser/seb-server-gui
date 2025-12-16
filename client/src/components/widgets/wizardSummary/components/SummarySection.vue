<template>
    <div>
        <SectionSubtitle :name="section.label" />
        <div class="rounded-lg mt-2 pa-4 bg-grey-lighten-5">
            <template v-for="(item, index) in section.items" :key="item.key">
                <SummarySectionItemBasic
                    v-if="item.type === 'basic'"
                    :item="item"
                    :is-first="index === 0"
                />
                <SummarySectionItemCollection
                    v-if="item.type === 'collection'"
                    :item="item"
                    :is-first="index === 0"
                />
            </template>
            <template v-if="section.items.length === 0">
                {{ $t("createTemplateExam.steps.summary.emptyValue") }}
            </template>
        </div>
    </div>
</template>
<script setup lang="ts">
import SummarySectionItemBasic from "./SummarySectionItemBasic.vue";
import SummarySectionItemCollection from "./SummarySectionItemCollection.vue";
import { SummarySectionData } from "@/components/widgets/wizardSummary/types";
import SectionSubtitle from "@/components/widgets/SectionSubtitle.vue";

defineProps<{
    section: SummarySectionData;
}>();
</script>
