<!-- TODO @alain: use Suspense for this, once it's stable https://vuejs.org/guide/built-ins/suspense.html -->
<template>
    <div v-if="error">
        <!-- TODO @alain: add proper error message -->
        Something went wrong: {{ error }}
    </div>

    <div v-else-if="loading">
        <!-- TODO @alain: add proper spinner / loading animation -->
        Loading...
    </div>

    <slot v-else></slot>
</template>

<script setup lang="ts">
defineProps<{
    loading: boolean;
    error?: string;
}>();
</script>
