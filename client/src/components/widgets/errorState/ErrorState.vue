<template>
    <v-empty-state
        class="fill-height"
        :icon="icon"
        :headline="headline"
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
import { VBtn, VEmptyState } from "vuetify/components";

import type { ErrorStateBackLink } from "./types.ts";

defineProps<{
    icon: string;
    headline: string;
    message: string;
    backLink?: ErrorStateBackLink;
}>();
</script>
