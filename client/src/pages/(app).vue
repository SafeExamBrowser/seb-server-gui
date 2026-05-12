<script setup lang="ts">
import ContainerLayout from "../components/layout/container/ContainerLayout.vue";

// `(app)` is the route group that requires authentication. Every nested
// route inherits this meta — guards.ts only has to look at `to.meta`.
definePage({
    meta: {
        requiresAuth: true,
    },
});
</script>

<template>
    <ContainerLayout />
</template>
