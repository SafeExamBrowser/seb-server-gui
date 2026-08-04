<template>
    <v-chip :color="color || 'grey'" size="small" variant="tonal">
        {{ label }}
    </v-chip>
</template>

<script setup lang="ts">
import { VChip } from "vuetify/components";
defineProps<{
    label: string;
    color?: string;
}>();
</script>
