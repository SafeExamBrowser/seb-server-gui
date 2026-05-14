<template>
    <h3 class="text-title-large font-weight-bold">
        {{ name }}
    </h3>
</template>

<script setup lang="ts">
defineProps<{
    name: string;
}>();
</script>
