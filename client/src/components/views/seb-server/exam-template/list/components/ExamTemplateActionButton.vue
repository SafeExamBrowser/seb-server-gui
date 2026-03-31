<template>
    <v-btn
        :icon="icon"
        color="medium-emphasis"
        variant="text"
        density="compact"
        size="small"
        :title="title"
        :aria-label="title"
        @click="emit('click')"
    ></v-btn>
</template>

<script setup lang="ts">
import { ExamTemplate } from "@/models/seb-server/examTemplate";
import { IconValue } from "vuetify/lib/composables/icons.mjs";

defineProps<{
    icon: IconValue;
    item: ExamTemplate;
    title: string;
}>();

const emit = defineEmits<{
    (e: "click"): void;
}>();
</script>
