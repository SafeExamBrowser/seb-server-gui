<template>
    <v-chip
        class="text-white font-weight-medium cursor-pointer"
        :color="active ? 'success' : 'error'"
        size="small"
        style="min-width: 4.7rem; justify-content: center"
        :data-testid="dataTestId"
        @click.stop="emit('click')"
    >
        {{ active ? $t("general.active") : $t("general.inactive") }}
    </v-chip>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        active: boolean;
        dataTestId?: string;
    }>(),
    { dataTestId: undefined },
);

const emit = defineEmits<{
    click: [];
}>();
</script>
