<template>
    <div class="text-primary text-title-large">
        {{ name }}
    </div>
</template>

<script setup lang="ts">
defineProps<{
    name: string;
}>();
</script>
