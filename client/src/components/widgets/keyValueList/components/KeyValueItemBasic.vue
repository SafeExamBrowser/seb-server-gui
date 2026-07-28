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
                    :aria-label="
                        item.value.value
                            ? $t('general.true')
                            : $t('general.false')
                    "
                    aria-hidden="false"
                    role="img"
                ></v-icon>
            </template>
            <template v-else-if="item.value.type === 'string'">
                {{ item.value.value }}
            </template>
            <template v-else-if="item.value.type === 'link'">
                <a
                    v-if="item.value.value"
                    :href="item.value.value"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-primary"
                >
                    {{ item.value.value }}
                </a>
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
            <template v-else-if="item.value.type === 'password'">
                <span class="d-inline-flex align-center ga-2">
                    <span>{{
                        passwordVisible
                            ? item.value.value
                            : "•".repeat(Math.min(item.value.value.length, 12))
                    }}</span>
                    <v-btn
                        v-if="item.value.value.length > 0"
                        :icon="passwordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                        density="comfortable"
                        size="small"
                        variant="text"
                        :aria-label="
                            passwordVisible
                                ? $t('general.hidePassword')
                                : $t('general.showPassword')
                        "
                        @click="passwordVisible = !passwordVisible"
                    />
                </span>
            </template>
        </span>
    </div>
</template>
<script setup lang="ts">
import { ref } from "vue";

import ChipThreshold from "@/components/widgets/chipThreshold/ChipThreshold.vue";
import { KeyValueItem } from "@/components/widgets/keyValueList/types.ts";

defineProps<{
    item: KeyValueItem & { type: "basic" };
    isFirst: boolean;
}>();

const passwordVisible = ref(false);
</script>
