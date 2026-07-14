<template>
    <v-empty-state
        class="fill-height"
        icon="mdi-magnify-remove-outline"
        headline="404"
        :title="message"
    >
        <template v-if="backLink" #actions>
            <v-btn
                class="rounded"
                color="primary"
                rounded="sm"
                variant="flat"
                :active="false"
                :to="backLink.to"
            >
                {{ backLink.label }}
            </v-btn>
        </template>
    </v-empty-state>
</template>

<script setup lang="ts">
import type { RouteLocationAsRelative } from "vue-router";

defineProps<{
    message: string;
    backLink?: {
        label: string;
        to: RouteLocationAsRelative;
    };
}>();
</script>
