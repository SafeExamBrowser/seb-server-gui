<template>
    <div v-if="options.length > 0" :data-testid="`${dataTestId}-section`">
        <div class="d-flex align-center ga-2 mb-2">
            <span
                class="text-body-small text-medium-emphasis text-uppercase font-weight-medium"
            >
                {{ title }}
            </span>
        </div>
        <div class="d-flex flex-wrap ga-2">
            <FilterChip
                v-for="option in options"
                :key="option.value"
                :label="option.label"
                :active="modelValue === option.value"
                :color="option.color"
                :data-test-id="`${dataTestId}-chip-${option.value}`"
                @toggle="toggle(option.value)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import FilterChip from "./FilterChip.vue";
import type { FilterOption } from "./filterTypes.ts";

const props = defineProps<{
    title: string;
    options: FilterOption[];
    modelValue: string | null;
    dataTestId: string;
}>();

const emit = defineEmits<{
    "update:modelValue": [value: string | null];
}>();

function toggle(value: string) {
    emit("update:modelValue", props.modelValue === value ? null : value);
}
</script>
