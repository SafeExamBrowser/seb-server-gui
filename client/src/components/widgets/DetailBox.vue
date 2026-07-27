<template>
    <v-card border elevation="1" rounded="lg" class="flex-grow-1">
        <v-card-title v-if="title" class="pb-0">
            <div class="d-flex align-center ga-2 pt-2 pb-3 border-b-md">
                <SectionSubtitle :name="title" />
                <v-spacer />
                <slot name="action" />
            </div>
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
