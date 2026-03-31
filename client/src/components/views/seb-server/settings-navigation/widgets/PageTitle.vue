<template>
    <h2 class="text-primary text-h5 font-weight-bold mx-6 mt-6">
        {{ name }}
    </h2>
</template>

<script setup lang="ts">
defineProps<{
    name: string;
}>();
</script>
