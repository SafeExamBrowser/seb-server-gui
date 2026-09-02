<!-- TODO @andrei: use Suspense for this, once it's stable https://vuejs.org/guide/built-ins/suspense.html -->
<template>
    <div
        v-if="messages.length > 0"
        class="h-100 d-flex align-center justify-center"
        :style="{ minHeight: '320px' }"
    >
        <ErrorState
            icon="mdi-alert-circle-outline"
            color="error"
            :message="$t('general.somethingWentWrong')"
            :details="messages.join(', ')"
        />
    </div>

    <div
        v-else-if="loading"
        class="h-100 d-flex flex-column align-center justify-center pa-8 ga-4"
        :style="{ minHeight: '320px' }"
    >
        <v-progress-circular color="primary" indeterminate size="44" />
        <span class="text-body-medium text-medium-emphasis">
            {{ $t("general.loadingText") }}
        </span>
    </div>

    <slot v-else></slot>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { VProgressCircular } from "vuetify/components";

import ErrorState from "@/components/widgets/errorState/ErrorState.vue";
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
