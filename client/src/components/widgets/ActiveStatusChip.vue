<template>
    <div class="d-inline-block" @click.stop="handleClick">
        <v-chip
            class="text-white font-weight-medium"
            :class="{ 'cursor-pointer': !disabled }"
            :color="active ? 'success' : 'error'"
            size="small"
            style="min-width: 4.7rem; justify-content: center"
            :disabled="disabled"
            :data-testid="dataTestId"
        >
            {{ active ? $t("general.active") : $t("general.inactive") }}
        </v-chip>

        <v-tooltip
            v-if="tooltip"
            activator="parent"
            location="top left"
            :text="tooltip"
        />
    </div>
</template>

<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        active: boolean;
        disabled?: boolean;
        tooltip?: string;
        dataTestId?: string;
    }>(),
    { disabled: false, tooltip: undefined, dataTestId: undefined },
);

const emit = defineEmits<{
    click: [];
}>();

const handleClick = (): void => {
    if (props.disabled) {
        return;
    }
    emit("click");
};
</script>
