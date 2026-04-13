<template>
    <div>
        <template v-if="options.length > 0">
            <div class="text-caption text-medium-emphasis mb-1">
                {{ title }}
            </div>
            <div class="d-flex flex-wrap ga-1">
                <FilterChip
                    v-for="option in options"
                    :key="option.value"
                    :label="option.label"
                    :active="modelValue === option.value"
                    :color="option.color"
                    @toggle="toggle(option.value)"
                />
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
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

function toggle(value: string) {
    emit("update:modelValue", props.modelValue === value ? null : value);
}
</script>
