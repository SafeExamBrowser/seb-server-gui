<template>
    <div class="d-flex flex-column pa-4">
        <div class="flex-grow-0 flex-shrink-0 mb-1">
            <SectionTitle :title="title" />
        </div>
        <div class="flex-grow-0 flex-shrink-0 mb-8 text-body-2">
            {{ subtitle }}
        </div>
        <div class="flex-grow-1 flex-shrink-1">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    title: string;
    subtitle: string;
}>();
</script>
