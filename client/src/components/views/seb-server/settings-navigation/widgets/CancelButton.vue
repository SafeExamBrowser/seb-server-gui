<template>
    <v-btn
        color="black"
        data-testid="cancel-button"
        rounded="sm"
        variant="outlined"
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
