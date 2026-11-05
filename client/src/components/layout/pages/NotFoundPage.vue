<template>
    <ErrorState
        icon="mdi-magnify-remove-outline"
        headline="404"
        :heading-level="1"
        :message="message"
        :back-link="backLink"
    />
</template>

<script setup lang="ts">
import ErrorState from "@/components/widgets/errorState/ErrorState.vue";
import type { ErrorStateBackLink } from "@/components/widgets/errorState/types.ts";

defineProps<{
    message: string;
    backLink?: ErrorStateBackLink;
}>();
</script>
