<template>
    <div class="d-flex flex-column pa-4 fill-height">
        <div class="flex-grow-0 flex-shrink-0 mb-1">
            <SectionTitle :name="title" />
        </div>
        <div class="flex-grow-0 flex-shrink-0 mb-8 text-body-2">
            {{ subtitle }}
        </div>
        <div
            class="flex-grow-1 flex-shrink-1 fill-height"
            :class="{ 'overflow-y-auto': manualScrollManagement }"
        >
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import SectionTitle from "@/components/widgets/SectionTitle.vue";

withDefaults(
    defineProps<{
        title: string;
        subtitle: string;

        /**
         * If true:
         * - The scroll can be managed by a child component
         * - With this, you can make the content scrollable without scrolling the title/subtitle
         * If false:
         * - The scroll is managed by the StepItem (default)
         * - This scrolls the title/subtitle together with the content
         */
        manualScrollManagement?: boolean;
    }>(),
    {
        manualScrollManagement: false,
    },
);
</script>
