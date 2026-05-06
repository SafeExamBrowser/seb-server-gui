<template>
    <h2
        class="primary-text-color text-h4 font-weight-bold"
        :data-testid="dataTestId"
    >
        {{ name }}
    </h2>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        name: string;
        dataTestId?: string;
    }>(),
    { dataTestId: undefined },
);
</script>
