<template>
    <!-- :key forces a remount when toggling between empty/filled — VDateInput's clear-state has a Vuetify-labs bug where the input retains the prior value otherwise. -->
    <VDateInput
        :key="modelValue === null ? 'empty' : 'filled'"
        :model-value="modelValue"
        append-inner-icon="mdi-calendar"
        display-date-format="dd.MM.yyyy"
        :density="density"
        hide-details
        input-format="dd.MM.yyyy"
        placeholder="dd.MM.yyyy"
        prepend-icon=""
        variant="outlined"
        :data-testid="dataTestId"
        @update:model-value="emit('update:modelValue', $event ?? null)"
    />
</template>

<script setup lang="ts">
import { VDateInput } from "vuetify/components";

withDefaults(
    defineProps<{
        modelValue: Date | null;
        density?: "default" | "comfortable" | "compact";
        dataTestId?: string;
    }>(),
    { density: "comfortable", dataTestId: undefined },
);

const emit = defineEmits<{
    "update:modelValue": [value: Date | null];
}>();
</script>
