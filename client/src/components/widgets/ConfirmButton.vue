<template>
    <v-btn
        class="rounded"
        color="primary"
        :data-testid="dataTestId ?? 'confirm-button'"
        rounded="sm"
        variant="flat"
        density="default"
        :disabled="disabled"
        @click="emit('click')"
    >
        {{ translate(text) }}
    </v-btn>
</template>

<script setup lang="ts">
import { translate } from "@/utils/generalUtils.ts";

withDefaults(
    defineProps<{
        text: string;
        disabled?: boolean;
        dataTestId?: string;
    }>(),
    { disabled: false, dataTestId: undefined },
);

const emit = defineEmits<{
    click: [];
}>();
</script>
