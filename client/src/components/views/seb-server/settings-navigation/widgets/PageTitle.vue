<template>
    <h2 class="text-white text-h5 font-weight-black ml-10 mt-5">
        {{ name }}
    </h2>
</template>

<script setup lang="ts">
defineProps<{
    name: string;
}>();
</script>
