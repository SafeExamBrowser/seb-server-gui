<template>
    <v-btn
        class="ml-2"
        color="primary"
        data-testid="search-button"
        rounded="sm"
        variant="flat"
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
