<template>
    <div class="settings-filters">
        <div
            v-for="filter in visibleFilters"
            :key="filter.key"
            class="settings-filters__group"
        >
            <div class="settings-filters__label">
                {{ filter.title }}
            </div>

            <div class="settings-filters__chips">
                <v-chip
                    v-for="option in filter.options"
                    :key="option.value"
                    class="filter-chip"
                    :class="{
                        'filter-chip-selected':
                            modelValue[filter.key] === option.value,
                    }"
                    size="small"
                    @click="toggleFilter(filter.key, option.value)"
                >
                    {{ option.label }}
                </v-chip>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { SettingsFilterDefinition } from "@/models/types.ts";

const props = defineProps<{
    filters: SettingsFilterDefinition[];
    modelValue: Record<string, string | null>;
}>();

const emit = defineEmits<{
    "update:modelValue": [value: Record<string, string | null>];
}>();

const visibleFilters = computed(() =>
    props.filters.filter((filter) => filter.visible !== false),
);

function toggleFilter(key: string, value: string) {
    emit("update:modelValue", {
        ...props.modelValue,
        [key]: props.modelValue[key] === value ? null : value,
    });
}
</script>

<style scoped>
.settings-filters {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
}

.settings-filters__group {
    min-width: 160px;
}

.settings-filters__label {
    color: #757575;
    font-size: 0.75rem;
    margin-bottom: 0.35rem;
}

.settings-filters__chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
}

.filter-chip {
    padding: 0.25rem 0.7rem;
    background-color: #f0f0f0;
    font-size: 0.75rem;
    font-weight: 500;
    color: #757575;
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
    transition: all 0.2s ease-in-out;
}

.filter-chip-selected {
    background-color: #215caf !important;
    color: white !important;
}
</style>
