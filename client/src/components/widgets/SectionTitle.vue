<template>
    <h3 class="text-h6 font-weight-bold">
        {{ name }}
    </h3>
</template>

<script setup lang="ts">
defineProps<{
    name: string;
}>();
</script>
