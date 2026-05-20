<template>
    <div class="text-title-large font-weight-bold">
        {{ name }}
    </div>
</template>

<script setup lang="ts">
defineProps<{
    name: string;
}>();
</script>
