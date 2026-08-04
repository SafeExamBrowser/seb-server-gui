<template>
    <v-btn
        class="rounded"
        data-testid="cancel-button"
        rounded="sm"
        variant="outlined"
        @click="emit('click')"
    >
        {{ translate(text) }}
    </v-btn>
</template>

<script setup lang="ts">
import { VBtn } from "vuetify/components";

import { translate } from "@/utils/generalUtils.ts";

defineProps<{
    text: string;
}>();

const emit = defineEmits<{
    click: [];
}>();
</script>
