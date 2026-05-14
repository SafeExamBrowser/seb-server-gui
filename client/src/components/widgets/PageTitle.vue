<template>
    <h2
        class="text-primary text-headline-large font-weight-bold"
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
