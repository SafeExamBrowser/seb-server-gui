<template>
    <component :is="`h${level}`" class="text-primary text-title-large">
        {{ name }}
    </component>
</template>

<script setup lang="ts">
import type { HeadingLevel } from "@/components/widgets/types";

withDefaults(
    defineProps<{
        name: string;
        level?: HeadingLevel;
    }>(),
    { level: 2 },
);
</script>
