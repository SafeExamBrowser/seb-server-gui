<template>
    <div class="text-headline-large font-weight-bold" :data-testid="dataTestId">
        {{ name }}
    </div>
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
