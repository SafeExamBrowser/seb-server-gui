<template>
    <VDateInput
        :key="modelValue === null ? 'empty' : 'filled'"
        :model-value="modelValue"
        append-inner-icon="mdi-calendar"
        display-date-format="dd.MM.yyyy"
        density="comfortable"
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

defineProps<{
    modelValue: Date | null;
}>();

const emit = defineEmits<{
    "update:modelValue": [value: Date | null];
}>();
</script>
