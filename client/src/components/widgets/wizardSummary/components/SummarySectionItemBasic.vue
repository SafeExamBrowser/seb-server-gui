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
                <div class="d-flex flex-wrap ga-1">
                    <template
                        v-for="threshold in item.value.value"
                        :key="threshold.value"
                    >
                        <ChipThreshold :threshold="threshold" />
                    </template>
                </div>
            </template>
        </span>
    </div>
</template>
<script setup lang="ts">
import { SummarySectionItem } from "@/components/widgets/wizardSummary/types";
import ChipThreshold from "@/components/widgets/chipThreshold/ChipThreshold.vue";

defineProps<{
    item: SummarySectionItem & { type: "basic" };
    isFirst: boolean;
}>();
</script>
