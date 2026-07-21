<!-- TODO @alain: use Suspense for this, once it's stable https://vuejs.org/guide/built-ins/suspense.html -->
<template>
    <div v-if="messages.length > 0">
        <!-- TODO @alain: add proper error message -->
        Something went wrong: {{ messages.join(", ") }}
    </div>

    <div v-else-if="loading">
        <!-- TODO @alain: add proper spinner / loading animation -->
        Loading...
    </div>

    <slot v-else></slot>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { appErrorToMessage } from "@/services/errors/toAppError.ts";
import type { AppError } from "@/services/errors/types.ts";

const props = defineProps<{
    loading: boolean;
    errors?: (string | AppError)[];
}>();

const messages = computed(() =>
    (props.errors ?? []).map((error) =>
        typeof error === "string" ? error : appErrorToMessage(error),
    ),
);
</script>
