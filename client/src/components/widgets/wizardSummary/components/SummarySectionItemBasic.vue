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
            <template v-if="item.value.type === 'boolean'">
                <v-icon
                    :icon="item.value.value ? 'mdi-check' : 'mdi-close'"
                    :title="
                        item.value.value
                            ? $t('general.true')
                            : $t('general.false')
                    "
                ></v-icon>
            </template>
            <template v-else-if="item.value.type === 'string'">
                {{ item.value.value }}
            </template>
            <template v-else-if="item.value.type === 'thresholds'">
                <template
                    v-for="threshold in item.value.value"
                    :key="threshold.value"
                >
                    <v-chip
                        variant="flat"
                        :color="`#${threshold.color}`"
                        class="me-1"
                        density="compact"
                    >
                        {{ threshold.value }}% / #{{ threshold.color }}</v-chip
                    >
                </template>
            </template>
        </span>
    </div>
</template>
<script setup lang="ts">
import { SummarySectionItem } from "@/components/widgets/wizardSummary/types";

defineProps<{
    item: SummarySectionItem & { type: "basic" };
    isFirst: boolean;
}>();
</script>
