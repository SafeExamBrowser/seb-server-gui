<template>
    <v-btn block class="text-none" :color="color" :variant="appliedVariant">
        <slot />
    </v-btn>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
    defineProps<{
        active?: boolean;
        color?: string;
        variant?: "flat" | "tonal" | "outlined";
    }>(),
    {
        color: "primary",
        variant: undefined,
    },
);

const appliedVariant = computed(
    () => props.variant ?? (props.active ? "tonal" : "flat"),
);
</script>
