<template>
    <v-btn
        :icon="icon"
        color="medium-emphasis"
        variant="text"
        density="compact"
        size="small"
        :title="title"
        :aria-label="title"
        :to="to"
        @click.stop="emit('click')"
    ></v-btn>
</template>

<script setup lang="ts">
import { IconValue } from "vuetify/lib/composables/icons.mjs";
import type { RouteLocationRaw } from "vue-router";

defineProps<{
    icon: IconValue;
    title: string;
    to?: RouteLocationRaw;
}>();

const emit = defineEmits<{
    (e: "click"): void;
}>();
</script>
