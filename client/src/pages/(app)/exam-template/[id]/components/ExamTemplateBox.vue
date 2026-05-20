<template>
    <v-card elevation="2" rounded="lg">
        <v-card-title>{{ title }}</v-card-title>
        <v-card-text>
            <slot />
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
defineProps<{
    title: string;
}>();
</script>
