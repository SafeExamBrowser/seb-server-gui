<template>
    <div
        :class="{
            'd-flex flex-column flex-sm-row ga-2': true,
            'mt-4': !isFirst,
        }"
    >
        <b class="flex-shrink-0 flex-grow-0" style="width: 170px">{{
            item.label
        }}</b>
        <span class="flex-shrink-1 flex-grow-1">
            <template v-if="typeof item.value === 'boolean'">
                <v-icon
                    :icon="item.value ? 'mdi-check' : 'mdi-close'"
                    :title="
                        item.value ? $t('general.true') : $t('general.false')
                    "
                ></v-icon>
            </template>
            <template v-else>
                {{ item.value }}
            </template>
        </span>
    </div>
</template>
<script setup lang="ts">
import { SummarySectionItem } from "@/components/views/seb-server/template/exam/components/stepSummary/components/types";

defineProps<{
    item: SummarySectionItem & { type: "basic" };
    isFirst: boolean;
}>();
</script>
