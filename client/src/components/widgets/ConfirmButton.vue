<template>
    <v-btn
        class="rounded"
        color="primary"
        data-testid="confirm-button"
        rounded="sm"
        variant="flat"
        density="default"
        @click="emit('click')"
    >
        {{ translate(text) }}
    </v-btn>
</template>

<script setup lang="ts">
import { translate } from "@/utils/generalUtils.ts";

defineProps<{
    text: string;
}>();

const emit = defineEmits<{
    click: [];
}>();
</script>
