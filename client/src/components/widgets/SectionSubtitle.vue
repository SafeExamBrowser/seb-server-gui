<template>
    <h4 class="text-primary text-title-large">
        {{ name }}
    </h4>
</template>

<script setup lang="ts">
defineProps<{
    name: string;
}>();
</script>
