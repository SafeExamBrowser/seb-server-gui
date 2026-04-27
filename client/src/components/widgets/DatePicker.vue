<template>
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
        @update:model-value="emit('update:modelValue', $event ?? null)"
    />
</template>

<script setup lang="ts">
import { VDateInput } from "vuetify/labs/VDateInput";

withDefaults(
    defineProps<{
        modelValue: Date | null;
        density?: "default" | "comfortable" | "compact";
    }>(),
    { density: "comfortable" },
);

const emit = defineEmits<{
    "update:modelValue": [value: Date | null];
}>();
</script>
