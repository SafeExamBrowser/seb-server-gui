<template>
    <h2 class="primary-text-color text-h4 font-weight-bold">
        {{ title }}
    </h2>
</template>

<script setup lang="ts">
defineProps<{
    title: string;
}>();
</script>
