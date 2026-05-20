<template>
    <v-avatar
        class="font-weight-black"
        color="primary"
        :density="density"
        :rounded="rounded"
        :size="size"
        :variant="tonal ? 'tonal' : 'flat'"
    >
        {{ initials }}
    </v-avatar>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
    defineProps<{
        name?: string;
        surname?: string;
        size?: number | string;
        tonal?: boolean;
        rounded?: string | number | boolean;
        density?: "default" | "comfortable" | "compact";
    }>(),
    {
        name: "",
        surname: "",
        size: undefined,
        tonal: false,
        rounded: "lg",
        density: "comfortable",
    },
);

const initials = computed(() =>
    `${props.name?.[0] ?? ""}${props.surname?.[0] ?? ""}`.toUpperCase(),
);
</script>
