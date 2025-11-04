<template>
    <h4
        class="text-subtitle-1 font-weight-medium flex-grow-0 flex-shrink-0 mb-2"
    >
        {{ label }}
    </h4>
</template>

<script setup lang="ts">
defineProps<{
    label: string;
}>();
</script>
