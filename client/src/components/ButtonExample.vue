<script setup lang="ts">
defineProps<{ label: string }>();
</script>

<template>
    <button class="px-3 py-2 rounded border">{{ label }}</button>
</template>
