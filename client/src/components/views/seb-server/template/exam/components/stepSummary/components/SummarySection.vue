<template>
    <div>
        <SectionSubtitle :name="section.label" />
        <div class="rounded-lg mt-2 pa-4 bg-grey-lighten-5">
            <template v-for="(item, index) in section.items" :key="item.key">
                <SummarySectionItemBasic
                    v-if="item.type === 'basic'"
                    :item="item"
                />
                <SummarySectionItemCollection
                    v-if="item.type === 'collection'"
                    :item="item"
                    :is-first="index === 0"
                />
            </template>
        </div>
    </div>
</template>
<script setup lang="ts">
import SummarySectionItemBasic from "@/components/views/seb-server/template/exam/components/stepSummary/components/SummarySectionItemBasic.vue";
import SummarySectionItemCollection from "@/components/views/seb-server/template/exam/components/stepSummary/components/SummarySectionItemCollection.vue";
import { SummarySectionData } from "@/components/views/seb-server/template/exam/components/stepSummary/components/types";
import SectionSubtitle from "@/components/widgets/SectionSubtitle.vue";

defineProps<{
    section: SummarySectionData;
}>();
</script>
