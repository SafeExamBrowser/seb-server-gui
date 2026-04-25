<template>
    <div v-if="options.length > 0">
        <div class="d-flex align-center ga-2 mb-2">
            <span
                class="text-caption text-medium-emphasis text-uppercase font-weight-medium"
            >
                {{ title }}
            </span>
            <v-chip
                v-if="selectedCount > 0"
                size="x-small"
                color="primary"
                variant="flat"
            >
                {{ selectedCount }}
            </v-chip>
        </div>
        <div class="d-flex flex-wrap ga-2">
            <FilterChip
                v-for="option in options"
                :key="option.value"
                :label="option.label"
                :active="modelValue === option.value"
                :color="option.color"
                @toggle="toggle(option.value)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FilterChip from "./FilterChip.vue";
import type { FilterOption } from "./filterTypes.ts";

const props = defineProps<{
    title: string;
    options: FilterOption[];
    modelValue: string | null;
}>();

const emit = defineEmits<{
    "update:modelValue": [value: string | null];
}>();

const selectedCount = computed(() => (props.modelValue ? 1 : 0));

function toggle(value: string) {
    emit("update:modelValue", props.modelValue === value ? null : value);
}
</script>
