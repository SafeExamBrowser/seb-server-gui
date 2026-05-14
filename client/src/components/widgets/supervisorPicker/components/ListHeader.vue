<template>
    <h4 class="text-body-large font-weight-medium flex-grow-0 flex-shrink-0">
        {{ label }}
    </h4>
</template>

<script setup lang="ts">
defineProps<{
    label: string;
}>();
</script>
