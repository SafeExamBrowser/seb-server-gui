<template>
    <v-card elevation="2" rounded="lg">
        <v-card-title v-if="title">
            <SectionSubtitle :name="title" />
        </v-card-title>
        <v-card-text>
            <slot />
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import SectionSubtitle from "@/components/widgets/SectionSubtitle.vue";

defineProps<{
    title?: string;
}>();
</script>
