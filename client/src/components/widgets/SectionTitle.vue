<template>
    <h3 class="text-h6 font-weight-bold">
        {{ title }}
    </h3>
</template>

<script setup lang="ts">
defineProps<{
    title: string;
}>();
</script>
