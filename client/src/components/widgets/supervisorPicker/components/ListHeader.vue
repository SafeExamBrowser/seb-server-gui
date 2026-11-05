<template>
    <h3
        class="text-body-large font-weight-medium flex-grow-0 flex-shrink-0 my-5"
    >
        {{ label }}
    </h3>
</template>

<script setup lang="ts">
defineProps<{
    label: string;
}>();
</script>
