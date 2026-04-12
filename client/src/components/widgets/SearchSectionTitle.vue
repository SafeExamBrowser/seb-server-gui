<template>
    <div
        :class="[
            'text-caption',
            'text-grey-darken-1',
            'mb-1',
            { 'font-weight-medium': bold },
        ]"
    >
        {{ translate(text) }}
    </div>
</template>

<script setup lang="ts">
import { translate } from "@/utils/generalUtils.ts";

defineProps<{
    text: string;
    bold?: boolean;
}>();
</script>
