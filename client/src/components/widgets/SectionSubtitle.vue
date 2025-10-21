<template>
    <h4 class="primary-text-color text-h6">
        {{ name }}
    </h4>
</template>

<script setup lang="ts">
defineProps<{
    name: string;
}>();
</script>
