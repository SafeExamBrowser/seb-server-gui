<template>
    <component :is="`h${level}`" class="text-title-large font-weight-bold">
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
