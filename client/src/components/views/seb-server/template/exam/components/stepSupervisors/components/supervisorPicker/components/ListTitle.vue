<template>
    <h4 class="text-subtitle-1 font-weight-medium">
        {{ label }}
    </h4>
</template>

<script setup lang="ts">
defineProps<{
    label: string;
}>();
</script>
