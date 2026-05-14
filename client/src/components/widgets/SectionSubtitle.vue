<template>
    <h4 class="text-primary text-h6">
        {{ name }}
    </h4>
</template>

<script setup lang="ts">
defineProps<{
    name: string;
}>();
</script>
