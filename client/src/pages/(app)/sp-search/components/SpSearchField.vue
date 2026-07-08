<template>
    <div class="mb-3">
        <div
            class="text-body-small text-uppercase font-weight-bold text-medium-emphasis mb-1"
        >
            {{ label }}
        </div>
        <v-text-field
            v-model="model"
            :aria-label="label"
            :placeholder="placeholder"
            density="compact"
            hide-details
            single-line
            variant="outlined"
            :data-testid="dataTestId"
        />
    </div>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        label: string;
        placeholder?: string;
        dataTestId?: string;
    }>(),
    { placeholder: undefined, dataTestId: undefined },
);

const model = defineModel<string>({ required: true });
</script>
