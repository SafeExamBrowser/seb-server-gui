<template>
    <h2 class="primary-text-color text-h4 font-weight-bold">
        {{ name }}
    </h2>
</template>

<script setup lang="ts">
defineProps<{
    name: string;
}>();
</script>
