<template>
    <v-icon-btn
        :icon="icon"
        variant="text"
        :color="color"
        :size="20"
        :icon-size="20"
        :disabled="disabled"
        :title="label"
        :aria-label="label"
        @click="handleClick"
    />
</template>

<script setup lang="ts">
import { VIconBtn } from "vuetify/components";
import { IconValue } from "vuetify/lib/composables/icons.mjs";

withDefaults(
    defineProps<{
        icon: IconValue;
        label: string;
        color?: string;
        disabled?: boolean;
    }>(),
    {
        color: "primary",
        disabled: false,
    },
);

const emit = defineEmits<{
    (e: "click", event: MouseEvent): void;
}>();

const handleClick = (event: MouseEvent) => {
    emit("click", event);
};
</script>
