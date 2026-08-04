<template>
    <v-chip variant="flat" :color="threshold.color" density="compact">
        {{ threshold.value }}% / {{ threshold.color }}</v-chip
    >
</template>

<script setup lang="ts">
import { VChip } from "vuetify/components";

import { Threshold } from "@/models/seb-server/examTemplate";

defineProps<{
    threshold: Threshold;
}>();
</script>
