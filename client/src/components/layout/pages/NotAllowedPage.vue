<template>
    <ErrorState
        icon="mdi-lock-outline"
        headline="403"
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
