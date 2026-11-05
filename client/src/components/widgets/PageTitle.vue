<template>
    <h1 class="text-headline-large font-weight-bold" :data-testid="dataTestId">
        {{ name }}
    </h1>
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
