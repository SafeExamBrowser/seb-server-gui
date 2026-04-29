<template>
    <div class="d-flex flex-column ga-4">
        <FilterSection
            v-for="section in sections"
            :key="section.key"
            :title="section.title"
            :options="section.options"
            :model-value="modelValue[section.key] ?? null"
            @update:model-value="onSectionChange(section.key, $event)"
        />
    </div>
</template>

<script setup lang="ts">
import FilterSection from "./FilterSection.vue";
import type { FilterSectionDef } from "./filterTypes.ts";

const props = defineProps<{
    sections: FilterSectionDef[];
    modelValue: Record<string, string | null>;
}>();

const emit = defineEmits<{
    "update:modelValue": [value: Record<string, string | null>];
}>();

function onSectionChange(key: string, value: string | null) {
    emit("update:modelValue", { ...props.modelValue, [key]: value });
}
</script>
