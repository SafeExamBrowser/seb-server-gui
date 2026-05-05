<template>
    <v-chip
        size="small"
        :color="color ?? (active ? 'primary' : undefined)"
        :variant="active ? 'flat' : 'tonal'"
        class="cursor-pointer font-weight-medium"
        :data-testid="dataTestId"
        @click="emit('toggle')"
    >
        {{ label }}
    </v-chip>
</template>

<script setup lang="ts">
defineProps<{
    label: string;
    active: boolean;
    color?: string;
    dataTestId: string;
}>();

const emit = defineEmits<{
    toggle: [];
}>();
</script>
